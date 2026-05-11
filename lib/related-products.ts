/**
 * Related products selector (Round 8 PC1 — Jaccard similarity on applications[]).
 *
 * Pure function, computed at build time when product detail pages are statically
 * generated. No editorial maintenance: relationships auto-update if applications
 * change in data/products.ts.
 *
 * Algorithm:
 *   1. For each other product, compute Jaccard similarity = |A ∩ B| / |A ∪ B|
 *      over the lowercased `applications` arrays.
 *   2. Sort by similarity descending, tiebreak by slug alphabetical.
 *   3. Return top `count` (default 3).
 *
 * If all candidates score 0 (no application overlap, common in a 6-product
 * catalog with disjoint applications), the alphabetical-by-slug tiebreak
 * deterministically picks neighbors — predictable rather than random.
 */
import { PRODUCTS, type Product } from '@/data/products';

function jaccard(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));
  let intersection = 0;
  for (const item of setA) if (setB.has(item)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function getRelatedProducts(slug: string, count = 3): Product[] {
  const target = PRODUCTS.find((p) => p.slug === slug);
  if (!target) return [];

  const scored = PRODUCTS
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      product: p,
      score: jaccard(target.applications, p.applications),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.product.slug.localeCompare(b.product.slug);
    });

  return scored.slice(0, count).map((s) => s.product);
}
