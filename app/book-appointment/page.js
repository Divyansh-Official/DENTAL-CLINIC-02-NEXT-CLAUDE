import JsonLd from '@/components/layout/JsonLd';
import BookingChannels from '@/components/sections/booking/BookingChannels';
import CallChecklist from '@/components/sections/booking/CallChecklist';
import EmergencyCallout from '@/components/sections/booking/EmergencyCallout';
import SpecialistDirectory from '@/components/sections/booking/SpecialistDirectory';
import LocationSection from '@/components/sections/shared/LocationSection';
import PageHero from '@/components/sections/shared/PageHero';
import OpenStatus from '@/components/ui/OpenStatus';
import {
  appointment,
  bookingChannels,
  clinic,
  clinicHours,
  clinicPhone,
  doctorContact,
  doctorItems,
  doctorSlug,
  emergencyLine,
  isEnabled,
  openStatusProps,
  page,
  t
} from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

/**
 * /book-appointment — the conversion page, with no form on purpose.
 * PageHero (status + response times) → BookingChannels → EmergencyCallout →
 * SpecialistDirectory → CallChecklist → LocationSection
 */
const meta = page('booking');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: t('appointment.metaDescription'), path: '/book-appointment' });

export default function BookAppointmentPage() {
  const address = clinic.contact?.address || {};
  const status = openStatusProps();
  const doctors = doctorItems().map((doctor) => ({
    ...doctor,
    slug: doctorSlug(doctor),
    href: `/team/${doctorSlug(doctor)}`,
    contact: doctorContact(doctor),
    labels: { whatsapp: t('common.whatsappLabel', { person: doctor.name }), email: t('common.emailLabel', { person: doctor.name }) }
  }));
  const responseTimes = Array.isArray(appointment.responseTimes) ? appointment.responseTimes : [];

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />
      <PageHero
        eyebrow={appointment.hero?.eyebrow}
        title={appointment.hero?.title}
        accent={appointment.hero?.accent}
        intro={appointment.hero?.intro}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
        below={
          <>
            <OpenStatus {...status} />
            {responseTimes.map((item) => (
              <span key={item.channel} className="glass inline-flex min-h-9 items-center gap-2 rounded-full px-4 py-1.5 text-[14px]">
                <span className="font-semibold text-ink">{item.channel}</span>
                <span className="text-ink-2">{item.time}</span>
              </span>
            ))}
          </>
        }
      />

      <BookingChannels channels={bookingChannels()} />
      <EmergencyCallout emergency={emergencyLine()} />

      <SpecialistDirectory
        doctors={doctors}
        section={{
          eyebrow: t('appointment.specialists.eyebrow'),
          title: t('appointment.specialists.title'),
          accent: t('appointment.specialists.accent'),
          intro: t('appointment.specialists.intro')
        }}
        labels={{
          availability: t('appointment.availabilityLabel'),
          qualification: t('appointment.qualificationLabel'),
          copy: t('common.copyLabel'),
          copied: t('common.copiedLabel')
        }}
      />

      <CallChecklist eyebrow={t('appointment.beforeYouCall')} title={appointment.whatToSay?.title} items={appointment.whatToSay?.items || []} note={appointment.note} />

      <LocationSection
        address={address}
        map={isEnabled('map') ? address.embedUrl : null}
        hours={clinicHours()}
        status={status}
        phone={clinicPhone()}
        tone="tone-gray"
        labels={{
          eyebrow: t('appointment.locationEyebrow'),
          mapTitle: `${t('common.mapTitlePrefix')} ${clinic.identity?.legalName || ''}`,
          directions: t('common.getDirections'),
          call: t('common.callTheClinic')
        }}
      />
    </>
  );
}
