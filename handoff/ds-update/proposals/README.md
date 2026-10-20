# Proposals (Audit · 20 Oct 2026)

Additions to the v2 design system, **adopted on every specimen on 20 Oct 2026** after the owner's review (Core, Site and Charts load theme, foundations and print; Site also loads shell; the Audit page loads all five and keeps one Tweaks switch per stylesheet for before/after). Each file still stands alone: deleting one removes exactly its rules.

| File | Proposal | Answers | Folds into (handover tree) |
|---|---|---|---|
| `theme.css` | P-01 theme model: `data-theme` on `<html>`, OS default, pre-paint script, `color-scheme` per theme, all dark values in one place | A-18, A-19 | `design-system/tokens.css` (dark half) |
| `foundations.css` | P-02 ten global rules: reduced motion, `--edge` for control boundaries, ink focus ring, scroll-padding, skip link, underlined prose links, 24/44px targets, mid never text, hyphenation, numeric features | A-01 … A-08, A-21 | `design-system/base.css` |
| `shell.css` | P-04 header at 320 / 390 / 768+ without a hamburger; compact strip below 360 | A-08, A-20, A-21, A-22 | `design-system/layout.css` |
| `doc.css` | P-08 the rendered markdown document: article grid, elements, generated parts, Obsidian callout vocabulary, FLOW section | A-24, A-25 | `base.css` (elements + flow), `layout.css` (opener/end), `components.css` (callouts), `obsidian-snippet.css` |
| `print.css` | P-11 A4 print: light palette on white, chrome dropped, hairlines kept, no breaks inside figures | A-29 | `design-system/print.css` |
| `checks.js` | the gates (12 checks on the rendered DOM), token reader, contrast matrix, type proofs, flow-pair measurement, off-screen frame runner | A-23, A-26, gates | build: `scripts/gates/` (Playwright driver) |
| `format.js` | P-09 EN/DE number, currency, date, unit formatting with hand-computed reference cases | A-27 | build: `src/lib/format.ts` |

Adopting a stylesheet: keep the file, move its rules into the named handover file when `design-system/` is assembled. Dropping one: delete the file and its `<link data-proposal="…">` in the Audit page head.

Load order matters for two files: `foundations.css` after `component-fixes.css` (its `!important` control overrides must win), `theme.css` after `colors.css`.
