import SectionHeader from '@/components/ui/SectionHeader';
import Shelf from '@/components/ui/Shelf';
import TextLink from '@/components/ui/TextLink';
import DoctorCard from '@/components/cards/DoctorCard';

/**
 * The dentists as a shelf of portrait cards, each linking to their profile.
 * Used on the home page, the about page and at the foot of every profile.
 */
export default function TeamShelf({ doctors = [], section = {}, labels = {}, linkHref, tone = 'tone-white' }) {
  if (!doctors.length) return null;

  return (
    <section className={`${tone} section overflow-clip`}>
      <div className="shell">
        <SectionHeader align="left" eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro}>
          {linkHref && labels.cta ? <TextLink href={linkHref}>{labels.cta}</TextLink> : null}
        </SectionHeader>
      </div>
      <Shelf className="mt-12" label={section.title} itemWidth="clamp(250px, 72vw, 300px)" labels={labels.shelf}>
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.href} doctor={doctor} href={doctor.href} labels={labels} />
        ))}
      </Shelf>
    </section>
  );
}
