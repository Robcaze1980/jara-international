import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * /es/service-areas — Spanish counterpart (C15 hreflang scaffolding).
 *
 * Sprint 4 step 8 sibling. Brand-compliant Spanish stub with link to full
 * English page. Phase 6 will expand to Spanish equivalent of the
 * delivery-tier narrative.
 */

export const metadata: Metadata = {
  title: 'Áreas de Servicio',
  description:
    'JARA International sirve al mercado de construcción de Estados Unidos desde nuestra bodega en Long Beach, California. Entrega 0–3 días en costa oeste; 3–5 días a Arizona y Nevada; órdenes por contenedor a otras regiones de EE.UU.',
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
          Áreas de Servicio
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/85">
          JARA International sirve al mercado de construcción de Estados
          Unidos desde nuestra bodega en{' '}
          <strong className="text-white">Long Beach, California</strong>.
        </p>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Tiempos de entrega</h2>
          <ul className="mt-4 space-y-2 text-white/85">
            <li>• <strong className="text-white">Mismo día o siguiente:</strong> &lt; 50 millas de Long Beach (LA, Orange County)</li>
            <li>• <strong className="text-white">0–3 días hábiles:</strong> Sur de California (San Diego, Inland Empire)</li>
            <li>• <strong className="text-white">3–5 días hábiles:</strong> Norte de California, Arizona, Nevada</li>
            <li>• <strong className="text-white">Por contenedor:</strong> 6–8 semanas (cualquier estado de EE.UU. continental)</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Áreas cubiertas</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-white/85 sm:grid-cols-2">
            {SITE.serviceAreas.map((area) => (
              <li key={area}>• {area}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-lg border border-white/20 bg-white/5 p-6">
          <h2 className="font-display text-xl font-bold">¿Su área no aparece?</h2>
          <p className="mt-2 text-white/85">
            Para proyectos fuera de nuestra cobertura estándar coordinamos
            órdenes por contenedor directo desde la planta. Contáctenos:
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
          Página completa con tabla de tiempos por distancia disponible en{' '}
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
