import { site } from '@/lib/data';
import { tokenHex } from '@/lib/theme';

/**
 * The brand mark for generated images (favicon, Apple touch icon): the
 * app-icon squircle in the brand gradient with the tooth glyph. Rendered by
 * next/og, so it uses inline styles only.
 */
export default function BrandMark({ dimension, radius }) {
  const primary = tokenHex(site.theme, 'primary');
  const accent = tokenHex(site.theme, 'accent');
  const glyph = Math.round(dimension * 0.6);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(145deg, ${primary}, ${accent})`,
        borderRadius: radius
      }}
    >
      <svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none">
        <path
          d="M8 3.6c-2.4 0-4 1.9-4 4.4 0 3.4 1.1 4.6 1.7 8.5.4 2.6.8 4.1 1.9 4.1 1.4 0 1.5-2.3 2-4.6.3-1.4.7-2.4 2.4-2.4s2.1 1 2.4 2.4c.5 2.3.6 4.6 2 4.6 1.1 0 1.5-1.5 1.9-4.1.6-3.9 1.7-5.1 1.7-8.5 0-2.5-1.6-4.4-4-4.4-1.6 0-2.5.9-4 .9s-2.4-.9-4-.9Z"
          fill="rgba(255,255,255,0.24)"
          stroke="#FFFFFF"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
