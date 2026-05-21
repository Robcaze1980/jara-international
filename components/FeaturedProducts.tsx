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
];

// Slugs that render as anchor cards above the "Complete the envelope" grid.
// Filtered out of the grid so they don't appear twice on the page.
const ANCHOR_SLUGS: readonly string[] = ['high-performance-subfloor'];

// 2026-05-21 founder direction: "Outdoor Decking" tier surfaces BOTH outdoor
// decking products (Deck plank + Deck Modular) as a strategic category. Same
// fiber-cement material, identical compliance dossier (ASTM C1186 Type A +
// ASTM E-84 Class A + ISO 8336) — the differentiation is use case, not
// paperwork. Plank is structural decking (IRC R507, requires AHJ alternative-
// materials submittal under IBC 104.11); Modular is a surface finish over an
// engineered substrate (no ESR or AHJ submittal required). Originated from
// R15-Q4 (Modular-only tier) but expanded after the founder restored Deck
// plank to the catalog, recognizing the asymmetric visual treatment implied
// a hierarchy that didn't exist in the documentation.
const TIER_SLUGS: readonly string[] = ['deck', 'deck-modular'];

const DECK_HIGHLIGHTS = [
  {
    icon: Layers,
    label: 'Structural plank — IS the deck surface',
    detail: '30mm long-grain fiber-cement plank, 16″ joist spacing max, hidden stainless-steel clip installation',
  },
  {
    icon: ShieldCheck,
    label: 'Where wood/composite fails',
    detail: 'Coastal humidity, mountain UV, hotel amenity decks, multifamily commercial — fiber-cement outlasts wood-plastic',
  },
  {
    icon: Flame,
    label: 'Requires AHJ alternative-materials approval',
    detail: 'ASTM C1186 Type A + ASTM E-84 Class A — but not prescriptively listed in IRC R507; needs IBC 104.11 submittal',
  },
];

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
  const deck = getProductBySlug('deck');
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

        {/* Outdoor Decking tier — both products, side by side. Both share the
            same fiber-cement material and identical compliance dossier; the
            differentiation is use case (structural vs surface finish), not
            paperwork. Stacks vertically on small screens, side-by-side on md+. */}
        {(deck || deckModular) && (
          <>
            <div className="mt-16 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
                Outdoor decking
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold text-navy md:text-3xl text-balance">
                Two products, two US code paths
              </h2>
              <p className="mt-3 text-ink/75 leading-relaxed">
                Both are PLYCEM fiber-cement — same ASTM C1186 Type A
                substrate, same ASTM E-84 Class A surface burning, same
                ISO 8336 international classification. The decision between
                them isn&apos;t about paperwork. It&apos;s about how the
                product is installed — and which US code path that triggers.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {deck && (
                <article className="overflow-hidden rounded-xl border border-navy/20 bg-white shadow-sm">
                  <div className="relative aspect-[16/9] bg-navy">
                    <Image
                      src={deck.image ?? '/images/products/_placeholder.svg'}
                      alt={`${deck.name} fiber-cement plank — distributed by JARA International`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized={!deck.image}
                    />
                  </div>
                  <div className="p-6 lg:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
                      Structural plank · for new builds
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold text-navy md:text-2xl text-balance">
                      Deck — the plank that IS the deck floor
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80">
                      Long-grain 30mm × 150mm fiber-cement planks fastened
                      to wood or steel joists with hidden stainless-steel
                      clips. Specified for coastal, mountain, hotel, and
                      multifamily amenity decks where wood rots and
                      composite softens. Requires the project team to
                      coordinate AHJ alternative-materials approval under
                      IBC 104.11.
                    </p>

                    <ul className="mt-4 space-y-3">
                      {DECK_HIGHLIGHTS.map((h) => {
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

                    <div className="mt-5">
                      <Link
                        href={`/products/${deck.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                      >
                        View Deck plank specs
                        <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {deckModular && (
                <article className="overflow-hidden rounded-xl border border-navy/20 bg-white shadow-sm">
                  <div className="relative aspect-[16/9] bg-navy">
                    <Image
                      src={deckModular.image ?? '/images/products/_placeholder.svg'}
                      alt={`${deckModular.name} interlocking fiber-cement tiles — distributed by JARA International`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized={!deckModular.image}
                    />
                  </div>
                  <div className="p-6 lg:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
                      Surface tile · for rooftop terraces
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold text-navy md:text-2xl text-balance">
                      Deck Modular — the tile that sits on top
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80">
                      Interlocking 300×300×14mm fiber-cement tiles installed
                      tool-free on top of an already-engineered substrate
                      (concrete slab, OSB+membrane, pedestal pavers).
                      Because they&apos;re a finish — not structural
                      decking — they fit the prescriptive US code path
                      with no ICC-ES ESR or per-project AHJ submittal.
                    </p>

                    <ul className="mt-4 space-y-3">
                      {DECK_MODULAR_HIGHLIGHTS.map((h) => {
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

                    <div className="mt-5">
                      <Link
                        href={`/products/${deckModular.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                      >
                        View Deck Modular specs
                        <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </>
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
