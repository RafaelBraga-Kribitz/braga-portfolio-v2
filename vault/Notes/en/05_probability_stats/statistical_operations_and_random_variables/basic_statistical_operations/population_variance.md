---
title: Population Variance
date: '2026-04-16'
wordCount: 400
slug: population_variance
permalink: /notes/05_probability_stats/statistical_operations_and_random_variables/basic_statistical_operations/population_variance/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\sigma^2 = \frac{\sum (x_i - \mu)^2}{n}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Population variance $\sigma^2$ measures the average squared deviation from the mean — how spread out the data is. It is fundamental to understanding risk, variability, and signal-to-noise ratio. In DA/DS: feature scaling (standardization), regularization (ridge regression adds $\lambda \sigma^2$), and statistical testing all depend on variance.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["Data: x1, ..., xn, mean μ"] --> B["Deviations: (xi - μ)"] B --> C["Square each: (xi - μ)²"] C --> D["Average the squares: Σ(xi-μ)² / n"] D --> E["σ²: population variance"] E --> F["σ = √σ²: standard deviation (same units as data)"]
```
### Real-World use:
#### Situation it is used
Risk analysis (variance of portfolio returns), feature normalization (StandardScaler), ANOVA (variance decomposition), and anywhere dispersion around the mean matters.
#### Problem it solves
Quantifies how far values typically deviate from the mean, enabling comparison of spread between datasets and computation of standardized scores.
#### How it solves the problem
Computes average squared deviation; squaring ensures positive contributions from both sides of the mean and penalizes large deviations more than small ones.
#### Example of it used in the Working Context as DA/DS for a Business
Ad spend variance: two campaigns both have mean ROAS = 3.5, but campaign A has $\sigma^2 = 0.5$ and B has $\sigma^2 = 4.0$. Campaign B is much riskier despite identical average performance.
### The Formula (Fragment-First)
$\sigma^2 = \frac{\sum (x_i - \mu)^2}{n}$
- $\sigma^2$: variance (sigma squared — note: $\sigma$ itself is the standard deviation).
- $(x_i - \mu)$: deviation of each observation from the mean.
- $(x_i - \mu)^2$: squared deviation (always non-negative).
- Divided by $n$: average squared deviation.
### Formula-to-English Translation
"The variance is the average of the squared differences between each value and the mean." ### Critical Concepts
- Population variance divides by $n$; sample variance divides by $n-1$ (Bessel's correction, unbiased estimator).
- Units of variance = units of data squared. Standard deviation $\sigma = \sqrt{\sigma^2}$ restores original units.
- Shortcut identity: $\sigma^2 = E[X^2] - (E[X])^2$.
- `np.var(x)` uses $n$ (population); `np.var(x, ddof=1)` uses $n-1$ (sample).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Data and mean*
Data: [2, 4, 4, 4, 5, 5, 7, 9]. $\mu = 40/8 = 5$. *Step 2: Squared deviations*
$(2-5)^2 = 9$, $(4-5)^2 = 1$ (×3), $(5-5)^2 = 0$ (×2), $(7-5)^2 = 4$, $(9-5)^2 = 16$ *Step 3: Average*
$\sigma^2 = (9 + 3 + 0 + 4 + 16)/8 = 32/8 = 4$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np data = np.array([2, 4, 4, 4, 5, 5, 7, 9], dtype=float)
pop_variance = np.var(data) # divides by n
sample_variance = np.var(data, ddof=1) # divides by n-1 print(f"Population variance (σ²): {pop_variance:.4f}") # 4.0
print(f"Sample variance (s²): {sample_variance:.4f}") # 4.571
```
#### Beginner friendly Example [R])
``` r
data <- c(2, 4, 4, 4, 5, 5, 7, 9)
# R's var() is sample variance (n-1)
sample_var <- var(data)
pop_var <- var(data) * (length(data) - 1) / length(data)
cat(sprintf("Population variance: %.4f\n", pop_var)) # 4.0
cat(sprintf("Sample variance: %.4f\n", sample_var)) # 4.571
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd def variance_decomposition( values: np.ndarray, groups: np.ndarray
) -> pd.DataFrame: """Compute between-group and within-group variance (ANOVA decomposition). Args: values: Numeric array. groups: Group labels for each value. Returns: DataFrame with per-group stats and variance decomposition. """ grand_mean = values.mean() unique_groups = np.unique(groups) rows = [] for g in unique_groups: mask = groups == g group_values = values[mask] rows.append({ "group": g, "n": int(mask.sum()), "mean": float(group_values.mean()), "within_var": float(np.var(group_values)), "between_contribution": float(mask.sum() * (group_values.mean() - grand_mean) ** 2), }) return pd.DataFrame(rows).round(4) rng = np.random.default_rng(seed=42)
segments = np.repeat(["A", "B", "C"], [500, 500, 500])
revenues = np.concatenate([ rng.normal(100, 15, 500), rng.normal(120, 25, 500), rng.normal(90, 10, 500),
])
print(variance_decomposition(revenues, segments).to_string())
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
AIO pag 86