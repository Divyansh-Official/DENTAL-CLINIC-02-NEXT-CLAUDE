'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { pagePush } from '@/lib/motion';

/**
 * Route change reads as an iOS navigation push rather than a hard cut.
 *
 * Two deliberate decisions:
 *
 * The first render is never animated. Animating it would mean the server sends
 * `opacity: 0` on the element wrapping the entire page — so a JavaScript error,
 * a blocked bundle or a slow hydration leaves the visitor looking at a blank
 * screen. The page is painted as-is on arrival and only animates on subsequent
 * navigations, where the markup is already on screen.
 *
 * There is also no AnimatePresence with `mode="wait"`. Waiting for the outgoing
 * page to exit before mounting the incoming one adds roughly 300ms of blank
 * screen to every navigation and delays the largest contentful paint.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const firstPath = useRef(pathname);

  useEffect(() => {
    setReady(true);
  }, []);

  const isFirstRender = !ready && pathname === firstPath.current;

  if (reduceMotion || isFirstRender) {
    return <main className="min-h-[60vh]">{children}</main>;
  }

  return (
    <motion.main
      key={pathname}
      variants={pagePush}
      initial="initial"
      animate="animate"
      className="min-h-[60vh]"
    >
      {children}
    </motion.main>
  );
}
