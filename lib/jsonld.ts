/**
 * JSON-LD schema builders (per ADR-014 SA2 + F4.R3 entity linking).
 * All entities use @id for cross-referencing per F4.R3.
 *
 * 2026-05-16 positioning correction: removed `localBusinessSchema` and the
 * `availability: InStock` signal on Product offers. JARA has no US physical
 * location — earlier LocalBusiness emission was a misrepresentation. The
 * Organization schema retains a minimal addressCountry: 'US' marker to
 * reflect US incorporation without claiming a specific physical address.
 * Supersedes the LocalBusiness portion of ADR-017.
 */
import { SITE } from './site';
import { getPricedVariants, PRICE_CURRENCY, priceUnitNoun } from './pricing';

const ORG_ID = `${SITE.url}/#organization`;

// R13-F8: Plycem manufacturer surfaced as a linked Organization entity so AI
// extractors recognize the supply chain as a single coherent graph across all
// 9 products (was previously an inline string per Product, which AI parsers
// could not de-duplicate). The @id is JARA-namespaced so it resolves whether
// or not plycem.com publishes a matching schema.org Organization. Brand stays
// inline because Google's Product rich-result parser prefers it that way.
const PLYCEM_ORG_ID = `${SITE.url}/#plycem-manufacturer`;

export function plycemOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': PLYCEM_ORG_ID,
    name: 'PLYCEM',
    legalName: 'The Plycem Company (Elementia Materials)',
    url: 'https://www.plycem.com',
    description:
      'Manufacturer of fiber-cement structural and architectural panels. Plants in Costa Rica, El Salvador, and Honduras under ISO 9001/14001/45001 quality systems.',
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    // Round 12 R12-S2 follow-up (2026-05-17): logo asset delivered;
    // Google Knowledge Panel can now surface the brand logo when JARA
    // appears in SERPs.
    logo: `${SITE.url}/images/logo/Jara_logo_transparent.png`,
    description: SITE.description,
    slogan: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    areaServed: SITE.serviceAreas.map((area) => ({
      '@type': 'Place',
      name: area,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: SITE.phone,
      email: SITE.email,
      availableLanguage: ['en', 'es'],
      areaServed: 'US',
    },
    foundingDate: '2026',
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

/**
 * Product `offers` builder (Round 16, 2026-07-09). SB-4 authorized 2026-07-06:
 * priced products emit one Offer per priced variant with a UnitPriceSpecification
 * (price, USD, full-container eligibleQuantity) per R16-Q3=B. Quote-only products
 * keep a single price-less MadeToOrder Offer.
 */
function productOffers(product: import('@/data/products').Product) {
  const areaServed = SITE.serviceAreas.map((a) => ({ '@type': 'Place', name: a }));
  const priced = getPricedVariants(product);
  if (priced.length === 0) {
    return {
      '@type': 'Offer',
      seller: { '@id': ORG_ID },
      availability: 'https://schema.org/MadeToOrder',
      areaServed,
    };
  }
  return priced.map((pv) => ({
    '@type': 'Offer',
    sku: pv.variant.sku,
    seller: { '@id': ORG_ID },
    availability: 'https://schema.org/MadeToOrder',
    // Flat price + currency so Google's Product rich-result parser surfaces the
    // price (it does not read UnitPriceSpecification). The UnitPriceSpecification
    // below carries the full-container semantics for advanced parsers / AI. (SEO
    // audit fix 2026-07-09; complements R16-Q3=B.)
    price: pv.priceUsd,
    priceCurrency: PRICE_CURRENCY,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: pv.priceUsd,
      priceCurrency: PRICE_CURRENCY,
      referenceQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitText: priceUnitNoun(product.slug),
      },
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        unitText: 'full container (40HQ)',
      },
      valueAddedTaxIncluded: false,
    },
    areaServed,
  }));
}

/** Per Round 6 F4.R6: Product schema for each featured product on home + product detail pages. */
export function productSchema(product: import('@/data/products').Product) {
  const firstVariant = product.variants[0];
  const productUrl = `${SITE.url}/products/${product.slug}`;
  // Round 12 R12-S1 (2/4 split, ship): Google's Product rich-result spec lists
  // `image` as required. Use the product's hero image when present; fall back
  // to the per-slug OG image (generated by app/products/[slug]/opengraph-image.tsx,
  // 1200x630 PNG) so every Product schema satisfies the required field.
  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `${SITE.url}${product.image}`)
    : `${productUrl}/opengraph-image`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    description: product.shortDescription,
    url: productUrl,
    image: imageUrl,
    sku: firstVariant?.sku,
    mpn: firstVariant?.sku, // SKU and MPN are equivalent for Plycem product codes
    category: 'Fiber Cement Building Panel',
    // R13-F8: link by @id to the Plycem Organization schema (emitted once per
    // page by plycemOrganizationSchema()). Brand intentionally stays inline —
    // Google's Product rich-result parser handles inline Brand better than @id.
    manufacturer: { '@id': PLYCEM_ORG_ID },
    brand: {
      '@type': 'Brand',
      name: product.manufacturer,
    },
    // Per Round 3 GLM finding: compliance certifications as additionalProperty.
    // R13-F7: emit `validThrough` for time-bound evaluation reports (IAPMO
    // ER-360 expires 2026-07-31). PropertyValue does not formally specify
    // validThrough but AI extractors and our own /api/llm-context surface
    // pick up the extra field cleanly.
    additionalProperty: product.compliance.map((cert) => ({
      '@type': 'PropertyValue',
      name: cert.standard,
      value: cert.detail,
      ...(cert.validThrough && { validThrough: cert.validThrough }),
    })),
    // SB-4 authorized 2026-07-06 (R16): priced products emit UnitPriceSpecification
    // Offers; quote-only products keep a price-less MadeToOrder Offer. `availability`
    // stays MadeToOrder for all (container-direct, ~3–4 wk; ADR-049). See productOffers().
    offers: productOffers(product),
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
    // SEO audit 2026-07-09 (critic #2): removed the SearchAction — no on-site search
    // exists (no `q` handler), so a SearchAction to /products?q= is misleading markup
    // that never yields the sitelinks searchbox. Re-add only when real search ships.
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

/**
 * R13-F3: HowTo schema. AI overviews answering procedural queries ("how to
 * import fiber cement from Costa Rica", "container freight lead time to US")
 * lift HowTo blocks preferentially. Used on /service-areas for the PO→jobsite
 * freight workflow. Steps must include name + text; totalTime is ISO 8601
 * duration format (e.g. "P3W4D" for 3–4 weeks).
 */
export function howToSchema(args: {
  pageUrl: string;
  name: string;
  description: string;
  totalTime?: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${args.pageUrl}#howto`,
    name: args.name,
    description: args.description,
    ...(args.totalTime && { totalTime: args.totalTime }),
    step: args.steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/**
 * ItemList of the currently list-priced products, for /pricing (R16 audit item 11).
 * Reuses productSchema() so each embedded Product node (with its priced Offers) is
 * byte-identical to the one on its detail page (shared @id). NO BreadcrumbList here
 * — the page's <Breadcrumbs> component already emits one (avoids duplicate @id).
 */
export function pricingItemListSchema(products: import('@/data/products').Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE.url}/pricing#pricelist`,
    name: 'JARA delivered (DDP) pricing',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: productSchema(p),
    })),
  };
}

/**
 * Article schema for /guides editorial pages (R16 audit item 15 + critic
 * addition 4: AI Overviews and Google weight author + datePublished/dateModified
 * on informational content). Author/publisher resolve to the JARA Organization.
 */
export function articleSchema(args: {
  pageUrl: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${args.pageUrl}#article`,
    headline: args.headline,
    description: args.description,
    datePublished: args.datePublished,
    dateModified: args.dateModified,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: args.pageUrl,
    inLanguage: 'en-US',
  };
}

/** Render JSON-LD as a script tag string for embedding in <head>. */
export function jsonLdScript(schema: object | null): string {
  if (!schema) return '';
  return JSON.stringify(schema);
}
