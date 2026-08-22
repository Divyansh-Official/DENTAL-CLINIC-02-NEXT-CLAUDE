'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Appear from '@/components/ui/Appear';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { RevealWords } from '@/components/ui/Reveal';
import { clinic } from '@/lib/data';
import { IOS_SOFT, viewportOnce } from '@/lib/motion';
import { useCalmMotion } from '@/lib/hooks';

/** Dark conversion banner: portrait, promise, primary action, emergency note. */
export default function SmileBanner() {
  const calm = useCalmMotion();
  const banner = clinic.banners?.smile;
  if (!banner) return null;

  return (
    <section className="shell section-pad-sm">
      <Appear on="view" y={40} duration={1} className="grain relative overflow-hidden rounded-panel bg-primary shadow-panel">
        <div className="grid items-stretch lg:grid-cols-12">
          {banner.image?.src ? (
            <div className="relative order-2 h-[260px] lg:order-1 lg:col-span-4 lg:h-auto lg:min-h-[380px]">
              <Image
                src={banner.image.src}
                alt={banner.image.alt || ''}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-primary/25 lg:to-primary" />
            </div>
          ) : null}

          <div className="order-1 px-8 pt-14 lg:order-2 lg:col-span-5 lg:px-0 lg:py-16">
            <h2 className="display-md text-on-primary">
              <RevealWords text={banner.title} />
              <br />
              <RevealWords text={banner.titleSecondLine} delay={0.08} />
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-on-primary/60">{banner.text}</p>
            <div className="mt-9">
              <Button href={banner.cta.href} variant="light" size="lg">
                {banner.cta.label}
              </Button>
            </div>
          </div>

          {clinic.emergency ? (
            <div className="order-3 px-8 pb-14 lg:col-span-3 lg:flex lg:items-center lg:px-0 lg:pb-0 lg:pr-12">
              <div className="rounded-panel border border-on-primary/[0.16] bg-on-primary/[0.04] p-7">
                <Icon name={clinic.emergency.icon} size={26} className="text-accent" />
                <h3 className="mt-5 font-display text-[21px] leading-snug text-on-primary">
                  {clinic.emergency.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-on-primary/55">{clinic.emergency.text}</p>
                <a
                  href={clinic.contact.emergencyHref}
                  className="mt-5 inline-flex items-center gap-2.5 text-[14.5px] font-medium text-accent transition-opacity hover:opacity-75"
                >
                  <Icon name="phone" size={14} />
                  {clinic.contact.emergencyPhone}
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </Appear>
    </section>
  );
}
