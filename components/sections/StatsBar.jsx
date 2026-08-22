'use client';

import { motion } from 'framer-motion';
import Appear from '@/components/ui/Appear';
import Counter from '@/components/ui/Counter';
import Icon from '@/components/ui/Icon';
import { clinic } from '@/lib/data';
import { IOS_SOFT, viewportOnce } from '@/lib/motion';
import { useCalmMotion } from '@/lib/hooks';

const COLS = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' };

/**
 * The dark statistics panel. Figures count up once as it enters view.
 *
 * Numbers lead and labels follow beneath them — the old layout put a bordered
 * icon puck beside every figure, which competed with the number it was meant
 * to support.
 */
export default function StatsBar() {
  const calm = useCalmMotion();
  const stats = Array.isArray(clinic.stats) ? clinic.stats : [];
  if (!stats.length) return null;

  return (
    <section className="shell section-pad-sm relative z-10">
      <Appear
        on="view"
        y={32}
        duration={0.9}
        className="grain relative overflow-hidden rounded-panel bg-primary px-8 py-14 shadow-panel sm:px-14"
      >
        <div
          className="glow pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] opacity-[0.14]"
          aria-hidden="true"
        />

        <ul className={`relative grid grid-cols-2 gap-x-8 gap-y-12 ${COLS[Math.min(stats.length, 5)] || 'lg:grid-cols-4'}`}>
          {stats.map((stat, index) => (
            <li
              key={stat.label}
              className={index > 0 ? 'lg:border-l lg:border-on-primary/[0.14] lg:pl-10' : ''}
            >
              <Icon name={stat.icon} size={22} className="text-accent" />
              <p className="mt-5 font-display text-[clamp(2.25rem,3.4vw,3rem)] leading-none tracking-[-0.03em] text-on-primary">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-[15px] leading-snug text-on-primary/55">{stat.label}</p>
            </li>
          ))}
        </ul>
      </Appear>
    </section>
  );
}
