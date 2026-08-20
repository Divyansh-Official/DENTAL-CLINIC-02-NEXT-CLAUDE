import { getIcon } from '@/lib/icons';

/**
 * Inline SVG icon.
 *
 * Server-rendered — no client JavaScript, no network request, no CSS filter
 * trick. Colour comes from `currentColor`, so an icon inherits whatever text
 * colour surrounds it and follows the brand automatically.
 *
 * Icons are decorative by default and hidden from assistive technology. Pass
 * `label` only when the icon is the sole carrier of meaning, such as an
 * icon-only button.
 */

const TONE = {
  primary: 'text-primary',
  accent: 'text-accent',
  surface: 'text-surface',
  ink: 'text-ink',
  muted: 'text-ink-muted',
  'on-primary': 'text-on-primary',
  'on-accent': 'text-on-accent',
  white: 'text-white',
  current: ''
};

export default function Icon({
  name,
  size = 20,
  tone = 'current',
  className = '',
  strokeWidth = 1.4,
  label
}) {
  const icon = getIcon(name);
  const filled = Boolean(icon.filled);
  const tint = TONE[tone] ?? '';

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
      className={`${tint} ${className}`.trim()}
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
