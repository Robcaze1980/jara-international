import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { articleSchema, jsonLdScript } from '@/lib/jsonld';

const PUBLISHED = '2026-07-09';
const MODIFIED = '2026-07-09';
const PAGE_URL = `${SITE.url}/guides/fiber-cement-vs-plywood-subfloor`;
const DESC =
  'Fiber-cement vs plywood/OSB subfloor compared: non-combustibility, fire-rated assemblies, moisture, and the code path — and where each material fits.';

export const metadata: Metadata = {
  title: 'Fiber-Cement vs Plywood Subfloor',
  description: DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-US': PAGE_URL, 'x-default': PAGE_URL },
  },
};

const ROWS: Array<[string, string, string]> = [
  ['Combustibility', 'Non-combustible (ASTM E-136)', 'Combustible (wood-based)'],
  ['Fire-rated floor assemblies', 'UL R15140 classified (1-hour & 2-hour)', 'Not inherently rated; relies on the assembly'],
  ['Type I & II construction', 'Permitted — a non-combustible material', 'Restricted in non-combustible construction types'],
  ['Moisture & rot', 'Dimensionally stable; will not rot or delaminate', 'Swells, delaminates, and can rot when wet'],
  ['Mold & termites', 'Inert cement matrix', 'Organic — vulnerable to mold and insects'],
  ['Install', 'Screw-fastened, dry install', 'Screw/nail-fastened, dry install'],
  ['Delivered cost', 'From $74/panel, DDP (duty paid)', 'Lower material cost; combustible'],
];

export default function FiberCementVsPlywoodGuide() {
  return (
    <div className="bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            articleSchema({
              pageUrl: PAGE_URL,
              headline: 'Fiber-cement vs plywood subfloor: which for non-combustible floors?',
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
            { name: 'Fiber-cement vs plywood subfloor', path: '/guides/fiber-cement-vs-plywood-subfloor' },
          ]}
        />
        <h1 className="mt-6 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Fiber-cement vs plywood subfloor: which for non-combustible floors?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/85">
          <strong className="text-navy">Direct answer:</strong> Plywood and OSB are
          combustible wood-based panels, so they cannot serve as the non-combustible
          element in Type I and II construction. A fiber-cement structural subfloor such
          as JARA High Performance Subfloor is <strong>non-combustible per ASTM E-136</strong>{' '}
          and <strong>UL R15140 classified</strong> for 1-hour and 2-hour fire-rated floor
          assemblies — so it is specified where fire rating, moisture resistance, or a
          non-combustible construction type rules plywood out. Where combustibility is not
          restricted and lowest material cost governs, plywood/OSB remains the common choice.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">Side by side</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-bluegray/40 bg-white">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-bluegray/40 text-left text-xs uppercase tracking-wide text-steel">
                <th className="px-4 py-2.5 font-semibold">Attribute</th>
                <th className="px-4 py-2.5 font-semibold text-navy">Fiber-cement subfloor</th>
                <th className="px-4 py-2.5 font-semibold">Plywood / OSB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bluegray/25">
              {ROWS.map(([attr, fc, ply]) => (
                <tr key={attr}>
                  <td className="px-4 py-2.5 font-medium text-ink">{attr}</td>
                  <td className="px-4 py-2.5 font-medium text-navy">{fc}</td>
                  <td className="px-4 py-2.5 text-ink/70">{ply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">When each fits</h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Choose a <strong>non-combustible fiber-cement subfloor</strong> for multifamily
          Type V over podium, hotels, steel-joist Type I/II commercial floors, modular
          construction, and wildfire (WUI) zones — anywhere the assembly must carry a fire
          rating or the construction type demands a non-combustible deck. Plywood/OSB
          stays appropriate for combustible construction types where a fire-rated or
          non-combustible floor is not required and material cost is the priority.
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
