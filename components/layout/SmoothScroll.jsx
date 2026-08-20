'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Momentum scrolling. iOS scroll views decelerate rather than stop dead, and
 * every scroll-linked animation on this site is tuned against that
 * deceleration.
 *
 * Skipped entirely when reduced motion is requested — and re-checked if the
 * visitor changes that preference while the page is open, which the original
 * one-shot check missed.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis = null;
    let frame = 0;

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6
      });
      const raf = (time) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    const stop = () => {
      if (!lenis) return;
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenis = null;
    };

    const sync = () => (query.matches ? stop() : start());

    sync();
    query.addEventListener('change', sync);

    return () => {
      query.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return null;
}
