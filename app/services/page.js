import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/sections/PageHero';
import ProcessSection from '@/components/sections/ProcessSection';
import ReadyBanner from '@/components/sections/ReadyBanner';
import JsonLd from '@/components/layout/JsonLd';
import Icon from '@/components/ui/Icon';
import TextLink from '@/components/ui/TextLink';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { isEnabled, serviceItems, services, t } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const CRUMBS = [{ label: 'Services' }];

export const metadata = pageMetadata({
  title: 'Services',
  description: services.section.intro,
  path: '/services'
});

export default function ServicesPage() {
  const items = serviceItems();

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS, t('common.home'))} />

      <PageHero
        eyebrow={services.section.eyebrow}
        title={`${services.section.title} ${services.section.titleSecondLine}`}
        italicWord={services.section.italicWords}
        intro={services.section.intro}
        breadcrumb={CRUMBS}
      />

      <section className="section-pad">
        <div className="shell">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <RevealItem key={service.slug} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-card transition-all duration-500 ease-ios hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <span className="relative block aspect-[4/2.6] w-full overflow-hidden bg-surface-200">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt || ''}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1100ms] ease-ios group-hover:scale-[1.06]"
                    />
                    <span className="material absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full text-primary">
                      <Icon name={service.icon} size={18} />
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-[20px] text-primary transition-colors duration-500 group-hover:text-accent">
                      {service.title}
                    </h2>
                    <span className="mt-3 block text-[13px] leading-relaxed text-ink-muted">{service.excerpt}</span>

                    <span className="mt-5 flex items-center gap-4 border-t border-line pt-4 text-[11.5px] text-ink-faint">
                      <span className="flex items-center gap-1.5">
                        <Icon name="clock" size={12} tone="accent" />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Icon name="wallet" size={12} tone="accent" />
                        {t('common.from')} {service.priceFrom}
                      </span>
                    </span>

                    <span className="mt-5 inline-flex items-center gap-2 text-[12.5px] text-primary">
                      {t('common.viewDetails')}
                      <Icon name="arrow-right" size={12} tone="accent" className="transition-transform duration-500 ease-ios group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          {isEnabled('treatments') ? (
            <div className="mt-10">
              <TextLink href="/treatments" tone="primary">
                {t('services.pricingLink')}
              </TextLink>
            </div>
          ) : null}
        </div>
      </section>

      <ProcessSection />
      <ReadyBanner />
    </>
  );
}
