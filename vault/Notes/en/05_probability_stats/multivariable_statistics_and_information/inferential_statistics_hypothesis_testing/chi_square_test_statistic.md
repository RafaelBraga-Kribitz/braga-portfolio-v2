---
title: Chi-Square Test Statistic
date: '2026-04-16'
wordCount: 593
slug: chi_square_test_statistic
permalink: /notes/05_probability_stats/multivariable_statistics_and_information/inferential_statistics_hypothesis_testing/chi_square_test_statistic/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\chi^2 = \sum_i \dfrac{(O_i - E_i)^2}{E_i}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The chi-square ($\chi^2$) statistic measures the discrepancy between observed frequencies $O_i$ and frequencies $E_i$ expected under a null hypothesis. It has two main uses: (1) goodness-of-fit — does a single categorical variable follow a specified distribution? (2) test of independence — are two categorical variables independent? In DA/DS it is used to test whether device type and purchase rate are independent, whether a campaign's click distribution matches the expected distribution, or whether segment proportions have changed.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Collect observed frequencies O_i per category"] --> B["Specify expected frequencies E_i under H0"] B --> C["For each cell: compute (O_i - E_i)^2 / E_i"] C --> D["Sum all terms: chi-sq = sum (O_i - E_i)^2 / E_i"] D --> E["Determine degrees of freedom"] E --> F["Compare chi-sq to chi-sq critical value or compute p-value"] F -->|"p < alpha"| G["Reject H0: significant departure from expected"] F -->|"p >= alpha"| H["Fail to reject H0"]
```
### Real-World use:
#### Situation it is used
Testing whether the proportion of conversions differs across device types (mobile, desktop, tablet) — a chi-square test of independence on a 2x3 contingency table. Or testing whether the actual distribution of ad clicks across weekdays matches the expected uniform distribution.
#### Problem it solves
Proportions can look different by chance. The chi-square test quantifies whether the observed differences between categories are too large to be explained by random sampling under the null hypothesis.
#### How it solves the problem
It standardises each squared deviation $(O_i - E_i)^2$ by dividing by $E_i$ (so large and small cells contribute proportionally), then sums these scaled deviations. Under $H_0$, this sum follows a chi-square distribution with known degrees of freedom.
#### Example of it used in the Working Context as DA/DS for a Business
A DA has a contingency table of (device: mobile/desktop) × (purchase: yes/no) with 2000 observations. The chi-square test of independence checks whether purchase rates differ by device. A significant result justifies building device-specific conversion models.
### The Formula (Fragment-First)
| Symbol | Meaning |
|--------|---------|
| $\chi^2$ | Chi-square test statistic |
| $O_i$ | Observed frequency in category $i$ |
| $E_i$ | Expected frequency in category $i$ under $H_0$ |
| $(O_i - E_i)^2$ | Squared deviation from expectation |
| $(O_i - E_i)^2 / E_i$ | Scaled contribution of category $i$ |
| $\sum_i$ | Sum over all categories | For independence test: $E_{ij} = (\text{row total}_i \times \text{col total}_j) / n$ Full formula: $\chi^2 = \sum_i \dfrac{(O_i - E_i)^2}{E_i}$ ### Formula-to-English Translation
"The chi-square statistic is the sum of squared relative deviations between what was observed and what was expected. A large value means the observed data are far from the null hypothesis expectation." Under $H_0$, $\chi^2 \sim \chi^2_{df}$.
### Critical Concepts
- **Degrees of freedom**: - Goodness-of-fit: $df = k - 1$ (where $k$ = number of categories). - Independence test: $df = (r-1)(c-1)$ (rows minus 1 times columns minus 1).
- **Minimum expected frequency**: rule of thumb — each $E_i \ge 5$; use Fisher's exact test for small cells.
- **One-sided**: the chi-square test is always one-tailed (upper tail) because $\chi^2 \ge 0$.
- **Cramér's V**: effect size measure for chi-square $= \sqrt{\chi^2/(n \cdot \min(r-1,c-1))}$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Goodness-of-fit: expected equal distribution across 3 days; observed: Mon=60, Tue=40, Wed=50 (total=150). *Step 1: Expected frequencies under H0 (uniform)*
$E_i = 150/3 = 50$ for each day. *Step 2: Compute each term*
Mon: $(60-50)^2/50 = 100/50 = 2.0$
Tue: $(40-50)^2/50 = 100/50 = 2.0$
Wed: $(50-50)^2/50 = 0/50 = 0.0$ *Step 3: Sum*
$\chi^2 = 2.0 + 2.0 + 0.0 = 4.0$ *Step 4: Compare to critical value*
$df = 3-1 = 2$; $\chi^2_{0.05, 2} = 5.99$; since $4.0 < 5.99$, fail to reject $H_0$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy import stats # Observed click counts per weekday
observed = np.array([60, 40, 50, 70, 55])
total = observed.sum() # Expected under uniform distribution
expected = np.full_like(observed, total / len(observed), dtype=float) # Manual chi-square
chi2_manual = sum((o - e) ** 2 / e for o, e in zip(observed, expected))
print(f"Chi-square (manual): {chi2_manual:.4f}") # scipy version
chi2_stat, p_value = stats.chisquare(observed, f_exp=expected)
print(f"Chi-square (scipy): {chi2_stat:.4f}")
print(f"p-value: {p_value:.6f}")
print(f"Reject uniform H0: {p_value < 0.05}")
```
#### Beginner friendly Example [R])
``` r
# Test of independence: device x purchase
contingency_table <- matrix(c(420, 80, 280, 220), nrow = 2, byrow = TRUE, dimnames = list(device = c("mobile", "desktop"), purchase = c("no", "yes"))) test_result <- chisq.test(contingency_table)
cat("Chi-square statistic:", round(test_result$statistic, 4), "\n")
cat("p-value: ", round(test_result$p.value, 6), "\n")
cat("Degrees of freedom: ", test_result$parameter, "\n")
```
#### Final Professional Example [Python])
``` python
from __future__ import annotations import numpy as np
import pandas as pd
from scipy.stats import chi2_contingency
from dataclasses import dataclass @dataclass
class ChiSquareIndependenceResult: chi2_statistic: float p_value: float degrees_of_freedom: int cramers_v: float reject_independence: bool conclusion: str def chi_square_independence_test( df: pd.DataFrame, col_x: str, col_y: str, alpha: float = 0.05,
) -> ChiSquareIndependenceResult: # Chi-square test of independence with Cramer's V effect size. contingency = pd.crosstab(df[col_x], df[col_y]) chi2_stat, p_val, dof, expected = chi2_contingency(contingency) n = contingency.values.sum() k = min(contingency.shape[0] - 1, contingency.shape[1] - 1) cramers_v = float(np.sqrt(chi2_stat / (n * k))) if k > 0 else 0.0 return ChiSquareIndependenceResult( chi2_statistic=round(float(chi2_stat), 4), p_value=round(float(p_val), 6), degrees_of_freedom=int(dof), cramers_v=round(cramers_v, 4), reject_independence=p_val < alpha, conclusion=( f"DEPENDENT (p={p_val:.4f} < {alpha}, V={cramers_v:.3f})" if p_val < alpha else f"Cannot reject independence (p={p_val:.4f} >= {alpha})" ), ) if __name__ == "__main__": rng = np.random.default_rng(seed=42) n_users = 5_000 device = rng.choice(["mobile", "desktop"], size=n_users, p=[0.60, 0.40]) # Desktop converts at 2x the rate: strong dependence purchase_prob = np.where(device == "desktop", 0.40, 0.15) purchase = (rng.random(n_users) < purchase_prob).astype(str) purchase = np.where(purchase == "True", "yes", "no") user_df = pd.DataFrame({"device": device, "purchase": purchase}) result = chi_square_independence_test(user_df, col_x="device", col_y="purchase") print("Chi-square test of independence (device vs purchase):") for field, val in result.__dict__.items(): print(f" {field}: {val}")
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