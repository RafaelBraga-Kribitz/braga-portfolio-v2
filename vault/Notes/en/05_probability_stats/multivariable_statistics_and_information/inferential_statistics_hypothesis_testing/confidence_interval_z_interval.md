---
title: Confidence Interval (Z-Interval)
date: '2026-04-16'
wordCount: 597
slug: confidence_interval_z_interval
permalink: /notes/05_probability_stats/multivariable_statistics_and_information/inferential_statistics_hypothesis_testing/confidence_interval_z_interval/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\bar{x} \pm Z_{\alpha/2} \dfrac{\sigma}{\sqrt{n}}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A $(1-\alpha) \times 100\%$ confidence interval gives a range of plausible values for the population mean $\mu$. The Z-interval uses the standard Normal quantile $Z_{\alpha/2}$ and is valid when (1) $\sigma$ is known, or (2) $n$ is large enough that the sample $s \approx \sigma$ by CLT. In DA/DS this appears in A/B test result reporting, uplift estimates, and everywhere a "margin of error" is communicated to stakeholders.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Collect sample of size n"] --> B["Compute sample mean x-bar"] B --> C["Know or estimate sigma"] C --> D["Compute SE = sigma / sqrt(n)"] D --> E["Choose confidence level (e.g. 95%)"] E --> F["Get Z_alpha/2 (e.g. 1.96 for 95%)"] F --> G["CI = x-bar +/- Z_alpha/2 * SE"] G --> H["Interpret: plausible range for true mu"]
```
### Real-World use:
#### Situation it is used
Reporting A/B test results: "the mean revenue per user in the treatment group is $12.50, with a 95% CI of [$11.80, $13.20]." Stakeholders use the CI to assess practical significance, not just statistical significance.
#### Problem it solves
A point estimate $\bar{x}$ has no inherent uncertainty attached to it. The CI quantifies that uncertainty, telling you how wide the range of plausible population means is given the sample you observed.
#### How it solves the problem
By the CLT, $\bar{x} \sim \mathcal{N}(\mu, \sigma^2/n)$ approximately. The Z critical value $Z_{\alpha/2}$ captures the central $(1-\alpha)$ probability mass of the standard Normal. Multiplying by the SEM scales this back to the original units.
#### Example of it used in the Working Context as DA/DS for a Business
An A/B test with $n=1000$ users per group measures mean order value. Treatment group: $\bar{x} = 45.20$, $\sigma = 12$ EUR. SEM $= 12/\sqrt{1000} \approx 0.379$. 95% CI: $45.20 \pm 1.96 \times 0.379 = [44.46, 45.94]$. Since the CI excludes the control mean of 43.50 EUR, the result is statistically significant.
### The Formula (Fragment-First)
| Symbol | Meaning |
|--------|---------|
| $\bar{x}$ | Sample mean |
| $Z_{\alpha/2}$ | Standard Normal quantile at $\alpha/2$ tail probability |
| $\alpha$ | Significance level (e.g. $\alpha=0.05$ for 95% CI) |
| $\sigma$ | Population standard deviation |
| $\sqrt{n}$ | Square root of sample size |
| $\sigma/\sqrt{n}$ | Standard Error of the Mean (SEM) | Common Z critical values: $Z_{0.025} = 1.96$ (95% CI), $Z_{0.005} = 2.576$ (99% CI). Full formula: $CI = \bar{x} \pm Z_{\alpha/2} \cdot \dfrac{\sigma}{\sqrt{n}}$ ### Formula-to-English Translation
"The confidence interval is the sample mean plus or minus the critical Z value times the standard error." The $\pm$ gives a symmetric interval around the sample mean. The wider the interval, the less precise the estimate; the wider, the more confident you are it contains $\mu$.
### Critical Concepts
- **Correct interpretation**: "If we repeated the sampling procedure many times, $(1-\alpha)$% of the resulting CIs would contain the true $\mu$." NOT "there is a 95% probability that $\mu$ is in THIS interval."
- **Z vs t**: use Z when $\sigma$ is known or $n \ge 30$; use the t-distribution otherwise.
- **Width trade-off**: wider CI = more confidence; narrower CI = more precision. Can only reduce width by increasing $n$.
- **Margin of error**: the half-width $Z_{\alpha/2} \cdot \sigma/\sqrt{n}$ is called the margin of error.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
$\bar{x} = 50$, $\sigma = 10$, $n = 100$, confidence = 95%. *Step 1: Compute SEM*
$SE = 10 / \sqrt{100} = 10/10 = 1.0$ *Step 2: Get Z critical value*
95% CI: $\alpha = 0.05$, so $Z_{0.025} = 1.96$ *Step 3: Compute margin of error*
$ME = 1.96 \times 1.0 = 1.96$ *Step 4: Form interval*
$CI = [50 - 1.96, \; 50 + 1.96] = [48.04, 51.96]$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy import stats sample_data = [48, 52, 55, 47, 50, 53, 49, 51, 46, 54]
n = len(sample_data)
x_bar = np.mean(sample_data)
sigma = 5.0 # assume known population std sem = sigma / np.sqrt(n)
z_critical = stats.norm.ppf(0.975) # 1.96 for 95% CI
margin_error = z_critical * sem ci_lower = x_bar - margin_error
ci_upper = x_bar + margin_error print(f"Sample mean: {x_bar:.2f}")
print(f"SEM: {sem:.4f}")
print(f"Z_0.025: {z_critical:.4f}")
print(f"95% CI: [{ci_lower:.4f}, {ci_upper:.4f}]")
```
#### Beginner friendly Example [R])
``` r
sample_data <- c(48, 52, 55, 47, 50, 53, 49, 51, 46, 54)
n <- length(sample_data)
x_bar <- mean(sample_data)
sigma <- 5.0 sem <- sigma / sqrt(n)
z_critical <- qnorm(0.975) # 1.96
margin_error <- z_critical * sem ci_lower <- x_bar - margin_error
ci_upper <- x_bar + margin_error cat("95% Z-interval: [", round(ci_lower, 4), ",", round(ci_upper, 4), "]\n")
```
#### Final Professional Example [Python])
``` python
from __future__ import annotations import numpy as np
import pandas as pd
from scipy import stats
from dataclasses import dataclass @dataclass
class ConfidenceIntervalResult: mean: float sem: float z_critical: float lower: float upper: float confidence_level: float def contains(self, value: float) -> bool: return self.lower <= value <= self.upper def width(self) -> float: return self.upper - self.lower def z_confidence_interval( data: np.ndarray, sigma: float | None = None, confidence_level: float = 0.95,
) -> ConfidenceIntervalResult: # Compute Z-based confidence interval for the population mean. # If sigma is None, uses sample std (large-sample approximation). n = len(data) x_bar = float(np.mean(data)) std_used = sigma if sigma is not None else float(np.std(data, ddof=1)) sem = std_used / np.sqrt(n) alpha = 1.0 - confidence_level z_crit = float(stats.norm.ppf(1 - alpha / 2)) margin = z_crit * sem return ConfidenceIntervalResult( mean=round(x_bar, 4), sem=round(sem, 4), z_critical=round(z_crit, 4), lower=round(x_bar - margin, 4), upper=round(x_bar + margin, 4), confidence_level=confidence_level, ) def ab_test_ci_report( control_data: np.ndarray, treatment_data: np.ndarray, confidence_level: float = 0.95,
) -> pd.DataFrame: # Compute CIs for control and treatment means and the lift. control_ci = z_confidence_interval(control_data, confidence_level=confidence_level) treatment_ci = z_confidence_interval(treatment_data, confidence_level=confidence_level) lift = treatment_ci.mean - control_ci.mean rows = [ {"group": "control", "mean": control_ci.mean, "ci_lower": control_ci.lower, "ci_upper": control_ci.upper}, {"group": "treatment", "mean": treatment_ci.mean, "ci_lower": treatment_ci.lower, "ci_upper": treatment_ci.upper}, {"group": "lift", "mean": round(lift, 4), "ci_lower": None, "ci_upper": None}, ] return pd.DataFrame(rows) if __name__ == "__main__": rng = np.random.default_rng(seed=42) control = rng.normal(loc=43.0, scale=12.0, size=500) treatment = rng.normal(loc=45.5, scale=12.0, size=500) report = ab_test_ci_report(control, treatment, confidence_level=0.95) print("A/B Test 95% Confidence Intervals:") print(report.to_string(index=False))
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