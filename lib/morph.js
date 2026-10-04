/**
 * Card ↔ page "zoom" transitions, in the manner of the App Store's Today
 * cards: the card you tap grows out of its exact place on the screen into the
 * page it opens, and the page's content rises in once it lands. Closing runs
 * the same motion backwards into the card you came from.
 *
 * Page to page (expand / collapse) it is a layer of the page's own pixels —
 * the card's photograph and a copy of the card — animated in a fixed overlay
 * that sits *beneath* the header. The header, the tab bar and every other
 * piece of chrome are never captured, covered or redrawn.
 *
 * Smoothness comes from never asking the main thread for two things at once:
 *
 *   expand    the photo is decoded before the first frame; the card grows
 *             straight to the exact box and crop the page's photograph will
 *             have (lib/heroes.js), so it lands without a correction; only
 *             then does the navigation run — the new page renders under a
 *             still overlay — and once it has painted and its photograph is
 *             ready, the overlay dissolves (a compositor-only fade) as the
 *             page's text rises in.
 *   collapse  the page's text dissolves under its own photograph and the
 *             rest darkens; the navigation then runs beneath that opaque
 *             layer; once the previous page has rendered and settled, the
 *             page shrinks back into its card and hands over with a soft
 *             fade.
 *
 * Within one page (the gallery lightbox) and for filtered grids it uses the
 * View Transitions API, where nothing but the grid or the photo changes.
 *
 * Reduced motion and ?nomotion fall straight through to an ordinary
 * navigation. Nothing here ever blocks one: if the new page has not arrived
 * within 2.5s the overlay simply fades and the navigation finishes on its own.
 */
import { prefersCalm } from '@/lib/hooks';
import { HERO_MAX_HEIGHT, HERO_MIN_HEIGHT, SPLIT_FROM, SPLIT_MIN_WIDTH, heroFor } from '@/lib/heroes';

const GIVE_UP_MS = 2500;
const GROW_MS = 600;
const SHRINK_MS = 560;
const DARKEN_MS = 160;
const REVEAL_MS = 440;
const HANDOFF_MS = 160;
const IMAGE_WAIT_MS = 600;
const IDLE_WAIT_MS = 160;
/* Entrances on the new page wait for the reveal; a stalled zoom can never
   leave them waiting longer than this. */
const SAFETY_MS = 6000;
/* Long enough for the entrances (largest delay + duration) to finish. */
const ENTRANCES_MS = 1800;
const SOFT = 'cubic-bezier(0.4, 0, 0.2, 1)';

const state = {
  pending: null,
  current: null,
  /* The detail page reached by the last expand, and the page it opened from:
     closing it can then step back in history instead of pushing a new entry. */
  opened: null,
  scroll: new Map(),
  layer: null,
  startedAt: 0,
  arrivedAt: 0,
  released: true,
  arrivalTimer: 0,
  safetyTimer: 0
};

/* One zoom at a time: a second tap while one is in flight is ignored (a
   zoom left over by an error is cleared after a few seconds). */
function busy() {
  return Boolean(state.layer) && performance.now() - state.startedAt < SAFETY_MS;
}

const root = () => document.documentElement;
const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const frames = (count = 2) =>
  new Promise((resolve) => {
    const step = (left) => (left ? requestAnimationFrame(() => step(left - 1)) : resolve());
    step(count);
  });
/* Wait for the main thread to go quiet after a page render (effects, image
   decodes), so the next animation has every frame to itself. */
const idle = (timeout) =>
  new Promise((resolve) => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => resolve(), { timeout });
    else window.setTimeout(resolve, Math.min(timeout, 120));
  });

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

/* ---------- geometry ---------- */

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
const fill = (rect) => ({ top: 0, left: 0, width: rect.width, height: rect.height });
const near = (a, b) => Math.abs(a.top - b.top) < 2 && Math.abs(a.left - b.left) < 2 && Math.abs(a.width - b.width) < 2 && Math.abs(a.height - b.height) < 2;

/* 100svh, measured once: the hero is sized by it, and innerHeight is not
   the same thing on a phone whose toolbar has collapsed. */
let probe = null;
function smallViewportHeight() {
  if (!probe) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
    document.body.append(probe);
  }
  return probe.offsetHeight || window.innerHeight;
}

/** Where the page at `href` will put its hero and its photograph, before it exists. */
function heroGeometry(href) {
  const layout = heroFor(href);
  const width = document.documentElement.clientWidth;
  const height = Math.max(HERO_MIN_HEIGHT, Math.min(smallViewportHeight(), HERO_MAX_HEIGHT));
  /* The page opens scrolled to the top; anything above <main> (an
     announcement bar) pushes the hero down by its height. */
  const top = document.getElementById('main')?.offsetTop || 0;
  const split = layout.split && width >= SPLIT_MIN_WIDTH;
  const media = split ? { top: 0, left: Math.round(width * SPLIT_FROM), width: width - Math.round(width * SPLIT_FROM), height } : { top: 0, left: 0, width, height };
  return { rect: { top, left: 0, width, height }, media, split, focus: layout.focus };
}

/* Where the hero's photograph sits inside the hero. */
function mediaBox(target) {
  const media = target?.querySelector('.detail-hero-media');
  if (!media) return null;
  const outer = target.getBoundingClientRect();
  const inner = media.getBoundingClientRect();
  return { top: inner.top - outer.top, left: inner.left - outer.left, width: inner.width, height: inner.height };
}

/* ---------- the overlay ---------- */

function photoOf(element) {
  const img = element?.querySelector?.('img');
  if (!img) return null;
  return { src: img.currentSrc || img.src, position: getComputedStyle(img).objectPosition };
}

/* Start fetching the photograph at the size the new page will ask for, so it
   is in the cache by the time the page renders. */
const IMAGE_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
function preloadHero(img, media) {
  if (!img) return;
  try {
    const current = new URL(img.currentSrc || img.src, window.location.href);
    const original = current.pathname === '/_next/image' ? current.searchParams.get('url') : null;
    if (!original) return;
    const needed = media.width * (window.devicePixelRatio || 1);
    const width = IMAGE_WIDTHS.find((w) => w >= needed) || IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
    const next = new Image();
    next.decoding = 'async';
    next.src = `/_next/image?url=${encodeURIComponent(original)}&w=${width}&q=${current.searchParams.get('q') || '75'}`;
  } catch {
    /* Only an optimisation. */
  }
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

function buildLayer({ rect, radius, photo, copy, split }) {
  removeLayer();
  const layer = document.createElement('div');
  layer.className = 'morph-layer';
  layer.setAttribute('aria-hidden', 'true');

  const dim = document.createElement('div');
  dim.className = 'morph-dim';

  const surface = document.createElement('div');
  surface.className = 'morph-surface';
  if (split) surface.setAttribute('data-split', '');
  Object.assign(surface.style, box(rect), { borderRadius: radius });

  let image = null;
  if (photo?.src) {
    image = document.createElement('img');
    image.className = 'morph-photo';
    image.alt = '';
    image.decoding = 'async';
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
  window.clearTimeout(state.safetyTimer);
  state.safetyTimer = window.setTimeout(finish, SAFETY_MS);
  return state.layer;
}

/* The photograph is already decoded on the page; make sure the overlay's copy
   of it is too before the first frame, or that frame stalls on a decode. */
function decoded(image) {
  if (!image) return Promise.resolve();
  return Promise.race([image.decode().catch(() => {}), sleep(80)]);
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

/* Lets the new page's entrances go: they have been held since the page
   rendered (`--arrive` in globals.css) and now start from this moment. */
function releaseEntrances(lead = 40) {
  if (state.released || !root().hasAttribute('data-morph-arrived')) return;
  state.released = true;
  const waited = Math.max(0, performance.now() - state.arrivedAt);
  root().style.setProperty('--arrive', `${Math.round(waited + lead)}ms`);
  window.clearTimeout(state.arrivalTimer);
  state.arrivalTimer = window.setTimeout(() => {
    root().removeAttribute('data-morph-arrived');
    root().style.removeProperty('--arrive');
  }, ENTRANCES_MS + lead);
}

function finish() {
  window.clearTimeout(state.safetyTimer);
  releaseEntrances(0);
  removeLayer();
  root().removeAttribute('data-morph');
  announce({ phase: 'end' });
}

/* ---------- card → page ---------- */

/**
 * Card → page. `go` performs the navigation (router.push to `href`).
 */
export function expand({ source, href, go }) {
  if (busy()) return;
  if (!canAnimate() || !source) {
    go();
    return;
  }
  const from = window.location.pathname;
  state.scroll.set(from, window.scrollY);

  const rect = source.getBoundingClientRect();
  const radius = getComputedStyle(source).borderTopLeftRadius || '24px';
  const hero = heroGeometry(href);
  const photo = photoOf(source);
  preloadHero(source.querySelector('img'), hero.media);

  const parts = buildLayer({ rect, radius, photo, copy: copyOf(source, rect), split: hero.split });
  root().dataset.morph = 'expand';

  decoded(parts.image).then(async () => {
    if (state.layer !== parts) return;

    const grow = animate(parts.surface, [{ ...box(rect), borderRadius: radius }, { ...box(hero.rect), borderRadius: '0px' }], {
      duration: GROW_MS,
      easing: spring(),
      fill: 'forwards'
    });
    if (parts.image) {
      animate(
        parts.image,
        [
          { ...box(fill(rect)), objectPosition: photo.position },
          { ...box(hero.media), objectPosition: hero.focus }
        ],
        { duration: GROW_MS, easing: spring(), fill: 'forwards' }
      );
      animate(parts.image, [{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out', fill: 'forwards' });
    }
    animate(parts.copy, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out', fill: 'forwards' });
    animate(parts.shade, [{ opacity: 0 }, { opacity: 1 }], { duration: GROW_MS, easing: SOFT, fill: 'forwards' });
    animate(parts.dim, [{ opacity: 0 }, { opacity: 0.5 }], { duration: GROW_MS, easing: SOFT, fill: 'forwards' });
    window.setTimeout(() => announce({ phase: 'covered', tone: 'dark' }), GROW_MS * 0.45);

    await grow.finished.catch(() => {});
    if (state.layer !== parts) return;

    /* The card now fills the hero's box, holding still: render the page. */
    const arrived = waitForRoute({ mode: 'expand', from });
    go();
    await arrived;
    /* Once it has painted, the reveal can start at once: it is a fade on the
       compositor, smooth however busy the page still is settling in. */
    await frames(2);
    if (state.layer !== parts) return;

    const target = document.querySelector('[data-morph-target]');
    if (target) {
      await imageReady(target);
      /* Only if the page did not open where it was expected (an unusual
         toolbar, say) does the overlay glide to it. */
      const to = target.getBoundingClientRect();
      if (!near(to, hero.rect)) {
        const moves = [animate(parts.surface, [{ ...box(hero.rect) }, { ...box(to) }], { duration: 260, easing: SOFT, fill: 'forwards' })];
        const media = mediaBox(target);
        if (parts.image && media) {
          moves.push(animate(parts.image, [{ ...box(hero.media) }, { ...box(media) }], { duration: 260, easing: SOFT, fill: 'forwards' }));
        }
        await Promise.all(moves.map((move) => move.finished.catch(() => {})));
      }
    }
    if (state.layer !== parts) return;

    releaseEntrances();
    await animate(parts.layer, [{ opacity: 1 }, { opacity: 0 }], { duration: REVEAL_MS, easing: SOFT, fill: 'forwards' }).finished.catch(() => {});
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
  const split = target.hasAttribute('data-split') && document.documentElement.clientWidth >= SPLIT_MIN_WIDTH;
  const media = mediaBox(target) || fill(rect);
  const parts = buildLayer({ rect, radius: '0px', photo: photoOf(target.querySelector('.detail-hero-media')), copy: null, split });
  if (parts.image) Object.assign(parts.image.style, box(media));
  parts.shade.style.opacity = '1';
  parts.surface.style.opacity = '0';
  root().dataset.morph = 'collapse';

  decoded(parts.image).then(async () => {
    if (state.layer !== parts) return;

    /* The overlay — the hero's own photograph — fades in over the hero, so
       its text dissolves rather than vanishing, while whatever of the page
       shows around it darkens. Only once both are opaque does the previous
       page render underneath, so the swap is never seen. */
    const cover = animate(parts.surface, [{ opacity: 0 }, { opacity: 1 }], { duration: DARKEN_MS, easing: 'ease-out', fill: 'forwards' });
    const dark = animate(parts.dim, [{ opacity: 0 }, { opacity: 1 }], { duration: DARKEN_MS, easing: 'ease-out', fill: 'forwards' });
    await Promise.all([cover.finished.catch(() => {}), dark.finished.catch(() => {})]);
    if (state.layer !== parts) return;
    const arrived = waitForRoute({ mode: 'collapse', from: here, restore: back });
    go();
    await arrived;
    await frames(2);
    await idle(IDLE_WAIT_MS);
    if (state.layer !== parts) return;

    announce({ phase: 'reveal' });
    const card = morphSurface(document.querySelector(`[data-morph-key="${CSS.escape(here)}"]`));
    animate(parts.dim, [{ opacity: 1 }, { opacity: 0 }], { duration: SHRINK_MS, easing: SOFT, fill: 'forwards' });

    if (!inViewport(card)) {
      await animate(parts.surface, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.94)' }], {
        duration: REVEAL_MS,
        easing: SOFT,
        fill: 'forwards'
      }).finished.catch(() => {});
      if (state.layer === parts) finish();
      return;
    }

    const to = card.getBoundingClientRect();
    const radius = getComputedStyle(card).borderTopLeftRadius || '24px';
    const cardPhoto = photoOf(card);
    const copy = copyOf(card, to);
    copy.style.opacity = '0';
    parts.surface.append(copy);

    const moves = [
      animate(parts.surface, [{ ...box(rect), borderRadius: '0px' }, { ...box(to), borderRadius: radius }], {
        duration: SHRINK_MS,
        easing: spring(),
        fill: 'forwards'
      }),
      animate(parts.shade, [{ opacity: 1 }, { opacity: 0 }], { duration: SHRINK_MS * 0.6, easing: SOFT, fill: 'forwards' }),
      animate(copy, [{ opacity: 0 }, { opacity: 0, offset: 0.4 }, { opacity: 1 }], { duration: SHRINK_MS, easing: 'ease-in-out', fill: 'forwards' })
    ];
    if (parts.image) {
      moves.push(
        animate(
          parts.image,
          [
            { ...box(media), objectPosition: getComputedStyle(parts.image).objectPosition },
            { ...box(fill(to)), objectPosition: cardPhoto?.position || '50% 50%' }
          ],
          { duration: SHRINK_MS, easing: spring(), fill: 'forwards' }
        )
      );
    }
    await Promise.all(moves.map((move) => move.finished.catch(() => {})));
    if (state.layer !== parts) return;

    /* Hand over to the real card with a breath of a fade, so even a card
       caught mid-reveal by the scroll never pops. */
    await animate(parts.layer, [{ opacity: 1 }, { opacity: 0 }], { duration: HANDOFF_MS, easing: 'ease-out', fill: 'forwards' }).finished.catch(() => {});
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
    /* Hold the new page's entrances until the overlay reveals it. */
    state.arrivedAt = performance.now();
    state.released = false;
    window.clearTimeout(state.arrivalTimer);
    root().style.setProperty('--arrive', `${SAFETY_MS}ms`);
    root().dataset.morphArrived = '';
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
