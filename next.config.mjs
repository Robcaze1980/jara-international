/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // SEO/perf audit item 42: cache optimized images for a year (they are
    // immutable per URL — Next fingerprints by src+params). Cuts repeat
    // optimizer work + improves repeat-view LCP.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com', port: '', pathname: '/vi/**' },
    ],
  },
  // ADR-019 SH2: enable build-time optimizations for excellent CWV
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Removed-product redirects. Use cross-slug LEGACY_SLUG_REDIRECTS for renames;
  // use this list for products that were dropped from the catalog entirely and
  // have no near-equivalent destination. Sending the orphan slug to / preserves
  // inbound link equity and avoids a 404 on backlinked URLs.
  async redirects() {
    return [
      {
        // SEO/GEO audit 2026-07-29 (gap P3): www served the entire site at 200
        // alongside the apex. rel=canonical pointed at the apex, so Google
        // filed the duplicates under "Alternate page with proper canonical tag"
        // (the 2 pages showing in GSC) rather than treating them as duplicate
        // content — but it still doubled the crawl surface, and the count grows
        // as more www URLs get discovered. A 301 collapses the host properly.
        //
        // Placed FIRST so a www request reaches the canonical host before any
        // path-level rule below runs. No loop is possible: the destination host
        // does not satisfy this rule's `has` condition.
        //
        // NOTE: http -> https is deliberately NOT handled here. Cloudflare's
        // "Always Use HTTPS" (SSL/TLS -> Edge Certificates) does it at the edge
        // before the Worker is invoked, which is both cheaper and safer than
        // matching x-forwarded-proto in application code.
        // The root is split into its own rule on purpose. With a single
        // `/:path*` rule, a request for `www.jarainternational.com/` matched
        // with an EMPTY param and Next emitted the placeholder un-interpolated
        // — Location: https://jarainternational.com/:path* — a literally broken
        // URL on the most-linked page of the site. Deep paths were fine, which
        // is what made it easy to miss. `/:path+` requires at least one
        // segment, so the two rules together cover every case with no overlap.
        source: '/',
        has: [{ type: 'host', value: 'www.jarainternational.com' }],
        destination: 'https://jarainternational.com/',
        permanent: true,
      },
      {
        source: '/:path+',
        has: [{ type: 'host', value: 'www.jarainternational.com' }],
        destination: 'https://jarainternational.com/:path+',
        permanent: true,
      },
      {
        // roof-sheathing removed 2026-05-21 — no US ICC-ES ESR / IAPMO UES ER
        // for roof deck use, prescriptive US default is OSB/plywood. No
        // equivalent product remains in catalog.
        source: '/products/roof-sheathing',
        destination: '/',
        permanent: true,
      },
      {
        // fibroxton removed 2026-05-21 per R15-Q2 (4/4 unanimous) — only
        // Chilean NCh1914 + ISO mfg certs, no US standards claimed, no
        // ASTM C1186, weakest dossier in catalog. Redirect to the nearest
        // functional substitute (Exterior Hidden Joint covers the same
        // monolithic-finish facade application with slightly more
        // documentation, though still under a CertGapWarning).
        source: '/products/fibroxton',
        destination: '/products/exterior-hidden-joint',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
