---
title: 3D Distance
date: '2026-04-16'
wordCount: 604
slug: 3d_distance
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/distance_metrics_and_norms/3d_distance/index.html
share_status: draft
publish_target: note
boundary: public
---
# $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The 3D Euclidean distance formula extends the 2D formula to three dimensions: $d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$. It gives the straight-line distance between points $A=(x_1,y_1,z_1)$ and $B=(x_2,y_2,z_2)$ in 3D space. It is derived by applying the Pythagorean theorem twice: first in the $xy$-plane ($\sqrt{\Delta x^2 + \Delta y^2}$), then including the $z$-displacement. This formula generalizes directly to $n$ dimensions: $d = \sqrt{\sum_{i=1}^n (b_i - a_i)^2}$, which is what every Euclidean distance computation in ML uses.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Points A=(x1,y1,z1) and B=(x2,y2,z2)"] A --> B["dx = x2-x1, dy = y2-y1, dz = z2-z1"] B --> C["dx^2, dy^2, dz^2"] C --> D["Sum: dx^2 + dy^2 + dz^2"] D --> E["sqrt -> d"] E --> F["Equivalent: ||B - A||_2 in R^3"] F --> G["Extends to n-dimensions: sqrt(sum of squared diffs)"]
```
### Real-World use:
#### Situation it is used
3D point cloud distance measurements (LiDAR, 3D scanning), measuring distance between observations with 3 features, as the conceptual step between 2D distance and $n$-dimensional Euclidean distance in ML, and in physics simulation and 3D geometry computations.
#### Problem it solves
Extends distance measurement to three-dimensional space. A straight-line path in 3D cannot be computed by just looking at two axes — all three axes contribute to the total displacement. This formula correctly accounts for all three.
#### How it solves the problem
Apply the Pythagorean theorem twice: the projection into the $xy$-plane has length $\sqrt{\Delta x^2 + \Delta y^2}$. This forms the base of a second right triangle with the $z$-leg: $d = \sqrt{(\sqrt{\Delta x^2 + \Delta y^2})^2 + \Delta z^2} = \sqrt{\Delta x^2 + \Delta y^2 + \Delta z^2}$. The same argument extends to any number of dimensions.
#### Example of it used in the Working Context as DA/DS for a Business
A DS analyzes customer segments using three KPIs: recency (days since last purchase), frequency (orders per month), and monetary value (avg spend). Each customer is a point in 3D RFM space. To cluster customers, k-means computes $d = \sqrt{(r_2-r_1)^2 + (f_2-f_1)^2 + (m_2-m_1)^2}$ between every customer and each cluster centroid, assigning each customer to the nearest centroid.
### The Formula (Fragment-First)
- $x_2-x_1, y_2-y_1, z_2-z_1$: component-wise displacements along $x$, $y$, $z$ axes
- $(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2$: sum of squared displacements along all three axes; always $\geq 0$
- $\sqrt{\cdot}$: converts squared distance to distance
- Extension: for $n$-dimensional points $\vec{a}, \vec{b}$: $d = \sqrt{\sum_{i=1}^n (b_i - a_i)^2} = \|\vec{b} - \vec{a}\|_2$ ### Formula-to-English Translation
"For each axis (x, y, z), compute how far apart the two points are. Square each difference. Sum all three squares. Take the square root. The result is the straight-line distance in 3D." Tiny example: $A=(1,2,3)$, $B=(4,6,3)$.
$d = \sqrt{(4-1)^2+(6-2)^2+(3-3)^2} = \sqrt{9+16+0} = \sqrt{25} = 5$.
(Zero $z$-displacement means both points are at the same height; it reduces to 2D.) ### Critical Concepts
- **Generalization is immediate:** the $n$-dimensional version is $\sqrt{\sum_i (b_i-a_i)^2}$. This is what `np.linalg.norm(b - a)` computes for any $n$.
- **Scale sensitivity:** same as 2D — large-scale features dominate. Standardize before using Euclidean distance.
- **Rotation invariance:** the distance does not change if you rotate the coordinate axes.
- **In NumPy:** `np.linalg.norm(B - A)` for any array length, including 3D.
- **k-means uses this:** at every iteration, k-means computes $d(x, \mu_k)$ for all $k$ centroids and all $N$ points. For 3D data, this is the 3D Euclidean distance.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Compute the three displacements*
$A=(2,1,4)$, $B=(5,5,1)$.
$\Delta x = 3$, $\Delta y = 4$, $\Delta z = -3$. *Step 2: Square each and sum*
$9 + 16 + 9 = 34$. *Step 3: Take the square root*
$d = \sqrt{34} \approx 5.831$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- 3D Euclidean distance ---
A = np.array([2.0, 1.0, 4.0])
B = np.array([5.0, 5.0, 1.0]) displacements = B - A
d_manual = np.sqrt(np.sum(displacements**2))
d_numpy = np.linalg.norm(B - A) print(f"A = {A}")
print(f"B = {B}")
print(f"Displacements: {displacements}")
print(f"d (manual) = {d_manual:.4f}")
print(f"d (numpy) = {d_numpy:.4f}")
print(f"Match : {np.isclose(d_manual, d_numpy)}") # Verify: ||B-A||_2^2 = sum of squared diffs
print(f"\n||B-A||^2 = {d_numpy**2:.4f}")
print(f"Sum of squares = {np.sum(displacements**2):.4f}")
```
#### Beginner friendly Example [R])
``` r
# -- 3D Euclidean distance ---
A <- c(2, 1, 4)
B <- c(5, 5, 1) displacements <- B - A
d <- sqrt(sum(displacements^2)) cat("A:", A, "\n")
cat("B:", B, "\n")
cat("Displacements:", displacements, "\n")
cat(sprintf("d = %.4f\n", d))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans np.random.seed(42) # -- Business scenario: RFM customer segmentation in 3D ---
# RFM = Recency (days), Frequency (orders/month), Monetary (avg spend)
N = 300 # Simulate two customer groups
recency_1 = np.random.normal(15, 5, N/2) # active group
frequency_1 = np.random.normal(4, 1, N/2)
monetary_1 = np.random.normal(150, 30, N/2) recency_2 = np.random.normal(90, 20, N/2) # inactive group
frequency_2 = np.random.normal(1, 0.5, N/2)
monetary_2 = np.random.normal(50, 15, N/2) X = np.vstack([ np.column_stack([recency_1, frequency_1, monetary_1]), np.column_stack([recency_2, frequency_2, monetary_2])
]) # Standardize (critical: equal scale so L2 distance is fair)
X_scaled = (X - X.mean(axis=0)) / X.std(axis=0) # k-means: internally uses L2 distance
km = KMeans(n_clusters=2, random_state=42, n_init=10)
labels = km.fit_predict(X_scaled) # Show inter-centroid distance
centroids = km.cluster_centers_
centroid_dist = np.linalg.norm(centroids[0] - centroids[1]) print(f"Centroid 0 (standardized): {centroids[0].round(3)}")
print(f"Centroid 1 (standardized): {centroids[1].round(3)}")
print(f"Distance between centroids: {centroid_dist:.4f} (3D Euclidean)")
print(f"\nCluster sizes: {np.bincount(labels)}") # Per-cluster RFM profile
df = pd.DataFrame(X, columns=["recency", "frequency", "monetary"])
df["cluster"] = labels
print("\nCluster profiles (mean RFM):")
print(df.groupby("cluster").mean().round(2).to_string())
```
#### Final Professional Example [R]
``` r
# 3D RFM clustering; centroid distance = L2 in 3D set.seed(42)
N <- 200
recency_1 <- rnorm(N/2, 15, 5); frequency_1 <- rnorm(N/2, 4, 1); monetary_1 <- rnorm(N/2, 150, 30)
recency_2 <- rnorm(N/2, 90, 20); frequency_2 <- rnorm(N/2, 1, 0.5); monetary_2 <- rnorm(N/2, 50, 15)
X <- rbind(cbind(recency_1, frequency_1, monetary_1), cbind(recency_2, frequency_2, monetary_2))
X_scaled <- scale(X)
km <- kmeans(X_scaled, centers = 2, nstart = 10)
centroids <- km$centers
centroid_dist <- sqrt(sum((centroids[1,] - centroids[2,])^2))
cat(sprintf("Centroid distance (3D Euclidean): %.4f\n", centroid_dist))
cat("Cluster sizes:", km$size, "\n")
```
---
1300 pag 169