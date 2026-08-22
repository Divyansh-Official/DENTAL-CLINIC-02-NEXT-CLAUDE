import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageHero from '@/components/sections/PageHero';
import ReadyBanner from '@/components/sections/ReadyBanner';
import { PostCard } from '@/components/sections/BlogPreview';
import JsonLd from '@/components/layout/JsonLd';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { clinic, getPost, getPostSlugs, getRelatedPosts, t } from '@/lib/data';
import { articleSchema, breadcrumbSchema, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const post = getPost(params.slug);
  if (!post) return { title: 'Article not found', robots: { index: false, follow: false } };
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image?.src,
    type: 'article',
    publishedTime: Number.isNaN(Date.parse(post.date)) ? undefined : new Date(post.date).toISOString(),
    authors: post.author ? [post.author] : undefined
  });
}

export default function BlogPostPage({ params }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const crumbs = [{ label: 'Blog', href: '/blog' }, { label: post.category }];

  return (
    <>
      <JsonLd schema={[articleSchema(post), breadcrumbSchema(crumbs, t('common.home'))]} />

      <PageHero eyebrow={post.category} title={post.title} intro={post.excerpt} breadcrumb={crumbs}>
        <div className="flex flex-wrap items-center gap-4 text-[14.5px] text-ink-muted">
          <span className="flex items-center gap-2">
            <Icon name="user" size={13} tone="accent" />
            {post.author}
          </span>
          <span className="flex items-center gap-2">
            <Icon name="calendar" size={13} tone="accent" />
            {post.date}
          </span>
          <span className="flex items-center gap-2">
            <Icon name="clock" size={13} tone="accent" />
            {post.readTime}
          </span>
        </div>
      </PageHero>

      <article className="section-pad">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-panel">
                <Image
                  src={post.image.src}
                  alt={post.image.alt || ''}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div className="mt-9 space-y-5">
              {post.body.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 40)} delay={index * 0.04}>
                  <p
                    className={
                      index === 0
                        ? 'font-display text-[21px] leading-relaxed text-primary'
                        : 'text-[15px] leading-[1.85] text-ink-muted'
                    }
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <aside className="mt-10 rounded-card border border-line bg-surface-50 p-6">
                <p className="text-[15.5px] leading-relaxed text-ink-muted">{t('blog.detail.disclaimer')}</p>
                <div className="mt-5">
                  <Button href="/book-appointment">{t('blog.detail.bookCta')}</Button>
                </div>
              </aside>
            </Reveal>
          </div>

          <aside className="lg:col-span-4">
            <Reveal className="sticky top-[calc(var(--nav-h)+24px)]">
              <div className="grain overflow-hidden rounded-panel bg-primary p-7">
                <p className="text-[11px] uppercase tracking-[0.2em] text-on-primary/45">
                  {t('blog.detail.authorLabel')}
                </p>
                <p className="mt-3 font-display text-[24px] text-on-primary">{post.author}</p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-on-primary/60">{t('blog.detail.practisingAt')}</p>
                <a
                  href={clinic.contact.phoneHref}
                  className="mt-6 flex items-center justify-between rounded-card border border-on-primary/[0.15] px-5 py-4 transition-colors duration-300 hover:border-accent hover:bg-accent/10"
                >
                  <span className="flex items-center gap-3 text-[14.5px] text-on-primary">
                    <Icon name="phone" size={15} tone="accent" />
                    {clinic.contact.phone}
                  </span>
                  <Icon name="arrow-right" size={13} className="text-on-primary" />
                </a>
              </div>
            </Reveal>
          </aside>
        </div>
      </article>

      {related.length ? (
        <section className="section-pad bg-surface-50">
          <div className="shell">
            <h2 className="display-lg">{t('blog.detail.relatedTitle')}</h2>
            <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RevealItem key={item.slug} className="h-full">
                  <PostCard post={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <ReadyBanner />
    </>
  );
}
