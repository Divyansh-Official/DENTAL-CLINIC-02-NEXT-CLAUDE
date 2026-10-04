import Image from 'next/image';
import Link from 'next/link';
import MorphLink from '@/components/motion/MorphLink';
import ContactActions from '@/components/ui/ContactActions';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';

/**
 * Booking: every dentist's direct line. Call, copy the number, WhatsApp or
 * email them — or open their profile. Only the copy button runs on the
 * client.
 */
export default function SpecialistDirectory({ doctors = [], section = {}, labels = {} }) {
  if (!doctors.length) return null;

  return (
    <section className="tone-gray section">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro} />
        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {doctors.map((doctor, index) => (
            <Reveal as="li" key={doctor.slug} index={index % 2}>
              <article className="tile flex h-full flex-col bg-tile sm:flex-row">
                <MorphLink href={doctor.href} className="media relative block aspect-[4/3] flex-none sm:aspect-auto sm:w-[32%]">
                  {doctor.image?.src ? (
                    <Image src={doctor.image.src} alt={doctor.image.alt || doctor.name} fill sizes="(max-width: 640px) 100vw, 240px" className="object-cover object-top" />
                  ) : null}
                </MorphLink>
                <div className="flex flex-1 flex-col p-6">
                  <p className="t-caption">{doctor.role}</p>
                  <h3 className="t-headline mt-1">
                    <Link href={doctor.href} className="hover:text-primary">
                      {doctor.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[15px] text-fg-2">{doctor.specialty}</p>

                  <dl className="mt-4 space-y-2 text-[14px] text-fg-2">
                    {doctor.availability ? (
                      <div className="flex items-start gap-2.5">
                        <dt className="mt-0.5 flex-none text-primary">
                          <Icon name="clock" size={15} label={labels.availability} />
                        </dt>
                        <dd>{doctor.availability}</dd>
                      </div>
                    ) : null}
                    {doctor.qualification ? (
                      <div className="flex items-start gap-2.5">
                        <dt className="mt-0.5 flex-none text-primary">
                          <Icon name="graduation" size={15} label={labels.qualification} />
                        </dt>
                        <dd>{doctor.qualification}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <ContactActions
                    className="mt-auto pt-6"
                    tone="light"
                    size="md"
                    phone={doctor.contact.phone}
                    phoneHref={doctor.contact.phoneHref}
                    whatsappHref={doctor.contact.whatsappHref}
                    emailHref={doctor.contact.emailHref}
                    labels={{ ...labels, ...doctor.labels }}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
