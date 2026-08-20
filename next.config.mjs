/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    /* Modern formats first; Next falls back automatically for old browsers. */
    formats: ['image/avif', 'image/webp'],
    /* Add the clinic's own image host here if photographs are not in /public. */
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30
  },

  /**
   * Baseline security headers. A clinic site handles no form data, but these
   * are what a security scan looks for and cost nothing to send.
   * The map iframe is the only third-party frame, hence frame-src.
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
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
        ]
      }
    ];
  }
};

export default nextConfig;
