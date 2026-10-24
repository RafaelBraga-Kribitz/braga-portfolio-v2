# BUILD BRIEF — Braga portfolio v2 (Astro static site)

This file is the working brief for every agent on this build. Read it fully. The
authority order is: the owner's decisions recorded in `handoff/HANDOFF.md` §2 and §7
and `handoff/AUDIT.md` > this brief > the specimens in `handoff/specimens/`.

## 1. What is being built

The second attempt at Rafael Braga-Kribitz's portfolio, built from the v2 design
system handoff in `handoff/`. A static Astro 7 site: plain HTML + CSS, two built
route trees (`/en/`, `/de/`), no JavaScript on content pages except (a) the 158-byte
pre-paint theme script, (b) the inline shell script (theme toggle, the split contact
button, the contents rail's active section), (c) `code.js` on pages with code
blocks. The two tools are Preact islands with a server-rendered static fallback.

Stack (already installed, do not run `npm install`): astro 7.4.1, @astrojs/preact,
preact 11, @astrojs/mdx, @astrojs/rss, remark-math, rehype-katex, katex,
@playwright/test 1.61 (Chromium binary: `/opt/pw-browsers/chromium`; never run
`playwright install`), @axe-core/playwright, typescript 5.

Project root: `/home/user/braga-portfolio-v2`. Everything under `handoff/` is read-only
source material: never edit it.

## 2. Source material (paths relative to the project root)

- `handoff/README.md`, `handoff/HANDOFF.md`, `handoff/AUDIT.md` — the decisions.
- `handoff/_ds/tokens/*.css` — the v1 base tokens (load first); `handoff/_ds/readme.md` — the v1 brand book (voice, rules).
- `handoff/ds-update/tokens/*.css` — the v2 token overrides (load second): colors, fonts, typography, spacing, grid, flow, chart-palettes, ibcs, component-fixes.
- `handoff/ds-update/proposals/` — adopted: theme.css, foundations.css, shell.css, doc.css, print.css, format.js, code.js, checks.js (the gates).
- `handoff/specimens/Design System v2 - Site.dc.html` — the six site patterns with real content: 01 Shell, 02 Cover, 03 Index, 04 Document, 05 Evidence, 06 Bench. **The pattern source of truth.** Its `<script data-dc-script>` block holds the data (projects, metrics, figures, footer groups, status vocabulary, the A/B maths).
- `handoff/specimens/Design System v2 - Templates.dc.html` — 404 (EN + DE line), Impressum, Datenschutz, Barrierefreiheit (German drafts), the code block, math, diagram, CV.
- `handoff/specimens/Design System v2.dc.html` — core tokens and components; `… - Charts.dc.html` (needs rebuild; palette there is stale, use the token files); `… - Audit.dc.html`.
- `handoff/source-content/content/` — the owner's real content from the Next.js site: `projects/*.mdx` (7 projects), `data/about.yaml`, `data/home.yaml`, `data/profile.yaml`, `data/tools.yaml`, `writing/blog/ai-prospecting-vendor-3x-lift.mdx` (the one published essay). `handoff/source-content/chrome.ts` — the existing EN/DE chrome strings.
- `public/fonts/BKribitz-*.woff2`, `public/fonts/BKribitzMono-*.woff2` — the ten web faces (sans 400, 400 italic, 500, 600, 700, 800, 900; mono 400, 500, 700). Licence files in `public/fonts/licenses/`.
- `public/fonts/katex/katex.min.css` + `public/fonts/katex/fonts/` — KaTeX, self-hosted.

## 3. Settled decisions (summary; the full text is in handoff/HANDOFF.md)

- Role: **Marketing Data Analyst**. Wordmark **BRAGA**, uppercase everywhere, weight 800, letter-spacing −0.07em. The name "Rafael Braga-Kribitz" is title case with the hyphen.
- Accent: ultramarine, `--accent-01` = #2F4BE0 light / #7C93FF dark. **One accent per section** (owner, 22 Oct 2026; replaces D-025's one per view): each section — the cover, each `.section` of an index page, a document's opener and metric strip, each h2 section of a document, a figure, a bench, the end of a document — spends the accent on at most one element, the one the reader should see first there: its earned figure, or its primary action (`.cta`, accent fill with `--on-accent` text). Gate G-15 enforces it. `--accent-02` is retired. Blue "moment" blocks use the `.dark` inversion.
- Neutrals (light): surface #E4E6EA, surface-2 #DCDEE2, surface-3 #D4D6DA, ink #26282C, ink-2 = ink-3 #5A5C61, mid #9EA0A5 (hairlines only, never text), rule #C2C4CA. Dark: #191A1D / #2C2D30 / #484A4D / ink #F3F5F9 / ink-2 #CED0D4 / ink-3 #97999D / mid #7E8084 / rule #393A3D.
- Headings: weight 700 (`--w-display`); 900 is retired. No font size below 12px anywhere (SVG text included). `--t-mono-sm` 12px, `--t-mono` 13px.
- Spacing: 8px base; flow tokens related 8 / element 16 / block 32 / lead 48 / group 64 / section 96 (64 below 768). `--rule-open: 1px solid var(--ink)` opens a block. Page max 1320px, gutter 16 (outer) / 32 at md+ per spacing.css.
- Reading width: **60ch** (`--measure` and `--measure-doc` both 60ch; open item O-02 resolved to the recommended default — record as an assumption).
- Corners 0, no shadows, no gradients, no blur, with one exception: the header is **sticky with a glass background** (owner, 23 Oct 2026): a 78% surface tint with `backdrop-filter: blur(18px) saturate(1.4)` and its hairline; opaque under `prefers-reduced-transparency` or without backdrop-filter support. Gate G-08 allows the blur on `header.shell` only. `--shell-h` (80px; 101px below 768) offsets every sticky element and `scroll-padding-top`. Motion: only the row-wash and arrow shift at `--dur` 140ms `cubic-bezier(.2,0,0,1)`, 0 under reduced motion.
- Status marks (D-029): five 7px squares, one per state: complete ■ filled · functional ▣ filled centre in outline · under-revision ▤ half filled · in-build □ outline · archived ⊡ dotted outline. Always with a text label.
- Glyph inventory (D-030): → ↗ ← § · ▲ + − – … and the squares. No icons, no icon font, no emoji, no SVG files (inline SVG for charts is fine).
- Separator (D-034): the middle dot. "01 · Work", "Fig. 03-01 · …".
- Links in text are underlined with a hairline (D-032); hover moves the underline to ink; block links carry no underline; the trailing arrow turns accent on row hover.
- Focus: 2px ink outline, 2px offset (D-026). Controls: boundary `--edge` (ink-2 light, ink-3 dark), switch 44×24, range 24px tall (D-027). Targets ≥ 24px, ≥ 44px below 768, except the footer's links (32px below 768: owner, 23 Oct 2026, the space between them no larger than the text) and a document's tag row (24px at every width, for the same reason).
- Header below 768 (D-028): two rows, no hamburger; 44px door strip; compact (codes + current label) below 360 for German.
- Theme (D-024): `data-theme` on `<html>`; OS default when no attribute; stored override `bk-theme` applied by the pre-paint script (first in head); `color-scheme` follows; `<meta name="theme-color">` per theme; `.dark` per element stays for moment blocks.
- Languages (D-011): EN + DE as two built route trees joined by plain links, `hreflang` alternates and `lang` on every page. British English. Legal pages in German (primary), with an English version. German chrome and German long-form are **agent drafts for owner approval**: mark every DE page with the status mark "in-build" + label "Entwurf · Freigabe ausstehend" in its meta row until approved.
- Footer (D-013): four groups, in the owner's order of 23 Oct 2026 — Site / Index / Others (Sitemap, RSS, Impressum, Privacy, Accessibility) / Elsewhere. DE drafts: Seite / Index / Sonstiges / Anderswo.
- Impressum (D-014): Rafael Braga-Kribitz · 8054 Seiersberg, Styria, Austria · rafaelbragakribitz@gmail.com · non-commercial. No street address. Not legal advice.
- Charts: IBCS only (D-015). Roles: ultramarine = highlight; jade #007A66 (dark #00C69F) = good variance; vermilion #CC3710 (dark #F57A5A) = bad variance, always with ▲; ochre #966400 = other side of a neutral split; teal #0A7399 replaces sky on light. Colour lives in marks, never in type: every chart label is `--ink` or `--ink-2`.
- Numbers and dates by page language (`src/lib/format.ts`, ported from `handoff/ds-update/proposals/format.js`): EN €453,000 · 0.05 · 16 Sep 2026 · 35% · 38 s; DE € 453.000 · 0,05 · 16. Sep. 2026 · 35 % · 38 s; NBSP inside figures; real minus; en dash for ranges (spaced en dash as the English dash, O-03); one ellipsis character; quotes “ ” in EN, „ “ in DE.
- Email: the Gmail address is used as given (open item 3 is the owner's choice; note it in the report).
- Voice: declarative, factual, measured. First person singular only in genuine prose; never "we", never marketing "you". Numbers carry the argument. No hype, no exclamation marks. Status is honest.

## 4. Site map

Root `/` is a static redirect page to `/en/`. Every page exists under both `/en/` and `/de/` with the same path except the German legal slugs.

| Page | EN route | DE route | Pattern |
|---|---|---|---|
| Home | `/en/` | `/de/` | 02 Cover + 03 Index sections (01 Work listing of 5, 02 Writing, 03 Tools, 04 About) |
| Work index | `/en/work/` | `/de/work/` | 03 Index: section heading + listing (the status vocabulary block was dropped in the UX pass) |
| Project ×5 | `/en/work/<slug>/` | `/de/work/<slug>/` | 04 Document: opener, metric strip, contents rail on 3, doc on 9, evidence figures (05), end bar |
| About / CV | `/en/about/` | `/de/about/` | 04 Document variant: opener, spec callout, skills, CV table, contact; "Download CV" link only if a PDF exists (none yet: omit the link) |
| Writing index | `/en/writing/` | `/de/writing/` | 03 Index listing (essays, notes) |
| Essay | `/en/writing/ai-prospecting-vendor-3x-lift/` | `/de/writing/…/` | 04 Document |
| Tools index | `/en/tools/` | `/de/tools/` | 03 Index listing |
| Tool: Confusion matrix | `/en/tools/confusion-matrix/` | `/de/tools/confusion-matrix/` | 06 Bench |
| Tool: A/B sample size | `/en/tools/ab-sample-size/` | `/de/tools/ab-sample-size/` | 06 Bench (the specimen's bench, exactly) |
| Impressum | `/en/impressum/` | `/de/impressum/` | utility document (Templates 02) |
| Privacy | `/en/privacy/` | `/de/datenschutz/` | utility document |
| Accessibility | `/en/accessibility/` | `/de/barrierefreiheit/` | utility document |
| Kitchen sink (noindex) | `/en/system/` | `/de/system/` | every authoring element, both themes |
| 404 | `/404.html` (EN with the DE line) | — | Templates 01 |
| Sitemap, RSS, robots | `/sitemap.xml`, `/feed.xml`, `/robots.txt` | — | — |

Project slugs, codes and statuses (the Site specimen's order; dates from the source MDX):

| Code | Slug | Title | Domain | Status |
|---|---|---|---|---|
| 01-01 | `austria-data-job-market-intelligence` | Austria data-job market intelligence | Labour market | complete |
| 01-02 | `decision-analytics-reconstruction` | Decision analytics reconstruction | Decision science | functional |
| 01-03 | `austrian-mmm-budget-optimizer` | Austrian MMM and budget optimiser | Marketing | under-revision |
| 01-04 | `energy-procurement-risk-analyzer` | Energy procurement risk analyser | Energy | in-build |
| 01-05 | `warehouse-humanoid-tco` | Warehouse humanoid TCO | Operations | complete |

Order (UX pass, 22 Oct 2026, serial position): complete projects open and close the list; the
codes were renumbered to match (figure labels and equation numbers follow the code).

Header doors: 01 Work · 02 Writing · 03 Tools · 04 About (DE: Arbeit · Schreiben · Werkzeuge · Über; owner, 23 Oct 2026: About moved last). Tool codes: 03-01 Confusion matrix, 03-02 A/B sample size. Writing codes: 02-01 the essay.

## 5. Class contract (names come from the specimens and proposals; invent nothing)

Layout: `.grid-container`, `.page-grid`, `.grid`, `.col-1 … .col-12`, `.col-start-N`, `.section`, `.rule-t`, `.rule-strong`, `.vrule`, `.skip`.
Type: `.display`, `.label`, `.index`, `.prose`.
Shell: `.shell`, `.shell-bar`, `.shell-mark`, `.shell-doors`, `.door`, `.door-code`, `.door-label`, `.shell-cluster`, `.shell-lang`, `.shell-theme`.
Listing: `.listing`, `.listing-head`, `.listing-row`, `.lr-index`, `.lr-title`, `.lr-title-main`, `.lr-title-sub`, `.lr-meta`, `.lr-trail`, `.lr-code`, `.lr-mono`, `.lr-dim`, `.lr-year`, `.lr-arrow`.
Status: `.status[data-state="complete|functional|under-revision|in-build|archived"]`.
Document: `article.doc`, `.doc-opener`, `.doc-trail`, `.doc-lead`, `.doc-meta`, `.doc-end`, `.glyph`, `.table-scroll`, `figure.fig`, `.fig-label`, `.fig-title`, `.fig-source`, `.code`, `.code-bar`, `.code-copy`, `.code-wrap`, `.math`, `.eq-no`, `.footnotes`, `.callout[data-callout="note|aside|warning|tool|summary|definition|quote|spec|metrics|faq|bookmark|cta"]`, `.callout-title`, `.callout-content`, `.cta`.
Site patterns (new, from the Site specimen; define them in layout.css/components.css): `.cover`, `.cover-rail`, `.cover-body`, `.section-heading` (kicker 3 / claim 7 / forward link 2), `.metric-strip`, `.toc`, `.evidence` (figure with bars: `.ev-bars`, `.ev-bar`, `.ev-track`, `.ev-fill`, `.ev-mid`), `.bench`, `.bench-head`, `.bench-controls`, `.bench-output`, `.bench-verdict`, `.bench-kpis`, `.bench-limit`, `.segmented`, `.range`, `.button`.
Sub-classes of these patterns (footer, cover, section heading, opener, contents, metric strip, evidence, 404 grid `.fig-matrix*`, `.link-line`) are listed in `design-system/README.md` ("Sub-classes the patterns use"); use those names, do not coin others.

## 6. Rules every agent enforces

1. **No inline `style=` attributes** anywhere in `src/` (a lint script fails the build). Dynamic values go through a CSS custom property set via `style={{'--x': …}}` only inside the Preact tools, never in content pages. Width of an evidence bar is a custom property on the element (`style="--w: 40%"` is the ONE permitted inline form, and only for `.ev-fill`/`.ev-mid` and chart marks).
2. **Tokens only.** No new hex values in `src/`; every colour is a `var(--…)` from `design-system/tokens.css`.
3. **No icons, no emoji, no SVG files, no images**, except the owner's portrait on the About page (owner, 23 Oct 2026: `src/assets/portrait.{jpg,jpeg,png,webp}`, 4:5, shown as `figure.portrait`, black and white, in colour under the pointer (owner, 24 Oct 2026); an empty labelled frame until the file exists). Glyphs from D-030 only. Documents may embed images, video, audio and files from the vault's `Attachments/` (owner, 23 Oct 2026; §6b), drawn in `figure.media`; the chrome stays imageless.
4. **No font size below 12px.** Mono labels are `--t-mono-sm` (12px) at the smallest.
5. **No JavaScript on content pages** beyond the three allowed scripts. Tools are Preact islands (`client:load`) that render their default scenario server-side so the page is complete without JS, plus a `.callout[data-callout="tool"]` note inside `<noscript>`.
6. **Every page** has: `<html lang>`, `data-theme` handling, `<link rel="alternate" hreflang>` for en, de and x-default (a note written in one language only declares its own language and x-default; §6b), `<meta name="theme-color">` ×2, the skip link as the first focusable element, one `<main id="main">`, one `<h1>`, the shell and the footer, `<title>` and `<meta name="description">`.
7. **Numbers in copy** use NBSP between value and unit, real minus, en dash ranges, the language's separators. Use `src/lib/format.ts`.
8. British English. Dates like "16 Sep 2026" (EN) and "16. Sep. 2026" (DE).
9. Keep the authored copy from `handoff/source-content/` where it exists; restructure, do not invent facts or numbers. Where the handoff provides copy (Site specimen, Templates), use it verbatim.
10. Keep the specimen's spacing exactly (the Site specimen's inline styles tell you the values: translate them into classes with the same numbers).

## 6a. UX rules (owner, 22 Oct 2026)

From the UX review against the twenty interface laws (Hick, Fitts, Jakob, proximity, Miller,
Doherty, Von Restorff, serial position, peak-end, …). The theme toggle stays as it is for now.

1. **One accent per section** (§3, gate G-15): the section's earned figure or its primary action, never both.
2. **One primary action per section**, `.cta` in the accent. The contact button (`src/components/ContactActions.astro`; owner, 23 Oct 2026): an accent button reading as the email address that, on hover or keyboard focus, splits into **Copy** (left, ink highlight) and **Open** (right, accent highlight); on a touch screen the first tap on the address splits it in place and a tap elsewhere closes it (owner, 24 Oct 2026: not press-and-hold, which the phone keeps for its own menu). The address is not in the HTML: two reversed halves drawn by CSS (not selectable, not copyable by hand), reassembled by the shell script only on click (`src/lib/contact.mjs`). Used on the cover, the home 04 About block, the close of every project and (as a mailto cta callout) the About contact section; the 404 report link is assembled the same way. The legal pages keep the plain address (the Impressum must show it, ECG §5).
3. **Contact is one step away everywhere**: "Contact" in the header cluster and the footer leads to the About page's contact section, not to a mail client.
4. **Essentials first**: below 768 the cover's body (name, role, sentence, action) comes before its rail; a document's contents collapse into a closed `<details>` under the metric strip; the 404 offers the way back before the joke.
5. **Fewer choices, less noise**: no year column in listings, no listing head rows on the home page, no status vocabulary block, no plain labels beside the cover's action, no "Edition" row.
6. **Links look like links**: links in the trail, the meta row and the header carry the hairline underline (D-032), where they sit among mono labels of the same style.
7. **Keep the reader oriented**: the header is sticky; the contents rail is sticky from 768 up and marks the section in view (the shell script sets `aria-current="location"` on scroll); documents show their reading time; a project ends on one question and one action, with the repository as a quiet link and the next project only in the end bar.
8. **Benches answer at once and accept what is typed**: below 768 the verdict leads and stays in view while the controls scroll; every readout is an editable field (`src/lib/tools/parse.mjs` accepts either decimal mark, grouping, units, "k"); an unreadable entry stays in the field with a note on how to fix it; out-of-range entries are kept within bounds and say so; the inputs live in the URL (`src/lib/tools/url-state.mjs`); the slider thumb is 20px.

10. **Keyboard navigation** (owner, 23 Oct 2026): single-key shortcuts in the inline shell script, mirroring the site's numbering: `0` home, `1`–`4` the doors, `j` / `k` next / previous section (h2s in a document, sections elsewhere; the section takes focus without a ring), `n` / `p` next / previous project or essay (the head's `rel="next"` / `rel="prev"`), `u` up one level, `l` other language, `t` theme, `?` the panel listing them (`dialog.keys`, Esc closes it; also "Keyboard shortcuts" in the footer, which leads to the accessibility statement's Keyboard section without JavaScript). Ignored while typing in a field or with Cmd, Ctrl or Alt held. Documented in the accessibility statement (EN and DE).
9. **Hierarchy by indentation** (owner, 23 Oct 2026): a section heading's number stands on column 1 and its text (word, claim) starts on column 2; the listing rows under it are the second level, code on columns 2–3 and title from column 4.
11. **Rules open, never close** (owner, 24 Oct 2026; gate G-16). A rule opens the block that follows it; no block closes with a rule of its own. A list, a table, a callout, the metric strip and the readouts end in white space, and the next block's opening rule (a section heading, an h2, the footer, the document's close) does the separating, so two rules never face each other across empty space. Inside the page that rule takes the dropped one's place: no space is added between the two blocks, so the block's own padding is the whole distance from its last line to the next rule; at the top and the foot of the page the page's spacing stays. Inside a block a rule still separates items (rows, the head of a table from its body). A split rule, cells ruled one by one with a gap between (a spec list), underlines its row, the last one too, and may stand over empty space. Directly under the shell, the shell's hairline opens the page: the first block carries no rule of its own (the cover, an index page's first section heading).
12. **Narrow widths** (owner, 24 Oct 2026): below 327 the header keeps one row (wordmark, language toggle, theme square): the contact link leaves the header (the footer keeps it) and the language link shows only the current code, EN on an English page and DE on its twin, as a 44px toggle. The footer colophon is name and place only (no status line, no year); below 438 the wordmark (scaled down) and the colophon keep one row, and the colophon breaks only between phrases. Below 230 a listing row's code stands on its own line with the text under it at full width.

## 6b. The vault (owner, 23 Oct 2026)

The content is an Obsidian vault, `vault/`, in this repository. Open that folder in Obsidian; push, and the site rebuilds.

1. **Site folders**: `Projects/`, `Essays/`, `Notes/`, `Pages/`, `Legal/`, each with `en/` and `de/`. The German twin has the same file name or the same `slug`. Folders starting with `_` (`_templates/`, `_guide/`) and `Attachments/` are never pages.
2. **A note is public only with `publish: true`** (and not `draft: true` or `#draft`). A future `date` schedules it: the Pages workflow builds daily at 04:43 UTC.
3. **The title is the first `# heading`**; it becomes the page's h1 and is removed from the body. Headings below are clamped to h2–h6 without skipping a level.
4. **Status is a tag**: `#status/complete`, `functional`, `under-revision`, `in-build`, `archived` (property `tags` or inline).
5. **Obsidian syntax on the site** (`src/lib/remark/obsidian.mjs`, `diagrams.mjs`): `[[wikilinks]]` (unpublished targets become plain text), `![[embeds]]` of images (several in one paragraph make a gallery), video, audio, files and notes (a bookmark card), `#tags` (a tag page each, `/<lang>/tags/<tag>/`), `%% comments %%`, `^block-ids`, inline `key:: value` fields, task lists with `[ ] [x] [/] [-]` (squares with a spoken state), callouts, tables, lists, footnotes, maths, code, Mermaid (drawn at build into SVG in the site's tokens; cached in `.cache/mermaid/`, commit it) and Dataview queries (a DQL subset run at build, `src/lib/vault/dataview.mjs`). A YouTube or Vimeo link alone on a line becomes a card that links out (no third-party frames).
6. **Ghost features**: cover (`cover`, `cover_alt`, also the share image), `featured`, `seo_title`, `seo_description`, `canonical`, `aliases`, tag pages, and "Related" under every project and piece of writing (TF-IDF over the published notes plus tags and links, `src/lib/vault/related.mjs`; Smart Connections' embeddings are machine-local and cannot be used at build).
7. **Only attachments a published note uses** are copied to `dist/media/` (`src/integrations/vault-media.mjs`).
8. **`npm run vault:check`** reports broken links and embeds, missing twins, bad properties and queries with file:line; it is part of `npm run verify`. `npm run vault:sync` copies the design-system CSS into the vault's Obsidian snippets.

## 7. Verification

- `npm run build` must pass. Parallel agents build into their own folder: `npx astro build --outDir /tmp/claude-0/-home-user/f1008afd-cfe9-512b-95a9-f11714fce75e/scratchpad/builds/<your-label>` — never the shared `dist/`.
- `npm run lint:style` (no inline style), `npm run test:unit` (format cases, tool maths reference cases), `npm run test:gates` (Playwright: the thirteen gates from `handoff/ds-update/proposals/checks.js` at 320 / 390 / 768 / 1024 / 1280 / 1440, both themes, every page in the build; plus axe WCAG 2 AA, internal links, hreflang pairs, no horizontal overflow).

## 8. Ownership map (foundation phase; agents write only their files)

| Agent | Writes | Verifies with |
|---|---|---|
| A design-system | `design-system/{tokens,base,layout,components,charts,print,obsidian-snippet}.css`, `design-system/README.md`, `src/styles/global.css` (imports in order) | a node script that checks: no hex outside tokens.css, no font-size below 12px, every contract class present, contrast ratios of the token pairs |
| B chrome | `src/layouts/Base.astro`, `src/components/{Shell,Footer,StatusMark,Listing,ListingRow,SectionHeading,Cover,MetricStrip,EvidenceFigure,DocOpener,DocEnd,Toc,Callout,Cta}.astro`, `src/lib/{i18n,routes,site}.ts`, `public/scripts/theme-toggle.js` is NOT a file: the toggle is inline in Base.astro | `npx astro check`; a temporary `src/pages/zz-smoke.astro` built with `--outDir` into the scratchpad, then deleted |
| C pipeline | `astro.config.mjs` (markdown block only), `src/lib/remark/*.mjs`, `src/lib/rehype/*.mjs`, `src/content.config.ts`, `src/lib/format.mjs` (+ `format.d.ts` if needed), `tests/unit/format.test.mjs`, `scripts/lint/no-inline-style.mjs`, `public/scripts/code.js`, `vault/_guide/Syntax reference.md` (authoring guide: frontmatter, callout syntax) | `npm run test:unit`, `npm run lint:style`, a temporary markdown fixture page built with `--outDir` into the scratchpad, DOM checked, then deleted |
| D tools | `src/lib/tools/{confusion-matrix,ab-sample-size}.mjs`, `tests/unit/tools.test.mjs`, `src/components/tools/{AbSampleSizeBench,ConfusionMatrixBench}.tsx`, `design-system/bench.css` (bench, segmented, range, button — A does not write these), `src/pages/[lang]/tools/{index,ab-sample-size,confusion-matrix}.astro` | `npm run test:unit`; `npx astro check` on the islands; pages are built in the integration step (Base.astro arrives from B) |
| E gates | `scripts/gates/{run,checks,server}.mjs`, `tests/gates/README.md`, `tests/gates/fixtures/` (a tiny dist with deliberate violations the runner must catch) | the fixture run: every deliberate violation is reported, the clean page passes |

## 9. Base layout contract (B implements, everyone else consumes)

```astro
---
import Base from '@/layouts/Base.astro';
---
<Base lang="en" page="tools.ab-sample-size" title="A/B sample size" description="…" current="04" hasCode={false} noindex={false}>
  …page content; Base already renders the skip link, <header class="shell">, <main id="main" class="grid-container"> wrapper, and the footer…
</Base>
```

- `lang`: `'en' | 'de'`. `page`: a page id from `src/lib/routes.ts`: `home`, `work`, `work.<slug>`, `about`, `writing`, `writing.<slug>`, `tools`, `tools.confusion-matrix`, `tools.ab-sample-size`, `impressum`, `privacy`, `accessibility`, `system`, `notfound`. `routes.ts` exports `routes[pageId] = { en: '/en/…/', de: '/de/…/' }` and `alternates(pageId)`; project and essay routes are generated from slugs.
- `current`: the door code to mark `aria-current="page"` (`'01'` Work, `'02'` Writing, `'03'` About, `'04'` Tools).
- `hasCode`: adds `<script src="/scripts/code.js">` (deferred) — the only per-page script switch.
- Base renders `<main id="main" class="grid-container">` around the slot. Pages place `.section` blocks and `.grid` rows inside it, as the Site specimen does.
- `src/lib/i18n.ts` exports `t(lang, key)` and the dictionaries; `src/lib/site.ts` exports `site = { name, wordmark: 'BRAGA', email, location: { en: 'Greater Graz, Austria', de: 'Großraum Graz, Österreich' }, url }`.
- The theme toggle script (inline in Base, no framework): reads the resolved theme, flips `document.documentElement.dataset.theme`, writes `localStorage['bk-theme']` only after the click, updates the two `theme-color` metas, and updates the button's `aria-label`. The same inline script runs the split contact button (reveals Copy and Open, reassembles the address on click, "Copied" for two seconds) and marks the contents rail's active section as the page scrolls.
