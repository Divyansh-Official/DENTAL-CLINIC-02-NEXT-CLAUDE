import Link from 'next/link';
import Icon from '@/components/ui/Icon';

/**
 * Thin promotional strip above the header. It sits in normal flow, so the
 * sticky header starts beneath it and takes over the top edge once it has
 * scrolled away — the two never overlap.
 */
export default function AnnouncementBar({ text, cta }) {
  if (!text) return null;

  return (
    <div className="relative z-[71] bg-ink text-[13.5px] text-white" data-print="hide">
      <div className="shell flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center">
        <span className="text-white/85">{text}</span>
        {cta?.href ? (
          <Link href={cta.href} className="inline-flex items-center gap-1 font-medium text-[#64B5FF] hover:underline hover:underline-offset-4">
            {cta.label}
            <Icon name="chevron-right" size={13} strokeWidth={2} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
