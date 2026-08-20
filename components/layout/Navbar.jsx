'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import Button from '@/components/ui/Button';
import { navCta, primaryNav, t } from '@/lib/data';
import { IOS_EASE, spring } from '@/lib/motion';
import { useModalBehaviour } from '@/lib/hooks';

/**
 * Navigation bar.
 *
 * Two iOS behaviours are reproduced: the bar becomes translucent material with
 * a hairline separator once content passes beneath it, and it retracts on
 * downward scroll then returns immediately on upward scroll, the way a
 * large-title navigation bar behaves in a UIScrollView.
 *
 * The previous scroll position is held in a ref rather than state. As state it
 * re-rendered the entire header on every scroll frame; only the two booleans
 * that actually change appearance are stateful now.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const previous = useRef(0);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setCondensed(latest > 24);
    if (!menuOpenRef.current) {
      setHidden(latest > previous.current && latest > 220);
    }
    previous.current = latest;
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useModalBehaviour(menuOpen, closeMenu);

  const items = primaryNav();
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden && !reduceMotion ? -110 : 0, opacity: 1 }}
        transition={{ ...spring.snappy, opacity: { duration: 0.6 } }}
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-ios ${
          condensed ? 'material shadow-[0_1px_0_rgb(var(--c-line))]' : 'bg-transparent'
        }`}
      >
        <nav className="shell flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Primary">
          <Logo />

          <ul className="hidden items-center gap-7 lg:flex">
            {items.map((item) => (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`group relative block py-2 text-[13.5px] tracking-[0.01em] transition-colors duration-300 ${
                    isActive(item.href) ? 'text-primary' : 'text-ink-muted hover:text-primary'
                  }`}
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                      transition={{ duration: 0.5, ease: IOS_EASE }}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href={navCta.href} size="sm" icon={navCta.icon}>
                {navCta.label}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('common.openMenu')}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card/70 transition-colors hover:border-primary/30 active:scale-95"
            >
              <span className="flex flex-col items-end gap-[5px]" aria-hidden="true">
                <span className="block h-px w-4 bg-primary transition-all duration-500 ease-ios" />
                <span className="block h-px w-3 bg-primary transition-all duration-500 ease-ios" />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} containerRef={menuRef} />
    </>
  );
}
