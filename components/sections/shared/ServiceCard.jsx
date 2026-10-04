import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

/**
 * Service card, in two forms.
 *
 *   'feature'  Apple's "Get to know" tile — a tall photograph with the title
 *              set over it and glass chips at the foot. Used in shelves.
 *   'card'     A white tile with the photograph on top. Used in grids.
 *
 * Purely presentational: every value arrives as a prop, so it renders in
 * server and client components alike.
 */
export default function ServiceCard({ service, variant = 'card', labels = {} }) {
  if (!service) return null;
  const href = `/services/${service.slug}`;

  if (variant === 'feature') {
    return (
      <Link
        href={href}
        className="tile tile-hover group flex h-[clamp(440px,62vh,540px)] flex-col bg-night text-white"
      >
        {service.image?.src ? (
          <Image
            src={service.image.src}
            alt={service.image.alt || ''}
            fill
            sizes="(max-width: 640px) 80vw, 340px"
            className="object-cover"
          />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/60" aria-hidden="true" />
        <span className="relative flex flex-col p-7">
          <span className="flex items-center gap-2 text-[13px] font-medium text-white/75">
            <Icon name={service.icon} size={16} />
            {service.duration}
          </span>
          <span className="mt-3 text-[clamp(1.5rem,1.25rem+0.8vw,1.85rem)] font-semibold leading-[1.12] tracking-[-0.025em]">
            {service.title}
          </span>
          <span className="clamp-3 mt-3 text-[15px] leading-snug text-white/80">{service.excerpt}</span>
        </span>
        <span className="relative mt-auto flex items-center justify-between gap-3 p-5">
          {service.priceFrom ? (
            <span className="glass-dark inline-flex h-9 items-center rounded-full px-4 text-[13.5px] font-medium">
              {labels.from} {service.priceFrom}
            </span>
          ) : (
            <span />
          )}
          <span className="glass-dark grid h-10 w-10 place-items-center rounded-full transition-transform duration-500 ease-ios group-hover:translate-x-1">
            <Icon name="arrow-right" size={17} strokeWidth={1.9} />
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} className="tile tile-hover group flex h-full flex-col bg-tile">
      <span className="media block aspect-[16/10] w-full">
        {service.image?.src ? (
          <Image src={service.image.src} alt={service.image.alt || ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover" />
        ) : null}
      </span>
      <span className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="icon-tile relative z-10 -mt-[52px] mb-4 ring-4 ring-tile" style={{ '--s': '50px' }}>
          <Icon name={service.icon} size={23} />
        </span>
        <span className="t-headline text-fg">{service.title}</span>
        <span className="clamp-3 mt-2 text-[15px] leading-snug text-fg-2">{service.excerpt}</span>
        <span className="mt-5 flex flex-wrap gap-2">
          {service.duration ? (
            <span className="chip">
              <Icon name="clock" size={13} />
              {service.duration}
            </span>
          ) : null}
          {service.priceFrom ? (
            <span className="chip">
              {labels.from} {service.priceFrom}
            </span>
          ) : null}
        </span>
        <span className="link-more mt-auto pt-6 text-[15px]">
          {labels.learnMore}
          <Icon name="chevron-right" size={14} strokeWidth={2} />
        </span>
      </span>
    </Link>
  );
}
