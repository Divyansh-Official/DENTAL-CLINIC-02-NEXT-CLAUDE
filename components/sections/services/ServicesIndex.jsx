import Reveal from '@/components/ui/Reveal';
import TextLink from '@/components/ui/TextLink';
import ServiceCard from '@/components/sections/shared/ServiceCard';

/** Services index: every service as a card, three to a row on desktop. */
export default function ServicesIndex({ services = [], labels = {}, pricingHref }) {
  if (!services.length) return null;

  return (
    <section className="tone-gray section">
      <div className="shell">
        <ul className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} index={index % 3}>
              <ServiceCard service={service} labels={labels} />
            </Reveal>
          ))}
        </ul>
        {pricingHref && labels.pricingLink ? (
          <div className="mt-12 text-center">
            <TextLink href={pricingHref}>{labels.pricingLink}</TextLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
