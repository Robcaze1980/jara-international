import { NextResponse } from 'next/server';

/**
 * /api/document-request — JARA document library handler.
 *
 * Wiring matches v0 plycemca.com (proven in production): hardcoded n8n
 * webhook URL, honeypot-only bot protection, fail-soft webhook delivery.
 */

const WEBHOOK_URL = 'https://8n8-n8n.80r4dr.easypanel.host/webhook/jara-document-request';
const WEBHOOK_TIMEOUT_MS = 10_000;

function isError(err: unknown): err is Error {
  return err instanceof Error;
}

function isAbortError(err: unknown): err is DOMException {
  return isError(err) && err.name === 'AbortError';
}

export async function POST(request: Request): Promise<Response> {
  console.log('[DOC-REQ] ▶ POST received');

  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
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
    if (!emailRegex.test(String(data.email))) {
      console.error('[DOC-REQ] ❌ Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }
  }

  const { _honey: _honeyDrop, ...rest } = data;
  void _honeyDrop;

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

  let webhookDelivered = false;
  let webhookStatus: number | null = null;
  let webhookError: string | null = null;
  let webhookBodyPreview: string | null = null;

  console.log(`[DOC-REQ] 📤 POSTing to webhook`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JARA-DocumentRequest-API/1.0',
      },
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
      webhookError = `Timeout after ${WEBHOOK_TIMEOUT_MS}ms`;
      console.error(`[DOC-REQ] ⏱️ ${webhookError}`);
    } else {
      webhookError = isError(err) ? err.message : 'Unknown webhook error';
      console.error(`[DOC-REQ] ❌ Webhook error: ${webhookError}`);
    }
  } finally {
    clearTimeout(timeoutId);
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
