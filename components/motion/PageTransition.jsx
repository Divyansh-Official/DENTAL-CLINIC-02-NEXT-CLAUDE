'use client';

import { useEffect } from 'react';
import { isMorphing } from '@/lib/morph';

/**
 * A soft rise on client-side navigation, used by app/template.js (which
 * Next.js remounts on every route change).
 *
 * The first page load is never animated: the server-rendered page paints
 * as-is. Only later navigations, where the previous page was already on
 * screen, get the entrance. The flag is set in an effect, so the server and
 * the first client render always agree.
 *
 * When a card is zooming open into this page (lib/morph.js), the zoom is the
 * transition: the page itself must hold still for the browser to measure.
 */
let hasNavigated = false;

export default function PageTransition({ children, enabled = true }) {
  const animate = enabled && hasNavigated && !isMorphing();

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return <div className={animate ? 'page-enter' : undefined}>{children}</div>;
}
