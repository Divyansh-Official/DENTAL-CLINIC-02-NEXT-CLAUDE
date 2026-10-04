import { notFound } from 'next/navigation';
import JsonLd from '@/components/layout/JsonLd';
import ArticleAside from '@/components/sections/blog/ArticleAside';
import ArticleHero from '@/components/sections/blog/ArticleHero';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PostCard from '@/components/cards/PostCard';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  clinic,
  clinicPhone,
  doctorSlug,
  getDoctorByName,
  getPost,
  getPostSlugs,
  getRelatedPosts,
  isEnabled,
  locale,
  page,
  t
} from '@/lib/data';
import { formatDate, isoDate } from '@/lib/format';
import { articleSchema, breadcrumbSchema, pageMetadata } from '@/lib/seo';

/**
 * /blog/[slug] — ArticleHero (the photograph, title and byline the card
 * zooms open into) → article body beside ArticleAside → related articles →
 * CtaBanner
 */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: t('pages.notFound.title'), robots: { index: false, follow: false } };
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image?.src,
    type: 'article',
    publishedTime: isoDate(post.date),
    authors: post.author ? [post.author] : undefined
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const doctor = getDoctorByName(post.author);
  const author = doctor ? { ...doctor, href: `/team/${doctorSlug(doctor)}` } : null;
  const crumbs = [{ label: page('blog').crumb, href: '/blog' }, { label: post.category || post.title }];
  const date = formatDate(post.date, locale.numberFormat);
  const body = Array.isArray(post.body) ? post.body : [];
  const related = getRelatedPosts(post.slug, 3).map((p) => ({ ...p, displayDate: formatDate(p.date, locale.numberFormat) }));
  const phone = clinicPhone();

  return (
    <>
      <JsonLd schema={[articleSchema(post, doctor), breadcrumbSchema(crumbs)]} />

      <ArticleHero
        post={post}
        author={author}
        date={date}
        dateTime={isoDate(post.date)}
        crumbs={crumbs}
        glass={isEnabled('liquidGlass')}
        back={{ href: '/blog', label: t('common.back') }}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
      />

      <article className="tone-white section">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div className="min-w-0 max-w-[44rem]">
            <div className="prose-article">
              {body.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
            <Reveal className="tile mt-12 bg-tile p-6 sm:p-7">
              <p className="t-small flex items-start gap-3">
                <Icon name="info" size={18} className="mt-0.5 flex-none text-primary" />
                {t('blog.detail.disclaimer')}
              </p>
              <div className="mt-5">
                <Button href="/book-appointment" iconStart="calendar">
                  {t('blog.detail.bookCta')}
                </Button>
              </div>
            </Reveal>
          </div>
          <ArticleAside
            author={post.author}
            doctor={author}
            phone={phone}
            labels={{ writtenBy: t('blog.detail.authorLabel'), practisingAt: t('blog.detail.practisingAt'), viewProfile: t('common.viewProfile') }}
          />
        </div>
      </article>

      {related.length ? (
        <section className="tone-gray section">
          <div className="shell">
            <SectionHeader align="left" title={t('blog.detail.relatedTitle')} size="title" />
            <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal as="li" key={item.slug} index={index}>
                  <PostCard post={item} date={item.displayDate} labels={{ readMore: t('common.readMore') }} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaBanner banner={clinic.banners?.ready} phone={phone} labels={{ call: t('common.callTheClinic') }} />
    </>
  );
}
