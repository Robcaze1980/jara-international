import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * /es/service-areas — Spanish counterpart (C15 hreflang scaffolding).
 *
 * 2026-05-16 rewrite: pivoted from Long Beach warehouse premise to direct
 * factory shipping model. Mirrors the English /service-areas content
 * structure at stub level. Full Spanish expansion deferred to Phase 6.
 */

export const metadata: Metadata = {
  title: 'Pedidos y Logística',
  description:
    'Cómo JARA cumple pedidos de fibrocemento en EE.UU.: envío directo desde planta PLYCEM en Centroamérica, entrega puerta-a-puerta ~3–4 semanas.',
  alternates: {
    canonical: `${SITE.url}/es/service-areas`,
    languages: {
      'en-US': `${SITE.url}/service-areas`,
      'es-US': `${SITE.url}/es/service-areas`,
      'x-default': `${SITE.url}/service-areas`,
    },
  },
};

export default function SpanishServiceAreasStubPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
        <header className="mb-10">
          <Link
            href="/es"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            ← Volver a /es
          </Link>
        </header>

        <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl text-balance">
          Pedidos y Logística
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/85">
          JARA International suministra paneles PLYCEM mediante envío directo
          desde planta PLYCEM en{' '}
          <strong className="text-white">Costa Rica, El Salvador y Honduras</strong>{' '}
          a su sitio de obra en EE.UU. Coordinamos flete marítimo, despacho
          aduanal y transporte final &mdash; un solo punto de contacto desde
          la orden de compra hasta la entrega.
        </p>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Tiempos típicos</h2>
          <ul className="mt-4 space-y-2 text-white/85">
            <li>• <strong className="text-white">Cotización:</strong> respuesta en 1 día hábil</li>
            <li>• <strong className="text-white">Producción + flete marítimo:</strong> semana 1–3</li>
            <li>• <strong className="text-white">Despacho aduanal en puerto:</strong> 2–5 días hábiles</li>
            <li>• <strong className="text-white">Transporte final al sitio:</strong> 2–7 días</li>
            <li>• <strong className="text-white">Total puerta-a-puerta típico:</strong> 3–4 semanas</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Regiones que servimos</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-white/85 sm:grid-cols-2">
            {SITE.serviceAreas.map((area) => (
              <li key={area}>• {area}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/65">
            Puertos de entrada típicos: Long Beach, Houston, Miami, y Nueva
            York/Nueva Jersey, seleccionados según proximidad al sitio.
          </p>
        </section>

        <section className="mt-10 rounded-lg border border-white/20 bg-white/5 p-6">
          <h2 className="font-display text-xl font-bold">¿Listo para cotizar?</h2>
          <p className="mt-2 text-white/85">
            Envíenos ubicación del proyecto, metros cuadrados estimados y
            fecha objetivo de construcción. Devolvemos cotización con tiempo
            de entrega y paquete de submittal listo para AHJ.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-white/90">
            <a
              href={`tel:${SITE.phonePrimaryRaw}`}
              className="hover:text-white transition-colors"
            >
              ☎ {SITE.phonePrimary} · Anna (24/7, en inglés y español)
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-white transition-colors"
            >
              ✉ {SITE.email}
            </a>
          </div>
        </section>

        <p className="mt-10 text-sm text-white/65">
          Página completa en{' '}
          <Link
            href="/service-areas"
            className="underline underline-offset-2 hover:text-white"
          >
            inglés en /service-areas
          </Link>
          . Expansión en español llegará en una próxima actualización (Phase 6).
        </p>
      </div>
    </div>
  );
}
