import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/data/products';
import { getFromPriceUsd, formatUsd, priceUnitNoun } from '@/lib/pricing';

/**
 * Product card — per ADR-013 VB1 (photo-first with brand-compliant placeholder).
 *
 * Layout never changes; only `<img src>` swaps when user delivers per-product
 * AI-generated photos to /public/images/products/{slug}.webp (per memory
 * `user_provides_visuals.md`).
 *
 * Per Round 6 single-voter Claude finding: links go to /products list (not
 * detail pages) until Sprint 3 builds individual product pages.
 */

export function ProductCard({ product }: { product: Product }) {
  const variantCount = product.variants.length;
  const fromPrice = getFromPriceUsd(product);
  const thicknesses = [...new Set(product.variants.map((v) => v.thicknessMm))]
    .sort((a, b) => a - b)
    .map((t) => `${t}mm`)
    .join(' · ');

  // Prefer per-product hero image when present; fall back to brand-compliant
  // placeholder when product.image is undefined. (Server-component-safe.)
  const imageSrc = product.image ?? '/images/products/_placeholder.svg';
  const isPlaceholder = !product.image;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-bluegray/40 bg-white shadow-sm transition-all hover:border-navy hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
      aria-label={`View ${product.name} product details`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy">
        <Image
          src={imageSrc}
          alt={`${product.name} fiber cement panel — distributed by JARA International`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={isPlaceholder}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-navy group-hover:text-navy-dark">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/80 line-clamp-3">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink/60">
          <span className="rounded border border-bluegray/40 px-2 py-0.5">
            {thicknesses}
          </span>
          <span className="rounded border border-bluegray/40 px-2 py-0.5">
            {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
          </span>
        </div>
        {fromPrice != null ? (
          <p className="mt-3 text-sm text-ink/70">
            from <span className="font-bold text-navy">{formatUsd(fromPrice)}</span>
            <span className="text-ink/55">/{priceUnitNoun(product.slug)} delivered</span>
          </p>
        ) : (
          <p className="mt-3 text-sm text-ink/55">Delivered price by quote</p>
        )}
        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-navy-dark">
          View specs
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
            strokeWidth={2}
          />
        </span>
      </div>
    </Link>
  );
}
