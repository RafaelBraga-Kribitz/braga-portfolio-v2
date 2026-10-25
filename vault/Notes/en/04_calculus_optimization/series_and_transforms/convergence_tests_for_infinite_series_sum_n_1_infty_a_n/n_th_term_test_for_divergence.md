---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# $n$-th Term Test for Divergence

$$
\text{If } \lim_{n \to \infty} a_n \neq 0 \text{, then } \sum_{n=1}^\infty a_n \text{ diverges}
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
This is the **cheapest first check** when analyzing whether a series converges or diverges. Before investing in ratio tests, integral tests, or comparisons, you check whether the individual terms even go to zero. If they don't, the series absolutely cannot converge — you stop there. In DA/DS this is used when analyzing the behavior of iterative algorithms, verifying that loss terms vanish, confirming that probability distributions normalize, and checking whether approximation series truncate safely. **Critical caveat**: This test can ONLY prove divergence. If the limit equals zero, you learn nothing — the series may still diverge (e.g., harmonic series $\sum 1/n$ → 0 but diverges). You then need a stronger test.

## Flowchart

```mermaid
flowchart TD
    A["Series: sum a_n"] --> B["Compute lim(n→∞) a_n"]
    B --> C{"Limit exists and equals 0?"} C -- "No (limit ≠ 0 or DNE)" --> D["DIVERGES — test complete"] C -- "Yes (limit = 0)" --> E["Inconclusive — need another test"]
    E --> F["Try: Ratio / Root / Comparison / Integral Test"]
```

## Real-world use

### Where it is used

Any time you encounter a candidate infinite series and want a quick sanity check before heavier analysis. Common in: checking that penalty terms in a regularized loss go to zero, verifying gradient norms decrease, confirming a Fourier coefficient sequence goes to zero (Riemann-Lebesgue lemma), and in model convergence proofs.

### Problem it solves

Avoids wasting time computing complex integrals or ratios when the series obviously diverges because the terms don't vanish.

### How it solves the problem

Necessary condition for convergence: if a series converges, then its partial sums S_n stabilize, which means a_n = S_n - S_{n-1} → 0. Contrapositive: if a_n doesn't go to 0, partial sums can't stabilize → divergence.

### Example in a business

**Gradient descent divergence check**: If learning rate η is too large, gradient norms ‖∇L_t‖ may not go to zero. The n-th term test says: if the sequence of gradient updates doesn't approach zero, the loss series $\sum \Delta L_t$ (telescoping) can't converge and training diverges. This motivates learning rate decay schedules.

## The formula, piece by piece

The test: $\lim_{n \to \infty} a_n \neq 0 \Rightarrow \sum_{n=1}^\infty a_n$ diverges.

- **$a_n$** — The n-th term of the series (the general term, not the partial sum).
- **$\lim_{n \to \infty} a_n$** — The limiting value of the general term as index grows.
- **$\neq 0$** — If limit is nonzero (finite nonzero, ±∞, or doesn't exist) → divergence.
- **Contrapositive (what you actually apply)**: If $\lim_{n \to \infty} a_n \neq 0$, conclude DIVERGES. If $= 0$, conclude UNKNOWN.
- **What this is NOT**: A test for convergence.

Limit = 0 is necessary but not sufficient for convergence.

## The formula in words

"If the general term of a series does not approach zero, the series cannot possibly converge — it diverges." The logic: a converging series must eventually add nothing (terms go to zero). If you keep adding a non-negligible amount, the total must grow without bound.

## Critical Concepts

1. **Necessary not sufficient**: $\sum 1/n$ diverges despite $1/n \to 0$. The harmonic series is the canonical counterexample every DS practitioner should know.
2. **The test is fast**: just take the limit of the term, no integration or ratio computation.
3. **Common diverging patterns**: $a_n = c$ (constant), $a_n = n$, $a_n = (-1)^n$, $a_n = n/(n+1) \to 1 \neq 0$ → all diverge by this test.
4. **DNE case**: If the limit doesn't exist (oscillates), the series diverges.
5. **Application in ML**: Training loss should decrease → residuals a_n = L_n → 0.

If loss plateaus at a nonzero value, the gradient sum doesn't converge.

## Step-by-step calculation (tiny example)

Test series $\sum_{n=1}^\infty \frac{n}{n+1}$

*Step 1: Identify the general term*
$a_n = \frac{n}{n+1}$

*Step 2: Compute the limit*
$\lim_{n \to \infty} \frac{n}{n+1} = \lim_{n \to \infty} \frac{1}{1 + 1/n} = \frac{1}{1 + 0} = 1$

*Step 3: Apply the test*
Limit = 1 ≠ 0 → **series DIVERGES** by the n-th term test.

*Step 4: Contrast with harmonic series (limit = 0, still diverges)*
$a_n = 1/n$: $\lim 1/n = 0$ → test is **inconclusive** (harmonic series actually diverges, but this test can't tell us that).

## Code examples

### Beginner example (Python)

```python
"""
n-th term test for divergence: check if lim(n→inf) a_n != 0.

If the limit is nonzero (or doesn't exist), the series diverges.
If the limit is 0, the test is inconclusive.
"""
import numpy as np
from typing import Callable


def nth_term_divergence_check(
    term_func: Callable[[np.ndarray], np.ndarray],
    large_n_values: np.ndarray | None = None,
) -> dict:
    """Apply n-th term test for divergence.

    Parameters
    ----------
    term_func : function mapping n to a_n
    large_n_values : array of large n to evaluate limit numerically

    Returns
    -------
    dict with keys: 'limiting_values', 'apparent_limit', 'conclusion'
    """
    if large_n_values is None:
        large_n_values = np.array([1e3, 1e4, 1e5, 1e6])
    limiting_values = term_func(large_n_values)
    apparent_limit = limiting_values[-1]
    NEAR_ZERO_THRESHOLD = 1e-6
    if abs(apparent_limit) > NEAR_ZERO_THRESHOLD:
        conclusion = f"DIVERGES (limit ≈ {apparent_limit:.6f} ≠ 0)"
    else:
        conclusion = f"INCONCLUSIVE (limit ≈ {apparent_limit:.2e}, need another test)"
    return {
        "limiting_values": limiting_values,
        "apparent_limit": apparent_limit,
        "conclusion": conclusion,
    }


# Test 1: a_n = n/(n+1) → limit = 1 → DIVERGES
result1 = nth_term_divergence_check(lambda n: n / (n + 1.0))
print(f"a_n = n/(n+1): {result1['conclusion']}")

# Test 2: a_n = 1/n → limit = 0 → INCONCLUSIVE (harmonic series)
result2 = nth_term_divergence_check(lambda n: 1.0 / n)
print(f"a_n = 1/n: {result2['conclusion']}")

# Test 3: a_n = 1/n^2 → limit = 0 → INCONCLUSIVE (but actually converges)
result3 = nth_term_divergence_check(lambda n: 1.0 / n**2)
print(f"a_n = 1/n^2: {result3['conclusion']}")

# Test 4: a_n = (-1)^n → oscillates, no limit → DIVERGES
result4 = nth_term_divergence_check(lambda n: (-1.0) ** n)
print(f"a_n = (-1)^n: {result4['conclusion']}")
```

### Beginner example (R)

```r
# n-th term test for divergence
# Numerically evaluate lim(n→inf) a_n for several candidate series
nth_term_check <- function(term_func, series_name) {
  # Evaluate term_func at large n values to estimate limit
  large_n <- c(1e3, 1e4, 1e5, 1e6)
  limiting_values <- term_func(large_n)
  apparent_limit <- tail(limiting_values, 1)
  if (is.nan(apparent_limit) || is.infinite(apparent_limit) || abs(apparent_limit) > 1e-6) {
    conclusion <- sprintf("DIVERGES (limit ≈ %.6g)", apparent_limit)
  } else {
    conclusion <- sprintf("INCONCLUSIVE (limit ≈ %.2e)", apparent_limit)
  }
  cat(sprintf("%-25s → %s\n", series_name, conclusion))
}
nth_term_check(function(n) n / (n + 1), "a_n = n/(n+1)")
nth_term_check(function(n) 1 / n, "a_n = 1/n (harmonic)")
nth_term_check(function(n) 1 / n^2, "a_n = 1/n^2")
nth_term_check(function(n) (-1)^n, "a_n = (-1)^n")
nth_term_check(function(n) (1 + 1/n)^n - exp(1), "a_n = (1+1/n)^n - e")
```

### Professional example (Python)

```python
"""
n-th Term Test applied to training loss monitoring in ML.

If gradient updates (a_n = ||grad_t||) don't go to zero,
the optimizer is not converging. Use this as an automated
divergence alarm in training pipelines.
"""
import numpy as np

RNG_SEED: int = 42
NUM_STEPS: int = 200
LEARNING_RATE_STABLE: float = 0.01
LEARNING_RATE_DIVERGING: float = 0.5
NEAR_ZERO_THRESHOLD: float = 1e-4

def simulate_gradient_norms(
    learning_rate: float, num_steps: int, seed: int,
) -> np.ndarray:
    """Simulate gradient norm sequence for a simple quadratic loss L(w) = 0.5*w^2."""
    rng = np.random.default_rng(seed)
    weight = rng.normal(0.0, 1.0)
    gradient_norms = np.empty(num_steps)
    for step in range(num_steps):
        gradient = weight + rng.normal(0.0, 0.1)  # noisy gradient
        gradient_norms[step] = abs(gradient)
        weight = weight - learning_rate * gradient
    return gradient_norms

def nth_term_test_on_sequence(values: np.ndarray, window: int = 10) -> str:
    """Apply n-th term test to the tail of a sequence."""
    tail_mean = np.mean(np.abs(values[-window:]))
    if tail_mean > NEAR_ZERO_THRESHOLD:
        return f"DIVERGES (tail mean = {tail_mean:.6f})"
    return f"INCONCLUSIVE/CONVERGING (tail mean = {tail_mean:.2e})"


stable_norms = simulate_gradient_norms(LEARNING_RATE_STABLE, NUM_STEPS, RNG_SEED)
diverging_norms = simulate_gradient_norms(LEARNING_RATE_DIVERGING, NUM_STEPS, RNG_SEED)
print(f"lr={LEARNING_RATE_STABLE}: {nth_term_test_on_sequence(stable_norms)}")
print(f"lr={LEARNING_RATE_DIVERGING}: {nth_term_test_on_sequence(diverging_norms)}")
```

---

*Source: 1300 p. 316*
