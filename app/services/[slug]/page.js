import { notFound } from 'next/navigation';
import JsonLd from '@/components/layout/JsonLd';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import ServiceCard from '@/components/cards/ServiceCard';
import ServiceAside from '@/components/sections/services/ServiceAside';
import ServiceFaq from '@/components/sections/services/ServiceFaq';
import ServiceHero from '@/components/sections/services/ServiceHero';
import ServiceOverview from '@/components/sections/services/ServiceOverview';
import ServicePricing from '@/components/sections/services/ServicePricing';
import ServiceSpecialists from '@/components/sections/services/ServiceSpecialists';
import SectionHeader from '@/components/ui/SectionHeader';
import Shelf from '@/components/ui/Shelf';
import {
  clinic,
  clinicHours,
  clinicPhone,
  clinicWhatsapp,
  doctorSlug,
  doctorsForService,
  getService,
  getServiceSlugs,
  getTreatmentCategory,
  isEnabled,
  openStatusProps,
  page,
  serviceItems,
  t
} from '@/lib/data';
import { breadcrumbSchema, faqSchema, pageMetadata, serviceSchema } from '@/lib/seo';

/**
 * /services/[slug] — ServiceHero → (ServiceOverview · ServicePricing ·
 * ServiceSpecialists · ServiceFaq | ServiceAside) → related shelf → CtaBanner
 */
export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

/* A slug that is not in services.json returns 404 rather than rendering empty. */
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: t('pages.notFound.title'), robots: { index: false, follow: false } };
  return pageMetadata({ title: service.title, description: service.excerpt, path: `/services/${service.slug}`, image: service.image?.src });
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const crumbs = [{ label: page('services').crumb, href: '/services' }, { label: service.title }];
  const related = serviceItems().filter((item) => item.slug !== service.slug);
  const specialists = doctorsForService(service.slug).map((doctor) => ({ ...doctor, href: `/team/${doctorSlug(doctor)}` }));
  const pricing = isEnabled('treatments') && service.pricing ? getTreatmentCategory(service.pricing) : null;
  const whatsapp = clinicWhatsapp(t('services.detail.whatsappMessage', { service: service.title }));
  const shelf = { previous: t('shelf.previous'), next: t('shelf.next') };

  return (
    <>
      <JsonLd schema={[serviceSchema(service), breadcrumbSchema(crumbs), faqSchema(service.faq)]} />

      <ServiceHero
        service={service}
        crumbs={crumbs}
        whatsappHref={whatsapp}
        glass={isEnabled('liquidGlass')}
        back={{ href: '/services', label: t('common.back') }}
        labels={{
          home: t('common.home'),
          breadcrumb: t('common.breadcrumbLabel'),
          eyebrow: t('services.detail.eyebrow'),
          duration: t('services.detail.durationLabel'),
          priceLabel: t('services.detail.priceLabel'),
          book: t('services.detail.bookCta'),
          whatsapp: t('services.detail.aside.whatsappLabel')
        }}
      />

      <section className="tone-gray section">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <ServiceOverview service={service} labels={{ overview: t('services.detail.overviewTitle'), includes: t('services.detail.includesTitle') }} />
            <ServicePricing
              category={pricing}
              href="/treatments"
              labels={{ title: pricing?.name ? `${t('services.detail.pricingTitle')} · ${pricing.name}` : t('services.detail.pricingTitle'), all: t('services.pricingLink') }}
            />
            <ServiceSpecialists doctors={specialists} title={t('services.detail.specialistsTitle')} />
            <ServiceFaq items={service.faq} title={t('services.detail.faqTitle')} group={`faq-${service.slug}`} />
          </div>
          <ServiceAside
            icon={service.icon}
            phone={clinicPhone()}
            whatsappHref={whatsapp}
            hours={clinicHours()}
            status={openStatusProps()}
            labels={{ title: t('services.detail.aside.title'), text: t('services.detail.aside.text'), whatsapp: t('services.detail.aside.whatsappLabel') }}
          />
        </div>
      </section>

      {related.length ? (
        <section className="tone-white section overflow-clip">
          <div className="shell">
            <SectionHeader align="left" title={t('services.detail.relatedTitle')} size="title" />
          </div>
          <Shelf className="mt-10" label={t('services.detail.relatedTitle')} itemWidth="clamp(270px, 78vw, 350px)" labels={shelf}>
            {related.map((item) => (
              <ServiceCard key={item.slug} service={item} variant="feature" labels={{ from: t('common.from') }} />
            ))}
          </Shelf>
        </section>
      ) : null}

      <CtaBanner banner={clinic.banners?.ready} phone={clinicPhone()} labels={{ call: t('common.callTheClinic') }} tone="tone-white" />
    </>
  );
}
