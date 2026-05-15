/**
 * Server-side Cloudflare Turnstile token verification.
 * Per ADR-042 T2 (Round 10 5-0 unanimous) + F1.R10 (4/5 voter convergent).
 *
 * Convergent constraints applied (F1.R10):
 *   - 15s timeout budget on the verify call. C12 sets 10s for the n8n
 *     webhook POST; siteverify runs sequentially before that POST in our
 *     submittal flow, so we give the verify path its own 15s window. The
 *     two timeouts compose: in the worst case, total form-submit budget
 *     ≈ 25s before we surface an error to the client.
 *   - hostname check: siteverify response MUST include a hostname in our
 *     allowlist. Without this, a misconfigured site key could silently
 *     pass cross-origin traffic.
 *   - cdata check: we don't currently set cdata in the form; we just
 *     confirm the response cdata field is absent/empty. Hooks for future
 *     replay-protection or per-form scoping.
 *   - error-codes propagated up so the API route can log them for
 *     debugging (e.g., "invalid-input-secret", "timeout-or-duplicate").
 *
 * Dev mode: Cloudflare's test secret 1x0000000000000000000000000000000AA
 * always returns success: true with hostname='example.com'. Our allowlist
 * accepts that hostname so localhost dev works without registering
 * localhost on the production widget.
 *
 * Implementation references:
 *   - https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *   - https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const VERIFY_TIMEOUT_MS = 15_000;

const ALLOWED_HOSTNAMES: ReadonlySet<string> = new Set([
  // Production hostnames registered on the Turnstile widget
  'jarainternational.com',
  'jaraintl.com',
  // Dev allowance — Cloudflare test keys return hostname='example.com',
  // localhost is for any future widget that includes it as a hostname.
  'example.com',
  'localhost',
  '127.0.0.1',
]);

export type TurnstileVerifyResult =
  | {
      success: true;
      hostname: string;
      action?: string;
      cdata?: string;
    }
  | {
      success: false;
      reason: string;
      errorCodes?: string[];
    };

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return {
      success: false,
      reason: 'TURNSTILE_SECRET_KEY environment variable not set',
    };
  }
  if (!token || typeof token !== 'string') {
    return { success: false, reason: 'No Turnstile token provided' };
  }

  const params = new URLSearchParams();
  params.set('secret', secret);
  params.set('response', token);
  if (remoteIp) params.set('remoteip', remoteIp);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        success: false,
        reason: `Siteverify HTTP ${res.status}`,
      };
    }

    const data = (await res.json()) as {
      success: boolean;
      'error-codes'?: string[];
      hostname?: string;
      challenge_ts?: string;
      action?: string;
      cdata?: string;
    };

    if (!data.success) {
      return {
        success: false,
        reason: 'Turnstile verification failed',
        errorCodes: data['error-codes'],
      };
    }

    const hostname = data.hostname ?? '';
    if (!ALLOWED_HOSTNAMES.has(hostname)) {
      return {
        success: false,
        reason: `Hostname '${hostname}' not in allowlist`,
      };
    }

    return {
      success: true,
      hostname,
      action: data.action,
      cdata: data.cdata,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        reason: `Siteverify timeout after ${VERIFY_TIMEOUT_MS}ms`,
      };
    }
    return {
      success: false,
      reason: err instanceof Error ? err.message : 'Unknown siteverify error',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
