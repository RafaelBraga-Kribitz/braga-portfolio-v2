# Handoff: Braga Design System v2 (portfolio, attempt 2)

Read this file first, then `HANDOFF.md` (decisions D-01 to D-25, to-do list A–F) and `AUDIT.md` (audit items A-1 to A-39).

## Overview
A design system plus portfolio site for Rafael Braga-Kribitz, Marketing Data Analyst. It reads like a technical manual: Geist and Geist Mono (the renamed BKribitz fonts), hairlines, numbering, one ultramarine accent, IBCS-only charts, and no decoration. This package holds the v2 token layer, the bound v1 component bundle, and the live specimens.

## About the design files
Everything under `specimens/` is an **HTML design reference** built as Design Components (`*.dc.html`). These are prototypes that show the intended look and behaviour. They are not production code. Recreate them in the target environment. The plan in `HANDOFF.md` §4-D is plain HTML + CSS with no inline `style=` and no React on content pages. The tools use Preact. If you start from nothing, use Astro, as the earlier build did. The `.dc.html` files need `support.js` and the `_ds` bundle to render, and they are only for reading and comparing.

## Fidelity
**High fidelity.** Colours, type, spacing and states are final, except for the open items listed below. Match them exactly.

## Contents
- `ds-update/tokens/` is the **source of truth for v2 values**. Load order is the base tokens in `_ds/…/tokens/`, then these overrides.
  - `colors.css`: ultramarine accent pair (#2F4BE0 light, #7C93FF dark), cool-tinted neutrals, `--ink-3`
  - `chart-palettes.css`: 7 scales, categorical colours, `--on-cat-*`
  - `ibcs.css`, `typography.css`, `spacing.css` (page max 1320), `flow.css` (relationship spacing), `grid.css`, `fonts.css`, `component-fixes.css`
- `ds-update/proposals/` holds the adopted theme, foundations, shell, doc and print CSS, plus `checks.js`, `format.js` and `code.js`.
- `ds-update/fonts/` holds the OFL text. `ds-update/cv/` holds the LaTeX CV.
- `_ds/…/` holds the v1 bound system: 48 React components, `_ds_bundle.js`, tokens and fonts. Its bundle has a loader fix described in `HANDOFF.md` §3: exclude `templates/**/ds-base.js` upstream.
- `specimens/`:
  - `Design System v2`: core tokens and components
  - `… - Site`: Shell, Cover, Index, Document, Evidence and Bench patterns with real content
  - `… - Charts`: **needs a rebuild**, with hard-coded old palettes
  - `… - Templates` and `… - Audit`: supporting references

## Screens / Views
Layout, exact spacing and copy live in the specimens. Port the Site patterns in this order: 01 Shell, 02 Cover, 03 Index, 04 Document, 05 Evidence, 06 Bench. Keep the spacing exactly as in the specimen. The full page list is in `HANDOFF.md` §4-E: Home, Work index plus 5 projects, About/CV, 3 legal pages, 404, and note, listing and essay templates, each in EN and DE.

## Design tokens (summary)
- **Light:** surface #E4E6EA, surface-2 #DCDEE2, surface-3 #D4D6DA, ink #26282C, ink-2 and ink-3 #5A5C61, mid #9EA0A5 (hairlines only, never text), rule #C2C4CA
- **Dark:** #191A1D, #2C2D30, #484A4D, ink #F3F5F9, ink-2 #CED0D4, ink-3 #97999D, mid #7E8084, rule #393A3D
- **Accent:** #2F4BE0 light, #7C93FF dark. It may be text only for the one earned figure per view.
- **Chart roles:** ultramarine = highlight; jade = good variance; vermilion = bad variance, always with ▲; ochre = the other side of a neutral split. The amended marks (jade #007A66 etc.) are in `HANDOFF.md` §7.
- **Type:** headings at 700, wordmark BRAGA at 800 with −0.07em tracking. No size below 12px. Reading width is 60ch (open).
- **Spacing:** 8px base. `--flow-*` tokens: related 8, element 16, block 32, lead 48, group 64, section 96 (64 below 768px).
- **Corners:** 0. No shadows, no gradients, no blur. Motion is only the row-wash at ~140ms with `cubic-bezier(.2,0,0,1)`, and it respects reduced-motion.
- **Status squares:** ■ complete, ▣ functional, ▤ under-revision, □ in-build, ⊡ archived, always with a text label.

## Interactions & behaviour
- Theme: `data-theme` on `<html>`, following the OS setting, with a toggle override and a pre-paint script. `.dark` stays per element for moment blocks.
- Language: two route trees, `/en/` and `/de/`, joined by plain links with hreflang and `lang`.
- No JavaScript on content pages. Tools are exempt and need a no-JS static fallback.
- Hover: row-wash to surface-2, and a grey-to-orange shift on the arrow. Press: highlight.
- Tap targets are at least 44px on mobile. At 320px the header uses a flat pattern with no hamburger, which still needs design.
- Number, date and currency formats follow the page language (`proposals/format.js`).

## State management
Only the tools hold state (the Confusion Matrix and the A/B sample-size bench). Put the maths in pure modules with hand-computed reference cases, and give screen readers a live readout.

## Assets
Fonts are Geist and Geist Mono (modified BKribitz, SIL OFL 1.1). Ship the OFL text and a NOTICE. The package has no images or icons. The only glyphs are → and ↗.

## Open items
1. Reading width, 60ch or 64ch (one line in `flow.css`).
2. German labels for the footer groups and the status vocabulary.
3. Whether to use an alias instead of the public Gmail address.
4. The Charts specimen rebuild (A2), covering C-01 to C-09.

## Not included
The `uploads/` brief (`CLAUDE.md`, the 01–04 documents, the earlier Astro builds and the raw fonts) and `_parked/` are not in this package. Add the brief if the receiving agent needs the full rules. `CLAUDE.md` outranks the specimens.
