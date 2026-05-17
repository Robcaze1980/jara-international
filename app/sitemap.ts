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
 * Per Round 8 §4 disposition: hreflang `es-US` alternates for product
 * detail pages point to `/es` marketing root because per-slug Spanish
 * detail routes do not exist yet. Do NOT "fix" those to /es/products/<slug>
 * until those routes 200 — Google's hreflang validator will demote the
 * whole chain if alternates 404.
 *
 * /long-beach-stock is intentionally excluded — it is a hidden noindex
 * paid-ads landing page (CLAUDE.md ADR-049 lock) and must not appear in
 * the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
        'es-US': `${SITE.url}/es`,
        'x-default': `${SITE.url}/products`,
      },
    },
  };

  // 9 product detail pages
  const productDetails: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE.url}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p.slug === 'high-performance-subfloor' ? 0.95 : 0.8,
    alternates: {
      languages: {
        'en-US': `${SITE.url}/products/${p.slug}`,
        // Per Round 8 §4: ES detail routes don't exist; point to /es marketing root.
        'es-US': `${SITE.url}/es`,
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

  return [home, esLanding, productsListing, ...productDetails, ...enSecondary, ...esSecondary];
}
