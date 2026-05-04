import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'godstore.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.microsoft.com',
        pathname: '/v1.0/**',
      },
    ],
  },
  output: "standalone",
  compress: true,
  async redirects() {
    return [
      // /blog → /blogs
      { source: '/blog', destination: '/blogs', permanent: true },
      { source: '/blog/', destination: '/blogs', permanent: true },
      // Old WordPress blog slugs at root → /blogs/{slug}
      { source: '/software-backup-restore', destination: '/blogs/software-backup-restore', permanent: true },
      { source: '/software-backup-restore/', destination: '/blogs/software-backup-restore', permanent: true },
      { source: '/zero-trust-security-indian-smbs-guide', destination: '/blogs/zero-trust-security-indian-smbs-guide', permanent: true },
      { source: '/zero-trust-security-indian-smbs-guide/', destination: '/blogs/zero-trust-security-indian-smbs-guide', permanent: true },
      { source: '/router-repair-services-in-hyderabad', destination: '/blogs/router-repair-services-in-hyderabad', permanent: true },
      { source: '/router-repair-services-in-hyderabad/', destination: '/blogs/router-repair-services-in-hyderabad', permanent: true },
      { source: '/hasslefree-printer-repair', destination: '/blogs/hasslefree-printer-repair', permanent: true },
      { source: '/hasslefree-printer-repair/', destination: '/blogs/hasslefree-printer-repair', permanent: true },
      { source: '/why-geekondemand-is-the-future-for-it-professionals-in-india', destination: '/blogs/why-geekondemand-is-the-future-for-it-professionals-in-india', permanent: true },
      { source: '/why-geekondemand-is-the-future-for-it-professionals-in-india/', destination: '/blogs/why-geekondemand-is-the-future-for-it-professionals-in-india', permanent: true },
      { source: '/laptop-repair-made-easy', destination: '/blogs/laptop-repair-made-easy', permanent: true },
      { source: '/laptop-repair-made-easy/', destination: '/blogs/laptop-repair-made-easy', permanent: true },
      { source: '/unlock-new-career-horizons-with-geekondemand', destination: '/blogs/unlock-new-career-horizons-with-geekondemand', permanent: true },
      { source: '/unlock-new-career-horizons-with-geekondemand/', destination: '/blogs/unlock-new-career-horizons-with-geekondemand', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        // Cache all public static assets for 1 year
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/cat-icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache Next.js optimized images
        source: '/_next/image',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
