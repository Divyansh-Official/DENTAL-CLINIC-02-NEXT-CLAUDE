'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Depth on scroll. The distance is small on purpose — iOS never overdoes this. */
export default function Parallax({ children, distance = 60, className = '', offset = ['start end', 'end start'] }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduceMotion ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
