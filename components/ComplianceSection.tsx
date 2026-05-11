import { FileText } from 'lucide-react';
import type { Product } from '@/data/products';

/**
 * Compliance & certifications panel (Round 8 PE1 section 3).
 *
 * Renders standards + details from `product.compliance[]`. Standards are
 * surfaced as <strong> for visual + semantic emphasis; details follow as
 * supporting prose. Used by JSON-LD productSchema's additionalProperty too,
 * so the same data drives both human-readable UI and structured data.
 */

export function ComplianceSection({ product }: { product: Product }) {
  if (product.compliance.length === 0) return null;

  return (
    <section className="rounded-lg border border-bluegray/40 bg-white p-5 md:p-6">
      <h2 className="font-display text-xl font-semibold text-navy">
        Compliance &amp; certifications
      </h2>
      <p className="mt-1 text-sm text-ink/70">
        Test reports and assembly references available on request for AHJ submittal.
      </p>
      <ul className="mt-4 space-y-3">
        {product.compliance.map((cert) => (
          <li key={cert.standard} className="flex gap-3">
            <FileText
              className="mt-0.5 h-4 w-4 shrink-0 text-steel"
              aria-hidden="true"
              strokeWidth={2}
            />
            <span className="text-sm leading-relaxed text-ink/85">
              <strong className="text-navy">{cert.standard}</strong>
              <span className="text-ink/65"> — {cert.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
