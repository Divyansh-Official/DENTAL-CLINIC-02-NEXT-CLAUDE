import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

/**
 * Article sidebar: who wrote it. When the author is a dentist in
 * doctors.json, their photograph and a link to their profile appear;
 * otherwise it falls back to the clinic.
 */
export default function ArticleAside({ author, doctor, phone, labels = {} }) {
  return (
    <aside className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
      <div className="sheen rounded-panel p-6 sm:p-7">
        <p className="t-caption">{labels.writtenBy}</p>
        <div className="mt-4 flex items-center gap-4">
          {doctor?.image?.src ? (
            <span className="media relative h-14 w-14 flex-none overflow-hidden rounded-full">
              <Image src={doctor.image.src} alt="" fill sizes="56px" className="object-cover object-top" />
            </span>
          ) : (
            <span className="icon-tile" style={{ '--s': '56px' }}>
              <Icon name="tooth" size={26} />
            </span>
          )}
          <span className="min-w-0">
            <span className="block text-[17px] font-semibold tracking-[-0.015em] text-fg">{author}</span>
            {doctor?.role ? <span className="block text-[14px] text-fg-2">{doctor.role}</span> : null}
          </span>
        </div>
        <p className="t-small mt-4">{labels.practisingAt}</p>
        <div className="mt-6 space-y-2">
          {doctor?.href ? (
            <Link
              href={doctor.href}
              className="flex items-center justify-between rounded-2xl bg-fg/[0.045] px-4 py-3.5 text-[15px] font-medium text-fg transition-colors hover:bg-fg/[0.08]"
            >
              {labels.viewProfile}
              <Icon name="chevron-right" size={16} strokeWidth={2} className="text-fg-3" />
            </Link>
          ) : null}
          {phone?.href ? (
            <a
              href={phone.href}
              className="flex items-center justify-between rounded-2xl bg-fg/[0.045] px-4 py-3.5 text-[15px] font-medium text-fg transition-colors hover:bg-fg/[0.08]"
            >
              <span className="flex items-center gap-3">
                <Icon name="phone" size={17} className="text-primary" />
                {phone.value}
              </span>
              <Icon name="chevron-right" size={16} strokeWidth={2} className="text-fg-3" />
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
