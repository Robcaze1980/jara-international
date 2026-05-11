import { Truck, ShieldCheck, MessageCircle } from 'lucide-react';

/**
 * Value props — per ADR-024 HC1 (3 props) Round 6 4/4 unanimous.
 *
 * The 3 props that won consensus over alternatives:
 * - In stock + 0-3 day delivery (concrete competitive advantage)
 * - Compliance-ready (UL/ASTM/IAPMO documentation)
 * - Bilingual technical sales support (US Hispanic construction labor)
 */

const props = [
  {
    icon: Truck,
    title: 'In Stock, Long Beach CA',
    body:
      '0–3 day delivery to West Coast US. No 6-week lead times. Eliminate schedule risk for your project.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance-Ready',
    body:
      'UL R15140, ASTM C1186 Type A Grade I, IAPMO ER-360, and IBC code documentation packages provided on request.',
  },
  {
    icon: MessageCircle,
    title: 'Technical Sales Support',
    body:
      'Bilingual English / Spanish team. Architect & specifier inquiries answered with engineering-certified data within 1 business day.',
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
          A US-focused fiber-cement distributor with the inventory, compliance
          documentation, and responsiveness commercial projects need.
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
