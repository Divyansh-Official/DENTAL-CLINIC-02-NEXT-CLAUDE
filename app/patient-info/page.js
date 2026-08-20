import { notFound } from 'next/navigation';
import PageHero from '@/components/sections/PageHero';
import ReadyBanner from '@/components/sections/ReadyBanner';
import JsonLd from '@/components/layout/JsonLd';
import Accordion from '@/components/ui/Accordion';
import Icon from '@/components/ui/Icon';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { clinic, isEnabled, patientInfo, t } from '@/lib/data';
import { breadcrumbSchema, faqSchema, pageMetadata } from '@/lib/seo';

const CRUMBS = [{ label: 'Patient Info' }];

export const metadata = pageMetadata({
  title: 'Patient Info',
  description: patientInfo.section.intro,
  path: '/patient-info'
});

export default function PatientInfoPage() {
  if (!isEnabled('patientInfo')) notFound();

  return (
    <>
      {/* The FAQ block is eligible for a rich result in search. */}
      <JsonLd schema={[breadcrumbSchema(CRUMBS, t('common.home')), faqSchema(patientInfo.faq)]} />

      <PageHero
        eyebrow={patientInfo.section.eyebrow}
        title={patientInfo.section.title}
        italicWord={patientInfo.section.italicWord}
        intro={patientInfo.section.intro}
        breadcrumb={CRUMBS}
      />

      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            eyebrow={t('patientInfo.firstVisit.eyebrow')}
            title={patientInfo.firstVisit.title}
            italicWord={t('patientInfo.firstVisit.italicWord')}
          />

          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {patientInfo.firstVisit.steps.map((step, index) => (
              <RevealItem key={step.title} className="h-full">
                <div className="group h-full rounded-card border border-line bg-card p-6 transition-all duration-500 ease-ios hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <Icon name={step.icon} size={24} tone="primary" />
                    <span className="font-display text-[13px] text-accent">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-6 font-display text-[17px] text-primary">{step.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted">{step.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section-pad bg-surface-50">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={t('patientInfo.faq.eyebrow')}
              title={t('patientInfo.faq.title')}
              italicWord={t('patientInfo.faq.italicWord')}
            />
            <Reveal delay={0.2}>
              <div className="mt-8 rounded-card border border-line bg-card p-6">
                <p className="text-[13px] leading-relaxed text-ink-muted">{t('patientInfo.faq.helpText')}</p>
                <a
                  href={clinic.contact.phoneHref}
                  className="mt-4 inline-flex items-center gap-2 text-[13.5px] text-primary transition-colors hover:text-accent"
                >
                  <Icon name="phone" size={13} tone="accent" />
                  {clinic.contact.phone}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Accordion items={patientInfo.faq} />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell grid gap-6 lg:grid-cols-2">
          {patientInfo.policies.map((policy) => (
            <Reveal key={policy.id}>
              <article id={policy.id} className="h-full scroll-mt-28 rounded-card border border-line bg-card p-7">
                <h2 className="font-display text-[22px] text-primary">{policy.title}</h2>
                <p className="body-lead mt-4 text-[13.5px]">{policy.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <ReadyBanner />
    </>
  );
}
