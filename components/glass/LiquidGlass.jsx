'use client';

/**
 * LiquidGlass — a surface that refracts the page behind it.
 *
 * A port of the QuickLocal team chat's GlassPane. On the server, and in every
 * browser that cannot refract, it renders the frosted material from
 * globals.css (`.lg`): tint, backdrop blur, saturation and the two-edge rim
 * light. In Chromium, once mounted, it measures itself, fetches a displacement
 * map for its exact size from a shared cache, and upgrades to
 * `backdrop-filter: url(#filter)` — real refraction with dispersion.
 *
 * The first client render is identical to the server render (no map yet), so
 * hydration can never disagree; the upgrade is an ordinary state change.
 *
 *   radius       corner radius in px; 999 makes a capsule
 *   strength     'soft' for bars with text, 'full' for panes over photographs
 *   tone         'light' | 'dark' — which tint and rim the fallback uses
 *   elevation    'flat' | 'raised' | 'float'
 *   interactive  lenses harder under the pointer and when pressed, on a spring
 *   lazy         refract only while on screen (for in-page surfaces)
 */
import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import GlassFilter from './GlassFilter';
import { generateDisplacementMap, supportsBackdropRefraction } from '@/lib/glass/liquidGlass';
import { GLASS, opticsFor } from '@/lib/glass/settings';
import { Spring } from '@/lib/glass/liquidMotion';

/* ---------- shared map cache ---------- */

const MAX_CACHED = 64;
const FRAME_BUDGET_MS = 7;
const cache = new Map();
const waiting = new Map();
const queue = [];
let scheduled = false;

function remember(key, map) {
  cache.set(key, map);
  while (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value);
}

function deliver(key, map) {
  const subs = waiting.get(key);
  waiting.delete(key);
  subs?.forEach((fn) => fn(map));
}

function pump() {
  scheduled = false;
  const start = performance.now();
  while (queue.length && performance.now() - start < FRAME_BUDGET_MS) {
    const job = queue.shift();
    if (!waiting.has(job.key)) continue;
    const hit = cache.get(job.key);
    if (hit) {
      deliver(job.key, hit);
      continue;
    }
    const map = generateDisplacementMap({ width: job.w, height: job.h, ...job.optics, specularAngle: -90, superSample: 1 });
    remember(job.key, map);
    /* Decoded before it is handed out, or the first frame paints unfiltered. */
    const img = new Image();
    img.src = map.url;
    img.decode().then(
      () => deliver(job.key, map),
      () => deliver(job.key, map)
    );
  }
  if (queue.length) schedule();
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(pump);
}

function requestMap(key, w, h, optics, cb) {
  const hit = cache.get(key);
  if (hit) {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) cb(hit);
    });
    return () => {
      cancelled = true;
    };
  }
  let subs = waiting.get(key);
  if (!subs) {
    subs = new Set();
    waiting.set(key, subs);
    queue.push({ key, w, h, optics });
    schedule();
  }
  subs.add(cb);
  return () => {
    const s = waiting.get(key);
    s?.delete(cb);
    if (s && s.size === 0) waiting.delete(key);
  };
}

/* ---------- the surface ---------- */

/* Literal class names, so Tailwind's content scan keeps every variant. */
const TONES = { light: 'lg-light', dark: 'lg-dark' };
const ELEVATIONS = { flat: 'lg-flat', raised: 'lg-raised', float: 'lg-float' };

const LiquidGlass = forwardRef(function LiquidGlass(
  {
    as: Tag = 'div',
    radius = 24,
    strength = 'soft',
    tone = 'light',
    elevation = 'raised',
    blur = 1.6,
    saturation = 1.25,
    interactive = false,
    lazy = false,
    className = '',
    style,
    children,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    ...rest
  },
  forwardedRef
) {
  const hostRef = useRef(null);
  const [refracts, setRefracts] = useState(false);
  const [box, setBox] = useState(null);
  const [visible, setVisible] = useState(!lazy);
  const [map, setMap] = useState(null);
  const filterId = `lg${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const setRefs = useCallback(
    (node) => {
      hostRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  /* Capability is read after mount so the server and first client render match. */
  useEffect(() => {
    setRefracts(supportsBackdropRefraction());
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !refracts) return undefined;
    const measure = () => {
      const w = Math.max(1, Math.round(el.offsetWidth));
      const h = Math.max(1, Math.round(el.offsetHeight));
      setBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    let frame = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [refracts]);

  useEffect(() => {
    const el = hostRef.current;
    if (!lazy || !el || !refracts) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setVisible(entry.isIntersecting)),
      { rootMargin: '160px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, refracts]);

  /* Maps are cached on an 8 × 4 px grid — the stretch is invisible. */
  const qw = box ? Math.max(8, Math.ceil(box.w / 8) * 8) : 0;
  const qh = box ? Math.max(4, Math.ceil(box.h / 4) * 4) : 0;
  const optics = box ? opticsFor(strength, Math.min(radius, box.h / 2, box.w / 2)) : null;
  const key = optics
    ? `${qw}x${qh}|${optics.radius.toFixed(1)}|${optics.depth}|${optics.thickness}|${optics.softness}|${optics.profile}`
    : '';

  useEffect(() => {
    if (!refracts || !visible || !optics || !key) return undefined;
    return requestMap(key, qw, qh, optics, (m) => setMap({ key, map: m }));
    // optics derives from key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refracts, visible, key]);

  const live = refracts && visible && box && map && map.key === key ? map.map : null;

  /* ---- flex: lens harder under the pointer, on a spring ---- */
  const lens = useRef(null);
  const lensFrame = useRef(0);
  const hovering = useRef(false);
  useEffect(() => () => cancelAnimationFrame(lensFrame.current), []);

  function flex(target) {
    if (!interactive || !live) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const spring = lens.current ?? (lens.current = new Spring(GLASS.response, GLASS.damping, 1));
    spring.target = target;
    if (lensFrame.current) return;
    const base = live.scale;
    let last = performance.now();
    const tick = (now) => {
      spring.step((now - last) / 1000);
      last = now;
      const nodes = document.getElementById(filterId)?.querySelectorAll('feDisplacementMap');
      nodes?.forEach((node) => node.setAttribute('scale', String(base * spring.x * Number(node.dataset.chroma || 1))));
      if (spring.settled(0.002)) {
        spring.snap(spring.target);
        lensFrame.current = 0;
        return;
      }
      lensFrame.current = requestAnimationFrame(tick);
    };
    lensFrame.current = requestAnimationFrame(tick);
  }

  const lensing = 1 + GLASS.lensing;

  return (
    <Tag
      {...rest}
      ref={setRefs}
      className={`lg ${TONES[tone] || TONES.light} ${ELEVATIONS[elevation] || ELEVATIONS.raised} ${className}`}
      data-lg-live={live ? '' : undefined}
      onPointerEnter={(e) => {
        hovering.current = true;
        flex(1 + (lensing - 1) * 0.6);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        hovering.current = false;
        flex(1);
        onPointerLeave?.(e);
      }}
      onPointerDown={(e) => {
        flex(lensing * 1.25);
        onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        flex(hovering.current ? 1 + (lensing - 1) * 0.6 : 1);
        onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        flex(1);
        onPointerCancel?.(e);
      }}
      style={{
        '--lg-radius': `${radius}px`,
        ...(live ? { backdropFilter: `url(#${filterId})`, WebkitBackdropFilter: `url(#${filterId})` } : null),
        ...style
      }}
    >
      {live && box ? (
        <GlassFilter
          id={filterId}
          map={live}
          width={box.w}
          height={box.h}
          dispersion={strength === 'soft' ? GLASS.dispersion * 0.5 : GLASS.dispersion}
          blur={blur}
          saturation={saturation}
        />
      ) : null}
      {children}
    </Tag>
  );
});

export default LiquidGlass;
