# Dental Clinic Website Template

A complete, production-ready dental clinic website built with Next.js and
Tailwind. **Every word, colour, price, phone number, typeface and image on the
site is read from `/data`.** Selling it to a new clinic means editing JSON —
no component is ever touched.

There is no backend. Booking hands off to the phone, WhatsApp, email and maps
apps, so there is nothing to host, secure or maintain beyond static files.

---

## Quick start

```bash
npm install
npm run dev
```

Node 18.17+. Deploys to Vercel, Netlify, Cloudflare Pages or any static host
with zero configuration.

| Command | What it does |
|---|---|
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Production build. Every route prerenders to static HTML |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run check` | **Pre-launch content check — run before every handover** |

---

## Selling this to a new clinic

The whole job is four files and a folder of photographs. Work top to bottom.

### 1. `data/site.json` — the switchboard

```jsonc
{
  "url": "https://theclinic.com",        // canonical links, sitemap, social previews
  "theme": {
    "colors": {
      "primary": "#0F332C",              // change these four…
      "accent":  "#B08D57",
      "surface": "#F7F4EF",
      "ink":     "#16181A"
    },
    "fonts": { "display": "Playfair Display", "body": "Jost" }
  },
  "features": { "blog": true, "gallery": true, ... },
  "analytics": { "googleAnalyticsId": "" }
}
```

**Colour.** Set the four hex values and the entire site recolours — every tint,
shade, hairline, muted label, icon, shadow and gradient is derived from them at
runtime by `lib/theme.js` and published as CSS custom properties. No Tailwind
rebuild, no stylesheet edits, no per-colour image assets. The ratios were
reverse-engineered from the reference palette, so a navy or plum clinic gets the
same visual rhythm as the original green one.

If one derived tint is wrong for a particular brand, override just that token:

```json
"overrides": { "line": "#DDD6C8" }
```

**Type.** Pick any pair from the menu in `lib/fonts.js` (five display faces,
five body faces). An unknown name falls back to the default pair and warns.

**Feature flags.** Turning one off removes the route from the navigation, the
footer, the sitemap *and* makes it return 404 — no orphan pages, no dead links.
Useful when a clinic does not want to publish prices or does not have a blog.

**Analytics.** Nothing third-party is injected unless an id is present. A blank
config ships zero tracking scripts.

### 2. `data/clinic.json` — who they are

Identity, hero copy, statistics, about section, contact details, opening hours,
socials, banners, footer, SEO.

Two things people miss:

- **`contact.address.geo`** — real latitude and longitude. Google uses these to
  place the clinic on the map and to answer "dentist near me". Right-click the
  pin in Google Maps to copy them.
- **`hours[].opens` / `closes` / `dayOfWeek`** — the machine-readable half of the
  opening hours. `days` and `time` are what visitors read; these are what
  appears in the search listing. Keep them in sync.

The copyright line uses `{year}`, so it never goes stale.

### 3. `data/doctors.json` and `data/appointment.json` — the conversion path

Real names, real direct numbers, real booking channels. `npm run check` verifies
that every `phoneHref` actually dials the number printed beside it.

### 4. Photographs

Drop them in `/public` and reference with a leading slash
(`"src": "/reception.jpg"`). See `public/README.md` for a suggested layout.
Remote hosts need an entry in `next.config.mjs`; local files do not.

Favicons, the Apple touch icon and the social share card are **generated from
the brand colours at build time** (`app/icon.js`, `app/apple-icon.js`,
`app/opengraph-image.js`). There is nothing to draw by hand and no clinic ever
ships with a blank share card.

### 5. Run the check

```bash
npm run check
```

```
Content check  -  Lumière Dental Clinic

Warnings (18)
  - site.json -> "url" is still the demo domain lumieredental.com.
  - clinic.json still contains the demo clinic name, at identity.name, …
  - 35 images are still a stock Unsplash photograph. …
```

It reads `/data` the way the app does and reports:

- **Errors** — the site will be broken or badly wrong in search. Exits non-zero,
  so it can gate a deploy.
- **Warnings** — leftover demo content. Almost always a missed edit.
- **Notes** — worth a look.

It catches mismatched `tel:` links, footer links pointing at deleted services, a
`founder.id` with no matching doctor, gallery categories not in the filter list,
unknown icon names, `/public` paths that do not exist, missing alt text, invalid
hex colours, duplicate slugs, and every trace of the demo clinic.

Ship when it is clean.

---

## Content files

| File | Controls |
|---|---|
| `site.json` | Domain, locale, theme, fonts, feature flags, analytics |
| `clinic.json` | Identity, hero, stats, about, contact, hours, socials, banners, footer, SEO |
| `ui.json` | Every interface label and heading the components used to hardcode |
| `navigation.json` | Header menu, header CTA, footer link columns |
| `services.json` | Service cards and their full detail pages |
| `treatments.json` | Price table categories, procedures, costs, visit counts |
| `doctors.json` | Team, qualifications, direct phone/WhatsApp/email |
| `testimonials.json` | Patient reviews and ratings |
| `process.json` | The treatment journey |
| `blog.json` | Articles, categories, body paragraphs |
| `gallery.json` | Photographs, categories, tile sizes |
| `patient-info.json` | First visit, payments, insurance, FAQ, policies |
| `appointment.json` | Booking channels, emergency line, response times |

Every file carries a `$comment` key explaining what it drives. Keys beginning
with `$` are documentation and are ignored everywhere.

### Copy interpolation

Any string in any data file can reference live clinic values:

```json
"practisingAt": "Practising at {clinic}, {city}."
```

Available tokens: `{clinic}` `{name}` `{city}` `{state}` `{line1}` `{line2}`
`{phone}` `{email}` `{established}` `{year}`. Add more in `copyTokens()` in
`lib/data.js`.

### Accent headings

Headings set one word or phrase in the accent italic. Matching is
punctuation-insensitive and understands multi-word phrases, so `"italicWords":
["You", "Your Family"]` italicises *Your Family* as a unit, and an accent word
of `"Smiles"` still matches a heading ending in `Smiles.`

---

## Routes

| Route | What it does |
|---|---|
| `/` | Hero, stats, services, about, process, reviews, articles |
| `/about` | Clinic story, full team, hygiene standards |
| `/services` | All services |
| `/services/[slug]` | Service detail with inclusions and FAQ |
| `/treatments` | Segmented price table, payment methods, insurance |
| `/gallery` | Filterable masonry with a draggable lightbox |
| `/patient-info` | First visit, FAQ accordion, privacy and terms |
| `/blog`, `/blog/[slug]` | Category-filtered index and articles |
| `/contact` | Contact channels, map, hours |
| `/book-appointment` | **The conversion page** — direct contact, no forms |

Plus `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, generated icons, a
generated social card, a custom 404 and a runtime error page that still shows
the clinic's phone number.

---

## Search visibility

Structured data is generated from `/data` — nothing to maintain by hand:

- **`Dentist`** with coordinates, machine-readable opening hours, price range,
  founder, social profiles and a `MedicalProcedure` offer per service
- **`BreadcrumbList`** on every inner page, built from the same array that draws
  the visible breadcrumb, so the two cannot drift apart
- **`FAQPage`** on patient info and on any service with questions — eligible for
  a rich result
- **`BlogPosting`** on articles
- **`WebSite`** linking it together by `@id`

Every page gets a canonical URL, Open Graph and Twitter cards.

> **On the aggregate rating.** `clinic.seo.aggregateRating` is published as
> structured data. Only keep it if the clinic genuinely holds those reviews —
> inventing them breaks Google's guidelines and risks a manual penalty. Set
> `value` to `0` to omit it entirely.

---

## Icons

Icons are **inline SVG**, defined in `lib/icons.js` and addressed by name from
any JSON file:

```json
{ "icon": "tooth" }
```

They are server-rendered, cost no network requests, inherit `currentColor` so
they follow the brand automatically, and cannot break. Adding one means adding a
24×24 entry to `lib/icons.js`. `npm run check` fails on an unknown name.

*(This replaced a third-party raster CDN that cost ~50 requests per page, needed
a CSS filter per colour, showed broken images on a slow network, and carried a
licence requiring a visible attribution link in the footer — a liability in a
template being resold. That obligation is gone.)*

---

## Motion

All animation shares one vocabulary, defined in `lib/motion.js`:

- **`IOS_EASE`** `cubic-bezier(0.32, 0.72, 0, 1)` — UIKit's sheet and
  navigation-push curve, used for anything that slides
- **`IOS_SOFT`** `cubic-bezier(0.16, 1, 0.3, 1)` — content settling into place
- **Springs, not durations** — `spring.snappy` for chrome, `gentle` for content,
  `sheet` for modals, `follow` for pointer tracking

Reproduced from iOS: translucent blurred nav material, a nav bar that retracts
on scroll down and returns on scroll up, bottom sheets draggable past a velocity
threshold, segmented controls whose pill slides between segments, and momentum
scrolling via Lenis.

**Reduced motion is honoured in JavaScript, not just CSS** — every component
checks `useReducedMotion()`, because a CSS media query cannot reach transforms
driven by Framer. Smooth scroll is skipped entirely, and re-checked if the
visitor changes the preference while the page is open.

The first page render is deliberately never animated. Animating it would mean
shipping `opacity: 0` on the element wrapping the entire page, so a JavaScript
error or a blocked bundle would leave the visitor looking at a blank screen.

---

## Architecture

- **App Router**, JavaScript, no TypeScript overhead for a template handover
- Server components by default; `'use client'` only where interaction demands it
- `lib/data.js` is the single import surface, with safe accessors — a mistyped
  slug or a deleted array returns a sane default instead of throwing
- **Development-time validation**: `lib/data.js` checks the content on server
  start and prints readable warnings naming the file and key to fix
- Every route prerenders to static HTML, including all service and blog pages
- Accessibility: skip link, one `h1` per page, visible focus rings, focus
  trapping and restoration in modals, `aria-controls` on the accordion, a proper
  tablist on the price table, `aria-pressed` on filters, titled iframes, alt text
  everywhere, semantic landmarks

### Conversion features

- **Sticky mobile action bar** — call, WhatsApp and book pinned to the thumb
  zone, because on a phone a clinic converts through the call button and almost
  nothing else. Hidden on the booking page, where those actions *are* the page.
- **Floating WhatsApp button** on desktop
- **Announcement bar** for offers and holiday hours (`features.announcement`)

Each is a feature flag.

---

## Booking without a backend

`/book-appointment` deliberately has no form. Every action is a native handoff:
`tel:`, `wa.me` with a pre-filled message, `mailto:`, Google Maps directions,
and copy-to-clipboard on each specialist's number.

Nothing is stored, nothing is submitted, there is no server to maintain or
secure, and there is no GDPR surface. If a clinic later wants a form, add a
route handler under `app/api/` and post to it — the rest of the site is
unaffected.
