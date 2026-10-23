---
code: "01-05"
kind: case
date: "2026-05-21"
updated: "2026-09-16"
summary: "€453,000 over five years. One person and three mobile robots lead the model."
lead: "At the modelled demand, humanoids do not yet beat the lean hybrid. A five-year cost model for warehouse pick, move and place work."
domain: Operations
tags: [ status/complete, intralogistics, total-cost-of-ownership, simulation ]
lang: en
slug: warehouse-humanoid-tco
metrics:
  - { value: "€453,000", label: Lowest five-year present cost, accent: true }
  - { value: "€0.374", label: Cost per order }
  - { value: "99.8%", label: Draws won by the lean hybrid }
repository: https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco
translationStatus: approved
publish: true
---

# Warehouse humanoid TCO

> [!summary] Summary
> One person with three autonomous mobile robots (AMRs) has the lowest five-year present cost, €453,000, and wins 99.8% of the evaluated draws. Humanoids are deferred until demand, labour supply or shift patterns change.

## Question

The question is unit economics, not capability. At what price, demand and staffing level would a humanoid fleet become the cheaper way to run pick, move and place work in a warehouse? The model prices seven staffing scenarios, from human-only crews through AMR hybrids to pure-humanoid fleets. The unit of comparison is five-year present cost at an 8% discount rate.

## Data

Capability assumptions use 2,359 episodes from five public UnifoLM datasets, pinned by hash. They are household demonstrations (plates into a dishwasher, pillow pickup, clothes into a washing machine, single- and dual-arm manipulation), not warehouse tasks. The model uses their pick, move and place primitives as a proxy and applies a speed-transfer factor between 0.50 and 0.90. That transfer is the largest threat to external validity, and it is stated before any result.

Labour is priced at Austrian collective-agreement (KV) wage rates; robot and AMR capex uses public price assumptions. Integration cost and availability derating are part of the model.

> [!aside]
> These are not measurements from a deployed warehouse fleet. The proxy is the first limitation listed below.

> [!spec] Model inputs
> - Episodes — 2,359 · five public UnifoLM datasets, pinned by hash
> - Speed transfer — factor 0.50–0.90 on the demonstrated speed
> - Scenarios — 7 · 15 replicas each, 105 runs
> - Demand — 120 orders per hour · utilisation at most 0.85
> - Uncertainty — 10,000 Monte Carlo draws per scenario
> - Discount rate — 8% a year over five years
> - Labour — Austrian collective-agreement (KV) wage rates
> - Capex — public price assumptions for robots and AMRs

## Method

Four modules run in order from one command:

1. **Capability extraction.** Cycle times and a rule-based task taxonomy from the episodes.
2. **Discrete-event simulation.** Seven staffing scenarios, 15 replicas each (105 runs), demand-bound at 120 orders an hour; each scenario is sized to a utilisation of at most 0.85.
3. **Five-year cost with Monte Carlo.** 10,000 draws per scenario, one-at-a-time and Sobol sensitivity analysis, and a binary search for the humanoid price at which the fleet breaks even.
4. **Reporting.** Executive charts, CSV exports, an executive summary in German and English, and a Tableau Public workbook.

> [!definition] Present cost
> Future cash flows discounted to today at the stated rate, so that costs falling in different years can be added. Here 8% a year over five years.

One tracked finding changed the headline.[^1] An earlier version compared fixed crews of different sizes, eight people against six AMR-hybrid units, so its “cheapest option” mixed a smaller crew with a technology choice. Every non-legacy scenario is now sized by the same optimiser to the minimum five-year cost under the utilisation cap, and the eight-person crew stays only as a labelled reference for the cost of overstaffing.

## Result

Of the seven scenarios, the lean hybrid of one person and three AMRs has the lowest five-year present cost. Its capital requirement is €195,000.

> [!bars] Fig. 01-05-1 · Five-year present cost by scenario
> The lean hybrid costs 30% less than people alone and less than a fifth of the best humanoid case.
> - Lean hybrid — 453
> - Human-only — 647
> - Humanoid 2028 — 2533
> - Pure humanoid — 2878
>
> accent: Lean hybrid
> caption: Present value at 8%, in thousands of euros; scale 0–2,878. n = 4 of 7 scenarios. Lean hybrid is S-lean-hybrid-amr, Human-only S-lean-human, Humanoid 2028 S-future-2028 (the best humanoid case), Pure humanoid S-pure-humanoid.
> source: five-year TCO model, project repository, last updated 16 Sep 2026.

The table gives all seven. S-lean-hybrid-amr is the lean hybrid, S-lean-human the lean crew of three and S-future-2028 the best humanoid case; S-baseline-human (legacy) is the labelled reference for the cost of overstaffing.

| Scenario | Five-year present cost | Capex | Cost per order |
|:--|--:|--:|--:|
| S-lean-hybrid-amr | €452,706 | €195,000 | €0.374 |
| S-lean-human | €647,401 | €0 | €0.543 |
| S-baseline-human (legacy) | €1,726,403 | €0 | €1.444 |
| S-future-2028 | €2,532,753 | €1,365,349 | €2.120 |
| S-pure-humanoid | €2,877,837 | €2,051,609 | €2.407 |
| S-hybrid-amr | €3,841,113 | €2,311,609 | €3.244 |
| S-hybrid-5050 | €5,251,641 | €2,051,609 | €4.411 |

The breakeven search ran humanoid capex from €10,000 to €500,000 per unit and found no price at which a pure-humanoid fleet matches the lean hybrid’s cost per order at 120 orders an hour. Even near-free humanoids lose, so capex is not the binding constraint.

For the lean hybrid, the Monte Carlo cost has a mean of €461,414 with a standard deviation of €43,755, and a 90% interval from €394,658 to €537,549.

> [!quote] Result · 10,000 draws per scenario
> The lean hybrid wins 99.8% of the evaluated draws.

## Limitations

The ranking holds only under the stated assumptions. What this does not establish:

- **Warehouse performance.** Household demonstrations remain a proxy for warehouse tasks.
- **A site-specific procurement case.** There are no warehouse-native cycle times and no signed humanoid quotes.
- **Local prices.** Public list prices and estimated KV wages can move the cost either way.
- **Independent reproduction.** The committed reproduction log was produced by an agent, not by a third party cloning the repository cold.

> [!warning] One assumption cuts against the robots
> The model assumes labour is available at KV rates. In Austrian intralogistics the practical driver of automation is unfilled vacancies rather than wage arbitrage, so robot value is understated wherever vacancies stay open.

## Decision

Under these assumptions, deploy the lean hybrid now and defer humanoid procurement. Capex is not the binding constraint, so a lower humanoid price alone does not change the call.

> [!faq]- When is the call worth revisiting?
> Under demand growth, labour scarcity or multi-shift operation. At the modelled demand, no humanoid price in the searched range breaks even.

The repository holds the code, the charts, the executive summaries and the governance record.



[^1]: The build runs under a governance protocol enforced in continuous integration (CI): every change closes a tracked finding with a named verification script, and CI re-runs the script of every closed finding on each pull request.
