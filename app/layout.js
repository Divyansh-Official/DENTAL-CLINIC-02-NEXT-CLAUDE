import Script from 'next/script';
import './globals.css';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import FloatingContact from '@/components/layout/FloatingContact';
import JsonLd from '@/components/layout/JsonLd';
import MobileTabBar from '@/components/layout/MobileTabBar';
import MorphProvider from '@/components/motion/MorphProvider';
import MotionPreferences from '@/components/motion/MotionPreferences';
import ScrollProgress from '@/components/motion/ScrollProgress';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import {
  clinic,
  clinicHours,
  clinicWhatsapp,
  contactChannel,
  footerColumns,
  isEnabled,
  locale,
  navCta,
  openStatusProps,
  primaryNav,
  secondaryNav,
  site,
  siteUrl,
  socialLinks,
  t,
  text
} from '@/lib/data';
import { resolveFonts } from '@/lib/fonts';
import { clinicSchema, pageMetadata, websiteSchema } from '@/lib/seo';
import { themeCss, tokenHex } from '@/lib/theme';

const fonts = resolveFonts(site.theme?.fonts);
const legalName = clinic.identity?.legalName || clinic.identity?.name || '';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: clinic.seo?.title || legalName,
    template: `%s | ${legalName}`
  },
  description: clinic.seo?.description,
  keywords: clinic.seo?.keywords,
  applicationName: legalName,
  authors: [{ name: legalName, url: siteUrl }],
  creator: legalName,
  publisher: legalName,
  formatDetection: { telephone: true, address: true, email: true },
  manifest: '/manifest.webmanifest',
  verification: {
    google: site.verification?.google || undefined,
    other: site.verification?.bing ? { 'msvalidate.01': site.verification.bing } : undefined
  },
  appleWebApp: { capable: true, title: clinic.identity?.name || legalName, statusBarStyle: 'default' },
  /* Only the canonical and social half is spread in: spreading `title` would
     replace the template above and inner pages would lose their suffix. */
  ...(() => {
    const { title, description, ...social } = pageMetadata({ path: '/' });
    return social;
  })()
};

export const viewport = {
  themeColor: tokenHex(site.theme, 'card'),
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({ children }) {
  const ga = site.analytics?.googleAnalyticsId;
  const gtm = site.analytics?.googleTagManagerId;
  const glass = isEnabled('liquidGlass');

  const phone = contactChannel('phone');
  const email = contactChannel('email');
  const address = clinic.contact?.address || {};
  const whatsapp = clinicWhatsapp();
  const brand = { name: clinic.identity?.name, suffix: clinic.identity?.suffix, logo: clinic.identity?.logo, label: legalName };
  const status = openStatusProps();
  const contact = {
    phone: phone.value,
    phoneHref: phone.href,
    email: email.value,
    emailHref: email.href,
    address: [address.line1, address.line2].filter(Boolean).join(', '),
    mapsUrl: address.mapsUrl
  };

  return (
    <html lang={locale.htmlLang} className={`${fonts.className} ${fonts.appleSystem ? 'apple-system' : ''}`} suppressHydrationWarning>
      <head>
        {/* The palette is written before first paint, so nothing renders in
            fallback colours and then swaps. */}
        <style dangerouslySetInnerHTML={{ __html: themeCss(site.theme) }} />
        <MotionPreferences />
      </head>
      <body data-tabbar={isEnabled('stickyMobileBar') ? 'on' : 'off'}>
        <JsonLd schema={[clinicSchema(), websiteSchema()]} />

        <a href="#main" className="skip-link">
          {t('common.skipToContent')}
        </a>

        {isEnabled('scrollProgress') ? <ScrollProgress /> : null}
        {isEnabled('announcement') ? <AnnouncementBar text={text(site.announcement?.text)} cta={site.announcement?.cta} /> : null}

        <SiteHeader
          brand={brand}
          items={primaryNav()}
          extra={secondaryNav()}
          cta={{ ...navCta, label: navCta.label }}
          contact={contact}
          status={status}
          glass={glass}
          labels={{
            primaryNav: t('common.primaryNavLabel'),
            openMenu: t('common.openMenu'),
            closeMenu: t('common.closeMenu'),
            menu: t('common.menu'),
            home: t('common.home'),
            book: t('header.book'),
            callTheClinic: t('common.callTheClinic')
          }}
        />

        <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
          {children}
        </main>

        {/* After <main>, so it hears about a new route once the page is in. */}
        <MorphProvider />

        <SiteFooter
          brand={brand}
          blurb={text(clinic.footer?.blurb)}
          columns={footerColumns()}
          contact={contact}
          hours={clinicHours()}
          status={status}
          socials={socialLinks()}
          legal={clinic.footer?.legal || []}
          copyright={text(clinic.footer?.copyright)}
          labels={{ contactHeading: t('common.contactHeading'), hoursHeading: t('common.hoursHeading'), followUs: t('common.followUs') }}
        />

        {isEnabled('stickyMobileBar') ? (
          <MobileTabBar
            phoneHref={phone.href}
            whatsappHref={whatsapp}
            bookHref={navCta.href}
            glass={glass}
            labels={{
              quickActions: t('common.quickActionsLabel'),
              call: t('stickyBar.call'),
              whatsapp: t('stickyBar.whatsapp'),
              book: t('stickyBar.book')
            }}
          />
        ) : null}
        {isEnabled('floatingWhatsapp') ? (
          <FloatingContact href={whatsapp} label={t('floatingWhatsapp.label')} bookHref={navCta.href} glass={glass} />
        ) : null}

        {/* Nothing third-party loads unless an id is actually configured. */}
        {gtm ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtm)});`}
          </Script>
        ) : null}
        {ga ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(ga)});`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
