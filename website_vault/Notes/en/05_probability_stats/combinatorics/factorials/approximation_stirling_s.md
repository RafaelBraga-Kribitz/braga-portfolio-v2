---
publish: true
date: '2026-04-16'
tags:
- probability-statistics
---

# Approximation (Stirling's)

$$
n! \approx \sqrt{2\pi n} \left( \frac{n}{e} \right)^n
$$

(within 1% for $n>10$)

## Deep Breakdown

What it tells me *(Situation Awareness)*:
Stirling's approximation gives a closed-form estimate of $n!$ that grows as $O(n \log n)$ in log-space, making it tractable for large $n$ where direct computation overflows. It is essential in information theory (entropy calculations), statistical mechanics, combinatorics at scale, and anywhere log-factorials appear in ML likelihood functions.

## Flowchart

```mermaid
flowchart LR
    A["Need log(n!) for large n"] --> B["Direct factorial: overflow risk"]
    B --> C["Stirling: log(n!) ≈ 0.5*log(2πn) + n*log(n) - n"]
    C --> D["Use in log-likelihood, entropy, log-binomial"]
    D --> E["Result: numerically stable, <1% error for n > 10"]
```

## Real-world use

### Where it is used

When $n$ is large (e.g., vocabulary size in NLP, number of documents, large combinatorial counts) and you need $\log(n!)$ for information-theoretic or likelihood computations without overflow.

### Problem it solves

$n!$ for large $n$ overflows 64-bit floats ($n \approx 171$ for double precision). Stirling's allows working in log-space exactly where needed.

### How it solves the problem

Replaces the exact factorial with a smooth, computable expression via $\log(n!) \approx \frac{1}{2}\log(2\pi n) + n \log n - n$, derived from the Laplace method applied to the Gamma function integral.

### Example in a business

Computing the entropy of a language model vocabulary distribution: $H = -\sum p_i \log p_i$ where terms involve $\log(k!)$ for token counts $k$. Stirling makes this tractable for vocabulary sizes of 50,000+.

## The formula, piece by piece

$n! \approx \sqrt{2\pi n} \left(\frac{n}{e}\right)^n$
- $\sqrt{2\pi n}$: a polynomial correction factor.
- $\left(\frac{n}{e}\right)^n$: the dominant exponential term.
- $e \approx 2.718$: Euler's number.
- In log-space: $\ln(n!) \approx \frac{1}{2}\ln(2\pi n) + n\ln n - n$.

## The formula in words

"$n$ factorial is approximately the square root of $2\pi n$, times $n$ divided by $e$, all raised to the $n$-th power." For $n = 10$: exact $= 3{,}628{,}800$; Stirling $\approx 3{,}598{,}696$ (error $\approx 0.83\%$).

## Critical Concepts

- Error is $O(1/n)$: improves as $n$ grows.
- Never use for small $n$ (e.g., $n < 5$): error exceeds 5%.
- In practice, use `math.lgamma(n+1)` in Python or `lgamma(n+1)` in R — they use better approximations than raw Stirling and are exact at integer points.
- Log form is always preferred over raw Stirling to avoid overflow.

## Step-by-step calculation (tiny example)

*Step 1: Choose n*
$n = 10$

*Step 2: Compute each component*
$\sqrt{2\pi \cdot 10} = \sqrt{62.83} \approx 7.926$
$\left(\frac{10}{e}\right)^{10} = (3.679)^{10} \approx 455{,}052$

*Step 3: Multiply*
$7.926 \times 455{,}052 \approx 3{,}607{,}738$

*Step 4: Compare to exact*
$10! = 3{,}628{,}800$. Error $\approx 0.58\%$.

## Code examples

### Beginner example (Python)

```python
import math
n = 10
stirling = math.sqrt(2 * math.pi * n) * (n / math.e) ** n
exact = math.factorial(n)
error_pct = abs(stirling - exact) / exact * 100
print(f"Stirling: {stirling:,.0f}")
print(f"Exact: {exact:,}")
print(f"Error: {error_pct:.2f}%")
```

### Beginner example (R)

```r
n <- 10
stirling <- sqrt(2 * pi * n) * (n / exp(1))^n
exact <- factorial(n)
error_pct <- abs(stirling - exact) / exact * 100
cat(sprintf("Stirling: %s\n", format(round(stirling), big.mark=",")))
cat(sprintf("Exact: %s\n", format(exact, big.mark=",")))
cat(sprintf("Error: %.2f%%\n", error_pct))
```

### Professional example (Python)

```python
import math
import numpy as np

def log_factorial_stirling(n: float) -> float:
    """Log-factorial via Stirling approximation. Uses the log form: log(n!) ≈ 0.5*log(2*pi*n) + n*log(n) - n. Valid for n > 10; for exact use, prefer math.lgamma(n+1). Args: n: Positive real number. Returns: Approximation of log(n!). """
    return 0.5 * math.log(2 * math.pi * n) + n * math.log(n) - n

def log_factorial_exact(n: int) -> float:
    """Exact log(n!) via lgamma."""
    return math.lgamma(n + 1)   # Accuracy comparison across n
N_VALUES = [5, 10, 20, 50, 100, 500, 1000]
print(f"{'n':>6} {'Stirling log(n!)':>20} {'Exact log(n!)':>18} {'Rel Error %':>12}")
for n_val in N_VALUES:
    stirling_log = log_factorial_stirling(n_val)
exact_log = log_factorial_exact(n_val)
rel_error = abs(stirling_log - exact_log) / abs(exact_log) * 100
print(f"{n_val:>6} {stirling_log:>20.6f} {exact_log:>18.6f} {rel_error:>12.6f}")
```

---

*Source: AIO p. 83*
