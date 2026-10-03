'use client';

import { useId, useMemo, useState } from 'react';
import Accordion from '@/components/ui/Accordion';
import Icon from '@/components/ui/Icon';

/**
 * Patient info FAQ with live search. Every question is server-rendered and
 * in the page (and in the FAQPage structured data); typing simply narrows
 * the list. Answers are native <details>, so they work with JavaScript off.
 */
export default function FaqExplorer({ items = [], labels = {} }) {
  const [query, setQuery] = useState('');
  const inputId = useId();
  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => (q ? items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(q)) : items),
    [items, q]
  );

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        {labels.searchLabel}
      </label>
      <div className="relative">
        <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-3" />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.searchPlaceholder}
          autoComplete="off"
          className="h-12 w-full rounded-full border-0 bg-tile pl-11 pr-4 text-[16px] text-fg shadow-[inset_0_0_0_1px_rgb(var(--hair))] outline-none transition-shadow placeholder:text-fg-3 focus:shadow-[inset_0_0_0_2px_rgb(var(--c-primary))]"
        />
      </div>

      {visible.length ? (
        <Accordion key={q} items={visible} group="patient-faq" defaultOpen={q ? 0 : -1} className="mt-4" />
      ) : (
        <p className="t-body mt-8" role="status">
          {(labels.noResults || '').replace('{query}', query.trim())}
        </p>
      )}
    </div>
  );
}
