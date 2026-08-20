import { ImageResponse } from 'next/og';
import { clinic, site } from '@/lib/data';
import { tokenHex } from '@/lib/theme';

/**
 * Social preview card, generated from the clinic name, tagline and brand
 * colours. A rebrand updates the WhatsApp and Facebook link preview with no
 * design work — and no clinic ever ships with a blank share card.
 *
 * Set openGraph.image in data/site.json to override this with a photograph.
 */
export const alt = clinic.identity.legalName;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const primary = tokenHex(site.theme, 'primary');
  const accent = tokenHex(site.theme, 'accent');
  const surface = tokenHex(site.theme, 'surface');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: primary,
          padding: '72px 80px',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: accent }} />
          <div
            style={{
              color: surface,
              fontSize: 26,
              letterSpacing: 8,
              textTransform: 'uppercase'
            }}
          >
            {clinic.identity.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: surface, fontSize: 76, lineHeight: 1.1, letterSpacing: -2 }}>
            {clinic.identity.legalName}
          </div>
          <div style={{ color: accent, fontSize: 34, marginTop: 20 }}>{clinic.identity.tagline}</div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${accent}55`,
            paddingTop: 28,
            color: `${surface}aa`,
            fontSize: 26
          }}
        >
          <div>{clinic.contact.address.city}</div>
          <div>{clinic.contact.phone}</div>
        </div>
      </div>
    ),
    size
  );
}
