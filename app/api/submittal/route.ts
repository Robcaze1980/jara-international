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
  let data: SubmittalPayload;
  try {
    data = (await request.json()) as SubmittalPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Honeypot — silent success
  if (data._honey) {
    return NextResponse.json({ success: true });
  }

  // Required field validation
  for (const field of REQUIRED_FIELDS) {
    const value = data[field];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return NextResponse.json(
        { error: `Missing required field: ${String(field)}` },
        { status: 400 },
      );
    }
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
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

  // Await verify
  const verify = await verifyPromise;
  if (!verify.success) {
    return NextResponse.json(
      {
        error: 'Bot verification failed',
        reason: verify.reason,
        errorCodes: 'errorCodes' in verify ? verify.errorCodes : undefined,
      },
      { status: 403 },
    );
  }

  // POST to n8n
  const webhookUrl = await getCfEnv('N8N_SUBMITTAL_WEBHOOK_URL');
  if (!webhookUrl || webhookUrl.includes('PRODUCTION_ID_HERE')) {
    return NextResponse.json(
      { error: 'N8N_SUBMITTAL_WEBHOOK_URL not configured' },
      { status: 500 },
    );
  }

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

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        {
          error: 'Webhook delivery failed',
          status: res.status,
          bodyPreview: body.substring(0, 200),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      estimatedPanels,
    });
  } catch (err) {
    if (isAbortError(err)) {
      return NextResponse.json(
        { error: `Webhook timeout after ${N8N_TIMEOUT_MS}ms` },
        { status: 504 },
      );
    }
    return NextResponse.json(
      {
        error: 'Webhook delivery error',
        detail: isError(err) ? err.message : 'unknown',
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
