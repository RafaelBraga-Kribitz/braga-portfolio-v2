---
code: "01-03"
kind: case
date: "2026-08-04"
summary: "Bayesian media-mix modelling. A budget decision with a downside check."
lead: "A Bayesian marketing-mix model that estimates what each channel adds, tests platform-reported attribution against a known truth, and moves budget only where the evidence clears a breakeven rule."
domain: Marketing
tags: [ status/complete, marketing, media-mix-modelling, budget-optimisation ]
lang: en
slug: austrian-mmm-budget-optimizer
metrics:
  - { value: "15.1%", label: "Median gain, same budget, simulated data", accent: true }
  - { value: "91%", label: "Curve coverage, generated data" }
  - { value: "+45%", label: "Platform over-credit, paid search" }
stack: [ "Python", "Power BI", "DAX", "PyMC", "Bayesian", "Jupyter", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer
translationStatus: approved
publish: true
---

# Austrian MMM and budget optimiser

## Question: With the same media budget, which channels should get more money and which should get less?

> [!summary] Summary
> The model is validated against a known truth before it decides anything. On Meta’s public Robyn demo data, the same weekly budget is reallocated under a breakeven rule. Under the reported priors, this gains a median 15.1% of current media contribution. No loss appears in any of the 500 posterior draws used.

## Background

The unit of comparison is contribution profit, not revenue. A channel below its breakeven return on ad spend (ROAS) destroys margin, however large its reported revenue looks.

## Data

“Austrian” names the setting, not the data: weekly grain, the Austrian public-holiday calendar as a control, euro and contribution-margin logic. No Austrian client data was used. The first layer must pass before the second counts.

| Layer | Data | Role |
|:--|:--|:--|
| P | Generated advertiser with disclosed true parameters: 156 weeks, five channels (TV, radio, print, paid search, paid social) | Must pass first |
| R | Meta’s public Robyn demo file (MIT licence): simulated weekly data, five named channels, revenue in the file’s own money units, competitor sales as the control | Counts only after P passes |
| D | Layer R posterior, given to the budget optimiser | Written decision rule |

> [!spec] Model inputs
> - Grain — weekly
> - Carry-over — geometric adstock per channel, decay estimated
> - Saturation — Hill curve on the adstocked spend
> - Baseline — linear trend · two yearly Fourier pairs · one control
> - Priors — weakly informative and identical across channels, so no channel has a preferred answer
> - Contribution margin — 40%, assumed
> - Breakeven ROAS — 2.50

The [repository’s prior-sensitivity report](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/bd547f4bf88ff103d76a53df1883cd0dbd7f70d5/reports/PRIOR_SENSITIVITY.md) refits Layer R with vague priors. The medians barely move, but the intervals widen. Facebook’s lower bound falls from 4.06 to 0.27, below breakeven, and TV’s stays above it (4.52 and 4.19).

## Method

Validation runs before any decision.

| Step | Action | Check |
|:--|:--|:--|
| 1 | Fit in PyMC and sample with NUTS (nutpie): two chains, 1,000 tuning steps and 1,000 draws, target acceptance 0.9, raised by a recorded ladder after divergences. Reported fits ran at 0.95 with 2,000 draws per chain. Count a fit only if it passes | R-hat below 1.01, effective sample size above 400, zero divergences. Diagnostics are written next to each fit |
| 2 | On Layer P, recover the truth the sampler was handed, and score the platform-style attribution against the same truth | Recovery against disclosed true parameters |
| 3 | Score the model on a 26-week holdout on both layers | Ridge regression and a seasonal naive forecast |
| 4 | Hand the Layer R posterior to the optimiser under a decision rule fixed before it runs | Reallocation gain across 500 posterior draws |

> [!definition] Decision rule
> Shift budget toward a channel only while the lower bound of its marginal-ROAS 90% interval stays above breakeven. Shift budget only if the 10th percentile of the reallocation gain is positive. The rule is fixed before the optimiser runs.

Numbers in the repository README are rendered from the report files, and a test checks that the two agree.

## Result

> [!note] Reviewed on 26 Oct 2026
> The repository’s build log records reruns of the decision layer and synthetic-data validation after code fixes on 30 Sep 2026. This sharing review did not rerun the model, so the figures are reported from that work.

### Validation on Layer P

| Measure | Value | Reading |
|:--|--:|:--|
| Curve coverage | 91% | True response curves inside the posterior band, over the observed spend range |
| TV curve coverage | 56% | Weakest channel. Aggregate coverage hides it ([repository’s validation summary](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/c63e16b7f0f0f5e6452216b600c4ed619a9bdf6b/README.md)) |
| True parameters inside 90% intervals | 26 of 28 | The misses are explained below |
| TV true revenue share | Just outside its interval | Same weakest channel |
| Platform over-credit, paid search | +45% | Platform-reported against true incremental revenue |
| Platform credit, offline channels | None | Platform-style report, scored against the same truth |

The misses follow a known trade-off, not a bug. All five effect sizes and all five half-saturation points have medians above the truth. This happens because a curve that rises higher but saturates later fits the same weeks. Recovery is therefore judged on curves and shares, which a budget decision uses.

### Reallocation on Layer R

The same total weekly budget, reallocated under the decision rule, gains a median ==15.1%== of current media contribution (10th percentile 8.8%). None of the 500 posterior draws used shows a loss.

> [!bars] Fig. 01-03-1 · Recommended change in weekly spend
> 8,495 a week moves out of out-of-home: 7,422 to TV and about 1,073 to Facebook.
> - TV — 7422
> - Facebook — 1072
> - Print — 0
> - Search — 0
> - Out-of-home — −8495
>
> scale: −9000–9000 · centre: yes
> caption: Change in weekly spend, in the dataset’s money units: recommended minus current from the table below, rounded. n = 5 channels. TV and Facebook stop at the +50% extrapolation guard (`bound_share`: each channel moves at most 50% of current spend), not at the breakeven rule. Out-of-home still holds 49.7% of the budget.
> source: Layer R, Meta’s public Robyn demo file, reallocated under the decision rule. Published figures, last validated 16 Sep 2026.

> [!figure] Fig. 01-03-2 · Marginal ROAS against breakeven
> TV clears the 2.50 line under both prior sets. Facebook clears it only under the reported priors. Print and search cross the line, and out-of-home stays below.
> ![[01-03-roas-interval.en.svg]]
>
> caption: Median marginal ROAS at current spend, with its 90% interval, on a log scale from 0.05 to 50. n = 5 channels. Under vague priors Facebook’s lower bound falls from 4.06 to 0.27 in the repository’s prior-sensitivity fit, a different fit from the plotted one (4.76). TV’s lower bound stays above 2.50 under both prior sets (4.52 and 4.19). The data are simulated, and the breakeven of 2.50 assumes a 40% contribution margin.
> source: Layer R, Meta’s public Robyn demo file; simulated data. Prior sensitivity: [repository report](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/bd547f4bf88ff103d76a53df1883cd0dbd7f70d5/reports/PRIOR_SENSITIVITY.md).

Spend is weekly, in the dataset’s own money units, not euros. Shares, ROAS ratios and the breakeven test carry over.

| Channel | Spend now | Recommended | Rule outcome |
|:--|--:|--:|:--|
| TV | 14,844 | 22,266 | Move toward |
| Facebook | 2,146 | 3,218 | Move toward |
| Print | 3,729 | held | Hold |
| Search | 5,916 | held | Hold |
| Out-of-home | 43,218 | 34,723 | Move away: whole interval below 2.50 |

### Holdout

The holdout is 26 weeks. Cells are mean absolute percentage error (MAPE), except the last column.

| Layer | MMM | Ridge regression | Seasonal naive | MMM 90% coverage |
|:--|--:|--:|--:|--:|
| P | 3.0% | 4.7% | 9.6% | 85% |
| R | 7.9% | 5.1% | 22.3% | 100% |

The MMM lost to ridge regression on Layer R, and that is reported as it came out. The case for the MMM is that it says which channel earned the revenue, with intervals, which the baselines cannot. On Layer P its intervals were slightly too narrow, so the model is a little overconfident.

## Limitations

- **Real advertiser data.** Layer R is a simulated public dataset in unnamed money units. A swap-in of real advertiser data is planned, not done.
- **The model form.** One form is assumed (geometric adstock, Hill saturation, additive baseline). Recovery on Layer P shows the sampler finds that form, not that reality has it.
- **Channels that move together.** Weekly national data cannot separate channels whose spend moves together, so the intervals widen.
- **Behaviour at new spend levels.** The optimiser assumes response curves hold at new spend levels and competitors do not react.

## Decision

Under the written rule and the reported priors, move budget toward TV and Facebook, take it from out-of-home, and hold print and search. The Facebook move rests on the priors as much as on the data: vague priors would fund TV alone. The decision also rests on a simulated public dataset: see Limitations.

> [!faq]- What would reverse the decision?
> A re-estimate in which the lower bound of TV’s or Facebook’s marginal-ROAS 90% interval falls to 2.50 or below stops the move toward that channel. A refit with vague priors puts Facebook’s lower bound at 0.27 and stops the move toward Facebook. A 10th percentile of the reallocation gain that is no longer positive stops the reallocation. The recommendation also rests on the assumptions under “Behaviour at new spend levels”, which no check establishes.

## Build log

```buildlog
```
