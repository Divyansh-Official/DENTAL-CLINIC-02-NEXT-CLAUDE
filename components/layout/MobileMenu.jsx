'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import OpenStatus from '@/components/ui/OpenStatus';
import { DURATION } from '@/lib/motion';
import { prefersCalm } from '@/lib/hooks';

/**
 * The phone menu, opening *under* the header: the header never moves — its
 * menu button simply turns into a close button — while the page behind blurs
 * into a glass backdrop and the panel drops in below it on a spring.
 *
 * It is a non-modal <dialog> so it can sit beneath the header, and does the
 * modal work itself: everything outside the header and the menu is made
 * inert (so focus and screen readers stay inside), Escape and a tap on the
 * backdrop close it, focus returns to the menu button, and the page behind
 * holds still (html:has(dialog[open]) in globals.css).
 */
function setOutsideInert(dialog, inert) {
  const header = dialog?.parentElement?.querySelector(':scope > .site-header');
  Array.from(document.body.children).forEach((element) => {
    if (element === dialog || element === header || element.tagName === 'SCRIPT') return;
    if (inert) element.setAttribute('inert', '');
    else element.removeAttribute('inert');
  });
}

export default function MobileMenu({ id, open, onClose, toggleRef, items, extra, cta, contact, status, labels, isActive, pathname }) {
  const dialogRef = useRef(null);
  const firstPath = useRef(pathname);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) {
      dialog.removeAttribute('data-closing');
      dialog.show();
      setOutsideInert(dialog, true);
      dialog.querySelector('a, button')?.focus({ preventScroll: true });
      return undefined;
    }
    if (!open && dialog.open) {
      setOutsideInert(dialog, false);
      if (dialog.contains(document.activeElement)) toggleRef?.current?.focus({ preventScroll: true });
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
  }, [open, toggleRef]);

  /* Escape closes it, as it would a modal. */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  /* Never leave the page inert if the menu unmounts while open. */
  useEffect(() => () => setOutsideInert(dialogRef.current, false), []);

  /* Close after navigating — but not on first mount. */
  useEffect(() => {
    if (pathname !== firstPath.current) {
      firstPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  const all = [...items, ...extra];

  return (
    <dialog ref={dialogRef} id={id} className="menu-sheet" aria-label={labels.menu}>
      <div className="menu-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="menu-panel glass relative mx-auto mt-[calc(var(--header-h)+2px)] flex max-h-[calc(100dvh-var(--header-h)-14px)] w-[calc(100%-20px)] max-w-xl flex-col overflow-hidden rounded-[30px] bg-card/80">
        <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-7 pt-5">
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
