import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Languages,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/whatsapp';
import { faqSchema, jsonLdScript } from '@/lib/jsonld';

/**
 * /contact — full page (Sprint 4 step 6).
 *
 * Replaces the Sprint 2 cleanup stub with a complete contact surface.
 * No specific Round 10 ballot item locked the shape of this page; the
 * Sprint 2 stub already had a strong 4-channel layout, so this build
 * enhances rather than replaces:
 *
 *   1. Header strip (kept, slightly tightened)
 *   2. 4-channel contact cards (kept verbatim)
 *   3. Business hours + languages (NEW)
 *   4. What-to-include guidance (NEW — reduces inbound noise)
 *   5. FAQ section with FAQPage JSON-LD (NEW)
 *   6. Warehouse card with regional context (enhanced)
 *
 * The MaterialCalculator a11y exemplar guides patterns (per Round 7 F3.R7):
 * proper landmarks, focus rings, no decorative elements without alt text,
 * <details> for FAQ semantics.
 */

const FAQS = [
  {
    question: 'How fast will I get a response?',
    answer:
      'Robertson responds personally within 1 business day on every channel. For quotes submitted before 3 PM Pacific, expect same-day reply. For urgent project deadlines, call Anna at the 24/7 sales line.',
  },
  {
    question: 'Do you provide bilingual technical support?',
    answer:
      'Yes. Robertson and Anna both work in English and Spanish. WhatsApp messages, emails, and calls in either language receive responses in the same language. For project drawings or specifications in Spanish, send via WhatsApp or email for fastest turnaround.',
  },
  {
    question: 'What information should I include in my first inquiry?',
    answer:
      'Project type (multifamily, commercial, hotel, modular), location (city + state), estimated square footage, target construction date, and required panel thickness if known. Drawings or spec books are welcome but not required for an initial estimate.',
  },
  {
    question: 'Do you serve outside California, Arizona, and Nevada?',
    answer:
      'Yes — for projects east of our standard West Coast coverage we coordinate container orders directly from our manufacturing facilities (Costa Rica, El Salvador, Honduras). Container lead time is 6–8 weeks. Bring us your project specs and we will route the shipment that makes sense.',
  },
];

export const metadata: Metadata = {
  title: 'Contact JARA International',
  description:
    'Contact JARA International Inc. — call our 24/7 AI sales line (Anna), reach Robertson directly, WhatsApp in English or Spanish, or email. Bilingual technical support. Response within 1 business day on every channel. Warehouse in Long Beach, California serving the US construction market.',
  alternates: {
    canonical: `${SITE.url}/contact`,
    languages: {
      'en-US': `${SITE.url}/contact`,
      'es-US': `${SITE.url}/es/contact`,
      'x-default': `${SITE.url}/contact`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    url: `${SITE.url}/contact`,
    siteName: SITE.name,
    title: `Contact ${SITE.name}`,
    description:
      'Four contact channels. Bilingual support. Response within 1 business day.',
  },
};

export default function ContactPage() {
  const pageUrl = `${SITE.url}/contact`;
  return (
    <div className="bg-bg-soft">
      {/* FAQPage JSON-LD per ADR-018 SF2 — visible content parity with the
          rendered FAQ section below so Google does not flag schema/content
          mismatch */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(faqSchema(pageUrl, FAQS)),
        }}
      />

      {/* Header strip */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-8 lg:px-8 lg:pt-24 lg:pb-12">
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
      </section>

      {/* 4-channel contact cards */}
      <section
        className="mx-auto max-w-4xl px-6 pb-16 lg:px-8"
        aria-labelledby="channels-heading"
      >
        <h2 id="channels-heading" className="sr-only">
          Contact channels
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Anna sales line — featured */}
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="group rounded-lg border-2 border-navy bg-white p-6 hover:bg-bg-soft transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            aria-label={`Call sales line ${SITE.phonePrimary}`}
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
              <Phone className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-lg font-semibold text-navy">
              Sales line · 24/7
            </h3>
            <p className="mt-1 text-base font-semibold text-navy">
              {SITE.phonePrimary}
            </p>
            <p className="mt-2 text-sm text-ink/70">
              AI receptionist (Anna) screens calls, captures your project
              details, and tees up Robertson for callback. Works in English
              and Spanish.
            </p>
          </a>

          {/* Robertson direct */}
          <a
            href={buildTelUrl(SITE.phoneSecondaryRaw)}
            className="group rounded-lg border border-bluegray/40 bg-white p-6 hover:bg-bg-soft transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            aria-label={`Call Robertson direct ${SITE.phoneSecondary}`}
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-steel text-white">
              <Phone className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-lg font-semibold text-navy">
              Robertson direct
            </h3>
            <p className="mt-1 text-base font-semibold text-navy">
              {SITE.phoneSecondary}
            </p>
            <p className="mt-2 text-sm text-ink/70">
              Direct line to Robertson Carrillo. For when you want to skip
              the receptionist and talk human-to-human.
            </p>
          </a>

          {/* WhatsApp */}
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener"
            className="group rounded-lg border border-bluegray/40 bg-white p-6 hover:bg-bg-soft transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            aria-label={`WhatsApp ${SITE.phoneSecondary}`}
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-steel text-white">
              <MessageCircle
                className="h-6 w-6"
                aria-hidden="true"
                strokeWidth={1.75}
              />
            </div>
            <h3 className="font-display text-lg font-semibold text-navy">
              WhatsApp
            </h3>
            <p className="mt-1 text-base font-semibold text-navy">
              {SITE.phoneSecondary}
            </p>
            <p className="mt-2 text-sm text-ink/70">
              Send Robertson a message — works in English and Spanish. Best
              for sharing photos, drawings, or quick questions.
            </p>
          </a>

          {/* Email */}
          <a
            href={`mailto:${SITE.email}`}
            className="group rounded-lg border border-bluegray/40 bg-white p-6 hover:bg-bg-soft transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            aria-label={`Email ${SITE.email}`}
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-steel text-white">
              <Mail className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-lg font-semibold text-navy">
              Email
            </h3>
            <p className="mt-1 text-base font-semibold text-navy">
              {SITE.email}
            </p>
            <p className="mt-2 text-sm text-ink/70">
              For project specs, drawings, RFQs, or detailed technical
              inquiries. Full reply within 1 business day.
            </p>
          </a>
        </div>
      </section>

      {/* Hours + languages strip */}
      <section
        className="border-y border-bluegray/40 bg-white py-10 lg:py-12"
        aria-labelledby="hours-heading"
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 id="hours-heading" className="sr-only">
            Business hours and languages
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <Clock
                className="mt-1 h-6 w-6 shrink-0 text-navy"
                aria-hidden="true"
                strokeWidth={1.75}
              />
              <div>
                <h3 className="font-display text-base font-semibold text-navy">
                  Business hours
                </h3>
                <p className="mt-1 text-sm text-ink/80 leading-relaxed">
                  Robertson direct + email + WhatsApp: 8 AM – 6 PM Pacific,
                  Monday–Friday.
                </p>
                <p className="mt-1 text-sm text-ink/80 leading-relaxed">
                  Anna sales line: 24/7 (captures details outside business
                  hours, Robertson follows up next business day).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Languages
                className="mt-1 h-6 w-6 shrink-0 text-navy"
                aria-hidden="true"
                strokeWidth={1.75}
              />
              <div>
                <h3 className="font-display text-base font-semibold text-navy">
                  Languages
                </h3>
                <p className="mt-1 text-sm text-ink/80 leading-relaxed">
                  English and Spanish on every channel. Drawings, specs, and
                  proposals in either language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to include */}
      <section
        className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20"
        aria-labelledby="include-heading"
      >
        <h2
          id="include-heading"
          className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
        >
          What to include in your first message
        </h2>
        <p className="mt-3 max-w-2xl text-ink/75 leading-relaxed">
          Helps us reply with useful information instead of a follow-up
          questionnaire. None of these are required — we&apos;ll happily fill
          gaps over a 5-minute call.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Project type',
              body: 'Multifamily, hotel, commercial, modular, healthcare, school, etc.',
            },
            {
              title: 'Location',
              body: 'City and state. Drives lead-time tier and freight options.',
            },
            {
              title: 'Estimated square footage',
              body: 'Total floor area for the assembly. Rough is fine.',
            },
            {
              title: 'Target construction date',
              body: 'Helps us schedule against current inventory or queue a container.',
            },
            {
              title: 'Panel thickness',
              body: 'If your spec or engineer has called it out — 20mm, 22mm, 25mm, 30mm.',
            },
            {
              title: 'Drawings or specs',
              body: 'Optional. Welcome via email or WhatsApp; PDF or image both work.',
            },
          ].map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3 rounded-lg border border-bluegray/40 bg-white p-4"
            >
              <ClipboardList
                className="mt-0.5 h-5 w-5 shrink-0 text-steel"
                aria-hidden="true"
                strokeWidth={1.75}
              />
              <div>
                <p className="font-display text-sm font-semibold text-navy">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-ink/80 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section
        className="bg-white py-16 lg:py-20"
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2
            id="faq-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            Frequently asked questions
          </h2>
          <ul className="mt-6 divide-y divide-bluegray/30">
            {FAQS.map((faq) => (
              <li key={faq.question}>
                <details className="group py-4">
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
        </div>
      </section>

      {/* Warehouse strip */}
      <section className="bg-navy py-12 lg:py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <MapPin
              className="mt-1 h-7 w-7 shrink-0 text-bluegray"
              aria-hidden="true"
              strokeWidth={1.75}
            />
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold md:text-2xl">
                Warehouse — {SITE.warehouse.city}, {SITE.warehouse.region}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-white/85">
                Inventory in stock for 0–3 day delivery to West Coast US.
                Container orders to other US regions: 6–8 week lead time
                from manufacturing facilities in Costa Rica, El Salvador,
                and Honduras.
              </p>
              <Link
                href="/service-areas"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bluegray hover:text-white transition-colors"
              >
                See full coverage map
                <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
