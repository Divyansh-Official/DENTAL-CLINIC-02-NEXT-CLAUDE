'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import OpenStatus from '@/components/ui/OpenStatus';
import { DURATION } from '@/lib/motion';
import { prefersCalm } from '@/lib/hooks';
import Logo from './Logo';

/**
 * Full-screen menu on a native <dialog>: the page behind blurs into a glass
 * backdrop, the panel drops in on a spring, and the links cascade. Being a
 * real modal dialog, focus is trapped, Escape closes it, and the page behind
 * cannot scroll.
 */
export default function MobileMenu({ open, onClose, brand, items, extra, cta, contact, status, labels, isActive, pathname }) {
  const dialogRef = useRef(null);
  const firstPath = useRef(pathname);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) {
      dialog.removeAttribute('data-closing');
      dialog.showModal();
      return undefined;
    }
    if (!open && dialog.open) {
      if (prefersCalm()) {
        dialog.close();
        return undefined;
      }
      dialog.setAttribute('data-closing', '');
      const timer = window.setTimeout(() => {
        dialog.close();
        dialog.removeAttribute('data-closing');
      }, DURATION.exit - 40);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  /* Close after navigating — but not on first mount. */
  useEffect(() => {
    if (pathname !== firstPath.current) {
      firstPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  const all = [...items, ...extra];

  return (
    <dialog
      ref={dialogRef}
      className="menu-sheet"
      aria-label={labels.menu}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="menu-panel glass mx-auto mt-2.5 flex max-h-[calc(100dvh-20px)] w-[calc(100%-20px)] max-w-xl flex-col overflow-hidden rounded-[30px] bg-card/80">
        <div className="flex flex-none items-center justify-between gap-3 py-2 pl-2.5 pr-1.5 md:pl-3.5">
          <Logo {...brand} compact />
          <button type="button" className="icon-btn bg-ink/[0.06] text-ink hover:bg-ink/10" onClick={onClose} aria-label={labels.closeMenu}>
            <Icon name="close" size={17} strokeWidth={2} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-7 pt-3">
          {status ? (
            <div className="menu-item" style={{ '--i': 0 }}>
              <OpenStatus {...status} />
            </div>
          ) : null}

          <nav aria-label={labels.primaryNav} className="mt-4">
            <ul>
              <li className="menu-item" style={{ '--i': 1 }}>
                <Link
                  href="/"
                  className={`flex items-center justify-between py-2.5 text-[28px] font-semibold tracking-[-0.03em] ${pathname === '/' ? 'text-primary' : 'text-ink'}`}
                  aria-current={pathname === '/' ? 'page' : undefined}
                >
                  {labels.home}
                </Link>
              </li>
              {all.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="menu-item" style={{ '--i': index + 2 }}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between py-2.5 text-[28px] font-semibold tracking-[-0.03em] transition-colors ${active ? 'text-primary' : 'text-ink hover:text-primary'}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                      <Icon name="chevron-right" size={20} strokeWidth={2} className="text-ink-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="menu-item mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2" style={{ '--i': all.length + 2 }}>
            {cta?.href ? (
              <Button href={cta.href} size="lg" block iconStart={cta.icon}>
                {cta.label}
              </Button>
            ) : null}
            {contact?.phoneHref ? (
              <Button href={contact.phoneHref} size="lg" variant="glass" block iconStart="phone">
                {labels.callTheClinic}
              </Button>
            ) : null}
          </div>

          <div className="menu-item mt-7 space-y-2 border-t border-ink/10 pt-5 text-[15px] text-ink-2" style={{ '--i': all.length + 3 }}>
            {contact?.phone ? (
              <a href={contact.phoneHref} className="flex items-center gap-3 hover:text-ink">
                <Icon name="phone" size={16} className="text-primary" />
                {contact.phone}
              </a>
            ) : null}
            {contact?.email ? (
              <a href={contact.emailHref} className="flex items-center gap-3 hover:text-ink">
                <Icon name="mail" size={16} className="text-primary" />
                {contact.email}
              </a>
            ) : null}
            {contact?.address ? (
              <p className="flex items-start gap-3">
                <Icon name="pin" size={16} className="mt-1 text-primary" />
                {contact.address}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>
  );
}
