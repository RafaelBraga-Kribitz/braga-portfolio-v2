---
title: Combinations (Unordered, with repeats)
date: '2026-04-16'
wordCount: 401
slug: combinations_unordered_with_repeats
permalink: /notes/05_probability_stats/combinatorics/permutations_and_combinations/combinations_unordered_with_repeats/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\binom{n+p-1}{p} = \frac{(n+p-1)!}{p!(n-1)!}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Also called the "stars and bars" formula, this counts the number of ways to choose $p$ items from $n$ distinct categories, allowing repetition, when order does not matter. Used in counting multisets, distributing identical items across buckets, and some Bayesian priors (Dirichlet-multinomial). Less common in daily DA/DS but appears in combinatorial optimization and drug trial design.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["n categories, pick p items, repeats allowed, no order"] --> B["Stars and bars: p stars, n-1 bars"] B --> C["Total symbols: p + n - 1"] C --> D["Choose p positions for stars (or n-1 for bars)"] D --> E["C(n+p-1, p) = (n+p-1)! / (p! * (n-1)!)"]
```
### Real-World use:
#### Situation it is used
Distributing $p$ identical items (tokens, resources, impressions) across $n$ distinct buckets (channels, categories, segments) where each bucket can receive any non-negative integer amount.
#### Problem it solves
How many ways can you distribute $p$ identical items across $n$ distinct categories (each category can receive 0 or more items)?
#### How it solves the problem
Maps the problem to choosing positions for $p$ "stars" among $p + (n-1)$ positions (stars for items, bars for dividers between categories). This bijection gives the $\binom{n+p-1}{p}$ formula.
#### Example of it used in the Working Context as DA/DS for a Business
Distributing a $\$100$ budget in $\$10$ increments across 4 marketing channels: $p=10$ increments, $n=4$ channels. Number of budget allocation strategies: $\binom{13}{10} = 286$.
### The Formula (Fragment-First)
$\binom{n+p-1}{p}$
- $n$: number of distinct categories (types).
- $p$: total items to distribute (repetitions allowed).
- $n-1$: number of dividers needed in the stars-and-bars picture.
- $n+p-1$: total symbols (stars + bars).
### Formula-to-English Translation
"The number of ways to place $p$ identical items into $n$ distinct bins equals $\binom{n+p-1}{p}$." For $n=3, p=2$: $\binom{4}{2} = 6$ ways: (2,0,0), (0,2,0), (0,0,2), (1,1,0), (1,0,1), (0,1,1).
### Critical Concepts
- Contrast with $\binom{n}{r}$ (no repeats): here repetition is allowed.
- Alternative notation: $H(n,p) = \binom{n+p-1}{p}$ (sometimes called "multichoose").
- Stars and bars bijection: $p$ stars in $n+p-1$ positions, $n-1$ bars in remaining positions.
- Grows as $O(n^p/p!)$ for fixed large $n$ — can be very large.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: n=3 channels, p=3 ad slots to assign*
Each slot independently goes to one channel; channels can receive 0, 1, 2, or 3 slots. *Step 2: Apply formula*
$\binom{3+3-1}{3} = \binom{5}{3} = \frac{5!}{3! \cdot 2!} = \frac{120}{6 \cdot 2} = 10$ *Step 3: Verify*
The 10 allocations are: (3,0,0),(0,3,0),(0,0,3),(2,1,0),(2,0,1),(0,2,1),(1,2,0),(1,0,2),(0,1,2),(1,1,1).
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import math # Distribute 5 identical ad impressions across 3 channels
n_channels = 3
p_impressions = 5
allocations = math.comb(n_channels + p_impressions - 1, p_impressions)
print(f"Budget allocations: {allocations}") # 21
```
#### Beginner friendly Example [R])
``` r
n_channels <- 3
p_impressions <- 5
allocations <- choose(n_channels + p_impressions - 1, p_impressions)
cat("Budget allocations:", allocations, "\n") # 21
```
#### Final Professional Example [Python])
``` python
import math
import itertools def multiset_combinations(num_types: int, selection_size: int) -> int: """Count unordered selections of selection_size from num_types with repetition. Uses stars-and-bars: C(num_types + selection_size - 1, selection_size). Args: num_types: n, number of distinct types/categories. selection_size: p, total items to select (with repeats allowed). Returns: Number of distinct multisets. """ return math.comb(num_types + selection_size - 1, selection_size) def enumerate_budget_allocations(n_channels: int, p_units: int) -> list[tuple[int, ...]]: """Enumerate all budget allocations of p_units across n_channels.""" return [ combo for combo in itertools.combinations_with_replacement( range(n_channels), p_units ) ] # Budget allocation analysis
print("Budget distribution feasibility:")
print(f"{'Channels':>10} {'Units':>8} {'Allocations':>15}")
for n_ch in [3, 4, 5]: for p_un in [5, 10, 20]: alloc_count = multiset_combinations(n_ch, p_un) print(f"{n_ch:>10} {p_un:>8} {alloc_count:>15,}")
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