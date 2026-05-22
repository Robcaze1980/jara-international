import { AlertCircle } from 'lucide-react';

/**
 * Cert-gap warning callout for product detail pages.
 *
 * Per Round 11 R11-D (5-0 unanimous) and R11-E (4-1 strong majority): products
 * whose compliance dossier lacks a US-market-critical certification (ICC-ES
 * ESR for lap siding, UL Class A roof rating for corrugated tile) must surface
 * the gap above the fold — never relying solely on FAQ disclosure that
 * specifiers can skim past.
 *
 * 2026-05-21: Founder requested switch to a white background. Border and
 * text retain amber tones so the callout still reads as a deliberate
 * disclosure (not a generic info box), but the panel sits flat on the
 * surrounding white surface instead of floating in a colored band. WCAG
 * contrast improves — amber-900 (#78350F) on white (#FFFFFF) computes to
 * ~12.6:1, exceeding AA-large (4.5:1) and AAA-normal (7:1).
 *
 * Used by `app/products/[slug]/page.tsx` via a per-slug content map; renders
 * only for products whose slug appears in that map.
 */

export type CertGapWarningContent = {
  /** Short uppercase eyebrow label, e.g. "Not UL Class A fire-rated" */
  title: string;
  /** Body paragraph explaining the specific cert gap and what it means for US specifiers */
  body: string;
};

export function CertGapWarning({ title, body }: CertGapWarningContent) {
  return (
    <div
      role="note"
      aria-label="Certification gap disclosure"
      className="mb-8 rounded-lg border-2 border-amber-500/40 bg-white p-5 lg:p-6"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
          aria-hidden="true"
          strokeWidth={2}
        />
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-amber-900">
            {title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-900/90">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
