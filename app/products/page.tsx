import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { PRODUCTS } from '@/data/products';
import { buildTelUrl } from '@/lib/whatsapp';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';

/**
 * /products — STUB page (Round 7 F1.R7 fix).
 *
 * Sprint 3 will replace this with a full product catalog listing + filters.
 * For now, surfaces the 6 product names so visitors arriving from home
 * ProductCard clicks see something useful, plus Anna phone CTA + email path.
 */

export const metadata: Metadata = {
  title: 'Products — Fiber-Cement Panel Catalog',
  description:
    'Fiber-cement panels for US construction: subfloor, cladding, siding, deck, and roof tile. Specs, compliance, and delivered (DDP) pricing.',
  alternates: {
    canonical: `${SITE.url}/products`,
    languages: {
      'en-US': `${SITE.url}/products`,
      'x-default': `${SITE.url}/products`,
    },
  },
};

export default function ProductsStubPage() {
  return (
    <div className="min-h-[60vh] bg-bg-soft">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <Breadcrumbs
          pageUrl={`${SITE.url}/products`}
          items={[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
          ]}
        />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          Product Catalog
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          PLYCEM High Performance Subfloor — plus the complete panel envelope
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          JARA distributes the PLYCEM line: non-combustible fiber-cement
          structural subfloor (the lead product, UL R15140 / IAPMO / CBC
          Chapter 7A), plus exterior cladding, cement board, plank siding,
          corrugated roof tile, deck planks, and modular deck tiles. Open any
          product for specs and compliance, or jump to{' '}
          <Link
            href="/pricing"
            className="font-semibold text-navy underline decoration-bluegray underline-offset-4 hover:decoration-navy"
          >
            delivered (DDP) pricing
          </Link>
          .
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <div className="mt-12 rounded-lg border-2 border-navy bg-white p-6 text-center">
          <h2 className="font-display text-xl font-bold text-navy">
            Need a quote now?
          </h2>
          <p className="mt-2 text-sm text-ink/75">
            Talk to our 24/7 sales line — we capture your project details and
            Robertson follows up — or email Robertson directly.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={buildTelUrl(SITE.phonePrimaryRaw)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              Call {SITE.phonePrimary}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors"
            >
              <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              Email {SITE.email}
            </a>
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-steel hover:text-navy"
          >
            <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
