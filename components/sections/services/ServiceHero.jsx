import LiquidGlass from '@/components/glass/LiquidGlass';
import Enter from '@/components/motion/Enter';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import DetailHero from '@/components/sections/shared/DetailHero';
import { Breadcrumbs } from '@/components/sections/shared/PageHero';

/**
 * Service detail opening — the page a service card zooms open into. The
 * photograph fills the screen; the title, promise, facts and actions rise in
 * at its foot, and a pane of liquid glass with the starting price floats
 * beside them on large screens.
 */
export default function ServiceHero({ service, crumbs, labels = {}, whatsappHref, back, glass = true }) {
  const Pane = glass ? LiquidGlass : 'div';
  const paneProps = glass ? { radius: 28, tone: 'dark', strength: 'full', elevation: 'float', lazy: true } : {};

  const aside =
    service.priceFrom || service.duration ? (
      <Enter delay={320} effect="scale">
        <Pane {...paneProps} className={`flex min-w-[260px] items-center gap-4 rounded-[28px] p-4 pr-7 ${glass ? '' : 'glass-dark'}`}>
          <span className="icon-tile" style={{ '--s': '52px' }}>
            <Icon name={service.icon} size={25} />
          </span>
          <span className="min-w-0">
            {service.priceFrom ? (
              <>
                <span className="block text-[13px] text-white/70">{labels.priceLabel}</span>
                <span className="block text-[24px] font-semibold leading-tight tracking-[-0.025em] text-white">{service.priceFrom}</span>
              </>
            ) : null}
            {service.duration ? (
              <span className="mt-1 flex items-center gap-1.5 text-[13px] text-white/70">
                <Icon name="clock" size={13} />
                {service.duration}
              </span>
            ) : null}
          </span>
        </Pane>
      </Enter>
    ) : null;

  return (
    <DetailHero image={service.image} back={back} glass={glass} aside={aside}>
      <Enter delay={0} className="hidden sm:block">
        <Breadcrumbs crumbs={crumbs} homeLabel={labels.home} label={labels.breadcrumb} align="left" />
      </Enter>
      <Enter delay={60} className="flex items-center gap-3 sm:mt-7">
        <span className="icon-tile" style={{ '--s': '42px' }}>
          <Icon name={service.icon} size={21} />
        </span>
        <span className="t-eyebrow">{labels.eyebrow}</span>
      </Enter>
      <Enter delay={110} as="h1" className="t-hero mt-4 text-[clamp(2.6rem,1.5rem+4.4vw,5.4rem)]">
        {service.title}
      </Enter>
      {service.excerpt ? (
        <Enter delay={170} as="p" className="t-lead mt-5 max-w-xl">
          {service.excerpt}
        </Enter>
      ) : null}
      {service.duration || service.priceFrom ? (
        <Enter delay={220} className="mt-7 flex flex-wrap gap-2.5 lg:hidden">
          {service.duration ? (
            <span className="chip glass-dark h-9 px-4 text-[14px] text-white">
              <Icon name="clock" size={15} />
              {labels.duration}: {service.duration}
            </span>
          ) : null}
          {service.priceFrom ? (
            <span className="chip glass-dark h-9 px-4 text-[14px] text-white">
              <Icon name="wallet" size={15} />
              {labels.priceLabel} {service.priceFrom}
            </span>
          ) : null}
        </Enter>
      ) : null}
      <Enter delay={270} className="mt-8 flex flex-col gap-3 xs:flex-row">
        <Button href="/book-appointment" size="lg" iconStart="calendar">
          {labels.book}
        </Button>
        {whatsappHref ? (
          <Button href={whatsappHref} size="lg" variant="glass" iconStart="whatsapp">
            {labels.whatsapp}
          </Button>
        ) : null}
      </Enter>
    </DetailHero>
  );
}
