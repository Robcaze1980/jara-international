import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, ArrowRight, Ship, FileCheck, Globe2 } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { jsonLdScript } from '@/lib/jsonld';

/**
 * /about — company / entity-authority page (SEO/GEO audit critic addition #3).
 *
 * A first-year importer with no About page is low E-E-A-T — exactly what AI
 * answer engines hesitate to cite for commercial/compliance claims. This page
 * establishes trust honestly: JARA is new, but its founder is a proven logistics
 * operator. Copy is founder-verified (2026-07-09) — do NOT embellish beyond it.
 *
 * Emits an AboutPage node linking the Organization (@id #organization) and the
 * founder Person (@id #founder, defined in organizationSchema).
 */

const PAGE_URL = `${SITE.url}/about`;

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'California-based direct-import distributor of PLYCEM fiber-cement panels. Founded by a logistics operator with 25+ years of experience.',
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-US': PAGE_URL, 'x-default': PAGE_URL },
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${PAGE_URL}#page`,
  url: PAGE_URL,
  name: 'About JARA International',
  about: { '@id': `${SITE.url}/#organization` },
  mainEntity: { '@id': `${SITE.url}/#founder` },
  inLanguage: 'en-US',
};

export default function AboutPage() {
  return (
    <div className="bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(aboutSchema) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <Breadcrumbs
          pageUrl={PAGE_URL}
          items={[
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]}
        />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          About
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          A new company, built on a proven logistics operator
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/85">
          JARA International Inc. is a California-based, direct-import distributor of
          PLYCEM non-combustible fiber-cement panels for US construction. We are a new
          company — but the import and logistics engine behind us is not.
        </p>

        <h2 className="mt-12 font-display text-xl font-bold text-navy">Who founded JARA</h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          JARA was founded by{' '}
          <strong className="text-navy">Robertson Carrillo Zeledon</strong>, who
          brings 25+ years across business, administration, and entrepreneurship —
          including <strong>7 years in international logistics</strong>. He founded and ran{' '}
          <strong className="text-navy">Asia Cargo S.A.</strong>, a freight-forwarding
          company in Nicaragua, and worked at <strong className="text-navy">Dimerco</strong>&rsquo;s
          US branch in the San Francisco Bay Area. That work spanned Asia, the United
          States, and Latin America, and was primarily ocean freight — the same
          container-freight backbone JARA runs on today.
        </p>
        <p className="mt-4 leading-relaxed text-ink/80">
          Moving containers across borders, clearing US customs, and coordinating
          final-mile delivery isn&rsquo;t new territory for us; it&rsquo;s the work our
          founder has done for years. That is the capability JARA is built on — taking
          PLYCEM panels from the factory in Central America to your US jobsite on a
          predictable 3–4 week timeline.
        </p>

        <h2 className="mt-12 font-display text-xl font-bold text-navy">What we do</h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          We connect US contractors, architects, engineers, and developers with the
          PLYCEM fiber-cement panel line — led by the non-combustible{' '}
          <Link href="/products/high-performance-subfloor" className="font-semibold text-navy underline decoration-bluegray underline-offset-4 hover:decoration-navy">
            High Performance Subfloor
          </Link>{' '}
          — direct from the manufacturer, with the UL / ASTM / IAPMO / IBC documentation
          your Authority Having Jurisdiction needs for approval. Container-direct, with no
          US-warehouse markup.
        </p>

        <h2 className="mt-12 font-display text-xl font-bold text-navy">How we work</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <Ship className="h-5 w-5 text-steel" aria-hidden="true" strokeWidth={1.75} />
            <h3 className="mt-3 font-display text-sm font-semibold text-navy">
              Direct-import logistics
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/75">
              One point of contact from quote to delivery — ocean freight, customs, and
              final-mile handled end-to-end.
            </p>
          </div>
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <FileCheck className="h-5 w-5 text-steel" aria-hidden="true" strokeWidth={1.75} />
            <h3 className="mt-3 font-display text-sm font-semibold text-navy">
              Submittal-ready
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/75">
              UL, ASTM, IAPMO, and IBC documentation packaged for AHJ approval, plus
              transparent delivered (DDP) pricing.
            </p>
          </div>
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <Globe2 className="h-5 w-5 text-steel" aria-hidden="true" strokeWidth={1.75} />
            <h3 className="mt-3 font-display text-sm font-semibold text-navy">
              Bilingual, fast
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/75">
              English and Spanish technical support, with technology-forward operations
              for fast quotes and answers.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
            Talk to JARA · {SITE.phonePrimary}
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-md border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white"
          >
            See delivered pricing
            <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
          </Link>
        </div>
      </article>
    </div>
  );
}
