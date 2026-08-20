/**
 * Theme derivation.
 *
 * A clinic supplies four hex values in data/site.json. Everything the site
 * paints with — tints, shades, hairlines, muted text, icon colours, gradient
 * stops — is computed from those four here, at module load, and published as
 * CSS custom properties. Tailwind's colour utilities read those properties
 * (see tailwind.config.js), so a rebrand is a JSON edit and a refresh. No
 * Tailwind rebuild, no stylesheet surgery, no per-colour asset.
 */

const FALLBACK = {
  primary: '#0F332C',
  accent: '#B08D57',
  surface: '#F7F4EF',
  ink: '#16181A',
  card: '#FFFFFF'
};

/* ---------- colour maths ---------- */

function parseHex(input, fallback) {
  const value = String(input ?? '').trim();
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (!match) return fallback ? parseHex(fallback) : [0, 0, 0];
  let hex = match[1];
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16)
  ];
}

/** Mix two colours in sRGB. `amount` is how much of `b` ends up in the result. */
function mix(a, b, amount) {
  const clamped = Math.min(1, Math.max(0, amount));
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * clamped));
}

const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];

const lighten = (rgb, amount) => mix(rgb, WHITE, amount);
const darken = (rgb, amount) => mix(rgb, BLACK, amount);

/** Tailwind reads colours as "R G B" so the `/opacity` modifier keeps working. */
const triplet = (rgb) => rgb.join(' ');

/** Relative luminance, used to decide whether text on a colour should be light or dark. */
function luminance(rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/* ---------- the scale ---------- */

/**
 * Ratios were reverse-engineered from the reference palette so the default
 * brand renders byte-identically, and they hold their relationships when the
 * brand changes — a navy or a plum clinic gets the same visual rhythm.
 */
export function deriveTokens(colors = {}, overrides = {}) {
  const primary = parseHex(colors.primary, FALLBACK.primary);
  const accent = parseHex(colors.accent, FALLBACK.accent);
  const surface = parseHex(colors.surface, FALLBACK.surface);
  const ink = parseHex(colors.ink, FALLBACK.ink);
  const card = parseHex(colors.card, FALLBACK.card);

  const scale = {
    'primary': primary,
    'primary-50': lighten(primary, 0.9),
    'primary-100': lighten(primary, 0.76),
    'primary-400': lighten(primary, 0.22),
    'primary-600': lighten(primary, 0.06),
    'primary-700': primary,
    'primary-900': darken(primary, 0.3),

    'accent': accent,
    'accent-light': lighten(accent, 0.22),
    'accent-soft': lighten(accent, 0.62),
    'accent-deep': darken(accent, 0.2),

    'surface': surface,
    'surface-50': lighten(surface, 0.55),
    'surface-100': surface,
    'surface-200': darken(surface, 0.045),
    'surface-300': darken(surface, 0.1),

    'ink': ink,
    'ink-muted': mix(ink, surface, 0.39),
    'ink-faint': mix(ink, surface, 0.6),

    'line': darken(surface, 0.07),
    'card': card,

    /* Text that sits on top of a filled primary or accent block. Chosen by
       contrast rather than assumed, so a pale brand colour still reads. */
    'on-primary': contrastRatio(primary, surface) >= 4.5 ? surface : darken(ink, 0),
    'on-accent': contrastRatio(accent, WHITE) >= 3 ? WHITE : darken(ink, 0)
  };

  for (const [key, value] of Object.entries(overrides || {})) {
    if (key.startsWith('$')) continue;
    scale[key] = parseHex(value, '#000000');
  }

  return scale;
}

/** The `:root` block injected into the document head. */
export function themeCss(theme = {}) {
  const tokens = deriveTokens(theme.colors, theme.overrides);
  const radius = theme.radius || {};

  const vars = Object.entries(tokens)
    .map(([key, rgb]) => `--c-${key}:${triplet(rgb)}`)
    .join(';');

  const radii = [
    `--r-card:${radius.card || '22px'}`,
    `--r-panel:${radius.panel || '32px'}`,
    `--r-hero:${radius.hero || '180px 24px 24px 24px'}`
  ].join(';');

  return `:root{${vars};${radii}}`;
}

/** Hex for the places that cannot take a CSS variable — themeColor, OG images, SVG fills. */
export function tokenHex(theme = {}, key = 'primary') {
  const tokens = deriveTokens(theme.colors, theme.overrides);
  const rgb = tokens[key] || tokens.primary;
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export { parseHex, mix, lighten, darken, triplet };
