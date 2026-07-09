import type { Metadata } from 'next';
import Link from 'next/link';
import { Ship, Anchor, Truck, ClipboardCheck, Phone, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';
import { howToSchema, jsonLdScript } from '@/lib/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';

/**
 * /service-areas — ordering & logistics page.
 *
 * 2026-05-16 rewrite (supersedes ADR-038 F4 + ADR-017 LB warehouse premise):
 * the original page positioned JARA as a Long Beach warehouse operator with
 * a delivery-radius coverage model. That premise was incorrect — JARA holds
 * no US inventory and supplies via direct factory shipping from Plycem
 * manufacturing in Costa Rica, El Salvador, and Honduras. This page now
 * explains how a JARA order moves from PO to jobsite end-to-end:
 *
 *   1. Header — what to expect (typical 3–4 wk door-to-door)
 *   2. The four stages (factory → ocean freight → customs → trucking)
 *   3. Regions we serve (US-level, not city-level)
 *   4. Submittal & code support (what we provide for AHJ approval)
 *   5. CTA strip
 *
 * URL preserved (/service-areas) so existing inbound links and ADR-017
 * canonical references don't break. Content is the source of truth on how
 * JARA fulfills US orders.
 */

export const metadata: Metadata = {
  title: 'Ordering & Logistics — Direct Factory Shipping',
  description:
    'How JARA International fulfills US fiber-cement orders: container-direct from PLYCEM manufacturing in Costa Rica, El Salvador, and Honduras. Typical door-to-door delivery 3–4 weeks. Ocean freight, US customs clearance, and final-mile trucking coordinated end-to-end. Continental US coverage.',
  alternates: {
    canonical: `${SITE.url}/service-areas`,
    languages: {
      'en-US': `${SITE.url}/service-areas`,
      'es-US': `${SITE.url}/es/service-areas`,
      'x-default': `${SITE.url}/service-areas`,
    },
  },
};

const STAGES = [
  {
    icon: ClipboardCheck,
    title: '1. Quote & order confirmation',
    body:
      'You share project specs (panel type, thickness, edge profile, square footage, jobsite location, target construction date). We return a quote within 1 business day. On PO + deposit, we schedule the container at the manufacturer.',
    duration: 'Day 0–3',
  },
  {
    icon: Ship,
    title: '2. Manufacturing & ocean freight',
    body:
      'PLYCEM manufactures or pulls from finished-goods inventory in Costa Rica, El Salvador, or Honduras under ISO 9001/14001/45001 quality systems. The container is loaded and routed via ocean freight to a US port of entry — typically Long Beach, Houston, Miami, or New York/New Jersey depending on jobsite proximity.',
    duration: 'Week 1–3',
  },
  {
    icon: Anchor,
    title: '3. US customs clearance',
    body:
      'Our customs broker handles entry filing, HTS classification, and duty payment at the US port of entry. We carry insurance through the supply chain. You receive a customs-cleared notice the day the container is released.',
    duration: '2–5 business days at port',
  },
  {
    icon: Truck,
    title: '4. Final-mile trucking to jobsite',
    body:
      'Flatbed or container chassis dispatched from the port to your jobsite, scheduled to your project window. Tailgate or forklift unloading per site requirements. Certificate of insurance provided on request.',
    duration: 'Final 2–7 days',
  },
];

export default function OrderingLogisticsPage() {
  // R13-F3: HowTo JSON-LD for the freight workflow. Source-of-truth for the
  // step text is the STAGES array above so the rendered cards and the JSON-LD
  // never drift. Targets the procedural-query class ("how to import fiber
  // cement from Costa Rica", "container freight lead time") which AI overviews
  // lift HowTo blocks for preferentially.
  const pageUrl = `${SITE.url}/service-areas`;
  const orderingHowTo = howToSchema({
    pageUrl,
    name: 'How a JARA order moves from PO to jobsite',
    description:
      'End-to-end direct factory shipping of PLYCEM fiber-cement panels from manufacturing plants in Costa Rica, El Salvador, or Honduras to a US jobsite. Typical door-to-door 3–4 weeks.',
    totalTime: 'P4W',
    steps: STAGES.map((s) => ({ name: s.title, text: s.body })),
  });

  return (
    <div className="bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(orderingHowTo) }}
      />

      {/* Breadcrumb strip (light, above the navy hero) */}
      <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
        <Breadcrumbs
          pageUrl={pageUrl}
          items={[
            { name: 'Home', path: '/' },
            { name: 'Ordering & Logistics', path: '/service-areas' },
          ]}
        />
      </div>

      {/* Header strip */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bluegray">
            Ordering &amp; Logistics
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl text-balance">
            Direct factory shipping to your US jobsite — 3–4 weeks door-to-door
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85 md:text-xl">
            JARA supplies PLYCEM fiber-cement panels container-direct from
            manufacturing plants in Costa Rica, El Salvador, and Honduras.
            We coordinate ocean freight, US customs clearance, and final-mile
            trucking — you get a single point of contact from PO to delivery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={buildTelUrl(SITE.phonePrimaryRaw)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-bluegray transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              Call Anna · {SITE.phonePrimary}
            </a>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request a quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* The four stages */}
      <section
        className="py-16 lg:py-24"
        aria-labelledby="stages-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2
            id="stages-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            How a JARA order moves from PO to jobsite
          </h2>
          <p className="mt-3 max-w-2xl text-ink/75 leading-relaxed">
            Four stages, single point of contact. Typical end-to-end timeline
            is 3–4 weeks from confirmed PO; specific timing depends on
            manufacturer production schedule, port routing, and final-mile
            distance.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.title}
                  className="rounded-lg border border-bluegray/40 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
                    </div>
                    <span className="rounded-full border border-bluegray/40 px-3 py-1 text-xs font-semibold text-steel whitespace-nowrap">
                      {stage.duration}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-navy">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">
                    {stage.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regions served */}
      <section
        className="bg-white py-16 lg:py-24"
        aria-labelledby="regions-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2
            id="regions-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            Regions we serve
          </h2>
          <p className="mt-3 max-w-2xl text-ink/75 leading-relaxed">
            Continental US. Port routing is selected per project to minimize
            final-mile distance from port of entry to jobsite — typical
            US ports of entry are Long Beach, Houston, Miami, and New
            York/New Jersey.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SITE.serviceAreas.map((area) => (
              <li
                key={area}
                className="flex items-start gap-3 rounded-lg border border-bluegray/40 bg-bg-soft p-4"
              >
                <Truck
                  className="mt-0.5 h-5 w-5 shrink-0 text-steel"
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
                <span className="font-display text-base font-semibold text-navy">
                  {area}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-ink/55">
            Outside continental US (Alaska, Hawaii, Caribbean, Mexico)?
            Contact us — we coordinate cross-border container routing on a
            case-by-case basis.
          </p>
        </div>
      </section>

      {/* Submittal & code support */}
      <section
        className="py-16 lg:py-24"
        aria-labelledby="support-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2
            id="support-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            Submittal &amp; code support included
          </h2>
          <p className="mt-3 max-w-3xl text-ink/75 leading-relaxed">
            Every JARA order includes the documentation needed for AHJ
            submittal and project closeout:
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: 'UL R15140 Classification',
                body: 'Fire-rated floor/ceiling assembly references (H502, H504, H511, U449, U487).',
              },
              {
                label: 'IAPMO ER-360',
                body: 'IBC/IRC alternative-material evaluation report. Current edition valid through 2026-07-31.',
              },
              {
                label: 'ASTM C1186 / E-84 / E-136',
                body: 'Fiber-cement panel standard, Class A surface burning, non-combustibility.',
              },
              {
                label: 'IBC 2021 + CBC Chapter 7A',
                body: 'Type I/II construction references and wildfire-region (WUI) compliance.',
              },
              {
                label: 'NFPA 285 eligibility',
                body: 'For exterior wall assemblies >40 ft (Exterior Cement Board, assembly-tested).',
              },
              {
                label: 'Manufacturer ISO certificates',
                body: 'ISO 9001:2015 (quality), 14001:2015 (environmental), 45001:2018 (safety).',
              },
            ].map((item) => (
              <li
                key={item.label}
                className="rounded-lg border border-bluegray/40 bg-white p-4"
              >
                <p className="font-display text-sm font-semibold text-navy">
                  {item.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink/80">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-bold md:text-2xl text-balance">
                Ready to scope a project?
              </h2>
              <p className="mt-3 text-white/85 leading-relaxed">
                Send us your project location, target square footage, and
                construction date. We will return a quote with port routing,
                lead time, and a submittal package ready for AHJ within 1
                business day.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <a
                href={buildTelUrl(SITE.phonePrimaryRaw)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-bluegray transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap"
              >
                <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                Call Anna
              </a>
              <Link
                href="/resources"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap"
              >
                Request a quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
