import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Flame, Layers } from 'lucide-react';
import { PRODUCTS, getProductBySlug } from '@/data/products';
import { ProductCard } from './ProductCard';

/**
 * Featured products section — per ADR-023 HB1 (all 6 visible).
 *
 * 2026-05-16 subfloor-hero restructure: the lead product (High Performance
 * Subfloor / PLYCEM High Performance Subfloor) gets its own prominent
 * featured card with richer specification surface and dual CTAs. The
 * other five products render below in a "Complete the envelope" grid as
 * supporting catalog. Mirrors plycem.com's positioning where the Alto
 * Desempeño subfloor is the spec-driven anchor of the product line.
 *
 * Each ProductCard still emits a Product JSON-LD via the home page <head>
 * (per Round 6 F4.R6 — handled at composition layer in app/page.tsx).
 */

const SUBFLOOR_HIGHLIGHTS = [
  {
    icon: Flame,
    label: 'UL R15140 fire-rated assemblies',
    detail: '1-hour and 2-hour designs: H502, H504, H511, U449, U487',
  },
  {
    icon: ShieldCheck,
    label: 'Full US compliance package',
    detail: 'ASTM C1186 · ASTM E-136 non-combustible · IAPMO ER-360 · IBC 2021 Type I/II · CBC Chapter 7A',
  },
  {
    icon: Layers,
    label: '7 panel variants',
    detail: '20mm / 22mm / 25mm / 30mm thickness · straight or tongue-and-groove edge',
  },
];

export function FeaturedProducts() {
  const subfloor = getProductBySlug('high-performance-subfloor');
  const otherProducts = PRODUCTS.filter((p) => p.slug !== 'high-performance-subfloor');

  return (
    <section
      id="featured-products"
      className="bg-white py-16 lg:py-24"
      aria-labelledby="featured-products-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
            The lead product
          </p>
          <h2
            id="featured-products-heading"
            className="mt-3 font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            PLYCEM High Performance Subfloor — the subfloor that goes on US spec drawings
          </h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            JARA&apos;s catalog is anchored by the only non-combustible
            fiber-cement structural subfloor that carries the full US
            compliance dossier — UL Classified, IAPMO evaluated, IBC and
            California Chapter 7A compliant. Specified for multifamily Type
            V over podium, hotels, steel-joist commercial floors, and
            modular construction.
          </p>
        </div>

        {/* Featured subfloor card — large, two-column on desktop */}
        {subfloor && (
          <article className="mt-10 overflow-hidden rounded-xl border border-navy/20 bg-bg-soft shadow-sm">
            <div className="grid gap-0 md:grid-cols-5">
              {/* Image side */}
              <div className="relative aspect-[4/3] md:aspect-auto md:col-span-2 md:min-h-[360px] bg-navy">
                <Image
                  src="/images/products/_placeholder.svg"
                  alt={`${subfloor.name} fiber cement subfloor — distributed by JARA International`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy shadow-sm">
                  Featured · spec-driven
                </span>
              </div>

              {/* Content side */}
              <div className="md:col-span-3 flex flex-col p-6 lg:p-8">
                <h3 className="font-display text-2xl font-bold text-navy md:text-3xl text-balance">
                  {subfloor.name}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink/80">
                  {subfloor.longDescription}
                </p>

                <ul className="mt-6 space-y-3">
                  {SUBFLOOR_HIGHLIGHTS.map((h) => {
                    const Icon = h.icon;
                    return (
                      <li key={h.label} className="flex items-start gap-3">
                        <Icon
                          className="mt-0.5 h-5 w-5 shrink-0 text-steel"
                          aria-hidden="true"
                          strokeWidth={1.75}
                        />
                        <div>
                          <p className="font-display text-sm font-semibold text-navy">
                            {h.label}
                          </p>
                          <p className="mt-0.5 text-sm leading-relaxed text-ink/70">
                            {h.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/products/${subfloor.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                  >
                    View full subfloor specs
                    <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                  </Link>
                  <Link
                    href="#material-calculator"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                  >
                    Calculate my project
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* "Complete the envelope" — supporting catalog */}
        <div className="mt-20 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
            Complete the envelope
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy md:text-3xl text-balance">
            Beyond subfloor — the rest of the PLYCEM panel system
          </h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            One distributor, one supply line, one compliance documentation
            packet. Once subfloor is on the drawings, the rest of the
            envelope — roof, walls, façade, deck — pulls through from the
            same source on the same container.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
