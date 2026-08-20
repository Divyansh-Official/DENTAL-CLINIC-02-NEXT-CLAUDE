import { notFound } from 'next/navigation';
import PageHero from '@/components/sections/PageHero';
import ReadyBanner from '@/components/sections/ReadyBanner';
import BlogList from '@/components/sections/BlogList';
import JsonLd from '@/components/layout/JsonLd';
import { blog, isEnabled, t } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const CRUMBS = [{ label: 'Blog' }];

export const metadata = pageMetadata({
  title: 'Blog',
  description: t('blog.hero.metaDescription'),
  path: '/blog'
});

export default function BlogPage() {
  if (!isEnabled('blog')) notFound();

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS, t('common.home'))} />

      <PageHero
        eyebrow={blog.section.eyebrow}
        title={t('blog.hero.title')}
        italicWord={t('blog.hero.italicWord')}
        intro={t('blog.hero.intro')}
        breadcrumb={CRUMBS}
      />

      <section className="section-pad">
        <div className="shell">
          <BlogList />
        </div>
      </section>

      <ReadyBanner />
    </>
  );
}
