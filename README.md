# bbit — a quiet digital garden

The personal site of Fery: UX work, film photography (@blancc.canvas), and
the *bibit* philosophy — in Bahasa Indonesia, **bibit means seed**.

The site practices what it preaches: it grows while you read it.

## What lives here

- **Cover** — the "bbit." wordmark assembles from drifting pixel seeds
  (sampled live from Pixelify Sans on a canvas). Once settled, the letters
  scatter gently around your cursor and spring back.
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
- **Day / dusk** — follows `prefers-color-scheme`, with a manual toggle in
  the nav (persisted). All plant colours re-read the CSS tokens live.

Every animation has a `prefers-reduced-motion` equivalent: the wordmark
renders settled, the garden renders grown, reveals are instant.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # serve the production build
node shots.mjs     # screenshot harness (needs `npm run dev` on port 5199)
```

Deploy by hosting `dist/` anywhere static. For GitHub Pages, follow
[DEPLOY.md](DEPLOY.md) — a workflow at `.github/workflows/deploy.yml` is
already set up to build and publish on every push to `main`.

## Where things are

| Thing | File |
|---|---|
| Design tokens (day + dusk) | `src/styles/global.css` |
| Plant generator | `src/garden/plants.ts` |
| Canvas renderer | `src/garden/engine.ts` |
| Wordmark choreography | `src/components/Cover.tsx` |
| Interactive garden + contact | `src/components/Garden.tsx` |
| Project placeholders | `src/data/projects.ts` |
| Photo list + captions | `src/data/photos.ts` |
| Strategy / visual system docs | `PRODUCT.md`, `DESIGN.md` |
