'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { clinic, clinicWhatsapp, navCta, t } from '@/lib/data';

/**
 * Mobile action bar.
 *
 * On a phone, a dental clinic converts through the call button and almost
 * nothing else — so the three actions that matter are pinned to the thumb
 * zone rather than left at the bottom of a long page. Desktop keeps the header
 * CTA and never sees this.
 *
 * It writes its own height into --safe-bottom so the footer can still be
 * scrolled clear of it, and respects the iOS home-indicator inset.
 */
export default function StickyActionBar() {
  const pathname = usePathname();
  const whatsapp = clinicWhatsapp();

  /* Hidden on the booking page itself, where every one of these actions is
     already the main content. */
  const hidden = pathname === navCta.href;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--safe-bottom', hidden ? '0px' : 'calc(64px + env(safe-area-inset-bottom, 0px))');
    const clear = () => root.style.setProperty('--safe-bottom', '0px');
    return clear;
  }, [hidden]);

  if (hidden) return null;

  const actions = [
    { key: 'call', href: clinic.contact.phoneHref, icon: 'phone', label: t('stickyBar.call') },
    { key: 'whatsapp', href: whatsapp, icon: 'whatsapp', label: t('stickyBar.whatsapp'), external: true },
    { key: 'book', href: navCta.href, icon: 'calendar', label: t('stickyBar.book'), primary: true }
  ].filter((action) => action.href);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[75] border-t border-line material px-3 pb-[env(safe-area-inset-bottom,0px)] pt-2 md:hidden"
      style={{ height: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
    >
      <nav className="flex items-stretch gap-2" aria-label="Quick actions">
        {actions.map((action) => {
          const content = (
            <>
              <Icon name={action.icon} size={17} />
              <span className="text-[11px] font-medium tracking-[0.02em]">{action.label}</span>
            </>
          );
          const className = `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-colors active:scale-[0.97] ${
            action.primary
              ? 'bg-primary text-on-primary'
              : 'border border-line bg-card text-primary'
          }`;

          return action.primary ? (
            <Link key={action.key} href={action.href} className={className}>
              {content}
            </Link>
          ) : (
            <a
              key={action.key}
              href={action.href}
              className={className}
              {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {content}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
