'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { RevealWords } from '@/components/ui/Reveal';
import { clinic } from '@/lib/data';
import { IOS_SOFT, viewportOnce } from '@/lib/motion';

/** Closing call to action, sitting on the surface above the footer. */
export default function ReadyBanner() {
  const banner = clinic.banners?.ready;
  if (!banner) return null;

  return (
    <section className="shell pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: IOS_SOFT }}
        className="relative overflow-hidden rounded-panel border border-line bg-surface-50 px-7 py-9 sm:px-10"
      >
        <div className="relative z-10 grid items-center gap-7 lg:grid-cols-12">
          <div className="flex items-center gap-5 lg:col-span-5">
            <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-card border border-line bg-card text-primary sm:grid">
              <Icon name={banner.icon} size={24} />
            </span>
            <h2 className="display-md text-[24px] sm:text-[28px]">
              <RevealWords text={banner.title} />
              <br />
              <RevealWords text={banner.titleSecondLine} delay={0.08} />
            </h2>
          </div>

          <p className="body-lead max-w-sm lg:col-span-4 lg:border-l lg:border-line lg:pl-8">{banner.text}</p>

          <div className="lg:col-span-3 lg:justify-self-end">
            <Button href={banner.cta.href} size="lg">
              {banner.cta.label}
            </Button>
          </div>
        </div>

        <span className="glow pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-[0.12]" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
