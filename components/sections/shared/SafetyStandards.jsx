import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';

/**
 * Hygiene and safety: a framed photograph beside a numbered list of the
 * protocols. Used on the about and patient information pages.
 */
export default function SafetyStandards({ eyebrow, title, accent, points = [], image, tone = 'tone-gray' }) {
  if (!points.length) return null;

  return (
    <section className={`${tone} section`}>
      <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader align="left" eyebrow={eyebrow} title={title} accent={accent} />
          <ol className="mt-10 space-y-3">
            {points.map((point, index) => (
              <Reveal as="li" key={point} index={index} className="tile flex items-start gap-4 bg-tile p-5 sm:p-6">
                <span className="icon-tile" style={{ '--s': '36px' }}>
                  <Icon name="check" size={17} strokeWidth={2.2} />
                </span>
                <span className="pt-1.5 text-[16px] leading-snug text-fg">{point}</span>
              </Reveal>
            ))}
          </ol>
        </div>
        {image?.src ? (
          <Reveal className="media relative aspect-[4/4.6] w-full overflow-hidden rounded-panel">
            <Image src={image.src} alt={image.alt || ''} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
