import { ImageResponse } from 'next/og';
import { site } from '@/lib/data';
import { tokenHex } from '@/lib/theme';

/**
 * Favicon, generated from the brand colours so it follows a rebrand without
 * anyone having to open a graphics editor.
 */
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  const primary = tokenHex(site.theme, 'primary');
  const accent = tokenHex(site.theme, 'accent');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: primary,
          borderRadius: 14
        }}
      >
        <svg width="40" height="46" viewBox="0 0 24 28" fill="none">
          <path
            d="M12 2.2c-1.9 0-2.9 1-4.6 1C4.9 3.2 3 5.4 3 8.4c0 4.1 1.3 5.5 2 10.1.5 3.1 1 4.9 2.3 4.9 1.6 0 1.7-2.7 2.3-5.5.4-1.7.9-2.9 2.4-2.9s2 1.2 2.4 2.9c.6 2.8.7 5.5 2.3 5.5 1.3 0 1.8-1.8 2.3-4.9.7-4.6 2-6 2-10.1 0-3-1.9-5.2-4.4-5.2-1.7 0-2.7 1-4.6 1Z"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9.6" r="1.8" fill={accent} />
        </svg>
      </div>
    ),
    size
  );
}
