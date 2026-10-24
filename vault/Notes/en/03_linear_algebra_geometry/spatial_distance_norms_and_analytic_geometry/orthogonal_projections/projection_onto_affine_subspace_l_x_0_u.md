---
title: Projection onto affine subspace $L = x 0 + U$
date: '2026-04-16'
wordCount: 803
slug: projection_onto_affine_subspace_l_x_0_u
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/orthogonal_projections/projection_onto_affine_subspace_l_x_0_u/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\pi_L(x) = x_0 + \pi_U(x - x_0)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
$\pi_L(x) = x_0 + \pi_U(x-x_0)$ gives the closest point on the affine subspace $L = x_0 + U$ to any given point $x$. The strategy: (1) translate $x$ by $-x_0$ to work in the coordinate system of $U$, (2) project onto the linear subspace $U$, (3) translate back by $+x_0$. The result is the foot of the perpendicular from $x$ to $L$. In DA/DS: finding the closest point on a fitted regression surface to a new observation, projecting onto a decision boundary (SVM, linear classifier), and reconstructing observations from a lower-dimensional affine model (e.g., affine PCA, factor analysis with nonzero mean).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Point x, affine subspace L = x0 + U"] A --> B["Translate: v = x - x0"] B --> C["Project onto linear subspace U: pi_U(v) = P_pi * v"] C --> D["Translate back: pi_L(x) = x0 + pi_U(v)"] D --> E["pi_L(x) is the closest point in L to x"] E --> F["Residual: x - pi_L(x) is orthogonal to U (not to L)"] E --> G["Distance: d(x,L) = ||x - pi_L(x)||"]
```
### Real-World use:
#### Situation it is used
Projecting test data onto an affine PCA model (mean-centered subspace), finding the nearest point on a linear regression hyperplane (fitted surface) to a test observation, computing the foot of perpendicular in geometric algorithms, and projecting embeddings onto an affine cluster centroid subspace.
#### Problem it solves
Affine subspaces (e.g., a fitted regression plane, a PCA model with nonzero mean, a hyperplane at an offset) are not linear subspaces: they do not contain the origin, so standard linear projection does not apply directly. The formula handles the translation automatically.
#### How it solves the problem
Proof: any point in $L$ has the form $x_0 + u$ for $u \in U$. We want to minimize $\|x - (x_0 + u)\| = \|(x - x_0) - u\|$ over all $u \in U$. This is exactly the problem of projecting $v = x-x_0$ onto $U$. The solution is $u^* = \pi_U(v) = \pi_U(x-x_0)$. The closest point on $L$ is $x_0 + u^* = x_0 + \pi_U(x-x_0)$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS fits a 2D linear manifold through a cloud of 5D customer feature vectors (using affine PCA: center the data, project onto top-2 PCs, add back the mean). For a new customer $x_{\text{new}}$: $\pi_L(x_{\text{new}}) = \bar{x} + V_2 V_2^T(x_{\text{new}} - \bar{x})$ where $\bar{x}$ is the training mean and $V_2$ is the top-2 PCA component matrix. This gives the best reconstruction of $x_{\text{new}}$ using the 2D affine model.
### The Formula (Fragment-First)
- $L = x_0 + U$: the affine subspace; $x_0$ is any point on $L$; $U$ is the direction space (linear subspace)
- $x$: the input point to project
- $x - x_0$: translate $x$ relative to the anchor; removes the affine shift
- $\pi_U(x - x_0) = P_\pi(x-x_0)$: standard orthogonal projection of the translated point onto $U$
- $x_0 + \pi_U(x-x_0)$: translate back to get a point in $L$
- $\pi_L(x)$: the result; lives in $L$; minimizes $\|x - \pi_L(x)\|$ over all points in $L$
- When $x_0 = \mathbf{0}$: reduces to $\pi_U(x)$ (standard linear projection) ### Formula-to-English Translation
"Shift the problem so the affine subspace passes through the origin. Project in the shifted coordinates. Shift back. The result is the foot of the perpendicular from $x$ to the affine subspace." Tiny example: $L$ = the horizontal line at height 3: $x_0 = (0,3)$, $U = \text{span}(1,0)$.
Query: $x = (4, 7)$.
$v = (4,7) - (0,3) = (4,4)$.
$\pi_U(v) = (4,0)$ (project onto x-axis).
$\pi_L(x) = (0,3) + (4,0) = (4,3)$.
Distance: $\|(4,7)-(4,3)\| = 4$. (Vertical distance from $(4,7)$ to the line $y=3$.) $\checkmark$ ### Critical Concepts
- **Reduces to linear case at origin:** if $x_0 = \mathbf{0}$, then $\pi_L(x) = \pi_U(x)$.
- **Different anchor, same result:** $\pi_L(x)$ is the same regardless of which $x_0 \in L$ you choose. The projection is a property of the subspace, not the anchor.
- **Residual is orthogonal to $U$:** $x - \pi_L(x) = (x-x_0) - \pi_U(x-x_0) \perp U$.
- **Affine PCA:** the affine model is $L = \bar{x} + \text{col}(V_k)$. Projection: $\pi_L(x) = \bar{x} + V_k V_k^T(x - \bar{x})$. Reconstruction: approximates $x$ using only $k$ directions.
- **OLS prediction:** for a linear regression model, the fitted value $\hat{y}_{\text{new}} = x_{\text{new}}^T\hat{\beta}$ corresponds to the scalar component of the projection of $y$ onto the affine column space.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Set up the affine subspace and query point*
$x_0 = (1, 0, 2)$, $U = \text{span}(1,1,0)/\sqrt{2}$ (diagonal in xy-plane).
$b = (1,1,0)/\sqrt{2}$ (unit vector).
Query: $x = (4, 2, 5)$. *Step 2: Translate and project*
$v = x - x_0 = (3, 2, 3)$.
$\pi_U(v) = (b^Tv)b = \frac{3+2}{\sqrt{2}} \cdot \frac{(1,1,0)}{\sqrt{2}} = \frac{5}{2}(1,1,0) = (2.5, 2.5, 0)$. *Step 3: Translate back*
$\pi_L(x) = x_0 + \pi_U(v) = (1,0,2) + (2.5,2.5,0) = (3.5, 2.5, 2)$.
Distance: $\|x - \pi_L(x)\| = \|(4,2,5)-(3.5,2.5,2)\| = \|(0.5,-0.5,3)\| = \sqrt{0.25+0.25+9} = \sqrt{9.5} \approx 3.082$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Projection onto affine subspace L = x0 + U ---
x0 = np.array([1.0, 0.0, 2.0]) # anchor point on L
b = np.array([1.0, 1.0, 0.0]) / np.sqrt(2) # unit direction
x = np.array([4.0, 2.0, 5.0]) # query point # Step 1: translate
v = x - x0 # Step 2: project onto U
proj_v = np.dot(b, v) * b # Step 3: translate back
pi_L = x0 + proj_v
dist = np.linalg.norm(x - pi_L) print(f"x0 = {x0}")
print(f"b (direction) = {b.round(4)}")
print(f"x = {x}")
print(f"v = x - x0 = {v}")
print(f"pi_U(v) = {proj_v.round(4)}")
print(f"pi_L(x) = {pi_L.round(4)}")
print(f"d(x, L) = {dist:.4f}") # Verify: x - pi_L(x) is orthogonal to b
resid = x - pi_L
print(f"\nb^T resid (should be 0): {np.dot(b, resid):.10f}")
```
#### Beginner friendly Example [R])
``` r
# -- Projection onto affine subspace ---
x0 <- c(1, 0, 2)
b <- c(1, 1, 0) / sqrt(2)
x <- c(4, 2, 5) v <- x - x0
proj <- sum(b * v) * b
pi_L <- x0 + proj
dist <- sqrt(sum((x - pi_L)^2)) cat(sprintf("pi_L(x) = (%.4f, %.4f, %.4f)\n", pi_L[1], pi_L[2], pi_L[3]))
cat(sprintf("d(x, L) = %.4f\n", dist))
cat(sprintf("b^T resid = %.10f\n", sum(b * (x - pi_L))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler np.random.seed(42) # -- Business scenario: affine PCA projection ---
# Fit a 2D affine model to customer data.
# Reconstruct new customers using this model. N_TRAIN, N_TEST, D = 400, 20, 5 X_train = np.random.randn(N_TRAIN, D)
X_train[:, 1] += 0.9 * X_train[:, 0] # correlation
X_train[:, 2] += 0.6 * X_train[:, 0] scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train) # Affine PCA: anchor = mean (training mean is 0 after StandardScaler, so x0 = 0)
# In general: x0 = sample mean
x0 = X_scaled.mean(axis=0) # should be ~0 after scaling # Top 2 PCA directions (orthonormal)
_, _, Vt = np.linalg.svd(X_scaled - x0, full_matrices=False)
V2 = Vt[:2].T # D x 2, orthonormal columns # Test data
X_test = np.random.randn(N_TEST, D)
X_test_s = scaler.transform(X_test) # Affine projection: pi_L(x) = x0 + V2 V2^T (x - x0)
X_recon = x0 + (X_test_s - x0) @ V2 @ V2.T # reconstruction
errors = np.linalg.norm(X_test_s - X_recon, axis=1) results = pd.DataFrame({ "test_obs": range(N_TEST), "recon_error": errors.round(4), "pct_variance_kept": (1 - errors**2 / np.sum(X_test_s**2, axis=1)).round(4),
}) print("Affine PCA projection (2D model):")
print(f" Anchor x0 mean: {x0.round(4)}")
print(f" Mean reconstruction error: {errors.mean():.4f}")
print(f"\nSample results:")
print(results.head(10).to_string(index=False))
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
MML1