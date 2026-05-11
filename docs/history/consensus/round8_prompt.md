# Round 8 — Sprint 3 Planning: Product Detail Pages

**Type:** Sprint 3 planning consensus (planning round, post-Sprint 2 review).
**Voters:** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Claude Opus 4.7. Quorum ≥3/4.
**Strategic priority (still active):** Launch in DAYS. Time-to-launch dominates.

---

## 1. WHAT'S LOCKED (do not re-debate)

### Catalog data — `data/products.ts` is single source of truth
- 6 products: high-performance-subfloor, roof-sheathing, deck, exterior-hidden-joint, exterior-cement-board, fibroxton
- Each product has: slug, name, shortDescription, longDescription, applications[], variants[] (thickness/width/length/weight/SKU/edge-profile/panels-per-pallet), density, flexuralStrengthMin, compliance[]
- All manufacturer = "Plycem" (text-only per ADR-006)
- File schema is immutable for Sprint 3 — extend only if absolutely needed and flag in `additional_findings`

### Routes already prerendered (Sprint 2 cleanup, commit `1091fa1`)
- `/products/[slug]` exists as STUB (returns 200, surfaces longDescription + variant count + compliance + Anna/email CTA + per-product Product JSON-LD)
- `generateStaticParams()` enumerates all 6 slugs → all 6 detail URLs prerender at build
- ProductCard on home already links to `/products/${slug}` (SEO-canonical)

### JSON-LD pattern (Round 7 F4.R7 fix)
- Plain `<script type="application/ld+json">` in JSX — NOT `next/script`
- Product schema uses `@id` = canonical URL (already implemented in `lib/jsonld.ts:productSchema()`)
- `faqSchema()` and `breadcrumbSchema()` builders already exist in `lib/jsonld.ts` — Sprint 3 will use them

### Cross-cutting requirements (Rounds 3 + 7)
- Hreflang en-US + es-US + x-default on every page (dynamic [slug] included — already in stub)
- Self-referencing canonical
- Open Graph + Twitter Card meta
- WCAG 2.1 AA — calculator a11y patterns from Round 7 F3.R7 are the reference (fieldset/legend, aria-required, aria-describedby on errors, aria-live for dynamic regions)
- Hero placeholder strategy: generic navy-gradient SVG until user delivers AI image
- Plycem text-only attribution — NO PLYCEM logo, NO "Authorized Distributor" until consolidated approval

### Brand + typography (ADR-001 through ADR-009)
- Navy `#062B49`, soft-bg `#F5F7FA`, ink `#0C1B2A`, steel `#5A6B7E`, bluegray accents
- Montserrat 600/700 for display, Inter for body
- Anna primary phone (+1 415 933 5738), Robertson secondary, email `info@jarainternational.com`

### Performance — ADR-019 SH2
- LCP <1.5s, INP <100ms, CLS <0.05 on mobile + desktop
- Detail pages must not regress home-page Core Web Vitals

---

## 2. WHAT THIS ROUND IS NOT
- NOT re-debating hero, calculator, sticky bar, value props, trust bar — Sprint 2 shipped + reviewed.
- NOT planning Sprint 4 (`/resources` submittal form, full `/contact`).
- NOT debating Plycem branding or phone strategy — locked.
- NOT planning full Spanish product translations — `/es` marketing page is the launch-day Spanish surface; per-product `es-US` hreflang on detail pages points to `/es` for now (same pattern Sprint 2 used). Full Spanish detail pages = post-launch.

## 3. WHAT THIS ROUND IS
Plan the build-out from STUB → FULL product detail page template. 5 voting items below cover the highest-leverage design decisions. Implementation will be one component template applied to all 6 products (data-driven, not 6 hand-coded pages).

---

## 4. SPRINT 3 SCOPE (deliverable summary)

**Components (new):**
- `ProductDetailHero` — product name, manufacturer attribution, applications pill list, primary CTA (call/email/quote)
- `VariantTable` — sortable/grouped variant data (thickness, dimensions, weight, SKU, edge profile)
- `ComplianceSection` — certification list with optional outbound links to standard bodies
- `ProductFAQ` — 3-5 FAQ items per product, renders `faqSchema()` JSON-LD
- `RelatedProducts` — 2-3 product cards beneath FAQ
- `Breadcrumbs` — Home > Products > [Product Name], renders `breadcrumbSchema()` JSON-LD

**Data/lib additions:**
- `data/product-faqs.ts` OR inline FAQ in `products.ts` (Item PB decides shape)
- `lib/related-products.ts` selector function (Item PC decides algorithm)
- Possibly `data/product-assets.ts` for image paths + datasheet PDF paths (if Item PD chooses to surface PDFs)

**JSON-LD on each detail page:**
- Product (already shipped in stub)
- FAQPage (new — uses existing `faqSchema()` builder)
- BreadcrumbList (new — uses existing `breadcrumbSchema()` builder)

**Route:** `/products/[slug]` — page.tsx replaces stub, keeps `generateStaticParams()` + `generateMetadata()` (hreflang already correct in stub).

---

## 5. VOTING ITEMS (5 items)

### Item PA — Variant data presentation

Each product has 1-8 variants differing by thickness, edge profile, and dimensions. Contractors specifying a job need to scan to find the right SKU fast.

- **PA1**: **Single flat table** — one row per variant, columns: Thickness (mm + imperial) · Dimensions (W×L) · Weight · Edge profile · SKU. Sortable by thickness on desktop, scrollable on mobile. Simplest to ship, mirrors how spec sheets present the data.
- **PA2**: **Grouped by thickness** — collapsible accordion sections per thickness, edge-profile variants nested inside. Cleaner visual for subfloor (which has 4 thicknesses × 2 edge profiles = 7 SKUs). Adds JS for accordion state.
- **PA3**: **Cards-not-table** — each variant is a card (thickness as headline, dimensions/weight/SKU stacked, edge profile as pill). More tactile on mobile, more vertical scroll on desktop. Reads less like a spec sheet, more like a product picker.

### Item PB — FAQ content + source strategy

`faqSchema()` builder is unused (Round 7 flagged as treeshake warning). Sprint 3 puts it to work. Where do FAQ items come from?

- **PB1**: **Hand-authored per product, inline in `data/products.ts`** — add `faqs: Array<{q,a}>` field per product. 3-5 items each. Author Sprint 3 from PDFs (e.g., subfloor: "Is this UL R15140 classified for 2-hour assemblies?" "Can it span 24-inch joists?" "How is it fastened?"). Single source of truth, JSON-LD trivially derivable.
- **PB2**: **Hand-authored in separate `data/product-faqs.ts`** — same content, different file. Keeps `products.ts` focused on physical spec data. Easier to grow FAQ corpus without bloating product spec file.
- **PB3**: **Shared base FAQ + per-product overrides** — `data/faqs.ts` exports a common set (delivery, lead time, where-stocked, bilingual support) AND a per-product `productFaqs` map for product-specific Qs. Cuts authoring time (4 shared Qs auto-render on all 6 pages) but risks identical FAQ content hurting SEO uniqueness.

### Item PC — Related products selection

At bottom of each detail page, show 2-3 other JARA products. What algorithm picks them?

- **PC1**: **Application overlap (Jaccard similarity on `applications[]`)** — pure data-driven. Each product's "neighbors" are computed at build time from `data/products.ts`. E.g., subfloor (multifamily/commercial floors) → exterior-cement-board (commercial walls) + roof-sheathing. Zero editorial work; relationships auto-update if applications change.
- **PC2**: **Editorial map** — hand-curated `data/related-products.ts` exporting `{ [slug]: string[] }`. E.g., subfloor → [roof-sheathing, exterior-cement-board]. Best contextual matches, but a maintenance task.
- **PC3**: **Sequential prev/next** — bottom of page shows "Previous: [prior product]" + "Next: [next product]" by `PRODUCTS` array order. Encourages catalog browsing pattern. Simplest; not relevance-aware.

### Item PD — Datasheet / PDF handling

Each Plycem product has an official datasheet PDF (Phase 0.5 audit referenced 10 PDFs). Detail page CTA needs to handle "I want the spec sheet."

- **PD1**: **No PDFs at launch — CTA is "Email datasheet within 1 business day"** (current stub pattern). Robertson/Anna sends PDFs manually. Lowest engineering work; preserves lead capture (gets us email/phone). Defers PDF hosting + naming + Spanish-or-English-which decisions.
- **PD2**: **Public PDFs at `/datasheets/[slug].pdf`** — direct download buttons on detail page. PDFs hosted as static assets in `public/datasheets/`. Highest UX (specifier gets file instantly, no waiting). Sacrifices lead capture; commits to PDF hosting + filenames + future updates.
- **PD3**: **Gated PDFs — email form before download** — user enters email, gets autoresponder link. Captures lead + delivers PDF. Requires form handler (email service) — adds Sprint 4 scope creep into Sprint 3.

### Item PE — Section ordering on detail page (above-fold + scroll order)

Page structure has 6 sections after breadcrumbs: Hero · Variants · Compliance · FAQ · Related products · Final CTA. The two highest-impact orderings:

- **PE1**: **Breadcrumbs → Hero → Variants → Compliance → FAQ → Related → Final CTA.** "Spec sheet" feel — physical specs first (matches how specifiers read PDFs), compliance certifies, FAQ handles objections, related products as exit ramp, CTA at bottom. Linear, dense, B2B-conventional.
- **PE2**: **Breadcrumbs → Hero → Compliance → Variants → FAQ → Related → Final CTA.** Compliance moved above variants — leads with the certifications (UL, ASTM, IAPMO ER-360) which are the unique trust signal vs commodity fiber-cement. Variants follow once trust is established.
- **PE3**: **Breadcrumbs → Hero → Variants → FAQ → Compliance → Related → Final CTA.** FAQ moved above compliance — handles "is this right for my project?" objections immediately after specs, deeper compliance detail rewards readers who got that far. Best for unfamiliar buyers; risks burying compliance signal for sophisticated specifiers.

---

## 6. OUTPUT FORMAT (STRICT JSON ONLY)

```json
{
  "model": "your-model-id",
  "agent": "your-name",
  "votes": {
    "PA": "PA1|PA2|PA3",
    "PB": "PB1|PB2|PB3",
    "PC": "PC1|PC2|PC3",
    "PD": "PD1|PD2|PD3",
    "PE": "PE1|PE2|PE3"
  },
  "reasoning": {
    "PA": "1-2 sentences",
    "PB": "1-2 sentences",
    "PC": "1-2 sentences",
    "PD": "1-2 sentences",
    "PE": "1-2 sentences"
  },
  "additional_findings": [
    {
      "title": "...",
      "description": "...",
      "severity": "blocker|high|medium|low",
      "applies_to_phase": "4|5|6"
    }
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-2 sentences"
}
```

## 7. Notes to voters

- Launch-in-days remains the dominant constraint. Vote for the option that ships fastest among the brand-compliant options.
- All 5 items must be JARA-brand-compliant by default — flag in reasoning if any option violates the locked palette/typography, ADR-006 Plycem ship blockers, or WCAG 2.1 AA requirements.
- Sprint 3 risk is graded **medium** per Round 7 RB synthesis — dynamic routes, per-product schema, FAQ rendering, related-products selector are new patterns. Be alert to additional concerns in `additional_findings`: hreflang correctness on dynamic routes, JSON-LD validity with 3 schemas per page, image lazy-loading for related-products section, variant table mobile a11y, breadcrumb canonicalization.
- `additional_findings` welcome for Sprint 3 implementation gotchas not on the ballot (e.g., generateStaticParams + ISR strategy, OG image generation, schema parser conflicts with 3 JSON-LD blocks on one page).
- Vote independently — no cross-voter visibility.
- This prompt is immutable.
