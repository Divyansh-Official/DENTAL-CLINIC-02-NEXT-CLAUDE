'use client';

import { motion } from 'framer-motion';
import Counter from '@/components/ui/Counter';
import Icon from '@/components/ui/Icon';
import { clinic } from '@/lib/data';
import { IOS_SOFT, viewportOnce } from '@/lib/motion';

const COLS = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' };

/** The dark statistics rail. Figures count up once as the rail enters view. */
export default function StatsBar() {
  const stats = Array.isArray(clinic.stats) ? clinic.stats : [];
  if (!stats.length) return null;

  return (
    <section className="shell relative z-10 mt-10 sm:mt-14">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1, ease: IOS_SOFT }}
        className="grain relative overflow-hidden rounded-panel bg-primary px-6 py-8 shadow-panel sm:px-10"
      >
        {/* Column count follows the data, so adding or removing a statistic
            does not leave a gap in the rail. */}
        <ul className={`grid grid-cols-2 gap-y-8 ${COLS[Math.min(stats.length, 5)] || 'lg:grid-cols-4'}`}>
          {stats.map((stat, index) => (
            <li
              key={stat.label}
              className={`flex items-center gap-4 px-2 sm:px-6 ${
                index % 2 === 1 ? 'border-l border-on-primary/[0.12]' : ''
              } ${index > 0 ? 'lg:border-l lg:border-on-primary/[0.12]' : 'lg:border-l-0'}`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-on-primary/[0.15] text-on-primary">
                <Icon name={stat.icon} size={17} />
              </span>
              <span>
                <span className="block font-display text-[26px] leading-none text-on-primary sm:text-[30px]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-1.5 block text-[12px] text-on-primary/55">{stat.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
