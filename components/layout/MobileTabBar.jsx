'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Icon from '@/components/ui/Icon';

/**
 * Phone action bar — an iOS 26-style floating tab bar of liquid glass.
 *
 * On a phone a clinic converts through the call button and almost nothing
 * else, so call, WhatsApp and book sit in the thumb zone. It floats above the
 * page, refracting whatever scrolls beneath it, and hides on the booking page
 * where those actions are already the content. The body only reserves space
 * for it below 768px (globals.css), so desktop never gets phantom padding.
 *
 * Like iOS 26's tab bars it minimises while you scroll down — shrinking to its
 * icons so more of the page shows — and comes back the moment you scroll up.
 */
export default function MobileTabBar({ phoneHref, whatsappHref, bookHref, labels = {}, glass = true }) {
  const pathname = usePathname();
  const hidden = pathname === bookHref;

  const [compact, setCompact] = useState(false);

  useEffect(() => {
    document.body.dataset.tabbar = hidden ? 'off' : 'on';
  }, [hidden]);

  /* One passive listener, read once per frame; the state only changes when
     the direction does, so scrolling causes no renders. */
  useEffect(() => {
    if (hidden) return undefined;
    let last = window.scrollY;
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 8) return;
      /* A jump (a restored position, an anchor) is not the visitor scrolling. */
      if (Math.abs(delta) < 400) setCompact(delta > 0 && y > 160);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [hidden]);

  /* A new page starts with the bar open. */
  useEffect(() => {
    setCompact(false);
  }, [pathname]);

  if (hidden) return null;

  const item =
    'flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium tracking-[-0.005em] transition-colors active:bg-ink/[0.06]';

  const Surface = glass ? LiquidGlass : 'div';
  const surfaceProps = glass
    ? { radius: 999, strength: 'soft', elevation: 'float', interactive: true, style: { '--lg-tint': 'rgb(255 255 255 / 0.72)', '--lg-tint-live': 'rgb(255 255 255 / 0.5)' } }
    : {};

  return (
    <nav
      aria-label={labels.quickActions}
      className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-[75] md:hidden"
      data-print="hide"
      data-chrome="tabbar"
      data-compact={compact ? '' : undefined}
      onFocus={() => setCompact(false)}
    >
      <Surface {...surfaceProps} className={`tabbar-surface mx-auto flex h-[62px] max-w-md items-center gap-1 rounded-full p-1.5 ${glass ? '' : 'glass'}`}>
        {phoneHref ? (
          <a href={phoneHref} className={`${item} text-ink`}>
            <Icon name="phone" size={20} className="tabbar-icon" />
            <span className="tabbar-label">{labels.call}</span>
          </a>
        ) : null}
        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`}>
            <Icon name="whatsapp" size={20} className="tabbar-icon text-[#1FAF57]" />
            <span className="tabbar-label">{labels.whatsapp}</span>
          </a>
        ) : null}
        <Link href={bookHref} className={`${item} flex-[1.4] bg-primary text-on-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] active:bg-primary-deep`}>
          <Icon name="calendar" size={20} className="tabbar-icon" />
          <span className="tabbar-label">{labels.book}</span>
        </Link>
      </Surface>
    </nav>
  );
}
