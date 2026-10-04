import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';

/**
 * Dentist profile body: the long biography beside their areas of expertise
 * and an education timeline. Every block is optional — a profile with only a
 * short bio still lays out cleanly.
 */
export default function DoctorDetails({ doctor, labels = {} }) {
  const about = Array.isArray(doctor.about) && doctor.about.length ? doctor.about : doctor.bio ? [doctor.bio] : [];
  const expertise = Array.isArray(doctor.expertise) ? doctor.expertise : [];
  const education = Array.isArray(doctor.education) ? doctor.education : [];
  if (!about.length && !expertise.length && !education.length) return null;

  return (
    <section className="tone-gray section">
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        {about.length ? (
          <Reveal>
            <h2 className="t-title">{labels.about}</h2>
            <div className="prose-article mt-6">
              {about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        ) : null}

        <div className="space-y-6">
          {expertise.length ? (
            <Reveal className="tile bg-tile p-6 sm:p-7">
              <h2 className="t-headline">{labels.expertise}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {expertise.map((item) => (
                  <li key={item} className="chip chip-brand min-h-8 px-3.5 text-[13.5px]">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {education.length ? (
            <Reveal className="tile bg-tile p-6 sm:p-7">
              <h2 className="t-headline">{labels.education}</h2>
              <ol className="relative mt-6 space-y-6 border-l border-hair pl-6">
                {education.map((entry) => (
                  <li key={`${entry.degree}-${entry.year}`} className="relative">
                    <span className="absolute -left-[31px] top-0.5 grid h-[13px] w-[13px] place-items-center rounded-full bg-primary ring-4 ring-tile" />
                    <p className="text-[16px] font-semibold tracking-[-0.014em] text-fg">{entry.degree}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[14px] text-fg-2">
                      <Icon name="graduation" size={14} className="text-fg-3" />
                      {[entry.institution, entry.year].filter(Boolean).join(' · ')}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
