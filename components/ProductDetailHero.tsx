import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';
import type { Product } from '@/data/products';

/**
 * Product detail hero (Round 8 PE1 section 1).
 *
 * Structure:
 *   - PLYCEM attribution kicker (ADR-006 text-only)
 *   - Product name (H1)
 *   - Long description
 *   - Applications as pill list
 *   - Primary CTAs: Call Anna · Email quote request
 *   - Right column: product image (falls back to `_placeholder.svg` when
 *     `product.image` is undefined per Round 8 PB1 image? field)
 */

export function ProductDetailHero({ product }: { product: Product }) {
  const imageSrc = product.image ?? '/images/products/_placeholder.svg';
  const isPlaceholder = !product.image;

  return (
    <section className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12 md:items-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          PLYCEM Product · Distributed by JARA International
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          {product.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          {product.longDescription}
        </p>

        {product.applications.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              Applications
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.applications.map((app) => (
                <li
                  key={app}
                  className="rounded-full border border-bluegray/40 bg-white px-3 py-1 text-xs font-medium text-ink/80"
                >
                  {app}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
            Call {SITE.phonePrimary}
          </a>
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Quote request: ${product.name}`)}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors"
          >
            <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            Email quote request
          </a>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-navy">
        <Image
          src={imageSrc}
          alt={`${product.name} fiber cement panel — distributed by JARA International`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
          unoptimized={isPlaceholder}
        />
      </div>
    </section>
  );
}
