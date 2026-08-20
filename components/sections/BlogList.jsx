'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PostCard } from './BlogPreview';
import { blogPosts, t } from '@/lib/data';
import { IOS_SOFT, spring, tap } from '@/lib/motion';

/** Category-filtered article list sharing the segmented control pattern. */
export default function BlogList() {
  const posts = blogPosts();
  const reduceMotion = useReducedMotion();
  const allLabel = t('blog.allCategory') || 'All';

  const categories = useMemo(
    () => [allLabel, ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))],
    [posts, allLabel]
  );
  const [filter, setFilter] = useState(allLabel);

  const visible = filter === allLabel ? posts : posts.filter((post) => post.category === filter);

  if (!posts.length) return null;

  return (
    <>
      <div
        className="no-scrollbar -mx-[var(--shell-x)] flex gap-2 overflow-x-auto px-[var(--shell-x)]"
        role="group"
        aria-label="Filter articles"
      >
        {categories.map((category) => {
          const selected = category === filter;
          return (
            <motion.button
              key={category}
              type="button"
              whileTap={reduceMotion ? undefined : tap}
              onClick={() => setFilter(category)}
              aria-pressed={selected}
              className="relative whitespace-nowrap rounded-full px-5 py-2.5 text-[13px]"
            >
              {selected ? (
                <motion.span layoutId="blog-pill" transition={spring.snappy} className="absolute inset-0 rounded-full bg-primary" />
              ) : (
                <span className="absolute inset-0 rounded-full border border-line bg-card" />
              )}
              <span className={`relative z-10 ${selected ? 'text-on-primary' : 'text-ink-muted'}`}>{category}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.ul layout={!reduceMotion} className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((post) => (
            <motion.li
              key={post.slug}
              layout={!reduceMotion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55, ease: IOS_SOFT }}
              className="h-full"
            >
              <PostCard post={post} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
