/**
 * The single import surface for every piece of content on the site.
 *
 * Three jobs:
 *   1. Expose the JSON files.
 *   2. Wrap the lookups that used to be done inline in components, so a
 *      mistyped slug or a deleted array returns a sane default instead of
 *      throwing. A clinic editing JSON should never be able to white-screen
 *      their own website.
 *   3. Validate the content in development and report problems as readable
 *      warnings pointing at the file and key that need fixing.
 */
import site from '@/data/site.json';
import ui from '@/data/ui.json';
import clinic from '@/data/clinic.json';
import navigation from '@/data/navigation.json';
import services from '@/data/services.json';
import treatments from '@/data/treatments.json';
import doctors from '@/data/doctors.json';
import testimonials from '@/data/testimonials.json';
import journey from '@/data/process.json';
import blog from '@/data/blog.json';
import gallery from '@/data/gallery.json';
import patientInfo from '@/data/patient-info.json';
import appointment from '@/data/appointment.json';
import { fill, whatsappHref } from '@/lib/format';

export {
  site,
  ui,
  clinic,
  navigation,
  services,
  treatments,
  doctors,
  testimonials,
  /* Exported as `journey`, never as `process` — a module-scope binding called
     `process` shadows Node's global and breaks `process.env` inside this file. */
  journey,
  blog,
  gallery,
  patientInfo,
  appointment
};

/* ---------- safety ---------- */

const list = (value) => (Array.isArray(value) ? value : []);
const obj = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

/* ---------- site config ---------- */

export const features = obj(site.features);
export const isEnabled = (flag) => features[flag] !== false;

export const locale = {
  lang: site.locale?.lang || 'en',
  htmlLang: site.locale?.htmlLang || 'en',
  openGraph: site.locale?.openGraph || 'en_US',
  numberFormat: site.locale?.numberFormat || 'en-US',
  currency: site.locale?.currency || 'USD',
  currencySymbol: site.locale?.currencySymbol || '$'
};

export const siteUrl = String(site.url || '').replace(/\/+$/, '');
export const absoluteUrl = (path = '') => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

/* ---------- copy interpolation ---------- */

/**
 * Values available to every {token} in the JSON copy. Add a key here and it
 * becomes usable in any string across data/*.json.
 */
export function copyTokens() {
  return {
    clinic: clinic.identity?.legalName || clinic.identity?.name || '',
    name: clinic.identity?.name || '',
    city: clinic.contact?.address?.city || '',
    state: clinic.contact?.address?.state || '',
    line1: clinic.contact?.address?.line1 || '',
    line2: clinic.contact?.address?.line2 || '',
    phone: clinic.contact?.phone || '',
    email: clinic.contact?.email || '',
    established: clinic.identity?.established || '',
    year: String(new Date().getFullYear())
  };
}

/** Read a copy string and interpolate it. `t('about.promise.title')` */
export function t(path, extra = {}) {
  const raw = path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), ui);
  if (raw == null) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[copy] "${path}" is missing from data/ui.json.`);
    }
    return '';
  }
  if (Array.isArray(raw)) return raw.map((entry) => fill(entry, { ...copyTokens(), ...extra }));
  if (typeof raw !== 'string') return raw;
  return fill(raw, { ...copyTokens(), ...extra });
}

/** Interpolate an arbitrary string from any data file. */
export const text = (value, extra = {}) => fill(value, { ...copyTokens(), ...extra });

/* ---------- navigation ---------- */

/** Routes a feature flag can switch off, and the flag that owns each. */
const ROUTE_FEATURE = {
  '/blog': 'blog',
  '/gallery': 'gallery',
  '/treatments': 'treatments',
  '/patient-info': 'patientInfo'
};

export const routeEnabled = (href = '') => {
  const flag = ROUTE_FEATURE[String(href).split('#')[0].replace(/\/$/, '') || '/'];
  return flag ? isEnabled(flag) : true;
};

export const primaryNav = () => list(navigation.primary).filter((item) => routeEnabled(item.href));

export const footerColumns = () =>
  list(navigation.footerColumns).map((column) => ({
    ...column,
    links: list(column.links).filter((link) => routeEnabled(link.href))
  }));

export const navCta = obj(navigation.cta);

/* ---------- lookups ---------- */

export const serviceItems = () => list(services.items);
export const getService = (slug) => serviceItems().find((s) => s.slug === slug) || null;
export const getServiceSlugs = () => serviceItems().map((s) => s.slug).filter(Boolean);

export const blogPosts = () => (isEnabled('blog') ? list(blog.posts) : []);
export const getPost = (slug) => blogPosts().find((p) => p.slug === slug) || null;
export const getPostSlugs = () => blogPosts().map((p) => p.slug).filter(Boolean);

/** Same category first, then anything else, so "keep reading" stays relevant. */
export function getRelatedPosts(slug, count = 3) {
  const current = getPost(slug);
  const others = blogPosts().filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, count);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}

export const doctorItems = () => (isEnabled('team') ? list(doctors.items) : []);
export const getDoctor = (id) => doctorItems().find((d) => d.id === id) || null;
export const getFounder = () => getDoctor(doctors.founder?.id) || doctorItems()[0] || null;

export const testimonialItems = () => (isEnabled('testimonials') ? list(testimonials.items) : []);
export const galleryItems = () => list(gallery.items);
export const journeySteps = () => list(journey.steps);
export const treatmentCategories = () => list(treatments.categories);

/** Never returns undefined, so the price table cannot crash on a bad id. */
export const getTreatmentCategory = (id) => {
  const categories = treatmentCategories();
  return categories.find((c) => c.id === id) || categories[0] || { id: '', name: '', items: [] };
};

/* ---------- derived contact ---------- */

/** One place that knows how to build a WhatsApp link, message included. */
export const clinicWhatsapp = () =>
  clinic.contact?.whatsappHref ||
  whatsappHref(clinic.contact?.whatsapp || clinic.contact?.phone, clinic.contact?.whatsappMessage);

/** Resolves the `field` key used by ui.json contact channels back to real values. */
export function contactChannel(field) {
  const c = obj(clinic.contact);
  switch (field) {
    case 'phone':
      return { value: c.phone, href: c.phoneHref };
    case 'whatsapp':
      return { value: c.whatsapp, href: clinicWhatsapp() };
    case 'email':
      return { value: c.email, href: c.emailHref };
    case 'emergency':
      return { value: c.emergencyPhone, href: c.emergencyHref };
    default:
      return { value: '', href: '' };
  }
}

export const clinicHours = () => list(clinic.hours);

/* ---------- development validation ---------- */

/**
 * Runs once per server start. It never throws: the point is to tell whoever is
 * editing the JSON exactly what is wrong while the site keeps rendering.
 */
function validate() {
  const problems = [];
  const require = (condition, message) => {
    if (!condition) problems.push(message);
  };

  require(siteUrl.startsWith('http'), 'site.json → "url" must be a full URL, e.g. https://yourclinic.com. Canonical links, the sitemap and social previews all depend on it.');
  require(clinic.identity?.legalName, 'clinic.json → identity.legalName is empty.');
  require(clinic.contact?.phone, 'clinic.json → contact.phone is empty. It is the primary conversion path on every page.');
  require(clinic.seo?.title && clinic.seo?.description, 'clinic.json → seo.title / seo.description are used for the browser tab and every search result.');
  require(clinicHours().length, 'clinic.json → hours is empty. Opening hours appear in the footer, on contact and in the search listing.');

  clinicHours().forEach((slot, i) => {
    require(
      /^\d{2}:\d{2}$/.test(slot.opens || '') && /^\d{2}:\d{2}$/.test(slot.closes || ''),
      `clinic.json → hours[${i}] needs 24-hour "opens" and "closes" values (e.g. "09:00") for the search listing.`
    );
  });

  const geo = clinic.contact?.address?.geo;
  require(
    Number.isFinite(geo?.latitude) && Number.isFinite(geo?.longitude),
    'clinic.json → contact.address.geo is missing coordinates. Google uses them to place the clinic on the map and for "dentist near me".'
  );

  /* Slugs must be unique or the static routes collide silently. */
  const dupe = (values, label) => {
    const seen = new Set();
    values.forEach((value) => {
      if (seen.has(value)) problems.push(`${label} → duplicate slug "${value}". Each one must be unique.`);
      seen.add(value);
    });
  };
  dupe(getServiceSlugs(), 'services.json');
  dupe(getPostSlugs(), 'blog.json');
  dupe(doctorItems().map((d) => d.id), 'doctors.json');

  /* Footer service links that point at a service that no longer exists. */
  const slugs = new Set(getServiceSlugs());
  footerColumns().forEach((column) =>
    list(column.links).forEach((link) => {
      const match = /^\/services\/(.+)$/.exec(link.href || '');
      if (match && !slugs.has(match[1])) {
        problems.push(`navigation.json → footer link "${link.label}" points at /services/${match[1]}, which does not exist in services.json.`);
      }
    })
  );

  if (problems.length) {
    console.warn(
      `\n[content] ${problems.length} issue${problems.length > 1 ? 's' : ''} found in /data:\n` +
        problems.map((p) => `  • ${p}`).join('\n') +
        '\n'
    );
  }
}

if (process.env.NODE_ENV !== 'production' && !globalThis.__contentValidated) {
  globalThis.__contentValidated = true;
  validate();
}
