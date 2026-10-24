---
title: Vector representation
date: '2026-04-16'
wordCount: 797
slug: vector_representation
permalink: /notes/03_linear_algebra_geometry/vectors_and_dimensionality/vector_space_axioms_and_coordinates/vector_representation/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\vec{v} = v_1 \vec{i} + v_2 \vec{j} + v_3 \vec{k}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The formula $\vec{v} = v_1\vec{i} + v_2\vec{j} + v_3\vec{k}$ expresses any 3D vector as a linear combination of the three standard basis vectors. $\vec{i} = (1,0,0)$, $\vec{j} = (0,1,0)$, $\vec{k} = (0,0,1)$ are unit vectors aligned with the $x$-, $y$-, $z$-axes. The coefficients $v_1, v_2, v_3$ are the coordinates — how far to go in each direction. This decomposition makes every vector operation into a set of scalar operations on coordinates. All of data science is built on this: every data point is a vector, every model parameter is a vector, every embedding is a vector.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Vector v in 3D space"] A --> B["Decompose along each axis"] B --> C["v1 * i_hat (x-axis component)"] B --> D["v2 * j_hat (y-axis component)"] B --> E["v3 * k_hat (z-axis component)"] C --> F["Sum the three components"] D --> F E --> F F --> G["v = v1*i + v2*j + v3*k"] G --> H["Equivalent: v = (v1, v2, v3) as a coordinate tuple"]
```
### Real-World use:
#### Situation it is used
Every time you represent a data point, feature vector, weight vector, or embedding as a numeric array, you are using this decomposition. In Python: `np.array([v1, v2, v3])`. The coordinate representation is the computational form; the basis vector form shows the underlying structure.
#### Problem it solves
Provides the bridge between geometric vectors (arrows in space) and their numeric representations (arrays of numbers). Once you have coordinates, you can compute anything: distances, dot products, projections, matrix products. Without a choice of basis, vectors would be abstract geometric objects with no numeric handle.
#### How it solves the problem
The standard basis $\{\vec{i}, \vec{j}, \vec{k}\}$ is orthonormal (each pair is perpendicular and each has length 1). This makes the coordinate extraction trivial: $v_1 = \vec{v} \cdot \vec{i}$ (dot product picks out the $x$-component), $v_2 = \vec{v} \cdot \vec{j}$, $v_3 = \vec{v} \cdot \vec{k}$. Any other orthonormal basis would work too (PCA basis, Fourier basis), and the formula $\vec{v} = \sum_i v_i \vec{e}_i$ generalizes to $n$ dimensions and non-standard bases.
#### Example of it used in the Working Context as DA/DS for a Business
A DA prepares features for a customer churn model: age, account tenure, monthly spend. Each customer becomes a vector $\vec{x} = x_1 \vec{e}_1 + x_2 \vec{e}_2 + x_3 \vec{e}_3$ where $x_1 = \text{age}$, $x_2 = \text{tenure}$, $x_3 = \text{spend}$. The choice of basis ($\vec{e}_1, \vec{e}_2, \vec{e}_3$) is the original feature axes. After PCA, a new basis is chosen that aligns with variance directions. The same vector is re-expressed in the new coordinate system: same geometric object, different coordinates.
### The Formula (Fragment-First)
- $\vec{v}$: the vector being represented
- $v_1, v_2, v_3$: the scalar coordinates (the components); can be any real numbers
- $\vec{i}$: unit basis vector along $x$-axis: $(1, 0, 0)$
- $\vec{j}$: unit basis vector along $y$-axis: $(0, 1, 0)$
- $\vec{k}$: unit basis vector along $z$-axis: $(0, 0, 1)$
- $v_1\vec{i} + v_2\vec{j} + v_3\vec{k}$: scale each basis vector by its coordinate, then sum (linear combination)
- Alternative notations: $(v_1, v_2, v_3)$ (coordinate tuple), $[v_1, v_2, v_3]^T$ (column vector in matrix algebra) ### Formula-to-English Translation
"A vector in 3D space is described by how far it goes along the $x$-axis ($v_1$ units in the $\vec{i}$ direction), the $y$-axis ($v_2$ units in the $\vec{j}$ direction), and the $z$-axis ($v_3$ units in the $\vec{k}$ direction). The vector is the sum of these three directional contributions." Tiny example: $\vec{v} = (2, -3, 1)$.
$\vec{v} = 2\vec{i} + (-3)\vec{j} + 1\vec{k}$.
In words: go 2 units right ($x$), 3 units down ($-y$), 1 unit forward ($z$).
### Critical Concepts
- **Basis choice matters:** the same physical vector has different coordinates in different bases. Standard basis gives the simplest coordinates.
- **Generalization to $n$ dimensions:** in ML, $\vec{x} = x_1\vec{e}_1 + x_2\vec{e}_2 + \ldots + x_n\vec{e}_n$ where $n$ can be 784 (MNIST pixels), 768 (BERT embedding dim), or any size.
- **Orthonormality of standard basis:** $\vec{i} \cdot \vec{j} = 0$, $\vec{i} \cdot \vec{i} = 1$, etc. This makes extracting coordinates easy.
- **PCA changes the basis:** PCA finds a new orthonormal basis aligned with data variance. Coordinates in the new basis are the principal component scores.
- **Not the same as coordinates vs. vectors:** coordinates are the numbers $(v_1, v_2, v_3)$; the vector is the geometric object. They are equivalent only once you have fixed a basis.
- **Column vector notation:** for matrix algebra, write as $\vec{v} = \begin{bmatrix}v_1 \\ v_2 \\ v_3\end{bmatrix}$; this is a $3 \times 1$ matrix.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Read the coordinates*
$\vec{v} = (4, -1, 2)$: $v_1 = 4$, $v_2 = -1$, $v_3 = 2$. *Step 2: Expand using basis vectors*
$\vec{v} = 4 \cdot (1,0,0) + (-1) \cdot (0,1,0) + 2 \cdot (0,0,1)$.
$= (4,0,0) + (0,-1,0) + (0,0,2)$. *Step 3: Sum to recover the original vector*
$= (4+0+0, 0+(-1)+0, 0+0+2) = (4,-1,2)$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Vector representation in standard basis ---
v1, v2, v3 = 4.0, -1.0, 2.0 # Standard basis vectors
i_hat = np.array([1.0, 0.0, 0.0])
j_hat = np.array([0.0, 1.0, 0.0])
k_hat = np.array([0.0, 0.0, 1.0]) # Reconstruct v from components
v_reconstructed = v1 * i_hat + v2 * j_hat + v3 * k_hat
v_direct = np.array([v1, v2, v3]) print(f"v (direct) = {v_direct}")
print(f"v (from basis) = {v_reconstructed}")
print(f"Equal? : {np.allclose(v_direct, v_reconstructed)}") # Extract coordinates via dot product with basis vectors
print(f"\nExtract v1 = v . i_hat : {np.dot(v_direct, i_hat)}")
print(f"Extract v2 = v . j_hat : {np.dot(v_direct, j_hat)}")
print(f"Extract v3 = v . k_hat : {np.dot(v_direct, k_hat)}")
```
#### Beginner friendly Example [R])
``` r
# -- Vector representation in standard basis ---
v1 <- 4; v2 <- -1; v3 <- 2 i_hat <- c(1, 0, 0)
j_hat <- c(0, 1, 0)
k_hat <- c(0, 0, 1) v_reconstructed <- v1 * i_hat + v2 * j_hat + v3 * k_hat
v_direct <- c(v1, v2, v3) cat("v (direct) :", v_direct, "\n")
cat("v (from basis) :", v_reconstructed, "\n")
cat("Equal? :", isTRUE(all.equal(v_direct, v_reconstructed)), "\n") # Dot product extracts coordinates
cat("\nv1 via dot:", sum(v_direct * i_hat), "\n")
cat("v2 via dot:", sum(v_direct * j_hat), "\n")
cat("v3 via dot:", sum(v_direct * k_hat), "\n")
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA np.random.seed(42) # -- Business scenario: basis change via PCA ---
# Customer feature vectors in standard basis (age, tenure, spend).
# PCA finds a new basis aligned with data variance.
# Show same data expressed in original and PCA basis. N = 200
FEATURE_NAMES = ["age", "tenure_months", "monthly_spend"] # Generate correlated customer features (standard basis coordinates)
age = np.random.normal(38, 10, N)
tenure_months = 2 * (age - 38) + np.random.normal(24, 8, N)
monthly_spend = 50 * (tenure_months / 12) + np.random.normal(200, 80, N) X = np.column_stack([age, tenure_months, monthly_spend])
X_centered = X - X.mean(axis=0) # PCA: find new orthonormal basis
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_centered) # coordinates in new (PCA) basis # Print explained variance
explained = pd.DataFrame({ "PC": [f"PC{i+1}" for i in range(3)], "explained_var_ratio": pca.explained_variance_ratio_.round(4), "basis_vector_norm": [np.linalg.norm(pca.components_[i]).round(6) for i in range(3)],
})
print("PCA basis vectors (rows are new basis vectors):")
print(pd.DataFrame(pca.components_.round(4), columns=FEATURE_NAMES, index=["PC1", "PC2", "PC3"]).to_string())
print(f"\nExplained variance:")
print(explained.to_string(index=False))
print(f"\nFirst customer in original basis: {X[0].round(2)}")
print(f"First customer in PCA basis: {X_pca[0].round(4)}")
print("\nSame geometric object; different coordinates in a different orthonormal basis.")
```
#### Final Professional Example [R]
``` r
# Basis change: same data in original vs PCA basis set.seed(42)
N <- 200
age <- rnorm(N, 38, 10)
tenure_months <- 2 * (age - 38) + rnorm(N, 24, 8)
monthly_spend <- 50 * (tenure_months / 12) + rnorm(N, 200, 80)
X <- cbind(age, tenure_months, monthly_spend)
X_centered <- scale(X, scale = FALSE)
pca <- prcomp(X_centered, rank. = 3)
X_pca <- pca$x
cat("First customer original basis:", round(X[1,], 2), "\n")
cat("First customer PCA basis:", round(X_pca[1,], 4), "\n")
cat("Same object; different coordinates.\n")
```
---
1300 pag 126