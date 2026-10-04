/**
 * Card ↔ page "zoom" transitions, in the manner of the App Store's Today
 * cards: the card you tap grows out of its exact place on the screen into the
 * page it opens, and the page's content settles in once it lands. Closing
 * runs the same motion backwards into the card you came from.
 *
 * Built on the View Transitions API. One element on each side of the change
 * is named `morph` — the tapped card (inline, at click time) and the page's
 * hero (`[data-morph-target]`, named by globals.css while a morph runs) — and
 * the browser animates one into the other. Naming only at click time means a
 * card can appear in any number of lists without two elements ever sharing
 * the name.
 *
 * The state machine lives on <html data-morph>:
 *
 *   expand      capturing the page you are leaving (the card is named)
 *   expand-in   the new page is in; its hero takes the name
 *   collapse    capturing the page you are closing (its hero is named)
 *   collapse-in the previous page is back; the card takes the name
 *   open / open-in, close / close-in   the same, within one page (lightbox)
 *
 * Browsers without view transitions, reduced motion and ?nomotion all fall
 * straight through to an ordinary navigation. Nothing here ever blocks one:
 * if the new page has not committed within 2.5s the transition gives up and
 * the navigation completes on its own.
 */
import { prefersCalm } from '@/lib/hooks';

const NAME = 'morph';
const GIVE_UP_MS = 2500;
/* Long enough for the destination's entrances (delay + duration) to finish
   before their extra arrival delay is withdrawn. */
const ARRIVAL_MS = 1800;

const state = {
  pending: null,
  current: null,
  /* The detail page reached by the last expand, and the page it opened from:
     closing it can then step back in history instead of pushing a new entry. */
  opened: null,
  scroll: new Map(),
  arrivalTimer: 0
};

export function canMorph() {
  return typeof document !== 'undefined' && typeof document.startViewTransition === 'function' && !prefersCalm();
}

function root() {
  return document.documentElement;
}

function name(element) {
  if (!element) return;
  element.style.viewTransitionName = NAME;
  element.setAttribute('data-morph-named', '');
}

function clearNames() {
  document.querySelectorAll('[data-morph-named]').forEach((element) => {
    element.style.viewTransitionName = '';
    element.removeAttribute('data-morph-named');
  });
}

function inViewport(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth && rect.width > 0;
}

/** The morphing surface of a card: its `[data-morph-source]`, or the card itself. */
export function morphSurface(card) {
  return card?.querySelector?.('[data-morph-source]') || card || null;
}

function finish(transition, onDone) {
  transition.finished
    .catch(() => {})
    .finally(() => {
      clearNames();
      root().removeAttribute('data-morph');
      onDone?.();
    });
}

function settle() {
  const pending = state.pending;
  if (!pending) return;
  state.pending = null;
  window.clearTimeout(pending.timer);
  pending.resolve();
}

/**
 * Card → page. `go` performs the navigation (router.push).
 */
export function expand({ source, href, go }) {
  if (!canMorph()) {
    go();
    return;
  }
  const from = window.location.pathname;
  state.scroll.set(from, window.scrollY);
  clearNames();
  root().dataset.morph = 'expand';
  name(source);

  const transition = document.startViewTransition(
    () =>
      new Promise((resolve) => {
        const timer = window.setTimeout(settle, GIVE_UP_MS);
        state.pending = { mode: 'expand', from, href, resolve, timer };
        go();
      })
  );
  finish(transition, () => {
    window.clearTimeout(state.arrivalTimer);
    state.arrivalTimer = window.setTimeout(() => root().removeAttribute('data-morph-arrived'), ARRIVAL_MS);
  });
}

/**
 * Page → card. Steps back in history when this page was opened from a card
 * (so Back and the browser agree); otherwise opens `fallbackHref`.
 */
export function collapse({ router, fallbackHref }) {
  const here = window.location.pathname;
  const back = state.opened && state.opened.detail === here;
  const go = () => (back ? router.back() : router.push(fallbackHref));

  if (!canMorph()) {
    go();
    return;
  }
  clearNames();
  root().dataset.morph = 'collapse';

  const transition = document.startViewTransition(
    () =>
      new Promise((resolve) => {
        const timer = window.setTimeout(settle, GIVE_UP_MS);
        state.pending = { mode: 'collapse', from: here, restore: back, resolve, timer };
        go();
      })
  );
  finish(transition);
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
  clearNames();

  if (pending.mode === 'expand') {
    state.opened = { detail: pathname, from: pending.from };
    root().dataset.morph = 'expand-in';
    root().dataset.morphArrived = '';
  } else {
    root().dataset.morph = 'collapse-in';
    if (pending.restore && state.scroll.has(pathname)) {
      window.scrollTo({ top: state.scroll.get(pathname), behavior: 'instant' });
    }
    const card = document.querySelector(`[data-morph-key="${CSS.escape(pending.from)}"]`);
    const surface = morphSurface(card);
    if (inViewport(surface)) name(surface);
    state.opened = null;
  }
  settle();
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
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    root().dataset.morph = `${mode}-in`;
    const surface = typeof target === 'function' ? target() : target;
    if (inViewport(surface)) name(surface);
  });
  finish(transition);
}

/** True while a morph is running — page-level entrances stand aside for it. */
export function isMorphing() {
  return typeof document !== 'undefined' && root().hasAttribute('data-morph');
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
