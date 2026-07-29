import { ExternalLink } from 'lucide-react';
import { getSources, type SourceId } from '@/lib/sources';

/**
 * "Sources & verification" block for answer-first pages.
 *
 * SEO/GEO audit 2026-07-29 (gap P1). The crawl found zero outbound citations
 * across the whole site while the copy asserts ~8 code/compliance claims. For
 * a building-code topic that is an E-E-A-T deficit for search and, more
 * costly, a corroboration deficit for AI answer engines — which preferentially
 * synthesize from claims they can trace to an issuing authority.
 *
 * Design intent:
 * - Links point at the *issuing body* (ASTM, ICC, UL, IAPMO), never a reseller
 *   or a summary blog, so the citation carries real authority weight.
 * - Links are followed, not `nofollow`. Outbound links to standards bodies are
 *   a trust signal; suppressing them would forfeit the entire point of the block.
 * - Paywalled/registration-walled targets are labeled, so a reader hitting a
 *   login wall does not read it as a broken or bogus reference.
 * - Each entry states what it substantiates. A bare link list is decoration;
 *   a claim→authority mapping is evidence.
 */

export function SourceCitations({
  ids,
  heading = 'Sources & verification',
  note,
}: {
  ids: readonly SourceId[];
  heading?: string;
  /** Optional lead-in shown above the list. */
  note?: string;
}) {
  const sources = getSources(ids);
  if (sources.length === 0) return null;

  return (
    <section
      aria-labelledby="source-citations-heading"
      className="mt-12 rounded-lg border border-bluegray/40 bg-white p-5 lg:p-6"
    >
      <h2
        id="source-citations-heading"
        className="font-display text-sm font-semibold uppercase tracking-wider text-navy"
      >
        {heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        {note ??
          'Every code and certification claim on this page traces to the body that issues it. Verify against the source before specifying — JARA supplies the underlying reports for AHJ submittal on request.'}
      </p>
      <ol className="mt-4 space-y-3">
        {sources.map((s) => (
          <li key={s.id} className="text-sm leading-relaxed">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1 font-semibold text-navy underline decoration-navy/30 underline-offset-2 transition-colors hover:decoration-navy"
            >
              {s.label}
              <ExternalLink
                className="h-3 w-3 shrink-0 self-center"
                aria-hidden="true"
                strokeWidth={2}
              />
            </a>
            <span className="text-ink/60"> — {s.publisher}</span>
            {s.access === 'paywalled' && (
              <span className="text-ink/50"> (standard sold by the publisher)</span>
            )}
            {s.access === 'registration' && (
              <span className="text-ink/50"> (free account required)</span>
            )}
            {s.validThrough && (
              <span className="text-ink/60">
                {' '}
                · report edition valid through {s.validThrough}; confirm current status with
                the issuing body before relying on it for submittal
              </span>
            )}
            <p className="mt-1 text-ink/75">{s.substantiates}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
