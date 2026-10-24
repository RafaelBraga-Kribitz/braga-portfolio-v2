---
title: Selection of at least one object (from $n$ distinct)
date: '2026-04-16'
wordCount: 405
slug: selection_of_at_least_one_object_from_n_distinct
permalink: /notes/05_probability_stats/combinatorics/permutations_and_combinations/selection_of_at_least_one_object_from_n_distinct/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\sum_{k=1}^n \binom{n}{k} = 2^n - 1$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This formula counts the number of non-empty subsets of an $n$-element set. It comes from the binomial theorem applied to $(1+1)^n = 2^n = \sum_{k=0}^n \binom{n}{k}$, then subtracting 1 for the empty set. Used to count feature subset spaces, power sets, and any enumeration requiring "at least one" selection.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["n distinct objects"] --> B["All possible subsets: 2^n (power set)"] B --> C["Subtract the empty set: -1"] C --> D["Non-empty subsets: 2^n - 1"] D --> E["Equivalently: sum C(n,k) for k=1 to n"]
```
### Real-World use:
#### Situation it is used
Counting the total number of non-empty feature combinations, determining the size of a feature search space, computing the number of possible rule antecedents in association rule mining, or total non-trivial hypothesis tests in multi-comparison.
#### Problem it solves
How many distinct non-empty groups can I form from $n$ items? Used when you need "at least one" of the items selected.
#### How it solves the problem
The full power set of $n$ items has $2^n$ subsets (each item either in or out: 2 choices each, multiplied $n$ times). Subtracting 1 removes the empty subset.
#### Example of it used in the Working Context as DA/DS for a Business
Association rule mining on 20 product categories: total non-empty antecedent subsets = $2^{20} - 1 = 1{,}048{,}575$. This informs the computational budget and whether pruning (Apriori) is necessary.
### The Formula (Fragment-First)
$\sum_{k=1}^n \binom{n}{k} = 2^n - 1$
- $\binom{n}{k}$: number of size-$k$ subsets.
- Sum from $k=1$ to $n$: all non-empty subset sizes.
- $2^n$: total power set size (from binomial theorem with $x=1$).
- $-1$: removes the empty subset ($k=0$ term).
### Formula-to-English Translation
"The total number of ways to select at least one object from $n$ distinct objects is $2^n - 1$." For $n=3$: $2^3 - 1 = 7$ non-empty subsets: {A}, {B}, {C}, {A,B}, {A,C}, {B,C}, {A,B,C}.
### Critical Concepts
- Grows exponentially: $n=20$ gives $\approx 10^6$; $n=40$ gives $\approx 10^{12}$.
- This is why exhaustive feature search is intractable for large $n$.
- Binomial theorem connection: $(1+1)^n = \sum_k \binom{n}{k}$.
- In code: `2**n - 1` in Python. For sets: `len(list(itertools.chain.from_iterable(itertools.combinations(items, r) for r in range(1, len(items)+1))))`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: n=4 features* *Step 2: Apply formula*
$2^4 - 1 = 16 - 1 = 15$ non-empty subsets. *Step 3: Verify*
Size-1: 4 subsets. Size-2: $\binom{4}{2}=6$. Size-3: $\binom{4}{3}=4$. Size-4: 1. Total: $4+6+4+1=15$. Confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Total non-empty feature subsets for different n
for n_features in [5, 10, 15, 20, 30]: total = 2**n_features - 1 print(f"n={n_features:>3}: {total:>15,} subsets")
```
#### Beginner friendly Example [R])
``` r
for (n_features in c(5, 10, 15, 20, 30)) { total <- 2^n_features - 1 cat(sprintf("n=%3d: %15s subsets\n", n_features, format(total, big.mark=",")))
}
```
#### Final Professional Example [Python])
``` python
import math
import itertools def nonempty_subset_count(n_items: int) -> int: """Count all non-empty subsets of an n-element set. Args: n_items: Number of distinct items (n). Returns: 2^n - 1 non-empty subsets. """ return (1 << n_items) - 1 # bit-shift: 2^n - 1 def feature_search_space_analysis( n_features: int, max_subset_size: int | None = None
) -> dict[str, int | float]: """Analyze feature subset search space size. Args: n_features: Total features available. max_subset_size: Optional cap on subset size (None = all sizes). Returns: Dict with total count and log10 of count. """ if max_subset_size is None: count = nonempty_subset_count(n_features) else: count = sum(math.comb(n_features, k) for k in range(1, max_subset_size + 1)) return {"count": count, "log10": math.log10(count) if count > 0 else 0} # Association rule mining feasibility
FEATURE_COUNTS = [10, 15, 20, 25, 30]
print(f"{'n':>5} {'All subsets':>20} {'log10':>8} {'Feasible?':>10}")
for n_feat in FEATURE_COUNTS: result = feature_search_space_analysis(n_feat) feasible = result["count"] < 1_000_000 print(f"{n_feat:>5} {result['count']:>20,} {result['log10']:>8.1f} {str(feasible):>10}")
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
MFB pag 423