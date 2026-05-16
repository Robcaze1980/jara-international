/**
 * Single source of truth for site-wide constants.
 * Used by metadata, JSON-LD, sitemap, llms.txt, etc.
 *
 * 2026-05-16 positioning correction: removed `warehouse` object and narrowed
 * `serviceAreas` to broader US regions served via direct factory shipping.
 * JARA does not operate a US warehouse — earlier copy claiming Long Beach
 * inventory was based on a one-time pass-through of a third-party
 * distributor's stock, not a durable operational footprint. See new ADR
 * superseding ADR-017.
 */

export const SITE = {
  name: 'JARA International Inc.',
  shortName: 'JARA',
  legalName: 'JARA International Inc.',
  tagline: 'Global Sourcing. Built on Trust.',
  description:
    'US distributor of PLYCEM non-combustible fiber-cement structural subfloor for multifamily, hotel, and commercial construction — UL R15140 classified, ASTM E-136 non-combustible, CBC Chapter 7A compliant, ASTM C1186 Type A Grade I. Plus the complete PLYCEM panel envelope: roof sheathing, exterior cladding, cement board, deck, and Fibroxton. Sourced direct from manufacturing in Costa Rica with 3–4 week door-to-door delivery.',

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

  // Service area — continental US, served via direct factory shipping from
  // Plycem manufacturing plants. Door-to-door lead time averages 3–4 weeks
  // (factory → ocean freight → US port → customs → trucking to jobsite).
  // Listed at region level rather than city level because there is no
  // warehouse anchoring a delivery radius.
  serviceAreas: [
    'California',
    'Pacific Northwest',
    'Mountain West',
    'Arizona & Nevada',
    'Texas',
    'Southeast',
    'Florida',
    'Midwest',
    'Northeast',
    'Mid-Atlantic',
  ],

  // Social / external (placeholder — populate as channels go live)
  social: {
    linkedin: '', // TODO
    youtube: '', // TODO
  },
} as const;

export type SiteConfig = typeof SITE;
