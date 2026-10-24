# Gates

The gates are the build's quality bar, measured on the rendered pages rather
than asserted in prose. They are ported from
`handoff/ds-update/proposals/checks.js` (Audit, 20 Oct 2026) and extended with
link, hreflang, script, style, head and axe checks. "A rule you have not seen
fail is not a gate": every gate below is seen failing on
`tests/gates/fixtures/bad/`, and the self-test proves it on each run.

| File | Role |
|---|---|
| `scripts/gates/run.mjs` | the CLI: enumerates pages, serves the folder, drives Chromium, prints the table, writes JSON |
| `scripts/gates/checks.mjs` | the gates: `pageGates` (in the page), `pageFacts` + `staticGates` (raw HTML), `axeGate` |
| `scripts/gates/server.mjs` | a dependency-free static server (directory → `index.html`, misses → `404.html`, OS-assigned port) |
| `tests/gates/fixtures/` | a tiny fake dist: `clean/` passes everything, `bad/` breaks every gate, `de-draft/` breaks L-07 alone, `expect.json` says so |

## Running

```sh
npm run test:gates                                   # dist/, every page, 6 widths × 2 themes, axe
node scripts/gates/run.mjs --dir <build> --quick     # 390 + 1280, light only, no axe
node scripts/gates/run.mjs --dir tests/gates/fixtures --expect tests/gates/fixtures/expect.json   # self-test
SITE_BASE=/braga-portfolio/ npx astro build --outDir <build> && node scripts/gates/run.mjs --dir <build> --base /braga-portfolio/ --quick   # a project-page build
```

| Option | Default | Meaning |
|---|---|---|
| `--dir <path>` | `dist` | the built folder; every `index.html` and `404.html` under it is a page |
| `--pages <list>` | all | comma list of page paths, e.g. `/en/,/en/work/`; a trailing `*` matches a prefix (`/de/*`) |
| `--widths <list>` | `320,390,768,1024,1280,1440` | viewport widths (height 900) |
| `--themes <list>` | `light,dark` | one browser context per theme; an init script writes `localStorage['bk-theme']`, so the pre-paint script applies it exactly as for a reader with a stored choice (the emulated OS stays light) |
| `--quick` | off | 390 and 1280, light only, no axe (explicit `--widths` / `--themes` still win) |
| `--json <file>` | none | the full report (every context, every offender) |
| `--expect <file>` | none | exit 0 only if the failing gates match the file exactly (see Fixtures) |
| `--site <url>` | `site` from `astro.config.mjs` | absolute URLs on this origin (canonical, hreflang, feed) are checked as local files |
| `--base <path>` | `$SITE_BASE`, else `/` | the base path the build was made with (`SITE_BASE=/braga-portfolio/`, a project-page deploy; DEPLOY.md): the folder is served under it, pages are opened under it, and L-01 fails any local URL that lacks it. Page paths in the table, in `--pages` and in the pending list stay relative to the build root (`/en/work/`) |
| `--concurrency <n>` | `3` | pages rendered in parallel (one browser throughout) |
| `--verbose` | off | print every gate row and up to eight offenders per failure |
| `--no-axe` | off | skip A-01 without the rest of `--quick` |
| `--chromium <path>` | `/opt/pw-browsers/chromium` (or `$GATES_CHROMIUM`) | browser binary; never run `playwright install` |
| `--pending <file>` | `tests/gates/pending-routes.json`, whatever `--dir` is (a scratch build gets the verdict `dist/` gets) | routes of the site map that a later phase builds: L-01 counts a link to one instead of failing it, and a `pending` row says how many are linked. A listed route that now exists fails the run until it is removed from the file, so the list only shrinks |
| `--no-pending` | off | treat every unbuilt route as a broken link (the fixture self-test uses it) |
| `--draft-langs <list>` | `de` | the languages whose every page must show the draft mark (L-07); mirrors `DRAFT_LANGS` in `src/lib/i18n.ts`. Pass `''` (and empty that list) once the owner approves the German copy |

Exit status: `1` if any gate fails (or, with `--expect`, if the failures differ
from the expectation), `2` if the folder has no pages, `0` otherwise. Seven
tool pages (84 contexts, 28 axe passes) took 18 s, so the whole site (about 30
pages) should take roughly a minute and a half.

## Reading the output

```
PAGE     GATE   STAT  DETAIL
/bad/    G-05   FAIL  Targets ≥ 24 / 44px · all 12 ctx · 3 targets smaller than 44px · a “Clean” · 37.3×17
/bad/    L-01   FAIL  Internal links resolve · static · 2 internal references do not resolve · <a> href="/missing/" · …
/bad/    warn   !     theme not applied (data-theme ≠ requested) in 6 contexts: the pre-paint script did not run
/clean/  rest   pass  G-01 G-02 … L-05 A-01 · 12 contexts
/clean/  skip   —     L-02 (not under /en/ or /de/ and declares no alternates)
```

- One row per failing gate per page, aggregated over the contexts. The detail
  reads: gate name · where it failed · the summary · the first offender.
- **Where** is `static` for L-gates (checked once, on the raw file), `all 12 ctx`
  when every width × theme failed, or `4/12 ctx (320/light 390/light …)`: the
  failing contexts, narrowest and light first. A failure only at 320 and 390 is
  a mobile problem; only in `/dark` is a dark-token problem.
- The offender is the measured element: tag, id, first class and its own text
  in “ ”, then the measurement (size, ratio with both hex values, box, radius).
  `--verbose` prints more; the JSON keeps every offender of every context.
- `rest pass` lists the gates that passed everywhere; `skip` lists gates that
  do not apply (L-02 outside the language trees; A-01 under `--quick`; all
  rendered gates on a meta-refresh redirect stub).
- `warn` rows are not failures: a requested theme that did not take (no
  pre-paint script), or a script error in the page.
- The last line counts pages, rendered contexts, failing gates by id, seconds.

JSON (`--json`): `{ summary, options, pages: [{ page, file, redirect, gates: [{ id, name, status, summary, offenders, failing, all }], warnings, runs: [{ width, theme, applied, results }] }] }`.

## The gates

Rendered gates run in every page × width × theme; static gates once per page
on the file as built (parsed with `DOMParser`, so nothing has run or hydrated);
A-01 at 390 and 1280 in both themes. Elements inside `[data-gate-skip]`,
`[hidden]`, `<template>` and visually hidden boxes (a ≤ 1px clipping box, the
sr-only pattern) are not rendered text and are left out of G-01 to G-06.

| Id | Gate | Fails when |
|---|---|---|
| G-01 | Type floor 12px | a text run renders below 12px (11.5 with rounding tolerance); SVG text is measured after its viewBox and transforms scale it (`getScreenCTM`) |
| G-02 | Text contrast | a text run is below 4.5:1, or 3:1 when large (≥ 24px, or ≥ 18.66px at 700+), against the first painted background found walking up the tree (unmeasurable over a background image) |
| G-03 | Mid grey never text | a text run's colour equals the resolved `--mid` where it sits (D-007); glyph-only runs (→ ↗ · ▲ squares) are exempt |
| G-04 | Accent text passes | a text run in the resolved `--accent-01` misses its threshold where it sits (never on the raised dark surface) |
| G-05 | Targets ≥ 24 / 44px | a link, button, input, select, textarea, summary or role=tab/switch/button is narrower or shorter than 24px, or 44px below a 768px viewport (32px for the footer's links, 24px for a document's tag row, owner, 23 Oct 2026); links inline in a sentence are exempt (WCAG 2.5.8) |
| G-06 | No horizontal overflow | `scrollWidth` exceeds `clientWidth`, or an element's right edge passes the viewport outside an `overflow-x: auto/scroll` wrapper that itself fits; only the outermost offender is listed |
| G-07 | Square corners | any element or `::before`/`::after` has a radius above 0 |
| G-08 | No shadow, gradient, blur | `box-shadow`, `text-shadow`, a gradient `background-image`, a `blur()`/`drop-shadow()` filter or a `backdrop-filter`, on any element or pseudo-element; the one exception is the `backdrop-filter` of the sticky `header.shell` (its glass, owner, 23 Oct 2026) |
| G-09 | Heading order | not exactly one `h1`, or a level is skipped (h2 → h4) |
| G-10 | Landmarks + skip link | `header`, `nav` or `footer` missing; not exactly one `main`; two landmarks of one role share a name (axe's best-practice `landmark-unique`, which the WCAG tags of A-01 leave out: the header doors and the footer's Index group were both "Index"); the first tab stop is not the `.skip` link; its `#target` does not exist |
| G-11 | Reduced motion | no `@media (prefers-reduced-motion: reduce)` rule, or none sets `--dur` to a value that resolves to 0 |
| G-12 | Project fonts loaded | after `document.fonts.ready`, no face of `BKribitz` or of `BKribitz Mono` reports `loaded` |
| G-13 | No third-party requests | a stylesheet, script, image, frame, `@import` or `@font-face` points at another origin, or any request leaves for one (the runner blocks and records it) |
| G-14 | Shell on the page grid | the text of `.shell-mark` does not start on the content edge of `<main>` (±1px), `.shell-cluster` does not end on its right edge (768 and up), or the footer's `.site-footer-mark` does not stack under the header's; at every width, above `--page-max` too (grid.css rule 1). A page without `.shell-mark` passes |
| G-15 | One accent per section | a section carries more than one accent spot at rest (owner, 22 Oct 2026; replaces D-025's one per view). A spot is an element whose own text, background, border, SVG fill/stroke or `::before`/`::after` is the resolved `--accent-01`; a spot inside a spot is one spot (a button and its glyph) and all accent marks of one `<svg>` are one spot (a chart's marker and cursor). The section is the nearest `figure`, `.bench-tool`, `.cover`, `.doc-opener`, `.metric-strip`, `.doc-close`, `.doc-end`, `main > .section`, `header`, `footer` or `nav`; inside `article.doc` and outside those, the `h2` section the element follows. Hover and focus states are not at rest and are not measured; code panels (`.code`, `pre`) are left out, since their syntax palette (D-035) shares a value with the dark accent |
| G-16 | Rules open, never close | a horizontal rule faces the next rule below it across nothing but empty space (owner, 24 Oct 2026). A rule is a top or bottom border ≥ 1px and 120px or wider (a table row's cell borders are joined into one); an element bordered left and right too is a box (a button, an input), not a rule, and a split rule (cells ruled one by one with a gap between, as in a spec list) underlines its row and is not checked. Content between them, anywhere under the upper rule's width, is rendered text (not screen-reader-only), a replaced element or a status square |
| L-01 | Internal links resolve | an `href`/`src`/`srcset`/`action`, island `component-url`/`renderer-url`, or meta-refresh URL without a scheme (or on the site's own origin) maps to no file: `/a/` needs `a/index.html`, `#fragments` are stripped, `mailto:`/`tel:` are allowed; an on-page `#id` must exist; a same-origin request that answered 4xx at render time is added here |
| L-02 | hreflang pairs | on every `/en/` and `/de/` page (and any page that declares alternates): its own language and `x-default` are not each present once (the other language is optional: a page without a twin, owner, 23 Oct 2026, declares none); one does not resolve; the own-language alternate is not the page itself; the twin does not exist, lacks the twin `lang`, or does not point back |
| L-03 | Scripts policy | any script other than (a) the inline pre-paint script, first in `<head>` before the stylesheets, (b) the inline shell script (the theme toggle, which also runs the contact pair's copy buttons), (c) `/scripts/code.js`; Astro island scripts (`/_astro/…` or the inline island loaders) only under `/tools/<name>/`; also fails when the pre-paint script is missing (the redirect stub included), when a code panel's buttons are on the page without `/scripts/code.js`, or when `code.js` loads on a page with no code panel. JSON / JSON-LD blocks are data and pass |
| L-04 | No inline style | a `style` attribute declares anything but custom properties, or declares them outside the places rule 1 allows: `.ev-fill` / `.ev-mid`, a chart mark (`.mark`, `.swatch`, anything inside an `<svg>`) or anything inside an `<astro-island>` (a tool). Nothing is exempt (mathematics is native MathML, so no KaTeX layout styles reach a page; 21 Oct 2026) |
| L-05 | Head metadata | no `<html lang>`, `<title>`, `<meta name="description">`, viewport with `width=device-width`, or exactly two `theme-color` metas (light and dark media); a redirect stub needs only lang, title and viewport |
| L-06 | Glyph inventory | the text (or an `aria-label`, `title`, `alt`) holds a symbol outside D-030: any character of Unicode class So, an `Extended_Pictographic` character or an arrow other than → ↗ ← (©, ™, ✓, ★, ⇒, an emoji). Allowed: → ↗ ← ▲ ■ □ ▣ ▤ ⊡ and the degree sign; § · + − – … are punctuation, not symbols. Code, `pre`, `kbd`, `samp`, MathML and scripts are not checked |
| L-07 | Draft mark | a page whose `<html lang>` is a draft language (`--draft-langs`, default `de`) has no `.status[data-state="in-build"][data-draft]` (the in-build mark with the "Entwurf · Freigabe ausstehend" label; StatusMark sets `data-draft`). Skipped on other languages and on redirect stubs |
| A-01 | axe WCAG 2.1 AA | axe-core (`@axe-core/playwright`, tags `wcag2a`, `wcag2aa`, `wcag21aa`) reports any violation, at 390 and 1280 in both themes |

### Where the port departs from checks.js

Each departure follows a written rule; none relaxes a gate.

- **G-07** fails at any radius above 0. `checks.js` allowed the 2px control token
  of the v1 system; BUILD-BRIEF §3 says "Corners 0" and the design system sets
  no radius anywhere.
- **G-08** adds `text-shadow`, blur filters and `backdrop-filter` ("no blur",
  D-021), and checks `::before`/`::after`, where status squares and markers live.
- **G-11** requires the rule to set `--dur` to 0 (resolved through
  `var(--dur-reduced)`); `checks.js` only required a rule to exist.
- **G-12** requires both families; `checks.js` accepted any one BKribitz face.
- **G-13** also watches the wire, so a request made by a script is caught.
- **G-10** requires exactly one `main` and a skip target that exists.
- **G-02** falls back to the browser canvas when nothing is painted;
  `checks.js` measured against a transparent `<html>`, read as black.
- Visually hidden boxes are excluded from G-01 to G-06 (they are not rendered).

## Fixtures

`tests/gates/fixtures/` is served as a site root. `fonts` and `tokens.css` are
symlinks to `public/fonts/` and `design-system/tokens.css`, so the fixtures
render with the real faces and the real token values and carry no colour of
their own.

**`clean/index.html`** (with `fixture.css`) passes every gate at every width
in both themes: skip link first and 44px tall, header with nav, one `main`,
one `h1`, footer, the pre-paint script, an accent figure on the surface, a link
inside a sentence, a table scrolling inside its wrapper, an SVG label scaled
up by its viewBox, one `style="--w: 40%"`, a reduced-motion rule, both faces.

**`bad/index.html`** (with `bad/bad.css`) carries these deliberate violations:

| Violation | Caught by |
|---|---|
| 11px text | G-01 |
| text in `--mid` | G-02, G-03, A-01 |
| accent text on a mid-grey ground | G-02, G-04, A-01 |
| `style="color:red"` | L-04, G-02 |
| `border-radius: 8px` | G-07 |
| `box-shadow`, a `linear-gradient` | G-08 |
| a link 20px tall, small nav links | G-05 |
| a 1600px rule | G-06 |
| two `h1`, h2 → h4 | G-09 |
| no skip link, no footer | G-10 |
| no reduced-motion rule | G-11 |
| a Georgia body, no project face used | G-12 |
| a `cdn.jsdelivr.net` script | G-13, L-03 |
| a link to `/missing/` | L-01 |
| hreflang `en` + `de` → `/de/bad/` (absent), no `x-default` | L-02, L-01 |
| no pre-paint script | L-03 (and the dark contexts warn) |
| no description, one theme-color | L-05 |
| a `.shell-mark` 24px in from the content edge | G-14 |
| a second `nav` named "Index" | G-10 |
| `© 2026` in a paragraph | L-06 |
| two accent figures in one `.section` | G-15 |
| a paragraph closing with a rule, 48px, a paragraph opening with one | G-16 |
| `style="--w: 40%"` on a plain `div` | L-04 |
| a code panel's Copy button without `/scripts/code.js` | L-03 |

**`de-draft/index.html`** is the clean page in German (`lang="de"`) without
the draft mark: L-07 is its only failure.

`expect.json` records, per page, the gates that must fail and a phrase each
failure must mention. With `--expect` the run exits 0 only when every expected
failure is seen with its phrase and nothing else fails, so a gate that stops
catching its violation, or starts flagging the clean page, fails the self-test.
Add a violation to `bad/` and a line to `expect.json` together.

## Limits

- G-02 and G-04 read computed colours: text over a background image, or text
  given colour by `opacity` or `mix-blend-mode`, is not measured.
- G-05 measures boxes as rendered; a target that is enlarged by a pseudo-element
  hit area is measured without it.
- G-06 lists elements clipped by `overflow: hidden` that cross the viewport:
  clipped text is lost text.
- L-01 does not check fragments on other pages, or `url()` references inside CSS
  (a missing font or image is caught at render time as a 4xx request).
- Text placed directly in `<body>` (outside any element) is not measured, as in
  `checks.js`.
