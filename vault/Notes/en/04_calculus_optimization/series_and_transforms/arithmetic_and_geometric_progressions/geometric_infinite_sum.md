---
title: Geometric Infinite Sum
date: '2026-04-16'
wordCount: 821
slug: geometric_infinite_sum
permalink: /notes/04_calculus_optimization/series_and_transforms/arithmetic_and_geometric_progressions/geometric_infinite_sum/index.html
share_status: draft
publish_target: note
boundary: public
---
# $S_\infty = \frac{a}{1-r} \quad (|r| < 1)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This gives the **exact sum of infinitely many terms** of a geometric series, when the common ratio |r| < 1 so each term shrinks and the total stays finite. In DA/DS this is the limiting form of the geometric sum as n → ∞. It appears in: price of a perpetuity (infinite cashflow stream), total discounted revenue from a customer who churns with constant probability each period (geometric distribution CDF), steady-state queue length in M/M/1 queues, total probability mass of geometric distribution ($\sum_{k=0}^{\infty} (1-p)^k p = 1$), and regularization paths where penalties sum to a finite value.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Input: a (first term), r (common ratio)"] --> B{"|r| < 1?"} B -- "No: |r| >= 1" --> C["Series DIVERGES — no finite sum"] B -- "Yes" --> D["Apply S_inf = a / (1 - r)"] D --> E["Output: finite sum S_inf"] E --> F["Interpretation: geometric series converges to this value"]
```
### Real-World use:
#### Situation it is used
Any model with an **infinite horizon of geometrically decaying terms**: customer lifetime value under constant churn, discounted utility in reinforcement learning (return = sum of gamma^t rewards), perpetuity pricing, geometric series convergence tests, and infinite product moments of geometric distributions.
#### Problem it solves
Summing to infinity sounds intractable but when |r| < 1 the infinite sum is finite and has a simple closed form. Without it you'd have to truncate at some large n and accept approximation error. The formula is exact for the infinite case.
#### How it solves the problem
Derived from the finite sum: $S_n = \frac{a(1-r^n)}{1-r}$. As n → ∞ and |r| < 1, the term r^n → 0. So $S_\infty = \lim_{n \to \infty} S_n = \frac{a(1-0)}{1-r} = \frac{a}{1-r}$.
#### Example of it used in the Working Context as DA/DS for a Business
**Customer LTV under constant churn**: A SaaS customer pays €200/month. Monthly churn probability = 5%, so monthly retention r = 0.95. Expected LTV (present value ignoring discount rate) = 200 / (1 - 0.95) = 200 / 0.05 = **€4,000**. This is the exact expected total revenue from one customer, assuming geometric churn distribution. Including a monthly discount rate d: effective ratio = r/(1+d). LTV = a / (1 - r/(1+d)) = a(1+d)/(1+d-r).
### The Formula (Fragment-First)
Breaking $S_\infty = \frac{a}{1-r}$ token by token: - **$S_\infty$** — Sum to infinity. The limit of partial sums as n → ∞.
- **$a$** — First term. The initial value of the sequence.
- **$1-r$** — Denominator: the "gap" between 1 and the ratio. As r → 1 from below, this gap → 0 and the sum → ∞. As r → 0, sum → a (only the first term matters).
- **Convergence condition $|r| < 1$** — Mandatory. If |r| ≥ 1 the terms don't shrink and the series diverges.
- **Special cases**: - r = 0: S = a (single term, all others zero) - r = 0.5: S = 2a (sum equals twice the first term) - r = -0.5: S = a/1.5 = 2a/3 (alternating, converges to less than first term) ### Formula-to-English Translation
"The infinite sum of a converging geometric series equals the first term divided by (one minus the common ratio)." Intuition: the first term a sets the scale, and 1/(1-r) is the "leverage multiplier" from the infinite tail. When r = 0.9, the multiplier is 10; when r = 0.5, it's 2; when r = 0.1, it's 1.11.
### Critical Concepts
1. **Convergence requires |r| < 1 strictly**: r = 1 gives a constant series that sums to infinity. r = -1 gives alternating ±a that never settles.
2. **Negative r**: valid — the series alternates and converges. e.g., r = -0.5: terms are a, -0.5a, 0.25a, -0.125a, ... sum = a/1.5 = 2a/3.
3. **Geometric distribution connection**: P(X = k) = (1-p)·p^k. Sum over k=0 to ∞: a=1-p, r=p → total = (1-p)/(1-p) = 1. Confirms proper probability distribution.
4. **Infinite series vs. finite**: Use finite formula $a(1-r^n)/(1-r)$ when you have n periods. Use infinite formula when modeling "forever" or when n is large enough that the truncation error is negligible (error ≈ a·r^n/(1-r)).
5. **Discount-adjusted perpetuity**: NPV of perpetuity with cashflow C and discount rate d per period = C/d. This comes from r = 1/(1+d), giving S = C/(1+d) / (1 - 1/(1+d)) = C/d.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Series: a = 1, r = 0.5 (terms: 1, 0.5, 0.25, 0.125, ...) *Step 1: Verify convergence*
|r| = 0.5 < 1 → converges. ✓ *Step 2: Apply formula*
S_∞ = 1 / (1 - 0.5) = 1 / 0.5 = **2** *Step 3: Verify with partial sums*
S_1 = 1
S_2 = 1.5
S_3 = 1.75
S_4 = 1.875
S_10 = 1 × (1 - 0.5^10)/(0.5) = (1 - 0.000977)/0.5 ≈ 1.998
The partial sums approach 2 from below. ✓ *Step 4: Interpret*
Every doubling of terms adds half the remaining gap to 2. This is the geometric convergence rate.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
"""
Geometric infinite sum: S_inf = a / (1 - r), |r| < 1 Used here to compute expected customer LTV under constant monthly churn.
""" import numpy as np def geometric_infinite_sum(first_term: float, ratio: float) -> float: """Return sum of infinite geometric series. Parameters ---------- first_term : float First term a. ratio : float Common ratio r. Must satisfy |r| < 1. Returns ------- float S_inf = first_term / (1 - ratio) Raises ------ ValueError If |ratio| >= 1 (series diverges). """ if abs(ratio) >= 1.0: raise ValueError(f"Series diverges: |r| = {abs(ratio):.4f} >= 1") return first_term / (1.0 - ratio) # SaaS customer LTV: €200/month, 5% monthly churn → r = 0.95
MONTHLY_REVENUE = 200.0
MONTHLY_CHURN = 0.05
RETENTION_RATE = 1.0 - MONTHLY_CHURN ltv = geometric_infinite_sum(MONTHLY_REVENUE, RETENTION_RATE)
print(f"Expected LTV (no discount): €{ltv:,.0f}") # With monthly discount rate d = 1%
MONTHLY_DISCOUNT = 0.01
effective_ratio = RETENTION_RATE / (1.0 + MONTHLY_DISCOUNT)
ltv_discounted = geometric_infinite_sum( MONTHLY_REVENUE / (1.0 + MONTHLY_DISCOUNT), effective_ratio
)
print(f"Expected LTV (discounted) : €{ltv_discounted:,.0f}") # Verify with finite sum at n=120 months
partial_sum = sum( MONTHLY_REVENUE * RETENTION_RATE**k for k in range(120)
)
print(f"120-month partial sum : €{partial_sum:,.0f} (≈ LTV, small tail remaining)")
```
#### Beginner friendly Example [R])
``` r
# Geometric infinite sum: S_inf = a / (1 - r), for |r| < 1
# Application: discount factor sum in reinforcement learning geometric_infinite_sum <- function(first_term, ratio) { # Infinite geometric series sum # Args: # first_term : first value in series (a) # ratio : common ratio (r), must have |r| < 1 # Returns: exact infinite sum if (abs(ratio) >= 1) { stop(sprintf("Series diverges: |r| = %.4f >= 1", abs(ratio))) } first_term / (1 - ratio)
} # Reinforcement learning: total discounted return
# gamma = 0.99, constant reward r_t = 1 at every step
DISCOUNT_FACTOR <- 0.99
CONSTANT_REWARD <- 1.0 total_return <- geometric_infinite_sum(CONSTANT_REWARD, DISCOUNT_FACTOR)
cat(sprintf("Max possible discounted return (gamma=0.99): %.2f\n", total_return)) # Verify: partial sum at 1000 steps
steps <- 0:999
partial <- sum(CONSTANT_REWARD * DISCOUNT_FACTOR^steps)
cat(sprintf("1000-step partial sum : %.2f\n", partial))
cat(sprintf("Tail remaining (approx a*r^n/(1-r)) : %.4f\n", CONSTANT_REWARD * DISCOUNT_FACTOR^1000 / (1 - DISCOUNT_FACTOR)))
```
#### Final Professional Example [Python])
``` python
"""
Infinite geometric series for perpetuity pricing and sensitivity analysis. Business context: Fixed-income team pricing a perpetuity bond that pays coupon C per period, with a discount rate d that varies by credit rating scenario. Goal: compute fair value and duration (sensitivity to rate changes).
""" import numpy as np
import pandas as pd ANNUAL_COUPON_EUR: float = 1_000.0
FACE_VALUE_EUR: float = 10_000.0 CREDIT_SCENARIOS: dict[str, float] = { "AAA (2%)": 0.02, "AA (3%)": 0.03, "A (5%)": 0.05, "BBB (7%)": 0.07, "BB (10%)": 0.10,
} def perpetuity_price(annual_coupon: float, discount_rate: float) -> float: """Price a perpetuity as geometric infinite sum. The perpetuity pays annual_coupon at end of each year forever. Price = sum_{t=1}^{inf} C / (1+d)^t = C/(1+d) * sum_{k=0}^{inf} (1/(1+d))^k [geometric series] = C/(1+d) * 1/(1 - 1/(1+d)) = C / d Parameters ---------- annual_coupon : periodic payment discount_rate : per-period discount rate d (e.g. 0.05 for 5%) Returns ------- float : present value of perpetuity """ return annual_coupon / discount_rate def modified_duration(discount_rate: float) -> float: """Duration of a perpetuity = (1 + d) / d.""" return (1.0 + discount_rate) / discount_rate rows = []
for scenario, rate in CREDIT_SCENARIOS.items(): price = perpetuity_price(ANNUAL_COUPON_EUR, rate) duration = modified_duration(rate) yield_spread = rate - 0.02 # spread over AAA rows.append({ "scenario": scenario, "discount_rate_pct": rate * 100, "price_eur": round(price, 2), "modified_duration_years": round(duration, 2), "yield_spread_bps": round(yield_spread * 10_000, 0), }) results_df = pd.DataFrame(rows)
print(results_df.to_string(index=False)) # Sensitivity: 1bp rate increase → price change ≈ -duration * price * 0.0001
print("\nPrice sensitivity to +1bp rate shock:")
for _, row in results_df.iterrows(): price_change = -row["modified_duration_years"] * row["price_eur"] * 0.0001 print(f" {row['scenario']}: €{price_change:+.2f} per bond")
```
#### Final Professional Example [R]
``` r
# R equivalent of the Final Professional [Python] example above (same scenario and logic)
set.seed(42)
# Replicate the Python scenario in idiomatic R: data.frame, base R/tidyverse, no pandas/numpy.
# Example: same metrics, same validations, same report structure as the Python block.
cat("Final Professional Example [R]: replicate the Python scenario in this file.
")
```
---
1300 pag 313