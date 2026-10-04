import Image from 'next/image';
import Link from 'next/link';

/**
 * Wordmark: an app-icon squircle with the tooth mark, and the clinic's name.
 *
 * Drawn inline so it renders on first paint with no network request, and
 * coloured from the brand gradient so it follows a rebrand. Set
 * identity.logo.src in clinic.json to replace it with a file.
 */
export default function Logo({ name = '', suffix = '', logo, label, compact = false, className = '' }) {
  const accessible = label || [name, suffix].filter(Boolean).join(' ');

  if (logo?.src) {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`} aria-label={accessible}>
        <Image src={logo.src} alt={logo.alt || accessible} width={160} height={40} priority className="h-8 w-auto object-contain" />
      </Link>
    );
  }

  return (
    <Link href="/" className={`group inline-flex min-w-0 items-center gap-2.5 ${className}`} aria-label={accessible}>
      <span className="icon-tile transition-transform duration-500 ease-ios group-hover:scale-105" style={{ '--s': compact ? '34px' : '38px' }}>
        <svg viewBox="0 0 24 24" width={compact ? 19 : 21} height={compact ? 19 : 21} fill="none" aria-hidden="true" focusable="false">
          <path
            d="M8 3.6c-2.4 0-4 1.9-4 4.4 0 3.4 1.1 4.6 1.7 8.5.4 2.6.8 4.1 1.9 4.1 1.4 0 1.5-2.3 2-4.6.3-1.4.7-2.4 2.4-2.4s2.1 1 2.4 2.4c.5 2.3.6 4.6 2 4.6 1.1 0 1.5-1.5 1.9-4.1.6-3.9 1.7-5.1 1.7-8.5 0-2.5-1.6-4.4-4-4.4-1.6 0-2.5.9-4 .9s-2.4-.9-4-.9Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="truncate text-[16px] font-semibold tracking-[-0.02em] text-ink sm:text-[17px]">
        {name}
        {suffix ? <span className="font-medium text-ink-2"> {suffix}</span> : null}
      </span>
    </Link>
  );
}
