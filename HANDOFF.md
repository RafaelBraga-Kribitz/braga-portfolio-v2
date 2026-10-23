# HANDOFF — portfolio v2 build, state on 21 Oct 2026

Read this first, then `README.md` (run it locally), `BUILD-BRIEF.md` (the rules the build
follows) and `docs/PAGE-BRIEF.md` (the document template). The design decisions the
build implements are in `handoff/HANDOFF.md` §2 and §7 and `handoff/AUDIT.md` §5; those
files are the design handoff as received and are never edited.

## 1. Where things stand

The site builds as a static Astro 7 site with two language trees (`/en/`, `/de/`).

| Area | State |
|---|---|
| Design system (`design-system/*.css`) | Done. v2 tokens, theme model, foundations, shell, document, listing, charts, bench, print, Obsidian snippet. Reviewed once; confirmed findings fixed. |
| Chrome (`src/layouts/Base.astro`, `src/components/`) | Done. Shell with two-row strip below 768 and compact German strip below 360, footer with four groups, cover, section heading, listing, status squares, opener, contents rail, metric strip, evidence figure, end bar. |
| Markdown pipeline (`astro.config.mjs`, `src/lib/remark`, `src/lib/rehype`) | Done. Sätteri processor (Astro 7), Obsidian callouts, `bars` evidence figures, tables, D-035 code panels, numbered MathML maths, localised footnotes. Authoring guide: `vault/_guide/Syntax reference.md`. |
| Tools | Done. A/B sample size and confusion matrix as Preact islands, server-rendered default state, maths in `src/lib/tools/` with hand-computed tests. |
| Gates (`scripts/gates/`) | Done. Thirteen gates ported from `checks.js`, plus links, hreflang, script policy, inline styles, metadata and axe, at six widths in both themes; fixture self-test. |
| Routes | Done for every page in `BUILD-BRIEF.md` §4, plus 404, root redirect, sitemap, RSS, robots, favicon and share card. Base-path aware for GitHub Pages (`SITE_BASE`). |
| Content, EN | Drafted and fact-checked against the source files: five projects, About, the essay, home and Work index copy. Legal pages drafted (German verbatim from the Templates specimen); their fact-check was interrupted. Kitchen sink drafted. |
| Content, DE | Drafted by the authors and marked `translationStatus: draft` (status mark "Entwurf · Freigabe ausstehend"). **The German editing pass did not run** (see §3). |
| Integration of all pages, final review | **Not run** (see §3). |

Verification on the pushed state is in §5.

## 2. Decisions taken during the build

Each is recorded where it lives in the code; reverse any of them there.

1. **Reading width 60ch.** `--measure` and `--measure-doc` are both 60ch (open item O-02; the recommended default). One line in `design-system/tokens.css`.
2. **Maths output is MathML only**, not KaTeX HTML+MathML. The HTML layer writes inline styles, which the no-inline-style rule forbids; MathML needs no KaTeX stylesheet. Formulas use the reader's system maths font. Two script levels can fall below 12px (documented in `vault/_guide/Syntax reference.md`).
3. **Evidence figures are a `bars` callout in Markdown**, because documents are plain Markdown (no MDX, no raw HTML). Syntax in `vault/_guide/Syntax reference.md`.
4. **Metric strip from frontmatter `metrics`**, at the top of the article as in Site s04, not a `[!metrics]` callout in the body.
5. **Origin `https://rafaelbraga-kribitz.github.io`**, with an optional base path from `SITE_BASE` for a project-page deploy. Options and the GitHub Actions workflow are in `DEPLOY.md` and `.github/workflows/pages.yml`.
6. **Section padding** uses the handoff token `--section-pad` (64 / 96 from 768 / 128 from 1024).
7. **Metric strip stacks below 560px** (three columns cannot hold "€453,000" at 390px).
8. **Footer colophon**: the specimen's three lines, with the status line set to the build's true status; no © glyph (not in the D-030 inventory).
9. **Confusion-matrix presets**: three of v1's five scenarios (Churn, Fraud, Leads), re-expressed as rates; recorded in `src/lib/tools/confusion-matrix.mjs`.
10. **Mermaid is drawn at build** (since item 14): headless Chromium renders each diagram once into SVG in the site's tokens; the result is cached in `.cache/mermaid/` and committed, so CI needs no browser for diagrams it has seen.
11. **UX pass (owner, 22 Oct 2026, branch `ux/laws-pass`).** The site was reviewed against twenty interface laws and every recommendation was applied except the theme toggle, which stays as it is. **The accent rule changed from one per view (D-025) to one per section**: each section spends the accent on the one thing the reader should look at first, its earned figure or its primary action. `handoff/` is read-only, so the change is recorded here, in `BUILD-BRIEF.md` §3 and §6a, `design-system/README.md` and `tokens.css`, and enforced by the new gate G-15. The full list of changes is `BUILD-BRIEF.md` §6a. Project codes were renumbered (01-02 Decision analytics, 01-03 MMM, 01-04 Energy, 01-05 Warehouse TCO) so complete projects open and close the list.
12. **Owner feedback, 23 Oct 2026** (same branch): sticky glass header (the one blur); doors reordered to 01 Work · 02 Writing · 03 Tools · 04 About (tool codes 03-01, 03-02); a portrait frame on About (drop the photo at `src/assets/portrait.jpg`); the contact button splits into Copy / Open on hover and its address is drawn by CSS, never in the HTML; the contents rail marks the section in view; indentation reversed (section text from column 2, listing titles from column 4); footer order Site · Index · Others · Elsewhere. Rules in `BUILD-BRIEF.md` §3, §6 rule 3 and §6a.
13. **Keyboard navigation** (owner, 23 Oct 2026): single-key shortcuts and a `?` panel (`BUILD-BRIEF.md` §6a item 10), documented in the accessibility statement's new Keyboard section (EN and DE drafts). Footer links on mobile are 32px (the space between them no larger than the text), the one exception to the 44px targets.
14. **The content is an Obsidian vault** (owner, 23 Oct 2026, branch `obsidian/vault`): `src/content/` moved to `vault/`; a note is public only with `publish: true`; the title is the first `# heading`; a project's status is a `#status/…` tag; wikilinks, embeds (images, galleries, video, audio, files, notes), tags with tag pages, tasks, Mermaid, Dataview queries, covers, featured, SEO fields, scheduled publishing and related notes. Rules in `BUILD-BRIEF.md` §6b; the owner's guide is `vault/_guide/Start here.md`. Task lists are now allowed (squares with a spoken state, not checkboxes).

## 3. What is left, in order

1. **German editing pass** on every `/de/` document and the German chrome (`src/lib/i18n.ts`). The prompt the build used is the `german` stage in `docs/workflows/pages.workflow.js`: grammar and cases, Austrian forms (Jänner, de-AT numbers and dates, „ “ quotes), neutral formal register, meaning identical to EN, compounds that hyphenate at 320px.
2. **Fact-check of the legal pages** (interrupted): compare the German pages with `handoff/specimens/Design System v2 - Templates.dc.html` §02 and `handoff/HANDOFF.md` D-014; check the English translations match.
3. **Integration**: `npm run verify` end to end, every route in both languages, consistent titles/codes/statuses everywhere a project appears, screenshots of every page type at 1440, 768 and 320 in both themes. The integrator prompt is in `docs/workflows/pages.workflow.js`.
4. **Review**: the five lenses in the same file (facts, German, specimen fidelity, rules and accessibility, completeness against `handoff/HANDOFF.md` §4 A–F).
5. **Charts specimen rebuild** (handoff item A2): not part of this build.
6. **Kitchen sink**: the token table and type scale "read from tokens.css at build time" need a generated block in `src/pages/[lang]/system.astro`; Markdown cannot do it.
7. **Deploy**: choose an option in `DEPLOY.md`, enable GitHub Pages (Settings → Pages → Source: GitHub Actions). GitHub Pages on a private repository needs a paid plan; a public repository deploys on any plan.

Every open item the agents reported, including small engineering follow-ups, is in
`docs/handoff/agent-open-items.md`. The foundation review findings and how each was
handled are in `docs/handoff/foundation-review-findings.json` and in the `fix:foundation`
section of that file.

## 4. Decisions only Rafael can make

- **Approve or correct the German** (O-05): every DE document, the chrome strings, the footer group names (Index / Seite / Anderswo / Sonstiges) and the status vocabulary. Until then every German page shows "Entwurf · Freigabe ausstehend".
- **Approve agent-written copy without an owner source**: the home claims for Writing, About and Tools; the tool leads and limits; the share card line ("Marketing experience, translated into analytical work."); the kitchen-sink summaries.
- **BioSynCare**: the About page now writes that role in the past tense, "2023 – 2026", because a note of 6 Oct 2026 says it ended. Confirm the dates.
- **Styria postings**: the Site specimen says 54, the project source says 58. The page uses 58.
- **Tools status**: both tools are listed as "functional". Confirm.
- **Email**: the Gmail address is public on the site (open item 3: an alias would avoid spam).
- **Reading width** 60ch or 64ch (O-02), **English dash** spaced en dash (O-03, applied), **footer group "Others"** or "Notices" (O-04).
- **Legal texts** are drafts, not legal advice: a WKO or lawyer check, and the hosting choice (GitHub Pages in the USA or an EU host) before launch; the privacy notice names the host.
- **Deploy option** and domain (§3 item 7).
- **UX pass copy** (agent-written, 22 Oct 2026): the project close question ("Questions about this project, or a role where this kind of work fits?"), "Copy address" and its feedback lines, the bench field notes, "Named on request" for the withheld CV employers and institutions, and their German drafts. The reordered project codes too.

## 5. Verification of the pushed state

Run on exactly the tree pushed with this file, 21 Oct 2026:

| Command | Result |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 0 hints |
| `npm run lint` | passes (no inline styles; no hex outside tokens; 12px floor; class contract; contrast table) |
| `npm run test:unit` | 57 of 57 pass |
| `npm run build` | 36 pages built |
| `npm run test:gates` | 36 pages, 420 rendered contexts (6 widths × 2 themes, axe at 390 and 1280), 0 failing gates, no pending routes |

Green gates do not cover what §3 lists: German language quality, the legal fact-check,
and a human look at every page against the specimens.

## 6. Branches

- `main`: the integrated foundation (every gate green on the 10 pages that existed then) and the README.
- `build/pages`: everything since, up to this handoff. A draft pull request into `main` is open; merge it once §3 items 1–4 are done, or merge now and continue on `main` if you prefer.
- `ux/laws-pass`: the UX pass of §2 items 11–12, on top of `main`, in its own draft pull request so it can be merged or dropped as a whole (merged).
- `obsidian/vault`: the vault integration of §2 item 14, in its own draft pull request.

## 7. Continuing with Claude Code

Open a session on this repository and point it at this file. The two workflow scripts in
`docs/workflows/` are the exact orchestration used (builders, fact-checkers, German
editors, integrator, review lenses with sceptical verifiers); their prompts can be reused
step by step. They reference absolute paths of the cloud container
(`/home/user/braga-portfolio-v2`) and a scratch build folder: adjust both before reuse.
Agents must never build into `dist/` in parallel; each builds into its own folder with
`npx astro build --outDir <dir>`.
