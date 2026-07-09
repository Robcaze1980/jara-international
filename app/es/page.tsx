import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * Spanish landing page (ADR-008 H3 lock + Round 5 F3.R5 fix).
 *
 * Per ADR-008 the launch surface includes EXACTLY ONE Spanish page —
 * a landing summarizing core value prop and pointing to English contact.
 * Full ES rollout deferred to Phase 6 per memory `jara_us_market.md`
 * (Spanish targets US Hispanic construction labor, not LatAm export).
 *
 * Minimal-but-complete: brand-compliant copy, JARA navy theme, contact
 * CTA → English form. Validates the i18n routing scaffold for Phase 6
 * expansion AND satisfies hreflang contract (es-US target must return 200).
 */

// Round 12 R12-C1 (SB-5) + R12-S4: remove "PLYCEM" AND the leading "${SITE.name} —"
// — the latter caused a duplicate brand suffix because the root layout template
// appends "| ${SITE.name}" anyway. Resolved title is now
// "Entrepiso Alto Desempeño — Subfloor en EE.UU. | JARA International Inc."
export const metadata: Metadata = {
  title: 'Entrepiso Alto Desempeño — Subfloor en EE.UU.',
  description:
    'Distribuidor de PLYCEM Entrepiso Alto Desempeño — fibrocemento no combustible para construcción en EE.UU. Envío directo, entrega 3–4 semanas.',
  alternates: {
    canonical: `${SITE.url}/es`,
    languages: {
      'en-US': SITE.url,
      'es-US': `${SITE.url}/es`,
      'x-default': SITE.url,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    url: `${SITE.url}/es`,
    siteName: SITE.name,
    title: `${SITE.name} — Distribuidor de Paneles Fibrocemento en EE.UU.`,
    description:
      'Distribuidor B2B de paneles de fibrocemento PLYCEM. Envío directo ' +
      'desde planta — entrega puerta-a-puerta en 3–4 semanas en EE.UU.',
    images: [{ url: '/images/og/og-default.png', width: 1200, height: 630, alt: SITE.name }],
  },
};

export default function SpanishLandingPage() {
  return (
    <div className="min-h-screen bg-[#062B49] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <header className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            aria-label="View site in English"
          >
            ← English version
          </Link>
        </header>

        <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
          <span className="text-[#B8C7D6]">PLYCEM</span> Entrepiso Alto Desempeño
          — Subfloor No Combustible para Construcción Multifamiliar y
          Comercial en EE.UU.
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-white/85 md:text-xl">
          <strong className="text-white">JARA International Inc.</strong>{' '}
          distribuye el PLYCEM Entrepiso Alto Desempeño — entrepiso
          estructural de fibrocemento clasificado UL R15140 para
          ensamblajes de piso/cielo con clasificación al fuego de 1 y 2
          horas. Especificado para construcción multifamiliar Tipo V sobre
          podio, hoteles, pisos comerciales con vigueta metálica, y
          construcción modular. Plus el resto del envolvente PLYCEM:
          cladding exterior, cement board, siding, deck plancha, deck modular y cubierta corrugada.
          Envío directo desde planta PLYCEM en{' '}
          <strong className="text-white">Costa Rica, El Salvador y Honduras</strong>{' '}
          — entrega puerta-a-puerta en 3–4 semanas.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Productos que distribuimos</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Producto principal:
          </p>
          <ul className="mt-2 space-y-2 text-white/85">
            <li>★ <strong className="text-white">PLYCEM Entrepiso Alto Desempeño</strong> — entrepiso no combustible para construcción Tipo I/II, multifamiliar y comercial. UL R15140 · ASTM E-136 · IAPMO ER-360 · CBC Capítulo 7A.</li>
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            Complete el envolvente:
          </p>
          <ul className="mt-2 space-y-2 text-white/85">
            <li>• <strong>Deck</strong> — plancha estructural de fibrocemento para terrazas y pisos drenados (instalación con clip oculto)</li>
            <li>• <strong>Deck Modular</strong> — losetas de fibrocemento entrelazadas para terrazas, balcones y áreas de piscina</li>
            <li>• <strong>Exterior Hidden Joint</strong> — fachadas con acabado monolítico</li>
            <li>• <strong>Exterior Cement Board</strong> — paredes interiores y exteriores con basecoat</li>
            <li>• <strong>Siding</strong> — tablilla de fibrocemento en 4 perfiles arquitectónicos</li>
            <li>• <strong>Corrugated Roof Tile</strong> — cubierta corrugada con estética de teja española (mercado internacional / Caribe)</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Certificaciones</h2>
          <p className="mt-4 text-white/85 leading-relaxed">
            UL R15140 (clasificación contra fuego) · ASTM C1186 Tipo A Grado I · ISO 8336:2018 ·
            IAPMO ER-360 (cumplimiento código IBC). Plantas con certificación ISO 9001:2015,
            14001:2015 y 45001:2018.
          </p>
        </section>

        <section className="mt-12 rounded-lg border border-white/20 bg-white/5 p-6">
          <h2 className="font-display text-xl font-bold">Solicitar Cotización</h2>
          <p className="mt-2 text-white/85">
            Para cotizaciones, fichas técnicas, o consultas técnicas de proyecto, contáctenos:
          </p>
          <div className="mt-4 flex flex-col gap-2 text-white/90">
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-white transition-colors"
            >
              ✉ {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, '')}`}
              className="hover:text-white transition-colors"
            >
              ☎ {SITE.phone}
            </a>
            <span className="text-white/70 text-sm">
              Atendemos en español e inglés. Respuesta en 1 día hábil.
            </span>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/50">
          <p>
            © 2026 {SITE.legalName} — {SITE.tagline}
          </p>
          <p className="mt-2 text-xs">
            Sitio principal en inglés:{' '}
            <Link href="/" className="underline hover:text-white">
              jarainternational.com
            </Link>
            . Versión en español ampliada llegará en una próxima actualización.
          </p>
        </footer>
      </div>
    </div>
  );
}
