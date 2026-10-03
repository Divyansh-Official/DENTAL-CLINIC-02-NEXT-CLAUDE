'use client';

import { useEffect, useState } from 'react';
import { formatTime, openStatus } from '@/lib/hours';

/**
 * Live "Open now · Closes 8:00 pm" indicator, evaluated in the clinic's time
 * zone wherever the visitor is.
 *
 * A static page cannot know the time it will be read, so the server (and the
 * first client render) show a neutral label and the real status is filled in
 * after mount, then refreshed every minute. Nothing ever disagrees during
 * hydration.
 *
 *   labels   strings from ui.json → status, with {time} and {day} left in place
 *   variant  'pill' (glass capsule) or 'inline'
 */
const weekdayName = (index, locale) => {
  try {
    return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 4 + index)));
  } catch {
    return '';
  }
};

const DAY_INDEX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

export default function OpenStatus({ hours = [], timeZone = 'UTC', locale = 'en-US', labels = {}, variant = 'pill', className = '' }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const tick = () => setStatus(openStatus(hours, timeZone) || { unknown: true });
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [hours, timeZone]);

  let state = 'loading';
  let headline = labels.loading || 'Opening hours';
  let detail = '';

  if (status && !status.unknown) {
    if (status.open) {
      state = 'open';
      headline = labels.openNow || 'Open now';
      detail = (labels.closesAt || 'Closes {time}').replace('{time}', formatTime(status.closes, locale));
    } else {
      state = 'closed';
      headline = labels.closed || 'Closed';
      const time = formatTime(status.opens, locale);
      const template =
        status.dayOffset === 0
          ? labels.opensToday || 'Opens today at {time}'
          : status.dayOffset === 1
            ? labels.opensTomorrow || 'Opens tomorrow at {time}'
            : labels.opensOn || 'Opens {day} at {time}';
      detail = template.replace('{time}', time).replace('{day}', weekdayName(DAY_INDEX[status.dayName] ?? 0, locale));
    }
  }

  const base =
    variant === 'pill'
      ? 'glass inline-flex min-h-9 items-center gap-2.5 rounded-full px-4 py-1.5 text-[14px] font-medium'
      : 'inline-flex items-center gap-2.5 text-[15px] font-medium';

  return (
    <span className={`${base} ${className}`} aria-live="polite">
      <span className="status-dot" data-state={state} aria-hidden="true" />
      <span className="text-fg">{headline}</span>
      {detail ? <span className="font-normal text-fg-2">· {detail}</span> : null}
    </span>
  );
}
