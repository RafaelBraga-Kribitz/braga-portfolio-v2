# Braga-Kribitz Design System

A design system for the personal portfolio of **Rafael Braga-Kribitz**, Marketing
Data Scientist. This is a **system, not a website** — the site is its first
output. Every token, component, and rule exists so a new project, chart, article,
or skill can be added later without touching the design.

The system reads like a **high-quality technical document / product manual**:
structured, numbered, precise, spacious but never empty, high data-to-ink ratio.
Typography does the visual work; charts, code, and notation are the only
supporting instruments. There is **no decoration** — no gradients, illustration,
photography, drop-shadow cards, or motion theatrics. Quality is signalled through
**exactness, not spectacle**.

It must communicate: analytical rigor, business impact, technical competence.
It must never communicate: creative flair, visual experimentation, designer
sensibility. Design is the channel, not the message.

**Audience priority:** hiring managers scanning fast → senior DS/analytics leads
→ BI leaders evaluating rigor → pragmatic technical recruiters. Optimised for the
90-second scan and the deep read simultaneously.

## Sources

Authored entirely from a written first-principles specification supplied by the
owner (no external codebase or Figma). Brand fonts (Söhne, Klim Type Foundry)
were supplied as uploads. There is no live product to import from.

---

## CONTENT FUNDAMENTALS

How copy is written across the system.

- **Voice:** third-person and impersonal where the machine layer speaks (labels,
  numbering, status); first-person singular only in genuine prose ("I rebuilt…").
  Never "we" — this is one person's record. Never marketing "you."
- **Register:** declarative, factual, measured. State the result, then the
  method. No hype words ("revolutionary", "cutting-edge", "passionate"). Impact
  is shown with a number, not an adjective.
- **Casing is meaningful and must hold throughout:**
  - The **name** is title case — `Rafael Braga-Kribitz` — a human with authority.
  - **System labels** are uppercase — `WORK`, `CONTEXT`, `METHOD` — the machine
    layer. If a word labels the interface, it is uppercase mono.
  - Prose and project titles are sentence/title case as normal writing.
- **Numbers carry the argument.** Prefer "resolved 1,240,991 rows in 38 s" over
  "processed large datasets quickly." Figures are tabular/lining so columns align.
- **No emoji. No exclamation marks.** Emphasis is type weight, never punctuation
  or color (color emphasis is reserved for the single orange impact figure).
- **Status is honest.** `under-revision` is stated plainly when something breaks
  or a flaw is found, rather than hiding behind a 404.
- **Examples:**
  - Section opener — `02 · WORK` → "Selected Work" → "Cases reconstructed end to
    end; briefs scoped and shipped."
  - Metric — label `TIME SAVED` / value `38s` / note "from 9 minutes."
  - CTA — "Start a conversation →" (one verb, one arrow, no urgency theater).

---

## VISUAL FOUNDATIONS

- **Color** is role-based and semantic, not value-based. Every element renders
  **light or dark independently** — "dark" is a property an element carries
  (`.dark` class), not a special page type. Light page is #E6E6E6 on
  ink #282828; dark is #1A1A1A surface on ink #F5F5F5. See `tokens/colors.css`.
- **Accent discipline.** Orange `#FA6400` is the only default accent and is spent
  sparingly — one impact number, an arrow, a status dot. Blue `#5B7FFF` is a
  *moment* color for a deliberately theme-shifted section/card/page, never a UI
  default. A page reads almost monochrome until a number earns the orange.
- **Hairlines** are `mid` grey at **1px** and are a *primary structural device* —
  used the way rules are used in a printed technical document, not as incidental
  borders.
- **Type.** display + body = **Söhne** (800 weight for hero/section/project titles,
  Regular for prose); mono = **Söhne Mono** for all numbering, code, data
  labels, tags, timestamps, in mid grey. The fingerprint is heavy Söhne 800
  against light Söhne Mono — *mass vs. spec*. Figures tabular/lining everywhere.
- **Spacing** is an 8px base grid with 4px half-steps; every value is a multiple.
  Generous outer margins; reading column capped at ~72ch; page max-width ~1320px.
- **Backgrounds** are flat surface colors only. **No** images, full-bleed photos,
  illustrations, repeating patterns, textures, or gradients anywhere.
- **Corners** are square (radius 0); the rare interactive control may use 2px.
  **Cards** are defined by a 1px hairline or a `surface-2` wash — **never** by
  drop shadow or rounding. There is no shadow system.
- **Motion** is comprehension-only. The *only* motion: hover **row-wash** to
  `surface-2`, and active-state **orange** highlight. No scroll-triggered
  spectacle, no entrance animation, no bounce. Easing `cubic-bezier(.2,0,0,1)`,
  ~140ms. If removing an animation makes it cleaner, remove it.
- **Hover** = background wash to `surface-2` (rows) and a grey→orange color shift
  on the trailing meta/arrow. **Press/active** = orange highlight. No scale,
  shrink, or shadow on interaction.
- **Transparency / blur:** none. The system is opaque and flat.
- **Imagery vibe:** N/A — there is no photography or illustration. The only
  "imagery" is data: charts and diagrams, drawn in the same palette (grey
  structure, one orange signal), framed by the `Figure` container.

---

## NUMBERING SYSTEM

A visible information-architecture tree, three levels deep: **Page → Section →
Element**. `00` is the meta layer (hero, Index). Content counts from `01`.
Separator is a hyphen (`02-01`, `02-04-03`). Depth is **contextual** in flow;
the **full explicit tree appears in exactly one place — the home Index**, where
the optional `§` prefix is used. Always mono, mid grey, tabular — recessive
wayfinding that is always present and never shouts.

---

## ICONOGRAPHY

The system is **near-iconless by design** — a technical document uses words,
numbers, and rules, not pictograms.

- **Arrows** are the one recurring glyph: the Unicode arrow `→` (and `↗` for
  external/deployed links) set in mono, mid grey, turning orange on hover. No
  icon font, no SVG icon set.
- **Status** is communicated by a colored **dot**, not an icon (see the Status
  system).
- **No emoji**, ever. No decorative icons, no logo mark beyond the wordmark
  (the title-case name set in Söhne Black *is* the logo).
- If a future need arises (e.g. social glyphs in the footer), prefer plain mono
  text labels (`GITHUB ↗`, `LINKEDIN ↗`) over icons to stay in register.

---

## INDEX (manifest of this folder)

- `styles.css` — global entry point (consumers link this). `@import` lines only.
- `tokens/` — `fonts.css` (Söhne + Söhne Mono `@font-face`), `colors.css`
  (semantic light + `.dark`), `typography.css` (families, fluid scale, roles),
  `spacing.css` (8px grid, layout, motion vars).
- `assets/fonts/` — Söhne OTF weights (Buch→Extrafett = 400→900).
- `Design System.html` — the **single source of truth (SSOT)**: a live,
  offline-capable reference covering principles & voice, all tokens (color both
  modes, full type scale, 7+3 font weights, full 0→160 spacing scale, chart
  palettes), the numbering system, status, and a live specimen of **every**
  component. Each specimen carries a code drawer exposing its **React** snippet
  and the exact **vanilla HTML** (token-driven, inline-styled, copy-paste) — so
  any piece is reproducible in either stack. Whole-page light/dark preview
  toggle. Built from `ds-ref/data.js` (token mirror) + `ds-ref/app.jsx`
  (framework + foundations + library) over the compiled `_ds_bundle.js`.
- `guidelines/*.card.html` — foundation specimen cards (Design System tab).
- `tokens/chart-palettes.css` — 6 data-vis scales anchored to BK accents:
  sequential blue (9 stops), sequential orange (9 stops), diverging warm/cool
  (13 stops), diverging political blue↔red (13 stops), long interpolation
  blue→gold (8 stops), short interpolation blue→magenta→orange (8 stops).
  All `--chart-*` vars; dark-mode overrides for near-white stops included.
- `components/` — reusable React primitives (48 total), grouped. Every component
  is a named-export function reading CSS vars, with a sibling `.d.ts`. They
  compile into `_ds_bundle.js` under `window.BragaKribitzDesignSystem_9bf979`.
  - `primitives/` — `Button` (mono uppercase, active/hover), `RangeSlider`
    (labelled range + live tabular value), `PanelCard` (hairline surface with
    mono label + display title), `Link` (inline / arrow / meta, the →/↗ glyph),
    `Divider` (plain / emphasised / labelled / vertical hairline), `Toggle`
    (square switch), `Tooltip` *(draft)*
  - `forms/` — `TextField` (+ multiline), `Checkbox`, `RadioGroup`, `Select`,
    `SearchField` *(draft)*
  - `data/` — `StatusDot`, `Tag`, `NumberLabel`, `MetricGrid`, `Table`
    (hairline data table, tabular numeric cols, row-wash), `DefinitionList`
    (spec / key-value rows), `Stat` (single big figure), `Meter` (proportion bar)
  - `work/` — `ProjectRow`, `IndexTree`
  - `layout/` — `Navbar`, `SectionHeader`, `Footer`, `Breadcrumb`, `Pagination`
    (…-collapse), `Tabs` (orange underline), `SegmentedControl` (inverted-active
    strip), `DropdownMenu` (nav menu), `LinkColumns` (footer/sitemap columns),
    `TableOfContents` (active tick), `Accordion` *(draft)*, `Dialog` *(draft modal)*
  - `content/` — `CodeBlock` (syntax-highlighted, copy button), `Figure`,
    `MermaidDiagram` (palette-themed), `MathBlock` (KaTeX, orange math),
    `Callout` (note / revision / moment), `Pullquote`, `Meta` (byline row)
  - `specimen/` — `GlyphGrid` (character grid), `GlyphInspector` (single glyph
    with cap/x-height/baseline/descender guides) — type-forward, adapted from the
    Söhne specimen reference
  - `charts/` — canvas chart components extracted from the Confusion Matrix
    tool: `ConfusionMatrixChart` (2×2 grid, blue correct / orange error),
    `MetricBarChart` (normalised 0–1 bars, 80% reference line),
    `SankeyChart` (population flow ribbons), `CostBarChart` (FP vs FN cost
    proportional bar with breakdown)
- `templates/confusion-matrix/` — `ConfusionMatrix.dc.html`: full interactive
  classifier diagnostics tool — 5 domain scenarios, 8 live metrics, confusion
  matrix, Sankey flow, metric bar breakdown, business cost calculator.
- `BACKLOG.md` — expansion backlog (Foundations → Components → Patterns), using
  The Economist's public taxonomy as the breadth target. Tracks draft components
  pending review and the foundations / patterns still to build.
- `SKILL.md` — Agent-Skill manifest for using this system elsewhere.

> **Draft components** (`Tooltip`, `SearchField`, `Accordion`, `Dialog`) are
> built and compiled but need a review pass (focus trap, motion, collision
> handling) — see `BACKLOG.md`.

### Pages shipped
Home, About, Work, Brief, Case, Writing, WritingNote, WritingPost, Contact —
all live at project root as `*.html`.
