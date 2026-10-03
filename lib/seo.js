/**
 * Search and social metadata.
 *
 * A local clinic lives or dies on the map pack, so the structured data is
 * deliberately complete: a Dentist entity with coordinates, machine-readable
 * hours and its dentists, breadcrumbs on every inner page, FAQ markup where
 * there are questions, Article markup on posts and Person markup on each
 * dentist's profile. All of it is generated from /data.
 */
import {
  absoluteUrl,
  clinic,
  clinicHours,
  contactChannel,
  doctorItems,
  doctorSlug,
  getFounder,
  locale,
  rating,
  serviceItems,
  site,
  siteUrl,
  socialLinks,
  t
} from '@/lib/data';
import { isoDate } from '@/lib/format';

const compact = (value) => {
  if (Array.isArray(value)) {
    const cleaned = value.map(compact).filter((entry) => entry != null);
    return cleaned.length ? cleaned : undefined;
  }
  if (value && typeof value === 'object') {
    const cleaned = Object.fromEntries(
      Object.entries(value)
        .map(([key, entry]) => [key, compact(entry)])
        .filter(([, entry]) => entry != null && entry !== '')
    );
    return Object.keys(cleaned).length ? cleaned : undefined;
  }
  return value === '' || value == null ? undefined : value;
};

const ORG_ID = () => `${siteUrl}/#clinic`;

export function ogImageUrl(image) {
  if (image) return String(image).startsWith('http') ? image : absoluteUrl(image);
  if (site.openGraph?.image) {
    return site.openGraph.image.startsWith('http') ? site.openGraph.image : absoluteUrl(site.openGraph.image);
  }
  return absoluteUrl('/opengraph-image');
}

/**
 * A complete Metadata object: canonical URL, Open Graph and Twitter card.
 * Every page uses it, so no route can ship without a canonical or a preview.
 */
export function pageMetadata({ title, description, path = '/', image, type = 'website', publishedTime, authors, noIndex = false } = {}) {
  const url = absoluteUrl(path);
  const resolvedDescription = description || clinic.seo?.description || '';
  const resolvedImage = ogImageUrl(image);
  const legalName = clinic.identity?.legalName || '';

  return compact({
    title,
    description: resolvedDescription,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: title ? `${title} | ${legalName}` : clinic.seo?.title,
      description: resolvedDescription,
      url,
      siteName: legalName,
      locale: locale.openGraph,
      type,
      publishedTime,
      authors,
      images: [{ url: resolvedImage, width: 1200, height: 630, alt: legalName }]
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${legalName}` : clinic.seo?.title,
      description: resolvedDescription,
      images: [resolvedImage]
    }
  });
}

/* ---------- structured data ---------- */

function openingHoursSpecification() {
  return clinicHours()
    .filter((slot) => slot.opens && slot.closes && Array.isArray(slot.dayOfWeek) && slot.dayOfWeek.length)
    .map((slot) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: slot.dayOfWeek, opens: slot.opens, closes: slot.closes }));
}

const personNode = (doctor) =>
  compact({
    '@type': 'Person',
    '@id': absoluteUrl(`/team/${doctorSlug(doctor)}#person`),
    name: doctor.name,
    jobTitle: doctor.role,
    description: doctor.bio,
    image: doctor.image?.src ? ogImageUrl(doctor.image.src) : undefined,
    url: absoluteUrl(`/team/${doctorSlug(doctor)}`),
    knowsAbout: doctor.expertise,
    knowsLanguage: doctor.languages,
    hasCredential: doctor.qualification,
    worksFor: { '@id': ORG_ID() }
  });

/** The clinic itself. Every other node references it by @id. */
export function clinicSchema() {
  const address = clinic.contact?.address || {};
  const score = rating();
  const founder = getFounder();

  return compact({
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': ORG_ID(),
    name: clinic.identity?.legalName,
    alternateName: clinic.identity?.name,
    description: clinic.identity?.longDescription || clinic.seo?.description,
    slogan: clinic.identity?.tagline,
    url: siteUrl,
    logo: clinic.identity?.logo?.src ? ogImageUrl(clinic.identity.logo.src) : absoluteUrl('/icon'),
    image: ogImageUrl(clinic.about?.interiorImage?.src),
    telephone: contactChannel('phone').value,
    email: clinic.contact?.email,
    priceRange: clinic.seo?.priceRange,
    foundingDate: clinic.identity?.established,
    currenciesAccepted: locale.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.line1,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.countryCode || address.country
    },
    geo:
      Number.isFinite(address.geo?.latitude) && Number.isFinite(address.geo?.longitude)
        ? { '@type': 'GeoCoordinates', latitude: address.geo.latitude, longitude: address.geo.longitude }
        : undefined,
    hasMap: address.mapsUrl,
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: socialLinks()
      .map((s) => s.href)
      .filter((href) => /^https?:/.test(href) && !/wa\.me/.test(href)),
    founder: founder ? { '@id': absoluteUrl(`/team/${doctorSlug(founder)}#person`) } : undefined,
    employee: doctorItems().map(personNode),
    aggregateRating: score?.count
      ? { '@type': 'AggregateRating', ratingValue: score.value, reviewCount: score.count, bestRating: 5, worstRating: 1 }
      : undefined,
    makesOffer: serviceItems().map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'MedicalProcedure',
        name: service.title,
        description: service.excerpt,
        url: absoluteUrl(`/services/${service.slug}`)
      }
    }))
  });
}

export function websiteSchema() {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: clinic.identity?.legalName,
    inLanguage: locale.htmlLang,
    publisher: { '@id': ORG_ID() }
  });
}

/** `crumbs` is the same array the visible breadcrumb renders, so the two cannot drift apart. */
export function breadcrumbSchema(crumbs = []) {
  const trail = [{ label: t('common.home'), href: '/' }, ...crumbs];
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? absoluteUrl(crumb.href) : undefined
    }))
  });
}

export function faqSchema(items = []) {
  const questions = (Array.isArray(items) ? items : []).filter((item) => item?.q && item?.a);
  if (!questions.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } }))
  };
}

export function articleSchema(post, authorDoctor) {
  if (!post) return null;
  const published = isoDate(post.date);
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image?.src ? ogImageUrl(post.image.src) : undefined,
    datePublished: published,
    dateModified: published,
    articleSection: post.category,
    inLanguage: locale.htmlLang,
    author: authorDoctor
      ? { '@id': absoluteUrl(`/team/${doctorSlug(authorDoctor)}#person`), '@type': 'Person', name: post.author }
      : { '@type': 'Person', name: post.author },
    publisher: { '@id': ORG_ID() },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`)
  });
}

export function serviceSchema(service) {
  if (!service) return null;
  return compact({
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.title,
    description: service.description || service.excerpt,
    image: service.image?.src ? ogImageUrl(service.image.src) : undefined,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': ORG_ID() },
    howPerformed: Array.isArray(service.includes) ? service.includes.join('. ') : undefined
  });
}

export function doctorSchema(doctor) {
  if (!doctor) return null;
  return { '@context': 'https://schema.org', ...personNode(doctor) };
}
