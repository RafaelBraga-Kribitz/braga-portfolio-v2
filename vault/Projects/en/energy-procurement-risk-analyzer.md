---
code: "01-05"
kind: brief
date: "2026-07-24"
summary: From electricity-price records to a cost-risk decision. In build.
lead: "Full spot, indexed, fixed or partly hedged: four ways to buy electricity for one Styrian manufacturer. The data warehouse is built. The answer in euros is not yet."
domain: Energy
tags: [ status/in-build, energy-procurement, risk-analysis, data-warehouse ]
lang: en
slug: energy-procurement-risk-analyzer
metrics:
  - { value: "5 of 9", label: "Components built", accent: true }
  - { value: "4", label: "Procurement strategies, not yet scored" }
  - { value: "50 GWh", label: "Annual load, constructed" }
stack: [ "SQL", "Python", "Azure", "Power BI", "DAX", "DuckDB", "dbt", "statsmodels", "Time series", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer
translationStatus: approved
publish: true
---

# Energy procurement risk analyser

## Question: How much does the way a Styrian manufacturer buys electricity change its cost and its risk?

> [!summary] Summary
> The project built and tested the ingest from four sources and a DuckDB warehouse modelled in dbt. Strategy results do not exist yet, and the project recommends no strategy.

> [!note] Foundation snapshot · 24 July 2026
> This page records the foundation stage, not the current repository status. The [repository inspected on 1 Nov 2026](https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer/blob/e3e115c74f58745ce8ba4592d7c6b6ec89ef5d5e/README.md) reports its first real-data run and completed strategy engines. Those newer numerical results have not been independently reproduced for this page.

## Background

After the 2021–2023 European energy crisis, electricity procurement became a board-level risk for Austrian industry. The project takes one Styrian manufacturer that uses 50 GWh a year. It asks two questions. First, what did buying electricity the wrong way cost in 2021–2025? Second, what is the P95 (95th percentile) cost exposure for the next twelve months under each strategy? It compares four strategies on the Austrian day-ahead market: full spot, an indexed contract, a fixed annual price and a partial hedge.

| Measure | Unit | Prices |
|:--|:--|:--|
| Realised cost | Energy-price cost of the load, in euros | 2021–2025 |
| P95 and CVaR95 (conditional value at risk) | Energy-price cost of the next twelve months, in euros | Resampled |

## Data

The market data is real, and no market price is synthetic.

> [!spec] Inputs
> - Day-ahead prices — Austria and Germany–Luxembourg · ENTSO-E Transparency Platform
> - Load and generation — Austria · ENTSO-E Transparency Platform
> - Price index — ÖSPI, monthly · Austrian Energy Agency · transcribed by hand with double entry
> - Temperature — daily mean, Graz · GeoSphere Austria
> - Calendar — Austrian and Styrian public holidays
> - Window — January 2019 to the latest complete month
> - Load shape — constructed, 50 GWh a year · assumption
> - Contract and forward prices — ÖSPI as the stand-in · assumption
> - Scope — the energy price only · grid fees, taxes and levies excluded

## Method

| Component | Work and checks | State |
|:--|:--|:--|
| ENTSO-E ingest | All four sources, fetched with retries and caching, into raw Parquet | Built |
| Weather, index and calendar sources | Temperature, ÖSPI and public holidays | Built |
| Validation gates and dbt tests | Gates check hour coverage (including 23- and 25-hour daylight-saving days), price and load plausibility, the Austria–Germany join and the presence of negative prices. A plausible-looking file therefore cannot pass silently. The dbt tests check the mart schema contract, daylight-saving adjacency, a price reconciliation for August 2022 and gaps in the month spine | Built |
| DuckDB warehouse | dbt models from staging to marts | Built |
| Continuous integration | Lint, tests and a network-free dbt build against a fixture warehouse | Built |
| Load profile | Constructed load shape of 50 GWh a year | Not built |
| Market analytics | Analysis of the market data | Not built |
| Strategy simulator | Four cost engines and a seeded block bootstrap for forward risk (P95 and CVaR95) | Not built |
| Reporting | Report layer | Not built |

> [!definition] P95 and CVaR95
> P95 is the twelve-month cost that 95% of the resampled outcomes stay at or below. CVaR95 is the mean cost of the outcomes beyond P95: it reads how heavy the tail is, not only where it starts.

## Result

None yet. Until the project builds the last four components, their commands fail loudly and name their milestone. Every published number must first appear, with its epistemic tag, in an auto-generated numeric source-of-truth file that arrives with the strategy simulator. Until then this page quotes no result:

- No strategy cost for 2021–2025.
- No P95.
- No CVaR95.

## Limitations

What this does not establish:

- **Any strategy result.** No realised cost for 2021–2025, no P95 and no CVaR95 exists yet.
- **A measured load.** The load shape is constructed, not measured. It is one industrial load of 50 GWh a year.
- **Contract and forward prices.** ÖSPI stands in for them. This is an assumption, tagged as one.
- **The full cost of electricity.** Grid fees, taxes and levies are out of scope. The analysis isolates the energy-price lever.
- **A price forecast.** The project plans none. It scores strategies on realised prices and on resampling them.

## Decision

The project recommends no strategy yet. The cost-risk decision between the four strategies waits for the strategy simulator and its source-of-truth file.

## Build log

```buildlog
```
