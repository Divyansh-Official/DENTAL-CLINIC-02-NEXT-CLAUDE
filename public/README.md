# public/

Anything in this folder is served from the site root.

Drop the clinic's own photographs here and reference them from `/data/*.json`
with a leading slash — `"src": "/reception.jpg"` resolves to `public/reception.jpg`.
Local files need no entry in `next.config.mjs`; only remote hosts do.

A suggested layout:

```
public/
  hero.jpg              clinic.json  -> hero.image
  interior.jpg          clinic.json  -> about.interiorImage
  founder.png           clinic.json  -> about.portraitImage   (cut-out PNG works best)
  team/dr-name.jpg      doctors.json -> items[].image
  services/implants.jpg services.json -> items[].image
  gallery/01.jpg        gallery.json -> items[].src
  tour.mp4              clinic.json  -> hero.story.video.src
```

`npm run check` reports any JSON path pointing at a file that is not here.

Favicons and the social share card are generated from the brand colours at
build time — see `app/icon.js`, `app/apple-icon.js` and `app/opengraph-image.js`.
There is nothing to draw by hand.
