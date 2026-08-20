import Button from '@/components/ui/Button';
import { clinic, t } from '@/lib/data';

export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };

export default function NotFound() {
  const title = t('notFound.title');
  const accent = t('notFound.italicWord');
  const [before, ...rest] = accent && title.includes(accent) ? title.split(accent) : [title];

  return (
    <section className="shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">{t('notFound.eyebrow')}</p>
      <h1 className="display-xl mt-5">
        {before}
        {rest.length ? <span className="italic text-accent">{accent}</span> : null}
        {rest.join(accent)}
      </h1>
      <p className="body-lead mt-5 max-w-md">{t('notFound.body')}</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button href="/">{t('notFound.cta.label')}</Button>
        <Button href={clinic.contact.phoneHref} variant="outline" icon="phone">
          {clinic.contact.phone}
        </Button>
      </div>
    </section>
  );
}
