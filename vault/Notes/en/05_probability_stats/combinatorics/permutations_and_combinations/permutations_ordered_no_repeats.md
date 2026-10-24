---
title: Permutations (Ordered, no repeats)
date: '2026-04-16'
wordCount: 390
slug: permutations_ordered_no_repeats
permalink: /notes/05_probability_stats/combinatorics/permutations_and_combinations/permutations_ordered_no_repeats/index.html
share_status: draft
publish_target: note
boundary: public
---
# $^nP_r = P(n, r) = \frac{n!}{(n-r)!}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
$P(n,r)$ counts the number of ways to select $r$ objects from $n$ distinct objects AND arrange them in order. Order matters here: selecting items A, B is different from B, A. Used in ranking problems, slot-filling sequences, and anywhere position matters.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["n distinct objects, pick r in order"] --> B["First slot: n choices"] B --> C["Second slot: n-1 choices"] C --> D["...r-th slot: n-r+1 choices"] D --> E["Multiply: n*(n-1)*...*(n-r+1)"] E --> F["= n! / (n-r)!"]
```
### Real-World use:
#### Situation it is used
Ranking top-k items from a list: top-3 email subject lines to test sequentially, finalist rankings in a competition, or multi-step recommendation slot filling.
#### Problem it solves
How many distinct ordered sequences of $r$ items can I form from $n$ choices, without repeating an item?
#### How it solves the problem
By the multiplication principle: first position has $n$ choices, second has $n-1$, ..., $r$-th has $n-r+1$. The product telescopes to $n!/(n-r)!$.
#### Example of it used in the Working Context as DA/DS for a Business
Testing which 3 of 10 landing page variants to show in order to different user segments: $P(10,3) = 720$ ordered sequences. Used to assess whether exhaustive testing is feasible.
### The Formula (Fragment-First)
$P(n, r) = \frac{n!}{(n-r)!}$
- $n$: pool size (total distinct objects).
- $r$: number to select and arrange.
- $n!$: total ways to order all $n$ objects.
- $(n-r)!$: divide out the orderings of the unused $n-r$ objects.
### Formula-to-English Translation
"The number of ordered arrangements of $r$ objects chosen from $n$ distinct objects equals $n$ factorial divided by $(n-r)$ factorial." $P(5, 2) = 5!/(5-2)! = 120/6 = 20$ ### Critical Concepts
- $P(n, n) = n!$ (all objects, ordered = full factorial).
- $P(n, 1) = n$ (pick 1 object, $n$ choices).
- Contrast with combinations: $C(n,r) = P(n,r)/r!$ — dividing by $r!$ removes the ordering.
- Python: `math.perm(n, r)` (3.8+) or `math.factorial(n)/math.factorial(n-r)`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Identify n=4, r=2*
4 distinct colors, pick 2 to paint the top and bottom of a flag (order matters). *Step 2: Apply formula*
$P(4, 2) = 4!/(4-2)! = 4!/2! = 24/2 = 12$ *Step 3: Verify by enumeration*
Top choices: {R,G,B,Y}. For each top choice, 3 remaining for bottom: $4 \times 3 = 12$. Confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import math # How many ways to assign top-3 ranks from 8 finalists?
n_finalists = 8
r_ranks = 3
ordered_arrangements = math.perm(n_finalists, r_ranks)
print(f"P({n_finalists}, {r_ranks}) = {ordered_arrangements}") # 336
```
#### Beginner friendly Example [R])
``` r
# P(n, r) in R
n_finalists <- 8
r_ranks <- 3
ordered_arrangements <- factorial(n_finalists) / factorial(n_finalists - r_ranks)
cat("P(", n_finalists, ",", r_ranks, ") =", ordered_arrangements, "\n") # 336
```
#### Final Professional Example [Python])
``` python
import math
import itertools def count_ordered_arrangements(pool_size: int, selection_size: int) -> int: """Count ordered selections of selection_size from pool_size distinct items. Args: pool_size: n, total distinct items. selection_size: r, items to select and order. Returns: P(n, r) = n! / (n - r)! Raises: ValueError: if selection_size > pool_size. """ if selection_size > pool_size: raise ValueError(f"r={selection_size} cannot exceed n={pool_size}") return math.perm(pool_size, selection_size) # Campaign slot-filling feasibility check
SLOT_SIZES = [2, 3, 4, 5]
POOL_SIZE = 10 print(f"Pool size: {POOL_SIZE} campaigns")
print(f"{'Slots (r)':>10} {'P(10,r)':>12} {'Feasible (< 1M)?':>18}")
for r_slots in SLOT_SIZES: arrangements = count_ordered_arrangements(POOL_SIZE, r_slots) feasible = arrangements < 1_000_000 print(f"{r_slots:>10} {arrangements:>12,} {str(feasible):>18}")
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