import { notFound } from 'next/navigation';
import JsonLd from '@/components/layout/JsonLd';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import TestimonialsShelf from '@/components/sections/shared/TestimonialsShelf';
import TeamDirectory from '@/components/sections/team/TeamDirectory';
import { clinic, clinicPhone, doctorItems, doctorSlug, isEnabled, locale, page, rating, t, testimonialItems, testimonials } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

/**
 * /team — PageHero → TeamDirectory → TestimonialsShelf → CtaBanner
 * Every dentist in doctors.json appears here and gets a /team/<slug> profile.
 */
const meta = page('team');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: t('team.hero.intro'), path: '/team' });

export default function TeamPage() {
  if (!isEnabled('team')) notFound();
  const doctors = doctorItems().map((doctor) => ({ ...doctor, href: `/team/${doctorSlug(doctor)}` }));
  const score = rating();

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />
      <PageHero
        eyebrow={t('team.hero.eyebrow')}
        title={t('team.hero.title')}
        accent={t('team.hero.accent')}
        intro={t('team.hero.intro')}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
      />
      <section className="tone-gray section">
        <div className="shell">
          <TeamDirectory doctors={doctors} labels={{ all: t('team.allSpecialties'), filter: t('team.filterLabel'), viewProfile: t('common.viewProfile') }} />
        </div>
      </section>
      {isEnabled('testimonials') ? (
        <TestimonialsShelf
          items={testimonialItems()}
          section={testimonials.section}
          rating={score}
          labels={{
            ratingAria: score ? t('common.ratingLabel', { score: score.value, max: 5 }) : '',
            ratingCaption: score ? t('common.ratingCaption', { value: score.value, count: formatNumber(score.count, locale.numberFormat) }) : '',
            ratingTemplate: t('common.ratingLabel', { score: '{score}', max: 5 }),
            shelf: { previous: t('shelf.previous'), next: t('shelf.next') }
          }}
        />
      ) : null}
      <CtaBanner banner={clinic.banners?.ready} phone={clinicPhone()} labels={{ call: t('common.callTheClinic') }} />
    </>
  );
}
