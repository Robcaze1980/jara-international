import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, ArrowRight, Clock } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * /pricing — stub page (Sprint 4 step 7, ADR-040 P2).
 *
 * Round 10 lock (4-1 strong, GLM dissent P3 → 301 redirect):
 * The /pricing URL exists as a brand-compliant stub explaining JARA's
 * quote-only commercial model. Preserves SEO juice from inbound /pricing
 * links + provides conversion path. SB-4 compliant (no prices, no
 * currency, no comparison-to-competitor numbers).
 *
 * NOTE on intent: visitors typing /pricing have purchase intent. Bounce
 * them efficiently into the form or onto Anna's call line.
 */

export const metadata: Metadata = {
  title: 'Pricing & Quotes',
  description:
    'JARA International provides per-project pricing. Quote requests typically return within 1 business day. Call Anna (24/7 AI receptionist) or submit a project brief — pricing depends on volume, panel thickness, edge profile, container lead time, and final-mile delivery distance.',
  alternates: {
    canonical: `${SITE.url}/pricing`,
    languages: {
      'en-US': `${SITE.url}/pricing`,
      'es-US': `${SITE.url}/es/pricing`,
      'x-default': `${SITE.url}/pricing`,
    },
  },
};

export default function PricingStubPage() {
  return (
    <div className="min-h-[60vh] bg-bg-soft">
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Pricing
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Pricing is per-project, by quote
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          JARA International does not publish list prices. Material cost
          depends on volume, panel thickness and edge profile, container
          lead time, and final-mile delivery distance from the US port of
          entry to your jobsite.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/75">
          Quotes typically return within one business day. Multi-project
          contracts and large volumes (300+ panels) receive additional
          consideration on pricing and dedicated logistics scheduling.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
            Call Anna · {SITE.phonePrimary}
          </a>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/30 px-6 py-3 text-sm font-semibold text-navy hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            Submit a project brief
            <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
              <Clock className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-base font-semibold text-navy">
              Response window
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Quote requests submitted before 3 PM Pacific receive a same-day
              response. After 3 PM rolls to next business day.
            </p>
          </div>
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
              <Mail className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-base font-semibold text-navy">
              What we need
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Project type, location, estimated square footage, target
              construction date. Drawings welcome but not required for
              initial estimate.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-1.5 text-sm text-steel hover:text-navy"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          Back to home
        </Link>
      </section>
    </div>
  );
}
