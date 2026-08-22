'use client';

/**
 * iOS motion language.
 *
 * Apple's interface motion is built on two things: springs rather than
 * fixed-duration easing, and a single asymmetric curve for anything that
 * slides. Both are reproduced here so every animation on the site shares one
 * physical vocabulary instead of a pile of one-off transitions.
 *
 * Components pair these with `useCalmMotion()`; the CSS media query in
 * globals.css cannot reach transforms driven from JavaScript.
 *
 * There is deliberately no parallax vocabulary here. Nothing on this site
 * moves at a different rate to the page, and no photograph tracks the pointer:
 * images stay where the eye left them.
 */

/* The curve UIKit uses for sheet presentation and navigation pushes. */
export const IOS_EASE = [0.32, 0.72, 0, 1];
/* The softer curve used for content settling into place. */
export const IOS_SOFT = [0.16, 1, 0.3, 1];

export const spring = {
  /* Interface chrome: sharp, barely any overshoot. */
  snappy: { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 },
  /* Content entering the viewport. */
  gentle: { type: 'spring', stiffness: 180, damping: 26, mass: 1 },
  /* Sheets and modals lifting from the bottom edge. */
  sheet: { type: 'spring', stiffness: 300, damping: 34, mass: 1.1 }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: IOS_SOFT } }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: IOS_SOFT } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: IOS_SOFT } }
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } }
});

/* Route change. Enter only — see components/layout/PageTransition.jsx. */
export const pagePush = {
  initial: { opacity: 0, y: 12, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: IOS_EASE } }
};

/* The press feedback on every tappable surface in iOS. */
export const tap = { scale: 0.965, transition: { duration: 0.12, ease: IOS_EASE } };

export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -80px 0px' };
