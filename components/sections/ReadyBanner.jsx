'use client';

import { motion } from 'framer-motion';
import Appear from '@/components/ui/Appear';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { RevealWords } from '@/components/ui/Reveal';
import { clinic } from '@/lib/data';
import { IOS_SOFT, viewportOnce } from '@/lib/motion';
import { useCalmMotion } from '@/lib/hooks';

/** Closing call to action, sitting on the surface above the footer. */
export default function ReadyBanner() {
  const calm = useCalmMotion();
  const banner = clinic.banners?.ready;
  if (!banner) return null;

  return (
    <section className="shell pb-24">
      <Appear
        on="view"
        y={30}
        duration={0.9}
        className="relative overflow-hidden rounded-panel border border-line bg-surface-50 px-8 py-14 sm:px-14 sm:py-16"
      >
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
          <div className="flex items-start gap-6 lg:col-span-6">
            <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-card sm:grid">
              <Icon name={banner.icon} size={26} />
            </span>
            <h2 className="display-md">
              <RevealWords text={banner.title} />
              <br />
              <RevealWords text={banner.titleSecondLine} delay={0.08} />
            </h2>
          </div>

          <p className="body-base max-w-md lg:col-span-3">{banner.text}</p>

          <div className="lg:col-span-3 lg:justify-self-end">
            <Button href={banner.cta.href} size="lg">
              {banner.cta.label}
            </Button>
          </div>
        </div>

        <span className="glow pointer-events-none absolute -right-20 -top-20 h-72 w-72 opacity-[0.14]" aria-hidden="true" />
      </Appear>
    </section>
  );
}
