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
};

export default nextConfig;
