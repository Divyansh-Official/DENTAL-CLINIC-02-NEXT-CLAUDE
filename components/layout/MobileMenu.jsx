'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useCalmMotion } from '@/lib/hooks';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { clinic, navCta, primaryNav, t } from '@/lib/data';
import { IOS_EASE, spring, tap } from '@/lib/motion';

/**
 * Full-height overlay menu. Springs in from the right on the sheet curve,
 * links cascade in sequence, and the panel can be dragged away to the right —
 * the gesture an iOS user already expects from a presented view.
 */
export default function MobileMenu({ open, onClose, containerRef }) {
  const pathname = usePathname();
  const calm = useCalmMotion();
  const items = primaryNav();

  /* Close on navigation, but not on the first render — the original ran on
     mount and fired onClose before the menu had ever been opened. */
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[95]">
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: IOS_EASE }}
            className="absolute inset-0 bg-primary-900/50 backdrop-blur-[3px]"
          />

          <motion.aside
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('common.menu')}
            tabIndex={-1}
            initial={calm ? { opacity: 0 } : { x: '100%' }}
            animate={calm ? { opacity: 1 } : { x: 0 }}
            exit={
              calm ? { opacity: 0 } : { x: '100%', transition: { duration: 0.35, ease: IOS_EASE } }
            }
            transition={calm ? { duration: 0.2 } : spring.sheet}
            drag={calm ? false : 'x'}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.55 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 120 || info.velocity.x > 600) onClose();
            }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-surface shadow-panel sm:rounded-l-[32px]"
          >
            <div className="flex items-center justify-between px-7 pt-7">
              <p className="eyebrow">{t('common.menu')}</p>
              <motion.button
                type="button"
                whileTap={calm ? undefined : tap}
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full bg-primary/[0.07] text-primary"
              >
                <Icon name="close" size={14} label={t('common.closeMenu')} />
              </motion.button>
            </div>

            <nav className="no-scrollbar flex-1 overflow-y-auto px-7 pt-8">
              <ul>
                {items.map((item, index) => {
                  const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={calm ? false : { opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: calm ? 0 : 0.06 + index * 0.045, duration: 0.6, ease: IOS_EASE }}
                      className="border-b border-line/70"
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                        className="flex items-center justify-between py-4"
                      >
                        <span
                          className={`font-display text-[26px] leading-none ${
                            active ? 'italic text-accent' : 'text-primary'
                          }`}
                        >
                          {item.label}
                        </span>
                        <Icon name="arrow-up-right" size={15} tone={active ? 'accent' : 'primary'} />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={calm ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: calm ? 0 : 0.42, duration: 0.6, ease: IOS_EASE }}
                className="mt-9 space-y-4 pb-10"
              >
                <Button href={navCta.href} className="w-full justify-between" size="md">
                  {navCta.label}
                </Button>

                <div className="space-y-3 rounded-card border border-line bg-card p-8">
                  <a href={clinic.contact.phoneHref} className="flex items-center gap-3 text-[15px] text-primary">
                    <Icon name="phone" size={15} tone="accent" />
                    {clinic.contact.phone}
                  </a>
                  <a href={clinic.contact.emailHref} className="flex items-center gap-3 text-[15px] text-primary">
                    <Icon name="mail" size={15} tone="accent" />
                    {clinic.contact.email}
                  </a>
                  <p className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink-muted">
                    <Icon name="pin" size={15} tone="accent" className="mt-0.5" />
                    <span>
                      {clinic.contact.address.line1}
                      <br />
                      {clinic.contact.address.line2}
                    </span>
                  </p>
                </div>
              </motion.div>
            </nav>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
