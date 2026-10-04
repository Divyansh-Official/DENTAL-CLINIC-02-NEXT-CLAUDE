import Image from 'next/image';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Aurora from '@/components/ui/Aurora';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import Enter from '@/components/ui/Enter';
import Icon from '@/components/ui/Icon';
import { Breadcrumbs } from '@/components/sections/shared/PageHero';

/**
 * Dentist profile opening: a large portrait carrying a pane of liquid glass
 * with their experience, beside the name, specialty, three quick facts and
 * every way to reach them directly.
 */
export default function DoctorHero({ doctor, contact = {}, crumbs, labels = {}, glass = true }) {
  const facts = [
    { icon: 'briefcase', label: labels.experience, value: doctor.experience },
    { icon: 'translate', label: labels.languages, value: Array.isArray(doctor.languages) ? doctor.languages.join(', ') : '' },
    { icon: 'clock', label: labels.availability, value: doctor.availability }
  ].filter((fact) => fact.value);
  const Pane = glass ? LiquidGlass : 'div';
  const paneProps = glass ? { radius: 24, strength: 'full', elevation: 'float', lazy: true } : {};

  return (
    <section className="tone-white relative overflow-hidden pb-[clamp(56px,7vw,104px)] pt-[calc(var(--header-h)+clamp(32px,5vw,72px))]">
      <Aurora variant="soft" />
      <div className="shell relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Enter effect="scale" delay={120} className="relative order-2 lg:order-1">
          <div className="media relative mx-auto aspect-[4/4.8] w-full max-w-[520px] overflow-hidden rounded-panel shadow-[0_40px_90px_-40px_rgb(0_0_0/0.45)]">
            {doctor.image?.src ? (
              <Image src={doctor.image.src} alt={doctor.image.alt || doctor.name} fill priority sizes="(max-width: 1024px) 90vw, 520px" className="object-cover object-top" />
            ) : null}
            {doctor.qualification ? (
              <Pane {...paneProps} className={`absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-[24px] p-3.5 pr-5 sm:inset-x-auto sm:bottom-6 sm:left-6 ${glass ? '' : 'glass'}`}>
                <span className="icon-tile" style={{ '--s': '40px' }}>
                  <Icon name="graduation" size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] text-ink-2">{labels.qualification}</span>
                  <span className="block truncate text-[15px] font-semibold tracking-[-0.015em] text-ink">{doctor.qualification}</span>
                </span>
              </Pane>
            ) : null}
          </div>
        </Enter>

        <div className="order-1 lg:order-2">
          <Enter delay={0}>
            <Breadcrumbs crumbs={crumbs} homeLabel={labels.home} label={labels.breadcrumb} align="left" />
          </Enter>
          {doctor.role ? (
            <Enter as="p" delay={60} className="t-eyebrow mt-8">
              {doctor.role}
            </Enter>
          ) : null}
          <Enter as="h1" delay={110} className="t-hero mt-3 text-[clamp(2.5rem,1.6rem+3.4vw,4.4rem)]">
            {doctor.name}
          </Enter>
          {doctor.specialty ? (
            <Enter as="p" delay={170} className="t-lead mt-4">
              {doctor.specialty}
            </Enter>
          ) : null}

          {facts.length ? (
            <Enter delay={230} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="sheen rounded-card p-4">
                  <Icon name={fact.icon} size={18} className="text-primary" />
                  <p className="mt-3 text-[12.5px] text-ink-3">{fact.label}</p>
                  <p className="mt-0.5 text-[15px] font-semibold leading-snug tracking-[-0.014em] text-ink">{fact.value}</p>
                </div>
              ))}
            </Enter>
          ) : null}

          <Enter delay={290} className="mt-8 flex flex-wrap items-center gap-2.5">
            {contact.phoneHref ? (
              <Button href={contact.phoneHref} size="lg" iconStart="phone" className="w-full sm:w-auto">
                {contact.phone}
              </Button>
            ) : null}
            {contact.phone ? <CopyButton value={contact.phone} label={labels.copy} copiedLabel={labels.copied} className="h-[52px] w-[52px]" /> : null}
            {contact.whatsappHref ? (
              <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="icon-btn btn-glass h-[52px] w-[52px]">
                <Icon name="whatsapp" size={21} className="text-[#1FAF57]" label={labels.whatsapp} />
              </a>
            ) : null}
            {contact.emailHref ? (
              <a href={contact.emailHref} className="icon-btn btn-glass h-[52px] w-[52px]">
                <Icon name="mail" size={20} label={labels.email} />
              </a>
            ) : null}
          </Enter>
        </div>
      </div>
    </section>
  );
}
