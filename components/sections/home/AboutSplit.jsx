import Image from 'next/image';
import AccentText from '@/components/ui/AccentText';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SheetTrigger from '@/components/ui/SheetTrigger';

/**
 * Home: the clinic in one split — a framed photograph with a glass "tour"
 * button over it, beside the promise, the checklist and the founder's
 * signature.
 */
export default function AboutSplit({ about, founder, tour, labels = {} }) {
  const points = Array.isArray(about.points) ? about.points : [];

  return (
    <section className="tone-white section">
      <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="media relative aspect-[4/4.3] w-full overflow-hidden rounded-panel">
            {about.interiorImage?.src ? (
              <Image src={about.interiorImage.src} alt={about.interiorImage.alt || ''} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
            ) : null}
          </div>
          {tour ? (
            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
              <SheetTrigger label={about.tourLabel} title={about.tourCaption || about.tourLabel} closeLabel={labels.close} className="btn btn-md btn-glass pl-2">
                {tour}
              </SheetTrigger>
            </div>
          ) : null}
        </Reveal>

        <div>
          <Reveal>
            {about.eyebrow ? <p className="t-eyebrow">{about.eyebrow}</p> : null}
            <h2 className="t-display mt-3">
              <AccentText text={about.title} accent={about.accent} />
            </h2>
            {about.body ? <p className="t-lead mt-6">{about.body}</p> : null}
          </Reveal>

          {points.length ? (
            <ul className="mt-9 grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {points.map((point, index) => (
                <Reveal as="li" key={point} index={index} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary text-on-primary">
                    <Icon name="check" size={13} strokeWidth={2.4} />
                  </span>
                  <span className="text-[16px] leading-snug text-fg">{point}</span>
                </Reveal>
              ))}
            </ul>
          ) : null}

          <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6 border-t border-hair pt-8">
            {founder ? (
              <div className="flex items-center gap-4">
                {founder.image ? (
                  <span className="media relative h-14 w-14 flex-none overflow-hidden rounded-full">
                    <Image src={founder.image} alt="" fill sizes="56px" className="object-cover object-top" />
                  </span>
                ) : null}
                <span>
                  <span className="block text-[17px] font-semibold tracking-[-0.015em] text-fg">{founder.name}</span>
                  <span className="block text-[14px] text-fg-2">{founder.role}</span>
                </span>
              </div>
            ) : null}
            {about.cta?.href ? (
              <Button href={about.cta.href} variant="outline" icon="arrow-right">
                {about.cta.label}
              </Button>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
