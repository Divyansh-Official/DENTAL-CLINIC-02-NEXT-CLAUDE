import Reveal from '@/components/ui/Reveal';
import TextLink from '@/components/ui/TextLink';

/**
 * Service detail: the matching price list from treatments.json, linked by
 * the service's `pricing` key — so prices are written once and appear on
 * both the service page and the price table.
 */
export default function ServicePricing({ category, labels = {}, href }) {
  const items = Array.isArray(category?.items) ? category.items : [];
  if (!items.length) return null;

  return (
    <div className="mt-14">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="t-title">{labels.title}</h2>
        {href ? <TextLink href={href}>{labels.all}</TextLink> : null}
      </Reveal>
      <Reveal className="tile mt-6 bg-tile">
        <ul className="divide-y divide-hair">
          {items.map((item) => (
            <li key={item.name} className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
              <span>
                <span className="block text-[16px] font-semibold tracking-[-0.014em] text-fg">{item.name}</span>
                <span className="mt-0.5 block text-[13.5px] text-fg-3">{[item.visits, item.time].filter(Boolean).join(' · ')}</span>
              </span>
              <span className="flex-none text-right text-[16px] font-semibold text-primary">{item.price}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
