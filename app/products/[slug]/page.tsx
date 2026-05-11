import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, Mail, ArrowRight, FileText } from 'lucide-react';
import { SITE } from '@/lib/site';
import { PRODUCTS, getProductBySlug } from '@/data/products';
import { productSchema, jsonLdScript } from '@/lib/jsonld';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * /products/[slug] — STUB dynamic page (Round 7 cleanup).
 *
 * Sprint 3 will replace this with the full product detail template
 * (variant table, fire-rated assemblies, applications, FAQ section,
 * datasheet downloads, related products).
 *
 * For now, surfaces the data we already have from data/products.ts so
 * each product URL returns 200 with useful content + JSON-LD Product
 * schema specific to that page (canonical structured data per @id).
 */

// Generate static params for all 6 products (so they prerender at build time)
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} — PLYCEM Fiber-Cement Panel`,
    description: product.shortDescription,
    alternates: {
      canonical: `${SITE.url}/products/${product.slug}`,
      languages: {
        'en-US': `${SITE.url}/products/${product.slug}`,
        'es-US': `${SITE.url}/es`,
        'x-default': `${SITE.url}/products/${product.slug}`,
      },
    },
  };
}

export default async function ProductDetailStubPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const skus = product.variants.map((v) => v.sku).join(', ');
  const thicknesses = [...new Set(product.variants.map((v) => `${v.thicknessMm}mm (${v.thicknessImperial})`))].join(' · ');

  return (
    <div className="min-h-[60vh] bg-bg-soft">
      {/* Per-product JSON-LD Product schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productSchema(product)) }}
      />

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-steel hover:text-navy"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          All products
        </Link>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          PLYCEM Product · Distributed by JARA International
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl text-balance">
          {product.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
          {product.longDescription}
        </p>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-navy">
              Available variants
            </h2>
            <p className="mt-2 text-sm text-ink/75">
              {product.variants.length} SKU{product.variants.length === 1 ? '' : 's'} ·{' '}
              Thicknesses: {thicknesses}
            </p>
            <p className="mt-3 text-xs text-ink/55 break-all">
              SKUs: {skus}
            </p>
          </div>
          <div className="rounded-lg border border-bluegray/40 bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-navy">
              Applications
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-ink/80">
              {product.applications.map((app) => (
                <li key={app}>• {app}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-bluegray/40 bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-navy">
            Compliance &amp; certifications
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/80">
            {product.compliance.map((cert) => (
              <li key={cert.standard} className="flex gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-steel" aria-hidden="true" />
                <span>
                  <strong className="text-navy">{cert.standard}</strong> — {cert.detail}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 rounded-lg border-2 border-navy bg-white p-6 text-center">
          <h2 className="font-display text-xl font-bold text-navy">
            Get the full datasheet + quote
          </h2>
          <p className="mt-2 text-sm text-ink/75">
            Detailed PDFs (UL assembly references, ASTM test certificates, IAPMO
            ER-360 where applicable, dimension tables, fastening schedule) sent
            within 1 business day.
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
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Quote request: ${product.name}`)}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors"
            >
              <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              Email quote request
            </a>
          </div>
          <p className="mt-4 text-xs text-ink/55">
            Full interactive product detail page (variant tables, assembly
            references, FAQs, related products) launching this week.
          </p>
        </div>
      </section>
    </div>
  );
}
