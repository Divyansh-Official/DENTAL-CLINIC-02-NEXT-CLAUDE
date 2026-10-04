import Link from 'next/link';
import Icon from './Icon';
import { isExternal, linkAttrs } from '@/lib/format';

/* Literal class names, so Tailwind's content scan keeps every variant. */
const VARIANTS = {
  primary: 'btn-primary',
  dark: 'btn-dark',
  light: 'btn-light',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  glass: 'btn-glass'
};
const SIZES = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' };

/**
 * The pill button.
 *
 *   variant   primary · dark · light · outline · ghost · glass
 *   size      sm · md · lg
 *   block     full width (the menu and tab bar CTAs)
 *
 * Internal paths use next/link; tel:, mailto: and external URLs are plain
 * anchors, and only http(s) links open in a new tab. Pressing squishes the
 * button on a spring (see .btn in globals.css). Works in server and client
 * components alike.
 */
export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconStart,
  block = false,
  className = '',
  ariaLabel,
  type = 'button',
  onClick,
  ...rest
}) {
  const classes = ['btn', SIZES[size] || SIZES.md, VARIANTS[variant] || VARIANTS.primary, block ? 'btn-block' : '', className].filter(Boolean).join(' ');
  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 19 : 17;
  const inner = (
    <>
      {iconStart ? <Icon name={iconStart} size={iconSize} /> : null}
      <span>{children}</span>
      {icon ? <Icon name={icon} size={iconSize} /> : null}
    </>
  );

  if (href) {
    if (isExternal(href)) {
      return (
        <a href={href} className={classes} aria-label={ariaLabel} {...linkAttrs(href)} {...rest}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel} {...rest}>
      {inner}
    </button>
  );
}
