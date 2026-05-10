import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { SITE } from '@/lib/site';
import { organizationSchema, localBusinessSchema, jsonLdScript } from '@/lib/jsonld';

import './globals.css';

// Per Phase 2 finding: next/font/google to avoid CLS + render-block
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
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
    'fiber cement supplier California',
    'cement board Long Beach',
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
        url: '/images/og/og-default.svg',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }}
        />
      </head>
      <body className="font-sans antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
