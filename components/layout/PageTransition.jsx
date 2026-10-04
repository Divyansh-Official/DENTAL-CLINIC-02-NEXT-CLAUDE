'use client';

import { useEffect } from 'react';

/**
 * A soft rise on client-side navigation, used by app/template.js (which
 * Next.js remounts on every route change).
 *
 * The first page load is never animated: the server-rendered page paints
 * as-is. Only later navigations, where the previous page was already on
 * screen, get the entrance. The flag is set in an effect, so the server and
 * the first client render always agree.
 */
let hasNavigated = false;

export default function PageTransition({ children, enabled = true }) {
  const animate = enabled && hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return <div className={animate ? 'page-enter' : undefined}>{children}</div>;
}
