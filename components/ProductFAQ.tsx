import type { Product } from '@/data/products';
import { faqSchema, jsonLdScript } from '@/lib/jsonld';

/**
 * Product FAQ section (Round 8 PE1 section 4).
 *
 * Emits FAQPage JSON-LD with collision-safe @id (Round 8 F1.R8 — canonical#faq)
 * and renders the same content visibly so Google does not flag schema/content
 * mismatch. Uses native <details>/<summary> for keyboard-accessible expand
 * behavior with zero client JS.
 */

export function ProductFAQ({ product, pageUrl }: { product: Product; pageUrl: string }) {
  if (product.faqs.length === 0) return null;

  return (
    <section className="rounded-lg border border-bluegray/40 bg-white p-5 md:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(faqSchema(pageUrl, product.faqs)),
        }}
      />
      <h2 className="font-display text-xl font-semibold text-navy">
        Frequently asked questions
      </h2>
      <p className="mt-1 text-sm text-ink/70">
        Common technical and specification questions for {product.name}.
      </p>
      <ul className="mt-4 divide-y divide-bluegray/30">
        {product.faqs.map((faq) => (
          <li key={faq.question}>
            <details className="group py-3">
              <summary className="flex cursor-pointer items-center justify-between gap-3 list-none rounded-sm py-1 font-medium text-navy hover:text-navy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-steel transition-transform group-open:rotate-45 text-xl leading-none"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 pr-7 text-sm leading-relaxed text-ink/80">
                {faq.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
