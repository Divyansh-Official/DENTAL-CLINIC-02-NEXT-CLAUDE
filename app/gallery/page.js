import { notFound } from 'next/navigation';
import PageHero from '@/components/sections/PageHero';
import GalleryGrid from '@/components/sections/GalleryGrid';
import ReadyBanner from '@/components/sections/ReadyBanner';
import JsonLd from '@/components/layout/JsonLd';
import { gallery, isEnabled, t } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const CRUMBS = [{ label: 'Gallery' }];

export const metadata = pageMetadata({
  title: 'Gallery',
  description: gallery.section.intro,
  path: '/gallery'
});

export default function GalleryPage() {
  if (!isEnabled('gallery')) notFound();

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS, t('common.home'))} />

      <PageHero
        eyebrow={gallery.section.eyebrow}
        title={gallery.section.title}
        italicWord={gallery.section.italicWord}
        intro={gallery.section.intro}
        breadcrumb={CRUMBS}
      />

      <section className="section-pad">
        <div className="shell">
          <GalleryGrid />
        </div>
      </section>

      <ReadyBanner />
    </>
  );
}
