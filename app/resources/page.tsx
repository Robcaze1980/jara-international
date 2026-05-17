import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';
import { SectionNav } from '@/components/SectionNav';
import { SubmittalForm } from '@/components/SubmittalForm';
import { DocumentLibrary } from '@/components/DocumentLibrary';

/**
 * /resources — Sprint 4 step 5 — full composition.
 *
 * Replaces the Sprint 2 cleanup stub with the production submittal flow.
 * Per ADR-035 (B1 3-step form) + ADR-037 (E2 slim 4-doc library) +
 * ADR-034 (A1 SectionNav for in-page navigation) + ADR-042 (T2 Turnstile)
 * + C15 (/es/ counterpart sibling).
 *
 * The calculator URL prefill is preserved from the Sprint 2 stub —
 * visitors arriving from MaterialCalculator's "Get full quote" button see
 * their inputs acknowledged in the prefill banner AND get those values
 * pre-populated into the SubmittalForm's step 1 + step 2 fields.
 *
 * Page sections (id'd for SectionNav scroll-spy):
 *   #request   — header + SubmittalForm
 *   #library   — DocumentLibrary
 *   #contact   — quick-contact card pointing to /contact full page
 */

type SearchParams = Promise<{
  sf?: string;
  type?: string;
  thickness?: string;
  panels?: string;
}>;

export const metadata: Metadata = {
  title: 'Resources & Submittal Package',
  description:
    'Request a custom quote, project submittal package, UL R15140 certificate, ASTM E-84 fire testing certificate, IAPMO ER-360 evaluation report, or product technical data sheets from JARA International. 3-step submittal form + 4-doc library + bilingual support.',
  alternates: {
    canonical: `${SITE.url}/resources`,
    languages: {
      'en-US': `${SITE.url}/resources`,
      'es-US': `${SITE.url}/es/resources`,
      'x-default': `${SITE.url}/resources`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    url: `${SITE.url}/resources`,
    siteName: SITE.name,
    title: `Resources & Submittal · ${SITE.name}`,
    description:
      '3-step project submittal form + 4-document compliance library. Quotes returned within 1 business day.',
  },
};

const SECTIONS = [
  { id: 'request', label: 'Submittal form' },
  { id: 'library', label: 'Document library' },
  { id: 'contact', label: 'Contact' },
];

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const fromCalculator = !!(params.sf && params.type);
  const thicknessLabel = params.thickness ? `${params.thickness}mm` : null;

  // Build SubmittalForm prefill from calculator URL params
  const prefill: Parameters<typeof SubmittalForm>[0]['prefill'] = {};
  if (params.sf) prefill.estimatedArea = params.sf;
  if (thicknessLabel && ['20mm', '22mm', '25mm', '30mm'].includes(thicknessLabel)) {
    prefill.panelThickness = [thicknessLabel];
  }

  return (
    <div className="bg-bg-soft">
      {/* Header strip */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8 lg:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Resources & Documentation
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Submittal package &amp; document library
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/80">
          Fill out the 3-step project submittal form to receive a custom quote
          + compliance documentation, or request individual documents from the
          library below. Robertson responds within 1 business day on every
          request.
        </p>
      </section>

      {/* Main content with SectionNav */}
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="flex gap-8">
          <SectionNav sections={SECTIONS} ariaLabel="Resources sections" />

          <div className="min-w-0 flex-1 space-y-14">
            {/* Calculator prefill banner */}
            {fromCalculator && (
              <section
                id="from-calculator"
                aria-labelledby="prefill-heading"
                className="scroll-mt-20 rounded-lg border-2 border-navy bg-white p-6 md:p-8 shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                  From your calculator estimate
                </p>
                <h2
                  id="prefill-heading"
                  className="mt-2 font-display text-lg font-bold text-navy"
                >
                  Your inputs have been pre-filled below
                </h2>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {params.sf && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-ink/55">
                        Square footage
                      </dt>
                      <dd className="mt-0.5 text-base font-semibold text-navy">
                        {Number(params.sf).toLocaleString()} SF
                      </dd>
                    </div>
                  )}
                  {params.type && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-ink/55">
                        Construction type
                      </dt>
                      <dd className="mt-0.5 text-base font-semibold text-navy">
                        {params.type}
                      </dd>
                    </div>
                  )}
                  {thicknessLabel && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-ink/55">
                        Panel thickness
                      </dt>
                      <dd className="mt-0.5 text-base font-semibold text-navy">
                        {thicknessLabel}
                      </dd>
                    </div>
                  )}
                  {params.panels && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-ink/55">
                        Estimated panels
                      </dt>
                      <dd className="mt-0.5 text-base font-semibold text-navy">
                        ~{Number(params.panels).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            {/* Section 1 — Submittal form */}
            <section
              id="request"
              aria-labelledby="request-heading"
              className="scroll-mt-20"
            >
              <h2
                id="request-heading"
                className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
              >
                Project submittal form
              </h2>
              <p className="mt-2 max-w-2xl text-ink/75 leading-relaxed">
                Three steps: project context, product requirements, contact +
                document selection. Robertson reviews each submission
                personally and responds within 1 business day.
              </p>
              <div className="mt-6">
                <SubmittalForm prefill={prefill} />
              </div>
            </section>

            {/* Section 2 — Document library */}
            <section
              id="library"
              aria-labelledby="library-heading"
              className="scroll-mt-20"
            >
              <h2
                id="library-heading"
                className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
              >
                Document library
              </h2>
              <p className="mt-2 max-w-2xl text-ink/75 leading-relaxed">
                Request specific compliance documents — UL R15140 fire-rated
                assembly classification, ASTM E-84 fire testing, IAPMO ER-360
                evaluation report, and per-product technical data sheets.
                Robertson sends the PDF to your email within 1 business day.
              </p>
              <div className="mt-6">
                <DocumentLibrary />
              </div>
            </section>

            {/* Section 3 — Contact */}
            <section
              id="contact"
              aria-labelledby="contact-heading"
              className="scroll-mt-20 rounded-lg bg-navy p-6 md:p-8 text-white"
            >
              <h2
                id="contact-heading"
                className="font-display text-xl font-bold md:text-2xl text-balance"
              >
                Need to talk first?
              </h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-white/85">
                If your project is moving fast or you want to verify product
                fit before filling out the form, call our 24/7 sales line or
                email Robertson directly.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={buildTelUrl(SITE.phonePrimaryRaw)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-bluegray transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                  Call {SITE.phonePrimary}
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                  Email {SITE.email}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Full contact page
                  <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
