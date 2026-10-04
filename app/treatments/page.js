import { notFound } from 'next/navigation';
import JsonLd from '@/components/layout/JsonLd';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import PaymentOptions from '@/components/sections/treatments/PaymentOptions';
import PriceExplorer from '@/components/sections/treatments/PriceExplorer';
import { clinic, clinicPhone, isEnabled, page, patientInfo, t, treatmentCategories, treatments } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

/**
 * /treatments — PageHero → PriceExplorer → PaymentOptions → CtaBanner
 * A clinic that does not publish prices turns `features.treatments` off and
 * the route leaves the nav, footer and sitemap and returns 404.
 */
const meta = page('treatments');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: treatments.section?.intro, path: '/treatments' });

export default function TreatmentsPage() {
  if (!isEnabled('treatments')) notFound();

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />
      <PageHero
        eyebrow={treatments.section?.eyebrow}
        title={treatments.section?.title}
        accent={treatments.section?.accent}
        intro={treatments.section?.intro}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
      />
      <section className="tone-white pb-[var(--section-y)]">
        <div className="shell">
          <PriceExplorer
            categories={treatmentCategories()}
            note={treatments.note}
            labels={{
              tabs: t('treatments.tabsLabel'),
              procedure: t('treatments.columns.procedure'),
              visits: t('treatments.columns.visits'),
              time: t('treatments.columns.time'),
              price: t('treatments.columns.price')
            }}
          />
        </div>
      </section>
      <PaymentOptions
        payments={patientInfo.payments}
        labels={{
          eyebrow: t('treatments.payments.eyebrow'),
          accent: t('treatments.payments.accent'),
          intro: t('treatments.payments.intro'),
          methodsTitle: t('treatments.payments.methodsTitle'),
          insuranceTitle: t('treatments.payments.insuranceTitle')
        }}
      />
      <CtaBanner banner={clinic.banners?.ready} phone={clinicPhone()} labels={{ call: t('common.callTheClinic') }} />
    </>
  );
}
