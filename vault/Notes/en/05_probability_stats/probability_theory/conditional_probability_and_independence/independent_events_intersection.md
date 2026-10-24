---
title: Independent Events (Intersection)
date: '2026-04-16'
wordCount: 380
slug: independent_events_intersection
permalink: /notes/05_probability_stats/probability_theory/conditional_probability_and_independence/independent_events_intersection/index.html
share_status: draft
publish_target: note
boundary: public
---
# $P(A \cap B) = P(A) \cdot P(B)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Two events $A$ and $B$ are statistically independent if knowing that one occurred gives no information about whether the other occurred. The joint probability then equals the product of marginals. This is the independence assumption underlying Naive Bayes, many ML model assumptions, i.i.d. sampling, and bootstrap validity.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["A and B are independent"] --> B["P(A|B) = P(A)"] B --> C["P(A∩B) = P(A|B) * P(B)"] C --> D["= P(A) * P(B)"] D --> E["Joint = product of marginals"]
```
### Real-World use:
#### Situation it is used
Naive Bayes classifier (assumes feature independence given class). Bootstrap sampling (draws assumed i.i.d.). Multi-armed bandit (arm outcomes independent). Cross-validation fold splits.
#### Problem it solves
Under independence, joint probabilities factorize — enabling tractable computation of high-dimensional joint distributions.
#### How it solves the problem
If $A$ and $B$ are independent, $P(A \mid B) = P(A)$ by definition. Substituting into the chain rule: $P(A \cap B) = P(A) \cdot P(B)$.
#### Example of it used in the Working Context as DA/DS for a Business
Naive Bayes spam filter: $P(\text{spam} \mid w_1, \ldots, w_n) \propto P(\text{spam}) \prod_i P(w_i \mid \text{spam})$. This product form works because features are assumed conditionally independent given class.
### The Formula (Fragment-First)
$P(A \cap B) = P(A) \cdot P(B)$
- Applies ONLY when $A$ and $B$ are independent.
- If not independent: $P(A \cap B) = P(A \mid B) P(B) \neq P(A)P(B)$ in general.
### Formula-to-English Translation
"If A and B are independent, the probability of both occurring equals the product of their individual probabilities." ### Critical Concepts
- Independence is symmetric: $A \perp B \iff B \perp A$.
- Pairwise independence does not imply mutual independence.
- Testing independence: check if $P(A \cap B) \approx P(A) \cdot P(B)$ from data.
- Conditional independence: $A \perp B \mid C$ means $P(A \cap B \mid C) = P(A \mid C)P(B \mid C)$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Two independent coins*
$P(H_1) = 0.5$, $P(H_2) = 0.5$. Tosses are independent. *Step 2: Joint*
$P(H_1 \cap H_2) = 0.5 \times 0.5 = 0.25$ *Step 3: Verify with complement*
$P(\text{at least one head}) = 1 - P(T_1 \cap T_2) = 1 - 0.25 = 0.75$. Consistent.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Independence check: are two features independent?
import numpy as np
rng = np.random.default_rng(seed=42)
n = 10000
# Simulate independent binary features
feat_a = rng.binomial(1, 0.4, n)
feat_b = rng.binomial(1, 0.6, n) p_a = feat_a.mean()
p_b = feat_b.mean()
p_ab = (feat_a & feat_b).mean()
p_ab_if_independent = p_a * p_b
print(f"P(A): {p_a:.3f}, P(B): {p_b:.3f}")
print(f"P(A∩B) observed: {p_ab:.4f}")
print(f"P(A)*P(B) expected: {p_ab_if_independent:.4f}")
print(f"Independent: {abs(p_ab - p_ab_if_independent) < 0.01}")
```
#### Beginner friendly Example [R])
``` r
set.seed(42)
n <- 10000
feat_a <- rbinom(n, 1, 0.4)
feat_b <- rbinom(n, 1, 0.6)
p_ab_obs <- mean(feat_a & feat_b)
p_ab_exp <- mean(feat_a) * mean(feat_b)
cat("P(A∩B) observed:", round(p_ab_obs, 4), "\n")
cat("P(A)*P(B) expected:", round(p_ab_exp, 4), "\n")
```
#### Final Professional Example [Python])
``` python
import numpy as np
from scipy.stats import chi2_contingency def test_independence( feature_a: np.ndarray, feature_b: np.ndarray, significance_level: float = 0.05
) -> dict[str, float | bool]: """Test statistical independence of two binary features. Uses chi-square test of independence on contingency table. Args: feature_a: Binary array for feature A. feature_b: Binary array for feature B. significance_level: Alpha for rejection. Returns: Dict with chi2 statistic, p-value, and independence verdict. """ contingency_table = np.array([ [(~feature_a.astype(bool) & ~feature_b.astype(bool)).sum(), (~feature_a.astype(bool) & feature_b.astype(bool)).sum()], [( feature_a.astype(bool) & ~feature_b.astype(bool)).sum(), ( feature_a.astype(bool) & feature_b.astype(bool)).sum()], ]) chi2, p_value, dof, expected = chi2_contingency(contingency_table) return { "chi2": chi2, "p_value": p_value, "independent": p_value > significance_level, "p_a_times_p_b": feature_a.mean() * feature_b.mean(), "p_a_and_b": (feature_a.astype(bool) & feature_b.astype(bool)).mean(), } # Test feature independence in a dataset
rng = np.random.default_rng(seed=42)
n_samples = 5_000
independent_result = test_independence( rng.binomial(1, 0.4, n_samples), rng.binomial(1, 0.6, n_samples)
)
print("Independent features test:", independent_result)
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