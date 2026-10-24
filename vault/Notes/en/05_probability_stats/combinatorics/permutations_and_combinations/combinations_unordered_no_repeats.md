---
title: Combinations (Unordered, no repeats)
date: '2026-04-16'
wordCount: 395
slug: combinations_unordered_no_repeats
permalink: /notes/05_probability_stats/combinatorics/permutations_and_combinations/combinations_unordered_no_repeats/index.html
share_status: draft
publish_target: note
boundary: public
---
# $^nC_r = \binom{n}{r} = \frac{n!}{r!(n-r)!}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
$\binom{n}{r}$ counts the number of ways to choose $r$ items from $n$ distinct items when order does NOT matter. This is the most fundamental combinatorial formula in statistics and ML: it appears in binomial distributions, hypothesis testing (exact tests), feature subset enumeration, and bootstrap sampling counts.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["n distinct items, choose r, order irrelevant"] --> B["Start with P(n,r): ordered arrangements"] B --> C["Divide by r!: remove ordering of chosen items"] C --> D["C(n,r) = P(n,r) / r! = n! / (r!(n-r)!)"] D --> E["Symmetric: C(n,r) = C(n, n-r)"]
```
### Real-World use:
#### Situation it is used
Feature selection: how many ways to pick $k$ features from $p$ total? Bootstrap: how many unique samples of size $n$ from a dataset of $N$? Binomial probability: how many ways can exactly $k$ successes occur in $n$ trials?
#### Problem it solves
How many unordered subsets of size $r$ can I form from $n$ distinct elements?
#### How it solves the problem
Starts from ordered permutations $P(n,r)$ and divides by $r!$ to account for the fact that the $r!$ orderings of any chosen subset all represent the same unordered selection.
#### Example of it used in the Working Context as DA/DS for a Business
Feature selection exhaustive search: with 20 features, how many 5-feature subsets exist? $\binom{20}{5} = 15{,}504$. Feasible to search; $\binom{50}{10} = 10{,}272{,}278{,}170$ is not.
### The Formula (Fragment-First)
$\binom{n}{r} = \frac{n!}{r!(n-r)!}$
- $n$: pool size.
- $r$: subset size chosen.
- $r!$: ways to order the chosen $r$ items (we want to cancel these).
- $(n-r)!$: ways to order the unchosen items (we want to cancel these too).
### Formula-to-English Translation
"Choose $r$ from $n$: $n$ factorial divided by $r$ factorial times $(n-r)$ factorial." $\binom{5}{2} = 5!/(2! \cdot 3!) = 120/12 = 10$ ### Critical Concepts
- $\binom{n}{0} = 1$ and $\binom{n}{n} = 1$ (boundary cases relying on $0! = 1$).
- Symmetry: $\binom{n}{r} = \binom{n}{n-r}$ — choosing $r$ to include = choosing $n-r$ to exclude.
- Pascal's Rule: $\binom{n}{r} = \binom{n-1}{r-1} + \binom{n-1}{r}$ — basis of Pascal's triangle.
- Python: `math.comb(n, r)` (3.8+). R: `choose(n, r)`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: n=6, r=2*
Choose 2 features from 6 to include in a simple model. *Step 2: Apply formula*
$\binom{6}{2} = \frac{6!}{2! \cdot 4!} = \frac{720}{2 \cdot 24} = \frac{720}{48} = 15$ *Step 3: Interpretation*
15 distinct pairs of features to evaluate.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import math # Feature selection: how many 3-feature subsets from 10 features?
n_features = 10
subset_size = 3
num_subsets = math.comb(n_features, subset_size)
print(f"C({n_features}, {subset_size}) = {num_subsets:,}") # 120
```
#### Beginner friendly Example [R])
``` r
n_features <- 10
subset_size <- 3
num_subsets <- choose(n_features, subset_size)
cat(sprintf("C(%d, %d) = %d\n", n_features, subset_size, num_subsets)) # 120
```
#### Final Professional Example [Python])
``` python
import math
import numpy as np def feature_selection_feasibility( total_features: int, max_subset_size: int, feasibility_threshold: int = 1_000_000
) -> None: """Print feasibility table for exhaustive feature subset search. Args: total_features: Total number of available features (n). max_subset_size: Maximum subset size to evaluate (r). feasibility_threshold: Max C(n,r) considered feasible. """ print(f"Feasibility for n={total_features} features:") print(f"{'r':>5} {'C(n,r)':>20} {'log10 C(n,r)':>15} {'Feasible?':>12}") for r_size in range(1, max_subset_size + 1): c_n_r = math.comb(total_features, r_size) log10_val = math.log10(c_n_r) if c_n_r > 0 else 0 feasible = c_n_r <= feasibility_threshold print(f"{r_size:>5} {c_n_r:>20,} {log10_val:>15.2f} {str(feasible):>12}") feature_selection_feasibility(total_features=20, max_subset_size=10)
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
AIO pag 60