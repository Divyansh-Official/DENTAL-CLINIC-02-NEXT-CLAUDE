/**
 * Motion vocabulary.
 *
 * All motion on the site is CSS: springs sampled into `linear()` curves (the
 * same SwiftUI .bouncy / .snappy / .smooth step responses the QuickLocal
 * console uses), scroll-driven reveals, and load-time entrances. The curves
 * live in app/globals.css as custom properties; these constants mirror their
 * durations for the few places JavaScript has to wait for an animation, such
 * as a sheet finishing its exit before the dialog closes.
 *
 * Nothing on the site is hidden waiting for JavaScript. With scripts blocked,
 * reduced motion, or `?nomotion`, every element renders in its final state.
 */
export const DURATION = {
  bouncy: 812,
  snappy: 576,
  smooth: 649,
  exit: 260
};

/** Stagger helper for load-time entrances: `style={enterDelay(2)}`. */
export const enterDelay = (index, step = 70, base = 0) => ({ '--d': base + index * step });
