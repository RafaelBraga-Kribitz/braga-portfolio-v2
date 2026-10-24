---
title: Expected Value (Linearity)
date: '2026-04-16'
wordCount: 416
slug: expected_value_linearity
permalink: /notes/05_probability_stats/statistical_operations_and_random_variables/discrete_random_variables_drvs/expected_value_linearity/index.html
share_status: draft
publish_target: note
boundary: public
---
# $E[aX + b] = aE[X] + b$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The linearity of expectation: a linear transformation of a random variable shifts and scales the expected value in the same way. This is one of the most powerful properties of expectation — it holds even for dependent random variables, and it is the basis for computing expected values of sums without knowing the joint distribution.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["Random variable X with E[X]"] --> B["Linear transform: Y = aX + b"] B --> C["E[Y] = aE[X] + b"] C --> D["Extension: E[X1 + X2 + ...] = E[X1] + E[X2] + ..."] D --> E["No independence required for sums"]
```
### Real-World use:
#### Situation it is used
Any time you transform a random variable linearly: scaling revenue by a commission rate, shifting scores by a baseline, computing expected portfolio returns as a weighted sum of expected individual returns.
#### Problem it solves
Lets you compute $E[aX + b]$ without recomputing the full distribution from scratch — just transform the mean directly.
#### How it solves the problem
From the definition: $E[aX + b] = \sum_x (ax + b) P(X=x) = a\sum_x x P(X=x) + b\sum_x P(X=x) = aE[X] + b$.
#### Example of it used in the Working Context as DA/DS for a Business
Revenue share model: agent earns $20\%$ of each deal. $E[\text{agent revenue}] = 0.20 \times E[\text{deal size}] + 0$. If $E[\text{deal size}] = \$50{,}000$, agent expected earnings = $\$10{,}000$.
### The Formula (Fragment-First)
$E[aX + b] = aE[X] + b$
- $a$: scaling constant (multiplicative).
- $b$: shift constant (additive).
- Extends to sums: $E[X_1 + X_2 + \ldots + X_n] = E[X_1] + E[X_2] + \ldots + E[X_n]$ regardless of dependence.
### Formula-to-English Translation
"The expected value of a linear transformation $aX + b$ is $a$ times the expected value of $X$, plus $b$." ### Critical Concepts
- Holds for BOTH dependent and independent variables (unlike variance).
- Z-score transformation: $E[(X - \mu)/\sigma] = 0$ since $a = 1/\sigma$, $b = -\mu/\sigma$: $E[X/\sigma - \mu/\sigma] = E[X]/\sigma - \mu/\sigma = 0$.
- Bias-variance tradeoff uses this: bias = $E[\hat{f}(x)] - f(x)$.
- $E[\bar{X}] = \mu$: sample mean is unbiased (by linearity).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Known expectation*
Dice: $E[X] = 3.5$. *Step 2: Linear transform*
Revenue from bet: $Y = 2X - 3$ (win double value, minus entry fee of 3). *Step 3: Apply linearity*
$E[Y] = 2 \times E[X] - 3 = 2 \times 3.5 - 3 = 7 - 3 = 4$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy.stats import binom # Commission model: agent gets 20% of deal value, minus $500 overhead
n_deals = 10
p_close = 0.3
avg_deal_value = 5000
E_deals = n_deals * p_close # E[Binomial(10, 0.3)] = 3 a = avg_deal_value * 0.20 # commission rate
b = -500 # overhead cost
E_agent_revenue = a * E_deals + b
print(f"E[agent revenue] = ${E_agent_revenue:,.2f}") # $2,500
```
#### Beginner friendly Example [R])
``` r
n_deals <- 10; p_close <- 0.3; avg_deal <- 5000
e_deals <- n_deals * p_close # E[Binom(10, 0.3)] = 3
e_revenue <- (avg_deal * 0.20) * e_deals + (-500)
cat(sprintf("E[agent revenue] = $%,.2f\n", e_revenue))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from scipy.stats import binom, norm def portfolio_expected_return( asset_weights: np.ndarray, expected_returns: np.ndarray, risk_free_rate: float = 0.02
) -> dict[str, float]: """Compute expected portfolio return using linearity of expectation. E[portfolio] = sum_i(w_i * E[r_i]) = w^T * mu. Uses linearity: no independence assumption needed. Args: asset_weights: w_i, portfolio weights (sum to 1). expected_returns: E[r_i], expected return per asset. risk_free_rate: Risk-free rate for excess return. Returns: Dict with portfolio expected return and excess return. """ if abs(asset_weights.sum() - 1.0) > 1e-6: raise ValueError(f"Weights sum to {asset_weights.sum():.4f}, must equal 1") expected_portfolio = float(np.dot(asset_weights, expected_returns)) excess_return = expected_portfolio - risk_free_rate return { "expected_return": expected_portfolio, "excess_return": excess_return, "sharpe_numerator": excess_return, } # 4-asset portfolio
weights = np.array([0.40, 0.30, 0.20, 0.10])
expected_returns = np.array([0.12, 0.08, 0.15, 0.05])
result = portfolio_expected_return(weights, expected_returns)
print(f"E[portfolio return] = {result['expected_return']*100:.2f}%")
print(f"Excess return = {result['excess_return']*100:.2f}%")
for idx, (w, r) in enumerate(zip(weights, expected_returns)): print(f" Asset {idx+1}: weight={w:.0%}, E[r]={r:.0%}, contribution={w*r*100:.2f}%")
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