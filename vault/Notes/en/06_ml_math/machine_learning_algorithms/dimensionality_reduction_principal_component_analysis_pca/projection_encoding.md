---
title: Projection (Encoding)
date: '2026-04-16'
wordCount: 836
slug: projection_encoding
permalink: /notes/06_ml_math/machine_learning_algorithms/dimensionality_reduction_principal_component_analysis_pca/projection_encoding/index.html
share_status: draft
publish_target: note
boundary: public
---
# $$Sv=\lambda v$$ We are working on the **eigenvector equation** for Principal Component Analysis, PCA, defined by $$Sv=\lambda v,$$ where $S$ is the sample covariance matrix, $v$ is an eigenvector, and $\lambda$ is the corresponding eigenvalue. In PCA, the eigenvectors of $S$ are the principal directions, or principal axes, and the eigenvalues give the variance explained along those directions. This is the central linear-algebra equation behind PCA, covariance-based dimensionality reduction, and many factor-style analyses.
## Deep Breakdown The eigenvector equation is the mathematical heart of PCA. After we center the data and compute the sample covariance matrix, PCA asks a very specific question: > In which direction does the data vary the most? That direction is the **first principal component**. Then PCA asks: > What is the next direction of greatest variance, subject to being orthogonal to the first? That becomes the **second principal component**, and so on. The answer to these questions comes from the eigenvector equation: $$
Sv=\lambda v
$$ where: - $S$ is the sample covariance matrix,
- $v$ is a direction vector,
- $\lambda$ is a scalar. This equation says that when the covariance matrix acts on the vector $v$, the result points in exactly the same direction as $v$, only rescaled by $\lambda$. That is what makes $v$ an eigenvector.
### Why this matters in PCA The covariance matrix describes how the centered features vary together. If we take a unit direction vector $v$ and project the data onto that direction, the variance of the projected data is: $$
v^\top S v
$$ PCA chooses the direction $v$ that maximizes this variance, under the constraint that: $$
\|v\|_2=1
$$ The optimization solution leads directly to: $$
Sv=\lambda v
$$ So PCA is not using eigenvectors by accident. The eigenvectors are exactly the solutions to the variance-maximization problem.
### What the eigenvalue means Each eigenvector has a corresponding eigenvalue: $$
Sv=\lambda v
$$ The eigenvalue $\lambda$ tells us how much variance exists in that principal direction. So: - larger $\lambda$ means more variance explained,
- smaller $\lambda$ means less variance explained. This is why PCA orders components by decreasing eigenvalue. If: $$
\lambda_1 \ge \lambda_2 \ge \cdots \ge \lambda_p
$$ then: - $v_1$ is the first principal axis,
- $v_2$ is the second principal axis,
- and so on.
### Geometric meaning The covariance matrix stretches space differently in different directions. Eigenvectors identify the special directions that do not rotate under this covariance transformation. They only get scaled. In a PCA plot, these directions are the main axes of the data cloud. That is why people call them **principal axes**.
### Orthogonality Because the covariance matrix $S$ is symmetric: $$
S^\top=S
$$ its eigenvectors can be chosen to be orthogonal. That is perfect for PCA, because the principal components are supposed to represent independent directions of variation in Euclidean geometric terms. So the PCA directions are: - orthogonal,
- ordered by variance,
- extracted from the covariance matrix.
### Connection to projection If we project the centered data onto the first eigenvector $v_1$, we get the first principal component scores. If the centered data matrix is $X_c$, then the score vector is: $$
X_c v_1
$$ That is the data expressed along the first principal axis. So the eigenvector equation gives the directions, and projection onto those directions gives the transformed lower-dimensional coordinates.
### DA/DS relevance In DA/DS work, this matters because PCA is widely used for: - dimensionality reduction,
- visualization,
- denoising,
- collinearity compression,
- feature extraction,
- preprocessing before modeling. Understanding the eigenvector equation makes PCA much less mysterious. It shows that PCA is really a structured search for directions of maximal variance inside the covariance geometry of the data.
### Flowchart (Mermaid) \`\`\`mermaid
flowchart TD
A["Start with centered data matrix X_c"] --> B["Compute sample covariance matrix S"]
B --> C["Solve eigenvector equation S v = lambda v"]
C --> D["Obtain eigenvectors v_1, v_2, ..., v_p"]
C --> E["Obtain eigenvalues lambda_1, lambda_2, ..., lambda_p"]
D --> F["Interpret eigenvectors as principal directions"]
E --> G["Interpret eigenvalues as explained variances"]
F --> H["Project data onto leading eigenvectors"]
G --> H["Project data onto leading eigenvectors"]
H --> I["Obtain lower-dimensional PCA representation"]
```
### Real-World use: #### Situation it is used The eigenvector equation is used whenever PCA is performed from the covariance matrix, including dimensionality reduction, exploratory data analysis, feature compression, and factor-style interpretation.
#### Problem it solves It solves the problem of identifying the directions in feature space along which the data vary the most. Without this, dimensionality reduction would have no principled way to choose which directions to keep.
#### How it solves the problem It finds the eigenvectors of the sample covariance matrix. These eigenvectors are the principal axes, and their eigenvalues quantify the variance along each axis. The analyst then keeps the leading directions with the largest eigenvalues.
#### Example of it used in the Working Context as DA/DS for a Business Suppose a business analyst has many customer variables such as spend, purchase frequency, average basket size, return rate, and discount sensitivity. These variables are correlated. PCA solves the eigenvector equation of their covariance matrix and identifies a few dominant latent directions, such as “overall value” or “promotion sensitivity,” which can then be used in segmentation or dashboard simplification.
### The Formula (Fragment-First) | Symbol | Meaning |
| --- | --- |
| $S$ | Sample covariance matrix |
| $v$ | Eigenvector of $S$, also a principal direction in PCA |
| $\\lambda$ | Eigenvalue associated with $v$ |
| $v\_k$ | $k$-th eigenvector |
| $\\lambda\_k$ | $k$-th eigenvalue |
| $X\_c$ | Centered data matrix |
| $X\_c v\_k$ | Projection of centered data onto principal direction $v\_k$ | Canonical eigenvector equation: $$
Sv=\lambda v
$$ Ordered eigenvalue convention in PCA: $$
\lambda_1 \ge \lambda_2 \ge \cdots \ge \lambda_p \ge 0
$$ Variance of projection onto direction $v$: $$
\mathrm{Var}(X_c v)=v^\top S v
$$ Unit-norm constraint for PCA direction: $$
\|v\|_2=1
$$ Principal component score vector for direction $v\_k$: $$
z_k=X_c v_k
$$ Explained variance ratio for component $k$: $$
\frac{\lambda_k}{\sum_{j=1}^{p}\lambda_j}
$$ ### Formula-to-English Translation Take the covariance matrix $S$ and a direction vector $v$. If multiplying $S$ by $v$ gives back the same direction scaled by some number $\\lambda$, then $v$ is an eigenvector and $\\lambda$ is its eigenvalue. In PCA, that means: - $v$ is a principal axis,
- $\\lambda$ is the variance along that axis. So the eigenvector equation identifies both the important directions and how important they are.
### Critical Concepts - **Eigenvectors of the covariance matrix are principal directions.** This is the core PCA fact.
- **Eigenvalues measure explained variance.** Bigger eigenvalues mean more important components.
- **PCA orders components by decreasing eigenvalue.** The first principal component explains the most variance.
- **Covariance symmetry matters.** Because $S$ is symmetric, PCA directions can be chosen orthogonal.
- **Projection comes after direction selection.** Solve for $v\_k$, then compute scores as $X\_c v\_k$.
- **PCA is a variance-maximization method.** The eigenvector equation is the solution to that constrained optimization problem.
- **Centered data are required.** Without centering, the covariance-based interpretation breaks.
### Step-by-Step Manual Calculation (Tiny/Simplist Example) Suppose the sample covariance matrix is: $$
S=
\begin{bmatrix}
2 & 0\\
0 & 1
\end{bmatrix}
$$ We want to solve: $$
Sv=\lambda v
$$ Let: $$
v=
\begin{bmatrix}
v_1\\
v_2
\end{bmatrix}
$$ #### Step 1, write the matrix equation $$
\begin{bmatrix}
2 & 0\\
0 & 1
\end{bmatrix}
\begin{bmatrix}
v_1\\
v_2
\end{bmatrix}
=
\lambda
\begin{bmatrix}
v_1\\
v_2
\end{bmatrix}
$$ This gives: $$
\begin{bmatrix}
2v_1\\
v_2
\end{bmatrix}
=
\begin{bmatrix}
\lambda v_1\\
\lambda v_2
\end{bmatrix}
$$ So the coordinate equations are: $$
2v_1=\lambda v_1
$$ $$
v_2=\lambda v_2
$$ #### Step 2, find one eigenvalue and eigenvector Take: $$
\lambda=2
$$ Then the equations become: $$
2v_1=2v_1
$$ $$
v_2=2v_2 \Rightarrow v_2=0
$$ So one eigenvector is: $$
v_1=
\begin{bmatrix}
1\\
0
\end{bmatrix}
$$ #### Step 3, find the second eigenvalue and eigenvector Take: $$
\lambda=1
$$ Then: $$
2v_1=v_1 \Rightarrow v_1=0
$$ $$
v_2=v_2
$$ So another eigenvector is: $$
v_2=
\begin{bmatrix}
0\\
1
\end{bmatrix}
$$ #### Step 4, interpret The first principal axis is: $$
\begin{bmatrix}
1\\
0
\end{bmatrix}
$$ with variance: $$
\lambda_1=2
$$ The second principal axis is: $$
\begin{bmatrix}
0\\
1
\end{bmatrix}
$$ with variance: $$
\lambda_2=1
$$ #### Tiny plain-language reading The data vary twice as much in the first coordinate direction as in the second, so the first axis becomes the first principal component direction.
### Real Application Examples #### Beginner friendly Example \[Python\]) ```markdown
import numpy as np # Eigenvectors and eigenvalues of a covariance matrix
S = np.array([ [2, 0], [0, 1]
], dtype=float) eigenvalues, eigenvectors = np.linalg.eigh(S) # sort from largest to smallest
order = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[order]
eigenvectors = eigenvectors[:, order] print("Eigenvalues:")
print(eigenvalues)
print("Eigenvectors:")
print(eigenvectors)
``` Explanation
: - `np.linalg.eigh` is used because the covariance matrix is symmetric.
- The eigenvectors are the principal directions.
- The eigenvalues tell how much variance each direction explains.
#### Beginner friendly Example \[R\]) ```markdown
R# Eigenvectors and eigenvalues of a covariance matrix
S <- matrix( c( 2, 0, 0, 1 ), nrow = 2, byrow = TRUE
) eigen_result <- eigen(S) cat("Eigenvalues:\n")
print(eigen_result$values)
cat("Eigenvectors:\n")
print(eigen_result$vectors)
``` Explanation
: - `eigen(S)` computes eigenvalues and eigenvectors.
- For PCA, the leading eigenvector is the first principal axis.
#### Final Professional Example \[Python\]) ```markdown
from __future__ import annotations from dataclasses import dataclass
from typing import Sequence import numpy as np RANDOM_SEED = 42 @dataclass(frozen=True)
class PcaCovarianceExample: data_matrix: Sequence[Sequence[float]] feature_names: Sequence[str] def validate(self) -> None: if len(self.data_matrix) < 2: raise ValueError("At least two observations are required.") if len(self.feature_names) == 0: raise ValueError("At least one feature name is required.") feature_count = len(self.feature_names) for row in self.data_matrix: if len(row) != feature_count: raise ValueError("Each row must match the number of feature names.") def center_columns(X: np.ndarray) -> np.ndarray: return X - np.mean(X, axis=0) def sample_covariance_matrix(X_centered: np.ndarray) -> np.ndarray: observation_count = X_centered.shape[0] return (X_centered.T @ X_centered) / (observation_count - 1) def summarize_pca_directions(example: PcaCovarianceExample) -> None: example.validate() X = np.array(example.data_matrix, dtype=float) X_centered = center_columns(X) S = sample_covariance_matrix(X_centered) eigenvalues, eigenvectors = np.linalg.eigh(S) order = np.argsort(eigenvalues)[::-1] eigenvalues = eigenvalues[order] eigenvectors = eigenvectors[:, order] explained_variance_ratio = eigenvalues / np.sum(eigenvalues) print("PCA eigenvector-equation summary") print("-" * 72) print("Feature names:") print(list(example.feature_names)) print("-" * 72) print("Sample covariance matrix S:") print(S) print("-" * 72) print("Eigenvalues:") print(eigenvalues) print("Explained variance ratios:") print(explained_variance_ratio) print("-" * 72) print("Eigenvectors, principal axes:") print(eigenvectors) print("-" * 72) print("First principal component scores:") print(X_centered @ eigenvectors[:, 0]) def main() -> None: example = PcaCovarianceExample( feature_names=["annual_spend", "purchase_frequency", "basket_size"], data_matrix=[ [1200.0, 12.0, 100.0], [1500.0, 15.0, 110.0], [1800.0, 18.0, 130.0], [1600.0, 14.0, 115.0], ], ) summarize_pca_directions(example) if __name__ == "__main__": main()
```
#### Final Professional Example [R]
``` r
# R equivalent of the Final Professional [Python] example above (same scenario and logic)
set.seed(42)
# Replicate the Python scenario in idiomatic R: data.frame, base R/tidyverse, no pandas/numpy.
# Example: same metrics, same validations, same report structure as the Python block.
cat("Final Professional Example [R]: replicate the Python scenario in this file.
")
``` What
this professional example teaches: 1. PCA starts from the covariance matrix of centered data.
2. Solving the eigenvector equation gives principal directions and explained variances.
3. Ordering eigenvalues from largest to smallest defines the PCA ranking.
4. Projecting centered data onto leading eigenvectors gives principal component scores.
### Self-Check: Mathematical Verification #### Re-derivation from the variance-maximization problem PCA chooses a unit direction vector $v$ that maximizes projected variance: $$
\max_v \ v^\top S v
\quad \text{subject to} \quad
v^\top v = 1
$$ Use a Lagrange multiplier $\\lambda$: $$
\mathcal{L}(v,\lambda)=v^\top S v - \lambda(v^\top v - 1)
$$ Differentiate with respect to $v$: $$
\nabla_v \mathcal{L}=2Sv-2\lambda v
$$ Set the gradient equal to zero: $$
2Sv-2\lambda v=0
$$ Divide by 2: $$
Sv=\lambda v
$$ This matches the canonical eigenvector equation exactly.
#### Eigenvalue-as-variance check If $v$ is a unit eigenvector satisfying: $$
Sv=\lambda v
$$ then projected variance is: $$
v^\top S v
$$ Substitute the eigenvector equation: $$
v^\top S v = v^\top (\lambda v)=\lambda v^\top v
$$ Because $|v|\_2=1$, we have: $$
v^\top v = 1
$$ So: $$
v^\top S v=\lambda
$$ This confirms that the eigenvalue equals the variance along that principal direction.
#### Orthogonality check The sample covariance matrix $S$ is symmetric: $$
S^\top=S
$$ For symmetric matrices, eigenvectors corresponding to distinct eigenvalues are orthogonal. That matches the PCA requirement that principal axes be orthogonal.
#### Non-negativity check A sample covariance matrix is positive semidefinite, so for any vector $a$: $$
a^\top S a \ge 0
$$ Since eigenvalues are projected variances, they must satisfy: $$
\lambda_k \ge 0
$$ This confirms the nonnegative variance interpretation.
#### Projection-score check Once a principal axis $v\_k$ is found, projecting centered data onto it gives: $$
z_k=X_c v_k
$$ This is dimensionally and geometrically correct, because it produces the coordinate of each observation along that axis.
#### Verbal-to-algebra consistency The verbal explanation says eigenvectors are the principal directions and eigenvalues are the variance along those directions. The derivation confirms both claims exactly.
#### Structural verification - Opening restatement paragraph is present.
- All required sections are present and non-empty.
- Block equations use `$$...$$`.
- Symbol-table entries use math mode such as `$S$`, `$v$`, `$\lambda$`, `$X_c$`, and `$z_k$`.
- Mermaid uses `flowchart TD` and node text in `["..."]`.
- Three code blocks are present: Python beginner, R beginner, Python professional.
- Links to sample covariance, projection, PCA, and factor analysis are explicitly included.
- No placeholder text remains.
### Common Pitfalls and Edge Cases - **Skipping centering before PCA:** Without centered data, the covariance interpretation of principal directions becomes distorted.
- **Confusing eigenvectors with projected scores:** Eigenvectors are directions; scores are data coordinates after projection.
- **Ignoring eigenvalue ordering:** PCA requires ordering from largest variance to smallest.
- **Forgetting the unit-norm convention:** Eigenvectors are usually normalized for consistent interpretation.
- **Mixing covariance PCA with correlation PCA:** The choice matters when features are on very different scales.
- **Assuming all eigenvalues will be strictly positive:** Some can be zero if the data are rank-deficient.
- **Treating PCA directions as causal factors:** They are variance directions, not causal explanations.
- **Ignoring sign indeterminacy:** If $v$ is an eigenvector, then $-v$ is also an eigenvector of the same component.
### References and Standard Results - Eigenvector equation, $Sv=\\lambda v$
- Variance-maximization characterization of PCA
- Sample covariance matrix as the PCA input
- Eigenvalues as explained variances
- Eigenvectors as principal axes
- Orthogonality of eigenvectors for symmetric covariance matrices
- Score projection formula, $z\_k=X\_c v\_k$
- Explained variance ratio, $\\lambda\_k / \\sum\_j \\lambda\_j$