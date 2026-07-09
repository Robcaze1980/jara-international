/**
 * lib/pricing.ts — published DDP price data + helpers (Round 16, 2026-07-09).
 *
 * SB-4 was authorized by Plycem (verbal, 2026-07-06) to publish JARA's own
 * delivered (DDP) list prices. This module is the SINGLE public source of
 * price truth on the site — product pages, /pricing, JSON-LD, llms.txt and
 * /api/llm-context all read from here.
 *
 * PUBLIC-SAFE ONLY: these are the final rounded DDP selling prices. JARA's
 * cost build-up, freight, duty breakdown, and margin are internal and live
 * only in the gitignored BITACORA.md — NEVER here.
 *
 * Prices are per PANEL (or per plank for Deck) at FULL-CONTAINER (FCL / 40HQ)
 * quantity, DDP to a main US base port + up to 50 mi inland. Only 3 of 7 catalog
 * products are priced (the ones with a June-2026 Plycem price); the rest are
 * quote-only. Tariff/dated validity is intentionally NOT modeled here — the
 * 15% duty is an agreed cushion, not a volatile pass-through (founder, 2026-07-09).
 */
import type { Product, ProductVariant } from '@/data/products';

/**
 * Rounded DDP price by SKU. Subfloor/Hidden-Joint = $/panel; Deck = $/plank.
 * FCL (40HQ) quantity, USD. Only SKUs present in Plycem's June-2026 sheet.
 * Note: Hidden-Joint 12 mm is keyed by catalog SKU 979422 (Plycem sheet listed
 * it as 979911 — same 12 mm 1219×2438 panel; SKU discrepancy logged in BITACORA).
 */
export const PRICE_BY_SKU: Record<string, number> = {
  // High Performance Subfloor (25 mm-straight 960159 & 30 mm-straight 960162 are unpriced)
  '960140': 74, // 20 mm straight
  '972254': 83, // 20 mm T&G
  '960151': 85, // 22 mm straight
  '971677': 89, // 22 mm T&G
  '971829': 105, // 25 mm T&G
  // Exterior Hidden Joint (by thickness)
  '960018': 28, // 8 mm (1219×2438)
  '972234': 29, // 8 mm (1200×2400)
  '960093': 39, // 10 mm
  '979422': 49, // 12 mm
  // Deck (plank)
  '982315': 48, // 30 mm
  '1323611': 49, // 30 mm (gris)
};

export const PRICED_PRODUCT_SLUGS = [
  'high-performance-subfloor',
  'exterior-hidden-joint',
  'deck',
] as const;

export const PRICE_CURRENCY = 'USD';

/** Deck ships as a 12-ft plank, not a 4×8 panel — no $/SF display (R16-Q10, GLM). */
const PLANK_SLUGS = new Set<string>(['deck']);

/** Unit noun for a product's price ("plank" for Deck, else "panel"). */
export function priceUnitNoun(slug: string): string {
  return PLANK_SLUGS.has(slug) ? 'plank' : 'panel';
}

export function getVariantPriceUsd(sku: string): number | undefined {
  return PRICE_BY_SKU[sku];
}

export function isPricedProduct(slug: string): boolean {
  return (PRICED_PRODUCT_SLUGS as readonly string[]).includes(slug);
}

/** Panel area in ft² from mm dimensions (1 ft = 304.8 mm). */
export function variantAreaSqFt(v: ProductVariant): number {
  return (v.widthMm / 304.8) * (v.lengthMm / 304.8);
}

/** $/SF for a priced panel variant; undefined for planks (Deck) or unpriced variants. */
export function getVariantPricePerSqFt(
  slug: string,
  v: ProductVariant,
): number | undefined {
  if (PLANK_SLUGS.has(slug)) return undefined;
  const price = getVariantPriceUsd(v.sku);
  if (price === undefined) return undefined;
  const sf = variantAreaSqFt(v);
  return sf > 0 ? price / sf : undefined;
}

export type PricedVariant = {
  variant: ProductVariant;
  priceUsd: number;
  pricePerSqFt?: number;
};

/** All priced variants of a product, cheapest first. Empty array if quote-only. */
export function getPricedVariants(product: Product): PricedVariant[] {
  const out: PricedVariant[] = [];
  for (const v of product.variants) {
    const priceUsd = getVariantPriceUsd(v.sku);
    if (priceUsd === undefined) continue;
    const pricePerSqFt = getVariantPricePerSqFt(product.slug, v);
    const pv: PricedVariant = { variant: v, priceUsd };
    if (pricePerSqFt !== undefined) pv.pricePerSqFt = pricePerSqFt;
    out.push(pv);
  }
  return out.sort((a, b) => a.priceUsd - b.priceUsd);
}

/** Lowest published price for a product, or undefined if quote-only. */
export function getFromPriceUsd(product: Product): number | undefined {
  const priced = getPricedVariants(product);
  return priced.length ? priced[0].priceUsd : undefined;
}

/** Whole-dollar USD, e.g. `$74`. */
export function formatUsd(n: number): string {
  return `$${Math.round(n)}`;
}

/** `$2.30/SF` (2 decimals). */
export function formatPerSqFt(n: number): string {
  return `$${n.toFixed(2)}/SF`;
}

/**
 * The 5 mandatory honesty caveats attached to every published price
 * (R16-Q4, 4/4 unanimous). Tariff/dated validity intentionally EXCLUDED
 * (R16-Q9 dissent + founder: 15% is an agreed cushion, not a volatile pass-through).
 */
export const PRICE_CAVEATS: readonly string[] = [
  'DDP — import duty paid, delivered to a main US base port',
  '~3–4 week delivery, direct from the factory (made to order)',
  'Full-container (40HQ) pricing',
  'Inland delivery included up to 50 mi from the port; beyond that, additional freight',
  'Assumes standard unloading time — overtime / detention not included',
  'Final price confirmed by quote (published prices are indicative)',
];

/** Short inline unit label for price chips, e.g. "per panel · delivered · full container". */
export function priceUnitLabel(slug: string): string {
  return `per ${priceUnitNoun(slug)} · delivered (DDP) · full container`;
}
