/**
 * How each kind of detail page lays out its full-screen hero photograph.
 *
 * Shared by the heroes themselves and by the card zoom (lib/morph.js), so a
 * zooming card lands exactly where the page's photograph will be — same box,
 * same crop — and the hand-over from card to page is invisible.
 *
 *   split  on a desktop the photograph takes the right-hand side
 *   focus  CSS object-position of the photograph
 */
export const STANDARD_HERO = { split: false, focus: 'center' };
export const DOCTOR_HERO = { split: true, focus: 'center 18%' };

/** The hero layout of the page at `href`. */
export function heroFor(href = '') {
  return String(href).startsWith('/team/') ? DOCTOR_HERO : STANDARD_HERO;
}

/* The split hero's photograph starts here on a desktop (globals.css:
   .detail-hero[data-split] .detail-hero-media). */
export const SPLIT_FROM = 0.38;
export const SPLIT_MIN_WIDTH = 1024;

/* The hero's height (globals.css: .detail-hero). */
export const HERO_MIN_HEIGHT = 600;
export const HERO_MAX_HEIGHT = 980;
