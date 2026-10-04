'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

/** Copies a number to the clipboard and confirms with an iOS-style swap. */
export default function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', className = '' }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Clipboard API is denied outside a secure context; fall back. */
      const field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
      } catch {
        /* The number is still visible and tappable. */
      }
      document.body.removeChild(field);
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`icon-btn h-10 w-10 bg-fg/[0.06] text-fg hover:bg-fg/10 ${className}`}
      aria-label={copied ? copiedLabel : `${label} ${value}`}
    >
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
      <Icon name={copied ? 'check' : 'copy'} size={16} strokeWidth={copied ? 2.2 : 1.6} className={copied ? 'text-[#30D158]' : ''} />
    </button>
  );
}
