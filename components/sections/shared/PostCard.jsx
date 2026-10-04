import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

/**
 * A journal article. The photograph stays still on hover — the title takes
 * the brand colour instead. `featured` lays it out wide beside its image.
 * Purely presentational; dates arrive already formatted.
 */
export default function PostCard({ post, date, featured = false, labels = {} }) {
  if (!post) return null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col ${featured ? 'gap-0 md:grid md:grid-cols-[1.25fr_1fr] md:items-center md:gap-10 lg:gap-14' : ''}`}
    >
      <span className={`media tile block w-full ${featured ? 'aspect-[16/10] md:aspect-[4/3]' : 'aspect-[16/10]'}`}>
        {post.image?.src ? (
          <Image
            src={post.image.src}
            alt={post.image.alt || ''}
            fill
            sizes={featured ? '(max-width: 768px) 100vw, 640px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'}
            className="object-cover"
          />
        ) : null}
        {post.category ? (
          <span className="glass absolute left-4 top-4 inline-flex h-7 items-center rounded-full px-3 text-[12px] font-medium text-ink">
            {post.category}
          </span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col">
        {featured && labels.featured ? <span className="t-eyebrow mt-6 md:mt-0">{labels.featured}</span> : null}
        <span className={`t-caption ${featured ? 'mt-2' : 'mt-5'}`}>{[date, post.readTime].filter(Boolean).join(' · ')}</span>
        <span className={`mt-2 font-semibold tracking-[-0.02em] text-fg transition-colors duration-300 group-hover:text-primary ${featured ? 't-title' : 't-headline'}`}>
          {post.title}
        </span>
        {post.excerpt ? <span className={`mt-3 text-fg-2 ${featured ? 't-lead' : 'clamp-2 text-[15px] leading-snug'}`}>{post.excerpt}</span> : null}
        <span className={`link-more pt-5 text-[15px] ${featured ? '' : 'mt-auto'}`}>
          {labels.readMore}
          <Icon name="chevron-right" size={14} strokeWidth={2} />
        </span>
      </span>
    </Link>
  );
}
