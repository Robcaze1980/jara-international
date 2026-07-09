import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, ArrowRight, Truck, ShieldCheck, PackageCheck, FileText, CheckCircle2 } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  plycemOrganizationSchema,
  pricingItemListSchema,
  faqSchema,
  jsonLdScript,
} from '@/lib/jsonld';
import { PRODUCTS, type Product, type ProductVariant } from '@/data/products';
import {
  getPricedVariants,
  getFromPriceUsd,
  isPricedProduct,
  formatUsd,
  formatPerSqFt,
  priceUnitNoun,
} from '@/lib/pricing';

/**
 * /es/pricing — contraparte en español de /pricing (R16 audit items 28–29).
 * Publica los precios DDP reales (mismos datos que /pricing vía lib/pricing) con
 * copy en español + schema ES (ItemList + FAQPage; BreadcrumbList vía <Breadcrumbs>).
 * Reemplaza el stub "por cotización" que contradecía la página en inglés.
 */

const PAGE_URL = `${SITE.url}/es/pricing`;

export const metadata: Metadata = {
  title: 'Precio de Entrepiso de Fibrocemento — DDP',
  description:
    'Precio de entrepiso de fibrocemento desde $74/panel, entregado (DDP) a puerto de EE.UU. con arancel pagado. Resto por cotización.',
  alternates: {
    canonical: PAGE_URL,
    languages: {
      'en-US': `${SITE.url}/pricing`,
      'es-US': PAGE_URL,
      'x-default': `${SITE.url}/pricing`,
    },
  },
};

const CAVEATS_ES = [
  'DDP — arancel de importación pagado, entregado a un puerto base principal de EE.UU.',
  'Entrega ~3–4 semanas, directo de fábrica (hecho a pedido)',
  'Precio por contenedor completo (40HQ)',
  'Entrega interior incluida hasta 50 mi del puerto; más allá, flete adicional',
  'Asume tiempo de descarga estándar — overtime / detención no incluidos',
  'Precio final confirmado por cotización (los precios publicados son indicativos)',
];

function edgeEs(v: ProductVariant): string {
  if (v.edgeProfile === 'tongue-and-groove') return 'T&G';
  if (v.edgeProfile === 'straight') return 'Recto';
  return '—';
}

function PricedBlock({ product }: { product: Product }) {
  const priced = getPricedVariants(product);
  const unit = priceUnitNoun(product.slug) === 'plank' ? 'plancha' : 'panel';
  const from = priced[0]?.priceUsd;
  return (
    <div className="rounded-xl border border-bluegray/40 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-bold text-navy">{product.name}</h3>
        {from != null && (
          <p className="text-sm text-ink/70">
            desde <span className="text-lg font-bold text-navy">{formatUsd(from)}</span>
            <span className="text-ink/60">/{unit}</span>
          </p>
        )}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-bluegray/40 text-left text-xs uppercase tracking-wide text-steel">
              <th className="py-2 pr-4 font-semibold">Espesor</th>
              <th className="py-2 pr-4 font-semibold">Borde</th>
              <th className="py-2 pr-4 font-semibold">$/{unit}</th>
              <th className="py-2 font-semibold">~ $/SF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bluegray/25">
            {priced.map(({ variant, priceUsd, pricePerSqFt }) => (
              <tr key={variant.sku}>
                <td className="py-2.5 pr-4 font-medium text-ink">
                  {variant.thicknessImperial} ({variant.thicknessMm} mm)
                </td>
                <td className="py-2.5 pr-4 text-ink/70">{edgeEs(variant)}</td>
                <td className="py-2.5 pr-4 font-bold text-navy">{formatUsd(priceUsd)}</td>
                <td className="py-2.5 text-ink/70">
                  {pricePerSqFt != null ? formatPerSqFt(pricePerSqFt) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/es"
          className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
        >
          Solicitar precio entregado
          <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
        </Link>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 rounded-md border border-navy/30 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-bg-soft"
        >
          Ficha del producto
        </Link>
      </div>
    </div>
  );
}

export default function EsPricingPage() {
  const priced = PRODUCTS.filter(
    (p) => isPricedProduct(p.slug) && getPricedVariants(p).length > 0,
  );
  const quoteOnly = PRODUCTS.filter(
    (p) => !isPricedProduct(p.slug) || getPricedVariants(p).length === 0,
  );

  const subfloor = PRODUCTS.find((p) => p.slug === 'high-performance-subfloor');
  const subfloorFrom = subfloor ? getFromPriceUsd(subfloor) : undefined;
  const subfloorSf = subfloor ? getPricedVariants(subfloor)[0]?.pricePerSqFt : undefined;
  const hjFrom = PRODUCTS.find((p) => p.slug === 'exterior-hidden-joint');
  const hjPrice = hjFrom ? getFromPriceUsd(hjFrom) : undefined;
  const deckP = PRODUCTS.find((p) => p.slug === 'deck');
  const deckPrice = deckP ? getFromPriceUsd(deckP) : undefined;

  const faqsEs = [
    {
      question: '¿Cuánto cuesta el entrepiso de fibrocemento no combustible?',
      answer: `El JARA High Performance Subfloor arranca en ${
        subfloorFrom != null ? formatUsd(subfloorFrom) : '$74'
      } por panel 4×8${
        subfloorSf != null ? ` (${formatPerSqFt(subfloorSf)})` : ''
      }, entregado con arancel pagado (DDP) a un puerto base principal de EE.UU. en cantidades de contenedor completo (40HQ). Exterior Hidden Joint desde ${
        hjPrice != null ? formatUsd(hjPrice) : '$28'
      }/panel y Deck desde ${
        deckPrice != null ? formatUsd(deckPrice) : '$48'
      }. Los precios son indicativos; el precio final se confirma por cotización.`,
    },
    {
      question: '¿Qué incluye el precio entregado (DDP)?',
      answer:
        'El precio publicado es DDP — incluye arancel de importación, flete marítimo, despacho de aduana en EE.UU. y entrega interior hasta 50 millas del puerto de entrada. Más allá de 50 millas aplica flete adicional. Asume tiempo de descarga estándar; overtime y detención no incluidos.',
    },
    {
      question: '¿Hay un pedido mínimo?',
      answer:
        'Los precios publicados son para contenedor completo (40HQ). Cantidades menores cambian el flete por panel — contáctenos para un precio entregado en cargas parciales.',
    },
    {
      question: '¿Tienen stock en una bodega de EE.UU.?',
      answer:
        'No. JARA no opera bodega en EE.UU. Los paneles se fabrican a pedido y se envían directo de fábrica en contenedor, con entrega puerta-a-puerta típica de ~3–4 semanas.',
    },
    {
      question: '¿Los precios publicados son finales?',
      answer:
        'Son precios indicativos de partida. El precio final entregado se confirma por cotización una vez que tengamos su producto, cantidad y puerto de entrada en EE.UU.',
    },
    {
      question: '¿Cómo se compara el precio con otras opciones en EE.UU.?',
      answer:
        'Los precios entregados (DDP) de JARA están fijados para competir con las marcas líderes de fibrocemento no combustible en EE.UU. en costo entregado — con el arancel ya pagado y sin sobreprecio de bodega local.',
    },
  ];

  return (
    <div className="bg-bg-soft">
      {[
        plycemOrganizationSchema(),
        pricingItemListSchema(priced, PAGE_URL),
        faqSchema(PAGE_URL, faqsEs),
      ].map((schema, i) => (
        <script
          key={`es-pricing-jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
        />
      ))}

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <Breadcrumbs
          pageUrl={PAGE_URL}
          items={[
            { name: 'Inicio', path: '/es' },
            { name: 'Precios', path: '/es/pricing' },
          ]}
        />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Precios
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          Precios entregados (DDP) — arancel pagado, directo de fábrica
        </h1>

        {subfloorFrom != null && hjPrice != null && deckPrice != null && (
          <div className="mt-4 max-w-2xl">
            <h2 className="font-display text-lg font-semibold text-navy">
              ¿Cuánto cuesta el entrepiso de fibrocemento no combustible?
            </h2>
            <p className="mt-2 text-base leading-relaxed text-ink/80">
              El JARA High Performance Subfloor arranca en{' '}
              <strong className="text-navy">{formatUsd(subfloorFrom)}</strong> por panel 4×8
              {subfloorSf != null && (
                <> (cerca de <strong className="text-navy">{formatPerSqFt(subfloorSf)}</strong>)</>
              )}{' '}
              — entregado con arancel pagado (DDP) a un puerto base principal de EE.UU. en
              cantidades de contenedor completo (40HQ). Exterior Hidden Joint desde{' '}
              {formatUsd(hjPrice)}/panel; Deck desde {formatUsd(deckPrice)}. Precios
              indicativos; el final se confirma por cotización.
            </p>
          </div>
        )}

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          Los precios de abajo son <strong>entregados a su puerto de entrada de EE.UU. con
          el arancel de importación pagado</strong> — precio por contenedor completo, sin
          sobreprecio de bodega local. Así ponemos paneles de fibrocemento no combustible
          en su obra a un costo entregado que compite con las marcas líderes de EE.UU.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-steel" aria-hidden="true" /> Arancel pagado (DDP)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-steel" aria-hidden="true" /> Entrega ~3–4 semanas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PackageCheck className="h-4 w-4 text-steel" aria-hidden="true" /> Contenedor completo (40HQ)
          </span>
        </div>

        <div className="mt-10 space-y-6">
          {priced.map((p) => (
            <PricedBlock key={p.slug} product={p} />
          ))}
        </div>

        {/* Condiciones (verde, override de marca §12 igual que la página en inglés) */}
        <div className="mt-8 rounded-lg border border-green-600/45 bg-green-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-700" aria-hidden="true" />
            <h2 className="font-display text-sm font-semibold text-green-800">
              Condiciones del precio
            </h2>
          </div>
          <ul className="grid gap-2.5 text-sm text-green-900 sm:grid-cols-2">
            {CAVEATS_ES.map((c) => (
              <li key={c} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" strokeWidth={2} />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {quoteOnly.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-bold text-navy">
              Otros productos — precio por cotización
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
              Los entregamos en la misma base DDP, contenedor completo. Pídanos un precio
              entregado para su volumen y puerto de entrada.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {quoteOnly.map((p) => (
                <div key={p.slug} className="flex flex-col rounded-xl border border-bluegray/40 bg-white p-5">
                  <h3 className="font-display text-base font-semibold text-navy">{p.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{p.shortDescription}</p>
                  <Link
                    href="/es"
                    className="mt-4 inline-flex items-center gap-2 self-start rounded-md border border-navy/30 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-bg-soft"
                  >
                    Solicitar precio entregado
                    <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-navy">Precios — preguntas frecuentes</h2>
          <ul className="mt-4 divide-y divide-bluegray/30">
            {faqsEs.map((faq) => (
              <li key={faq.question}>
                <details className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 list-none rounded-sm py-1 font-medium text-navy hover:text-navy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel">
                    <span>{faq.question}</span>
                    <span aria-hidden="true" className="shrink-0 text-steel transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-2 pr-7 text-sm leading-relaxed text-ink/80">{faq.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-xl border border-navy/15 bg-navy px-6 py-8 text-white">
          <h2 className="font-display text-xl font-bold">Obtenga un precio entregado para su proyecto</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
            Díganos el producto, el volumen y su puerto de entrada en EE.UU. — las
            cotizaciones se entregan típicamente en 1 día hábil.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={buildTelUrl(SITE.phonePrimaryRaw)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
            >
              <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              Llamar a Anna · {SITE.phonePrimary}
            </a>
            <Link
              href="/es"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Volver a /es
              <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
