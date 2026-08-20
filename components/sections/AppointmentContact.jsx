'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { appointment, doctorItems, t } from '@/lib/data';
import { linkAttrs } from '@/lib/format';
import { IOS_EASE, spring, tap } from '@/lib/motion';

/**
 * Booking without a backend.
 *
 * Every action here is a native handoff — tel:, wa.me, mailto:, maps — so the
 * site needs no server, no database and no form handler. Numbers can also be
 * copied in place, with the confirmation appearing as an iOS-style swap.
 */

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const reduceMotion = useReducedMotion();

  /* The original left a setTimeout running after unmount, which warns in
     development and sets state on a dead component. */
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Safari denies the clipboard API outside a secure context. */
      const field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
      } catch {
        /* Nothing more to try; the number is still visible and tappable. */
      }
      document.body.removeChild(field);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.button
      type="button"
      whileTap={reduceMotion ? undefined : tap}
      onClick={copy}
      className="relative grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-primary transition-colors duration-300 hover:border-primary/40"
    >
      <span className="sr-only" aria-live="polite">
        {copied ? t('common.copiedLabel') : `${label} ${value}`}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'done' : 'copy'}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.22, ease: IOS_EASE }}
          className={`grid place-items-center ${copied ? 'text-accent' : ''}`}
        >
          <Icon name={copied ? 'check' : 'copy'} size={13} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export default function AppointmentContact() {
  const reduceMotion = useReducedMotion();
  const channels = Array.isArray(appointment.primaryChannels) ? appointment.primaryChannels : [];
  const featured = channels.filter((channel) => channel.featured);
  const secondary = channels.filter((channel) => !channel.featured);
  const doctors = doctorItems();

  return (
    <div className="space-y-16">
      <div>
        <RevealGroup className="grid gap-5 lg:grid-cols-2">
          {featured.map((channel) => (
            <RevealItem key={channel.id}>
              <motion.a
                href={channel.href}
                {...linkAttrs(channel.href)}
                whileTap={reduceMotion ? undefined : tap}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={spring.snappy}
                className="group grain relative flex h-full flex-col justify-between overflow-hidden rounded-panel bg-primary p-8"
              >
                <div>
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-on-primary/20 text-on-primary transition-colors duration-500 group-hover:border-accent group-hover:bg-accent/10">
                    <Icon name={channel.icon} size={24} />
                  </span>
                  <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-on-primary/45">{channel.label}</p>
                  <p className="mt-2 font-display text-[26px] leading-tight text-on-primary sm:text-[30px]">{channel.value}</p>
                  <p className="mt-2 text-[13px] text-on-primary/55">{channel.note}</p>
                </div>

                <span className="mt-8 inline-flex items-center gap-2.5 text-[13.5px] text-accent">
                  {channel.action}
                  <Icon name="arrow-right" size={13} className="transition-transform duration-500 ease-ios group-hover:translate-x-1.5" />
                </span>

                <span className="glow pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-20" />
              </motion.a>
            </RevealItem>
          ))}
        </RevealGroup>

        {secondary.length ? (
          <RevealGroup className="mt-5 grid gap-5 sm:grid-cols-2">
            {secondary.map((channel) => (
              <RevealItem key={channel.id}>
                <a
                  href={channel.href}
                  {...linkAttrs(channel.href)}
                  className="group flex h-full items-start gap-4 rounded-card border border-line bg-card p-6 transition-all duration-500 ease-ios hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-200 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-on-primary">
                    <Icon name={channel.icon} size={18} />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-accent">{channel.label}</span>
                    <span className="mt-1.5 block text-[14px] leading-snug text-primary">{channel.value}</span>
                    <span className="mt-1.5 block text-[12px] text-ink-faint">{channel.note}</span>
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}
      </div>

      {doctors.length ? (
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display-lg text-[clamp(1.8rem,3.4vw,2.6rem)]">
              <AccentTitle text={t('appointment.specialists.title')} accent={t('appointment.specialists.italicWord')} />
            </h2>
            <p className="max-w-sm text-[13px] leading-relaxed text-ink-muted">{t('appointment.specialists.intro')}</p>
          </div>

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
            {doctors.map((doctor) => (
              <RevealItem key={doctor.id} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-card transition-all duration-500 ease-ios hover:-translate-y-1.5 hover:shadow-lift sm:flex-row">
                  {doctor.image?.src ? (
                    <div className="relative h-48 w-full shrink-0 bg-surface-200 sm:h-auto sm:w-[38%]">
                      <Image
                        src={doctor.image.src}
                        alt={doctor.image.alt || doctor.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 220px"
                        className="object-cover transition-transform duration-[1100ms] ease-ios group-hover:scale-[1.05]"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[19px] text-primary">{doctor.name}</h3>
                    <p className="mt-1 text-[12px] tracking-[0.04em] text-accent">{doctor.specialty}</p>

                    <dl className="mt-4 space-y-2 text-[12px] text-ink-muted">
                      <div className="flex items-start gap-2.5">
                        <dt className="sr-only">Availability</dt>
                        <Icon name="clock" size={12} tone="accent" className="mt-0.5" />
                        <dd>{doctor.availability}</dd>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <dt className="sr-only">Qualification</dt>
                        <Icon name="award" size={12} tone="accent" className="mt-0.5" />
                        <dd>{doctor.qualification}</dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
                      <a
                        href={doctor.phoneHref}
                        className="flex flex-1 items-center gap-2.5 text-[13.5px] text-primary transition-colors hover:text-accent"
                      >
                        <Icon name="phone" size={13} tone="accent" />
                        {doctor.phone}
                      </a>
                      <CopyButton value={doctor.phone} label={t('common.copyLabel')} />
                      {doctor.whatsappHref ? (
                        <motion.a
                          whileTap={reduceMotion ? undefined : tap}
                          href={doctor.whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-primary transition-colors duration-300 hover:border-primary/40"
                        >
                          <Icon name="whatsapp" size={13} label={`WhatsApp ${doctor.name}`} />
                        </motion.a>
                      ) : null}
                      {doctor.emailHref ? (
                        <motion.a
                          whileTap={reduceMotion ? undefined : tap}
                          href={doctor.emailHref}
                          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-primary transition-colors duration-300 hover:border-primary/40"
                        >
                          <Icon name="mail" size={13} label={`Email ${doctor.name}`} />
                        </motion.a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      ) : null}
    </div>
  );
}

/** Inline accent italic for headings that are not animated word by word. */
function AccentTitle({ text: value, accent }) {
  if (!accent || !value.includes(accent)) return value;
  const [before, ...rest] = value.split(accent);
  return (
    <>
      {before}
      <span className="italic text-accent">{accent}</span>
      {rest.join(accent)}
    </>
  );
}
