import Aurora from '@/components/ui/Aurora';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import { linkAttrs } from '@/lib/format';

/**
 * Booking without a backend: every action is a native hand-off — tel:,
 * wa.me, mailto:, maps. Featured channels are large night panels with fields
 * of brand colour behind glass; the rest are quiet tiles.
 */
export default function BookingChannels({ channels = [] }) {
  if (!channels.length) return null;
  const featured = channels.filter((channel) => channel.featured);
  const secondary = channels.filter((channel) => !channel.featured);

  return (
    <section className="tone-white pb-[var(--section-y)]">
      <div className="shell">
        {featured.length ? (
          <ul className={`grid grid-cols-1 gap-4 ${featured.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {featured.map((channel, index) => (
              <Reveal as="li" key={channel.id || channel.label} index={index}>
                <a
                  href={channel.href}
                  {...linkAttrs(channel.href)}
                  className="tone-dark tile tile-hover group relative flex min-h-[300px] flex-col justify-between p-7 sm:min-h-[340px] sm:p-10"
                >
                  <Aurora variant="night" />
                  <span className="relative flex items-center justify-between gap-4">
                    <span className="glass-dark grid h-14 w-14 place-items-center rounded-full">
                      <Icon name={channel.icon} size={26} className={channel.icon === 'whatsapp' ? 'text-[#3EDB7A]' : 'text-white'} />
                    </span>
                    <span className="glass-dark grid h-11 w-11 place-items-center rounded-full transition-transform duration-500 ease-ios group-hover:translate-x-1">
                      <Icon name="arrow-up-right" size={18} strokeWidth={1.9} />
                    </span>
                  </span>
                  <span className="relative mt-10 block">
                    <span className="block text-[14px] font-medium text-on-night-2">{channel.label}</span>
                    <span className="mt-2 block break-words text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-on-night">
                      {channel.value}
                    </span>
                    {channel.note ? <span className="mt-3 block text-[15px] text-on-night-2">{channel.note}</span> : null}
                    {channel.action ? (
                      <span className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-medium text-ink">
                        {channel.action}
                        <Icon name="arrow-right" size={16} />
                      </span>
                    ) : null}
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        ) : null}

        {secondary.length ? (
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {secondary.map((channel, index) => (
              <Reveal as="li" key={channel.id || channel.label} index={index}>
                <a href={channel.href} {...linkAttrs(channel.href)} className="tile tile-hover group flex h-full items-start gap-5 bg-tile p-6 sm:p-7">
                  <span className="icon-tile icon-tile-soft" style={{ '--s': '48px' }}>
                    <Icon name={channel.icon} size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium text-fg-3">{channel.label}</span>
                    <span className="mt-1 block break-words text-[17px] font-semibold leading-snug tracking-[-0.016em] text-fg group-hover:text-primary">
                      {channel.value}
                    </span>
                    {channel.note ? <span className="t-small mt-1.5 block">{channel.note}</span> : null}
                  </span>
                  <Icon name="chevron-right" size={18} strokeWidth={2} className="mt-1 flex-none text-fg-3" />
                </a>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
