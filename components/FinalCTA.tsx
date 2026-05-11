import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * Final CTA section — end-of-page conversion ask.
 *
 * Per ADR-005 E3 lock: emphasizes phone (Anna AI agent) + form path.
 * NO PRICE per Plycem ship blocker SB-4.
 */

export function FinalCTA() {
  return (
    <section className="bg-navy py-16 lg:py-24" aria-labelledby="final-cta-heading">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2
          id="final-cta-heading"
          className="font-display text-3xl font-bold text-white md:text-4xl text-balance"
        >
          Ready to spec fiber-cement panels for your project?
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-white/85">
          Talk to our sales line now (24/7 AI receptionist screens, captures
          your project details, and tees up Robertson for callback within 1
          business day) — or send us your specs by email.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-bluegray transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
            Call {SITE.phonePrimary}
          </a>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            Request Submittal Package
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/60">
          Direct line: {SITE.phoneSecondary} · {SITE.email}
        </p>
      </div>
    </section>
  );
}
