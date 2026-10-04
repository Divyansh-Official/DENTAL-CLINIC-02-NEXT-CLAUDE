import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

/**
 * Booking: the emergency line, in the system red Apple reserves for
 * genuinely urgent actions. A semantic colour, so it does not follow the
 * brand palette.
 */
export default function EmergencyCallout({ emergency }) {
  if (!emergency?.href) return null;

  return (
    <section className="tone-white pb-[var(--section-y)]">
      <div className="shell">
        <Reveal>
          <div className="tile grid grid-cols-1 gap-6 bg-[#FFF2F1] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div className="flex items-start gap-5">
              <span className="grid h-14 w-14 flex-none place-items-center rounded-[16px] bg-[#FF3B30] text-white shadow-[0_10px_24px_-10px_rgb(255_59_48/0.7)]">
                <Icon name={emergency.icon || 'emergency'} size={26} />
              </span>
              <div>
                <h2 className="t-title text-[clamp(1.4rem,1.2rem+0.8vw,1.9rem)] text-[#1D1D1F]">{emergency.title}</h2>
                {emergency.text ? <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-[#6E6E73]">{emergency.text}</p> : null}
              </div>
            </div>
            <a
              href={emergency.href}
              className="btn btn-lg justify-self-start bg-[#FF3B30] text-white shadow-[0_10px_24px_-10px_rgb(255_59_48/0.8)] hover:bg-[#FF5147] lg:justify-self-end"
            >
              <Icon name="phone" size={19} />
              <span>
                {emergency.action ? <span className="sr-only">{emergency.action}: </span> : null}
                {emergency.phone}
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
