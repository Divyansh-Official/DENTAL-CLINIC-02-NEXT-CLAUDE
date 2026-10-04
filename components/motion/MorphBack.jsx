'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Icon from '@/components/ui/Icon';
import { collapse } from '@/lib/morph';

/**
 * The glass "Back" control at the top of a page a card opened into. It
 * shrinks the page back into the card it came from — stepping back in
 * history when the visitor arrived by tapping that card, otherwise opening
 * `href` (the section's index) and shrinking into the card found there.
 *
 * It is a real link to `href`, so it works with JavaScript off, in a new
 * tab, and for crawlers.
 */
export default function MorphBack({ href, label, glass = true, className = '' }) {
  const router = useRouter();

  const onClick = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    collapse({ router, fallbackHref: href });
  };

  const inner = (
    <>
      <Icon name="chevron-left" size={18} strokeWidth={2.1} />
      <span>{label}</span>
    </>
  );

  const classes = 'inline-flex h-11 items-center gap-1 rounded-full pl-2.5 pr-4 text-[15px] font-medium tracking-[-0.012em]';

  if (!glass) {
    return (
      <Link href={href} onClick={onClick} className={`btn-glass-dark ${classes} ${className}`}>
        {inner}
      </Link>
    );
  }

  return (
    <LiquidGlass
      as={Link}
      href={href}
      onClick={onClick}
      radius={999}
      tone="dark"
      strength="soft"
      elevation="raised"
      interactive
      className={`${classes} ${className}`}
    >
      {inner}
    </LiquidGlass>
  );
}
