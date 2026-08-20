'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import SectionHeading from '@/components/ui/SectionHeading';
import TextLink from '@/components/ui/TextLink';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { services } from '@/lib/data';
import { tap } from '@/lib/motion';

/**
 * Service cards.
 *
 * On hover the card lifts, its icon plate fills with the brand colour and the
 * body copy shifts to the accent — one continuous state change on the iOS
 * curve, not three unrelated hover effects.
 */
export function ServiceCard({ service }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div whileTap={reduceMotion ? undefined : tap} className="h-full">
      <Link
        href={`/services/${service.slug}`}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-card border border-line bg-card p-6 transition-all duration-500 ease-ios hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-lift"
      >
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-200 text-primary transition-colors duration-500 ease-ios group-hover:bg-primary group-hover:text-on-primary">
            <Icon name={service.icon} size={21} />
          </span>

          <h3 className="mt-6 font-display text-[19px] leading-snug text-primary">{service.title}</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted transition-colors duration-500 group-hover:text-accent-deep">
            {service.excerpt}
          </p>
        </div>

        <span className="mt-7 grid h-9 w-9 place-items-center rounded-full border border-line text-primary transition-all duration-500 ease-ios group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
          <Icon name="arrow-right" size={13} className="transition-transform duration-500 ease-ios group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
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

        {/* Capped at three columns. The previous six-column rule squeezed each
            card to roughly 180px on a wide screen and truncated every excerpt. */}
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
