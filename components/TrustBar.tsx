/**
 * Trust bar — per ADR-025 HD2 (section ordering: trust signals after products).
 *
 * Per Round 6 F3.R6 (convergent): TEXT-ONLY at launch.
 * Reasons:
 * - Plycem ship blocker SB-7 (no Plycem logo without prior approval)
 * - UL/ASTM/IAPMO logos require licensing or permission verification
 * - Wordmark presentation is universally safe
 *
 * Each cert links to the relevant doc in /resources (built in Sprint 4 / 5).
 * For Sprint 2 launch, all links go to /resources (the document library).
 */

import Link from 'next/link';

const certifications = [
  {
    label: 'UL R15140 Classified',
    detail: 'Fire-rated assemblies (H502, H504, H511, U449, U487)',
  },
  {
    label: 'ASTM C1186 Type A Grade I',
    detail: 'Fiber-cement panel standard',
  },
  {
    label: 'IAPMO ER-360',
    detail: 'IBC code compliance evaluation report',
  },
  {
    label: 'ASTM E-84 Class A',
    detail: 'Flame spread 0, smoke developed 0',
  },
  {
    label: 'ASTM E-136',
    detail: 'Non-combustibility',
  },
  {
    label: 'CBC Chapter 7A',
    detail: 'California Building Code compliance',
  },
];

export function TrustBar() {
  return (
    <section
      className="border-y border-bluegray/30 bg-bg-soft py-10 lg:py-12"
      aria-labelledby="trust-bar-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2
          id="trust-bar-heading"
          className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-steel"
        >
          Compliant with the standards your project requires
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {certifications.map((cert) => (
            <Link
              key={cert.label}
              href="/resources"
              title={cert.detail}
              className="group inline-flex flex-col items-center"
            >
              <span className="font-display text-sm font-semibold text-navy group-hover:text-navy-dark transition-colors">
                {cert.label}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-ink/60">
          Full documentation packets — UL Classification reports, ASTM test
          certificates, IAPMO ER-360 — available on request.{' '}
          <Link
            href="/resources"
            className="underline underline-offset-2 hover:text-navy"
          >
            Browse the document library →
          </Link>
        </p>
      </div>
    </section>
  );
}
