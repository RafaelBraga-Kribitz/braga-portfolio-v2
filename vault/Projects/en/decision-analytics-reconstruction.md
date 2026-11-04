---
code: "01-04"
kind: case
date: "2026-05-07"
summary: A three-module reconstruction. Allocation gains are proxies, not campaign effects.
lead: "The 2018 Paraguay presidential election, reconstructed as three connected decision modules (voter segmentation, budget allocation and poll tracking) from what a campaign could see in early 2018."
domain: Decision science
tags: [ status/complete, election-campaigns, segmentation, optimisation, bayesian-tracking ]
lang: en
slug: decision-analytics-reconstruction
metrics:
  - { value: "+54.77%", label: "Proxy contacts against uniform, synthetic reach, approximate", accent: true }
  - { value: "4 of 6", label: "Held-out polls inside the 95% band" }
  - { value: "50,000", label: "Synthetic voters, 14 weeks" }
stack: [ "Python", "PyMC", "Bayesian", "Optimisation", "scikit-learn", "FastAPI", "Streamlit", "MLflow", "Docker", "GCP", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction
translationStatus: approved
publish: true
---

# Decision analytics reconstruction

## Question: With only public polls, census data and a fixed budget, how can a campaign follow a national race and decide where to spend?

> [!summary] Summary
> Three modules run end to end on 50,000 synthetic voters, raked to verified department-level anchors. On a USD 6 million envelope, the allocator finds about 54.77% more linearised persuasion-proxy contacts than a department-uniform allocation. That gain is a solver comparison on synthetic reach, the tracking curve is a retrodiction, and nothing here claims that analytics caused the official lead.

## Background

This reconstruction of the 2018 Paraguay presidential election uses what a campaign could see in early 2018: eight public polls and census aggregates. It tests how honestly a campaign can state what it knows, comparing proxy contacts with a uniform allocation and the tracker with held-out polls.

> [!spec] Official result, 2018
> - Mario Abdo Benítez — 1,206,067 votes
> - Efraín Alegre — 1,110,464 votes
> - Lead — 95,603 votes
> - Share of valid candidate votes — 3.88 points of 2,463,441
> - Share of all ballots — 3.68 points of 2,597,989
> - Turnout — 61.25%, TSJE
> - Source — [official statistical yearbook, table 5.3.1](https://informacionpublica.paraguay.gov.py/public/7234448-AnuarioEstadistico2018pdf-AnuarioEstadistico2018.pdf)

> [!note] Modelling anchor
> Series A uses +3.70 points (46.43% versus 42.73%). That convention is not the exact final-count lead on either denominator. This editorial correction does not refit the reconstruction.

## Data

The public anchors are verified and every individual voter is synthetic, so no real person is represented while the aggregates still hold.

> [!spec] Inputs
> - Public anchors — TSJE final results · DGEEC census aggregates · INE 2018 household survey · eight published tracking polls
> - Voter file — 50,000 synthetic records, raked to department-level turnout, gender, rural share and language
> - Window — 14 weeks · seed 42
> - Module A — the synthetic voter file · a holdout of 15,000 voters
> - Module B — 2,772 rows: 18 departments × 11 channels × 14 weeks · a USD 6 million envelope
> - Module C — the eight published polls · the verified outcome

Each artefact carries an epistemic tag (verified, calibrated, simulated or illustrative). The repository holds the register of tags, and the tag travels with the number.

## Method

Every headline number lives in one numeric source-of-truth table that continuous integration checks. The pipeline enforces the handoff of the allocation between modules.

> [!figure] Fig. 01-04-1 · Three modules, one pipeline
> Three modules run in order, and each ends in its own check.
> ![[01-04-module-flow.en.svg]]
>
> caption: Module A reads the voter file. Module B reads its 2,772 rows and the USD 6 million envelope. Module C reads the eight polls and the verified outcome. The pipeline enforces the allocation handoff.
> source: project repository, pipeline and checks as listed under Data.

| Module | Method | Can claim | Cannot claim |
|:--|:--|:--|:--|
| A | K-means with six segments, plus a Platt-calibrated turnout propensity. Gates: silhouette score and bootstrap adjusted Rand index (ARI). Brier score on a 15,000-voter holdout. | Six segments that clear both gates. A calibrated propensity scored on 15,000 held-out synthetic voters. | That the model generalises. |
| B | Mixed-integer linear program (MILP) in PuLP, solved with CBC, over 2,772 rows. Budget, reach caps, an exchange-rate layer and an 80% coverage floor. It maximises a linearised persuasion proxy and runs through FastAPI. | A solver comparison on synthetic reach: contacts of one allocation against another. | A historical effect of the 2018 campaign. |
| C | Gaussian random walk with house effects (the systematic lean of each polling firm), fitted in PyMC to eight polls. Stratified Monte Carlo scenarios, 10,000 draws by default. | A retrodiction of the race through the eight polls. | A forecast, or forecasting skill. |

Module A also reaches an area under the curve (AUC) of about 0.89. The project does not headline it. The propensity features share calibration anchors with the target, so the AUC measures how well the raking was recovered, not generalisation.

> [!definition] Retrodiction
> A fit that conditions on the known outcome. The tracking curve is one: it conditions on the verified result, so it cannot be read as a forecast.

## Result

| Module | Measure | Value | Gate or baseline |
|:--|:--|--:|:--|
| A | Silhouette | 0.2562 | Gate 0.22 |
| A | Bootstrap ARI | 0.4304 | Gate 0.40 |
| A | Brier score, turnout propensity | 0.1185 | 15,000-voter holdout |
| B | Linearised persuasion-proxy contacts | About +54.77% | Department-uniform allocation, USD 6 million envelope |
| C | Brier score, sign of the margin | 0.3225 | Held-out polls |
| C | Log loss, sign of the margin | 1.1184 | Held-out polls |
| C | Held-out polls inside the 80% interval | 50% | 6 held-out waves |

The allocation figure is a solver comparison on synthetic reach, not a historical effect of the 2018 campaign.

The refits hold out each real poll wave and provably exclude the election result. This is the one true out-of-sample check, reported unflattered.

> [!figure] Fig. 01-04-2 · Held-out polls against the 95% band
> The 95% band caught 4 of 6 held-out polls. A calibrated band would catch about 6.
> ![[01-04-wave-intervals.en.svg]]
>
> caption: The chart shows the observed margin of each real poll wave, in percentage points. It is set against the 95% band of a refit that holds that wave out and excludes the election result. n = 6 waves. Misses are in the accent colour. Full run: 4 chains of 1,000 draws, and the sampler diagnostics pass in every fold. Eight waves give 6 holdouts at `min_train_size=2`. The earlier fast run caught 3 of 6, and one wave moved. Six waves are too few to call that an improvement.
> source: project repository, [reports/module_c/walk_forward_loo_report.md](https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction/blob/86f6d3b1f3e9a4312ac5320f83e3ddd08050a257/reports/module_c/walk_forward_loo_report.md).

Eight polls are far too few to claim forecasting skill, and the project does not claim it.

## Limitations

- **Hand-set inputs.** The [repository’s data register](https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction/blob/6a5d2cef1216f43572d073e8abfab57329daff85/README.md) lists exchange-rate, exchange-rate spread, channel-unit-cost and department-population inputs as hand-set and not yet verified. The Module B gain is a solver comparison under those assumptions.
- **A causal effect.** A with-and-without-analytics counterfactual cannot be verified here.
- **Individual behaviour.** Aggregate calibration of synthetic voters does not mean real behaviour was recovered.
- **Campaign economics.** Module B optimises linearised contacts, not audited 2018 campaign accounting or fitted response curves.
- **Full scale.** The pipeline runs 50,000 voters over 14 weeks. The full roll of 4.26 million voters is a design reference.
- **Production use.** This is a portfolio reconstruction, not a production campaign system.

## Decision

Report each module only as far as its own check reaches. The public result is the anchor, and showing what the model can and cannot support is the point of the work.

## Build log

```buildlog
```
