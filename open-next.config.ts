import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext Cloudflare configuration.
 * https://opennext.js.org/cloudflare/get-started
 *
 * Minimal config for Phase 4 Sprint 1: no R2 incremental cache, no D1
 * tag cache, no Durable Object queue. Sufficient for a mostly-static site
 * with one edge API route (/api/llm-context). Add overrides later if/when
 * we add features that need them (e.g., ISR via R2, on-demand revalidation
 * via D1, background jobs via DO).
 */
export default defineCloudflareConfig({});
