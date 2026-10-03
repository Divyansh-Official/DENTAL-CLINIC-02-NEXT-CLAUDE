import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

/**
 * A dentist: portrait, role, name, specialty and languages, linking to their
 * profile at /team/<slug>. Purely presentational.
 */
export default function DoctorCard({ doctor, href, labels = {} }) {
  if (!doctor) return null;

  return (
    <Link href={href} className="tile tile-hover group flex h-full flex-col bg-tile">
      <span className="media block aspect-[4/4.5] w-full">
        {doctor.image?.src ? (
          <Image
            src={doctor.image.src}
            alt={doctor.image.alt || doctor.name}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 300px"
            className="object-cover object-top"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-fg-3">
            <Icon name="user" size={48} />
          </span>
        )}
        {doctor.experience ? (
          <span className="glass absolute bottom-3 left-3 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium text-ink">
            <Icon name="award" size={14} className="text-primary" />
            {doctor.experience}
          </span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col p-6">
        <span className="t-caption">{doctor.role}</span>
        <span className="t-headline mt-1 text-fg">{doctor.name}</span>
        {doctor.specialty ? <span className="mt-1.5 text-[15px] leading-snug text-fg-2">{doctor.specialty}</span> : null}
        {doctor.languages?.length ? (
          <span className="mt-4 flex flex-wrap gap-1.5">
            {doctor.languages.map((language) => (
              <span key={language} className="chip min-h-6 px-2.5 text-[12px]">
                {language}
              </span>
            ))}
          </span>
        ) : null}
        <span className="link-more mt-auto pt-5 text-[15px]">
          {labels.viewProfile}
          <Icon name="chevron-right" size={14} strokeWidth={2} />
        </span>
      </span>
    </Link>
  );
}
