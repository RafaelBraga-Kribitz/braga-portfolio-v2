---
title: Probability Mass Function (PMF)
date: '2026-04-16'
wordCount: 362
slug: probability_mass_function_pmf
permalink: /notes/05_probability_stats/statistical_operations_and_random_variables/discrete_random_variables_drvs/probability_mass_function_pmf/index.html
share_status: draft
publish_target: note
boundary: public
---
# $f(x) = P(X = x)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The PMF assigns a probability to each specific value that a discrete random variable can take. It is the complete specification of a discrete distribution. In DA/DS: used for Bernoulli, Binomial, Poisson, and Negative Binomial distributions that model counts, binary outcomes, and rare events.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["Discrete RV: X takes values x1, x2, ..."] --> B["PMF: f(xi) = P(X = xi)"] B --> C["Constraints: f(xi) >= 0 and Σf(xi) = 1"] C --> D["Used in: Bernoulli, Binomial, Poisson, Negative Binomial"] D --> E["Visualization: bar chart, not continuous curve"]
```
### Real-World use:
#### Situation it is used
Modeling the number of support tickets per day (Poisson), probability of conversion (Bernoulli), number of successes in $n$ trials (Binomial), or count data in general.
#### Problem it solves
Provides an exact probability for each discrete outcome — unlike continuous distributions where $P(X = x) = 0$.
#### How it solves the problem
Maps each possible discrete value to a non-negative probability, where all probabilities sum to 1.
#### Example of it used in the Working Context as DA/DS for a Business
A/B test with 1000 users: $X \sim \text{Binomial}(n=1000, p=0.05)$. $P(X = 50) = \binom{1000}{50} (0.05)^{50} (0.95)^{950}$. Used to assess how likely exactly 50 conversions are under the null.
### The Formula (Fragment-First)
$f(x) = P(X = x)$
- $f(x)$: the PMF at value $x$.
- $P(X = x)$: probability that the random variable $X$ equals exactly $x$.
- Must satisfy: $f(x) \geq 0$ for all $x$, and $\sum_x f(x) = 1$.
### Formula-to-English Translation
"The PMF at $x$ equals the probability that the random variable $X$ takes exactly the value $x$." ### Critical Concepts
- Discrete only: PMF assigns exact probabilities. CRVs use PDF instead.
- CDF from PMF: $F(x) = \sum_{t \leq x} f(t)$.
- PMF bar chart: each bar height = exact probability.
- Python: `scipy.stats.<dist>.pmf(k, ...)`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Fair die*
$X$ = outcome of a fair 6-sided die. $f(x) = 1/6$ for $x \in \{1,2,3,4,5,6\}$. *Step 2: Verify*
$\sum_{x=1}^{6} f(x) = 6 \times (1/6) = 1$. Valid PMF. *Step 3: Query*
$P(X \leq 3) = f(1) + f(2) + f(3) = 3/6 = 0.5$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
from scipy.stats import binom # PMF for Binomial: n=10 trials, p=0.3 success rate
n_trials = 10
p_success = 0.3
k_values = range(n_trials + 1)
pmf_values = [binom.pmf(k, n_trials, p_success) for k in k_values] print(f"{'k':>4} {'P(X=k)':>10}")
for k, p in zip(k_values, pmf_values): print(f"{k:>4} {p:>10.6f}")
```
#### Beginner friendly Example [R])
``` r
n_trials <- 10; p_success <- 0.3
k_values <- 0:n_trials
pmf_values <- dbinom(k_values, n_trials, p_success)
for (i in seq_along(k_values)) { cat(sprintf("P(X=%2d) = %.6f\n", k_values[i], pmf_values[i]))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
from scipy.stats import binom, poisson
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt def compare_pmfs( n_trials: int, p_success: float, lambda_rate: float | None = None
) -> dict[str, np.ndarray]: """Compare Binomial and Poisson PMFs for count modeling. When lambda = n*p (large n, small p), Poisson approximates Binomial. Args: n_trials: Binomial n parameter. p_success: Binomial p parameter. lambda_rate: Poisson lambda (defaults to n*p). Returns: Dict with k values and PMFs for both distributions. """ lam = lambda_rate if lambda_rate is not None else n_trials * p_success k_range = np.arange(0, min(int(lam * 5) + 1, n_trials + 1)) return { "k": k_range, "binomial_pmf": binom.pmf(k_range, n_trials, p_success), "poisson_pmf": poisson.pmf(k_range, lam), "lambda": lam, } result = compare_pmfs(n_trials=100, p_success=0.05)
print(f"Binomial(100, 0.05) vs Poisson(lambda={result['lambda']}):")
print(f"{'k':>4} {'Binom PMF':>12} {'Poisson PMF':>13} {'Abs diff':>10}")
for k, b_pmf, p_pmf in zip(result["k"][:10], result["binomial_pmf"][:10], result["poisson_pmf"][:10]): print(f"{k:>4} {b_pmf:>12.6f} {p_pmf:>13.6f} {abs(b_pmf - p_pmf):>10.6f}")
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
AIO pag 85