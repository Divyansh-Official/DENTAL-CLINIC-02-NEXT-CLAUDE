import LiquidGlass from '@/components/glass/LiquidGlass';
import Enter from '@/components/motion/Enter';
import ContactActions from '@/components/ui/ContactActions';
import Icon from '@/components/ui/Icon';
import DetailHero from '@/components/sections/shared/DetailHero';
import { DOCTOR_HERO } from '@/lib/heroes';
import { Breadcrumbs } from '@/components/sections/shared/PageHero';

/**
 * Dentist profile opening — the page a dentist's card zooms open into. The
 * portrait fills a phone screen and the right-hand side of a desktop one;
 * name, specialty and every way to reach them rise in at the foot, with a
 * pane of liquid glass carrying their qualification. Their quick facts
 * follow in DoctorFacts.
 */
export default function DoctorHero({ doctor, contact = {}, crumbs, labels = {}, back, glass = true }) {
  const Pane = glass ? LiquidGlass : 'div';
  const paneProps = glass ? { radius: 26, tone: 'dark', strength: 'full', elevation: 'float', lazy: true } : {};

  const aside = doctor.qualification ? (
    <Enter delay={320} effect="scale">
      <Pane {...paneProps} className={`flex max-w-[22rem] items-center gap-3.5 rounded-[26px] p-4 pr-6 ${glass ? '' : 'glass-dark'}`}>
        <span className="icon-tile" style={{ '--s': '46px' }}>
          <Icon name="graduation" size={22} />
        </span>
        <span className="min-w-0">
          <span className="block text-[12.5px] text-white/70">{labels.qualification}</span>
          <span className="block text-[16px] font-semibold leading-snug tracking-[-0.015em] text-white">{doctor.qualification}</span>
        </span>
      </Pane>
    </Enter>
  ) : null;

  return (
    <DetailHero image={doctor.image} focus={DOCTOR_HERO.focus} split={DOCTOR_HERO.split} back={back} glass={glass} aside={aside}>
      <Enter delay={0} className="hidden sm:block">
        <Breadcrumbs crumbs={crumbs} homeLabel={labels.home} label={labels.breadcrumb} align="left" />
      </Enter>
      {doctor.role ? (
        <Enter as="p" delay={60} className="t-eyebrow sm:mt-7">
          {doctor.role}
        </Enter>
      ) : null}
      <Enter as="h1" delay={110} className="t-hero mt-3 text-[clamp(2.6rem,1.5rem+4vw,5rem)]">
        {doctor.name}
      </Enter>
      {doctor.specialty ? (
        <Enter as="p" delay={170} className="t-lead mt-4">
          {doctor.specialty}
        </Enter>
      ) : null}

      <Enter delay={240} className="mt-8">
        <ContactActions
          tone="dark"
          size="lg"
          phone={contact.phone}
          phoneHref={contact.phoneHref}
          whatsappHref={contact.whatsappHref}
          emailHref={contact.emailHref}
          labels={labels}
        />
      </Enter>
    </DetailHero>
  );
}
