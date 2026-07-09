import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, ArrowRight, Truck, ShieldCheck, PackageCheck, FileText, CheckCircle2 } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  plycemOrganizationSchema,
  pricingItemListSchema,
  faqSchema,
  jsonLdScript,
} from '@/lib/jsonld';
import { PRODUCTS, type Product, type ProductVariant } from '@/data/products';
import {
  getPricedVariants,
  getFromPriceUsd,
  isPricedProduct,
  formatUsd,
  formatPerSqFt,
  priceUnitNoun,
  PRICE_CAVEATS,
} from '@/lib/pricing';

/**
 * /pricing — published DDP pricing (Round 16, 2026-07-09).
 *
 * SB-4 authorized 2026-07-06: JARA publishes its own delivered (DDP) list
 * prices. Rebuilt from the ADR-040 quote-only stub. Shows the 3 priced
 * products (Subfloor, Exterior Hidden Joint, Deck) with per-variant prices +
 * the 5 mandatory honesty caveats (R16-Q4), and a visual-parity "Request
 * delivered price" CTA for the 4 quote-only products (R16-Q6=A). Generic
 * "leading brand" positioning is allowed here (R16-Q5=C, SB-3 generic-only).
 */

export const metadata: Metadata = {
  title: 'Fiber-Cement Subfloor Price — DDP, US Delivered',
  description:
    'Fiber-cement subfloor price from $74/panel — delivered (DDP) to your US port, import duty paid, full-container. See per-variant pricing; other panels by quote.',
  alternates: {
    canonical: `${SITE.url}/pricing`,
    languages: {
      'en-US': `${SITE.url}/pricing`,
      'es-US': `${SITE.url}/es/pricing`,
      'x-default': `${SITE.url}/pricing`,
    },
  },
};

function edgeLabel(v: ProductVariant): string {
  if (v.edgeProfile === 'tongue-and-groove') return 'T&G';
  if (v.edgeProfile === 'straight') return 'Straight';
  return '';
}

function PricedProductBlock({ product }: { product: Product }) {
  const priced = getPricedVariants(product);
  const unit = priceUnitNoun(product.slug);
  const from = priced[0]?.priceUsd;
  return (
    <div className="rounded-xl border border-bluegray/40 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-bold text-navy">
          <Link href={`/products/${product.slug}`} className="hover:text-steel">
            {product.name}
          </Link>
        </h3>
        {from !== undefined && (
          <p className="text-sm text-ink/70">
            from <span className="text-lg font-bold text-navy">{formatUsd(from)}</span>
            <span className="text-ink/60">/{unit}</span>
          </p>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-bluegray/40 text-left text-xs uppercase tracking-wide text-steel">
              <th className="py-2 pr-4 font-semibold">Thickness</th>
              <th className="py-2 pr-4 font-semibold">Edge</th>
              <th className="py-2 pr-4 font-semibold">Price / {unit}</th>
              <th className="py-2 font-semibold">~ $/SF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bluegray/25">
            {priced.map(({ variant, priceUsd, pricePerSqFt }) => (
              <tr key={variant.sku}>
                <td className="py-2.5 pr-4 font-medium text-ink">
                  {variant.thicknessImperial} ({variant.thicknessMm} mm)
                </td>
                <td className="py-2.5 pr-4 text-ink/70">{edgeLabel(variant) || '—'}</td>
                <td className="py-2.5 pr-4 font-bold text-navy">
                  {formatUsd(priceUsd)}
                </td>
                <td className="py-2.5 text-ink/70">
                  {pricePerSqFt !== undefined ? formatPerSqFt(pricePerSqFt) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-dark transition-colors"
        >
          Get your delivered price
          <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
        </Link>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 rounded-md border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors"
        >
          Product details
        </Link>
      </div>
    </div>
  );
}

function QuoteOnlyCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col rounded-xl border border-bluegray/40 bg-white p-5">
      <h3 className="font-display text-base font-semibold text-navy">
        <Link href={`/products/${product.slug}`} className="hover:text-steel">
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink/70">
        {product.shortDescription}
      </p>
      <Link
        href="/resources"
        className="mt-4 inline-flex items-center gap-2 self-start rounded-md border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors"
      >
        Request delivered price
        <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
      </Link>
    </div>
  );
}

export default function PricingPage() {
  const priced = PRODUCTS.filter(
    (p) => isPricedProduct(p.slug) && getPricedVariants(p).length > 0,
  );
  const quoteOnly = PRODUCTS.filter(
    (p) => !isPricedProduct(p.slug) || getPricedVariants(p).length === 0,
  );

  // Answer-first cost lede — numbers derived from lib/pricing so they never drift.
  const subfloor = PRODUCTS.find((p) => p.slug === 'high-performance-subfloor');
  const hiddenJoint = PRODUCTS.find((p) => p.slug === 'exterior-hidden-joint');
  const deckProduct = PRODUCTS.find((p) => p.slug === 'deck');
  const subfloorFrom = subfloor ? getFromPriceUsd(subfloor) : undefined;
  const subfloorSf = subfloor ? getPricedVariants(subfloor)[0]?.pricePerSqFt : undefined;
  const hjFrom = hiddenJoint ? getFromPriceUsd(hiddenJoint) : undefined;
  const deckFrom = deckProduct ? getFromPriceUsd(deckProduct) : undefined;
  const subfloorSfLabel = subfloorSf != null ? formatPerSqFt(subfloorSf) : '~$2.30/SF';

  // Price FAQ — shared by the visible <details> list AND the FAQPage schema
  // (content/schema parity). Prices derive from lib/pricing so they can't drift.
  const pricingFaqs = [
    {
      question: 'How much does non-combustible fiber-cement subfloor cost?',
      answer: `JARA High Performance Subfloor starts at ${
        subfloorFrom != null ? formatUsd(subfloorFrom) : '$74'
      } per 4×8 panel (${subfloorSfLabel}), delivered duty-paid (DDP) to a main US base port in full-container (40HQ) quantities. Exterior Hidden Joint starts at ${
        hjFrom != null ? formatUsd(hjFrom) : '$28'
      }/panel and Deck planks at ${
        deckFrom != null ? formatUsd(deckFrom) : '$48'
      }. Prices are indicative; the final delivered price is confirmed by quote.`,
    },
    {
      question: 'What is included in the delivered (DDP) price?',
      answer:
        'The published price is DDP — it includes import duty, ocean freight, US customs clearance, and inland delivery within 50 miles of the port of entry. Beyond 50 miles, additional freight applies. It assumes standard unloading time; overtime and detention are not included.',
    },
    {
      question: 'Is there a minimum order?',
      answer:
        'Published prices are for full-container (40HQ) quantities. Smaller quantities change the per-panel freight — contact us for a delivered price on partial loads.',
    },
    {
      question: 'Do you stock panels in a US warehouse?',
      answer:
        'No. JARA does not operate a US warehouse. Panels are made to order and ship container-direct from the factory, with typical door-to-door delivery of about 3–4 weeks.',
    },
    {
      question: 'Are the published prices final?',
      answer:
        'The published prices are indicative starting prices. Your final delivered price is confirmed by quote once we have your product, quantity, and US port of entry.',
    },
    {
      question: 'How does the price compare to other US options?',
      answer:
        'JARA’s delivered (DDP) prices are set to compete with the leading US non-combustible fiber-cement brands on delivered cost — with import duty already paid and no domestic-warehouse markup.',
    },
  ];

  return (
    <div className="bg-bg-soft">
      {/* Page-level JSON-LD (R16 audit items 11–12): Plycem manufacturer node +
          ItemList of priced products (reuses productSchema) + price FAQPage. The
          BreadcrumbList is emitted by <Breadcrumbs> below, not here. */}
      {[
        plycemOrganizationSchema(),
        pricingItemListSchema(priced),
        faqSchema(`${SITE.url}/pricing`, pricingFaqs),
      ].map((schema, i) => (
        <script
          key={`pricing-jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
        />
      ))}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <Breadcrumbs
          pageUrl={`${SITE.url}/pricing`}
          items={[
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]}
        />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Pricing
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Delivered (DDP) pricing — duty paid, direct from the factory
        </h1>

        {/* Answer-first cost lede (SEO/GEO — R16 audit item 9) */}
        {subfloorFrom != null && hjFrom != null && deckFrom != null && (
          <div className="mt-4 max-w-2xl">
            <h2 className="font-display text-lg font-semibold text-navy">
              How much does non-combustible fiber-cement subfloor cost?
            </h2>
            <p className="mt-2 text-base leading-relaxed text-ink/80">
              JARA High Performance Subfloor starts at{' '}
              <strong className="text-navy">{formatUsd(subfloorFrom)}</strong> per 4×8 panel
              {subfloorSf != null && (
                <> — about <strong className="text-navy">{formatPerSqFt(subfloorSf)}</strong></>
              )}{' '}
              — delivered duty-paid (DDP) to a main US base port in full-container
              (40HQ) quantities. Exterior Hidden Joint from {formatUsd(hjFrom)}/panel;
              Deck planks from {formatUsd(deckFrom)}. Prices are indicative; final
              delivered price confirmed by quote.
            </p>
          </div>
        )}
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          Published prices below are <strong>delivered to your US port of entry
          with import duty paid</strong> — full-container pricing, no
          domestic-warehouse markup. It&rsquo;s how we put non-combustible
          fiber-cement panels on your project at a delivered cost that competes
          with the leading US brands.
        </p>

        {/* Trust chips */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-steel" aria-hidden="true" /> Duty paid (DDP)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-steel" aria-hidden="true" /> ~3–4 week delivery
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PackageCheck className="h-4 w-4 text-steel" aria-hidden="true" /> Full-container (40HQ)
          </span>
        </div>

        {/* Indicative / quote note (founder terms 2026-07-09) */}
        <p className="mt-5 max-w-2xl rounded-md border border-bluegray/40 bg-white px-4 py-3 text-sm leading-relaxed text-ink/75">
          Prices are <strong className="text-navy">indicative</strong> — for full-container loads to a
          main US base port. Your <strong className="text-navy">final delivered price is confirmed by quote</strong>.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink/70">
          Delivery is direct-import (made to order) —{' '}
          <Link
            href="/service-areas"
            className="font-semibold text-navy underline decoration-bluegray underline-offset-4 hover:decoration-navy"
          >
            see how ordering &amp; logistics work
          </Link>
          .
        </p>

        {/* Priced products */}
        <h2 className="sr-only">Delivered prices by product</h2>
        <div className="mt-10 space-y-6">
          {priced.map((p) => (
            <PricedProductBlock key={p.slug} product={p} />
          ))}
        </div>

        {/* Price terms — highlighted GREEN per founder (2026-07-09). DELIBERATE
            override of brand guide §12 (which forbids green): the founder wants this
            important block to stand out. Do NOT revert to navy/on-brand without
            explicit founder direction. See BITACORA. */}
        <div className="mt-8 rounded-lg border border-green-600/45 bg-green-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-700" aria-hidden="true" />
            <h2 className="font-display text-sm font-semibold text-green-800">
              Price terms
            </h2>
          </div>
          <ul className="grid gap-2.5 text-sm text-green-900 sm:grid-cols-2">
            {PRICE_CAVEATS.map((c) => (
              <li key={c} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" strokeWidth={2} />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Quote-only products */}
        {quoteOnly.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-bold text-navy">
              Other products — priced by quote
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
              We deliver these on the same DDP, full-container basis. Ask us for
              a delivered price for your project volume and port of entry.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {quoteOnly.map((p) => (
                <QuoteOnlyCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Price FAQ (R16 audit item 12) — visible, mirrors the FAQPage schema */}
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-navy">
            Pricing — frequently asked
          </h2>
          <ul className="mt-4 divide-y divide-bluegray/30">
            {pricingFaqs.map((faq) => (
              <li key={faq.question}>
                <details className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 list-none rounded-sm py-1 font-medium text-navy hover:text-navy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-steel transition-transform group-open:rotate-45 text-xl leading-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2 pr-7 text-sm leading-relaxed text-ink/80">
                    {faq.answer}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>

        {/* Global CTA */}
        <div className="mt-14 rounded-xl border border-navy/15 bg-navy px-6 py-8 text-white">
          <h2 className="font-display text-xl font-bold">
            Get a delivered price for your project
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
            Tell us the product, volume, and your US port of entry — quotes
            typically return within one business day.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={buildTelUrl(SITE.phonePrimaryRaw)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-white/90 transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              Call Anna · {SITE.phonePrimary}
            </a>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Submit a project brief
              <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
