---
title: Decision analytics reconstruction
code: "01-03"
kind: case
date: "2026-05-07"
summary: A three-module reconstruction. Allocation gains are proxies, not campaign effects.
lead: "The 2018 Paraguay presidential election, reconstructed as three connected decision modules (voter segmentation, budget allocation and poll tracking) from what a campaign could see in early 2018."
domain: Decision science
status: functional
tags: [Election Campaigns, Segmentation, Optimisation, Bayesian Tracking]
lang: en
slug: decision-analytics-reconstruction
metrics:
  - { value: "+3.70 pp", label: "Verified margin, TSJE", accent: true }
  - { value: "61.25%", label: "Turnout, TSJE" }
  - { value: "50,000", label: "Synthetic voters, 14 weeks" }
repository: https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction
draft: false
translationStatus: approved
---

> [!summary] Summary
> Three connected modules run end to end on 50,000 synthetic voters raked to the verified department-level anchors: on a USD 6 million envelope the allocator finds about 54.77% more linearised persuasion-proxy contacts than a department-uniform allocation, and the poll tracker’s 95% band caught the held-out poll in 3 of 6 tested waves. Each module is reported only as far as its own check reaches, so the gain stands as a solver comparison on synthetic reach, the tracking curve as a retrodiction, and nothing here claims that analytics caused the verified margin of 3.70 percentage points.

## Question

Given only eight public polls, census aggregates and a fixed budget, how can a campaign track a national race, allocate money across the country, and stay honest about what it actually knows? The reconstruction works from what a campaign could see in early 2018 and reasons toward a result that is public: Mario Abdo Benítez won the presidential election by 3.70 percentage points (46.43% against 42.73%) on 61.25% turnout, according to the final results of the electoral tribunal (TSJE). The units of comparison are linearised persuasion-proxy contacts on a fixed budget, measured against a department-uniform allocation, and, for the tracker, held-out poll waves.

## Data

The public anchors are verified: the TSJE returns, DGEEC census aggregates, the INE 2018 household survey on internet and WhatsApp use, and eight published tracking polls. Every individual voter is synthetic. A 50,000-record voter file is raked to the verified department-level anchors (turnout, gender, rural share, language), so no real person is represented while the aggregates still hold.

> [!spec] Inputs
> - Public anchors — TSJE final results · DGEEC census aggregates · INE 2018 household survey · eight published tracking polls
> - Voter file — 50,000 synthetic records, raked to department-level turnout, gender, rural share and language
> - Window — 14 weeks · seed 42
> - Module A — the synthetic voter file · a holdout of 15,000 voters
> - Module B — 2,772 rows: 18 departments × 11 channels × 14 weeks · a USD 6 million envelope
> - Module C — the eight published polls · the verified outcome

Each artefact carries an epistemic tag (verified, calibrated, simulated or illustrative), and the register of those tags is part of the repository. The tag travels with the number.

## Method

The three modules run as one pipeline, A to B to C, with an enforced handoff of the allocation between them:

1. **Module A, segmentation and turnout.** Cluster the synthetic voters and score their turnout propensity.
2. **Module B, allocation.** Spread the budget across departments, channels and weeks with a mixed-integer linear program.
3. **Module C, poll tracking.** Fit a tracking curve to the eight polls, then run scenarios from it.

Each module is labelled with what it can and cannot claim.

### Module A: segmentation and turnout

K-means with six segments on the synthetic population, plus a Platt-calibrated turnout propensity. The segments are held to two gates, the silhouette score and the bootstrap adjusted Rand index (ARI); the propensity is scored by its Brier score on a 15,000-voter holdout.

- **Can claim.** Six segments that clear both gates, and a Platt-calibrated turnout propensity scored on 15,000 held-out synthetic voters.
- **Cannot claim.** That the model generalises. It also reaches an area under the curve (AUC) of about 0.89, which is deliberately not headlined: the propensity features share calibration anchors with the target, so the AUC measures how well the raking was recovered, not how well the model generalises.

### Module B: allocation

A mixed-integer linear program (MILP), written in PuLP and solved with CBC, over 2,772 rows: 18 departments × 11 channels × 14 weeks. It runs under a budget, reach caps, an exchange-rate layer and an 80% coverage floor, maximises a linearised persuasion proxy, and is served through a FastAPI application.

- **Can claim.** A solver comparison on synthetic reach: how many linearised persuasion-proxy contacts one allocation produces against another.
- **Cannot claim.** A historical effect of the 2018 campaign.

### Module C: poll tracking

A Gaussian random walk with house effects (the systematic lean of each polling firm), fitted in PyMC to the eight polls, then stratified Monte Carlo scenarios, 10,000 draws by default.

> [!definition] Retrodiction
> A fit that conditions on the known outcome. The tracking curve is one: it conditions on the verified result, so it cannot be read as a forecast.

- **Can claim.** A retrodiction of the race through the eight polls.
- **Cannot claim.** A forecast, or forecasting skill.

## Result

Every headline number lives in one numeric source-of-truth table that continuous integration (CI) checks. The results follow module by module.

### Segmentation

Both gates are cleared, and the turnout propensity reaches a Brier score of 0.1185 on the 15,000-voter holdout.

| Measure | Value | Gate |
|:--|--:|--:|
| Silhouette | 0.2562 | 0.22 |
| Bootstrap ARI | 0.4304 | 0.40 |

### Allocation

On a USD 6 million envelope, the MILP produces about 54.77% more linearised persuasion-proxy contacts than a department-uniform allocation. That is a solver comparison on synthetic reach, not a historical effect of the 2018 campaign.

### Tracking

The one true out-of-sample check is reported unflattered. Refitting the tracker with each real poll wave held out, and the election result provably excluded, the 95% band caught the held-out poll in 3 of 6 tested waves, with a Brier score of 0.31 on the sign of the margin.

> [!bars] Fig. 01-03-1 · Out-of-sample check
> The 95% band caught the held-out poll in 3 of 6 waves.
> - Tested — 6
> - Caught — 3
>
> scale: 0–6
> caption: Count of real poll waves on a scale of 0–6, each wave held out in turn with the election result excluded; n = 6 tested waves.
> source: Module C refits, project repository.

Eight polls are far too few to claim forecasting skill, and the project does not claim it.

> [!quote] Result · Module B solver comparison, Module C refits
> The three modules run end to end; the allocation gain of about 54.77% is a solver comparison on synthetic reach, and the tracker’s 95% band caught the held-out poll in 3 of 6 tested waves.

## Limitations

What this does not establish:

- **A causal effect.** A with-and-without-analytics counterfactual cannot be verified here.
- **Individual behaviour.** Aggregate calibration of synthetic voters does not mean real behaviour was recovered.
- **Campaign economics.** Module B optimises linearised contacts, not audited 2018 campaign accounting or fitted response curves.
- **Full scale.** The pipeline runs 50,000 voters over 14 weeks; the full roll of 4.26 million voters is a design reference.

## Decision

Report each module only as far as its own check reaches: the segments as a fit to synthetic voters, the allocation gain as a solver comparison on synthetic reach, and the tracking curve as a retrodiction. The reconstruction does not claim that analytics caused the 3.70-point margin. The public result is the anchor; showing what the model can and cannot support is the point of the work.

Functional: the three modules run end to end. It is a portfolio reconstruction, not a production campaign system. The repository holds the code, the case study and the validation gates.

> [!bookmark] Next
> [01-04 Warehouse humanoid TCO](/en/work/warehouse-humanoid-tco/) — At the modelled demand, humanoids do not yet beat the lean hybrid.

> [!cta]
> [Open the repository](https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction)
