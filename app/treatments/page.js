import { notFound } from 'next/navigation';
import PageHero from '@/components/sections/PageHero';
import TreatmentTable from '@/components/sections/TreatmentTable';
import ReadyBanner from '@/components/sections/ReadyBanner';
import Testimonials from '@/components/sections/Testimonials';
import JsonLd from '@/components/layout/JsonLd';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { isEnabled, patientInfo, t, treatments } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const CRUMBS = [{ label: 'Treatments' }];

export const metadata = pageMetadata({
  title: 'Treatments & Pricing',
  description: treatments.section.intro,
  path: '/treatments'
});

export default function TreatmentsPage() {
  /* Honours the feature flag: a clinic that does not publish prices turns the
     page off in site.json and the route disappears from the nav and sitemap. */
  if (!isEnabled('treatments')) notFound();

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS, t('common.home'))} />

      <PageHero
        eyebrow={treatments.section.eyebrow}
        title={treatments.section.title}
        italicWord={treatments.section.italicWord}
        intro={treatments.section.intro}
        breadcrumb={CRUMBS}
      />

      <section className="section-pad">
        <div className="shell">
          <TreatmentTable />
        </div>
      </section>

      <section className="section-pad bg-surface-50">
        <div className="shell">
          <SectionHeading
            eyebrow={t('treatments.payments.eyebrow')}
            title={patientInfo.payments.title}
            italicWord={t('treatments.payments.italicWord')}
            intro={t('treatments.payments.intro')}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-card border border-line bg-card p-8">
                <Icon name={patientInfo.payments.icon || 'wallet'} size={26} tone="accent" />
                <h3 className="mt-5 font-display text-[24px] text-primary">{t('treatments.payments.methodsTitle')}</h3>
                <ul className="mt-5 space-y-2.5">
                  {patientInfo.payments.methods.map((method) => (
                    <li key={method} className="flex items-center gap-3 text-[14.5px] text-primary">
                      <Icon name="check" size={11} tone="accent" />
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-card border border-line bg-card p-8">
                <Icon name={patientInfo.payments.insurance.icon || 'insurance'} size={26} tone="accent" />
                <h3 className="mt-5 font-display text-[24px] text-primary">{t('treatments.payments.insuranceTitle')}</h3>
                <p className="body-lead mt-4 text-[14.5px]">{patientInfo.payments.insurance.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {patientInfo.payments.insurance.partners.map((partner) => (
                    <li key={partner} className="rounded-full border border-line px-3.5 py-1.5 text-[13.5px] text-ink-muted">
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {isEnabled('testimonials') ? <Testimonials /> : null}
      <ReadyBanner />
    </>
  );
}
