'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Sheet from '@/components/ui/Sheet';
import { clinic, t } from '@/lib/data';
import { accentWords } from '@/lib/format';
import { IOS_EASE, IOS_SOFT, spring, tap } from '@/lib/motion';
import { useIsTouch } from '@/lib/hooks';

/**
 * Hero.
 *
 * The page-load sequence is the signature moment: the eyebrow rule draws
 * itself, the headline rises word by word from behind a mask, and the
 * treatment-room photograph expands out of its own corner radius. Everything
 * runs on one shared curve so it reads as a single orchestrated entrance
 * rather than four separate animations firing at once.
 */
export default function Hero() {
  const { hero } = clinic;
  const story = hero.story || {};
  const ref = useRef(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isTouch = useIsTouch();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* Pointer drift — the photograph tracks the cursor by a few pixels. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const dx = useSpring(px, spring.follow);
  const dy = useSpring(py, spring.follow);

  const handlePointer = (event) => {
    if (isTouch || reduceMotion) return;
    const { innerWidth, innerHeight } = window;
    px.set((event.clientX / innerWidth - 0.5) * 18);
    py.set((event.clientY / innerHeight - 0.5) * 18);
  };

  const lines = Array.isArray(hero.titleLines) ? hero.titleLines : [];
  const highlights = Array.isArray(hero.highlights) ? hero.highlights : [];
  /* The rail sits under the copy column, so it tracks the number of items
     rather than assuming there are exactly four. */
  const highlightCols =
    highlights.length >= 4 ? 'sm:grid-cols-4' : highlights.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

  /* Word index across every line, so the cascade continues past the line break. */
  let wordCursor = 0;

  return (
    <section
      ref={ref}
      onMouseMove={handlePointer}
      className="relative overflow-hidden pt-[calc(var(--nav-h)+18px)]"
    >
      <div className="shell relative grid items-center gap-10 pb-10 lg:grid-cols-12 lg:gap-6 lg:pb-16">
        <motion.div
          style={reduceMotion ? undefined : { y: textY, opacity: textFade }}
          className="relative z-10 lg:col-span-6 lg:pt-8"
        >
          <div className="flex items-center gap-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: IOS_SOFT, delay: 0.1 }}
              className="eyebrow"
            >
              {hero.eyebrow}
            </motion.p>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: IOS_EASE, delay: 0.25 }}
              className="hidden h-px w-16 origin-left bg-accent/50 sm:block"
            />
          </div>

          <h1 className="display-xl mt-6">
            {lines.map((line) => {
              const words = accentWords(line, hero.italicWord);
              return (
                <span key={line} className="block">
                  {words.map((entry, wordIndex) => {
                    const delay = 0.28 + wordCursor * 0.07;
                    wordCursor += 1;
                    return (
                      <span key={`${entry.word}-${wordIndex}`} className="inline-block overflow-hidden align-bottom">
                        <motion.span
                          className={`inline-block ${entry.accent ? 'italic text-accent' : 'text-primary'}`}
                          initial={reduceMotion ? { opacity: 0 } : { y: '115%' }}
                          animate={reduceMotion ? { opacity: 1 } : { y: '0%' }}
                          transition={{ duration: reduceMotion ? 0.3 : 1.05, ease: IOS_SOFT, delay: reduceMotion ? 0 : delay }}
                        >
                          {entry.word}
                          {wordIndex < words.length - 1 ? ' ' : ''}
                        </motion.span>
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: IOS_SOFT, delay: 0.72 }}
            className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-muted"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: IOS_SOFT, delay: 0.84 }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>

            {hero.secondaryCta?.label ? (
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : tap}
                onClick={() => setStoryOpen(true)}
                aria-haspopup="dialog"
                className="group flex items-center gap-3.5 text-left"
              >
                <span className="relative grid h-12 w-12 place-items-center rounded-full border border-primary/15 text-primary transition-colors duration-500 group-hover:border-accent">
                  <span className="absolute inset-0 rounded-full border border-accent/40 opacity-0 transition-all duration-700 ease-ios group-hover:scale-125 group-hover:opacity-100" />
                  <Icon name="play" size={12} />
                </span>
                <span>
                  <span className="block text-[13.5px] font-medium text-primary">{hero.secondaryCta.label}</span>
                  {hero.secondaryCta.meta ? (
                    <span className="block text-[11.5px] text-ink-faint">{hero.secondaryCta.meta}</span>
                  ) : null}
                </span>
              </motion.button>
            ) : null}
          </motion.div>
        </motion.div>

        <div className="relative lg:col-span-6">
          <motion.div
            style={reduceMotion ? undefined : { x: dx, y: dy }}
            className="relative lg:absolute lg:left-0 lg:top-1/2 lg:w-[52vw] lg:max-w-[720px] lg:-translate-y-1/2"
          >
            <motion.div
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { clipPath: 'inset(12% 8% 12% 8% round 180px 24px 24px 24px)', opacity: 0 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { clipPath: 'inset(0% 0% 0% 0% round 180px 24px 24px 24px)', opacity: 1 }
              }
              transition={{ duration: reduceMotion ? 0.4 : 1.4, ease: IOS_EASE, delay: reduceMotion ? 0 : 0.35 }}
              className="relative aspect-[4/3.1] w-full overflow-hidden rounded-hero bg-primary-50"
            >
              <motion.div
                style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
                className="absolute inset-0"
              >
                <Image
                  src={hero.image.src}
                  alt={hero.image.alt}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

            {hero.badge?.text ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring.gentle, delay: 1.15 }}
                className="material absolute -bottom-5 left-6 grid h-24 w-24 place-items-center rounded-full text-accent shadow-card sm:-left-8 sm:bottom-8"
                aria-hidden="true"
              >
                <span className={reduceMotion ? 'absolute inset-0' : 'absolute inset-0 animate-spin-slow'}>
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <defs>
                      <path id="badge-arc" d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0" fill="none" />
                    </defs>
                    <text className="fill-primary" style={{ fontSize: '9.5px', letterSpacing: '2.1px' }}>
                      <textPath href="#badge-arc">{hero.badge.text}</textPath>
                    </text>
                  </svg>
                </span>
                <Icon name={hero.badge.icon} size={16} />
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>

      {highlights.length ? (
        <div className="shell relative z-10">
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 1 } } }}
            className={`grid grid-cols-2 gap-y-8 border-t border-line pt-8 lg:max-w-[52%] lg:border-none lg:pt-0 ${highlightCols}`}
          >
            {highlights.map((item, index) => (
              <motion.li
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: IOS_SOFT } }
                }}
                className={`flex flex-col items-start gap-2 pl-0 sm:items-center sm:pl-6 ${
                  index > 0 ? 'sm:border-l sm:border-line' : ''
                }`}
              >
                <Icon name={item.icon} size={22} tone="accent" />
                <div className="sm:text-center">
                  <p className="font-display text-[15px] leading-tight text-primary">{item.title}</p>
                  <p className="text-[12px] text-ink-faint">{item.subtitle}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      ) : null}

      <Sheet open={storyOpen} onClose={() => setStoryOpen(false)} title={story.title || hero.secondaryCta?.label}>
        <StoryMedia story={story} fallback={clinic.about?.interiorImage} />
        {(story.body || []).map((paragraph) => (
          <p key={paragraph} className="body-lead mt-4 first:mt-6">
            {paragraph}
          </p>
        ))}
        {story.cta?.href ? (
          <div className="mt-7">
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
      <Image src={poster.src} alt={poster.alt || ''} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover opacity-70" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="material-dark grid h-16 w-16 place-items-center rounded-full text-on-primary">
          <Icon name="play" size={18} />
        </span>
      </div>
    </div>
  );
}
