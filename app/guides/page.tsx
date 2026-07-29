import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { jsonLdScript } from '@/lib/jsonld';
import { PRODUCTS } from '@/data/products';
import { getFromPriceUsd, formatUsd } from '@/lib/pricing';

/**
 * /guides — editorial hub for informational (top-of-funnel) queries JARA can win
 * in AI Overviews + Google (R16 audit item 15). Each guide has a query-matched H1,
 * a first-paragraph direct answer, a comparison table/list, internal links to the
 * subfloor product + /pricing, and Article schema with author + dates.
 */

export const metadata: Metadata = {
  title: 'Fiber-Cement Subfloor Guides',
  description:
    'Plain-language guides on non-combustible fiber-cement subfloor: cost, fiber-cement vs plywood/OSB, and Type I & II construction requirements.',
  alternates: {
    canonical: `${SITE.url}/guides`,
    languages: { 'en-US': `${SITE.url}/guides`, 'x-default': `${SITE.url}/guides` },
  },
};

export default function GuidesIndexPage() {
  const subfloor = PRODUCTS.find((p) => p.slug === 'high-performance-subfloor');
  const from = subfloor ? getFromPriceUsd(subfloor) : undefined;

  const GUIDES = [
    {
      slug: 'non-combustible-subfloor-cost',
      title: 'How much does non-combustible fiber-cement subfloor cost?',
      blurb: `Delivered (DDP) prices from ${from != null ? formatUsd(from) : '$74'}/panel, what the price includes, and how to estimate a project.`,
    },
    {
      slug: 'fiber-cement-vs-plywood-subfloor',
      title: 'Fiber-cement vs plywood subfloor',
      blurb: 'Non-combustibility, fire rating, moisture, and the code path compared — where each material fits.',
    },
    {
      slug: 'type-i-ii-construction-subfloor',
      title: 'Subfloor for Type I & II construction',
      blurb: 'Why non-combustible (ASTM E-136) matters and how a UL R15140 subfloor meets it.',
    },
  ];

  // SEO/GEO audit 2026-07-29: ItemList so the hub is legible to extractors as a
  // collection rather than three anonymous cards.
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE.url}/guides#itemlist`,
    name: 'Fiber-cement subfloor guides',
    itemListElement: GUIDES.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      url: `${SITE.url}/guides/${g.slug}`,
    })),
  };

  return (
    <div className="bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(itemList) }}
      />
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <Breadcrumbs
          pageUrl={`${SITE.url}/guides`}
          items={[
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
          ]}
        />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Guides
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Fiber-cement subfloor guides
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          Plain-language answers on non-combustible fiber-cement subfloor — cost,
          material comparison, and code compliance for US construction.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col rounded-lg border border-bluegray/40 bg-white p-5 transition-all hover:border-navy hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              <h2 className="font-display text-base font-semibold text-navy">
                {g.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{g.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                Read guide
                <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-14 max-w-2xl">
          <h2 className="font-display text-xl font-bold text-navy">
            Start with the construction type
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            Almost every question about non-combustible subfloor resolves once the
            construction type per level is settled. IBC Chapter 6 sorts buildings into
            Types I through V, and Types I and II require building elements to be
            non-combustible — a property established by passing ASTM E-136, not by a
            fire-retardant treatment or a Class A flame-spread rating. If the floor deck
            sits in a Type I or II level, wood-based panels are out and the material
            question is already answered.
          </p>
          <p className="mt-3 leading-relaxed text-ink/80">
            The second question is the assembly, not the material: does the floor/ceiling
            need an hourly fire-resistance rating, and which listed design achieves it?
            A rating belongs to a tested assembly — deck, framing, fasteners, and ceiling
            membrane together — so the design number matters as much as the panel. Cost
            comes third, and it is only meaningful as a delivered figure compared across
            complete assemblies.
          </p>

          <h2 className="mt-10 font-display text-xl font-bold text-navy">
            Who these are written for
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            Architects and specifiers confirming a code path before it reaches the AHJ,
            general contractors pricing a rated floor assembly, and developers weighing a
            non-combustible deck against a wood alternative on multifamily, hotel, and
            light-commercial projects. Each guide leads with a direct answer, states the
            standard or code section behind it, and links to the issuing authority so the
            claim can be checked rather than taken on trust.
          </p>
          <p className="mt-3 leading-relaxed text-ink/80">
            JARA supplies the underlying UL assembly references, ASTM reports, and
            evaluation-report documentation as a{' '}
            <Link href="/resources" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy">
              submittal package
            </Link>{' '}
            on request. For the product itself, see{' '}
            <Link href="/products/high-performance-subfloor" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy">
              High Performance Subfloor
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
