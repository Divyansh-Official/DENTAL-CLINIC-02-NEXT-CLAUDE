'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { canAnimate, expand, morphSurface } from '@/lib/morph';

/**
 * A link whose card zooms open into the page it leads to.
 *
 * Wrap a card in it (or use it as the card). The surface that grows is the
 * element marked `data-morph-source` inside it, or the whole link. A click
 * with a modifier key, a middle click and reduced motion all get a normal
 * Next.js link. The zoom runs beneath the header, which never moves.
 *
 * `data-morph-key` lets a closing page find this card again and shrink back
 * into it.
 */
export default function MorphLink({ href, children, onClick, ...rest }) {
  const router = useRouter();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!canAnimate()) return;
    event.preventDefault();
    expand({ source: morphSurface(event.currentTarget), go: () => router.push(href) });
  };

  return (
    <Link href={href} onClick={handleClick} data-morph-key={href} {...rest}>
      {children}
    </Link>
  );
}
