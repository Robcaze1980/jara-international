# Round 14 — Synthesis

**Round date:** 2026-05-20
**Scope:** Targeted audit of the Cloudflare Workers env var fix shipped in commit `e6d2068`.
**Voters:** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1.
**Quorum:** ≥3/4 simple majority per question.

---

## TL;DR

**Overall verdict on `e6d2068`: SHIP (3/4 strong majority)**

| Voter    | Overall  | Confidence |
|----------|----------|------------|
| Codex    | SHIP     | 0.64       |
| DeepSeek | SHIP     | 0.75       |
| Gemini   | SHIP     | 0.95       |
| GLM      | REVISE¹  | 0.74       |

¹ GLM's REVISE is **soft**: every per-question verdict aligns with the SHIP voters; the REVISE label reflects a desire to add diagnostic verification *after* shipping, not to block the ship. No voter argues the code is incorrect.

---

## Per-question tally

| Q | Topic | 4/4 verdict | Margin |
|---|-------|-------------|--------|
| Q1 | Is `getCloudflareContext({async:true})` the right OpenNext API? | **CORRECT** | 4/4 unanimous |
| Q2 | Will the helper surface dashboard Plaintext + Secret entries? | **CORRECT** (3) / INSUFFICIENT_EVIDENCE (1) | 3/4 strong majority |
| Q3 | Root cause of b3d5683 empty-env failure? | **`c` — wrong environment scope in dashboard** (3) / `a` deploy race (1) | 3/4 strong majority |
| Q4 | Alternative approaches considered? | **`v` — shipped helper is right choice** | 4/4 unanimous |
| Q5 | Works in `next dev` via `process.env` fallback? | **CORRECT** | 4/4 unanimous |
| Q6 | Side effects from awaiting `getCfEnv` in async paths? | **CORRECT** (no concerns) | 4/4 unanimous |
| Q7 | Delete redundant dashboard `NEXT_PUBLIC_TURNSTILE_SITE_KEY`? | **DELETE** (3) / DEFER (1) | 3/4 strong majority |
| Q8 | Delete orphan dashboard `TURNSTILE_SECRET` + `RESEND_API_KEY`? | **DELETE** | 4/4 unanimous |

DeepSeek's INSUFFICIENT_EVIDENCE on Q2 is consistent with GLM's call for empirical verification — both want a production sanity check before final closure, but neither claims the helper is wrong.

---

## Convergent action items

### A1 — SHIP `e6d2068` as-is (≥3/4)

No code changes required to the helper or any of its 5 callers. Stand pat.

### A2 — Verify Cloudflare dashboard env-var environment scope (3/4 root cause)

Three voters (DeepSeek, Gemini, GLM) converged on Q3 = **(c) wrong environment scope in dashboard** as the most likely explanation for why `getCloudflareContext().env` saw empty values in deploy `b3d5683`. The Cloudflare dashboard allows scoping vars per environment (Production / Preview / etc.), and if the founder added the vars under the wrong environment, the production worker never sees them.

**Action:** In Cloudflare Dashboard → Workers → `jara-international` → Settings → Variables and Secrets, check the environment dropdown above each entry. Every var listed in `wrangler.toml [vars]` is auto-scoped to all environments; **dashboard-set** vars must explicitly be scoped to **Production** for them to be visible to the live worker.

This is the **single highest-priority diagnostic** if A1 ships and n8n still doesn't fire.

### A3 — Delete orphan dashboard secrets (4/4 unanimous on Q8)

Both `TURNSTILE_SECRET` and `RESEND_API_KEY` are confirmed unreferenced in the codebase (verified by grep of `process.env.*` patterns in §2 of the round prompt). Delete from dashboard. Pre-flight: re-grep for the literal names just before deletion as a final safety check.

### A4 — Delete redundant dashboard `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (3/4, but defer)

GLM's DEFER position is reasonable: keep both copies until production verification confirms `wrangler.toml [vars]` resolves on its own, then collapse to a single source of truth. After the user confirms end-to-end form submission works, delete the dashboard entry and add a comment in `wrangler.toml` noting it is the canonical source for this var.

### A5 — Single-voter (GLM) recommendation: tighten `catch {}` in `getCfEnv` (1/4, document only)

GLM flagged that `catch {}` swallows all errors indiscriminately, masking real failures (e.g., AsyncLocalStorage misconfiguration). Below quorum (1/4) so **not blocking**, but worth a TODO:

```ts
// Possible future tightening:
} catch (err) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[cf-env] getCloudflareContext failed for ${name}:`, err);
  }
  // fall through to process.env
}
```

Archive as a future cleanup item; do not block ship.

### A6 — Single-voter (GLM) recommendation: add `initOpenNextCloudflareForDev()` (1/4, optional)

GLM mentioned this would give dev/prod parity for `getCloudflareContext` access in `next dev`. Below quorum and explicitly marked non-blocking by GLM itself. Skip unless local dev surface starts misbehaving.

---

## Q9 — Diagnostic priority if e6d2068 ships and n8n still doesn't fire

Union of voter priority lists, deduplicated and ranked by vote weight:

1. **Dashboard secrets scoped to wrong Cloudflare environment** (GLM, DeepSeek, Gemini converged) — same root cause as §3 of the prompt. Verify TURNSTILE_SECRET_KEY and N8N_SUBMITTAL_WEBHOOK_URL are set on the **Production** environment, not Preview. Diagnostic: temporary `/api/debug-env` route returning `{turnstileSecretSet: !!(await getCfEnv('TURNSTILE_SECRET_KEY')), n8nUrlSet: !!(await getCfEnv('N8N_SUBMITTAL_WEBHOOK_URL'))}` — never log the value, only the presence.
2. **Turnstile siteverify hostname rejection** (Codex, GLM) — `lib/turnstile.ts:33-42` allowlist must include the production hostname. Currently includes `jarainternational.com`, `jaraintl.com`, `example.com`, `localhost`. Diagnostic: check API route response body for `"errorCodes"` array — `["invalid-input-secret"]` = secret missing; `["timeout-or-duplicate"]` = token reused; hostname mismatch returns a reason string.
3. **n8n webhook URL unreachable from Cloudflare Workers egress** (GLM, Codex) — Cloudflare may block the n8n endpoint or DNS may fail. Diagnostic: from the API route, log `await res.status` and `await res.text()` on non-OK responses. The route already does this; check Cloudflare Workers logs in dashboard.
4. **n8n workflow inactive on the n8n side** (Codex, Gemini) — the route returns 200 success but n8n silently ignores the request because the workflow isn't activated. Diagnostic: check n8n executions list for any inbound POST to `/webhook/jara-submittal` at all; if none, the workflow isn't active.
5. **AbortController timing out under load** (Codex single voter) — 10s timeout on n8n POST is tight if n8n cold-starts. Diagnostic: check route response for `504` + `"Webhook timeout after 10000ms"`.

---

## Q10 — Additional findings (single-voter, non-blocking)

- **GLM:** `catch {}` swallows all errors (see A5).
- **GLM:** Next.js 15 + AsyncLocalStorage edge cases in some canary builds — verify exact patch version; non-actionable without specific failure observed.
- **Codex:** Consider adding `vitest` unit test for `getCfEnv` fallback behavior — useful but out of scope for this fix.
- **Codex:** Document the wrangler.toml + dashboard precedence rule (dashboard wins) in a comment near `[vars]` to prevent future drift.

---

## Cost

Round 14: ~$0.018 (estimated from cached cost fields in voter responses).
Versus R13 ~$0.05 — narrower scope, shorter prompt as expected.

---

## Closure checklist

- [x] Ship `e6d2068` — already on `main`.
- [ ] **User to verify** Cloudflare dashboard env scope is **Production** (A2) — highest priority.
- [ ] User to run end-to-end form submission test.
- [ ] If n8n still silent after A2, walk Q9 priority list in order.
- [ ] Once verified: delete orphan `TURNSTILE_SECRET` + `RESEND_API_KEY` (A3).
- [ ] Once verified: delete redundant `NEXT_PUBLIC_TURNSTILE_SITE_KEY` dashboard entry (A4).
- [ ] Update CLAUDE.md "Currently-open items" with the env-var-via-`lib/cf-env.ts` pattern (canonical going forward).
