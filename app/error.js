'use client';

import Button from '@/components/ui/Button';
import clinic from '@/data/clinic.json';
import ui from '@/data/ui.json';
import { telHref } from '@/lib/format';

/**
 * Runtime error boundary. A clinic site that fails to render should still
 * put the phone number in front of the visitor — the conversion path the
 * whole site exists to protect.
 *
 * It reads only the few fields it needs straight from JSON (static property
 * access, so the bundler includes nothing else), because a client component
 * cannot import the server data layer.
 */
export default function Error({ error, reset }) {
  const copy = ui.error || {};
  const phone = clinic.contact?.phone;

  return (
    <section className="tone-white flex min-h-[72vh] items-center pb-24 pt-[calc(var(--header-h)+64px)]">
      <div className="shell text-center">
        <p className="t-eyebrow">{copy.eyebrow}</p>
        <h1 className="t-hero mx-auto mt-3 max-w-3xl">{copy.title}</h1>
        <p className="t-lead mx-auto mt-6 max-w-xl">{copy.body}</p>
        {process.env.NODE_ENV !== 'production' && error?.message ? (
          <pre className="mx-auto mt-8 max-w-xl overflow-x-auto rounded-card bg-surface p-6 text-left text-[13px] text-ink-2">{error.message}</pre>
        ) : null}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 xs:flex-row">
          <Button onClick={reset} size="lg" icon="arrow-right">
            {copy.retry}
          </Button>
          {phone ? (
            <Button href={telHref(phone)} size="lg" variant="glass" iconStart="phone">
              {phone}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
