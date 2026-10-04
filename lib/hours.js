/**
 * Opening hours, evaluated in the clinic's own time zone.
 *
 * Pure functions with no data imports, so both server and client components
 * can use them. The live "Open now" pill computes on the client after mount —
 * a static page cannot know the time a visitor reads it.
 */

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const toMinutes = (hhmm) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm ?? ''));
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

/** The weekday index and minutes past midnight right now, in `timeZone`. */
export function clinicNow(timeZone, now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(now);
    const get = (type) => parts.find((part) => part.type === type)?.value;
    return { day: DAYS.indexOf(get('weekday')), minutes: Number(get('hour')) * 60 + Number(get('minute')) };
  } catch {
    return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
  }
}

/** "20:00" → "8:00 pm" (or "20:00") in the site locale. */
export function formatTime(hhmm, locale = 'en-US') {
  const minutes = toMinutes(hhmm);
  if (minutes == null) return String(hhmm ?? '');
  const date = new Date(Date.UTC(2020, 0, 1, Math.floor(minutes / 60), minutes % 60));
  try {
    return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(date);
  } catch {
    return hhmm;
  }
}

const slotsFor = (hours, dayIndex) =>
  (Array.isArray(hours) ? hours : []).filter(
    (slot) => Array.isArray(slot.dayOfWeek) && slot.dayOfWeek.includes(DAYS[dayIndex]) && toMinutes(slot.opens) != null && toMinutes(slot.closes) != null
  );

/**
 * Is the clinic open, and until when — or when does it next open?
 * Returns { open: true, closes } or { open: false, opens, dayOffset } or null.
 */
export function openStatus(hours, timeZone, now = new Date()) {
  const { day, minutes } = clinicNow(timeZone, now);
  if (day < 0) return null;

  for (const slot of slotsFor(hours, day)) {
    if (minutes >= toMinutes(slot.opens) && minutes < toMinutes(slot.closes)) {
      return { open: true, closes: slot.closes };
    }
  }

  for (let offset = 0; offset < 8; offset += 1) {
    const slots = slotsFor(hours, (day + offset) % 7)
      .map((slot) => toMinutes(slot.opens))
      .filter((opens) => offset > 0 || opens > minutes)
      .sort((a, b) => a - b);
    if (slots.length) {
      const opens = slots[0];
      return {
        open: false,
        dayOffset: offset,
        dayName: DAYS[(day + offset) % 7],
        opens: `${String(Math.floor(opens / 60)).padStart(2, '0')}:${String(opens % 60).padStart(2, '0')}`
      };
    }
  }
  return null;
}

/** Which row of the hours list is today, for highlighting. */
export function todayIndex(hours, timeZone, now = new Date()) {
  const { day } = clinicNow(timeZone, now);
  return (Array.isArray(hours) ? hours : []).findIndex(
    (slot) => Array.isArray(slot.dayOfWeek) && slot.dayOfWeek.includes(DAYS[day])
  );
}
