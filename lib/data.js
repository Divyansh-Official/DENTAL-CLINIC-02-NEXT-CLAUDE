/**
 * The single import surface for every piece of content on the site.
 *
 * Server components read content from here; client components never import
 * this file — they receive exactly the fields they need as props, which keeps
 * the JSON out of the browser bundle.
 *
 * Three jobs:
 *   1. Expose the JSON files.
 *   2. Safe, connected lookups: a mistyped slug or a deleted array returns a
 *      sane default instead of throwing, and the files are joined — a
 *      dentist's `services` put them on those service pages, a post's
 *      `author` links to a profile, a service's `pricing` pulls its prices.
 *   3. Validate the content in development and report problems as readable
 *      warnings that name the file and key to fix.
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
import { fill, mailtoHref, telHref, whatsappHref } from '@/lib/format';

export {
  site,
  ui,
  clinic,
  navigation,
  services,
  treatments,
  doctors,
  testimonials,
  /* Exported as `journey`, never `process` — a binding called `process`
     shadows Node's global and breaks `process.env` in this file. */
  journey,
  blog,
  gallery,
  patientInfo,
  appointment
};

/* ---------- safety ---------- */

export const list = (value) => (Array.isArray(value) ? value : []);
export const obj = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

/* ---------- site config ---------- */

export const features = obj(site.features);
export const isEnabled = (flag) => features[flag] !== false;

export const locale = {
  htmlLang: site.locale?.htmlLang || 'en',
  openGraph: site.locale?.openGraph || 'en_US',
  numberFormat: site.locale?.numberFormat || 'en-US',
  currency: site.locale?.currency || 'USD',
  timeZone: site.locale?.timeZone || 'UTC'
};

/* The canonical origin: site.json first, then the Vercel deployment. */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const siteUrl = String(
  site.url || process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : '') || 'http://localhost:3000'
).replace(/\/+$/, '');
export const absoluteUrl = (path = '') => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

/* ---------- copy interpolation ---------- */

/** Values available to every {token} in the JSON copy. */
export function copyTokens() {
  const address = obj(clinic.contact?.address);
  return {
    clinic: clinic.identity?.legalName || clinic.identity?.name || '',
    name: clinic.identity?.name || '',
    city: address.city || '',
    state: address.state || '',
    line1: address.line1 || '',
    line2: address.line2 || '',
    phone: clinic.contact?.phone || '',
    email: clinic.contact?.email || '',
    established: clinic.identity?.established || '',
    year: String(new Date().getFullYear())
  };
}

/** Read a copy string from ui.json and interpolate it. `t('about.promise.title')` */
export function t(path, extra = {}) {
  const raw = String(path)
    .split('.')
    .reduce((node, key) => (node == null ? undefined : node[key]), ui);
  if (raw == null) {
    if (process.env.NODE_ENV !== 'production') console.warn(`[copy] "${path}" is missing from data/ui.json.`);
    return '';
  }
  const values = { ...copyTokens(), ...extra };
  if (Array.isArray(raw)) return raw.map((entry) => (typeof entry === 'string' ? fill(entry, values) : entry));
  if (typeof raw !== 'string') return raw;
  return fill(raw, values);
}

/** Interpolate an arbitrary string from any data file. */
export const text = (value, extra = {}) => fill(value, { ...copyTokens(), ...extra });

/** Title and breadcrumb label for a route, from ui.json → pages. */
export const page = (key) => ({ title: t(`pages.${key}.title`), crumb: t(`pages.${key}.crumb`) || t(`pages.${key}.title`) });

/* ---------- navigation ---------- */

/** Routes a feature flag can switch off, and the flag that owns each. */
const ROUTE_FEATURE = {
  '/blog': 'blog',
  '/gallery': 'gallery',
  '/treatments': 'treatments',
  '/patient-info': 'patientInfo',
  '/team': 'team'
};

export const routeEnabled = (href = '') => {
  const path = String(href).split('#')[0].replace(/\/$/, '') || '/';
  const root = `/${path.split('/')[1] || ''}`;
  const flag = ROUTE_FEATURE[root];
  return flag ? isEnabled(flag) : true;
};

const links = (items) => list(items).filter((item) => item?.href && routeEnabled(item.href));

export const primaryNav = () => links(navigation.primary);
export const secondaryNav = () => links(navigation.secondary);
export const navCta = { label: t('common.bookCta'), href: '/book-appointment', icon: 'calendar', ...obj(navigation.cta) };

export const footerColumns = () =>
  list(navigation.footerColumns)
    .map((column) => {
      if (column.source === 'services') {
        const limit = Number(column.limit) || 6;
        return {
          title: column.title,
          links: serviceItems()
            .slice(0, limit)
            .map((service) => ({ label: service.title, href: `/services/${service.slug}` }))
        };
      }
      return { title: column.title, links: links(column.links) };
    })
    .filter((column) => column.links.length);

/* ---------- services & pricing ---------- */

export const serviceItems = () => list(services.items).filter((item) => item?.slug && item?.title);
export const getService = (slug) => serviceItems().find((s) => s.slug === slug) || null;
export const getServiceSlugs = () => serviceItems().map((s) => s.slug);

export const treatmentCategories = () => list(treatments.categories).filter((c) => c?.id);
export const getTreatmentCategory = (id) => treatmentCategories().find((c) => c.id === id) || null;

/* ---------- team ---------- */

export const doctorSlug = (doctor) => doctor?.slug || doctor?.id || '';
export const doctorItems = () =>
  isEnabled('team') ? list(doctors.items).filter((d) => doctorSlug(d) && d.name) : [];
export const getDoctor = (slug) => doctorItems().find((d) => doctorSlug(d) === slug) || null;
export const getDoctorSlugs = () => doctorItems().map(doctorSlug);
export const getDoctorByName = (name) =>
  doctorItems().find((d) => d.name && String(d.name).toLowerCase() === String(name || '').toLowerCase()) || null;
export const getFounder = () =>
  getDoctor(doctors.founder?.slug || doctors.founder?.id) || doctorItems()[0] || null;

/** Dentists who list this service slug. */
export const doctorsForService = (slug) => doctorItems().filter((d) => list(d.services).includes(slug));
/** Services a dentist performs, in services.json order. */
export const servicesForDoctor = (doctor) => serviceItems().filter((s) => list(doctor?.services).includes(s.slug));

/** A dentist's own contact links, derived from their numbers. */
export function doctorContact(doctor) {
  if (!doctor) return {};
  const whatsappNumber = doctor.whatsapp || '';
  return {
    phone: doctor.phone || '',
    phoneHref: doctor.phoneHref || telHref(doctor.phone),
    whatsappHref: doctor.whatsappHref || (whatsappNumber ? whatsappHref(whatsappNumber, clinic.contact?.whatsappMessage) : ''),
    email: doctor.email || '',
    emailHref: doctor.emailHref || mailtoHref(doctor.email)
  };
}

/* ---------- journal ---------- */

export const blogPosts = () => (isEnabled('blog') ? list(blog.posts).filter((p) => p?.slug && p?.title) : []);
export const getPost = (slug) => blogPosts().find((p) => p.slug === slug) || null;
export const getPostSlugs = () => blogPosts().map((p) => p.slug);
export const postsByAuthor = (name) => blogPosts().filter((p) => p.author && p.author === name);

/** Same category first, then anything else, so "keep reading" stays relevant. */
export function getRelatedPosts(slug, count = 3) {
  const current = getPost(slug);
  const others = blogPosts().filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, count);
  const same = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...same, ...rest].slice(0, count);
}

/* ---------- other collections ---------- */

export const testimonialItems = () => (isEnabled('testimonials') ? list(testimonials.items).filter((i) => i?.quote) : []);
export const galleryItems = () => (isEnabled('gallery') ? list(gallery.items).filter((i) => i?.src) : []);
export const journeySteps = () => list(journey.steps);
export const clinicHours = () => list(clinic.hours);
export const clinicStats = () => list(clinic.stats);

export const rating = () => {
  const value = Number(clinic.seo?.aggregateRating?.value) || 0;
  const count = Number(clinic.seo?.aggregateRating?.count) || 0;
  return value > 0 ? { value, count } : null;
};

/* ---------- contact ---------- */

/** The clinic's WhatsApp link, with the site-wide pre-filled message unless another is given. */
export function clinicWhatsapp(message) {
  const c = obj(clinic.contact);
  return whatsappHref(c.whatsapp || c.phone, message ?? c.whatsappMessage);
}

/**
 * Resolves a `field` name used across the JSON (contact channels, booking
 * channels, socials) back to the real value and link, so each number is
 * written once in clinic.json.
 */
export function contactChannel(field, options = {}) {
  const c = obj(clinic.contact);
  const address = obj(c.address);
  switch (field) {
    case 'phone':
      return { value: c.phone, href: c.phoneHref || telHref(c.phone) };
    case 'whatsapp':
      return { value: c.whatsapp || c.phone, href: clinicWhatsapp(options.message) };
    case 'email':
      return { value: c.email, href: mailtoHref(c.email, options.subject) };
    case 'emergency':
      return { value: c.emergencyPhone, href: c.emergencyHref || telHref(c.emergencyPhone) };
    case 'address':
      return { value: [address.line1, address.line2].filter(Boolean).join(', '), href: address.mapsUrl };
    default:
      return { value: '', href: '' };
  }
}

export const clinicPhone = () => contactChannel('phone');

/** Booking-page channels with their values and links resolved. */
export const bookingChannels = () =>
  list(appointment.primaryChannels)
    .map((channel) => {
      const base = channel.field ? contactChannel(channel.field, channel) : {};
      return { ...channel, value: channel.value || base.value, href: channel.href || base.href };
    })
    .filter((channel) => channel.value && channel.href);

export const emergencyLine = () => {
  const e = obj(appointment.emergency);
  const base = contactChannel(e.field || 'emergency');
  return e.title ? { ...e, phone: e.phone || base.value, href: e.href || base.href } : null;
};

export const socialLinks = () =>
  list(clinic.socials)
    .map((social) => ({ ...social, href: social.href || (social.field ? contactChannel(social.field).href : '') }))
    .filter((social) => social.href);

/** Props for every live "Open now" indicator. {time} and {day} are left for the client to fill. */
export function openStatusProps() {
  return {
    hours: clinicHours(),
    timeZone: locale.timeZone,
    locale: locale.numberFormat,
    labels: {
      loading: t('status.loading'),
      openNow: t('status.openNow'),
      closesAt: t('status.closesAt', { time: '{time}' }),
      closed: t('status.closed'),
      opensToday: t('status.opensToday', { time: '{time}' }),
      opensTomorrow: t('status.opensTomorrow', { time: '{time}' }),
      opensOn: t('status.opensOn', { time: '{time}', day: '{day}' })
    }
  };
}

/* ---------- development validation ---------- */

/**
 * Runs once per server start and never throws: it tells whoever is editing
 * the JSON exactly what is wrong while the site keeps rendering.
 */
function validate() {
  const problems = [];
  const need = (condition, message) => {
    if (!condition) problems.push(message);
  };

  need(siteUrl.startsWith('http'), 'site.json → "url" must be a full URL, e.g. https://yourclinic.com.');
  need(clinic.identity?.legalName, 'clinic.json → identity.legalName is empty.');
  need(clinic.contact?.phone, 'clinic.json → contact.phone is empty. It is the primary conversion path on every page.');
  need(clinic.seo?.title && clinic.seo?.description, 'clinic.json → seo.title / seo.description are used for the browser tab and every search result.');
  need(clinicHours().length, 'clinic.json → hours is empty. Opening hours appear in the footer, on contact and in the search listing.');

  clinicHours().forEach((slot, i) => {
    need(
      /^\d{2}:\d{2}$/.test(slot.opens || '') && /^\d{2}:\d{2}$/.test(slot.closes || ''),
      `clinic.json → hours[${i}] needs 24-hour "opens" and "closes" values (e.g. "09:00").`
    );
  });

  const geo = clinic.contact?.address?.geo;
  need(Number.isFinite(geo?.latitude) && Number.isFinite(geo?.longitude), 'clinic.json → contact.address.geo is missing coordinates.');

  const dupe = (values, label) => {
    const seen = new Set();
    values.forEach((value) => {
      if (seen.has(value)) problems.push(`${label} → duplicate "${value}". Each must be unique.`);
      seen.add(value);
    });
  };
  dupe(getServiceSlugs(), 'services.json slug');
  dupe(getPostSlugs(), 'blog.json slug');
  dupe(getDoctorSlugs(), 'doctors.json slug');

  const slugs = new Set(getServiceSlugs());
  doctorItems().forEach((doctor) =>
    list(doctor.services).forEach((slug) => {
      if (!slugs.has(slug)) problems.push(`doctors.json → "${doctor.name}" lists service "${slug}", which is not in services.json.`);
    })
  );
  serviceItems().forEach((service) => {
    if (service.pricing && !getTreatmentCategory(service.pricing)) {
      problems.push(`services.json → "${service.slug}" has pricing "${service.pricing}", which is not a category id in treatments.json.`);
    }
  });

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
