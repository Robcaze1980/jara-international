# Round 6 — Synthesis (Sprint 2 Planning: Home Page Composition)

**Date:** 2026-05-10
**Type:** Sprint 2 planning consensus (planning round, post-Sprint 1 close)
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round6_prompt.md`](round6_prompt.md)
**Vote files:** [`round6_claude.md`](round6_claude.md), [`round6_gemini.json`](round6_gemini.json), [`round6_glm.json`](round6_glm.json), [`round6_deepseek.json`](round6_deepseek.json)

---

## 1. Vote tally

| Item | Claude (Opus 4.7) | Gemini (3.1 FL) | GLM-5.1 | DeepSeek (V4 Pro) | Tally | Action |
|---|---|---|---|---|---|---|
| **HA** Calculator UX | HA1 | HA1 | HA1 | HA1 | **HA1=4** | ✅ **LOCK HA1** (single-screen) |
| **HB** Featured products | HB2 | HB2 | HB1 | HB1 | HB1=2, HB2=2 | ❌ split 2-2 → pragmatic resolution below |
| **HC** Value props | HC1 | HC1 | HC1 | HC1 | **HC1=4** | ✅ **LOCK HC1** (3 props) |
| **HD** Section ordering | HD3 | HD2 | HD2 | HD1 | HD1=1, **HD2=2**, HD3=1 | ❌ no quorum, leader HD2 |
| **HE** Sticky CTA bar | HE2 | HE2 | HE2 | HE1 | HE1=1, **HE2=3** | ✅ **LOCK HE2** (after-scroll) |

**Verdicts:** 4/4 ship. No revise, no hold.

---

## 2. Locked decisions (3 unanimous/quorum)

### 🔒 ADR-022 — Calculator UX: HA1 (single-screen)
- **Vote:** HA1, 4/4 unanimous
- **Decision:** Single-screen calculator. All inputs (SF area, construction type, optional thickness preference) + result + email-capture CTA visible simultaneously. Vertical stack on mobile. Result reveals only after all required inputs valid.
- **Rationale (convergent):** One component, one form state, no step-transition animation, no progressive-disclosure JS bugs. Lowest implementation effort and bug surface.

### 🔒 ADR-024 — Value props: HC1 (3 props)
- **Vote:** HC1, 4/4 unanimous
- **Decision:** 3 props on home: (1) "In stock, Long Beach CA" — 0–3 day delivery to West Coast. (2) "Compliance-ready" — UL R15140, ASTM C1186, IAPMO ER-360 documentation on request. (3) "Technical sales support" — bilingual EN+ES, 1-business-day response.
- **Rationale (convergent):** Tight scope. Manufacturing-origins story (HC2 alt) belongs on `/about`. Multi-product story (HC3 alt) duplicates the products section directly adjacent to it.

### 🔒 ADR-026 — Sticky CTA bar: HE2 (appears after scroll past hero)
- **Vote:** HE2, 3/4 (Claude/Gemini/GLM voted HE2; DeepSeek voted HE1 always-visible for max conversion)
- **Decision:** Sticky bottom bar with phone + WhatsApp + "Request Quote" button. Hidden on first viewport; appears after user scrolls ~600-800px past hero. Single IntersectionObserver + CSS class toggle.
- **Rationale (convergent):** Balance — first impression isn't dominated by a CTA bar, but engaged visitors get persistent reminder. Standard B2B SaaS pattern. HE3 device-branching adds component complexity for marginal benefit.

---

## 3. Splits — pragmatic resolution under launch-in-days

Per the user's stated decision-making model, technical splits without quorum either escalate to user (strategic) or apply a pragmatic default (tactical). HB and HD are tactical UX positioning — NOT strategic enough to interrupt user. Applied resolutions:

### 🔒 ADR-023 — Featured products: HB1 (all 6 visible) — speed-favored resolution
- **Tally:** HB1=2 (GLM, DeepSeek), HB2=2 (Claude, Gemini)
- **Why HB1 wins the tiebreak:** Both options are 5-line components; the only material difference is whether to slice the array to top-3 (HB2) or render all (HB1). The split is about taste — should home show "honest breadth" or "curated flagships." Per the prompt's explicit guidance ("vote for the option that ships fastest among brand-compliant options"), HB1 is marginally faster (no curation logic, no "view all" link plumbing) AND honors the brand strategy: JARA is a multi-product distributor, not a single-flagship reseller.
- **Decision:** Render all 6 product cards in a 3-column grid (desktop) / 1-column stack (mobile) on home. Same component the `/products` listing page will use in Sprint 3.

### 🔒 ADR-025 — Section ordering: HD2 (props before calculator) — leader-applied resolution
- **Tally:** HD1=1, HD2=2 (GLM + Gemini), HD3=1 (Claude)
- **Why HD2 wins the tiebreak:** HD2 has the only 2-vote leader. Implementation cost is identical for HD1/HD2/HD3 (just JSX section reordering). The conventional B2B funnel (credibility → engagement) is well-trodden territory and matches GLM/Gemini's "build authority before asking for action" reasoning. Claude's HD3 (trust-first) was the strongest argument from a single voter but didn't reach quorum.
- **Decision:** Section order on home: hero → value props → featured products → trust bar (text-only certs per Claude finding) → calculator → final CTA → footer.

---

## 4. Convergent additional findings (≥2 voters → APPLY)

### F1.R6 — Calculator input validation airtight (Claude + DeepSeek + Gemini + GLM = 4/4 — STRONGEST)
- **Detail:** Calculator must validate: SF > 0, construction type required (dropdown with default "Type V over podium"), thickness optional (default 20mm). Reject non-numeric, negative, zero. Cap at sane max (e.g., 500,000 SF). Inline error messages (not alerts). NO calculation runs on invalid input. NO NaN leakage. Decimal SF handled gracefully.
- **Status:** ⚠️ Applied as Sprint 2 implementation requirement. Spec to live in `lib/calculator.ts` (validation rules) + tested via Vitest before merge.

### F2.R6 — Calculator → /resources prefill mechanism specified now (GLM only — high severity, applied per SEO+AI mandate)
- **Detail:** When user clicks "Get full quote" on calculator, the /resources submittal form must prefill with calculator inputs. Mechanism: URL query params (e.g., `/resources?sf=500&type=multifamily-podium&thickness=20mm`). Without this spec'd before implementation, the CTA becomes a dead link at launch.
- **Status:** ⚠️ Applied. Sprint 2 calculator builds the URL with query params. Sprint 4 (when /resources ships) reads them in submittal form initial state.

### F3.R6 — Trust bar text-only at launch — Plycem ship blocker compliance (Claude + GLM = 2/4)
- **Detail:** HD2 lock includes a trust bar section. MUST be TEXT-ONLY at launch — `"UL R15140 Classified · ASTM C1186 Type A Grade I · IAPMO ER-360 · ASTM E-84 Class A · CBC Ch 7A"` with each cert linkable to the cert PDF in /resources (when /resources ships). NO Plycem logo. UL/ASTM/IAPMO logos require permission (deferred — text wordmarks safer).
- **Status:** ⚠️ Applied. Trust bar component renders text + cert detail links only.

### F4.R6 — Featured products section needs Product JSON-LD per ADR-014 (Claude — high, applied per SEO+AI mandate)
- **Detail:** When 6 featured product cards render on home, each card emits a Product JSON-LD with name, manufacturer, sku (from variants[0].sku), category, description. ADR-014 SA2 lock includes Product schema — easy via builder in lib/jsonld.ts. Without this, home loses 6 indexable Product entities.
- **Status:** ⚠️ Applied. Add `productSchema(product: Product)` to lib/jsonld.ts. Render 6 schemas in home page <head>.

### F5.R6 — Sticky bar mobile keyboard overlap (DeepSeek — medium, applied)
- **Detail:** HE2 sticky bar on mobile must not clash with virtual keyboard when user taps a form field. Either reposition to `static` on input focus or use `env(safe-area-inset-bottom)` + `visualViewport` API to sit above keyboard.
- **Status:** ⚠️ Applied. Add `visualViewport` listener to sticky bar component; hide bar when virtual keyboard is detected open.

---

## 5. Single-voter findings — applied or deferred

| Finding | Voter | Severity | Disposition |
|---|---|---|---|
| Calculator a11y — `aria-live` for result, focus rings, accessible errors | DeepSeek | Medium | **Apply** — Sprint 2 implementation requirement |
| WhatsApp deep link format `https://wa.me/[number]` | Gemini | Low | **Apply** — standard cross-platform link |
| Sticky bar /es localization (Cotizar vs Quote) | Claude | Medium | **Apply** — sticky bar component reads i18n strings, not hardcoded |
| Hero placeholder LCP audit (intrinsic dimensions, preload) | DeepSeek | Medium | **Apply** — ensure LCP <1.5s per ADR-019 SH2 |
| Home page Organization + WebSite JSON-LD | GLM | Low | **Apply** — Organization already in layout, add WebSite |
| Featured products link target (HB1 = 6 cards link to /products list since detail pages don't exist yet) | Claude | Medium | **Apply** — links go to `/products` (Sprint 3 builds detail pages); document as expected-overwrite |
| BreadcrumbList NOT on home root | DeepSeek | Low | **Documentation** — confirms Round 3 spec, no action needed |

---

## 6. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 2,180 | 479 | $0.0013 |
| DeepSeek V4 Pro | 2,084 | 2,002 | $0.0026 |
| GLM-5.1 | 2,068 | 1,890 | $0.0086 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est. |
| **Total Round 6** | — | — | **~$0.06** |
| **Project cumulative (6 planning rounds + 1 review round)** | — | — | **~$0.48** |

---

## 7. Verdict + Sprint 2 implementation order

✅ **Round 6 status: COMPLETE — 5/5 items resolved (3 consensus locks + 2 pragmatic resolutions).**

**Sprint 2 build order (recommended):**
1. Update `lib/jsonld.ts`: add `productSchema()` + `webSiteSchema()` builders
2. Build `<TrustBar>` component (text-only certs, navy/light-gray background)
3. Build `<ValueProps>` component (3 cards, lucide icons, navy theme)
4. Build `<ProductCard>` component (photo-first w/ placeholder fallback)
5. Build `<FeaturedProducts>` component (renders all 6 ProductCards)
6. Build `<MaterialCalculator>` component + `lib/calculator.ts` (validation + estimate logic + URL builder for /resources prefill)
7. Build `<StickyCTABar>` component (IntersectionObserver + visualViewport handling + i18n strings)
8. Compose home `app/page.tsx` per HD2 ordering: Hero → ValueProps → FeaturedProducts → TrustBar → Calculator → FinalCTA → Footer
9. Add 6 Product JSON-LD blocks + WebSite JSON-LD to home `<head>` via metadata API
10. Smoke test locally: validate hreflang, JSON-LD count, CWV, calculator validation rules
11. Push → Cloudflare auto-deploy → verify live → Round 7 review

**Estimated Sprint 2 implementation time:** ~3-4 hours of focused work (much heavier than Sprint 1 since real components shipping).

**After Sprint 2 ships → Round 7 REVIEW** (per milestone_review_pattern.md memory).
