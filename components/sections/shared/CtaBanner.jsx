import AccentText from '@/components/ui/AccentText';
import Aurora from '@/components/ui/Aurora';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

/**
 * The closing call to action on every inner page: a night panel with slow
 * fields of brand colour, the promise, and the two ways to book.
 */
export default function CtaBanner({ banner, phone, labels = {}, tone = 'tone-white' }) {
  if (!banner?.title) return null;

  return (
    <section className={`${tone} section-tight`}>
      <div className="shell">
        <Reveal>
          <div className="tone-dark relative overflow-hidden rounded-panel px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24">
            <Aurora variant="night" />
            <div className="relative mx-auto max-w-3xl">
              {banner.eyebrow ? <p className="t-eyebrow">{banner.eyebrow}</p> : null}
              <h2 className="t-display mt-3">
                <AccentText text={banner.title} accent={banner.accent} />
              </h2>
              {banner.text ? <p className="t-lead mx-auto mt-5 max-w-xl">{banner.text}</p> : null}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                {banner.cta?.href ? (
                  <Button href={banner.cta.href} size="lg" iconStart="calendar">
                    {banner.cta.label}
                  </Button>
                ) : null}
                {phone?.href ? (
                  <Button href={phone.href} size="lg" variant="glass" iconStart="phone">
                    {labels.call || phone.value}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
