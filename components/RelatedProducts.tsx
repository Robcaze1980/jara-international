import { ProductCard } from './ProductCard';
import type { Product } from '@/data/products';

/**
 * Related products section (Round 8 PC1 + F3.R8).
 *
 * Below the fold — uses the standard ProductCard, which wraps next/image with
 * default `loading="lazy"` (no `priority` set). This protects the detail-page
 * LCP from competing with offscreen images per F3.R8 (3/4 voters).
 *
 * Caller passes the already-computed list from `getRelatedProducts(slug)`.
 */

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-products-heading">
      <div className="mb-6">
        <h2 id="related-products-heading" className="font-display text-2xl font-semibold text-navy md:text-3xl">
          Related products
        </h2>
        <p className="mt-1 text-sm text-ink/70">
          Other JARA-distributed PLYCEM panels for adjacent applications.
        </p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.slug} className="flex">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
