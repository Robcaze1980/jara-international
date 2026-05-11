/**
 * Single source of truth for site-wide constants.
 * Used by metadata, JSON-LD, sitemap, llms.txt, etc.
 */

export const SITE = {
  name: 'JARA International Inc.',
  shortName: 'JARA',
  legalName: 'JARA International Inc.',
  tagline: 'Global Sourcing. Built on Trust.',
  description:
    'B2B distributor of premium fiber-cement panels for US construction. PLYCEM products: subfloor, roof sheathing, deck, exterior cladding, cement board, fibroxton. UL R15140 classified, ASTM C1186 Type A Grade I. In stock Long Beach, CA.',

  // Domain (ADR-002)
  url: 'https://jarainternational.com',
  altDomain: 'https://jaraintl.com', // 301 redirects to canonical

  // Locale (ADR-008: EN primary, /es secondary)
  locale: 'en-US',
  altLocales: ['es-US'],

  // Contact (ADR-009 + 2026-05-10 phone strategy lock)
  email: 'robert@jarainternational.com',
  emailLeads: 'robert@jarainternational.com',

  // Phone strategy: Primary number = Retell.ai "Anna" AI agent (screens calls,
  // captures lead data, tells caller Robertson will follow up).
  // Secondary number = Robertson's personal cell (disclosed in footer for trust
  // signal and direct-contact preference).
  phone: '+1 (415) 532-3376', // Anna AI agent — primary CTA on site
  phonePrimary: '+1 (415) 532-3376', // explicit alias for clarity in components
  phonePrimaryRaw: '+14155323376', // tel: and wa.me link format
  phoneSecondary: '+1 (415) 933-5738', // Robertson direct — footer secondary
  phoneSecondaryRaw: '+14159335738',

  // Warehouse / LocalBusiness (ADR-017)
  warehouse: {
    name: 'JARA International Long Beach Warehouse',
    streetAddress: '', // TODO: fill exact warehouse address
    city: 'Long Beach',
    region: 'CA',
    postalCode: '', // TODO
    country: 'US',
    latitude: 33.7701, // Long Beach approximate
    longitude: -118.1937,
  },

  // Service area (ADR-017)
  serviceAreas: [
    'Long Beach, CA',
    'Los Angeles, CA',
    'Orange County, CA',
    'San Diego, CA',
    'Inland Empire, CA',
    'San Francisco Bay Area, CA',
    'Sacramento, CA',
    'Central Valley, CA',
    'Phoenix, AZ',
    'Las Vegas, NV',
  ],

  // Social / external (placeholder — populate as channels go live)
  social: {
    linkedin: '', // TODO
    youtube: '', // TODO
  },
} as const;

export type SiteConfig = typeof SITE;
