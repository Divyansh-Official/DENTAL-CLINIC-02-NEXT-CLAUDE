import { notFound } from 'next/navigation';
import JsonLd from '@/components/layout/JsonLd';
import FaqExplorer from '@/components/sections/patient-info/FaqExplorer';
import FirstVisitSteps from '@/components/sections/patient-info/FirstVisitSteps';
import PolicyCards from '@/components/sections/patient-info/PolicyCards';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import SafetyStandards from '@/components/sections/shared/SafetyStandards';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import { clinic, clinicPhone, isEnabled, page, patientInfo, t } from '@/lib/data';
import { breadcrumbSchema, faqSchema, pageMetadata } from '@/lib/seo';

/**
 * /patient-info — PageHero → FirstVisitSteps → SafetyStandards →
 *                 FaqExplorer → PolicyCards → CtaBanner
 * The FAQ is emitted as FAQPage structured data, eligible for a rich result.
 */
const meta = page('patientInfo');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: patientInfo.section?.intro, path: '/patient-info' });

export default function PatientInfoPage() {
  if (!isEnabled('patientInfo')) notFound();
  const phone = clinicPhone();
  const faq = Array.isArray(patientInfo.faq) ? patientInfo.faq : [];

  return (
    <>
      <JsonLd schema={[breadcrumbSchema(CRUMBS), faqSchema(faq)]} />
      <PageHero
        eyebrow={patientInfo.section?.eyebrow}
        title={patientInfo.section?.title}
        accent={patientInfo.section?.accent}
        intro={patientInfo.section?.intro}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
      />

      <FirstVisitSteps
        eyebrow={t('patientInfo.firstVisit.eyebrow')}
        title={patientInfo.firstVisit?.title}
        accent={t('patientInfo.firstVisit.accent')}
        steps={patientInfo.firstVisit?.steps || []}
      />

      <SafetyStandards
        eyebrow={t('patientInfo.safety.eyebrow')}
        title={patientInfo.safety?.title}
        accent={t('patientInfo.safety.accent')}
        points={patientInfo.safety?.points || []}
        image={clinic.about?.interiorImage}
      />

      {faq.length ? (
        <section className="tone-white section">
          <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeader align="left" eyebrow={t('patientInfo.faq.eyebrow')} title={t('patientInfo.faq.title')} accent={t('patientInfo.faq.accent')} />
              <Reveal className="tile mt-8 bg-tile p-6 sm:p-7">
                <p className="t-small">{t('patientInfo.faq.helpText')}</p>
                {phone.href ? (
                  <a href={phone.href} className="link-more mt-4 text-[16px]">
                    <Icon name="phone" size={16} />
                    {phone.value}
                  </a>
                ) : null}
              </Reveal>
            </div>
            <FaqExplorer
              items={faq}
              labels={{
                searchLabel: t('patientInfo.faq.searchLabel'),
                searchPlaceholder: t('patientInfo.faq.searchPlaceholder'),
                noResults: t('patientInfo.faq.noResults', { query: '{query}' })
              }}
            />
          </div>
        </section>
      ) : null}

      <PolicyCards eyebrow={t('patientInfo.policiesEyebrow')} policies={patientInfo.policies || []} />

      <CtaBanner banner={clinic.banners?.ready} phone={phone} labels={{ call: t('common.callTheClinic') }} />
    </>
  );
}
