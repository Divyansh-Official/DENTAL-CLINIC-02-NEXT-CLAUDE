import Image from 'next/image';
import LiquidGlass from '@/components/glass/LiquidGlass';
import AccentText from '@/components/ui/AccentText';
import Aurora from '@/components/ui/Aurora';
import Button from '@/components/ui/Button';
import Enter from '@/components/ui/Enter';
import Icon from '@/components/ui/Icon';
import OpenStatus from '@/components/ui/OpenStatus';
import Rating from '@/components/ui/Rating';
import SheetTrigger from '@/components/ui/SheetTrigger';

/**
 * Home hero, in the manner of an Apple product page: a live status pill, a
 * large centred headline with one phrase in the brand gradient, two actions
 * and the rating — then one wide photograph with panes of liquid glass
 * floating over it, where the refraction has real structure to bend.
 *
 * Everything enters on CSS keyframes, so the page paints complete with
 * JavaScript off and nothing waits on hydration.
 */
export default function HomeHero({ hero, status, rating, card, story, labels = {}, glass = true }) {
  const highlights = Array.isArray(hero.highlights) ? hero.highlights : [];
  const Pane = glass ? LiquidGlass : 'div';
  const pane = (props) => (glass ? { ...props } : {});

  return (
    <section className="tone-white relative overflow-hidden pb-[clamp(64px,8vw,120px)] pt-[calc(var(--header-h)+clamp(36px,6vw,84px))]">
      <Aurora variant="hero" />

      <div className="shell relative text-center">
        {status ? (
          <Enter delay={0} className="flex justify-center">
            <OpenStatus {...status} />
          </Enter>
        ) : null}
        {hero.eyebrow ? (
          <Enter delay={60} as="p" className="t-eyebrow mt-7">
            {hero.eyebrow}
          </Enter>
        ) : null}
        <Enter delay={110} as="h1" className="t-hero mx-auto mt-3 max-w-[16ch]">
          <AccentText text={hero.title} accent={hero.accent} />
        </Enter>
        {hero.subtitle ? (
          <Enter delay={190} as="p" className="t-lead mx-auto mt-6 max-w-2xl">
            {hero.subtitle}
          </Enter>
        ) : null}

        <Enter delay={260} className="mt-9 flex flex-col items-center justify-center gap-3 xs:flex-row">
          {hero.primaryCta?.href ? (
            <Button href={hero.primaryCta.href} size="lg" iconStart="calendar" className="w-full xs:w-auto">
              {hero.primaryCta.label}
            </Button>
          ) : null}
          {hero.secondaryCta?.label && story ? (
            <SheetTrigger
              label={hero.secondaryCta.label}
              meta={hero.secondaryCta.meta}
              title={story.title}
              closeLabel={labels.close}
              className="btn btn-lg btn-glass w-full pl-2.5 xs:w-auto"
            >
              {story.content}
            </SheetTrigger>
          ) : null}
        </Enter>

        {rating ? (
          <Enter delay={320} className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Rating value={rating.value} size={16} label={labels.ratingAria} />
            <span className="t-small">{labels.ratingCaption}</span>
          </Enter>
        ) : null}
      </div>

      {hero.image?.src ? (
        <Enter delay={380} effect="scale" className="shell relative mt-12 sm:mt-16">
          <div className="media relative aspect-[4/5] w-full overflow-hidden rounded-[clamp(26px,3.4vw,44px)] shadow-[0_40px_100px_-40px_rgb(0_0_0/0.45)] xs:aspect-[4/3.4] md:aspect-[16/9] lg:aspect-[16/8]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt || ''}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1240px) 100vw, 1240px"
              className="object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden="true" />

            {card ? (
              <Pane
                {...pane({ radius: 26, strength: 'full', elevation: 'float', lazy: true, tone: 'light' })}
                className={`absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-[26px] p-4 text-left xs:right-auto xs:max-w-[22rem] sm:bottom-8 sm:left-8 sm:p-5 ${glass ? '' : 'glass'}`}
              >
                <span className="icon-tile" style={{ '--s': '48px' }}>
                  <Icon name="badge-check" size={24} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold tracking-[-0.015em] text-ink">{card.title}</span>
                  <span className="block text-[13.5px] text-ink-2">{card.text}</span>
                </span>
              </Pane>
            ) : null}

            {rating ? (
              <Pane
                {...pane({ radius: 999, strength: 'full', elevation: 'float', lazy: true, tone: 'light' })}
                className={`absolute right-4 top-4 hidden items-center gap-2.5 rounded-full py-2.5 pl-3 pr-4 sm:right-8 sm:top-8 sm:flex ${glass ? '' : 'glass'}`}
              >
                <Icon name="star" size={18} className="text-[#FF9F0A]" />
                <span className="text-[15px] font-semibold text-ink">{rating.value}</span>
                <span className="text-[13.5px] text-ink-2">{labels.ratingShort}</span>
              </Pane>
            ) : null}
          </div>
        </Enter>
      ) : null}

      {highlights.length ? (
        <div className="shell relative mt-10 sm:mt-14">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 lg:grid-cols-4">
            {highlights.map((item, index) => (
              <Enter as="li" key={item.title} delay={460 + index * 60} className="flex flex-col gap-3 text-left sm:flex-row sm:items-start sm:gap-3.5">
                <span className="icon-tile icon-tile-soft" style={{ '--s': '44px' }}>
                  <Icon name={item.icon} size={21} />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block text-[15px] font-semibold tracking-[-0.015em] text-fg">{item.title}</span>
                  <span className="block text-[13.5px] leading-snug text-fg-2">{item.subtitle}</span>
                </span>
              </Enter>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
