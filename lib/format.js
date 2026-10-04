/**
 * Text and link helpers shared by the whole site.
 *
 * The interpolation here is what lets JSON copy reference live clinic values:
 * write "Practising at {clinic}, {city}." in data/ui.json and it renders with
 * the real name and city, so the same sentence survives a rebrand.
 */

/** Replace {token} placeholders from a value bag. Unknown tokens are removed and reported in development. */
export function fill(template, values = {}) {
  if (typeof template !== 'string') return '';
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key) && values[key] != null) {
      return String(values[key]);
    }
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[copy] "${match}" has no value. Available tokens: ${Object.keys(values).join(', ')}.`);
    }
    return '';
  });
}

/* ---------- links ---------- */

/** Digits only, for wa.me targets. */
export const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

export function telHref(phone) {
  const cleaned = String(phone ?? '').replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : '';
}

export function whatsappHref(phone, message) {
  const digits = digitsOnly(phone);
  if (!digits) return '';
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoHref(email, subject) {
  if (!email) return '';
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

/** A link leaves the app if it is not an in-app path. */
export const isExternal = (href) => /^(https?:|tel:|mailto:|sms:)/i.test(String(href ?? ''));
export const isNewTab = (href) => /^https?:/i.test(String(href ?? ''));

export function linkAttrs(href) {
  if (!isNewTab(href)) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}

/* ---------- numbers and dates ---------- */

export function formatNumber(value, locale = 'en-US') {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value ?? '');
  try {
    return number.toLocaleString(locale);
  } catch {
    return number.toLocaleString('en-US');
  }
}

/** ISO dates ("2024-05-20") become "20 May 2024" in the site locale; anything else is shown as written. */
export function formatDate(value, locale = 'en-US') {
  if (!value) return '';
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(String(value));
  const time = Date.parse(iso ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(time)) return String(value);
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(time);
  } catch {
    return String(value);
  }
}

export function isoDate(value) {
  if (!value) return undefined;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(String(value));
  const time = Date.parse(iso ? `${value}T00:00:00Z` : value);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
}

/* ---------- headings ---------- */

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Split a heading so a word or phrase can be set in the accent gradient.
 *
 * Matches whole words only — an accent of "You" never splits "Your" — and
 * case-insensitively. Punctuation stays exactly where it was written, so
 * "Real Smiles." renders as "Real" + accented "Smiles" + "." with no space
 * inserted before the full stop.
 */
export function markAccent(text, accent) {
  const source = String(text ?? '');
  if (!source) return [];
  const targets = (Array.isArray(accent) ? accent : accent ? [accent] : [])
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (!targets.length) return [{ text: source, accent: false }];

  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${targets.map(escapeRegExp).join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  const segments = [];
  let last = 0;
  for (const match of source.matchAll(pattern)) {
    if (match.index > last) segments.push({ text: source.slice(last, match.index), accent: false });
    segments.push({ text: match[0], accent: true });
    last = match.index + match[0].length;
  }
  if (last < source.length) segments.push({ text: source.slice(last), accent: false });
  return segments;
}

export function initials(name) {
  return String(name ?? '')
    .replace(/^(dr\.?|mr\.?|mrs\.?|ms\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export const slugify = (value) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
