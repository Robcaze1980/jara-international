import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EsSiblingNav } from '@/components/EsSiblingNav';

/**
 * /es/resources — Spanish counterpart (C15 hreflang scaffolding).
 *
 * Sprint 4 step 5 sibling. The English form is in-flight and 3-step;
 * full Spanish form rollout is deferred to Phase 6 per ADR-008. This
 * stub gives a brand-compliant Spanish landing with a direct path to
 * Anna phone + email for hispanohablantes who need to submit a project
 * before the Spanish form ships.
 */

export const metadata: Metadata = {
  title: 'Recursos y Paquete de Sometimiento',
  description:
    'Solicita cotización, ficha técnica o docs de cumplimiento (UL R15140, ASTM E-84, IAPMO ER-360) de JARA. Soporte bilingüe, respuesta en 1 día hábil.',
  alternates: {
    canonical: `${SITE.url}/es/resources`,
    languages: {
      'en-US': `${SITE.url}/resources`,
      'es-US': `${SITE.url}/es/resources`,
      'x-default': `${SITE.url}/resources`,
    },
  },
};

export default function SpanishResourcesStubPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
        <header className="mb-10">
          <Breadcrumbs
            pageUrl={`${SITE.url}/es/resources`}
            tone="dark"
            items={[
              { name: 'Inicio', path: '/es' },
              { name: 'Recursos y documentación', path: '/es/resources' },
            ]}
          />
        </header>

        <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl text-balance">
          Recursos y Documentación
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/85">
          Solicita una cotización personalizada o documentación de
          cumplimiento para tu proyecto. Robertson y Anna atienden en
          inglés y español; respuesta en 1 día hábil.
        </p>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Documentos disponibles</h2>
          <ul className="mt-4 space-y-3 text-white/85">
            <li>
              <strong className="text-white">UL R15140</strong> — Certificado
              de clasificación contra fuego (ensambles H502, H504, H511,
              U449, U487 — 1 y 2 horas)
            </li>
            <li>
              <strong className="text-white">ASTM E-84 Class A</strong> —
              Certificado de propagación de llama (índice 0, humo 0)
            </li>
            <li>
              <strong className="text-white">IAPMO ER-360</strong> —
              Reporte de evaluación de código IBC 2015/2012 + IRC. Vigente
              hasta 2026-07-31.
            </li>
            <li>
              <strong className="text-white">Fichas técnicas</strong> —
              ASTM C1186 Tipo A Grado I + ISO 8336:2018 para los 6 paneles
              PLYCEM
            </li>
          </ul>
        </section>

        <section className="mt-10 rounded-lg border border-white/20 bg-white/5 p-6">
          <h2 className="font-display text-xl font-bold">Cómo solicitar</h2>
          <p className="mt-2 text-white/85">
            Tres opciones — usa la que prefieras. Mientras la versión en
            español del formulario llega (Phase 6), te atendemos
            directamente por estos canales:
          </p>
          <div className="mt-4 flex flex-col gap-3 text-white/90">
            <a
              href={`tel:${SITE.phonePrimaryRaw}`}
              className="hover:text-white transition-colors"
            >
              ☎ {SITE.phonePrimary} · Anna (24/7, en inglés y español)
            </a>
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent('Solicitud de documentos / cotización')}`}
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
          Formulario completo de 3 pasos disponible en{' '}
          <Link
            href="/resources"
            className="underline underline-offset-2 hover:text-white"
          >
            inglés en /resources
          </Link>
          .
        </p>

        <EsSiblingNav current="/es/resources" />
      </div>
    </div>
  );
}
