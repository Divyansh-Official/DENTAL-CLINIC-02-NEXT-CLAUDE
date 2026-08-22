'use client';

import Button from '@/components/ui/Button';
import { clinic, t } from '@/lib/data';

/**
 * Runtime error boundary. A clinic site failing to render should still put the
 * phone number in front of the visitor — that is the conversion path the whole
 * site exists to protect.
 */
export default function Error({ error, reset }) {
  const title = t('error.title');
  const accent = t('error.italicWord');
  const [before, ...rest] = accent && title.includes(accent) ? title.split(accent) : [title];

  return (
    <section className="shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">{t('error.eyebrow')}</p>
      <h1 className="display-xl mt-5">
        {before}
        {rest.length ? <span className="italic text-accent">{accent}</span> : null}
        {rest.join(accent)}
      </h1>
      <p className="body-lead mt-5 max-w-md">{t('error.body')}</p>

      {process.env.NODE_ENV !== 'production' && error?.message ? (
        <pre className="mt-6 max-w-xl overflow-x-auto rounded-card border border-line bg-card p-8 text-left text-[13.5px] text-ink-muted">
          {error.message}
        </pre>
      ) : null}

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} icon="arrow-right">
          {t('error.retry')}
        </Button>
        <Button href={clinic.contact.phoneHref} variant="outline" icon="phone">
          {clinic.contact.phone}
        </Button>
      </div>
    </section>
  );
}
