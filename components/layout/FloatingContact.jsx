'use client';

import { usePathname } from 'next/navigation';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Icon from '@/components/ui/Icon';

/**
 * A round orb of liquid glass in the corner — the WhatsApp shortcut on
 * tablet and desktop (phones have the tab bar). It floats over the page, so
 * it always has structure to refract, and it lenses harder under the pointer.
 */
export default function FloatingContact({ href, label, bookHref, glass = true }) {
  const pathname = usePathname();
  if (!href || pathname === bookHref) return null;

  const Surface = glass ? LiquidGlass : 'a';
  const surfaceProps = glass
    ? { as: 'a', radius: 999, strength: 'full', elevation: 'float', interactive: true, style: { '--lg-tint': 'rgb(255 255 255 / 0.6)', '--lg-tint-live': 'rgb(255 255 255 / 0.3)' } }
    : {};

  return (
    <Surface
      {...surfaceProps}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-print="hide"
      data-chrome="fab"
      className={`fixed bottom-6 right-6 z-[75] hidden h-[60px] w-[60px] place-items-center rounded-full transition-transform duration-300 ease-ios hover:scale-105 active:scale-95 md:grid ${glass ? '' : 'glass'}`}
    >
      <Icon name="whatsapp" size={27} className="text-[#1FAF57]" />
    </Surface>
  );
}
