---
title: Law of Total Probability
date: '2026-04-16'
wordCount: 412
slug: law_of_total_probability
permalink: /notes/05_probability_stats/probability_theory/total_probability_and_bayes_theorem/law_of_total_probability/index.html
share_status: draft
publish_target: note
boundary: public
---
# $P(A) = \sum_{i=1}^m P(A \cap B_i) = \sum_{i=1}^m P(A \mid B_i)P(B_i)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
When you can't compute $P(A)$ directly but you know $P(A)$ conditioned on each element of a partition $\{B_1, \ldots, B_m\}$ of the sample space, the Law of Total Probability lets you recover $P(A)$ by weighting each conditional by the prior probability of each partition element. This is the foundation for Bayes' theorem and the denominator "evidence" term $P(B)$ in Bayesian updating.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["Partition: B1, B2, ..., Bm (exhaustive, disjoint)"] --> B["Event A can happen via any Bi"] B --> C["P(A ∩ Bi) = P(A|Bi) * P(Bi)"] C --> D["Sum over all i: P(A) = Σ P(A|Bi)*P(Bi)"] D --> E["Marginalizes out the nuisance partition"]
```
### Real-World use:
#### Situation it is used
Computing overall conversion rate from segment-specific rates. Marginalizing over latent variables in EM algorithm. Computing the "evidence" $P(B)$ denominator in Bayes' theorem. Risk calculation across subpopulations.
#### Problem it solves
How do I compute $P(A)$ when I only have conditional probabilities $P(A \mid B_i)$ and marginal priors $P(B_i)$?
#### How it solves the problem
Uses the partition of the sample space: $A = \bigcup_i (A \cap B_i)$, and since $B_i$ are disjoint, $P(A) = \sum_i P(A \cap B_i) = \sum_i P(A \mid B_i) P(B_i)$.
#### Example of it used in the Working Context as DA/DS for a Business
Overall CTR from segments: $P(\text{click}) = P(\text{click} \mid \text{mobile}) P(\text{mobile}) + P(\text{click} \mid \text{desktop}) P(\text{desktop}) = 0.06 \times 0.60 + 0.03 \times 0.40 = 0.048$.
### The Formula (Fragment-First)
$P(A) = \sum_{i=1}^m P(A \mid B_i) P(B_i)$
- $B_i$: partition elements (mutually exclusive, exhaustive).
- $P(A \mid B_i)$: conditional probability of $A$ given $B_i$.
- $P(B_i)$: prior probability (weight) of each partition element.
- Sum: weighted average of conditional probabilities.
### Formula-to-English Translation
"The overall probability of A equals the weighted average of its conditional probabilities across all partition elements, weighted by the partition priors." ### Critical Concepts
- Requires $B_i$ to be a valid partition: disjoint AND exhaustive.
- This is the "marginalization" operation in probability.
- In matrix form: $P(A) = \mathbf{P}(A \mid \mathbf{B}) \cdot \mathbf{P}(\mathbf{B})$ (dot product).
- The EM algorithm's E-step essentially applies this to compute expected log-likelihoods.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Segments and conditional rates*
Mobile: 60% of users, CTR=6%. Desktop: 40%, CTR=3%. *Step 2: Apply formula*
$P(\text{click}) = 0.06 \times 0.60 + 0.03 \times 0.40 = 0.036 + 0.012 = 0.048$ *Step 3: Interpret*
Overall CTR is 4.8%, a weighted average of segment CTRs.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # Compute overall conversion rate via total probability
segment_probs = np.array([0.60, 0.40]) # P(B_i)
conditional_ctrs = np.array([0.06, 0.03]) # P(click | B_i) overall_ctr = np.dot(conditional_ctrs, segment_probs)
print(f"Overall CTR: {overall_ctr:.4f} ({overall_ctr*100:.2f}%)")
```
#### Beginner friendly Example [R])
``` r
segment_probs <- c(0.60, 0.40)
conditional_ctrs <- c(0.06, 0.03)
overall_ctr <- sum(conditional_ctrs * segment_probs)
cat(sprintf("Overall CTR: %.4f (%.2f%%)\n", overall_ctr, overall_ctr * 100))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from dataclasses import dataclass @dataclass
class Segment: """A population segment with its prior and conditional rate.""" name: str prior: float # P(B_i) conditional_rate: float # P(A | B_i) def total_probability(segments: list[Segment]) -> float: """Compute P(A) via law of total probability. P(A) = sum_i P(A|B_i) * P(B_i). Args: segments: List of Segment objects with prior and conditional_rate. Returns: Marginal probability P(A). Raises: ValueError: If priors do not sum to 1. """ prior_sum = sum(s.prior for s in segments) if abs(prior_sum - 1.0) > 1e-6: raise ValueError(f"Priors sum to {prior_sum:.6f}, must equal 1.0") return sum(s.prior * s.conditional_rate for s in segments) # Marketing channel analysis
channel_segments = [ Segment("mobile_young", prior=0.30, conditional_rate=0.08), Segment("mobile_older", prior=0.20, conditional_rate=0.05), Segment("desktop_young", prior=0.25, conditional_rate=0.04), Segment("desktop_older", prior=0.25, conditional_rate=0.02),
]
overall = total_probability(channel_segments)
print(f"Overall conversion rate: {overall:.4f} ({overall*100:.2f}%)")
for seg in channel_segments: contribution = seg.prior * seg.conditional_rate print(f" {seg.name:<20}: contribution = {contribution:.4f}")
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
1300 pag 329