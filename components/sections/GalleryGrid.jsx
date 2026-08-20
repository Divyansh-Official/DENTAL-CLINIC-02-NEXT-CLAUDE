'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Sheet from '@/components/ui/Sheet';
import { gallery, galleryItems } from '@/lib/data';
import { IOS_SOFT, spring, tap } from '@/lib/motion';

/**
 * Filterable masonry with a lightbox.
 *
 * Filtering uses layout animation, so tiles glide to their new positions
 * instead of the grid reflowing instantly. Opening a tile presents the image
 * in a sheet that can be dragged away.
 *
 * The grid uses fixed-height rows. `row-span-2` was previously applied over
 * `auto-rows-auto`, where a row span has nothing to span — the tall tiles
 * silently rendered at normal height and the masonry never actually appeared.
 */
export default function GalleryGrid() {
  const filters = Array.isArray(gallery.filters) && gallery.filters.length ? gallery.filters : ['All'];
  const [filter, setFilter] = useState(filters[0]);
  const [active, setActive] = useState(null);
  const reduceMotion = useReducedMotion();

  const all = galleryItems();
  const items = filter === filters[0] ? all : all.filter((item) => item.category === filter);

  const spanClass = (span) => {
    if (span === 'wide') return 'sm:col-span-2 row-span-1';
    if (span === 'tall') return 'row-span-1 sm:row-span-2';
    return 'row-span-1';
  };

  return (
    <>
      <div
        className="no-scrollbar -mx-[var(--shell-x)] flex gap-2 overflow-x-auto px-[var(--shell-x)]"
        role="group"
        aria-label="Filter gallery"
      >
        {filters.map((item) => {
          const selected = item === filter;
          return (
            <motion.button
              key={item}
              type="button"
              whileTap={reduceMotion ? undefined : tap}
              onClick={() => setFilter(item)}
              aria-pressed={selected}
              className="relative whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] transition-colors duration-300"
            >
              {selected ? (
                <motion.span layoutId="gallery-pill" transition={spring.snappy} className="absolute inset-0 rounded-full bg-primary" />
              ) : (
                <span className="absolute inset-0 rounded-full border border-line bg-card" />
              )}
              <span className={`relative z-10 ${selected ? 'text-on-primary' : 'text-ink-muted'}`}>{item}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.ul
        layout={!reduceMotion}
        className="mt-8 grid auto-rows-[220px] gap-4 sm:auto-rows-[200px] sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.li
              key={item.id}
              layout={!reduceMotion}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.55, ease: IOS_SOFT }}
              className={spanClass(item.span)}
            >
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : tap}
                onClick={() => setActive(item)}
                aria-label={`View ${item.title}`}
                aria-haspopup="dialog"
                className="group relative block h-full w-full overflow-hidden rounded-card bg-surface-200"
              >
                <Image
                  src={item.src}
                  alt={item.alt || item.title || ''}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1100ms] ease-ios group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-4 left-4 flex items-center gap-2 text-[12.5px] text-on-primary opacity-0 transition-all duration-500 ease-ios group-hover:opacity-100">
                  <Icon name="search" size={13} />
                  {item.title}
                </span>
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Sheet open={Boolean(active)} onClose={() => setActive(null)} title={active?.title || ''} maxWidth="max-w-3xl">
        {active ? (
          <>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-surface-200">
              <Image src={active.src} alt={active.alt || ''} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
            </div>
            <p className="mt-5 text-[13px] text-ink-muted">
              {[active.category, active.alt].filter(Boolean).join(' · ')}
            </p>
          </>
        ) : null}
      </Sheet>
    </>
  );
}
