import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EsSiblingNav } from '@/components/EsSiblingNav';

/**
 * /es/contact — Spanish counterpart (C15 hreflang scaffolding).
 *
 * Sprint 4 step 6 sibling. Bilingual support is a JARA value-prop (per
 * ADR-023), so this stub is more functional than the other /es/<route>
 * stubs — surfaces all 4 contact channels in Spanish-readable form.
 */

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contacta a JARA International — línea de ventas 24/7, WhatsApp, o email. Soporte bilingüe (inglés/español), respuesta en 1 día hábil.',
  alternates: {
    canonical: `${SITE.url}/es/contact`,
    languages: {
      'en-US': `${SITE.url}/contact`,
      'es-US': `${SITE.url}/es/contact`,
      'x-default': `${SITE.url}/contact`,
    },
  },
};

export default function SpanishContactStubPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
        <header className="mb-10">
          <Breadcrumbs
            pageUrl={`${SITE.url}/es/contact`}
            tone="dark"
            items={[
              { name: 'Inicio', path: '/es' },
              { name: 'Contacto', path: '/es/contact' },
            ]}
          />
        </header>

        <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl text-balance">
          Contacto
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/85">
          Cuatro formas de contactarnos — usa la que prefieras. Robertson
          responde personalmente en 1 día hábil en cualquier canal. Soporte
          en inglés y español.
        </p>

        <div className="mt-10 space-y-4">
          {/* Primary sales line */}
          <a
            href={`tel:${SITE.phonePrimaryRaw}`}
            className="block rounded-lg border-2 border-white/40 bg-white/5 p-5 hover:bg-white/10 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-bluegray">
              Línea de ventas · 24/7
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">
              {SITE.phonePrimary}
            </p>
            <p className="mt-2 text-sm text-white/80">
              Nuestro primer punto de contacto — captura los datos de tu
              proyecto las 24 horas y le pasa el caso a Robertson para el
              callback. Atiende en inglés y español.
            </p>
          </a>

          {/* Robertson direct */}
          <a
            href={`tel:${SITE.phoneSecondaryRaw}`}
            className="block rounded-lg border border-white/20 bg-white/5 p-5 hover:bg-white/10 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-bluegray">
              Robertson · línea directa
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">
              {SITE.phoneSecondary}
            </p>
            <p className="mt-2 text-sm text-white/80">
              Si prefieres hablar directamente con Robertson en lugar de la
              línea de ventas.
            </p>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${SITE.phoneSecondaryRaw.replace('+', '')}`}
            target="_blank"
            rel="noopener"
            className="block rounded-lg border border-white/20 bg-white/5 p-5 hover:bg-white/10 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-bluegray">
              WhatsApp
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">
              {SITE.phoneSecondary}
            </p>
            <p className="mt-2 text-sm text-white/80">
              Envía mensajes, fotos, planos o dudas rápidas. Ideal para
              compartir imágenes de obra o detalles técnicos.
            </p>
          </a>

          {/* Email */}
          <a
            href={`mailto:${SITE.email}`}
            className="block rounded-lg border border-white/20 bg-white/5 p-5 hover:bg-white/10 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-bluegray">
              Email
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">
              {SITE.email}
            </p>
            <p className="mt-2 text-sm text-white/80">
              Para especificaciones técnicas, planos, RFQs, o consultas
              detalladas. Respuesta completa en 1 día hábil.
            </p>
          </a>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold">¿Qué incluir en tu primer mensaje?</h2>
          <ul className="mt-4 space-y-2 text-white/85">
            <li>• <strong className="text-white">Tipo de proyecto:</strong> multifamiliar, hotel, comercial, modular, etc.</li>
            <li>• <strong className="text-white">Ubicación:</strong> ciudad y estado (determina tiempo de entrega)</li>
            <li>• <strong className="text-white">Área estimada:</strong> pies cuadrados aproximados</li>
            <li>• <strong className="text-white">Fecha objetivo de construcción</strong></li>
            <li>• <strong className="text-white">Espesor de panel</strong> (si la especificación lo indica)</li>
            <li>• <strong className="text-white">Planos o specs</strong> opcionales (vía WhatsApp o email)</li>
          </ul>
        </section>

        <p className="mt-12 text-sm text-white/65">
          Página completa con horarios, idiomas y FAQ disponible en{' '}
          <Link
            href="/contact"
            className="underline underline-offset-2 hover:text-white"
          >
            inglés en /contact
          </Link>
          .
        </p>

        <EsSiblingNav current="/es/contact" />
      </div>
    </div>
  );
}
