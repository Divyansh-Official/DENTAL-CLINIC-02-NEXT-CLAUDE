import Image from 'next/image';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Reveal from '@/components/motion/Reveal';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';

/**
 * Apple's bento grid: tiles of different sizes packed into one block —
 * photographs carrying a pane of liquid glass, big gradient figures, and
 * plain icon tiles. Six columns on a desktop, two on a tablet, one on a
 * phone; `grid-flow-dense` re-packs the grid whatever the clinic adds.
 *
 *   size   large (2 × 2 photo) · wide · tall · small
 *   image  makes a photo tile;  stat + statLabel  make a figure tile
 */
const SIZES = {
  large: 'sm:col-span-2 lg:col-span-4 lg:row-span-2',
  wide: 'sm:col-span-2 lg:col-span-4',
  tall: 'lg:col-span-2 lg:row-span-2',
  small: 'lg:col-span-2'
};

function PhotoTile({ item, glass }) {
  const big = item.size === 'large' || item.size === 'tall';
  const Pane = glass ? LiquidGlass : 'div';
  const paneProps = glass ? { radius: 22, tone: 'dark', strength: 'full', elevation: 'raised', lazy: true } : {};

  return (
    <div className={`tile media flex w-full flex-col justify-end bg-night ${big ? 'min-h-[440px]' : 'min-h-[320px]'}`}>
      <Image
        src={item.image.src}
        alt={item.image.alt || ''}
        fill
        sizes={big ? '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 800px' : '(max-width: 1024px) 100vw, 800px'}
        className="object-cover"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden="true" />
      <Pane {...paneProps} className={`relative m-3 flex items-start gap-3.5 rounded-[22px] p-4 sm:m-4 sm:p-5 ${glass ? '' : 'glass-dark'}`}>
        <span className="icon-tile" style={{ '--s': '42px' }}>
          <Icon name={item.icon} size={20} />
        </span>
        <span className="min-w-0">
          <span className="block text-[17px] font-semibold leading-snug tracking-[-0.018em] text-white">{item.title}</span>
          {item.text ? <span className="mt-1 block text-[14.5px] leading-snug text-white/75">{item.text}</span> : null}
        </span>
      </Pane>
    </div>
  );
}

function PlainTile({ item }) {
  return (
    <div className="sheen flex w-full flex-col rounded-card p-6 sm:p-7">
      <span className="icon-tile" style={{ '--s': '46px' }}>
        <Icon name={item.icon} size={22} />
      </span>
      <h3 className="t-headline mt-5 text-fg">{item.title}</h3>
      {item.text ? <p className="t-small mt-2">{item.text}</p> : null}
      {item.stat ? (
        <p className="stat-tile mt-auto pt-8">
          <span className="t-stat text-gradient block whitespace-nowrap">{item.stat}</span>
          {item.statLabel ? <span className="t-small mt-1.5 block">{item.statLabel}</span> : null}
        </p>
      ) : null}
    </div>
  );
}

export default function FeatureBento({ section = {}, items = [], tone = 'tone-gray', glass = true }) {
  if (!items.length) return null;

  return (
    <section className={`${tone} section`}>
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro} />
        <ul className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(260px,auto)] lg:grid-cols-6 lg:gap-5">
          {items.map((item, index) => (
            <Reveal as="li" key={`${item.title}-${index}`} index={index % 3} className={`flex ${SIZES[item.size] || SIZES.small}`}>
              {item.image?.src ? <PhotoTile item={item} glass={glass} /> : <PlainTile item={item} />}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
