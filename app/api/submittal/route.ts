import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { getCfEnv } from '@/lib/cf-env';

/**
 * /api/submittal — production endpoint for Sprint 4 SubmittalForm.
 *
 * Per ADR-035 (Round 10 4-1) + ADR-042 (5-0) + C1 + C12 + F1.R10:
 *
 * Flow:
 *   1. Parse JSON body (form payload)
 *   2. Honeypot check (silent success — bots don't deserve detailed errors)
 *   3. Required-field validation + email format check
 *   4. Per F1.R10: kick off Turnstile siteverify in parallel with payload
 *      construction (CPU work that doesn't need the verify result)
 *   5. Await verify; reject 403 on failure
 *   6. POST sanitized payload to n8n production webhook (env-configured)
 *      with C12's 10s AbortController timeout
 *   7. Return success + computed panel estimate (or appropriate error)
 *
 * Sanitization: honeypot field and Turnstile token are stripped before
 * forwarding to n8n so the n8n workflow never sees them. We attach
 * `submittedAt`, `source`, and `estimatedPanels` on top of the form data.
 */

const N8N_TIMEOUT_MS = 10_000; // per C12

type SubmittalPayload = {
  // Step 1 — Project info
  projectName: string;
  projectLocation: string;
  buildingType: string;
  constructionType: string;
  numberOfStories?: string;
  estimatedArea: string;
  // Step 2 — Product requirements
  applicationType: string;
  panelThickness: string[];
  edgeProfile: string;
  fireRating: string;
  ulDesignNumber?: string;
  framingType: string;
  framingSpacing?: string;
  estimatedQuantity?: string;
  // Step 3 — Contact + Timeline + Documents
  fullName: string;
  company: string;
  role: string;
  email: string;
  phone?: string;
  neededByDate?: string;
  documentsRequested: string[];
  additionalNotes?: string;
  // Hidden + automation
  _honey?: string;
  'cf-turnstile-response'?: string;
};

const REQUIRED_FIELDS: Array<keyof SubmittalPayload> = [
  'projectName',
  'projectLocation',
  'buildingType',
  'constructionType',
  'estimatedArea',
  'applicationType',
  'panelThickness',
  'edgeProfile',
  'fireRating',
  'framingType',
  'fullName',
  'company',
  'role',
  'email',
  'documentsRequested',
];

function isError(err: unknown): err is Error {
  return err instanceof Error;
}

function isAbortError(err: unknown): err is DOMException {
  return isError(err) && err.name === 'AbortError';
}

function getRemoteIp(request: Request): string | undefined {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim();
  return undefined;
}

export async function POST(request: Request): Promise<Response> {
  console.log('[SUBMITTAL] ▶ POST received');

  let data: SubmittalPayload;
  try {
    data = (await request.json()) as SubmittalPayload;
  } catch {
    console.error('[SUBMITTAL] ❌ Invalid JSON body');
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Honeypot — silent success (do NOT call webhook for bots)
  if (data._honey) {
    console.log('[SUBMITTAL] 🤖 Bot blocked (honeypot triggered)');
    return NextResponse.json({ success: true, blocked: 'honeypot' });
  }

  // Required field validation
  for (const field of REQUIRED_FIELDS) {
    const value = data[field];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      console.error(`[SUBMITTAL] ❌ Missing required field: ${String(field)}`);
      return NextResponse.json(
        { error: `Missing required field: ${String(field)}` },
        { status: 400 },
      );
    }
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.error('[SUBMITTAL] ❌ Invalid email format');
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 },
    );
  }

  // F1.R10: parallelize Turnstile verify with payload construction
  const remoteIp = getRemoteIp(request);
  const token = data['cf-turnstile-response'] ?? '';
  const verifyPromise = verifyTurnstileToken(token, remoteIp);

  // Payload prep (pure CPU; no waiting)
  const area = parseFloat(data.estimatedArea);
  const estimatedPanels =
    Number.isFinite(area) && area > 0 ? Math.ceil(area / 32) : null;

  // Strip honeypot + Turnstile token from the forwarded payload
  const {
    _honey: _honeyDrop,
    'cf-turnstile-response': _tokenDrop,
    ...formData
  } = data;
  void _honeyDrop;
  void _tokenDrop;

  const webhookPayload = {
    ...formData,
    estimatedPanels,
    submittedAt: new Date().toISOString(),
    source: 'jarainternational.com',
  };

  // Await Turnstile verify — strict gate, blocks on fail
  const verify = await verifyPromise;
  if (!verify.success) {
    console.error(`[SUBMITTAL] ❌ Turnstile verify failed: ${verify.reason}`);
    return NextResponse.json(
      {
        error: 'Bot verification failed',
        reason: verify.reason,
        errorCodes: 'errorCodes' in verify ? verify.errorCodes : undefined,
      },
      { status: 403 },
    );
  }
  console.log(`[SUBMITTAL] ✅ Turnstile verified (hostname: ${verify.hostname})`);

  // Fail-soft webhook delivery (v0 pattern — user always sees success card,
  // webhook delivery details returned in response for debugging).
  // If n8n is misconfigured, the form submission still confirms to the user
  // and the operator can debug n8n side via Cloudflare Worker logs + the
  // response.webhook object visible in browser DevTools Network tab.
  let webhookDelivered = false;
  let webhookStatus: number | null = null;
  let webhookError: string | null = null;
  let webhookBodyPreview: string | null = null;

  const webhookUrl = await getCfEnv('N8N_SUBMITTAL_WEBHOOK_URL');
  if (!webhookUrl || webhookUrl.includes('PRODUCTION_ID_HERE')) {
    webhookError = 'N8N_SUBMITTAL_WEBHOOK_URL not configured';
    console.error(`[SUBMITTAL] ❌ ${webhookError}`);
  } else {
    console.log(`[SUBMITTAL] 📤 POSTing to webhook (${webhookUrl.length} char URL, ${JSON.stringify(webhookPayload).length} byte payload)`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'JARA-Submittal-API/1.0',
      };
      const secret = await getCfEnv('N8N_WEBHOOK_SECRET');
      if (secret) headers['X-Webhook-Secret'] = secret;

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(webhookPayload),
        signal: controller.signal,
      });

      webhookStatus = res.status;
      const body = await res.text();
      webhookBodyPreview = body.substring(0, 200);

      if (res.ok) {
        webhookDelivered = true;
        console.log(`[SUBMITTAL] ✅ Webhook delivered [${webhookStatus}]: ${webhookBodyPreview}`);
      } else {
        webhookError = `HTTP ${webhookStatus}`;
        console.error(`[SUBMITTAL] ❌ Webhook rejected [${webhookStatus}]: ${webhookBodyPreview}`);
      }
    } catch (err) {
      if (isAbortError(err)) {
        webhookError = `Timeout after ${N8N_TIMEOUT_MS}ms`;
        console.error(`[SUBMITTAL] ⏱️ ${webhookError}`);
      } else {
        webhookError = isError(err) ? err.message : 'Unknown webhook error';
        console.error(`[SUBMITTAL] ❌ Webhook error: ${webhookError}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Always return success to client (v0 fail-soft pattern). Webhook delivery
  // status is surfaced in the response so the operator can inspect it in
  // browser DevTools Network tab without affecting user experience.
  return NextResponse.json({
    success: true,
    estimatedPanels,
    webhook: {
      delivered: webhookDelivered,
      status: webhookStatus,
      error: webhookError,
      bodyPreview: webhookBodyPreview,
    },
  });
}
