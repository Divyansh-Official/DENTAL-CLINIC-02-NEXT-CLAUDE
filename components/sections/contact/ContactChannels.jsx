import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import { linkAttrs } from '@/lib/format';

/**
 * Contact: one tile per channel — phone, WhatsApp, email, emergency. Each is
 * declared in ui.json by the clinic.contact field it points at, so a number
 * is never written down twice.
 */
export default function ContactChannels({ channels = [] }) {
  if (!channels.length) return null;

  return (
    <section className="tone-gray section">
      <div className="shell">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, index) => (
            <Reveal as="li" key={channel.label} index={index}>
              <a href={channel.href} {...linkAttrs(channel.href)} className="tile tile-hover group flex h-full flex-col bg-tile p-6 sm:p-7">
                <span className={`icon-tile ${channel.field === 'emergency' ? '!bg-none !bg-[#FF453A]' : ''}`} style={{ '--s': '48px' }}>
                  <Icon name={channel.icon} size={23} />
                </span>
                <span className="mt-6 text-[13px] font-medium text-fg-3">{channel.label}</span>
                <span className="mt-1 break-words text-[clamp(1.15rem,1.05rem+0.35vw,1.35rem)] font-semibold leading-snug tracking-[-0.02em] text-fg transition-colors group-hover:text-primary">
                  {channel.value}
                </span>
                {channel.note ? <span className="t-small mt-auto pt-5">{channel.note}</span> : null}
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
