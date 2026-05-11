import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, ArrowRight, FileText } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * /resources — STUB page (Round 7 F1.R7 fix).
 *
 * Sprint 4 will replace this with the full submittal form (3-step) +
 * document library (UL R15140, ASTM E84, IAPMO ER-360, technical data sheets).
 *
 * IMPORTANT — calculator URL prefill: this stub READS query params (sf, type,
 * thickness, panels) so visitors arriving from MaterialCalculator submit see
 * their inputs acknowledged. When Sprint 4 builds the real form, those params
 * will pre-populate fields. For now we just display them so the user sees
 * "we got your numbers" and the CTA to call Anna or email completes the loop.
 */

type SearchParams = Promise<{ sf?: string; type?: string; thickness?: string; panels?: string }>;

export const metadata: Metadata = {
  title: 'Resources & Submittal Package',
  description:
    'Request a custom quote, sample panel, product datasheets, UL R15140 assembly details, ASTM certificates, IAPMO ER-360 evaluation report, or CSI specifications from JARA International. Submittal form and document library launching this week.',
  alternates: {
    canonical: `${SITE.url}/resources`,
    languages: {
      'en-US': `${SITE.url}/resources`,
      'es-US': `${SITE.url}/es`,
      'x-default': `${SITE.url}/resources`,
    },
  },
};

const documents = [
  { name: 'UL R15140 Certificate of Compliance', type: 'UL Certification' },
  { name: 'ASTM E-84 Class A Fire Testing Certificate', type: 'Fire Testing' },
  { name: 'IAPMO ER-360 Evaluation Report', type: 'Code Compliance' },
  { name: 'Technical Data Sheets (per product)', type: 'Product Spec' },
  { name: 'ASTM C1186 Type A Grade I Compliance', type: 'Material Spec' },
  { name: 'CSI MasterFormat 06 16 00 Specification', type: 'Architect Spec' },
];

export default async function ResourcesStubPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const fromCalculator = !!(params.sf && params.type);

  return (
    <div className="min-h-[60vh] bg-bg-soft">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Resources &amp; Documentation
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Submittal package &amp; document library
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          Submittal form (3-step project intake) and document library launching
          this week. For immediate document requests, call or email — Robertson
          responds within 1 business day with the full PDF packet.
        </p>

        {fromCalculator && (
          <div className="mt-8 rounded-lg border-2 border-navy bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-steel">
              From the calculator
            </p>
            <h2 className="mt-2 font-display text-lg font-bold text-navy">
              Got your project estimate
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {params.sf && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink/55">Square footage</dt>
                  <dd className="mt-0.5 text-base font-semibold text-navy">
                    {Number(params.sf).toLocaleString()} SF
                  </dd>
                </div>
              )}
              {params.type && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink/55">Construction type</dt>
                  <dd className="mt-0.5 text-base font-semibold text-navy">{params.type}</dd>
                </div>
              )}
              {params.thickness && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink/55">Panel thickness</dt>
                  <dd className="mt-0.5 text-base font-semibold text-navy">{params.thickness}mm</dd>
                </div>
              )}
              {params.panels && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink/55">Estimated panels</dt>
                  <dd className="mt-0.5 text-base font-semibold text-navy">~{Number(params.panels).toLocaleString()} panels</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-sm text-ink/75">
              Reference these numbers when you call — Robertson will pull the
              exact spec sheet and quote within 1 business day.
            </p>
          </div>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-navy">
            Documents available on request
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-start gap-3 rounded-lg border border-bluegray/40 bg-white p-4"
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-steel" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-navy">{doc.name}</p>
                  <p className="mt-0.5 text-xs text-ink/55">{doc.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-lg border-2 border-navy bg-white p-6 text-center">
          <h2 className="font-display text-xl font-bold text-navy">
            Request your submittal package now
          </h2>
          <p className="mt-2 text-sm text-ink/75">
            Email Robertson with your project details — receive the full PDF
            packet (UL, ASTM, IAPMO, datasheets) within 1 business day.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent('Submittal package request')}${fromCalculator ? `&body=${encodeURIComponent(`Project size: ${params.sf} SF\nConstruction: ${params.type}\nThickness: ${params.thickness}mm\nEstimated panels: ${params.panels}\n\nPlease send full submittal package with quote.`)}` : ''}`}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors"
            >
              <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              Email {SITE.email}
            </a>
            <a
              href={buildTelUrl(SITE.phonePrimaryRaw)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              Call {SITE.phonePrimary}
            </a>
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-steel hover:text-navy"
          >
            <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
