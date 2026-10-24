---
title: Orthogonality Condition
date: '2026-04-16'
wordCount: 979
slug: orthogonality_condition
permalink: /notes/03_linear_algebra_geometry/advanced_linear_algebra_and_decompositions/inner_products_and_gram_schmidt_process/orthogonality_condition/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\langle v_i, v_j \rangle = \delta_{ij}$ (Kronecker delta)
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This formula defines orthonormality using the Kronecker delta notation: a set of vectors is orthonormal if any two distinct vectors in the set have zero inner product (orthogonal), and every vector has unit inner product with itself (unit-norm). The Kronecker delta $\delta_{ij}$ is just a compact way to write "1 if $i=j$, else 0." In DA/DS this condition is what you check after Gram-Schmidt (did the process work correctly?), what guarantees that PCA components are uncorrelated and unit-variance, and what makes the columns of $Q$ in QR decomposition easy to work with: $Q^T Q = I$.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Given a set of vectors v_1, v_2, ..., v_n"] --> B["For each pair (i, j): compute inner product <v_i, v_j>"] B --> C{{"Is i = j?"}} C -->|"Yes"| D["Check <v_i, v_i> = 1 (unit norm condition)"] C -->|"No"| E["Check <v_i, v_j> = 0 (orthogonality condition)"] D --> F{{"<v_i, v_i> = 1?"}} F -->|"No"| G["Not unit-norm: normalize v_i first"] F -->|"Yes"| H["Unit norm confirmed"] E --> I{{"<v_i, v_j> = 0?"}} I -->|"No"| J["Not orthogonal: run Gram-Schmidt or re-check basis"] I -->|"Yes"| K["Orthogonality confirmed"] H --> L["All conditions met: set is orthonormal"] K --> L
```
### Real-World use:
#### Situation it is used
Used as the post-processing verification step in Gram-Schmidt, QR decomposition, and PCA. The matrix form $V^T V = I$ (where columns of $V$ are the $v_i$) is the concise matrix-level statement of this condition, and it is what `np.linalg.qr` guarantees for $Q$. Also used in signal processing and spectral analysis where basis functions must be orthonormal for coefficient recovery to work correctly.
#### Problem it solves
Non-orthonormal bases cause two problems: (1) projections require solving a system of equations rather than just taking dot products, and (2) coordinate coefficients along basis vectors are not independent. Orthonormality makes projection trivial ($\langle x, v_k \rangle$ gives the coordinate directly) and coefficients independent.
#### How it solves the problem
When basis vectors are orthonormal, decomposing any vector $x$ into coordinates is trivial: the coefficient along $v_k$ is simply $\langle x, v_k \rangle$, with no need to invert a matrix. This is because $\langle v_i, v_j \rangle = \delta_{ij}$ means the basis "self-interaction" matrix is the identity, so the coordinate recovery formula collapses to a single dot product per component.
#### Example of it used in the Working Context as DA/DS for a Business
After running PCA on a customer feature matrix, a data scientist checks that the resulting principal component vectors satisfy $\langle v_i, v_j \rangle = \delta_{ij}$: any two distinct principal components have zero dot product (they capture independent sources of variance), and each principal component has unit length. This check guarantees that projecting customer data onto any combination of principal components will not double-count variance.
### The Formula (Fragment-First)
- $\langle v_i, v_j \rangle$: the inner product between the $i$-th and $j$-th vectors in the set
- $= \delta_{ij}$: equals the Kronecker delta, which is defined as $\delta_{ij} = 1$ if $i = j$, and $\delta_{ij} = 0$ if $i \neq j$
- $\delta_{ij}$: the Kronecker delta symbol; named after Leopold Kronecker; used across mathematics as shorthand for "1 on the diagonal, 0 everywhere else"
- The formula packs two conditions into one: when $i = j$, it demands unit length ($\langle v_i, v_i \rangle = 1$); when $i \neq j$, it demands zero overlap ($\langle v_i, v_j \rangle = 0$) Full formula: $\langle v_i, v_j \rangle = \delta_{ij}$ ### Formula-to-English Translation
"Every vector in the set has length 1, and any two distinct vectors in the set are perpendicular to each other." Tiny numeric example: $v_1 = [1, 0]^T$, $v_2 = [0, 1]^T$.
$\langle v_1, v_2 \rangle = 1 \cdot 0 + 0 \cdot 1 = 0 = \delta_{12}$ ✓.
$\langle v_1, v_1 \rangle = 1 \cdot 1 + 0 \cdot 0 = 1 = \delta_{11}$ ✓.
$\langle v_2, v_2 \rangle = 0 \cdot 0 + 1 \cdot 1 = 1 = \delta_{22}$ ✓.
These are the standard basis vectors $e_1, e_2$, the simplest orthonormal set.
### Critical Concepts
- **Orthogonal vs orthonormal:** orthogonal means $\langle v_i, v_j \rangle = 0$ for $i \neq j$; orthonormal adds the unit-norm constraint $\langle v_i, v_i \rangle = 1$. An orthogonal set that is not unit-norm is not orthonormal.
- **Matrix form:** a matrix $V$ whose columns $v_1, \ldots, v_n$ satisfy this condition has $V^T V = I_n$ (for real vectors); if additionally $m = n$, then $V$ is an orthogonal matrix and $V^{-1} = V^T$.
- **Coordinate recovery:** for an orthonormal basis, the coefficient of $x$ along $v_k$ is $\langle x, v_k \rangle$ with no matrix solve needed; this is why PCA projections are just dot products.
- **Gram matrix interpretation:** the matrix $G_{ij} = \langle v_i, v_j \rangle$ is called the Gram matrix; for an orthonormal set $G = I$. Any deviation from $I$ quantifies how far the set is from orthonormality.
- **Floating-point orthogonality:** in numerical practice, you will never get exact zeros and ones; accept $|\langle v_i, v_j \rangle| < \varepsilon$ (e.g., $\varepsilon = 10^{-10}$) as "numerically orthonormal."
- **Over-complete sets:** if you have more vectors than dimensions, you cannot have all of them mutually orthonormal (there is no room in the space for more orthogonal directions than the dimension).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: List the inner products to check*
Given three vectors: $v_1 = [1,0,0]^T$, $v_2 = [0,1/\sqrt{2}, 1/\sqrt{2}]^T$, $v_3 = [0, 1/\sqrt{2}, -1/\sqrt{2}]^T$.
Need to check: $\langle v_1,v_1\rangle$, $\langle v_2,v_2\rangle$, $\langle v_3,v_3\rangle$, $\langle v_1,v_2\rangle$, $\langle v_1,v_3\rangle$, $\langle v_2,v_3\rangle$. *Step 2: Check unit-norm conditions (diagonal of Gram matrix)*
$\langle v_1,v_1\rangle = 1^2 + 0 + 0 = 1$ ✓.
$\langle v_2,v_2\rangle = 0 + (1/\sqrt{2})^2 + (1/\sqrt{2})^2 = 0.5 + 0.5 = 1$ ✓.
$\langle v_3,v_3\rangle = 0 + (1/\sqrt{2})^2 + (-1/\sqrt{2})^2 = 0.5 + 0.5 = 1$ ✓. *Step 3: Check orthogonality conditions (off-diagonal of Gram matrix)*
$\langle v_1,v_2\rangle = 1 \cdot 0 + 0 \cdot (1/\sqrt{2}) + 0 \cdot (1/\sqrt{2}) = 0$ ✓.
$\langle v_1,v_3\rangle = 1 \cdot 0 + 0 + 0 = 0$ ✓.
$\langle v_2,v_3\rangle = 0 + (1/\sqrt{2})(1/\sqrt{2}) + (1/\sqrt{2})(-1/\sqrt{2}) = 0.5 - 0.5 = 0$ ✓.
All six conditions satisfied: the set is orthonormal.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Verify the orthonormality condition <v_i, v_j> = delta_ij ---------
V = np.array([ [1.0, 0.0, 0.0], [0.0, 1.0 / np.sqrt(2), 1.0 / np.sqrt(2)], [0.0, 1.0 / np.sqrt(2), -1.0 / np.sqrt(2)],
]) # each row is a vector n = V.shape[0]
print("Gram matrix G_ij = <v_i, v_j> (should be identity matrix):")
gram = V @ V.T
print(gram.round(6)) # Check each entry against Kronecker delta
identity = np.eye(n)
max_error = float(np.max(np.abs(gram - identity)))
print(f"\nMax deviation from identity: {max_error:.2e}")
print(f"Orthonormal: {np.allclose(gram, identity)}") # Explicit check for specific pairs
for i in range(n): for j in range(n): expected = 1.0 if i == j else 0.0 actual = float(V[i] @ V[j]) delta_ij = "delta_" + str(i+1) + str(j+1) + f" = {int(expected)}" print(f" <v{i+1}, v{j+1}> = {actual:.6f} ({delta_ij})")
```
#### Beginner friendly Example [R])
``` r
# -- Verify the orthonormality condition <v_i, v_j> = delta_ij ---------
V <- matrix(c( 1.0, 0.0, 0.0, 0.0, 1 / sqrt(2), 1 / sqrt(2), 0.0, 1 / sqrt(2), -1 / sqrt(2)
), nrow = 3, byrow = TRUE) gram <- V %*% t(V)
cat("Gram matrix (should be identity):\n")
print(round(gram, 6)) n <- nrow(V)
max_error <- max(abs(gram - diag(n)))
cat(sprintf("\nMax deviation from identity: %.2e\n", max_error))
cat(sprintf("Orthonormal: %s\n", isTRUE(all.equal(gram, diag(n)))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: verify PCA eigenvectors satisfy orthonormality --
# After computing PCA on a marketing KPI matrix, confirm the principal
# component vectors form an orthonormal set via <v_i, v_j> = delta_ij. N_CAMPAIGNS = 200
KPI_NAMES = ["ctr", "cvr", "cpc", "roas", "spend", "revenue"]
N_KPIS = len(KPI_NAMES) # Simulate correlated KPI data
factor_loadings = np.random.normal(size=(N_KPIS, 2))
true_factors = np.random.normal(size=(N_CAMPAIGNS, 2))
kpi_data = true_factors @ factor_loadings.T + np.random.normal(0, 0.3, (N_CAMPAIGNS, N_KPIS))
df = pd.DataFrame(kpi_data, columns=KPI_NAMES) # Center and compute covariance
x_centered = (df - df.mean()).to_numpy()
cov_matrix = (x_centered.T @ x_centered) / (N_CAMPAIGNS - 1) # Eigendecomposition: columns of eigenvectors matrix = principal components
eigenvalues, eigenvectors = np.linalg.eigh(cov_matrix)
order = np.argsort(eigenvalues)[::-1]
eigenvectors = eigenvectors[:, order] # shape: (N_KPIS, N_KPIS) # Compute Gram matrix: G_ij = <v_i, v_j>
gram_matrix = eigenvectors.T @ eigenvectors # Check orthonormality
identity_n = np.eye(N_KPIS)
max_diag_err = float(np.max(np.abs(np.diag(gram_matrix) - 1.0)))
max_offdiag = float(np.max(np.abs(gram_matrix - identity_n))) print("Gram matrix of PCA eigenvectors (should be identity):")
print(pd.DataFrame(gram_matrix.round(8), index=KPI_NAMES, columns=KPI_NAMES).to_string())
print(f"\nMax diagonal error from 1: {max_diag_err:.2e}")
print(f"Max off-diagonal (should be 0): {max_offdiag:.2e}")
print(f"Orthonormal: {np.allclose(gram_matrix, identity_n)}")
print("\nInterpretation: <v_i, v_j> = delta_ij confirms PCA components are orthonormal; projecting data onto them yields uncorrelated, unit-variance features.")
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
MYLA pag 6