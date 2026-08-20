import Image from 'next/image';
import PageHero from '@/components/sections/PageHero';
import ProcessSection from '@/components/sections/ProcessSection';
import Testimonials from '@/components/sections/Testimonials';
import ReadyBanner from '@/components/sections/ReadyBanner';
import StatsBar from '@/components/sections/StatsBar';
import JsonLd from '@/components/layout/JsonLd';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { clinic, doctors, doctorItems, isEnabled, navCta, patientInfo, t } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const CRUMBS = [{ label: 'About Us' }];

export const metadata = pageMetadata({
  title: 'About Us',
  description: clinic.identity.longDescription,
  path: '/about'
});

export default function AboutPage() {
  const team = doctorItems();

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS, t('common.home'))} />

      <PageHero
        eyebrow={clinic.about.eyebrow}
        title={`${clinic.about.title} ${clinic.about.titleSecondLine}`}
        italicWord={clinic.about.italicWord}
        intro={clinic.identity.longDescription}
        breadcrumb={CRUMBS}
      >
        <Button href={navCta.href} size="lg">
          {navCta.label}
        </Button>
      </PageHero>

      <StatsBar />

      <section className="section-pad">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-panel">
              <Image
                src={clinic.about.interiorImage.src}
                alt={clinic.about.interiorImage.alt || ''}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow={t('about.promise.eyebrow')}
              title={t('about.promise.title')}
              italicWord={t('about.promise.italicWord')}
              align="center"
              className="!items-start !text-left"
            />
            <Reveal>
              {t('about.promise.paragraphs').map((paragraph) => (
                <p key={paragraph} className="body-lead mt-6">
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
              {clinic.about.points.map((point) => (
                <RevealItem key={point} className="flex items-start gap-3 rounded-card border border-line bg-card p-4">
                  <Icon name="check-circle" size={16} tone="accent" className="mt-0.5" />
                  <span className="text-[13px] leading-relaxed text-primary">{point}</span>
                </RevealItem>
              ))}
            </RevealGroup>

            {clinic.identity.registration ? (
              <Reveal delay={0.2}>
                <p className="mt-8 text-[12px] tracking-[0.06em] text-ink-faint">{clinic.identity.registration}</p>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {team.length ? (
        <section className="section-pad bg-surface-50">
          <div className="shell">
            <SectionHeading
              eyebrow={doctors.section.eyebrow}
              title={doctors.section.title}
              italicWord={doctors.section.italicWord}
              intro={doctors.section.intro}
            />

            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((doctor) => (
                <RevealItem key={doctor.id} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-card transition-all duration-500 ease-ios hover:-translate-y-1.5 hover:shadow-lift">
                    {doctor.image?.src ? (
                      <div className="relative aspect-[3/3.4] w-full overflow-hidden bg-surface-200">
                        <Image
                          src={doctor.image.src}
                          alt={doctor.image.alt || doctor.name}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover transition-transform duration-[1100ms] ease-ios group-hover:scale-[1.06]"
                        />
                        {doctor.experience ? (
                          <span className="material absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.14em] text-primary">
                            {doctor.experience}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-[18px] text-primary">{doctor.name}</h3>
                      <p className="mt-1 text-[12px] tracking-[0.04em] text-accent">{doctor.role}</p>
                      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">{doctor.bio}</p>

                      <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-[11.5px] text-ink-faint">
                        <div className="flex gap-2">
                          <dt className="text-primary">{t('about.team.qualificationLabel')}</dt>
                          <dd className="ml-auto text-right">{doctor.qualification}</dd>
                        </div>
                        {doctor.languages?.length ? (
                          <div className="flex gap-2">
                            <dt className="text-primary">{t('about.team.languagesLabel')}</dt>
                            <dd className="ml-auto text-right">{doctor.languages.join(', ')}</dd>
                          </div>
                        ) : null}
                      </dl>

                      <a
                        href={doctor.phoneHref}
                        className="mt-4 inline-flex items-center gap-2 text-[12.5px] text-primary transition-colors hover:text-accent"
                      >
                        <Icon name="phone" size={12} tone="accent" />
                        {doctor.phone}
                      </a>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <section className="section-pad">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow={t('about.standards.eyebrow')}
              title={patientInfo.safety.title}
              italicWord={t('about.standards.italicWord')}
            />
          </div>
          <RevealGroup className="space-y-3 lg:col-span-7">
            {patientInfo.safety.points.map((point, index) => (
              <RevealItem key={point} className="flex items-start gap-4 rounded-card border border-line bg-card p-5">
                <span className="font-display text-[15px] text-accent">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[13.5px] leading-relaxed text-primary">{point}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <ProcessSection />
      {isEnabled('testimonials') ? <Testimonials /> : null}
      <ReadyBanner />
    </>
  );
}
