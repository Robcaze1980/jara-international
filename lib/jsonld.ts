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

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Render JSON-LD as a script tag string for embedding in <head>. */
export function jsonLdScript(schema: object): string {
  return JSON.stringify(schema);
}
