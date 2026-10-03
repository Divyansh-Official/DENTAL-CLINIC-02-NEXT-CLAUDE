import AccentText from './AccentText';
import Reveal from './Reveal';

/**
 * The heading block every section opens with: eyebrow, a large title with one
 * phrase in the brand gradient, an optional lead paragraph and actions.
 *
 *   align  'center' (Apple's default for a section) or 'left', where the
 *          actions sit opposite the title on wide screens — the shelf layout.
 */
export default function SectionHeader({
  eyebrow,
  title,
  accent,
  intro,
  align = 'center',
  as: Heading = 'h2',
  size = 'display',
  children,
  className = ''
}) {
  const titleClass = size === 'title' ? 't-title' : 't-display';

  if (align === 'left') {
    return (
      <Reveal className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 ${className}`}>
        <div className="max-w-3xl">
          {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
          <Heading className={`${titleClass} ${eyebrow ? 'mt-3' : ''}`}>
            <AccentText text={title} accent={accent} />
          </Heading>
          {intro ? <p className="t-lead mt-5 max-w-2xl">{intro}</p> : null}
        </div>
        {children ? <div className="flex flex-none flex-wrap items-center gap-3 md:pb-2">{children}</div> : null}
      </Reveal>
    );
  }

  return (
    <Reveal className={`mx-auto flex max-w-4xl flex-col items-center text-center ${className}`}>
      {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
      <Heading className={`${titleClass} ${eyebrow ? 'mt-3' : ''}`}>
        <AccentText text={title} accent={accent} />
      </Heading>
      {intro ? <p className="t-lead mt-5 max-w-2xl">{intro}</p> : null}
      {children ? <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </Reveal>
  );
}
