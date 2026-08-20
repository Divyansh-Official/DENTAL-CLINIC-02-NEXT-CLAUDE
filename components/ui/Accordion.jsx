'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { IOS_EASE } from '@/lib/motion';

/**
 * Disclosure list. Height animates on the iOS sheet curve; the icon rotates.
 *
 * Each trigger is wired to its panel with aria-controls/aria-labelledby, so a
 * screen reader announces the expanded state and can jump straight to the
 * answer.
 */
export default function Accordion({ items = [], defaultOpen = 0, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();

  if (!items.length) return null;

  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const triggerId = `${uid}-trigger-${index}`;
        const panelId = `${uid}-panel-${index}`;

        return (
          <div key={item.q || index}>
            <h3>
              <button
                id={triggerId}
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={`font-display text-[17px] leading-snug transition-colors duration-300 sm:text-xl ${
                    isOpen ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.45, ease: IOS_EASE }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line"
                >
                  <Icon name={isOpen ? 'minus' : 'plus'} size={13} tone={isOpen ? 'accent' : 'primary'} />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: IOS_EASE }}
                  className="overflow-hidden"
                >
                  <p className="body-lead max-w-3xl pb-6 pr-10">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
