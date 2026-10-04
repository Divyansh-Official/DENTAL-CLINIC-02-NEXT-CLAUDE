'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
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
 * never moves, re-renders or re-animates when the page changes. It sits
 * above the card zoom and the phone menu, whose button turns into a close
 * button in place.
 *
 * Like Apple's glass it adapts to what is behind it: over a dark section (a
 * photo hero, the numbers band, a closing banner, a card zooming open) it
 * turns to dark glass with light text, and back to light glass over light
 * ones. It reads the section under its centre once per scrolled frame,
 * after each page change, when the menu opens or closes, and when a card
 * zoom covers or uncovers it (the `morphchange` event from lib/morph.js).
 *
 * All data arrives as props from app/layout.js.
 */
export default function SiteHeader({ brand, items = [], extra = [], cta, contact, status, labels = {}, glass = true }) {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [tone, setTone] = useState(null);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const menuId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    let frame = 0;
    const probe = () => {
      frame = 0;
      const header = headerRef.current;
      const box = header?.firstElementChild?.getBoundingClientRect();
      if (!box) return;
      const below = document
        .elementsFromPoint(window.innerWidth / 2, box.top + box.height / 2)
        .find((element) => !header.contains(element));
      const section = below?.closest('.tone-dark, .tone-gray, .tone-white');
      setTone(section?.classList.contains('tone-dark') ? 'dark' : 'light');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(probe);
    };
    /* A card zoom paints a dark photograph under the header before the new
       page exists; it says so, then asks for a fresh reading when done. */
    const onMorph = (event) => {
      if (event.detail?.tone) setTone(event.detail.tone);
      else schedule();
    };
    /* First reading on the next frame, never in the middle of hydration (the
       first paint already has the right glass from globals.css). */
    schedule();
    /* Look again once the menu has finished fading out. */
    const settle = window.setTimeout(schedule, 320);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('morphchange', onMorph);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('morphchange', onMorph);
    };
  }, [pathname, menuOpen]);

  const Surface = glass ? LiquidGlass : 'div';
  const surfaceProps = glass
    ? {
        radius: 999,
        strength: 'soft',
        elevation: 'raised',
        style: { '--lg-tint': 'rgb(255 255 255 / 0.68)', '--lg-tint-live': 'rgb(255 255 255 / 0.52)' }
      }
    : {};

  return (
    <>
      <header ref={headerRef} className="site-header" data-tone={tone || undefined} data-print="hide">
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
