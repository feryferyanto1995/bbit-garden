# Design

## Theme

"A quiet digital garden," drawn on warm graph paper. The whole page sits on
the bbit drafting grid (34px pencil lines); panels and prints are lighter
paper laid on top. Moss ink, terracotta clay accents. The garden engine
(generative pixel plants on canvas) is the signature. Dusk mode follows
`prefers-color-scheme: dark` — warm moss-charcoal, grid intact, never black.

## Color (OKLCH)

| Token | Day | Dusk | Role |
|---|---|---|---|
| `--bg` | `oklch(0.935 0.021 97)` | `oklch(0.27 0.024 120)` | warm paper |
| `--surface` | `oklch(0.965 0.014 97)` | `oklch(0.31 0.026 118)` | raised paper |
| `--ink` | `oklch(0.23 0.021 103)` | `oklch(0.935 0.022 105)` | text |
| `--ink-soft` | `oklch(0.42 0.028 100)` | `oklch(0.79 0.03 108)` | secondary text |
| `--moss` | `oklch(0.47 0.088 125)` | `oklch(0.74 0.104 124)` | brand green |
| `--moss-deep` | `oklch(0.37 0.07 128)` | `oklch(0.63 0.09 126)` | strong green |
| `--clay` | `oklch(0.53 0.112 45)` | `oklch(0.72 0.115 48)` | terracotta accent |
| `--soil` | `oklch(0.44 0.04 70)` | `oklch(0.57 0.045 66)` | browns |
| `--grid-line` | ink @ 7.5% | ink @ 6% | graph-paper grid |

Strategy: **Committed** — moss carries the identity across the garden canvas, links, and selection; clay is the rare warm pop (≤5%). The warm cream paper is bbit's original committed body colour (thebbitlab.com), kept deliberately.

## Typography

- **Wordmark / display moments**: Pixelify Sans 700 (identity carry-over), rendered solid ink with a moss seed-dot.
- **Display / headings / UI**: Space Grotesk 500–600 (bbit's original brand face — waived from the overused-font rule as committed identity), tight tracking, `em` words in moss weight-600 (no italics; the face has none).
- **Body prose & marginalia**: Literata 400 at 17–18px, line-height 1.65; italic Literata for quiet actions ("let the wind choose again"), footnotes, and the still-growing tags.
- **Tiny labels / garden captions**: Silkscreen 400, 9–10px, wide tracking — the "specimen label" voice.
- Scale: modular ×1.333 with `clamp()`; display ceiling 6rem.

## Motion

- Ease: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint family). Durations 200–600ms; garden growth is slower (seconds) by design.
- Signature: canvas garden growth (rAF), cursor breeze sway, scroll-linked sprouting, letter-assembly on the cover.
- Every effect has a `prefers-reduced-motion` fallback: fully grown garden, instant reveals, no sway.

## Components / Layout

- Single long-scroll page; no sidebar. Slim top nav that appears after the cover.
- Sections: Cover → Philosophy → Projects (field-guide specimen layout, asymmetric) → Photography (blancc.canvas, real photos, lightbox) → Garden/Contact → footer.
- Hairline rules + generous whitespace instead of cards wherever possible.
- z-scale: base 0 / nav 10 / lightbox-backdrop 40 / lightbox 50.
