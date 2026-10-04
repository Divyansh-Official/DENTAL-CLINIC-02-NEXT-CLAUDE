import Image from 'next/image';
import MorphBack from '@/components/motion/MorphBack';
import Aurora from '@/components/ui/Aurora';

/**
 * The page a card opens into — a service, a dentist, an article.
 *
 * It fills the screen, as the card it grew from would: the photograph edge
 * to edge, the header's liquid glass floating over it, a glass Back control
 * that shrinks the page back into its card, and the content set at the foot.
 * `[data-morph-target]` marks it as the surface the card morphs into
 * (lib/morph.js), so it carries no entrance of its own; only its contents
 * rise in, once the card has landed.
 *
 *   image   { src, alt } — without one, a night sky of brand colour
 *   focus   CSS object-position for the photograph ('center 20%' for faces)
 *   split   on desktop the photograph takes the right-hand side (portraits)
 *   back    { href, label } — where Back leads when there is no history
 *   aside   a panel set at the foot on the right, on large screens
 */
export default function DetailHero({ image, focus = 'center', split = false, back, glass = true, aside, children }) {
  return (
    <section className="tone-dark">
      <div data-morph-target className="detail-hero" data-split={split ? '' : undefined}>
        {image?.src ? (
          <div className="detail-hero-media">
            <Image
              src={image.src}
              alt={image.alt || ''}
              fill
              priority
              fetchPriority="high"
              sizes={split ? '(max-width: 1024px) 100vw, 62vw' : '100vw'}
              className="object-cover"
              style={{ objectPosition: focus }}
            />
          </div>
        ) : (
          <Aurora variant="night" />
        )}
        <span className="detail-hero-scrim" aria-hidden="true" />

        {back?.href ? (
          <div className="shell relative pt-[calc(var(--header-h)+14px)]">
            <MorphBack href={back.href} label={back.label} glass={glass} />
          </div>
        ) : null}

        <div className="detail-hero-body shell relative mt-auto grid grid-cols-1 items-end gap-10 pt-16 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div data-vanish className="min-w-0 max-w-3xl" style={{ '--vanish': '70vh' }}>
            {children}
          </div>
          {aside ? <div className="hidden lg:block">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
