import Image from 'next/image';
import LiquidGlass from '@/components/glass/LiquidGlass';
import AccentText from '@/components/ui/AccentText';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';

/**
 * Home's closing panel: a night card with the promise and the booking
 * action, beside a photograph carrying a pane of liquid glass with the
 * emergency line — refraction over a real image, the way iOS uses it.
 */
export default function SmileBanner({ banner, emergency, labels = {}, glass = true }) {
  if (!banner?.title) return null;
  const Pane = glass ? LiquidGlass : 'div';
  const paneProps = glass ? { radius: 26, strength: 'full', elevation: 'float', tone: 'dark', lazy: true } : {};

  return (
    <section className="tone-white section-tight">
      <div className="shell">
        <Reveal>
          <div className="tone-dark relative grid grid-cols-1 overflow-hidden rounded-panel lg:grid-cols-2">
            <div className="relative order-2 flex min-w-0 flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:order-1 lg:py-20">
              {banner.eyebrow ? <p className="t-eyebrow">{banner.eyebrow}</p> : null}
              <h2 className="t-display mt-3">
                <AccentText text={banner.title} accent={banner.accent} />
              </h2>
              {banner.text ? <p className="t-lead mt-5 max-w-md">{banner.text}</p> : null}
              {banner.cta?.href ? (
                <div className="mt-9">
                  <Button href={banner.cta.href} size="lg" variant="light" iconStart="calendar">
                    {banner.cta.label}
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="media relative order-1 min-h-[340px] sm:min-h-[420px] lg:order-2 lg:min-h-[560px]">
              {banner.image?.src ? (
                <Image src={banner.image.src} alt={banner.image.alt || ''} fill sizes="(max-width: 1024px) 100vw, 620px" className="object-cover" />
              ) : null}
              <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r lg:from-night/50 lg:via-transparent" aria-hidden="true" />

              {emergency?.href ? (
                <Pane {...paneProps} className={`absolute inset-x-4 bottom-4 rounded-[26px] p-5 sm:inset-x-auto sm:bottom-8 sm:right-8 sm:max-w-[20rem] ${glass ? '' : 'glass-dark'}`}>
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#FF453A] text-white">
                      <Icon name={emergency.icon || 'emergency'} size={19} />
                    </span>
                    <span className="text-[16px] font-semibold tracking-[-0.015em] text-on-night">{emergency.title}</span>
                  </span>
                  {emergency.text ? <p className="mt-3 text-[14px] leading-snug text-on-night/75">{emergency.text}</p> : null}
                  <a href={emergency.href} className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-white hover:underline hover:underline-offset-4">
                    <Icon name="phone" size={16} />
                    {emergency.phone}
                  </a>
                </Pane>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
