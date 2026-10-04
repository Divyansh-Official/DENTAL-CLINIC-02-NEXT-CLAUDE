import Link from 'next/link';
import AccentText from '@/components/ui/AccentText';
import Aurora from '@/components/ui/Aurora';
import Enter from '@/components/motion/Enter';
import Icon from '@/components/ui/Icon';

/**
 * The opening of every inner page: breadcrumb, eyebrow, a large title with
 * one phrase in the brand gradient, a lead paragraph and optional actions,
 * over a soft wash of brand colour. It recedes as the page scrolls away
 * (`data-vanish`).
 *
 * `crumbs` is the same array the page hands to breadcrumbSchema(), so the
 * visible trail and the structured data cannot drift apart.
 *
 *   align   'center' (default) or 'left' (articles)
 *   below   anything that should sit under the text — chips, a status pill
 */
export function Breadcrumbs({ crumbs = [], homeLabel, label, align = 'center' }) {
  if (!crumbs.length) return null;
  return (
    <nav aria-label={label} className={`flex ${align === 'center' ? 'justify-center' : ''}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-fg-3">
        <li>
          <Link href="/" className="transition-colors hover:text-fg">
            {homeLabel}
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={`${crumb.label}-${crumb.href || ''}`} className="flex items-center gap-1.5">
            <Icon name="chevron-right" size={12} strokeWidth={2} className="opacity-60" />
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors hover:text-fg">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-fg-2" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function PageHero({ eyebrow, title, accent, intro, crumbs = [], labels = {}, align = 'center', below, children }) {
  const centered = align === 'center';

  return (
    <section className="tone-white relative overflow-clip pb-[clamp(56px,7vw,104px)] pt-[calc(var(--header-h)+clamp(40px,6vw,88px))]">
      <Aurora variant="soft" />
      <div data-vanish className={`shell relative ${centered ? 'text-center' : ''}`} style={{ '--vanish': '55vh' }}>
        <Enter delay={0}>
          <Breadcrumbs crumbs={crumbs} homeLabel={labels.home} label={labels.breadcrumb} align={align} />
        </Enter>
        {eyebrow ? (
          <Enter delay={60} as="p" className="t-eyebrow mt-8">
            {eyebrow}
          </Enter>
        ) : null}
        <Enter delay={110} as="h1" className={`t-hero mt-3 ${centered ? 'mx-auto max-w-5xl' : 'max-w-4xl'}`}>
          <AccentText text={title} accent={accent} />
        </Enter>
        {intro ? (
          <Enter delay={180} as="p" className={`t-lead mt-6 max-w-2xl ${centered ? 'mx-auto' : ''}`}>
            {intro}
          </Enter>
        ) : null}
        {children ? (
          <Enter delay={240} className={`mt-9 flex flex-wrap items-center gap-3 ${centered ? 'justify-center' : ''}`}>
            {children}
          </Enter>
        ) : null}
        {below ? (
          <Enter delay={300} className={`mt-8 flex flex-wrap items-center gap-2.5 ${centered ? 'justify-center' : ''}`}>
            {below}
          </Enter>
        ) : null}
      </div>
    </section>
  );
}
