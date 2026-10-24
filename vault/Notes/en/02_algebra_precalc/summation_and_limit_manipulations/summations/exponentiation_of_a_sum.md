---
title: Exponentiation of a sum
date: '2026-04-16'
wordCount: 703
slug: exponentiation_of_a_sum
permalink: /notes/02_algebra_precalc/summation_and_limit_manipulations/summations/exponentiation_of_a_sum/index.html
share_status: draft
publish_target: note
boundary: public
---
# $c^{\left[ \sum_{n=s}^t f(n) \right]} = \prod_{n=s}^t c^{f(n)}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This rule converts a base raised to a **sum** of exponents into a **product** of that base raised to each individual term. It is the generalization of the basic exponent rule $c^{m+n} = c^m \cdot c^n$ to an arbitrary summation over $n$. In DA/DS, this shows up constantly when working with likelihoods, survival probabilities, and compound growth: the log-likelihood of independent observations is a sum of log-probabilities, and exponentiating it recovers the product of individual probabilities. Understanding this identity is what connects the sum-of-logs form (used for numerical stability) to the product form (the actual probability expression).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Start: c raised to a SUM of f(n) from n=s to t"] --> B["Expand the sum in the exponent: f(s) + f(s+1) + ... + f(t)"] B --> C["Apply c^(a+b) = c^a * c^b repeatedly"] C --> D["Result: product of c^f(n) for each n from s to t"] D --> E["Notation: PRODUCT symbol from n=s to t of c^f(n)"] E --> F["Key use: exponentiate a log-sum to get a probability product"]
```
### Real-World use:
#### Situation it is used
Log-likelihood computation in machine learning and statistics, compound survival probabilities in customer lifetime value models, computing joint probabilities of independent events, and converting between sum-of-logs (numerically stable) and product-of-probabilities (interpretable) representations.
#### Problem it solves
In ML, you compute the log-likelihood $\sum_{n=1}^{N} \log P(x_n \mid \theta)$ for numerical stability. But the actual likelihood is the product $\prod_{n=1}^{N} P(x_n \mid \theta)$. This identity is the bridge: $e^{\sum \log P_n} = \prod P_n$. The identity also explains why the geometric mean of rates equals the single compounded rate over $n$ periods.
#### How it solves the problem
From the basic exponent rule: $c^{a+b} = c^a \cdot c^b$. Apply this inductively to a sum of $k$ terms: $c^{f(s) + f(s+1) + \cdots + f(t)} = c^{f(s)} \cdot c^{f(s+1)} \cdots c^{f(t)} = \prod_{n=s}^{t} c^{f(n)}$. Each term in the sum becomes a factor in the product.
#### Example of it used in the Working Context as DA/DS for a Business
A user retention model gives daily survival rates: day 1 = 0.95, day 2 = 0.92, day 3 = 0.88. The log-survival scores are $\log(0.95) + \log(0.92) + \log(0.88) = -0.0513 - 0.0834 - 0.1278 = -0.2625$. Exponentiate: $e^{-0.2625} = 0.769$. This equals $0.95 \times 0.92 \times 0.88 = 0.769$. That is the identity: $e^{\sum \log r_n} = \prod r_n$.
### The Formula (Fragment-First)
- $c$: the base (any positive real, often $e$ in statistics)
- $\sum_{n=s}^{t} f(n)$: a sum of terms — this is the exponent
- $\prod_{n=s}^{t}$: the product operator — the capital-pi notation
- $c^{f(n)}$: the base raised to each individual term Full identity: $c^{\sum_{n=s}^{t} f(n)} = \prod_{n=s}^{t} c^{f(n)}$ Special case ($c = e$): $e^{\sum_{n=s}^{t} f(n)} = \prod_{n=s}^{t} e^{f(n)}$ — this is the log-to-probability bridge.
### Formula-to-English Translation
"A base raised to a sum of terms equals the product of that base raised to each individual term." $2^{(1 + 2 + 3)} = 2^6 = 64$. Also: $2^1 \times 2^2 \times 2^3 = 2 \times 4 \times 8 = 64$. Same result via the identity.
### Critical Concepts
- **This is just $c^{m+n} = c^m c^n$ scaled up.** The summation notation is not new math; it is the same rule applied $t - s$ times.
- **The $e$ case is the most common in DA/DS:** $e^{\sum \log p_i} = \prod p_i$. Log-sum to probability product.
- **Used for numerical stability:** products of small probabilities underflow to zero in floating point; summing their logs avoids this. The identity lets you interpret the result.
- **Requires $c > 0$.** The base must be positive for real-valued exponentiation across all $f(n)$.
- **Order of the product does not matter** (multiplication is commutative), so the product can be evaluated in any order.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Write out the sum in the exponent*
Let $c = 2$, $f(1) = 1$, $f(2) = 2$, $f(3) = 3$. Sum: $1 + 2 + 3 = 6$. Left side: $2^6 = 64$. *Step 2: Convert to product form using the identity*
Right side: $\prod_{n=1}^{3} 2^{f(n)} = 2^1 \cdot 2^2 \cdot 2^3 = 2 \cdot 4 \cdot 8 = 64$. *Step 3: Verify both sides are equal*
$64 = 64$. Confirmed. Now try the log version: $\log(0.8) + \log(0.9) = -0.2231 + (-0.1054) = -0.3285$. Exponentiate: $e^{-0.3285} = 0.72$. Check: $0.8 \times 0.9 = 0.72$. Confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import math
import numpy as np # Identity: c^(sum of f(n)) = product of c^f(n) # Example 1: integer powers
c = 2.0
f_values = [1.0, 2.0, 3.0] exponent_sum = sum(f_values)
left_side = c ** exponent_sum
right_side = math.prod(c ** f for f in f_values) print("Identity: c^(sum f(n)) = product of c^f(n)")
print(f"c = {c}, f(n) = {f_values}")
print(f"Sum of f(n) = {exponent_sum}")
print(f"Left side: c^{exponent_sum:.0f} = {left_side}")
print(f"Right side: product c^f(n) = {right_side}")
print(f"Equal: {math.isclose(left_side, right_side)}") # Example 2: log-sum to probability product (e as base)
print("\nLog-sum to probability product (base e):")
probs = [0.95, 0.92, 0.88]
log_sum = sum(math.log(p) for p in probs)
via_identity = math.exp(log_sum)
direct_product = math.prod(probs)
print(f"Probabilities: {probs}")
print(f"Sum of logs: {log_sum:.6f}")
print(f"exp(log_sum): {via_identity:.6f}")
print(f"Direct product: {direct_product:.6f}")
print(f"Match: {math.isclose(via_identity, direct_product)}")
```
#### Beginner friendly Example [R])
``` r
# Identity: c^(sum f(n)) = product of c^f(n) # Example 1: integer powers
c_base <- 2
f_values <- c(1, 2, 3) left_side <- c_base ^ sum(f_values)
right_side <- prod(c_base ^ f_values) cat(sprintf("c = %d, f(n) = %s\n", c_base, paste(f_values, collapse=", ")))
cat(sprintf("Left: c^%d = %.0f\n", sum(f_values), left_side))
cat(sprintf("Right: product c^f(n) = %.0f\n", right_side))
cat(sprintf("Equal: %s\n", isTRUE(all.equal(left_side, right_side)))) # Example 2: log-sum to probability product
probs <- c(0.95, 0.92, 0.88)
log_sum <- sum(log(probs))
via_id <- exp(log_sum)
direct_prod <- prod(probs) cat(sprintf("\nexp(sum of logs): %.6f\n", via_id))
cat(sprintf("Direct product: %.6f\n", direct_prod))
cat(sprintf("Match: %s\n", isTRUE(all.equal(via_id, direct_prod))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: user retention across multiple cohorts
# For each cohort, daily survival rates are given
# The identity converts the log-sum survival score back to the actual survival probability np.random.seed(42) cohorts = { "Cohort_Jan": [0.95, 0.92, 0.90, 0.88, 0.87], "Cohort_Feb": [0.97, 0.94, 0.91, 0.89, 0.85], "Cohort_Mar": [0.93, 0.91, 0.89, 0.86, 0.84],
} records = []
for cohort_name, daily_rates in cohorts.items(): # Log-sum: numerically stable computation log_sum_survival = sum(np.log(r) for r in daily_rates) # Via identity: exp(sum of logs) = product of rates survival_via_identity = np.exp(log_sum_survival) # Direct product (same result, but can underflow for many small probs) survival_direct = np.prod(daily_rates) records.append({ "cohort": cohort_name, "n_days": len(daily_rates), "log_sum_survival": round(log_sum_survival, 6), "survival_via_identity": round(survival_via_identity, 6), "survival_direct": round(survival_direct, 6), "match": np.isclose(survival_via_identity, survival_direct), }) df = pd.DataFrame(records)
print("Retention Survival: exp(sum log rates) = product(rates)")
print("Identity: c^(sum f(n)) = prod c^f(n), here c=e, f(n)=log(rate_n)")
print()
print(df.to_string(index=False))
print(f"\nAll identity checks passed: {df['match'].all()}")
```
#### Final Professional Example [R]
``` r
# exp(sum log rates) = product(rates) set.seed(42)
rates <- runif(5, 0.85, 0.99)
sum_log_rates <- sum(log(rates))
product_rates <- prod(rates)
exp_of_sum <- exp(sum_log_rates)
match <- isTRUE(all.equal(exp_of_sum, product_rates))
cat(sprintf("exp(sum(log(rates))) = %.6f product(rates) = %.6f Match: %s\n", exp_of_sum, product_rates, match))
```
---
AIO pag 44