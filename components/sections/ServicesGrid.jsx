'use client';

import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import SectionHeading from '@/components/ui/SectionHeading';
import TextLink from '@/components/ui/TextLink';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { services } from '@/lib/data';

/**
 * Service cards.
 *
 * Roomy paper cards rather than hairline boxes: a large tinted icon plate, a
 * heading with air around it, body copy at a readable size, and a rule above
 * the action so the card has a clear foot. On hover the whole card lifts and
 * the plate fills with brand colour — one state change, not three.
 */
export function ServiceCard({ service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card-surface card-hover group relative flex h-full flex-col p-8"
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-200 text-primary transition-colors duration-500 ease-ios group-hover:bg-primary group-hover:text-on-primary">
        <Icon name={service.icon} size={24} />
      </span>

      <h3 className="display-sm mt-7 transition-colors duration-500 group-hover:text-accent-deep">
        {service.title}
      </h3>
      <p className="body-base mt-3.5 text-[15px]">{service.excerpt}</p>

      <span className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-6 text-[15px] font-medium text-primary">
        <span className="flex items-center gap-4 text-[14.5px] font-normal text-ink-faint">
          {service.duration ? (
            <span className="flex items-center gap-1.5">
              <Icon name="clock" size={13} tone="accent" />
              {service.duration}
            </span>
          ) : null}
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-200 text-primary transition-colors duration-500 ease-ios group-hover:bg-accent group-hover:text-on-accent">
          <Icon name="arrow-right" size={14} />
        </span>
      </span>
    </Link>
  );
}

export default function ServicesGrid({ limit }) {
  const all = Array.isArray(services.items) ? services.items : [];
  const items = limit ? all.slice(0, limit) : all;
  if (!items.length) return null;

  return (
    <section className="section-pad">
      <div className="shell">
        <SectionHeading
          eyebrow={services.section.eyebrow}
          title={services.section.title}
          titleSecondLine={services.section.titleSecondLine}
          italicWord={services.section.italicWords}
          intro={services.section.intro}
        >
          <TextLink href={services.section.cta.href}>{services.section.cta.label}</TextLink>
        </SectionHeading>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
            <RevealItem key={service.slug} className="h-full">
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
