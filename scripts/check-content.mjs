#!/usr/bin/env node
/**
 * Pre-launch content check.  `npm run check`
 *
 * Run this before handing a site to a clinic. It reads /data the way the app
 * does and reports three kinds of finding:
 *
 *   ERROR    the site will be broken, or badly wrong in search results.
 *   WARNING  demo content is still in place. Almost always a missed edit.
 *   NOTE     worth a look, not necessarily wrong.
 *
 * It exits non-zero on any error, so it can gate a deploy.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => JSON.parse(readFileSync(join(root, 'data', name), 'utf8'));

const errors = [];
const warnings = [];
const notes = [];
const error = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const note = (m) => notes.push(m);

const files = {
  'site.json': read('site.json'),
  'clinic.json': read('clinic.json'),
  'ui.json': read('ui.json'),
  'navigation.json': read('navigation.json'),
  'services.json': read('services.json'),
  'treatments.json': read('treatments.json'),
  'doctors.json': read('doctors.json'),
  'testimonials.json': read('testimonials.json'),
  'process.json': read('process.json'),
  'blog.json': read('blog.json'),
  'gallery.json': read('gallery.json'),
  'patient-info.json': read('patient-info.json'),
  'appointment.json': read('appointment.json')
};
const site = files['site.json'];
const clinic = files['clinic.json'];
const services = files['services.json'];
const treatments = files['treatments.json'];
const doctors = files['doctors.json'];
const blog = files['blog.json'];
const gallery = files['gallery.json'];
const navigation = files['navigation.json'];
const appointment = files['appointment.json'];

const list = (value) => (Array.isArray(value) ? value : []);
const digits = (value) => String(value || '').replace(/\D/g, '');

/* Walks every string in a JSON tree, skipping the $comment annotations. */
const walk = (node, path, visit) => {
  if (typeof node === 'string') return visit(node, path);
  if (Array.isArray(node)) return node.forEach((item, i) => walk(item, `${path}[${i}]`, visit));
  if (node && typeof node === 'object') {
    return Object.entries(node).forEach(([key, value]) => {
      if (key.startsWith('$')) return;
      walk(value, path ? `${path}.${key}` : key, visit);
    });
  }
  return undefined;
};

/* ---------- 1. configuration ---------- */

if (!site.url) {
  note('site.json -> "url" is blank, so the Vercel deployment URL is used for canonical links. Set the real domain once the clinic has one.');
} else if (!/^https?:\/\//.test(site.url)) {
  error('site.json -> "url" must be a full URL such as https://yourclinic.com, or blank to use the Vercel URL.');
} else if (/vercel\.app/.test(site.url)) {
  warn(`site.json -> "url" is a vercel.app address (${site.url}). Use the clinic's own domain before launch.`);
}

for (const [key, value] of Object.entries(site.theme?.colors || {})) {
  if (key.startsWith('$')) continue;
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) error(`site.json -> theme.colors.${key} is "${value}". It must be a hex colour such as #0071E3.`);
}

const FONTS = ['Inter', 'Manrope', 'DM Sans', 'Plus Jakarta Sans'];
if (site.theme?.fonts?.family && !FONTS.includes(site.theme.fonts.family)) {
  error(`site.json -> theme.fonts.family "${site.theme.fonts.family}" is not available. Choose one of: ${FONTS.join(', ')}.`);
}

try {
  new Intl.DateTimeFormat('en-US', { timeZone: site.locale?.timeZone || 'UTC' });
} catch {
  error(`site.json -> locale.timeZone "${site.locale?.timeZone}" is not a valid IANA time zone (e.g. "Asia/Kolkata", "Europe/London").`);
}

/* ---------- 2. leftover demo content ---------- */

const DEMO = [
  [/demo dental/i, 'the demo clinic name'],
  [/98765[\s-]?43\d{3}/, 'a demo phone number'],
  [/demodentalclinic\.com/i, 'the demo email domain'],
  [/Smile Street/i, 'the demo street address'],
  [/DEMO\/2009\/0000/, 'the demo dental council registration'],
  [/Koramangala/i, 'the demo neighbourhood']
];

const seen = new Map();
for (const [name, data] of Object.entries(files)) {
  walk(data, '', (value, path) => {
    for (const [pattern, label] of DEMO) {
      if (!pattern.test(value)) continue;
      const key = `${name}||${label}`;
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push(path);
    }
  });
}
for (const [key, paths] of seen) {
  const [file, label] = key.split('||');
  const more = paths.length > 3 ? ` and ${paths.length - 3} more` : '';
  warn(`${file} still contains ${label}, at ${paths.slice(0, 3).join(', ')}${more}.`);
}

/* ---------- 3. contact details ---------- */

const contact = clinic.contact || {};
if (!contact.phone) error('clinic.json -> contact.phone is empty. It is the primary conversion path on every page.');
if (contact.phoneHref && digits(contact.phoneHref) !== digits(contact.phone)) {
  error(`clinic.json -> contact.phoneHref (${contact.phoneHref}) does not dial contact.phone (${contact.phone}). Delete phoneHref and it is built automatically.`);
}
if (contact.emergencyHref && digits(contact.emergencyHref) !== digits(contact.emergencyPhone)) {
  error('clinic.json -> contact.emergencyHref does not dial contact.emergencyPhone. Delete it and it is built automatically.');
}
if (contact.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) error(`clinic.json -> contact.email "${contact.email}" is not a valid address.`);

const geo = contact.address?.geo || {};
if (!Number.isFinite(geo.latitude) || !Number.isFinite(geo.longitude)) {
  error('clinic.json -> contact.address.geo needs real coordinates. Google uses them for the map and for "dentist near me".');
} else if (Math.abs(geo.latitude - 12.9352) < 0.0001 && Math.abs(geo.longitude - 77.6245) < 0.0001) {
  warn('clinic.json -> contact.address.geo is still the demo location.');
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
for (const [i, slot] of list(clinic.hours).entries()) {
  if (!/^\d{2}:\d{2}$/.test(slot.opens || '') || !/^\d{2}:\d{2}$/.test(slot.closes || '')) {
    error(`clinic.json -> hours[${i}] ("${slot.days}") needs 24-hour "opens" and "closes" values, e.g. "09:00".`);
  }
  const bad = list(slot.dayOfWeek).filter((d) => !DAYS.includes(d));
  if (!list(slot.dayOfWeek).length || bad.length) {
    error(`clinic.json -> hours[${i}] ("${slot.days}") needs a "dayOfWeek" array of English day names${bad.length ? ` — "${bad.join('", "')}" is not one` : ''}.`);
  }
}

for (const [i, social] of list(clinic.socials).entries()) {
  if (!social.href && !social.field) error(`clinic.json -> socials[${i}] ("${social.label}") needs an "href" or a "field".`);
}

const FIELDS = ['phone', 'whatsapp', 'email', 'address', 'emergency'];
for (const [i, channel] of list(appointment.primaryChannels).entries()) {
  if (channel.field && !FIELDS.includes(channel.field)) error(`appointment.json -> primaryChannels[${i}] has field "${channel.field}". Use one of: ${FIELDS.join(', ')}.`);
  if (!channel.field && !channel.href) error(`appointment.json -> primaryChannels[${i}] ("${channel.label}") needs a "field" or an "href".`);
}

const rating = clinic.seo?.aggregateRating;
if (rating && rating.value > 0) {
  note(`clinic.json publishes an aggregate rating of ${rating.value} from ${rating.count} reviews. Keep it only if the clinic genuinely holds those reviews.`);
}

/* ---------- 4. references that must resolve ---------- */

const dupes = (values, label) => {
  const found = new Set();
  values.forEach((value) => {
    if (found.has(value)) error(`${label} -> duplicate "${value}". Each must be unique or the pages collide.`);
    found.add(value);
  });
};

const serviceSlugs = new Set(list(services.items).map((s) => s.slug));
const categoryIds = new Set(list(treatments.categories).map((c) => c.id));
const doctorSlug = (d) => d.slug || d.id;
const doctorSlugs = new Set(list(doctors.items).map(doctorSlug));
const postSlugs = new Set(list(blog.posts).map((p) => p.slug));

dupes(list(services.items).map((s) => s.slug), 'services.json slug');
dupes(list(blog.posts).map((p) => p.slug), 'blog.json slug');
dupes(list(doctors.items).map(doctorSlug), 'doctors.json slug');
dupes(list(treatments.categories).map((c) => c.id), 'treatments.json category id');
dupes(list(gallery.items).map((g) => g.id), 'gallery.json id');

for (const service of list(services.items)) {
  if (!/^[a-z0-9-]+$/.test(service.slug || '')) error(`services.json -> slug "${service.slug}" must be lowercase letters, numbers and hyphens.`);
  if (service.pricing && !categoryIds.has(service.pricing)) {
    error(`services.json -> "${service.slug}" has pricing "${service.pricing}", which is not a category id in treatments.json.`);
  }
}

for (const doctor of list(doctors.items)) {
  if (!/^[a-z0-9-]+$/.test(doctorSlug(doctor) || '')) error(`doctors.json -> "${doctor.name}" needs a slug of lowercase letters, numbers and hyphens.`);
  if (doctor.phoneHref && digits(doctor.phoneHref) !== digits(doctor.phone)) error(`doctors.json -> "${doctor.name}" has a phoneHref that does not dial their listed number.`);
  for (const slug of list(doctor.services)) {
    if (!serviceSlugs.has(slug)) error(`doctors.json -> "${doctor.name}" lists service "${slug}", which is not in services.json.`);
  }
}

const founder = doctors.founder?.slug || doctors.founder?.id;
if (founder && !doctorSlugs.has(founder)) error(`doctors.json -> founder.slug "${founder}" does not match any dentist in items.`);

const doctorNames = new Set(list(doctors.items).map((d) => d.name));
for (const post of list(blog.posts)) {
  if (post.date && !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) warn(`blog.json -> "${post.slug}" date "${post.date}" is not ISO (YYYY-MM-DD); it will be shown as written and left out of Article markup.`);
  if (post.author && !doctorNames.has(post.author)) note(`blog.json -> "${post.slug}" author "${post.author}" is not a dentist in doctors.json, so it will not link to a profile.`);
}

const filters = list(gallery.filters);
for (const item of list(gallery.items)) {
  if (item.category && filters.length && !filters.includes(item.category)) {
    error(`gallery.json -> "${item.id}" has category "${item.category}", which is not one of the filters, so it can only appear under "${filters[0]}".`);
  }
  if (item.span && !['normal', 'wide', 'tall'].includes(item.span)) error(`gallery.json -> "${item.id}" has span "${item.span}". Use "normal", "wide" or "tall".`);
}

/* Every internal link in the navigation and banners must be a real route. */
const ROUTES = new Set(['/', '/about', '/team', '/services', '/treatments', '/gallery', '/patient-info', '/blog', '/contact', '/book-appointment']);
const routeExists = (href) => {
  const path = String(href).split('#')[0].replace(/\/$/, '') || '/';
  if (ROUTES.has(path)) return true;
  const [, section, slug] = path.split('/');
  if (section === 'services') return serviceSlugs.has(slug);
  if (section === 'team') return doctorSlugs.has(slug);
  if (section === 'blog') return postSlugs.has(slug);
  return false;
};
for (const name of ['navigation.json', 'clinic.json', 'site.json', 'services.json', 'blog.json', 'ui.json']) {
  walk(files[name], '', (value, path) => {
    if (!/(^|\.)href$/.test(path) || !value.startsWith('/')) return;
    if (!routeExists(value)) error(`${name} -> ${path} links to "${value}", which is not a page on the site.`);
  });
}

/* ---------- 5. icons ---------- */

const iconSource = readFileSync(join(root, 'lib', 'icons.js'), 'utf8');
const knownIcons = new Set([
  ...[...iconSource.matchAll(/^ {2}'?([a-z0-9-]+)'?:\s*\{/gm)].map((m) => m[1]),
  ...[...iconSource.matchAll(/ICONS\['([a-z0-9-]+)'\]\s*=/g)].map((m) => m[1])
]);
for (const [name, data] of Object.entries(files)) {
  walk(data, '', (value, path) => {
    if (!/(^|\.)icon$/.test(path)) return;
    if (!knownIcons.has(value)) error(`${name} -> ${path} uses icon "${value}", which is not in lib/icons.js. It would render as a plain circle.`);
  });
}

/* ---------- 6. images and alt text ---------- */

const config = readFileSync(join(root, 'next.config.mjs'), 'utf8');
const allowedHosts = new Set([...config.matchAll(/hostname:\s*'([^']+)'/g)].map((m) => m[1]));

let stock = 0;
for (const [name, data] of Object.entries(files)) {
  walk(data, '', (value, path) => {
    if (!/(^|\.)src$/.test(path) || !value || /video\.src$/.test(path)) return;

    if (/^https?:\/\//.test(value)) {
      const host = new URL(value).hostname;
      if (!allowedHosts.has(host)) error(`${name} -> ${path} is hosted on ${host}, which is not in next.config.mjs images.remotePatterns. The build will fail.`);
      if (host.endsWith('unsplash.com')) stock += 1;
    } else if (value.startsWith('/')) {
      if (!existsSync(join(root, 'public', value))) error(`${name} -> ${path} points at "${value}", but public${value} does not exist.`);
    }

    const altPath = path.replace(/src$/, 'alt');
    const alt = altPath
      .split(/[.[\]]/)
      .filter(Boolean)
      .reduce((node, key) => (node == null ? undefined : node[key]), data);
    if (!alt) note(`${name} -> ${altPath} is empty. Alt text serves screen readers and image search.`);
  });
}
if (stock) warn(`${stock} image${stock > 1 ? 's are' : ' is'} still a stock Unsplash photograph. Patients recognise stock dentistry; use the clinic's own before launch.`);

/* ---------- report ---------- */

const tty = process.stdout.isTTY;
const paint = (code) => (s) => (tty ? `\u001b[${code}m${s}\u001b[0m` : s);
const bold = paint(1);
const red = paint(31);
const yellow = paint(33);
const green = paint(32);
const dim = paint(2);

console.log(`\n${bold('Content check')}  -  ${clinic.identity?.legalName || 'unnamed clinic'}\n`);

const section = (label, items, colour) => {
  if (!items.length) return;
  console.log(colour(bold(`${label} (${items.length})`)));
  items.forEach((item) => console.log(`  ${colour('-')} ${item}`));
  console.log('');
};

section('Errors', errors, red);
section('Warnings', warnings, yellow);
section('Notes', notes, dim);

if (!errors.length && !warnings.length) console.log(green('Everything checks out. Ready to hand over.\n'));
else console.log(dim(`${errors.length} error(s), ${warnings.length} warning(s), ${notes.length} note(s).\n`));

process.exit(errors.length ? 1 : 0);
