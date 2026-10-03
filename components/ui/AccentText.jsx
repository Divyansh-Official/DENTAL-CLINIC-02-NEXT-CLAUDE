import { Fragment } from 'react';
import { markAccent } from '@/lib/format';

/**
 * A heading with one word or phrase set in the brand gradient.
 *
 * Matching is whole-word and case-insensitive, and punctuation stays exactly
 * where it was written — "Real smiles." keeps its full stop against the word.
 * The text is never split into per-word boxes, so headings wrap naturally at
 * every screen width.
 */
export default function AccentText({ text, accent }) {
  return markAccent(text, accent).map((segment, index) =>
    segment.accent ? (
      <span key={index} className="text-gradient">
        {segment.text}
      </span>
    ) : (
      <Fragment key={index}>{segment.text}</Fragment>
    )
  );
}
