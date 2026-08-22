'use client';

import Reveal, { RevealWords } from './Reveal';

/**
 * The heading block used across every section: accent eyebrow, serif display
 * line with one word or phrase set in the accent italic, and an optional lead
 * paragraph held to a comfortable measure on the right.
 */
export default function SectionHeading({
  eyebrow,
  title,
  titleSecondLine,
  italicWord,
  intro,
  align = 'left',
  as = 'h2',
  children,
  className = ''
}) {
  const centered = align === 'center';
  const Heading = as;

  return (
    <div
      className={`${
        centered
          ? 'mx-auto flex max-w-3xl flex-col items-center text-center'
          : 'grid gap-x-12 gap-y-7 md:grid-cols-12 md:items-end'
      } ${className}`}
    >
      <div className={centered ? '' : 'md:col-span-7'}>
        {eyebrow ? (
          <Reveal>
            <p className="eyebrow mb-6">{eyebrow}</p>
          </Reveal>
        ) : null}
        <Heading className="display-lg">
          <RevealWords text={title} italicWord={italicWord} />
          {titleSecondLine ? (
            <>
              <br className="hidden sm:block" />{' '}
              <RevealWords text={titleSecondLine} italicWord={italicWord} delay={0.08} />
            </>
          ) : null}
        </Heading>
      </div>

      {intro || children ? (
        <div className={centered ? 'mt-7' : 'md:col-span-5 md:pb-2'}>
          {intro ? (
            <Reveal delay={0.15}>
              <p className="body-lead max-w-[30rem]">{intro}</p>
            </Reveal>
          ) : null}
          {children ? (
            <Reveal delay={0.22} className="mt-6">
              {children}
            </Reveal>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
