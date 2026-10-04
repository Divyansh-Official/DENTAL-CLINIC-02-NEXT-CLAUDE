import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

/**
 * Service detail: the dentists who perform this treatment — every dentist
 * whose `services` in doctors.json lists this slug.
 */
export default function ServiceSpecialists({ doctors = [], title }) {
  if (!doctors.length) return null;

  return (
    <div className="mt-14">
      <Reveal as="h2" className="t-title">
        {title}
      </Reveal>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {doctors.map((doctor, index) => (
          <Reveal as="li" key={doctor.href} index={index % 2}>
            <Link href={doctor.href} className="tile tile-hover group flex items-center gap-4 bg-tile p-4">
              <span className="media relative h-16 w-16 flex-none overflow-hidden rounded-2xl">
                {doctor.image?.src ? <Image src={doctor.image.src} alt="" fill sizes="64px" className="object-cover object-top" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[16px] font-semibold tracking-[-0.015em] text-fg group-hover:text-primary">{doctor.name}</span>
                <span className="block truncate text-[13.5px] text-fg-2">{doctor.specialty || doctor.role}</span>
              </span>
              <Icon name="chevron-right" size={18} strokeWidth={2} className="flex-none text-fg-3" />
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
