import PageHero from '@/components/sections/PageHero';
import ReadyBanner from '@/components/sections/ReadyBanner';
import JsonLd from '@/components/layout/JsonLd';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { clinic, clinicHours, contactChannel, isEnabled, navCta, t, ui } from '@/lib/data';
import { linkAttrs } from '@/lib/format';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const CRUMBS = [{ label: 'Contact' }];

export const metadata = pageMetadata({
  title: 'Contact',
  description: `Reach ${clinic.identity.legalName} in ${clinic.contact.address.city} by phone, WhatsApp or email.`,
  path: '/contact'
});

export default function ContactPage() {
  const address = clinic.contact.address;

  /* Channels are declared in ui.json by the clinic.contact key they point at,
     so a phone number is never written down in two places. */
  const channels = (ui.contact?.channels || [])
    .map((channel) => ({ ...channel, ...contactChannel(channel.field) }))
    .filter((channel) => channel.value && channel.href);

  const intro = [t('contact.intro'), address.parkingNote].filter(Boolean).join(' ');

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS, t('common.home'))} />

      <PageHero
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        italicWord={t('contact.italicWord')}
        intro={intro}
        breadcrumb={CRUMBS}
      >
        <Button href={navCta.href} size="lg">
          {t('contact.bookCta')}
        </Button>
      </PageHero>

      <section className="section-pad">
        <div className="shell">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <RevealItem key={channel.label} className="h-full">
                <a
                  href={channel.href}
                  {...linkAttrs(channel.href)}
                  className="group flex h-full flex-col rounded-card border border-line bg-card p-8 transition-all duration-500 ease-ios hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-200 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-on-primary">
                    <Icon name={channel.icon} size={20} />
                  </span>
                  <span className="mt-6 block text-[11px] uppercase tracking-[0.18em] text-accent">
                    {channel.label}
                  </span>
                  <span className="mt-2 block font-display text-[24px] leading-snug text-primary">
                    {channel.value}
                  </span>
                  <span className="mt-auto pt-4 text-[13.5px] text-ink-faint">{channel.note}</span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
            {isEnabled('map') && address.embedUrl ? (
              <div className="lg:col-span-7">
                <Reveal>
                  <div className="overflow-hidden rounded-panel border border-line">
                    <iframe
                      title={`${t('common.mapTitlePrefix')} ${clinic.identity.legalName}`}
                      src={address.embedUrl}
                      className="h-[380px] w-full border-0 grayscale-[0.35] transition-all duration-700 hover:grayscale-0 sm:h-[440px]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                </Reveal>
              </div>
            ) : null}

            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow">{t('contact.visitEyebrow')}</p>
                <h2 className="display-md mt-4">{address.line1}</h2>
                <p className="mt-2 text-[15px] text-ink-muted">{address.line2}</p>

                <div className="mt-7 rounded-card border border-line bg-card p-8">
                  <p className="eyebrow">{t('common.openingHours')}</p>
                  <ul className="mt-4 space-y-3">
                    {clinicHours().map((slot) => (
                      <li
                        key={slot.days}
                        className="flex items-center justify-between border-b border-line pb-3 text-[14.5px] last:border-0 last:pb-0"
                      >
                        <span className="text-primary">{slot.days}</span>
                        <span className="text-ink-muted">{slot.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {address.mapsUrl ? (
                    <Button href={address.mapsUrl} variant="outline" icon="directions">
                      {t('common.getDirections')}
                    </Button>
                  ) : null}
                  <Button href={clinic.contact.phoneHref} icon="phone">
                    {t('common.callTheClinic')}
                  </Button>
                </div>

                {clinic.socials?.length ? (
                  <ul className="mt-8 flex items-center gap-3">
                    {clinic.socials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          {...linkAttrs(social.href)}
                          className="grid h-10 w-10 place-items-center rounded-full border border-line text-primary transition-colors duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent"
                        >
                          <Icon name={social.icon} size={14} label={social.label} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ReadyBanner />
    </>
  );
}
