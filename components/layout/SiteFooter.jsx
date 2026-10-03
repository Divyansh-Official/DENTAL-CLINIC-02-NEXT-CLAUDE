import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import OpenStatus from '@/components/ui/OpenStatus';
import { linkAttrs } from '@/lib/format';
import Logo from './Logo';

/**
 * Footer, in Apple's quiet grey: the brand and socials, the link columns
 * (the services column is generated from services.json), contact details,
 * live opening status with the week's hours, and the legal line.
 */
export default function SiteFooter({ brand, blurb, columns = [], contact, hours = [], status, socials = [], legal = [], copyright, labels = {} }) {
  return (
    <footer className="tone-gray border-t border-line/70" data-print="hide">
      <div className="shell pb-10 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo {...brand} />
            {blurb ? <p className="t-small mt-5 max-w-sm">{blurb}</p> : null}
            {socials.length ? (
              <ul className="mt-6 flex flex-wrap items-center gap-2.5" aria-label={labels.followUs}>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      {...linkAttrs(social.href)}
                      className="icon-btn h-10 w-10 bg-card text-ink shadow-[0_0_0_0.5px_rgb(0_0_0/0.08),0_1px_3px_rgb(0_0_0/0.06)] hover:text-primary"
                    >
                      <Icon name={social.icon} size={17} label={social.label} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-5">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-[13px] font-semibold tracking-[-0.005em] text-ink">{column.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[14px] text-ink-2 transition-colors hover:text-ink hover:underline hover:underline-offset-4">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            <div>
              <h2 className="text-[13px] font-semibold text-ink">{labels.contactHeading}</h2>
              <ul className="mt-4 space-y-2.5 text-[14px] text-ink-2">
                {contact?.phone ? (
                  <li>
                    <a href={contact.phoneHref} className="hover:text-ink">
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {contact?.email ? (
                  <li>
                    <a href={contact.emailHref} className="break-all hover:text-ink">
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact?.address ? (
                  <li>
                    <a href={contact.mapsUrl} {...linkAttrs(contact.mapsUrl)} className="hover:text-ink">
                      {contact.address}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
            <div>
              <h2 className="text-[13px] font-semibold text-ink">{labels.hoursHeading}</h2>
              {status ? <OpenStatus {...status} variant="inline" className="mt-4 text-[14px]" /> : null}
              <ul className="mt-3 space-y-1.5 text-[14px] text-ink-2">
                {hours.map((slot) => (
                  <li key={slot.days} className="flex justify-between gap-4">
                    <span>{slot.days}</span>
                    <span className="tabular-nums text-ink">{slot.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line/70 pt-6 text-[12.5px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          {legal.length ? (
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
