import Image from 'next/image';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Aurora from '@/components/ui/Aurora';
import Button from '@/components/ui/Button';
import Enter from '@/components/ui/Enter';
import Icon from '@/components/ui/Icon';
import { Breadcrumbs } from '@/components/sections/shared/PageHero';

/**
 * Service detail opening: the title, the promise and the facts beside a
 * large photograph carrying a pane of liquid glass with the starting price.
 */
export default function ServiceHero({ service, crumbs, labels = {}, whatsappHref, glass = true }) {
  const Pane = glass ? LiquidGlass : 'div';
  const paneProps = glass ? { radius: 24, strength: 'full', elevation: 'float', lazy: true } : {};

  return (
    <section className="tone-white relative overflow-hidden pb-[clamp(56px,7vw,104px)] pt-[calc(var(--header-h)+clamp(32px,5vw,72px))]">
      <Aurora variant="soft" />
      <div className="shell relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <Enter delay={0}>
            <Breadcrumbs crumbs={crumbs} homeLabel={labels.home} label={labels.breadcrumb} align="left" />
          </Enter>
          <Enter delay={60} className="mt-8 flex items-center gap-3">
            <span className="icon-tile" style={{ '--s': '44px' }}>
              <Icon name={service.icon} size={22} />
            </span>
            <span className="t-eyebrow">{labels.eyebrow}</span>
          </Enter>
          <Enter delay={110} as="h1" className="t-hero mt-5 text-[clamp(2.5rem,1.6rem+3.6vw,4.6rem)]">
            {service.title}
          </Enter>
          {service.excerpt ? (
            <Enter delay={170} as="p" className="t-lead mt-5 max-w-xl">
              {service.excerpt}
            </Enter>
          ) : null}
          <Enter delay={220} className="mt-7 flex flex-wrap gap-2.5">
            {service.duration ? (
              <span className="chip h-9 px-4 text-[14px]">
                <Icon name="clock" size={15} />
                {labels.duration}: {service.duration}
              </span>
            ) : null}
            {service.priceFrom ? (
              <span className="chip chip-brand h-9 px-4 text-[14px]">
                <Icon name="wallet" size={15} />
                {labels.priceLabel} {service.priceFrom}
              </span>
            ) : null}
          </Enter>
          <Enter delay={280} className="mt-9 flex flex-col gap-3 xs:flex-row">
            <Button href="/book-appointment" size="lg" iconStart="calendar">
              {labels.book}
            </Button>
            {whatsappHref ? (
              <Button href={whatsappHref} size="lg" variant="glass" iconStart="whatsapp">
                {labels.whatsapp}
              </Button>
            ) : null}
          </Enter>
        </div>

        {service.image?.src ? (
          <Enter delay={200} effect="scale" className="relative">
            <div className="media relative aspect-[4/3.4] w-full overflow-hidden rounded-panel shadow-[0_40px_90px_-40px_rgb(0_0_0/0.45)]">
              <Image src={service.image.src} alt={service.image.alt || ''} fill priority sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" />
              {service.priceFrom ? (
                <Pane {...paneProps} className={`absolute bottom-4 left-4 flex items-center gap-3 rounded-[24px] py-3 pl-3 pr-5 sm:bottom-6 sm:left-6 ${glass ? '' : 'glass'}`}>
                  <span className="icon-tile" style={{ '--s': '40px' }}>
                    <Icon name={service.icon} size={20} />
                  </span>
                  <span>
                    <span className="block text-[12.5px] text-ink-2">{labels.priceLabel}</span>
                    <span className="block text-[18px] font-semibold tracking-[-0.02em] text-ink">{service.priceFrom}</span>
                  </span>
                </Pane>
              ) : null}
            </div>
          </Enter>
        ) : null}
      </div>
    </section>
  );
}
