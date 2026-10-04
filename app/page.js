import Image from 'next/image';
import Button from '@/components/ui/Button';
import AboutSplit from '@/components/sections/home/AboutSplit';
import ArticlesPreview from '@/components/sections/home/ArticlesPreview';
import HomeHero from '@/components/sections/home/HomeHero';
import ServicesShowcase from '@/components/sections/home/ServicesShowcase';
import SmileBanner from '@/components/sections/home/SmileBanner';
import ProcessSteps from '@/components/sections/shared/ProcessSteps';
import StatsBand from '@/components/sections/shared/StatsBand';
import TeamShelf from '@/components/sections/shared/TeamShelf';
import TestimonialsShelf from '@/components/sections/shared/TestimonialsShelf';
import {
  blog,
  blogPosts,
  clinic,
  clinicStats,
  doctorItems,
  doctors,
  doctorSlug,
  emergencyLine,
  getFounder,
  isEnabled,
  journey,
  journeySteps,
  locale,
  openStatusProps,
  rating,
  serviceItems,
  services,
  t,
  testimonialItems,
  testimonials,
  text
} from '@/lib/data';
import { formatDate, formatNumber } from '@/lib/format';

/**
 * Home. Section by section:
 *   HomeHero → ServicesShowcase → AboutSplit → StatsBand → TeamShelf →
 *   ProcessSteps → TestimonialsShelf → ArticlesPreview → SmileBanner
 * The Dentist and WebSite schema come from the root layout.
 */
export default function HomePage() {
  const { hero, about } = clinic;
  const glass = isEnabled('liquidGlass');
  const score = rating();
  const scoreLabels = score
    ? {
        ratingAria: t('common.ratingLabel', { score: score.value, max: 5 }),
        ratingCaption: t('common.ratingCaption', { value: score.value, count: formatNumber(score.count, locale.numberFormat) }),
        ratingShort: t('common.reviewsCount', { count: formatNumber(score.count, locale.numberFormat) })
      }
    : {};
  const shelf = { previous: t('shelf.previous'), next: t('shelf.next') };
  const story = hero.story || {};
  const founder = getFounder();
  const storyImage = story.video?.poster?.src ? story.video.poster : about?.interiorImage;

  const storyContent = (
    <>
      {story.video?.src ? (
        <video className="aspect-video w-full rounded-2xl bg-night object-cover" controls playsInline preload="metadata" poster={storyImage?.src || undefined}>
          <source src={story.video.src} />
        </video>
      ) : storyImage?.src ? (
        <div className="media relative aspect-video w-full overflow-hidden rounded-2xl">
          <Image src={storyImage.src} alt={storyImage.alt || ''} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
        </div>
      ) : null}
      {(story.body || []).map((paragraph) => (
        <p key={paragraph} className="t-body mt-5">
          {text(paragraph)}
        </p>
      ))}
      {story.cta?.href ? (
        <div className="mt-7">
          <Button href={story.cta.href} icon="arrow-right">
            {story.cta.label || t('hero.storyCtaLabel')}
          </Button>
        </div>
      ) : null}
    </>
  );

  const tourContent = about?.interiorImage?.src ? (
    <>
      <div className="media relative aspect-video w-full overflow-hidden rounded-2xl">
        <Image src={about.interiorImage.src} alt={about.interiorImage.alt || ''} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
      </div>
      <p className="t-body mt-5">{text(clinic.identity?.longDescription)}</p>
    </>
  ) : null;

  const team = doctorItems().map((doctor) => ({ ...doctor, href: `/team/${doctorSlug(doctor)}` }));
  const posts = blogPosts()
    .slice(0, 3)
    .map((post) => ({ ...post, displayDate: formatDate(post.date, locale.numberFormat) }));

  return (
    <>
      <HomeHero
        hero={hero}
        status={openStatusProps()}
        rating={score}
        glass={glass}
        card={{ title: t('hero.cardEyebrow'), text: t('hero.cardText') }}
        story={{ title: story.title || hero.secondaryCta?.label, content: storyContent }}
        labels={{ close: t('common.close'), ...scoreLabels }}
      />

      <ServicesShowcase
        services={serviceItems()}
        section={services.section}
        labels={{ from: t('common.from'), learnMore: t('common.learnMore'), shelf }}
      />

      <AboutSplit
        about={about}
        tour={tourContent}
        founder={
          founder
            ? { name: doctors.founder?.signatureName || founder.name, role: founder.role, image: about?.portraitImage?.src || founder.image?.src }
            : null
        }
        labels={{ close: t('common.close') }}
      />

      <StatsBand stats={clinicStats()} locale={locale.numberFormat} eyebrow={t('stats.eyebrow')} title={t('stats.title')} accent={t('stats.accent')} />

      <TeamShelf
        doctors={team}
        section={doctors.section}
        linkHref="/team"
        labels={{ cta: t('home.team.cta'), viewProfile: t('common.viewProfile'), shelf }}
      />

      <ProcessSteps steps={journeySteps()} {...journey.section} tone="tone-gray" />

      {isEnabled('testimonials') ? (
        <TestimonialsShelf
          items={testimonialItems()}
          section={testimonials.section}
          rating={score}
          labels={{
            ratingAria: scoreLabels.ratingAria,
            ratingCaption: scoreLabels.ratingCaption,
            ratingTemplate: t('common.ratingLabel', { score: '{score}', max: 5 }),
            shelf
          }}
        />
      ) : null}

      <ArticlesPreview posts={posts} section={blog.section} labels={{ readMore: t('common.readMore') }} />

      <SmileBanner banner={clinic.banners?.smile} emergency={emergencyLine() ? { ...emergencyLine(), ...clinic.emergency } : null} glass={glass} />
    </>
  );
}
