---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Alternating Series Test (Leibniz)

$$
\sum_{n=1}^\infty (-1)^{n+1} a_n \text{ converges if: } a_{n+1} \leq a_n \text{ and } \lim_{n\to\infty} a_n = 0
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
This test (Leibniz criterion) tells you that an **alternating series converges** as long as two conditions hold: the terms are decreasing in absolute value, and they go to zero. In DA/DS this is used when analyzing alternating Taylor series (sin, cos, ln(1+x)), gradient update sequences that alternate in sign, and theoretical convergence proofs for iterative methods that over- and under-shoot alternately.

## Flowchart

```mermaid
flowchart TD
    A["Series: sum (-1)^(n+1) * a_n, with a_n > 0"] --> B["Check: is a_(n+1) <= a_n for all n? (non-increasing)"] B -- "No" --> C["Test fails — try other convergence tests"] B -- "Yes" --> D["Check: lim(n→inf) a_n = 0?"] D -- "No" --> E["DIVERGES by n-th term test"] D -- "Yes" --> F["CONVERGES by Leibniz criterion"]
    F --> G["Bonus: |S - S_N| <= a_(N+1) (error bound)"]
```

## Real-world use

### Where it is used

Encountered in any setting with oscillating signs in a series. Key examples: Taylor/Maclaurin alternating series for elementary functions, alternating harmonic series $\sum (-1)^{n+1}/n = \ln(2)$, and convergence analysis of alternating gradient updates in optimization.

### Problem it solves

Absolute convergence tests (ratio, root) may fail for conditionally convergent series like $\sum (-1)^{n+1}/n$ (the absolute series $\sum 1/n$ diverges, but the alternating version converges). Leibniz handles these cases.

### How it solves the problem

The partial sums oscillate: S_1 > S_3 > S_5 > ... and S_2 < S_4 < S_6 < ..., with odd and even subsequences converging toward each other. The width of oscillation equals a_n, which goes to zero, so both subsequences converge to the same limit.

### Example in a business

**Log loss approximation**: ln(1+x) = x - x²/2 + x³/3 - x⁴/4 + ... for x ∈ (-1, 1]. This series is alternating with terms = x^n/n. For fixed |x| < 1: terms x^n/n → 0 and decrease (after n > |x|/something). Leibniz confirms convergence and enables using finite truncations with controlled error. Used in probabilistic models where log-likelihood involves ln(1+exp(-margin)).

## The formula, piece by piece

Series form: $\sum_{n=1}^\infty (-1)^{n+1} a_n$ where $a_n > 0$.

Two conditions:
1. **$a_{n+1} \leq a_n$ (non-increasing)**: terms decrease in absolute value from some point onward.
2. **$\lim_{n \to \infty} a_n = 0$**: terms vanish.

If both hold → series **converges** (conditionally, not necessarily absolutely).

- **$(-1)^{n+1}$** — Produces the alternating signs: +1, -1, +1, -1, ...
- **$a_n$** — The absolute magnitude of each term (positive).
- **Conditional vs. absolute convergence**: The alternating series may converge while $\sum a_n$ diverges.

Example: $\sum (-1)^{n+1}/n$ converges (to ln 2) but $\sum 1/n$ diverges.

## The formula in words

"An alternating series converges if the terms are getting smaller and eventually going to zero." The decreasing condition ensures that each sign-flip overshoots less than the previous one. The limit = 0 condition ensures the oscillations vanish rather than plateauing.

## Critical Concepts

1. **Conditional convergence**: Leibniz convergence does NOT imply absolute convergence. You can prove absolute convergence by other means, but Leibniz alone only gives conditional.
2. **Riemann's rearrangement theorem**: Conditionally convergent series can be rearranged to sum to any real number. This is dangerous computationally — never reorder alternating series terms.
3. **The two conditions are independent**: Terms going to zero is not enough (n-th term test). Decreasing is not enough if they don't go to zero. Both are needed.
4. **Eventually decreasing**: Terms only need to be decreasing from some N onward, not necessarily from n=1.
5. **Free error bound**: Once you confirm convergence by Leibniz, you automatically get the alternating series error bound $|S - S_N| \leq a_{N+1}$.

## Step-by-step calculation (tiny example)

Test: $\sum_{n=1}^\infty \frac{(-1)^{n+1}}{n} = 1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + ...$

*Step 1: Identify the terms*
$a_n = 1/n > 0$ for all n ≥ 1.

*Step 2: Check condition 1 (decreasing)*
$a_{n+1} = 1/(n+1) < 1/n = a_n$ for all n ≥ 1. ✓ Strictly decreasing.

*Step 3: Check condition 2 (limit = 0)*
$\lim_{n \to \infty} 1/n = 0$. ✓

*Step 4: Conclusion*
Both conditions satisfied → **series CONVERGES** by Leibniz.

*Step 5: Verify the sum*
True sum = ln(2) ≈ 0.6931. S_4 = 1 - 0.5 + 0.333 - 0.25 = 0.583. Error bound: a_5 = 0.2. Actual error: 0.110 ≤ 0.2 ✓.

## Code examples

### Beginner example (Python)

```python
"""
Alternating Series Test (Leibniz criterion).
Numerically verify both conditions and confirm convergence.
"""
import numpy as np
from typing import Callable


def leibniz_test(
    term_func: Callable[[np.ndarray], np.ndarray],
    check_indices: np.ndarray | None = None,
) -> dict:
    """Apply Leibniz criterion to an alternating series.

    Parameters
    ----------
    term_func : function mapping n (array) to |a_n| (positive terms)
    check_indices : range of n values to verify conditions

    Returns
    -------
    dict with: decreasing_ok, limit_zero, conclusion
    """
    if check_indices is None:
        check_indices = np.arange(1, 1001)
    terms = term_func(check_indices)
    next_terms = term_func(check_indices + 1)
    decreasing_ok = bool(np.all(next_terms <= terms + 1e-12))
    apparent_limit = terms[-1]
    limit_zero = bool(abs(apparent_limit) < 1e-6)
    if decreasing_ok and limit_zero:
        conclusion = "CONVERGES (Leibniz conditions satisfied)"
    elif not decreasing_ok:
        conclusion = "INCONCLUSIVE: terms not monotone decreasing"
    else:
        conclusion = "DIVERGES: terms do not go to zero"
    return {
        "decreasing_ok": decreasing_ok,
        "limit_zero": limit_zero,
        "apparent_limit": apparent_limit,
        "conclusion": conclusion,
    }


# Test 1: a_n = 1/n → alternating harmonic → CONVERGES
r1 = leibniz_test(lambda n: 1.0 / n)
print(f"a_n = 1/n: {r1['conclusion']}")

# Test 2: a_n = 1/n^2 → CONVERGES (also absolutely)
r2 = leibniz_test(lambda n: 1.0 / n**2)
print(f"a_n = 1/n^2: {r2['conclusion']}")

# Test 3: a_n = 1 + 1/n → limit = 1 ≠ 0 → DIVERGES
r3 = leibniz_test(lambda n: 1.0 + 1.0 / n)
print(f"a_n = 1 + 1/n: {r3['conclusion']}")

# Test 4: a_n = n/(n^2+1) → CONVERGES (terms decrease to 0)
r4 = leibniz_test(lambda n: n / (n**2 + 1.0))
print(f"a_n = n/(n^2+1): {r4['conclusion']}")
```

### Beginner example (R)

```r
# Leibniz criterion: verify conditions for alternating series
leibniz_test <- function(term_func, series_name, n_check = 1:1000) {
  # Check conditions for alternating series convergence
  terms <- term_func(n_check)
  next_terms <- term_func(n_check + 1)
  decreasing_ok <- all(next_terms <= terms + 1e-12)
  limit_value <- term_func(1e6)
  limit_zero <- abs(limit_value) < 1e-6
  if (decreasing_ok && limit_zero) {
    verdict <- "CONVERGES"
  } else if (!decreasing_ok) {
    verdict <- "INCONCLUSIVE (not monotone)"
  } else {
    verdict <- "DIVERGES (limit != 0)"
  }
  cat(sprintf("%-30s decrease=%s lim=%.2e → %s\n", series_name,
              ifelse(decreasing_ok, "YES", "NO"), limit_value, verdict))
}
leibniz_test(function(n) 1 / n, "a_n = 1/n (alternating harmonic)")
leibniz_test(function(n) 1 / n^2, "a_n = 1/n^2")
leibniz_test(function(n) 1 / log(n+1), "a_n = 1/log(n+1)")
leibniz_test(function(n) 1 + 1/n, "a_n = 1 + 1/n")
```

### Professional example (Python)

```python
"""
Leibniz test applied to verifying convergence of a custom
feature importance alternating expansion in a boosting pipeline.

Context: Gradient boosting residuals alternate in sign for some tree configurations.
This checks whether the residual sequence satisfies Leibniz conditions, as a diagnostic.
"""
import numpy as np
from sklearn.datasets import make_regression
from sklearn.tree import DecisionTreeRegressor

RNG_SEED: int = 42
NUM_TREES: int = 30
LEARNING_RATE: float = 0.1


def train_gradient_boosting_residuals(
    num_trees: int,
    learning_rate: float,
    seed: int,
) -> np.ndarray:
    """Simulate gradient boosting and return per-tree mean absolute residuals."""
    rng = np.random.default_rng(seed)
    x_data, y_data = make_regression(
        n_samples=500, n_features=10, noise=10.0, random_state=seed
    )
    predictions = np.zeros_like(y_data)
    mean_abs_residuals = np.empty(num_trees)
    for tree_idx in range(num_trees):
        residuals = y_data - predictions
        tree = DecisionTreeRegressor(max_depth=3, random_state=seed + tree_idx)
        tree.fit(x_data, residuals)
        update = learning_rate * tree.predict(x_data)
        predictions += update
        mean_abs_residuals[tree_idx] = np.mean(np.abs(residuals))
    return mean_abs_residuals


residuals_sequence = train_gradient_boosting_residuals(NUM_TREES, LEARNING_RATE, RNG_SEED)

# Check Leibniz conditions on residual sequence
decreasing = np.all(np.diff(residuals_sequence) <= 0)
limit_value = residuals_sequence[-1]
goes_to_zero = limit_value < 1.0   # rough threshold
print("Gradient Boosting Residual Sequence Diagnostics:")
print(f" Mean abs residuals range: {residuals_sequence[0]:.2f} → {residuals_sequence[-1]:.2f}")
print(f" Monotone decreasing : {decreasing}")
print(f" Final residual (≈limit) : {limit_value:.4f}")
print(f" Approaches zero : {goes_to_zero}")
```

---

*Source: 1300 p. 318*
