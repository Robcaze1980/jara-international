import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { SITE } from '@/lib/site';
import { organizationSchema, jsonLdScript } from '@/lib/jsonld';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StickyCTABar } from '@/components/StickyCTABar';

import './globals.css';

// Per Phase 2 finding: next/font/google to avoid CLS + render-block
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Per Round 7 cleanup: trimmed weights to ['600', '700'] (only used weights).
// Saved ~9KB / 2 HTTP requests. Re-add 400/500 if non-display copy needs them.
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
    template: `%s | ${SITE.shortName}`,
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
  // ADR-015 SB3 + meta robots per Round 3 finding
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: '/images/og/og-default.png',
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: ['/images/og/og-default.png'],
  },
  alternates: {
    canonical: SITE.url,
    languages: {
      'en-US': SITE.url,
      'es-US': `${SITE.url}/es`,
      'x-default': SITE.url,
    },
  },
  // GSC verification: auto-verified by Cloudflare Google integration (no meta tag needed).
  // Bing verification: handled by /BingSiteAuth.xml file in public/ (no meta tag needed).
  // Removed placeholder values per Round 5 review — they were stale and would have caused
  // verification failures if Google/Bing read them as authoritative.
};

export const viewport: Viewport = {
  themeColor: '#062B49', // JARA Primary Navy
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

// Round 12 R12-S5 (deferred): /es/* pages currently inherit lang="en-US"
// from this root layout, a WCAG 3.1.1 issue. Fixing requires either a
// route-groups refactor (app/(en) and app/(es) with parallel root layouts)
// or making this layout dynamic — the latter would break SSG for the entire
// site and negate the R12-U3 R2 cache work. Tracked for a focused follow-up
// commit; do NOT fix by adding `await headers()` here.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-US"
      className={`${inter.variable} ${montserrat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationSchema()) }}
        />
        {/* 2026-05-16 positioning correction: LocalBusiness schema removed.
            JARA has no US physical location — see ADR superseding ADR-017. */}
      </head>
      <body className="font-sans antialiased">
        {/* 2026-05-17: SiteHeader added — sticky top navigation visible on
            every page. Wordmark text logo until logo PNG asset is delivered. */}
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        {/* Per Round 7 cleanup: StickyCTABar moved from page.tsx to layout
            so it renders on /es and other pages too (was home-only). */}
        <StickyCTABar />
      </body>
    </html>
  );
}
