/**
 * JSON-LD schema builders (per ADR-014 SA2 + F4.R3 entity linking).
 * All entities use @id for cross-referencing per F4.R3.
 */
import { SITE } from './site';

const ORG_ID = `${SITE.url}/#organization`;
const LOCAL_BUSINESS_ID = `${SITE.url}/#localbusiness`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.warehouse.city,
      addressRegion: SITE.warehouse.region,
      addressCountry: SITE.warehouse.country,
    },
    areaServed: SITE.serviceAreas.map((area) => ({
      '@type': 'Place',
      name: area,
    })),
    foundingDate: '2026',
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': LOCAL_BUSINESS_ID,
    name: SITE.warehouse.name,
    parentOrganization: { '@id': ORG_ID },
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.warehouse.city,
      addressRegion: SITE.warehouse.region,
      addressCountry: SITE.warehouse.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.warehouse.latitude,
      longitude: SITE.warehouse.longitude,
    },
    areaServed: SITE.serviceAreas.map((area) => ({ '@type': 'Place', name: area })),
  };
}

/**
 * BreadcrumbList schema. Per Round 8 F1.R8 (4/4 voters): each schema rendered on
 * a single page needs a collision-free `@id`, so the canonical URL is appended
 * with `#breadcrumb`.
 */
export function breadcrumbSchema(
  pageUrl: string,
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Per Round 6 F4.R6: Product schema for each featured product on home + product detail pages. */
export function productSchema(product: import('@/data/products').Product) {
  const firstVariant = product.variants[0];
  const productUrl = `${SITE.url}/products/${product.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    description: product.shortDescription,
    url: productUrl,
    sku: firstVariant?.sku,
    mpn: firstVariant?.sku, // SKU and MPN are equivalent for Plycem product codes
    category: 'Fiber Cement Building Panel',
    manufacturer: {
      '@type': 'Organization',
      name: product.manufacturer,
    },
    brand: {
      '@type': 'Brand',
      name: product.manufacturer,
    },
    // Per Round 3 GLM finding: compliance certifications as additionalProperty
    additionalProperty: product.compliance.map((cert) => ({
      '@type': 'PropertyValue',
      name: cert.standard,
      value: cert.detail,
    })),
    // Distributor relationship (Plycem ship blocker compliant — no "Authorized" claim).
    // Per ship blocker SB-4: NO price, NO priceCurrency, NO priceSpecification —
    // a quote-only model. availability=InStock is the only commercial signal we
    // expose; pricing is communicated privately via the submittal form path.
    offers: {
      '@type': 'Offer',
      seller: { '@id': ORG_ID },
      availability: 'https://schema.org/InStock',
      areaServed: SITE.serviceAreas.map((a) => ({ '@type': 'Place', name: a })),
    },
  };
}

/** WebSite schema for home page (Round 6 GLM finding + Round 7 DeepSeek SearchAction). */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: ['en-US', 'es-US'],
    // Sitelinks Search Box eligibility (no actual search yet — Phase 6 backlog).
    // Pointing to /products with `q` parameter signals search intent for Google;
    // when /products gets a real search Sprint 4+, the URL template here matches.
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * FAQPage schema with guard — only renders if items array is non-empty
 * (Round 5 GLM finding F6 dispositioned). Per Round 8 F1.R8 the canonical
 * URL is appended with `#faq` to disambiguate when three JSON-LD blocks
 * (Product + FAQPage + BreadcrumbList) ship together on a detail page.
 */
export function faqSchema(
  pageUrl: string,
  items: Array<{ question: string; answer: string }>,
) {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** Render JSON-LD as a script tag string for embedding in <head>. */
export function jsonLdScript(schema: object | null): string {
  if (!schema) return '';
  return JSON.stringify(schema);
}
