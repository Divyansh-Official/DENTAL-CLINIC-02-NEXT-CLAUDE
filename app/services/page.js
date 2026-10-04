import JsonLd from '@/components/layout/JsonLd';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import ProcessSteps from '@/components/sections/shared/ProcessSteps';
import ServicesIndex from '@/components/sections/services/ServicesIndex';
import { clinic, clinicPhone, isEnabled, journey, journeySteps, page, serviceItems, services, t } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

/**
 * /services — PageHero → ServicesIndex → ProcessSteps → CtaBanner
 */
const meta = page('services');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: services.section?.intro, path: '/services' });

export default function ServicesPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />
      <PageHero
        eyebrow={services.section?.eyebrow}
        title={services.section?.title}
        accent={services.section?.accent}
        intro={services.section?.intro}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
      />
      <ServicesIndex
        services={serviceItems()}
        pricingHref={isEnabled('treatments') ? '/treatments' : null}
        labels={{ from: t('common.from'), learnMore: t('common.learnMore'), pricingLink: t('services.pricingLink') }}
      />
      <ProcessSteps steps={journeySteps()} {...journey.section} tone="tone-white" />
      <CtaBanner banner={clinic.banners?.ready} phone={clinicPhone()} labels={{ call: t('common.callTheClinic') }} />
    </>
  );
}
