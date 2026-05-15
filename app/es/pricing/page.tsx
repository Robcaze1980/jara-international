import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * /es/pricing — Spanish counterpart (C15 hreflang scaffolding).
 *
 * Per ADR-008 + C15 + C6: every Sprint 4 route MUST have a /es/<route>
 * counterpart returning 200 with correct hreflang alternates, even if
 * content is English-only at launch. Spanish detail-page content is a
 * Phase 6 deliverable.
 *
 * Pattern matches /es page styling (dark navy, white text) for consistent
 * Spanish-surface visual treatment.
 */

export const metadata: Metadata = {
  title: 'Precios y Cotizaciones',
  description:
    'JARA International cotiza por proyecto. Para precios, contáctenos directamente — Anna (recepcionista AI 24/7) o enviando los datos del proyecto. Respuesta en 1 día hábil desde nuestra bodega en Long Beach, California.',
  alternates: {
    canonical: `${SITE.url}/es/pricing`,
    languages: {
      'en-US': `${SITE.url}/pricing`,
      'es-US': `${SITE.url}/es/pricing`,
      'x-default': `${SITE.url}/pricing`,
    },
  },
};

export default function SpanishPricingStubPage() {
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
          Precios por cotización
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/85">
          JARA International no publica lista de precios. El costo de material
          depende de volumen, espesor de panel y perfil de borde, tiempo de
          entrega, y distancia desde nuestra bodega en Long Beach, California.
        </p>
        <p className="mt-4 text-base leading-relaxed text-white/80">
          Las cotizaciones se entregan típicamente en 1 día hábil. Contratos
          multi-proyecto y volúmenes grandes (300+ paneles) reciben
          consideración adicional en precio y programación de logística.
        </p>

        <section className="mt-10 rounded-lg border border-white/20 bg-white/5 p-6">
          <h2 className="font-display text-xl font-bold">Solicitar Cotización</h2>
          <div className="mt-4 flex flex-col gap-3 text-white/90">
            <a
              href={`tel:${SITE.phonePrimaryRaw}`}
              className="hover:text-white transition-colors"
            >
              ☎ {SITE.phonePrimary} · Anna (24/7, atiende en inglés y español)
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-white transition-colors"
            >
              ✉ {SITE.email}
            </a>
            <span className="text-white/65 text-sm">
              Robertson responde personalmente en 1 día hábil.
            </span>
          </div>
        </section>

        <p className="mt-10 text-sm text-white/65">
          Página de precios completa disponible en{' '}
          <Link
            href="/pricing"
            className="underline underline-offset-2 hover:text-white"
          >
            inglés en /pricing
          </Link>
          . Versión en español ampliada en próxima actualización (Phase 6).
        </p>
      </div>
    </div>
  );
}
