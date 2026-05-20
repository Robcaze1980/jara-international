import { NextResponse } from 'next/server';
import { getCfEnv } from '@/lib/cf-env';

/**
 * /api/debug-env — temporary diagnostic for Round 14 closure.
 *
 * Returns boolean presence (NEVER the values) of the env vars the
 * submittal flow depends on. Used to verify that lib/cf-env.ts is
 * surfacing dashboard "Variables and Secrets" entries at runtime on
 * the Cloudflare Worker.
 *
 * Gated by ?t=<token> query param. Token is intentionally hardcoded
 * — this route is meant to be deleted after Round 14 closure. Search
 * for "round14_diag" to find and remove this file + the call site
 * in synthesis.
 *
 * Per Round 14 §A2: highest-priority diagnostic before any further
 * cleanup actions. Three voters (DeepSeek, Gemini, GLM) converged on
 * Cloudflare dashboard environment scoping as the most likely root
 * cause of the empty-env failure in deploy b3d5683.
 *
 * Usage: GET /api/debug-env?t=round14_diag
 */

const GATE_TOKEN = 'round14_diag';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get('t');
  if (token !== GATE_TOKEN) {
    // 404 — don't reveal route exists to drive-by scanners
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const names = [
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    'TURNSTILE_SECRET_KEY',
    'N8N_SUBMITTAL_WEBHOOK_URL',
    'N8N_DOCUMENT_REQUEST_WEBHOOK_URL',
    'N8N_WEBHOOK_SECRET',
  ] as const;

  const checks = await Promise.all(names.map((n) => getCfEnv(n)));

  const result: Record<string, { set: boolean }> = {};
  names.forEach((name, i) => {
    result[name] = { set: Boolean(checks[i]) };
  });

  return NextResponse.json({
    note: 'Round 14 diagnostic. Boolean presence only — values are never returned.',
    env: result,
  });
}
