import Link from 'next/link';
import Icon from './Icon';
import { isExternal, linkAttrs } from '@/lib/format';

/** Apple's "Learn more ›" link: brand colour, chevron that nudges on hover. */
export default function TextLink({ href, children, className = '', icon = 'chevron-right' }) {
  const content = (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} size={14} strokeWidth={2} /> : null}
    </>
  );

  if (isExternal(href)) {
    return (
      <a href={href} className={`link-more ${className}`} {...linkAttrs(href)}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`link-more ${className}`}>
      {content}
    </Link>
  );
}
