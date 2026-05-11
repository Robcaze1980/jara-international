import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE } from '@/lib/site';
import { PRODUCTS } from '@/data/products';
import { productSchema, webSiteSchema, jsonLdScript } from '@/lib/jsonld';
import { Hero } from '@/components/Hero';
import { ValueProps } from '@/components/ValueProps';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { TrustBar } from '@/components/TrustBar';
import { MaterialCalculator } from '@/components/MaterialCalculator';
import { FinalCTA } from '@/components/FinalCTA';
import { StickyCTABar } from '@/components/StickyCTABar';

/**
 * Home page composition — per Round 6 ADR-025 HD2 section ordering:
 *
 *   Hero → ValueProps → FeaturedProducts → TrustBar → Calculator → FinalCTA → Footer
 *
 * Per Round 6 F4.R6 + GLM finding: emit Product JSON-LD for each of the 6
 * featured products + WebSite JSON-LD on home (Organization + LocalBusiness
 * already in root layout per ADR-014).
 *
 * StickyCTABar is a client component appended at the end (per ADR-026 HE2 —
 * appears after scroll past hero, hides when virtual keyboard is open).
 *
 * Page-specific metadata: title is the default from layout (`%s | JARA`),
 * description is overridden to be more home-specific. Canonical and hreflang
 * cascade from root layout.
 */

export const metadata: Metadata = {
  title: 'Fiber-Cement Panel Distributor — In Stock Long Beach CA',
  description:
    'JARA International distributes the full PLYCEM fiber-cement product line — subfloor, roof sheathing, deck, exterior cladding, cement board, and fibroxton — to US contractors, architects, and developers. UL R15140, ASTM C1186, IAPMO ER-360. In stock at Long Beach, CA. 0–3 day West Coast delivery.',
};

export default function HomePage() {
  // Build JSON-LD payloads at request time
  const allSchemas = [webSiteSchema(), ...PRODUCTS.map((p) => productSchema(p))];

  return (
    <>
      {/* JSON-LD: WebSite + 6 Product schemas (Organization + LocalBusiness in root layout) */}
      {allSchemas.map((schema, i) => (
        <Script
          key={`jsonld-${i}`}
          id={`jsonld-${i}`}
          type="application/ld+json"
          strategy="beforeInteractive"
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

      {/* Sticky CTA bar — client component, appears after scroll past hero */}
      <StickyCTABar />
    </>
  );
}
