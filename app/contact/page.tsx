import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * /contact — STUB page (Round 7 F1.R7 fix).
 *
 * Sprint 4 will replace this with a full contact form. For now, surfaces the
 * 4 contact channels (Anna phone, Robertson direct, WhatsApp, email) plus
 * warehouse location.
 */

export const metadata: Metadata = {
  title: 'Contact JARA International',
  description:
    'Contact JARA International Inc. — call our 24/7 sales line (Anna AI receptionist screens calls and captures project details), email Robertson directly, or send a WhatsApp message. Warehouse in Long Beach, California serving the US construction market.',
  alternates: {
    canonical: `${SITE.url}/contact`,
    languages: {
      'en-US': `${SITE.url}/contact`,
      'es-US': `${SITE.url}/es`,
      'x-default': `${SITE.url}/contact`,
    },
  },
};

export default function ContactStubPage() {
  return (
    <div className="min-h-[60vh] bg-bg-soft">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Contact
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Talk to JARA International
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          Four ways to reach us — pick whichever works for you. Robertson
          responds personally within 1 business day on every channel.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {/* Anna sales line */}
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="group rounded-lg border-2 border-navy bg-white p-6 hover:bg-bg-soft transition-colors"
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
              <Phone className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-lg font-semibold text-navy">
              Sales line · 24/7
            </h2>
            <p className="mt-1 text-base font-semibold text-navy">{SITE.phonePrimary}</p>
            <p className="mt-2 text-sm text-ink/70">
              AI receptionist (Anna) screens calls, captures your project
              details, and tees up Robertson for callback.
            </p>
          </a>

          {/* Direct phone */}
          <a
            href={buildTelUrl(SITE.phoneSecondaryRaw)}
            className="group rounded-lg border border-bluegray/40 bg-white p-6 hover:bg-bg-soft transition-colors"
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-steel text-white">
              <Phone className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-lg font-semibold text-navy">
              Robertson direct
            </h2>
            <p className="mt-1 text-base font-semibold text-navy">{SITE.phoneSecondary}</p>
            <p className="mt-2 text-sm text-ink/70">
              Direct line to Robertson Carrillo. For when you want to skip the
              receptionist and talk human-to-human.
            </p>
          </a>

          {/* WhatsApp */}
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener"
            className="group rounded-lg border border-bluegray/40 bg-white p-6 hover:bg-bg-soft transition-colors"
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-steel text-white">
              <MessageCircle className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-lg font-semibold text-navy">
              WhatsApp
            </h2>
            <p className="mt-1 text-base font-semibold text-navy">{SITE.phoneSecondary}</p>
            <p className="mt-2 text-sm text-ink/70">
              Send Robertson a message — works in English and Spanish. Useful
              for sharing photos, drawings, or quick questions.
            </p>
          </a>

          {/* Email */}
          <a
            href={`mailto:${SITE.email}`}
            className="group rounded-lg border border-bluegray/40 bg-white p-6 hover:bg-bg-soft transition-colors"
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-steel text-white">
              <Mail className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-lg font-semibold text-navy">
              Email
            </h2>
            <p className="mt-1 text-base font-semibold text-navy">{SITE.email}</p>
            <p className="mt-2 text-sm text-ink/70">
              For project specs, drawings, RFQs, or detailed technical
              inquiries — full reply within 1 business day.
            </p>
          </a>
        </div>

        <div className="mt-12 rounded-lg border border-bluegray/40 bg-white p-6">
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-navy" aria-hidden="true" strokeWidth={1.75} />
            <div>
              <h2 className="font-display text-lg font-semibold text-navy">
                Warehouse
              </h2>
              <p className="mt-1 text-base text-navy">
                {SITE.warehouse.city}, {SITE.warehouse.region}, {SITE.warehouse.country}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                Inventory in stock for 0–3 day delivery to West Coast US.
                Container orders to other US regions: 6–8 week lead time from
                Costa Rica / El Salvador / Honduras facilities.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-steel hover:text-navy"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          Back to home
        </Link>
      </section>
    </div>
  );
}
