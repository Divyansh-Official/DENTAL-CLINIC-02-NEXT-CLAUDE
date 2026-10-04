'use client';

import { useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import SegmentedControl from '@/components/ui/SegmentedControl';
import PostCard from '@/components/cards/PostCard';
import { filterTransition } from '@/lib/morph';

/**
 * Journal index: a category filter, the latest article featured wide, and the
 * rest in a grid. Categories are collected from the posts themselves, so a
 * new category appears in the filter as soon as a post uses it. Changing the
 * filter glides the cards to their new places (View Transitions).
 */
export default function BlogExplorer({ posts = [], labels = {} }) {
  const all = labels.all || 'All';
  const categories = useMemo(() => [all, ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))], [posts, all]);
  const [filter, setFilter] = useState(all);

  const visible = filter === all ? posts : posts.filter((post) => post.category === filter);
  const [featured, ...rest] = visible;

  const change = (value) => filterTransition(() => flushSync(() => setFilter(value)));

  if (!posts.length) return null;

  return (
    <>
      {categories.length > 2 ? (
        <div className="flex justify-center">
          <SegmentedControl label={labels.filter} value={filter} onChange={change} items={categories.map((c) => ({ value: c, label: c }))} />
        </div>
      ) : null}

      {featured ? (
        <div className="mt-12" data-vt style={{ '--vt': 'journal-featured' }}>
          <PostCard post={featured} date={featured.displayDate} featured labels={labels} />
        </div>
      ) : null}

      {rest.length ? (
        <ul className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 border-t border-hair pt-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <li key={post.slug} data-vt style={{ '--vt': `journal-${post.slug}` }}>
              <PostCard post={post} date={post.displayDate} labels={labels} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
