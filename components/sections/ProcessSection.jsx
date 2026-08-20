'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Reveal, { RevealWords } from '@/components/ui/Reveal';
import { journey, journeySteps } from '@/lib/data';
import { IOS_SOFT, viewportOnce } from '@/lib/motion';

const COLS = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' };

/**
 * Treatment journey.
 *
 * The connecting line draws itself across the row as the section scrolls
 * through the viewport, so the sequence is read in order rather than all at
 * once. Numbering is used here because the steps genuinely are a sequence.
 */
export default function ProcessSection() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'center 0.4'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps = journeySteps();
  if (!steps.length) return null;

  return (
    <section ref={ref} className="section-pad bg-surface">
      <div className="shell">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="eyebrow">{journey.section?.eyebrow}</p>
          </Reveal>
          <h2 className="display-lg mt-4">
            <RevealWords text={journey.section?.title} italicWord={journey.section?.italicWord} />
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-line lg:block">
            <motion.span
              style={reduceMotion ? { scaleX: 1 } : { scaleX: lineScale }}
              className="absolute inset-0 origin-left bg-accent/60"
            />
          </div>

          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            /* Tracks the number of steps rather than assuming five. */
            className={`relative grid gap-10 sm:grid-cols-2 lg:gap-4 ${COLS[Math.min(steps.length, 6)] || 'lg:grid-cols-4'}`}
          >
            {steps.map((step) => (
              <motion.li
                key={step.step || step.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: IOS_SOFT } }
                }}
                className="group flex flex-col items-center text-center"
              >
                <span className="relative grid h-[72px] w-[72px] place-items-center rounded-full bg-card text-primary shadow-card ring-1 ring-line transition-all duration-500 ease-ios group-hover:-translate-y-1.5 group-hover:ring-accent/50">
                  <Icon name={step.icon} size={26} />
                  <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-accent font-body text-[10px] font-medium text-on-accent">
                    {step.step}
                  </span>
                </span>

                <h3 className="mt-5 font-display text-[16px] text-primary">{step.title}</h3>
                <p className="mt-2 max-w-[190px] text-[12.5px] leading-relaxed text-ink-muted">{step.text}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
