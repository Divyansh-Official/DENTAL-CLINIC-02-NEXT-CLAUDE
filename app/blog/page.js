import { notFound } from 'next/navigation';
import JsonLd from '@/components/layout/JsonLd';
import BlogExplorer from '@/components/sections/blog/BlogExplorer';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import { blogPosts, clinic, clinicPhone, isEnabled, locale, page, t } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

/** /blog — PageHero → BlogExplorer (featured + grid, category filter) → CtaBanner */
const meta = page('blog');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: t('blog.hero.metaDescription'), path: '/blog' });

export default function BlogPage() {
  if (!isEnabled('blog')) notFound();
  const posts = blogPosts().map((post) => ({ ...post, displayDate: formatDate(post.date, locale.numberFormat) }));

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />
      <PageHero
        eyebrow={t('blog.hero.eyebrow')}
        title={t('blog.hero.title')}
        accent={t('blog.hero.accent')}
        intro={t('blog.hero.intro')}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
      />
      <section className="tone-white pb-[var(--section-y)]">
        <div className="shell">
          <BlogExplorer
            posts={posts}
            labels={{ all: t('common.all'), filter: t('blog.filterLabel'), featured: t('blog.featured'), readMore: t('common.readMore') }}
          />
        </div>
      </section>
      <CtaBanner banner={clinic.banners?.ready} phone={clinicPhone()} labels={{ call: t('common.callTheClinic') }} tone="tone-gray" />
    </>
  );
}
