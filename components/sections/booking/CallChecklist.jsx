import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

/** Booking: what to have ready before calling, as a numbered list. */
export default function CallChecklist({ eyebrow, title, items = [], note }) {
  if (!items.length) return null;

  return (
    <section className="tone-white section">
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
          <h2 className="t-display mt-3">{title}</h2>
          {note ? (
            <p className="t-small mt-6 flex items-start gap-2.5">
              <Icon name="shield" size={17} className="mt-0.5 flex-none text-primary" />
              {note}
            </p>
          ) : null}
        </Reveal>
        <ol className="space-y-3">
          {items.map((item, index) => (
            <Reveal as="li" key={item} index={index} className="tile flex items-start gap-5 bg-tile p-5 sm:p-6">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-primary text-[14px] font-semibold text-on-primary">
                {index + 1}
              </span>
              <span className="pt-1.5 text-[16.5px] leading-snug text-fg">{item}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
