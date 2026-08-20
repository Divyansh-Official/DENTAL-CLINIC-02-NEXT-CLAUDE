import {
  Playfair_Display,
  Cormorant_Garamond,
  Fraunces,
  Marcellus,
  Lora,
  Jost,
  Inter,
  DM_Sans,
  Manrope,
  Outfit
} from 'next/font/google';

/**
 * Typeface menu.
 *
 * `next/font` has to be called with literal arguments at module scope, so the
 * available faces are enumerated here rather than loaded dynamically from
 * JSON. Set `theme.fonts.display` / `theme.fonts.body` in data/site.json to
 * any name in these tables. Only the selected pair is served to the browser;
 * an unrecognised name falls back to the default pair with a build warning.
 */

const playfair = Playfair_Display({
  subsets: ['latin'], display: 'swap', variable: '--font-display',
  weight: ['400', '500', '600', '700'], style: ['normal', 'italic']
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'], display: 'swap', variable: '--font-display',
  weight: ['400', '500', '600', '700'], style: ['normal', 'italic']
});
const fraunces = Fraunces({
  subsets: ['latin'], display: 'swap', variable: '--font-display',
  weight: ['400', '500', '600', '700'], style: ['normal', 'italic']
});
const marcellus = Marcellus({
  subsets: ['latin'], display: 'swap', variable: '--font-display', weight: ['400']
});
const lora = Lora({
  subsets: ['latin'], display: 'swap', variable: '--font-display',
  weight: ['400', '500', '600', '700'], style: ['normal', 'italic']
});

const jost = Jost({
  subsets: ['latin'], display: 'swap', variable: '--font-body',
  weight: ['300', '400', '500', '600']
});
const inter = Inter({
  subsets: ['latin'], display: 'swap', variable: '--font-body',
  weight: ['300', '400', '500', '600']
});
const dmSans = DM_Sans({
  subsets: ['latin'], display: 'swap', variable: '--font-body',
  weight: ['300', '400', '500', '600']
});
const manrope = Manrope({
  subsets: ['latin'], display: 'swap', variable: '--font-body',
  weight: ['300', '400', '500', '600']
});
const outfit = Outfit({
  subsets: ['latin'], display: 'swap', variable: '--font-body',
  weight: ['300', '400', '500', '600']
});

const DISPLAY = {
  'Playfair Display': playfair,
  'Cormorant Garamond': cormorant,
  Fraunces: fraunces,
  Marcellus: marcellus,
  Lora: lora
};

const BODY = {
  Jost: jost,
  Inter: inter,
  'DM Sans': dmSans,
  Manrope: manrope,
  Outfit: outfit
};

function pick(table, name, fallback, slot) {
  const chosen = table[name];
  if (chosen) return chosen;
  if (name && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[fonts] "${name}" is not an available ${slot} face. Using the default. ` +
        `Choose one of: ${Object.keys(table).join(', ')}.`
    );
  }
  return fallback;
}

export function resolveFonts(fonts = {}) {
  const display = pick(DISPLAY, fonts.display, playfair, 'display');
  const body = pick(BODY, fonts.body, jost, 'body');
  return { display, body, className: `${display.variable} ${body.variable}` };
}

export const displayFontNames = Object.keys(DISPLAY);
export const bodyFontNames = Object.keys(BODY);
