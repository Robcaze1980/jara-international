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
 *
 * Sprint 4 step 9 update — ADR-043 V3 (Round 10 5-0 unanimous):
 * IAPMO ER-360 promoted to position 2 (immediately after UL R15140) and
 * marked as `featured` so a small ★ glyph renders next to the wordmark.
 * Per Phase 0.5 audit, ER-360 is the highest-value US-architect signal we
 * carry. Expiration date (2026-07-31, C2) surfaced as inline subtext.
 *
 * C11 audit (Sprint 4 cleanup): 7-cert parity vs v0 dossier K-12. Current
 * surface = 6 architect-facing certs. v0 surfaced 7 — but 3 of v0's were
 * manufacturer ISO certs (ISO 9001/14001/45001) and one was "Esencial
 * Costa Rica," all reasonable for a manufacturer-branded site but off-
 * positioning for JARA-as-US-distributor. Current 6-cert mix is intentional:
 * trades 3 manufacturer certs + 1 origin badge for ER-360 + ASTM E-136 +
 * CBC Chapter 7A (all US-architect-salient). Documented here as a design
 * choice, NOT a regression.
 */

import { Star } from 'lucide-react';
import Link from 'next/link';

type Certification = {
  label: string;
  detail: string;
  featured?: boolean;
  /** Optional inline subtext rendered under the wordmark when featured. */
  subtext?: string;
};

const certifications: Certification[] = [
  {
    label: 'UL R15140 Classified',
    detail: 'Fire-rated assemblies (H502, H504, H511, U449, U487)',
  },
  {
    label: 'IAPMO ER-360',
    detail:
      'IBC code compliance evaluation report (IBC 2015/2012 + IRC) — valid through 2026-07-31',
    featured: true,
    subtext: 'Valid through 2026-07-31',
  },
  {
    label: 'ASTM C1186 Type A Grade I',
    detail: 'Fiber-cement panel standard',
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

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {certifications.map((cert) => (
            <Link
              key={cert.label}
              href="/resources"
              title={cert.detail}
              className="group inline-flex flex-col items-center text-center"
            >
              <span className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-navy group-hover:text-navy-dark transition-colors">
                {cert.featured && (
                  <Star
                    className="h-3.5 w-3.5 fill-steel text-steel"
                    aria-label="Featured certification"
                    strokeWidth={1.5}
                  />
                )}
                {cert.label}
              </span>
              {cert.subtext && (
                <span className="mt-0.5 text-[11px] font-medium text-steel">
                  {cert.subtext}
                </span>
              )}
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
