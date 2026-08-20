'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Sheet from '@/components/ui/Sheet';
import Parallax from '@/components/ui/Parallax';
import Reveal, { RevealWords } from '@/components/ui/Reveal';
import { clinic, doctors } from '@/lib/data';
import { IOS_SOFT, tap, viewportOnce } from '@/lib/motion';

/**
 * About split.
 *
 * Left: the clinic interior bleeding off the viewport edge, with the tour
 * trigger over it. Right: the promise, the checklist, the founder's signature
 * and portrait, with a vertical rule of set type on the far edge acting as the
 * seam between the two halves.
 */
export default function AboutSection() {
  const { about } = clinic;
  const [tourOpen, setTourOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const points = Array.isArray(about.points) ? about.points : [];

  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[340px] lg:min-h-[620px]">
          <Parallax distance={34} className="absolute inset-0 overflow-hidden">
            <div className="relative h-[124%] w-full">
              <Image
                src={about.interiorImage.src}
                alt={about.interiorImage.alt || ''}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Parallax>

          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/45 via-transparent to-transparent" />

          <motion.button
            type="button"
            whileTap={reduceMotion ? undefined : tap}
            onClick={() => setTourOpen(true)}
            aria-haspopup="dialog"
            className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
          >
            <span className="material-dark relative grid h-14 w-14 place-items-center rounded-full text-on-primary">
              <span className="absolute inset-0 rounded-full border border-on-primary/40 opacity-0 transition-all duration-700 ease-ios group-hover:scale-[1.35] group-hover:opacity-100" />
              <Icon name="play" size={15} />
            </span>
            <span className="text-[12px] tracking-[0.02em] text-on-primary">{about.tourLabel}</span>
          </motion.button>
        </div>

        <div className="relative bg-surface-50">
          <div className="relative z-10 px-[var(--shell-x)] py-14 lg:py-20 lg:pl-16 lg:pr-24">
            <Reveal>
              <p className="eyebrow">{about.eyebrow}</p>
            </Reveal>

            <h2 className="display-lg mt-5">
              <RevealWords text={about.title} italicWord={about.italicWord} />
              <br />
              <RevealWords text={about.titleSecondLine} italicWord={about.italicWord} delay={0.1} />
            </h2>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-ink-muted">{about.body}</p>
            </Reveal>

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
              className="mt-8 space-y-3.5"
            >
              {points.map((point) => (
                <motion.li
                  key={point}
                  variants={{
                    hidden: { opacity: 0, x: -14 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: IOS_SOFT } }
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/50 text-accent">
                    <Icon name="check" size={10} />
                  </span>
                  <span className="text-[13.5px] text-primary">{point}</span>
                </motion.li>
              ))}
            </motion.ul>

            {doctors.founder?.signatureName ? (
              <Reveal delay={0.2}>
                <div className="mt-10">
                  <p className="font-display text-[22px] italic text-primary">{doctors.founder.signatureName}</p>
                  <p className="mt-1 text-[12px] tracking-[0.06em] text-ink-faint">{doctors.founder.role}</p>
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={0.26}>
              <div className="mt-8">
                <Button href={about.cta.href}>{about.cta.label}</Button>
              </div>
            </Reveal>
          </div>

          {about.portraitImage?.src ? (
            <Reveal delay={0.1} className="pointer-events-none absolute bottom-0 right-0 hidden h-[86%] w-[46%] lg:block">
              <div className="relative h-full w-full">
                <Image
                  src={about.portraitImage.src}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="30vw"
                  className="object-contain object-bottom"
                />
              </div>
            </Reveal>
          ) : null}

          {about.verticalText ? (
            <span className="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-180 text-[10px] uppercase tracking-[0.4em] text-ink-faint [writing-mode:vertical-rl] lg:block">
              {about.verticalText}
            </span>
          ) : null}
        </div>
      </div>

      <Sheet open={tourOpen} onClose={() => setTourOpen(false)} title={about.tourCaption}>
        <div className="relative aspect-video w-full overflow-hidden rounded-card">
          <Image
            src={about.interiorImage.src}
            alt={about.interiorImage.alt || ''}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
          />
        </div>
        <p className="body-lead mt-6">{clinic.identity.longDescription}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-[13px] text-primary">
              <Icon name="check" size={12} tone="accent" className="mt-1" />
              {point}
            </li>
          ))}
        </ul>
      </Sheet>
    </section>
  );
}
