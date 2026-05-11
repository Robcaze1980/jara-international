# Round 8 Vote — Claude Opus 4.7

**Captured:** 2026-05-11 (before reading other voter outputs)
**Strategic context:** Launch in DAYS + SEO/AI maximization mandate. Sprint 3 risk graded medium by Round 7 RB synthesis. Optimizing for fastest-to-ship among brand-compliant options.

```json
{
  "model": "claude-opus-4-7",
  "agent": "Claude Opus 4.7 (1M context, file-level access)",
  "votes": {
    "PA": "PA1",
    "PB": "PB2",
    "PC": "PC2",
    "PD": "PD1",
    "PE": "PE1"
  },
  "reasoning": {
    "PA": "Flat table is fastest to ship and matches how the specifier audience reads PDF spec sheets. PA2's accordion only pays off for high-thickness products (subfloor with 7 SKUs); 4 of 6 products have ≤2 thicknesses so grouping adds JS state for no UX gain. PA3 cards lose the side-by-side variant comparison that's a table's whole job.",
    "PB": "Separate file (`data/product-faqs.ts`) keeps `products.ts` focused on immutable physical spec while FAQ corpus grows. Same authoring cost as PB1. PB3's shared-base FAQ is an SEO trap — Google demotes pages with identical Q&A blocks, and FAQPage JSON-LD with duplicate questions across 6 URLs is exactly the pattern Search Console flags.",
    "PC": "Editorial map. Jaccard on 6 products with disjoint applications produces ties at score 0 (subfloor and roof-sheathing share zero applications), which collapses to arbitrary order — same problem as PC3. PC2 is a ~30-minute one-time authoring task (18 entries) that yields contextually correct relationships. Maintenance burden is minimal since the catalog is stable.",
    "PD": "Email-on-request preserves lead capture on the highest-intent surface and avoids PDF hosting decisions (filename convention, EN vs ES, version control) that aren't ready. PD2 sacrifices the Anna/Robertson qualification call. PD3 needs a form handler that's Sprint 4 scope.",
    "PE": "On a *detail* page the visitor has already passed the trust filter (they clicked through). They want to evaluate fit — variants first answers 'does this work for my job', compliance certifies, FAQ handles objections, related products as exit ramp. Trust-first ordering (Round 6 HD3) applied to the home page; detail pages flip to spec-first because the audience and intent shifted."
  },
  "additional_findings": [
    {
      "title": "Hreflang on dynamic [slug] routes — current pattern is launch-acceptable but document the limitation",
      "description": "Stub points es-US hreflang to `${SITE.url}/es` (single Spanish marketing page), not `/es/products/[slug]`. This is correct for launch since Spanish detail pages don't exist yet, but Google may flag it as 'hreflang return tag missing' once the /es page exists without reciprocal en-US tags for each product URL. Mitigation: add `/es` to Sprint 3 metadata as `alternates.languages` pointing back to `/products/[slug]` for the en-US tag, so the relationship is bidirectional. Document in MASTER_AUDIT.md that full per-slug Spanish detail pages are post-launch.",
      "severity": "medium",
      "applies_to_phase": "4"
    },
    {
      "title": "3 JSON-LD blocks per detail page — validate no @id collisions",
      "description": "Sprint 3 detail pages will emit Product + FAQPage + BreadcrumbList JSON-LD. Google's Rich Results Test parses each block independently but flags conflicting @id values. Verify productSchema() uses `@id = canonical URL` (it does), breadcrumbSchema() should use `@id = canonical URL + '#breadcrumb'`, faqSchema() should use `@id = canonical URL + '#faq'`. Local validation step before push: run schema.org validator on at least 2 product URLs (one with 1 variant like fibroxton, one with 7 variants like subfloor).",
      "severity": "high",
      "applies_to_phase": "4"
    },
    {
      "title": "VariantTable mobile a11y — table-specific pattern, not calculator's fieldset/legend",
      "description": "Calculator a11y pattern from Round 7 F3.R7 (fieldset/legend/aria-required) doesn't transfer to tables. VariantTable needs: <caption> with product name + variant count, <th scope='col'> on each column header, horizontal-scroll wrapper with aria-label='Scroll variant table horizontally' on mobile, and text-not-icon for edge profile column ('Straight' / 'Tongue and groove' — not unicode symbols that screen readers garble). Document the pattern in a comment so /resources submittal form table (Sprint 4) reuses it.",
      "severity": "high",
      "applies_to_phase": "4"
    },
    {
      "title": "Per-product OG image — generate at build via Next.js opengraph-image.tsx",
      "description": "Each product detail page should have a unique OG image to lift social-card CTR. Next.js App Router supports `app/products/[slug]/opengraph-image.tsx` which generates dynamic OG images at build time via @vercel/og. Image content: navy gradient background + product name + 'PLYCEM · Distributed by JARA' wordmark + thickness range pill. ~40 lines per template, 6 unique cards generated automatically. Without this, all 6 detail pages share the site-wide OG image and lose individual share-ability.",
      "severity": "medium",
      "applies_to_phase": "4"
    },
    {
      "title": "RelatedProducts lazy-load images to protect detail-page LCP",
      "description": "If PC2 wins (editorial map, 2-3 related cards per page), each card has a product image. RelatedProducts renders far below the fold — use `loading='lazy'` and `decoding='async'` on those images. Without this, browsers preload all 3 related-card images even when user never scrolls there, eating LCP budget and inflating mobile data usage. Hero image stays eager-load.",
      "severity": "medium",
      "applies_to_phase": "4"
    },
    {
      "title": "Add optional image field to Product type for AI-photo swap readiness",
      "description": "When user delivers AI-generated product photos (mentioned in locked items as pending), each ProductDetailHero needs a slot for the asset path. Add `image?: string` to Product type in Sprint 3 even if all 6 values stay undefined at launch. Hero renders `product.image ?? '/images/products/_placeholder.svg'`. Ensures the photo swap is a data-only commit (edit products.ts), not a component refactor.",
      "severity": "low",
      "applies_to_phase": "4"
    },
    {
      "title": "Breadcrumb canonicalization — second-level item must match /products listing route",
      "description": "Breadcrumbs render Home > Products > [Product Name]. The 'Products' link must point to `/products` (existing stub from Sprint 2 cleanup). Verify the stub is still in place after Sprint 3 — Sprint 3 expands /products/[slug] but should leave /products/page.tsx (the listing stub) untouched until a Sprint 3.5 or Sprint 4 expands it into a real catalog grid. Otherwise the middle breadcrumb 404s.",
      "severity": "medium",
      "applies_to_phase": "4"
    }
  ],
  "verdict": "ship",
  "verdict_reason": "PA1 + PB2 + PC2 + PD1 + PE1 forms a coherent spec-sheet-style detail page that ships fast (data-driven single template applied to all 6 products) while respecting the specifier audience's evaluation flow. The 7 additional findings tighten implementation (JSON-LD validation, table a11y, OG images, lazy-load, type field) but don't block voting."
}
```

## Vote summary

| Item | Vote | Why fastest-and-correct |
|---|---|---|
| PA — Variant presentation | PA1 flat table | Matches PDF spec-sheet convention; accordion overhead unjustified for 4-of-6 products |
| PB — FAQ source | PB2 separate file | Same authoring cost as inline, avoids products.ts bloat, dodges SEO duplicate-FAQ trap |
| PC — Related products | PC2 editorial map | Jaccard ties at zero on disjoint applications; 30-min one-time curation beats arbitrary order |
| PD — Datasheet handling | PD1 email-on-request | Preserves lead capture, defers PDF hosting decisions, no Sprint 4 form-handler creep |
| PE — Section ordering | PE1 specs-first | Detail-page visitor passed the trust filter; variants answer 'does it fit my job' first |
