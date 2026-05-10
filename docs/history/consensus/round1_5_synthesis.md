# Round 1.5 — Synthesis (Stack + SEO Keyword Strategy)

**Date:** 2026-05-10
**Type:** Tiebreaker round for 2 unresolved items from Round 1
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round1_5_prompt.md`](round1_5_prompt.md)
**Vote files:** [`round1_5_claude.md`](round1_5_claude.md), [`round1_5_gemini.json`](round1_5_gemini.json), [`round1_5_glm.json`](round1_5_glm.json), [`round1_5_deepseek.json`](round1_5_deepseek.json)

---

## 1. Vote tally — UNANIMOUS

| Item | Claude (Opus 4.7) | Gemini (3.1 FL) | GLM-5.1 | DeepSeek (V4 Pro) | Tally | Action |
|---|---|---|---|---|---|---|
| **A** Tech stack | A1 | A1 | A1 | A1 | **A1 = 4/4** | **🔒 LOCK A1** |
| **G** SEO keywords | G3 | G3 | G3 | G3 | **G3 = 4/4** | **🔒 LOCK G3** |

**Verdicts:** 4/4 ship. No revise, no hold. Strongest unanimous round of Phase 1.

---

## 2. Locked decisions

### 🔒 ADR-001 — Tech stack: A1 (Next.js 16 + React 19 + Tailwind + Radix)
- **Vote:** A1, 4/4 unanimous
- **Decision:** Next.js 16 + React 19 + Tailwind 3.4 + Radix UI + lucide-react. Deploy on Cloudflare Pages via `@cloudflare/next-on-pages` (or OpenNext for Cloudflare).
- **Rationale (convergent across all 4 voters):** Zero-rewrite port of the 4 salvageable React components (submittal form, document-request button, section-nav, calculator). Native SSR/RSC for the locked `/api/llm-context` endpoint and form POST handlers. A2 (Astro) had unverified `@astrojs/cloudflare` SSR risk; A3 (Payload CMS) was over-infrastructure for the moderate content volume (6 product pages, ~20 SKUs) given user does not edit content (Claude/agents do).
- **Implementation constraint:** Validate Next.js 16 + Cloudflare Pages RSC compatibility in Phase 1 smoke test before Phase 2 build-out (see convergent finding F1.5).

### 🔒 ADR-007 — SEO keyword strategy: G3 (hybrid with Phase 4 Plycem brand sprint)
- **Vote:** G3, 4/4 unanimous
- **Decision:** Generic keywords at launch (title/meta/H1: "fiber cement subfloor distributor California", "non-combustible UL R15140 panel supplier USA", "ASTM C1186 cement board West Coast"). Phase 4 includes a dedicated sprint to: (a) include Plycem meta-tag approval in the consolidated Plycem approval request (per Round 1 F4); (b) once approved, add Plycem brand keywords to title/meta on relevant pages; (c) build Plycem-branded landing pages (e.g., `/products/plycem-subfloor-california`).
- **Rationale (convergent):** User's 6-12 month Plycem-exclusive horizon makes Plycem brand keywords the highest-value B2B traffic. G3 captures this with controlled approval cycle and clean fallback to G1 if approval denied. No reason to permanently cede the traffic.
- **Implementation constraint:** Consolidated approval request MUST include exact proposed meta-title and meta-description strings for each affected page, to avoid a secondary approval cycle (see convergent finding F2.5).

---

## 3. Convergent additional findings (≥2 voters → APPLY)

### F1.5 — Cloudflare adapter RSC + edge API smoke test required in Phase 1 (GLM + DeepSeek)
- **Detail:** Next.js 16 + Cloudflare Pages compatibility for RSC rendering AND edge API route handling (`/api/llm-context`, submittal POST) must be validated in Phase 1 before Phase 2 build-out. If `@cloudflare/next-on-pages` RSC support is incomplete or the legacy v0 components require Pages Router patterns (vs App Router), refactoring is needed early.
- **Status:** ⚠️ Applied as **Phase 1 deliverable** — first sprint task is "Hello world Next.js 16 on Cloudflare Pages with one RSC component + one /api/ route + smoke test". Fallback path: SSR-only rendering (no RSC) if RSC support is incomplete on Cloudflare Pages.

### F2.5 — Consolidated Plycem approval request must include exact meta strings (Gemini + GLM + DeepSeek = 3 voters)
- **Detail:** The single consolidated Plycem approval submission (Round 1 finding F4 — covering logo + "Authorized Distributor" claim + SEO meta keywords) MUST include the exact proposed meta-title and meta-description strings for each page where Plycem brand keywords will appear. Submitting these without the exact strings forces a secondary approval cycle, breaking the Phase 4 sprint timing.
- **Status:** ⚠️ Applied as **Phase 5 (pre-launch) deliverable** — the consolidated approval email to Andrés Castillo must include: (a) logo placement mockups; (b) "Authorized Distributor" claim language; (c) per-page table of proposed meta-title + meta-description + URL slug + Plycem brand keyword usage. Fallback: if approval delayed past Phase 4 start, build Plycem-branded landing-page shells with generic keywords; swap meta after approval received.

### F3.5 — Calculator no-currency CI gate during component port (GLM, refines Round 1 F3)
- **Detail:** Round 1 finding F3 required calculator code review for no-currency strings. F3.5 elevates this to a CI gate written during the A1 component port itself, NOT deferred to QA. A failing build must reject any commit where the calculator output contains `$`, `USD`, "price", "cost", or any currency-formatting locale strings.
- **Status:** ⚠️ Applied as **Phase 4 implementation requirement** for the calculator port. Test name suggestion: `calculator.no-price-leakage.test.ts`. Run on every PR.

---

## 4. Single-voter findings — deferred

| Finding | Voter | Severity | Disposition |
|---|---|---|---|
| Next.js 16 + React 19 `'use client'` directive compatibility | Gemini | Medium | Defer to Phase 1 component port — standard React 18→19 migration concern, well-documented |
| A2 Astro SSR risk | DeepSeek | High | **Moot** — A2 lost vote, no action |
| Legacy components Pages Router vs App Router check | DeepSeek | Medium | Defer to Phase 1 — first port reveals any router pattern conflicts |
| Cloudflare Pages vs Workers explicit decision | Claude | Medium | Defer to Phase 1 — first deploy attempt reveals which is needed |
| A2 vs A1 port effort estimation | Claude | Low | **Moot** — A2 lost vote, no action |

---

## 5. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 1,478 | 394 | $0.0010 |
| DeepSeek V4 Pro | 1,419 | 1,589 | $0.0020 |
| GLM-5.1 | 1,390 | 1,869 | $0.0079 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est. |
| **Total Round 1.5** | — | — | **~$0.06** |
| **Phase 1 cumulative (Round 1 + 1.5)** | — | — | **~$0.18** |

---

## 6. Verdict

✅ **Round 1.5 status: COMPLETE — 4/4 unanimous, both items locked.**

✅ **PHASE 1 COMPLETE — All 9 ballot items resolved.**

| Item | Final lock | Source |
|---|---|---|
| A — Stack | **A1** Next.js 16 | Round 1.5 consensus 4/4 |
| B — Architecture | **B2** Multi-product Plycem catalog | Round 1 + user strategic |
| C — Domain | **C1** jarainternational.com canonical | Round 1 consensus 4/4 |
| D — AI strategy | **D2** llms-full.txt + LLM-context API | Round 1 consensus 4/4 |
| E — Lead capture | **E3** Calculator + form + sticky bar | Round 1 consensus 3/4 |
| F — Plycem brand depth | **F3** Text-only day 1, logo post-approval | Round 1 consensus 4/4 |
| G — SEO keywords | **G3** Hybrid w/ Phase 4 Plycem sprint | Round 1.5 consensus 4/4 |
| H — Bilingual | **H3** EN full + ES landing | Round 1 consensus 3/4 |
| I — Email | **I1** Long canonical for all email | Round 1 + user strategic |

**Convergent constraints applied across Phase 1:**
1. (Round 1 F1) n8n webhook production migration + domain whitelist update before any form ships
2. (Round 1 F2) IAPMO ER-360 expiration date displayed + 90-day renewal reminder
3. (Round 1 F3 / Round 1.5 F3.5) Calculator no-currency CI gate written during port
4. (Round 1 F4 / Round 1.5 F2.5) Single consolidated Plycem approval request with exact meta strings
5. (Round 1.5 F1.5) Next.js + Cloudflare Pages RSC smoke test in Phase 1 first sprint

**Next phase: Phase 2 — Visual Design System + Stitch integration.**
