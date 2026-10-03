/**
 * Colours and radii resolve to CSS custom properties that lib/theme.js writes
 * into the document from data/site.json. A clinic changes a few hex values in
 * JSON and the whole site recolours on the next request — no Tailwind rebuild —
 * and the `/opacity` modifier keeps working because the properties hold
 * "R G B" triplets.
 */
const withAlpha = (token) => `rgb(var(--c-${token}) / <alpha-value>)`;

const tokens = [
  'primary', 'primary-hover', 'primary-deep', 'primary-soft', 'primary-glow',
  'accent', 'accent-soft', 'accent-deep', 'grad-mid',
  'surface', 'surface-2', 'surface-3', 'card',
  'ink', 'ink-2', 'ink-3', 'line', 'line-soft',
  'night', 'night-2', 'night-3', 'on-night', 'on-night-2',
  'on-primary', 'on-accent'
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '420px',
        /* The header shows its inline links from here; below it, the menu. */
        nav: '1180px'
      },
      colors: {
        ...Object.fromEntries(tokens.map((token) => [token, withAlpha(token)])),
        /* Tone-aware: these follow the section they sit in (white, grey or
           night), so one component reads correctly on all three. */
        fg: 'rgb(var(--fg) / <alpha-value>)',
        'fg-2': 'rgb(var(--fg-2) / <alpha-value>)',
        'fg-3': 'rgb(var(--fg-3) / <alpha-value>)',
        tile: 'rgb(var(--tile) / <alpha-value>)',
        hair: 'rgb(var(--hair) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['var(--font-stack)']
      },
      borderRadius: {
        card: 'var(--r-card)',
        panel: 'var(--r-panel)',
        control: 'var(--r-control)'
      },
      maxWidth: {
        shell: 'var(--shell-max)',
        prose: '42rem'
      },
      transitionTimingFunction: {
        ios: 'cubic-bezier(0.32, 0.72, 0, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: []
};
