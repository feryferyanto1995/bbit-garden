# bbit — a quiet digital garden

**v1.1 · live at [feryferyanto1995.github.io/bbit-garden](https://feryferyanto1995.github.io/bbit-garden/)**

The personal site of Fery: UX work, film photography (@blancc.canvas), and
the *bibit* philosophy — in Bahasa Indonesia, **bibit means seed**.

The site practices what it preaches: it grows while you read it.

## What lives here

- **Cover** — the "bbit." wordmark assembles from drifting pixel seeds
  (sampled live from Pixelify Sans on a canvas). Once settled, the letters
  scatter gently around your cursor and spring back.
- **The seed-dot is the theme switch** — the green cube beside the wordmark
  toggles day ⇄ dusk. It pulses softly once the letters settle, whispers
  "dusk?/day?" on hover, bursts into pixels under the cursor, and springs
  back after the sky changes. The nav's sun/moon toggle stays in sync.
- **Specimens** — projects presented as herbarium sheets, each illustrated
  by a procedurally-generated pixel plant that grows when scrolled into view.
  (Placeholder content for now; swap in real case studies in
  `src/data/projects.ts`.)
- **Frames** — one film photograph "chosen by the wind" on each visit,
  presented as a mounted print, with a shuffle action and a contact-sheet
  strip. Any frame opens the accessible `<dialog>` gallery (keyboard
  arrows, Esc, focus restore). Photos and captions live in
  `src/data/photos.ts`.
- **Dividers** — the hand-drawn bbit seed (APNG) sprouting on loop between
  sections; reduced-motion visitors get a still seedling.
- **Garden** — click the soil to plant a seed. Every plant is generated from
  a random seed (five species: sprout, grass, fern, flower, berry), grows in
  real time, sways in the wind and near your cursor, and is saved to
  `localStorage` — the garden remembers you between visits.
- **Day / dusk** — follows `prefers-color-scheme`; manual choice (seed-dot
  or nav toggle) persists. All plant colours re-read the CSS tokens live.

Every animation has a `prefers-reduced-motion` equivalent: the wordmark
renders settled, the garden renders grown, reveals are instant, the
seed-dot skips its pulse.

## Colour

The **bbit.lab official palette**, as exact hexes in
`src/styles/global.css` (day) with a derived after-sunset dusk theme:

| Role | Hex |
|---|---|
| Base grid background (beige) | `#F4F1E5` |
| Card background (off-white) | `#F5F3ED` |
| Typography & UI (charcoal) | `#1E1D1B` |
| Primary accent (dark olive) | `#5E6C3F` |
| Secondary accent (light olive) | `#A3AC7C` |
| Tertiary accent (taupe) | `#83776A` |
| Accent (terracotta) | `#BA6849` |

Taupe and terracotta get darker `-deep` variants where they appear as small
text, so everything holds WCAG AA (≥4.5:1) in both themes.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # serve the production build
node shots.mjs     # screenshot harness (needs `npm run dev` on port 5199)
```

## Deploying

Pushing to `main` deploys automatically: `.github/workflows/deploy.yml`
builds and publishes to GitHub Pages (base-path aware — works at the
project URL today and at a custom domain the moment `public/CNAME` exists).
The step-by-step plan, including moving **thebbitlab.com** over from the
old site, is in [DEPLOY.md](DEPLOY.md).

## Where things are

| Thing | File |
|---|---|
| Design tokens (day + dusk) | `src/styles/global.css` |
| Theme switch logic (shared) | `src/lib/theme.ts` |
| Public-asset path helper | `src/lib/asset.ts` |
| Plant generator | `src/garden/plants.ts` |
| Canvas renderer | `src/garden/engine.ts` |
| Wordmark + seed-dot switch | `src/components/Cover.tsx` |
| Interactive garden + contact | `src/components/Garden.tsx` |
| Project placeholders | `src/data/projects.ts` |
| Photo list + captions | `src/data/photos.ts` |
| Strategy / visual system docs | `PRODUCT.md`, `DESIGN.md` |

## Version history

- **v1.1** (2026-07-20) — bbit.lab official colour palette applied as exact
  hexes; seed-dot on the cover became the theme switch; dusk theme
  re-derived on warm charcoal.
- **v1.0** (2026-07-17) — first planting: garden engine, wordmark assembly,
  specimens, frames, APNG dividers, day/dusk, GitHub Pages deploy.
