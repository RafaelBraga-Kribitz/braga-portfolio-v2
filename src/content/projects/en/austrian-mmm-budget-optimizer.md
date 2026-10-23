---
title: Austrian MMM and budget optimiser
code: "01-03"
kind: case
date: "2026-08-04"
summary: "Bayesian media-mix modelling. A budget decision with a downside check. Under revision: the published figures are being re-estimated."
lead: "A Bayesian marketing-mix model that estimates what each channel adds, tests platform-reported attribution against a known truth, and moves budget only where the evidence clears a breakeven rule."
domain: Marketing
status: under-revision
tags: [Marketing, Media Mix Modelling, Budget Optimisation]
lang: en
slug: austrian-mmm-budget-optimizer
metrics:
  - { value: "91%", label: Curve coverage }
  - { value: "26 of 28", label: Parameters recovered }
  - { value: "+45%", label: "Platform over-credit, paid search", accent: true }
repository: https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer
draft: false
translationStatus: approved
---

> [!summary] Summary
> Under revision: the published figures are being re-estimated. As published, the model is validated against a known truth before it decides anything, and on Meta’s public Robyn demo data the same weekly budget, reallocated under a breakeven rule, gains a median 15.1% of current media contribution with no loss in any of the 500 posterior draws used. The rule moves budget toward TV and Facebook, takes it from out-of-home, and holds print and search, whose interval lower bounds fall below breakeven.

## Question

The question is the one every advertiser asks of its media plan: which channels contributed incrementally, how far off were the platform-reported numbers, and what does moving the same budget actually gain? The unit of comparison is contribution profit, not revenue. A channel that returns less than its breakeven return on ad spend (ROAS) destroys margin, however large its reported revenue looks.

## Data

“Austrian” names the setting the model is built for, not the data behind it: weekly grain, the Austrian public-holiday calendar as a control, euro and contribution-margin logic. No Austrian client data was used. The model runs in three layers, and the first has to pass before the second counts:

- **Layer P**, a generated advertiser with disclosed true parameters: 156 weeks, five channels (TV, radio, print, paid search, paid social).
- **Layer R**, Meta’s public Robyn demo file (MIT licence): simulated weekly data for five named channels, revenue in the file’s own money units, competitor sales as the control.
- **Layer D**, the Layer R posterior handed to a budget optimiser under a written decision rule.

> [!spec] Model inputs
> - Grain — weekly
> - Carry-over — geometric adstock per channel, decay estimated
> - Saturation — Hill curve on the adstocked spend
> - Baseline — linear trend · two yearly Fourier pairs · one control
> - Contribution margin — 40%, assumed
> - Breakeven ROAS — 2.50

The priors are weakly informative and identical across channels, so the estimates come from the data rather than from a prior that already knows the answer.

## Method

Validation comes before any decision, so the steps run in this order:

1. Fit the model in PyMC and sample it with NUTS (nutpie): two chains of 1,000 tuning steps and 1,000 draws, target acceptance 0.9, raised to 0.99 by a recorded ladder after divergences.
2. Count a fit only with R-hat below 1.01, effective sample size above 400 and zero divergences. Every fit writes those diagnostics next to itself.
3. On Layer P, check that the sampler recovers the truth it was handed, and score the platform-style attribution against the same truth.
4. Score the model on a 26-week holdout on both layers, against ridge regression and a seasonal naive forecast.
5. Hand the Layer R posterior to the optimiser under a decision rule fixed before it runs, and read the reallocation gain across 500 posterior draws.

> [!definition] Decision rule
> Shift budget toward a channel only while the lower bound of its marginal-ROAS 90% interval stays above breakeven, and only if the 10th percentile of the reallocation gain is positive. The rule is fixed before the optimiser runs.

## Result

> [!warning] Under revision
> The published figures are being re-estimated. Every figure on this page is the published one, last validated on 16 Sep 2026.

### Validation on Layer P

The sampler has to recover the truth it was handed. Curve coverage is 91% (the true response curves inside the posterior band, over the observed spend range), and 26 of 28 true parameter values lie inside their 90% intervals. The misses follow a known trade-off rather than a bug: all five effect sizes and all five half-saturation points have medians above the truth, because a curve that rises higher but saturates later fits the same weeks. Recovery is therefore judged on curves and shares, which are what a budget decision uses.

Scored against the same truth, the platform-style report over-credits paid search by 45% (platform-reported against true incremental revenue) and gives the offline channels no credit at all.

### Reallocation on Layer R

On the public dataset, the same total weekly budget reallocated under the decision rule gains a median ==15.1%== of current media contribution. The 10th percentile is 8.8%, and none of the 500 posterior draws used shows a loss.

> [!bars] Fig. 01-03-1 · Recommended change in weekly spend
> Budget moves from out-of-home to TV and Facebook.
> - TV — 50
> - Out-of-home — −20
> - Print — 0
> - Facebook — 50
> - Search — 0
>
> scale: −50–50 · unit: % · centre: yes
> caption: Change from current to recommended weekly spend, same total budget; n = 5 channels. Print and search are held (0%): the lower bounds of their intervals fall below breakeven. Centre line = zero; range −50% to +50%.
> source: Layer R, Meta’s public Robyn demo file, reallocated under the decision rule. Published figures, last validated 16 Sep 2026.

Weekly spend by channel, now and as recommended, in the dataset’s money units:

| Channel | Spend now | Recommended |
|:--|--:|--:|
| TV | 14,844 | 22,266 |
| Out-of-home | 43,218 | 34,723 |
| Print | 3,729 | held |
| Facebook | 2,146 | 3,218 |
| Search | 5,916 | held |

The marginal ROAS the rule tests, at current spend: the median and the 90% interval, whose lower bound the breakeven gate reads.

| Channel | Median | 90% interval |
|:--|--:|--:|
| TV | 7.26 | 4.38–10.72 |
| Out-of-home | 0.75 | 0.10–1.68 |
| Print | 7.81 | 1.22–16.01 |
| Facebook | 20.53 | 4.76–45.52 |
| Search | 7.68 | 0.89–25.55 |

The breakeven gate is what holds print and search. Their medians are high, but the lower bounds of their intervals fall below 2.50, so no budget moves toward them. Out-of-home’s whole interval lies below 2.50. Amounts are in the dataset’s own money units, not euros; shares, ROAS ratios and the breakeven test are the quantities that carry over.

### Holdout

On a 26-week holdout against two baselines, the model had the lowest mean absolute percentage error (MAPE) on Layer P: 3.0%, against 4.7% for ridge regression and 9.6% for a seasonal naive forecast. It lost on Layer R, at 7.9% against ridge regression’s 5.1%. That is reported as it came out. The case for the MMM is that it says which channel earned the revenue, with intervals, which the baselines cannot. On Layer P its 90% intervals covered 85% of holdout weeks: slightly too narrow, so the model is a little overconfident.

> [!quote] Result · Layer R, 500 posterior draws
> Reallocated under the breakeven rule, the same weekly budget gains a median 15.1% of current media contribution, and none of the 500 draws shows a loss.

## Limitations

What this does not establish:

- **Real advertiser data.** Layer R is a simulated public dataset in unnamed money units. A swap-in of real advertiser data is planned, not done.
- **The model form.** One model form is assumed (geometric adstock, Hill saturation, additive baseline). Recovery on Layer P shows the sampler recovers that form, not that reality has it.
- **Channels that move together.** Weekly national data cannot separate channels whose spend moves together; the intervals widen accordingly.
- **Behaviour at new spend levels.** The optimiser assumes response curves hold at new spend levels and that competitors do not react.

## Decision

Under the written rule, move budget toward TV and Facebook, take it from out-of-home, and hold print and search: no budget moves toward a channel whose interval’s lower bound falls below the breakeven ROAS of 2.50. The decision is made on a simulated public dataset in unnamed money units; a swap-in of real advertiser data is planned, not done.

> [!faq]- What would reverse the decision?
> The rule names the conditions itself. A re-estimate in which the lower bound of TV’s or Facebook’s marginal-ROAS 90% interval falls to 2.50 or below stops the move toward that channel, and a 10th percentile of the reallocation gain that is no longer positive stops the reallocation. The optimiser also assumes that response curves hold at the new spend levels and that competitors do not react; the recommendation rests on both, and neither is established.

Code, reports and the decision memo are in the repository. The numbers in its README are rendered from the report files, and a test checks that the two agree.
