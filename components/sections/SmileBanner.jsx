'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { RevealWords } from '@/components/ui/Reveal';
import { clinic } from '@/lib/data';
import { IOS_SOFT, viewportOnce } from '@/lib/motion';

/** Dark conversion banner: portrait, promise, primary action, emergency note. */
export default function SmileBanner() {
  const banner = clinic.banners?.smile;
  if (!banner) return null;

  return (
    <section className="shell py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 1, ease: IOS_SOFT }}
        className="grain relative overflow-hidden rounded-panel bg-primary"
      >
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {banner.image?.src ? (
            <div className="relative order-2 h-[220px] lg:order-1 lg:col-span-4 lg:h-[300px]">
              <Image
                src={banner.image.src}
                alt={banner.image.alt || ''}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary lg:bg-gradient-to-l lg:from-primary/0 lg:to-primary" />
            </div>
          ) : null}

          <div className="order-1 px-8 pt-10 lg:order-2 lg:col-span-5 lg:px-0 lg:py-12">
            <h2 className="display-md text-on-primary">
              <RevealWords text={banner.title} />
              <br />
              <RevealWords text={banner.titleSecondLine} delay={0.08} />
            </h2>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-on-primary/60">{banner.text}</p>
            <div className="mt-7">
              <Button href={banner.cta.href} variant="light">
                {banner.cta.label}
              </Button>
            </div>
          </div>

          {clinic.emergency ? (
            <div className="order-3 px-8 pb-10 lg:col-span-3 lg:px-0 lg:pb-0 lg:pr-10">
              <div className="rounded-card border border-on-primary/[0.15] p-6">
                <Icon name={clinic.emergency.icon} size={26} tone="accent" />
                <h3 className="mt-4 font-display text-[17px] leading-snug text-on-primary">{clinic.emergency.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-on-primary/55">{clinic.emergency.text}</p>
                <a
                  href={clinic.contact.emergencyHref}
                  className="mt-4 inline-flex items-center gap-2 text-[12.5px] text-accent transition-opacity hover:opacity-75"
                >
                  <Icon name="phone" size={12} />
                  {clinic.contact.emergencyPhone}
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
