# Demo Dental Clinic — Website Template

A production-ready dental clinic website in Apple's design language, built with
Next.js and Tailwind. **Every word, colour, price, phone number, dentist and
image on the site is read from `/data`.** Selling it to a new clinic means
editing JSON — no component is ever touched.

There is no backend. Booking hands off to the phone, WhatsApp, email and maps
apps, so there is nothing to secure or maintain beyond the site itself.

Live demo: https://dental-clinic-02-next-claude.vercel.app

---

## Quick start

```bash
npm install
npm run dev
```

Node 18.18+.

| Command | What it does |
|---|---|
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Production build. Every route prerenders to static HTML |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run check` | **Pre-launch content check — run before every handover** |

### Deploying

Built for **Vercel** (push to the connected branch and it deploys). Any host
that runs Next.js works — Netlify, Render, a Node server with `npm start`.
The site uses Next's image optimisation and security headers, which need the
Next.js server, so it is not a plain static export.

---

## What's in it

| Route | Page |
|---|---|
| `/` | Hero with live opening status, services shelf, a statement that lights up as you scroll, a bento grid of the clinic's technology, about, numbers, team, process, reviews, journal, closing banner |
| `/about` | Story and promise, statement, numbers, team, hygiene standards, process, reviews |
| `/team` | Every dentist |
| `/team/[slug]` | **A profile for each dentist** — full-screen portrait, quick facts, bio, expertise, education, treatments they perform, articles they wrote, direct line |
| `/services` | Every service |
| `/services/[slug]` | Service detail — inclusions, its price list, the dentists who perform it, FAQ, sticky contact card |
| `/treatments` | Price table with a segmented control, payment options, insurers |
| `/gallery` | Filterable mosaic with a lightbox |
| `/patient-info` | First visit, hygiene, searchable FAQ, privacy and terms |
| `/blog`, `/blog/[slug]` | Journal with a category filter; articles link to their author's profile |
| `/contact` | Channels, map, live opening status, hours |
| `/book-appointment` | **The conversion page** — direct contact, emergency line, every dentist's own number, no forms |

Plus `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, generated favicon,
Apple touch icon and social card, a custom 404, an error page and a root-level
error page — both of which still show the clinic's phone number.

---

## Rebranding for a new clinic

### 1. `data/site.json` — the switchboard

```jsonc
{
  "url": "https://theclinic.com",       // blank on Vercel = use the deployment URL
  "locale": { "timeZone": "Asia/Kolkata", "numberFormat": "en-IN", ... },
  "theme": {
    "colors": { "primary": "#0071E3", "accent": "#21B5A6", "surface": "#F5F5F7",
                "ink": "#1D1D1F", "card": "#FFFFFF", "night": "#0A0A0C" },
    "fonts": { "family": "Inter", "appleSystemFont": true }
  },
  "features": { "team": true, "blog": true, "liquidGlass": true, ... }
}
```

**Colour.** Set the hex values and the entire site recolours — every tint,
gradient, hairline and shadow is derived at runtime by `lib/theme.js` and
published as CSS custom properties. The accent word in every heading is set in
a gradient from `primary` to `accent`.

**Type.** Apple devices render the site in San Francisco, the system font.
Everyone else gets `family` — Inter, Manrope, DM Sans or Plus Jakarta Sans,
self-hosted by `next/font`.

**Feature flags.** Turning a page off removes it from the navigation, the
footer and the sitemap, and makes it return 404. `liquidGlass: false` swaps
every refracting surface for plain frosted glass.

**Time zone.** The live "Open now · Closes 8:00 pm" pill is computed in the
clinic's own time zone, wherever the visitor is.

### 2. `data/clinic.json` — who they are

Identity, hero, statistics, about, the two scroll-lit statements
(`statement.home`, `statement.about`), the technology bento (`technology`),
contact, hours, socials, banners, footer, SEO. **Each number is written once**: phone, WhatsApp and email links are built
from `contact.phone`, `contact.whatsapp` and `contact.email`, and the
`whatsappMessage` is pre-filled on every WhatsApp link on the site.

- **`contact.address.geo`** — real coordinates, for the map pack and "dentist
  near me".
- **`hours[].opens` / `closes` / `dayOfWeek`** — the machine-readable half of
  the hours, read by Google and by the live status pill.

### 3. `data/doctors.json` — the team

Each dentist becomes a card, a `/team/<slug>` profile, and a direct line on
the booking page. Everything except `slug` and `name` is optional.

```jsonc
{
  "slug": "aanya-mehta",
  "name": "Dr. Aanya Mehta",
  "role": "Founder & Chief Dentist",
  "services": ["cosmetic-dentistry", "teeth-whitening"],   // links them to those service pages
  "expertise": ["Digital smile design", ...],
  "education": [{ "degree": "MDS — Prosthodontics", "institution": "...", "year": "2008" }],
  "phone": "+91 ...", "whatsapp": "+91 ...", "email": "...",
  "about": ["paragraph", "paragraph"]
}
```

### 4. Everything is connected

| Write this… | …and it appears here |
|---|---|
| A service in `services.json` | Card, detail page, home shelf, footer column, sitemap, structured data |
| `"pricing": "surgical"` on a service | That price list on the service page |
| `"services": [...]` on a dentist | "Your specialists" on those service pages, "Treatments offered" on the profile |
| `"author": "Dr. Kabir Shah"` on a post | Byline links to the profile; post listed under "Articles by…" |
| A new category on a post | A new filter in the journal |
| A gallery item | The mosaic; `"span": "wide"` or `"tall"` shapes its tile |
| A `technology` item | A bento tile; `"size"` is `large`, `wide`, `tall` or `small`, and an `image` or a `stat` decides its look |

### 5. Photographs

Drop them in `/public` and reference with a leading slash
(`"src": "/reception.jpg"`). Remote hosts need an entry in `next.config.mjs`;
`npm run check` reports any that are missing.

### 6. Run the check

```bash
npm run check
```

It reads `/data` the way the app does and reports **errors** (broken site or
search listing — exits non-zero, so it can gate a deploy), **warnings**
(leftover demo content) and **notes**. It verifies phone links, hours, time
zone, every internal link, every icon name, every service / dentist / pricing
cross-reference, gallery categories, blog dates, image hosts, local image
paths and alt text.

---

## Design system

Apple's visual language, end to end:

- **Type** — San Francisco on Apple devices, a large semibold display scale
  with tightened tracking, 17px body copy.
- **Colour** — #1D1D1F ink on white and #F5F5F7, one saturated action colour,
  near-black feature sections, a brand gradient on the accent word of each
  heading.
- **Layout** — centred section heads, horizontal "shelves" of cards that scroll
  under the thumb, sticky contact cards, generous space.
- **Controls** — pill buttons, iOS segmented controls whose pill slides between
  segments, native `<details>` accordions, sheets that rise on a spring and
  drag down to dismiss on a phone.

### Liquid glass

The header, the phone tab bar, the WhatsApp orb and the panes over photographs
are **liquid glass**, ported from the QuickLocal admin console's team chat.
It is not a blur with a white border: a light ray is traced through a
squircle-profiled glass bezel with Snell's law, the offset is baked into a
displacement map, and an SVG filter bends the page behind the surface — with
chromatic dispersion, a Fresnel rim light, and a spring that lenses the glass
harder under the pointer. Chromium renders the refraction; Safari and Firefox
get frosted glass with the same tint and rim. "Reduce transparency" turns
every glass surface solid.

### Motion

No animation library ships to the browser — the motion is CSS and the
browser's own View Transitions.

- **Cards zoom open.** Tap a service, dentist or article card and it grows
  out of its exact place on the screen into a full-screen page — the App
  Store's Today cards — and the page's content rises in once it lands. The
  glass **Back** control shrinks the page back into the card, at the scroll
  position you left. Gallery tiles zoom into the lightbox the same way.
- **Scrolling** — content rises in from below and vanishes (fading, lifting,
  shrinking a touch) as it passes under the header; scrolling back up plays
  it in reverse. Hero text recedes as the page scrolls away, and the
  statement sections light up word by word. All driven by CSS scroll and view
  timelines: no observers, no scroll listeners.
- **Glass that responds** — the header turns to dark glass over dark
  sections, and the phone tab bar minimises to its icons while you scroll
  down, as iOS 26's do.
- **Springs** — SwiftUI's .bouncy, .snappy and .smooth curves, sampled into CSS
  `linear()` — drive presses, sheets, the menu, the segmented pill and the
  card zoom.

Nothing is ever hidden waiting for JavaScript. With scripts blocked, with
reduced motion requested, or with `?nomotion` in the URL (handy for clean
portfolio screenshots; `localStorage.nomotion = '1'` for a whole session),
every element renders in its final state.

---

## Search visibility

Structured data is generated from `/data`:

- **`Dentist`** with coordinates, opening hours, price range, founder,
  employees, socials and an offer per service
- **`Person`** for each dentist, on their profile
- **`BreadcrumbList`** on every inner page, from the same array the visible
  breadcrumb draws
- **`FAQPage`** on patient info and every service with questions
- **`BlogPosting`** on articles, attributed to the dentist who wrote them
- **`WebSite`** tying it together

Every page gets a canonical URL, Open Graph and Twitter cards, and a generated
social image.

> **On the aggregate rating.** `clinic.seo.aggregateRating` is shown in the hero
> and published as structured data. Only keep it if the clinic genuinely holds
> those reviews. Set `value` to `0` to remove it everywhere.

---

## Architecture

- **Next.js 15 App Router + React 19**, JavaScript
- `components/` is organised by page — see **[components/README.md](components/README.md)**
  for the route → section map
- Server components by default; client components only where there is
  interaction, and they receive data as props — the content JSON never reaches
  the browser bundle
- `lib/data.js` is the single import surface, with safe accessors that join
  the files together, and development-time validation that names the file and
  key to fix
- Every route prerenders to static HTML, including every service, dentist and
  article
- Accessibility: skip link, one `h1` per page, visible focus rings, native
  modal dialogs (focus trap, Escape, inert background), a real tablist on the
  price table with arrow / Home / End keys, `aria-pressed` filters, live
  regions for copy and status, alt text everywhere, reduced motion and reduced
  transparency honoured

### Booking without a backend

`/book-appointment` deliberately has no form. Every action is a native
hand-off: `tel:`, `wa.me` with a pre-filled message, `mailto:` with a subject,
Google Maps directions, and copy-to-clipboard on each dentist's number. Nothing
is stored or submitted. If a clinic later wants a form, add a route handler
under `app/api/` and post to it — the rest of the site is unaffected.
