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
import { CertGapWarning, type CertGapWarningContent } from '@/components/CertGapWarning';

/**
 * Per-slug cert-gap warning content (Round 11 R11-D + R11-E).
 *
 * Slugs NOT in this map render no warning. Slugs IN this map render a
 * persistent amber callout above the product hero so US specifiers cannot
 * skim past the cert gap to the FAQ.
 */
const CERT_GAP_WARNINGS: Record<string, CertGapWarningContent | undefined> = {
  'lap-siding-tongue-and-groove': {
    title: 'No ICC-ES Evaluation Service Report — confirm AHJ acceptance',
    body:
      'PLYCEM Lap Siding is certified to ASTM C1186-08 Type A Grade I and ASTM E-84 surface burning, but does NOT carry an ICC-ES Evaluation Service Report equivalent to James Hardie HardiePlank\'s ESR-2290. For projects requiring an ESR-referenced wall assembly — most insurance-driven specifications and larger commercial work — confirm acceptance with your Authority Having Jurisdiction (AHJ) before specifying. Suitable for residential and light commercial applications where AHJ accepts manufacturer ASTM documentation directly.',
  },
  'corrugated-roof-tile': {
    title: 'Not US Class A fire-rated — international / Caribbean / export use only',
    body:
      'PLYCEM Eureka Sevillana corrugated roof tile is NOT certified to UL 263 or UL 790 Class A roof assembly testing. It CANNOT be specified for California Building Code Chapter 7A WUI (Wildland-Urban Interface) zones, Florida Miami-Dade HVHZ, or any US jurisdiction enforcing Class A fire-rated roof requirements. Approved for Caribbean, Central American, and international export markets where local codes apply, and for US installations only where the AHJ explicitly does not require a Class A roof assembly.',
  },
};

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
    title: `${product.name} — Fiber-Cement Panel`,
    description: product.shortDescription,
    alternates: {
      canonical,
      // Hreflang launch limitation (Round 8 §4 disposition, Round 9 C6 comment):
      // es-US points to /es marketing root for ALL 6 detail pages because per-slug
      // Spanish detail routes are post-launch scope. Do NOT "fix" this to
      // ${SITE.url}/es/products/${slug} until those routes exist — Google's hreflang
      // validator will demote the whole chain if alternates 404.
      languages: {
        'en-US': canonical,
        'es-US': `${SITE.url}/es`,
        'x-default': canonical,
      },
    },
    openGraph: {
      title: `${product.name} — Fiber-Cement Panel`,
      description: product.shortDescription,
      url: canonical,
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — Fiber-Cement Panel`,
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

        {CERT_GAP_WARNINGS[product.slug] && (
          <div className="mt-8">
            <CertGapWarning
              title={CERT_GAP_WARNINGS[product.slug]!.title}
              body={CERT_GAP_WARNINGS[product.slug]!.body}
            />
          </div>
        )}

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
