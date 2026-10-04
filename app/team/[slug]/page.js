import { notFound } from 'next/navigation';
import JsonLd from '@/components/layout/JsonLd';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PostCard from '@/components/cards/PostCard';
import ServiceCard from '@/components/cards/ServiceCard';
import TeamShelf from '@/components/sections/shared/TeamShelf';
import DoctorDetails from '@/components/sections/team/DoctorDetails';
import DoctorFacts from '@/components/sections/team/DoctorFacts';
import DoctorHero from '@/components/sections/team/DoctorHero';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  clinic,
  clinicPhone,
  doctorContact,
  doctorItems,
  doctorSlug,
  getDoctor,
  getDoctorSlugs,
  isEnabled,
  locale,
  page,
  postsByAuthor,
  servicesForDoctor,
  t
} from '@/lib/data';
import { formatDate } from '@/lib/format';
import { breadcrumbSchema, doctorSchema, pageMetadata } from '@/lib/seo';

/**
 * /team/[slug] — DoctorHero → DoctorFacts → DoctorDetails → treatments offered →
 * articles by them → the rest of the team → CtaBanner
 *
 * A new dentist in doctors.json gets this page automatically; every block
 * whose data is missing simply does not render.
 */
export function generateStaticParams() {
  return getDoctorSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doctor = getDoctor(slug);
  if (!doctor) return { title: t('pages.notFound.title'), robots: { index: false, follow: false } };
  return pageMetadata({
    title: `${doctor.name} — ${doctor.role || doctor.specialty || ''}`.replace(/ — $/, ''),
    description: doctor.bio,
    path: `/team/${doctorSlug(doctor)}`,
    image: doctor.image?.src
  });
}

export default async function DoctorPage({ params }) {
  const { slug } = await params;
  const doctor = getDoctor(slug);
  if (!doctor || !isEnabled('team')) notFound();

  const name = doctor.name;
  const crumbs = [{ label: page('team').crumb, href: '/team' }, { label: name }];
  const contact = doctorContact(doctor);
  const treatments = servicesForDoctor(doctor);
  const articles = postsByAuthor(name).map((post) => ({ ...post, displayDate: formatDate(post.date, locale.numberFormat) }));
  const others = doctorItems()
    .filter((d) => doctorSlug(d) !== slug)
    .map((d) => ({ ...d, href: `/team/${doctorSlug(d)}` }));

  return (
    <>
      <JsonLd schema={[doctorSchema(doctor), breadcrumbSchema(crumbs)]} />

      <DoctorHero
        doctor={doctor}
        contact={contact}
        crumbs={crumbs}
        glass={isEnabled('liquidGlass')}
        back={{ href: '/team', label: t('common.back') }}
        labels={{
          home: t('common.home'),
          breadcrumb: t('common.breadcrumbLabel'),
          qualification: t('team.profile.qualification'),
          copy: t('common.copyLabel'),
          copied: t('common.copiedLabel'),
          whatsapp: t('common.whatsappLabel', { person: name }),
          email: t('common.emailLabel', { person: name })
        }}
      />

      <DoctorFacts
        doctor={doctor}
        labels={{
          experience: t('team.profile.experience'),
          languages: t('team.profile.languages'),
          availability: t('team.profile.availability'),
          qualification: t('team.profile.qualification')
        }}
      />

      <DoctorDetails
        doctor={doctor}
        labels={{ about: t('team.profile.about'), expertise: t('team.profile.expertise'), education: t('team.profile.education') }}
      />

      {treatments.length ? (
        <section className="tone-white section">
          <div className="shell">
            <SectionHeader align="left" title={t('team.profile.treatments')} size="title" />
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {treatments.map((service, index) => (
                <Reveal as="li" key={service.slug} index={index % 3}>
                  <ServiceCard service={service} labels={{ from: t('common.from'), learnMore: t('common.learnMore') }} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {articles.length ? (
        <section className="tone-gray section">
          <div className="shell">
            <SectionHeader align="left" title={t('team.profile.articles', { doctor: name })} size="title" />
            <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((post, index) => (
                <Reveal as="li" key={post.slug} index={index % 3}>
                  <PostCard post={post} date={post.displayDate} labels={{ readMore: t('common.readMore') }} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <TeamShelf
        doctors={others}
        section={{ title: t('team.profile.others') }}
        linkHref="/team"
        labels={{ cta: t('home.team.cta'), viewProfile: t('common.viewProfile'), shelf: { previous: t('shelf.previous'), next: t('shelf.next') } }}
        tone={articles.length ? 'tone-white' : 'tone-gray'}
      />

      <CtaBanner
        banner={{ ...clinic.banners?.ready, cta: { label: t('team.profile.bookWith', { doctor: name }), href: '/book-appointment' } }}
        phone={contact.phoneHref ? { href: contact.phoneHref, value: contact.phone } : clinicPhone()}
        labels={{ call: contact.phone || t('common.callTheClinic') }}
      />
    </>
  );
}
