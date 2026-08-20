import PageHero from '@/components/sections/PageHero';
import AppointmentContact from '@/components/sections/AppointmentContact';
import JsonLd from '@/components/layout/JsonLd';
import Icon from '@/components/ui/Icon';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { appointment, clinic, clinicHours, isEnabled, t } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const CRUMBS = [{ label: 'Book Appointment' }];

export const metadata = pageMetadata({
  title: 'Book Appointment',
  description: t('appointment.metaDescription'),
  path: '/book-appointment'
});

export default function BookAppointmentPage() {
  const address = clinic.contact.address;

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS, t('common.home'))} />

      <PageHero
        eyebrow={appointment.hero.eyebrow}
        title={`${appointment.hero.title} ${appointment.hero.titleSecondLine}`}
        italicWord={appointment.hero.italicWord}
        intro={appointment.hero.intro}
        breadcrumb={CRUMBS}
      >
        <ul className="flex flex-wrap gap-2.5">
          {(appointment.responseTimes || []).map((item) => (
            <li
              key={item.channel}
              className="flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-[12px] text-ink-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-primary">{item.channel}</span>
              {item.time}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="section-pad">
        <div className="shell">
          <AppointmentContact />
        </div>
      </section>

      {appointment.emergency ? (
        <section className="pb-4">
          <div className="shell">
            <Reveal>
              <div className="grain relative overflow-hidden rounded-panel border border-accent/30 bg-accent/[0.07] p-8 sm:p-10">
                <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                  <div className="flex items-start gap-5 lg:col-span-7">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-card">
                      <Icon name={appointment.emergency.icon} size={24} tone="accent" />
                    </span>
                    <div>
                      <h2 className="font-display text-[24px] text-primary">{appointment.emergency.title}</h2>
                      <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-ink-muted">
                        {appointment.emergency.text}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 lg:justify-self-end">
                    <a
                      href={appointment.emergency.href}
                      className="group flex items-center gap-4 rounded-card bg-primary px-6 py-4 transition-transform duration-500 ease-ios hover:-translate-y-1"
                    >
                      <Icon name="phone" size={18} tone="accent" />
                      <span>
                        <span className="block text-[11px] uppercase tracking-[0.18em] text-on-primary/45">
                          {appointment.emergency.action}
                        </span>
                        <span className="mt-1 block font-display text-[20px] text-on-primary">
                          {appointment.emergency.phone}
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="section-pad">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow">{t('appointment.beforeYouCall')}</p>
            <h2 className="display-lg mt-4 text-[clamp(1.8rem,3.4vw,2.6rem)]">{appointment.whatToSay.title}</h2>

            <RevealGroup className="mt-8 space-y-3">
              {appointment.whatToSay.items.map((item, index) => (
                <RevealItem key={item} className="flex items-start gap-4 rounded-card border border-line bg-card p-5">
                  <span className="font-display text-[14px] text-accent">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-[13.5px] leading-relaxed text-primary">{item}</span>
                </RevealItem>
              ))}
            </RevealGroup>

            {appointment.note ? (
              <p className="mt-6 flex items-start gap-2.5 text-[12px] leading-relaxed text-ink-faint">
                <Icon name="shield" size={13} tone="accent" className="mt-0.5" />
                {appointment.note}
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="overflow-hidden rounded-panel border border-line bg-card">
                {isEnabled('map') && address.embedUrl ? (
                  <iframe
                    title={`${t('common.mapTitlePrefix')} ${clinic.identity.legalName}`}
                    src={address.embedUrl}
                    className="h-[320px] w-full border-0 grayscale-[0.35] transition-all duration-700 hover:grayscale-0 sm:h-[380px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : null}

                <div className="grid gap-6 p-7 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow">{t('appointment.addressLabel')}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-primary">
                      {address.line1}
                      <br />
                      {address.line2}
                    </p>
                    {address.mapsUrl ? (
                      <a
                        href={address.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-[13px] text-accent transition-opacity hover:opacity-75"
                      >
                        <Icon name="directions" size={13} />
                        {t('common.getDirections')}
                      </a>
                    ) : null}
                  </div>

                  <div>
                    <p className="eyebrow">{t('common.openingHours')}</p>
                    <ul className="mt-3 space-y-2">
                      {clinicHours().map((slot) => (
                        <li key={slot.days} className="flex justify-between text-[13px] text-ink-muted">
                          <span className="text-primary">{slot.days}</span>
                          <span>{slot.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
