---
title: Negative Binomial Distribution (Trials to $n$ successes)
date: '2026-04-16'
wordCount: 421
slug: negative_binomial_distribution_trials_to_n_successes
permalink: /notes/05_probability_stats/statistical_operations_and_random_variables/common_discrete_distributions/negative_binomial_distribution_trials_to_n_successes/index.html
share_status: draft
publish_target: note
boundary: public
---
# $P(X=x) = \binom{x-1}{n-1} p^n (1-p)^{x-n}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The Negative Binomial distribution models the number of trials $X$ needed to achieve exactly $n$ successes, where each trial has success probability $p$. It is also used as a generalization of Poisson for overdispersed count data (where variance > mean). In DA/DS: customer churn modeling (trials to first churn = Geometric = NB with $n=1$), overdispersed web traffic modeling, and count regression.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["Run trials until n-th success"] --> B["Last trial must be a success"] B --> C["First x-1 trials: exactly n-1 successes in x-1 trials"] C --> D["C(x-1, n-1) * p^(n-1) * (1-p)^(x-n)"] D --> E["Last trial (success): * p"] E --> F["P(X=x) = C(x-1,n-1) * p^n * (1-p)^(x-n)"]
```
### Real-World use:
#### Situation it is used
Overdispersed count data (NB regression as alternative to Poisson when Var > Mean). Sales cycles: number of calls to close $n$ deals. User behavior: number of page views before $n$ conversions.
#### Problem it solves
Models count data where the variance exceeds the mean (overdispersion), which is common in web analytics, marketing, and biology where Poisson is too restrictive.
#### How it solves the problem
Adds an extra dispersion parameter compared to Poisson: $Var[X] = \mu + \mu^2/r$ (for the $r$-parameterized version), allowing mean and variance to vary independently.
#### Example of it used in the Working Context as DA/DS for a Business
Support tickets per user per month: if $E[X] = 2$ but $Var[X] = 6$ (overdispersed vs Poisson where $Var = E = 2$), NB regression fits better than Poisson regression.
### The Formula (Fragment-First)
$P(X=x) = \binom{x-1}{n-1} p^n (1-p)^{x-n}$ for $x = n, n+1, n+2, \ldots$
- $n$: number of required successes.
- $p$: probability of success per trial.
- $x$: total trials (must be $\geq n$).
- $\binom{x-1}{n-1}$: ways to arrange $n-1$ successes in first $x-1$ trials.
- $p^n (1-p)^{x-n}$: probability of exactly $n$ successes and $x-n$ failures.
### Formula-to-English Translation
"The probability of needing exactly $x$ trials to get $n$ successes — the last trial must be the $n$-th success." ### Critical Concepts
- $E[X] = n/p$. $Var[X] = n(1-p)/p^2$.
- Special case $n=1$: Geometric distribution.
- NB for counts: parameterized as $P(Y=k) = \binom{k+r-1}{k}(1-p)^k p^r$ — where $Y$ counts failures.
- Python: `scipy.stats.nbinom(n, p)`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: n=2 successes needed, p=0.4, query P(X=4)*
Need exactly 4 trials to get 2nd success (last trial is success #2). *Step 2: Apply formula*
$P(X=4) = \binom{3}{1}(0.4)^2(0.6)^2 = 3 \times 0.16 \times 0.36 = 0.1728$ *Step 3: Interpret*
17.28% chance of needing exactly 4 trials to achieve 2 successes.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
from scipy.stats import nbinom
import numpy as np n_successes = 2
p_success = 0.4
x_values = range(2, 12) for x in x_values: # scipy nbinom: P(k failures before n successes) -> shift by n pmf = nbinom.pmf(x - n_successes, n_successes, p_success) print(f"P(X={x:2d}) = {pmf:.6f}")
```
#### Beginner friendly Example [R])
``` r
n_succ <- 2; p <- 0.4
for (x in 2:11) { # R's dnbinom: k failures before n successes, so x_failures = x - n pmf <- dnbinom(x - n_succ, size=n_succ, prob=p) cat(sprintf("P(X=%2d) = %.6f\n", x, pmf))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
from scipy.stats import nbinom, poisson
from scipy.special import gammaln def fit_negative_binomial(counts: np.ndarray) -> dict[str, float]: """Fit Negative Binomial distribution via MOM (Method of Moments). Uses: mean = μ, variance = μ + μ²/r → r = μ²/(var - μ). Args: counts: Non-negative integer count data. Returns: Dict with fitted r, p parameters and overdispersion check. """ mu = counts.mean() var = counts.var() if var <= mu: return {"poisson_adequate": True, "message": "No overdispersion detected"} r = mu**2 / (var - mu) p = r / (r + mu) # scipy parameterization return { "r": float(r), "p": float(p), "fitted_mean": float(mu), "fitted_var": float(var), "overdispersion_index": float(var / mu), "poisson_adequate": False, } rng = np.random.default_rng(seed=42)
# Overdispersed count data
count_data = rng.negative_binomial(n=3, p=0.4, size=5_000)
result = fit_negative_binomial(count_data)
print("Negative Binomial fit:")
for key, val in result.items(): print(f" {key}: {round(val, 4) if isinstance(val, float) else val}")
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
`` Domain knowledge.