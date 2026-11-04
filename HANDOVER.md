# Birks Creek: Hand-over

*Last updated 4 November 2026*

## 1. What this is

A tongue-in-cheek one-page website about the constant groundwater flow from new builds at
the Fullarton Rd end of Birks St, Parkside (SA). The water runs down the Birks St gutter,
carries debris, and pools at the corner of Myra St. It has been flowing for 4+ years.

The page presents the pool as a tourist attraction ("Birks Creek", "Lake Myra") to make
the problem memorable and shareable, while the facts stay accurate.

| | |
|---|---|
| **Live site** | https://birkscreek.pages.dev |
| **Repo** | https://github.com/demq/birks-creek (public) |
| **Hosting** | Cloudflare Pages, free plan, project `birkscreek` |
| **Cost** | $0. No custom domain yet |

## 2. Current state

Live now, top to bottom:

1. **Hero**: the Myra St pool photo with a wooden "Welcome to Birks Creek" park sign on
   posts. The sign is placed so the pool stays visible. It has a days-on-camera counter,
   a "Visitor Centre opening soon" line, and a plate linking to the meeting. Animated
   droplets drift over the photo (canvas, off for reduced-motion users).
2. **Scenic lookout**: a panorama crop of the second photo (gutter and pool).
3. **Community meeting notice**: Mon 9 Nov 2026, 5–6pm, corner of Birks & Myra St, with
   Unley Council's Assets Manager and both Parkside Ward Councillors. It offers "Add to
   calendar" (`public/meeting.ics`), "Download flyer (PDF)", the contact email and the
   councillors' council emails. **After 6pm on 9 Nov the label switches by itself to
   "Meeting held · updates to follow"** (`src/main.ts`, `MEETING_END`). Replace this
   section with the outcome once known.
4. **Gift shop** (joke): tee, gumboots, mug and tote, each drawn in SVG with the Birks
   Creek logo badge. "Add to cart" only swaps in a sold-out joke. Nothing is sold, and the
   page says so.
5. **Footer**: "Not affiliated with any tourism authority."

Also in the repo: the resident **flyer** (`handout/flyer.src.html`, linked from the site) and an
older, unlinked A4 policy handout (`handout/handout.src.html`) that sets out Council's own
policy (see §6) and lists questions to ask. The meeting place is now "Outside 4 Birks St".

## 3. Tech

- **Vite + vanilla TypeScript**, no framework. Output is plain static files in `dist/`.
- Fonts: Fraunces + Inter (Google Fonts).
- Logo: an inline SVG `<symbol id="bc-badge">` in `index.html`, reused by the merch art.
- No backend, no cookies, no analytics.

```
index.html                  all page markup (hero, panorama, meeting, shop, logo symbol)
src/main.ts                 counter, meeting status switch, droplet canvas, shop buttons
src/style.css               all styles (sections are commented)
scripts/optimize-images.mjs photos/ → public/img/ (resized, metadata stripped, crops)
public/                     served as-is: img/, meeting.ics, handout PDF
handout/                    handout source HTML, QR code, rendered PDF
PLAN.md                     original plan and phase roadmap
```

## 4. Everyday tasks

### Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

### Deploy

```bash
npm run deploy       # = build + wrangler pages deploy dist --project-name birkscreek
```

You need to be logged in with `npx wrangler login` (Cloudflare account owner). A deploy
goes live in about 10 seconds. Pushing to GitHub does **not** deploy. See §7.

### Add photos

1. Drop originals into `photos/`. **This folder is git-ignored on purpose**: iPhone
   originals carry camera model and timestamps, and could carry GPS.
2. `npm run images` writes 640/1280 px JPEG + WebP copies into `public/img/`, with
   metadata stripped.
3. For a custom crop, add an entry to `CROPS` in `scripts/optimize-images.mjs`. Example:
   the `img_0986-pano` crop cuts off the photographer's shadow.
4. Reference the new files in `index.html` and commit `public/img/`.

### Update the handout

Edit `handout/handout.src.html`, then:

```bash
cd handout
node -e "const fs=require('fs');fs.writeFileSync('handout.html',fs.readFileSync('handout.src.html','utf8').replace('{{QR}}',fs.readFileSync('qr.svg','utf8')))"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --print-to-pdf="$PWD/Birks-St-Meeting-Handout.pdf" "file://$PWD/handout.html"
cp Birks-St-Meeting-Handout.pdf ../public/birks-st-meeting-handout.pdf
```

Check that it still fits on one A4 page, then deploy.

### Update the resident flyer

The resident flyer (original text from the organiser's Word/ODT file in `photos/`, restyled,
with a QR code to the site) lives in `handout/flyer.src.html`. Its photos are in
`handout/flyer-img/` and the QR is `handout/flyer-qr.svg`. Rebuild with
`handout/build-flyer.sh`, which builds the colour PDF (`public/groundwater-meeting-flyer.pdf`) and a
low-ink black-and-white version (`public/groundwater-meeting-flyer-bw.pdf`, styled by `handout/flyer-bw.css`).
The site links to it as "Download flyer (PDF)". The flyer replaced the old handout download on the site (the user chose to publish it as is, including the organiser's name,
address and phone, which departs from §5).

## 5. Content rules (important)

The site names a real street and refers to specific new builds. Australian defamation law
applies. Keep to these rules:

- **Facts plain, jokes about the situation.** Dates, photos, where the water flows: fine.
  Don't make claims about anyone's motives or say they broke the law. Use phrasing like
  "we'd like Council to check whether…".
- **No owners, builders or private individuals by name.** No property street numbers on
  the page. No faces or readable number plates in photos (blur them first).
- **The meeting organiser's name and home address stay off the site and out of the repo.**
  Only the shared contact email is used.
- Councillors appear only in their public role, with their official council emails.
- The repo is **public**: never commit personal emails, neighbours' details, the meeting
  letter, or original photos. Commits from this folder use the GitHub no-reply address
  (repo-local `git config user.email`). Keep it that way.

## 6. Background: the policy argument

Council has previously suggested the EPA must have approved the discharge as part of the
building approval. Council's own policy says otherwise:

- City of Unley, *Construction of Crossing Places & Stormwater Pipes from Properties
  Policy* (version 5, 8 Dec 2025), **clause 6.8**: groundwater discharge through any
  street stormwater connection (kerb water table or laneway) is **prohibited**, unless
  Council approves a connection made directly to its underground stormwater
  infrastructure.
- The policy's Responsible Officer is the **Manager City Assets** (s.5). Street
  connections are made by Council or with its permission (6.3, 6.10).
- EPA referral of a development is not automatic. It depends on categories in Schedule 9
  of the PDI (General) Regulations 2017.
- Open question: did the 2019 version of the policy (in force when the flow started,
  around 2022) contain the same clause?

Source: [the policy PDF](https://www.unley.sa.gov.au/files/content/public/v/81/council/about-the-council/policies/construction-of-crossing-places-stormwater-pipes-from-properties-policy-final-8-december-2025.pdf).
This is background for residents, not legal advice.

## 7. Gotchas

- **Cloudflare Pages vs Workers.** Wrangler now steers new Pages projects to Workers.
  The `birkscreek` project was created once with `--force` to keep the clean
  `birkscreek.pages.dev` address. Don't pass `--force` again.
- **No auto-deploy from GitHub.** `birkscreek` is a *direct-upload* Pages project, and
  those can't later be connected to Git. Deploy with `npm run deploy`. If you want deploy
  on push, add a GitHub Actions workflow that runs `wrangler pages deploy` with a
  Cloudflare API token stored as a repo secret.
- **npm install-scripts warning** (esbuild, workerd) is harmless for building and deploying.
- **`vite preview` / browser caching.** If a change doesn't show, hard-reload or add a
  `?v=` query string.

## 8. What's next (from PLAN.md)

| Status | Item |
|---|---|
| ✅ | Phase 0: scaffold, image pipeline, hosting, placeholder |
| ✅ | Meeting notice, handout, gift shop, logo |
| ⏳ | **After 9 Nov:** replace the meeting section with the outcome and Council's commitments |
| ⏳ | **More evidence:** photos and video of the source outlets, the flow along the gutter, the pool on different dates. A short video loop would make a great hero |
| ⏳ | **Timeline / evidence log:** dated entries from a JSON file (start ~2022, Feb 2024 photos, the Nov 2026 meeting) |
| ⏳ | **"The Journey":** satellite view with an animated line tracing the flow down Birks St to Myra St. Use properly licensed imagery (Esri / Mapbox / SA Gov aerials), not Google screenshots |
| ⏳ | **"Lake Myra" ripple effect:** WebGL ripples on the pool photo |
| ⏳ | **Field guide:** photo filters (nature documentary, tourism brochure, crime scene) |
| ⏳ | **Polish:** Open Graph share image, Lighthouse pass |
| Optional | Custom domain (e.g. `birkscreek.com`, about US$10/yr via Cloudflare Registrar) |
| Optional | GitHub Actions deploy on push |

## 9. Not in the repo (kept locally only)

- `photos/`: original photos with camera metadata.
- `private/`: the meeting invitation letter (contains neighbours' details), the meeting
  brief, and a copy of the Council policy PDF.

If someone else takes over, pass these on directly, not through GitHub.
