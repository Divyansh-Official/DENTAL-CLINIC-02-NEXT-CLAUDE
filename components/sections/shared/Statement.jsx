import { Fragment } from 'react';
import Reveal from '@/components/motion/Reveal';

/**
 * A large statement whose words light up one after another as it scrolls
 * through the screen — the device Apple's product pages use for the sentence
 * that matters. Driven by a CSS view timeline (`.statement` in globals.css);
 * without one, or with reduced motion, every word is simply lit.
 *
 * `accent` is a phrase from `text` set in the brand colour.
 */
function accentRange(words, accent) {
  const target = String(accent || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
  if (!target.length) return [-1, -1];
  for (let i = 0; i + target.length <= words.length; i += 1) {
    if (target.every((word, k) => words[i + k].toLowerCase() === word)) return [i, i + target.length];
  }
  return [-1, -1];
}

export default function Statement({ statement, tone = 'tone-white' }) {
  const text = String(statement?.text || '').trim();
  if (!text) return null;

  const words = text.split(/\s+/);
  const [from, to] = accentRange(words, statement.accent);

  return (
    <section className={`${tone} section`}>
      <div className="shell">
        {statement.eyebrow ? (
          <Reveal as="p" className="t-eyebrow">
            {statement.eyebrow}
          </Reveal>
        ) : null}
        <Reveal>
          <p className="statement mt-5 max-w-[1040px]" style={{ '--n': words.length }}>
            {words.map((word, index) => (
              <Fragment key={`${index}-${word}`}>
                <span style={{ '--i': index }} className={index >= from && index < to ? 'is-accent' : undefined}>
                  {word}
                </span>
                {index < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
