---
title: Countable Additivity (Disjoint sets Union Bound)
date: '2026-04-16'
wordCount: 401
slug: countable_additivity_disjoint_sets_union_bound
permalink: /notes/05_probability_stats/probability_theory/axioms_and_basic_probability/countable_additivity_disjoint_sets_union_bound/index.html
share_status: draft
publish_target: note
boundary: public
---
# $P(\bigcup_i A_i) \le \sum_i P(A_i)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the **union bound** (Boole's inequality). For any collection of events (not necessarily disjoint), the probability of their union is at most the sum of individual probabilities. It is an upper bound — equality holds when events are disjoint. Used as a fast, conservative bound in multiple hypothesis testing, machine learning generalization theory, and error analysis.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["n events: A1, A2, ..., An (possibly overlapping)"] --> B["P(A1 ∪ ... ∪ An) exact?"] B --> C["Hard to compute: needs inclusion-exclusion"] C --> D["Union bound: P(∪Ai) ≤ sum P(Ai)"] D --> E["Conservative but fast upper bound"] E --> F["Equality iff all Ai are disjoint"]
```
### Real-World use:
#### Situation it is used
Multiple testing: bounding the probability of at least one Type I error. PAC learning: bounding the generalization error over a hypothesis class. Reliability engineering: bounding system failure probability.
#### Problem it solves
When computing the exact union probability requires knowing all pairwise (and higher) intersections, the union bound provides a quick, conservative alternative.
#### How it solves the problem
Since double-counting can only increase a sum, $\sum_i P(A_i) \geq P(\bigcup_i A_i)$. It's tight when events are disjoint.
#### Example of it used in the Working Context as DA/DS for a Business
Bonferroni correction: running $m$ tests each at level $\alpha/m$ guarantees FWER $\leq \alpha$, derived directly from the union bound: $P(\geq 1 \text{ false positive}) \leq \sum_{i=1}^m \alpha/m = \alpha$.
### The Formula (Fragment-First)
$P(\bigcup_i A_i) \leq \sum_i P(A_i)$
- $\bigcup_i A_i$: union of all events.
- $\sum_i P(A_i)$: sum of individual probabilities (can exceed 1 for overlapping events).
- $\leq$: bound — not necessarily equality.
### Formula-to-English Translation
"The probability that at least one of a collection of events occurs is at most the sum of their individual probabilities." ### Critical Concepts
- The bound can be very loose: if $P(A_i) = 0.9$ for each of 10 events, the bound gives 9.0, but actual probability is at most 1.
- Tighter when events are rare and nearly disjoint.
- Bonferroni uses this: correct for $m$ comparisons by testing each at $\alpha/m$.
- Python: simply `sum(p_values) <= alpha` vs testing `min(p_values) <= alpha/m`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Define 3 events*
$P(A_1) = 0.05$, $P(A_2) = 0.04$, $P(A_3) = 0.03$. *Step 2: Union bound*
$P(A_1 \cup A_2 \cup A_3) \leq 0.05 + 0.04 + 0.03 = 0.12$ *Step 3: Interpret*
The actual probability is at most 12%, regardless of how events overlap.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Bonferroni correction via union bound
target_fwer = 0.05
p_values = [0.03, 0.01, 0.04, 0.002, 0.07]
n_tests = len(p_values) bonferroni_alpha = target_fwer / n_tests
significant = [p <= bonferroni_alpha for p in p_values]
print(f"Corrected threshold: {bonferroni_alpha:.4f}")
print(f"Significant tests: {significant}")
```
#### Beginner friendly Example [R])
``` r
target_fwer <- 0.05
p_values <- c(0.03, 0.01, 0.04, 0.002, 0.07)
bonferroni_alpha <- target_fwer / length(p_values)
significant <- p_values <= bonferroni_alpha
cat("Corrected threshold:", bonferroni_alpha, "\n")
cat("Significant:", significant, "\n")
```
#### Final Professional Example [Python])
``` python
import numpy as np
from scipy.stats import ttest_ind def bonferroni_test( p_values: np.ndarray, target_fwer: float = 0.05
) -> dict[str, np.ndarray | float]: """Apply Bonferroni correction using the union bound. Union bound: P(any H0 rejected | all H0 true) <= sum(alpha_i) = FWER target. Args: p_values: Array of p-values from multiple tests. target_fwer: Desired family-wise error rate. Returns: Dict with corrected threshold, rejected flags, and effective FWER bound. """ n_tests = len(p_values) corrected_alpha = target_fwer / n_tests rejected = p_values <= corrected_alpha fwer_bound = n_tests * corrected_alpha # = target_fwer by construction return { "corrected_alpha": corrected_alpha, "rejected": rejected, "fwer_bound": fwer_bound, "n_significant": int(np.sum(rejected)), } # Simulate feature significance testing
rng = np.random.default_rng(seed=42)
n_features = 20
p_vals = np.concatenate([ rng.uniform(0, 0.01, 3), # 3 truly significant rng.uniform(0.1, 1.0, 17) # 17 null
])
result = bonferroni_test(p_vals, target_fwer=0.05)
print(f"Corrected alpha: {result['corrected_alpha']:.4f}")
print(f"Significant features: {result['n_significant']}")
print(f"FWER bound: {result['fwer_bound']:.4f}")
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
MML2 pag 413