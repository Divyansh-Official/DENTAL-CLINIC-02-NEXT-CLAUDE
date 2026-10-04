'use client';

import { useCallback, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Button from '@/components/ui/Button';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

/**
 * The header: a floating capsule of liquid glass, with the page scrolling
 * beneath it — which is what gives the refraction something to bend.
 *
 * It is sticky with a negative bottom margin (see .site-header), so it takes
 * no space in the layout, sits under the announcement bar when that is on,
 * and stays pinned once the bar has scrolled away. Links show inline from
 * 1180px; below that the menu button opens the menu beneath the header.
 *
 * It lives in the root layout, so it is the same element on every page: it
 * never re-renders, re-animates or changes look when the page changes. It
 * sits above the card zoom and the phone menu, whose button turns into a
 * close button in place.
 *
 * All data arrives as props from app/layout.js.
 */
export default function SiteHeader({ brand, items = [], extra = [], cta, contact, status, labels = {}, glass = true }) {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  const Surface = glass ? LiquidGlass : 'div';
  const surfaceProps = glass
    ? {
        radius: 999,
        strength: 'soft',
        elevation: 'raised',
        style: { '--lg-tint': 'rgb(255 255 255 / 0.76)', '--lg-tint-live': 'rgb(255 255 255 / 0.64)' }
      }
    : {};

  return (
    <>
      <header className="site-header" data-print="hide">
        <Surface
          {...surfaceProps}
          className={`mx-auto flex h-[52px] w-full max-w-[calc(var(--shell-max)-16px)] items-center gap-2 rounded-full pl-2.5 pr-1.5 md:h-[58px] md:pl-3.5 md:pr-2 ${glass ? '' : 'glass'}`}
        >
          <Logo {...brand} compact className="mr-auto nav:mr-0" />

          <nav aria-label={labels.primaryNav} className="hidden flex-1 justify-center nav:flex">
            <ul className="flex items-center gap-0.5">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={isActive(item.href) ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-none items-center gap-1.5">
            {cta?.href ? (
              <Button href={cta.href} size="sm" className="hidden xs:inline-flex" iconStart={cta.icon}>
                <span className="sm:hidden">{labels.book}</span>
                <span className="hidden sm:inline">{cta.label}</span>
              </Button>
            ) : null}
            <button
              ref={toggleRef}
              type="button"
              className="icon-btn text-ink hover:bg-ink/5 nav:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-haspopup="dialog"
            >
              <span className="flex w-[18px] flex-col gap-[5px]" aria-hidden="true">
                <span className="menu-toggle-line h-[1.75px] rounded-full bg-current" />
                <span className="menu-toggle-line h-[1.75px] rounded-full bg-current" />
              </span>
            </button>
          </div>
        </Surface>
      </header>

      <MobileMenu
        id={menuId}
        open={menuOpen}
        onClose={closeMenu}
        toggleRef={toggleRef}
        items={items}
        extra={extra}
        cta={cta}
        contact={contact}
        status={status}
        labels={labels}
        isActive={isActive}
        pathname={pathname}
      />
    </>
  );
}
