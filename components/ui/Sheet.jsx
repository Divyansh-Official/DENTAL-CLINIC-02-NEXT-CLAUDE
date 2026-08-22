'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { spring, IOS_EASE } from '@/lib/motion';
import { useModalBehaviour , useCalmMotion } from '@/lib/hooks';
import { t } from '@/lib/data';

/**
 * iOS bottom sheet. Springs up from the bottom edge, dims the page behind it,
 * carries a grabber, and dismisses when dragged past a distance or velocity
 * threshold — the same two rules UIKit applies.
 *
 * Focus is trapped inside while it is open and returned to the trigger when it
 * closes; see lib/hooks.js.
 */
export default function Sheet({ open, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  const containerRef = useModalBehaviour(open, onClose);
  const calm = useCalmMotion();

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-primary-900/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: IOS_EASE }}
          />

          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={`relative w-full ${maxWidth} max-h-[88vh] overflow-y-auto no-scrollbar rounded-t-[28px] bg-surface shadow-panel sm:mx-6 sm:rounded-[28px]`}
            initial={calm ? { opacity: 0 } : { y: '100%', opacity: 0.6, scale: 0.98 }}
            animate={calm ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={
              calm
                ? { opacity: 0 }
                : { y: '100%', opacity: 0.4, transition: { duration: 0.3, ease: IOS_EASE } }
            }
            transition={calm ? { duration: 0.2 } : spring.sheet}
            drag={calm ? false : 'y'}
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140 || info.velocity.y > 700) onClose();
            }}
          >
            <div className="sticky top-0 z-10 material px-6 pb-4 pt-3">
              <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-primary/20 sm:hidden" />
              <div className="flex items-center justify-between gap-4">
                <h2 className="display-md text-[22px] sm:text-2xl">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/[0.07] text-primary transition-colors hover:bg-primary/[0.12]"
                >
                  <Icon name="close" size={14} label={t('common.close')} />
                </button>
              </div>
            </div>
            <div className="px-6 pb-8">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
