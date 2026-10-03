# components/

Every page is assembled from **sections**, and every section lives in a folder
named after the page that owns it. To change something you can see on a page,
open the page's route file in `app/`, find the section's name, and open that
file here.

```
components/
  layout/       Site chrome on every page (rendered by app/layout.js)
  glass/        The liquid-glass material (refraction engine)
  ui/           Design-system primitives — no data, no page knowledge
  sections/
    shared/     Sections used by two or more pages
    home/       /
    about/      /about
    team/       /team, /team/[slug]
    services/   /services, /services/[slug]
    treatments/ /treatments
    gallery/    /gallery
    patient-info/ /patient-info
    blog/       /blog, /blog/[slug]
    contact/    /contact
    booking/    /book-appointment
```

## Page → section map

| Route | File | Sections, top to bottom |
|---|---|---|
| `/` | `app/page.js` | `home/HomeHero` → `home/ServicesShowcase` → `home/AboutSplit` → `shared/StatsBand` → `shared/TeamShelf` → `shared/ProcessSteps` → `shared/TestimonialsShelf` → `home/ArticlesPreview` → `home/SmileBanner` |
| `/about` | `app/about/page.js` | `shared/PageHero` → `about/AboutStory` → `shared/StatsBand` → `shared/TeamShelf` → `shared/SafetyStandards` → `shared/ProcessSteps` → `shared/TestimonialsShelf` → `shared/CtaBanner` |
| `/team` | `app/team/page.js` | `shared/PageHero` → `team/TeamDirectory` → `shared/TestimonialsShelf` → `shared/CtaBanner` |
| `/team/[slug]` | `app/team/[slug]/page.js` | `team/DoctorHero` → `team/DoctorDetails` → treatments offered (`shared/ServiceCard`) → articles (`shared/PostCard`) → `shared/TeamShelf` → `shared/CtaBanner` |
| `/services` | `app/services/page.js` | `shared/PageHero` → `services/ServicesIndex` → `shared/ProcessSteps` → `shared/CtaBanner` |
| `/services/[slug]` | `app/services/[slug]/page.js` | `services/ServiceHero` → `services/ServiceOverview` · `services/ServicePricing` · `services/ServiceSpecialists` · `services/ServiceFaq` beside `services/ServiceAside` → related shelf → `shared/CtaBanner` |
| `/treatments` | `app/treatments/page.js` | `shared/PageHero` → `treatments/PriceExplorer` → `treatments/PaymentOptions` → `shared/CtaBanner` |
| `/gallery` | `app/gallery/page.js` | `shared/PageHero` → `gallery/GalleryExplorer` → `shared/CtaBanner` |
| `/patient-info` | `app/patient-info/page.js` | `shared/PageHero` → `patient-info/FirstVisitSteps` → `shared/SafetyStandards` → `patient-info/FaqExplorer` → `patient-info/PolicyCards` → `shared/CtaBanner` |
| `/blog` | `app/blog/page.js` | `shared/PageHero` → `blog/BlogExplorer` → `shared/CtaBanner` |
| `/blog/[slug]` | `app/blog/[slug]/page.js` | `shared/PageHero` (left-aligned) → image → article body beside `blog/ArticleAside` → related posts → `shared/CtaBanner` |
| `/contact` | `app/contact/page.js` | `shared/PageHero` → `contact/ContactChannels` → `shared/LocationSection` → `shared/CtaBanner` |
| `/book-appointment` | `app/book-appointment/page.js` | `shared/PageHero` → `booking/BookingChannels` → `booking/EmergencyCallout` → `booking/SpecialistDirectory` → `booking/CallChecklist` → `shared/LocationSection` |

Site chrome (`components/layout/`), on every page: `AnnouncementBar` →
`SiteHeader` (+ `MobileMenu`) → page → `SiteFooter`, plus `MobileTabBar`
(phones), `FloatingContact` (tablet/desktop), `ScrollProgress`,
`MotionPreferences` and `JsonLd`. `PageTransition` is used by `app/template.js`.

## Conventions

- **Server by default.** A file starts with `'use client'` only when it needs
  state, effects or event handlers. Client components never import
  `lib/data.js`; pages read the data on the server and pass each component
  exactly the fields it shows, so the JSON never reaches the browser bundle.
- **No hardcoded copy.** Every visible string arrives as a prop from
  `data/*.json` (interface strings come from `data/ui.json` through `t()`).
- **Every list is open-ended.** Sections map over arrays and lay out any
  number of items — shelves scroll, grids wrap, empty arrays render nothing.
- **Motion is CSS.** Use `ui/Enter` for load-time entrances and `ui/Reveal`
  for scroll reveals. Neither hides content without CSS support, without
  JavaScript, or under reduced motion. Keep hover transforms on a child of a
  `Reveal`, never on the `Reveal` itself.
- **Tone-aware colour.** Sections set `tone-white`, `tone-gray` or
  `tone-dark`; components use `text-fg`, `text-fg-2`, `bg-tile` and `border-hair`
  so they read correctly on all three.
- **Literal class names.** Tailwind only generates classes it can see in the
  source, so variants are written out in maps (`btn-primary`, `lg-light`…),
  never assembled as `` `btn-${variant}` ``.

## Liquid glass

`glass/LiquidGlass.jsx` is a port of the QuickLocal admin console's team-chat
glass: a displacement map ray-traced through a squircle bezel with Snell's law
(`lib/glass/liquidGlass.js`), applied through an SVG filter with chromatic
dispersion and a Fresnel rim (`glass/GlassFilter.jsx`), with spring-driven
lensing under the pointer (`lib/glass/liquidMotion.js`). Chromium refracts;
Safari and Firefox get the frosted material from `.lg` in `app/globals.css`.

Use it for a handful of surfaces that float over structure — the header, the
tab bar, the WhatsApp orb, panes over photographs. For surfaces that come in
numbers or scroll, use the static `.glass`, `.glass-dark` or `.sheen` classes.
