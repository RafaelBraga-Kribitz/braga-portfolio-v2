# AUDIT — Braga Kribitz Design System v2 (20 Oct 2026)

**Status: applied.** After the owner's review (comments of 20 Oct 2026) every proposal was adopted into the specimens with his corrections: BRAGA is uppercase everywhere; the accent may be text; each status has its own square; chart marks were re-derived to clear 3:1; the figure's winning bar is in the accent; both Button variants share one height; the Charts page uses squares, not circles. The Charts rebuild (HANDOFF A2) remains.

Companion record for `Design System v2 - Audit.dc.html`. Read against: `uploads/CLAUDE.md` (authority), `01-do-not-repeat`, `03-architecture-for-design-agent`, `04-foundation-quality-bar`, `04-rules-inheritance`, `HANDOFF.md`. Everything here is reversible: proposals are files under `ds-update/proposals/`; in-place fixes have backups in `_parked/pre-audit/`.

## 1. Method

Three specimen pages and nine token files were read line by line and compared with the written rules. Where a claim could be measured, it was measured: contrast from the token hexes, rendered font sizes, target boxes, the behaviour of compiled components. The audit page also carries twelve **live gates** (`ds-update/proposals/checks.js`) that run on the rendered DOM of any specimen at 390 / 768 / 1280 — a direct answer to the attempt-1 lesson that documented gates never fired.

Classes: **Fail** breaks a stated rule or a WCAG criterion · **Drift** contradicts a settled decision · **Missing** is a plan item with no design · **Polish** is finish.

## 2. Findings (39)

Answers below are as first proposed; the live ledger on the Audit page carries the applied state. Added after review: A-38 chart marks below 3:1 on some surfaces (applied, re-derived) · A-39 Button variants differ in height (applied, 28px).

| § | Class | Where | Finding | Answer |
|---|---|---|---|---|
| A-01 | Fail | listing.css, Core, Site, Charts | `--mid` (2.1:1 on light) set as text: listing heads, codes, dimmed meta, SVG axis labels, module numbers. D-007. | P-02; applied in Core/Site SVG + numbers |
| A-02 | Fail | bundle controls | SegmentedControl border, Toggle track/knob, Range track use `--mid`; WCAG 1.4.11 needs 3:1 | P-02 (`--edge`) |
| A-03 | Fail | bundle controls | Toggle 40×20, range input 16px tall; 04-F asks 24×24 for every control | P-02 |
| A-04 | Fail | Site 06, Core 06 | SVG tick labels 11px inside a scaling viewBox (≈7px at 390); floor is 12px; chart text belongs in CSS px | applied 12px; structural fix in the chart rebuild |
| A-05 | Fail | all pages | prose links have no affordance (`text-decoration: none`, hover colour only) — WCAG 1.4.1 | P-02 |
| A-06 | Fail | all pages | `a:hover { color: accent }` — accent as text; guide hover = wash + arrow shift | P-02 |
| A-07 | Fail | all pages | no `prefers-reduced-motion` rule (HANDOFF 15) | P-02 |
| A-08 | Fail | header, footer | header links 32px, footer links ≈21px; HANDOFF 10 wants 44 on mobile | P-02, P-04 |
| A-09 | Drift | Site 04/06, Core 02/06 | accent used as text while CLAUDE.md said "never a text colour" | **owner decision D-025: the accent may be text**; CLAUDE.md amended |
| A-10 | Drift | Site 06 | accent carries a judgement (feasible = accent); highlight carries none | P-03 |
| A-11 | Drift | Site 00 row 9 | ToC active cue (accent number) ≠ S-22 you-are-here cue (code→ink + 7px square); one cue | P-03 |
| A-12 | Drift | Core 03 | swatch hexes are v1 values typed by hand; accent-02 still shown (D-005, D-006) | applied: live tokens |
| A-13 | Drift | Core 01 | "1280px maximum"; D-010 = 1320 | applied |
| A-14 | Drift | Site 01 | "BRAGA in the 900 cut" (800 is right) | applied; **owner: BRAGA uppercase everywhere, D-009 amended** — the audit's title-case change was reverted |
| A-15 | Drift | all headers | "RAFAEL BRAGA KRIBITZ"; the name is title case with hyphen | applied |
| A-16 | Drift | Core 02 | display specimen `font-weight: 500` override (D-008) | applied |
| A-17 | Drift | Site 03 | status vocabulary open: six labels, two marks | applied: five-state enum, **one square per state (owner)** |
| A-18 | Missing | theme | no page-level model: D-020 asks `data-theme` on `<html>`, OS default, pre-paint script, theme-color | P-01 |
| A-19 | Polish | all pages | `color-scheme: light dark` follows the OS while the page stays light | P-01 |
| A-20 | Missing | shell | header at 320 undesigned; note 01-04 promised a MENU disclosure; HANDOFF 11: no hamburger; DE labels need 331px | P-04 |
| A-21 | Missing | shell | no skip link, no scroll-padding (2.4.11) | P-02, P-04 |
| A-22 | Polish | Site 01 | theme square drawn with a gradient | P-04 (clip-path) |
| A-23 | Missing | records | contrast matrix (HANDOFF B6) | P-07, computed live |
| A-24 | Missing | records | spacing-pairs table (HANDOFF B7) | P-08, measured live |
| A-25 | Missing | document | markdown output not designed in production form (03-arch §2–§6) | P-08 |
| A-26 | Missing | type | OpenType features asserted, not proven (HANDOFF 17) | P-06 |
| A-27 | Missing | format | number/date/currency by language (HANDOFF 13–14) | P-09 |
| A-28 | Missing | share | share card + favicon (HANDOFF 24, P-21) | P-10 |
| A-29 | Missing | print | print stylesheet (03-arch §12) | P-11 |
| A-30 | Polish | chart tokens | `--chart-div-7`/`--chart-two-7` #EBEBEB at 1.05:1 on the light surface; seq-9 likewise | chart rebuild |
| A-31 | Polish | Charts page | draft-3 leftovers: vermilion/#5B7FFF PAL/HEX, 10px labels, `border-radius: 50%`, "Roboto Mono 11", notation tweak | chart rebuild (HANDOFF A2) |
| A-32 | Drift | Charts nav | link to a parked page | applied |
| A-33 | Polish | Core 03 | swatch rings via `box-shadow` | applied: `outline` |
| A-34 | Polish | Site 06 | fourteen `nowrap` + ellipsis spots clip at 320 (HANDOFF 12) | listed |
| A-35 | Polish | Site 00 | `displayWeight` tweak offers 300–500 against D-008 | listed |
| A-36 | Polish | numbering | two separators ("01 — GRID" vs "Fig. 04-01 · …") | listed (O-04 covers dashes) |
| A-37 | Fail | bundle Button | label 11px, border `--mid`, inline `outline: none` (no focus ring), accent as text when active, hard-coded 120ms | P-02 overrides; `Button.jsx` source fix |

## 3. Proposals (11)

| § | Proposal | Mechanism | Revert |
|---|---|---|---|
| P-01 | Theme model | `proposals/theme.css` + 158-byte pre-paint script + theme-color metas | delete file |
| P-02 | Foundations (10 rules) | `proposals/foundations.css` | delete file, or any numbered block |
| P-03 | The accent is a mark | markup rule; `mark::before` in doc.css; before/after on the page | none needed |
| P-04 | Shell at 320/390/768 | `proposals/shell.css` (container query, no hamburger, compact < 360) | delete file |
| P-05 | Glyph inventory, status enum, DE chrome (draft) | tables; decisions O-01, O-06 | decline |
| P-06 | Type proofs | `checks.js typeProofs()` | n/a |
| P-07 | Contrast matrix, computed from tokens | `checks.js readTokens() matrix()` | n/a |
| P-08 | The rendered document (19 items) + measured flow pairs | `proposals/doc.css` + `measurePairs()` | delete file |
| P-09 | Figures by language | `proposals/format.js` + 10 reference cases | delete file |
| P-10 | Share card 1200×630 + favicon | template on the page | n/a |
| P-11 | Print | `proposals/print.css` | delete file |

### The gates (checks.js)
G-01 type floor 12px (SVG text after viewBox scaling) · G-02 text contrast 4.5:1 / 3:1 · G-03 mid never text · G-04 accent text passes 4.5:1 where it sits · G-05 targets ≥ 24 (44 below 768) · G-06 no horizontal overflow (content inside an overflow-x wrapper is allowed) · G-07 square corners · G-08 no shadow/gradient · G-09 heading order · G-10 landmarks + skip link first · G-11 reduced-motion rule present · G-12 project fonts loaded · G-13 no third-party requests (stylesheets, scripts, images, frames, @import, @font-face). Elements inside `[data-gate-skip]` (scaled previews) are excluded and say so.

## 8. Added on request (20 Oct 2026, second session)

- **Dashboards restored.** `Dashboards 1–3` and the `Dash*` modules are back at the root on the v2 tokens (paths, theme/foundations/print, `--mid` text → `--ink-3`, 12px floor, retired notation switches removed, skip link, main landmark). Their colours are tokens, so they carry the re-derived palette. Charts and Core link to them again.
- **Templates page** (`Design System v2 - Templates.dc.html`): 404 (EN, DE copy), Impressum + Offenlegung, Datenschutzerklärung, Barrierefreiheitserklärung (German drafts; not legal advice), code theme (five token classes, ink and weight only), math (KaTeX at build → HTML + MathML, numbered from the code, fonts self-hosted), diagram (Mermaid at build → SVG, theme mapped to tokens), CV (A4 specimen).
- **CV in LaTeX**: `ds-update/cv/braga-cv.tex` + README; experience/education/languages are fields.
- **D-035 Code blocks (owner).** Always a dark panel (#202226 on light pages, #26282C on dark), six-token palette from the dark set (ultramarine, amber, jade, sky, ink-3 italic, ink-2), a copy button and a wrap toggle, wrap on by default. `code.js` (~1 KB, progressive) is the one script a content page with code carries — a recorded exception to the zero-JS rule; the block is complete without it.
- **Third-party rule** (from the pasted recipe, translated from Next.js to the Astro target): KaTeX via `remark-math` + `rehype-katex` (`htmlAndMathml`), Mermaid via `rehype-mermaid` at build, KaTeX CSS and fonts under `/fonts/katex/`, a Playwright guard with one math and one diagram page in its list, and gate G-13 here in the design phase. Steps 5–6 of the recipe (host DPA / EU host; the privacy notice naming host and log retention) are reflected in the Datenschutz draft and listed as open.


## 4. Applied in place (backups in `_parked/pre-audit/`, token files in `_parked/pre-audit/tokens/`)

Second round (after review): proposals load on every specimen (theme, foundations, print; shell on Site); the Site shell is rebuilt on the header pattern with a skip link and `main` landmark; Site statuses use the five squares; the Duration verdict reads as words; chart-palettes.css / ibcs.css / theme.css carry the re-derived marks; `uploads/CLAUDE.md` accent, glyph and casing lines amended; the `displayWeight` tweak is removed from all pages; readouts wrap; section labels use the middle dot; the Charts page has squares, 12px labels, ink-3 text and corrected copy.

Core (`Design System v2.dc.html`): swatches read live tokens, accent-02 row removed, accent gets its own row with both values and the live ratio · "1320px maximum" · display specimen weight override removed · SVG text 11→12px · `fill: var(--mid)` → `--ink-3` · module numbers `--mid` → `--ink-3` · swatch rings `box-shadow` → `outline` · dead `data-accent="emerald"` removed · header name title case.

Site (`Design System v2 - Site.dc.html`): header name title case · wordmark "Braga" 800 at −0.04em (header + footer) · note 01-01 and 01-04 rewritten · SVG text 11→12px · inactive contents numbers `--mid` → `--ink-3`.

Charts (`Design System v2 - Charts.dc.html`): header name title case · "Dashboards →" link removed. Everything else waits for the rebuild (HANDOFF A2).

## 5. Decisions proposed (append to DECISIONS.md once accepted)

- **D-024 Theme model.** `data-theme` on the root; OS default; stored override applied by a 158-byte pre-paint script; `color-scheme` follows the page; all dark values in one file; `.dark` per element stays for moment blocks.
- **D-009a Wordmark amended (owner).** BRAGA is always uppercase, in every case, everywhere; 800, −0.07em.
- **D-025 The accent may be text (owner).** The one earned figure per view is set in the accent (5.3:1 light, 6.2:1 dark on the surface), as is the active code; the 7px square stays the mark beside a name. Siblings ink-2. No judgement by colour. Never on the raised dark surface (3.2:1).
- **D-026 Focus is an ink ring.** 2px outline, 2px offset, every control, both themes.
- **D-027 `--edge` for control boundaries.** ink-2 on light (5.4:1), ink-3 on dark (6.1:1); `--mid` stays decorative. Switch 44×24, range 24px tall.
- **D-028 Header below 768.** Two rows, no hamburger; 44px door strip; compact (codes + current label) below 360.
- **D-029 Status enum and squares (owner).** complete ■ · functional ▣ · under-revision ▤ · in-build □ · archived ⊡; one 7px square per state, label always.
- **D-030 Glyph inventory.** → ↗ ← § · ▲ + − – … and the two 7px squares; written once.
- **D-031 Figures by language.** NBSP inside figures, real minus, en dash, en-GB / de-AT separators, Jänner.
- **D-032 Links in text are underlined.** Hairline underline, offset; hover to ink; block links exempt; hover never spends the accent on every link.
- **D-033 Chart marks clear 3:1 on every surface (owner).** Light marks at relative luminance ≤ 0.175, dark ≥ 0.33; amber and sky replaced by ochre #966400 and teal #0A7399 on light; jade #007A66, vermilion #CC3710; dark magenta #F57AC4, umber #C9986A, vermilion #F57A5A. Amends D-016, D-018; the label-plus-edge exception is retired.
- **D-034 One separator.** The middle dot: "01 · GRID", "Fig. 04-01 · …".

## 6. Open — Rafael decides

- **O-01** The five-state enum is applied on the Site specimen; say so if the six labels should return.
- **O-02** Measure 60ch or 64ch. Recommended: one token, 60ch; `doc.css` reads `--measure-doc`, so the flip is one line in `flow.css`.
- **O-03** English dashes: spaced en dash (British) or unspaced em dash. Recommended: spaced en dash.
- **O-04** Footer group "Others" → "Notices" / DE "Hinweise"? D-013 names it; your call.
- **O-05** German chrome labels (P-05) are agent drafts; nothing ships until approved.
- **O-06** Charts rebuild (HANDOFF A2) on the re-derived palette; re-run the vision check on the new categorical set.

## 7. Not done, deliberately

The Charts page rebuild (HANDOFF A2) and the component-bundle port to class-based CSS (HANDOFF D) are larger than one pass; the surface defects on the Charts page are fixed, the chart dictionary and its data arrays are not. Sidenotes on wide screens, gallery, columns, video facade, math and mermaid are the next vocabulary items for `doc.css`.
