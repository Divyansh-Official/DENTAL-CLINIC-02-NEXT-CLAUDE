'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { routeCommitted } from '@/lib/morph';

/**
 * Tells the morph engine (lib/morph.js) when a new route is on screen, so a
 * card-to-page transition can capture the new page.
 *
 * It sits after <main> in the root layout: React runs layout effects in tree
 * order, so by the time this one runs the new page has mounted and Next.js
 * has scrolled it into place — and the browser has not painted yet.
 */
export default function MorphProvider() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    routeCommitted(pathname);
  }, [pathname]);

  return null;
}
