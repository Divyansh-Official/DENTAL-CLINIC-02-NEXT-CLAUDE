/**
 * Text and link helpers shared by the whole site.
 *
 * The interpolation here is what lets JSON copy reference live clinic values:
 * write "Practising at {clinic}, {city}." in data/ui.json and it renders with
 * the real name and city, so the same sentence survives a rebrand.
 */

/** Replace {token} placeholders from a value bag. Unknown tokens are left visible in dev so they get noticed. */
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

/** Digits only, for tel: and wa.me targets. */
export const digitsOnly = (value) => String(value ?? '').replace(/[^\d+]/g, '').replace(/^\+/, '');

export function telHref(phone) {
  const digits = String(phone ?? '').replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '';
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

/** A link leaves the site if it is not an in-app path. */
export const isExternal = (href) => /^(https?:|tel:|mailto:|sms:)/i.test(String(href ?? ''));
export const isNewTab = (href) => /^https?:/i.test(String(href ?? ''));

export function linkAttrs(href) {
  if (!isNewTab(href)) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}

export function formatNumber(value, locale = 'en-IN') {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0';
  try {
    return number.toLocaleString(locale);
  } catch {
    return number.toLocaleString('en-US');
  }
}

/**
 * Split a heading so one word can be set in the accent italic.
 * `accent` may be a single word or a list; matching ignores punctuation.
 */
export function markAccent(text, accent) {
  const source = String(text ?? '');
  if (!source) return [];
  const targets = (Array.isArray(accent) ? accent : accent ? [accent] : [])
    .filter(Boolean)
    .map((t) => String(t).trim())
    .filter(Boolean);

  if (!targets.length) return [{ text: source, accent: false }];

  /* Longest first so "Your Family" wins over "Your". */
  const sorted = [...targets].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

  return source
    .split(pattern)
    .filter((part) => part !== '')
    .map((part) => ({ text: part, accent: sorted.some((t) => t.toLowerCase() === part.toLowerCase()) }));
}

/** Words for the masked headline animation, each flagged if it belongs to an accent phrase. */
export function accentWords(text, accent) {
  return markAccent(text, accent).flatMap((segment) =>
    segment.text
      .split(/(\s+)/)
      .filter((chunk) => chunk.trim() !== '')
      .map((word) => ({ word, accent: segment.accent }))
  );
}
