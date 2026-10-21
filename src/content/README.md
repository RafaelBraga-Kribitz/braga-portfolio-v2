# Authoring guide · src/content

Every project, essay, note and legal page is one Markdown file, written so it
reads the same in Obsidian and on the site. The build turns it into the DOM
that `design-system/` styles; nothing in a file sets its own look. This guide
covers where files go, the frontmatter, the document order, and every
construct the pipeline understands. The collections are defined in
`src/content.config.ts`; the pipeline is in `astro.config.mjs` (`markdown`).

## 1. Files and ids

| Collection | Folder | One file per |
|---|---|---|
| `projects` | `src/content/projects/{en,de}/<slug>.md` | project, per language |
| `writing` | `src/content/writing/{en,de}/<slug>.md` | essay or note, per language |
| `legal` | `src/content/legal/{en,de}/<slug>.md` | legal page, per language |

- Markdown only (`.md`). No MDX, no components, no raw HTML in the body.
- The entry id is the path without the extension: `en/warehouse-humanoid-tco`.
  Fetch with `getEntry('projects', 'en/warehouse-humanoid-tco')` or
  `getCollection('projects', (e) => e.data.lang === lang && !e.data.draft)`.
- The frontmatter `slug` is shared by the English and German file of one
  document; it is how the two versions find each other. Lower-case kebab-case.
- The folder and `lang` must agree; a mismatch fails the build.
- Render with `const { Content, headings } = await render(entry)` inside
  `<article class="doc">`. `headings` lists every h2/h3 with its id; it also
  lists the footnotes heading (`slug: 'footnote-label'`): filter that one out
  of a contents rail.

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
metrics:                       # the metric strip under the opener
  - { value: "€453,000", label: Five-year cost, accent: true }  # at most one accent (D-025)
  - { value: "38 s", label: Cycle time }
repository: https://github.com/…   # optional, a full URL
draft: false                   # default false; drafts are not listed or built
translationStatus: approved    # approved | draft (default approved)
---
```

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

### legal

```yaml
---
title: Impressum
slug: impressum
lang: de
updated: "2026-10-20"
summary: Optional meta description.   # optional
draft: false
translationStatus: draft
---
```

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
- Links: `[text](/en/work/…/)` inside the site, full URLs outside.
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
  fence. KaTeX renders at build to HTML plus MathML; the page ships no math
  script.
- Display blocks are numbered per page in document order:
  `(<code>-1)`, `(<code>-2)` when the frontmatter has a `code`, else `(1)`,
  `(2)`. Never type a number.
- Prices are not math: `$5 and $10` stays text. Inline math must hug its
  dollars (`$x$`, not `$ x $`) and the closing `$` must not be followed by a
  digit. In a paragraph that holds both a price and inline math, escape the
  price: `\$5 while $x$ …`.
- A formula KaTeX cannot parse fails the build, naming the file.
- A page with mathematics links `/fonts/katex/katex.min.css` (self-hosted).

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
| hast | Prism (Astro) | class-based highlighting |
| hast | `src/lib/rehype/katex.mjs` | KaTeX, HTML + MathML |
| hast | `src/lib/rehype/tables.mjs` | `align` attributes, `.table-scroll` |
| hast | `src/lib/rehype/code.mjs` | the code panel, `tok-*` classes |
| hast | `src/lib/rehype/math.mjs` | `.math` / `.math-body` / `.eq-no` |
| hast | `src/lib/rehype/headings.mjs` | slug ids on h2 and h3 |
| hast | `src/lib/rehype/footnotes.mjs` | German footnote strings |

Astro 7 renders Markdown with Sätteri, so these are Sätteri visitors rather
than remark/rehype plugins; they do the jobs of remark-math, rehype-katex and
the usual rehype passes. Diagrams (Mermaid at build) are not wired yet:
do not author ` ```mermaid ` fences until they are.
