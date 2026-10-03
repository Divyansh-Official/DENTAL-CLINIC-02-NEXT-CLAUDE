import Image from 'next/image';
import AccentText from '@/components/ui/AccentText';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

/**
 * About: the clinic's promise in its own words, beside the photograph of the
 * room it is kept in, with the clinic's points and its registration.
 */
export default function AboutStory({ image, eyebrow, title, accent, paragraphs = [], points = [], registration }) {
  return (
    <section className="tone-gray section">
      <div className="shell grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <div className="media relative aspect-[4/4.4] w-full overflow-hidden rounded-panel">
            {image?.src ? <Image src={image.src} alt={image.alt || ''} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" /> : null}
          </div>
        </Reveal>

        <div>
          <Reveal>
            {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
            <h2 className="t-display mt-3">
              <AccentText text={title} accent={accent} />
            </h2>
            <div className="prose-article mt-7">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {points.length ? (
            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {points.map((point, index) => (
                <Reveal as="li" key={point} index={index % 2} className="tile flex items-start gap-3 bg-tile p-5">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary text-on-primary">
                    <Icon name="check" size={13} strokeWidth={2.4} />
                  </span>
                  <span className="text-[15.5px] leading-snug text-fg">{point}</span>
                </Reveal>
              ))}
            </ul>
          ) : null}

          {registration ? (
            <Reveal as="p" className="t-caption mt-8 flex items-center gap-2">
              <Icon name="badge-check" size={16} className="text-primary" />
              {registration}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
