---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Comparison Test

$$
0 \leq a_n \leq b_n \Rightarrow \left(\sum b_n \text{ converges} \Rightarrow \sum a_n \text{ converges}\right)
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The Comparison Test (Direct Comparison) says: if you can **bound a mystery series above by a known converging series**, then the mystery series also converges. Conversely, if you bound it below by a known diverging series, it diverges. It's the most intuitive convergence test — you're literally squeezing the unknown between known quantities. In DA/DS: bounding approximation errors, proving gradient norm sequences converge, and analyzing tail sums in probability distributions.

## Flowchart

```mermaid
flowchart TD
    A["Unknown series: sum a_n (a_n >= 0)"] --> B["Find comparison series sum b_n (b_n >= 0)"]
    B --> C{"Which direction?"} C -- "a_n <= b_n" --> D{"Does sum b_n converge?"} D -- "Yes" --> E["CONVERGES: sum a_n <= sum b_n < inf"] D -- "No" --> F["Inconclusive (only works if b_n converges)"] C -- "a_n >= b_n" --> G{"Does sum b_n diverge?"} G -- "Yes" --> H["DIVERGES: sum a_n >= sum b_n = inf"] G -- "No" --> I["Inconclusive (only works if b_n diverges)"]
```

## Real-world use

### Where it is used

When you can recognize that your series' terms are dominated by a simpler series (like a p-series or geometric series) term-by-term. Common targets for comparison: $\sum 1/n^p$ (p-series, converges iff p>1) and $\sum r^n$ (geometric, converges iff |r|<1).

### Problem it solves

Some series are hard to analyze directly. By finding a simpler bounding series, you can borrow its convergence/divergence property.

### How it solves the problem

If $a_n \leq b_n$ for all n and $\sum b_n$ converges to some finite L, then the partial sums of $\sum a_n$ are bounded above by L and non-decreasing, so they must converge by the monotone convergence theorem.

### Example in a business

**Tail sum bound for distribution**: Sum of probabilities beyond a threshold. If P(X = n) ≤ (0.9)^n for all n ≥ N₀, then the tail sum $\sum_{n=N_0}^\infty P(X=n) \leq \sum_{n=N_0}^\infty 0.9^n = 0.9^{N_0}/(1-0.9)$. This gives a computable upper bound on how much probability mass you're ignoring when truncating a distribution at N₀.

## The formula, piece by piece

**Upper comparison (convergence)**:
$0 \leq a_n \leq b_n$ for all $n \geq N_0$, and $\sum b_n$ converges $\Rightarrow \sum a_n$ converges. **Lower comparison (divergence)**:
$0 \leq b_n \leq a_n$ for all $n \geq N_0$, and $\sum b_n$ diverges $\Rightarrow \sum a_n$ diverges.

- **$a_n \geq 0$**: Both series must have non-negative terms.
- **$a_n \leq b_n$**: Termwise inequality (comparison).
- **"For all $n \geq N_0$"**: The inequality only needs to hold eventually, not necessarily from n=1.
- **Known series arsenal**: p-series ($\sum 1/n^p$: converges iff p>1), geometric ($\sum r^n$: converges iff |r|<1), harmonic ($\sum 1/n$: diverges).

## The formula in words

"If every term of a mystery series is no bigger than the corresponding term of a series we know converges, the mystery series also converges."
"If every term is at least as big as a series we know diverges, it diverges too."

## Critical Concepts

1. **Non-negative terms required**: Direct comparison only works for non-negative term series. For signed series, use absolute convergence or alternating series test.
2. **Termwise inequality is strict**: You need $a_n \leq b_n$, not just "of similar magnitude" — that's the limit comparison test.
3. **The "wrong" direction is inconclusive**: $a_n \leq b_n$ with $\sum b_n$ diverging tells you nothing about $\sum a_n$.
4. **Standard comparison series**: Know these by heart:

- $\sum 1/n^2$ converges (p=2 > 1) — use as upper bound - $\sum 1/n$ diverges (harmonic) — use as lower bound - $\sum (1/2)^n$ converges (geometric) — use as upper bound
5. **Tightness**: Comparison gives a bound on the sum too: $\sum a_n \leq \sum b_n$.

## Step-by-step calculation (tiny example)

Test: $\sum_{n=1}^\infty \frac{1}{n^2 + 1}$

*Step 1: Identify comparison series*
For large n: $\frac{1}{n^2+1} < \frac{1}{n^2}$

*Step 2: State the inequality*
$0 \leq \frac{1}{n^2+1} \leq \frac{1}{n^2}$ for all n ≥ 1. ✓

*Step 3: Check the comparison series*
$\sum 1/n^2$ is a p-series with p=2 > 1 → **converges** (to π²/6 ≈ 1.645).

*Step 4: Conclude*
By comparison test: $\sum \frac{1}{n^2+1}$ **CONVERGES**. *Numerical check*: $\sum_{n=1}^{10000} 1/(n^2+1) \approx 1.0767$ — finite, confirmed. ✓

## Code examples

### Beginner example (Python)

```python
"""
Comparison Test: if a_n <= b_n and sum(b_n) converges → sum(a_n) converges.
Numerical verification with partial sums.
""" import numpy as np
from typing import Callable

def comparison_test_numerical( series_a: Callable[[np.ndarray], np.ndarray], series_b: Callable[[np.ndarray], np.ndarray], num_terms: int = 10_000,
) -> dict:
    """Numerically check comparison test: verify a_n <= b_n and estimate sums. Parameters ---------- series_a : the series under investigation (a_n) series_b : the comparison series (b_n, should be known) num_terms : how many terms to compute Returns ------- dict with: comparison_holds, partial_sum_a, partial_sum_b, ratio_at_large_n """
    indices = np.arange(1, num_terms + 1, dtype=float)
    a_vals = series_a(indices)
    b_vals = series_b(indices)
    comparison_holds = bool(np.all(a_vals <= b_vals + 1e-14))
    partial_sum_a = float(np.sum(a_vals))
    partial_sum_b = float(np.sum(b_vals))
    return { "comparison_holds": comparison_holds, "partial_sum_a": partial_sum_a, "partial_sum_b": partial_sum_b, "upper_bound_valid": comparison_holds and partial_sum_b < np.inf, }   # Example: 1/(n^2+1) compared to 1/n^2
result = comparison_test_numerical( series_a=lambda n: 1.0 / (n**2 + 1.0), series_b=lambda n: 1.0 / n**2,
)
print(f"1/(n^2+1) vs 1/n^2:")
print(f" a_n <= b_n everywhere: {result['comparison_holds']}")
print(f" Partial sum a (10k): {result['partial_sum_a']:.6f}")
print(f" Partial sum b (10k): {result['partial_sum_b']:.6f} (= pi^2/6 - 1 ≈ {np.pi**2/6-1:.6f})")
print(f" Upper bound valid: {result['upper_bound_valid']}")
```

### Beginner example (R)

```r
# Comparison test: sum 1/(n^2 + n) vs sum 1/n^2
comparison_test <- function(a_func, b_func, series_name, n_terms = 10000) { n_vals <- seq_len(n_terms)
  a_vals <- a_func(n_vals)
  b_vals <- b_func(n_vals)
  comparison_holds <- all(a_vals <= b_vals + 1e-14)
  sum_a <- sum(a_vals)
  sum_b <- sum(b_vals)
  cat(sprintf("%s:\n a_n<=b_n: %s | sum_a=%0.6f | sum_b=%0.6f\n", series_name, comparison_holds, sum_a, sum_b))
} comparison_test( function(n) 1 / (n^2 + n), function(n) 1 / n^2, "1/(n^2+n) vs 1/n^2"
) comparison_test( function(n) 1 / (2^n + n), function(n) 1 / 2^n, "1/(2^n+n) vs 1/2^n"
)
```

### Professional example (Python)

```python
"""
Comparison test for bounding tail probability in a model's output distribution. Business context: Fraud detection model outputs P(fraud | features). We want to bound the total probability mass in the tail (scores above threshold N0) using a geometric comparison, confirming the tail is negligible.
""" import numpy as np NUM_SCORE_BUCKETS: int = 1000
THRESHOLD_INDEX: int = 100   # we ignore scores above this bucket
DECAY_FACTOR: float = 0.97   # geometric decay of probability per bucket

def simulate_fraud_score_distribution( num_buckets: int, decay: float, seed: int = 42,
) -> np.ndarray:
    """Simulate a fraud score PMF that decays geometrically in the tail."""
    rng = np.random.default_rng(seed)
    raw_probs = np.zeros(num_buckets)   # First 100 buckets: main mass
    raw_probs[:100] = rng.dirichlet(np.ones(100)) * 0.85   # Remaining: geometric tail
    tail_indices = np.arange(num_buckets - 100)
    raw_probs[100:] = 0.15 * decay**tail_indices * (1.0 - decay)
    return raw_probs / raw_probs.sum()
fraud_pmf = simulate_fraud_score_distribution(NUM_SCORE_BUCKETS, DECAY_FACTOR)
tail_probs = fraud_pmf[THRESHOLD_INDEX:]
tail_indices = np.arange(len(tail_probs), dtype=float)   # Comparison: tail_prob[k] <= 0.15 * DECAY_FACTOR^k (geometric bound)
geometric_bound = DECAY_FACTOR**tail_indices / (1.0 - DECAY_FACTOR) * fraud_pmf[THRESHOLD_INDEX]
comparison_holds = np.all(tail_probs <= geometric_bound + 1e-14)
actual_tail_mass = np.sum(tail_probs)
geometric_tail_bound = np.sum(geometric_bound)
print(f"Tail probability mass (buckets > {THRESHOLD_INDEX}): {actual_tail_mass:.6f}")
print(f"Geometric comparison bound : {geometric_tail_bound:.6f}")
print(f"Comparison holds (a_n <= b_n) : {comparison_holds}")
print(f"Decision: tail mass is {'NEGLIGIBLE' if actual_tail_mass < 0.01 else 'SIGNIFICANT'}")
```

---

*Source: 1300 p. 316*
