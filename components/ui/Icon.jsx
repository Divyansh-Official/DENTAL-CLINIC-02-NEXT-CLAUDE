import { getIcon } from '@/lib/icons';

/**
 * Inline SVG icon — server-rendered, no network request, coloured by
 * `currentColor` so it follows the surrounding text and the brand.
 *
 * Decorative by default and hidden from assistive technology. Pass `label`
 * only when the icon is the sole carrier of meaning, such as an icon button.
 */
export default function Icon({ name, size = 20, className = '', strokeWidth = 1.6, label }) {
  const icon = getIcon(name);
  const filled = Boolean(icon.filled);

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : strokeWidth}
      strokeLinecap={filled ? undefined : 'round'}
      strokeLinejoin={filled ? undefined : 'round'}
      className={className || undefined}
      style={{ width: size, height: size, flexShrink: 0 }}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {label ? <title>{label}</title> : null}
      {icon.d.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
