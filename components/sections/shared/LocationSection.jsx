import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import OpenStatus from '@/components/ui/OpenStatus';
import Reveal from '@/components/ui/Reveal';
import { linkAttrs } from '@/lib/format';
import MapEmbed from './MapEmbed';

/**
 * Where to find the clinic: the map beside the address, parking, live
 * opening status, the week's hours, directions and socials. Used on the
 * contact and booking pages.
 */
export default function LocationSection({ address = {}, map, hours = [], status, phone, socials = [], labels = {}, tone = 'tone-white', children }) {
  return (
    <section className={`${tone} section`}>
      <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
        {map ? (
          <Reveal>
            <MapEmbed src={map} title={labels.mapTitle} className="h-[320px] sm:h-[440px] lg:h-full lg:min-h-[520px]" />
          </Reveal>
        ) : null}

        <Reveal index={1} className={map ? '' : 'lg:col-span-2'}>
          <div className="tile flex h-full flex-col bg-tile p-7 sm:p-9">
            {labels.eyebrow ? <p className="t-eyebrow">{labels.eyebrow}</p> : null}
            <h2 className="t-title mt-3">{address.line1}</h2>
            {address.line2 ? <p className="t-lead mt-2">{address.line2}</p> : null}
            {address.parkingNote ? (
              <p className="t-small mt-4 flex items-center gap-2">
                <Icon name="info" size={16} className="text-primary" />
                {address.parkingNote}
              </p>
            ) : null}

            <div className="mt-8 border-t border-hair pt-6">
              {status ? <OpenStatus {...status} variant="inline" /> : null}
              <ul className="mt-4 space-y-2.5">
                {hours.map((slot) => (
                  <li key={slot.days} className="flex items-center justify-between gap-4 text-[15px]">
                    <span className="text-fg-2">{slot.days}</span>
                    <span className="font-medium tabular-nums text-fg">{slot.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {address.mapsUrl ? (
                <Button href={address.mapsUrl} iconStart="directions">
                  {labels.directions}
                </Button>
              ) : null}
              {phone?.href ? (
                <Button href={phone.href} variant="glass" iconStart="phone">
                  {labels.call}
                </Button>
              ) : null}
            </div>

            {socials.length ? (
              <ul className="mt-auto flex flex-wrap gap-2 pt-8" aria-label={labels.followUs}>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} {...linkAttrs(social.href)} className="icon-btn h-10 w-10 bg-fg/[0.06] text-fg hover:text-primary">
                      <Icon name={social.icon} size={17} label={social.label} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
