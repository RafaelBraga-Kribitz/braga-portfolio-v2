---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Alternating Series Error Bound

$$
|S - S_N| \leq a_{N+1}
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
After summing the first N terms of a **converging alternating series**, this bound tells you exactly how far off you are from the true infinite sum. The error is no larger than the very next term you didn't include. In DA/DS: controlling truncation error in Taylor series approximations, bounding approximation error in iterative solvers, and guaranteeing precision when using finite series to approximate transcendental functions (e.g., e^x, sin(x), log(1+x)) for fast inference.

## Flowchart

```mermaid
flowchart TD
    A["Alternating series sum S = sum(-1)^n * a_n"] --> B["Verify conditions: a_n decreasing AND lim a_n = 0"]
    B --> C{"Conditions met?"} C -- "No" --> D["Cannot apply — use other bound"] C -- "Yes" --> E["Compute N-term partial sum S_N"]
    E --> F["Compute next term a_(N+1)"]
    F --> G["Error bound: |S - S_N| <= a_(N+1)"]
    G --> H["If a_(N+1) < target_precision → stop summing"]
```

## Real-world use

### Where it is used

When truncating an alternating series (like Taylor/Maclaurin expansions of sin, cos, ln(1+x)) at N terms and you need a guaranteed upper bound on the error introduced by the truncation.

### Problem it solves

You can't sum infinitely many terms in practice. You need to know: how many terms suffice to achieve a target precision (e.g., 6 decimal places)? The error bound gives you a stopping criterion without knowing the exact sum.

### How it solves the problem

For an alternating series that satisfies Leibniz conditions (terms decreasing to zero), the partial sums oscillate around the true sum, narrowing in. The true sum always lies between two consecutive partial sums, so the gap between them (= next term) is the worst-case error.

### Example in a business

**Efficient log computation**: Computing ln(1+x) = x - x²/2 + x³/3 - x⁴/4 + ... for x ∈ (0,1]. If you need 4 decimal places of precision, you keep summing until a_{N+1} < 0.00005. For x = 0.1: terms are 0.1, 0.005, 0.000333, 0.000025, 0.000002 — after N=4 terms the next term 0.000025 < 0.00005, so S_4 ≈ ln(1.1) to 4 decimal places. No need to evaluate a library function.

## The formula, piece by piece

$|S - S_N| \leq a_{N+1}$ - **$S$** — The true infinite sum (unknown in practice).
- **$S_N$** — The partial sum after N terms (what we compute).
- **$|S - S_N|$** — Absolute truncation error: how far our approximation is from truth.
- **$\leq$** — A guaranteed upper bound, not just an estimate.
- **$a_{N+1}$** — The absolute value of the (N+1)-th term, the first omitted term.
- **Conditions required**: The series must be alternating with terms (i) decreasing in absolute value and (ii) approaching zero (Leibniz conditions).

## The formula in words

"The absolute error from stopping at N terms is at most the size of the very next term." Intuition: each new term in an alternating series "corrects" the previous overshoot or undershoot, and since terms are decreasing, the correction gets smaller each time. The next correction bounds the remaining error.

## Critical Concepts

1. **Requires Leibniz conditions**: decreasing terms AND limit = 0. If terms don't decrease, this bound doesn't apply.
2. **The bound is tight**: The true error actually equals some fraction of a_{N+1}, but the bound says it can't exceed a_{N+1}.
3. **Practical stopping rule**: Sum until a_{N+1} < ε, your desired precision.
4. **Sign of the error**: The true sum S lies between S_N and S_{N+1}. If the last included term is positive, S_N is an overestimate; if negative, an underestimate.
5. **Not applicable to non-alternating series**: For non-alternating divergent or complex series, use other remainder estimation methods.

## Step-by-step calculation (tiny example)

Series: $S = \sum_{n=1}^\infty \frac{(-1)^{n+1}}{n} = \ln(2) \approx 0.6931$

*Step 1: Verify Leibniz conditions*
Terms: 1, 1/2, 1/3, 1/4, ... → decreasing ✓, → 0 ✓

*Step 2: Compute partial sum at N = 4*
S_4 = 1 - 1/2 + 1/3 - 1/4 = 0.5833...

*Step 3: Identify next term*
a_5 = 1/5 = 0.2000

*Step 4: Apply error bound*
|ln(2) - S_4| ≤ a_5 = 0.2000
True error: |0.6931 - 0.5833| = 0.1098 ≤ 0.2000 ✓

*Step 5: How many terms for 3 decimal places (ε = 0.001)?*
Need a_{N+1} = 1/(N+1) < 0.001 → N+1 > 1000 → N ≥ 1000. This series converges very slowly.

## Code examples

### Beginner example (Python)

```python
"""
Alternating series error bound: |S - S_N| <= a_(N+1) Applied to computing
ln(1+x) via alternating series
and finding the minimum N for a given precision target.
""" import math
from typing import Callable

def alternating_series_sum_with_bound( term_func: Callable[[int], float], precision_target: float, max_terms: int = 10_000,
) -> tuple[float, float, int]:
    """Sum alternating series until error bound < precision_target. Parameters ---------- term_func : function returning |a_n| for term index n (1-based) precision_target: stop when a_(N+1) < this value max_terms : hard cap on iterations Returns ------- tuple of (partial_sum, error_bound, num_terms_used) """
    partial_sum = 0.0
    for num_terms in range(1, max_terms + 1):
        sign = (-1.0) ** (num_terms + 1)
    partial_sum += sign * term_func(num_terms)
    next_term = term_func(num_terms + 1)
    if next_term < precision_target:
        return partial_sum, next_term, num_terms
    return partial_sum, term_func(max_terms + 1), max_terms   # ln(1+x) = x - x^2/2 + x^3/3 - ... for |x| <= 1
X_VALUE = 0.5
PRECISION_TARGET = 1e-6
approx_ln, error_bound, terms_used = alternating_series_sum_with_bound( term_func=lambda n: X_VALUE**n / n, precision_target=PRECISION_TARGET,
)
true_ln = math.log(1.0 + X_VALUE)
actual_error = abs(true_ln - approx_ln)
print(f"x = {X_VALUE}")
print(f"True ln(1+x) = {true_ln:.10f}")
print(f"Approx (N terms) = {approx_ln:.10f} (N = {terms_used})")
print(f"Error bound = {error_bound:.2e}")
print(f"Actual error = {actual_error:.2e} (bound holds: {actual_error <= error_bound})")
```

### Beginner example (R)

```r
# Alternating series error bound applied to sin(x) via Maclaurin series
# sin(x) = x - x^3/3! + x^5/5! - x^7/7! + ...
alternating_sin_approx <- function(x_val, precision_target = 1e-8) {  # Sum Maclaurin series for sin(x) until error bound < precision_target # Returns list with approx, error_bound, terms_used, actual_error
  partial_sum <- 0
  k <- 0  #
  k = 0, 1, 2, ... → term is (-1)^k * x^(2k+1) / (2k+1)! repeat { term_abs <- abs(x_val)^(2 * k + 1) / factorial(2 * k + 1)
    sign_val <- (-1)^k
    partial_sum <- partial_sum + sign_val * term_abs * sign(x_val)^(2 * k + 1)  # Error
    bound = next term
    next_term <- abs(x_val)^(2 * k + 3) / factorial(2 * k + 3)
    k <- k + 1
    if (next_term < precision_target || k > 50) { break
    }
  } list( approx = partial_sum, error_bound = next_term, terms_used = k, actual_error = abs(sin(x_val) - partial_sum) )
}
for (x in c(0.1, 0.5, 1.0, pi / 4)) { result <- alternating_sin_approx(x, precision_target = 1e-10)
  cat(sprintf( "x=%.4f: approx=%.10f, bound=%.2e, actual_err=%.2e, N=%d\n", x, result$approx, result$error_bound, result$actual_error, result$terms_used ))
}
```

### Professional example (Python)

```python
"""
Alternating series error bound
for fast feature hashing approximation. Business context:
    A feature hashing trick uses sin/cos approximation (RBF kernel via Fourier). The analyst needs to know how many Fourier features suffice to keep kernel approximation error < 1% for the given input range.
""" import numpy as np
import math
INPUT_RANGE_MAX: float = 2.0   # maximum |x| in feature vector
PRECISION_TARGET: float = 0.001
MAX_TERMS: int = 50

def maclaurin_cos_with_error_bound( x_val: float, precision_target: float,
) -> tuple[float, float, int]:
    """Approximate cos(x) via Maclaurin series with alternating error bound. cos(x) = 1 - x^2/2! + x^4/4! - x^6/6! + ... """
    partial_sum = 0.0
    for k in range(MAX_TERMS):
        exponent = 2 * k
    term = (x_val**exponent) / math.factorial(exponent)
    sign = (-1.0) ** k
    partial_sum += sign * term
    next_exp = 2 * (k + 1)
    next_term = (abs(x_val) ** next_exp) / math.factorial(next_exp)
    if next_term < precision_target:
        return partial_sum, next_term, k + 1
    return partial_sum, float("inf"), MAX_TERMS   # Find minimum terms needed across the full input range
x_values = np.linspace(0.0, INPUT_RANGE_MAX, 20)
max_terms_needed = 0
for x_val in x_values:
    _, bound, num_terms = maclaurin_cos_with_error_bound(x_val, PRECISION_TARGET)
max_terms_needed = max(max_terms_needed, num_terms)
true_cos = math.cos(x_val)
approx_cos, _, _ = maclaurin_cos_with_error_bound(x_val, PRECISION_TARGET)
actual_err = abs(true_cos - approx_cos)
print(f"Max input magnitude : {INPUT_RANGE_MAX}")
print(f"Required precision : {PRECISION_TARGET}")
print(f"Max Maclaurin terms needed across range: {max_terms_needed}")
print(f"Implication for RBF kernel: use {max_terms_needed} Fourier features")
```

---

*Source: 1300*
