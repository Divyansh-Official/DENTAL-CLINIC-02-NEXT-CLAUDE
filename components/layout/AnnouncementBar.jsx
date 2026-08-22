import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { site, text } from '@/lib/data';

/** Thin promotional strip above the header. Off unless features.announcement is true. */
export default function AnnouncementBar() {
  const announcement = site.announcement || {};
  const message = text(announcement.text);
  if (!message) return null;

  return (
    <div className="relative z-[80] bg-primary text-on-primary">
      <div className="shell flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center text-[14.5px]">
        <span>{message}</span>
        {announcement.cta?.href ? (
          <Link
            href={announcement.cta.href}
            className="inline-flex items-center gap-1.5 font-medium text-accent-light underline-offset-4 hover:underline"
          >
            {announcement.cta.label}
            <Icon name="arrow-right" size={12} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
