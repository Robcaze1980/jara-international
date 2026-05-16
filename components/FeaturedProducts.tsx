import { PRODUCTS } from '@/data/products';
import { ProductCard } from './ProductCard';

/**
 * Featured products section — per ADR-023 HB1 (all 6 visible).
 *
 * Renders all 6 products in a responsive grid (3 cols desktop, 2 tablet, 1 mobile).
 * Each ProductCard emits a Product JSON-LD via the home page <head> (per Round 6
 * F4.R6 — handled at composition layer in app/page.tsx).
 */

export function FeaturedProducts() {
  return (
    <section
      id="featured-products"
      className="bg-white py-16 lg:py-24"
      aria-labelledby="featured-products-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2
            id="featured-products-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            Six product lines for every fiber-cement application
          </h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            From non-combustible structural subfloor to monolithic exterior
            cladding to outdoor decking — one distributor, one direct-factory
            supply line, one compliance documentation packet.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
