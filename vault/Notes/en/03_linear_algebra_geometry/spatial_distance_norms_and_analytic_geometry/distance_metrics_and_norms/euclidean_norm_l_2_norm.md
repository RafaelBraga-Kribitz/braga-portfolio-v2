---
title: Euclidean Norm ($L 2$ norm)
date: '2026-04-16'
wordCount: 715
slug: euclidean_norm_l_2_norm
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/distance_metrics_and_norms/euclidean_norm_l_2_norm/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\|x\|_2 = \sqrt{x^T x} = \sqrt{\sum x_i^2}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The Euclidean norm (also called the $L_2$ norm or 2-norm) is the standard measure of vector length: $\|x\|_2 = \sqrt{x^T x} = \sqrt{\sum_{i=1}^n x_i^2}$. It is the familiar straight-line distance from the origin to the point $(x_1, x_2, \ldots, x_n)$, generalizing the Pythagorean theorem to $n$ dimensions. This is the most commonly used norm in data science: it measures Euclidean distance between data points, defines the penalty in Ridge regression ($\lambda\|w\|_2^2$), and is the default in `np.linalg.norm(x)`.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Input: vector x = (x1, x2, ..., xn)"] A --> B["Square each element: xi^2"] B --> C["Sum all squares: x1^2 + x2^2 + ... + xn^2"] C --> D["This equals x^T x (self dot product)"] D --> E["Take square root"] E --> F["Result: ||x||_2 >= 0"] F --> G{{"Uses"}} G --> H["Distance: ||x - y||_2 between two points"] G --> I["Ridge penalty: lambda * ||w||_2^2"] G --> J["Normalization: x / ||x||_2 gives unit vector"]
```
### Real-World use:
#### Situation it is used
Euclidean distance between data points (k-NN, k-means, clustering), $L_2$ regularization in Ridge regression and neural networks (weight decay), convergence monitoring (stop when $\|w_t - w_{t-1}\|_2 < \epsilon$), gradient clipping (clip when $\|\nabla\|_2 >$ threshold), normalizing embeddings before cosine similarity, and reporting model error (RMSE = $\|e\|_2 / \sqrt{n}$).
#### Problem it solves
You need a single number that measures "how large" or "how far" a vector is, accounting for all dimensions simultaneously. The $L_2$ norm is invariant to rotation: if you rotate the coordinate system, the length of a vector does not change. This is the "natural" length in Euclidean geometry and is the right measure for physical space and many feature spaces.
#### How it solves the problem
$\|x\|_2 = \sqrt{x^T x}$: $x^T x = \sum x_i^2$ is the self-dot-product, always non-negative. The square root converts squared length to length. Key property: $\|x\|_2^2 = x^T x$ is easier to differentiate than $\|x\|_2$ itself (gradient of $\|x\|_2^2$ is $2x$), which is why Ridge uses the squared norm. Euclidean distance between two points is $\|x - y\|_2$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS builds a k-NN classifier for fraud detection. For each transaction vector $\vec{x}$, they find the $k$ closest training transactions by Euclidean distance: $d(x, x_i) = \|x - x_i\|_2 = \sqrt{\sum_j (x_j - x_{ij})^2}$. The transaction is classified by majority vote among its $k$ nearest neighbors. The quality of the classifier depends directly on how well the $L_2$ norm captures meaningful "closeness" in the feature space.
### The Formula (Fragment-First)
- $\|x\|_2$: the $L_2$ norm of vector $x$; subscript 2 denotes the Euclidean norm
- $x^T x$: transpose of $x$ (row vector) times $x$ (column vector); the self-dot-product; equals $\sum_i x_i^2$
- $\sum x_i^2$: sum of squared components; each component contributes its square
- $\sqrt{\cdot}$: square root; converts squared length to length; makes the result non-negative
- For the distance formula: $\|x - y\|_2 = \sqrt{\sum_i (x_i - y_i)^2}$ ### Formula-to-English Translation
"Square every component of the vector, add them all up, take the square root. The result is the straight-line distance from the origin to the vector's tip." Tiny example: $x = (3, -4)$.
$\|x\|_2 = \sqrt{3^2 + (-4)^2} = \sqrt{9 + 16} = \sqrt{25} = 5$.
Distance between $x = (3, -4)$ and $y = (0, 0)$: $\|x - y\|_2 = 5$.
### Critical Concepts
- **$\|x\|_2 = 0 \Leftrightarrow x = \vec{0}$:** only the zero vector has zero norm.
- **Triangle inequality:** $\|x + y\|_2 \leq \|x\|_2 + \|y\|_2$: the direct path is never longer than the detour.
- **Scaling:** $\|kx\|_2 = |k| \cdot \|x\|_2$.
- **Cauchy-Schwarz:** $|x \cdot y| \leq \|x\|_2 \|y\|_2$ — the absolute dot product is bounded by the product of norms.
- **Squared norm is preferred for optimization:** $\frac{d}{dx}\|x\|_2^2 = 2x$; $\frac{d}{dx}\|x\|_2 = x/\|x\|_2$ (undefined at $x=0$). Always penalize $\|w\|_2^2$ not $\|w\|_2$.
- **Sensitivity to outliers:** squaring amplifies large components. A single large component dominates the $L_2$ norm. The $L_1$ norm is more robust to outliers.
- **In NumPy:** `np.linalg.norm(x)` or `np.linalg.norm(x, ord=2)`. For the squared norm: `np.dot(x, x)` or `(x**2).sum()`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Square each component*
$x = (1, -2, 2)$.
$1^2 = 1$, $(-2)^2 = 4$, $2^2 = 4$. *Step 2: Sum the squares*
$1 + 4 + 4 = 9$. *Step 3: Take the square root*
$\|x\|_2 = \sqrt{9} = 3$.
Check: $x^T x = (1)(-2)(2) \cdot (1,-2,2)^T$... no: $x^T x = 1^2 + (-2)^2 + 2^2 = 9$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- L2 norm: computation and distance ---
x = np.array([1.0, -2.0, 2.0])
y = np.array([4.0, 1.0, -1.0]) norm_x = np.linalg.norm(x) # ||x||_2
norm_sq_x = np.dot(x, x) # ||x||_2^2 = x^T x
dist_xy = np.linalg.norm(x - y) # ||x - y||_2 print(f"x = {x}")
print(f"y = {y}")
print(f"||x||_2 = {norm_x:.4f}")
print(f"||x||_2^2 = {norm_sq_x:.4f}")
print(f"||x-y||_2 = {dist_xy:.4f}")
print(f"Unit vector = {(x / norm_x).round(4)}")
print(f"|unit vector| = {np.linalg.norm(x / norm_x):.6f}") # Verify x^T x = sum of squares
print(f"\nManual: sqrt(sum of squares) = {np.sqrt(np.sum(x**2)):.4f}")
print(f"np.linalg.norm: = {norm_x:.4f}")
print(f"Match: {np.isclose(np.sqrt(np.sum(x**2)), norm_x)}")
```
#### Beginner friendly Example [R])
``` r
# -- L2 norm and Euclidean distance ---
x <- c(1, -2, 2)
y <- c(4, 1, -1) norm_x <- sqrt(sum(x^2)) # ||x||_2
norm_sq_x <- sum(x^2) # ||x||_2^2
dist_xy <- sqrt(sum((x - y)^2)) # ||x - y||_2 cat(sprintf("||x||_2 : %.4f\n", norm_x))
cat(sprintf("||x||_2^2 : %.4f\n", norm_sq_x))
cat(sprintf("||x - y||_2 : %.4f\n", dist_xy))
cat("Unit vector :", round(x / norm_x, 4), "\n")
cat(sprintf("|unit vector| : %.6f\n", sqrt(sum((x/norm_x)^2))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.preprocessing import normalize np.random.seed(42) # -- Business scenario: k-NN fraud detection using L2 distance ---
# Transactions described by 4 features.
# For each test transaction, find top-3 nearest training transactions. N_TRAIN = 200
N_TEST = 5
FEATURE_NAMES = ["amount", "hour", "merchant_freq", "location_score"]
K = 3 # Simulate training data (half fraud, half normal)
X_train = np.random.randn(N_TRAIN, 4)
y_train = (np.random.rand(N_TRAIN) > 0.8).astype(int) # ~20% fraud # Simulate test transactions
X_test = np.random.randn(N_TEST, 4) # Compute pairwise L2 distances (brute force for clarity)
results = []
for test_idx in range(N_TEST): diffs = X_train - X_test[test_idx] # (N_TRAIN, 4): x - x_i l2_distances = np.linalg.norm(diffs, axis=1) # (N_TRAIN,): ||x - x_i||_2 nn_idx = np.argsort(l2_distances)[:K] nn_dist = l2_distances[nn_idx] nn_labels = y_train[nn_idx] pred_fraud = int(nn_labels.mean() > 0.5) results.append({ "test_id": test_idx, "pred_fraud": bool(pred_fraud), "nn_dists": nn_dist.round(4).tolist(), "nn_labels": nn_labels.tolist(), }) for r in results: print(f"Test {r['test_id']}: pred_fraud={r['pred_fraud']} " f"| nearest dists={r['nn_dists']} | labels={r['nn_labels']}")
```
#### Final Professional Example [R]
``` r
# k-NN fraud detection using L2 distance set.seed(42)
N_TRAIN <- 200
N_TEST <- 5
K <- 3
X_train <- matrix(rnorm(N_TRAIN * 4), nrow = N_TRAIN)
y_train <- as.integer(runif(N_TRAIN) > 0.8)
X_test <- matrix(rnorm(N_TEST * 4), nrow = N_TEST)
for (i in 1:N_TEST) { diffs <- sweep(X_train, 2, X_test[i,], "-") l2_dists <- sqrt(rowSums(diffs^2)) nn_idx <- order(l2_dists)[1:K] pred_fraud <- mean(y_train[nn_idx]) > 0.5 cat(sprintf("Test %d: pred_fraud=%s nn_dists=%s labels=%s\n", i-1, pred_fraud, paste(round(l2_dists[nn_idx], 4), collapse = ","), paste(y_train[nn_idx], collapse = ",")))
}
```
---
MML1 pag 77