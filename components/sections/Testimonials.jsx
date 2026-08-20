'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Rating from '@/components/ui/Rating';
import Reveal, { RevealWords } from '@/components/ui/Reveal';
import { t, testimonials, testimonialItems } from '@/lib/data';
import { IOS_EASE, spring, tap } from '@/lib/motion';
import { useMediaQuery } from '@/lib/hooks';

/**
 * Review carousel.
 *
 * Three cards on desktop, two on tablet and one at a time on a phone. The page
 * size used to be fixed at three regardless of viewport, which meant a phone
 * stacked three cards into one "page" and the pagination dots counted pages
 * that did not exist.
 */
export default function Testimonials() {
  const items = testimonialItems();
  const reduceMotion = useReducedMotion();

  const isLarge = useMediaQuery('(min-width: 1024px)');
  const isMedium = useMediaQuery('(min-width: 640px)');
  const perPage = isLarge ? 3 : isMedium ? 2 : 1;

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const pages = Math.max(1, Math.ceil(items.length / perPage));

  /* A resize can leave the visitor on a page that no longer exists. */
  useEffect(() => {
    setPage((current) => Math.min(current, pages - 1));
  }, [pages]);

  if (!items.length) return null;

  const paginate = (next) => {
    const target = (next + pages) % pages;
    setDirection(target > page ? 1 : -1);
    setPage(target);
  };

  const visible = items.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="section-pad bg-surface-50">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow">{testimonials.section.eyebrow}</p>
            </Reveal>
            <h2 className="display-lg mt-4">
              <RevealWords text={testimonials.section.title} italicWord={testimonials.section.italicWord} />
            </h2>
          </div>

          {pages > 1 ? (
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : tap}
                onClick={() => paginate(page - 1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-primary transition-colors duration-300 hover:border-primary/40"
              >
                <Icon name="arrow-left" size={14} label={t('testimonials.previousLabel')} />
              </motion.button>
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : tap}
                onClick={() => paginate(page + 1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-primary transition-colors duration-300 hover:border-primary/40"
              >
                <Icon name="arrow-right" size={14} label={t('testimonials.nextLabel')} />
              </motion.button>
            </div>
          ) : null}
        </div>

        <div className="relative mt-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.ul
              key={page}
              custom={direction}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 70 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -70 }}
              transition={{ duration: 0.55, ease: IOS_EASE }}
              drag={reduceMotion || pages < 2 ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) paginate(page + 1);
                if (info.offset.x > 80) paginate(page - 1);
              }}
              className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
                pages > 1 ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              {visible.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring.gentle, delay: reduceMotion ? 0 : index * 0.07 }}
                  className="group relative flex flex-col justify-between rounded-card border border-line bg-card p-6 transition-all duration-500 ease-ios hover:-translate-y-1 hover:shadow-lift"
                >
                  <div>
                    <Icon name="quote" size={20} tone="accent" className="opacity-40" />
                    <blockquote className="mt-4 text-[13.5px] leading-relaxed text-primary">{item.quote}</blockquote>
                  </div>

                  <div className="mt-6">
                    <Rating value={item.rating} />
                    <div className="mt-4 flex items-center gap-3">
                      {item.avatar?.src ? (
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-200">
                          <Image src={item.avatar.src} alt={item.avatar.alt || ''} fill sizes="40px" className="object-cover" />
                        </span>
                      ) : null}
                      <span>
                        <span className="block text-[13px] font-medium text-primary">{item.name}</span>
                        <span className="block text-[11.5px] text-ink-faint">
                          {[item.location, item.treatment].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {pages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => paginate(i)}
                aria-label={`${t('testimonials.pageLabel')} ${i + 1}`}
                aria-current={i === page ? 'true' : undefined}
                className="p-1.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ease-ios ${
                    i === page ? 'w-6 bg-accent' : 'w-1.5 bg-primary/20'
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
