---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Geometric Sum to n

$$
S_n = \frac{a(1-r^n)}{1-r}
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
This formula gives the **total sum of the first n terms** of a geometric sequence. Whenever you have a quantity that multiplies by a fixed ratio each step (compound interest, geometric retention decay, exponentially growing ad spend) and you want the **accumulated total** over n steps, this is the formula. In DA/DS it appears in: net present value (NPV) of cashflows, cumulative discounted reward in reinforcement learning, total retention-weighted revenue across cohorts, and total error in a geometric series approximation.

## Flowchart

```mermaid
flowchart TD
    A["Input: a (first term), r (ratio), n (number of terms)"] --> B{"r = 1?"} B -- "Yes" --> C["S_n = n × a (constant series)"] B -- "No" --> D["Compute r^n"]
    D --> E["Numerator = a × (1 - r^n)"]
    E --> F["Denominator = (1 - r)"]
    F --> G["S_n = Numerator / Denominator"]
    G --> H["Output: total sum S_n"]
```

## Real-world use

### Where it is used

Any setting where a quantity follows compound (multiplicative) growth or decay and you want the **total accumulated value** over a finite number of periods. Examples: summing discounted future cashflows (DCF/NPV), total ad spend with weekly budget multiplied by a growth factor, total customer LTV across n retention cohorts each scaled by a churn-survival probability, and total gradient descent update steps when learning rate decays geometrically.

### Problem it solves

Computing the sum term-by-term becomes O(n) and error-prone. The closed-form formula collapses the entire sum to O(1), enables analytical optimization, and avoids floating-point accumulation errors for large n.

### How it solves the problem

Derived from the telescoping trick: let S = a + ar + ar² + ... + ar^(n-1). Multiply both sides by r: rS = ar + ar² + ... + ar^n. Subtract: S - rS = a - ar^n → S(1-r) = a(1-r^n) → S = a(1-r^n)/(1-r).

### Example in a business

**E-commerce LTV model**: A customer cohort of 10,000 users has a monthly retention rate of r = 0.80 (churn = 20%). Average monthly revenue per retained user is €50 (first term a = 50 × 10000 = 500,000). Over n = 12 months, total revenue = 500000 × (1 - 0.80¹²)/(1 - 0.80) = 500000 × (1 - 0.0687)/0.20 ≈ €2,328,300. Without the formula you'd sum 12 terms manually and couldn't optimize over n or r algebraically.

## The formula, piece by piece

Breaking $S_n = \frac{a(1-r^n)}{1-r}$ token by token:

- **$S_n$** — Sum of the first n terms. Not a running total up to time t, but the exact closed-form total.
- **$a$** — First term ($u_1$). The starting value before any multiplication.
- **$r$** — Common ratio. The multiplier applied at each step ($r = u_{n+1}/u_n$). Can be > 1 (growth) or < 1 (decay).
- **$r^n$** — The ratio raised to the power n. Measures how much the last term has scaled from the first.
- **$(1 - r^n)$** — Numerator factor: "how much of the original scale hasn't been consumed." For |r| < 1 this approaches 1 as n → ∞.
- **$(1 - r)$** — Denominator: the complement of the ratio. Normalizes the numerator.
- **Alternative form**: $S_n = \frac{u_1 - r \cdot u_n}{1-r}$ where $u_n = ar^{n-1}$.

Useful when you know first and last terms.

## The formula in words

"The sum of the first n terms of a geometric sequence equals the first term times (one minus the ratio to the nth power), all divided by (one minus the ratio)." Equivalently: "Scale the first term up by a factor that captures how much the series has grown or decayed over n steps, then normalize by the gap between 1 and the ratio."

## Critical Concepts

1. **r ≠ 1 required**: At r = 1, denominator is zero (0/0 form). In that case every term equals a, so S_n = n·a.
2. **Connection to infinite sum**: As n → ∞ with |r| < 1, r^n → 0 and S_n → a/(1-r). The finite formula converges to the infinite sum formula.
3. **r > 1 (growth)**: r^n grows large, 1 - r^n is large and negative, 1 - r is also negative → result is positive and large.
4. **Logarithms for large n**: When n is large and r is close to 1, compute r^n = exp(n·ln(r)) for numerical stability.
5. **Alternative derivation**: S_n = a·(r^n - 1)/(r - 1) is algebraically identical — just multiply numerator and denominator by -1.

Both forms appear in textbooks.

## Step-by-step calculation (tiny example)

Sequence: a = 2, r = 3, n = 4 (terms: 2, 6, 18, 54)

*Step 1: List terms as a check*
u_1 = 2, u_2 = 2·3 = 6, u_3 = 6·3 = 18, u_4 = 18·3 = 54
Direct sum: 2 + 6 + 18 + 54 = **80**

*Step 2: Apply formula*
S_4 = 2·(1 - 3⁴)/(1 - 3) = 2·(1 - 81)/(−2) = 2·(−80)/(−2) = 2·40 = **80**

*Step 3: Sanity check with r > 1 intuition*
r = 3 > 1 → series is growing fast. The last term 54 alone is more than half the sum (54/80 = 67.5%). This is typical: in a growing geometric series, the last few terms dominate.

## Code examples

### Beginner example (Python)

```python
"""
Geometric sum to n: S_n = a * (1 - r**n) / (1 - r)

Example: summing n cohorts of customers where each cohort
has retention_ratio fraction of the previous cohort's size.
"""
import numpy as np


def geometric_sum(first_term: float, ratio: float, num_terms: int) -> float:
    """Return the sum of a finite geometric series.

    Parameters
    ----------
    first_term : float
        The value of the first term (a).
    ratio : float
        The common ratio between consecutive terms (r). Must not equal 1.
    num_terms : int
        Number of terms to sum (n).

    Returns
    -------
    float
        S_n = first_term * (1 - ratio**num_terms) / (1 - ratio)
    """
    if ratio == 1.0:
        return first_term * num_terms
    return first_term * (1.0 - ratio**num_terms) / (1.0 - ratio)


# Example: cohort revenue model
# 1000 users in first cohort, each worth €50/month
# 80% monthly retention across cohorts
FIRST_TERM_EUR = 1000.0 * 50.0   # €50,000 from cohort 1
RETENTION_RATIO = 0.80
NUM_MONTHS = 12
total_revenue = geometric_sum(FIRST_TERM_EUR, RETENTION_RATIO, NUM_MONTHS)

# Verify via direct summation
terms = [FIRST_TERM_EUR * RETENTION_RATIO**k for k in range(NUM_MONTHS)]
direct_sum = sum(terms)
print(f"Formula result : €{total_revenue:,.2f}")
print(f"Direct sum : €{direct_sum:,.2f}")
print(f"Difference : €{abs(total_revenue - direct_sum):.6f}")
```

### Beginner example (R)

```r
# Geometric sum: S_n = a * (1 - r^n) / (1 - r)
# Applied to NPV of a growing annuity
geometric_sum <- function(first_term, ratio, num_terms) {
  # Sum of finite geometric series
  # Args:
  #   first_term : first payment (a)
  #   ratio      : growth factor per period (r), must != 1
  #   num_terms  : number of periods (n)
  # Returns: total sum S_n
  if (ratio == 1) {
    return(first_term * num_terms)
  }
  first_term * (1 - ratio^num_terms) / (1 - ratio)
}

# NPV: cashflow C_0 = 10000 growing at g = 5% per year
# discounted at d = 10% per year, over 5 years
# Effective ratio = (1 + g) / (1 + d) = 1.05 / 1.10
C_0 <- 10000
growth_rate <- 0.05
discount_rate <- 0.10
num_years <- 5
effective_ratio <- (1 + growth_rate) / (1 + discount_rate)
first_pv_term <- C_0 / (1 + discount_rate)
npv <- geometric_sum(first_pv_term, effective_ratio, num_years)
cat(sprintf("NPV via formula : €%.2f\n", npv))

# Cross-check via sapply
pv_terms <- sapply(
  seq_len(num_years),
  function(t) C_0 * (1 + growth_rate)^(t - 1) / (1 + discount_rate)^t
)
cat(sprintf("NPV direct : €%.2f\n", sum(pv_terms)))
```

### Professional example (Python)

```python
"""
Geometric sum for customer lifetime value (LTV) modelling.

Business context:
    Monthly cohort onboarding model. Each new cohort has:
    - base_revenue_per_cohort: revenue generated if the entire cohort stayed
    - retention_rate : fraction of cohort surviving each month
    - acquisition_cost : one-time cost to acquire the cohort

Goal: compute break-even month and cumulative LTV curve.
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
RETENTION_RATE: float = 0.82
BASE_REVENUE_PER_COHORT: float = 100_000.0   # EUR
ACQUISITION_COST: float = 40_000.0   # EUR
NUM_MONTHS: int = 24
RNG_SEED: int = 42

def geometric_sum(first_term: float, ratio: float, num_terms: int) -> float:
    """Closed-form sum of finite geometric series."""
    if abs(ratio - 1.0) < 1e-10:
        return first_term * num_terms
    return first_term * (1.0 - ratio**num_terms) / (1.0 - ratio)

def cumulative_ltv_curve(
    first_term: float, retention_rate: float, num_months: int,
) -> np.ndarray:
    """Return array of cumulative LTV after each month (1..num_months)."""
    return np.array(
        [geometric_sum(first_term, retention_rate, month) for month in range(1, num_months + 1)]
    )

def break_even_month(cumulative_revenue: np.ndarray, cost: float) -> int:
    """Return first month where cumulative revenue exceeds acquisition cost."""
    exceeds = np.where(cumulative_revenue > cost)[0]
    return int(exceeds[0]) + 1 if len(exceeds) > 0 else -1


cumulative_revenue = cumulative_ltv_curve(
    BASE_REVENUE_PER_COHORT, RETENTION_RATE, NUM_MONTHS
)
net_ltv = cumulative_revenue - ACQUISITION_COST
be_month = break_even_month(cumulative_revenue, ACQUISITION_COST)
months = np.arange(1, NUM_MONTHS + 1)
results_df = pd.DataFrame({
    "month": months,
    "cumulative_revenue_eur": cumulative_revenue,
    "net_ltv_eur": net_ltv,
})
print(results_df.to_string(index=False))
print(f"\nBreak-even month: {be_month}")
print(f"12-month LTV : €{cumulative_revenue[11]:,.0f}")
print(f"24-month LTV : €{cumulative_revenue[23]:,.0f}")
```

---

*Source: 1300 p. 313*
