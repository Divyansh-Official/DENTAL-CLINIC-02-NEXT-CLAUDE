import Icon from '@/components/ui/Icon';
import OpenStatus from '@/components/ui/OpenStatus';

/**
 * Service detail sidebar: a sticky glass card that keeps the two ways to
 * talk to a dentist, and today's opening status, in reach while reading.
 */
export default function ServiceAside({ icon, phone, whatsappHref, hours = [], status, labels = {} }) {
  const row =
    'flex items-center justify-between gap-3 rounded-2xl bg-fg/[0.045] px-4 py-3.5 text-[15px] font-medium text-fg transition-colors hover:bg-fg/[0.08]';

  return (
    <aside className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
      <div className="sheen rounded-panel p-6 sm:p-7">
        <span className="icon-tile" style={{ '--s': '48px' }}>
          <Icon name={icon || 'tooth'} size={24} />
        </span>
        <h2 className="t-headline mt-5">{labels.title}</h2>
        <p className="t-small mt-2">{labels.text}</p>

        <div className="mt-6 space-y-2">
          {phone?.href ? (
            <a href={phone.href} className={row}>
              <span className="flex items-center gap-3">
                <Icon name="phone" size={18} className="text-primary" />
                {phone.value}
              </span>
              <Icon name="chevron-right" size={16} strokeWidth={2} className="text-fg-3" />
            </a>
          ) : null}
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={row}>
              <span className="flex items-center gap-3">
                <Icon name="whatsapp" size={18} className="text-[#1FAF57]" />
                {labels.whatsapp}
              </span>
              <Icon name="chevron-right" size={16} strokeWidth={2} className="text-fg-3" />
            </a>
          ) : null}
        </div>

        <div className="mt-6 border-t border-hair pt-5">
          {status ? <OpenStatus {...status} variant="inline" /> : null}
          <ul className="mt-3 space-y-1.5 text-[14px] text-fg-2">
            {hours.map((slot) => (
              <li key={slot.days} className="flex justify-between gap-4">
                <span>{slot.days}</span>
                <span className="tabular-nums text-fg">{slot.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
