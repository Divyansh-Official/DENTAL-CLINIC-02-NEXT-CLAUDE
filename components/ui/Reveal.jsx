'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';
import { accentWords } from '@/lib/format';

/**
 * Scroll-triggered entrance. Content rises, unblurs and settles once.
 *
 * Every variant collapses to a plain fade when the visitor has asked for
 * reduced motion — checked in JavaScript, because the CSS media query cannot
 * reach transforms driven by Framer.
 */
export default function Reveal({ children, as = 'div', delay = 0, className = '', y = 26, once = true }) {
  const MotionTag = motion[as] || motion.div;
  const reduceMotion = useReducedMotion();

  return (
    <MotionTag
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ ...viewportOnce, once }}
      transition={{ duration: reduceMotion ? 0.2 : 0.85, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({ children, className = '', gap = 0.08, delay = 0, as = 'div' }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({ children, className = '', as = 'div' }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag className={className} variants={fadeUp}>
      {children}
    </MotionTag>
  );
}

/**
 * Word-by-word headline reveal, with the accent phrase set in italic.
 *
 * Matching runs through `accentWords`, which is punctuation-insensitive and
 * understands multi-word phrases — so "Your Family" italicises as a unit and
 * a heading ending in "Smiles." still matches the accent word "Smiles".
 */
export function RevealWords({ text, className = '', delay = 0, italicWord }) {
  const reduceMotion = useReducedMotion();
  const words = accentWords(text, italicWord);

  if (reduceMotion) {
    return (
      <span className={`inline-block ${className}`}>
        {words.map((entry, i) => (
          <span key={`${entry.word}-${i}`} className={entry.accent ? 'italic text-accent' : ''}>
            {entry.word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger(0.055, delay)}
    >
      {words.map((entry, i) => (
        <span key={`${entry.word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${entry.accent ? 'italic text-accent' : ''}`}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            {entry.word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
