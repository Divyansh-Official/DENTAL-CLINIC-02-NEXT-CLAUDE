'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';
import { spring, tap } from '@/lib/motion';
import { isExternal, isNewTab, linkAttrs } from '@/lib/format';

const VARIANTS = {
  primary: 'bg-primary text-on-primary hover:bg-primary-600 border border-primary',
  accent: 'bg-accent text-on-accent hover:bg-accent-deep border border-accent',
  outline: 'bg-transparent text-primary border border-primary/25 hover:border-primary/60 hover:bg-primary/[0.04]',
  light: 'bg-card text-primary border border-line hover:border-primary/30 shadow-card',
  ghost: 'bg-transparent text-primary border border-transparent hover:bg-primary/[0.05]'
};

const SIZES = {
  sm: 'h-10 pl-4 pr-2 text-[13px]',
  md: 'h-12 pl-6 pr-2.5 text-[14px]',
  lg: 'h-14 pl-8 pr-3 text-[15px]'
};

const PLATE = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-10 w-10'
};

/**
 * The pill button, with an iOS press response: scales to 96.5% on tap, and
 * the trailing chevron capsule slides a few pixels on hover the way a
 * UITableView disclosure indicator does.
 */
export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon = 'arrow-right',
  onClick,
  className = '',
  type = 'button',
  target,
  rel,
  ariaLabel
}) {
  const reduceMotion = useReducedMotion();
  const onFilled = variant === 'primary' || variant === 'accent';

  const inner = (
    <>
      <span className="relative z-10 whitespace-nowrap tracking-[0.01em]">{children}</span>
      {icon ? (
        <span
          className={`relative z-10 grid place-items-center rounded-full transition-transform duration-500 ease-ios group-hover:translate-x-1 ${
            PLATE[size] || PLATE.md
          } ${onFilled ? 'bg-white/15' : 'bg-primary/[0.06]'}`}
        >
          <Icon name={icon} size={size === 'sm' ? 13 : 15} />
        </span>
      ) : null}
    </>
  );

  const classes = `group relative inline-flex items-center gap-3 rounded-full font-body font-medium transition-colors duration-300 ease-ios ${
    VARIANTS[variant] || VARIANTS.primary
  } ${SIZES[size] || SIZES.md} ${className}`;

  const hover = reduceMotion ? undefined : { y: -2 };
  const press = reduceMotion ? undefined : tap;

  if (href) {
    /* tel: and mailto: must be plain anchors — next/link would try to
       client-navigate them. Only http links open in a new tab. */
    const Wrapper = isExternal(href) ? 'a' : Link;
    return (
      <motion.span className="inline-block" whileTap={press} whileHover={hover} transition={spring.snappy}>
        <Wrapper
          href={href}
          className={classes}
          aria-label={ariaLabel}
          target={target ?? (isNewTab(href) ? linkAttrs(href).target : undefined)}
          rel={rel ?? (isNewTab(href) ? linkAttrs(href).rel : undefined)}
        >
          {inner}
        </Wrapper>
      </motion.span>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
      whileTap={press}
      whileHover={hover}
      transition={spring.snappy}
    >
      {inner}
    </motion.button>
  );
}
