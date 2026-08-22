'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCalmMotion } from '@/lib/hooks';
import Icon from '@/components/ui/Icon';
import { treatments, treatmentCategories, getTreatmentCategory } from '@/lib/data';
import { IOS_EASE, IOS_SOFT, spring, tap } from '@/lib/motion';

/**
 * Segmented control plus price table.
 *
 * The control is the iOS UISegmentedControl: the selected pill is a shared
 * layout element that slides between segments rather than fading in place. It
 * is wired as a tablist so arrow keys move between categories and a screen
 * reader announces which one is selected.
 *
 * The category lookup goes through getTreatmentCategory, which always returns
 * something — an unknown id used to return undefined and crash the render.
 */
export default function TreatmentTable() {
  const categories = treatmentCategories();
  const [active, setActive] = useState(categories[0]?.id);
  const calm = useCalmMotion();

  if (!categories.length) return null;

  const category = getTreatmentCategory(active);

  const onKeyDown = (event) => {
    const index = categories.findIndex((item) => item.id === active);
    if (index < 0) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const offset = event.key === 'ArrowRight' ? 1 : -1;
      setActive(categories[(index + offset + categories.length) % categories.length].id);
    }
  };

  return (
    <div>
      <div className="no-scrollbar -mx-[var(--shell-x)] overflow-x-auto px-[var(--shell-x)]">
        <div
          role="tablist"
          aria-label="Treatment categories"
          onKeyDown={onKeyDown}
          className="inline-flex min-w-full gap-1 rounded-full border border-line bg-card p-1.5 sm:min-w-0"
        >
          {categories.map((item) => {
            const selected = item.id === category.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                id={`treatment-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`treatment-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                whileTap={calm ? undefined : tap}
                onClick={() => setActive(item.id)}
                className="relative flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3 text-[15px] transition-colors duration-300"
              >
                {selected ? (
                  <motion.span layoutId="segment-pill" transition={spring.snappy} className="absolute inset-0 rounded-full bg-primary" />
                ) : null}
                <span className={`relative z-10 flex items-center gap-2 ${selected ? 'text-on-primary' : 'text-ink-muted'}`}>
                  <Icon name={item.icon} size={14} />
                  {item.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={category.id}
          id={`treatment-panel-${category.id}`}
          role="tabpanel"
          aria-labelledby={`treatment-tab-${category.id}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: IOS_EASE }}
          className="mt-8 divide-y divide-line overflow-hidden rounded-card border border-line bg-card"
        >
          {(category.items || []).map((item, index) => (
            <motion.li
              key={item.name}
              initial={calm ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: IOS_SOFT, delay: calm ? 0 : index * 0.05 }}
              className="grid gap-2 px-6 py-6 transition-colors duration-300 hover:bg-surface-50 sm:grid-cols-12 sm:items-center sm:gap-4"
            >
              <div className="sm:col-span-5">
                <p className="font-display text-[17.5px] text-primary">{item.name}</p>
                {item.note ? <p className="mt-1.5 text-[14.5px] text-ink-faint">{item.note}</p> : null}
              </div>
              <p className="flex items-center gap-2 text-[14.5px] text-ink-muted sm:col-span-3">
                <Icon name="calendar" size={12} tone="accent" />
                {item.visits}
              </p>
              <p className="flex items-center gap-2 text-[14.5px] text-ink-muted sm:col-span-2">
                <Icon name="clock" size={12} tone="accent" />
                {item.time}
              </p>
              <p className="font-display text-[17.5px] text-accent sm:col-span-2 sm:text-right">{item.price}</p>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      {treatments.note ? (
        <p className="mt-5 flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-faint">
          <Icon name="shield" size={13} tone="accent" className="mt-0.5" />
          {treatments.note}
        </p>
      ) : null}
    </div>
  );
}
