/**
 * Theme derivation.
 *
 * A clinic supplies six hex values in data/site.json — primary, accent,
 * surface, ink, card and night. Everything the site paints with is computed
 * from those here and published as CSS custom properties holding "R G B"
 * triplets, so Tailwind's `/opacity` modifier keeps working and a rebrand is
 * a JSON edit — no Tailwind rebuild, no stylesheet surgery.
 *
 * The default palette follows Apple's: #1D1D1F ink on #F5F5F7 and white, a
 * single saturated action colour, and near-black feature sections.
 */

const FALLBACK = {
  primary: '#0071E3',
  accent: '#21B5A6',
  surface: '#F5F5F7',
  ink: '#1D1D1F',
  card: '#FFFFFF',
  night: '#0A0A0C'
};

/* ---------- colour maths ---------- */

function parseHex(input, fallback) {
  const value = String(input ?? '').trim();
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (!match) return fallback ? parseHex(fallback) : [0, 0, 0];
  let hex = match[1];
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

/** Mix two colours in sRGB. `amount` is how much of `b` ends up in the result. */
function mix(a, b, amount) {
  const t = Math.min(1, Math.max(0, amount));
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
}

const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];
const lighten = (rgb, amount) => mix(rgb, WHITE, amount);
const darken = (rgb, amount) => mix(rgb, BLACK, amount);
const triplet = (rgb) => rgb.join(' ');

function luminance(rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/* ---------- the scale ---------- */

export function deriveTokens(colors = {}, overrides = {}) {
  const primary = parseHex(colors.primary, FALLBACK.primary);
  const accent = parseHex(colors.accent, FALLBACK.accent);
  const surface = parseHex(colors.surface, FALLBACK.surface);
  const ink = parseHex(colors.ink, FALLBACK.ink);
  const card = parseHex(colors.card, FALLBACK.card);
  const night = parseHex(colors.night, FALLBACK.night);

  const scale = {
    primary,
    'primary-hover': lighten(primary, 0.1),
    'primary-deep': darken(primary, 0.2),
    'primary-soft': mix(card, primary, 0.09),
    'primary-glow': lighten(primary, 0.35),

    accent,
    'accent-soft': mix(card, accent, 0.12),
    'accent-deep': darken(accent, 0.28),

    /* The middle stop of the brand gradient. */
    'grad-mid': mix(primary, accent, 0.5),

    surface,
    'surface-2': mix(surface, WHITE, 0.55),
    'surface-3': darken(surface, 0.045),
    card,

    ink,
    'ink-2': mix(ink, WHITE, 0.36),
    'ink-3': mix(ink, WHITE, 0.46),
    line: mix(ink, WHITE, 0.81),
    'line-soft': mix(ink, WHITE, 0.9),

    night,
    'night-2': lighten(night, 0.07),
    'night-3': lighten(night, 0.13),
    'on-night': mix(night, WHITE, 0.96),
    'on-night-2': mix(night, WHITE, 0.63),

    /* Text on a filled brand colour, chosen by contrast rather than assumed. */
    'on-primary': contrastRatio(primary, WHITE) >= 3 ? WHITE : ink,
    'on-accent': contrastRatio(accent, WHITE) >= 3 ? WHITE : ink
  };

  for (const [key, value] of Object.entries(overrides || {})) {
    if (key.startsWith('$')) continue;
    scale[key] = parseHex(value, '#000000');
  }

  return scale;
}

/** The `:root` block injected into the document head before first paint. */
export function themeCss(theme = {}) {
  const tokens = deriveTokens(theme.colors, theme.overrides);
  const radius = theme.radius || {};

  const vars = Object.entries(tokens)
    .map(([key, rgb]) => `--c-${key}:${triplet(rgb)}`)
    .join(';');

  const radii = [
    `--r-card:${radius.card || '24px'}`,
    `--r-panel:${radius.panel || '36px'}`,
    `--r-control:${radius.control || '14px'}`
  ].join(';');

  return `:root{${vars};${radii}}`;
}

/** Hex for places that cannot take a CSS variable — themeColor, OG images. */
export function tokenHex(theme = {}, key = 'primary') {
  const tokens = deriveTokens(theme.colors, theme.overrides);
  const rgb = tokens[key] || tokens.primary;
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export { parseHex, mix, lighten, darken, triplet };
