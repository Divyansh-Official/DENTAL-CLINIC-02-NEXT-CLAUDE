'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { spring, tap } from '@/lib/motion';
import { isExternal, isNewTab, linkAttrs } from '@/lib/format';
import { useCalmMotion } from '@/lib/hooks';

const VARIANTS = {
  primary: 'bg-primary text-on-primary hover:bg-primary-600 border border-primary shadow-float',
  accent: 'bg-accent text-on-accent hover:bg-accent-deep border border-accent shadow-float',
  outline: 'bg-transparent text-primary border border-primary/20 hover:border-primary/45 hover:bg-primary/[0.03]',
  light: 'bg-card text-primary border border-transparent shadow-float hover:bg-surface-50',
  ghost: 'bg-transparent text-primary border border-transparent hover:bg-primary/[0.05]'
};

const SIZES = {
  sm: 'h-11 pl-5 pr-2 text-[14.5px] gap-2.5',
  md: 'h-[52px] pl-7 pr-2.5 text-[15px] gap-3',
  lg: 'h-[60px] pl-9 pr-3 text-[16px] gap-4'
};

const PLATE = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-[46px] w-[46px]' };

/**
 * The pill button.
 *
 * Taller and more generously set than a default control, because on a clinic
 * site this is the thing the whole page exists to get tapped. The trailing
 * capsule slides on hover the way a UITableView disclosure indicator does, and
 * the whole button presses to 96.5% on tap.
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
  const calm = useCalmMotion();
  const onFilled = variant === 'primary' || variant === 'accent';

  const inner = (
    <>
      <span className="relative z-10 whitespace-nowrap font-medium tracking-[0.005em]">{children}</span>
      {icon ? (
        <span
          className={`relative z-10 grid place-items-center rounded-full transition-transform duration-500 ease-ios group-hover:translate-x-1 ${
            PLATE[size] || PLATE.md
          } ${onFilled ? 'bg-white/[0.16]' : 'bg-primary/[0.07]'}`}
        >
          <Icon name={icon} size={size === 'sm' ? 13 : 15} />
        </span>
      ) : null}
    </>
  );

  const classes = `group relative inline-flex items-center justify-between rounded-full font-body transition-colors duration-300 ease-ios ${
    VARIANTS[variant] || VARIANTS.primary
  } ${SIZES[size] || SIZES.md} ${className}`;

  const hover = calm ? undefined : { y: -2 };
  const press = calm ? undefined : tap;

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
