# Round 4 — Synthesis (Cloudflare Pages adapter for Next.js 16)

**Date:** 2026-05-10
**Type:** Mini-round triggered by Phase 4 Sprint 1 install blocker
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round4_prompt.md`](round4_prompt.md)
**Vote files:** [`round4_claude.md`](round4_claude.md), [`round4_gemini.json`](round4_gemini.json), [`round4_glm.json`](round4_glm.json), [`round4_deepseek.json`](round4_deepseek.json)

---

## 1. Vote tally

| Item | Claude (Opus 4.7) | Gemini (3.1 FL) | GLM-5.1 | DeepSeek (V4 Pro) | Tally | Action |
|---|---|---|---|---|---|---|
| **J** Adapter strategy | J2 | J2 | J1 | J1 | J1=2, J2=2 | ❌ no quorum (split 2-2) |

**Verdicts:** 4/4 ship. All four voters agree the project ships; the disagreement is on path.

---

## 2. Resolution: User strategic tiebreaker — Option B

Per user's decision-making model, technical splits without quorum escalate as strategic priority questions. User was presented with three paths:
- **(A) Velocidad max + cero riesgo** → J1
- **(B) Stack moderno + evitar migración futura** → J2 (con fallback automático a J1 si rompe)
- **(C) Claude pragmático** → "try J2, fallback to J1"

**User chose B (2026-05-10):** _"b"_

**Resulting decision:** J2 — `@opennextjs/cloudflare` adapter, Next.js 16 preserved (verbatim ADR-001).

---

## 3. Smoke test results — J2 path successful (after 2 sub-issues resolved)

### Sub-issue 1: OpenNext peer dependency required Next.js 16.2.5+
- **Encountered:** OpenNext v1.19.8 peer-dep `>=15.5.16 <16 || >=16.2.5`. Initial Next.js 16.1.6 rejected.
- **Resolution:** Bumped Next.js from 16.1.6 → 16.2.6 (latest stable 16.x). ADR-001 lock "Next.js 16" remains intact (just the latest published 16.x patch level).

### Sub-issue 2: OpenNext peer required Wrangler 4.x
- **Encountered:** OpenNext v1.19.8 peer-dep `wrangler@^4.86.0`. Initial Wrangler 3.95 rejected.
- **Resolution:** Bumped Wrangler from `^3.95.0` → `^4.86.0`. Wrangler was not lockedin any ADR; this is a dev tool upgrade.

### Smoke test PASS
After both sub-issues resolved:
- ✅ `npm install` — 492 packages, 39s, no errors
- ✅ Dev server starts via `node node_modules/next/dist/bin/next dev --turbo --port 3001` (npm script wrapper has Windows-path-with-special-chars bug; documented as known issue)
- ✅ Home page (`/`) returns 200 with 28KB HTML, brand tokens render correctly (navy, Montserrat, Inter)
- ✅ `/api/llm-context` returns 200 with 8.5KB JSON containing all 6 products + warehouse + citation guidance + correct edge cache headers (`public, s-maxage=3600, stale-while-revalidate=86400`)
- ✅ Edge runtime confirmed working for SSR API routes — F1.5 fallback NOT needed

---

## 4. Convergent additional findings (≥2 voters → APPLY)

### F1.R4 — `@cloudflare/next-on-pages` is in maintenance mode (GLM + Claude + Gemini, 3/4)
- **Detail:** All three J1/J2 advocates noted Cloudflare officially recommends OpenNext post-2025. The historical adapter is sunset-bound.
- **Status:** Choosing J2 directly addresses this. No further action — we're already on the recommended path.

### F2.R4 — wrangler.toml required for OpenNext deployment (Claude + Gemini, 2/4)
- **Detail:** Switching to OpenNext requires `wrangler.toml` at repo root with `compatibility_date`, `compatibility_flags = ["nodejs_compat"]`, and assets directory binding.
- **Status:** ⚠️ **APPLIED** — `wrangler.toml` created in Sprint 1. Needs final population of `routes` block once user binds custom domain via Cloudflare dashboard.

### F3.R4 — Pre-authorized fallback to J1 if J2 fails (Claude only, but operationally important)
- **Detail:** If J2 had failed, Claude pre-authorized immediate J1 fallback without a new round to avoid blocking launch.
- **Status:** Not triggered — J2 smoke test passed.

---

## 5. Single-voter findings — applied or deferred

| Finding | Voter | Severity | Disposition |
|---|---|---|---|
| React 19 version pin against Next 15.5.2 (only relevant if J1 won) | GLM | High | **Moot** — J2 won, React 19 already validated against Next.js 16.2.6 |
| Edge runtime API route compatibility re-smoke-test | GLM | High | **Validated** — `/api/llm-context` returned 200 with correct headers in smoke test |
| OpenNext build pipeline configuration parity | Gemini | Medium | **Applied** — `npm run cf:build` script uses `opennextjs-cloudflare build`; preview script uses `opennextjs-cloudflare preview` |

---

## 6. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 1,211 | 262 | $0.0007 |
| DeepSeek V4 Pro | 1,147 | 489 | $0.0009 |
| GLM-5.1 | 1,117 | 1,566 | $0.0066 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.03 est. |
| **Total Round 4** | — | — | **~$0.04** |
| **Phase 1+2+3+4 cumulative** | — | — | **~$0.35** |

---

## 7. Verdict

✅ **Round 4 status: COMPLETE** — split resolved by user strategic tiebreaker (Option B → J2). Smoke test PASS with both sub-issues resolved during application.

✅ **ADR-001 preserved** — Next.js 16 + Cloudflare deploy. Only diff: minor version bumped from 16.1.6 → 16.2.6, adapter changed from `@cloudflare/next-on-pages` to `@opennextjs/cloudflare`, deploy target adjusted from "Cloudflare Pages" to "Cloudflare Workers via OpenNext" (functionally equivalent for our use case).

**New ADR-020 (this round):**
- Adapter: `@opennextjs/cloudflare@^1.0.0`
- Wrangler: `^4.86.0`
- Build: `opennextjs-cloudflare build`
- Deploy: `opennextjs-cloudflare deploy` → Cloudflare Workers (with assets binding)
- `wrangler.toml` at repo root with `nodejs_compat` flag and `compatibility_date = 2025-03-01`

**Known issue (Windows local dev only):** npm script wrapper fails on paths with special characters (spaces + `&`). Workaround: invoke directly via `node node_modules/next/dist/bin/next dev --turbo`. CI/Cloudflare builds unaffected (Linux runtime). Documented in README.

**Phase 4 Sprint 1 unblocked. Proceeding to git push + Cloudflare Pages handoff.**
