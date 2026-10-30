# Syntax reference

Everything the site understands in a note, with the property names and the
syntax. Start with [[Start here]] for how publishing works. Every note
reads the same in Obsidian and on the site; nothing in a note sets its own
look (the design system does). The code: the collections in
`src/content.config.ts`, the vault reading in `src/lib/vault/`, the
Markdown pipeline in `astro.config.mjs`.

## 1. Folders and pages

| Folder | One note per | Page |
|---|---|---|
| `Projects/{en,de}/` | project, per language | `/<lang>/work/<slug>/` |
| `Essays/{en,de}/` | essay, per language | `/<lang>/writing/<slug>/` |
| `Notes/{en,de}/` | note of the library, per language | `/<lang>/notes/<slug>/`, listed on `/<lang>/notes/` by its folders |
| `Pages/{en,de}/` | About (`about.md`) and the kitchen sink (`system.md`) | `/<lang>/about/`, `/<lang>/system/` |
| `Legal/{en,de}/` | legal page, per language | by `page`: see below |
| `Attachments/` | images, video, audio, files | `/media/…`, only when a published note uses them |
| `_templates/`, `_guide/`, any `_folder` | nothing: never published | — |

- A note is on the site only with `publish: true`. Without it, it stays in
  the vault, wherever it is. A note dated in the future is published on its
  date (a daily build puts it online).
- Sub-folders inside a language folder are fine (`Notes/en/2026/…`). In
  `Notes/`, the folders are the library's index: `<area>/<topic>/<subtopic>/`,
  the area named with its number (`04_calculus_optimization`). On the site
  the library is flat and tagged, as Ghost publishes: `/<lang>/notes/`
  lists the areas, and each area's tag page lists its notes in reading
  order (folder order, then title), 24 a page, each coded by its place
  under Writing's second register: 02 Writing, 02-02 Notes, 02-02-001 the
  first note.
  Every folder a note sits in is also a tag of that note, next to its own
  tags: the area's short tag (`calculus`), then the topic's and the
  subtopic's title, kebab-cased (`differential-calculus`). Each tag has
  its archive page, `/<lang>/tags/<tag>/`, paginated the same way; a
  folder's tag reads as the folder's title there (`discrete_random_
  variables_drvs` → "Discrete random variables (DRVs)"; awkward names are
  written out in `src/lib/vault/folders.mjs`). Adding a note renumbers the
  notes after it.
- Two notes with the same file name in different folders collide on one
  URL: give one a `slug`. `npm run vault:check` names the pair.
- The **slug** (the URL) is the file name in lower-case kebab-case, unless
  the `slug` property says otherwise. The English and the German note of one
  document share it: that is how the two versions find each other. A note
  without a twin is fine: its page links to the other language's home.
- The language comes from the folder; a `lang` property, if set, must agree.

## 2. Properties

The **title is the note's first `# heading`**: the page shows it as the
page title (the h1), and the body continues with `##`. Dates are
`yyyy-mm-dd`, quoted (`"2026-09-16"`) or as Obsidian's date picker writes
them.

**Status** is a tag: `#status/complete`, `#status/functional`,
`#status/under-revision`, `#status/in-build`, `#status/archived`, in the
`tags` property or in the text. Change the tag, and the status square and
label change everywhere the project appears.

### Every note

```yaml
---
publish: true                  # on the site; without it the note stays private
date: "2026-09-16"             # published; a future date schedules it
updated: "2026-10-02"          # optional: "Updated 2 Oct 2026" in the meta row
tags: [status/complete, measurement]   # status/… is the status; the rest link to tag pages
summary: One sentence for listings and the meta description.   # notes: optional (the first paragraph stands in)
lead: The standfirst under the title.  # optional
slug: a-custom-url             # optional: the file name by default
aliases: [Other name]          # optional: [[Other name]] links here too
cover: photo.png               # optional: the cover image (and the share image)
cover_alt: What the photo shows
featured: true                 # optional: first in its listing
seo_title: A title for search  # optional overrides for search and sharing
seo_description: …
canonical: https://…           # optional: when the note first appeared elsewhere
draft: true                    # optional: keeps a published note offline
translationStatus: draft       # a German note until the owner approves it
---
```

### Projects

```yaml
code: "01-05"                  # section · item; listings sort by it
kind: case                     # case | brief
domain: Operations
metrics:                       # the metric strip under the opener
  - { value: "€453,000", label: Five-year cost, accent: true }  # at most one accent
  - { value: "38 s", label: Cycle time }
stack: [ "SQL", "Python", "DuckDB", "dbt" ]   # optional: the tools and methods the project uses
repository: https://github.com/…   # optional
```

`stack` lists the technical keywords the project actually uses (code,
dependencies, configuration), in the vocabulary of the job-market
project's skills taxonomy (`config/skills_taxonomy.json` in its
repository), most sought first. The Work listings show the first six,
boxed, two to a line (paired by length so the lines come out even),
before the arrow; the project page shows all of them as tags
under the lead; each keyword is a tag (`Power BI` → `#power-bi`) whose
page lists every project, essay and note that carries it.

The opener: trail `01 Work → <code>`, the title, `lead`, the stack tags,
the meta row (domain · status · Published · reading time · Updated ·
Repository ↗).
The page ends on the contact button and the repository link.

### Essays and notes

Writing has two categories with stable codes: **02-01 Essays** and
**02-02 Notes**. An essay's `code` is `02-01-` and a three-digit number,
given once and kept for good: the first essay is `02-01-001`, the next one
published takes the next free number (`code: "02-01-008"`). Without a
`code` the build numbers the essay by its date; write the code down when
you publish, so a back-dated essay can never shift the others. Lists show
the newest essay first; the number does not change with the list. A
three-group code is the longest the site uses, so inside an essay figures
are `Fig. 1 · …` and equations `(1)`. `kind` comes from the folder
(Essays → essay, Notes → note). Notes need no `summary`.

### Pages and legal

Pages: `slug: about | system`, `contentLang` optional. Legal: `page:
impressum | privacy | accessibility` gives the URL (`/de/datenschutz/`,
`/de/barrierefreiheit/`), and `updated` is the "As of" date.

## 3. Document order

Every project and essay follows one direction:

**question → data → method → result → limitations → decision**

One `##` section each, in that order. Limitations are stated before the
decision, never after it. Section numbers (01, 02, …) are drawn by the
stylesheet from the order of the `##` headings: never type them. Use `###` to
`######` for subsections. The note's first `#` heading is its title (the
page's only h1); a later `#` becomes `##`, and a skipped level (`##` then
`####`) is closed up on the page.

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
- `==text==` marks **the one earned figure** of a section (one accent per section, G-15): it renders
  as `<mark>` and is set in the accent (in a paragraph or list item; in a
  table cell it stays ink). At most one per section; never a word, never
  decoration; never in a heading (it stays literal there).
- No icons, no emoji, no inline style attributes, no raw HTML. Images,
  video and audio come from the vault (§ 11).
  Glyphs: → ↗ ← § · ▲ + − – … only (gate L-06 fails a page with any other
  symbol in its text: ©, ™, ✓, ★, an emoji; code and formulae excepted).
- Task lists (`- [ ]`, `- [x]`, and Obsidian's `- [/]` in progress, `- [-]`
  cancelled) show the status squares, not a checkbox (§ 11).

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
- A value that is one link and nothing else (an e-mail address) gets
  `dd.link-line`, the 24px target box (44 below 768, gate G-05). A bare
  e-mail address is linked by the parser anyway: write it as a link.
- The term column takes at most 40% of the row, then wraps. A one-word
  term longer than that (German: „Unternehmensgegenstand“) needs a break
  point: write a soft hyphen as `&shy;` (`Unternehmens&shy;gegenstand`).
  The same holds for a long word in a heading (`hyphens: manual`); in the
  title heading, paste the soft hyphen character itself (U+00AD).

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

**download** · one thing in several files, as one button: the title is the
face (in the accent, the section's one accent); each list item is a link to
a vault file, then an optional note after a dash. On hover or keyboard
focus the button splits into one cell per file (two to four files); each
file opens in a new tab, so the reader keeps the page.
```md
> [!download] Download the book
> - [[book.pdf|PDF]] — 15 MB
> - [[book.epub|EPUB]] — 6 MB
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

- The title is the kicker (`Fig. <code>-<n> · <subject>` in a project, `Fig. <n> · <subject>` in an essay); the first line
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
  - `accent: <label>` gives that one bar the accent (the earned bar: the figure's one accent, G-15).
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
`<div class="table-scroll" tabindex="0">` so a wide table scrolls inside
itself, never the page, and the keyboard can reach that scroll.

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
- Every formula, inline and display, is set in the accent (`--accent-01`)
  and bold (owner, 29 Oct 2026; D-048 amended). It does not count as the
  section's one accent (G-15), so a section can hold formulae and still
  spend its accent on an earned figure.
- Display output: `<div class="math"><div class="math-body" tabindex="0"><math display="block">…</math></div><span class="eq-no">(01-04-1)</span></div>`.
  The site never scrolls sideways (owner, 30 Oct 2026), and MathML does
  not wrap, so the build breaks a long formula itself: as written, then
  broken before its relations (=, ≤ …), separators (`\quad`), signs
  (+, −), at your own line breaks inside a product (shown with ×) and
  between the words of a `\text{…}`; each version is laid out aligned on
  its relations or flush left. The page carries the versions and shows the
  least broken one that fits the column at every width (container
  queries, no script). Where no version fits (a fraction, a
  `\left(…\right)` group or a `cases` block never breaks), the formula
  shrinks to the column, never below 13px. Gate G-17 fails a page where a
  formula is still wider than its column.
  To help: put a line break in the TeX where a long product may break;
  keep a very wide fraction or `cases` row short (name a part, define it
  after: `n = \lceil A^2/(p_1-p_0)^2 \rceil`, then `A = …`); a formula
  written with `\\` or `&`, or as an `aligned` block, is laid out as you
  wrote it and only shrinks.
- Display blocks are numbered per page in document order:
  `(<code>-1)`, `(<code>-2)` when the frontmatter has a two-group `code`
  (a project, `01-05`), else `(1)`, `(2)` (an essay: its `02-01-007` would
  make a fourth group). Never type a number.
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

The button labels follow the document's `lang` (German: „Umbruch · an“,
„Kopieren“; agent drafts); the labels `code.js` swaps in travel as
`data-on` / `data-off` and `data-label` / `data-copied` / `data-failed`.
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


With `footnotes: side` in a note's properties (the About page), footnotes become side notes: the number stays at the reference and the note hangs in the right margin beside its paragraph (from 1280px; on narrower screens it follows the reference in the text).

## 10. Pipeline, in order

| Phase | Module | Job |
|---|---|---|
| mdast | `src/lib/remark/math.mjs` | keeps `$5 and $10` as text |
| mdast | `src/lib/remark/code-lang.mjs` | unknown fence language → plain text |
| mdast | `src/lib/remark/diagrams.mjs` | ` ```mermaid ` → SVG at build; ` ```dataview ` → a list or a table |
| mdast | `src/lib/remark/buildlog.mjs` | ` ```buildlog ` → the build log of the note's project (`src/lib/activity/render.mjs`) |
| mdast | `src/lib/remark/obsidian.mjs` | the H1 title, `[[links]]`, `![[embeds]]`, `#tags`, `%%comments%%`, fields, tasks |
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
served (`npm run vault:check` and the Obsidian notes do not need this).

## 11. Obsidian

Write as Obsidian writes; the site follows.

| In the note | On the page |
|---|---|
| `# Title` | the page title (h1); `##` … `######` are h2 … h6 |
| `**bold**`, `*italic*`, `~~struck~~`, `==mark==` | bold, italic, struck through, the section's earned figure (accent) |
| `[[Note]]`, `[[Note\|text]]`, `[[Note#Heading]]`, `[[#Heading]]` | a link to the note's page (same language first) or a heading; a note that is not published shows as plain text |
| `![[photo.png]]`, `![[photo.png\|300]]`, `![[photo.png\|A caption]]` | a figure; a number sets the size (small ≤ 320, medium ≤ 560, else full), text the caption |
| two or more `![[image]]` in one paragraph | a gallery (two or three across) |
| `![[clip.mp4]]`, `![[talk.mp3]]` | video or audio from the vault, with controls |
| `![[file.pdf]]`, `![[book.epub]]` | a file card that opens the file (pdf, epub, zip, csv, xlsx, docx, pptx, txt) |
| `![[Other note]]` | a card linking to that note, with its summary |
| `![alt](photo.png "Caption")` | a figure, as `![[…]]` |
| a YouTube or Vimeo link alone on a line | a video card that links out (nothing loads from YouTube until the reader clicks) |
| `#tag` in the text | a link to the tag's page (`/en/tags/tag/`); `#status/…` and `#draft` are properties and disappear |
| `%% comment %%` | nothing: comments never reach the page |
| `key:: value` on its own line | nothing on the page; a Dataview field (queries can use it) |
| `[key:: value]` in a sentence | the value |
| `^block-id` | nothing |
| `- [ ]` / `- [x]` / `- [/]` / `- [-]` | □ to do / ■ done / ▤ in progress / struck-through cancelled |
| ` ```mermaid ` | the diagram, drawn at build in the site's colours; a first `%% line` names it for screen readers |
| ` ```dataview ` | the query's result (below) |
| ` ```buildlog ` (empty, in a project note) | the project's build log: a line on commits and pull requests, a calendar and a weekday × hour heatmap, and the lines written by kind, from the repository's git history (`npm run activity`); in Obsidian it stays an empty code block |
| `$x$`, `$$x$$`, ` ```lang `, `[^1]`, `> [!callout]`, tables, lists | as in §§ 4–9 |

**Dataview.** A ` ```dataview ` block runs at build over the published
notes of the note's language, and in Obsidian with the Dataview plugin:

```
TABLE domain AS "Domain", status, date
FROM "Projects" AND #marketing
WHERE status != "archived"
SORT date DESC
LIMIT 5
```

`LIST [field]` or `TABLE [WITHOUT ID] field [AS "Name"], …`; `FROM` takes
`#tag`, `"Folder"`, `[[Note]]` (notes linking to it), with `AND`, `OR`, `-`;
`WHERE` compares with `= != < <= > >=`, `contains(field, "x")`, `and`, `or`,
`!`; `SORT field [ASC|DESC]`; `LIMIT n`. Fields: any property, `title`,
`tags`, `status`, `kind`, `date`, `summary`, `file.name`, `file.folder`.
`FROM "Projects/de"` reaches the other language.

**Related.** Under every project and piece of writing, up to three related
notes, scored at build from shared words, tags and links. (Smart
Connections keeps its embeddings on each machine, so the build computes its
own.)

**External images** (`![](https://…)`) become links: the site loads nothing
from other servers.
