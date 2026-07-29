import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SourceCitations } from '@/components/SourceCitations';
import { articleSchema, faqSchema, jsonLdScript } from '@/lib/jsonld';
import { citationSchema, type SourceId } from '@/lib/sources';

const PUBLISHED = '2026-07-09';
// SEO/GEO audit 2026-07-29: substantive rewrite (citations + code path + AHJ
// submittal detail). Bumped so the recrawl is not treated as a no-op.
const MODIFIED = '2026-07-29';
const PAGE_URL = `${SITE.url}/guides/type-i-ii-construction-subfloor`;
const DESC =
  'Subfloor for Type I & II construction: the deck must be non-combustible (ASTM E-136), and a UL R15140 fiber-cement subfloor meets IBC 2021 + CBC 7A.';

const CITED: readonly SourceId[] = [
  'ibcTypes',
  'astmE136',
  'ibcFireProtection',
  'ulCertification',
  'astmE84',
  'cbc7A',
  'iapmoUes',
];

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

const FAQS = [
  {
    question: 'Can plywood or OSB be used as subfloor in Type I or II construction?',
    answer:
      'Not as the non-combustible structural deck. Plywood and OSB are combustible materials and do not pass ASTM E-136, so they cannot serve as a building element required to be non-combustible in Type I and Type II construction. The IBC does permit limited combustible components in otherwise non-combustible buildings — sleepers, nailing blocks, and finish flooring are addressed separately — but that is an allowance for specific components, not a path to a combustible structural deck.',
  },
  {
    question: 'Is "fire-rated" the same as "non-combustible"?',
    answer:
      'No, and conflating them is the most common specification error on this topic. Non-combustible is a property of the material, established by passing ASTM E-136. A fire-resistance rating is a property of an assembly — a specific tested build-up of deck, framing, and ceiling — expressed in hours and established by a tested design such as a UL H-series or U-series listing. A material can be non-combustible and still be in an unrated assembly; an assembly can carry an hourly rating while containing combustible components. Type I and II construction requires the non-combustible material property, and Table 601 separately drives the hourly rating.',
  },
  {
    question: 'What does an AHJ typically ask for on a non-combustible subfloor submittal?',
    answer:
      'Usually four things: the ASTM E-136 non-combustibility report for the panel, the ASTM E-84 surface-burning report, the specific UL assembly design number matching the rating and framing type on the drawings, and an evaluation report tying the product to the adopted code edition. JARA supplies these as a submittal package on request.',
  },
  {
    question: 'Does a podium deck over Type V construction need a non-combustible subfloor?',
    answer:
      'It depends on how the building is classified. A concrete podium with Type V wood-frame construction above is typically a horizontal building separation, and the podium slab itself is the non-combustible element. Where a project instead classifies the upper floors as Type I or II — common in hotels and mid-rise multifamily built on steel or light-gauge framing — the floor deck in those levels must be non-combustible. Confirm the construction type per level with the design team before selecting the deck material.',
  },
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
          Why plywood and OSB do not qualify
        </h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          IBC Chapter 6 sorts buildings into construction Types I through V, and the
          dividing line between Types I/II and the rest is combustibility: the building
          elements in Type I and Type II construction are required to be non-combustible.
          Non-combustible is not a marketing adjective in this context — it is a pass on
          ASTM E-136, in which specimens are held in a vertical tube furnace at 750 °C and
          judged on weight loss, temperature rise, and sustained flaming.
        </p>
        <p className="mt-3 leading-relaxed text-ink/80">
          Wood-based panels do not pass that test. Fire-retardant treatment does not change
          the outcome either: treatment improves surface-burning performance measured under
          ASTM E-84, but a fire-retardant-treated wood panel is still a combustible material.
          This is the distinction that most often surfaces late in a project — a product
          sheet advertising a Class A flame spread is describing ASTM E-84 results, not
          ASTM E-136 non-combustibility, and only the latter satisfies the Type I/II
          material requirement.
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

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          Material property vs. assembly rating
        </h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Two separate requirements run in parallel, and a complete submittal has to answer
          both. The first is the material question — is the deck non-combustible? That is
          ASTM E-136, and it is a property of the panel itself. The second is the assembly
          question — does the floor/ceiling carry the hourly fire-resistance rating that
          Table 601 requires for this construction type and building element? That rating
          belongs to a tested assembly, not to any single product in it, and it is
          established by a listed design that fixes the deck, the framing, the fasteners,
          the cavity, and the ceiling membrane.
        </p>
        <p className="mt-3 leading-relaxed text-ink/80">
          For this panel the applicable UL designs are H502, H504, and H511 for wood- and
          steel-joist floor/ceiling assemblies, plus U449 and U487, spanning 1-hour and
          2-hour ratings under UL file R15140. Substituting a component — a different
          fastener schedule, a different ceiling board, a different joist spacing — voids
          the listing. Specify the design number, not just the product.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">Where it is specified</h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Multifamily Type V over a concrete podium, hotels, steel-joist Type I/II
          commercial floors, and modular construction — assemblies where a combustible
          plywood deck is not permitted or where the floor/ceiling must carry a fire
          rating. JARA provides the UL assembly references, ASTM reports, and the IAPMO
          evaluation report needed for AHJ submittal.
        </p>
        <p className="mt-3 leading-relaxed text-ink/80">
          In California, projects inside a Wildland-Urban Interface zone pick up a further
          layer: CBC Chapter 7A governs materials and construction methods for exterior
          wildfire exposure, which is why the Chapter 7A reference appears alongside the
          IBC citations in the compliance dossier.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          Common questions
        </h2>
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
            <Link href="/guides/fiber-cement-vs-plywood-subfloor" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy">
              Fiber-cement vs plywood subfloor
            </Link>{' '}
            — the material comparison behind the code requirement on this page.
          </li>
          <li>
            <Link href="/guides/non-combustible-subfloor-cost" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy">
              Non-combustible subfloor cost
            </Link>{' '}
            — delivered DDP pricing per thickness and how to estimate a project.
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
