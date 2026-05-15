import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Truck, Clock, Ship, Phone, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * /service-areas — single-page coverage map (Sprint 4 step 8, ADR-038 F4).
 *
 * Round 10 lock (5-0 unanimous): F4 — single /service-areas page at Sprint 4
 * with all 10 areas listed + LocalBusiness JSON-LD (already emitted at root
 * layout per ADR-017) + lead-time tier table. Per-city expansion deferred
 * to Phase 6 once analytics ground the content.
 *
 * Composition: linear single-scroll page with 4 sections:
 *   1. Header / hero strip
 *   2. Areas we serve (10-region grid)
 *   3. Lead-time tier table (in-stock / container / contract)
 *   4. How delivery works (3-step narrative)
 *   5. CTA strip
 *
 * No SectionNav — page is short enough to read in one scroll. Pillar (Sprint
 * 5) is the long page that gets SectionNav.
 *
 * SEO/AI surface per ADR-017 SD2: this route is the canonical landing for
 * "fiber cement panel Long Beach" / "subfloor distributor Los Angeles" /
 * "ASTM C1186 supplier California" type queries.
 */

export const metadata: Metadata = {
  title: 'Service Areas — JARA International Coverage Map',
  description:
    'JARA International serves the United States construction market from our Long Beach, California warehouse. 0–3 day delivery to West Coast US (Southern + Northern California), 3–5 days to Arizona and Nevada. Container orders to other US regions: 6–8 week lead time.',
  alternates: {
    canonical: `${SITE.url}/service-areas`,
    languages: {
      'en-US': `${SITE.url}/service-areas`,
      'es-US': `${SITE.url}/es/service-areas`,
      'x-default': `${SITE.url}/service-areas`,
    },
  },
};

// Service-area groupings for the lead-time table (groups SITE.serviceAreas
// by typical delivery tier from Long Beach warehouse).
const LEAD_TIME_TIERS = [
  {
    label: 'Same-day or next-day',
    distance: '< 50 mi from Long Beach',
    delivery: 'Truck dispatch within 4 hours',
    areas: ['Long Beach, CA', 'Los Angeles, CA', 'Orange County, CA'],
  },
  {
    label: '0–3 business days',
    distance: '50–200 mi',
    delivery: 'Scheduled box truck or flatbed',
    areas: ['San Diego, CA', 'Inland Empire, CA'],
  },
  {
    label: '3–5 business days',
    distance: '200–500 mi',
    delivery: 'LTL freight or flatbed; coordinated load',
    areas: [
      'San Francisco Bay Area, CA',
      'Sacramento, CA',
      'Central Valley, CA',
      'Las Vegas, NV',
      'Phoenix, AZ',
    ],
  },
];

const DELIVERY_STAGES = [
  {
    icon: Ship,
    title: 'Factory to warehouse',
    body:
      'PLYCEM panels manufactured in Costa Rica, El Salvador, and Honduras under ISO 9001/14001/45001 quality systems, then shipped via ocean container to Port of Long Beach. 14–21 day transit. Customs clearance 2–5 business days.',
  },
  {
    icon: MapPin,
    title: 'Warehouse stock',
    body:
      '1,500+ panels held in inventory at Long Beach. 20mm subfloor is the canonical in-stock variant; other thicknesses available by container order with 6–8 week lead time.',
  },
  {
    icon: Truck,
    title: 'Truck to job site',
    body:
      'Box truck or flatbed from Long Beach, scheduled to your project window. Delivery proof of insurance and certificate-of-coverage provided on request. Tailgate or forklift unloading per site requirements.',
  },
];

export default function ServiceAreasPage() {
  return (
    <div className="bg-bg-soft">
      {/* Header strip */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bluegray">
            Coverage
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl text-balance">
            United States coverage from our Long Beach warehouse
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85 md:text-xl">
            Same-day truck dispatch to the Los Angeles basin. 3–5 day freight
            to the western states. Container orders to anywhere in the
            continental US on a 6–8 week production cadence from our
            manufacturing facilities.
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

      {/* Areas grid */}
      <section
        className="py-16 lg:py-24"
        aria-labelledby="areas-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2
            id="areas-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            Areas we serve
          </h2>
          <p className="mt-3 max-w-2xl text-ink/75 leading-relaxed">
            Below are the markets we deliver to most frequently from the
            Long Beach warehouse. Outside these areas, we ship via container
            on a 6–8 week production cadence — contact us for a routing
            quote.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SITE.serviceAreas.map((area) => (
              <li
                key={area}
                className="flex items-start gap-3 rounded-lg border border-bluegray/40 bg-white p-4"
              >
                <MapPin
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
        </div>
      </section>

      {/* Lead-time tier table */}
      <section
        className="bg-white py-16 lg:py-24"
        aria-labelledby="lead-time-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2
            id="lead-time-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            Lead times by distance from Long Beach
          </h2>
          <p className="mt-3 max-w-2xl text-ink/75 leading-relaxed">
            Times below assume the requested thickness is in stock. Specialty
            variants (22mm, 25mm, 30mm subfloor T&amp;G, exterior cladding)
            may ship by container instead — confirm at quote time.
          </p>
          <div
            role="region"
            aria-label="Lead-time tiers by distance from Long Beach warehouse"
            tabIndex={0}
            className="mt-8 overflow-x-auto rounded-lg border border-bluegray/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">
                Lead-time tier table: tier label, distance band, delivery method, areas served.
              </caption>
              <thead className="bg-bg-soft">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-navy whitespace-nowrap">
                    Tier
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-navy whitespace-nowrap">
                    Distance
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-navy whitespace-nowrap">
                    Delivery method
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-navy">
                    Areas
                  </th>
                </tr>
              </thead>
              <tbody>
                {LEAD_TIME_TIERS.map((tier, idx) => (
                  <tr
                    key={tier.label}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-bg-soft/40'}
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 text-left font-semibold text-navy whitespace-nowrap"
                    >
                      <Clock
                        className="mr-2 inline h-4 w-4 text-steel"
                        aria-hidden="true"
                        strokeWidth={1.75}
                      />
                      {tier.label}
                    </th>
                    <td className="px-4 py-3 text-ink/85 whitespace-nowrap">
                      {tier.distance}
                    </td>
                    <td className="px-4 py-3 text-ink/85">{tier.delivery}</td>
                    <td className="px-4 py-3 text-ink/85">
                      {tier.areas.join(' · ')}
                    </td>
                  </tr>
                ))}
                <tr>
                  <th
                    scope="row"
                    className="border-t-2 border-bluegray/40 px-4 py-3 text-left font-semibold text-navy whitespace-nowrap"
                  >
                    <Ship
                      className="mr-2 inline h-4 w-4 text-steel"
                      aria-hidden="true"
                      strokeWidth={1.75}
                    />
                    Container order
                  </th>
                  <td className="border-t-2 border-bluegray/40 px-4 py-3 text-ink/85 whitespace-nowrap">
                    Anywhere in continental US
                  </td>
                  <td className="border-t-2 border-bluegray/40 px-4 py-3 text-ink/85">
                    6–8 weeks production + transit
                  </td>
                  <td className="border-t-2 border-bluegray/40 px-4 py-3 text-ink/85">
                    Bulk orders, custom thickness, multi-project contracts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-ink/55">
            Times above are typical and assume normal carrier capacity. Project-specific delivery
            commitments are confirmed at quote.
          </p>
        </div>
      </section>

      {/* How delivery works */}
      <section
        className="py-16 lg:py-24"
        aria-labelledby="how-delivery-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2
            id="how-delivery-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            How delivery works
          </h2>
          <p className="mt-3 max-w-2xl text-ink/75 leading-relaxed">
            Three stages from factory to your job site. We coordinate stages
            1 and 2; stage 3 is scheduled to your project window.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DELIVERY_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.title}
                  className="rounded-lg border border-bluegray/40 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy">
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

      {/* CTA strip */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-bold md:text-2xl text-balance">
                Outside our standard coverage? We can still serve you.
              </h2>
              <p className="mt-3 text-white/85 leading-relaxed">
                For projects east of the Rockies or international, we
                coordinate container orders direct from our manufacturing
                facilities. Bring us your project specs — we&apos;ll route the
                shipment that makes sense.
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
