/**
 * Card ↔ page "zoom" transitions, in the manner of the App Store's Today
 * cards: the card you tap grows out of its exact place on the screen into the
 * page it opens, and the page's content settles in once it lands. Closing
 * runs the same motion backwards into the card you came from.
 *
 * Page to page (expand / collapse) it is a layer of the page's own pixels —
 * the card's photograph and a copy of the card — animated in a fixed overlay
 * that sits *beneath* the header. The header, the tab bar and every other
 * piece of chrome are never captured, covered or redrawn: they stay exactly
 * where they are, live, through every navigation. The new page renders under
 * the overlay; once it has painted (and its photograph has decoded) the
 * overlay settles onto the page's hero (`[data-morph-target]`) and fades away.
 *
 * Within one page (the gallery lightbox) and for filtered grids it uses the
 * View Transitions API, where nothing but the grid or the photo changes.
 *
 * Reduced motion and ?nomotion fall straight through to an ordinary
 * navigation. Nothing here ever blocks one: if the new page has not arrived
 * within 2.5s the overlay simply fades and the navigation finishes on its own.
 */
import { prefersCalm } from '@/lib/hooks';

const GIVE_UP_MS = 2500;
const GROW_MS = 560;
const NAVIGATE_AT = 0.55;
const SETTLE_MS = 220;
const FADE_MS = 320;
const IMAGE_WAIT_MS = 900;
/* Long enough for the destination's entrances to finish before their extra
   arrival delay is withdrawn. */
const ARRIVAL_MS = 2200;

const state = {
  pending: null,
  current: null,
  /* The detail page reached by the last expand, and the page it opened from:
     closing it can then step back in history instead of pushing a new entry. */
  opened: null,
  scroll: new Map(),
  layer: null,
  startedAt: 0,
  arrivalTimer: 0
};

/* One zoom at a time: a second tap while one is in flight is ignored (a
   zoom left over by an error is cleared after a few seconds). */
function busy() {
  return Boolean(state.layer) && performance.now() - state.startedAt < 4000;
}

const root = () => document.documentElement;
const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** Page-to-page zoom: any browser with Web Animations, unless motion is reduced. */
export function canAnimate() {
  return typeof document !== 'undefined' && typeof Element.prototype.animate === 'function' && !prefersCalm();
}

/** In-page transitions (lightbox, filters) also need View Transitions. */
export function canMorph() {
  return canAnimate() && typeof document.startViewTransition === 'function';
}

/** The morphing surface of a card: its `[data-morph-source]`, or the card itself. */
export function morphSurface(card) {
  return card?.querySelector?.('[data-morph-source]') || card || null;
}

/** True while a zoom is running — page-level entrances stand aside for it. */
export function isMorphing() {
  return typeof document !== 'undefined' && root().hasAttribute('data-morph');
}

function inViewport(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth && rect.width > 0;
}

/* ---------- the overlay ---------- */

let easing = null;
function spring() {
  if (easing === null) {
    easing = getComputedStyle(root()).getPropertyValue('--spring-snappy').trim() || 'cubic-bezier(0.32, 0.72, 0, 1)';
  }
  return easing;
}

/* linear() easing is recent; an engine that rejects it gets the iOS curve. */
function animate(element, keyframes, options) {
  try {
    return element.animate(keyframes, options);
  } catch {
    return element.animate(keyframes, { ...options, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
  }
}

const box = (rect) => ({ top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, height: `${rect.height}px` });

function viewport() {
  return { top: 0, left: 0, width: document.documentElement.clientWidth, height: window.innerHeight };
}

function photoOf(element) {
  const img = element?.querySelector?.('img');
  if (!img) return null;
  return { src: img.currentSrc || img.src, position: getComputedStyle(img).objectPosition };
}

/* A copy of the card as it stands, without ids, for the first and last frames. */
function copyOf(element, rect) {
  const copy = element.cloneNode(true);
  copy.removeAttribute('id');
  copy.removeAttribute('data-morph-key');
  copy.querySelectorAll('[id], [data-morph-key]').forEach((node) => {
    node.removeAttribute('id');
    node.removeAttribute('data-morph-key');
  });
  copy.classList.add('morph-copy');
  copy.style.width = `${rect.width}px`;
  copy.style.height = `${rect.height}px`;
  return copy;
}

function removeLayer() {
  state.layer?.layer.remove();
  state.layer = null;
}

function buildLayer({ rect, radius, photo, copy }) {
  removeLayer();
  const layer = document.createElement('div');
  layer.className = 'morph-layer';
  layer.setAttribute('aria-hidden', 'true');

  const dim = document.createElement('div');
  dim.className = 'morph-dim';

  const surface = document.createElement('div');
  surface.className = 'morph-surface';
  Object.assign(surface.style, box(rect), { borderRadius: radius });

  let image = null;
  if (photo?.src) {
    image = document.createElement('img');
    image.className = 'morph-photo';
    image.alt = '';
    image.decoding = 'sync';
    image.src = photo.src;
    image.style.objectPosition = photo.position;
    surface.append(image);
  }

  const shade = document.createElement('div');
  shade.className = 'morph-shade';
  surface.append(shade);
  if (copy) surface.append(copy);

  layer.append(dim, surface);
  document.body.append(layer);
  state.layer = { layer, dim, surface, image, shade, copy };
  state.startedAt = performance.now();
  return state.layer;
}

/* Where the hero's photograph sits inside the hero (a split portrait hero
   keeps it on the right on a desktop). */
function mediaBox(target) {
  const media = target?.querySelector('.detail-hero-media');
  if (!media) return null;
  const outer = target.getBoundingClientRect();
  const inner = media.getBoundingClientRect();
  return { top: inner.top - outer.top, left: inner.left - outer.left, width: inner.width, height: inner.height };
}

async function imageReady(target) {
  const img = target?.querySelector('.detail-hero-media img');
  if (!img || (img.complete && img.naturalWidth)) return;
  await Promise.race([img.decode().catch(() => {}), sleep(IMAGE_WAIT_MS)]);
}

function settle() {
  const pending = state.pending;
  if (!pending) return;
  state.pending = null;
  window.clearTimeout(pending.timer);
  pending.resolve();
}

function waitForRoute(entry) {
  return new Promise((resolve) => {
    state.pending = { ...entry, resolve, timer: window.setTimeout(settle, GIVE_UP_MS) };
  });
}

/* Tells the header what is under it while a zoom covers it (it cannot see
   the overlay, which takes no pointer events), and to look again after. */
function announce(detail) {
  window.dispatchEvent(new CustomEvent('morphchange', { detail }));
}

function finish() {
  removeLayer();
  root().removeAttribute('data-morph');
  announce({ phase: 'end' });
}

/* ---------- card → page ---------- */

/**
 * Card → page. `go` performs the navigation (router.push).
 */
export function expand({ source, go }) {
  if (busy()) return;
  if (!canAnimate() || !source) {
    go();
    return;
  }
  const from = window.location.pathname;
  state.scroll.set(from, window.scrollY);
  const rect = source.getBoundingClientRect();
  const radius = getComputedStyle(source).borderTopLeftRadius || '24px';
  const parts = buildLayer({ rect, radius, photo: photoOf(source), copy: copyOf(source, rect) });
  root().dataset.morph = 'expand';

  const grow = animate(parts.surface, [{ ...box(rect), borderRadius: radius }, { ...box(viewport()), borderRadius: '0px' }], {
    duration: GROW_MS,
    easing: spring(),
    fill: 'forwards'
  });
  animate(parts.copy, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' });
  if (parts.image) animate(parts.image, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
  animate(parts.shade, [{ opacity: 0 }, { opacity: 1 }], { duration: GROW_MS, easing: 'ease-out', fill: 'forwards' });
  animate(parts.dim, [{ opacity: 0 }, { opacity: 0.45 }], { duration: GROW_MS, easing: 'ease-out', fill: 'forwards' });

  /* Navigate once the card has nearly filled the screen, so the page beneath
     changes out of sight. The route is prefetched, so it arrives in time. */
  const arrived = sleep(GROW_MS * NAVIGATE_AT).then(() => {
    announce({ phase: 'covered', tone: 'dark' });
    const route = waitForRoute({ mode: 'expand', from });
    go();
    return route;
  });

  Promise.all([grow.finished.catch(() => {}), arrived]).then(async () => {
    if (state.layer !== parts) return;
    const target = document.querySelector('[data-morph-target]');
    if (target) {
      await imageReady(target);
      const to = target.getBoundingClientRect();
      const moves = [animate(parts.surface, [{ ...box(viewport()) }, { ...box(to) }], { duration: SETTLE_MS, easing: 'ease-out', fill: 'forwards' })];
      const media = mediaBox(target);
      if (parts.image && media) {
        moves.push(
          animate(parts.image, [{ top: '0px', left: '0px', width: `${to.width}px`, height: `${to.height}px` }, { ...box(media) }], {
            duration: SETTLE_MS,
            easing: 'ease-out',
            fill: 'forwards'
          })
        );
      }
      await Promise.all(moves.map((move) => move.finished.catch(() => {})));
    }
    if (state.layer !== parts) return;
    await animate(parts.layer, [{ opacity: 1 }, { opacity: 0 }], { duration: FADE_MS, easing: 'ease-out', fill: 'forwards' }).finished.catch(() => {});
    if (state.layer === parts) finish();
  });
}

/* ---------- page → card ---------- */

/**
 * Page → card. Steps back in history when this page was opened from a card
 * (so Back and the browser agree); otherwise opens `fallbackHref`.
 */
export function collapse({ router, fallbackHref }) {
  const here = window.location.pathname;
  const back = Boolean(state.opened && state.opened.detail === here);
  const go = () => (back ? router.back() : router.push(fallbackHref));
  const target = document.querySelector('[data-morph-target]');
  if (busy()) return;

  if (!canAnimate() || !target) {
    go();
    return;
  }

  const rect = target.getBoundingClientRect();
  const parts = buildLayer({ rect, radius: '0px', photo: photoOf(target.querySelector('.detail-hero-media')), copy: null });
  const media = mediaBox(target);
  if (parts.image && media) Object.assign(parts.image.style, box(media));
  parts.shade.style.opacity = '1';
  root().dataset.morph = 'collapse';

  /* Darken whatever of the page shows around the hero, so the swap to the
     previous page underneath is never seen. */
  const dark = animate(parts.dim, [{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: 'ease-out', fill: 'forwards' });

  dark.finished
    .catch(() => {})
    .then(() => {
      const arrived = waitForRoute({ mode: 'collapse', from: here, restore: back });
      go();
      return arrived;
    })
    .then(async () => {
      if (state.layer !== parts) return;
      announce({ phase: 'reveal' });
      const card = morphSurface(document.querySelector(`[data-morph-key="${CSS.escape(here)}"]`));
      const start = parts.surface.getBoundingClientRect();
      animate(parts.dim, [{ opacity: 1 }, { opacity: 0 }], { duration: GROW_MS, easing: 'ease-out', fill: 'forwards' });

      if (!inViewport(card)) {
        await animate(parts.surface, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.92)' }], {
          duration: FADE_MS,
          easing: 'ease-out',
          fill: 'forwards'
        }).finished.catch(() => {});
        if (state.layer === parts) finish();
        return;
      }

      const to = card.getBoundingClientRect();
      const radius = getComputedStyle(card).borderTopLeftRadius || '24px';
      const copy = copyOf(card, to);
      copy.style.opacity = '0';
      parts.surface.append(copy);

      const moves = [
        animate(parts.surface, [{ ...box(start), borderRadius: '0px' }, { ...box(to), borderRadius: radius }], {
          duration: GROW_MS,
          easing: spring(),
          fill: 'forwards'
        }),
        animate(parts.shade, [{ opacity: 1 }, { opacity: 0 }], { duration: GROW_MS * 0.6, easing: 'ease-out', fill: 'forwards' }),
        animate(copy, [{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }], { duration: GROW_MS, easing: 'ease-in', fill: 'forwards' })
      ];
      if (parts.image) {
        const from = media ? box(media) : { top: '0px', left: '0px', width: `${start.width}px`, height: `${start.height}px` };
        moves.push(
          animate(parts.image, [{ ...from }, { top: '0px', left: '0px', width: `${to.width}px`, height: `${to.height}px` }], {
            duration: GROW_MS,
            easing: spring(),
            fill: 'forwards'
          })
        );
      }
      await Promise.all(moves.map((move) => move.finished.catch(() => {})));
      if (state.layer === parts) finish();
    });
}

/**
 * Called by MorphProvider in the same commit that puts a new route on screen
 * — after Next.js has scrolled it, before the browser paints it.
 */
export function routeCommitted(pathname) {
  if (pathname === state.current) return;
  state.current = pathname;

  const pending = state.pending;
  if (!pending) return;

  if (pending.mode === 'expand') {
    state.opened = { detail: pathname, from: pending.from };
    root().dataset.morphArrived = '';
    window.clearTimeout(state.arrivalTimer);
    state.arrivalTimer = window.setTimeout(() => root().removeAttribute('data-morph-arrived'), ARRIVAL_MS);
  } else {
    if (pending.restore && state.scroll.has(pathname)) {
      window.scrollTo({ top: state.scroll.get(pathname), behavior: 'instant' });
    }
    state.opened = null;
  }
  settle();
}

/* ---------- within one page: View Transitions ---------- */

function name(element) {
  if (!element) return;
  element.style.viewTransitionName = 'morph';
  element.setAttribute('data-morph-named', '');
}

function clearNames() {
  document.querySelectorAll('[data-morph-named]').forEach((element) => {
    element.style.viewTransitionName = '';
    element.removeAttribute('data-morph-named');
  });
}

/**
 * The same zoom within one page — a gallery tile into its lightbox and back.
 * `update` must apply the change synchronously (flushSync).
 */
export function morphInPlace({ mode, source, target, update }) {
  if (!canMorph()) {
    update();
    return;
  }
  clearNames();
  root().dataset.morph = mode;
  name(source);

  const transition = document.startViewTransition(async () => {
    clearNames();
    update();
    /* Let the dialog's open/close effect run before the new state is read. */
    await sleep(0);
    root().dataset.morph = `${mode}-in`;
    const surface = typeof target === 'function' ? target() : target;
    if (inViewport(surface)) name(surface);
  });
  transition.finished
    .catch(() => {})
    .finally(() => {
      clearNames();
      root().removeAttribute('data-morph');
    });
}

/**
 * Re-flowing a filtered grid: every item marked `data-vt` (with its own
 * `--vt` name) glides to its new place. The names exist only while the
 * filter runs, so they never compete with a morph.
 */
export function filterTransition(update) {
  if (!canMorph()) {
    update();
    return;
  }
  root().dataset.filtering = '';
  const transition = document.startViewTransition(update);
  transition.finished
    .catch(() => {})
    .finally(() => root().removeAttribute('data-filtering'));
}
