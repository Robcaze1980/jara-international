import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { PRODUCTS } from '@/data/products';
import { productSchema, webSiteSchema, jsonLdScript } from '@/lib/jsonld';
import { Hero } from '@/components/Hero';
import { ValueProps } from '@/components/ValueProps';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { TrustBar } from '@/components/TrustBar';
import { MaterialCalculator } from '@/components/MaterialCalculator';
import { FinalCTA } from '@/components/FinalCTA';

/**
 * Home page composition — per Round 6 ADR-025 HD2 section ordering:
 *
 *   Hero → ValueProps → FeaturedProducts → TrustBar → Calculator → FinalCTA → Footer
 *
 * Per Round 7 F4.R7 fix: JSON-LD now rendered as plain <script> tags inside
 * the page (not via next/script with strategy=beforeInteractive, which was
 * duplicating script registration). Plain script in <head> is Next.js's own
 * recommended pattern for static JSON-LD per their App Router docs.
 *
 * Per Round 7 cleanup: StickyCTABar moved to root layout so it renders on
 * /es and other pages too (not just home).
 *
 * Page-specific metadata: title is the default from layout (`%s | JARA`),
 * description is overridden to be more home-specific. Canonical and hreflang
 * cascade from root layout.
 */

// Round 12: title uses { absolute: ... } because Next.js title.template does NOT
// apply to the root segment (only nested children). Without absolute the brand
// suffix is missing from the homepage (R12-A7). Also resolves R12-C1 SB-5 by
// removing "PLYCEM" from the title (and A5/A6 by trimming description ≤155 chars
// and listing all three manufacturing countries).
export const metadata: Metadata = {
  title: {
    absolute: 'Non-Combustible Fiber-Cement Subfloor — Multifamily & Commercial USA | JARA International Inc.',
  },
  description:
    'US distributor of non-combustible fiber-cement subfloor — UL R15140, ASTM E-136, IAPMO ER-360, CBC Chapter 7A. Direct factory shipping from Costa Rica, El Salvador, and Honduras; 3–4 week door-to-door delivery.',
};

export default function HomePage() {
  // Build JSON-LD payloads at request time (Org + LocalBusiness in root layout)
  const allSchemas = [webSiteSchema(), ...PRODUCTS.map((p) => productSchema(p))];

  return (
    <>
      {/* JSON-LD: WebSite + 6 Product schemas. Plain <script> per Next.js App
          Router docs — avoids next/script duplication issue (Round 7 F4.R7). */}
      {allSchemas.map((schema, i) => (
        <script
          key={`jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
        />
      ))}

      {/* Section order per ADR-025 HD2 (Round 6) */}
      <Hero />
      <ValueProps />
      <FeaturedProducts />
      <TrustBar />
      <MaterialCalculator />
      <FinalCTA />
    </>
  );
}
