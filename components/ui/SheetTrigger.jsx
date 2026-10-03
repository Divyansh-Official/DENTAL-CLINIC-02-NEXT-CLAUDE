'use client';

import { useState } from 'react';
import Icon from './Icon';
import Sheet from './Sheet';

/**
 * A button that opens a sheet. The sheet's content is passed as children, so
 * it stays a server-rendered tree (images, copy, links) and only this button
 * and the dialog run on the client.
 */
export default function SheetTrigger({ label, meta, icon = 'play', title, closeLabel, className = 'btn btn-lg btn-glass', width, children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {icon ? (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-on-primary">
            <Icon name={icon} size={12} />
          </span>
        ) : null}
        <span>{label}</span>
        {meta ? <span className="text-fg-3">{meta}</span> : null}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={title || label} closeLabel={closeLabel} width={width}>
        {children}
      </Sheet>
    </>
  );
}
