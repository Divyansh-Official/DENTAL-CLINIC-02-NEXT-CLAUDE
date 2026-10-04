# components/

Every page is assembled from **sections**, and every section lives in a folder
named after the page that owns it. To change something you can see on a page,
open the page's route file in `app/`, find the section's name, and open that
file here.

## The tree

```
components/
├── layout/                 Site chrome on every page (rendered by app/layout.js)
│   ├── AnnouncementBar     thin bar above the header (features.announcement)
│   ├── SiteHeader          floating liquid-glass capsule — fixed; its glass turns dark over dark sections
│   ├── MobileMenu          glass menu that opens beneath the header below 1180px
│   ├── MobileTabBar        phone call / WhatsApp / book bar; minimises on scroll down
│   ├── FloatingContact     WhatsApp glass orb on tablet and desktop
│   ├── SiteFooter
│   ├── Logo · BrandMark    wordmark, and the mark the favicons are drawn from
│   └── JsonLd              structured data
│
├── motion/                 Everything that moves
│   ├── Enter               load-time entrance (CSS keyframes)
│   ├── Reveal              rises in from below, vanishes at the top (scroll-driven)
│   ├── MorphLink           a card that zooms open into the page it links to
│   ├── MorphBack           the glass Back control that zooms a page back into its card
│   ├── MorphProvider       tells lib/morph.js when a new route is on screen
│   ├── PageTransition      soft rise on ordinary client navigations (app/template.js)
│   ├── ScrollProgress      hairline reading indicator
│   └── MotionPreferences   ?nomotion switch, applied before first paint
│
├── glass/                  The liquid-glass material
│   ├── LiquidGlass         refracting surface (Chromium) / frosted glass (elsewhere)
│   └── GlassFilter         the SVG filter it renders
│
├── cards/                  One item of a list — every card zooms open (MorphLink)
│   ├── ServiceCard         'feature' (photo tile, shelves) · 'card' (grids)
│   ├── DoctorCard
│   └── PostCard
│
├── ui/                     Design-system primitives — no data, no page knowledge
│   ├── Button · TextLink · Icon · AccentText
│   ├── SectionHeader       eyebrow, title with gradient accent, intro, actions
│   ├── SegmentedControl    iOS segmented control (tabs or filter)
│   ├── Shelf               horizontal card scroller
│   ├── Sheet · SheetTrigger iOS sheet on a native <dialog>
│   ├── Accordion           native <details> group
│   ├── ContactActions      call + copy / WhatsApp / email, laid out by its container
│   ├── OpenStatus · Rating · StatNumber · CopyButton
│   └── Aurora              soft fields of brand colour behind a section
│
└── sections/
    ├── shared/             Used by two or more pages
    │   ├── PageHero        opening of every index page (+ Breadcrumbs)
    │   ├── DetailHero      the full-screen page a card zooms open into
    │   ├── Statement       big sentence whose words light up as it scrolls
    │   ├── FeatureBento    Apple bento grid with glass captions
    │   ├── StatsBand · ProcessSteps · SafetyStandards
    │   ├── TeamShelf · TestimonialsShelf
    │   ├── CtaBanner · LocationSection · MapEmbed
    ├── home/               HomeHero · ServicesShowcase · AboutSplit · ArticlesPreview · SmileBanner
    ├── about/              AboutStory
    ├── team/               TeamDirectory · DoctorHero · DoctorFacts · DoctorDetails
    ├── services/           ServicesIndex · ServiceHero · ServiceOverview · ServicePricing ·
    │                       ServiceSpecialists · ServiceFaq · ServiceAside
    ├── treatments/         PriceExplorer · PaymentOptions
    ├── gallery/            GalleryExplorer (tiles zoom into the lightbox)
    ├── patient-info/       FirstVisitSteps · FaqExplorer · PolicyCards
    ├── blog/               BlogExplorer · ArticleHero · ArticleAside
    ├── contact/            ContactChannels
    └── booking/            BookingChannels · EmergencyCallout · SpecialistDirectory · CallChecklist
```

## Page → section map

| Route | File | Sections, top to bottom |
|---|---|---|
| `/` | `app/page.js` | `home/HomeHero` → `home/ServicesShowcase` → `shared/Statement` → `shared/FeatureBento` → `home/AboutSplit` → `shared/StatsBand` → `shared/TeamShelf` → `shared/ProcessSteps` → `shared/TestimonialsShelf` → `home/ArticlesPreview` → `home/SmileBanner` |
| `/about` | `app/about/page.js` | `shared/PageHero` → `about/AboutStory` → `shared/Statement` → `shared/StatsBand` → `shared/TeamShelf` → `shared/SafetyStandards` → `shared/ProcessSteps` → `shared/TestimonialsShelf` → `shared/CtaBanner` |
| `/team` | `app/team/page.js` | `shared/PageHero` → `team/TeamDirectory` → `shared/TestimonialsShelf` → `shared/CtaBanner` |
| `/team/[slug]` | `app/team/[slug]/page.js` | `team/DoctorHero` (a `shared/DetailHero`) → `team/DoctorFacts` → `team/DoctorDetails` → treatments offered (`cards/ServiceCard`) → articles (`cards/PostCard`) → `shared/TeamShelf` → `shared/CtaBanner` |
| `/services` | `app/services/page.js` | `shared/PageHero` → `services/ServicesIndex` → `shared/ProcessSteps` → `shared/CtaBanner` |
| `/services/[slug]` | `app/services/[slug]/page.js` | `services/ServiceHero` (a `shared/DetailHero`) → `services/ServiceOverview` · `services/ServicePricing` · `services/ServiceSpecialists` · `services/ServiceFaq` beside `services/ServiceAside` → related shelf → `shared/CtaBanner` |
| `/treatments` | `app/treatments/page.js` | `shared/PageHero` → `treatments/PriceExplorer` → `treatments/PaymentOptions` → `shared/CtaBanner` |
| `/gallery` | `app/gallery/page.js` | `shared/PageHero` → `gallery/GalleryExplorer` → `shared/CtaBanner` |
| `/patient-info` | `app/patient-info/page.js` | `shared/PageHero` → `patient-info/FirstVisitSteps` → `shared/SafetyStandards` → `patient-info/FaqExplorer` → `patient-info/PolicyCards` → `shared/CtaBanner` |
| `/blog` | `app/blog/page.js` | `shared/PageHero` → `blog/BlogExplorer` → `shared/CtaBanner` |
| `/blog/[slug]` | `app/blog/[slug]/page.js` | `blog/ArticleHero` (a `shared/DetailHero`) → article body beside `blog/ArticleAside` → related posts → `shared/CtaBanner` |
| `/contact` | `app/contact/page.js` | `shared/PageHero` → `contact/ContactChannels` → `shared/LocationSection` → `shared/CtaBanner` |
| `/book-appointment` | `app/book-appointment/page.js` | `shared/PageHero` → `booking/BookingChannels` → `booking/EmergencyCallout` → `booking/SpecialistDirectory` → `booking/CallChecklist` → `shared/LocationSection` |

Site chrome (`components/layout/`), on every page: `AnnouncementBar` →
`SiteHeader` (+ `MobileMenu`) → page → `SiteFooter`, plus `MobileTabBar`
(phones), `FloatingContact` (tablet/desktop), `motion/ScrollProgress`,
`motion/MorphProvider`, `motion/MotionPreferences` and `JsonLd`.
`motion/PageTransition` is used by `app/template.js`.

## Motion

| What you see | How | Where |
|---|---|---|
| A card zooms open into its page; Back zooms the page into the card | a fixed overlay of the card's own photo, animated with Web Animations **beneath the header**, which never moves. It grows straight to the box and crop the page's photo will have (`lib/heroes.js`), the page renders under it only once it is still, and it dissolves as the text rises in. Back dissolves the text, renders the previous page under an opaque layer, then shrinks into the card | `lib/morph.js`, `lib/heroes.js`, `motion/MorphLink`, `motion/MorphBack`, `sections/shared/DetailHero` |
| A gallery tile zooms into the lightbox and back | View Transitions within one page | `lib/morph.js` (`morphInPlace`), `gallery/GalleryExplorer` |
| Content rises in from below and vanishes at the top | two scroll-driven animations on registered properties (`--rv-in`, `--rv-out`) | `motion/Reveal`, `[data-reveal]` in globals.css |
| Hero text recedes as the page scrolls away | scroll timeline on the root | `[data-vanish]` in globals.css |
| A statement lights up word by word | named view timeline on the paragraph | `shared/Statement`, `.statement` in globals.css |
| The phone tab bar minimises while scrolling down | one passive scroll listener, transform only | `layout/MobileTabBar` |
| The header's glass turns dark over dark sections and light over light ones | one hit-test per scrolled frame, after each page change, when the menu opens or closes, and when a card zoom covers it | `layout/SiteHeader`, `morphchange` in `lib/morph.js` |
| Filtered grids glide to their new places | View Transitions, names applied only while filtering | `lib/morph.js` (`filterTransition`) |

Every one of these falls back to a plain, complete page: without JavaScript,
under reduced motion, with `?nomotion`, and in browsers without view
transitions or scroll timelines. Nothing is ever hidden waiting for a script.

**The header is fixed for good.** It lives in the root layout, so it is the
same element on every page; it sits above every page layer (the card zoom,
the phone menu, the tab bar) and is never captured by a view transition, so
it never moves, fades or re-renders. Only a modal sheet covers it. The one
thing that changes is its tint, which follows what is behind it.

## Conventions

- **Server by default.** A file starts with `'use client'` only when it needs
  state, effects or event handlers. Client components never import
  `lib/data.js`; pages read the data on the server and pass each component
  exactly the fields it shows, so the JSON never reaches the browser bundle.
- **No hardcoded copy.** Every visible string arrives as a prop from
  `data/*.json` (interface strings come from `data/ui.json` through `t()`).
- **Every list is open-ended.** Sections map over arrays and lay out any
  number of items — shelves scroll, grids wrap, the bento re-packs, empty
  arrays render nothing.
- **Cards link with `MorphLink`.** A new card type gets the zoom by using it
  instead of `next/link`; mark the part that should grow with
  `data-morph-source` (or let the whole card grow). A new detail page gets it
  by opening with `shared/DetailHero`.
- **Motion is CSS.** Use `motion/Enter` for load-time entrances and
  `motion/Reveal` for scroll reveals. Keep hover transforms on a child of a
  `Reveal`, never on the `Reveal` itself. Sections clip with `overflow-clip`,
  never `overflow-hidden` — a hidden-overflow box is a scroll container, and
  the scroll animations inside it would stop.
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

It is used for surfaces that float over structure — the header, the tab bar,
the WhatsApp orb, the Back control, the panes over photographs on the detail
pages, the home hero and the bento grid. For surfaces that come in numbers or
scroll, use the static `.glass`, `.glass-dark` or `.sheen` classes.
