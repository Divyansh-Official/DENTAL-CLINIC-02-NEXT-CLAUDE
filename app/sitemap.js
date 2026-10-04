import { absoluteUrl, getDoctorSlugs, getPostSlugs, getServiceSlugs, isEnabled } from '@/lib/data';

/**
 * Every route, every service, every dentist and every article. Routes turned
 * off by a feature flag are left out, so the sitemap never advertises a 404.
 */
export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: '/', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/services', priority: 0.9 },
    { path: '/team', priority: 0.8, flag: 'team' },
    { path: '/treatments', priority: 0.8, flag: 'treatments' },
    { path: '/gallery', priority: 0.6, flag: 'gallery' },
    { path: '/patient-info', priority: 0.6, flag: 'patientInfo' },
    { path: '/blog', priority: 0.7, flag: 'blog' },
    { path: '/contact', priority: 0.8 },
    { path: '/book-appointment', priority: 0.9 }
  ].filter((route) => !route.flag || isEnabled(route.flag));

  const entry = (path, priority, changeFrequency = 'monthly') => ({ url: absoluteUrl(path), lastModified: now, changeFrequency, priority });

  return [
    ...staticRoutes.map((route) => entry(route.path, route.priority)),
    ...getServiceSlugs().map((slug) => entry(`/services/${slug}`, 0.7)),
    ...getDoctorSlugs().map((slug) => entry(`/team/${slug}`, 0.6)),
    ...getPostSlugs().map((slug) => entry(`/blog/${slug}`, 0.6, 'yearly'))
  ];
}
