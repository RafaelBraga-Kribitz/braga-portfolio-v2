---
title: Closed interval
date: '2026-04-16'
wordCount: 814
slug: closed_interval
permalink: /notes/01_foundations/math_symbols/algebra/closed_interval/index.html
share_status: draft
publish_target: note
boundary: public
---
# $[a,b] \triangleq \{ x \mid a \le x \le b \}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A closed interval $[a, b]$ represents all real numbers from $a$ to $b$, **with both endpoints included**. The square brackets are the signal: they visually "close" or "lock" the boundaries in. In DA/DS you use this for date range filtering ("give me all records from Jan 1 to Dec 31, inclusive"), defining clipping bounds in feature engineering, specifying acceptable ranges for a metric, and in statistical confidence intervals where the boundary values are valid members.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Given interval [a, b] and a value x"] --> B{"Is x >= a?"} B -- "No" --> C["x is NOT in the interval"] B -- "Yes" --> D{"Is x <= b?"} D -- "No" --> C D -- "Yes" --> E["x IS in the interval (endpoints included)"] E --> F["Action: include x in dataset / filter / analysis"] C --> G["Action: exclude x"]
```
### Real-World use:
#### Situation it is used
Date range filtering in SQL and pandas, defining the valid range for a numerical feature, clipping outliers to $[Q_1 - 1.5 \cdot IQR,\ Q_3 + 1.5 \cdot IQR]$, specifying confidence interval bounds, and defining acceptable input ranges for a model.
#### Problem it solves
When filtering data, you need to specify precisely whether boundary values count. A sales report for "2023" should include January 1 and December 31. A half-open interval $[2023\text{-}01\text{-}01,\ 2023\text{-}12\text{-}31)$ would miss the last day. The closed interval notation removes ambiguity about boundary inclusion.
#### How it solves the problem
$[a, b]$ is the mathematical statement: "include $a$, include $b$, and include everything in between." SQL's `BETWEEN a AND b` is a closed interval. Pandas' `.loc[a:b]` for DatetimeIndex is also inclusive on both ends.
#### Example of it used in the Working Context as DA/DS for a Business
Clipping a feature (e.g., "session duration in seconds") to a valid range $[0, 3600]$ to remove impossible values. Any value $x < 0$ is set to $0$, any value $x > 3600$ is set to $3600$, and any value in $[0, 3600]$ is left unchanged. This is directly expressed as: keep $x$ if $x \in [0, 3600]$.
### The Formula (Fragment-First)
Breaking the notation: - $[$ (open square bracket on left): "closed at the lower bound" — include $a$.
- $a$: the lower bound (minimum value in the interval).
- $b$: the upper bound (maximum value in the interval).
- $]$ (close square bracket on right): "closed at the upper bound" — include $b$.
- $\mid$ (vertical bar): "such that."
- $\mathbb{R}$: the set of all real numbers. Full set-builder definition:
$$[a, b] \triangleq \{ x \in \mathbb{R} \mid a \leq x \leq b \}$$ Read: "The closed interval from $a$ to $b$ is the set of all real numbers $x$ such that $x$ is greater than or equal to $a$ AND less than or equal to $b$." Interval family (memorize the bracket/parenthesis convention): | Notation | Name | Includes $a$? | Includes $b$? |
|---|---|---|---|
| $[a, b]$ | Closed | Yes | Yes |
| $(a, b)$ | Open | No | No |
| $[a, b)$ | Half-open (left) | Yes | No |
| $(a, b]$ | Half-open (right) | No | Yes | ### Formula-to-English Translation
"$x \in [a, b]$ means: $x$ is at least $a$ (can equal $a$) AND at most $b$ (can equal $b$). The two conditions must both be true simultaneously." Think of it like a physical door frame: the brackets are the door frame itself. The door includes the frame. Open intervals exclude the frame.
### Critical Concepts
1. **Square bracket = include**: $[$ and $]$ always mean the endpoint is part of the set. Parenthesis $( )$ means the endpoint is excluded.
2. **SQL BETWEEN is closed**: `WHERE date BETWEEN '2023-01-01' AND '2023-12-31'` is equivalent to $x \in [\text{2023-01-01}, \text{2023-12-31}]$.
3. **Python range() is NOT closed**: `range(a, b)` excludes $b$. This is a half-open interval $[a, b)$. A common bug source.
4. **Numpy/pandas clipping**: `np.clip(x, a, b)` maps any $x < a$ to $a$ and any $x > b$ to $b$. Values already in $[a, b]$ are unchanged. This is a closed interval enforcement.
5. **Real vs. integer distinction**: $[2, 5]$ over $\mathbb{R}$ contains infinitely many values (all reals from 2 to 5). Over $\mathbb{Z}$ (integers), it contains $\{2, 3, 4, 5\}$, exactly 4 values.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Input: interval $[2, 5]$. Determine which of the following values are in it: $\{1, 2, 3.7, 5, 5.1\}$. *Step 1: Write the membership condition*
$x \in [2, 5]$ requires $2 \leq x \leq 5$. Both conditions must hold. *Step 2: Test each value*
- $x = 1$: $2 \leq 1$? No. Not in the interval.
- $x = 2$: $2 \leq 2 \leq 5$? Yes. In the interval (boundary included).
- $x = 3.7$: $2 \leq 3.7 \leq 5$? Yes. In the interval.
- $x = 5$: $2 \leq 5 \leq 5$? Yes. In the interval (boundary included).
- $x = 5.1$: $5.1 \leq 5$? No. Not in the interval. *Step 3: Summarize*
Members of $[2, 5]$: $\{2, 3.7, 5\}$. Non-members: $\{1, 5.1\}$.
### Real Application Examples
#### Beginner friendly Example [Python]
``` python
# Check membership in a closed interval [a, b]
a = 2
b = 5 test_values = [1, 2, 3.7, 5, 5.1] for x in test_values: in_interval = a <= x <= b # Python's chained comparison: clean and readable print(f"x = {x}: in [{a}, {b}] ? {in_interval}") # x = 1: in [2, 5] ? False
# x = 2: in [2, 5] ? True (boundary included)
# x = 3.7: in [2, 5] ? True
# x = 5: in [2, 5] ? True (boundary included)
# x = 5.1: in [2, 5] ? False
```
#### Beginner friendly Example [R]
``` r
a <- 2
b <- 5 test_values <- c(1, 2, 3.7, 5, 5.1) in_interval <- test_values >= a & test_values <= b # vectorized, both conditions
print(in_interval) # FALSE TRUE TRUE TRUE FALSE # Named output for clarity
names(in_interval) <- test_values
print(in_interval)
```
#### Final Professional Example [Python]
``` python
import numpy as np
import pandas as pd # Scenario: feature engineering - clip session_duration_seconds to valid range [0, 3600] np.random.seed(42)
raw_durations = np.random.normal(loc=300, scale=400, size=1000) # many negatives and extremes DURATION_MIN = 0
DURATION_MAX = 3600 # Clip to closed interval [0, 3600]
clipped_durations = np.clip(raw_durations, DURATION_MIN, DURATION_MAX) df = pd.DataFrame({ "raw_duration": raw_durations, "clipped_duration": clipped_durations,
}) out_of_range = ((df["raw_duration"] < DURATION_MIN) | (df["raw_duration"] > DURATION_MAX)).sum()
print(f"Values outside [{DURATION_MIN}, {DURATION_MAX}]: {out_of_range}")
print(f"After clipping, min: {clipped_durations.min():.2f}, max: {clipped_durations.max():.2f}")
print(f"All values in [{DURATION_MIN}, {DURATION_MAX}]: {((clipped_durations >= DURATION_MIN) & (clipped_durations <= DURATION_MAX)).all()}")
```
#### Final Professional Example [R]
``` r
# Scenario: feature engineering - clip session_duration_seconds to valid range [0, 3600] set.seed(42)
raw_durations <- rnorm(1000, mean = 300, sd = 400) DURATION_MIN <- 0
DURATION_MAX <- 3600 # Clip to closed interval [0, 3600]
clipped_durations <- pmin(pmax(raw_durations, DURATION_MIN), DURATION_MAX) df <- data.frame( raw_duration = raw_durations, clipped_duration = clipped_durations
) out_of_range <- sum(df$raw_duration < DURATION_MIN | df$raw_duration > DURATION_MAX)
cat("Values outside [", DURATION_MIN, ", ", DURATION_MAX, "]: ", out_of_range, "\n", sep = "")
cat(sprintf("After clipping, min: %.2f, max: %.2f\n", min(clipped_durations), max(clipped_durations)))
cat("All values in [0, 3600]:", all(clipped_durations >= DURATION_MIN & clipped_durations <= DURATION_MAX), "\n")
```
---
1300 pag 13