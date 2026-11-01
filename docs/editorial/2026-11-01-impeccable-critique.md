# Site critique: Impeccable `critique` run, 1 Nov 2026

**Date**: 1 Nov 2026
**Method**: dual-agent, as the Impeccable skill (danielbittencourt-bizsaver/IMPACABLE, the `critique` command) requires: Assessment A (design review, Nielsen heuristics, cognitive load, personas) and Assessment B (the skill's deterministic detector, 60 rules, plus Playwright browser evidence with axe-core) ran as two isolated sub-agents that did not see each other's output. Target: the site as built from `main` at 3041788, served locally (the live host is not reachable from the build container). Pages inspected: home, Writing, the Little's Law essay, Work, a project, Notes, an area page, About, Tools, the German home and the 404, at 390 × 844 and 1440 × 900, light and dark.

## Design health score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | `/en/tags/<area>/` says "newest first" while its rows run alphabetically; the theme button has no `aria-pressed` |
| 2 | Match with the real world | 2 | The register's vocabulary is the designer's ("Library · 524 notes", "§ END"); a Notes area row lands on a page framed as a tag archive |
| 3 | User control and freedom | 3 | Trail, `u`, "← All writing"; the essay end offers one direction and does not say it is the older piece |
| 4 | Consistency and standards | 2 | **The Writing lists counted 007 → 001 while every other left column is an ascending position** (fixed in this change); the two Writing listings start their title column at different x; the Notes head row sits over a single row with the same label |
| 5 | Error prevention | 3 | Read surface; the split contact button prevents a mis-tap; no horizontal overflow at 390 |
| 6 | Recognition over recall | 2 | Codes asked the reader to remember that 007 is newest, and the list captioned its own order (fixed); two register rows styled like essays |
| 7 | Flexibility and efficiency | 3 | `?` dialog, 0–4 / j k / n p / u / l / t, RSS, sitemap; no search or subtopic filter over 524 notes |
| 8 | Aesthetic and minimalist design | 3 | Home Work rows carry five streams and become 8-line cards on mobile; the cover leaves ~250 px of nothing under the button at 1440 × 900 |
| 9 | Error recovery | 3 | The 404 is well built but in a different voice ("we've discovered", "Model status") |
| 10 | Help and documentation | n/a | Read surface; the shortcuts dialog counts under 7 |
| **Total** | | **24 / 36** | Good: address the weak dimensions |

## Design specificity verdict

**Authored, not interchangeable.** The four-door numbered register carried into every trail, table of contents and figure number; BKribitz display at 80–96 px; tabular slashed-zero mono for every figure; five status squares instead of traffic-light colour; one accent per section spent on an earned figure. Swap the name and the design would still say "a quantitative person from the Swiss-typography lineage", not "any portfolio template". The soft spot is content: the About CV is one row, and six of seven essays carry the same date, which undercuts the register's claim to be a careful, dated archive.

**Deterministic scan** (11 representative pages, `detect --json --no-config`): one rule fired, `side-tab`, once per page, on the global CSS for `.doc .sidenote[data-place=inline] { border-left: 2px solid var(--ink) }`. That is the below-1280 fallback for a margin sidenote (an ink hairline, not an accent card) and matters on one scanned page only (About): a false positive for this design. The browser build of the detector, injected into the pages, added: `tight-leading` on `.lr-title-main` (line-height 1.14 at 22 px, 2–3 lines on mobile; verified), `all-caps-body` on the evidence figure's label and the essay end bar's forward link (uppercase by CSS, 39 and 47 characters; verified, a judgement call), `line-length` on the evidence figure's heading and caption at 1440 (about 89 and 156 characters a line in a 934 px figure; verified). Its `gradient-text`, `marquee`, `theater-slop-phrase` and `text-occlusion` hits were the detector seeing its own injected source and overlay; confirmed on a blank control page and discarded.

**Browser evidence**: no horizontal overflow at 390 or 1440 on any page; 0 console errors; axe-core 0 violations (WCAG 2.1 A/AA and best practice) on all ten page × viewport runs; one `<main>`, one `<h1>`, no heading skips, skip link first; `:focus-visible` shows a 2 px ink ring on the first six tab stops. Small targets at 390: the 15 footer links are 44 × 32 (`min-height: 32px`), and a project page's tags are 98 × 24. Secondary text (`--ink-2`) measures 5.36:1 on the light canvas.

## What's working

1. **Numbers set like an analyst's.** Tabular, slashed-zero mono everywhere; the project opener spends the single accent on "720" and leaves 83 %, 95 % and 24 % in ink, exactly the earned-figure rule.
2. **The evidence figure.** Fig. 1 of the Little's Law essay: four hairline tracks, one accent bar, a two-line caption and a mono source line; a chart that argues the way the essays do.
3. **Keyboard and focus discipline.** Ring on every focusable element, 44 px shell targets at 390, a `?` dialog with `kbd` chips, a theme toggle that works by tap, no horizontal overflow.

## Priority issues

| Tag | What | Why | Fix |
|---|---|---|---|
| **P1** | Writing lists counted backwards (007 → 001) and were captioned to explain themselves | The left column means "position" everywhere else on the site; here it meant "identifier" | **Done in this change**: position 01, 02, … in the column, newest first; the permanent code in the meta beside the date; trail, tag archives and `code` unchanged |
| **P1** | About "04 CV" has one row; Background names founder roles and the 2018 campaign that never reach the CV | A hiring manager comes to About for a timeline and seniority and leaves without either | Dated rows (ventures, campaign work, education), or retitle "Recent role" and add a `.file-split` CV download (D-057) |
| **P1** | A Notes area row ("Foundations · 70 notes") lands on `/en/tags/foundations/`, headed as a tag archive, with "newest first" over alphabetical rows; the 29 subtopic names on `/en/notes/` are plain text | Frame switch and a false lead line; the reader sees destinations they cannot open | Notes-framed area pages (trail 02 Writing → 02-02 Notes → Foundations), a lead that matches the order, subtopics as links |
| **P2** | `/en/writing/`: the essays and Notes listings start their title column at different x; the "02-02 Notes" head sits over one row with the same label; on home the two register rows look like essays six and seven | Breaks the one grid the page is built on; a one-row listing with a head is furniture | A forward-link row under the essays instead of a second listing; a distinct style for register rows |
| **P2** | Mobile home: the "00 / Portfolio" kicker renders after the button as an orphan; "All 5 projects →" precedes the list it summarises; the two-row shell (102 px) stays sticky on a 17-minute read | Reading order contradicts hierarchy; 12 % of the screen is chrome | Hide or move the cover index below 768; forward links after their listing below 720; only the top bar sticky |
| **P2** | Six of seven essays are dated 30 Oct 2026 | "Newest first" is unverifiable and the archive reads as a bulk upload | Show the real written dates (`date` is the publication date; an `updated` or `written` field could carry the other) |
| **P3** | Voice leaks: the 404 ("we've", "Model status"), the footer's unexplained "· EUR", the hyphenated hero lead ("alloca-tion") | The site's value is that one careful author made every line | First person singular on the 404; drop or explain "EUR"; `hyphens: manual` on `.cover-lead` and `.display` |
| **P3** | `.lr-title-main` at line-height 1.14 wraps to 2–3 lines on mobile; footer links 44 × 32 | Tight leading on multi-line titles; targets under 44 px | 1.2 on wrapped titles below 720; `min-height: 44px` on footer links below 768 |

## Persona red flags

- **Hiring manager, 90 seconds on desktop**: the cover and Work rows land. The first project is about the Austrian data-job market, the one project whose subject is the author's own job search; the MMM or decision-analytics work would lead better. About gives one CV row and no years of experience; "Functional" and "In build" squares read as unfinished to someone outside the vocabulary.
- **Recruiter on a phone**: stack boxes help, but each Work row is an 8-line card; "Open to Marketing Data Analyst roles" is buried in About 05; no CV download; the email button loses its accent after the tap, which looks like it switched off.
- **Fellow analyst from a shared essay link**: excellent on desktop; on mobile a 7-line title, aggressive hyphenation ("be-cause", "particu-larly"), accent-bold formulas inside a table that read as links, no search over the notes, and an end bar that sends them to an older essay labelled as next.

## Minor observations

- The home split button's static `href` is `/en/about/#contact` with `aria-label="Write an email"`; the mailto is applied by script, so the label and the no-JS destination disagree.
- Theme button: accessible name "Toggle light and dark theme · Dark" but no `aria-pressed`.
- Essays carry no `rel="prev"` / `rel="next"`; the `n` / `p` shortcuts and the end bar are the only sequence.
- Listing rows are single links whose accessible name is index + title + sub + meta: correct, if long.
- The German surface is honest about itself (draft mark under the cover button) and has one essay.

## Questions to consider

1. If the codes are permanent references, who cites them? If nobody outside the site writes "02-01-004", the code belongs on the essay and in the meta, not in the column (the position this change takes).
2. Why does 01 Work open with the project whose subject is the author looking for a job?
3. The site says "finished arguments", then dates six of them on one day. Show the dates or the arguments; if the dates, the real ones.

## The numbering decision (D-056 amended)

The problem was not the direction of counting but that one column changed meaning: everywhere else the first column is a position (01-01 … the projects, 01–07 the notes areas, the contents), and in the Writing lists the same column, in the same mono, carried an identifier. Options weighed:

| Option | Fresh work first | Column counts upward | References stable | Verdict |
|---|---|---|---|---|
| Chronological, 001 at the top | no | yes | yes | buries the newest essay |
| Newest first, renumber so newest = 001 | yes | yes | no | every trail and citation moves |
| "Latest" lead row, then the register ascending | yes | yes, with a jump | yes | two orders on one page; home reads 007, 003 … 006 |
| **Position in the column, code in the meta** | **yes** | **yes** | **yes** | **chosen**: what `/en/notes/` already does |

Implementation: `listIndex()` in `src/lib/collections.ts`; home and `/<lang>/writing/` pass it as the row's code and put `writingCode()` first in the meta; the essays listing drops `.lr-long-code` (the column is two digits again); the "All N essays" row's sub line now reads "Newest first. The code beside the date is permanent."; the essay's trail, `code` frontmatter and tag archives are unchanged.
