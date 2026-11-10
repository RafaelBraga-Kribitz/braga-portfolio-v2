---
code: "01-02"
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
stack: [ "SQL", "Python", "Polars", "DuckDB", "dbt", "Docker", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco
translationStatus: approved
publish: true
---

# Warehouse humanoid TCO

## Question: When would humanoid robots become the cheapest way to run warehouse work?

> [!summary] Summary
> One person with three autonomous mobile robots (AMRs) has the lowest five-year present cost, €453,000, and wins 99.8% of the evaluated draws. The decision defers humanoids until demand, labour supply or shift patterns change.

## Background

The issue is unit economics, not capability. The answer depends on humanoid price, demand and staffing level, and the unit of comparison is five-year present cost at an 8% discount rate.

## Data

The capability data are household demonstrations, not warehouse tasks and not measurements from a deployed fleet. The model uses their pick, move and place primitives as a proxy, with a speed-transfer factor. That transfer is the largest threat to external validity.

> [!spec] Model inputs
> - Episodes — 2,359 · five public UnifoLM datasets, pinned by hash
> - Demonstrations — plates into a dishwasher, pillow pickup, clothes into a washing machine, single- and dual-arm manipulation
> - Speed transfer — factor 0.50–0.90 on the demonstrated speed
> - Scenarios — 7, from human-only crews through AMR hybrids to pure-humanoid fleets · 15 replicas each, 105 runs
> - Demand — 120 orders per hour · utilisation at most 0.85
> - Uncertainty — 10,000 Monte Carlo draws per scenario
> - Discount rate — 8% a year over five years
> - Labour — Austrian collective-agreement (KV) wage rates
> - Capital expenditure (capex) — public price assumptions for robots and AMRs
> - Cost items — integration cost and availability derating included

## Method

Four modules run in order from one command.

| Step | Module | Work |
|:--|:--|:--|
| 1 | Capability extraction | Cycle times and a rule-based task taxonomy from the episodes. |
| 2 | Discrete-event simulation | Replicas of each scenario, demand-bound, with each scenario sized to the utilisation cap. |
| 3 | Five-year cost with Monte Carlo | Draws per scenario, one-at-a-time and Sobol sensitivity analysis, binary search for the humanoid price at which the fleet breaks even. |
| 4 | Reporting | Executive charts, CSV exports, an executive summary in German and English, a Tableau Public workbook. |

> [!definition] Present cost
> Future cash flows discounted to today at the stated rate, so that costs falling in different years can be added. Here 8% a year over five years.

One tracked finding changed the headline.[^1] An earlier version compared fixed crews of different sizes, eight people against six AMR-hybrid units. So its “cheapest option” mixed a smaller crew with a technology choice. The same optimiser now sizes every non-legacy scenario to the minimum five-year cost under the utilisation cap. The eight-person crew stays as a labelled reference for the cost of overstaffing.

## Result

> [!figure] Fig. 01-02-1 · Five-year present cost by scenario
> The lean hybrid has the lowest base-case cost and wins 99.8% of the draws, although its range overlaps the lean crew’s.
> ![[01-02-tco-range.en.svg]]
>
> caption: Thousands of euros, present value at 8%. The dot is the base case, the dashed tick the Monte Carlo mean, the line the 90% interval of 10,000 draws. n = 7 scenarios. The base case and the Monte Carlo mean differ: for the pure humanoid fleet they are 2,878 and 3,490. In the base case the lean hybrid costs 30% less than people alone. It costs less than a fifth of Humanoid 2028, the cheapest modelled humanoid scenario. The eight-person reference is legacy, a labelled reference for the cost of overstaffing.
> source: five-year TCO model, project repository: base case from the scenario export, Monte Carlo from the sensitivity report. Last updated 16 Sep 2026.

| Scenario | Five-year present cost | Capex | Cost per order |
|:--|--:|--:|--:|
| Lean hybrid: 1 person, 3 AMRs (S-lean-hybrid-amr) | €452,706 | €195,000 | €0.374 |
| Lean crew: 3 people (S-lean-human) | €647,401 | €0 | €0.543 |
| Eight-person reference, legacy (S-baseline-human) | €1,726,403 | €0 | €1.444 |
| Humanoid 2028: 3 people, 9 humanoids at 1.3 times throughput (S-future-2028) | €2,532,753 | €1,365,349 | €2.120 |
| Pure humanoid (S-pure-humanoid) | €2,877,837 | €2,051,609 | €2.407 |
| Humanoid + AMR + crew: 3 people, 11 humanoids, 4 AMRs (S-hybrid-amr) | €3,841,113 | €2,311,609 | €3.244 |
| 50/50 hybrid (S-hybrid-5050) | €5,251,641 | €2,051,609 | €4.411 |

> [!spec] Lean hybrid, 10,000 Monte Carlo draws
> - Mean — €461,414
> - Standard deviation — €43,755
> - 90% interval — €394,658–€537,549
> - Draws won — 99.8% of the evaluated draws

The breakeven search covered humanoid capex of €10,000–€500,000 per unit. It found no price at which a pure-humanoid fleet matches the lean hybrid’s cost per order at 120 orders an hour. So capex is not the binding constraint.

## Limitations

The ranking holds only under the stated assumptions.

- **Warehouse performance.** Household demonstrations remain a proxy for warehouse tasks.
- **A site-specific procurement case.** There are no warehouse-native cycle times and no signed humanoid quotes.
- **Local prices.** Public list prices and estimated KV wages can move the cost either way.
- **Independent reproduction.** An agent produced the committed reproduction log. No third party cloned the repository cold.

> [!warning] One assumption cuts against the robots
> The model assumes labour is available at KV rates. If vacancies remain unfilled, that assumption can understate the value of automation.

## Decision

Under the stated assumptions, take the lean hybrid forward for site validation and defer humanoid procurement. Confirm warehouse-native throughput and signed supplier quotes before any procurement decision.

> [!faq]- When is the call worth revisiting?
> Under demand growth, labour scarcity or multi-shift operation. At the modelled demand, no humanoid price in the searched range breaks even.

## Build log

```buildlog
```

[^1]: The build runs under a governance protocol that continuous integration (CI) enforces. Every change closes a tracked finding with a named verification script. CI re-runs the script of every closed finding on each pull request.
