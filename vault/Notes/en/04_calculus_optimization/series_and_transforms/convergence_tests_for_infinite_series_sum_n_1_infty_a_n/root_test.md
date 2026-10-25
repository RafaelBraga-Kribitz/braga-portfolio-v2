---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Root Test

$$
L = \lim_{n \to \infty} \sqrt[n]{|a_n|}
$$

: converges if $L < 1$, diverges if $L > 1$, inconclusive if $L = 1$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The Root Test (Cauchy's Root Test) checks convergence by asking: what is the eventual n-th root of each term? If terms shrink exponentially (L < 1), the series converges; if they grow (L > 1), it diverges. The Root Test is the natural companion to the Ratio Test — both ask "does this series decay geometrically?" but via different angles. Root Test is **especially powerful when terms are of the form $(f(n))^n$** because the n-th root cancels the exponent cleanly. The Ratio Test is better when terms involve factorials.

## Flowchart

```mermaid
flowchart TD
    A["Series sum a_n"] --> B["Compute r_n = |a_n|^(1/n) (n-th root of |a_n|)"]
    B --> C["Compute L = lim(n→inf) r_n"]
    C --> D{"Value of L?"} D -- "L < 1" --> E["CONVERGES absolutely"] D -- "L > 1 or L = inf" --> F["DIVERGES"] D -- "L = 1" --> G["INCONCLUSIVE — try Ratio Test, p-series, or Comparison"]
```

## Real-world use

### Where it is used

Any series where the n-th root of a term simplifies elegantly. Key targets: $a_n = r^n$ (geometric — root gives r directly), $a_n = (f(n))^n$ (root cancels exponent to leave f(n)), and power series $\sum c_n x^n$ (to find radius of convergence as R = 1/limsup|c_n|^{1/n}).

### Problem it solves

The ratio test can be inconclusive or messy for series with $n$-th power structure. The root test provides a clean alternative — especially for exponential-form terms.

### How it solves the problem

If $|a_n|^{1/n} \to L < 1$, then eventually $|a_n| < q^n$ for some q ∈ (L, 1), so the series is bounded above by a converging geometric series $\sum q^n$. Comparison test finishes the proof.

### Example in a business

**Model compression error bound**: When analyzing a series of approximation errors $\sum (1/k)^k$ for a compressed model, Root Test gives L = lim (1/k)^{k/k} = lim (1/k) = 0 < 1 → converges. This confirms the total compression error is bounded, making compression safe to deploy. **Power series / radius of convergence**: For Taylor series in automatic differentiation packages, the radius of convergence R determines the valid input range. R = 1/limsup|c_n|^{1/n} comes directly from the root test.

## The formula, piece by piece

$L = \lim_{n \to \infty} \sqrt[n]{|a_n|} = \lim_{n \to \infty} |a_n|^{1/n}$ - **$|a_n|$** — Absolute value of the n-th term.
- **$\sqrt[n]{\cdot}$** — The n-th root (= raising to power 1/n).
- **$|a_n|^{1/n}$** — The n-th root of the n-th term. For $a_n = r^n$, this gives $|r^n|^{1/n} = |r|$ exactly — the root test recovers the geometric ratio.
- **$L < 1$**: terms decay faster than a geometric series → **absolute convergence**.
- **$L > 1$**: terms grow → **divergence**.
- **$L = 1$**: inconclusive. Same limitation as the Ratio Test.
- **Relation to Ratio Test**: $\liminf |a_{n+1}/a_n| \leq \liminf |a_n|^{1/n} \leq \limsup |a_n|^{1/n} \leq \limsup |a_{n+1}/a_n|$.

The root test is at least as powerful as the ratio test.

## The formula in words

"Compute the n-th root of each term in absolute value. If this eventually stabilizes below 1, the series converges. If above 1, it diverges. If at exactly 1, you cannot tell." Intuition: you're asking "what is the effective base of the exponential decay (or growth) in the terms?" For geometric $r^n$, the root gives r. For $(1/2^n)^n = (1/2)^{n^2}$, the root gives $(1/2)^n \to 0$.

## Critical Concepts

1. **Best case: terms of the form $(f(n))^n$** — the root test gives lim f(n) directly.
2. **L = 1 is common and inconclusive**: p-series, harmonic series, alternating harmonic — all give L = 1.
3. **Absolute convergence**: Like the Ratio Test, L < 1 gives absolute convergence.
4. **Radius of convergence**: For power series $\sum c_n x^n$, R = 1/limsup|c_n|^{1/n} (Cauchy-Hadamard formula).
5. **Numerical computation**: For large n, compute $|a_n|^{1/n} = \exp(\ln|a_n|/n)$ to avoid overflow/underflow.
6. **Root vs.

Ratio Test**: Root Test works better for $(f(n))^n$ terms; Ratio Test works better when factorials appear. If both apply and converge, they give the same L.

## Step-by-step calculation (tiny example)

Test: $\sum_{n=1}^\infty \left(\frac{n}{2n+1}\right)^n$

*Step 1: Identify terms*
$a_n = \left(\frac{n}{2n+1}\right)^n$

*Step 2: Compute n-th root*
$|a_n|^{1/n} = \left(\frac{n}{2n+1}\right)$

*Step 3: Take the limit*
$L = \lim_{n \to \infty} \frac{n}{2n+1} = \lim_{n \to \infty} \frac{1}{2 + 1/n} = \frac{1}{2}$

*Step 4: Conclude*
$L = 1/2 < 1$ → **CONVERGES absolutely** by Root Test. *Verification*: $\sum_{n=1}^{1000} (n/(2n+1))^n \approx 0.6065$ — partial sum is finite. ✓

## Code examples

### Beginner example (Python)

```python
"""
Root
Test: L = lim |a_n|^(1/n)
Converges if L < 1, diverges if L > 1, inconclusive if L = 1.
""" import numpy as np
from typing import Callable

def root_test( term_func: Callable[[np.ndarray], np.ndarray], large_n_values: np.ndarray | None = None,
) -> dict:
    """Apply Root Test numerically. Parameters ---------- term_func : maps n (array of floats) to |a_n| large_n_values : n values to estimate the limit Returns ------- dict with limiting_root and conclusion """
    if large_n_values is None:
        large_n_values = np.array([100.0, 1000.0, 10000.0, 100000.0])   # Compute via log to avoid numerical overflow: |a_n|^(1/n) = exp(log|a_n|/n)
        log_terms = np.log(np.abs(term_func(large_n_values)) + 1e-300)
        nth_roots = np.exp(log_terms / large_n_values)
        limiting_root = float(nth_roots[-1])
        if limiting_root < 0.9999:
            conclusion = f"CONVERGES absolutely (L = {limiting_root:.6f} < 1)"
        elif limiting_root > 1.0001:
            conclusion = f"DIVERGES (L = {limiting_root:.6f} > 1)"
        else:
            conclusion = f"INCONCLUSIVE (L ≈ 1.0, try another test)"
        return {"limiting_root": limiting_root, "conclusion": conclusion}   # Test 1: (n / (2n+1))^n → L = 1/2 → converges
result1 = root_test(lambda n: (n / (2.0 * n + 1.0))**n)
print(f"(n/(2n+1))^n: {result1['conclusion']}")   # Test 2: (2n / n)^n = 2^n → L = 2 → diverges
result2 = root_test(lambda n: 2.0**n)
print(f"2^n: {result2['conclusion']}")   # Test 3: 1/n^2 → L = 1 → inconclusive (p-series, actually converges)
result3 = root_test(lambda n: 1.0 / n**2)
print(f"1/n^2: {result3['conclusion']}")   # Test 4: (1/n)^n → L = 0 → converges
result4 = root_test(lambda n: (1.0 / n)**n)
print(f"(1/n)^n: {result4['conclusion']}")
```

### Beginner example (R)

```r
# Root Test:
L = lim |a_n|^(1/n)
# Uses log trick to avoid overflow: |a_n|^(1/n) = exp(log|a_n| / n)
root_test <- function(term_func, series_name) { large_n <- c(100, 1000, 10000, 100000)
  log_terms <- log(abs(term_func(large_n)) + 1e-300)
  nth_roots <- exp(log_terms / large_n)
  l_val <- tail(nth_roots, 1)
  if (is.nan(l_val) || is.infinite(l_val)) { verdict <- "ERROR"
  }
  else
  if (l_val < 0.9999) { verdict <- sprintf("CONVERGES (L=%.6f)", l_val)
  }
  else
  if (l_val > 1.0001) { verdict <- sprintf("DIVERGES (L=%.6f)", l_val)
  }
  else { verdict <- "INCONCLUSIVE (L≈1)"
  }
  cat(sprintf("%-30s → %s\n", series_name, verdict))
} root_test(function(n) (n / (2*n + 1))^n, "(n/(2n+1))^n")
root_test(function(n) 2^n, "2^n")
root_test(function(n) 1 / n^2, "1/n^2 (inconclusive)")
root_test(function(n) (1/n)^n, "(1/n)^n")
root_test(function(n) (log(n)/n)^n, "(log(n)/n)^n")
```

### Professional example (Python)

```python
"""
Root Test for computing the radius of convergence of a neural network
feature expansion (RBF/Taylor-style power series). Business context: A recommender system uses a polynomial feature expansion sum_n c_n * x^n to approximate a kernel function. The analyst needs the radius of convergence R to know the safe input normalization range for the model.
""" import numpy as np def cauchy_hadamard_radius( coefficients: np.ndarray, n_offset: int = 0,
) -> float: """Compute radius of convergence via Cauchy-Hadamard formula. R = 1 / limsup |c_n|^(1/n) Parameters ---------- coefficients : array of |c_n| values (c_0, c_1, ..., c_N) n_offset : starting index (usually 0 or 1) Returns ------- float : radius of convergence R (inf if limsup = 0) """ indices = np.arange(n_offset, n_offset + len(coefficients), dtype=float)   # Avoid log(0): only consider nonzero coefficients
nonzero_mask = coefficients > 1e-300 if not np.any(nonzero_mask): return float("inf") log_roots = np.log(coefficients[nonzero_mask]) / indices[nonzero_mask] limsup_log_root = np.max(log_roots[-20:])   # limsup via tail max
limsup_root = np.exp(limsup_log_root) if limsup_root == 0: return float("inf") return 1.0 / limsup_root   # Simulate polynomial kernel coefficients: c_n = 1/n! (exponential kernel e^x)
NUM_TERMS: int = 50
import math
exp_kernel_coeffs = np.array([1.0 / math.factorial(n) for n in range(NUM_TERMS)]) radius_exp = cauchy_hadamard_radius(exp_kernel_coeffs)
print(f"Exponential kernel (c_n = 1/n!): R = {radius_exp:.2f} (expected: inf)")   # Geometric kernel: c_n = (0.5)^n → R = 1/0.5 = 2
geometric_coeffs = 0.5**np.arange(NUM_TERMS, dtype=float)
radius_geom = cauchy_hadamard_radius(geometric_coeffs)
print(f"Geometric kernel (c_n = 0.5^n): R = {radius_geom:.4f} (expected: 2.0)")   # Diverging kernel: c_n = n! (diverges everywhere except x=0)
factorial_coeffs = np.array([float(math.factorial(n)) for n in range(20)])
radius_fact = cauchy_hadamard_radius(factorial_coeffs)
print(f"Factorial kernel (c_n = n!): R = {radius_fact:.6f} (expected: 0.0)") print(f"\nRecommendation: normalize inputs to |x| < R_effective = {min(radius_geom, 2.0):.2f}")
```

---

*Source: 1300 p. 318*
