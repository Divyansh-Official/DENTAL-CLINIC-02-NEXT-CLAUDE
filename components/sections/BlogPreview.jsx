'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import TextLink from '@/components/ui/TextLink';
import Reveal, { RevealGroup, RevealItem, RevealWords } from '@/components/ui/Reveal';
import { blog, blogPosts, t } from '@/lib/data';
import { tap } from '@/lib/motion';

/** Article card. The image scales inside a fixed frame on hover. */
export function PostCard({ post }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div whileTap={reduceMotion ? undefined : tap} className="h-full">
      <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
        <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-card bg-surface-200">
          <Image
            src={post.image.src}
            alt={post.image.alt || ''}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1100ms] ease-ios group-hover:scale-[1.07]"
          />
          <span className="material absolute left-3 top-3 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.14em] text-primary">
            {post.category}
          </span>
        </span>

        <span className="mt-4 flex items-center gap-2 text-[11.5px] text-ink-faint">
          {post.date}
          <span className="h-1 w-1 rounded-full bg-line" />
          {post.readTime}
        </span>

        <h3 className="mt-2 font-display text-[17px] leading-snug text-primary transition-colors duration-500 group-hover:text-accent">
          {post.title}
        </h3>

        <span className="mt-auto flex items-center gap-2 pt-4 text-[12.5px] text-primary">
          {t('common.readMore')}
          <Icon name="arrow-right" size={12} tone="accent" className="transition-transform duration-500 ease-ios group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function BlogPreview({ limit = 4 }) {
  const posts = blogPosts().slice(0, limit);
  if (!posts.length) return null;

  return (
    <section className="section-pad">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Reveal>
              <p className="eyebrow">{blog.section.eyebrow}</p>
            </Reveal>
            <h2 className="display-lg mt-4">
              <RevealWords text={blog.section.title} italicWord={blog.section.italicWord} />
            </h2>
          </div>
          <Reveal delay={0.12}>
            <TextLink href={blog.section.cta.href} tone="primary">
              {blog.section.cta.label}
            </TextLink>
          </Reveal>
        </div>

        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <RevealItem key={post.slug} className="h-full">
              <PostCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
