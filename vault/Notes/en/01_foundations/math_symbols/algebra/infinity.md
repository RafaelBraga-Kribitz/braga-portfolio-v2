---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Infinity

$$
\infty
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
$\infty$ (the infinity symbol, a sideways figure-8, called the **lemniscate of Bernoulli**) represents a quantity that grows without bound. It is not a real number; it is a concept. In DA/DS you encounter $\infty$ in limits (what happens to a function as a parameter grows forever?), in bounds for integration and summation (summing all terms of a series), in the definition of distributions (the normal distribution extends from $-\infty$ to $+\infty$), and as a practical sentinel value in algorithms (initialize minimum distances to $\infty$, maximum distances to $-\infty$).

## Flowchart

```mermaid
flowchart TD
    A["Encounter infinity symbol"] --> B{"What context?"} B -- "Limit notation" --> C["As x grows without bound, f(x) approaches L"] B -- "Summation/integration bounds" --> D["Sum or integrate over all real values (no finite boundary)"] B -- "Probability distributions" --> E["Distribution support extends over all reals or all positives"] B -- "Algorithm sentinel" --> F["Initialize best_cost = infinity so any real cost is smaller"]
    C --> G["Use: lim as x to inf f(x) = L"]
    D --> H["Use: integral from -inf to +inf or sum from n=0 to inf"]
    E --> I["Use: Normal is defined over (-inf, +inf)"]
    F --> J["Use: best_cost = float('inf') in Python"]
```

## Real-world use

### Where it is used

Defining limits and convergence, specifying the domain of probability distributions, initializing variables in search/optimization algorithms (best score = $-\infty$, worst error = $+\infty$), expressing that a series or integral sums over all terms, and describing asymptotic behavior of algorithms.

### Problem it solves

Many mathematical objects are defined over unbounded domains. The normal distribution's probability density is nonzero for every real number, no matter how large. The natural logarithm is defined for all positive reals, extending to $+\infty$. Calculus requires integrating over these unbounded domains. $\infty$ provides a compact notation for "goes on forever."

### How it solves the problem

$\infty$ allows you to write $\int_{-\infty}^{+\infty}$ (integrate over all reals) or $\sum_{n=0}^{\infty}$ (sum all terms) without needing a finite upper or lower bound. The limit $\lim_{n \to \infty}$ formalizes "what happens when $n$ grows without any ceiling."

### Example in a business

Initializing a greedy search for the best model hyperparameter: `best_loss = float('inf')`. Every time you evaluate a candidate, you compare to `best_loss`. Since any real loss is less than infinity, the first real evaluation automatically becomes the new best. No special case needed.

## The formula, piece by piece

Breaking the notation:

- $\infty$: the lemniscate symbol, introduced by John Wallis in 1655. Not a number; a concept meaning "without bound."
- $+\infty$: positive infinity (grows in the positive direction without limit).
- $-\infty$: negative infinity (grows in the negative direction without limit).
- $\lim_{x \to \infty}$: the limit as $x$ increases without bound. Key behaviors (arithmetic with $\infty$, extended real line):
- $\infty + c = \infty$ for any finite $c$.
- $c \cdot \infty = \infty$ for any $c > 0$.
- $c / \infty = 0$ for any finite $c$.
- $\infty + \infty = \infty$.
- **Undefined / indeterminate**: $\infty - \infty$, $0 \cdot \infty$, $\infty / \infty$.

These require limits to evaluate. In probability: $\int_{-\infty}^{+\infty} f(x)\, dx = 1$ for any valid probability density function $f$.

## The formula in words

"$\infty$ means 'larger than any finite number you can name.' No matter how large a number you pick, infinity is larger. It is the mathematical way of saying 'and this goes on forever.'" "$\lim_{n \to \infty} (1 + 1/n)^n = e$" means: "as $n$ grows without bound, the expression $(1 + 1/n)^n$ approaches $e$. We never actually reach infinity; we observe what the expression approaches as we get arbitrarily close."

## Critical Concepts

1. **Not a number**: $\infty$ is not in $\mathbb{R}$. You cannot plug it into an equation like a number. It is only meaningful in limits, bounds, and extended arithmetic.
2. **Positive vs. negative infinity**: $+\infty$ and $-\infty$ are different. The real number line extends from $-\infty$ to $+\infty$.
3. **Indeterminate forms**: $\infty - \infty$, $0 \cdot \infty$, $1^\infty$ are indeterminate: they could evaluate to anything depending on the specific functions involved. Use L'Hopital's rule or algebraic manipulation to resolve them.
4. **IEEE 754 float infinity**: computers (and Python/R) have a representation for infinity: `float('inf')` in Python, `Inf` in R. Operations follow extended arithmetic. `1 / float('inf') = 0.0` in Python.
5. **Practical sentinel use**: setting initial values to $\infty$ or $-\infty$ is a clean algorithm pattern.

Never set to a "big number" like `9999` because that can be exceeded by real data.

## Step-by-step calculation (tiny example)

Task: demonstrate the limit $\lim_{n \to \infty} 1/n = 0$.

*Step 1: Evaluate 1/n for increasing values of n*
$n = 1$: $1/1 = 1.000$
$n = 10$: $1/10 = 0.100$
$n = 100$: $1/100 = 0.010$
$n = 1000$: $1/1000 = 0.001$
$n = 1{,}000{,}000$: $1/n = 0.000001$

*Step 2: Observe the trend*
As $n$ grows larger and larger, $1/n$ gets smaller and smaller, approaching (but never reaching) $0$.

*Step 3: Write the conclusion*
$\lim_{n \to \infty} \frac{1}{n} = 0$. No matter how large $n$ is, $1/n > 0$. But the limit is exactly 0.

## Code examples

### Beginner example (Python)

```python
import math   # Python's representation of infinity
pos_inf = float('inf')
neg_inf = float('-inf')
print(pos_inf)   # inf
print(neg_inf)   # -inf
print(pos_inf > 1e308)   # True: larger than the largest float
print(1 / pos_inf)   # 0.0
print(pos_inf + 100)   # inf # Sentinel pattern: find the minimum value in a list
values = [3.5, 1.2, 7.8, 2.1, 0.9]
best = float('inf')   # start at positive infinity
for val in values:
    if val < best:
        best = val
    print(f"Minimum: {best}")   # 0.9 # Limit demonstration
print("\n1/n approaches 0 as n grows:")
for n in [1, 10, 100, 1_000, 10_000]:
    print(f" 1/{n} = {1/n:.8f}")
```

### Beginner example (R)

```r
# R's representation of infinity
pos_inf <- Inf
neg_inf <- -Inf
print(pos_inf)  # Inf
print(neg_inf)  # -Inf
print(pos_inf > 1e308)  # TRUE
print(1 / pos_inf)  # 0
print(is.infinite(Inf))  # TRUE # Sentinel pattern: initialize
best_score = -Inf for maximization
scores <- c(0.85, 0.92, 0.78, 0.96, 0.88)
best_score <- -Inf
for (score in scores) { if (score > best_score)
  best_score <- score
}
cat("Best score:", best_score, "\n")  # 0.96
```

### Professional example (Python)

```python
import numpy as np
from scipy import stats   # Scenario: integrating a probability density over an infinite domain
# Normal distribution PDF integrates to 1 over (-inf, +inf)
mu = 0.0
sigma = 1.0
normal_dist = stats.norm(loc=mu, scale=sigma)   # Numerical integration over a "practically infinite" range
# True integral is from -inf to +inf = 1.0
result, error = stats.norm.expect(func=lambda x: 1, loc=mu, scale=sigma)
print(f"Integral of N(0,1) PDF over (-inf, +inf) = {result:.6f}")   # 1.000000 # Practical: use infinity in clipping / outlier removal bounds
# Keep values within [mu - 3*sigma, mu + 3*sigma] (3-sigma rule)
LOWER_BOUND = mu - 3 * sigma   # = -3.0
UPPER_BOUND = mu + 3 * sigma   # = +3.0
np.random.seed(42)
data = np.random.normal(mu, sigma, size=10_000)
clipped = np.clip(data, LOWER_BOUND, UPPER_BOUND)
outside = np.sum((data < LOWER_BOUND) | (data > UPPER_BOUND))
print(f"Values outside [{LOWER_BOUND}, {UPPER_BOUND}]: {outside} ({outside/len(data)*100:.2f}%)")
# Should be ~0.3% (the 3-sigma rule)
```

### Professional example (R)

```r
# Scenario: integral of N(0,1) PDF over (-inf, +inf) = 1 # integrate() uses finite bounds; use wide range to approximate (-Inf, Inf)
result <- integrate(function(x) dnorm(x, 0, 1), -Inf, Inf)
cat(sprintf("Integral of N(0,1) PDF over (-inf, +inf) = %.6f\n", result$value))  # Practical: clip to 3-sigma bounds
mu <- 0
sigma <- 1
LOWER_BOUND <- mu - 3 * sigma
UPPER_BOUND <- mu + 3 * sigma
set.seed(42)
data <- rnorm(10000, mu, sigma)
clipped <- pmin(pmax(data, LOWER_BOUND), UPPER_BOUND)
outside <- sum(data < LOWER_BOUND | data > UPPER_BOUND)
cat(sprintf("Values outside [%.1f, %.1f]: %d (%.2f%%)\n", LOWER_BOUND, UPPER_BOUND, outside, 100 * outside / length(data)))
```

---

*Source: 1300 p. 22*
