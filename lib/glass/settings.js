/**
 * The site's glass, tuned once.
 *
 * These are the QuickLocal console's signed-off optics (GLASS_DEFAULTS in its
 * glassSettings.ts), so a surface here and a surface in the console are the
 * same material. The console exposes them as admin sliders; a public website
 * has no reason to, so they are constants.
 */
export const GLASS = {
  depth: 40,
  thickness: 43,
  ior: 1.72,
  softness: 0,
  dispersion: 1,
  specular: 1,
  profile: 'squircle',
  /* Motion: a touch slower than SwiftUI's .interactiveSpring (0.15 / 0.86). */
  response: 0.34,
  damping: 0.82,
  /* How much harder the glass lenses while it is pressed. */
  lensing: 0.4
};

/**
 * 'soft' keeps the bend in a shallow rim — right for bars and chips with text
 * on them. 'full' uses the optics as tuned, for large panes over photography.
 */
export function opticsFor(strength, radius) {
  const soft = strength === 'soft';
  return {
    radius,
    depth: soft ? Math.min(GLASS.depth, 12) : GLASS.depth,
    thickness: soft ? Math.min(GLASS.thickness, 22) : GLASS.thickness,
    ior: GLASS.ior,
    softness: soft ? Math.max(GLASS.softness, 0.3) : GLASS.softness,
    specular: GLASS.specular,
    profile: GLASS.profile
  };
}
