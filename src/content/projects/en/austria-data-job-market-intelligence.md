---
title: Austria data-job market intelligence
code: "01-01"
kind: case
date: "2026-09-16"
summary: 720 core postings. A dated view of titles, skills and regional demand.
lead: "An evidence base for data-career decisions in Austria, with a Styria and Graz focus: a one-day snapshot of 720 core data-role postings from five public sources, the AMS JobBarometer 2020–2025 and Eurostat vacancy seasonality."
domain: Labour market
status: complete
tags: [Job Market, Data Pipeline, Descriptive Statistics]
lang: en
slug: austria-data-job-market-intelligence
metrics:
  - { value: "720", label: Core postings, accent: true }
  - { value: "83% / 95%", label: "Title precision, strict / lenient" }
  - { value: "24%", label: Duplicate rate }
repository: https://github.com/RafaelBraga-Kribitz/austria-data-job-market-intelligence
draft: false
translationStatus: approved
---

> [!summary] Summary
> SQL and Python lead a one-day snapshot of 720 core data-role postings, the stack is Microsoft-centred, and in the AMS “Data Scientist” class Styria is the only large region above its 2020 level. The findings feed two decision documents that score each role family against a declared skill profile; the raw collection stays a private research set.

## Question

The questions are practical. Which data titles are advertised in Austria, where, and with which technologies, languages, education, pay and work model? How does Styria differ from Vienna? The unit is the core data-role posting in a one-day snapshot; the official series are read as their own units. The standard set for the answers: a technically competent, sceptical reader should be able to audit the method, the provenance, the limitations and the conclusions.

## Data

Postings were collected in a single window on 16 Sep 2026 from five public sources, using 45 title keywords in English and German, with no login and no CAPTCHA or paywall bypass. The boards that blocked collection are excluded. The official series are the AMS JobBarometer, which counts online ads per occupation class and federal state, and Eurostat’s quarterly job-vacancy data.

Of 12,429 raw rows, 720 are core data-role postings, 58 of them in Styria. Inclusion is decided by the title; its precision, measured on 177 hand-labelled titles, is 83% strict and 95% lenient. 24% of in-scope postings are duplicates, merged by union-find.

> [!spec] Snapshot
> - Collected — 16 Sep 2026, 17:00–18:40 UTC
> - Posting sources — EURES · karriere.at · LinkedIn (logged-out job pages) · willhaben · jobs.at
> - Blocked, excluded — StepStone · Indeed · hokify · Glassdoor
> - Search — 45 title keywords, English and German
> - Postings — 12,429 raw rows · 720 core · 58 in Styria
> - Official series — AMS JobBarometer 2020–2025 · Eurostat quarterly job vacancies

## Method

Every step is a script, and every rule lives in a config file:

1. Titles are normalised by ordered regex rules into eight role families.
2. Geography comes from explicit fields, then NUTS-3 codes, then postcodes and place names in the text.
3. Salary figures are parsed from structured fields or from text near salary words, and annualised at 14 monthly payments.
4. Language requirements are read from a window of 120 characters on either side of each language mention.
5. Duplicates are grouped by union-find over company, title, federal state and a description fingerprint.

Every table stores its n, and proportions that feed a decision carry Wilson 95% intervals. The official series are analysed as their own units and never merged with posting-level statistics. A suite of 67 tests checks rule behaviour and output consistency, and a digest script reprints every number quoted in the documents from the tables.

> [!definition] Text-derived share
> A share read from the ad text, such as a language requirement. Its denominator is the postings with a description longer than 300 characters.

## Result

The snapshot answers the question for one day; the AMS series adds the trend.

### Skills

SQL and Python lead, and the stack is Microsoft-centred: Azure and Power BI sit far above Tableau.

> [!bars] Fig. 01-01-1 · Skill mentions
> SQL and Python lead the snapshot.
> - SQL — 40
> - Python — 35
> - Azure — 19
> - Power BI — 18
> - Tableau — 3
>
> scale: 0–100 · unit: % · centre: no
> caption: Share of postings that mention each technology; scale 0–100%. Multiple mentions allowed.
> source: posting snapshot, 16 Sep 2026. Shares rounded; incomplete coverage.

### Region

Vienna holds 48% of open core postings. Styria is 7.5% of the snapshot but 13.6% of the official yearly flow, and the only large region above its 2020 level in the AMS “Data Scientist” class.[^1]

> [!bars] Fig. 01-01-2 · Region
> 58 of the 720 core postings are in Styria.
> - Styria — 58
> - All postings — 720
>
> caption: Count of core postings; n = 720. Styrian cells are small, so they are reported as counts and labelled tentative.
> source: posting snapshot, 16 Sep 2026.

> [!bars] Fig. 01-01-3 · Annual flow
> Styria moves against the national trend.
> - Austria — −28
> - Styria — +34
>
> scale: −50–50 · unit: % · centre: yes
> accent: Styria
> caption: Change against the 2020 level, AMS “Data Scientist” class, series 2020–2025. Centre line = zero; range −50% to +50%.
> source: AMS JobBarometer, online ads per occupation class and federal state.

### Role families, language and pay

The family shares come from the title rules, the language shares from the ad text and the salary share from the parsed salary figures.

| Finding | Figure |
|:--|--:|
| Data-engineering family | 22% |
| Data-science family | 22% |
| Marketing- and product-analytics titles | 25 of 720 |
| Of those, in Styria | none |
| Ads that state a German requirement | 40% |
| Ads written in English | 24% |
| Of those, still stating a German requirement | 19% |
| Salary figures that are collective-agreement minimums | 81% |

Data engineering and data science are the largest families. Marketing- and product-analytics titles are rare, and absent in Styria. Most advertised salary figures are collective-agreement minimums, so the ads show floors, not pay.

### Season and cycle

Seasonality is small against the cycle: the Eurostat series show a within-year amplitude of 5–14%, against 255–567% between years.

> [!quote] Result · snapshot of 16 Sep 2026 and AMS JobBarometer
> SQL and Python lead Austrian data-role ads, on a Microsoft-centred stack, and in the AMS “Data Scientist” class Styria is the only large region above its 2020 level.

## Limitations

What this does not establish:

- **Demand over time.** It is a one-day stock of ads, not yearly flow, vacancies or hires.
- **Full coverage.** StepStone, Indeed and company career pages are missing, and title-based inclusion has measured precision but unmeasured recall.
- **Styrian detail.** Styrian cells are small (n = 58), so they are reported as counts and labelled tentative.
- **Anything causal.** There are no hiring outcomes, so no requirement is evidence of what gets someone hired.

## Decision

The snapshot is an evidence base, not a verdict. Its findings feed two decision documents that score each role family against a declared skill profile, with stated weights and a sensitivity check under alternative weights. There is no hidden scoring, and each statement traces to a table id.

> [!faq]- Why are the raw ads not published?
> A terms-of-use audit found that all five posting sources restrict automated extraction, so the collection stays a one-off private research set. The collectors and the raw ads are not published; the public repository holds the code, the rules and the aggregated tables, with every text and URL column removed.

Code is under MIT; documents and aggregated outputs are under CC BY 4.0.

> [!bookmark] Next
> [01-02 Austrian MMM and budget optimiser](/en/work/austrian-mmm-budget-optimizer/) — Bayesian media-mix modelling. A budget decision with a downside check.

> [!cta]
> [Open the repository](https://github.com/RafaelBraga-Kribitz/austria-data-job-market-intelligence)

[^1]: The AMS JobBarometer counts online ads per occupation class and federal state; “Data Scientist” is the class the trend is read from.
