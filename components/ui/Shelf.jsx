'use client';

import { Children, useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';

/**
 * Apple's horizontal "shelf" of cards.
 *
 * Native scrolling with scroll-snap, so touch, trackpad and keyboard all work
 * without any carousel logic; the first card lines up with the page shell and
 * the row bleeds to the edge of the viewport. Paddle buttons appear below
 * the shelf on devices with a pointer, and disable themselves at either end.
 * Any number of cards fits — add a service or a dentist and it just appears.
 *
 *   itemWidth   CSS width of each card, e.g. 'clamp(260px, 76vw, 340px)'
 */
export default function Shelf({ children, label, itemWidth, gap, labels = {}, className = '' }) {
  const ref = useRef(null);
  const [state, setState] = useState({ prev: false, next: true, overflow: true });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({ prev: el.scrollLeft > 4, next: el.scrollLeft < max - 4, overflow: max > 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [update]);

  const page = (direction) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(280, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  const style = {};
  if (itemWidth) style['--shelf-item'] = itemWidth;
  if (gap) style['--shelf-gap'] = gap;

  /* The shelf as a whole rises in and vanishes with the page scroll; its
     cards cannot each take a view timeline inside a sideways scroller. */
  return (
    <div className={className} data-reveal="">
      <ul ref={ref} className="shelf" style={style} aria-label={label}>
        {Children.toArray(children).map((child, index) => (
          <li key={child.key ?? index}>{child}</li>
        ))}
      </ul>
      {state.overflow ? (
        <div className="shell -mt-3 hidden justify-end gap-3 [@media(hover:hover)]:flex" data-print="hide">
          <button
            type="button"
            className="icon-btn btn-glass"
            onClick={() => page(-1)}
            disabled={!state.prev}
            aria-label={labels.previous || 'Previous'}
          >
            <Icon name="chevron-left" size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="icon-btn btn-glass"
            onClick={() => page(1)}
            disabled={!state.next}
            aria-label={labels.next || 'Next'}
          >
            <Icon name="chevron-right" size={18} strokeWidth={2} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
