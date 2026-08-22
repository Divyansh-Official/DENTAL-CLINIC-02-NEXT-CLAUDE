'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Sheet from '@/components/ui/Sheet';
import Reveal, { RevealWords } from '@/components/ui/Reveal';
import { clinic, doctors } from '@/lib/data';
import { IOS_SOFT, tap, viewportOnce } from '@/lib/motion';
import { useCalmMotion } from '@/lib/hooks';

/**
 * About split.
 *
 * A framed portrait of the clinic on one side, the promise and the checklist
 * on the other. The photograph previously drifted on scroll behind a Parallax
 * wrapper; it is now fixed in its frame, which reads calmer and keeps the two
 * columns visually locked together.
 */
export default function AboutSection() {
  const { about } = clinic;
  const [tourOpen, setTourOpen] = useState(false);
  const calm = useCalmMotion();
  const points = Array.isArray(about.points) ? about.points : [];

  return (
    <section className="section-pad relative overflow-hidden bg-surface">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="relative">
            <div className="framed img-veil aspect-[4/3.4] w-full">
              <Image
                src={about.interiorImage.src}
                alt={about.interiorImage.alt || ''}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>

            <motion.button
              type="button"
              whileTap={calm ? undefined : tap}
              onClick={() => setTourOpen(true)}
              aria-haspopup="dialog"
              className="group absolute bottom-7 left-7 flex items-center gap-3.5 rounded-full bg-card/95 py-2 pl-2 pr-6 shadow-float backdrop-blur transition-colors hover:bg-card"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-on-primary transition-colors group-hover:bg-accent group-hover:text-on-accent">
                <Icon name="play" size={13} />
              </span>
              <span className="text-[15px] font-medium text-primary">{about.tourLabel}</span>
            </motion.button>

            {/* Vertical set type on the outer edge, as a quiet seam. */}
            {about.verticalText ? (
              <span className="absolute -right-14 top-1/2 hidden -translate-y-1/2 rotate-180 whitespace-nowrap text-[10.5px] uppercase tracking-[0.42em] text-ink-faint [writing-mode:vertical-rl] xl:block">
                {about.verticalText}
              </span>
            ) : null}
          </div>
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
          </Reveal>

          <h2 className="display-lg mt-6">
            <RevealWords text={about.title} italicWord={about.italicWord} />
            <br />
            <RevealWords text={about.titleSecondLine} italicWord={about.italicWord} delay={0.1} />
          </h2>

          <Reveal delay={0.12}>
            <p className="body-lead mt-7 max-w-[34rem]">{about.body}</p>
          </Reveal>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } }}
            className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2"
          >
            {points.map((point) => (
              <motion.li
                key={point}
                variants={{
                  hidden: calm ? { opacity: 0 } : { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: IOS_SOFT } }
                }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <Icon name="check" size={11} strokeWidth={2} />
                </span>
                <span className="text-[15px] leading-snug text-primary">{point}</span>
              </motion.li>
            ))}
          </motion.ul>

          {doctors.founder?.signatureName ? (
            <Reveal delay={0.2}>
              <div className="mt-11 flex items-center gap-5 border-t border-line pt-8">
                {about.portraitImage?.src ? (
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-200">
                    <Image src={about.portraitImage.src} alt="" fill sizes="56px" className="object-cover object-top" />
                  </span>
                ) : null}
                <span>
                  <span className="block font-display text-[24px] italic leading-none text-primary">
                    {doctors.founder.signatureName}
                  </span>
                  <span className="mt-2 block text-[14.5px] tracking-[0.04em] text-ink-faint">
                    {doctors.founder.role}
                  </span>
                </span>
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.26}>
            <div className="mt-9">
              <Button href={about.cta.href}>{about.cta.label}</Button>
            </div>
          </Reveal>
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
        <p className="body-base mt-6">{clinic.identity.longDescription}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-[15px] text-primary">
              <Icon name="check" size={12} tone="accent" className="mt-1" />
              {point}
            </li>
          ))}
        </ul>
      </Sheet>
    </section>
  );
}
