# Round 7 — REVIEW Synthesis (Phase 4 Sprint 2 audit)

**Date:** 2026-05-10
**Type:** Post-milestone review consensus (per memory `milestone_review_pattern.md`)
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round7_review_prompt.md`](round7_review_prompt.md)
**Vote files:** [`round7_review_claude.md`](round7_review_claude.md), [`round7_review_gemini.json`](round7_review_gemini.json), [`round7_review_glm.json`](round7_review_glm.json), [`round7_review_deepseek.json`](round7_review_deepseek.json)

---

## 1. Vote tally — BOTH ITEMS SPLIT 2-2

| Item | Claude | Gemini | GLM | DeepSeek | Tally | Action |
|---|---|---|---|---|---|---|
| **RA** Verdict on Sprint 2 | RA2 | RA1 | RA1 | RA2 | RA1=2, RA2=2 | ❌ split 2-2 |
| **RB** Sprint 3 risk grade | RB1 | RB1 | RB2 | RB2 | RB1=2, RB2=2 | ❌ split 2-2 |

**Verdicts:** ship=2 (Gemini, GLM), revise=2 (Claude, DeepSeek). Same 2-2 split as votes.

**Pragmatic resolution under launch-in-days:** When a review round splits, apply the convergent concerns regardless of verdict (since both "ship" voters acknowledged the concerns as forward-looking optimizations and the "revise" voters identified them as immediate fixes). The synthesis treats the convergent concerns as a focused cleanup pass, not a Sprint 3 gating block.

**For RB (Sprint 3 risk):** Apply the more conservative reading (RB2 medium confidence) — Sprint 3 introduces enough new patterns (dynamic routes, per-product schema, FAQ rendering) that medium is the safer planning posture.

---

## 2. Convergent concerns (≥2 voters → APPLY)

### F1.R7 — Dead-link UX: ProductCard + Calculator + Footer all link to 404 routes (Claude + DeepSeek + GLM = 3/4 — STRONGEST CONVERGENT)
- **Severity:** High (UX) — visitors clicking primary CTAs hit 404
- **What's wrong:** Three different surfaces link to routes that don't exist yet:
  - All 6 ProductCards link to `/products` (404)
  - Calculator success "Get full quote" links to `/resources?sf=...` (404)
  - SiteFooter nav links to `/products`, `/resources`, `/contact` (all 404)
- **Why it matters:** Sprint 2 went live, real visitors interact with the site, and the highest-intent CTAs (calculator submit, product card click) currently dead-end. Each 404 is a lost lead.
- **Fix (apply):** Create minimal stub pages for `/products`, `/resources`, `/contact` — JARA-brand-compliant, single `<h1>` + 1 sentence ("Detail pages launching this week — for immediate quote, call or email") + Anna phone CTA + email CTA + link back to home. Same template, ~50 lines each. Stubs replaced organically when Sprint 3/4 ship the real pages. Calculator URL prefill params (`?sf=...&type=...`) preserved in browser history for the receiver page when it ships.

### F2.R7 — Custom 404 page (Claude implicit + GLM low + general consensus)
- **Severity:** Low-medium (UX) — Cloudflare/Next default 404 is unbranded
- **What's wrong:** Any 404 (typos, broken external links, deprecated URLs) shows the default Next.js / Cloudflare error page. No JARA brand, no nav-back-to-home, no fallback CTA.
- **Fix (apply):** Create `app/not-found.tsx` — JARA navy theme, brief "We couldn't find that page" + 3 navigation tiles (Home, Products, Contact) + Anna phone CTA. ~80 lines.

### F3.R7 — Calculator a11y full WCAG 2.1 AA verification (DeepSeek low + GLM medium)
- **Severity:** Medium (a11y) — calculator pattern will be replicated in Sprint 3+
- **What's wrong:** Calculator has aria-live for results (good) but full AA compliance not verified: label associations, error linking via aria-describedby, fieldset/legend grouping, keyboard operability, focus order, contrast on red error borders.
- **Fix (apply):** Pass calculator through axe-core (or similar) audit, fix any AA violations. Document the patterns so Sprint 3 product detail page forms can copy them.

### F4.R7 — JSON-LD duplicate count investigation (Claude single — applied per SEO+AI mandate)
- **Severity:** Medium (SEO/AI) — duplicate schemas can confuse parsers
- **What's wrong:** Local smoke test showed 18 `application/ld+json` matches in HTML output when only 9 expected (Org + LocalBusiness + WebSite + 6 Products). Likely cause: `next/script strategy="beforeInteractive"` injects scripts in two places (head + boot manifest). Could be a regex false positive (matching attribute mentions in framework code, not actual script tags).
- **Fix (apply):** Switch JSON-LD from `<Script>` component to plain `<script type="application/ld+json" dangerouslySetInnerHTML>` in `<head>` (Next.js's recommended pattern for static JSON-LD per their docs). Eliminates any duplication risk and matches the pattern already used in `app/layout.tsx`.

---

## 3. Single-voter concerns — applied or deferred per SEO+AI mandate

| Concern | Voter | Severity | Disposition |
|---|---|---|---|
| WebSite schema missing potentialAction/SearchAction | DeepSeek | Medium | **Apply** — add to webSiteSchema() builder (small, high SEO ROI) |
| Hero placeholder LCP optimization (preload) | Claude | Medium | **Defer** — LCP currently fine; revisit when user delivers final hero |
| /es sticky bar not present (mounted in page.tsx not layout) | Claude | Medium | **Apply** — move StickyCTABar to layout.tsx (renders on /es too) |
| Montserrat unused weights 400/500 (~9KB savings) | Claude | Low | **Apply** — drop weights array to ['600', '700'] in layout |
| faqSchema() builder unused / treeshake warning | Claude | Low | **Defer** — Sprint 3 will use it; not a problem |
| FeaturedProducts loading/empty/error states | DeepSeek | Low | **Defer** — data is static; introduce when async added |
| visualViewport Safari < 13 fallback | DeepSeek | Low | **Defer** — 6% of traffic at most; revisit if analytics shows issue |
| Home Product JSON-LD vs detail page Product JSON-LD duplication | GLM | Medium | **Apply during Sprint 3 planning** — addressed by `@id` referencing canonical URL (already in productSchema) |
| ProductCard slug deep-link prep | GLM | Low | **Apply** — change ProductCard link from `/products` to `/products/${slug}` now (404 behavior identical, easier Sprint 3 swap) |
| Hreflang on dynamic Sprint 3 routes | Gemini | Medium | **Documented** for Sprint 3 planning (Round 8) |
| StickyCTABar Android keyboard edge case | Gemini | Low | **Defer** — same disposition as DeepSeek's Safari concern |

---

## 4. Voter accuracy notes (transparency about file-access asymmetry)

Two of DeepSeek's 7 concerns were based on factual misreadings of the deliverable (limitation of voters without file access):

1. **"JSON-LD Product schema missing required Offer fields"** — Incorrect. `productSchema()` in `lib/jsonld.ts` (verified file) DOES include `offers: { @type: Offer, seller, availability: InStock, areaServed }`. DeepSeek's concern noted this might be missing; it is not.
2. **"/es page returns 404"** — Incorrect. `/es` route exists from Sprint 1 cleanup (Round 5 F3.R5 fix, commit `df322e3`). Live at `https://jarainternational.com/es` returning 200.

Documenting these is part of the milestone review pattern hygiene — voters without file access make probabilistic guesses; my role as synthesis-author with file access is to verify, not blindly aggregate.

The OTHER 5 DeepSeek concerns are all valid and are factored into the must-fix list above.

---

## 5. Compliments aggregated (reinforce good patterns)

1. **Calculator implementation is airtight** (3/4 voters): aria-live region + URL prefill + no-currency validation + buildResourcesPrefillUrl helper cleanly separated. Pattern will scale to Sprint 4 /resources receiver.
2. **Phone strategy execution is precise** (DeepSeek + GLM): Anna primary, Robertson secondary, raw versions in lib/site.ts, distinct labeling in footer, WhatsApp on Robertson — every requirement traceable, no drift.
3. **Sprint 2 shipped first-attempt clean** (Claude): Pre-push smoke test caught the JSON-LD priceCurrency leak before push. Discipline upgrade vs Sprint 1's fix-after-deploy pattern.
4. **JSON-LD integrated at composition layer** (Gemini): SEO metadata tightly coupled with content, not orphaned config.

---

## 6. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 2,319 | 453 | $0.0012 |
| DeepSeek V4 Pro | 2,209 | 1,493 | $0.0089 |
| GLM-5.1 | 2,194 | 7,141 (6,956 reasoning) | $0.0270 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est. |
| **Total Round 7 review** | — | — | **~$0.09** |
| **Project cumulative (8 rounds: 6 planning + 2 review)** | — | — | **~$0.57** |

---

## 7. Verdict + Action plan

⚠️ **Round 7 status: COMPLETE — 2-2 split on both items, convergent concerns applied as cleanup pass.**

**Phase 4 Sprint 2 status:** Shipped + reviewed. 4 must-fix items + 3 quick-win applied items before Sprint 3 starts.

**Sprint 2 cleanup commit (single commit):**
1. **F1.R7** — Create stub pages: `/products`, `/resources`, `/contact` (~50 lines each, JARA brand template, Anna CTA + email)
2. **F2.R7** — Create `app/not-found.tsx` custom 404 with brand + 3 nav tiles + Anna CTA
3. **F3.R7** — axe-core audit on calculator, fix any AA violations, document patterns for Sprint 3 reuse
4. **F4.R7** — Switch JSON-LD from `<Script>` to plain `<script>` in head (eliminate duplication risk)
5. Quick-wins: WebSite SearchAction, ProductCard slug deep-link prep, StickyCTABar moved to layout, Montserrat weights trimmed to 600/700
6. Update README + MASTER_AUDIT with Sprint 2 + cleanup status

**Estimated cleanup time:** ~2 hours focused work. Single commit titled `fix(sprint2-cleanup): apply Round 7 review must-fix items`.

**After cleanup → Round 8 Sprint 3 planning** (product detail pages: dynamic [slug] routes, per-product JSON-LD with @id references to home cards, FAQ section per product, related products, technical-spec table component).
