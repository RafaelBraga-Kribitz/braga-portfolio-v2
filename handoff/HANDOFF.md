# Handoff: portfolio attempt 2, design phase

Written 20 Oct 2026. Start the new chat by reading this file, then `uploads/CLAUDE.md` and `uploads/README.md`.

## 1. Context
- **Owner:** Rafael Braga-Kribitz, Marketing Data Analyst, Seiersberg (Styria, Austria).
- **Project:** a design system plus portfolio site, attempt 2. The brief is in `uploads/`:
  - `README.md`
  - `01-do-not-repeat`, `01-failures-raw`
  - `02a`, `02b` inventories. The `02a-pages-elements.md` and `02b-tools-projects-writing.md` copies are exact duplicates and can be deleted.
  - `03-architecture-for-design-agent`, `03-research`
  - `04-foundation-quality-bar`, `04-rules-inheritance`
  - `CLAUDE.md`
- **Order of authority:** owner > `CLAUDE.md` > `DECISIONS.md` > specimens.
- **Earlier site build:** `uploads/braga-portfolio/` and `uploads/braga-portfolio-website/` (Astro).
- **Fonts:** `uploads/BKribitz-1.000/`.
- **"My changes" lines in 02a and 02b are still empty**, so design from the mini-prompts as written.

## 2. Decisions settled (record each as a dated D-entry in `DECISIONS.md`)
| # | Decision | Value |
|---|---|---|
| 1 | Role / title | Marketing Data Analyst |
| 2 | Launch scope | All 5 projects, each with an honest status (Energy = In build, Decision analytics = Functional) |
| 3 | Fonts | BKribitz + BKribitz Mono 1.000: modified, renamed Geist / Geist Mono under SIL OFL 1.1, self-hosted. Legitimate. Ship the OFL text and NOTICE. |
| 4 | Accent | Ultramarine, one hue, two values: #2F4BE0 light (5.3:1), #7C93FF dark (6.2:1). Rejected: emerald, vermilion, cobalt, Austrian red #C8102E (reads as IBCS red for colour-blind readers), violet, petrols. |
| 5 | accent-02 (#5B7FFF "moment" blue) | Retired. Moments use the `.dark` inversion only. |
| 6 | Neutrals | Cool tint toward ultramarine (OKLCH hue 265, chroma 0.005–0.008). Light: surface #E4E6EA / s-2 #DCDEE2 / s-3 #D4D6DA / ink #26282C / ink-2 = ink-3 #5A5C61 / mid #9EA0A5 / rule #C2C4CA. Dark: #191A1D / #2C2D30 / #484A4D / ink #F3F5F9 / ink-2 #CED0D4 / ink-3 #97999D / mid #7E8084 / rule #393A3D. |
| 7 | Mid grey | Hairlines only, never text. Numbering uses `--ink-3`. |
| 8 | Heading weight | 700 for all headings. Wordmark alone 800. Weight 900 retired. |
| 9 | Wordmark | "Braga", title case, weight 800, no dot. |
| 10 | Page max width | 1320px |
| 11 | Languages | EN + DE as two built route trees (`/en/`, `/de/`) joined by plain links, with hreflang and `lang` on every page |
| 12 | Spelling | British English. Legal pages in German. |
| 13 | Footer | The website's 4 groups: Index / Site / Elsewhere / Others (Sitemap, RSS, Impressum, Privacy, Accessibility) |
| 14 | Impressum | Rafael Braga-Kribitz · 8054 Seiersberg, Styria, Austria · rafaelbragakribitz@gmail.com · non-commercial. No street address. (Not legal advice; a check of MedienG §25 / ECG §5 is advised.) |
| 15 | Notation | IBCS is the only notation. Classic mode and the `data-notation` switch are gone. |
| 16 | Chart colour roles | ultramarine = highlight / main series · jade #00927A (dark #00C69F) = good variance · vermilion #E8431A = bad variance and alert (always with ▲) · ochre = "other side" of a neutral split |
| 17 | Chart scales (7) | sequential ultramarine (9) · diverging good/bad (13) · two-sided ultramarine↔ochre (13) · long interpolation (8, unchanged) · short blue→magenta→amber (8, re-derived) · categorical hue (5) · categorical grey (4). Retired: seq vermilion, seq #5B7FFF blue, political blue/pink. |
| 18 | Categorical hue | ultramarine #2F4BE0 · amber #E0A100 · sky #3FA9D9 · magenta #C4278F · umber #7A4A1E; slot 6 and up = Other (mid). Dark set: #7C93FF #F0B400 #54C0F0 #F060B8 #B88555. **Rule:** amber and sky are below 3:1 on light, so they need direct labels plus a 1px ink edge on fills. |
| 19 | Text on fills | `--on-accent`, `--on-cat-1..5` tokens. Variance labels sit outside the bars (jade on white is below 4.5:1). |
| 20 | Spacing | `flow.css` relationship tokens: related 8 / element 16 / block 32 / lead 48 / group 64 / section 96 (64 below 768px), plus a 1px ink opening rule |
| 21 | Header | Opaque surface plus a hairline. No blur. |
| 22 | JavaScript | None on content pages (owner's rule from `CLAUDE.md` / 04). Exempt: tools, and the theme script that runs before first paint. |
| 23 | Status mark | A square (filled = settled, outlined = in build), always with a text label |

## 3. Done so far
- `ds-update/tokens/colors.css`: ultramarine pair plus the tinted neutrals and `--ink-3`.
- `ds-update/tokens/chart-palettes.css`: the 7 scales, categorical colours and on-fill tokens.
- `ds-update/tokens/ibcs.css`: IBCS only; highlight = accent.
- `ds-update/tokens/typography.css`: `--w-display` 700; `.index` uses `--ink-3`.
- `ds-update/tokens/spacing.css`: `--page-max` 1320; rule greys tinted.
- `ds-update/tokens/flow.css`: `--w-wordmark` 800.
- `Design System v2.dc.html` and `Design System v2 - Site.dc.html`:
  - accent tweak removed;
  - weight fallback set to 700;
  - text that used `var(--mid)` now uses `var(--ink-3)`.
- **Bundle loader fix.** `_ds/…/_ds_bundle.js` accidentally contained the Confusion Matrix template's own loader script, which caused 404s and would have overridden the v2 tokens. It is disabled with an early `return`.
  - **Upstream:** exclude `templates/**/ds-base.js` from the design-system bundle. Otherwise the next design-system sync brings the errors back.

## 4. To do, in order
**A. Cleanup**
1. Fix the Site page warning: `{{ r.k }}` / `{{ r.v }}` never resolve (likely the cover spec list, whose fields are `k`/`v`). Check the `sc-for` `as=` name.
2. Rebuild `Design System v2 - Charts.dc.html` on the new tokens:
   - remove the hard-coded `PAL` / `HEX` arrays (still vermilion / #5B7FFF);
   - remove the notation, highlight and variance tweaks;
   - update the colour-blind check to the new sets;
   - move to the closed set of 9 charts, C-01 to C-09 (see 02a).
3. Delete `Design System v2 - Charts (classic).dc.html`. Park (move or archive) `Dashboards 1–3` and `Dash*.dc.html` for the later funnel tool and the Power BI page in the MMM refit.
4. Delete the duplicate inventory uploads (02a and 02b, one copy each).

**B. Records**

5. Write `DECISIONS.md` covering everything in §2, with date, reason and alternatives rejected.
6. Contrast table: every text/surface pair in both themes, including accent, variances, on-fill text and categorical colours. In dark mode, also check amber and sky against ink.
7. Spacing-pairs table (which element pair gets which `--flow-*` token).
8. **Open decision: reading width.** `--measure` is 60ch, `--measure-doc` is 64ch. Pick one; the default is 60ch.

**C. Audit fixes, folded into the port (from the Impeccable and Swiss-design passes)**

9. No font size below 12px (the Site page has 11px).
10. Tap targets at least 44px on mobile (nav links are 32px).
11. Header at 320px: wordmark + 4 numbered links + EN/DE + theme switch won't fit on one line. Design a mobile pattern, flat, no hamburger.
12. Overflow at narrow widths: audit the 14 no-wrap spots in the Site page; test long German compounds at 320px; use `hyphens: auto` with the right `lang`.
13. Typographic details pass in the markdown build, in both languages:
    - quotes: “ ” and ‘ ’ in EN, „ “ in DE;
    - `…` for three dots, − for minus, – for ranges;
    - non-breaking space between value and unit (`38 s`, `€ 453`, `α = 0.05`, `16 Sep`).
14. Number, date and currency formatting by page language, in charts and tables too. EN: €453,000 · 0.05 · 16 Sep 2026. DE: € 453.000 · 0,05 · 16. Sep. 2026.
15. Global reduced-motion rule (the row-wash transition); `theme-color` meta per theme.
16. Fallback for tools without JavaScript: a static result plus a note, never a blank panel.
17. Make the BKribitz-specific glyphs visible (slashed zero, display cut) in large numbers and the wordmark, so the type doesn't read as stock Geist.

**D. Port to the handover format** (plain HTML + CSS; no inline `style=`, no React for pages)

18. `design-system/`: `tokens.css`, `base.css`, `layout.css`, `components.css`, `charts.css`, `obsidian-snippet.css`.
19. Port the Site patterns first: 01 Shell, 02 Cover, 03 Index, 04 Document, 05 Evidence, 06 Bench. Keep the exact spacing from the specimen.
20. Theme model: `data-theme` on `<html>` that follows the OS setting, plus a toggle override and the pre-paint script. Keep per-element `.dark` for moment blocks.
21. Turn the Site page's reconciliation table into D-entries.

**E. Specimens and templates**

22. Kitchen sink: every authoring element (about 30), each shown three ways (markdown source, rendered page, Obsidian reading view); at 320 / 390 / 768 / 1024 / 1280 / 1440; both themes; EN and DE.
23. Page templates with real content:
    - Home; Work index plus 5 project pages (market intelligence first; structure: question → data → method → result → limitations → decision);
    - About/CV;
    - Impressum, Privacy, Accessibility statement;
    - 404;
    - note, listing and essay templates.

    All in EN and DE.
24. Generated parts:
    - breadcrumbs, document opener, table of contents (active state = ink + accent number), prev/next, numbered "Referenced by" list;
    - empty states, status mark;
    - 1200×630 share card, typographic favicon.
25. Draft treatment: pages on GitHub Pages are public, so drafts show their status in the page, never as hidden previews.
26. First screen designed at real heights (about 790px laptop, 390px phone).

**F. Tools (last)**

27. Up to 5 tools. Each has its maths in a pure module with hand-computed reference cases, keyboard-accessible controls, and a live readout for screen readers. The Confusion Matrix exists in React and needs porting to Preact. The A/B sample-size bench exists on the Site page.

## 5. Still open
- Reading width: 60ch or 64ch (item 8).
- German labels for the footer groups and the status vocabulary.
- Publishing a Gmail address invites spam; an alias would avoid that (owner's choice).
- Time budget: about 7.5 h/week. Suggested order: A and B in one session, then C+D, then the kitchen sink and the 3 most complete project templates, then the rest.

## 6. File map
- **Live specimens:**
  - `Design System v2.dc.html` (core)
  - `Design System v2 - Site.dc.html` (site patterns, real content)
  - `Design System v2 - Charts.dc.html` (needs rebuild)
- **v2 tokens:** `ds-update/tokens/` (colors, fonts, typography, spacing, grid, flow, chart-palettes, ibcs, component-fixes). They load after the base tokens in `_ds/braga-kribitz-design-system-remix-5791f94c-…/tokens/`.
- **Bound design system:** `_ds/…5791f94c…/` (48 components; the bundle has the local loader fix).


## 7. Amendments from the audit (20 Oct 2026)
Record in `DECISIONS.md` as dated amendments; details and reversal paths in `AUDIT.md`.
- **D-009 amended:** the wordmark is **BRAGA**, uppercase, always, everywhere; 800, −0.07em (owner comment).
- **D-016 / D-018 amended:** chart marks clear 3:1 on every surface in both themes. Light: jade #007A66, vermilion #CC3710, ochre #966400 and teal #0A7399 replace amber and sky; dark: magenta #F57AC4, umber #C9986A, vermilion #F57A5A. The label-plus-edge exception is retired; diverging midpoints sit on surface-3.
- **D-023 amended:** five status squares, one design per state (complete ■ · functional ▣ · under-revision ▤ · in-build □ · archived ⊡), label always.
- **D-025 (new):** the accent may be text for the one earned figure per view (5.3:1 light, 6.2:1 dark on the surface, never on dark surface-3); no judgement by colour. CLAUDE.md's "never a text colour" sentence is removed.
- **Adopted:** `ds-update/proposals/` (theme, foundations, shell, doc, print, checks.js, format.js) load on every specimen; items A-1 to A-39 in `AUDIT.md` are fixed except the Charts rebuild (A2), which stays next.
- **§4 item 8 (reading width)** is still open; `doc.css` reads `--measure-doc`, so the flip is one line in `flow.css`.
