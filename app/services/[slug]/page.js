import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/sections/PageHero';
import ReadyBanner from '@/components/sections/ReadyBanner';
import { ServiceCard } from '@/components/sections/ServicesGrid';
import JsonLd from '@/components/layout/JsonLd';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { clinic, clinicHours, clinicWhatsapp, getService, getServiceSlugs, serviceItems, t } from '@/lib/data';
import { breadcrumbSchema, faqSchema, pageMetadata, serviceSchema } from '@/lib/seo';

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

/* A slug that is not in services.json returns 404 rather than rendering empty. */
export const dynamicParams = false;

export function generateMetadata({ params }) {
  const service = getService(params.slug);
  if (!service) return { title: 'Service not found', robots: { index: false, follow: false } };
  return pageMetadata({
    title: service.title,
    description: service.excerpt,
    path: `/services/${service.slug}`,
    image: service.image?.src
  });
}

export default function ServiceDetailPage({ params }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const related = serviceItems().filter((item) => item.slug !== service.slug).slice(0, 3);
  const crumbs = [{ label: 'Services', href: '/services' }, { label: service.title }];
  const whatsapp = clinicWhatsapp();

  return (
    <>
      <JsonLd
        schema={[serviceSchema(service), breadcrumbSchema(crumbs, t('common.home')), faqSchema(service.faq)]}
      />

      <PageHero
        eyebrow={t('services.detail.eyebrow')}
        title={service.title}
        intro={service.excerpt}
        breadcrumb={crumbs}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/book-appointment" size="lg">
            {t('services.detail.bookCta')}
          </Button>
          {service.duration ? (
            <span className="flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-[12.5px] text-primary">
              <Icon name="clock" size={13} tone="accent" />
              {service.duration}
            </span>
          ) : null}
          {service.priceFrom ? (
            <span className="flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-[12.5px] text-primary">
              <Icon name="wallet" size={13} tone="accent" />
              {t('common.from')} {service.priceFrom}
            </span>
          ) : null}
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="relative aspect-[4/2.6] w-full overflow-hidden rounded-panel">
                <Image
                  src={service.image.src}
                  alt={service.image.alt || ''}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="body-lead mt-8 text-[15px]">{service.description}</p>
            </Reveal>

            {service.includes?.length ? (
              <>
                <Reveal delay={0.15}>
                  <h2 className="display-md mt-10 text-[24px]">{t('services.detail.includesTitle')}</h2>
                </Reveal>
                <RevealGroup className="mt-6 space-y-3">
                  {service.includes.map((item) => (
                    <RevealItem key={item} className="flex items-start gap-3 rounded-card border border-line bg-card p-4">
                      <Icon name="check-circle" size={16} tone="accent" className="mt-0.5" />
                      <span className="text-[13.5px] leading-relaxed text-primary">{item}</span>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </>
            ) : null}

            {service.faq?.length ? (
              <Reveal delay={0.1}>
                <h2 className="display-md mt-12 text-[24px]">{t('services.detail.faqTitle')}</h2>
                <Accordion items={service.faq} className="mt-5" />
              </Reveal>
            ) : null}
          </div>

          <aside className="lg:col-span-5">
            <Reveal className="sticky top-[calc(var(--nav-h)+24px)]">
              <div className="grain overflow-hidden rounded-panel bg-primary p-7">
                <Icon name={service.icon} size={30} tone="accent" />
                <h2 className="mt-5 font-display text-[24px] leading-snug text-on-primary">
                  {t('services.detail.aside.title')}
                </h2>
                <p className="mt-3 text-[13px] leading-relaxed text-on-primary/60">
                  {t('services.detail.aside.text')}
                </p>

                <div className="mt-7 space-y-3">
                  <a
                    href={clinic.contact.phoneHref}
                    className="flex items-center justify-between rounded-card border border-on-primary/[0.15] px-5 py-4 transition-colors duration-300 hover:border-accent hover:bg-accent/10"
                  >
                    <span className="flex items-center gap-3 text-[13.5px] text-on-primary">
                      <Icon name="phone" size={15} tone="accent" />
                      {clinic.contact.phone}
                    </span>
                    <Icon name="arrow-right" size={13} className="text-on-primary" />
                  </a>
                  {whatsapp ? (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-card border border-on-primary/[0.15] px-5 py-4 transition-colors duration-300 hover:border-accent hover:bg-accent/10"
                    >
                      <span className="flex items-center gap-3 text-[13.5px] text-on-primary">
                        <Icon name="whatsapp" size={15} tone="accent" />
                        {t('services.detail.aside.whatsappLabel')}
                      </span>
                      <Icon name="arrow-right" size={13} className="text-on-primary" />
                    </a>
                  ) : null}
                </div>

                <div className="mt-7 border-t border-on-primary/[0.12] pt-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-on-primary/45">
                    {t('common.openingHours')}
                  </p>
                  {clinicHours().map((slot) => (
                    <p key={slot.days} className="mt-2 flex justify-between text-[12.5px] text-on-primary/70">
                      <span>{slot.days}</span>
                      <span>{slot.time}</span>
                    </p>
                  ))}
                </div>
              </div>

              {related.length ? (
                <div className="mt-5 rounded-card border border-line bg-card p-6">
                  <p className="eyebrow">{t('services.detail.alsoOffered')}</p>
                  <ul className="mt-4 space-y-2.5">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/services/${item.slug}`}
                          className="group flex items-center justify-between gap-4 text-[13.5px] text-primary"
                        >
                          <span className="transition-colors group-hover:text-accent">{item.title}</span>
                          <Icon name="arrow-right" size={12} tone="accent" className="transition-transform duration-500 ease-ios group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Reveal>
          </aside>
        </div>
      </section>

      {related.length ? (
        <section className="section-pad bg-surface-50">
          <div className="shell">
            <h2 className="display-lg">{t('services.detail.relatedTitle')}</h2>
            <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RevealItem key={item.slug} className="h-full">
                  <ServiceCard service={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <ReadyBanner />
    </>
  );
}
