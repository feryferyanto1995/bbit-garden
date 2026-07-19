# Design

## Theme

"A quiet digital garden," drawn on warm graph paper. The whole page sits on
the bbit drafting grid (34px pencil lines); panels and prints are lighter
paper laid on top. Moss ink, terracotta clay accents. The garden engine
(generative pixel plants on canvas) is the signature. Dusk mode follows
`prefers-color-scheme: dark` — warm moss-charcoal, grid intact, never black.

## Color (OKLCH)

Sourced from the bbit brand palette (hex in parens = the reference swatch):

| Token | Day | Dusk | Role |
|---|---|---|---|
| `--bg` | `oklch(95.7% 0.016 95)` · #F4F1E5 | `oklch(26% 0.008 80)` | paper / grid ground |
| `--surface` | `oklch(96.4% 0.008 91)` · #F5F3ED | `oklch(30% 0.009 78)` | raised paper (cards, prints) |
| `--ink` | `oklch(23.1% 0.006 82)` · #1E1D1B | `oklch(93.5% 0.012 92)` | text / borders |
| `--ink-soft` | `oklch(42% 0.014 76)` | `oklch(79% 0.016 88)` | secondary text |
| `--moss` | `oklch(50.8% 0.068 123)` · #5E6C3F | `oklch(74% 0.08 120)` | dark olive — links, em, brand |
| `--moss-bright` | `oklch(72.5% 0.067 117)` · #A3AC7C | `oklch(82% 0.075 116)` | light olive — plant highlights |
| `--clay` | `oklch(60.4% 0.114 41)` · #BA6849 | `oklch(70% 0.115 44)` | terracotta — fills, focus ring |
| `--clay-deep` | `oklch(52.8% 0.115 43)` | `oklch(75% 0.11 46)` | terracotta as **text** (AA) |
| `--soil` | `oklch(57.6% 0.024 70)` · #83776A | `oklch(64% 0.026 70)` | taupe — soil, decoration |
| `--soil-deep` | `oklch(43.2% 0.019 73)` | `oklch(74% 0.024 72)` | taupe as **text** (AA) |
| `--grid-line` | ink @ 7.5% | ink @ 6% | graph-paper grid |

Strategy: **Committed** — dark olive carries the identity across links, em words, and the garden canvas; taupe is the soil; terracotta is the rare warm pop. Base accent hues stay true to the brand for fills, focus rings, and plant colour; the `-deep` variants darken taupe/terracotta only where they must read as small text, so everything clears WCAG AA (≥4.5:1). The warm beige paper is bbit's original committed body colour (thebbitlab.com), kept deliberately.

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
