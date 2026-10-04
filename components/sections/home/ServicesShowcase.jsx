import SectionHeader from '@/components/ui/SectionHeader';
import Shelf from '@/components/ui/Shelf';
import TextLink from '@/components/ui/TextLink';
import ServiceCard from '@/components/cards/ServiceCard';

/**
 * Home: every service as Apple's "Get to know" shelf — tall photographic
 * tiles that scroll sideways. A service added to services.json simply
 * appears as another tile.
 */
export default function ServicesShowcase({ services = [], section = {}, labels = {} }) {
  if (!services.length) return null;

  return (
    <section className="tone-gray section overflow-clip">
      <div className="shell">
        <SectionHeader align="left" eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro}>
          {section.cta?.href ? <TextLink href={section.cta.href}>{section.cta.label}</TextLink> : null}
        </SectionHeader>
      </div>
      <Shelf className="mt-12" label={section.title} itemWidth="clamp(270px, 78vw, 350px)" labels={labels.shelf}>
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} variant="feature" labels={labels} />
        ))}
      </Shelf>
    </section>
  );
}
