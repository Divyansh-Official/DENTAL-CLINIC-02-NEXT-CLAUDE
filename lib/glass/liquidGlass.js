/**
 * Liquid glass — refraction maps.
 *
 * Ported from the QuickLocal admin console's team-chat glass, so the clinic
 * site and the console share one material. This is not a blur with a white
 * border: a vertical light ray is traced through a curved glass bezel with
 * Snell's law, the landing offset is baked into a PNG, and an SVG
 * feDisplacementMap uses that PNG to bend whatever sits behind the surface.
 *
 *   n1·sin(θ1) = n2·sin(θ2)      n1 = 1 (air), n2 = ior
 *   d = h · tan(θ1 − θ2)         h = glass height at that point
 *
 * Refraction only shows where the backdrop has structure — a photograph, a
 * gradient, text scrolling underneath. Over a flat fill only the rim light
 * survives, which is why the site puts its refracting surfaces over imagery
 * and over the page as it scrolls.
 *
 * Only Chromium resolves an SVG filter inside `backdrop-filter`
 * (w3c/svgwg#1142). Everywhere else the surface keeps the frosted CSS
 * fallback defined in globals.css (`.lg`): tint, blur, saturation and rims.
 */

const DEFAULT_LENS = {
  width: 200,
  height: 34,
  radius: 8,
  depth: 10,
  thickness: 14,
  ior: 1.5,
  profile: 'squircle',
  softness: 0.35,
  specular: 0.3,
  specularAngle: -90,
  superSample: 2
};

/* ---------- surface ---------- */

/** Shoulder cross-section at normalised distance x in from the outer edge. */
function rawHeight(x, profile) {
  switch (profile) {
    case 'convex':
      return Math.sqrt(Math.max(0, 1 - (1 - x) ** 2));
    case 'concave':
      return 1 - Math.sqrt(Math.max(0, 1 - (1 - x) ** 2));
    case 'lip': {
      const convex = Math.sqrt(Math.max(0, 1 - (1 - x) ** 2));
      const s = x * x * x * (x * (x * 6 - 15) + 10);
      return convex * (1 - s) + (1 - convex) * s;
    }
    /* Apple's squircle: the quartic superellipse keeps the refraction gradient
       continuous when the lens is stretched into a wide capsule. */
    default:
      return Math.max(0, 1 - (1 - x) ** 4) ** 0.25;
  }
}

function surfaceHeight(t, softness, profile) {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  const base = rawHeight(x, profile);
  if (softness <= 0) return base;
  const line = rawHeight(0, profile) * (1 - x) + rawHeight(1, profile) * x;
  return base * (1 - softness) + line * softness;
}

/** Signed distance to a rounded rectangle centred on the origin. Negative inside. */
function sdRoundedRect(px, py, halfW, halfH, r) {
  const qx = Math.abs(px) - halfW + r;
  const qy = Math.abs(py) - halfH + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/** Outward unit normal, solved analytically so the corner arc has no seam. */
function outwardNormal(px, py, halfW, halfH, r) {
  const qx = Math.abs(px) - halfW + r;
  const qy = Math.abs(py) - halfH + r;
  const sx = px < 0 ? -1 : 1;
  const sy = py < 0 ? -1 : 1;
  if (qx > 0 && qy > 0) {
    const len = Math.hypot(qx, qy) || 1;
    return [(qx / len) * sx, (qy / len) * sy];
  }
  return qx > qy ? [sx, 0] : [0, sy];
}

/* ---------- map generation ---------- */

/**
 * Build the displacement PNG.
 *   R → x sampling offset (128 neutral)
 *   G → y sampling offset (128 neutral)
 *   B → baked Fresnel rim light
 *   A → always opaque; the silhouette is the element's CSS border-radius.
 */
export function generateDisplacementMap(geometry = {}) {
  const g = { ...DEFAULT_LENS, ...geometry };

  const ss = Math.max(1, Math.round(g.superSample));
  const W = Math.max(1, Math.round(g.width));
  const H = Math.max(1, Math.round(g.height));
  const mapW = W * ss;
  const mapH = H * ss;

  const halfW = W / 2;
  const halfH = H / 2;
  const radius = Math.min(g.radius, halfW, halfH);
  const depth = Math.max(1, Math.min(g.depth, halfW, halfH));

  const lightRad = (g.specularAngle * Math.PI) / 180;
  const lx = Math.cos(lightRad);
  const ly = Math.sin(lightRad);

  /* Pass 1 — the bend depends only on distance from the edge, so one ray
     solved along a single radius serves every pixel. */
  const N = 256;
  const dispLUT = new Float64Array(N);
  const specLUT = new Float64Array(N);
  const dt = 1 / (N - 1);
  const eps = dt * 0.5;
  let peak = 0;

  for (let i = 0; i < N; i++) {
    const t = i * dt;
    const h = surfaceHeight(t, g.softness, g.profile) * g.thickness;
    const hA = surfaceHeight(t - eps, g.softness, g.profile) * g.thickness;
    const hB = surfaceHeight(t + eps, g.softness, g.profile) * g.thickness;
    const slope = (hB - hA) / (2 * eps * depth);

    const theta1 = Math.atan(Math.abs(slope));
    const theta2 = Math.asin(Math.min(1, Math.sin(theta1) / g.ior));
    const bend = h * Math.tan(theta1 - theta2);
    dispLUT[i] = slope >= 0 ? bend : -bend;
    if (Math.abs(dispLUT[i]) > peak) peak = Math.abs(dispLUT[i]);

    /* Reflectance climbs toward grazing incidence: glass lights up at its rim. */
    specLUT[i] = (1 - Math.cos(theta1)) ** 5;
  }
  if (peak < 1e-6) peak = 1e-6;

  /* Pass 2 — rasterise one quadrant and mirror the other three. */
  const canvas = document.createElement('canvas');
  canvas.width = mapW;
  canvas.height = mapH;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(mapW, mapH);
  const data = img.data;

  const write = (x, y, ox, oy, sp) => {
    const idx = (y * mapW + x) * 4;
    data[idx] = 128 + Math.max(-127, Math.min(127, (ox / peak) * 127));
    data[idx + 1] = 128 + Math.max(-127, Math.min(127, (oy / peak) * 127));
    data[idx + 2] = Math.max(0, Math.min(255, sp * 255));
    data[idx + 3] = 255;
  };

  const qw = Math.ceil(mapW / 2);
  const qh = Math.ceil(mapH / 2);

  for (let y = 0; y < qh; y++) {
    const py = (y + 0.5) / ss - halfH;
    for (let x = 0; x < qw; x++) {
      const px = (x + 0.5) / ss - halfW;
      const distFromEdge = -sdRoundedRect(px, py, halfW, halfH, radius);
      const mx = mapW - 1 - x;
      const my = mapH - 1 - y;

      if (distFromEdge <= 0) {
        write(x, y, 0, 0, 0);
        if (mx !== x) write(mx, y, 0, 0, 0);
        if (my !== y) write(x, my, 0, 0, 0);
        if (mx !== x && my !== y) write(mx, my, 0, 0, 0);
        continue;
      }

      const t = Math.min(1, distFromEdge / depth);
      const fi = t * (N - 1);
      const i0 = Math.floor(fi);
      const i1 = Math.min(N - 1, i0 + 1);
      const f = fi - i0;
      const d = dispLUT[i0] * (1 - f) + dispLUT[i1] * f;
      const fres = specLUT[i0] * (1 - f) + specLUT[i1] * f;

      const [nx, ny] = outwardNormal(px, py, halfW, halfH, radius);

      /* A converging surface pulls rays toward the thick centre, so the
         sample offset points inward — the magnified core and compressed rim
         band that make Apple's glass recognisable. */
      const ox = -nx * d;
      const oy = -ny * d;
      const lit = (ax, ay) => fres * Math.max(0, nx * ax * lx + ny * ay * ly) * g.specular;

      write(x, y, ox, oy, lit(1, 1));
      if (mx !== x) write(mx, y, -ox, oy, lit(-1, 1));
      if (my !== y) write(x, my, ox, -oy, lit(1, -1));
      if (mx !== x && my !== y) write(mx, my, -ox, -oy, lit(-1, -1));
    }
  }

  ctx.putImageData(img, 0, 0);

  return {
    url: canvas.toDataURL('image/png'),
    mapWidth: mapW,
    mapHeight: mapH,
    /* feDisplacementMap maps a channel value c to scale·(c/255 − 0.5); this
       makes the rendered shift equal the traced physical shift. */
    scale: peak * (255 / 127),
    peak
  };
}

/* ---------- capability ---------- */

/**
 * Can this engine resolve an SVG filter inside backdrop-filter? Only
 * Chromium can. navigator.vendor identifies the engine rather than the
 * marketing name, so iOS Chrome and in-app WebKit views are correctly
 * treated as WebKit.
 */
export function supportsBackdropRefraction() {
  if (typeof window === 'undefined') return false;
  if (!window.CSS?.supports?.('backdrop-filter', 'blur(1px)')) return false;
  if (window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches) return false;
  const isWebKit = navigator.vendor === 'Apple Computer, Inc.';
  const isGecko = 'MozAppearance' in document.documentElement.style;
  return !isWebKit && !isGecko;
}

/** Filter subregions in objectBoundingBox units are misplaced on iOS. */
export const FILTER_UNITS = 'userSpaceOnUse';

/** How far the filter region reaches past the element, so the blur keeps its rim. */
export const LENS_BLEED = 16;
