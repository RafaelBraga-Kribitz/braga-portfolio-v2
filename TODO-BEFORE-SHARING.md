# Before the site is shared: what is missing or needs improvement

Inspection of 1 Nov 2026, on branch `claude/website-inspection-numbering-kp6bes`
at the state merged into `main` as PR #31 (Writing numbering, tags at scale). Every item below
was checked against the tree, the build and the automated checks on this date;
nothing is carried over from an older report without being re-verified. Sources
that fed this list: `HANDOFF.md` §3–4, `docs/audit/website-manual-actions.md`
(27 Oct), `docs/editorial/2026-11-01-impeccable-critique.md`, and
`docs/handoff/agent-open-items.md`, each re-checked against the code.

**Execution update, 1 Nov 2026:** The baseline tables and original inspection
below describe the PR #32 starting tree, not the revised tree. See
`docs/audit/2026-11-01-sharing-readiness.md` for current evidence and remaining
blocks. A later live HTTP check returned 200 for `/en/tags/`; the earlier claim
that it was absent is not a verified current observation. A local fix or a 200
response does not prove which commit was deployed. German and legal drafts are
not approved by engineering changes. CV/facts-bank work is deferred to section 12.

Legend: **[Owner]** only Rafael can decide or supply the fact · **[Eng]** code or
content change anyone can make · **[QA]** a check with a browser or a device.
Tick the box when the item is done *and* verified the way the item says.

## 0. What already passes (baseline on this tree)

| Check | Result on 1 Nov 2026 |
|---|---|
| `npm run lint` | passes (no inline styles, no hex outside tokens, 12px floor, class contract, contrast table, tokens.json in step) |
| `npm run test:unit` | 94 of 94 pass |
| `npm run vault:check` | 557 notes, 552 published, 0 errors, 0 warnings, 8 notes (6 essays without a DE version, 2 unpublished-link notes) |
| `npm run build` | 827 pages, no warnings |
| `npm run check` | **1 error** (item 1.1), 6 hints |
| `npm run test:gates` | 827 pages, 2,272 rendered contexts, 0 failing gates (section 10) |
| `npm audit --omit=dev` | 2 low (katex via mermaid, build-time only; item 7.9) |

---

## 1. Blockers: the build and the deploy pipeline

- [ ] **1.1 [Eng] `astro check` fails on `main`, so the Pages deploy is red and
  the live site is behind.** PR #31 (the Writing numbering and the tags
  catalogue) was merged on 1 Nov 2026 at 21:27 UTC; the "Deploy to GitHub
  Pages" run 43 on that merge failed, so `rafaelbragakribitz.com` still
  serves the state of PR #30 (no tags catalogue, old Writing numbering) and
  the daily 04:43 UTC build will keep failing. Cause: `src/lib/tags.ts:57` reads
  `process.env.TAGS_LETTER_PAGES_FROM`; the project has no Node type
  definitions, so TypeScript reports `ts(2580) Cannot find name 'process'`.
  Fix (one of): read it as `import.meta.env.TAGS_LETTER_PAGES_FROM` (Vite
  exposes it at build), or guard with `globalThis.process?.env`, or add
  `@types/node` to the dev dependencies. Verify: `npm run check` prints
  `0 errors`; then `npm run verify` end to end; then the next Pages run on
  `main` is green and `/en/tags/` is live.
- [ ] **1.2 [Eng] Clear the six `astro check` hints** (unused symbols:
  `push` in `src/lib/remark/obsidian.mjs:133`, `mediaKind` import in the same
  file line 32, `KEYWORDS` in `src/lib/vault/dataview.mjs:44`, `all` in
  `src/lib/vault/mermaid.mjs:91`). Verify: `npm run check` prints `0 hints`.
- [ ] **1.3 [Eng] After 1.1 is merged, watch the "Deploy to GitHub Pages" run
  go green** (Actions tab). The run installs Chromium and runs the full
  gates, so it takes several minutes. Verify: the run's deploy job shows the
  page URL and `https://rafaelbragakribitz.com/en/tags/` shows the new tags
  index. (This checklist itself is PR #32, one Markdown file; merging it
  triggers a run too.)
- [x] **1.4 [Eng] Gates on the full build.** `npm run test:gates` over the 827
  pages: 0 failing gates on 1 Nov 2026 (section 10). Re-run after every change
  in sections 2–5; any red gate is a blocker.
- [ ] **1.5 [Eng] Five templates hard-code the German draft mark instead of
  reading `DRAFT_LANGS`:** `src/pages/[lang]/work/index.astro:38`,
  `writing/index.astro:48` and `tools/index.astro:49` render the mark on
  `lang === 'de'`; `tools/ab-sample-size.astro:44` and
  `tools/confusion-matrix.astro:44` pass `draft={lang === 'de'}`. When the
  German is approved (section 3) and `DRAFT_LANGS` is emptied, those marks
  would stay. Switch them to `isDraftLang(lang)`. Verify: after emptying
  `DRAFT_LANGS` locally, `grep -r "Entwurf · Freigabe" dist/` returns nothing.

## 2. Blockers: the legal pages (live on the site with drafting notes)

All six pages (`vault/Legal/{de,en}/{impressum,privacy,accessibility}.md`) are
published and still carry text written for *before* publication. Edit the German
originals first, then the English translations, then set
`translationStatus: approved` on both.

- [ ] **2.1 [Owner] Impressum, DE and EN: remove the closing note** "Entwurf.
  Vor Veröffentlichung Prüfung der Offenlegungspflichten (WKO) empfohlen. Keine
  Rechtsberatung." / "Draft. A check of the disclosure obligations (WKO …) is
  recommended before publication. Not legal advice." Decide first whether to
  ask the WKO (or a lawyer) once about MedienG §25 / ECG §5 for a
  non-commercial portfolio used for job seeking; the Impressum currently calls
  the site "private, non-commercial, no goods or services".
- [ ] **2.2 [Owner] Privacy, DE and EN, "Hosting" section:** the sentence "die
  Zertifizierung unter dem EU-US Data Privacy Framework wird vor
  Veröffentlichung geprüft" / "certification under the EU-US Data Privacy
  Framework will be checked before publication". Look up GitHub, Inc. on
  <https://www.dataprivacyframework.gov/list>; if listed, state the transfer
  basis (adequacy decision of 10 Jul 2023); if not, name the safeguard
  (standard contractual clauses in GitHub's terms).
- [ ] **2.3 [Owner] Privacy, DE and EN: remove the closing note** "Entwurf,
  keine Rechtsberatung. Offen (Punkt 5 der Checkliste): ein EU-Host oder ein
  Auftragsverarbeitungsvertrag …" / "Draft, not legal advice. Open (item 5 of
  the checklist) …". The host decision is made (GitHub Pages, custom domain,
  `DEPLOY.md`), so the note is stale.
- [ ] **2.4 [Owner] Privacy, DE and EN, "Contact" section: name who receives
  the mail.** `hello@rafaelbragakribitz.com` is an easyname alias of
  `rafael@rafaelbragakribitz.com` and may be forwarded to Gmail (`DEPLOY.md`
  "Email"). Name easyname GmbH (Vienna) and, if forwarding is on, Google, as
  the providers that process the mail. Decide whether the Gmail forwarding
  stays on; the wording follows that.
- [ ] **2.5 [Owner] Accessibility, DE and EN, "Testing" block:** the line
  "Vorgesehen — Ein Durchgang mit Screenreader (NVDA) vor Veröffentlichung" /
  "Planned — One pass with a screen reader (NVDA) before publication". Do the
  pass (item 8.3), then rewrite the line as a fact with the date and the
  screen reader used, or delete it.
- [ ] **2.6 [Owner] Accessibility, "Manual — Keyboard operation of every tool;
  zoom to 200%":** nothing in the repository records that this was done.
  Either do it (items 8.2 and 8.6) and keep the line, or delete it.
- [ ] **2.7 [Eng] Refresh the `updated:` dates** (now `2026-10-20` and
  `2026-10-23`) and the closing sentence of the accessibility statement
  ("Prepared on 20 Oct 2026, updated on 23 Oct 2026") when the texts change.
- [ ] **2.8 [Eng] After 2.1–2.7:** set `translationStatus: approved` in all six
  files; rebuild; `grep -ri "before publication\|vor Veröffentlichung\|Entwurf\.\|^> Draft" dist/en/impressum dist/en/privacy dist/en/accessibility dist/de/impressum dist/de/datenschutz dist/de/barrierefreiheit` returns nothing.

## 3. Blockers: the German tree

Every `/de/` page shows "Entwurf · Freigabe ausstehend" (`DRAFT_LANGS = ['de']`
in `src/lib/i18n.ts`). The German editing pass planned in `HANDOFF.md` §3 item 1
has still not run. Until it does, sharing the German URLs is sharing a draft.

Decide first: **[Owner] 3.0 Share the English tree only for now, or finish the
German first?** If English only, items 3.1–3.6 can wait, but 3.7 and 3.8 cannot
(the language toggle is on every page).

- [ ] **3.1 [Owner] German editing pass on the content**, one file at a time,
  side by side with the English (meaning and every figure identical; Austrian
  forms; „ “ quotes; de-AT numbers and dates; compounds that break at 320px):
  - [ ] `vault/Projects/de/austria-data-job-market-intelligence.md`
  - [ ] `vault/Projects/de/decision-analytics-reconstruction.md`
  - [ ] `vault/Projects/de/austrian-mmm-budget-optimizer.md`
  - [ ] `vault/Projects/de/energy-procurement-risk-analyzer.md`
  - [ ] `vault/Projects/de/warehouse-humanoid-tco.md`
  - [ ] `vault/Essays/de/ai-prospecting-vendor-3x-lift.md`
  - [ ] `vault/Pages/de/about.md` (also decide "Über" versus "Über mich" as the h1)
  - [ ] `vault/Pages/de/system.md` (noindex, lower priority)
  - [ ] the three `vault/Legal/de/*.md` (with section 2)
- [ ] **3.2 [Owner] German chrome strings:** the `de` block of
  `src/lib/i18n.ts` (about 140 keys: doors, footer groups "Index / Seite /
  Anderswo / Sonstiges", status words, the keys dialog, notes and tags
  strings, pagination, the tool no-script line). Read them on the built pages,
  not only in the file.
- [ ] **3.3 [Owner] German tool copy:** `src/lib/catalogue.ts` (rows and
  prose), `src/pages/[lang]/tools/*.astro` (titles, leads, meta), the island
  strings in `src/components/tools/*.tsx` and the verdict sentences in
  `src/lib/tools/*.mjs` (preset names stay English; "PP" for Prozentpunkte;
  the verdict drops the article, as the builders noted).
- [ ] **3.4 [Eng] Set `translationStatus: approved`** in every DE note that
  passed 3.1; empty `DRAFT_LANGS` in `src/lib/i18n.ts`; keep gate L-07's
  `--draft-langs` in step (`scripts/gates/checks.mjs`); fix item 1.5 first.
  Verify: no "Entwurf · Freigabe ausstehend" anywhere in `dist/`; gates green.
- [ ] **3.5 [Owner] The share card is English only and is used on German pages
  too** (`scripts/assets/build-assets.mjs`, `COPY.line`). Accept, or render a
  German card and pick it in `src/layouts/Base.astro` by `lang`.
- [ ] **3.6 [Owner] The German notes library is English under German chrome:**
  `/de/notes/`, `/de/tags/` and the German home's "02-02 Notes" row fall back
  to the English notes (`NotesLibrary.astro` `textLang`, `libraryOf('en')` in
  `index.astro` and `writing/index.astro`). Accept as is, add one line of
  German saying the library is in English, or hide the row on `/de/`.
- [ ] **3.7 [Owner] Six of seven essays exist in English only**, so the German
  Writing page lists one essay, and the "Deutsch" link of those six essays
  lands on the German home (`vault:check` info). Choose: translate them
  (schedule), or make the language link on an EN-only document say "English
  only" (or go to `/de/writing/`), or hide it there. Verify: click "Deutsch"
  on `/en/writing/growth-without-value/`.
- [ ] **3.8 [Eng] Whatever 3.7 decides, the `hreflang` pairs must stay
  truthful.** Today they are: an EN-only essay declares only `en` and
  `x-default` (checked in `dist/en/writing/growth-without-value/`), and only
  the header's language link (`.shell-lang`, `href="/de/"`) is the problem.
  Gate L-05 checks the pairs; keep it green after the change.

## 4. Blockers: facts and claims only the owner can settle

- [ ] **4.1 [Owner] The About page's CV has one row** (BioSynCare, 2023–2026),
  while the page talks about founded startups, a presidential campaign, and
  the essay says "twenty years buying marketing technology". Both the audit
  (MA-02) and the critique (P1) flag that a hiring manager leaves without a
  timeline. Supply dated rows (ventures, the 2018 campaign, education; the
  source `handoff/ds-update/cv/braga-cv.tex` exists) **or** a CV download via
  a `[!download]` callout (the `.file-split` pattern, D-057) **or** retitle
  the block "Recent role". Edit `vault/Pages/en/about.md` and the DE twin.
- [ ] **4.2 [Owner] Confirm the BioSynCare dates 2023–2026 and the past tense**
  ("I worked as …"). The end year comes from a note of 6 Oct 2026, not from
  any source file.
- [ ] **4.3 [Owner] Election figures, three places, one wording.** The About
  footnote calls 46.43% v 42.73% the "official count of the electoral
  tribunal, TSJE"; the project page `decision-analytics-reconstruction.md`
  calls the same figures "the final results of the electoral tribunal"; the
  Paraguay essay gives vote totals and "about 3.70 percentage points". The
  audit (MA-03) notes these match the TSJE *preliminary* count, while the
  final tally of valid votes is usually cited as 48.96% v 45.08%. Check the
  TSJE source once, then use one label everywhere ("preliminary count (TSJE)"
  or the final figures). Files: `vault/Pages/{en,de}/about.md`,
  `vault/Projects/{en,de}/decision-analytics-reconstruction.md`,
  `vault/Essays/en/paraguay-2018-campaign-to-decision-analytics.md`.
- [ ] **4.4 [Owner] "Part of the campaign that helped elect Mario Abdo
  Benítez"** (About, both languages) and **"twenty years buying marketing
  technology"** (AI-prospecting essay, both languages): keep the evidence at
  hand (a role, a reference) and make the years consistent with the CV of 4.1.
- [ ] **4.5 [Owner] Job-market project: the page describes the 16 Sep 2026
  snapshot (720 postings, 58 in Styria)** while the repository has moved to
  18 Oct 2026 (699 postings), as the page's own "Snapshot date" note says.
  Decide: update the page's figures and figures' captions to the new release,
  or keep the dated snapshot and the note. Either way the home row, the Work
  row, the metric strip ("720"), the JSON-LD description and the DE twin must
  agree. (Also the old 54-versus-58 Styria question is settled at 58 here;
  confirm.)
- [ ] **4.6 [Owner] Order of the projects.** 01-01 is the Austrian data-job
  market study, the one project whose subject is the author's own job search;
  the critique suggests the MMM (01-03) or the decision-analytics
  reconstruction (01-02) would lead better for a hiring manager. Renumbering
  changes `code:` in ten project files, every trail, and the figure numbers
  `Fig. 01-0N-k`; decide once.
- [ ] **4.7 [Owner] Essay dates: six of seven essays carry `date: 2026-10-30`**
  (the bulk upload date). "Newest first" is then unverifiable and the archive
  reads as one dump. Set the real written dates in `date:`, or add an
  `updated:`/written field and show it. Files: `vault/Essays/en/*.md`
  (RSS `pubDate` and JSON-LD `datePublished` follow automatically).
- [ ] **4.8 [Owner] Tools status:** both benches are listed "Functional"
  (`src/lib/catalogue.ts`). Confirm, or choose "Complete".
- [ ] **4.9 [Owner] Agent-written copy with no owner source, still unapproved**
  (read each on the built page, then approve or rewrite):
  - [ ] home: the Writing prose, the About claim/prose/contact line, the Tools
    claim/prose (`src/pages/[lang]/index.astro`, `copy`)
  - [ ] the share-card line "Marketing experience, translated into analytical
    work." and foot "Evidence before claims" (`scripts/assets/build-assets.mjs`)
  - [ ] the tool leads, meta rows and limit sentences
    (`src/pages/[lang]/tools/*.astro`, `src/components/tools/*.tsx`)
  - [ ] the project close question "Questions about this project, or a role
    where this kind of work fits?" and the mail subject "About {title}"
    (`src/lib/i18n.ts` `contact.*`)
  - [ ] "Copy" / "Copied" / "Use Open" on the contact button (`src/lib/contact.mjs`)
  - [ ] the kitchen-sink page summaries (`vault/Pages/en/system.md`, noindex)
  - [ ] the Writing index sub line "Newest first. The code beside the date is permanent."
- [ ] **4.10 [Owner] Metric-strip accents:** MMM spends its accent on "+45%"
  (platform over-credit) rather than the 15.1% gain; Energy (in build) shows
  three scope facts with no accent. Keep or change (`metrics:` in the project
  notes).
- [ ] **4.11 [Owner] Location wording:** the home cover says "Greater Graz,
  Austria" (`src/lib/site.ts`), the About profile "Seiersberg, Greater Graz,
  Austria". Pick one.
- [ ] **4.12 [Owner] Portrait rights:** confirm the photo at
  `src/assets/portrait.webp` is yours to publish; add a photographer credit on
  the About page if someone else took it. Check the `alt` text on
  `/en/about/`.
- [ ] **4.13 [Owner] Book download** (`vault/Attachments/b2b-saas-funnel-book.pdf`
  15 MB, `.epub` 5.9 MB, linked from the Quantitative growth Part 4): confirm
  these are the final manuscript edition and that publishing them is intended;
  a 15 MB tap on a phone is a decision in itself.

## 5. Should fix before sharing: open UX and design items (critique of 1 Nov 2026)

Each was re-checked against the current tree; "done" items are not listed.

- [ ] **5.1 [Eng] Area and topic archives are still framed as tag archives.**
  A Notes row ("Foundations · 70 notes") lands on `/en/tags/foundations/`,
  whose trail and heading are the tag archive's, not "02 Writing → 02-02
  Notes → Foundations". Give library archives a Notes-framed trail and head
  (`src/pages/[lang]/tags/[...tag].astro`). Verify at `/en/notes/` → any area.
- [ ] **5.2 [Eng] The subtopic names on `/en/notes/` are plain text** (the
  `sub` line of each area row is `topics.join(' · ')`,
  `src/components/NotesLibrary.astro:34`). Make each topic a link to its
  archive, as the tags index now does with chips (`TagChips`).
- [ ] **5.3 [Eng] Writing index:** the essays listing and the one-row Notes
  listing start their title column at different x; a "02-02 Notes" head sits
  over a single row that repeats the label. Replace the second listing with a
  forward-link row under the essays (`src/pages/[lang]/writing/index.astro`).
  Verify at 1280 and 390.
- [ ] **5.4 [Eng] Home, 02 Writing:** the two register rows ("02-01 All 7
  essays", "02-02 Notes") look like essays six and seven. Give register rows
  a distinct style (a listing variant in `design-system/components.css`
  section 1), keeping gate G-15.
- [ ] **5.5 [Eng] Mobile home order:** below 768 the "00 / Portfolio" kicker
  renders after the cover button as an orphan; below 720 "All 5 projects →"
  precedes the list it summarises; the two-row shell (102px) stays sticky on
  a 17-minute read. Hide or move the cover index below 768; put forward links
  after their listing below 720; keep only the top bar sticky
  (`design-system/layout.css`, `.cover`, `.section-heading`, `.shell`).
  Verify at 390 × 844 in both themes, and gates G-05/G-06.
- [ ] **5.6 [Eng] Essay end bar direction.** With the list newest first,
  `nextOf()` (`src/lib/collections.ts:87`) returns the *older* essay, and the
  end bar labels it with an arrow as "next"; `n`/`p` and `rel=next/prev` follow
  the same list. Decide the reading direction (older = next is fine for a
  register) and say it in the label ("Older · 02-01-003 …" / "Newer"), in EN
  and DE (`src/pages/[lang]/writing/[slug].astro`, `DocEnd.astro`, i18n).
- [ ] **5.7 [Eng] 404 voice:** "we've discovered something new", "MODEL STATUS /
  WORKING AS INTENDED" are in a voice the rest of the site never uses.
  Rewrite in the first person singular (`src/pages/404.astro`). The page is
  English with one German line; fine for a 404, but the line should get the
  same edit.
- [ ] **5.8 [Owner] Footer colophon "Greater Graz, Austria · EUR":** the "EUR"
  is unexplained (it is the handoff's currency marker). Drop it or explain it
  (`src/components/Footer.astro`).
- [ ] **5.9 [Eng] Hyphenation:** the hero lead hyphenates ("alloca-tion") and
  essay bodies hyphenate aggressively on phones ("be-cause", "particu-larly").
  `hyphens: manual` on `.cover-lead` (and `.display`, already manual for
  headings in `design-system/base.css:161`); consider `hyphenate-limit-chars`
  on `.doc p` where supported. Verify at 320 and 390 that G-06 (no overflow)
  stays green.
- [ ] **5.10 [Eng] `.lr-title-main` line-height 1.14** wraps to 2–3 lines on
  phones (`design-system/components.css:108`). Use 1.2 below 720 for wrapped
  titles.
- [ ] **5.11 [Owner] Footer links are 44 × 32 px below 768** (deliberate
  exception recorded in `design-system/layout.css:224`). Keep the exception,
  or make them 44px and accept the longer footer.
- [ ] **5.12 [Eng] The home contact button's static state disagrees with its
  label:** `a.mail-split-open` points at `/en/about/#contact` while its
  accessible name is "Write an email" (`src/components/ContactActions.astro`,
  `src/lib/contact.mjs`); the mailto is attached by script. Give the no-JS
  state a truthful name, and keep the accent on the face after a tap (the
  critique saw it "switch off").
- [ ] **5.13 [Eng] Theme button has no `aria-pressed`** (`src/components/Shell.astro`;
  the label carries "· Dark"/"· Light" instead). Add `aria-pressed` kept in
  step by the shell script in `src/layouts/Base.astro`, or document why not.
- [ ] **5.14 [Owner] Formulas are set bold in the accent** (D-048) and inside a
  table read as links. Keep (owner's rule of 29 Oct) or soften in tables only.
- [ ] **5.15 [Eng] Near-duplicate notes with bad slugs:**
  `vault/Notes/en/…/arithmetic_n_th_term.md`, `arithmetic_n_th_term_2.md` and
  `arithmetic_hmtbcth_term.md` ("hmtbcth" is a garbled title);
  `jacobian_matrix` / `jacobian_matrix_f`; `unemployment_rate` /
  `unemployment_rate_delta_ue`. Merge or retitle so each slug is a real name.
  `vault:check` must stay at 0 errors (links to the removed note).
- [ ] **5.16 [Eng] Thin tag pages:** 19 tag archives per language hold one
  entry. Add `noindex` below two entries in
  `src/pages/[lang]/tags/[...tag].astro`, or accept.
- [ ] **5.17 [Eng] Seven `<title>`s run past 70 characters** (all maths notes,
  e.g. "Projection of x onto 1D subspace (line) U spanned by b · Rafael
  Braga-Kribitz", 78). Add `seo_title:` to those notes.
- [ ] **5.18 [Eng] Codes and ranges break at the hyphen in running text**
  ("01-" / "04", "0.50–" / "0.90" at 390). Wrap codes in a nowrap span in the
  pipeline, or use U+2011 in the vault.

## 6. Documentation that misleads a reader of the repository

- [ ] **6.1 [Eng] `HANDOFF.md` is the state of 21 Oct 2026** (36 pages, no
  custom domain, "integration not run", branch names `build/*`). Either add a
  dated "State on <date>" block at the top that points here, or rewrite §1,
  §3, §5 and §6. The reader who only opens `HANDOFF.md` gets a wrong picture.
- [ ] **6.2 [Eng] `README.md` "How work flows"** says cloud work goes to
  `build/*` branches; the branches are `claude/*`. One line.
- [ ] **6.3 [Eng] `BUILD-BRIEF.md` line 60 and `handoff/HANDOFF.md` line 35**
  still state the Gmail address as the site's email; the site uses
  `hello@rafaelbragakribitz.com`. `handoff/` is read-only by rule, so add the
  correction to `design-system/DECISIONS.md` or `HANDOFF.md` §2 and fix the
  BUILD-BRIEF line.
- [ ] **6.4 [Eng] `docs/superpowers/plans/2026-10-21-portfolio-completion.md`**
  refers to `src/content/**` (moved to `vault/`) and to decisions since taken.
  Mark it historical at the top, or delete it.
- [ ] **6.5 [Eng] `docs/handoff/agent-open-items.md`:** many "Owner" items are
  resolved; add a line at the top naming this file as the current list.
- [ ] **6.6 [Owner] No `LICENSE` file.** Without one, all rights are reserved,
  which may be the intent. If others may reuse the code (not the content),
  add one and say in the README which parts it covers.

## 7. Accounts, DNS and the live origin (nobody could reach them from the build container)

- [ ] **7.1 [Owner/QA] GitHub Pages settings:** custom domain
  `rafaelbragakribitz.com`, DNS check green, **Enforce HTTPS** ticked.
- [ ] **7.2 [QA] Redirect chain in a browser:** `http://rafaelbragakribitz.com/`
  → `https://…`; `https://www.rafaelbragakribitz.com/en/` → apex;
  `https://rafaelbraga-kribitz.github.io/braga-portfolio-v2/en/work/` → same
  path on the domain; `https://rafaelbragakribitz.com/` → `/en/`.
- [ ] **7.3 [Owner] easyname DNS:** only the records in `DEPLOY.md` on `@` and
  `www`; the parking A record gone; the `_github-pages-challenge-…` TXT
  present; MX/SPF kept.
- [ ] **7.4 [Owner/QA] Email end to end:** send a message to
  `hello@rafaelbragakribitz.com` from an outside address, confirm it arrives
  (and where: easyname mailbox, Gmail), reply from it, and check the reply's
  From address and SPF/DKIM result in the recipient's headers. This is the
  only contact channel on the site.
- [ ] **7.5 [Owner] Google Search Console:** Domain property
  `rafaelbragakribitz.com` (TXT at easyname), submit
  `https://rafaelbragakribitz.com/sitemap.xml`; Bing Webmaster Tools import
  from Search Console.
- [ ] **7.6 [QA] Rich Results Test** on `/en/`, `/en/about/` and one project
  (Person, ProfilePage, Article JSON-LD).
- [ ] **7.7 [QA] After the merge (MA-10):** `view-source:` of `/en/` shows the
  `application/ld+json` block; `/en/notes/sphere/` has a readable description;
  `/nope/` returns the 404 page with status 404.
- [ ] **7.8 [Owner] Profiles point back:** LinkedIn headline and GitHub bio say
  "Marketing Data Analyst" and link `https://rafaelbragakribitz.com/`; run
  the LinkedIn Post Inspector on `/en/` and each project URL so the cached
  preview is refreshed.
- [ ] **7.9 [Owner] AI crawler policy:** `robots.txt` allows every crawler. If
  training should be opted out of, add `GPTBot`, `Google-Extended`, `CCBot`
  groups in `src/pages/robots.txt.ts`; otherwise no action. (`katex` low
  advisories via mermaid are build-time only; upgrade when mermaid allows.)
- [ ] **7.10 [Owner] Personal Gmail in the public repository:**
  `handoff/ds-update/cv/braga-cv.tex:72`. Replace with the alias (the folder
  is read-only by convention, so record the exception), or accept; a history
  rewrite is a separate decision.
- [ ] **7.11 [Owner] Project repositories match their pages:** the five
  `repository:` links are public; each README's figures agree with its page
  (the job-market README is at 699 postings, the page at 720, item 4.5);
  banners and badges follow D-051/D-054.

## 8. Manual QA nobody has done yet (the audit marked all of it NOT_ASSESSABLE)

Do this on the deployed site, not only locally; record date, browser and device
next to each tick.

- [ ] **8.1 [QA] Visual pass, every page type, both themes, at 320, 390, 768,
  1024, 1280 and 1440:** home, Work, a complete project (01-05), the in-build
  project (01-04), Writing, the Paraguay essay (figures, Mermaid, footnotes),
  a Quantitative-growth part (maths, tables, the download button), the
  Little's Law review (long title), Notes, an area archive, a note with a long
  formula, Tags, Tags A–Z, a tag archive, Tools index, both benches, About
  (portrait, side notes), the three legal pages, 404, the kitchen sink,
  the DE home. Keep screenshots (the integration step of `HANDOFF.md` §3
  item 3 never ran).
- [ ] **8.2 [QA] Keyboard pass:** skip link first; the `?` dialog and Esc;
  shortcuts 0–4, j/k, n/p, u, l, t; the split contact button (Tab reaches
  Copy and Open); tool sliders with arrow keys and typed fields; the tag
  search field and its results; the code panel Copy/Wrap buttons; the
  wrapped-formula `tabindex` on narrow screens; focus ring visible on every
  stop in both themes.
- [ ] **8.3 [QA] Screen-reader pass (NVDA + Firefox or Chrome, and VoiceOver +
  Safari on iPhone):** home, a project (metric strip, status squares, evidence
  figure), an essay with maths and side notes, a note (MathML reading), both
  tools (live results announced), the tags search, the keys dialog, the
  contact button, the 404. This feeds item 2.5.
- [ ] **8.4 [QA] Firefox and Safari/WebKit** (the gates run Chromium only):
  MathML rendering of display and inline maths; container queries on
  `.math-body`; `text-wrap: pretty`; the `<dialog>`; `:focus-visible`; the
  sticky glass header's `backdrop-filter`; woff2 fonts; `dialog::backdrop`.
  Real iPhone and Android, portrait and landscape, with the browser chrome.
- [ ] **8.5 [QA] JavaScript off:** content pages read fully; tools show the
  default scenario and the no-script note; the tag search box is hidden; the
  contact face still shows the address and "Open" leads to About (item 5.12).
- [ ] **8.6 [QA] Zoom 200% and 400%** on a project, an essay and a tool: no
  horizontal scroll, nothing clipped, the sticky header does not eat the
  viewport.
- [ ] **8.7 [QA] Reduced motion:** `prefers-reduced-motion` set; smooth
  scrolling off; no transition that moves content.
- [ ] **8.8 [QA] Print:** print an essay and a project to PDF (there is a
  `print.css`); check page breaks around figures and code, that side notes
  and footnotes appear, and that URLs are printed for links.
- [ ] **8.9 [QA] Tools correctness once more against a reference:** the A/B
  sample size against an online calculator for two or three baselines and
  lifts; the confusion matrix for the three presets and one typed scenario;
  shared URL state round-trips; edge inputs (0, 100%, empty, letters).
- [ ] **8.10 [QA] Social unfurls** on LinkedIn, X, WhatsApp, Slack, iMessage
  and Teams for `/en/`, a project and an essay: title, description and the
  1200 × 630 card; the German card question (item 3.5).
- [ ] **8.11 [QA] RSS:** run `https://rafaelbragakribitz.com/feed.xml` through
  the W3C feed validator; subscribe in one reader; confirm the seven items,
  their dates (item 4.7) and that the feed is English only on purpose.
- [ ] **8.12 [QA] External links alive** once on the live site: the five
  repositories, the DOI and journal links, the GitHub privacy statement,
  dsb.gv.at, the book files, Eurostat/AMS/ENTSO-E sources named in projects.
- [ ] **8.13 [QA] Dark-mode first paint:** no flash of the light theme on
  reload with the theme set to dark, on a slow connection.
- [ ] **8.14 [QA] Performance on a real phone over mobile data:** the home and
  a formula-heavy note; Lighthouse on the live origin (the lab figures in
  `docs/audit/website-audit-report.md` were local).
- [ ] **8.15 [QA] Custom 404 on GitHub Pages:** `/does-not-exist/` and
  `/de/does-not-exist/` return the designed page, not GitHub's.

## 9. Final read before the link goes out

- [ ] **9.1 [Owner] One proofreading pass of every English page** as a reader,
  on a phone: home, Work, the five projects, Writing, the seven essays, About,
  Tools, the three legal pages. Fix typos in the vault, rebuild.
- [ ] **9.2 [Eng] Consistency sweep:** every project's title, code, status and
  summary are identical on the home rows, the Work index, the project page,
  the trail, the JSON-LD, the sitemap and the RSS (a script over `dist/` is
  enough).
- [ ] **9.3 [Owner] Essay front matter:** the AI-prospecting essay's `lead`
  equals its `summary`; give it a lead of its own or accept. Every essay has a
  `seo_title` under 70 characters where the title is longer (the review's is).
- [ ] **9.4 [Eng] Regenerate the assets if anything in 4.9 or 4.11 changed:**
  `npm run assets` (favicons and the share card), commit the PNGs.
- [ ] **9.5 [Eng] Full `npm run verify` on the final tree, then merge to
  `main`, then the live checks of section 7.**
- [ ] **9.6 [Owner] Decide what is explicitly post-launch** and write it in
  `HANDOFF.md`: the Charts specimen rebuild (handoff item A2), German versions
  of the six essays, a full-text search over the notes (Pagefind, D-061),
  security headers (would need another host than GitHub Pages).

## 10. Gates result on this tree

`npm run test:gates` on this branch, 1 Nov 2026, over the 827 built pages:

| | |
|---|---|
| Pages | 827 |
| Rendered contexts | 2,272 (six widths × two themes; axe on the sample of templated routes) |
| Failing gates | **0 on 0 pages** |
| Pending routes | 0 |
| Duration | 367 s |

So item 1.4 is green on this tree; item 1.1 (`astro check`) is the only
automated failure, and it is what would stop the deploy.

## 11. Recruiter and data-professional review (added 1 Nov 2026)

These checks extend the original inspection. A green build does not establish
that analytical examples, professional claims or a contact channel are reliable.
CV work is explicitly the final phase, after an owner interview (section 12).

- [ ] **11.1 [Eng/QA] Review the notes as published technical work.** The
  original 9.1 excludes the notes. An initial scan found 903 `python`/`py`
  blocks with valid Python syntax, but also 35 `markdown` fences in 27 notes;
  several contain collapsed Python that cannot run. Example:
  `unemployment_rate.md`, professional example. Repair or remove malformed
  examples without presenting pseudocode as executable code. Remove generation
  self-check residue such as “All required sections are present” from published
  notes. Verify Python syntax AND numerical reference results; a syntax pass
  alone misses the Jacobian loop indentation defect in 5.15. Record coverage,
  not a blanket claim that all 500+ notes were reviewed.
- [ ] **11.2 [Eng] Same-snapshot arithmetic and methodological wording.** Check
  counts, rates and denominators independently of the snapshot choice in 4.5.
  September's Styrian share is 58/720 = 8.1%, not 7.5%. Do not call ignored
  predictions “precision of zero”; unused predictions deliver no business
  value. Equal weak priors do not establish data dominance without sensitivity
  checks. A proxy-based warehouse model supports site validation before
  procurement, rather than an unconditional deployment instruction. Apply
  matching corrections to EN/DE and inspect the built pages.
- [ ] **11.3 [Owner/Eng] Attribution and evidence per project.** A reader must
  distinguish an independent portfolio study, a reconstructed historical case,
  a simulation and delivered client/employer work. Verify the author's actual
  contribution, collaboration, data origin, modelled versus measured outcomes,
  and which outputs were used in a real decision. Keep evidence links beside
  the claim. Never imply a simulated gain was realised revenue or cost savings.
- [ ] **11.4 [QA] Reproducibility from a clean checkout of each project.** Pin
  the release/commit behind the displayed snapshot; follow its README, install
  its declared environment, run tests and reproduce at least one headline
  table/figure. Where raw data are private, explain access limits and provide
  a synthetic fixture or a reproducible public subset. Do not imply that a
  public repository makes private-source results fully reproducible.
- [ ] **11.5 [Owner/QA] Data and modelling credibility.** Confirm sampling,
  missingness, deduplication, leakage prevention, baselines, uncertainty,
  out-of-sample evaluation and sensitivity checks relevant to each project.
  Distinguish descriptive association, modelled scenarios and causal evidence.
  Link limitations and failure cases directly from the project narrative.
- [ ] **11.6 [Owner] Confidentiality and publication rights.** Review employer,
  campaign and client references, screenshots, download metadata, personal
  identifiers and repository sample data for permission to publish. Keep
  supporting evidence private where required. Portrait/book checks in 4.12–13
  remain separate; do not publish private interview notes as site content.
- [ ] **11.7 [QA] Recruiter comprehension test.** On a phone, ask a reader to
  identify the target role, strongest relevant project, tools used, contribution,
  evidence and limitations, then find contact details without explanation.
  Record actual observations; do not invent user-test results. Target-role,
  location, language proficiency, availability and work-authorisation facts
  must come from the owner before they are added.
- [ ] **11.8 [Eng/QA] Protect existing URLs when consolidating notes.** Rewrite
  vault links and provide redirects from every removed public slug, including
  canonical tags and no broken inbound links. `vault:check` alone cannot test
  already shared links. Inspect redirects under both root and project bases.
- [ ] **11.9 [Eng] Verify changes on pull requests.** The current Pages
  workflow only verifies after a push to main/master or a schedule/manual run.
  Add a pull-request verification workflow with read-only permissions and no
  deploy job, so a deploy-blocking error can be caught before merge.
- [ ] **11.10 [QA] Contact remains usable without clipboard or JavaScript.**
  Test an accessible address and a useful fallback, not only visual CSS text.
  Confirm an external sender can reach the inbox (7.4); no message is sent by
  this implementation task. A working animation is not an end-to-end contact test.

**Owner decision, 1 Nov 2026 (11.10):** Keep the address hidden from HTML.
A readable static address/mailto fallback is therefore not being added. The
remaining no-JavaScript screen-reader limitation is documented, not passed.

## 12. Final phase: interview → facts bank → CV (owner instruction)

- [ ] **12.1 [Owner] Long audio interview, after the other readiness work.**
  Use a voice-enabled conversation if available. Work through chronology,
  every role/venture/campaign, education, languages, methods, tools, decisions,
  measurable outcomes, failures and lessons, collaboration, references and
  target roles. Ask follow-ups one at a time; dates, attribution and evidence
  take precedence over polished wording. The assistant cannot initiate a live
  audio call from this coding workspace.
- [ ] **12.2 [Owner/Eng] Build a private CV facts bank.** For each claim record
  the owner's wording, dates/precision, organisation, role, contribution,
  outcome/baseline/unit/timeframe, evidence/source, confidence, unresolved
  questions, confidentiality and permission to publish. Keep interview-only
  claims unverified until confirmed. Do not commit personal interview material
  to this public repository or put it in the published vault.
- [ ] **12.3 [Owner] Review the facts bank.** Resolve contradictions against
  existing sources; approve which facts and names may be used publicly.
- [ ] **12.4 [Eng/Owner] Draft and verify the CV from approved facts only.**
  Prepare an ATS-readable CV and accessible PDF with selectable text; verify
  dates, links, contact details, reading order, print and file metadata. Align
  About/project claims with it, and finish 4.1–4.4 only after owner confirmation.
