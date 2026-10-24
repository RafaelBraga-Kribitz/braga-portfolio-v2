---
title: Complementary Events
date: '2026-04-16'
wordCount: 397
slug: complementary_events
permalink: /notes/05_probability_stats/probability_theory/axioms_and_basic_probability/complementary_events/index.html
share_status: draft
publish_target: note
boundary: public
---
# $P(A^c) = 1 - P(A)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The complement of event $A$ is "everything except $A$." Since $A$ and $A^c$ together cover the entire sample space, their probabilities must sum to 1. This is one of the most-used probability identities in practice: it is often easier to compute $P(A^c)$ and subtract from 1 than to compute $P(A)$ directly.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["Event A occurs"] --> C["P(A) = p"] B["Event A does NOT occur (complement A^c)"] --> D["P(A^c) = 1 - p"] C --> E["P(A) + P(A^c) = 1"] D --> E
```
### Real-World use:
#### Situation it is used
"At least one" probability calculations: $P(\text{at least one success}) = 1 - P(\text{no successes})$. Also: $P(\text{churn}) = 1 - P(\text{retain})$, $P(\text{fraud detected}) = 1 - P(\text{missed})$.
#### Problem it solves
When computing $P(A)$ directly is complex (e.g., "at least one" requires summing many cases), computing $P(A^c)$ is often trivial.
#### How it solves the problem
Leverages $P(\Omega) = 1$ and the disjointness of $A$ and $A^c$: $P(A) + P(A^c) = 1$.
#### Example of it used in the Working Context as DA/DS for a Business
Probability that at least one of 10 email A/B tests detects a false positive (at $\alpha=0.05$ each) if all null hypotheses are true: $1 - (1-0.05)^{10} = 1 - 0.95^{10} \approx 0.401$. This motivates multiple testing corrections.
### The Formula (Fragment-First)
$P(A^c) = 1 - P(A)$
- $A^c$: complement of event $A$ (all outcomes NOT in $A$).
- $P(A)$: probability of event $A$.
- $1$: total probability from $P(\Omega) = 1$.
### Formula-to-English Translation
"The probability that $A$ does NOT occur equals 1 minus the probability that $A$ does occur." If $P(\text{churn}) = 0.15$, then $P(\text{retain}) = 1 - 0.15 = 0.85$.
### Critical Concepts
- Requires $A$ and $A^c$ to be exhaustive (cover all outcomes) and mutually exclusive.
- "At least one" trick: $P(\geq 1 \text{ success in } n) = 1 - (1-p)^n$.
- False discovery rate calculations depend on this.
- In code: `1 - p` — the complement is always this simple.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Known probability*
$P(\text{click}) = 0.03$ (3% CTR). *Step 2: Apply complement*
$P(\text{no click}) = 1 - P(\text{click}) = 1 - 0.03 = 0.97$ *Step 3: "At least one" extension*
$P(\text{at least one click in 5 impressions}) = 1 - 0.97^5 = 1 - 0.859 = 0.141$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Multiple testing: probability of at least one false positive
alpha = 0.05
n_tests = 10
p_at_least_one_fp = 1 - (1 - alpha) ** n_tests
print(f"P(>= 1 false positive in {n_tests} tests) = {p_at_least_one_fp:.3f}")
# 0.401 - motivates Bonferroni correction
```
#### Beginner friendly Example [R])
``` r
alpha <- 0.05
n_tests <- 10
p_at_least_one_fp <- 1 - (1 - alpha)^n_tests
cat(sprintf("P(>= 1 false positive in %d tests) = %.3f\n", n_tests, p_at_least_one_fp))
```
#### Final Professional Example [Python])
``` python
import numpy as np def family_wise_error_rate( per_test_alpha: float, n_tests: int
) -> float: """Compute FWER: P(at least one false positive) = 1 - (1 - alpha)^n. Uses complement rule: P(A^c) = 1 - P(A). Args: per_test_alpha: Type I error rate per individual test. n_tests: Number of independent tests performed. Returns: Family-wise error rate. """ return 1.0 - (1.0 - per_test_alpha) ** n_tests def bonferroni_correction(target_fwer: float, n_tests: int) -> float: """Return per-test alpha to achieve target FWER via Bonferroni.""" return target_fwer / n_tests # A/B testing multiple comparisons analysis
ALPHA = 0.05
test_counts = [1, 5, 10, 20, 50, 100]
print(f"Complement rule: FWER analysis at alpha={ALPHA}")
print(f"{'n_tests':>10} {'FWER':>12} {'Bonferroni alpha':>18}")
for n in test_counts: fwer = family_wise_error_rate(ALPHA, n) bonf_alpha = bonferroni_correction(ALPHA, n) print(f"{n:>10} {fwer:>12.4f} {bonf_alpha:>18.6f}")
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
AIO pag 84