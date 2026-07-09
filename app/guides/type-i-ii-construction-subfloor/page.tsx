import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { articleSchema, jsonLdScript } from '@/lib/jsonld';

const PUBLISHED = '2026-07-09';
const MODIFIED = '2026-07-09';
const PAGE_URL = `${SITE.url}/guides/type-i-ii-construction-subfloor`;
const DESC =
  'Subfloor for Type I and II construction: why the deck must be non-combustible (ASTM E-136) and how a UL R15140 fiber-cement subfloor meets IBC 2021 and CBC Chapter 7A.';

export const metadata: Metadata = {
  title: 'Subfloor for Type I & II Construction',
  description: DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-US': PAGE_URL, 'x-default': PAGE_URL },
  },
};

const REQUIREMENTS: Array<[string, string]> = [
  ['Non-combustible material', 'ASTM E-136 non-combustibility is the defining test for Type I/II elements.'],
  ['Surface burning', 'ASTM E-84 Class A (flame spread 0, smoke developed 0).'],
  ['Fire-rated assembly', 'UL R15140 classified assemblies (H502, H504, H511, U449, U487) for 1-hour and 2-hour floor/ceiling ratings.'],
  ['Code recognition', 'IBC 2021 Type I/II references (§602, §711, §803, Table 601); IAPMO ER-360 evaluation report.'],
  ['Wildfire (WUI)', 'California Building Code Chapter 7A + §420 for Wildland-Urban Interface zones.'],
];

export default function TypeIIISubfloorGuide() {
  return (
    <div className="bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            articleSchema({
              pageUrl: PAGE_URL,
              headline: 'Subfloor for Type I and II construction',
              description: DESC,
              datePublished: PUBLISHED,
              dateModified: MODIFIED,
            }),
          ),
        }}
      />
      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <Breadcrumbs
          pageUrl={PAGE_URL}
          items={[
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: 'Type I & II construction subfloor', path: '/guides/type-i-ii-construction-subfloor' },
          ]}
        />
        <h1 className="mt-6 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Subfloor for Type I and II construction
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/85">
          <strong className="text-navy">Direct answer:</strong> Type I and II are the
          non-combustible construction types, so the structural floor deck must be a
          <strong> non-combustible material (ASTM E-136)</strong> — which rules out plywood
          and OSB. JARA High Performance Subfloor is a fiber-cement structural panel that is
          non-combustible per ASTM E-136, ASTM E-84 Class A, and <strong>UL R15140</strong>{' '}
          classified for 1-hour and 2-hour fire-rated floor/ceiling assemblies, with IBC
          2021 Type I/II recognition and California Building Code Chapter 7A compliance for
          wildfire zones.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          What a Type I/II subfloor must satisfy
        </h2>
        <dl className="mt-4 space-y-4">
          {REQUIREMENTS.map(([term, detail]) => (
            <div key={term} className="rounded-lg border border-bluegray/40 bg-white p-4">
              <dt className="font-display text-sm font-semibold text-navy">{term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink/80">{detail}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">Where it is specified</h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Multifamily Type V over a concrete podium, hotels, steel-joist Type I/II
          commercial floors, and modular construction — assemblies where a combustible
          plywood deck is not permitted or where the floor/ceiling must carry a fire
          rating. JARA provides the UL assembly references, ASTM reports, and the IAPMO
          evaluation report needed for AHJ submittal.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/products/high-performance-subfloor"
            className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
          >
            High Performance Subfloor specs
            <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-md border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white"
          >
            See delivered (DDP) pricing
          </Link>
        </div>
      </article>
    </div>
  );
}
