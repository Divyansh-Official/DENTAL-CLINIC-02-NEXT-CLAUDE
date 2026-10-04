import AccentText from '@/components/ui/AccentText';
import Aurora from '@/components/ui/Aurora';
import Button from '@/components/ui/Button';
import Enter from '@/components/motion/Enter';
import { clinicPhone, t } from '@/lib/data';

export const metadata = { title: t('pages.notFound.title'), robots: { index: false, follow: false } };

export default function NotFound() {
  const phone = clinicPhone();

  return (
    <section className="tone-white relative flex min-h-[78vh] items-center overflow-clip pb-24 pt-[calc(var(--header-h)+64px)]">
      <Aurora variant="hero" />
      <div className="shell relative text-center">
        <Enter as="p" className="t-eyebrow">
          {t('notFound.eyebrow')}
        </Enter>
        <Enter as="h1" delay={80} className="t-hero mx-auto mt-3 max-w-3xl">
          <AccentText text={t('notFound.title')} accent={t('notFound.accent')} />
        </Enter>
        <Enter as="p" delay={160} className="t-lead mx-auto mt-6 max-w-xl">
          {t('notFound.body')}
        </Enter>
        <Enter delay={240} className="mt-10 flex flex-col items-center justify-center gap-3 xs:flex-row">
          <Button href={t('notFound.cta.href') || '/'} size="lg" icon="arrow-right">
            {t('notFound.cta.label')}
          </Button>
          {phone.href ? (
            <Button href={phone.href} size="lg" variant="glass" iconStart="phone">
              {phone.value}
            </Button>
          ) : null}
        </Enter>
      </div>
    </section>
  );
}
