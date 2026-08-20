import { absoluteUrl, siteUrl } from '@/lib/data';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl
  };
}
