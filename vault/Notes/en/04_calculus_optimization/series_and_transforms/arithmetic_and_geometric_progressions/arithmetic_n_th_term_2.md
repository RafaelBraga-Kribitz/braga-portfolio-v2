---
title: Arithmetic $n$-th term
date: '2026-04-16'
wordCount: 450
slug: arithmetic_n_th_term_2
permalink: /notes/04_calculus_optimization/series_and_transforms/arithmetic_and_geometric_progressions/arithmetic_n_th_term_2/index.html
share_status: draft
publish_target: note
boundary: public
---
# $u_n = a + (n-1)d$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
An arithmetic sequence has a constant difference $d$ between consecutive terms. The formula $u_n = a + (n-1)d$ gives the $n$-th term in $O(1)$ time from $a$, $d$, and $n$. In DA/DS: `np.linspace` and `np.arange` produce arithmetic sequences; straight-line depreciation models a linear decrease; cohort analysis uses weekly/monthly arithmetic offsets; histogram bin edges are arithmetic sequences. Plotting $u_n$ vs. $n$ gives a straight line with slope $d$ — it is the discrete analogue of $f(x) = a + dx$.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Given: first term a, common difference d, position n"] --> B["u_n = a + (n-1)*d"] B --> C["n=1: u_1 = a"] B --> D["n=2: u_2 = a + d"] B --> E["n=k: u_k = a + (k-1)*d"] A --> F["Find d from two known terms: d = (u_n - u_m) / (n - m)"] A --> G["Find n from u_n: n = (u_n - a)/d + 1"]
```
### Real-World use:
#### Situation it is used
Equally spaced time indices; straight-line depreciation; linearly spaced feature bins; cohort offsets (weeks 1, 8, 15, ...); uniform sampling grids; constant-rate growth/decline models.
#### Problem it solves
Jump directly to the $n$-th value in a linearly growing/declining sequence without iterating all prior terms.
#### How it solves the problem
Start at $a$, add $d$ exactly $(n-1)$ times: $u_n = a + (n-1)d$.
#### Example of it used in the Working Context as DA/DS for a Business
Straight-line depreciation: asset purchased for EUR 50,000 ($a = 50{,}000$, $d = -5{,}000$/yr). Book value in year $n$: $u_n = 55{,}000 - 5{,}000n$. At year 10: $u_{10} = 5{,}000$ (salvage value).
### The Formula (Fragment-First)
$$u_n = a + (n-1)d$$ Each symbol:
- $u_n$: the $n$-th term
- $a$: the first term ($u_1$)
- $n$: position in sequence ($n \geq 1$, 1-based)
- $d$: common difference; $d = u_{k+1} - u_k$ for any $k$ **Find $d$**: $d = \dfrac{u_n - u_m}{n - m}$ **Find $n$**: $n = \dfrac{u_n - a}{d} + 1$ **0-based** (Python indexing): $u[i] = a + i \cdot d$ for $i = 0, 1, 2, \ldots$ ### Formula-to-English Translation
"Start at $a$. Take $(n-1)$ equal steps of size $d$. You land on $a + (n-1)d$." ### Critical Concepts
- **Verify constant $d$**: `np.diff(sequence)` should all be equal.
- **$d < 0$**: decreasing sequence (depreciation, declining metrics).
- **$d = 0$**: constant sequence.
- **Linear in $n$**: $u_n$ is an affine function of $n$ with slope $d$.
- **np.linspace**: `np.linspace(a, b, n)` gives $n$ arithmetic terms, $d = (b-a)/(n-1)$.
- **np.arange**: `np.arange(a, b, step)` uses explicit $d$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Sequence: 3, 7, 11, 15, ... Find $u_{20}$. *Step 1: Identify parameters*
$a = 3$, $d = 7 - 3 = 4$ (verify: $11-7=4$ ✓) *Step 2: Apply formula*
$u_{20} = 3 + (20-1)(4) = 3 + 76 = 79$ *Step 3: Check*
$u_{20} - u_1 = 76 = 19 \times 4 = (20-1)d$ ✓ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def arithmetic_nth_term(a: float, d: float, n: int | np.ndarray) -> float | np.ndarray: """n-th term: u_n = a + (n-1)*d.""" return a + (n - 1) * d # Sequence 3, 7, 11, ...
a_val, d_val = 3.0, 4.0
print("Arithmetic sequence (a=3, d=4):")
for n in [1, 2, 5, 10, 20]: print(f" u_{n:2d} = {arithmetic_nth_term(a_val, d_val, n):.1f}") # Straight-line depreciation
print("\nDepreciation (a=50000, d=-5000):")
for year in [1, 3, 5, 10]: print(f" Year {year:2d}: EUR {arithmetic_nth_term(50_000, -5_000, year):>9,.0f}") # np.linspace produces arithmetic sequences
x_values = np.linspace(0.0, 1.0, 11)
print(f"\nnp.linspace(0,1,11): {x_values}")
print(f"d = {x_values[1] - x_values[0]:.2f}, all equal: {np.allclose(np.diff(x_values), 0.1)}")
```
#### Beginner friendly Example [R])
``` r
arithmetic_nth_term <- function(a, d, n) a + (n - 1) * d a_val <- 3; d_val <- 4
cat("Arithmetic sequence (a=3, d=4):\n")
for (n in c(1, 2, 5, 10, 20)) { cat(sprintf(" u_%d = %.1f\n", n, arithmetic_nth_term(a_val, d_val, n)))
} cat("\nDepreciation (a=50000, d=-5000):\n")
for (year in c(1, 3, 5, 10)) { cat(sprintf(" Year %2d: EUR %9.0f\n", year, arithmetic_nth_term(50000, -5000, year)))
}
```
#### Final Professional Example [Python])
``` python
"""
Arithmetic sequences in DA/DS: cohort offsets, feature bins, depreciation.
"""
import numpy as np
import pandas as pd def arithmetic_nth_term(a: float, d: float, n: int | np.ndarray) -> float | np.ndarray: """u_n = a + (n-1)*d.""" return a + (n - 1) * d # 1. Weekly cohort follow-up offsets: weeks 1, 8, 15, 22, ... (d=7)
cohort_weeks = arithmetic_nth_term(1, 7, np.arange(1, 9)).astype(int)
print(f"Cohort follow-up weeks: {cohort_weeks}") # 2. Age feature bins for marketing model
age_edges = np.linspace(18, 68, 6).astype(int)
print(f"Age bin edges: {age_edges}") # 3. Depreciation register
assets = [("Server rack", 80_000, -8_000, 10), ("Office fit-out", 120_000, -10_000, 12)]
records = []
for name, a, d, life in assets: for yr in range(1, life + 1): records.append({"asset": name, "year": yr, "book_value": arithmetic_nth_term(a, d, yr)})
df = pd.DataFrame(records)
print("\nDepreciation (selected years):")
print(df[df["year"].isin([1, 3, 5, 10])].to_string(index=False))
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
MFB pag 160