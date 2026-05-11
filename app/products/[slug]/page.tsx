import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/site';
import { PRODUCTS, getProductBySlug } from '@/data/products';
import { productSchema, jsonLdScript } from '@/lib/jsonld';
import { getRelatedProducts } from '@/lib/related-products';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductDetailHero } from '@/components/ProductDetailHero';
import { VariantTable } from '@/components/VariantTable';
import { ComplianceSection } from '@/components/ComplianceSection';
import { ProductFAQ } from '@/components/ProductFAQ';
import { RelatedProducts } from '@/components/RelatedProducts';
import { FinalCTA } from '@/components/FinalCTA';

/**
 * /products/[slug] — full product detail page (Sprint 3 / Round 8).
 *
 * Section ordering per PE1 4/4 unanimous vote:
 *   Breadcrumbs → Hero → Variants → Compliance → FAQ → Related → Final CTA
 *
 * JSON-LD: 3 blocks per page (Product + FAQPage + BreadcrumbList), each with a
 * collision-safe @id derived from the canonical URL (Round 8 F1.R8).
 */

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  const canonical = `${SITE.url}/products/${product.slug}`;

  return {
    title: `${product.name} — PLYCEM Fiber-Cement Panel`,
    description: product.shortDescription,
    alternates: {
      canonical,
      languages: {
        'en-US': canonical,
        'es-US': `${SITE.url}/es`,
        'x-default': canonical,
      },
    },
    openGraph: {
      title: `${product.name} — PLYCEM Fiber-Cement Panel`,
      description: product.shortDescription,
      url: canonical,
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — PLYCEM Fiber-Cement Panel`,
      description: product.shortDescription,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const canonical = `${SITE.url}/products/${product.slug}`;
  const relatedProducts = getRelatedProducts(product.slug, 3);

  return (
    <div className="bg-bg-soft">
      {/* Per-product Product JSON-LD (kept from Sprint 2 cleanup stub). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productSchema(product)) }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-6 pb-12 lg:px-8 lg:pt-8 lg:pb-16">
        <Breadcrumbs
          pageUrl={canonical}
          items={[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: product.name, path: `/products/${product.slug}` },
          ]}
        />

        <div className="mt-8 lg:mt-12">
          <ProductDetailHero product={product} />
        </div>

        <div className="mt-12 grid gap-6 lg:gap-8">
          <VariantTable product={product} />
          <ComplianceSection product={product} />
          <ProductFAQ product={product} pageUrl={canonical} />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>

      <FinalCTA />
    </div>
  );
}
