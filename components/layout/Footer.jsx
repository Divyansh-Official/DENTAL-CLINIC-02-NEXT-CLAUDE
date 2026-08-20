'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Logo from './Logo';
import Icon from '@/components/ui/Icon';
import { clinic, clinicHours, footerColumns, t, text } from '@/lib/data';
import { linkAttrs } from '@/lib/format';
import { tap } from '@/lib/motion';

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const columns = footerColumns();
  const hours = clinicHours();

  return (
    <footer className="grain relative overflow-hidden bg-primary text-on-primary">
      <div className="shell relative z-10 pb-8 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="surface" />
            <p className="mt-6 max-w-xs text-[13.5px] leading-relaxed text-on-primary/60">
              {text(clinic.footer.blurb)}
            </p>

            {clinic.socials?.length ? (
              <ul className="mt-7 flex items-center gap-3">
                {clinic.socials.map((social) => (
                  <li key={social.label}>
                    <motion.a
                      href={social.href}
                      {...linkAttrs(social.href)}
                      whileTap={reduceMotion ? undefined : tap}
                      whileHover={reduceMotion ? undefined : { y: -3 }}
                      className="grid h-9 w-9 place-items-center rounded-full border border-on-primary/20 text-on-primary transition-colors duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent"
                    >
                      <Icon name={social.icon} size={13} label={social.label} />
                    </motion.a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {columns.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h2 className="font-body text-[12px] uppercase tracking-[0.2em] text-on-primary">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex text-[13px] text-on-primary/55 transition-colors duration-300 hover:text-accent"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-[width] duration-500 ease-ios group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h2 className="font-body text-[12px] uppercase tracking-[0.2em] text-on-primary">
              {t('common.contactHeading')}
            </h2>
            <ul className="mt-5 space-y-3.5 text-[13px] text-on-primary/55">
              <li>
                <a href={clinic.contact.phoneHref} className="flex items-start gap-2.5 transition-colors hover:text-accent">
                  <Icon name="phone" size={13} tone="accent" className="mt-0.5" />
                  {clinic.contact.phone}
                </a>
              </li>
              <li>
                <a href={clinic.contact.emailHref} className="flex items-start gap-2.5 transition-colors hover:text-accent">
                  <Icon name="mail" size={13} tone="accent" className="mt-0.5" />
                  {clinic.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={clinic.contact.address.mapsUrl}
                  {...linkAttrs(clinic.contact.address.mapsUrl)}
                  className="flex items-start gap-2.5 transition-colors hover:text-accent"
                >
                  <Icon name="pin" size={13} tone="accent" className="mt-0.5" />
                  <span>
                    {clinic.contact.address.line1},
                    <br />
                    {clinic.contact.address.line2}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-body text-[12px] uppercase tracking-[0.2em] text-on-primary">
              {t('common.hoursHeading')}
            </h2>
            <ul className="mt-5 space-y-3.5 text-[13px] text-on-primary/55">
              {hours.map((slot) => (
                <li key={slot.days}>
                  <span className="block text-on-primary/85">{slot.days}</span>
                  <span>{slot.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-on-primary/[0.12] pt-6 text-[12px] text-on-primary/45 sm:flex-row sm:items-center sm:justify-between">
          {/* {year} is interpolated at render, so the notice never goes stale. */}
          <p>{text(clinic.footer.copyright)}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {(clinic.footer.legal || []).map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-accent">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="glow pointer-events-none absolute -bottom-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.07]" />
    </footer>
  );
}
