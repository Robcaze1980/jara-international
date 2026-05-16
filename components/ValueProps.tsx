import { Wallet, Ship, ShieldCheck } from 'lucide-react';

/**
 * Value props — 2026-05-16 positioning rewrite.
 *
 * The three props that win deals for JARA today:
 * - Direct factory pricing (no US-warehouse markup, container-direct)
 * - 3–4 week door-to-door delivery (direct from Plycem plants in Costa Rica)
 * - Spec & code documentation ready for AHJ submittal (UL, ASTM, IAPMO, IBC)
 *
 * Supersedes the Round 6 ADR-024 HC1 selection (which led with "In Stock,
 * Long Beach CA" — a claim that turned out to depend on a third-party
 * pass-through stock position, not a durable JARA operation). Bilingual
 * technical support remains a real differentiator but lives on /contact
 * rather than as a homepage value prop.
 */

const props = [
  {
    icon: Wallet,
    title: 'Direct factory pricing',
    body:
      'Sourced direct from PLYCEM manufacturing in Costa Rica, El Salvador, and Honduras — no US-warehouse markup. Competitive pricing on container orders.',
  },
  {
    icon: Ship,
    title: '3–4 week door-to-door',
    body:
      'Typical door-to-door delivery from factory to your US jobsite: ocean freight, customs clearance, and final trucking coordinated end-to-end.',
  },
  {
    icon: ShieldCheck,
    title: 'Spec & code ready',
    body:
      'UL R15140, ASTM C1186 Type A Grade I, ASTM E-84 Class A, IAPMO ER-360, and IBC 2021 documentation packets provided for AHJ submittal.',
  },
];

export function ValueProps() {
  return (
    <section
      className="bg-bg-soft py-16 lg:py-24"
      aria-labelledby="value-props-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2
          id="value-props-heading"
          className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
        >
          Why specifiers and contractors choose JARA International
        </h2>
        <p className="mt-3 max-w-2xl text-ink/75 leading-relaxed">
          A US-focused fiber-cement distributor with direct factory sourcing,
          end-to-end logistics, and complete compliance documentation for
          commercial and multifamily projects.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {props.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.title}
                className="rounded-lg border border-bluegray/40 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-semibold text-navy">
                  {prop.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">
                  {prop.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
