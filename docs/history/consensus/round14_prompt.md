# Round 14 — Cloudflare Workers Env Var Access in OpenNext (Targeted Technical Audit)

**Type:** Targeted code review of a shipped fix. Each voter audits the linked
code + evidence trail independently and reports findings. Consensus = ≥3/4
voters concur on a verdict per question in §6.

**Voters (4):** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1.
**Claude is NOT a voter** (per CLAUDE.md governance — cost + conflict-of-interest).
**Quorum:** ≥3/4 simple majority per finding. Synthesis will report vote margin.
**Round date:** 2026-05-20.

---

## 0. WHY THIS ROUND EXISTS

The /resources submittal form on https://jarainternational.com shipped a
Cloudflare Turnstile widget + n8n webhook integration. After production deploy,
the client widget rendered green (`¡Operación exitosa!`) but the n8n workflow
**never received any webhook calls**. Investigation revealed that server-side
`process.env.*` lookups for Cloudflare-dashboard-configured env vars were
returning empty.

A fix has been shipped across 4 commits. This round audits **whether that fix
is correct and complete**, OR whether a better approach should replace it
before further surfaces are built on top of it.

This is NOT a re-audit of GEO/SEO/positioning (R12/R13 scope). Stay scoped to
the env-var access mechanism and its correctness.

---

## 1. CONTEXT — runtime stack

- Next.js 15 App Router on Cloudflare Workers via `@opennextjs/cloudflare` v1.19.8.
- Built output: `next build` → `opennextjs-cloudflare build` → Worker at `.open-next/worker.js`, assets at `.open-next/assets/`.
- `wrangler.toml` declares `compatibility_flags = ["nodejs_compat"]`.
- Auto-deploy from GitHub `main` branch via Cloudflare's GitHub integration.
- Environment variables are configured in two places:
  - `wrangler.toml` `[vars]` block (committed, public)
  - Cloudflare Dashboard → Workers → project → Settings → "Variables and Secrets" panel (runtime-only, can hold secrets)

---

## 2. THE BUG TRAIL

### 2.1 Deploy 8d8676a (before this fix series)

`components/SubmittalForm.tsx` and `components/DocumentLibrary.tsx` were
**client components** (`'use client'`) reading
`process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` directly. Server-side API routes
read `process.env.TURNSTILE_SECRET_KEY` / `process.env.N8N_SUBMITTAL_WEBHOOK_URL`.

Local dev (`next dev`) worked — `.env.local` populates `process.env`.

Production failed: client component showed
`"Turnstile site key not configured. Contact site administrator."`

### 2.2 Deploy 9f5a6ec — first attempt

Hypothesis: `NEXT_PUBLIC_*` requires build-time inlining. The Cloudflare
"Variables and Secrets" panel is runtime-only (its UI text reads "for your
Worker used at runtime"), so the build never saw the var, and the client
bundle ended up with literal `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`
unrewritten.

Verified by inspecting the deployed JS chunk:

```js
let e = t.default.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
return e ? (...) : void H("Turnstile site key not configured...")
```

Fix: thread the site key from a server component as a prop to the client
component. The server component reads `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`
at request time.

**Result:** still broken. Server-rendered HTML serialized
`turnstileSiteKey":""`. So the server-side `process.env` also doesn't see the
dashboard var.

### 2.3 Deploy b3d5683 — second attempt

Switched the server-side read to
`getCloudflareContext({async:true}).env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`
with `process.env` as fallback for `next dev`.

**Result:** still broken. Server-rendered HTML still showed empty
`turnstileSiteKey":""`.

### 2.4 Deploy d19550f — workaround that worked

Moved the public site key into `wrangler.toml`:

```toml
[vars]
NEXT_PUBLIC_TURNSTILE_SITE_KEY = "0x4AAAAAADOAZm2iZ8nLhEFq"
```

**Result:** server HTML now serializes the literal key, client widget
renders, user-verified screenshot shows `¡Operación exitosa!`.

### 2.5 Deploy e6d2068 — the fix under audit

The user then reported n8n still never receives the webhook even though
the client widget is green. Root cause: same env access problem affects
secrets that **cannot** go in `wrangler.toml`:

- `TURNSTILE_SECRET_KEY` — read by `lib/turnstile.ts` in `verifyTurnstileToken()`
- `N8N_SUBMITTAL_WEBHOOK_URL` — read by `app/api/submittal/route.ts`
- `N8N_DOCUMENT_REQUEST_WEBHOOK_URL` — read by `app/api/document-request/route.ts`
- `N8N_WEBHOOK_SECRET` — both routes

These all live in the dashboard "Variables and Secrets" panel.

Deploy e6d2068 adds a helper `lib/cf-env.ts` and routes ALL five server-side
env reads through it:

```ts
// lib/cf-env.ts
import { getCloudflareContext } from '@opennextjs/cloudflare';

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
```

Callers updated:
- `lib/turnstile.ts:61` — `const secret = await getCfEnv('TURNSTILE_SECRET_KEY');`
- `app/api/submittal/route.ts` — webhook URL + n8n secret
- `app/api/document-request/route.ts` — webhook URL + n8n secret
- `app/resources/page.tsx` — site key (kept even though wrangler.toml has it; helper picks it up either way)

End-to-end production verification is **not yet confirmed** at the time
this prompt is written — deploy e6d2068 is propagating; the user will test
form submission after this round produces a verdict.

---

## 3. EVIDENCE: contradictory observations to reconcile

In the b3d5683 attempt, `getCloudflareContext({async:true}).env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`
returned empty. We did NOT confirm whether this was:

(a) `getCloudflareContext` itself returning a stub env in some code path, or
(b) the value genuinely not being on the binding (e.g., `NEXT_PUBLIC_` prefix filtered out), or
(c) a deploy-not-yet-live race (HTML was checked ~5 min after push, normally enough but not guaranteed), or
(d) the dashboard plaintext entry being scoped to a different worker / different environment

The d19550f wrangler.toml workaround does work; the e6d2068 helper for
the OTHER vars (which cannot be moved to wrangler.toml) is therefore an
**unverified hypothesis**: it may still fail with the same empty-env
behavior that b3d5683 hit.

**This is what the round must adjudicate.**

---

## 4. SHIPPED CODE (locked unless ≥3/4 votes to change)

### 4.1 `lib/cf-env.ts` (new file)

See §2.5 above.

### 4.2 `lib/turnstile.ts` (diff)

```diff
-  const secret = process.env.TURNSTILE_SECRET_KEY;
+  const secret = await getCfEnv('TURNSTILE_SECRET_KEY');
```

(import added at top of file)

### 4.3 `app/api/submittal/route.ts` (diff)

```diff
-  const webhookUrl = process.env.N8N_SUBMITTAL_WEBHOOK_URL;
+  const webhookUrl = await getCfEnv('N8N_SUBMITTAL_WEBHOOK_URL');
...
-    const secret = process.env.N8N_WEBHOOK_SECRET;
+    const secret = await getCfEnv('N8N_WEBHOOK_SECRET');
```

### 4.4 `app/api/document-request/route.ts` (same pattern as 4.3)

### 4.5 `app/resources/page.tsx` (server component)

```ts
const turnstileSiteKey = (await getCfEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY')) ?? '';
```

(passed as prop into `<SubmittalForm>` and `<DocumentLibrary>`)

### 4.6 `wrangler.toml`

```toml
[vars]
NEXT_PUBLIC_TURNSTILE_SITE_KEY = "0x4AAAAAADOAZm2iZ8nLhEFq"
```

### 4.7 Cloudflare dashboard "Variables and Secrets" (production env)

| Type | Name |
|------|------|
| Plaintext | NEXT_PUBLIC_TURNSTILE_SITE_KEY (now redundant with wrangler.toml) |
| Plaintext | N8N_SUBMITTAL_WEBHOOK_URL |
| Plaintext | N8N_DOCUMENT_REQUEST_WEBHOOK_URL |
| Secret | TURNSTILE_SECRET_KEY |
| Secret | TURNSTILE_SECRET (orphan — no code reads this name) |
| Secret | RESEND_API_KEY (orphan — no code reads this name) |

---

## 5. CONSTRAINTS — DO NOT vote against these

- `TURNSTILE_SECRET_KEY` and `N8N_WEBHOOK_SECRET` MUST NOT be committed to git. They are secrets. Putting them in `wrangler.toml [vars]` is forbidden.
- Local dev must keep working: `next dev` reads `.env.local`. Any fix that requires Cloudflare CLI / wrangler tunnels for local dev is out of scope.
- Do not propose deleting the Turnstile integration or the n8n webhook integration. They are required surfaces.

---

## 6. QUESTIONS TO ADJUDICATE (vote on each)

For each question return one of: `CORRECT`, `INCORRECT`, `INSUFFICIENT_EVIDENCE`, plus a 2–4 sentence rationale citing the specific file/line/observation, plus a `recommended_action` field.

### Q1 — Is `getCloudflareContext({async:true}).env` the correct OpenNext-supported way to read Cloudflare dashboard "Variables and Secrets" entries at runtime in an OpenNext production worker?

Consult `@opennextjs/cloudflare` v1.19.8 documentation / source. The relevant `.d.ts` excerpt is included below for reference:

```ts
export type CloudflareContext<...> = {
  env: CloudflareEnv;  // the worker's bindings
  cf: CfProperties | undefined;
  ctx: Context;
};
export declare function getCloudflareContext<...>(options: { async: true }):
  Promise<CloudflareContext<...>>;
```

### Q2 — Will the `lib/cf-env.ts` helper in §2.5 actually surface dashboard Plaintext + Secret entries (e.g., `TURNSTILE_SECRET_KEY`, `N8N_SUBMITTAL_WEBHOOK_URL`) on the Worker at runtime?

Specifically address: does `getCloudflareContext({async:true}).env.X` see dashboard-set vars, or only `wrangler.toml [vars]` entries? If only the latter, the e6d2068 fix is INCORRECT and the secrets will still be empty.

### Q3 — Reconcile the contradictory observation in §3

In deploy b3d5683, `getCloudflareContext({async:true}).env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` returned empty when the var was dashboard-only. What is the most likely root cause? Pick one of: (a) deploy-not-yet-live race, (b) `NEXT_PUBLIC_` prefix filtering, (c) wrong environment scope in dashboard, (d) `getCloudflareContext` doesn't expose dashboard vars at all, (e) something else. Justify with evidence.

### Q4 — Is there a simpler / more correct approach than `lib/cf-env.ts`?

Candidates to evaluate:
- (i) Use OpenNext's `process.env` directly and just configure Cloudflare to populate it via some setting we missed.
- (ii) Read `getCloudflareContext().env` directly at each call site (no helper).
- (iii) Move all non-secret vars to `wrangler.toml [vars]` and put secrets via `wrangler secret put` (CLI, not dashboard).
- (iv) Use Next.js `unstable_noStore()` or `headers()` to opt into per-request reading that may have different env scope.
- (v) The shipped helper is the right choice.

### Q5 — Will the helper work in local `next dev` mode?

Specifically: does `getCloudflareContext({async:true})` throw / reject in `next dev`? If it does, the `try/catch` falls through to `process.env[name]` — confirm that's the right behavior, OR flag that `initOpenNextCloudflareForDev()` should be added to `next.config.mjs` for dev parity.

### Q6 — Are there any side effects of making `verifyTurnstileToken` consumers await `getCfEnv`?

`lib/turnstile.ts:61` was already inside an `async` function, so adding `await` is structurally fine. But: any concerns about cold-start latency, request-context propagation, or interaction with `AbortController` timeouts (the function has a 15s budget)?

### Q7 — Cleanup: should the dashboard `NEXT_PUBLIC_TURNSTILE_SITE_KEY` plaintext entry be deleted now that wrangler.toml has it?

Risk of leaving it: confusion, drift if values diverge. Risk of deleting it: if wrangler.toml deploy is skipped for any reason and the var falls back to dashboard, removing the dashboard copy could break things.

### Q8 — Are the orphan dashboard secrets `TURNSTILE_SECRET` (without `_KEY`) and `RESEND_API_KEY` safe to delete?

Verify: no code reads them. Confirm or refute.

### Q9 — End-to-end risk assessment

If the e6d2068 fix is correct (Q2 = CORRECT), the user submits the form and the n8n workflow STILL doesn't fire, what are the next most likely root causes to investigate? List in priority order with diagnostic hint per item.

### Q10 — Anything we missed

Open-ended. Any other failure modes, security concerns, or simplifications worth flagging on the env-var path. Cap at 3 items.

---

## 7. RESPONSE SCHEMA

Return ONE JSON object, no markdown wrapping, with this exact shape:

```json
{
  "voter": "<your model id, e.g. openai/gpt-5.1-codex>",
  "round": 14,
  "round_date": "2026-05-20",
  "verdicts": {
    "Q1": { "verdict": "CORRECT|INCORRECT|INSUFFICIENT_EVIDENCE", "rationale": "...", "recommended_action": "..." },
    "Q2": { "verdict": "...", "rationale": "...", "recommended_action": "..." },
    "Q3": { "verdict": "a|b|c|d|e", "rationale": "...", "recommended_action": "..." },
    "Q4": { "verdict": "i|ii|iii|iv|v", "rationale": "...", "recommended_action": "..." },
    "Q5": { "verdict": "CORRECT|INCORRECT|INSUFFICIENT_EVIDENCE", "rationale": "...", "recommended_action": "..." },
    "Q6": { "verdict": "CORRECT|INCORRECT|INSUFFICIENT_EVIDENCE", "rationale": "...", "recommended_action": "..." },
    "Q7": { "verdict": "DELETE|KEEP|DEFER", "rationale": "...", "recommended_action": "..." },
    "Q8": { "verdict": "DELETE|KEEP|INSUFFICIENT_EVIDENCE", "rationale": "...", "recommended_action": "..." },
    "Q9": { "priority_list": ["item1", "item2", "..."], "rationale": "..." },
    "Q10": { "items": ["item1", "item2", "..."], "rationale": "..." }
  },
  "overall_verdict_on_e6d2068": "SHIP|REVISE|REVERT",
  "overall_confidence": 0.0
}
```

`overall_confidence` is your self-rated confidence in 0.0–1.0 for the
overall verdict, accounting for the §3 unresolved contradiction.

NO prose outside the JSON. NO markdown fences. Just the raw JSON object.
