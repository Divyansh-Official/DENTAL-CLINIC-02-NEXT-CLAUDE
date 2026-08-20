#!/usr/bin/env node
/**
 * Pre-launch content check.  `npm run check`
 *
 * Run this before handing a site to a clinic. It reads /data the same way the
 * app does and reports three things:
 *
 *   ERROR    the site will be broken, or badly wrong in search results.
 *   WARNING  demo content is still in place. Almost always a missed edit.
 *   NOTE     worth a look, not necessarily wrong.
 *
 * It exits non-zero on any error, so it can gate a deploy.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => JSON.parse(readFileSync(join(root, 'data', name), 'utf8'));

const errors = [];
const warnings = [];
const infos = [];
const error = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const info = (m) => infos.push(m);

const site = read('site.json');
const clinic = read('clinic.json');
const services = read('services.json');
const doctors = read('doctors.json');
const blog = read('blog.json');
const navigation = read('navigation.json');
const gallery = read('gallery.json');
const treatments = read('treatments.json');
const appointment = read('appointment.json');
const patientInfo = read('patient-info.json');
const testimonials = read('testimonials.json');
const ui = read('ui.json');
const journey = read('process.json');

/* Every icon key the shipped set understands, parsed straight out of the
   source so the check and the code can never drift apart. */
const iconSource = readFileSync(join(root, 'lib', 'icons.js'), 'utf8');
const knownIcons = new Set([
  ...[...iconSource.matchAll(/^ {2}'?([a-z0-9-]+)'?:\s*\{/gm)].map((m) => m[1]),
  ...[...iconSource.matchAll(/ICONS\['([a-z0-9-]+)'\]\s*=/g)].map((m) => m[1])
]);

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

if (!/^https?:\/\//.test(site.url || '')) {
  error('site.json -> "url" must be the real domain. Canonical links, the sitemap, social previews and structured data are all built from it.');
} else if (site.url.includes('lumieredental.com')) {
  warn('site.json -> "url" is still the demo domain lumieredental.com.');
}

for (const [key, value] of Object.entries(site.theme?.colors || {})) {
  if (key.startsWith('$')) continue;
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
    error(`site.json -> theme.colors.${key} is "${value}". It must be a hex colour such as #0F332C.`);
  }
}

/* ---------- 2. leftover demo content ---------- */

const DEMO = [
  [/lumi[eè]re/i, 'the demo clinic name'],
  [/98765[\s-]?43\d{3}/, 'a demo phone number'],
  [/lumieredental\.com/i, 'the demo domain'],
  [/Smile Street/i, 'the demo street address'],
  [/KDC\/2009\/4471/, 'the demo dental council registration']
];

const demoFiles = {
  'clinic.json': clinic,
  'doctors.json': doctors,
  'appointment.json': appointment,
  'testimonials.json': testimonials,
  'ui.json': ui,
  'site.json': site
};

const seen = new Map();
for (const [name, data] of Object.entries(demoFiles)) {
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
  const shown = paths.slice(0, 3).join(', ');
  const more = paths.length > 3 ? ` and ${paths.length - 3} more` : '';
  warn(`${file} still contains ${label}, at ${shown}${more}.`);
}

/* ---------- 3. contact details ---------- */

const contact = clinic.contact || {};
const digits = (value) => String(value || '').replace(/\D/g, '');

if (!contact.phone) {
  error('clinic.json -> contact.phone is empty. It is the primary conversion path on every page.');
}
if (contact.phoneHref && digits(contact.phoneHref) !== digits(contact.phone)) {
  error(`clinic.json -> contact.phoneHref (${contact.phoneHref}) does not dial contact.phone (${contact.phone}).`);
}
if (contact.emergencyHref && digits(contact.emergencyHref) !== digits(contact.emergencyPhone)) {
  error('clinic.json -> contact.emergencyHref does not dial contact.emergencyPhone.');
}
if (contact.email && contact.emailHref && !contact.emailHref.includes(contact.email)) {
  error('clinic.json -> contact.emailHref does not match contact.email.');
}
if (contact.whatsappHref && contact.whatsapp && !contact.whatsappHref.includes(digits(contact.whatsapp))) {
  error('clinic.json -> contact.whatsappHref does not point at contact.whatsapp.');
}

for (const doctor of doctors.items || []) {
  if (doctor.phoneHref && digits(doctor.phoneHref) !== digits(doctor.phone)) {
    error(`doctors.json -> "${doctor.name}" has a phoneHref that does not dial their listed number.`);
  }
}

const geo = contact.address?.geo || {};
if (!Number.isFinite(geo.latitude) || !Number.isFinite(geo.longitude)) {
  error('clinic.json -> contact.address.geo needs real coordinates. Google uses them to place the clinic on the map and to answer "dentist near me".');
} else if (Math.abs(geo.latitude - 12.9352) < 0.0001 && Math.abs(geo.longitude - 77.6245) < 0.0001) {
  warn('clinic.json -> contact.address.geo is still the demo location in Koramangala.');
}

for (const [i, slot] of (clinic.hours || []).entries()) {
  if (!/^\d{2}:\d{2}$/.test(slot.opens || '') || !/^\d{2}:\d{2}$/.test(slot.closes || '')) {
    error(`clinic.json -> hours[${i}] ("${slot.days}") needs 24-hour "opens" and "closes" values for the search listing.`);
  }
  if (!Array.isArray(slot.dayOfWeek) || !slot.dayOfWeek.length) {
    error(`clinic.json -> hours[${i}] ("${slot.days}") needs a "dayOfWeek" array such as ["Monday","Tuesday"].`);
  }
}

const rating = clinic.seo?.aggregateRating;
if (rating && rating.value > 0) {
  info(`clinic.json publishes an aggregate rating of ${rating.value} from ${rating.count} reviews as structured data. Keep it only if the clinic genuinely holds those reviews.`);
}

/* ---------- 4. references that must resolve ---------- */

const serviceSlugs = new Set((services.items || []).map((s) => s.slug));

const dupes = (values, label) => {
  const found = new Set();
  values.forEach((value) => {
    if (found.has(value)) error(`${label} -> duplicate id "${value}". Each must be unique or the pages collide.`);
    found.add(value);
  });
};
dupes((services.items || []).map((s) => s.slug), 'services.json');
dupes((blog.posts || []).map((p) => p.slug), 'blog.json');
dupes((doctors.items || []).map((d) => d.id), 'doctors.json');
dupes((treatments.categories || []).map((c) => c.id), 'treatments.json');
dupes((gallery.items || []).map((g) => g.id), 'gallery.json');

for (const column of navigation.footerColumns || []) {
  for (const link of column.links || []) {
    const match = /^\/services\/(.+)$/.exec(link.href || '');
    if (match && !serviceSlugs.has(match[1])) {
      error(`navigation.json -> footer link "${link.label}" points at /services/${match[1]}, which is not in services.json.`);
    }
  }
}

if (!(doctors.items || []).some((d) => d.id === doctors.founder?.id)) {
  error(`doctors.json -> founder.id "${doctors.founder?.id}" does not match any doctor in items.`);
}

const filters = gallery.filters || [];
for (const item of gallery.items || []) {
  if (item.category && !filters.includes(item.category)) {
    error(`gallery.json -> "${item.id}" has category "${item.category}", which is not one of the filters, so it can never be shown.`);
  }
  if (item.span && !['normal', 'wide', 'tall'].includes(item.span)) {
    error(`gallery.json -> "${item.id}" has span "${item.span}". Use "normal", "wide" or "tall".`);
  }
}

const steps = journey.steps || [];
if (steps.length < 3 || steps.length > 6) {
  warn(`process.json -> ${steps.length} steps. Between three and six lays out correctly; outside that the row looks sparse or cramped.`);
}
if ((clinic.stats || []).length > 5) {
  warn(`clinic.json -> ${clinic.stats.length} statistics. The rail is designed for two to five.`);
}

/* ---------- 5. icons ---------- */

const iconFiles = {
  'clinic.json': clinic,
  'services.json': services,
  'treatments.json': treatments,
  'process.json': journey,
  'patient-info.json': patientInfo,
  'appointment.json': appointment,
  'navigation.json': navigation
};
for (const [name, data] of Object.entries(iconFiles)) {
  walk(data, '', (value, path) => {
    if (!/(^|\.)icon$/.test(path)) return;
    if (!knownIcons.has(value)) {
      error(`${name} -> ${path} uses icon "${value}", which is not in lib/icons.js. It would render as a plain circle.`);
    }
  });
}

/* ---------- 6. images and alt text ---------- */

const imageFiles = {
  'clinic.json': clinic,
  'services.json': services,
  'doctors.json': doctors,
  'blog.json': blog,
  'gallery.json': gallery,
  'testimonials.json': testimonials
};

let stock = 0;
for (const [name, data] of Object.entries(imageFiles)) {
  walk(data, '', (value, path) => {
    if (!/(^|\.)src$/.test(path) || !value) return;

    if (value.includes('unsplash.com')) {
      stock += 1;
    } else if (value.startsWith('/') && !existsSync(join(root, 'public', value))) {
      error(`${name} -> ${path} points at "${value}", but public${value} does not exist.`);
    }

    const altPath = path.replace(/src$/, 'alt');
    const alt = altPath
      .split(/[.[\]]/)
      .filter(Boolean)
      .reduce((node, key) => (node == null ? undefined : node[key]), data);
    if (!alt) {
      info(`${name} -> ${altPath} is empty. Alt text serves both screen readers and image search.`);
    }
  });
}
if (stock) {
  warn(`${stock} image${stock > 1 ? 's are' : ' is'} still a stock Unsplash photograph. Patients recognise stock dentistry; replace these with the clinic's own before launch.`);
}

/* ---------- report ---------- */

const ESC = String.fromCharCode(27);
const paint = (code) => (s) => ESC + '[' + code + 'm' + s + ESC + '[0m';
const bold = paint(1);
const red = paint(31);
const yellow = paint(33);
const green = paint(32);
const dim = paint(2);

console.log('\n' + bold('Content check') + '  -  ' + (clinic.identity?.legalName || 'unnamed clinic') + '\n');

const section = (label, items, colour) => {
  if (!items.length) return;
  console.log(colour(bold(`${label} (${items.length})`)));
  items.forEach((item) => console.log('  ' + colour('-') + ' ' + item));
  console.log('');
};

section('Errors', errors, red);
section('Warnings', warnings, yellow);
section('Notes', infos, dim);

if (!errors.length && !warnings.length) {
  console.log(green('Everything checks out. Ready to hand over.\n'));
} else {
  console.log(dim(`${errors.length} error(s), ${warnings.length} warning(s), ${infos.length} note(s).\n`));
}

process.exit(errors.length ? 1 : 0);
