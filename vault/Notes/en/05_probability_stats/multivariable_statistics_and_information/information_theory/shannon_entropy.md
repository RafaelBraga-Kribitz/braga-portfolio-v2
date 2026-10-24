---
title: Shannon Entropy
date: '2026-04-16'
wordCount: 596
slug: shannon_entropy
permalink: /notes/05_probability_stats/multivariable_statistics_and_information/information_theory/shannon_entropy/index.html
share_status: draft
publish_target: note
boundary: public
---
# $H(X) = - \sum_{x \in \mathcal{X}} p(x) \log_2 p(x)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Shannon entropy $H(X)$ measures the average amount of information (surprise or uncertainty) in a random variable X. Higher entropy = more uncertainty = more bits needed to encode the variable. Lower entropy = more predictable = fewer bits needed. In DA/DS it is the foundation for decision tree split criteria (information gain = entropy reduction), mutual information, feature selection, and the loss functions that power all of modern ML (cross-entropy loss is entropy-based).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Get probability distribution p(x) for all outcomes"] --> B["For each outcome x: compute p(x) * log2(p(x))"] B --> C["Sum all terms"] C --> D["Negate: H(X) = -sum(p * log2(p))"] D --> E{"H(X) near 0?"} E -->|"Yes"| F["Low entropy: outcome nearly certain"] E -->|"No"| G{"H(X) near log2(k)?"} G -->|"Yes"| H["Max entropy: all outcomes equally likely"] G -->|"No"| I["Intermediate uncertainty"]
```
### Real-World use:
#### Situation it is used
Decision tree algorithms (ID3, C4.5, CART) use information gain (entropy reduction from a split) to choose the best feature to split on. Feature selection pipelines use entropy to rank categorical features by their predictive uncertainty.
#### Problem it solves
You need a principled, quantitative measure of how uncertain or impure a set of outcomes is. Entropy provides this on an absolute scale (bits for $\log_2$, nats for $\ln$), enabling comparison across different distributions.
#### How it solves the problem
$-p(x) \log_2 p(x)$ is the self-information of outcome $x$ weighted by its probability. Summing these gives the expected (average) self-information across all outcomes — the entropy. A fair coin gives $H = 1$ bit; a certain coin gives $H = 0$ bits.
#### Example of it used in the Working Context as DA/DS for a Business
A DA building a decision tree to classify customers as churned/retained computes entropy for each candidate split feature. The feature that produces the largest entropy reduction (information gain) after the split is selected as the root node — maximising the predictive power of the first decision.
### The Formula (Fragment-First)
| Symbol | Meaning |
|--------|---------|
| $H(X)$ | Shannon entropy of random variable X |
| $\mathcal{X}$ | Set of all possible outcomes (support) |
| $p(x)$ | Probability of outcome $x$ |
| $\log_2 p(x)$ | Log base-2 of the probability (gives entropy in bits) |
| $-p(x) \log_2 p(x)$ | Contribution of outcome $x$ to entropy (always $\ge 0$) | Convention: $0 \cdot \log_2(0) \equiv 0$ (zero probability outcomes contribute zero entropy). Full formula: $H(X) = - \sum_{x \in \mathcal{X}} p(x) \log_2 p(x)$ ### Formula-to-English Translation
"Entropy is the expected number of bits needed to encode the outcome of X, averaged over all outcomes." It measures how spread out or concentrated the probability distribution is.
### Critical Concepts
- **Minimum**: $H(X) = 0$ when one outcome has probability 1 (certainty).
- **Maximum**: $H(X) = \log_2 k$ when all $k$ outcomes are equally likely (uniform distribution).
- **Base of log**: log base 2 gives bits; natural log gives nats; log base 10 gives hartleys.
- **Information gain**: $IG = H(\text{parent}) - \sum_j w_j H(\text{child}_j)$ for decision tree splits.
- **Relationship to cross-entropy**: $H(X) = H(p,p)$ (cross-entropy where both distributions are the same).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Fair 4-sided die: $p(1) = p(2) = p(3) = p(4) = 0.25$. *Step 1: Compute each term $p(x) \log_2 p(x)$*
$0.25 \times \log_2(0.25) = 0.25 \times (-2) = -0.5$ (same for all 4 faces) *Step 2: Sum*
$\sum = -0.5 \times 4 = -2.0$ *Step 3: Negate*
$H(X) = -(-2.0) = 2.0$ bits *Step 4: Interpret*
You need 2 bits on average to encode the outcome of a fair 4-sided die roll (makes sense: 2 bits can encode 4 states).
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy.stats import entropy as scipy_entropy # Distribution of customer churn classes
# Labels: [retained, churned], probabilities
probs = np.array([0.85, 0.15]) # Manual entropy (bits)
def shannon_entropy_bits(p: np.ndarray) -> float: p_nonzero = p[p > 0] return -np.sum(p_nonzero * np.log2(p_nonzero)) h_manual = shannon_entropy_bits(probs)
h_scipy = scipy_entropy(probs, base=2) # scipy uses natural log by default; base=2 for bits print(f"H(X) manual: {h_manual:.4f} bits")
print(f"H(X) scipy: {h_scipy:.4f} bits")
print(f"Max entropy for 2 classes: {np.log2(2):.4f} bits (uniform)")
```
#### Beginner friendly Example [R])
``` r
probs <- c(0.85, 0.15) # Shannon entropy in bits
shannon_entropy <- function(p_vec) { p_nonzero <- p_vec[p_vec > 0] -sum(p_nonzero * log2(p_nonzero))
} h_x <- shannon_entropy(probs)
cat("H(X):", round(h_x, 4), "bits\n")
cat("Max entropy (uniform over 2):", log2(2), "bits\n")
cat("Entropy as fraction of max:", round(h_x / log2(2), 4), "\n")
```
#### Final Professional Example [Python])
``` python
from __future__ import annotations import numpy as np
import pandas as pd def shannon_entropy(p: np.ndarray, base: float = 2.0) -> float: # Shannon entropy H(X) in bits (base=2) or nats (base=e). p_nonzero = p[p > 0] return float(-np.sum(p_nonzero * np.log(p_nonzero) / np.log(base))) def information_gain( parent_counts: np.ndarray, child_counts_list: list[np.ndarray],
) -> float: # Information gain = H(parent) - weighted average H(children). # Used by decision tree split selection. parent_probs = parent_counts / parent_counts.sum() parent_entropy = shannon_entropy(parent_probs) n_parent = parent_counts.sum() weighted_child_entropy = 0.0 for child_counts in child_counts_list: n_child = child_counts.sum() child_probs = child_counts / n_child weighted_child_entropy += (n_child / n_parent) * shannon_entropy(child_probs) return float(parent_entropy - weighted_child_entropy) def feature_entropy_ranking( df: pd.DataFrame, target_col: str, feature_cols: list[str]
) -> pd.DataFrame: # Rank features by information gain with respect to target. rows = [] target_counts = np.array(df[target_col].value_counts().values, dtype=float) for col in feature_cols: child_arrays = [ np.array(group[target_col].value_counts().values, dtype=float) for _, group in df.groupby(col) ] ig = information_gain(target_counts, child_arrays) rows.append({"feature": col, "information_gain_bits": round(ig, 6)}) return pd.DataFrame(rows).sort_values("information_gain_bits", ascending=False) if __name__ == "__main__": rng = np.random.default_rng(seed=42) n = 2_000 sample_df = pd.DataFrame({ "device": rng.choice(["mobile", "desktop"], size=n, p=[0.6, 0.4]), "time_of_day": rng.choice(["morning", "afternoon", "evening"], size=n), "churned": rng.choice(["yes", "no"], size=n, p=[0.25, 0.75]), }) # Induce correlation: desktop users churn less mask = (sample_df["device"] == "desktop") & (rng.random(n) < 0.15) sample_df.loc[mask, "churned"] = "no" print("Feature ranking by information gain for 'churned':") ranking = feature_entropy_ranking(sample_df, "churned", ["device", "time_of_day"]) print(ranking.to_string(index=False)) probs_uniform = np.array([0.25, 0.25, 0.25, 0.25]) probs_skewed = np.array([0.90, 0.05, 0.03, 0.02]) print(f"\nUniform (4 classes): H = {shannon_entropy(probs_uniform):.4f} bits") print(f"Skewed (4 classes): H = {shannon_entropy(probs_skewed):.4f} bits")
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