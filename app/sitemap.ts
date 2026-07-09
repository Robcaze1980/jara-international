import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { PRODUCTS } from '@/data/products';

/**
 * Dynamic sitemap generation (Round 12 R12-U1, 4/4 unanimous).
 *
 * Replaces the public/sitemap.xml stub which only listed the homepage.
 * Generated from data/products.ts + the static route map so the sitemap
 * stays in sync with the catalog automatically.
 *
 * SEO audit 2026-07-09: the /products listing and detail pages no longer emit
 * an es-US hreflang alternate. /es never reciprocated per-product, so the
 * annotation was non-reciprocal (Google drops it + GSC reports "no return
 * tags"). They now carry self en-US + x-default only. Restore es-US only when
 * real /es/products/<slug> routes exist and return 200.
 *
 * /long-beach-stock is intentionally excluded — it is a hidden noindex
 * paid-ads landing page (CLAUDE.md ADR-049 lock) and must not appear in
 * the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // SEO audit 2026-07-09 (item 24): stable content-derived date, NOT request-time
  // `new Date()` — a wall-clock lastmod told Google every URL changed on every crawl
  // (provably false), so Google learned to ignore the signal. Bump this when content
  // materially changes.
  const now = new Date('2026-07-09T00:00:00Z');

  // English routes that have direct Spanish counterparts at /es/<path>
  const enWithEsCounterpart: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/resources', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/service-areas', priority: 0.7, changeFrequency: 'monthly' },
  ];

  // Homepage with full hreflang triplet
  const home: MetadataRoute.Sitemap[number] = {
    url: SITE.url,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
    images: [`${SITE.url}/images/og/og-default.png`],
    alternates: {
      languages: {
        'en-US': SITE.url,
        'es-US': `${SITE.url}/es`,
        'x-default': SITE.url,
      },
    },
  };

  // Spanish landing
  const esLanding: MetadataRoute.Sitemap[number] = {
    url: `${SITE.url}/es`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: {
      languages: {
        'en-US': SITE.url,
        'es-US': `${SITE.url}/es`,
        'x-default': SITE.url,
      },
    },
  };

  // /products listing
  const productsListing: MetadataRoute.Sitemap[number] = {
    url: `${SITE.url}/products`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: {
      languages: {
        'en-US': `${SITE.url}/products`,
        'x-default': `${SITE.url}/products`,
      },
    },
  };

  // Product detail pages (count = PRODUCTS.length; roof-sheathing removed 2026-05-21)
  const productDetails: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE.url}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p.slug === 'high-performance-subfloor' ? 0.95 : 0.8,
    // Image sitemap entries (SEO audit item 41) — per-slug OG card (always 200)
    // + the product hero photo when present. Absolute URLs.
    images: [
      `${SITE.url}/products/${p.slug}/opengraph-image`,
      ...(p.image ? [`${SITE.url}${p.image}`] : []),
    ],
    alternates: {
      languages: {
        'en-US': `${SITE.url}/products/${p.slug}`,
        // SEO audit 2026-07-09: es-US removed (non-reciprocal — /es had no
        // per-product return tag). Restore when /es/products/<slug> exists.
        'x-default': `${SITE.url}/products/${p.slug}`,
      },
    },
  }));

  // EN secondary pages + their ES counterparts
  const enSecondary: MetadataRoute.Sitemap = enWithEsCounterpart.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        'en-US': `${SITE.url}${path}`,
        'es-US': `${SITE.url}/es${path}`,
        'x-default': `${SITE.url}${path}`,
      },
    },
  }));

  const esSecondary: MetadataRoute.Sitemap = enWithEsCounterpart.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE.url}/es${path}`,
    lastModified: now,
    changeFrequency,
    priority: priority - 0.1,
    alternates: {
      languages: {
        'en-US': `${SITE.url}${path}`,
        'es-US': `${SITE.url}/es${path}`,
        'x-default': `${SITE.url}${path}`,
      },
    },
  }));

  // Guides — editorial hub + 3 informational pages (R16 audit item 15)
  const guidesIndex: MetadataRoute.Sitemap[number] = {
    url: `${SITE.url}/guides`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
    alternates: {
      languages: { 'en-US': `${SITE.url}/guides`, 'x-default': `${SITE.url}/guides` },
    },
  };
  const guides: MetadataRoute.Sitemap = [
    'non-combustible-subfloor-cost',
    'fiber-cement-vs-plywood-subfloor',
    'type-i-ii-construction-subfloor',
  ].map((slug) => ({
    url: `${SITE.url}/guides/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
    alternates: {
      languages: {
        'en-US': `${SITE.url}/guides/${slug}`,
        'x-default': `${SITE.url}/guides/${slug}`,
      },
    },
  }));

  const about: MetadataRoute.Sitemap[number] = {
    url: `${SITE.url}/about`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
    alternates: {
      languages: { 'en-US': `${SITE.url}/about`, 'x-default': `${SITE.url}/about` },
    },
  };

  return [
    home,
    esLanding,
    productsListing,
    ...productDetails,
    ...enSecondary,
    ...esSecondary,
    guidesIndex,
    ...guides,
    about,
  ];
}
