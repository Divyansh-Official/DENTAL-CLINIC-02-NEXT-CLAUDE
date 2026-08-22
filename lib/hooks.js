'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Modal plumbing shared by the sheet and the mobile menu.
 *
 * Locks the page behind the overlay, moves focus into it, keeps Tab inside it,
 * closes on Escape, and returns focus to whatever opened it. Without this, a
 * keyboard visitor tabs straight through an open sheet into the page behind —
 * which is the single most common accessibility failure in a modal.
 *
 * The scrollbar-width compensation stops the page shifting sideways when the
 * lock is applied on desktop.
 */
export function useModalBehaviour(open, onClose) {
  const containerRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    restoreRef.current = document.activeElement;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const node = containerRef.current;
    const focusables = () =>
      node ? Array.from(node.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null) : [];

    /* Wait a frame so the entrance animation has mounted the children. */
    const focusTimer = window.requestAnimationFrame(() => {
      const [first] = focusables();
      (first || node)?.focus?.({ preventScroll: true });
    });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener('keydown', onKeyDown, true);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      restoreRef.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return containerRef;
}

/** Tailwind's `sm`, `lg` and friends, readable from JavaScript. */
export function useMediaQuery(query) {
  /* Starts false so the server render and the first client render agree; the
     effect corrects it before paint. */
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/**
 * Whether motion should be held back.
 *
 * True when the visitor has asked for reduced motion, and also when the page
 * is loaded with `?nomotion` (or `localStorage.nomotion = '1'` for a whole
 * session) — which renders everything in its final state. That second case
 * exists so the site can be screenshotted reliably for a portfolio or a client
 * proposal without waiting on scroll-triggered reveals.
 */
export function useCalmMotion() {
  const reduced = useReducedMotion();
  const [forced, setForced] = useState(false);

  useEffect(() => {
    let stored = false;
    try {
      stored = window.localStorage.getItem('nomotion') === '1';
    } catch {
      /* Private browsing can deny localStorage; the query string still works. */
    }
    setForced(new URLSearchParams(window.location.search).has('nomotion') || stored);
  }, []);

  return reduced || forced;
}
