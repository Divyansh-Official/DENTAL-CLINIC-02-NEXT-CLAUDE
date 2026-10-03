'use client';

import { useEffect, useId, useRef } from 'react';
import Icon from './Icon';
import { DURATION } from '@/lib/motion';
import { prefersCalm } from '@/lib/hooks';

/**
 * iOS sheet on a native <dialog>.
 *
 * showModal() gives everything a modal needs for free: the rest of the page
 * becomes inert, focus moves in and returns to the trigger on close, Escape
 * closes it, and the page behind holds still (html:has(dialog[open]) in
 * globals.css). It rises on a bouncy spring, leaves on a quick fall, and on a
 * phone it docks to the bottom edge with a grabber that can be dragged down
 * to dismiss — past 120px or on a fast flick, the same two rules UIKit uses.
 */
export default function Sheet({ open, onClose, title, children, width = 760, closeLabel = 'Close', footer = null }) {
  const dialogRef = useRef(null);
  const panelRef = useRef(null);
  const titleId = useId();
  const drag = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (open && !dialog.open) {
      dialog.removeAttribute('data-closing');
      dialog.showModal();
      /* Focus the sheet itself rather than its close button, so a mouse user
         does not see a focus ring appear; Tab still reaches every control. */
      panelRef.current?.focus({ preventScroll: true });
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
        if (panelRef.current) panelRef.current.style.transform = '';
      }, DURATION.exit);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  /* Escape: let React drive the close so the exit animation plays. */
  const onCancel = (event) => {
    event.preventDefault();
    onClose?.();
  };

  /* A click on the dialog box itself (outside the panel) is the backdrop. */
  const onClick = (event) => {
    if (event.target === dialogRef.current) onClose?.();
  };

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' || window.innerWidth >= 640) return;
    drag.current = { y: event.clientY, t: performance.now(), dy: 0 };
    panelRef.current.style.transition = 'none';
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    const dy = Math.max(0, event.clientY - drag.current.y);
    drag.current.dy = dy;
    panelRef.current.style.transform = `translate3d(0, ${dy}px, 0)`;
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    const { dy, t } = drag.current;
    const velocity = dy / Math.max(1, performance.now() - t);
    drag.current = null;
    const panel = panelRef.current;
    panel.style.transition = `transform var(--snappy-ms) var(--spring-snappy)`;
    if (dy > 120 || velocity > 0.7) {
      onClose?.();
    } else {
      panel.style.transform = '';
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      aria-labelledby={titleId}
      onCancel={onCancel}
      onClick={onClick}
      style={{ '--sheet-w': `${width}px` }}
    >
      <div ref={panelRef} className="sheet-panel outline-none" tabIndex={-1}>
        <div
          className="relative z-10 flex-none border-b border-black/[0.06] bg-card/80 px-5 pb-4 pt-3 backdrop-blur-xl sm:px-7 sm:pt-5"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="mx-auto mb-3 h-[5px] w-10 rounded-full bg-black/15 sm:hidden" aria-hidden="true" />
          <div className="flex items-center justify-between gap-4">
            <h2 id={titleId} className="t-headline truncate">
              {title}
            </h2>
            <button type="button" onClick={onClose} className="icon-btn flex-none bg-black/[0.06] hover:bg-black/10" aria-label={closeLabel}>
              <Icon name="close" size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="sheet-scroll px-5 pb-8 pt-5 sm:px-7 sm:pb-9">{children}</div>
        {footer ? <div className="flex-none border-t border-black/[0.06] px-5 py-4 sm:px-7">{footer}</div> : null}
      </div>
    </dialog>
  );
}
