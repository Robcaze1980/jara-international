import Image from 'next/image';
import type { Product } from '@/data/products';

/**
 * Two-image architectural range section — sells the aesthetic flexibility of
 * the Siding product family. Pairs the primary `product.image` with the
 * `product.installationImage` so the visitor sees the same product family in
 * two distinct architectural treatments (Bay Area Craftsman painted Clásico
 * vs mountain modern stained Cedro). Caption ties them together.
 *
 * Returns null when either image is missing — keeps the component additive,
 * non-blocking for products that haven't been photographed.
 */

export function SidingArchitecturalRange({ product }: { product: Product }) {
  if (!product.image || !product.installationImage) return null;

  return (
    <section
      aria-labelledby="architectural-range-heading"
      className="rounded-lg bg-white border border-bluegray/40 p-6 lg:p-10"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Architectural range
        </p>
        <h2
          id="architectural-range-heading"
          className="mt-3 font-display text-2xl font-bold text-navy md:text-3xl text-balance"
        >
          One product family, infinite aesthetics
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink/80">
          Plycem Siding takes paint or stain in any finish color, so the same
          fiber-cement plank reads as a crisp white Bay Area farmhouse on one
          project and a warm cedar-stained mountain residence on another. The
          product is the substrate — the finish is the project&apos;s choice.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-8">
        <figure className="flex flex-col">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-bg-soft">
            <Image
              src={product.image}
              alt="Plycem Siding installed in white Clásico finish on a Bay Area Craftsman residence — fiber-cement lap siding, double-hung white-trim windows, drought-tolerant California landscaping"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-ink/75">
            <span className="font-semibold text-navy">Clásico smooth, painted white</span> —
            Bay Area Craftsman residential context.
          </figcaption>
        </figure>

        <figure className="flex flex-col">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-bg-soft">
            <Image
              src={product.installationImage.src}
              alt={product.installationImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-ink/75">
            <span className="font-semibold text-navy">Cedro wood-grain, cedar-stained</span> —
            {product.installationImage.caption && ` ${product.installationImage.caption.replace(/^Cedro[^—]*—\s*/, '')}`}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
