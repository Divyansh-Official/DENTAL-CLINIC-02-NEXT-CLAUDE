'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/**
 * A media query read from JavaScript. The server snapshot is pinned to false
 * so the markup React renders and the markup it hydrates are identical; the
 * real value lands in the same commit rather than a second pass.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True once mounted on the client. For values a static page cannot know, like the time. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** True when motion should be held back: reduced motion, or ?nomotion for screenshots. */
export function prefersCalm() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('no-motion')
  );
}
