import Reveal from '@/components/motion/Reveal';
import Icon from '@/components/ui/Icon';

/**
 * A dentist's quick facts — experience, languages, availability, and on a
 * phone their qualification (on a desktop it rides in the hero's glass) —
 * as a row of tiles directly under the profile's hero.
 */
export default function DoctorFacts({ doctor, labels = {} }) {
  const facts = [
    { icon: 'graduation', label: labels.qualification, value: doctor.qualification, phoneOnly: true },
    { icon: 'briefcase', label: labels.experience, value: doctor.experience },
    { icon: 'translate', label: labels.languages, value: Array.isArray(doctor.languages) ? doctor.languages.join(', ') : '' },
    { icon: 'clock', label: labels.availability, value: doctor.availability }
  ].filter((fact) => fact.value);

  if (!facts.length) return null;
  const wide = facts.filter((fact) => !fact.phoneOnly).length;

  return (
    <section className="tone-white section-tight">
      <ul className={`shell grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ${wide >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {facts.map((fact, index) => (
          <Reveal as="li" key={fact.label} index={index} className={`sheen flex items-start gap-4 rounded-card p-5 sm:p-6 ${fact.phoneOnly ? 'lg:hidden' : ''}`}>
            <span className="icon-tile icon-tile-soft" style={{ '--s': '42px' }}>
              <Icon name={fact.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] text-fg-3">{fact.label}</span>
              <span className="mt-0.5 block text-[16px] font-semibold leading-snug tracking-[-0.015em] text-fg">{fact.value}</span>
            </span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
