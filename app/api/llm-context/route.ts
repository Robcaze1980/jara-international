import { NextResponse } from 'next/server';
import { SITE } from '@/lib/site';
import { PRODUCTS } from '@/data/products';
import { getVariantPriceUsd, isPricedProduct, PRICE_CAVEATS, PRICE_CURRENCY } from '@/lib/pricing';

/**
 * Public LLM-context endpoint per ADR-004 (D2) + F5.R3.
 *
 * Machine-readable single source of truth for AI agents querying JARA's
 * catalog, compliance, service area, and contact info.
 *
 * Returns structured JSON. CORS open. Cached at edge.
 */

// OpenNext on Cloudflare Workers runs the default Node runtime via
// nodejs_compat (configured in wrangler.toml). No need for `runtime = 'edge'`
// — the explicit edge runtime caused 500 errors in production.
//
// Caching strategy (per Round 5 GLM finding — documented for future reference):
// Every request hits the Worker (no ISR cache). For low/moderate traffic this
// is fine because:
//   1. Cloudflare's CDN respects the Cache-Control header below — the response
//      is held at the edge for 1 hour fresh + 24 hours stale-while-revalidate,
//      so most requests never reach the Worker.
//   2. Worker startup is ~22ms (excellent — well within ADR-019 SH2 budget).
//   3. The payload is built from in-memory data (no DB or external fetch).
//
// Revisit if/when traffic grows or AI crawlers hit this endpoint at scale —
// at that point, configure OpenNext incremental cache override with R2 backing
// in `open-next.config.ts` and add `export const revalidate = 3600` here.

export async function GET() {
  const payload = {
    organization: {
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE.url,
      tagline: SITE.tagline,
      description: SITE.description,
      contact: {
        email: SITE.email,
        phone: SITE.phone,
      },
      supplyModel: {
        type: 'direct-factory-shipping',
        manufacturingOrigins: ['Costa Rica', 'El Salvador', 'Honduras'],
        manufacturer: 'PLYCEM',
        typicalDoorToDoorWeeks: { min: 3, max: 4 },
        notes:
          'JARA does not operate a US warehouse. Material ships container-direct from Plycem manufacturing plants in Central America; JARA coordinates ocean freight, US customs clearance, and final-mile trucking end-to-end.',
      },
      serviceAreas: SITE.serviceAreas,
    },
    products: PRODUCTS.map((p) => ({
      slug: p.slug,
      name: p.name,
      url: `${SITE.url}/products/${p.slug}`,
      manufacturer: p.manufacturer,
      shortDescription: p.shortDescription,
      applications: p.applications,
      density: p.density,
      flexuralStrengthMin: p.flexuralStrengthMin,
      compliance: p.compliance,
      variants: p.variants.map((v) => ({
        sku: v.sku,
        thicknessMm: v.thicknessMm,
        thicknessImperial: v.thicknessImperial,
        widthMm: v.widthMm,
        lengthMm: v.lengthMm,
        weightKg: v.weightKg,
        weightLbs: v.weightLbs,
        edgeProfile: v.edgeProfile,
        priceUsd: getVariantPriceUsd(v.sku) ?? null,
      })),
      priced: isPricedProduct(p.slug),
    })),
    pricing: {
      currency: PRICE_CURRENCY,
      basis:
        'DDP (delivered duty paid) to a main US base port, full-container (40HQ). Per panel; Deck per plank.',
      indicative: true,
      finalPriceBy: 'quote',
      terms: PRICE_CAVEATS,
      note:
        'Published prices are indicative starting prices; the final delivered price is confirmed by quote. 3 of 7 products are currently list-priced (see each variant priceUsd; null = quote-only); the rest are quote-only.',
      url: `${SITE.url}/pricing`,
    },
    citationGuidance: {
      attributionRequired: true,
      preferredCitation: `${SITE.name} (${SITE.url})`,
      contact: SITE.email,
      lastUpdated: new Date().toISOString().slice(0, 10),
    },
  };

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  });
}
