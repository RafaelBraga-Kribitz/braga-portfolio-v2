# Editorial review: Paraguay 2018 essay and the Quantitative growth series

**Date**: 30 Oct 2026
**Method**: the `blog-editor` review structure (danielabar/meblog), the Google technical-writing checks of `tech-writer` (chrisherczeg/tech_writer) and the claim ledger of `source-backed-blog-writer` (BlogFactoryHQ). Where those skills conflict with this site's rules (`vault/_guide/Syntax reference.md` §4: British English, no "we", no marketing "you", authored quotes and dashes, one accent per section), the site's rules win. The SEO package of `source-backed-blog-writer` (1,500–2,000 words, key-point bullets, FAQs, keyword-led headings) was not applied: these are argued essays, not search articles, and their structure was kept.

## 1. Paraguay 2018 essay

**Word count**: about 4,800 (source) → about 3,900 (published). **Reading time**: about 17 min.

### Executive summary

A strong first-person account with unusually honest epistemic hedging. The main problems were length and repetition of the same caveat (results are not causes) in five places, US spelling and em dashes against the house style, and six matplotlib images that would not follow the site's theme, type or dark mode.

### Must address (done)

| # | Item | Change |
|---|---|---|
| 1 | Charts as foreign images | Figures 2, 3, 5 and 6 rebuilt as the site's own `[!bars]` evidence figures from the package CSVs; Figures 1 and 4 as Mermaid, drawn at build in the site's tokens |
| 2 | Repeated causality caveat | Kept once per section where it carries the argument; cut where it restated the previous paragraph |
| 3 | House style | British spelling (-ise, modelling), spaced en dashes, curly quotes, "we" → the campaign / the team / I, "euro" → "dollar" in the billboard example (the reconstruction is in USD) |

### Should address (done)

- One-sentence paragraphs merged where they split a single idea (tech-writer: paragraph openers).
- Internal link to the project page `/en/work/decision-analytics-reconstruction/`, the site's own record of the same reconstruction.
- Allocation gain stated as 54.77%, the figure on the project page and in the repository's numeric source of truth.
- Title in sentence case to match the site; a shorter `seo_title`.

### Claim ledger

| Claim | Classification | Source | Verified |
|---|---|---|---|
| 1,206,067 v 1,110,464 votes; margin 95,603 | Primary source, calculated | TSJE via `reports/NUMERIC_SSOT.md`; subtraction | 30 Oct 2026 (repo); TSJE site not reachable from the build session |
| +3.70 pp (46.43% v 42.73%), turnout 61.25% | Primary source | `NUMERIC_SSOT.md` | 30 Oct 2026 |
| Eight tracking polls, margins −4.5 to +31.4 | Secondary source | `polls_raw_fixture.csv` (8 tracking rows) | 30 Oct 2026 |
| 50,000 voters; 18 × 11 × 14 = 2,772 cells | Calculated | `NUMERIC_SSOT.md` | 30 Oct 2026 |
| 54.77% linearised lift | Calculated (model) | `NUMERIC_SSOT.md` | 30 Oct 2026 |
| $766,285 off six swing departments; +1.2% objective | Calculated (model) | `decision_replay_results.json` (766,284.76; 1.198%) | 30 Oct 2026 |
| Swing-weight rule, m_plan 8.56 pp, clip 1/3–3 | Model specification | `decision_replay_results.json` mapping | 30 Oct 2026 |
| Week-8 margin 17.65 pp, 94% HDI 3.53–30.80 pp | Calculated (model) | `decision_replay_results.json` | 30 Oct 2026 |
| Alto Paraná 527.7 / 528.8 / 783.8 / 1,151.4 thousand | Calculated (model) | `decision_replay_results.json` | 30 Oct 2026 |
| 3 of 6 held-out waves inside the 95% interval | Calculated (model) | `reports/module_c/walk_forward_loo_report.md` | 30 Oct 2026 |
| Meetings, taxi conversations, autonomy, the whiteboard | Proprietary evidence (author's recollection) | the author | stated as recollection in the text |

Not verifiable from the build session (host not reachable): the TSJE, La Nación and EEAS URLs. They are cited as in the author's package.

## 2. Quantitative growth, Parts 1–4

**Word count**: about 1,500–1,650 each. **Reading time**: 7 min each.

### Executive summary

Tight, correct and well sequenced. Every worked number was recomputed and matches (Part 1: €300,000 v €100,000; Part 2: €0 v €650, 0.60 incremental return, 50% break-even; Part 3: 1,683 per arm by the normal approximation, 314 and 387 days, 18.5% → 7.6%; Part 4: EV €24,000, EVPI €24,000, P(+) 0.44, posteriors 72.7% and 14.3%, EVSI €9,600, net €4,100). The edits are mechanical, not substantive.

### Must address (done)

| # | Item | Change |
|---|---|---|
| 1 | Inline maths as `\( … \)` | Rewritten as `$…$`, which the site's pipeline renders as MathML |
| 2 | Authorial "we" and second-person "you" | Rewritten impersonally or in the first person singular (site rule) |
| 3 | Links between parts pointed at `.md` files | Site links, plus a series bookmark at the foot of each part |

### Should address (done)

- `\max_{x_i\in\{0,1\}}` in Part 2 puts a script on a script (below the 12px floor, gate G-01): the binary constraint moved into the "subject to" line.
- Glossed the acronyms on first use (DGP, EVPI, EVSI were already glossed; ARR added).
- Part 4 links the full book as PDF and EPUB from the vault (the manuscript edition of 30 Oct 2026, as the package intends).

### Nice to have (not done; owner's call)

- German versions. The site shows the English essays only; the German Writing page links to its own home for them.
- The Writing index codes: the new essays are 02-03 to 02-07; the notes library keeps 02-02 and closes the listing, as decided on 25 Oct 2026, so the codes do not read in order on the index.
