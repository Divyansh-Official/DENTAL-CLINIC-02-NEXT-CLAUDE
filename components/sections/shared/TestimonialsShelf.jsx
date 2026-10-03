import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import Rating from '@/components/ui/Rating';
import SectionHeader from '@/components/ui/SectionHeader';
import Shelf from '@/components/ui/Shelf';

/**
 * Patient reviews as a shelf of quote cards. Every card is rendered on the
 * server and the row simply scrolls, so the layout is identical before and
 * after hydration at every width — no jump from one card to three.
 */
export default function TestimonialsShelf({ items = [], section = {}, rating, labels = {}, tone = 'tone-white' }) {
  if (!items.length) return null;

  return (
    <section className={`${tone} section overflow-hidden`}>
      <div className="shell">
        <SectionHeader align="left" eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro}>
          {rating ? (
            <div className="sheen flex items-center gap-4 rounded-card px-5 py-4">
              <span className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-fg">{rating.value}</span>
              <span>
                <Rating value={rating.value} size={15} label={labels.ratingAria} />
                <span className="t-caption mt-1 block">{labels.ratingCaption}</span>
              </span>
            </div>
          ) : null}
        </SectionHeader>
      </div>

      <Shelf className="mt-12" label={section.title} itemWidth="clamp(280px, 82vw, 400px)" labels={labels.shelf}>
        {items.map((item) => (
          <figure key={item.id || item.name} className="tile flex h-full flex-col bg-tile p-7 sm:p-8">
            <Icon name="quote" size={28} className="text-primary/25" />
            <blockquote className="mt-4 flex-1 text-[18px] leading-[1.5] tracking-[-0.014em] text-fg">{item.quote}</blockquote>
            <figcaption className="mt-7 flex items-center gap-3.5 border-t border-hair pt-5">
              {item.avatar?.src ? (
                <span className="media relative h-11 w-11 flex-none overflow-hidden rounded-full">
                  <Image src={item.avatar.src} alt="" fill sizes="44px" className="object-cover" />
                </span>
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-fg">{item.name}</span>
                <span className="block truncate text-[13px] text-fg-3">{[item.location, item.treatment].filter(Boolean).join(' · ')}</span>
              </span>
              <Rating value={item.rating} size={12} label={(labels.ratingTemplate || '{score}').replace('{score}', item.rating)} />
            </figcaption>
          </figure>
        ))}
      </Shelf>
    </section>
  );
}
