'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Sheet from '@/components/ui/Sheet';
import { canMorph, filterTransition, morphInPlace } from '@/lib/morph';

/**
 * Gallery: a filterable mosaic with a lightbox.
 *
 * Filtering runs through the View Transitions API where the browser has it,
 * so tiles glide to their new places; elsewhere the grid simply re-flows.
 * Tiles span wide or tall as each item asks. Tapping one zooms the photograph
 * out of the grid into the lightbox — a sheet with previous/next, arrow keys
 * and a counter — and closing shrinks it back into its tile.
 */
export default function GalleryExplorer({ items = [], filters = [], labels = {} }) {
  const allValue = filters[0] || labels.all || 'All';
  const [filter, setFilter] = useState(allValue);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [zoomed, setZoomed] = useState(false);
  const tiles = useRef(new Map());

  const visible = useMemo(() => (filter === allValue ? items : items.filter((item) => item.category === filter)), [filter, allValue, items]);
  const active = activeIndex >= 0 ? visible[activeIndex] : null;

  const changeFilter = (value) => {
    if (value === filter) return;
    filterTransition(() => flushSync(() => setFilter(value)));
  };

  const keyOf = (item, index) => item.id || item.src || index;

  const open = (index, event) => {
    const tile = event.currentTarget.querySelector('[data-morph-source]');
    if (!canMorph()) {
      setZoomed(false);
      setActiveIndex(index);
      return;
    }
    morphInPlace({
      mode: 'open',
      source: tile,
      update: () =>
        flushSync(() => {
          setZoomed(true);
          setActiveIndex(index);
        })
    });
  };

  const close = () => {
    if (activeIndex < 0) return;
    const item = visible[activeIndex];
    if (!zoomed || !canMorph()) {
      setActiveIndex(-1);
      return;
    }
    morphInPlace({
      mode: 'close',
      update: () => flushSync(() => setActiveIndex(-1)),
      target: () => tiles.current.get(keyOf(item, activeIndex))
    });
  };

  const step = useCallback(
    (delta) => setActiveIndex((index) => (index < 0 ? index : (index + delta + visible.length) % visible.length)),
    [visible.length]
  );

  useEffect(() => {
    if (activeIndex < 0) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, step]);

  const span = (value) => (value === 'wide' ? 'col-span-2' : value === 'tall' ? 'row-span-2' : '');

  return (
    <>
      {filters.length > 1 ? (
        <div className="flex justify-center">
          <SegmentedControl label={labels.filter} value={filter} onChange={changeFilter} items={filters.map((f) => ({ value: f, label: f }))} />
        </div>
      ) : null}

      <ul className="mt-10 grid grid-flow-dense auto-rows-[clamp(150px,24vw,270px)] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {visible.map((item, index) => (
          <li key={item.id || item.src} className={span(item.span)} data-vt style={{ '--vt': `gallery-${String(item.id || index).replace(/[^a-zA-Z0-9_-]/g, '')}` }}>
            <button
              type="button"
              onClick={(event) => open(index, event)}
              aria-haspopup="dialog"
              aria-label={(labels.view || 'View {title}').replace('{title}', item.title || item.alt || '')}
              className="tile tile-hover group media block h-full w-full text-left"
            >
              <span
                data-morph-source
                ref={(node) => {
                  if (node) tiles.current.set(keyOf(item, index), node);
                  else tiles.current.delete(keyOf(item, index));
                }}
                className="absolute inset-0"
              >
                <Image src={item.src} alt={item.alt || item.title || ''} fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 sm:inset-x-4 sm:bottom-4">
                <span className="truncate text-[14px] font-semibold text-white sm:text-[15px]">{item.title}</span>
                <span className="glass-dark hidden h-8 w-8 flex-none place-items-center rounded-full sm:grid">
                  <Icon name="expand" size={14} />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Sheet
        open={Boolean(active)}
        onClose={close}
        instant={zoomed}
        title={active?.title || ''}
        closeLabel={labels.close}
        width={980}
        footer={
          active ? (
            <div className="flex items-center justify-between gap-4">
              <p className="min-w-0 truncate text-[14px] text-ink-2">{[active.category, active.alt].filter(Boolean).join(' · ')}</p>
              <div className="flex flex-none items-center gap-2">
                <span className="mr-1 text-[13px] tabular-nums text-ink-3">
                  {(labels.counter || '{index} of {total}').replace('{index}', activeIndex + 1).replace('{total}', visible.length)}
                </span>
                <button type="button" className="icon-btn h-10 w-10 bg-ink/[0.06] hover:bg-ink/10" onClick={() => step(-1)} aria-label={labels.previous}>
                  <Icon name="chevron-left" size={18} strokeWidth={2} />
                </button>
                <button type="button" className="icon-btn h-10 w-10 bg-ink/[0.06] hover:bg-ink/10" onClick={() => step(1)} aria-label={labels.next}>
                  <Icon name="chevron-right" size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          ) : null
        }
      >
        {active ? (
          <div data-morph-target className="media relative h-[min(64dvh,680px)] w-full overflow-hidden rounded-2xl">
            <Image key={active.src} src={active.src} alt={active.alt || active.title || ''} fill sizes="(max-width: 1024px) 100vw, 940px" className="object-contain" />
          </div>
        ) : null}
      </Sheet>
    </>
  );
}
