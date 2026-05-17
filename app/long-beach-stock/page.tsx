import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, AlertCircle, Truck, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * /long-beach-stock — HIDDEN paid-ads landing page.
 *
 * Per 2026-05-16 user direction: a third-party distributor in Long Beach,
 * CA currently holds approximately 900 sheets of PLYCEM panel inventory
 * imported under their own purchase order. JARA is helping that distributor
 * sell through that one-time position. The importer has not committed to
 * continuing imports, so this is not a durable supply position — and
 * therefore does NOT appear in the main site navigation, sitemap, or
 * llms.txt. The page exists only as a destination for paid search/social
 * ads targeting California fiber-cement keywords.
 *
 * Honest framing — no inflated stock counts, no claim of JARA ownership,
 * no "0–3 day delivery" guarantee that depends on someone else's logistics.
 *
 * Should be removed (or 301'd to /) once the stock clears or the
 * partnership ends. Until then: noindex + nofollow keeps it off Google.
 */

export const metadata: Metadata = {
  // Round 12 R12-C1 (strict SB-5): "PLYCEM" removed from <title>. The hidden
  // noindex,nofollow status of this page does not exempt it from SB-5 —
  // the ship blocker is contractual with no exception for ads-only pages.
  // Paid-search keyword targeting still works via ad copy and on-page body
  // text (which still references PLYCEM where legally permitted).
  title: 'Fiber-Cement Panels in Long Beach, CA',
  description:
    'Limited PLYCEM fiber-cement panel stock currently available in Long Beach, California via JARA International\'s distribution partner. While supplies last. Contact us for current availability, sizing, and pricing.',
  // CRITICAL: noindex + nofollow — this page is for paid traffic only,
  // not organic search. Removing the noindex would put it in competition
  // with the main /products and /service-areas pages for the same brand
  // queries, and would surface a temporary inventory claim as if it were
  // a permanent JARA operation.
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  // No canonical / hreflang — the page is intentionally outside the main
  // information architecture.
};

export default function LongBeachStockPage() {
  return (
    <div className="min-h-screen bg-bg-soft">
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Current availability · Long Beach, CA
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          PLYCEM fiber-cement panels available now in Long Beach
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          A limited quantity of PLYCEM fiber-cement panels is currently
          available through our distribution partner in Long Beach,
          California. If your project needs material on a faster timeline
          than a standard 3–4 week container order, contact us — we will
          confirm what is in the partner&apos;s on-hand stock and quote
          pickup or delivery.
        </p>

        <div className="mt-8 rounded-lg border-2 border-amber-500/40 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden="true"
              strokeWidth={2}
            />
            <div>
              <p className="font-display text-sm font-semibold text-amber-900">
                While supplies last
              </p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900/85">
                This Long Beach inventory is a one-time pass-through
                position held by a third-party distributor; quantities and
                SKU mix change. JARA does not operate a Long Beach
                warehouse. For ongoing or large project orders, our
                standard direct-factory import program is the right path
                (3–4 week typical door-to-door from PLYCEM manufacturing
                in Costa Rica).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
            Call Anna · {SITE.phonePrimary}
          </a>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/30 px-6 py-3 text-sm font-semibold text-navy hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            WhatsApp · {SITE.phoneSecondary}
          </a>
          <a
            href={`mailto:${SITE.email}?subject=Long Beach stock availability`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/30 px-6 py-3 text-sm font-semibold text-navy hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            Email
          </a>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
              <Truck className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-base font-semibold text-navy">
              When you call, share
            </h2>
            <ul className="mt-2 text-sm leading-relaxed text-ink/75 space-y-1">
              <li>• Panel type (subfloor, sheathing, cladding, etc.)</li>
              <li>• Thickness or thicknesses you need</li>
              <li>• Approximate quantity</li>
              <li>• Jobsite location for delivery quote</li>
            </ul>
          </div>
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
              <AlertCircle className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-base font-semibold text-navy">
              What this isn&apos;t
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Not a permanent JARA warehouse. Not a guaranteed price or
              quantity. Not a substitute for our standard direct-factory
              import program for project-scale orders.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-1.5 text-sm text-steel hover:text-navy"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          About JARA International
        </Link>
      </section>
    </div>
  );
}
