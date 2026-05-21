import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Flame, Layers, CheckCircle2 } from 'lucide-react';
import { PRODUCTS, getProductBySlug } from '@/data/products';
import { ProductCard } from './ProductCard';

/**
 * Featured products section.
 *
 * 2026-05-16 subfloor-hero restructure: the lead product (High Performance
 * Subfloor) gets its own prominent featured card with richer specification
 * surface and dual CTAs. Mirrors plycem.com's positioning where the Alto
 * Desempeño subfloor is the spec-driven anchor of the product line.
 *
 * 2026-05-21 R15-Q1 defensive revert: the earlier same-day promotion of
 * Exterior Cement Board to a second anchor was rolled back (4/4 unanimous
 * voter consensus, Round 15). The promotion was contingent on US compliance
 * claims (IAPMO ER-360, ASTM E-84/E-136, NFPA 285, ICC IBC/IRC) that are
 * NOT listed on Plycem's actual June 2024 Microconcreto Exterior datasheet.
 * Plycem verification email sent — see docs/plycem-cert-verification-email.md.
 * Re-promotion is gated on Plycem confirming the claims; if confirmed, the
 * second-anchor card returns in one commit. Until then, single-anchor only.
 *
 * The remaining products render below in a "Complete the envelope" grid as
 * supporting catalog. Each ProductCard still emits a Product JSON-LD via the
 * home page <head> (per Round 6 F4.R6 — handled at composition layer in
 * app/page.tsx).
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

/**
 * Display order for the "Complete the envelope" grid (2026-05-19 founder
 * request). Drives visual prominence — the first 3 slugs land in the first
 * row on lg+ (3-column grid). Any slugs not listed here fall through to the
 * end in their natural data/products.ts order. Adjusting this array reorders
 * the grid without touching the canonical PRODUCTS array (which still drives
 * sitemap order and llms.txt cataloging).
 */
const ENVELOPE_DISPLAY_ORDER: readonly string[] = [
  'siding',
  'corrugated-roof-tile',
  'exterior-hidden-joint',
  'exterior-cement-board',
  'deck',
];

// Slugs that render as anchor cards above the "Complete the envelope" grid.
// Filtered out of the grid so they don't appear twice on the page.
const ANCHOR_SLUGS: readonly string[] = ['high-performance-subfloor'];

// R15-Q4 (3/4 strong majority): Deck Modular promoted out of the envelope grid
// into a "Specialty pick / clean-compliance niche" tier between the subfloor
// anchor and the supporting-cast grid. Rationale: surface tiles don't require
// ESRs (not structural, not penetrating), so Deck Modular is the only product
// in the catalog besides Subfloor with no US regulatory gap. The tier treatment
// signals "best of the rest" without overcommitting layout into a second
// full-height anchor.
const TIER_SLUGS: readonly string[] = ['deck-modular'];

const DECK_MODULAR_HIGHLIGHTS = [
  {
    icon: CheckCircle2,
    label: 'Fits the prescriptive US code path',
    detail: 'Surface finish over an engineered substrate — no ICC-ES ESR required, no per-project AHJ submittal',
  },
  {
    icon: Layers,
    label: 'Rooftop terrace use case',
    detail: 'Removable individual tiles preserve under-floor access to waterproofing membranes and drains',
  },
  {
    icon: ShieldCheck,
    label: 'ASTM C1186 Type A Grade I + ASTM E-84',
    detail: 'Fiber-cement durability vs. cheap plastic (IKEA Runnen) and concrete pavers (Buzon, Eterno)',
  },
];

export function FeaturedProducts() {
  const subfloor = getProductBySlug('high-performance-subfloor');
  const deckModular = getProductBySlug('deck-modular');
  const otherProducts = PRODUCTS
    .filter((p) => !ANCHOR_SLUGS.includes(p.slug) && !TIER_SLUGS.includes(p.slug))
    .slice()
    .sort((a, b) => {
      const aIdx = ENVELOPE_DISPLAY_ORDER.indexOf(a.slug);
      const bIdx = ENVELOPE_DISPLAY_ORDER.indexOf(b.slug);
      // Missing slugs go to the end, preserving each other's relative order
      const aOrder = aIdx === -1 ? Number.MAX_SAFE_INTEGER : aIdx;
      const bOrder = bIdx === -1 ? Number.MAX_SAFE_INTEGER : bIdx;
      return aOrder - bOrder;
    });

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
              {/* Image side — uses product.image when set (delivered 2026-05-17);
                  falls back to placeholder for products that don't have a hero
                  image yet. */}
              <div className="relative aspect-[4/3] md:aspect-auto md:col-span-2 md:min-h-[360px] bg-navy">
                <Image
                  src={subfloor.image ?? '/images/products/_placeholder.svg'}
                  alt={`${subfloor.name} fiber cement subfloor — distributed by JARA International`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  unoptimized={!subfloor.image}
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

        {/* R15-Q4 Specialty tier — Deck Modular (3/4 strong majority).
            Visually distinct from anchor (smaller, horizontal layout) and
            from grid cards (full-width, eyebrow + checkmark accents). Sits
            between the subfloor anchor and the supporting-cast grid. */}
        {deckModular && (
          <article className="mt-16 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
            <div className="grid gap-0 md:grid-cols-5">
              {/* Image side — falls back to placeholder until a per-product
                  hero photo is delivered to
                  /public/images/products/deck-modular.webp */}
              <div className="relative aspect-[4/3] md:aspect-auto md:col-span-2 md:min-h-[280px] bg-navy">
                <Image
                  src={deckModular.image ?? '/images/products/_placeholder.svg'}
                  alt={`${deckModular.name} interlocking fiber-cement tiles — distributed by JARA International`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  unoptimized={!deckModular.image}
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
                  Clean compliance
                </span>
              </div>

              {/* Content side */}
              <div className="md:col-span-3 flex flex-col p-6 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Specialty pick
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-navy md:text-2xl text-balance">
                  {deckModular.name} — the rooftop terrace pick that fits the prescriptive US code path
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80 md:text-base">
                  Interlocking 300×300×14mm fiber-cement tiles for rooftop
                  terraces, balconies, and pool decks where under-floor
                  access to waterproofing matters. Because they&apos;re a
                  surface finish over an already-engineered substrate — not
                  structural decking — they don&apos;t require an ICC-ES
                  ESR or per-project AHJ submittal the way structural deck
                  planks do. The cleanest sales path after the subfloor
                  anchor.
                </p>

                <ul className="mt-5 space-y-3">
                  {DECK_MODULAR_HIGHLIGHTS.map((h) => {
                    const Icon = h.icon;
                    return (
                      <li key={h.label} className="flex items-start gap-3">
                        <Icon
                          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
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

                <div className="mt-6">
                  <Link
                    href={`/products/${deckModular.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                  >
                    View Deck Modular specs
                    <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
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
