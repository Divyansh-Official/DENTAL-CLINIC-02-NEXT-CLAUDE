import JsonLd from '@/components/layout/JsonLd';
import AboutStory from '@/components/sections/about/AboutStory';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import ProcessSteps from '@/components/sections/shared/ProcessSteps';
import SafetyStandards from '@/components/sections/shared/SafetyStandards';
import StatsBand from '@/components/sections/shared/StatsBand';
import TeamShelf from '@/components/sections/shared/TeamShelf';
import TestimonialsShelf from '@/components/sections/shared/TestimonialsShelf';
import Button from '@/components/ui/Button';
import TextLink from '@/components/ui/TextLink';
import {
  clinic,
  clinicPhone,
  clinicStats,
  doctorItems,
  doctors,
  doctorSlug,
  isEnabled,
  journey,
  journeySteps,
  locale,
  navCta,
  page,
  patientInfo,
  rating,
  t,
  testimonialItems,
  testimonials,
  text
} from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

/**
 * /about — PageHero → AboutStory → StatsBand → TeamShelf → SafetyStandards
 *          → ProcessSteps → TestimonialsShelf → CtaBanner
 */
const meta = page('about');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: clinic.identity?.longDescription, path: '/about' });

export default function AboutPage() {
  const { about } = clinic;
  const score = rating();
  const shelf = { previous: t('shelf.previous'), next: t('shelf.next') };
  const team = doctorItems().map((doctor) => ({ ...doctor, href: `/team/${doctorSlug(doctor)}` }));

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />

      <PageHero
        eyebrow={about?.eyebrow}
        title={about?.title}
        accent={about?.accent}
        intro={text(clinic.identity?.longDescription)}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
      >
        <Button href={navCta.href} size="lg" iconStart="calendar">
          {navCta.label}
        </Button>
        {team.length ? <TextLink href="/team">{t('about.team.cta')}</TextLink> : null}
      </PageHero>

      <AboutStory
        image={about?.interiorImage}
        eyebrow={t('about.promise.eyebrow')}
        title={t('about.promise.title')}
        accent={t('about.promise.accent')}
        paragraphs={t('about.promise.paragraphs') || []}
        points={about?.points || []}
        registration={clinic.identity?.registration}
      />

      <StatsBand stats={clinicStats()} locale={locale.numberFormat} eyebrow={t('stats.eyebrow')} title={t('stats.title')} accent={t('stats.accent')} />

      <TeamShelf
        doctors={team}
        section={doctors.section}
        linkHref="/team"
        labels={{ cta: t('about.team.cta'), viewProfile: t('common.viewProfile'), shelf }}
      />

      <SafetyStandards
        eyebrow={t('about.standards.eyebrow')}
        title={patientInfo.safety?.title}
        accent={t('about.standards.accent')}
        points={patientInfo.safety?.points || []}
        image={clinic.hero?.image}
      />

      <ProcessSteps steps={journeySteps()} {...journey.section} tone="tone-white" />

      {isEnabled('testimonials') ? (
        <TestimonialsShelf
          items={testimonialItems()}
          section={testimonials.section}
          rating={score}
          tone="tone-gray"
          labels={{
            ratingAria: score ? t('common.ratingLabel', { score: score.value, max: 5 }) : '',
            ratingCaption: score ? t('common.ratingCaption', { value: score.value, count: formatNumber(score.count, locale.numberFormat) }) : '',
            ratingTemplate: t('common.ratingLabel', { score: '{score}', max: 5 }),
            shelf
          }}
        />
      ) : null}

      <CtaBanner banner={clinic.banners?.ready} phone={clinicPhone()} labels={{ call: t('common.callTheClinic') }} />
    </>
  );
}
