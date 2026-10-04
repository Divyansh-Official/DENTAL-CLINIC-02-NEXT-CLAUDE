import { clinic, site } from '@/lib/data';
import { tokenHex } from '@/lib/theme';

/** Installable web-app metadata. Icons come from app/icon.js and app/apple-icon.js. */
export default function manifest() {
  return {
    name: clinic.identity?.legalName,
    short_name: clinic.identity?.name || clinic.identity?.legalName,
    description: clinic.seo?.description,
    start_url: '/',
    display: 'standalone',
    background_color: tokenHex(site.theme, 'card'),
    theme_color: tokenHex(site.theme, 'card'),
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' }
    ]
  };
}
