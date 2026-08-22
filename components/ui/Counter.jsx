'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { useCalmMotion } from '@/lib/hooks';
import { locale } from '@/lib/data';
import { formatNumber } from '@/lib/format';

/** Odometer for the stats bar. Counts once, on entry, then stays put. */
export default function Counter({ value, suffix = '', duration = 1.8, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const calm = useCalmMotion();
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    /* Checked before `inView` so a held-back visitor sees the real number
       even if the observer never fires. */
    if (calm) {
      setDisplay(target);
      return undefined;
    }
    if (!inView) return undefined;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.floor(latest))
    });
    return () => controls.stop();
  }, [inView, target, duration, calm]);

  return (
    <span ref={ref} className={className}>
      {/* The final figure is in the DOM for crawlers and assistive tech even
          while the animation is mid-count. */}
      <span aria-hidden="true">{formatNumber(display, locale.numberFormat)}{suffix}</span>
      <span className="sr-only">{formatNumber(target, locale.numberFormat)}{suffix}</span>
    </span>
  );
}
