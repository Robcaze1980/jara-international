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
 * Visual pattern intentionally mirrors the amber callout on `/long-beach-stock`
 * for brand-consistency cueing: a returning specifier sees one amber pattern,
 * recognizes "honest disclosure". Color choice (amber-50 bg + amber-900 text
 * on white) verified WCAG 2.1 AA — Tailwind amber-50 (#FFFBEB) / amber-900
 * (#78350F) = ~10.6:1 contrast ratio.
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
      className="mb-8 rounded-lg border-2 border-amber-500/40 bg-amber-50 p-5 lg:p-6"
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
