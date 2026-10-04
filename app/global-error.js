'use client';

import clinic from '@/data/clinic.json';
import ui from '@/data/ui.json';
import { telHref } from '@/lib/format';

/**
 * Last-resort boundary for an error in the root layout itself, where the
 * site's stylesheet and header may not exist. Inline styles only, and the
 * phone number is always there.
 */
export default function GlobalError({ reset }) {
  const copy = ui.error || {};
  const phone = clinic.contact?.phone;
  const font = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: font, background: '#fff', color: '#1d1d1f' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{ color: '#0071e3', fontWeight: 600, margin: 0 }}>{copy.eyebrow}</p>
            <h1 style={{ fontSize: 40, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '12px 0 0' }}>{copy.title}</h1>
            <p style={{ fontSize: 19, lineHeight: 1.5, color: '#6e6e73', marginTop: 20 }}>{copy.body}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
              <button
                type="button"
                onClick={reset}
                style={{ height: 48, padding: '0 24px', borderRadius: 999, border: 0, background: '#0071e3', color: '#fff', fontSize: 17, cursor: 'pointer' }}
              >
                {copy.retry}
              </button>
              {phone ? (
                <a
                  href={telHref(phone)}
                  style={{ height: 48, padding: '0 24px', borderRadius: 999, background: '#f5f5f7', color: '#1d1d1f', fontSize: 17, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                >
                  {phone}
                </a>
              ) : null}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
