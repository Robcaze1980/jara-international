import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { getCfEnv } from '@/lib/cf-env';

/**
 * /api/document-request — production endpoint for Sprint 4 DocumentLibrary.
 *
 * Per ADR-037 (Round 10 4-1) + ADR-042 (5-0) + C1 + C12 + F1.R10.
 *
 * Lighter than /api/submittal: just records which document the user
 * requested plus optional email/name for fulfillment context. Same
 * Turnstile + n8n + timeout patterns as /api/submittal.
 */

const N8N_TIMEOUT_MS = 10_000; // per C12

type DocumentRequestPayload = {
  documentName: string;
  documentType: string;
  fileName: string;
  email?: string;
  fullName?: string;
  _honey?: string;
  'cf-turnstile-response'?: string;
};

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
  console.log('[DOC-REQ] ▶ POST received');

  let data: DocumentRequestPayload;
  try {
    data = (await request.json()) as DocumentRequestPayload;
  } catch {
    console.error('[DOC-REQ] ❌ Invalid JSON body');
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (data._honey) {
    console.log('[DOC-REQ] 🤖 Bot blocked (honeypot triggered)');
    return NextResponse.json({ success: true, blocked: 'honeypot' });
  }

  if (!data.documentName || !data.fileName) {
    console.error('[DOC-REQ] ❌ Missing documentName or fileName');
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.error('[DOC-REQ] ❌ Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }
  }

  // F1.R10: parallelize verify with payload prep
  const remoteIp = getRemoteIp(request);
  const token = data['cf-turnstile-response'] ?? '';
  const verifyPromise = verifyTurnstileToken(token, remoteIp);

  const {
    _honey: _honeyDrop,
    'cf-turnstile-response': _tokenDrop,
    ...rest
  } = data;
  void _honeyDrop;
  void _tokenDrop;

  const payload = {
    form_type: 'document_request',
    ...rest,
    metadata: {
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') ?? '',
      referrer: request.headers.get('referer') ?? '',
      source: 'jarainternational.com',
    },
  };

  const verify = await verifyPromise;
  if (!verify.success) {
    console.error(`[DOC-REQ] ❌ Turnstile verify failed: ${verify.reason}`);
    return NextResponse.json(
      {
        error: 'Bot verification failed',
        reason: verify.reason,
        errorCodes: 'errorCodes' in verify ? verify.errorCodes : undefined,
      },
      { status: 403 },
    );
  }
  console.log(`[DOC-REQ] ✅ Turnstile verified (hostname: ${verify.hostname})`);

  // Fail-soft webhook delivery (v0 pattern) — see /api/submittal for rationale.
  let webhookDelivered = false;
  let webhookStatus: number | null = null;
  let webhookError: string | null = null;
  let webhookBodyPreview: string | null = null;

  const webhookUrl = await getCfEnv('N8N_DOCUMENT_REQUEST_WEBHOOK_URL');
  if (!webhookUrl || webhookUrl.includes('PRODUCTION_ID_HERE')) {
    webhookError = 'N8N_DOCUMENT_REQUEST_WEBHOOK_URL not configured';
    console.error(`[DOC-REQ] ❌ ${webhookError}`);
  } else {
    console.log(`[DOC-REQ] 📤 POSTing to webhook`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'JARA-DocumentRequest-API/1.0',
      };
      const secret = await getCfEnv('N8N_WEBHOOK_SECRET');
      if (secret) headers['X-Webhook-Secret'] = secret;

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      webhookStatus = res.status;
      const body = await res.text();
      webhookBodyPreview = body.substring(0, 200);

      if (res.ok) {
        webhookDelivered = true;
        console.log(`[DOC-REQ] ✅ Webhook delivered [${webhookStatus}]: ${webhookBodyPreview}`);
      } else {
        webhookError = `HTTP ${webhookStatus}`;
        console.error(`[DOC-REQ] ❌ Webhook rejected [${webhookStatus}]: ${webhookBodyPreview}`);
      }
    } catch (err) {
      if (isAbortError(err)) {
        webhookError = `Timeout after ${N8N_TIMEOUT_MS}ms`;
        console.error(`[DOC-REQ] ⏱️ ${webhookError}`);
      } else {
        webhookError = isError(err) ? err.message : 'Unknown webhook error';
        console.error(`[DOC-REQ] ❌ Webhook error: ${webhookError}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return NextResponse.json({
    success: true,
    webhook: {
      delivered: webhookDelivered,
      status: webhookStatus,
      error: webhookError,
      bodyPreview: webhookBodyPreview,
    },
  });
}
