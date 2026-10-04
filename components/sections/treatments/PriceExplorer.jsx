'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import SegmentedControl from '@/components/ui/SegmentedControl';

/**
 * Treatments: a segmented control over a price list.
 *
 * The control is a real tablist (arrow keys move focus and selection
 * together). Each category's rows rise in when the tab changes. On a phone
 * a row stacks — name and price first, visits and time as chips beneath.
 */
export default function PriceExplorer({ categories = [], note, labels = {} }) {
  const [active, setActive] = useState(categories[0]?.id);
  if (!categories.length) return null;
  const category = categories.find((c) => c.id === active) || categories[0];
  const items = Array.isArray(category.items) ? category.items : [];

  return (
    <div>
      <div className="flex justify-center">
        <SegmentedControl
          mode="tabs"
          idPrefix="price"
          label={labels.tabs}
          value={category.id}
          onChange={setActive}
          items={categories.map((c) => ({ value: c.id, label: c.name, icon: c.icon }))}
        />
      </div>

      <div
        id="price-panel"
        role="tabpanel"
        aria-labelledby={`price-tab-${category.id}`}
        tabIndex={0}
        className="tile mt-10 overflow-hidden bg-tile"
      >
        <div className="hidden grid-cols-12 gap-4 border-b border-hair px-8 py-4 text-[13px] font-medium text-fg-3 md:grid">
          <span className="col-span-6">{labels.procedure}</span>
          <span className="col-span-2">{labels.visits}</span>
          <span className="col-span-2">{labels.time}</span>
          <span className="col-span-2 text-right">{labels.price}</span>
        </div>
        <ul key={category.id} className="divide-y divide-hair">
          {items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="enter grid grid-cols-1 gap-3 px-6 py-5 transition-colors hover:bg-fg/[0.02] md:grid-cols-12 md:items-center md:gap-4 md:px-8 md:py-6"
              style={{ '--d': index * 50, '--rise': '12px' }}
            >
              <div className="flex items-start justify-between gap-4 md:col-span-6">
                <div>
                  <p className="text-[17px] font-semibold tracking-[-0.016em] text-fg">{item.name}</p>
                  {item.note ? <p className="mt-1 text-[14px] text-fg-3">{item.note}</p> : null}
                </div>
                <p className="flex-none text-right text-[16px] font-semibold text-primary md:hidden">{item.price}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:contents">
                <p className="chip md:col-span-2 md:bg-transparent md:p-0 md:text-[15px] md:text-fg-2">
                  <Icon name="calendar" size={13} className="md:hidden" />
                  {item.visits}
                </p>
                <p className="chip md:col-span-2 md:bg-transparent md:p-0 md:text-[15px] md:text-fg-2">
                  <Icon name="clock" size={13} className="md:hidden" />
                  {item.time}
                </p>
              </div>
              <p className="hidden text-right text-[17px] font-semibold tracking-[-0.016em] text-primary md:col-span-2 md:block">{item.price}</p>
            </li>
          ))}
        </ul>
      </div>

      {note ? (
        <p className="mx-auto mt-6 flex max-w-3xl items-start justify-center gap-2.5 text-center text-[14px] leading-relaxed text-fg-3">
          <Icon name="shield" size={15} className="mt-0.5 flex-none text-primary" />
          {note}
        </p>
      ) : null}
    </div>
  );
}
