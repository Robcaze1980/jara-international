# ADR-049 — Positioning correction: JARA has no US warehouse

**Date:** 2026-05-16
**Status:** Accepted — supersedes the warehouse portion of ADR-017 (Service Areas / LocalBusiness) and the homepage premise of ADR-024 HC1 / ADR-025 HD2.
**Decider:** Robert Carrillo (founder/owner)

## Context

Through Rounds 3–10 of pre-launch consensus design, the site was built around a positioning premise that JARA International operates a Long Beach, California warehouse with in-stock PLYCEM fiber-cement inventory enabling 0–3 day delivery to West Coast US jobsites. This premise drove:

- The homepage hero copy and metadata (`In Stock Long Beach CA · 0–3 day West Coast delivery`)
- The first of three top-of-page value props (`In Stock, Long Beach CA`)
- An entire `/service-areas` page built around a delivery-radius coverage map (10 cities in CA/AZ/NV)
- The `LocalBusiness` JSON-LD schema with geo-coordinates (33.7701, -118.1937)
- The `availability: InStock` signal on every Product schema
- A `warehouse` object in `lib/site.ts` with city/region/lat/long
- Warehouse claims in the contact-page strip, footer, OG images, AI/LLM context (`/api/llm-context`, `/llms-full.txt`, `public/llms.txt`), pricing page, and Spanish mirrors
- An "Authorized supplier/distributor" wording in `public/llms.txt` inconsistent with Plycem ship-blocker SB-8 and the careful "distributor of Plycem products" wording in `SiteFooter.tsx`

The founder clarified on 2026-05-16 that the Long Beach warehouse is **not** JARA's. Approximately 900 sheets of PLYCEM stock currently sit in a third-party distributor's warehouse in Long Beach as a one-time pass-through. JARA is helping that distributor sell through the position. The importer has not committed to continuing imports, so this is not a durable supply chain for JARA to anchor positioning on.

The accurate positioning is:
- **Pricing advantage**: direct factory sourcing without US-warehouse markup
- **Lead time**: 3–4 week typical door-to-door from PLYCEM manufacturing in Costa Rica (and El Salvador, Honduras) to the US jobsite, with JARA coordinating ocean freight, US customs clearance, and final-mile trucking end-to-end
- **Spec & code support**: UL R15140, ASTM C1186, ASTM E-84, IAPMO ER-360, IBC 2021, CBC Chapter 7A documentation prepared for AHJ submittal

## Decision

1. **Remove all claims** of a JARA-operated US warehouse, in-stock US inventory, or West Coast delivery radius from production code. This includes:
   - Homepage hero, metadata, value props
   - All `/products`, `/pricing`, `/contact`, `/service-areas` page copy
   - Site-wide footer brand block
   - Per-product Open Graph images
   - All Spanish mirrors (`/es`, `/es/contact`, `/es/pricing`, `/es/service-areas`)
   - AI/LLM context surfaces (`/api/llm-context`, `/llms-full.txt`, `public/llms.txt`)
   - The `warehouse` object in `lib/site.ts`
   - The `localBusinessSchema()` function in `lib/jsonld.ts` and its emission in `app/layout.tsx`
   - The `availability: 'https://schema.org/InStock'` signal on Product schemas (omitted — Google rich-snippet eligibility traded for accuracy)

2. **Pivot `/service-areas` to an Ordering & Logistics page.** URL preserved so existing inbound links and hreflang alternates do not break. New content describes the four-stage container-direct fulfillment process (quote → manufacturing + ocean freight → US customs → final-mile trucking) with typical 3–4 week door-to-door duration. Region list moves from city-level (Long Beach, LA, Orange County, etc.) to US-region-level (California, Pacific Northwest, Texas, Southeast, Northeast, etc.) to reflect continental US reach via direct shipping.

3. **Create a hidden `/long-beach-stock` paid-ads landing page** to capture the short-term lead opportunity from the partner's 900-sheet position. The page is `noindex, nofollow`, is not linked from the main site navigation, footer, sitemap, or llms.txt, and frames the inventory honestly as a third-party pass-through. The page should be removed (or 301'd to `/`) when the stock clears or the partnership ends.

4. **Fix the "Authorized supplier/distributor" wording in `public/llms.txt`** to match the careful "US-based distributor of PLYCEM products" wording established in `SiteFooter.tsx` for Plycem ship-blocker SB-8 compliance. JARA's distribution relationship with Plycem does not include the right to claim "authorized" or "exclusive" status absent written grant from the manufacturer.

5. **Update the Organization JSON-LD address** to `addressCountry: 'US'` only — sufficient to indicate US incorporation without claiming a specific physical location.

## Consequences

**Positive:**
- Site reflects JARA's actual operating model and supply chain. Customer expectations match what JARA can durably deliver.
- Removes legal/reputational exposure from a "warehouse in Long Beach" claim that depends on a third party's inventory and continued willingness to import.
- New positioning (direct factory pricing + 3–4 week door-to-door + spec/code support) is a more defensible competitive position against US-stocking competitors that carry warehouse markup.
- Continental US reach (vs. CA/AZ/NV-only) opens the addressable market.
- `/long-beach-stock` lead-gen page still captures the short-term opportunity from the partner's stock without making it the brand.

**Negative / trade-offs:**
- Loses the "0–3 day delivery" speed angle that resonated with same-week-urgency contractors. The 3–4 week container lead time is honest but less compelling for last-minute orders — the `/long-beach-stock` page partially mitigates for California buyers while the partner stock lasts.
- Drops `availability: InStock` Product schema signal, which may reduce Google product-rich-snippet eligibility. Acceptable trade-off — false `InStock` is worse than no signal.
- LocalBusiness schema removal eliminates eligibility for Google Maps / Knowledge Panel as a local business. JARA is not a local business, so this was incorrect anyway.
- Service-areas page lost the LB-anchored lead-time tier table; replaced with stage-based timeline.

## Files changed (2026-05-16 push)

```
lib/site.ts                                       — removed `warehouse` object; broadened `serviceAreas`; updated description
lib/jsonld.ts                                     — removed localBusinessSchema; removed availability InStock; minimal address
app/layout.tsx                                    — stopped emitting LocalBusiness JSON-LD; updated keywords
data/products.ts                                  — Roof Sheathing FAQ #4 rewrite (no "Long Beach warehouse stock specified for ... Bay Area")
app/page.tsx                                      — metadata title/description
components/Hero.tsx                               — body copy + footer line
components/ValueProps.tsx                         — three new props (pricing, 3–4 wk, spec ready)
components/FeaturedProducts.tsx                   — subheader copy
components/SiteFooter.tsx                         — brand block description + removed warehouse address list item
app/products/page.tsx                             — H1
app/products/[slug]/opengraph-image.tsx           — footer line on OG card
app/pricing/page.tsx                              — metadata + body
app/contact/page.tsx                              — warehouse strip → direct-factory-shipping strip; FAQ #4; metadata
app/service-areas/page.tsx                        — FULL REWRITE: Ordering & Logistics
app/api/llm-context/route.ts                      — replaced `warehouse` object with `supplyModel`
app/llms-full.txt/route.ts                        — Why JARA section; About supply-model note
public/llms.txt                                   — full rewrite; fixed "authorized" wording
app/es/page.tsx                                   — metadata + body
app/es/contact/page.tsx                           — metadata
app/es/pricing/page.tsx                           — metadata + body
app/es/service-areas/page.tsx                     — rewrite (stub mirrors English structure)
app/long-beach-stock/page.tsx                     — NEW: hidden paid-ads lead-gen page (noindex,nofollow)
docs/decisions/ADR-049-positioning-correction-no-us-warehouse.md — this ADR
```

## Open items (future work)

- Remove `/long-beach-stock` (or 301 → `/`) when the partner inventory clears or the partnership ends.
- If JARA later establishes its own US inventory position (own warehouse, dropship agreement, etc.), revisit this ADR before re-introducing in-stock claims.
- The `/api/llm-context` route still exposes a `supplyModel` block with a hard-coded 3–4 week range. Sourcing this from a live data source (or marking it explicitly as a guideline range) would be more durable as actual delivery patterns develop.
- The static `public/sitemap.xml` is a stub from Sprint 1 listing only `/`. When it is regenerated from `app/sitemap.ts` (Sprint 2+), confirm `/long-beach-stock` is excluded.
