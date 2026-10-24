---
title: Joint Expected Value (Discrete)
date: '2026-04-16'
wordCount: 533
slug: joint_expected_value_discrete
permalink: /notes/05_probability_stats/multivariable_statistics_and_information/multivariable_expectations/joint_expected_value_discrete/index.html
share_status: draft
publish_target: note
boundary: public
---
# $E[g(X,Y)] = \sum_x \sum_y g(x,y) f(x,y)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the bivariate extension of LOTUS (Law of the Unconscious Statistician): to compute the expected value of any function $g(X,Y)$ of two discrete random variables, you weight $g(x,y)$ by the joint probability $f(x,y)$ and sum over all (x,y) pairs. Special cases include: $g(x,y) = xy$ gives $E[XY]$ needed for covariance; $g(x,y) = (x-\mu_X)(y-\mu_Y)$ gives the covariance definition directly; $g(x,y) = x+y$ gives $E[X+Y] = E[X]+E[Y]$ (linearity of expectation).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Define function g(X,Y) to average"] --> B["Get joint PMF f(x,y) for all pairs"] B --> C["For each (x,y): compute g(x,y) * f(x,y)"] C --> D["Sum all weighted values"] D --> E["Result: E[g(X,Y)]"]
```
### Real-World use:
#### Situation it is used
Computing the expected value of a combined metric across two discrete variables: e.g., expected combined revenue from two product categories where each has its own discrete demand distribution and they are correlated.
#### Problem it solves
When two variables are correlated, you cannot simply compute $E[g(X)] + E[g(Y)]$ separately — you need the joint distribution to correctly account for their interaction in $g(X,Y)$.
#### How it solves the problem
The joint expectation formula weights $g(x,y)$ by the actual joint probability of the pair, so correlation between X and Y is fully captured.
#### Example of it used in the Working Context as DA/DS for a Business
A DA has joint PMF over (number of ad clicks X, number of conversions Y) per day. They compute $E[X \cdot Y]$ as part of deriving the covariance: $Cov(X,Y) = E[XY] - E[X]E[Y]$. This feeds into a cross-channel attribution model.
### The Formula (Fragment-First)
| Symbol | Meaning |
|--------|---------|
| $E[g(X,Y)]$ | Expected value of function g applied to the pair (X,Y) |
| $g(x,y)$ | The function whose expectation you want |
| $f(x,y)$ | Joint PMF |
| $\sum_x \sum_y$ | Double sum over all possible (x,y) pairs | Full formula: $E[g(X,Y)] = \sum_x \sum_y g(x,y) \cdot f(x,y)$ ### Formula-to-English Translation
"The expected value of a function g of two discrete variables equals the weighted average of g(x,y) over all possible (x,y) pairs, where each pair is weighted by its joint probability." ### Critical Concepts
- **Special case $g(x,y) = x$**: $E[X] = \sum_x \sum_y x \cdot f(x,y) = \sum_x x \cdot f_X(x)$ — recovers the marginal expectation.
- **Special case $g(x,y) = xy$**: $E[XY]$ is needed for covariance calculation.
- **Linearity**: $E[aX + bY + c] = aE[X] + bE[Y] + c$ — works regardless of dependence.
- **Independence simplification**: if independent, $E[XY] = E[X] \cdot E[Y]$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Joint PMF for (X = ad clicks, Y = conversions) per hour: | | Y=0 | Y=1 | Y=2 |
|---|---|---|---|
| X=0 | 0.20 | 0.05 | 0.00 |
| X=1 | 0.15 | 0.25 | 0.10 |
| X=2 | 0.05 | 0.10 | 0.10 | Compute $E[XY]$. *Step 1: Form g(x,y) = x*y for each pair*
$(0,0)\to0$, $(0,1)\to0$, $(0,2)\to0$, $(1,0)\to0$, $(1,1)\to1$, $(1,2)\to2$, $(2,0)\to0$, $(2,1)\to2$, $(2,2)\to4$ *Step 2: Multiply each g(x,y) by f(x,y)*
$0(0.20)+0(0.05)+0(0)$ $+0(0.15)+1(0.25)+2(0.10)$ $+0(0.05)+2(0.10)+4(0.10)$ *Step 3: Sum*
$E[XY] = 0 + 0.25 + 0.20 + 0 + 0.20 + 0.40 = 1.05$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # Joint PMF: rows = X (clicks 0,1,2), cols = Y (conversions 0,1,2)
joint_pmf = np.array([ [0.20, 0.05, 0.00], [0.15, 0.25, 0.10], [0.05, 0.10, 0.10],
]) x_values = np.array([0, 1, 2])
y_values = np.array([0, 1, 2]) # E[X*Y] using bivariate LOTUS
e_xy = 0.0
for i, x_val in enumerate(x_values): for j, y_val in enumerate(y_values): e_xy += x_val * y_val * joint_pmf[i, j] print(f"E[XY] = {e_xy:.4f}") # Numpy vectorised version
x_grid, y_grid = np.meshgrid(x_values, y_values, indexing='ij')
e_xy_vec = np.sum(x_grid * y_grid * joint_pmf)
print(f"E[XY] vectorised = {e_xy_vec:.4f}")
```
#### Beginner friendly Example [R])
``` r
joint_pmf <- matrix(c(0.20, 0.05, 0.00, 0.15, 0.25, 0.10, 0.05, 0.10, 0.10), nrow = 3, byrow = TRUE) x_values <- 0:2
y_values <- 0:2 # E[X*Y] via outer product and joint PMF
xy_matrix <- outer(x_values, y_values, FUN = "*")
e_xy <- sum(xy_matrix * joint_pmf)
cat("E[XY] =", e_xy, "\n") e_x <- sum(outer(x_values, y_values, FUN = function(x, y) x) * joint_pmf)
e_y <- sum(outer(x_values, y_values, FUN = function(x, y) y) * joint_pmf)
cat("Cov(X,Y) = E[XY] - E[X]*E[Y] =", e_xy - e_x * e_y, "\n")
```
#### Final Professional Example [Python])
``` python
from __future__ import annotations import numpy as np
from typing import Callable def bivariate_lotus_discrete( g: Callable[[float, float], float], joint_pmf: np.ndarray, x_values: np.ndarray, y_values: np.ndarray,
) -> float: # Bivariate LOTUS: E[g(X,Y)] = sum_x sum_y g(x,y) * f(x,y). total = 0.0 for i, x_val in enumerate(x_values): for j, y_val in enumerate(y_values): total += g(x_val, y_val) * joint_pmf[i, j] return total def compute_covariance_from_joint( joint_pmf: np.ndarray, x_values: np.ndarray, y_values: np.ndarray,
) -> float: # Cov(X,Y) = E[XY] - E[X]*E[Y] via joint PMF. e_xy = bivariate_lotus_discrete(lambda x, y: x * y, joint_pmf, x_values, y_values) e_x = bivariate_lotus_discrete(lambda x, y: x, joint_pmf, x_values, y_values) e_y = bivariate_lotus_discrete(lambda x, y: y, joint_pmf, x_values, y_values) return e_xy - e_x * e_y if __name__ == "__main__": joint = np.array([ [0.20, 0.05, 0.00], [0.15, 0.25, 0.10], [0.05, 0.10, 0.10], ]) x_vals = np.array([0.0, 1.0, 2.0]) y_vals = np.array([0.0, 1.0, 2.0]) e_xy = bivariate_lotus_discrete(lambda x, y: x * y, joint, x_vals, y_vals) cov_xy = compute_covariance_from_joint(joint, x_vals, y_vals) e_x_2y = bivariate_lotus_discrete(lambda x, y: x + 2 * y, joint, x_vals, y_vals) print(f"E[XY] = {e_xy:.4f}") print(f"Cov(X,Y) = {cov_xy:.4f}") print(f"E[X + 2Y] = {e_x_2y:.4f}")
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