---
title: Manhattan Distance ($L 1$ norm, $p=1$)
date: '2026-04-16'
wordCount: 768
slug: manhattan_distance_l_1_norm_p_1
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/advanced_distance_and_similarity_metrics/manhattan_distance_l_1_norm_p_1/index.html
share_status: draft
publish_target: note
boundary: public
---
# $D(x,y) = \sum_{i=1}^n |x_i - y_i|$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Manhattan distance (also called taxicab distance, city block distance, or $L_1$ norm) sums the absolute differences across all dimensions. The name comes from navigating a city grid: you can only move along axes (no diagonal shortcuts), so the distance from one intersection to another is the sum of horizontal + vertical blocks. In DA/DS: Manhattan distance is preferred over Euclidean when (1) features are on different scales and outliers exist, (2) the data is sparse (many zero features), or (3) you want robustness to large deviations in a single feature. It is the backbone of Lasso regularization ($L_1$ penalty) and is used in $k$-NN, clustering, and recommendation systems.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Vectors x = (x1,...,xn), y = (y1,...,yn)"] A --> B["Compute element-wise absolute difference: |xi - yi| for each i"] B --> C["Sum all absolute differences: sum_i |xi - yi|"] C --> D["D1(x,y) = Manhattan distance"] D --> E["Measures total displacement along grid axes"] D --> F["Equivalent to L1 norm: ||x - y||_1"] F --> G["Special case of Minkowski with p=1"]
```
### Real-World use:
#### Situation it is used
Sparse data (text TF vectors, binary event flags), $k$-NN with high-dimensional categorical-like features, LASSO regularization (penalizes $\sum|\beta_i|$), median regression (minimizes $L_1$ loss), and anomaly detection on tabular data where individual feature deviations matter more than combined quadratic deviation.
#### Problem it solves
Euclidean distance squares large differences, making it sensitive to outlier features. If one feature is at a very different scale or has an extreme value, Euclidean distance is dominated by that single feature. Manhattan treats all deviations linearly, giving equal per-unit weight to all features.
#### How it solves the problem
By summing absolute differences (not squared), Manhattan distance avoids the amplification of large gaps. This also makes it equivalent to minimizing the $L_1$ loss (mean absolute error), which is known to be more robust to outliers than $L_2$ (mean squared error). In optimization: the $L_1$ ball (diamond shape) creates sparsity in penalized regression.
#### Example of it used in the Working Context as DA/DS for a Business
A DS builds a product recommendation engine on a retail platform. Customer purchase history is a sparse binary vector (1 if purchased, 0 otherwise across 5000 SKUs). Manhattan distance between two customers is the number of products where their purchase behavior differs. This is more interpretable and faster to compute than Euclidean on such sparse vectors.
### The Formula (Fragment-First)
- $D(x,y)$: Manhattan distance between vectors $x, y \in \mathbb{R}^n$; always $\geq 0$
- $|x_i - y_i|$: absolute value of the difference in the $i$-th component; no squaring
- $\sum_{i=1}^n$: sum over all $n$ dimensions
- Equivalent notations: $\|x - y\|_1$, $d_1(x,y)$, "city block distance", "taxicab distance"
- Special case of Minkowski at $p=1$: $D_1(x,y) = \left(\sum |x_i - y_i|^1\right)^{1/1} = \sum |x_i - y_i|$
- For $x, y \in \{0,1\}^n$ (binary): $D_1(x,y)$ = number of positions where $x$ and $y$ differ = Hamming distance ### Formula-to-English Translation
"For each feature, compute how far apart $x$ and $y$ are (absolute difference). Add up all these individual gaps. The total is the Manhattan distance. It is the distance you would travel navigating a city grid from $x$ to $y$, only moving along streets." Tiny example: $x = (1, 5, 3)$, $y = (4, 2, 7)$.
$|1-4| + |5-2| + |3-7| = 3 + 3 + 4 = 10$.
### Critical Concepts
- **No squaring = robust to outliers:** one feature with difference 100 contributes 100 to $D_1$, but $100^2 = 10000$ to $D_2^2$. Manhattan is far less dominated by a single large gap.
- **LASSO connection:** minimizing $\sum_i |\beta_i|$ (LASSO penalty) is using the $L_1$ norm on the parameter vector. The sparsity-inducing property of LASSO comes from the geometry of the $L_1$ ball.
- **Median minimizes $L_1$:** the $L_1$-optimal "center" of a set of points is the coordinate-wise median, not the mean.
- **Sparse data advantage:** in high-dimensional sparse vectors, many $|x_i - y_i|$ terms are zero (when both are zero). Sparse matrix operations exploit this efficiently.
- **Scale sensitivity:** Manhattan distance, like Euclidean, is not scale-invariant. Always standardize features before computing distances unless the raw scale is meaningful.
- **Comparison to $L_2$:** $\|x - y\|_1 \geq \|x - y\|_2 \geq \|x - y\|_\infty$ (always); and $\|x - y\|_2 \geq \|x - y\|_1 / \sqrt{n}$ (Cauchy-Schwarz).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: List the vectors*
$x = (2, 7, 1, 5)$, $y = (6, 3, 4, 5)$. *Step 2: Compute absolute differences per dimension*
$|2-6| = 4$, $|7-3| = 4$, $|1-4| = 3$, $|5-5| = 0$. *Step 3: Sum*
$D_1(x, y) = 4 + 4 + 3 + 0 = 11$. Compare to $D_2$: $\sqrt{16+16+9+0} = \sqrt{41} \approx 6.40$. Manhattan is always $\geq$ Euclidean.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def manhattan_distance(x: np.ndarray, y: np.ndarray) -> float: """Compute L1 (Manhattan) distance between vectors x and y.""" return float(np.sum(np.abs(x - y))) x = np.array([2.0, 7.0, 1.0, 5.0])
y = np.array([6.0, 3.0, 4.0, 5.0]) d1 = manhattan_distance(x, y)
d2 = float(np.linalg.norm(x - y, ord=2))
dinf = float(np.linalg.norm(x - y, ord=np.inf)) print(f"Manhattan (L1): {d1:.4f}")
print(f"Euclidean (L2): {d2:.4f}")
print(f"Chebyshev (Linf): {dinf:.4f}")
print(f"\nRelationship: L1 >= L2 >= Linf: {d1 >= d2 >= dinf}") # Verify with scipy
from scipy.spatial.distance import cityblock, euclidean
print(f"\nscipy cityblock: {cityblock(x, y):.4f}")
print(f"scipy euclidean: {euclidean(x, y):.4f}")
```
#### Beginner friendly Example [R])
``` r
# -- Manhattan (L1) distance ---
manhattan_dist <- function(x, y) sum(abs(x - y)) x <- c(2, 7, 1, 5)
y <- c(6, 3, 4, 5) d1 <- manhattan_dist(x, y)
d2 <- sqrt(sum((x - y)^2))
dinf <- max(abs(x - y)) cat(sprintf("Manhattan (L1): %.4f\n", d1))
cat(sprintf("Euclidean (L2): %.4f\n", d2))
cat(sprintf("Chebyshev (Linf): %.4f\n", dinf))
cat(sprintf("Holds L1 >= L2 >= Linf: %s\n", d1 >= d2 && d2 >= dinf)) # Using built-in dist() with method="manhattan"
cat(sprintf("\ndist() manhattan: %.4f\n", as.numeric(dist(rbind(x, y), method="manhattan"))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler np.random.seed(42) # -- Business scenario: sparse customer purchase vector kNN recommendation ---
# Compare L1 vs L2 kNN on sparse binary purchase history. N_CUSTOMERS = 600
N_SKUS = 100
PURCHASE_PROB = 0.05 # sparse: each customer buys ~5% of SKUs # Simulate sparse binary purchase matrix
X = (np.random.rand(N_CUSTOMERS, N_SKUS) < PURCHASE_PROB).astype(float) # Label: high-value customer (bought at least one premium SKU)
PREMIUM_SKUS = list(range(0, 10))
y = (X[:, PREMIUM_SKUS].sum(axis=1) > 0).astype(int) scaler = StandardScaler()
X_std = scaler.fit_transform(X) cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
K = 9 results = []
for metric_name, p_val in [("Manhattan (L1)", 1), ("Euclidean (L2)", 2)]: clf = KNeighborsClassifier(n_neighbors=K, metric='minkowski', p=p_val) scores = cross_val_score(clf, X_std, y, cv=cv, scoring='f1') results.append({ "metric": metric_name, "mean_f1": round(scores.mean(), 4), "std_f1": round(scores.std(), 4), }) df = pd.DataFrame(results)
print(f"kNN (k={K}) on sparse purchase data ({N_CUSTOMERS} customers, {N_SKUS} SKUs):")
print(df.to_string(index=False))
print("\nManhattan typically outperforms Euclidean on sparse high-dimensional data.")
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