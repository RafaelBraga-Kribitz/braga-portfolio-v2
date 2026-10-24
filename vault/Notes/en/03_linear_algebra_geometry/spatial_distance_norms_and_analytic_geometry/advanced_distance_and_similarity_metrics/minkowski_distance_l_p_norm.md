---
title: Minkowski Distance ($L p$ norm)
date: '2026-04-16'
wordCount: 733
slug: minkowski_distance_l_p_norm
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/advanced_distance_and_similarity_metrics/minkowski_distance_l_p_norm/index.html
share_status: draft
publish_target: note
boundary: public
---
# $D(x,y) = \left( \sum_{i=1}^n |x_i - y_i|^p \right)^{1/p}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The Minkowski distance is the general $L_p$ norm-based distance family. Every standard distance metric you know is a special case: $p=1$ is Manhattan, $p=2$ is Euclidean, $p \to \infty$ is Chebyshev. The parameter $p$ controls how much weight is given to large vs. small differences: large $p$ increasingly dominates on the single largest component difference. In DA/DS: Minkowski distance is used in $k$-NN classification/regression, clustering (k-means with custom distance), anomaly detection, and any pipeline where the geometry of the feature space matters. Choosing $p$ is a hyperparameter that affects model sensitivity to outlier features.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Vectors x = (x1,...,xn), y = (y1,...,yn), parameter p >= 1"] A --> B["Compute element-wise differences: |xi - yi|"] B --> C["Raise each to power p: |xi - yi|^p"] C --> D["Sum all terms: sum_i |xi - yi|^p"] D --> E["Take p-th root: (sum)^(1/p)"] E --> F["D_p(x,y) = Minkowski distance"] F --> G["p=1: Manhattan (L1), p=2: Euclidean (L2)"] F --> H["p -> inf: Chebyshev (L_inf = max |xi - yi|)"]
```
### Real-World use:
#### Situation it is used
$k$-NN with tunable $p$ (scikit-learn `KNeighborsClassifier(metric='minkowski', p=p)`), distance-based clustering, feature space analysis, and grid search over $p$ as a hyperparameter in any distance-based model.
#### Problem it solves
Different feature spaces have different geometric properties. Euclidean distance penalizes large deviations quadratically. Manhattan is robust to this. Chebyshev captures the worst-case deviation. Minkowski unifies these under one formula so you can tune or search over the right geometry for your data.
#### How it solves the problem
By varying $p$, the shape of the "unit ball" (set of all points at distance 1) changes from a diamond ($p=1$), to a circle ($p=2$), to a square ($p \to \infty$). The appropriate $p$ depends on the domain: high-dimensional sparse data tends to prefer $p=1$ (Manhattan); dense continuous data tends to prefer $p=2$ (Euclidean).
#### Example of it used in the Working Context as DA/DS for a Business
A DS trains a $k$-NN churn classifier on customer behavioral features and tunes $p$ via cross-validation. For $p=1$ (Manhattan) the model focuses on total behavioral deviation; for $p=2$ (Euclidean) it weights larger deviations more strongly. The optimal $p$ is selected by comparing validation AUC across $p \in \{1, 1.5, 2, 3\}$.
### The Formula (Fragment-First)
- $D(x,y)$: the Minkowski distance between vectors $x, y \in \mathbb{R}^n$
- $|x_i - y_i|$: absolute difference of the $i$-th feature
- $(\cdot)^p$: raising to power $p$ controls sensitivity to large differences; large $p$ = more weight on the biggest gap
- $\sum_{i=1}^n$: sum over all $n$ dimensions
- $(\cdot)^{1/p}$: the $p$-th root brings the result back to the original scale (undoes the power)
- $p \geq 1$: the constraint that makes this a proper metric (triangle inequality holds iff $p \geq 1$, by Minkowski's inequality)
- Special cases: $p=1$ (Manhattan), $p=2$ (Euclidean), $p \to \infty$ gives $\max_i |x_i - y_i|$ (Chebyshev) ### Formula-to-English Translation
"Compute the absolute difference in each coordinate. Raise each to the $p$-th power (amplifying large gaps more for larger $p$). Sum them up. Then take the $p$-th root to restore the scale. The result is a distance where $p$ controls how much the biggest gaps dominate." Tiny example: $x = (1, 0)$, $y = (4, 3)$.
- $p=1$: $|3| + |3| = 6$.
- $p=2$: $\sqrt{9+9} = \sqrt{18} \approx 4.243$.
- $p \to \infty$: $\max(3, 3) = 3$.
### Critical Concepts
- **$p \geq 1$ required for metric:** for $p < 1$, the triangle inequality fails (it is a semimetric, not a metric).
- **Curse of dimensionality:** as $n \to \infty$, Minkowski distances concentrate — all pairwise distances become similar. This makes distance-based models unreliable in very high dimensions.
- **$p=2$ is rotation-invariant:** only $p=2$ (Euclidean) is invariant under rotation of the coordinate system. $p=1$ and others depend on axis alignment.
- **$p \to \infty$ limit:** $\lim_{p \to \infty} \left(\sum |x_i - y_i|^p\right)^{1/p} = \max_i |x_i - y_i|$.
- **Weighted Minkowski:** $\left(\sum_i w_i |x_i - y_i|^p\right)^{1/p}$ allows feature importance weighting.
- **scikit-learn:** `KNeighborsClassifier(metric='minkowski', p=p)` defaults to $p=2$ (Euclidean).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Set up vectors and choose $p$*
$x = (1, 2, 3)$, $y = (4, 0, 6)$.
Differences: $|1-4| = 3$, $|2-0| = 2$, $|3-6| = 3$. *Step 2: Compute for $p=1$ (Manhattan)*
$D_1 = 3 + 2 + 3 = 8$. *Step 3: Compute for $p=2$ (Euclidean)*
$D_2 = \sqrt{9 + 4 + 9} = \sqrt{22} \approx 4.690$. *Step 4: Compute for $p=3$*
$D_3 = (27 + 8 + 27)^{1/3} = 62^{1/3} \approx 3.958$. As $p$ increases, the result approaches $\max(3,2,3) = 3$ (Chebyshev). $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def minkowski_distance(x: np.ndarray, y: np.ndarray, p: float) -> float: """Compute Minkowski distance D_p(x, y) for given p >= 1.""" if p == float('inf'): return float(np.max(np.abs(x - y))) return float(np.sum(np.abs(x - y) ** p) ** (1.0 / p)) x = np.array([1.0, 2.0, 3.0])
y = np.array([4.0, 0.0, 6.0]) for p_val in [1, 2, 3, 10, float('inf')]: dist = minkowski_distance(x, y, p_val) print(f"p={p_val:>5}: D_p = {dist:.4f}") # Compare with scipy reference
from scipy.spatial.distance import minkowski
print(f"\nscipy minkowski p=2: {minkowski(x, y, p=2):.4f}")
print(f"scipy minkowski p=1: {minkowski(x, y, p=1):.4f}")
```
#### Beginner friendly Example [R])
``` r
# -- Minkowski distance for varying p ---
minkowski_dist <- function(x, y, p) { if (is.infinite(p)) return(max(abs(x - y))) sum(abs(x - y)^p)^(1 / p)
} x <- c(1, 2, 3)
y <- c(4, 0, 6) for (p_val in c(1, 2, 3, 10, Inf)) { dist <- minkowski_dist(x, y, p_val) cat(sprintf("p = %5s: D_p = %.4f\n", ifelse(is.infinite(p_val), "Inf", as.character(p_val)), dist))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification np.random.seed(42) # -- Business scenario: tune Minkowski p as hyperparameter for kNN churn model ---
X, y = make_classification( n_samples=800, n_features=10, n_informative=6, n_redundant=2, random_state=42
) scaler = StandardScaler()
X_scaled = scaler.fit_transform(X) P_VALUES = [1, 1.5, 2, 3, 5]
CV = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
K_NEIGHBORS = 7 results = []
for p_val in P_VALUES: clf = KNeighborsClassifier(n_neighbors=K_NEIGHBORS, metric='minkowski', p=p_val) scores = cross_val_score(clf, X_scaled, y, cv=CV, scoring='roc_auc') results.append({ "p": p_val, "norm_name": {1: "Manhattan", 2: "Euclidean"}.get(p_val, f"L{p_val}"), "mean_auc": round(scores.mean(), 4), "std_auc": round(scores.std(), 4), }) df = pd.DataFrame(results)
print(f"kNN (k={K_NEIGHBORS}) Minkowski distance hyperparameter search:")
print(df.to_string(index=False)) best_row = df.loc[df["mean_auc"].idxmax()]
print(f"\nBest: p={best_row['p']} ({best_row['norm_name']}), AUC={best_row['mean_auc']:.4f}")
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