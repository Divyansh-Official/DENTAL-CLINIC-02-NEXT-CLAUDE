import { ImageResponse } from 'next/og';
import { clinic, contactChannel, site } from '@/lib/data';
import { tokenHex } from '@/lib/theme';

/**
 * Social preview card, generated from the clinic name, tagline and brand
 * colours — so a rebrand updates every WhatsApp and Facebook link preview
 * with no design work. Set openGraph.image in site.json to use a photograph.
 */
export const alt = clinic.identity?.legalName || 'Dental clinic';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const primary = tokenHex(site.theme, 'primary');
  const accent = tokenHex(site.theme, 'accent');
  const ink = tokenHex(site.theme, 'ink');
  const ink2 = tokenHex(site.theme, 'ink-2');
  const phone = contactChannel('phone').value;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 84px',
          backgroundColor: '#ffffff',
          backgroundImage: `radial-gradient(circle at 12% 0%, ${primary}33, transparent 55%), radial-gradient(circle at 100% 100%, ${accent}38, transparent 55%)`,
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(145deg, ${primary}, ${accent})`
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 3.6c-2.4 0-4 1.9-4 4.4 0 3.4 1.1 4.6 1.7 8.5.4 2.6.8 4.1 1.9 4.1 1.4 0 1.5-2.3 2-4.6.3-1.4.7-2.4 2.4-2.4s2.1 1 2.4 2.4c.5 2.3.6 4.6 2 4.6 1.1 0 1.5-1.5 1.9-4.1.6-3.9 1.7-5.1 1.7-8.5 0-2.5-1.6-4.4-4-4.4-1.6 0-2.5.9-4 .9s-2.4-.9-4-.9Z"
                fill="rgba(255,255,255,0.24)"
                stroke="#FFFFFF"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 600, color: ink, letterSpacing: -1 }}>{clinic.identity?.legalName}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, lineHeight: 1.04, fontWeight: 600, letterSpacing: -3, color: ink, maxWidth: 980 }}>
            {clinic.hero?.title || clinic.identity?.tagline}
          </div>
          <div style={{ display: 'flex', fontSize: 34, marginTop: 24, color: ink2 }}>{clinic.identity?.tagline}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: ink2 }}>
          <div style={{ display: 'flex', padding: '10px 24px', borderRadius: 999, background: primary, color: '#fff' }}>
            {clinic.contact?.address?.city}
          </div>
          <div style={{ display: 'flex' }}>{phone}</div>
        </div>
      </div>
    ),
    size
  );
}
