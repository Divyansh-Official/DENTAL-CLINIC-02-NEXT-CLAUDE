import Image from 'next/image';
import Link from 'next/link';
import { clinic } from '@/lib/data';

/**
 * Wordmark.
 *
 * The tooth is drawn inline rather than fetched, because the logo must render
 * on first paint and must never depend on a network. Both the name and the
 * colours come from data, so a clinic that has no logo file still gets a
 * correct, on-brand mark. Drop a file at identity.logo.src to replace it.
 */
export default function Logo({ tone = 'primary', className = '' }) {
  const { identity } = clinic;
  const colorVar = tone === 'surface' ? 'var(--c-surface)' : 'var(--c-primary)';
  const color = `rgb(${colorVar})`;
  const accent = 'rgb(var(--c-accent))';
  const label = identity.legalName || identity.name;

  if (identity.logo?.src) {
    return (
      <Link href="/" className={`block ${className}`} aria-label={label}>
        <Image
          src={identity.logo.src}
          alt={identity.logo.alt || label}
          width={180}
          height={44}
          priority
          className="h-9 w-auto object-contain"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`} aria-label={label}>
      <span className="relative grid h-9 w-9 place-items-center">
        <svg viewBox="0 0 24 28" width="26" height="30" fill="none" aria-hidden="true" focusable="false">
          <path
            d="M12 2.2c-1.9 0-2.9 1-4.6 1C4.9 3.2 3 5.4 3 8.4c0 4.1 1.3 5.5 2 10.1.5 3.1 1 4.9 2.3 4.9 1.6 0 1.7-2.7 2.3-5.5.4-1.7.9-2.9 2.4-2.9s2 1.2 2.4 2.9c.6 2.8.7 5.5 2.3 5.5 1.3 0 1.8-1.8 2.3-4.9.7-4.6 2-6 2-10.1 0-3-1.9-5.2-4.4-5.2-1.7 0-2.7 1-4.6 1Z"
            stroke={color}
            strokeWidth="1.3"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-ios group-hover:stroke-[1.7]"
          />
          <circle
            cx="12"
            cy="9.6"
            r="1.5"
            fill={accent}
            className="origin-center transition-transform duration-700 ease-ios group-hover:scale-125"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[19px] tracking-[0.22em]" style={{ color }}>
          {(identity.name || '').toUpperCase()}
        </span>
        {identity.suffix ? (
          <span
            className="mt-1 block font-body text-[8.5px] uppercase tracking-[0.42em]"
            style={{ color: accent }}
          >
            {identity.suffix}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
