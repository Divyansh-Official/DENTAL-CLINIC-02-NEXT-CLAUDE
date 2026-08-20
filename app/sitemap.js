import { absoluteUrl, getPostSlugs, getServiceSlugs, isEnabled } from '@/lib/data';

/**
 * Routes disabled by a feature flag are left out entirely, so a clinic that
 * turns off the blog does not advertise a hundred URLs that return 404.
 */
export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/services', priority: 0.9 },
    { path: '/treatments', priority: 0.8, flag: 'treatments' },
    { path: '/gallery', priority: 0.6, flag: 'gallery' },
    { path: '/patient-info', priority: 0.6, flag: 'patientInfo' },
    { path: '/blog', priority: 0.7, flag: 'blog' },
    { path: '/contact', priority: 0.8 },
    { path: '/book-appointment', priority: 0.9 }
  ].filter((route) => !route.flag || isEnabled(route.flag));

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path || '/'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: route.priority
    })),
    ...getServiceSlugs().map((slug) => ({
      url: absoluteUrl(`/services/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7
    })),
    ...getPostSlugs().map((slug) => ({
      url: absoluteUrl(`/blog/${slug}`),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6
    }))
  ];
}
