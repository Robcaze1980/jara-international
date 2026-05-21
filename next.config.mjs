/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
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
      {
        // deck (plank) removed 2026-05-21 per R15.5-Q3 (4/4 unanimous after
        // R15 Q3 failed quorum). Severe US product-market fit headwind:
        // composite decking (Trex / TimberTech / AZEK) dominates. No
        // ICC-ES ESR. R15-Q4 promotion of Deck Modular eliminated the
        // consolidation argument. Redirect to /products/deck-modular as
        // the closest functional substitute with no US regulatory gap.
        source: '/products/deck',
        destination: '/products/deck-modular',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
