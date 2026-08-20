import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import ScrollProgress from '@/components/layout/ScrollProgress';
import PageTransition from '@/components/layout/PageTransition';
import StickyActionBar from '@/components/layout/StickyActionBar';
import FloatingWhatsapp from '@/components/layout/FloatingWhatsapp';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import JsonLd from '@/components/layout/JsonLd';
import { clinic, isEnabled, locale, site, siteUrl, t } from '@/lib/data';
import { resolveFonts } from '@/lib/fonts';
import { themeCss, tokenHex } from '@/lib/theme';
import { clinicSchema, pageMetadata, websiteSchema } from '@/lib/seo';

const fonts = resolveFonts(site.theme?.fonts);

export const metadata = {
  metadataBase: new URL(siteUrl || 'http://localhost:3000'),
  title: {
    default: clinic.seo.title,
    template: `%s | ${clinic.identity.legalName}`
  },
  description: clinic.seo.description,
  keywords: clinic.seo.keywords,
  applicationName: clinic.identity.legalName,
  authors: [{ name: clinic.identity.legalName, url: siteUrl }],
  creator: clinic.identity.legalName,
  publisher: clinic.identity.legalName,
  formatDetection: { telephone: true, address: true, email: true },
  manifest: '/manifest.webmanifest',
  verification: {
    google: site.verification?.google || undefined,
    other: site.verification?.bing ? { 'msvalidate.01': site.verification.bing } : undefined
  },
  /* Only the social and canonical half is spread in. Spreading the whole
     object would replace the title template above with a plain string, and
     every inner page would silently lose its "Page | Clinic" suffix. */
  ...(() => {
    const { title, description, ...social } = pageMetadata({
      title: clinic.seo.title,
      description: clinic.seo.description,
      path: '/'
    });
    return social;
  })()
};

export const viewport = {
  /* Derived from the brand colour, so the browser chrome matches after a rebrand. */
  themeColor: tokenHex(site.theme, 'primary'),
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({ children }) {
  const ga = site.analytics?.googleAnalyticsId;
  const gtm = site.analytics?.googleTagManagerId;

  return (
    <html lang={locale.htmlLang} className={fonts.className} suppressHydrationWarning>
      <head>
        {/* The palette is written before first paint so nothing renders with
            fallback colours and then swaps. */}
        <style dangerouslySetInnerHTML={{ __html: themeCss(site.theme) }} />
      </head>
      <body>
        <JsonLd schema={[clinicSchema(), websiteSchema()]} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-on-primary"
        >
          {t('common.skipToContent')}
        </a>

        {isEnabled('smoothScroll') ? <SmoothScroll /> : null}
        {isEnabled('scrollProgress') ? <ScrollProgress /> : null}
        {isEnabled('announcement') ? <AnnouncementBar /> : null}

        <Navbar />

        <div id="main">
          {isEnabled('pageTransitions') ? (
            <PageTransition>{children}</PageTransition>
          ) : (
            <main className="min-h-[60vh]">{children}</main>
          )}
        </div>

        <Footer />

        {isEnabled('stickyMobileBar') ? <StickyActionBar /> : null}
        {isEnabled('floatingWhatsapp') ? <FloatingWhatsapp /> : null}

        {/* Nothing third-party loads unless an id is actually configured. */}
        {gtm ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
        ) : null}

        {ga ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
