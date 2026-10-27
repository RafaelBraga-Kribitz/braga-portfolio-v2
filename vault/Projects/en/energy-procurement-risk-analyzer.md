---
code: "01-04"
kind: case
date: "2026-10-28"
summary: "€27.04 million. What the wrong electricity strategy cost one constructed 50 GWh load over 2021–2025."
lead: "Full spot, indexed, fixed or partly hedged: four ways to buy electricity for one Styrian manufacturer. Over 2021–2025 the fixed annual price was the cheapest in total, and the risk figures for the next twelve months are in."
domain: Energy
tags: [ status/functional, energy-procurement, risk-analysis, data-warehouse ]
lang: en
slug: energy-procurement-risk-analyzer
metrics:
  - { value: "€27.04 million", label: "Cost of the wrong strategy, 2021–2025", accent: true }
  - { value: "€30.17 million", label: "Lowest five-year cost: fixed annual" }
  - { value: "€6.44 million", label: "Lowest P95, next 12 months: hybrid 70% fixed" }
repository: https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer
translationStatus: approved
publish: true
---

# Energy procurement risk analyser

> [!summary] Summary
> Buying electricity with the wrong strategy cost the constructed 50 GWh consumer €27.04 million over 2021–2025. The fixed annual price was the cheapest of the strategies in total, at €30.17 million. For the next twelve months it has the lowest expected cost, €4.77 million, and the hybrid with 70% fixed has the lowest P95, €6.44 million. The load is constructed and ÖSPI stands in for contract prices, so these are results under stated assumptions, not a supplier quote.

## Question

After the 2021–2023 European energy crisis, electricity procurement became a board-level risk for Austrian industry. What did buying electricity the wrong way cost a Styrian manufacturer using 50 GWh a year in 2021–2025, and what is the P95 cost exposure for the next twelve months under each procurement strategy? The project compares four strategies on the Austrian day-ahead market (full spot, an indexed contract, a fixed annual price and a partial hedge) for one constructed 50 GWh industrial load. The unit of comparison is the energy-price cost of that one load, in euros, under each strategy: realised on the prices of 2021–2025, and as the P95 and CVaR95 of the next twelve months on resampled prices.

## Data

The market data is real, and no market price is synthetic. Day-ahead prices for Austria and Germany–Luxembourg and Austrian load and generation come from the ENTSO-E Transparency Platform; the monthly price index ÖSPI comes from the Austrian Energy Agency, transcribed by hand with double entry; daily mean temperature for Graz comes from GeoSphere Austria; and a calendar holds the Austrian and Styrian public holidays. The window runs from January 2019 to September 2026.

Two inputs are assumptions and are tagged as such. The consumer’s load shape is constructed, not measured, and ÖSPI stands in for contract and forward prices. Grid fees, taxes and levies are out of scope, so the analysis isolates the energy-price lever.

Every number below carries a tag. VERIFIED is computed from real data without modelling. CALIBRATED rests on documented assumptions anchored to real data, which covers every strategy cost here. SIMULATED comes from a seeded resampling procedure.

> [!spec] Inputs
> - Day-ahead prices — Austria and Germany–Luxembourg · ENTSO-E Transparency Platform
> - Load and generation — Austria · ENTSO-E Transparency Platform
> - Price index — ÖSPI, monthly · Austrian Energy Agency · transcribed by hand with double entry
> - Temperature — daily mean, Graz · GeoSphere Austria
> - Calendar — Austrian and Styrian public holidays
> - Window — January 2019 to September 2026
> - Load shape — constructed, 50 GWh a year · assumption
> - Contract and forward prices — ÖSPI as the stand-in · assumption
> - Scope — the energy price only · grid fees, taxes and levies excluded

## Method

The pipeline runs from the sources to a tested warehouse and on to the strategy simulator. In order:

1. **Ingest.** All four sources, fetched with retries and caching, into raw Parquet.
2. **Validation gates.** Part of the ingest, so that a plausible-looking file cannot pass silently. They check hour coverage, including the 23- and 25-hour daylight-saving days, price and load plausibility, the Austria–Germany join and the presence of negative prices.
3. **Warehouse.** DuckDB, modelled in dbt from staging to marts, with tests on the mart schema contract, daylight-saving adjacency and gaps in the month spine.
4. **Load profile and market analytics.** A deterministic hourly profile for the constructed consumer; seasonality, negative hours, the Austria–Germany spread and volatility regimes.
5. **Strategy simulator.** Four cost engines. The retrospective run prices each strategy on the realised prices of 2021–2025. The forward run resamples whole historical months in a seeded block bootstrap of 2,000 paths for October 2026 to September 2027, and reads P95 and CVaR95 off the result. The partial hedge runs at 30%, 50% and 70% fixed.
6. **Numeric source of truth.** Every published number is generated into one file with its epistemic tag, and continuous integration fails if a document quotes a number that is not in it.

No price forecast is made: strategies are scored on realised prices and on resampling them.

> [!definition] P95 and CVaR95
> P95 is the twelve-month cost that 95% of the resampled outcomes stay at or below. CVaR95 is the mean cost of the outcomes beyond P95: it reads how heavy the tail is, not only where it starts.

## Result

**The market.** The Austrian day-ahead price averaged 261.4 EUR/MWh in 2022, against 40.1 EUR/MWh in 2019 (VERIFIED). 2025 had 378 hours with negative prices (VERIFIED).

**The cost of the wrong strategy.** For each year, take the gap between the dearest and the cheapest strategy, and sum the five gaps: €27.04 million over 2021–2025 (CALIBRATED). Over the five years the fixed annual price was the cheapest strategy, at €30.17 million in total. Full spot was the dearest, at €34.61 million.

| Strategy | 2021 | 2022 | 2023 | 2024 | 2025 | 2021–2025 |
|:--|--:|--:|--:|--:|--:|--:|
| Full spot | 5.70 | 13.84 | 5.51 | 4.34 | 5.22 | 34.61 |
| ÖSPI-indexed | 2.43 | 8.30 | 12.50 | 4.90 | 4.05 | 32.18 |
| Fixed annual | 2.17 | 3.08 | 11.64 | 8.95 | 4.34 | 30.17 |
| Hybrid 30% fixed | 4.64 | 10.61 | 7.35 | 5.72 | 4.95 | 33.28 |
| Hybrid 50% fixed | 3.93 | 8.46 | 8.58 | 6.64 | 4.78 | 32.39 |
| Hybrid 70% fixed | 3.23 | 6.31 | 9.80 | 7.56 | 4.60 | 31.50 |

Annual energy cost in € million, CALIBRATED. Contract prices proxied via ÖSPI; the load is constructed.

The cheapest strategy changes from year to year: the fixed annual price in 2021 and 2022, full spot in 2023 and 2024, the ÖSPI-indexed contract in 2025. The five-year ranking is therefore a statement about this window, not about any single year.

![[epra-wrong-strategy-cost.png|Bar chart of the yearly gap between the dearest and the cheapest strategy, 2021 to 2025, peaking in 2022 at €10.76 million; the total over five years is €27.04 million. Calibrated; the load profile is constructed.]]

![[epra-annual-cost-by-strategy.png|Grouped bar chart of annual energy cost in € million for six strategy variants, 2021 to 2025. The cheapest variant changes from year to year. Calibrated; contract prices proxied via ÖSPI.]]

**The next twelve months.** For October 2026 to September 2027, on 2,000 resampled paths (SIMULATED; not a price forecast):

| Strategy | Mean | P95 | CVaR95 |
|:--|--:|--:|--:|
| Full spot | 5.36 | 7.56 | 8.24 |
| ÖSPI-indexed | 5.15 | 7.16 | 7.88 |
| Fixed annual | 4.77 | 6.61 | 6.96 |
| Hybrid 30% fixed | 5.18 | 6.85 | 7.37 |
| Hybrid 50% fixed | 5.06 | 6.61 | 6.97 |
| Hybrid 70% fixed | 4.95 | 6.44 | 6.80 |

Twelve-month energy cost in € million, SIMULATED.

Fixed annual has the lowest expected cost, €4.77 million, with a P95 of €6.61 million. The hybrid with 70% fixed has the lowest P95, €6.44 million. Against fixed annual it lowers the P95 by €0.17 million and costs €0.18 million more in expectation; that is the price of the risk reduction. Full spot carries the heaviest tail.

![[epra-forward-risk.png|Box-and-whisker chart of simulated twelve-month cost for six strategies from October 2026 to September 2027, with P95 marked. Full spot has the highest P95 at €7.56 million and hybrid 70% fixed the lowest at €6.44 million. Simulated, 2,000 paths.]]

> [!quote] Result · five-year and forward
> Over 2021–2025 the fixed annual price was the cheapest in total, at €30.17 million. For the next twelve months it has the lowest expected cost, and the hybrid with 70% fixed the lowest P95.

## Limitations

What this does not establish:

- **A measured load.** The load shape is constructed, not measured, and it is one industrial load of 50 GWh a year. Metered data would change the cost levels. A flat baseload variant, run as a sensitivity, leaves fixed annual the cheapest over five years.
- **Contract and forward prices.** ÖSPI stands in for them; that is an assumption, tagged as one. It misses supplier margins, credit terms and flexibility clauses, and the direction of that bias is unknown. A lower and a higher fixed-price premium than the default also leave fixed annual the cheapest over five years.
- **A ranking that holds beyond 2021–2025.** The five-year result contains the 2022 crisis. The forward run resamples history and cannot simulate a regime without precedent, so its P95 and CVaR95 would understate one. In the variant without the crisis years, the lowest expected cost belongs to full spot, €3.83 million against €4.26 million for fixed annual (SIMULATED). The order depends on whether a 2022-type tail stays in the pool.
- **A precise volatility estimate.** The fitted volatility model sits on its boundary, with persistence of 1.00 (VERIFIED). It reads as a lower bound on how long turbulence lasts, not as an exact value.
- **The full cost of electricity.** Grid fees, taxes and levies are out of scope; the analysis isolates the energy-price lever.
- **A price forecast.** None is made: strategies are scored on realised prices and on resampling them.

## Decision

Over 2021–2025 the fixed annual price had the lowest total cost, €30.17 million. For the next twelve months it has the lowest expected cost, €4.77 million, and the hybrid with 70% fixed has the lowest P95, €6.44 million, for €0.18 million more in expectation.

<!-- PENDING DL-5: owner wording of the recommendation -->

The result depends on the constructed load and the ÖSPI stand-in. Metered load data and real supplier offers are what would change it.

The repository holds the code, the charts, the executive summary, the limitations and the numeric source of truth.
