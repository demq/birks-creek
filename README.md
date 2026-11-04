# Birks Creek

A tongue-in-cheek website documenting the constant groundwater flow down Birks St,
Parkside (South Australia), live at **https://birkscreek.pages.dev**.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + build to dist/
npm run deploy     # build and deploy to Cloudflare Pages
```

## Photos

Put originals in `photos/`. That folder is git-ignored because originals carry camera
metadata. Then run `npm run images` to write resized, metadata-free copies to `public/img/`.

## Meeting handout

`handout/handout.src.html` is the source for the printable A4 handout. The PDF is
rendered with headless Chrome and copied to `public/` for download.
