import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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

const GUIDES = [
  {
    slug: 'non-combustible-subfloor-cost',
    title: 'How much does non-combustible fiber-cement subfloor cost?',
    blurb: 'Delivered (DDP) prices from $74/panel, what the price includes, and how to estimate a project.',
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

export default function GuidesIndexPage() {
  return (
    <div className="bg-bg-soft">
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
      </section>
    </div>
  );
}
