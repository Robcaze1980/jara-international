import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { articleSchema, jsonLdScript } from '@/lib/jsonld';
import { PRODUCTS } from '@/data/products';
import {
  getPricedVariants,
  getFromPriceUsd,
  formatUsd,
  formatPerSqFt,
} from '@/lib/pricing';

const PUBLISHED = '2026-07-09';
const MODIFIED = '2026-07-09';
const PAGE_URL = `${SITE.url}/guides/non-combustible-subfloor-cost`;
const DESC =
  'What non-combustible fiber-cement subfloor costs: delivered (DDP) from $74 per panel (about $2.30/SF), what the price includes, and how to estimate a project.';

export const metadata: Metadata = {
  title: 'Non-Combustible Subfloor Cost',
  description: DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-US': PAGE_URL, 'x-default': PAGE_URL },
  },
};

export default function NonCombustibleSubfloorCostGuide() {
  const subfloor = PRODUCTS.find((p) => p.slug === 'high-performance-subfloor');
  const rows = subfloor ? getPricedVariants(subfloor) : [];
  const from = subfloor ? getFromPriceUsd(subfloor) : undefined;
  const fromSf = rows[0]?.pricePerSqFt;

  return (
    <div className="bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            articleSchema({
              pageUrl: PAGE_URL,
              headline: 'How much does non-combustible fiber-cement subfloor cost?',
              description: DESC,
              datePublished: PUBLISHED,
              dateModified: MODIFIED,
            }),
          ),
        }}
      />
      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <Breadcrumbs
          pageUrl={PAGE_URL}
          items={[
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: 'Non-combustible subfloor cost', path: '/guides/non-combustible-subfloor-cost' },
          ]}
        />
        <h1 className="mt-6 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          How much does non-combustible fiber-cement subfloor cost?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/85">
          <strong className="text-navy">Direct answer:</strong> JARA High Performance
          Subfloor — a non-combustible (ASTM E-136), UL R15140 classified fiber-cement
          structural subfloor — starts at{' '}
          <strong className="text-navy">{from != null ? formatUsd(from) : '$74'}</strong>{' '}
          per 4×8 panel
          {fromSf != null && (
            <> (about <strong className="text-navy">{formatPerSqFt(fromSf)}</strong>)</>
          )}
          , delivered duty-paid (DDP) to a main US base port in full-container (40HQ)
          quantities. It is an indicative starting price; the final delivered price is
          confirmed by quote.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          Delivered price by thickness
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-bluegray/40 bg-white">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-bluegray/40 text-left text-xs uppercase tracking-wide text-steel">
                <th className="px-4 py-2.5 font-semibold">Thickness</th>
                <th className="px-4 py-2.5 font-semibold">Edge</th>
                <th className="px-4 py-2.5 font-semibold">$/panel</th>
                <th className="px-4 py-2.5 font-semibold">~ $/SF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bluegray/25">
              {rows.map(({ variant, priceUsd, pricePerSqFt }) => (
                <tr key={variant.sku}>
                  <td className="px-4 py-2.5 font-medium text-ink">
                    {variant.thicknessImperial} ({variant.thicknessMm} mm)
                  </td>
                  <td className="px-4 py-2.5 text-ink/70">
                    {variant.edgeProfile === 'tongue-and-groove'
                      ? 'T&G'
                      : variant.edgeProfile === 'straight'
                        ? 'Straight'
                        : '—'}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-navy">{formatUsd(priceUsd)}</td>
                  <td className="px-4 py-2.5 text-ink/70">
                    {pricePerSqFt != null ? formatPerSqFt(pricePerSqFt) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          What the delivered (DDP) price includes
        </h2>
        <ul className="mt-3 space-y-2 text-ink/85">
          <li>Import duty paid, delivered to a main US base port</li>
          <li>Ocean freight and US customs clearance</li>
          <li>Inland delivery within 50 miles of the port (beyond that, additional freight)</li>
          <li>Full-container (40HQ) pricing; smaller quantities change the per-panel freight</li>
          <li>Standard unloading time (overtime/detention not included)</li>
        </ul>
        <p className="mt-4 leading-relaxed text-ink/80">
          Made-to-order supply ships direct from the factory, so plan for roughly a 3–4
          week door-to-door delivery — there is no US-warehouse markup in the price.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          Estimating your project
        </h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Each 4×8 panel covers 32 square feet, so a quick estimate is{' '}
          <em>panels ≈ floor area (SF) ÷ 32</em>. At {from != null ? formatUsd(from) : '$74'}{' '}
          per panel, a 10,000 SF floor is about 313 panels. Use the calculator on the
          homepage for a panel count, then request a delivered price for your exact
          quantity and US port of entry.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
          >
            See full delivered pricing
            <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
          </Link>
          <Link
            href="/products/high-performance-subfloor"
            className="inline-flex items-center gap-2 rounded-md border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white"
          >
            High Performance Subfloor specs
          </Link>
        </div>
      </article>
    </div>
  );
}
