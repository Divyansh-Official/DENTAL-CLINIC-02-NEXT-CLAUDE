import LiquidGlass from '@/components/glass/LiquidGlass';
import Enter from '@/components/motion/Enter';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import Icon from '@/components/ui/Icon';
import DetailHero from '@/components/sections/shared/DetailHero';
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
    <DetailHero image={doctor.image} focus="center 18%" split back={back} glass={glass} aside={aside}>
      <Enter delay={0}>
        <Breadcrumbs crumbs={crumbs} homeLabel={labels.home} label={labels.breadcrumb} align="left" />
      </Enter>
      {doctor.role ? (
        <Enter as="p" delay={60} className="t-eyebrow mt-7">
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

      <Enter delay={240} className="mt-8 flex flex-wrap items-center gap-2.5">
        {contact.phoneHref ? (
          <Button href={contact.phoneHref} size="lg" iconStart="phone" className="w-full sm:w-auto">
            {contact.phone}
          </Button>
        ) : null}
        {contact.phone ? (
          <CopyButton value={contact.phone} label={labels.copy} copiedLabel={labels.copied} className="btn-glass-dark !h-[52px] !w-[52px]" />
        ) : null}
        {contact.whatsappHref ? (
          <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="icon-btn btn-glass-dark h-[52px] w-[52px]">
            <Icon name="whatsapp" size={21} className="text-[#30D158]" label={labels.whatsapp} />
          </a>
        ) : null}
        {contact.emailHref ? (
          <a href={contact.emailHref} className="icon-btn btn-glass-dark h-[52px] w-[52px]">
            <Icon name="mail" size={20} label={labels.email} />
          </a>
        ) : null}
      </Enter>
    </DetailHero>
  );
}
