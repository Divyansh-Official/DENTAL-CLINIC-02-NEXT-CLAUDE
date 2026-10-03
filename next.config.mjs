/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    /* Modern formats first; Next falls back automatically for older browsers. */
    formats: ['image/avif', 'image/webp'],
    /* Add the clinic's own image host here if photographs are not in /public.
       `npm run check` reports any remote image whose host is not listed. */
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30
  },

  /**
   * Baseline security headers. The Google Maps embed is the only third-party
   * frame. HSTS is set without `includeSubDomains`/`preload`: those commit
   * every subdomain of a clinic's domain to HTTPS permanently, which is the
   * clinic's decision to make, not the template's.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' }
        ]
      }
    ];
  }
};

export default nextConfig;
