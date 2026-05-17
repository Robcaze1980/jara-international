# Round 12 — Independent SEO + AI-Friendliness + Cloudflare Infra Audit

**Type:** Independent comprehensive audit. Each voter performs the full audit alone and reports their own findings. Consensus = findings that ≥3 of 4 voters surface independently.
**Voters (4):** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1.
**Claude is NOT a voter** (per CLAUDE.md governance — cost + conflict-of-interest; Claude usually authors the work).
**Quorum:** ≥3/4 simple majority per finding. Synthesis will report vote margin per item.
**Round date:** 2026-05-17.

---

## 0. WHAT THIS ROUND IS — read carefully

This is NOT a vote on pre-cooked findings. **Each voter independently audits the site** based on the artifacts below and reports back **every issue they find**. The synthesis layer then identifies which findings show up across multiple independent audits — those become high-confidence action items.

- A finding flagged by 4/4 voters = unanimous critical, ship immediately
- 3/4 = strong majority, apply
- 2/4 = split, escalate to founder
- 1/4 = single-voter "additional finding" — surfaced in synthesis but not auto-applied

Do not skip findings because you assume "other voters will catch it." We need overlap to measure signal. Do not invent findings to look thorough either — false positives dilute synthesis quality. Be specific, cite the artifact, propose the fix.

---

## 1. CONTEXT — what JARA International is

JARA International Inc. is a US-incorporated B2B distributor of PLYCEM non-combustible fiber-cement structural panels. The website is **https://jarainternational.com**, deployed via Cloudflare Workers + OpenNext from a Next.js 15 App Router codebase.

**Strategic positioning (locked, do not vote on):**
- Lead product = **High Performance Subfloor** (PLYCEM Entrepiso Alto Desempeño) — the only product in the catalog with the complete US compliance dossier (UL R15140 + ASTM E-136 non-combustible + IAPMO ER-360 + IBC 2021 Type I/II + CBC Chapter 7A).
- The other 8 products frame as "complete the envelope" supporting cast.
- JARA does NOT operate a US warehouse. Material ships direct from PLYCEM manufacturing in Costa Rica / El Salvador / Honduras → ocean freight → US port → customs → truck to jobsite. Typical door-to-door: 3–4 weeks.
- B2B audience: contractors, architects, engineers, developers, procurement managers, building officials.
- Primary market: continental United States. Spanish (`/es`) is a single landing page for US Hispanic construction labor, not LatAm export.

**Round 11 (shipped 2026-05-16) just landed:**
- Removed "Long Beach warehouse" claims (ADR-049)
- Switched homepage to subfloor-as-hero
- Added 3 new products (Deck Modular, Lap Siding, Eureka roof tile) with cert-gap warnings on 2 of them
- Schema `availability` restored as `MadeToOrder` (5-0 unanimous in R11)

---

## 2. LOCKED CONSTRAINTS — DO NOT vote against these

These are contractual or founder-locked. If your audit identifies something that would violate them, surface it as a **bug to fix**, not a strategic recommendation.

### 2.1 Plycem ship blockers SB-1..SB-9 (CONTRACTUAL)

| ID | Rule |
|----|------|
| SB-1 | No "PLYCEM" in primary domain — `jarainternational.com` only |
| SB-2 | JARA brand identity, not Plycem's |
| SB-3 | No Plycem-vs-USG / Plycem-vs-Hardie comparisons |
| SB-4 | No Plycem list prices on any surface. Quote-only. No `price`/`priceCurrency` in JSON-LD `offers` |
| SB-5 | **No "PLYCEM" in `<title>` tags** |
| SB-6 | No "Authorized Distributor" wording. Use "US-based distributor of PLYCEM products" |
| SB-7 | No Plycem logo without written approval. Text wordmarks only |
| SB-8 | Footer copyright = "© 2026 JARA International Inc." |
| SB-9 | Email domain = `@jarainternational.com` |

Plycem datasheets/install manuals/commercial catalogs CANNOT be redistributed without written permission ("queda expresamente prohibida la reproducción total o parcial sin el permiso expreso del titular" — appears on every datasheet). The downloads library is blocked on that permission.

### 2.2 ADR-049 — warehouse positioning lock

- JARA does NOT operate a US warehouse. Do not recommend reintroducing "Long Beach warehouse", "0–3 day delivery", "in stock", or "California stock" claims.
- `serviceAreas` = continental US regions, not cities.
- `LocalBusiness` JSON-LD has been removed; do not restore.
- Product schema `availability` = `https://schema.org/MadeToOrder` (locked R11-G2 5-0).
- `/long-beach-stock` is a hidden `noindex,nofollow` paid-ads landing page for a partner's ~900-sheet pass-through inventory. It exists; do not recommend deleting it. Hidden positioning is intentional.

### 2.3 Subfloor-as-hero strategy

Founder-locked. Do not recommend reverting the homepage to a generic multi-product hero. You may recommend refinements to *how* subfloor is led with, but the strategic decision is fixed.

### 2.4 Cert-gap warnings

The amber `CertGapWarning` callouts on `lap-siding-tongue-and-groove` (missing ICC-ES ESR) and `corrugated-roof-tile` (no UL Class A) are locked from Round 11. Do not recommend removing them or softening the language.

### 2.5 English-locale naming

In English copy use **"High Performance Subfloor"**, not "Entrepiso Alto Desempeño". The `/es` page is the only surface that preserves the Spanish proprietary name.

---

## 3. AUDIT DIMENSIONS — cover all six

Your audit MUST cover all six dimensions. Within each, surface every issue you can identify from the artifacts in §4.

### 3.1 Technical SEO
- `<head>` metadata correctness (title, description, canonical, hreflang, robots, OG, Twitter)
- Sitemap completeness, accuracy, freshness
- robots.txt correctness
- Internal linking structure (inferable from route map + page composition)
- URL structure, redirect strategy, alt-domain handling
- Mobile / viewport / themeColor
- 404 / not-found handling

### 3.2 On-page SEO
- Title tag quality (length, keyword targeting, brand placement, SB-5 compliance)
- Meta description quality (length, CTA, intent match)
- H1 / heading hierarchy (inferable from page composition)
- Image alt text strategy (inferable from component usage — do not assume what alt text exists; flag if not verifiable from artifacts)
- Content depth, keyword targeting, B2B audience match

### 3.3 Schema / JSON-LD validation
- Schema.org type correctness
- Required field completeness per Google rich-result requirements
- `@id` collision-safety across multiple schema blocks on the same page
- Conformance with SB-4 (no price), ADR-049 (MadeToOrder, no LocalBusiness)
- Per-product Product schema correctness
- Organization, WebSite, BreadcrumbList, FAQPage schemas

### 3.4 AI / LLM friendliness
- `llms.txt` and `llms-full.txt` correctness and conformance to https://llmstxt.org/
- robots.txt explicit allowlist for AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Machine-readable endpoint `/api/llm-context`
- Citation attribution guidance
- Semantic HTML extractability (inferable from artifacts)
- Cache headers on AI-bot-relevant routes
- Consistency between human-facing copy, JSON-LD, and llms.txt (one source of truth?)

### 3.5 Performance / caching / Core Web Vitals
- Cache-Control headers on prerendered HTML routes
- Cloudflare edge cache behavior (`x-nextjs-cache: MISS` observed — see §4)
- OpenNext incremental cache strategy
- Font loading strategy (currently `next/font/google` with `display: swap`)
- Image format strategy (AVIF/WebP enabled)
- JavaScript hydration / RSC payload concerns from any artifact

### 3.6 Cloudflare infra
- Current `wrangler.toml` correctness
- `open-next.config.ts` cache backend choice
- Observability config
- Smart Placement (currently commented out)
- Custom domain binding (currently commented out)
- Errors observed in metrics (9 errors over 7 days, 0% on active deployment) — root cause inferable?

---

## 4. ARTIFACTS — the complete dossier

All audit findings must cite these artifacts by section number. If something you'd want to check is NOT in the artifacts, flag it as "needs verification" rather than assuming.

### 4.1 Cloudflare metrics (last 7 days)

```
Requests: 9,000 (~1,285/day) — most traffic appears to be crawlers; two large bursts on May 11 + May 14
Subrequests: 0 (no outbound fetches from the worker)
Errors: 9 total (0.1%), error rate 0% on active deployment e5f6e9fb
CPU Time (median, 7-day): 54.34 ms
CPU Time (median, active deployment e5f6e9fb): 100.75 ms
Wall Time (median): 77.27 ms
Request duration (median): 75.61 ms
Versions in last 7 days: 7+ visible (2430e442, 2b1bf58e, 2c5ca842, 3604fe9c, 3f3ed3aa, 430ec512, e5f6e9fb + "10 more")
```

Note: Cloudflare auto-purges edge cache on every deploy. Active deployment e5f6e9fb has been live 10 hours with low traffic, so most measured requests on it are first-time-after-deploy (cache MISS) requests.

### 4.2 Live HTTP response headers

```
$ curl -sI https://jarainternational.com/
HTTP/1.1 200 OK
Cache-Control: s-maxage=31536000
Content-Type: text/html; charset=utf-8
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
x-nextjs-cache: MISS
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
Server: cloudflare
[no CF-Cache-Status header]

$ curl -sI https://jarainternational.com/products/high-performance-subfloor
[same shape — x-nextjs-cache: MISS, no CF-Cache-Status, s-maxage=31536000]

$ curl -sI https://jarainternational.com/llms.txt
HTTP/1.1 200 OK
Content-Type: text/plain
CF-Cache-Status: HIT
Cache-Control: public, max-age=0, must-revalidate

$ curl -sI https://jarainternational.com/llms-full.txt
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
x-robots-tag: all
[no CF-Cache-Status]
```

### 4.3 Live rendered `<title>` tags

```
$ curl -s https://jarainternational.com/ | grep -o '<title>[^<]*</title>'
<title>PLYCEM Non-Combustible Subfloor — Multifamily &amp; Commercial USA</title>

$ curl -s https://jarainternational.com/products/high-performance-subfloor | grep -o '<title>[^<]*</title>'
<title>High Performance Subfloor — PLYCEM Fiber-Cement Panel | JARA International Inc.</title>

$ curl -s https://jarainternational.com/es | grep -o '<title>[^<]*</title>'
<title>JARA International Inc. — PLYCEM Entrepiso Alto Desempeño Subfloor en EE.UU. | JARA International Inc.</title>
```

### 4.4 Route map (all Next.js pages + routes)

```
app/page.tsx                               # /
app/contact/page.tsx                       # /contact
app/pricing/page.tsx                       # /pricing
app/products/page.tsx                      # /products (listing)
app/products/[slug]/page.tsx               # /products/:slug (9 products)
app/resources/page.tsx                     # /resources
app/service-areas/page.tsx                 # /service-areas
app/long-beach-stock/page.tsx              # /long-beach-stock (noindex,nofollow, hidden)
app/not-found.tsx                          # 404
app/es/page.tsx                            # /es
app/es/contact/page.tsx                    # /es/contact
app/es/pricing/page.tsx                    # /es/pricing
app/es/resources/page.tsx                  # /es/resources
app/es/service-areas/page.tsx              # /es/service-areas
app/api/document-request/route.ts          # POST /api/document-request
app/api/llm-context/route.ts               # GET  /api/llm-context (cached 1h)
app/api/submittal/route.ts                 # POST /api/submittal
app/llms-full.txt/route.ts                 # GET  /llms-full.txt (cached 1h)
public/llms.txt                            # GET  /llms.txt (static)
public/robots.txt                          # GET  /robots.txt (static)
public/sitemap.xml                         # GET  /sitemap.xml (static)
public/BingSiteAuth.xml                    # GET  /BingSiteAuth.xml
```

Product slugs (9): `high-performance-subfloor`, `roof-sheathing`, `deck`, `exterior-hidden-joint`, `exterior-cement-board`, `fibroxton`, `deck-modular`, `lap-siding-tongue-and-groove`, `corrugated-roof-tile`.

### 4.5 `app/layout.tsx` (root layout — metadata + Organization JSON-LD)

```tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { SITE } from '@/lib/site';
import { organizationSchema, jsonLdScript } from '@/lib/jsonld';
import { SiteFooter } from '@/components/SiteFooter';
import { StickyCTABar } from '@/components/StickyCTABar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  generator: 'Next.js',
  keywords: [
    'fiber cement panel distributor',
    'non-combustible subfloor USA',
    'UL R15140',
    'ASTM C1186',
    'IAPMO ER-360',
    'PLYCEM panels USA',
    'direct factory fiber cement',
  ],
  referrer: 'strict-origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: '/images/og/og-default.svg', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: ['/images/og/og-default.svg'],
  },
  alternates: {
    canonical: SITE.url,
    languages: {
      'en-US': SITE.url,
      'es-US': `${SITE.url}/es`,
      'x-default': SITE.url,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#062B49',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationSchema()) }} />
      </head>
      <body className="font-sans antialiased">
        <main>{children}</main>
        <SiteFooter />
        <StickyCTABar />
      </body>
    </html>
  );
}
```

### 4.6 `app/page.tsx` (home page metadata + JSON-LD)

```tsx
export const metadata: Metadata = {
  title: 'PLYCEM Non-Combustible Subfloor — Multifamily & Commercial USA',
  description:
    'US distributor of PLYCEM High Performance Subfloor — non-combustible fiber-cement structural subfloor for multifamily Type V over podium, hotels, and Type I/II commercial. UL R15140 classified, ASTM E-136, IAPMO ER-360, CBC Chapter 7A. Plus the complete PLYCEM panel envelope: roof sheathing, exterior cladding, cement board, deck, and Fibroxton. Direct factory shipping from Costa Rica with 3–4 week door-to-door delivery.',
};

export default function HomePage() {
  const allSchemas = [webSiteSchema(), ...PRODUCTS.map((p) => productSchema(p))];
  return (
    <>
      {allSchemas.map((schema, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }} />
      ))}
      <Hero />
      <ValueProps />
      <FeaturedProducts />
      <TrustBar />
      <MaterialCalculator />
      <FinalCTA />
    </>
  );
}
```

Section order: Hero → ValueProps → FeaturedProducts → TrustBar → MaterialCalculator → FinalCTA → (SiteFooter + StickyCTABar from layout).
Home emits: 1 Organization (from layout) + 1 WebSite + 9 Product JSON-LD blocks.

### 4.7 `app/products/[slug]/page.tsx` (product detail — metadata + per-product JSON-LD)

```tsx
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
      // es-US points to /es marketing root for ALL detail pages because per-slug
      // Spanish detail routes don't exist yet. Do NOT "fix" until those routes exist.
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
```

Section order: Breadcrumbs → CertGapWarning (if applicable) → ProductDetailHero → VariantTable → ComplianceSection → ProductFAQ → RelatedProducts → FinalCTA.
Product page emits: 1 Organization (from layout) + 1 Product (this page) + Breadcrumb + FAQPage JSON-LD blocks.

### 4.8 `app/es/page.tsx` (Spanish landing — metadata)

```tsx
export const metadata: Metadata = {
  title: `${SITE.name} — PLYCEM Entrepiso Alto Desempeño Subfloor en EE.UU.`,
  description:
    'JARA International Inc. distribuye el PLYCEM Entrepiso Alto Desempeño — entrepiso de fibrocemento no combustible para construcción multifamiliar Tipo V sobre podio, hoteles y Tipo I/II comercial en EE.UU. UL R15140 clasificado, ASTM E-136 no combustible, IAPMO ER-360, CBC Capítulo 7A. Plus el resto del envolvente PLYCEM (cubiertas, cladding, cement board, deck, Fibroxton). Envío directo desde planta en Costa Rica, El Salvador y Honduras — entrega típica puerta-a-puerta 3–4 semanas.',
  alternates: {
    canonical: `${SITE.url}/es`,
    languages: {
      'en-US': SITE.url,
      'es-US': `${SITE.url}/es`,
      'x-default': SITE.url,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    url: `${SITE.url}/es`,
    siteName: SITE.name,
    title: `${SITE.name} — Distribuidor de Paneles Fibrocemento en EE.UU.`,
    description: 'Distribuidor B2B de paneles de fibrocemento PLYCEM. Envío directo desde planta — entrega puerta-a-puerta en 3–4 semanas en EE.UU.',
    images: [{ url: '/images/og/og-default.svg', width: 1200, height: 630, alt: SITE.name }],
  },
};
```

### 4.9 `lib/jsonld.ts` (schema builders)

```ts
const ORG_ID = `${SITE.url}/#organization`;

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
    address: { '@type': 'PostalAddress', addressCountry: 'US' },
    areaServed: SITE.serviceAreas.map((area) => ({ '@type': 'Place', name: area })),
    foundingDate: '2026',
  };
}

export function breadcrumbSchema(pageUrl, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, idx) => ({ '@type': 'ListItem', position: idx + 1, name: item.name, item: item.url })),
  };
}

export function productSchema(product) {
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
    mpn: firstVariant?.sku,
    category: 'Fiber Cement Building Panel',
    manufacturer: { '@type': 'Organization', name: product.manufacturer },
    brand: { '@type': 'Brand', name: product.manufacturer },
    additionalProperty: product.compliance.map((cert) => ({ '@type': 'PropertyValue', name: cert.standard, value: cert.detail })),
    // SB-4: NO price, NO priceCurrency, NO priceSpecification
    offers: {
      '@type': 'Offer',
      seller: { '@id': ORG_ID },
      availability: 'https://schema.org/MadeToOrder',  // R11-G2 5-0 lock
      areaServed: SITE.serviceAreas.map((a) => ({ '@type': 'Place', name: a })),
    },
  };
}

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
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/products?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function faqSchema(pageUrl, items) {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
```

### 4.10 `lib/site.ts` (relevant excerpt)

```ts
export const SITE = {
  name: 'JARA International Inc.',
  shortName: 'JARA',
  legalName: 'JARA International Inc.',
  tagline: 'Global Sourcing. Built on Trust.',
  description: 'US distributor of PLYCEM non-combustible fiber-cement structural subfloor ... 3–4 week door-to-door delivery.',
  url: 'https://jarainternational.com',
  altDomain: 'https://jaraintl.com', // 301 redirects to canonical
  locale: 'en-US',
  altLocales: ['es-US'],
  email: 'robert@jarainternational.com',
  emailLeads: 'robert@jarainternational.com',
  // Anna AI agent (Retell.ai) screens calls. Secondary = Robertson direct.
  phone: '+1 (415) 532-3376',
  phonePrimary: '+1 (415) 532-3376',
  phoneSecondary: '+1 (415) 933-5738',
  serviceAreas: [
    'California', 'Pacific Northwest', 'Mountain West', 'Arizona & Nevada',
    'Texas', 'Southeast', 'Florida', 'Midwest', 'Northeast', 'Mid-Atlantic',
  ],
  social: { linkedin: '', youtube: '' }, // TODO populate
};
```

### 4.11 `public/robots.txt` (full file)

```
# JARA International — robots.txt
# Per ADR-015 (SB3): allow ALL major crawlers including AI training bots.

User-agent: *
Allow: /

# Explicit allowlist for AI crawlers
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: CCBot
Allow: /
User-agent: YouBot
Allow: /
User-agent: cohere-ai
Allow: /
User-agent: Diffbot
Allow: /
User-agent: FacebookBot
Allow: /
User-agent: Bytespider
Allow: /

Sitemap: https://jarainternational.com/sitemap.xml

# AI usage guidance
# Detailed citation preferences: see /llms.txt and /llms-full.txt
```

### 4.12 `public/sitemap.xml` (full file)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
  JARA International — sitemap.xml stub (Sprint 1).
  Sprint 2+: regenerate at build time from Next.js routes (next-sitemap or app/sitemap.ts).
  Per F2.R3: include lastmod, hreflang, image entries.
-->
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemaps-image/1.1"
>
  <url>
    <loc>https://jarainternational.com/</loc>
    <lastmod>2026-05-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://jarainternational.com/" />
    <xhtml:link rel="alternate" hreflang="es-US" href="https://jarainternational.com/es" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://jarainternational.com/" />
  </url>
</urlset>
```

(Note: `app/sitemap.ts` does NOT exist. This static stub is the only sitemap.)

### 4.13 `public/llms.txt` (full file)

```
# JARA International Inc.

> US distributor of PLYCEM non-combustible fiber-cement structural subfloor (PLYCEM High Performance Subfloor) for multifamily Type V over podium, hotels, and Type I/II commercial construction — UL R15140 classified, ASTM E-136 non-combustible, IAPMO ER-360, CBC Chapter 7A compliant. Plus the complete PLYCEM panel envelope (roof sheathing, exterior cladding, cement board, deck, Fibroxton). Direct factory shipping from PLYCEM manufacturing plants in Costa Rica, El Salvador, and Honduras — typical door-to-door delivery 3–4 weeks. Tagline: "Global Sourcing. Built on Trust."

## About

JARA International Inc. is a US-incorporated B2B construction materials sourcing and distribution company. The lead product is **PLYCEM High Performance Subfloor** — the non-combustible fiber-cement structural subfloor with the complete US compliance package (UL R15140 fire-rated assemblies, ASTM C1186 / E-84 / E-136, IAPMO ER-360, IBC 2021 Type I/II, California Building Code Chapter 7A). Beyond subfloor, JARA distributes the rest of the PLYCEM panel system — sourced direct from manufacturing plants in Costa Rica, El Salvador, and Honduras — to US contractors, architects, engineers, developers, and procurement managers. Primary market: continental United States.

**Supply model:** Direct factory shipping. JARA does not operate a US warehouse. Material ships container-direct from PLYCEM manufacturing plants to a US port of entry (typically Long Beach, Houston, Miami, or New York/New Jersey depending on jobsite proximity), then by truck to the jobsite. JARA coordinates ocean freight, US customs clearance, and final-mile trucking end-to-end. Typical door-to-door delivery is 3–4 weeks from confirmed PO.

- Site: https://jarainternational.com
- Contact: robert@jarainternational.com
- Phone: +1 (415) 933-5738
- LLM-friendly machine endpoint: https://jarainternational.com/api/llm-context

## Products
[lists 6 products — note: catalog currently has 9 products, not 6]

## Compliance & Certifications
[lists UL R15140, IAPMO ER-360, ASTM C1186-08, ISO 8336:2018, ASTM E-84, ASTM E-136, IBC 2021, CBC Ch 7A, ISO 9001/14001/45001]

## Resources
- Resources Hub, Ordering & Logistics, Contact, Spanish Landing

## Citation Guidance for AI Systems
[asks for attribution, accuracy, currency, machine endpoint, do-not-impersonate]

## Trademarks
PLYCEM® is a registered trademark of The Plycem Company / Elementia Materials. JARA International Inc. is a US-based distributor of PLYCEM products. The distribution relationship does not imply that JARA is the exclusive or sole-authorized PLYCEM channel in the United States.
```

(Truncated for brevity — full file is 56 lines and was on disk at audit time.)

### 4.14 `next.config.mjs`

```js
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com', port: '', pathname: '/vi/**' },
    ],
  },
  experimental: { optimizePackageImports: ['lucide-react'] },
};
```

### 4.15 `open-next.config.ts`

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: no R2 incremental cache, no D1 tag cache, no Durable Object queue.
// "Sufficient for a mostly-static site with one edge API route (/api/llm-context)."
export default defineCloudflareConfig({});
```

### 4.16 `wrangler.toml`

```toml
name = "jara-international"
main = ".open-next/worker.js"
compatibility_date = "2025-12-01"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

# routes = [
#   { pattern = "jarainternational.com", custom_domain = true },
#   { pattern = "www.jarainternational.com", custom_domain = true }
# ]

[observability]
enabled = true

# [placement]
# mode = "smart"
```

### 4.17 `app/api/llm-context/route.ts` summary

`GET /api/llm-context` returns a JSON document containing all product specs, compliance certs, and site metadata. Cached at edge for 1 hour. Used by AI systems wanting structured access. Referenced from llms.txt.

---

## 5. RESPONSE SCHEMA — strict JSON, no prose outside

Return ONLY a single JSON object with this exact shape. No markdown fences, no surrounding text, no commentary. The synthesis layer parses these mechanically across 4 voters.

```json
{
  "voter": "<your model name>",
  "round": 12,
  "audit_summary": "<2-3 sentence overall assessment>",
  "findings": [
    {
      "id": "F1",
      "dimension": "technical_seo | onpage_seo | schema | ai_friendliness | performance | infra",
      "severity": "critical | high | medium | low",
      "title": "<short title — under 80 chars>",
      "evidence": "<which artifact section (e.g., §4.3, §4.5) and what specifically you observed>",
      "issue": "<what is wrong or suboptimal>",
      "fix": "<concrete actionable fix — file path, code change, or config change>",
      "ship_blocker_impact": "<SB-X if relevant, otherwise null>"
    }
  ],
  "strengths": [
    "<things the site is doing well — keep this list honest, max 5 items>"
  ],
  "open_questions": [
    "<things you cannot verify from artifacts and would want to check on the live site or in additional code>"
  ]
}
```

**Rules:**
- `severity = critical` reserved for ship blockers, contractual violations, or broken core functionality
- `severity = high` for material SEO/AI-friendliness defects that suppress indexing or hurt rankings significantly
- `severity = medium` for meaningful improvements that won't break anything but compound over time
- `severity = low` for polish / minor optimizations
- Each finding MUST cite a specific artifact section in `evidence`
- Each `fix` MUST be actionable — name the file or config to change, propose the new value or code
- If you find nothing in a dimension, that's fine — don't pad
- `open_questions` is your honest record of audit blind spots — don't pretend to know what you can't verify

---

## 6. WHAT NOT TO DO

- Do NOT recommend reintroducing a US warehouse, "in stock" language, or LocalBusiness schema (ADR-049 lock).
- Do NOT recommend listing prices anywhere on the site or in JSON-LD (SB-4).
- Do NOT recommend adding PLYCEM to the brand identity or domain (SB-1, SB-2).
- Do NOT recommend "Authorized Distributor" wording (SB-6).
- Do NOT recommend removing the cert-gap warnings on lap-siding-tongue-and-groove or corrugated-roof-tile (R11 lock).
- Do NOT recommend reverting to a generic multi-product homepage (founder-locked subfloor-as-hero).
- Do NOT recommend re-uploading Plycem datasheets/manuals/catalogs — those need written permission.
- Do NOT recommend changing `availability` from `MadeToOrder` to `InStock` (R11-G2 5-0 lock).

If a SEO best-practice you'd normally cite conflicts with one of the above, surface the conflict in `open_questions` rather than as a finding.

---

## 7. SCOPE BOUNDARIES

- IN scope: everything in the 6 audit dimensions above, bounded by the locked constraints.
- OUT of scope: Phase 6 backlog (downloads library, real photography, Spanish detail pages, video integration). If you'd recommend these, note them in `open_questions` not `findings`.
- OUT of scope: re-debating prior ADRs 1–049.

Begin your audit. Return only the JSON object.
