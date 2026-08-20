/**
 * Colours and radii resolve to CSS custom properties that lib/theme.js writes
 * into the document from data/site.json. That indirection is the point: a
 * clinic changes four hex values in JSON and the entire site recolours on the
 * next request — no Tailwind rebuild, no stylesheet edit, and the `/opacity`
 * modifier keeps working because the properties hold "R G B" triplets.
 */
const withAlpha = (token) => `rgb(var(--c-${token}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withAlpha('primary'),
          50: withAlpha('primary-50'),
          100: withAlpha('primary-100'),
          400: withAlpha('primary-400'),
          600: withAlpha('primary-600'),
          700: withAlpha('primary-700'),
          900: withAlpha('primary-900')
        },
        accent: {
          DEFAULT: withAlpha('accent'),
          light: withAlpha('accent-light'),
          soft: withAlpha('accent-soft'),
          deep: withAlpha('accent-deep')
        },
        surface: {
          DEFAULT: withAlpha('surface'),
          50: withAlpha('surface-50'),
          100: withAlpha('surface-100'),
          200: withAlpha('surface-200'),
          300: withAlpha('surface-300')
        },
        ink: {
          DEFAULT: withAlpha('ink'),
          muted: withAlpha('ink-muted'),
          faint: withAlpha('ink-faint')
        },
        line: withAlpha('line'),
        card: withAlpha('card'),
        'on-primary': withAlpha('on-primary'),
        'on-accent': withAlpha('on-accent')
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: 'var(--r-card)',
        panel: 'var(--r-panel)',
        hero: 'var(--r-hero)'
      },
      boxShadow: {
        card: '0 1px 2px rgb(var(--c-ink) / 0.04), 0 12px 28px -18px rgb(var(--c-ink) / 0.28)',
        lift: '0 18px 50px -24px rgb(var(--c-primary) / 0.45)',
        panel: '0 24px 60px -20px rgb(var(--c-primary) / 0.35)'
      },
      transitionTimingFunction: {
        ios: 'cubic-bezier(0.32, 0.72, 0, 1)',
        'ios-out': 'cubic-bezier(0.16, 1, 0.3, 1)'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        spinSlow: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } }
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 32s) linear infinite',
        'spin-slow': 'spinSlow 18s linear infinite'
      },
      maxWidth: { shell: '1240px' }
    }
  },
  plugins: []
};
