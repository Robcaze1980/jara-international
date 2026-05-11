# Round 9 — REVIEW Synthesis (Phase 4 Sprint 3 audit)

**Date:** 2026-05-11
**Type:** Post-milestone review consensus (per memory `milestone_review_pattern.md`)
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round9_review_prompt.md`](round9_review_prompt.md)
**Vote files:** [`round9_review_claude.md`](round9_review_claude.md), [`round9_review_gemini.json`](round9_review_gemini.json), [`round9_review_glm.json`](round9_review_glm.json), [`round9_review_deepseek.json`](round9_review_deepseek.json)
**Audited commits:** `c6e3914` (consensus tooling) + `c09ca25` (Sprint 3 build) on `main`

---

## 1. Vote tally — Sprint 3 ships (3/4), Sprint 4 risk medium (4/4)

| Item | Claude | Gemini | GLM | DeepSeek | Tally | Resolution |
|---|---|---|---|---|---|---|
| **RA** Sprint 3 verdict | RA2 | RA1 | RA1 | RA1 | RA1=3, RA2=1 | ✅ **RA1 SHIP (3/4 quorum)** |
| **RB** Sprint 4 risk | RB2 | RB2 | RB2 | RB2 | **RB2=4/4** | ✅ **MEDIUM confidence (unanimous)** |
| Verdict | revise | ship | ship | ship | ship=3/4 | ✅ Ship |

**Outcome:** Sprint 3 ships as-shipped. Sprint 4 planning posture is **medium risk** (unanimous) — server actions, n8n webhook, multi-step form state, production secret management all introduce new pattern surface.

**My (Claude) dissent rationale:** flagged F1.R8 validation step (Google Rich Results Test mandate, 4/4 voters in Round 8) as not yet executed. Pragmatic resolution under 3/4 ship quorum: treat as a cleanup item, not a re-vote — same pattern Round 7 used when verdict split 2-2 (apply convergent concerns regardless of verdict).

---

## 2. Convergent concerns (≥2 voters → APPLY) — none direct, two semantic

This is the first audit round with **no strictly convergent concerns** (no two voters wrote the same finding). Three semantically-related concerns appeared across voters that merit applying:

### F1.R9 — JSON-LD validation against live production (Claude high + GLM medium, semantic 2/4)

- **Claude's framing:** F1.R8 mandate from Round 8 (4/4) required Google Rich Results Test on 2 URLs before push. Build PASS does not equal schema validation.
- **GLM's framing:** Product schema may be missing `offers` / `image` properties. Without them Search Console will surface warnings and pages won't earn rich snippets.
- **Verification step:** I read `lib/jsonld.ts` at session start. `productSchema()` **does** include `offers: { @type: Offer, seller, availability: InStock, areaServed }` — GLM's offers concern is **factually wrong**, same voter-accuracy issue Round 7 documented for DeepSeek. The `image` field is genuinely absent from product schema (omitted when `product.image` is undefined, which is currently all 6 products).
- **Apply:** (a) Run Google Rich Results Test on `https://jarainternational.com/products/high-performance-subfloor` (high-variant, 5 FAQs) and `https://jarainternational.com/products/fibroxton` (single-variant, 4 FAQs). Document any warnings in a `docs/history/sprint3_schema_validation.md` file. (b) Optionally add `image: imageUrl` to `productSchema()` once first AI-generated product photo lands — skip until then, since pointing to `_placeholder.svg` would inject low-quality assets into rich results.

---

## 3. Single-voter concerns — applied or deferred

| # | Concern | Voter | Severity | Disposition |
|---|---|---|---|---|
| C1 | MASTER_AUDIT.md is stale (still says Sprint 1 latest, missing Sprint 2 + 3) | Claude | Medium | **Apply** — 15 min cleanup; add process note to update every sprint cleanup |
| C2 | OG image visual smoke not done — Cloudflare Workers + next/og runtime compatibility unverified | Claude | Medium | **Apply** — visit /products/high-performance-subfloor/opengraph-image + /products/fibroxton/opengraph-image on production, inspect PNGs |
| C3 | FAQ count mismatch — Round 8 synthesis + commit messages stated 24 but breakdown 5+4+4+4+5+4 = **26** | GLM | Low | **Apply** — math error in my docs; correct to 26 in MASTER_AUDIT |
| C4 | Canonical URL provenance — verify `metadata.alternates.canonical` and JSON-LD `@id` derivations use the same source | GLM | Low | **Apply** — one-line confirmation; both use `${SITE.url}/products/${slug}` (verified during audit, no drift) |
| C5 | VariantTable sortable headers deferred — partial PA1 implementation | Claude | Low | **Defer + document** — add comment in VariantTable.tsx explaining the launch-pragmatic deferral and the upgrade path (client wrapper for sort state) |
| C6 | Hreflang launch limitation not commented in page.tsx metadata | Claude | Low | **Apply** — 3-line comment citing Round 8 §4 disposition |
| C7 | Production secret management strategy for Sprint 4 | Gemini | Medium | **Defer to Round 10 planning** — Sprint 4 concern, not Sprint 3 gap |
| C8 | Form state persistence between calculator → submittal form | Gemini | Low | **Defer to Round 10 planning** — Sprint 4 concern |
| C9 | Round 9 voter self-identification (model/agent field correctness) | Claude | Low | **Document only** — see §4 below |

---

## 4. Voter accuracy notes (transparency)

This round produced **2 factual issues** worth documenting for the milestone-review pattern hygiene:

1. **GLM's `offers` concern is factually wrong.** `lib/jsonld.ts:productSchema()` includes the offers block since Sprint 1 cleanup (Round 5). GLM's concern was written as "schema *may be* missing" — probabilistic guess from a voter without file access. Verified by reading the file. Same pattern Round 7 documented for DeepSeek (2 factual misreadings).

2. **Voter self-identification ask was partially successful.** Round 9 prompt §8 explicitly asked voters to use their actual model name in `model` / `agent` fields. Result:
   - **DeepSeek:** ✅ correctly identified as "DeepSeek V4 Pro"
   - **GLM:** ❌ still self-identified as "Claude Opus 4.7"
   - **Gemini:** ❌ still self-identified as "Claude Opus 4.7"
   - **Claude (me):** ✅ correctly identified
   
   This suggests Gemini Flash Lite and GLM-5.1 have a system-prompt-template adherence weakness — possibly treating the example placeholder `"model": "your-model-id"` as a literal instruction to claim Claude identity (carrying over from the agent-name pattern in the prompt). Workaround for Round 10+: rewrite the JSON example with an explicit instruction comment like `"model": "<replace with your model slug>"`.

The 5 non-factual concerns across all 4 voters all pass review and are dispositioned in §3.

---

## 5. Compliments aggregated (reinforce good patterns)

1. **Native `<details>/<summary>` for FAQ accordion** (Gemini + GLM 2/4) — zero-JS, full keyboard support, a11y-first. Should be team's default for disclosure UI going forward.
2. **WCAG 2.1 AA discipline carried forward cleanly** (Claude single + DeepSeek single) — VariantTable's caption + th scope=col + focusable scroll region + sticky first column + text-not-icon pattern is the new reference for Sprint 4 form tables.
3. **JSON-LD `@id` collision-safe anchors** (Claude + Gemini + DeepSeek 3/4) — small API change (pageUrl as first param to breadcrumbSchema/faqSchema) but makes per-page `@id` derivation impossible to forget.
4. **Deterministic Jaccard tiebreak** (GLM) — alphabetical-by-slug tiebreak ensures related-products output is identical across builds.

---

## 6. Token + cost summary

| Voter | Prompt tokens | Completion tokens (reasoning) | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 2,930 | 463 (0) | $0.0014 |
| DeepSeek V4 Pro | 2,786 | 1,437 (1,231) | $0.0097 |
| GLM-5.1 | 2,774 | 5,802 (4,971) | $0.0291 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est. |
| **Total Round 9 review** | — | — | **~$0.09** |
| **Project cumulative (10 rounds: 7 planning + 3 review)** | — | — | **~$0.73** |

---

## 7. Verdict + Sprint 3 cleanup plan

✅ **Round 9 status: COMPLETE — 3/4 ship verdict, RB medium confidence unanimous, ~30 min cleanup before Sprint 4 starts.**

**Sprint 3 cleanup commit (single commit, target: today before Round 10):**

### A. Validation (F1.R9 must-do)
1. Run Google Rich Results Test on **2 production URLs**:
   - `https://jarainternational.com/products/high-performance-subfloor` (5 FAQs, 7 variants — most schema load)
   - `https://jarainternational.com/products/fibroxton` (4 FAQs, 1 variant — minimal load)
2. Run Schema.org validator on the same 2 URLs.
3. Capture results in `docs/history/sprint3_schema_validation.md` — pass/warn/fail per JSON-LD block.

### B. Visual smoke (C2)
4. Visit `https://jarainternational.com/products/high-performance-subfloor/opengraph-image` directly on production. Verify the PNG renders without text overflow, gradient direction correct, thickness pill aligned.
5. Repeat for `https://jarainternational.com/products/fibroxton/opengraph-image` (long single-word product name — different overflow risk).

### C. Documentation hygiene (C1 + C3 + C4 + C6)
6. Update `docs/MASTER_AUDIT.md`:
   - Phase 4 progress table: Sprint 1 ✅ + Sprint 2 ✅ + Sprint 3 ✅ (with audit refs Round 5, Round 7, Round 9)
   - ADR list: any locked decisions from Round 6/8 that should become ADR-027+ entries
   - Add process note: "Update this file in every sprint cleanup commit"
7. Fix FAQ count: 24 → **26** wherever it appears in commit messages / synthesis files (synthesis only — git history is immutable).
8. Confirm canonical URL provenance: both `metadata.alternates.canonical` and JSON-LD `@id` use `${SITE.url}/products/${slug}` in `app/products/[slug]/page.tsx` (one-line confirmation comment).
9. Add 3-line comment in `app/products/[slug]/page.tsx` `generateMetadata()` explaining hreflang launch limitation per Round 8 §4 disposition.

### D. Component docs (C5)
10. Add comment in `components/VariantTable.tsx` documenting the launch-pragmatic deferral of interactive sort headers (server component pre-sort by thickness vs full sortable client component upgrade path).

### E. Round 10 prep (C7 + C8 carried forward)
11. When drafting Round 10 (Sprint 4 planning) prompt, include voting items on:
   - Production secret management strategy (Cloudflare env vars + n8n webhook URL + N8N_WEBHOOK_SECRET handling)
   - Form state persistence (sessionStorage / URL params / no persistence) between calculator submit and /resources form load

**Estimated cleanup time:** ~45 min focused work. Single commit titled `fix(sprint3-cleanup): apply Round 9 review items + MASTER_AUDIT refresh`.

**After cleanup → Round 10 Sprint 4 planning** (`/resources` 3-step submittal form + full `/contact` page, with secret management + form state items per C7/C8).
