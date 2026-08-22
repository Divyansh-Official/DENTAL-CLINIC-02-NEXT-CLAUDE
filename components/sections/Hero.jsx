'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Appear from '@/components/ui/Appear';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Rating from '@/components/ui/Rating';
import Sheet from '@/components/ui/Sheet';
import { clinic, locale, t } from '@/lib/data';
import { accentWords, formatNumber } from '@/lib/format';
import { IOS_SOFT, tap } from '@/lib/motion';
import { useCalmMotion } from '@/lib/hooks';

/**
 * Hero.
 *
 * One editorial column of type against one well-framed photograph. The
 * headline rises word by word from behind a mask on load, everything else
 * fades up on the same soft curve, and then the section holds still — there is
 * no scroll parallax and nothing tracks the pointer, so the image stays where
 * the eye left it.
 *
 * The review card over the photograph is the first-glance trust signal, built
 * from seo.aggregateRating. It replaced a rotating "scroll to explore" badge,
 * which decorated the page without telling a patient anything.
 */
export default function Hero() {
  const { hero } = clinic;
  const story = hero.story || {};
  const rating = clinic.seo?.aggregateRating;
  const [storyOpen, setStoryOpen] = useState(false);
  const calm = useCalmMotion();

  const lines = Array.isArray(hero.titleLines) ? hero.titleLines : [];
  const highlights = Array.isArray(hero.highlights) ? hero.highlights : [];

  /* Word index across every line, so the cascade continues past the break. */
  let cursor = 0;


  return (
    <section className="relative overflow-hidden">
      {/* A single wide wash of brand colour behind the fold keeps the cream
          from reading as flat paper. */}
      <div
        className="glow pointer-events-none absolute -right-[10%] -top-[20%] h-[720px] w-[720px] opacity-[0.07]"
        aria-hidden="true"
      />

      <div className="shell relative grid items-center gap-14 pb-16 pt-[calc(var(--nav-h)+3.5rem)] lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-[calc(var(--nav-h)+5rem)]">
        <div className="lg:col-span-7 lg:pr-10">
          <Appear as="p" delay={0.05} className="eyebrow">
            {hero.eyebrow}
          </Appear>

          <h1 className="display-2xl mt-7">
            {lines.map((line) => {
              const words = accentWords(line, hero.italicWord);
              return (
                <span key={line} className="block">
                  {words.map((entry, i) => {
                    const delay = 0.18 + cursor * 0.06;
                    cursor += 1;
                    return (
                      <span key={`${entry.word}-${i}`} className="inline-block overflow-hidden align-bottom">
                        {calm ? (
                          <span className={`inline-block ${entry.accent ? 'italic text-accent' : ''}`}>
                            {entry.word}
                            {i < words.length - 1 ? '\u00A0' : ''}
                          </span>
                        ) : (
                          <motion.span
                            className={`inline-block ${entry.accent ? 'italic text-accent' : ''}`}
                            initial={{ y: '115%' }}
                            animate={{ y: '0%' }}
                            transition={{ duration: 1, ease: IOS_SOFT, delay }}
                          >
                            {entry.word}
                            {i < words.length - 1 ? '\u00A0' : ''}
                          </motion.span>
                        )}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </h1>

          <Appear as="p" delay={0.55} className="body-lead mt-8 max-w-[34rem]">
            {hero.subtitle}
          </Appear>

          <Appear delay={0.66} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-5">
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>

            {hero.secondaryCta?.label ? (
              <motion.button
                type="button"
                whileTap={calm ? undefined : tap}
                onClick={() => setStoryOpen(true)}
                aria-haspopup="dialog"
                className="group flex items-center gap-4 text-left"
              >
                <span className="relative grid h-14 w-14 place-items-center rounded-full border border-primary/15 text-primary transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                  <Icon name="play" size={13} />
                </span>
                <span>
                  <span className="block text-[15px] font-medium text-primary">{hero.secondaryCta.label}</span>
                  {hero.secondaryCta.meta ? (
                    <span className="block text-[14.5px] text-ink-faint">{hero.secondaryCta.meta}</span>
                  ) : null}
                </span>
              </motion.button>
            ) : null}
          </Appear>

          {rating?.value > 0 ? (
            <Appear delay={0.78} className="mt-11 flex items-center gap-4 border-t border-line pt-7">
              <Rating value={Math.round(rating.value)} size={15} />
              <p className="body-sm">
                <span className="font-medium text-primary">{rating.value}</span> from{' '}
                {formatNumber(rating.count, locale.numberFormat)} patient reviews
              </p>
            </Appear>
          ) : null}
        </div>

        <Appear delay={0.3} duration={1.1} y={28} className="relative lg:col-span-5">
          <div className="framed img-veil aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[4/4.9]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </div>

          {/* Sits on the image corner rather than floating loose beside it. */}
          <Appear
            delay={0.85}
            duration={0.9}
            y={16}
            className="absolute -bottom-6 left-5 right-5 rounded-panel bg-card p-5 shadow-float sm:left-auto sm:right-8 sm:w-[17rem]"
          >
            <p className="meta text-[11px]">{clinic.identity.suffix}</p>
            <p className="display-sm mt-2">{clinic.identity.name}</p>
            <p className="body-sm mt-1.5 text-[14.5px]">
              {clinic.contact.address.city} · Since {clinic.identity.established}
            </p>
          </Appear>
        </Appear>
      </div>

      {highlights.length ? (
        <div className="border-y border-line bg-surface-50">
          <div className="shell">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-9 py-12 lg:grid-cols-4 lg:gap-x-10">
              {highlights.map((item, index) => (
                <Appear
                  as="li"
                  key={item.title}
                  delay={0.9 + index * 0.08}
                  y={14}
                  duration={0.7}
                  className={`flex items-center gap-4 ${
                    index > 0 ? 'lg:border-l lg:border-line lg:pl-10' : ''
                  }`}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Icon name={item.icon} size={21} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium leading-tight text-primary">{item.title}</span>
                    <span className="block text-[14.5px] text-ink-faint">{item.subtitle}</span>
                  </span>
                </Appear>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <Sheet open={storyOpen} onClose={() => setStoryOpen(false)} title={story.title || hero.secondaryCta?.label}>
        <StoryMedia story={story} fallback={clinic.about?.interiorImage} />
        {(story.body || []).map((paragraph) => (
          <p key={paragraph} className="body-base mt-4 first:mt-6">
            {paragraph}
          </p>
        ))}
        {story.cta?.href ? (
          <div className="mt-8">
            <Button href={story.cta.href}>{story.cta.label || t('hero.storyCtaLabel')}</Button>
          </div>
        ) : null}
      </Sheet>
    </section>
  );
}

/**
 * Plays a real video when one is configured, and otherwise shows the poster.
 * The clinic drops an .mp4 in /public, points hero.story.video.src at it, and
 * the placeholder is replaced with no code change.
 */
function StoryMedia({ story, fallback }) {
  const video = story.video || {};
  const poster = video.poster?.src ? video.poster : fallback;

  if (video.src) {
    return (
      <video
        className="aspect-video w-full rounded-card bg-primary object-cover"
        controls
        playsInline
        preload="metadata"
        poster={poster?.src || undefined}
      >
        <source src={video.src} />
      </video>
    );
  }

  if (!poster?.src) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card bg-primary">
      <Image src={poster.src} alt={poster.alt || ''} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover opacity-75" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="material-dark grid h-16 w-16 place-items-center rounded-full text-on-primary">
          <Icon name="play" size={18} />
        </span>
      </div>
    </div>
  );
}
