---
code: "01-01"
kind: case
date: "2026-09-16"
summary: "Five public job boards, one tested Python pipeline. Duplicates merged, title rules checked against 177 hand-labelled titles, every number traced to its source."
lead: "An evidence base for data-career decisions in Austria, with a Styria and Graz focus: a one-day snapshot of 720 core data-role postings from five public sources, the AMS JobBarometer 2020–2025 and Eurostat vacancy seasonality."
domain: Labour market
tags: [ status/complete, job-market, data-pipeline, descriptive-statistics ]
lang: en
slug: austria-data-job-market-intelligence
metrics:
  - { value: "720", label: Core postings, accent: true }
  - { value: "83% / 95%", label: "Title precision, strict / lenient" }
  - { value: "24%", label: Duplicate rate }
stack: [ "Python", "Power BI", "DAX", "pandas", "scikit-learn", "Clustering", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/austria-data-job-market-intelligence
translationStatus: approved
publish: true
---
# Austria data-job market intelligence

## Question: Which data jobs are advertised in Austria, where, and what do they ask for?

> [!summary] Summary
> SQL leads a one-day snapshot of 720 core data-role postings. Among named vendors, the postings lean to Microsoft. Since 2022, Styria fell 29% in the AMS “Data Scientist” class, against 56% for Austria. The raw collection stays a private research set.

> [!note] Snapshot date
> This page describes the snapshot of 16 Sep 2026. The repository has since moved to a snapshot of 18 Oct 2026 (release 2026-10-19.1, 699 core postings). Its README carries the current figures.

## Background

The project reads each ad for its title, location, technologies, languages, education, pay and work model, and compares Styria with Vienna. The unit is the core data-role posting in a one-day snapshot, and official series are read as their own units. A technically competent, sceptical reader should be able to audit the method, the provenance, the limitations and the conclusions.

## Data

> [!spec] Snapshot
> - Collected — 16 Sep 2026, 17:00–18:40 UTC
> - Posting sources — EURES 202 · karriere.at 134 · LinkedIn (logged-out job pages) 300 · willhaben 26 · jobs.at 58. Core postings by canonical source (table T01).
> - Access — No login, no CAPTCHA or paywall bypass
> - Blocked, excluded — StepStone · Indeed · hokify · Glassdoor
> - Search — 45 title keywords, English and German
> - Inclusion — By title. Precision 83% strict and 95% lenient, measured on 177 hand-labelled titles
> - Official series — AMS JobBarometer 2020–2025, online ads per occupation class and federal state · Eurostat quarterly job vacancies

> [!figure] Fig. 01-01-1 · From raw rows to core postings
> 12,429 raw rows reduce to 720 core postings.
> ![[01-01-funnel.en.svg]]
>
> caption: Counts of rows. Band thickness is proportional to the count. In scope means core postings, adjacent role families and their duplicates. The 24% duplicate rate is 404 of the 1,670 in-scope rows.
> source: repository tables market_summary, dedupe_summary and Q04_duplicates, commit 267b115; snapshot of 16 Sep 2026.

## Method

| Step | Field | Rule |
|:--|:--|:--|
| 1 | Title | Ordered regex rules sort titles into eight role families. |
| 2 | Geography | Explicit fields first, then NUTS-3 codes, then postcodes and place names in the text. |
| 3 | Salary | Parsed from structured fields or from text near salary words. Annualised at 14 monthly payments. |
| 4 | Language | Read from a window of 120 characters on either side of each language mention. |
| 5 | Duplicates | Union-find groups postings by company, title, federal state and a description fingerprint. |

- Every step is a script, and every rule lives in a config file.
- Every table stores its n. Proportions that feed a decision carry Wilson 95% intervals.
- Official series are their own units. They are never merged with posting-level statistics.
- A test suite checks rule behaviour and output consistency.
- A digest script reprints every number quoted in the documents from the tables.

> [!definition] Text-derived share
> A share read from the ad text, such as a language requirement. Its denominator is the postings with a description longer than 300 characters.

## Result

### Skills

> [!figure] Fig. 01-01-2 · Skill mentions with 95% intervals
> SQL leads at 40%, with AI wording and data visualisation at 38%. Among named vendors, Azure and Power BI lead.
> ![[01-01-skills-top.en.svg]]
>
> caption: Share of the 719 postings with a description longer than 300 characters that mention the skill. A posting can mention several skills. Generic topics, such as AI (generic), count as written in the skill taxonomy. Whiskers are Wilson 95% intervals.
> source: repository table T05_skills_all_tech, commit 267b115; snapshot of 16 Sep 2026.

> [!figure] Fig. 01-01-3 · Skill mentions by role family
> Each role family names its own mix: BI names visualisation most (86%), data science AI wording (82%), data engineering SQL (69%).
> ![[01-01-skills-heatmap.en.svg]]
>
> caption: Base: the same 719 postings, without the one product-analytics posting. The rows show 11 of the 115 skills of the taxonomy, ordered by their share over all postings. “Governance/quality” includes governance keywords, so its 82% in data governance ads is partly true by definition. The darkest shade is the top value, 86%. Marketing analytics has n = 24. Heavier edges mark the cells in the finding.
> source: repository table T05_skills_all_tech_by_family, commit 267b115; snapshot of 16 Sep 2026.

### Region

| Role family | Vienna | Styria | Other | All |
|:--|--:|--:|--:|--:|
| Data engineering | 78 | 17 | 65 | 160 |
| Data science | 80 | 13 | 65 | 158 |
| Business analysis | 74 | 4 | 42 | 120 |
| Data analytics | 41 | 11 | 55 | 107 |
| BI | 34 | 4 | 47 | 85 |
| Data governance | 22 | 5 | 38 | 65 |
| Marketing and product analytics | 14 | 0 | 11 | 25 |
| Total | 343 | 54 | 323 | 720 |

Counts use the primary state, so Styria is 54 here and 58 by location below. “Other” includes 22 postings with no stated state. Styrian cells are small and tentative. Data engineering and data science are each 22% of core postings. Source: repository table T03_family_by_state, n = 720.

| Measure | Share | Base |
|:--|--:|:--|
| Vienna, snapshot | 48% | 345 of 720, location count |
| Styria, snapshot | 8.1% | 58 of 720, location count |
| Styria, AMS “Data Scientist” class | 13.6% | 300 of 2,207, 2025. The total includes ads with no named state |
| Styria, seven AMS data classes pooled | 10.9% | 926 of 8,477, 2025 |

These are different units and are not merged.

### AMS trend

AMS “Data Scientist” class, online ads per year. Burgenland is censored below 20 in every year, so it counts as no named state.

| Year | Austria total | Sum of named states | No named state | Share with no named state | Styria |
|:--|--:|--:|--:|--:|--:|
| 2020 | 3,049 | 1,892 | 1,157 | 37.9% | 224 |
| 2022 | 5,032 | 4,430 | 602 | 12.0% | 423 |
| 2024 | 2,680 | 2,403 | 277 | 10.3% | 271 |
| 2025 | 2,207 | 2,008 | 199 | 9.0% | 300 |

AMS says some ads have no clear state ([Methodenpaper](https://jobbarometer.ams.at/dam/jcr:353f155f-0769-410e-bd8d-727ecc09d144/Methodenpaper_v1.2.pdf), § 3.1.6), and their share fell from 38% to 9%.[^1] The fall is class-wide, from a median of 37.6% to 8.9% over 59 AMS classes, and the reason is not established. Change since 2020 is therefore uncertain: Styria +34% raw, −8.7% with proportional allocation of unplaced ads (a sensitivity reading, not a measurement). Since 2022 the reading is stable: Styria −29%, named states −55%, Austria −56%.

### Language, pay and season

| Finding | Figure | Base |
|:--|--:|:--|
| Ads that state a German requirement | 40% | Ad text |
| Ads written in English | 24% | Ad text |
| Of those, still stating a German requirement | 19% | Ad text |
| Salary figures that are collective-agreement minimums | 81% | Parsed salary figures |
| Within-year amplitude | 5–14% | Eurostat |
| Between-year amplitude | 255–567% | Eurostat |

Most advertised salary figures are collective-agreement minimums, so the ads show floors, not pay. Seasonality is small against the cycle.

## Limitations

What this does not establish:

- **Demand over time.** The snapshot is a one-day stock of ads, not yearly flow, vacancies or hires. Official series have unplaced ads, so state changes since 2020 are uncertain.
- **Full coverage.** StepStone, Indeed and company career pages are missing. Title-based inclusion has measured precision but unmeasured recall.
- **Styrian detail.** Styrian cells are small (n = 58), so counts are labelled tentative.
- **Anything causal.** There are no hiring outcomes, so no requirement is evidence of what gets someone hired.

## Decision

The snapshot is an evidence base, not a verdict, and each statement traces to a table id. Two decision documents score each role family against a declared skill profile, with stated weights, no hidden scoring and a sensitivity check under alternative weights.

> [!faq]- Why are the raw ads not published?
> A terms-of-use audit found that all five posting sources restrict automated extraction, so the collection stays a one-off private research set. The public repository holds the code, the rules and the aggregated tables, with every text and URL column removed. The collectors and the raw ads are not published.

Code is under MIT. Documents and aggregated outputs are under CC BY 4.0.



[^1]: The AMS JobBarometer counts online ads per occupation class and federal state. Its [Methodenpaper](https://jobbarometer.ams.at/dam/jcr:353f155f-0769-410e-bd8d-727ecc09d144/Methodenpaper_v1.2.pdf) (§ 3.1.6) says that some ads cannot be assigned to a state, so the Austria sum can exceed the sum of states, and that ads from Germany for Austrian border regions are included.
