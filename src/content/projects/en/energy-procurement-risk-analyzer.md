---
title: Energy procurement risk analyser
code: "01-05"
kind: brief
date: "2026-07-24"
summary: From electricity-price records to a cost-risk decision. In build.
lead: "Full spot, indexed, fixed or partly hedged: four ways to buy electricity for one Styrian manufacturer. The data warehouse is built; the answer in euros is not yet."
domain: Energy
status: in-build
tags: [Energy Procurement, Risk Analysis, Data Warehouse]
lang: en
slug: energy-procurement-risk-analyzer
metrics:
  - { value: "4", label: Sources ingested }
  - { value: "4", label: "Procurement strategies, not yet scored" }
  - { value: "50 GWh", label: "Annual load, constructed" }
repository: https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer
draft: false
translationStatus: approved
---

> [!summary] Summary
> The ingest from four sources and a DuckDB warehouse modelled in dbt are built and tested; strategy results do not exist yet. No strategy is recommended, and by the project’s own rule no result is quoted until it appears in the auto-generated numeric source-of-truth file that arrives with the strategy simulator.

## Question

After the 2021–2023 European energy crisis, electricity procurement became a board-level risk for Austrian industry. What did buying electricity the wrong way cost a Styrian manufacturer using 50 GWh a year in 2021–2025, and what is the P95 cost exposure for the next twelve months under each procurement strategy? The project compares four strategies on the Austrian day-ahead market (full spot, an indexed contract, a fixed annual price and a partial hedge) for one constructed 50 GWh industrial load. The unit of comparison is the energy-price cost of that one load, in euros, under each strategy: realised on the prices of 2021–2025, and as the P95 and CVaR95 of the next twelve months on resampled prices.

## Data

The market data is real, and no market price is synthetic. Day-ahead prices for Austria and Germany–Luxembourg and Austrian load and generation come from the ENTSO-E Transparency Platform; the monthly price index ÖSPI comes from the Austrian Energy Agency, transcribed by hand with double entry; daily mean temperature for Graz comes from GeoSphere Austria; and a calendar holds the Austrian and Styrian public holidays. The window runs from January 2019 to the latest complete month.

Two inputs are assumptions and are tagged as such. The consumer’s load shape is constructed, not measured, and ÖSPI stands in for contract and forward prices. Grid fees, taxes and levies are out of scope, so the analysis isolates the energy-price lever.

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

The pipeline is built from the sources to a tested warehouse. In order:

1. **Ingest.** All four sources, fetched with retries and caching, into raw Parquet.
2. **Validation gates.** Part of the ingest, so that a plausible-looking file cannot pass silently. They check hour coverage, including the 23- and 25-hour daylight-saving days, price and load plausibility, the Austria–Germany join and the presence of negative prices.
3. **Warehouse.** DuckDB, modelled in dbt from staging to marts. The dbt tests check the mart schema contract, daylight-saving adjacency, a price reconciliation for August 2022 and gaps in the month spine.
4. **Continuous integration.** CI runs lint, the tests and a network-free dbt build against a fixture warehouse.

Still to build: the load profile, market analytics, four strategy cost engines with a seeded block bootstrap for forward risk (P95 and CVaR95), and the reporting layer. No price forecast is planned: strategies are scored on realised prices and on resampling them.

> [!definition] P95 and CVaR95
> P95 is the twelve-month cost that 95% of the resampled outcomes stay at or below. CVaR95 is the mean cost of the outcomes beyond P95: it reads how heavy the tail is, not only where it starts.

## Result

None yet. The foundation stage is in place; the parts that would produce a result are not.

| Component | State |
|:--|:--|
| ENTSO-E ingest | Built |
| Weather, index and calendar sources | Built |
| Validation gates and dbt tests | Built |
| DuckDB warehouse, dbt from staging to marts | Built |
| Continuous integration | Built |
| Load profile | Not built |
| Market analytics | Not built |
| Strategy simulator: four cost engines, block bootstrap | Not built |
| Reporting | Not built |

Until the last four are built, their commands fail loudly and name the milestone they belong to.

By the project’s own rule, every published number must first appear, with its epistemic tag, in an auto-generated numeric source-of-truth file, and that file arrives with the strategy simulator. Until then this page quotes no result: no strategy cost for 2021–2025, no P95 and no CVaR95.

> [!quote] Result · foundation stage
> Ingest and warehouse are built; strategy results do not exist yet.

## Limitations

What this does not establish:

- **Any strategy result.** No realised cost for 2021–2025, no P95 and no CVaR95 exists yet; this page quotes none.
- **A measured load.** The load shape is constructed, not measured, and it is one industrial load of 50 GWh a year.
- **Contract and forward prices.** ÖSPI stands in for them; that is an assumption, tagged as one.
- **The full cost of electricity.** Grid fees, taxes and levies are out of scope; the analysis isolates the energy-price lever.
- **A price forecast.** None is planned: strategies are scored on realised prices and on resampling them.

## Decision

No strategy is recommended yet. The project leads from electricity-price records to a cost-risk decision between the four strategies, and that decision waits for the strategy simulator and the source-of-truth file that arrives with it.

In build: the foundation stage is implemented, and the load profile, analytics, simulator and reporting are not. The repository holds the charter, the specifications and the pipeline so far.

> [!bookmark] Next
> [01-01 Austria data-job market intelligence](/en/work/austria-data-job-market-intelligence/) — A dated view of titles, skills and regional demand.

> [!cta]
> [Open the repository](https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer)
