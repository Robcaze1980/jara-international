import Image from 'next/image';
import { Truck, Ship, Factory } from 'lucide-react';
import type { Product } from '@/data/products';

/**
 * "How it ships" section — pairs the palletized product image with the
 * direct-factory supply chain narrative. Reinforces JARA's positioning:
 * no US warehouse, no distributor markup, container-direct from Plycem
 * manufacturing plants. Per ADR-049 (warehouse positioning).
 *
 * Returns null if product.palletImage is not set. Reusable across any
 * product that has a pallet shot (siding today, more later as imagery lands).
 */

const SHIPPING_STEPS = [
  {
    icon: Factory,
    label: 'Plycem factory',
    detail: 'Costa Rica · El Salvador · Honduras',
  },
  {
    icon: Ship,
    label: 'Ocean freight',
    detail: 'Containerized, port-to-port',
  },
  {
    icon: Truck,
    label: 'US trucking',
    detail: 'Final-mile delivery to jobsite',
  },
];

export function ShippingDetail({ product }: { product: Product }) {
  if (!product.palletImage) return null;

  return (
    <section
      aria-labelledby="shipping-detail-heading"
      className="overflow-hidden rounded-lg bg-navy"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] bg-white">
          <Image
            src={product.palletImage.src}
            alt={product.palletImage.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-bluegray">
            How it ships
          </p>
          <h2
            id="shipping-detail-heading"
            className="mt-3 font-display text-2xl font-bold text-white md:text-3xl text-balance"
          >
            Direct factory shipment — no warehouse markup
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/85">
            Plycem Siding ships palletized direct from the manufacturing
            facility to your jobsite. JARA does not operate a US warehouse;
            material moves container-direct from Plycem plants in Costa Rica,
            El Salvador, or Honduras to a US port of entry, through customs,
            and onward by truck.
          </p>
          <p className="mt-3 text-base leading-relaxed text-white/85">
            Typical timeline:{' '}
            <strong className="text-white">3–4 weeks door-to-door</strong>{' '}
            from confirmed purchase order. Pricing reflects direct factory
            economics — no mid-supply-chain stocking markup.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {SHIPPING_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.label}
                  className="rounded-md border border-white/20 bg-white/5 px-3 py-3"
                >
                  <Icon
                    className="h-5 w-5 text-bluegray"
                    aria-hidden="true"
                    strokeWidth={1.75}
                  />
                  <p className="mt-2 font-display text-sm font-semibold text-white">
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                    {step.detail}
                  </p>
                </li>
              );
            })}
          </ul>

          {product.palletImage.caption && (
            <p className="mt-6 text-sm italic leading-relaxed text-white/65">
              {product.palletImage.caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
