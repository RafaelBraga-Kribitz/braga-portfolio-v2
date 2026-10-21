# Authoring guide · src/content

Every project, essay, note and legal page is one Markdown file, written so it
reads the same in Obsidian and on the site. The build turns it into the DOM
that `design-system/` styles; nothing in a file sets its own look. This guide
covers where files go, the frontmatter, the document order, and every
construct the pipeline understands. The collections are defined in
`src/content.config.ts`; the pipeline is in `astro.config.mjs` (`markdown`).

## 1. Files and ids

| Collection | Folder | One file per | Page |
|---|---|---|---|
| `projects` | `src/content/projects/{en,de}/<slug>.md` | project, per language | `/<lang>/work/<slug>/` |
| `writing` | `src/content/writing/{en,de}/<slug>.md` | essay or note, per language | `/<lang>/writing/<slug>/` |
| `pages` | `src/content/pages/{en,de}/<slug>.md` | About (`about.md`) and the kitchen sink (`system.md`), per language | `/<lang>/about/`, `/<lang>/system/` |
| `legal` | `src/content/legal/{en,de}/<file>.md` | legal page, per language | by `page`: see below |

- A page exists only for a language whose file exists. Write **both**
  languages of every document: the shell's language link, the hreflang
  pair and the gates (L-01, L-02) expect the twin.
- When a page that `tests/gates/pending-routes.json` lists starts to exist
  (the first About, legal, project or essay file), remove its route from
  that list in the same change: the gate runner fails on a listed route
  that is built.

- Markdown only (`.md`). No MDX, no components, no raw HTML in the body.
- The entry id is the path without the extension: `en/warehouse-humanoid-tco`.
  Fetch with `getEntry('projects', 'en/warehouse-humanoid-tco')` or
  `getCollection('projects', (e) => e.data.lang === lang && !e.data.draft)`.
- The frontmatter `slug` is shared by the English and German file of one
  document; it is how the two versions find each other. Lower-case kebab-case.
- The folder and `lang` must agree; a mismatch fails the build.
- The page templates do the rendering (`src/pages/[lang]/work/[slug].astro`,
  `writing/[slug].astro`, `about.astro`, `system.astro`, `[legal].astro`,
  through `src/layouts/Document.astro`): `const { Content, headings,
  remarkPluginFrontmatter } = await render(entry)` inside
  `<article class="doc">`. The contents rail lists the `##` headings in order
  (its numbers match the ones the stylesheet draws) and leaves out the
  footnotes heading (`slug: 'footnote-label'`). Keep every `##` at the top
  level of the document, never inside a callout, or the rail and the drawn
  numbers disagree. A code panel sets `remarkPluginFrontmatter.hasCode`, and
  the page then loads `/scripts/code.js`; nothing to declare.

## 2. Frontmatter

Dates are `yyyy-mm-dd` and are written **quoted**: `"2026-09-16"`. Unquoted
dates work, but YAML silently rolls an impossible unquoted day over
(2026-02-30 becomes 2 March) before the schema sees it; a quoted impossible
day fails the build. A date with a time fails.

### projects

```yaml
---
title: Warehouse humanoid TCO
code: "01-04"                  # section · item, from the Site specimen
kind: case                     # case | brief
date: "2026-09-16"
summary: One sentence for listings and the meta description.
lead: The standfirst under the title (.doc-lead).
domain: Operations
status: complete               # complete | functional | under-revision | in-build | archived
tags: [tco, robotics]
lang: en                       # en | de, must match the folder
slug: warehouse-humanoid-tco   # same in both languages
updated: "2026-10-02"          # optional; the meta row adds "Updated 2 Oct 2026"
metrics:                       # the metric strip under the opener
  - { value: "€453,000", label: Five-year cost, accent: true }  # at most one accent (D-025)
  - { value: "38 s", label: Cycle time }
repository: https://github.com/…   # optional, a full URL; the meta row adds "Repository ↗"
draft: false                   # default false; drafts are not listed or built
translationStatus: approved    # approved | draft (default approved)
---
```

The page builds the opener from these fields: trail `01 Work → <code>`,
`title` as the h1, `lead`, and the meta row domain · status mark ·
Published `date` · Updated `updated` · Repository ↗ (the draft mark first
when `translationStatus: draft`). `summary` is the listing sub-line, the
meta description and og:description. `metrics` become the metric strip at
the top of the document; the `value` is written exactly as it should read
(`"€453,000"` in English, `"€ 453.000"` in German, with the NBSP). Use the
strip **or** a `> [!metrics]` callout in the body, not both. The end bar
links back to the index and on to the next project by `code`.

### writing

```yaml
---
title: An AI prospecting vendor and a 3× lift
code: "02-01"                  # optional; equation numbers derive from it
kind: essay                    # essay | note
date: "2026-09-16"
updated: "2026-10-02"          # optional
summary: One sentence for listings and the meta description.
lead: Optional standfirst.     # optional
tags: [experiments]
lang: en
slug: ai-prospecting-vendor-3x-lift
draft: false
translationStatus: approved
---
```

The opener: trail `02 Writing → <code>` (an entry without `code` is
numbered 02-NN by its place in the listing), title, `lead`, meta row kind ·
Published · Updated. No metric strip.

### pages

About and the kitchen sink. The file name is free; `slug` says which page
it is.

```yaml
---
title: About
slug: about                    # about | system
lang: en
summary: One sentence for the meta description.
lead: Optional standfirst.     # optional
code: "03-01"                  # optional; equation numbers derive from it
updated: "2026-10-06"          # optional; the meta row shows "Updated 6 Oct 2026"
contentLang: en                # optional: the body's language when it is not the page's
                               # (the German kitchen sink may keep English content)
draft: false
translationStatus: approved    # a German file: draft until the owner approves
---
```

About renders with the document template (trail `03 About`); the kitchen
sink with the same template, noindex, trail `§ Index → <title>`, outside the
sitemap. Everything below the opener (spec callouts, the CV table, the
contact cta) is written in the body.

### legal

The file name is free; `page` says which legal page it is, and the URL comes
from `src/lib/routes.ts`, so the German privacy page lives at
`/de/datenschutz/` and the accessibility statement at
`/de/barrierefreiheit/`.

```yaml
---
title: Impressum und Offenlegung
page: impressum                # impressum | privacy | accessibility
lang: de
updated: "2026-10-20"          # the meta row shows "Stand 20. Okt. 2026" / "As of 20 Oct 2026"
summary: The meta description.
lead: Optional standfirst.     # optional
slug: impressum                # optional, informational
draft: false
translationStatus: draft
---
```

The utility template: trail `Others → Impressum` / `Sonstiges →
Impressum`, the h1, `lead`, the meta row (draft mark, Stand / As of), then the
body as flat prose, then the end bar `§ END ← Index`.

**German drafts.** Every German file the owner has not approved carries
`translationStatus: draft`. The page then shows the status mark `in-build`
with the label "Entwurf · Freigabe ausstehend" in its meta row.

## 3. Document order

Every project and essay follows one direction:

**question → data → method → result → limitations → decision**

One `##` section each, in that order. Limitations are stated before the
decision, never after it. Section numbers (01, 02, …) are drawn by the
stylesheet from the order of the `##` headings: never type them. Use `###` for
subsections; do not skip levels; the title is the page's only h1 and comes
from the frontmatter, so the body starts at `##`.

## 4. Text

- British English. Declarative, measured; first person singular only in
  genuine prose; never "we", never marketing "you"; no exclamation marks.
- Quotes and dashes are authored (smart punctuation is off): “ ” and ‘ ’ in
  English, „ “ in German; the English dash is the spaced en dash ( – ); ranges
  use an unspaced en dash (2020–2025); negatives the real minus (−28%); one
  ellipsis character (…).
- Figures: a non-breaking space (U+00A0) between value and unit, inside
  "16 Sep 2026" and, in German, before % and after €: `38 s`, `€ 453.000`,
  `35 %`. English €453,000 · 0.05 · 35%; German € 453.000 · 0,05 · 35 %.
  Templates format through `src/lib/format.mjs` (`number`, `currency`,
  `percent`, `unit`, `date`, `range`, `equation`, `ellipsis`, `quotes`,
  `dash`); prose types the same characters.
- Links: `[text](/en/work/…/)` inside the site (root-relative: a
  project-page build puts its base path in front by itself, DEPLOY.md),
  full URLs outside.
- `==text==` marks **the one earned figure** of a section (D-025): it renders
  as `<mark>` and is set in the accent (in a paragraph or list item; in a
  table cell it stays ink). At most one per section; never a word, never
  decoration; never in a heading (it stays literal there).
- No images, no icons, no emoji, no inline style attributes, no raw HTML.
  Glyphs: → ↗ ← § · ▲ + − – … only.

## 5. Callouts

Obsidian syntax: a blockquote whose first line is `[!type] Title`. The title
is optional (the type name stands in). Output:
`<div class="callout" data-callout="type"><div class="callout-title">Title</div><div class="callout-content">…</div></div>`.
The type is case-insensitive (`[!NOTE]` works). A blockquote without a marker
stays a quotation.

- **Wide.** `[!type|wide]` spans the wide column (`data-callout-metadata="wide"`).
- **Fold.** `[!faq]-` starts closed, `[!faq]+` starts open (faq only).
- **Nesting.** A callout may sit inside another (`> > [!aside]`); keep it rare.

**note** · a remark beside the argument
```md
> [!note] Sample
> 1,240,991 rows after deduplication; 4.9% dropped.
```

**aside** · a digression the argument does not need
```md
> [!aside]
> The same rule holds for the German market, with a smaller base.
```

**warning** · a limitation or risk; the title gets ▲
```md
> [!warning] Before deciding
> The model has not been validated on 2026 data.
```

**tool** · the no-script fallback of an interactive tool: a static result
```md
> [!tool] A/B sample size
> At a 4% baseline and a 10% relative lift: **39,473** visitors per arm.
```

**summary** · the abstract directly under the opener
```md
> [!summary]
> The question, the answer and the figure that carries it, in three sentences.
```

**definition** · a term the reader needs
```md
> [!definition] Uplift
> The relative change in conversion between control and treatment.
```

**quote** · a pull quote; the title is the source
```md
> [!quote] Hiring manager, 2026
> “The listing count was never the constraint.”
```

**spec** · key/value rows; each item is `Term — value` (em or en dash,
spaced) and becomes a `<dl>`
```md
> [!spec] Model inputs
> - Baseline — 4%
> - Lift — 10% relative
> - Power — 0.80
```

**metrics** · figure tiles; each item is `value — label`; `==value==` marks
the key figure (one at most)
```md
> [!metrics] Key figures
> - ==39,473== — visitors per arm
> - 38 s — run time
> - 1,240,991 — rows resolved
```

**faq** · a question that opens; renders as a native `<details>`
```md
> [!faq]- Why not a Bayesian test?
> The decision rule was fixed before the data arrived.
```

**bookmark** · a link card; the single link is the card, the text after a
dash is its second line; → inside the site, ↗ outside
```md
> [!bookmark]
> [The A/B bench](/en/tools/ab-sample-size/) — sample size per arm, worked.
```

**cta** · the page's one primary link-button; the title is hidden
```md
> [!cta]
> [Read the essay](/en/writing/ai-prospecting-vendor-3x-lift/)
```

**bars** · the evidence figure of the Site specimen (pattern 05): a
kicker, the finding as its heading, ink bars on a mid baseline, and a
caption with the source. Not a callout on the page: it becomes
`<figure class="evidence" data-width="wide">` on the wide track, styled by
`design-system/charts.css`. In Obsidian it stays a readable callout.
```md
> [!bars] Fig. 01-01-1 · Skill mentions
> SQL and Python lead the snapshot.
> - SQL — 40
> - Python — 35
> - Azure — 19
>
> scale: 0–100 · unit: % · centre: no
> caption: Share of 720 core postings. Multiple mentions allowed.
> source: supplied project record, 16 Sep 2026.
```

- The title is the kicker (`Fig. <code>-<n> · <subject>`); the first line
  under it is the finding, a sentence that says what the bars show.
- One list item per bar: `label — value` (a spaced em or en dash). The
  value is a bare number: digits, a decimal point (`.` or `,`), a minus
  (`−` or `-`) for a negative; no grouping separators; the declared unit
  may follow it (`40%`). The build prints it in the document's language
  through `src/lib/format.mjs` (`40%` / `40 %`, `−28%`, `3.5` / `3,5`), with
  a `+` on positive values of a centred figure.
- The meta lines are optional, in any order, after a blank `>` line:
  - `scale: <low>–<high>` positions the bars (default `0–100` for `unit: %`,
    else 0 to the largest value). A value outside the scale fails the build.
  - `unit:` `%`, `€`, any other unit (printed after an NBSP: `38 s`), or
    none.
  - `centre: yes` for a change around zero: the zero line sits at 50% and
    each bar grows left or right from it; the scale must be symmetric
    (`−50–50`; default ± the largest magnitude). Default `no`.
  - `accent: <label>` gives that one bar the accent (the earned bar, D-025).
  - `caption:` the sentence under the bars: state n and the scale in words
    here (the scale line only positions the bars).
  - `source:` printed after **Source:** / **Quelle:** in ink. The specimen
    makes the source mandatory: always write it.
- `scale`, `unit`, `centre` and `accent` may share one line, joined by ` · `.
- A malformed value, an unknown meta line, an `accent` that names no bar or
  an asymmetric centred scale fails the build, naming the file.
- Output, for the stylesheet:
  ```html
  <figure class="evidence" data-width="wide">
    <p class="label">Fig. 01-01-1 · Skill mentions</p>
    <p class="evidence-heading display">SQL and Python lead the snapshot.</p>
    <div class="ev-bars">
      <div class="ev-bar"><span class="ev-label">SQL</span>
        <span class="ev-track"><span class="ev-fill" style="--w: 40%"></span></span>
        <span class="ev-value">40%</span></div> …
    </div>
    <figcaption>Share of 720 core postings. Multiple mentions allowed.<br><b>Source:</b> supplied project record, 16 Sep 2026.</figcaption>
  </figure>
  ```
  A centred bar adds `--x` to the fill and `<span class="ev-mid"></span>` to
  the track; the accent bar carries `data-accent`. The geometry custom
  properties are the only inline style on a page.

## 6. Tables

GitHub tables. Alignment colons become `align` attributes (right-aligned
columns set in mono, for figures); every table is wrapped in
`<div class="table-scroll">` so a wide table scrolls inside itself, never the
page.

```md
| Metric | Value |
|:--|--:|
| Rows | 1,240,991 |
```

## 7. Mathematics

- Inline `$p_1$`, display `$$ … $$` on their own lines, or a ` ```math `
  fence. KaTeX renders at build to **native MathML only** (`<math>`,
  `<math display="block">`; decision of 21 Oct 2026, design-system/README.md):
  no HTML layer, so no inline style, no KaTeX stylesheet and no KaTeX
  fonts; the page ships no math script and the browser lays the formula
  out. The TeX source stays in the MathML `<annotation>`.
- Display output: `<div class="math"><div class="math-body" tabindex="0"><math display="block">…</math></div><span class="eq-no">(01-04-1)</span></div>`.
  A long formula scrolls inside `.math-body` on a phone (MathML does not
  wrap); `tabindex="0"` keeps that scroll region reachable by keyboard.
- Display blocks are numbered per page in document order:
  `(<code>-1)`, `(<code>-2)` when the frontmatter has a `code`, else `(1)`,
  `(2)`. Never type a number.
- Prices are not math: `$5 and $10` stays text. Inline math must hug its
  dollars (`$x$`, not `$ x $`) and the closing `$` must not be followed by a
  digit. In a paragraph that holds both a price and inline math, escape the
  price: `\$5 while $x$ …`.
- A formula KaTeX cannot parse fails the build, naming the file.
- Script depth: the browser sets each script level about 0.71 times the
  size of the one above. The 12px floor (gate G-01) holds for one level: a
  sub- or superscript in a sentence or in a display formula (a display
  fraction keeps its full size, so its numerator may carry one). Two levels (a script on a script,
  `x_{i_j}`, or a script inside an inline fraction) fall below 12px and
  fail the gate.

## 8. Code

Fenced, always with a language: ` ```python `, ` ```js `, ` ```sql `,
` ```bash `; ` ```text ` for plain output. Inline code in backticks keeps the
light wash. Nothing inside a fence is rewritten. A language Prism does not
know is rendered as plain text under its own name (and never as HTML).

Each fence becomes the dark panel of D-035:

```html
<div class="code" data-lang="python" data-wrap="on">
  <div class="code-bar"><span>python</span><span class="code-tools">
    <button type="button" class="code-wrap" aria-pressed="true">Wrap · on</button>
    <button type="button" class="code-copy">Copy</button></span></div>
  <pre><code class="language-python">…</code></pre>
</div>
```

Wrap is on by default; the buttons work once `/scripts/code.js` loads
(`hasCode` on `Base`), and the block is complete without it.

**Syntax colours (for the stylesheet).** Prism runs at build with classes
only. `src/lib/rehype/code.mjs` rewrites each Prism token span to one of six
classes and unwraps the rest (they read as identifiers, `--code-ink`):

```text
Prism .token class                                   → class   → colour
comment, prolog, doctype, cdata, shebang             → tok-cm  → --code-ink-3, italic
keyword, boolean, atrule, rule, important, directive → tok-kw  → --code-kw
function, function-variable, class-name, builtin,
  decorator, annotation, tag, selector               → tok-fn  → --code-fn
string, char, template-string, triple-quoted-string,
  attr-value, regex, url, symbol                     → tok-str → --code-str
number, constant, unit, hexcode, entity              → tok-num → --code-num
operator, punctuation, attr-equals, arrow            → tok-op  → --code-ink-2
```

No `.token.*` selector is needed in CSS: the built HTML carries only the six
`tok-*` classes, and no style attribute.

## 9. Footnotes

`[^1]` in the text, `[^1]: …` at the end. They render as
`<section class="footnotes">` under a hairline, with ← back references; the
heading reads "Footnotes" or "Fußnoten" by `lang`.

## 10. Pipeline, in order

| Phase | Module | Job |
|---|---|---|
| mdast | `src/lib/remark/math.mjs` | keeps `$5 and $10` as text |
| mdast | `src/lib/remark/code-lang.mjs` | unknown fence language → plain text |
| mdast | `src/lib/remark/callouts.mjs` | `==mark==`, then the callouts |
| mdast | `src/lib/remark/callouts.mjs` | `[!bars]` → the evidence figure |
| hast | Prism (Astro) | class-based highlighting |
| hast | `src/lib/rehype/katex.mjs` | KaTeX, native MathML only |
| hast | `src/lib/rehype/tables.mjs` | `align` attributes, `.table-scroll` |
| hast | `src/lib/rehype/code.mjs` | the code panel, `tok-*` classes |
| hast | `src/lib/rehype/math.mjs` | `.math` / `.math-body` / `.eq-no` |
| hast | `src/lib/rehype/headings.mjs` | slug ids on h2 and h3 |
| hast | `src/lib/rehype/footnotes.mjs` | German footnote strings |
| hast | `src/lib/rehype/links.mjs` | the base path on root-relative links (only when `SITE_BASE` is set) |

Astro 7 renders Markdown with Sätteri, so these are Sätteri visitors rather
than remark/rehype plugins; they do the jobs of remark-math, rehype-katex and
the usual rehype passes.

The content layer caches each entry's rendered HTML and re-renders an entry
only when its file or `astro.config.mjs` changes. After editing a module
under `src/lib/remark/` or `src/lib/rehype/`, delete
`node_modules/.astro/data-store.json` before building, or the old output is
served. Diagrams (Mermaid at build) are not wired yet:
do not author ` ```mermaid ` fences until they are.
