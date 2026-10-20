# PAGE BRIEF — content pages (phase 2)

Read `BUILD-BRIEF.md` first; this file adds what the page builders need. The foundation
(stylesheets, Base layout, components, content pipeline, tools, gates) exists; read
`design-system/README.md`, `src/content/README.md`, `src/layouts/Base.astro`,
`src/lib/{routes,i18n,site}.ts` and the components under `src/components/` before writing.

## The document template (projects, essay, legal, 404)

The production form of a document is the kitchen-sink article in
`handoff/specimens/Design System v2 - Audit.dc.html` (search for `id="ks"`; it is filled with
the Warehouse humanoid TCO case). Reproduce that vocabulary, in this order, in markdown that the
content pipeline turns into the same DOM:

1. Opener (generated from frontmatter by the page): trail `01 Work → 01-04`, h1, lead, meta row
   (domain · status mark with label · Published d Mon yyyy · Updated d Mon yyyy · Repository ↗).
2. `> [!summary] Summary` — two sentences: the result and the decision.
3. `> [!metrics] Key figures` — three or four figures; exactly ONE carries `==value==` (the
   earned accent figure, the headline number).
4. `## Question` — one paragraph; the unit of comparison stated.
5. `## Data` — sources, counts, provenance; optional `> [!aside]`; a `> [!spec]` list of the
   model inputs ("Term — value" items).
6. `## Method` — an ordered list of steps; optional `> [!definition] Term`; a short code block
   only where the source has one worth showing.
7. `## Result` — an evidence figure (the `EvidenceFigure` pattern: kicker `Fig. 01-04-1 · …`,
   finding as the heading, ink bars on a mid baseline, caption with n, scale, source), a table,
   a `> [!quote]` with the one-sentence result.
8. `## Limitations` — a bullet list, honest; footnotes allowed.
9. `## Decision` — one paragraph; optional `> [!faq]- What would reverse the decision?`.
10. `> [!bookmark] Next` — the next project; `> [!cta]` — the repository link; the end bar
    (generated: § END · ← All projects · next →).

Numbers: every figure in the document comes from the source MDX in
`handoff/source-content/content/projects/<slug>.mdx` (or the essay/about files). Never invent a
number. Where the Site specimen and the source MDX disagree (e.g. Styria 54 vs 58 postings), use
the source MDX and list the disagreement in your report for the owner. Format every figure with
`src/lib/format.mjs` conventions (NBSP before units, real minus, en dash ranges, language
separators).

Mapping from the source MDX (v1 structure) to v2: `<Lead>` → lead and summary; the opening
question → Question; `Context` → Data; `Process` → Method; `Results` → Result; the
"What this does not establish" list → Limitations; the recommendation sentence → Decision;
`<MetricGrid>` → the metrics callout (its `accent: true` item is the `==value==`); the closing
repository link → cta; the markdown table stays a table. Status comes from BUILD-BRIEF.md §4,
not from the MDX (`live` there is v1 vocabulary).

Evidence figures are HTML, not markdown: author them as an `EvidenceFigure` component inside an
MDX document, or as markdown `figure` blocks the pipeline supports — follow `src/content/README.md`.
Bars scale 0–100% of the stated scale; a "mid" figure (change around zero) centres on 50%.

## German pages

Every EN page has a DE twin at the route in BUILD-BRIEF.md §4. German documents are agent drafts:
frontmatter `translationStatus: draft`, and the opener's meta row shows the status mark
`in-build` with the label "Entwurf · Freigabe ausstehend" (from i18n). Use formal, neutral
business German; keep technical terms Austrian practitioners use in English (ROAS, Adstock, MMM)
with a German gloss in parentheses on first use; Austrian number and date forms (`1.234,56`,
`16. Sep. 2026`, Jänner); „ “ quotes; keep every number identical to the EN page. Long-form text
you are unsure about gets a `[?]` marker only in your report, never in the page.

## Page-specific notes

- **Home**: refine the integrator's skeleton; copy for the four section claims comes from the
  Site specimen s03 (Work) and `handoff/source-content/content/data/home.yaml` (Writing, About,
  Tools lead sentences, rewritten to one sentence each; "Marketing Data Scientist" → the v2 role).
- **Work index**: section heading "01 · Work" + "A decision. Its evidence." + listing of five +
  the status vocabulary block (five states with their one-line uses from the Site specimen).
- **01-01 Austria**: figures from the Site specimen s05 (skill mentions SQL 40, Python 35, Azure 19,
  Power BI 18, Tableau 3 of 720; region Styria vs other; annual flow Austria −28% / Styria +34%
  on a centred scale) checked against the MDX.
- **01-02 AMBO**: status under-revision; say plainly in the summary what is being revised if the
  MDX says so; otherwise state "Under revision: the published figures are being re-estimated."
- **01-03 Decision analytics**: status functional; the three modules as the Data/Method spine.
- **01-04 TCO**: the kitchen-sink article is this project; reuse it (it is already v2-correct),
  with the MDX's full table of seven scenarios.
- **01-05 Energy**: status in-build; the Result section states what exists (ingest, warehouse,
  gates) and what does not (strategy results, P95/CVaR); no invented results.
- **About / CV**: from `data/about.yaml` + `data/profile.yaml`. Role line "Marketing Data
  Analyst" (D-01). The narrative's "currently at BioSynCare" is stale (owner note 2026-10-06:
  that role has ended): write the first paragraph in the past tense for that role and set the
  experience row to "2023 — 2026"; flag both in the report. Keep the honest placeholder rows
  ("Employer named when the CV is attached") as authored. Sections: Background (with the
  Paraguay footnote as a footnote), Expertise & Approach, Skills (spec callout per category), CV
  (a table: dates · role · organisation), Contact (the statement, the mailto as a cta). No
  "Download CV" link (no PDF exists yet).
- **Writing**: index with the one essay (02-01) and a note on the two registers (essays, notes)
  from home.yaml; the essay page from `writing/blog/ai-prospecting-vendor-3x-lift.mdx` converted
  to the document vocabulary (h2s stay as authored; the four conditions become the Result
  section's structure only if natural — otherwise keep the author's headings verbatim); DE draft.
- **Tools**: pages exist (Agent D); add the index copy and check the trail/meta against the
  template; DE labels in the islands' dictionaries.
- **Legal (DE primary)**: Impressum und Offenlegung, Datenschutzerklärung, Erklärung zur
  Barrierefreiheit verbatim from the Templates specimen s02 (including the "Entwurf" status and
  the note callouts); EN versions as translations with the same structure; hosting named as
  GitHub Pages as the drafts say.
- **Kitchen sink `/system/`** (noindex): every authoring element once (the kitchen-sink article
  verbatim as the example), the shell at each width as text notes, the status vocabulary, the
  type scale and the token table read from `design-system/tokens.css` at build time, a
  light/dark note. The same page in DE with German chrome (content may stay English with
  `lang="en"`).
