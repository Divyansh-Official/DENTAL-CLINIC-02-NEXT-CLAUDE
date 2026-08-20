import Link from 'next/link';
import Icon from './Icon';
import { isExternal, linkAttrs } from '@/lib/format';

const TONE = {
  accent: 'text-accent',
  surface: 'text-surface',
  'on-primary': 'text-on-primary',
  primary: 'text-primary'
};

/** Underline-on-hover text link with the trailing accent arrow. */
export default function TextLink({ href, children, tone = 'accent', className = '', icon = 'arrow-right' }) {
  const Wrapper = isExternal(href) ? 'a' : Link;

  return (
    <Wrapper
      href={href}
      {...linkAttrs(href)}
      className={`group inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.02em] ${
        TONE[tone] || TONE.accent
      } ${className}`}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-ios group-hover:w-full" />
      </span>
      {icon ? <Icon name={icon} size={13} className="transition-transform duration-500 ease-ios group-hover:translate-x-1" /> : null}
    </Wrapper>
  );
}
