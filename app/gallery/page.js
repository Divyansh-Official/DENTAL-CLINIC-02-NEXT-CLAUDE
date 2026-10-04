import { notFound } from 'next/navigation';
import JsonLd from '@/components/layout/JsonLd';
import GalleryExplorer from '@/components/sections/gallery/GalleryExplorer';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import { clinic, clinicPhone, gallery, galleryItems, isEnabled, page, t } from '@/lib/data';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

/** /gallery — PageHero → GalleryExplorer → CtaBanner */
const meta = page('gallery');
const CRUMBS = [{ label: meta.crumb }];

export const metadata = pageMetadata({ title: meta.title, description: gallery.section?.intro, path: '/gallery' });

export default function GalleryPage() {
  if (!isEnabled('gallery')) notFound();

  return (
    <>
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />
      <PageHero
        eyebrow={gallery.section?.eyebrow}
        title={gallery.section?.title}
        accent={gallery.section?.accent}
        intro={gallery.section?.intro}
        crumbs={CRUMBS}
        labels={{ home: t('common.home'), breadcrumb: t('common.breadcrumbLabel') }}
      />
      <section className="tone-white pb-[var(--section-y)]">
        <div className="shell">
          <GalleryExplorer
            items={galleryItems()}
            filters={Array.isArray(gallery.filters) ? gallery.filters : []}
            labels={{
              all: t('common.all'),
              filter: t('gallery.filterLabel'),
              view: t('gallery.viewLabel', { title: '{title}' }),
              counter: t('gallery.counter', { index: '{index}', total: '{total}' }),
              previous: t('common.previous'),
              next: t('common.next'),
              close: t('common.close')
            }}
          />
        </div>
      </section>
      <CtaBanner banner={clinic.banners?.ready} phone={clinicPhone()} labels={{ call: t('common.callTheClinic') }} tone="tone-gray" />
    </>
  );
}
