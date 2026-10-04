import JsonLd from '@/components/layout/JsonLd';
import ContactChannels from '@/components/sections/contact/ContactChannels';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import LocationSection from '@/components/sections/shared/LocationSection';
import PageHero from '@/components/sections/shared/PageHero';
import Button from '@/components/ui/Button';
import OpenStatus from '@/components/ui/OpenStatus';
import {
  clinic,
  clinicHours,
  clinicPhone,
  contactChannel,
  isEnabled,
  navCta,
  openStatusProps,
  page,
  socialLinks,
  t,
  ui
} from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

/** /contact — PageHero (live status) → ContactChannels → LocationSection → CtaBanner */
const meta = page('contact');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: t('contact.metaDescription'), path: '/contact' });

export default function ContactPage() {
  const address = clinic.contact?.address || {};
  const status = openStatusProps();
  const channels = (Array.isArray(ui.contact?.channels) ? ui.contact.channels : [])
    .map((channel) => ({ ...channel, ...contactChannel(channel.field) }))
    .filter((channel) => channel.value && channel.href);

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />
      <PageHero
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        accent={t('contact.accent')}
        intro={t('contact.intro')}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
        below={<OpenStatus {...status} />}
      >
        <Button href={navCta.href} size="lg" iconStart="calendar">
          {t('contact.bookCta')}
        </Button>
      </PageHero>

      <ContactChannels channels={channels} />

      <LocationSection
        address={address}
        map={isEnabled('map') ? address.embedUrl : null}
        hours={clinicHours()}
        status={status}
        phone={clinicPhone()}
        socials={socialLinks()}
        labels={{
          eyebrow: t('contact.visitEyebrow'),
          mapTitle: `${t('common.mapTitlePrefix')} ${clinic.identity?.legalName || ''}`,
          directions: t('common.getDirections'),
          call: t('common.callTheClinic'),
          followUs: t('common.followUs')
        }}
      />

      <CtaBanner banner={clinic.banners?.ready} phone={clinicPhone()} labels={{ call: t('common.callTheClinic') }} tone="tone-gray" />
    </>
  );
}
