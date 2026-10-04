import { Inter, Manrope, DM_Sans, Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Typography.
 *
 * Apple devices render the site in San Francisco, the system face, through the
 * `-apple-system` stack in globals.css. Everyone else gets the brand face
 * chosen here, which is self-hosted by next/font — no request to Google at
 * runtime. `theme.fonts.appleSystemFont: false` in data/site.json uses the
 * brand face everywhere instead.
 *
 * next/font must be called with literal arguments at module scope, so the
 * menu is enumerated. Only the default is preloaded; the alternatives load on
 * demand if a clinic picks one.
 */

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-brand' });
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-brand', preload: false });
const dmSans = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-brand', preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-brand', preload: false });

const FAMILIES = {
  Inter: inter,
  Manrope: manrope,
  'DM Sans': dmSans,
  'Plus Jakarta Sans': jakarta
};

export function resolveFonts(fonts = {}) {
  const chosen = FAMILIES[fonts.family];
  if (fonts.family && !chosen && process.env.NODE_ENV !== 'production') {
    console.warn(`[fonts] "${fonts.family}" is not available. Choose one of: ${Object.keys(FAMILIES).join(', ')}.`);
  }
  const face = chosen || inter;
  return {
    className: face.variable,
    appleSystem: fonts.appleSystemFont !== false
  };
}

export const fontFamilies = Object.keys(FAMILIES);
