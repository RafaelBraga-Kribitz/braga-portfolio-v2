---
title: CDF
date: '2026-04-16'
wordCount: 351
slug: cdf
permalink: /notes/05_probability_stats/statistical_operations_and_random_variables/common_continuous_distributions/cdf/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\Phi(Z)$ (Evaluated via standard normal integration)
## Deep Breakdown
What it tells me *(Situation Awareness)*:
$\Phi(Z)$ is the CDF of the standard normal distribution $N(0,1)$ — it has no closed form but is tabulated and available in all statistical software. For any Normal($\mu, \sigma^2$), probabilities are computed by standardizing: $P(X \leq x) = \Phi\left(\frac{x-\mu}{\sigma}\right)$. This is the most-used single function in classical statistics.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["Normal(μ, σ²) query: P(X ≤ x)"] --> B["Standardize: Z = (x-μ)/σ"] B --> C["Look up Φ(Z) in z-table or scipy.stats.norm.cdf(Z)"] C --> D["P(X ≤ x) = Φ(Z)"] D --> E["P(a ≤ X ≤ b) = Φ((b-μ)/σ) - Φ((a-μ)/σ)"]
```
### Real-World use:
#### Situation it is used
Computing z-test p-values, confidence interval bounds, probability of exceeding a threshold, and any Normal probability query. Foundation of hypothesis testing and quality control (Six Sigma).
#### Problem it solves
Converts a Normal probability query into a table lookup or scipy call — the integral $\Phi(z) = \int_{-\infty}^z \phi(t) dt$ has no closed form but is well-approximated.
#### How it solves the problem
Uses precomputed tables or approximations like the error function: $\Phi(z) = \frac{1}{2}\left[1 + \text{erf}\left(\frac{z}{\sqrt{2}}\right)\right]$.
#### Example of it used in the Working Context as DA/DS for a Business
Z-test for A/B conversion rates: compute z-statistic, then $p = 2(1 - \Phi(|z|))$ for two-tailed test. If $p < 0.05$, reject null.
### The Formula (Fragment-First)
$\Phi(Z) = P(Z \leq z)$ where $Z \sim N(0,1)$
- No algebraic closed form.
- In terms of error function: $\Phi(z) = \frac{1}{2}\left[1 + \text{erf}\left(\frac{z}{\sqrt{2}}\right)\right]$.
- Quantile (inverse): $\Phi^{-1}(p)$ = `norm.ppf(p)` in Python.
### Formula-to-English Translation
"$\Phi(Z)$ is the probability that a standard normal random variable is at or below $Z$." Key values: $\Phi(1.96) = 0.975$, $\Phi(-1.96) = 0.025$, $\Phi(0) = 0.5$.
### Critical Concepts
- $\Phi(-z) = 1 - \Phi(z)$ (symmetry of standard normal).
- 95% CI uses $\Phi^{-1}(0.975) = 1.96$.
- Python: `from scipy.stats import norm; norm.cdf(z)`.
- R: `pnorm(z)`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Revenue ~N(10000, 2000²), query P(Revenue < 13000)* *Step 2: Standardize*
$Z = (13000 - 10000)/2000 = 1.5$ *Step 3: Lookup*
$P(X < 13000) = \Phi(1.5) \approx 0.9332$ *Step 4: Interpret*
93.3% of days have revenue below $13,000.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
from scipy.stats import norm mu, sigma = 10_000, 2_000
x_threshold = 13_000
z = (x_threshold - mu) / sigma
p_below = norm.cdf(z)
print(f"Z = {z:.2f}")
print(f"P(revenue < {x_threshold:,}) = {p_below:.4f} ({p_below*100:.1f}%)")
```
#### Beginner friendly Example [R])
``` r
mu <- 10000; sigma <- 2000; x_threshold <- 13000
z <- (x_threshold - mu) / sigma
p_below <- pnorm(z)
cat(sprintf("Z = %.2f | P(X < %d) = %.4f\n", z, x_threshold, p_below))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from scipy.stats import norm def z_test_two_proportion( conversions_a: int, n_a: int, conversions_b: int, n_b: int, alpha: float = 0.05
) -> dict[str, float | bool]: """Two-proportion z-test for A/B conversion rate comparison. Uses Φ(Z) for p-value computation. Args: conversions_a: Number of conversions in control. n_a: Total users in control. conversions_b: Number of conversions in treatment. n_b: Total users in treatment. alpha: Significance level. Returns: Dict with z-statistic, p-value, and decision. """ p_a = conversions_a / n_a p_b = conversions_b / n_b p_pooled = (conversions_a + conversions_b) / (n_a + n_b) se_pooled = np.sqrt(p_pooled * (1 - p_pooled) * (1/n_a + 1/n_b)) z_stat = (p_b - p_a) / se_pooled p_value = 2 * (1 - norm.cdf(abs(z_stat))) return { "p_a": p_a, "p_b": p_b, "z_stat": z_stat, "p_value": p_value, "significant": p_value < alpha, "relative_lift": (p_b - p_a) / p_a, } result = z_test_two_proportion(100, 2000, 130, 2000)
print("A/B Test Z-test result:")
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