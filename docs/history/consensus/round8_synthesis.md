# Round 8 — Sprint 3 Planning Synthesis

**Date:** 2026-05-11
**Type:** Sprint 3 planning consensus (planning round, post-Sprint 2 review)
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round8_prompt.md`](round8_prompt.md)
**Vote files:** [`round8_claude.md`](round8_claude.md), [`round8_gemini.json`](round8_gemini.json), [`round8_glm.json`](round8_glm.json), [`round8_deepseek.json`](round8_deepseek.json)

---

## 1. Vote tally — 4/4 quorum on 4 items, 2-2 split on 1 item

| Item | Claude | Gemini | GLM | DeepSeek | Tally | Resolution |
|---|---|---|---|---|---|---|
| **PA** Variant presentation | PA1 | PA1 | PA1 | PA1 | **PA1 = 4/4** | ✅ Unanimous |
| **PB** FAQ source strategy | PB2 | PB1 | PB2 | PB1 | PB1=2, PB2=2 | ⚠️ Split — broken to PB1 |
| **PC** Related products | PC2 | PC1 | PC1 | PC1 | **PC1 = 3/4** | ✅ Quorum |
| **PD** Datasheet handling | PD1 | PD1 | PD1 | PD1 | **PD1 = 4/4** | ✅ Unanimous |
| **PE** Section ordering | PE1 | PE1 | PE1 | PE1 | **PE1 = 4/4** | ✅ Unanimous |
| **Verdict** | ship | ship | ship | ship | **ship = 4/4** | ✅ Unanimous |

**Strong convergence.** 4 of 5 items hit quorum or unanimous; only PB split. All 4 voters returned `ship` verdict.

### PB tiebreak — PB1 (inline in `products.ts`) wins over PB2 (separate file)

Both options have equivalent authoring cost and brand compliance. Tiebreak rationale:

1. **Cohesion** — All product data in one file aids both human readers and AI assistants (Claude-readable monolithic source).
2. **Engineering simplicity** — One import in detail page (`getProductBySlug()`) instead of two (`getProductBySlug()` + `getFaqsForProduct()`).
3. **"Immutable schema" lock is broken either way** — PB1 extends the Product type with a `faqs` field; PB2 introduces a second slug-keyed file requiring sync. PB1 is a smaller surface for divergence.
4. **Same content-authoring cost** — Both need 18-30 hand-authored FAQ items written from Plycem PDFs.
5. **Broader voter support** — PB1 had Gemini + DeepSeek as primary advocates; the immutability-lock argument GLM raised against PB1 was already disclosed in DeepSeek's `additional_findings` as a low-severity acknowledged extension.

**Action:** Extend Product type in `data/products.ts` with `faqs: Array<{ question: string; answer: string }>`. Author 3-5 FAQ items per product (18-30 total). Document the schema change in the file header.

---

## 2. Locked Sprint 3 design (from quorum)

The detail-page template is now specified:

| Decision | Implementation |
|---|---|
| **Variant presentation (PA1)** | Single flat table, sortable by thickness on desktop, horizontal scroll on mobile, columns: Thickness (mm + imperial) · Dimensions (W×L) · Weight · Edge profile · SKU |
| **FAQ source (PB1)** | Inline `faqs[]` field on Product type in `data/products.ts`; 3-5 items per product |
| **Related products (PC1)** | Jaccard similarity on `applications[]` computed at build time in `lib/related-products.ts`; show top 2-3 matches with tiebreak by slug alphabetical |
| **Datasheet (PD1)** | No PDFs at launch — CTA reads "Email datasheet within 1 business day" via existing mailto pattern |
| **Section ordering (PE1)** | Breadcrumbs → Hero → Variants → Compliance → FAQ → Related → Final CTA |

---

## 3. Convergent `additional_findings` (≥2 voters → APPLY)

### F1.R8 — JSON-LD 3-block validation (Claude high + Gemini med + GLM med + DeepSeek med = 4/4 unanimous)
- **What:** Each detail page emits Product + FAQPage + BreadcrumbList in three separate `<script type="application/ld+json">` tags
- **Risk:** `@id` collisions across schemas; FAQPage URLs not matching page canonical; parser conflicts
- **Apply:** Use distinct `@id` per schema: `productSchema()` keeps canonical URL as `@id`; `breadcrumbSchema()` uses `canonical#breadcrumb`; `faqSchema()` uses `canonical#faq`. Run Google's Rich Results Test on at least 2 product URLs before push (one with 1 variant like fibroxton, one with 7 variants like subfloor).

### F2.R8 — Variant table mobile a11y (Claude high + Gemini high + GLM med + DeepSeek med = 4/4 unanimous)
- **What:** PA1's table needs WCAG 2.1 AA-compliant markup that survives mobile horizontal scroll
- **Apply:** `<caption>` with product name + variant count, `<thead>` with `<th scope="col">` on each column, horizontal-scroll wrapper as a focusable region with `role="region"` + `aria-label="Variant table, scroll horizontally on mobile"`, sticky first column (thickness) on mobile. Use text-not-icon for edge profile column ("Straight" / "Tongue and groove") — screen readers garble unicode symbols.

### F3.R8 — RelatedProducts lazy-load images (Claude med + GLM med + DeepSeek med = 3/4 quorum)
- **What:** Related products section renders below the fold with ProductCard images
- **Apply:** Set `loading="lazy"` and `decoding="async"` on all related-card images; specify explicit `width`/`height` to prevent CLS. Hero image stays eager-load. Maintains LCP <1.5s budget.

### F4.R8 — Per-product OG image (Claude med + DeepSeek med + GLM low = 3/4 quorum)
- **What:** All 6 detail pages currently share site-wide OG image, losing social-card individuality
- **Apply:** Generate dynamic OG images via Next.js App Router `app/products/[slug]/opengraph-image.tsx` using `@vercel/og` (already a Next.js peer dep). Template: navy gradient + product name + "PLYCEM · Distributed by JARA" wordmark + thickness range pill. ~40 lines, 6 unique cards generated at build time.

### F5.R8 — Breadcrumb canonicalization (Claude med + DeepSeek low = 2/4 quorum)
- **What:** BreadcrumbList must use absolute canonical URLs matching `alternates.canonical`
- **Apply:** Breadcrumb items = `[{ name: 'Home', url: SITE.url }, { name: 'Products', url: '${SITE.url}/products' }, { name: product.name, url: '${SITE.url}/products/${slug}' }]`. Verify `/products` listing stub stays in place (Sprint 2 cleanup) — Sprint 3 expands `[slug]` only; `/products/page.tsx` stub is Sprint 4 scope. Otherwise the middle breadcrumb 404s.

---

## 4. Single-voter `additional_findings` — applied or deferred

| Concern | Voter | Severity | Disposition |
|---|---|---|---|
| FAQ content authoring is an unblocked content dependency (18-30 items needed from PDFs) | GLM | High | **Apply** — Content owner needs assignment; flag in build plan §6 |
| Hreflang reciprocity on dynamic [slug] routes (current points to /es root, not /es/products/[slug]) | Claude | Medium | **Apply** — Document launch limitation; add reciprocal en-US tag from /es metadata |
| Product type extension flagged (FAQ field schema change) | DeepSeek | Low | **Resolved** — Acknowledged in PB tiebreak §1; update file header comment |
| `image?` optional field for AI-photo swap readiness | Claude | Low | **Apply** — Add to Product type Sprint 3; default to `_placeholder.svg` until assets arrive |

---

## 5. Voter accuracy notes (transparency)

All 4 voters produced internally-consistent JSON. No factual misreadings detected (improvement vs Round 7 where DeepSeek had 2 factual errors).

**Style note on agent identity:** Three voters (Gemini, GLM, DeepSeek) tagged their `model` / `agent` fields as variants of "Claude Opus 4.7" or "Claude" — apparent prompt template misread (the `"model": "your-model-id"` placeholder was treated as a name, not an instruction). Their actual model identities are confirmed by the OpenRouter response envelope (`deepseek/deepseek-v4-pro`, `google/gemini-3.1-flash-lite`, `z-ai/glm-5.1`). No impact on votes; flagging for prompt template clarification in Round 9.

---

## 6. Token + cost summary

| Voter | Prompt tokens | Completion tokens (reasoning) | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 3,062 | 488 (0) | $0.0015 |
| DeepSeek V4 Pro | 2,977 | 1,882 (1,054) | $0.0112 |
| GLM-5.1 | 2,901 | 1,982 (1,312) | $0.0098 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est. |
| **Total Round 8 planning** | — | — | **~$0.07** |
| **Project cumulative (9 rounds: 7 planning + 2 review)** | — | — | **~$0.64** |

---

## 7. Verdict + Sprint 3 build plan

✅ **Round 8 status: COMPLETE — 4/4 ship verdict, 4 items at quorum, 1 PB split resolved.**

**Sprint 3 commit (single commit, target: this week):**

### Phase A — Data + lib layer
1. Extend Product type with `faqs: Array<{question: string; answer: string}>` + `image?: string` (data/products.ts header comment updated)
2. Author 3-5 FAQ items per product (18-30 total) from Plycem PDFs — **CONTENT OWNER NEEDED**
3. Add `lib/related-products.ts` — Jaccard similarity selector on `applications[]`, returns top 3 with alphabetical tiebreak

### Phase B — Components (new in `components/`)
4. `Breadcrumbs.tsx` — renders breadcrumb trail + emits BreadcrumbList JSON-LD with `@id = canonical#breadcrumb`
5. `ProductDetailHero.tsx` — product name + Plycem attribution + applications pills + primary Call/Email CTA
6. `VariantTable.tsx` — flat sortable table (PA1) + WCAG 2.1 AA markup per F2.R8 (caption, th scope=col, focusable scroll region, sticky first column, text-not-icon for edge profile)
7. `ComplianceSection.tsx` — certification list (existing data shape from products.ts)
8. `ProductFAQ.tsx` — render `product.faqs[]` + emit FAQPage JSON-LD with `@id = canonical#faq`
9. `RelatedProducts.tsx` — 2-3 related cards from PC1 selector + `loading="lazy"` on all images per F3.R8

### Phase C — Page integration
10. Replace stub at `app/products/[slug]/page.tsx` with full template (PE1 ordering: Breadcrumbs → Hero → Variants → Compliance → FAQ → Related → Final CTA)
11. Add `app/products/[slug]/opengraph-image.tsx` — dynamic OG image generation (F4.R8)
12. Update `generateMetadata()` to add reciprocal en-US tag (deferred limitation per F5.R8 hreflang note)

### Phase D — Validation
13. Run Google Rich Results Test on 2 product URLs before push (F1.R8)
14. Verify `/products` listing stub still in place (Sprint 4 scope — F5.R8)
15. Confirm no LCP regression on detail pages (mobile + desktop)
16. Build PASS: 15+ routes prerendered, TypeScript clean

### Estimated effort
~6-8 hours focused work (Phase A: 2h authoring + 1h code; Phase B: 3h components; Phase C: 1h integration; Phase D: 1h validation).

**Single commit titled:** `feat(sprint3): product detail pages — variant tables + FAQ + related + JSON-LD trio`

**After Sprint 3 ships → Round 9 review** (Sprint 3 audit, same milestone-review pattern as Round 7).
