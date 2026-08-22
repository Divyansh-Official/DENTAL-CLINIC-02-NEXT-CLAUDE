'use client';

import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Reveal, { RevealWords } from '@/components/ui/Reveal';
import { journey, journeySteps } from '@/lib/data';
import { IOS_SOFT, viewportOnce } from '@/lib/motion';
import { useCalmMotion } from '@/lib/hooks';

const COLS = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' };

/**
 * Treatment journey.
 *
 * A numbered sequence, so it is marked up as one: an ordered list with the
 * step number leading each item. The connecting rule sits behind the row on
 * desktop and is purely decorative — it no longer draws itself on scroll,
 * which was a scroll-linked effect the brief asked to remove.
 */
export default function ProcessSection() {
  const calm = useCalmMotion();
  const steps = journeySteps();
  if (!steps.length) return null;

  return (
    <section className="section-pad bg-surface">
      <div className="shell">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Reveal>
            <p className="eyebrow">{journey.section?.eyebrow}</p>
          </Reveal>
          <h2 className="display-lg mt-6">
            <RevealWords text={journey.section?.title} italicWord={journey.section?.italicWord} />
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-9 hidden h-px bg-line lg:block" aria-hidden="true" />

          <motion.ol
            initial={calm ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className={`relative grid gap-12 sm:grid-cols-2 lg:gap-6 ${COLS[Math.min(steps.length, 6)] || 'lg:grid-cols-4'}`}
          >
            {steps.map((step) => (
              <motion.li
                key={step.step || step.title}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: IOS_SOFT } }
                }}
                className="group flex flex-col items-center text-center"
              >
                <span className="relative grid h-[72px] w-[72px] place-items-center rounded-full bg-card text-primary shadow-card ring-1 ring-line transition-colors duration-500 ease-ios group-hover:bg-primary group-hover:text-on-primary">
                  <Icon name={step.icon} size={26} />
                  <span className="absolute -right-1.5 -top-1.5 grid h-7 w-7 place-items-center rounded-full bg-accent font-body text-[11px] font-semibold text-on-accent">
                    {step.step}
                  </span>
                </span>

                <h3 className="display-sm mt-7 text-[18px]">{step.title}</h3>
                <p className="body-sm mt-3 max-w-[15rem]">{step.text}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
