import Image from 'next/image';
import type { Product } from '@/data/products';

/**
 * Supporting product gallery — renders below the hero on the product detail
 * page when `product.images` is populated. Empty/undefined images = no render.
 *
 * Layout: 2-up grid on desktop, single column on mobile. Each image renders
 * with an optional caption below to give context (e.g. "how it ships", "color
 * blend close-up"). Sized at aspect 4/3 to match the hero.
 */

export function ProductGallery({ product }: { product: Product }) {
  if (!product.images || product.images.length === 0) return null;

  return (
    <section
      aria-labelledby="product-gallery-heading"
      className="rounded-lg border border-bluegray/40 bg-white p-6 lg:p-8"
    >
      <h2
        id="product-gallery-heading"
        className="font-display text-xl font-bold text-navy md:text-2xl"
      >
        Product close-up
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        Closer looks at the product itself — how it ships and what the finished
        material looks like at the panel level.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {product.images.map((img) => (
          <figure key={img.src} className="flex flex-col">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-bg-soft">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {img.caption && (
              <figcaption className="mt-3 text-sm leading-relaxed text-ink/70">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
