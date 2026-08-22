'use client';

import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';
import { accentWords } from '@/lib/format';
import { useCalmMotion } from '@/lib/hooks';

/**
 * Scroll-triggered entrance. Content rises, unblurs and settles once.
 *
 * When motion is held back — the visitor asked for reduced motion, or the page
 * was opened with `?nomotion` — these render as plain elements with no
 * animation at all. Not a faster fade: none. Someone who has asked their
 * operating system for less movement should get the content immediately, and
 * a fade from zero opacity is still movement waiting to happen.
 */
export default function Reveal({ children, as = 'div', delay = 0, className = '', y = 26, once = true }) {
  const calm = useCalmMotion();
  const Tag = as;
  const MotionTag = motion[as] || motion.div;

  if (calm) return <Tag className={className}>{children}</Tag>;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ ...viewportOnce, once }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({ children, className = '', gap = 0.08, delay = 0, as = 'div' }) {
  const calm = useCalmMotion();
  const Tag = as;
  const MotionTag = motion[as] || motion.div;

  if (calm) return <Tag className={className}>{children}</Tag>;

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
  const calm = useCalmMotion();
  const Tag = as;
  const MotionTag = motion[as] || motion.div;

  if (calm) return <Tag className={className}>{children}</Tag>;

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
 * understands multi-word phrases — so "Your Family" italicises as a unit and a
 * heading ending in "Smiles." still matches the accent word "Smiles".
 */
export function RevealWords({ text, className = '', delay = 0, italicWord }) {
  const calm = useCalmMotion();
  const words = accentWords(text, italicWord);

  if (calm) {
    return (
      <span className={`inline-block ${className}`}>
        {words.map((entry, i) => (
          <span key={`${entry.word}-${i}`} className={entry.accent ? 'italic text-accent' : ''}>
            {entry.word}
            {i < words.length - 1 ? '\u00A0' : ''}
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
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
