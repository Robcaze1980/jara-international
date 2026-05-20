import { NextResponse } from 'next/server';

/**
 * /api/submittal — JARA project submittal handler.
 *
 * Wiring matches v0 plycemca.com (proven in production): hardcoded n8n
 * webhook URL, honeypot-only bot protection, fail-soft webhook delivery
 * (user always sees success card, webhook status returned in response
 * for operator debugging via DevTools Network tab).
 */

const WEBHOOK_URL = 'https://8n8-n8n.80r4dr.easypanel.host/webhook/jara-submittal';
const WEBHOOK_TIMEOUT_MS = 10_000;

const REQUIRED_FIELDS = [
  'projectName',
  'projectLocation',
  'buildingType',
  'constructionType',
  'estimatedArea',
  'panelThickness',
  'edgeProfile',
  'fireRating',
  'framingType',
  'fullName',
  'company',
  'role',
  'email',
  'documentsRequested',
] as const;

function isError(err: unknown): err is Error {
  return err instanceof Error;
}

function isAbortError(err: unknown): err is DOMException {
  return isError(err) && err.name === 'AbortError';
}

export async function POST(request: Request): Promise<Response> {
  console.log('[SUBMITTAL] ▶ POST received');

  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
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
      console.error(`[SUBMITTAL] ❌ Missing required field: ${field}`);
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 },
      );
    }
  }

  // Email format
  const email = String(data.email ?? '');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('[SUBMITTAL] ❌ Invalid email format');
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 },
    );
  }

  // Compute panel estimate
  const area = parseFloat(String(data.estimatedArea ?? ''));
  const estimatedPanels =
    Number.isFinite(area) && area > 0 ? Math.ceil(area / 32) : null;

  // Strip honeypot from forwarded payload
  const { _honey: _honeyDrop, ...formData } = data;
  void _honeyDrop;

  const webhookPayload = {
    ...formData,
    estimatedPanels,
    submittedAt: new Date().toISOString(),
    source: 'jarainternational.com',
  };

  // Fail-soft webhook delivery — user always sees success card, webhook
  // status surfaced in response for operator debugging.
  let webhookDelivered = false;
  let webhookStatus: number | null = null;
  let webhookError: string | null = null;
  let webhookBodyPreview: string | null = null;

  console.log(`[SUBMITTAL] 📤 POSTing to webhook (${JSON.stringify(webhookPayload).length} bytes)`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JARA-Submittal-API/1.0',
      },
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
      webhookError = `Timeout after ${WEBHOOK_TIMEOUT_MS}ms`;
      console.error(`[SUBMITTAL] ⏱️ ${webhookError}`);
    } else {
      webhookError = isError(err) ? err.message : 'Unknown webhook error';
      console.error(`[SUBMITTAL] ❌ Webhook error: ${webhookError}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }

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
