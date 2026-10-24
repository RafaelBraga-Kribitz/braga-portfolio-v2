---
title: Chebyshev Distance ($L infty$ norm, $p to infty$)
date: '2026-04-16'
wordCount: 731
slug: chebyshev_distance_l_infty_norm_p_to_infty
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/advanced_distance_and_similarity_metrics/chebyshev_distance_l_infty_norm_p_to_infty/index.html
share_status: draft
publish_target: note
boundary: public
---
# $D(x,y) = \max_i |x_i - y_i|$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Chebyshev distance is the $L_\infty$ norm: the distance between two points equals the largest single-coordinate difference, ignoring all other dimensions. The name comes from chess: the Chebyshev distance between two squares is the minimum number of king moves needed (a king can move diagonally, so it takes $\max(|\Delta\text{row}|, |\Delta\text{col}|)$ moves). In DA/DS: Chebyshev distance is the right metric when the bottleneck or worst-case deviation drives the cost, not the total deviation. It is used in warehouse logistics (robot arm movement), anomaly detection (which feature deviates most?), game AI, and maximum-deviation tolerance checks.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Vectors x = (x1,...,xn), y = (y1,...,yn)"] A --> B["Compute element-wise absolute differences: |xi - yi|"] B --> C["Find the maximum: max_i |xi - yi|"] C --> D["D_inf(x,y) = Chebyshev distance"] D --> E["Limit of Minkowski as p -> inf"] D --> F["Captures the WORST-CASE dimension deviation"] D --> G["Chess king: max(|delta_row|, |delta_col|) moves"]
```
### Real-World use:
#### Situation it is used
Warehouse robot routing (moving along two axes simultaneously, the time needed is the max of horizontal and vertical travel), maximum tolerance checks in manufacturing QC (is any feature out of spec?), outlier detection (which feature deviates most from expected?), chess-like grid game AI, and $L_\infty$ robustness analysis in adversarial ML (maximum perturbation budget per feature).
#### Problem it solves
When you care about the single worst deviation rather than the total or average deviation, Chebyshev is the correct metric. Summing all differences (Manhattan) or squaring them (Euclidean) dilutes the worst-case feature. Chebyshev isolates it.
#### How it solves the problem
$\max_i |x_i - y_i|$ simply picks the largest element from the absolute difference vector. As a limit of $L_p$: $\lim_{p \to \infty} \left(\sum_i |x_i - y_i|^p\right)^{1/p} = \max_i |x_i - y_i|$, because raising to a very large power $p$ forces the maximum term to dominate the sum.
#### Example of it used in the Working Context as DA/DS for a Business
A DS at a logistics company models robot arm movement in a grid warehouse. The robot can move diagonally, so moving from bin $(r_1, c_1)$ to $(r_2, c_2)$ takes $\max(|r_1-r_2|, |c_1-c_2|)$ time steps. They use Chebyshev distance to optimize picking routes, minimizing time steps rather than path length.
### The Formula (Fragment-First)
- $D(x,y)$: Chebyshev distance between $x, y \in \mathbb{R}^n$; always $\geq 0$
- $|x_i - y_i|$: absolute difference in dimension $i$
- $\max_i$: take the maximum over all dimensions — the single largest absolute difference
- $= \|x - y\|_\infty$: equivalent to the infinity norm (sup norm, $L_\infty$ norm)
- Limit: $D_\infty(x,y) = \lim_{p \to \infty} D_p(x,y)$
- For 2D: $D_\infty = \max(|x_1 - y_1|, |x_2 - y_2|)$ — the chess king distance
- Relationship to other norms: $\|v\|_\infty \leq \|v\|_2 \leq \|v\|_1$ (for the same vector $v = x-y$) ### Formula-to-English Translation
"Look at how much $x$ and $y$ differ in each coordinate. Ignore all but the worst one. The Chebyshev distance is that single biggest gap — the most extreme coordinate difference." Tiny example: $x = (1, 8, 3)$, $y = (4, 5, 9)$.
Differences: $|1-4| = 3$, $|8-5| = 3$, $|3-9| = 6$.
$D_\infty = \max(3, 3, 6) = 6$ (the third dimension dominates). $\checkmark$ ### Critical Concepts
- **Worst-case semantics:** Chebyshev captures the maximum single-feature deviation. Useful whenever "the weakest link" (worst feature) is the bottleneck.
- **Unit ball is a hypercube:** the set $\{v : \|v\|_\infty \leq 1\}$ is a hypercube (square in 2D, cube in 3D). Compare to the diamond ($L_1$) and sphere ($L_2$).
- **Coordinate transformation:** in 2D, rotating by 45° converts $L_\infty$ into $L_1$ and vice versa. Concretely: $\max(|a|, |b|) = \frac{1}{2}(|a+b| + |a-b|)$.
- **$L_\infty$ adversarial robustness:** in adversarial ML, the $\epsilon$-$L_\infty$ attack budget means no single pixel/feature can be perturbed by more than $\epsilon$. Chebyshev distance measures whether an adversarial example is within budget.
- **Bottleneck property:** $D_\infty(x,y) = 0$ iff $x = y$ (as required for a metric). It is a proper metric (satisfies all four axioms).
- **Dimension sensitivity:** dominated by the most variable feature. Must standardize features before using.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Compute element-wise absolute differences*
$x = (3, 1, 9, 4)$, $y = (7, 1, 2, 8)$.
$|3-7|=4$, $|1-1|=0$, $|9-2|=7$, $|4-8|=4$. *Step 2: Find the maximum*
$D_\infty = \max(4, 0, 7, 4) = 7$. *Step 3: Compare all three norms*
$D_1 = 4+0+7+4 = 15$.
$D_2 = \sqrt{16+0+49+16} = \sqrt{81} = 9$.
$D_\infty = 7$.
Holds: $D_\infty \leq D_2 \leq D_1$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def chebyshev_distance(x: np.ndarray, y: np.ndarray) -> float: """Compute Chebyshev (L-infinity) distance between x and y.""" return float(np.max(np.abs(x - y))) x = np.array([3.0, 1.0, 9.0, 4.0])
y = np.array([7.0, 1.0, 2.0, 8.0]) d_inf = chebyshev_distance(x, y)
d1 = float(np.linalg.norm(x - y, ord=1))
d2 = float(np.linalg.norm(x - y, ord=2)) print(f"Chebyshev (Linf): {d_inf:.4f}")
print(f"Manhattan (L1): {d1:.4f}")
print(f"Euclidean (L2): {d2:.4f}")
print(f"Holds Linf <= L2 <= L1: {d_inf <= d2 <= d1}") # Chess king example: board positions as (row, col)
king_pos = np.array([3, 4])
target = np.array([7, 1])
print(f"\nChess king moves needed: {chebyshev_distance(king_pos, target):.0f}") # Verify scipy
from scipy.spatial.distance import chebyshev
print(f"scipy chebyshev: {chebyshev(x, y):.4f}")
```
#### Beginner friendly Example [R])
``` r
# -- Chebyshev (L-infinity) distance ---
chebyshev_dist <- function(x, y) max(abs(x - y)) x <- c(3, 1, 9, 4)
y <- c(7, 1, 2, 8) d_inf <- chebyshev_dist(x, y)
d1 <- sum(abs(x - y))
d2 <- sqrt(sum((x - y)^2)) cat(sprintf("Chebyshev (Linf): %.4f\n", d_inf))
cat(sprintf("Manhattan (L1): %.4f\n", d1))
cat(sprintf("Euclidean (L2): %.4f\n", d2))
cat(sprintf("Holds Linf <= L2 <= L1: %s\n", d_inf <= d2 && d2 <= d1)) # Which dimension dominates?
diffs <- abs(x - y)
cat(sprintf("\nDominant dimension: %d (diff = %.1f)\n", which.max(diffs), max(diffs)))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: adversarial robustness audit (L-inf budget check) ---
# For each test sample, check if any adversarial perturbation exceeds the
# L-inf budget epsilon. Flag samples that are near a class boundary. N_CLEAN = 200
N_ADVER = 50
D = 20
EPSILON = 0.1 # L-inf perturbation budget per feature # Simulate clean test samples and adversarial perturbations
X_clean = np.random.randn(N_CLEAN, D)
X_adv = X_clean[:N_ADVER] + np.random.uniform(-0.15, 0.15, (N_ADVER, D)) # Compute per-sample Chebyshev distance (max feature perturbation)
chebyshev_dists = np.max(np.abs(X_adv - X_clean[:N_ADVER]), axis=1) # Flag samples that exceed the L-inf budget
within_budget = chebyshev_dists <= EPSILON
worst_feature = np.argmax(np.abs(X_adv - X_clean[:N_ADVER]), axis=1) results = pd.DataFrame({ "sample_id": range(N_ADVER), "max_perturbation": chebyshev_dists.round(4), "within_budget": within_budget, "dominant_feature": worst_feature,
}) print(f"L-inf adversarial audit (epsilon={EPSILON}):")
print(f" Samples within budget: {within_budget.sum()} / {N_ADVER}")
print(f" Max perturbation observed: {chebyshev_dists.max():.4f}")
print(f"\nSamples exceeding budget:")
print(results[~within_budget].head(10).to_string(index=False))
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