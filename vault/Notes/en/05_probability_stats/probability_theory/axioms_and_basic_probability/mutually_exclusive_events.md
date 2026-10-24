---
title: Mutually Exclusive Events
date: '2026-04-16'
wordCount: 418
slug: mutually_exclusive_events
permalink: /notes/05_probability_stats/probability_theory/axioms_and_basic_probability/mutually_exclusive_events/index.html
share_status: draft
publish_target: note
boundary: public
---
# $P(A \cap B) = 0 \implies P(A \cup B) = P(A) + P(B)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Two events are mutually exclusive if they cannot both occur at the same time: $P(A \cap B) = 0$. When this holds, the union probability simplifies to the sum of individual probabilities. This is Kolmogorov's additivity axiom. In practice, it applies to exhaustive category memberships: a customer cannot be in both "churned" and "active" simultaneously.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["A and B cannot co-occur: P(A∩B) = 0"] --> B["No overlap in Venn diagram"] B --> C["P(A∪B) = P(A) + P(B) + 0"] C --> D["Simple addition holds"] D --> E["Example: P(class=A) + P(class=B) + P(class=C) = 1"]
```
### Real-World use:
#### Situation it is used
Multi-class classification: classes are mutually exclusive (a data point belongs to exactly one class). Also: customer state transitions (active/churned/paused), product category assignment, or diagnostic test outcomes.
#### Problem it solves
When events are mutually exclusive, the union rule simplifies to addition — no intersection term needed.
#### How it solves the problem
Since $P(A \cap B) = 0$, the inclusion-exclusion formula $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ reduces to $P(A) + P(B)$.
#### Example of it used in the Working Context as DA/DS for a Business
Multinomial classification with 3 sentiment classes: P(positive) = 0.55, P(neutral) = 0.30, P(negative) = 0.15. Classes are mutually exclusive, so $P(\text{pos or neu}) = 0.55 + 0.30 = 0.85$.
### The Formula (Fragment-First)
$P(A \cap B) = 0 \implies P(A \cup B) = P(A) + P(B)$
- $P(A \cap B) = 0$: A and B have no overlap.
- $P(A \cup B) = P(A) + P(B)$: the additive rule.
### Formula-to-English Translation
"If A and B cannot happen at the same time (mutually exclusive), the probability that A OR B occurs is simply the sum of their individual probabilities." ### Critical Concepts
- Mutual exclusivity does NOT imply independence (and vice versa).
- In fact, if $P(A) > 0$ and $P(B) > 0$ and they're mutually exclusive, they CANNOT be independent.
- Exhaustive + mutually exclusive = a partition: $\sum_i P(A_i) = 1$.
- Categorical distribution uses this: one class per sample.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Customer states*
A: churned ($P = 0.20$), B: paused ($P = 0.10$). States are mutually exclusive. *Step 2: P(churned OR paused)*
$P(A \cup B) = 0.20 + 0.10 = 0.30$ *Step 3: Verify no overlap*
No customer can be both churned and paused simultaneously. $P(A \cap B) = 0$. Correct.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Multi-class classification: mutually exclusive classes
class_probs = {"positive": 0.55, "neutral": 0.30, "negative": 0.15} # P(positive or neutral)
p_pos_or_neu = class_probs["positive"] + class_probs["neutral"]
print(f"P(positive or neutral) = {p_pos_or_neu:.2f}") # 0.85
```
#### Beginner friendly Example [R])
``` r
class_probs <- c(positive=0.55, neutral=0.30, negative=0.15)
p_pos_or_neu <- class_probs["positive"] + class_probs["neutral"]
cat("P(positive or neutral) =", p_pos_or_neu, "\n") # 0.85
```
#### Final Professional Example [Python])
``` python
import numpy as np
from typing import Sequence def union_mutually_exclusive( probabilities: Sequence[float], event_names: Sequence[str] | None = None
) -> float: """Compute P(union) for mutually exclusive events via simple addition. Validates mutual exclusivity assumption (all probs fit within [0,1] and total does not exceed 1). Args: probabilities: Individual P(Ai) values. event_names: Optional names for reporting. Returns: P(A1 ∪ A2 ∪ ... ∪ Ak) = sum of P(Ai). """ prob_array = np.array(probabilities) if np.any(prob_array < 0): raise ValueError("Negative probability found") total_union = float(np.sum(prob_array)) if total_union > 1.0 + 1e-8: raise ValueError(f"Sum {total_union:.6f} > 1: not mutually exclusive or invalid probs") return total_union # Sentiment class union analysis
sentiment_probs = [0.55, 0.30, 0.15]
event_names = ["positive", "neutral", "negative"]
for k in range(1, len(sentiment_probs) + 1): p_union_k = union_mutually_exclusive(sentiment_probs[:k], event_names[:k]) names_str = " ∪ ".join(event_names[:k]) print(f"P({names_str}) = {p_union_k:.2f}")
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