'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import TextLink from '@/components/ui/TextLink';
import Reveal, { RevealGroup, RevealItem, RevealWords } from '@/components/ui/Reveal';
import { blog, blogPosts, t } from '@/lib/data';

/**
 * Article card.
 *
 * The photograph stays still — the veil deepens and the headline shifts to the
 * accent on hover instead. A zooming thumbnail is the most common tell of a
 * bought template, and it fights the reader's eye.
 */
export function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
      <span className="framed img-veil relative block aspect-[4/3] w-full bg-surface-200">
        <Image
          src={post.image.src}
          alt={post.image.alt || ''}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <span className="absolute left-4 top-4 z-10 rounded-full bg-card/95 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-primary backdrop-blur">
          {post.category}
        </span>
      </span>

      <span className="mt-6 flex items-center gap-2.5 text-[14.5px] text-ink-faint">
        {post.date}
        <span className="h-1 w-1 rounded-full bg-line" />
        {post.readTime}
      </span>

      <h3 className="display-sm mt-3 text-[19px] leading-snug transition-colors duration-500 group-hover:text-accent">
        {post.title}
      </h3>

      <span className="mt-auto flex items-center gap-2.5 pt-6 text-[15px] font-medium text-primary">
        {t('common.readMore')}
        <Icon
          name="arrow-right"
          size={14}
          tone="accent"
          className="transition-transform duration-500 ease-ios group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

export default function BlogPreview({ limit = 3 }) {
  const posts = blogPosts().slice(0, limit);
  if (!posts.length) return null;

  return (
    <section className="section-pad">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">{blog.section.eyebrow}</p>
            </Reveal>
            <h2 className="display-lg mt-6">
              <RevealWords text={blog.section.title} italicWord={blog.section.italicWord} />
            </h2>
          </div>
          <Reveal delay={0.12}>
            <TextLink href={blog.section.cta.href} tone="primary">
              {blog.section.cta.label}
            </TextLink>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
