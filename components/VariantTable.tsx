import type { Product, ProductVariant } from '@/data/products';

/**
 * Variant table (Round 8 PA1 + F2.R8 4/4-voter a11y mandate).
 *
 * A11y pattern (per F2.R8):
 *   - <caption> announces product + variant count to screen readers
 *   - <th scope="col"> on every column header
 *   - Outer wrapper is a focusable region (tabindex=0) with role=region + aria-label
 *     so keyboard users can scroll horizontally on mobile
 *   - First column (thickness) sticky on mobile via CSS for scan-anchor stability
 *   - Edge profile column uses TEXT ("Straight" / "Tongue and groove") — never
 *     unicode symbols that screen readers garble
 *
 * Variants are pre-sorted by thickness ascending in render (server component,
 * no client state). Launch-day scope skips interactive sortable headers; can
 * upgrade to a sortable client component in a later sprint if data justifies.
 *
 * Round 9 C5 (Claude single-voter low-severity): this pre-sort delivers the
 * same user-facing default state as PA1's "sortable by thickness" goal for the
 * common case. Upgrade path = wrap in a 'use client' component with useState
 * for column + direction, swap <th> into clickable buttons with aria-sort.
 * Justified when (a) a product gains >10 variants, OR (b) analytics show users
 * frequently re-sorting (which the current static table cannot measure).
 */

function formatEdgeProfile(profile: ProductVariant['edgeProfile']): string {
  if (profile === 'tongue-and-groove') return 'Tongue and groove';
  if (profile === 'straight') return 'Straight';
  return '—';
}

export function VariantTable({ product }: { product: Product }) {
  const sortedVariants = [...product.variants].sort((a, b) => {
    if (a.thicknessMm !== b.thicknessMm) return a.thicknessMm - b.thicknessMm;
    return a.sku.localeCompare(b.sku);
  });

  return (
    <section className="rounded-lg border border-bluegray/40 bg-white p-5 md:p-6">
      <h2 className="font-display text-xl font-semibold text-navy">
        Available variants
      </h2>
      <p className="mt-1 text-sm text-ink/70">
        {sortedVariants.length} SKU{sortedVariants.length === 1 ? '' : 's'} ·
        {' '}all share width {sortedVariants[0]?.widthMm}mm where applicable
      </p>

      <div
        role="region"
        aria-label={`${product.name} variant table — scroll horizontally to view all columns`}
        tabIndex={0}
        className="mt-4 -mx-1 overflow-x-auto rounded-md border border-bluegray/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
      >
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            {product.name} — {sortedVariants.length} variant
            {sortedVariants.length === 1 ? '' : 's'} by thickness, dimensions, weight, edge profile, and SKU.
          </caption>
          <thead className="bg-bg-soft">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-bg-soft px-3 py-2.5 text-left font-semibold text-navy whitespace-nowrap shadow-[2px_0_0_0_rgba(11,27,42,0.06)]"
              >
                Thickness
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-navy whitespace-nowrap">
                Dimensions (W × L)
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-navy whitespace-nowrap">
                Weight
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-navy whitespace-nowrap">
                Edge profile
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-navy whitespace-nowrap">
                SKU
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-navy whitespace-nowrap">
                Panels / pallet
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedVariants.map((v, idx) => (
              <tr
                key={v.sku}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-bg-soft/40'}
              >
                <th
                  scope="row"
                  className={`sticky left-0 z-10 px-3 py-2.5 text-left font-medium text-navy whitespace-nowrap shadow-[2px_0_0_0_rgba(11,27,42,0.06)] ${idx % 2 === 0 ? 'bg-white' : 'bg-bg-soft/40'}`}
                >
                  {v.thicknessMm}mm
                  <span className="block text-xs font-normal text-ink/60">
                    {v.thicknessImperial}
                  </span>
                </th>
                <td className="px-3 py-2.5 text-ink/85 whitespace-nowrap">
                  {v.widthMm} × {v.lengthMm} mm
                </td>
                <td className="px-3 py-2.5 text-ink/85 whitespace-nowrap">
                  {v.weightKg} kg
                  <span className="block text-xs text-ink/60">{v.weightLbs} lb</span>
                </td>
                <td className="px-3 py-2.5 text-ink/85 whitespace-nowrap">
                  {formatEdgeProfile(v.edgeProfile)}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink/85 whitespace-nowrap">
                  {v.sku}
                </td>
                <td className="px-3 py-2.5 text-ink/85 whitespace-nowrap">
                  {v.panelsPerPallet ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink/55">
        Density {product.density.min}–{product.density.max} {product.density.unit} ·
        {' '}Flexural strength ≥ {product.flexuralStrengthMin.value} {product.flexuralStrengthMin.unit}
      </p>
    </section>
  );
}
