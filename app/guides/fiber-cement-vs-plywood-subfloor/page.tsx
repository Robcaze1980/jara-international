import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SourceCitations } from '@/components/SourceCitations';
import { articleSchema, faqSchema, jsonLdScript } from '@/lib/jsonld';
import { citationSchema, type SourceId } from '@/lib/sources';
import { PRODUCTS } from '@/data/products';
import { getFromPriceUsd, formatUsd } from '@/lib/pricing';

const PUBLISHED = '2026-07-09';
// SEO/GEO audit 2026-07-29: substantive rewrite (citations, code path, FAQ).
const MODIFIED = '2026-07-29';
const PAGE_URL = `${SITE.url}/guides/fiber-cement-vs-plywood-subfloor`;
const DESC =
  'Fiber-cement vs plywood/OSB subfloor compared: non-combustibility, fire-rated assemblies, moisture, and the code path — and where each material fits.';

const CITED: readonly SourceId[] = [
  'astmE136',
  'ibcTypes',
  'astmC1186',
  'astmE84',
  'ulCertification',
];

export const metadata: Metadata = {
  title: 'Fiber-Cement vs Plywood Subfloor',
  description: DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-US': PAGE_URL, 'x-default': PAGE_URL },
  },
};

const FAQS = [
  {
    question: 'Is fiber-cement subfloor stronger than plywood?',
    answer:
      'They fail differently, so "stronger" depends on the demand. Plywood carries load through cross-laminated wood plies and is comparatively forgiving in bending and impact. A fiber-cement structural panel is a cement matrix — dimensionally stable, hard-wearing, and unaffected by moisture cycling, but more brittle under point impact and dependent on the specified joist spacing and fastener schedule for its rated span. Design to the manufacturer span tables rather than substituting one for the other on thickness alone.',
  },
  {
    question: 'Does fire-retardant-treated plywood satisfy a non-combustible requirement?',
    answer:
      'No. Fire-retardant treatment improves surface-burning performance measured under ASTM E-84, but treated plywood remains a combustible wood-based material and does not pass ASTM E-136. Where the code requires a non-combustible building element, treatment does not close the gap.',
  },
  {
    question: 'Can fiber-cement subfloor go directly over existing plywood?',
    answer:
      'In a remodel it is often installed as an overlay, but that does not convert the floor into a non-combustible assembly — the combustible deck is still there underneath. As an overlay it is being used for moisture stability and as a tile or finish substrate, not to satisfy a Type I/II material requirement.',
  },
  {
    question: 'Is fiber-cement subfloor heavier than plywood?',
    answer:
      'Yes, substantially. A cement-matrix panel weighs several times what an equivalent wood panel does, which affects structural dead load, crew handling, and how many panels fit in a container. Confirm the dead-load allowance with the structural engineer early — it is the most common reason a late material substitution does not work.',
  },
];

export default function FiberCementVsPlywoodGuide() {
  const subfloor = PRODUCTS.find((p) => p.slug === 'high-performance-subfloor');
  const from = subfloor ? getFromPriceUsd(subfloor) : undefined;

  // Sourced from lib/pricing so the delivered figure cannot drift from the
  // single price source of truth (see check_pricing_parity.mjs).
  const ROWS: Array<[string, string, string]> = [
    ['Combustibility', 'Non-combustible (ASTM E-136)', 'Combustible (wood-based)'],
    ['Fire-rated floor assemblies', 'UL R15140 classified (1-hour & 2-hour)', 'Not inherently rated; relies on the assembly'],
    ['Type I & II construction', 'Permitted — a non-combustible material', 'Restricted in non-combustible construction types'],
    ['Moisture & rot', 'Dimensionally stable; will not rot or delaminate', 'Swells, delaminates, and can rot when wet'],
    ['Mold & termites', 'Inert cement matrix', 'Organic — vulnerable to mold and insects'],
    ['Install', 'Screw-fastened, dry install', 'Screw/nail-fastened, dry install'],
    [
      'Delivered cost',
      `From ${from != null ? formatUsd(from) : '$74'}/panel, DDP (duty paid)`,
      'Lower material cost; combustible',
    ],
  ];

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
              citations: citationSchema(CITED),
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema(PAGE_URL, FAQS)) }}
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

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          The difference that actually drives the decision
        </h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Most of the rows above are secondary. The one that decides the specification is
          combustibility, because it is the only row that can make a material
          non-compliant rather than merely sub-optimal. IBC Chapter 6 requires building
          elements in Type I and Type II construction to be non-combustible, and
          non-combustible has a test behind it: ASTM E-136, a vertical tube furnace held at
          750 °C. Wood-based panels do not pass it. No grade of plywood, and no
          fire-retardant treatment, changes that result.
        </p>
        <p className="mt-3 leading-relaxed text-ink/80">
          Everything else — moisture behavior, mold, termites, dimensional stability — is a
          durability argument that a project can reasonably decide either way on cost. The
          code argument is not negotiable, which is why the material question usually
          resolves as soon as the construction type per level is confirmed.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          Where the cost comparison is misleading
        </h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Comparing per-panel prices understates the picture in both directions. Plywood is
          cheaper as a material and will stay cheaper. But where a fire-rated assembly is
          required, the honest comparison is not panel vs panel — it is the full rated
          assembly against the alternative rated assembly, including the ceiling membrane,
          any topping, and the labor to build each. A non-combustible deck can remove a
          layer that a wood-deck assembly needs to reach the same rating.
        </p>
        <p className="mt-3 leading-relaxed text-ink/80">
          On the fiber-cement side, the delivered figure is what matters rather than the
          factory price: JARA ships container-direct on a DDP basis, so duty and freight to
          a US base port are already inside the number, but the lead time is roughly 3–4
          weeks door to door. Schedule, not price, is usually the real constraint. See{' '}
          <Link href="/guides/non-combustible-subfloor-cost" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy">
            non-combustible subfloor cost
          </Link>{' '}
          for the per-thickness breakdown.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">When each fits</h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Choose a <strong>non-combustible fiber-cement subfloor</strong> for multifamily
          Type V over podium, hotels, steel-joist Type I/II commercial floors, modular
          construction, and wildfire (WUI) zones — anywhere the assembly must carry a fire
          rating or the construction type demands a non-combustible deck. Plywood/OSB
          stays appropriate for combustible construction types where a fire-rated or
          non-combustible floor is not required and material cost is the priority.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">Common questions</h2>
        <div className="mt-4 space-y-4">
          {FAQS.map((f) => (
            <details
              key={f.question}
              className="group rounded-lg border border-bluegray/40 bg-white p-4"
            >
              <summary className="cursor-pointer font-display text-sm font-semibold text-navy marker:content-none">
                {f.question}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{f.answer}</p>
            </details>
          ))}
        </div>

        <SourceCitations ids={CITED} />

        <h2 className="mt-12 font-display text-xl font-bold text-navy">Related guides</h2>
        <ul className="mt-3 space-y-2 text-ink/85">
          <li>
            <Link href="/guides/type-i-ii-construction-subfloor" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy">
              Subfloor for Type I &amp; II construction
            </Link>{' '}
            — the code path that makes combustibility decisive.
          </li>
          <li>
            <Link href="/guides/non-combustible-subfloor-cost" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy">
              Non-combustible subfloor cost
            </Link>{' '}
            — delivered DDP pricing per thickness.
          </li>
        </ul>

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
