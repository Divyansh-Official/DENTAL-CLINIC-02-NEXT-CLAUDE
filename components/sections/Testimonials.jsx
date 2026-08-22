'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Rating from '@/components/ui/Rating';
import Reveal, { RevealWords } from '@/components/ui/Reveal';
import { t, testimonials, testimonialItems } from '@/lib/data';
import { IOS_EASE, tap } from '@/lib/motion';
import { useMediaQuery, useCalmMotion } from '@/lib/hooks';

/**
 * Review carousel.
 *
 * Three cards on desktop, two on tablet, one at a time on a phone. The quote
 * is set large enough to actually be read — a testimonial in 13px grey is
 * decoration, not evidence.
 */
export default function Testimonials() {
  const items = testimonialItems();
  const calm = useCalmMotion();

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
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">{testimonials.section.eyebrow}</p>
            </Reveal>
            <h2 className="display-lg mt-6">
              <RevealWords text={testimonials.section.title} italicWord={testimonials.section.italicWord} />
            </h2>
          </div>

          {pages > 1 ? (
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={calm ? undefined : tap}
                onClick={() => paginate(page - 1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-line bg-card text-primary transition-colors duration-300 hover:border-primary/40 hover:bg-primary hover:text-on-primary"
              >
                <Icon name="arrow-left" size={15} label={t('testimonials.previousLabel')} />
              </motion.button>
              <motion.button
                type="button"
                whileTap={calm ? undefined : tap}
                onClick={() => paginate(page + 1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-line bg-card text-primary transition-colors duration-300 hover:border-primary/40 hover:bg-primary hover:text-on-primary"
              >
                <Icon name="arrow-right" size={15} label={t('testimonials.nextLabel')} />
              </motion.button>
            </div>
          ) : null}
        </div>

        <div className="relative mt-14 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.ul
              key={page}
              custom={direction}
              initial={calm ? false : { opacity: 0, x: direction * 60 }}
              animate={calm ? false : { opacity: 1, x: 0 }}
              exit={calm ? undefined : { opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.5, ease: IOS_EASE }}
              drag={calm || pages < 2 ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) paginate(page + 1);
                if (info.offset.x > 80) paginate(page - 1);
              }}
              className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
                pages > 1 ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              {visible.map((item) => (
                <li key={item.id} className="card-surface card-hover flex flex-col p-8">
                  <Icon name="quote" size={26} className="text-accent/35" />

                  <blockquote className="mt-6 text-[16.5px] leading-[1.65] text-primary">
                    {item.quote}
                  </blockquote>

                  <div className="mt-auto pt-8">
                    <Rating value={item.rating} size={14} />
                    <div className="mt-5 flex items-center gap-3.5 border-t border-line pt-5">
                      {item.avatar?.src ? (
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-200">
                          <Image src={item.avatar.src} alt={item.avatar.alt || ''} fill sizes="44px" className="object-cover" />
                        </span>
                      ) : null}
                      <span>
                        <span className="block text-[14.5px] font-medium text-primary">{item.name}</span>
                        <span className="block text-[14.5px] text-ink-faint">
                          {[item.location, item.treatment].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {pages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-2">
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
                    i === page ? 'w-7 bg-accent' : 'w-1.5 bg-primary/20'
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
