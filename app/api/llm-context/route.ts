import { NextResponse } from 'next/server';
import { SITE } from '@/lib/site';
import { PRODUCTS } from '@/data/products';

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
// Cache-Control header below handles CDN-edge caching (1h fresh + 24h SWR);
// `export const revalidate` is for Next ISR which requires R2/KV cache backing
// we haven't configured (and don't need for static product data).

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
      warehouse: {
        city: SITE.warehouse.city,
        region: SITE.warehouse.region,
        country: SITE.warehouse.country,
        latitude: SITE.warehouse.latitude,
        longitude: SITE.warehouse.longitude,
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
      })),
    })),
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
