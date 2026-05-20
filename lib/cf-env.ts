import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Read a Cloudflare Worker env var (dashboard "Variables and Secrets" or
 * wrangler.toml [vars]) at runtime. Falls back to process.env for `next
 * dev` which uses .env.local.
 *
 * Why: OpenNext's process.env shim does NOT auto-expose Cloudflare
 * dashboard "Variables and Secrets" entries in the production worker.
 * Confirmed empirically in deploys 9f5a6ec / b3d5683 — the server-rendered
 * HTML serialized turnstileSiteKey="" until we either moved the var to
 * wrangler.toml [vars] (commit d19550f, fine for public values) or read
 * via getCloudflareContext (correct for SECRETS that must NOT be
 * committed, like TURNSTILE_SECRET_KEY / N8N webhook URLs / N8N secret).
 */
export async function getCfEnv(name: string): Promise<string | undefined> {
  try {
    const cf = await getCloudflareContext({ async: true });
    const value = (cf.env as Record<string, unknown>)[name];
    if (typeof value === 'string' && value) return value;
  } catch {
    // Not in Cloudflare worker context (e.g., `next dev`). Fall through.
  }
  const fallback = process.env[name];
  return typeof fallback === 'string' && fallback ? fallback : undefined;
}
