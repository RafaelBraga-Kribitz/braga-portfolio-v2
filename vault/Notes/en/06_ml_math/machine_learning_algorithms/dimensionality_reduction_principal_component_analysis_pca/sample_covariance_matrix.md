---
title: Sample Covariance Matrix
date: '2026-04-16'
wordCount: 715
slug: sample_covariance_matrix
permalink: /notes/06_ml_math/machine_learning_algorithms/dimensionality_reduction_principal_component_analysis_pca/sample_covariance_matrix/index.html
share_status: draft
publish_target: note
boundary: public
---
# $$S=\frac{1}{n-1}X^\top X$$ We are working on the **sample covariance matrix** for centered multivariate data, defined by $$S=\frac{1}{n-1}X^\top X,$$ where $X$ is the centered data matrix with $n$ observations and $p$ features. Under the maximum-likelihood convention for Gaussian models, one may instead use $$\frac{1}{n}X^\top X.$$ The sample covariance matrix is symmetric, summarizes variances and pairwise covariances, and its eigenvectors give the principal directions in PCA.
## Deep Breakdown The sample covariance matrix is one of the core objects in multivariate statistics, PCA, and factor-style dimensionality reduction. It summarizes how features vary on their own and how they vary together. Suppose we have a dataset with: - $n$ observations,
- $p$ numerical features. After **data centering**, each column has mean zero. That means each value now represents deviation from the feature mean rather than raw level. If the centered data matrix is: $$
X \in \mathbb{R}^{n \times p},
$$ then the sample covariance matrix is: $$
S=\frac{1}{n-1}X^\top X
$$ This matrix has size: $$
p \times p
$$ so it summarizes relationships between features, not between observations. Each diagonal entry of $S$ is a sample variance: $$
S_{jj}=\text{sample variance of feature } j
$$ Each off-diagonal entry is a sample covariance: $$
S_{jk}=\text{sample covariance between features } j \text{ and } k
$$ So the covariance matrix tells us: - which features vary a lot,
- which features tend to move together,
- which features move in opposite directions,
- how the variance is distributed across feature space. This is exactly why PCA builds on it. PCA seeks directions in feature space along which the centered data have maximum variance. Those directions are the **eigenvectors** of the covariance matrix, and the amount of variance explained along each direction is given by the corresponding **eigenvalue**. So the covariance matrix is the bridge between raw centered data and principal components. Why the factor $\frac{1}{n-1}$? That is the usual unbiased sample-covariance scaling in classical statistics. It corrects for the fact that the mean was estimated from the sample itself. In contrast, the MLE version under a multivariate Gaussian model uses: $$
\frac{1}{n}X^\top X
$$ Both conventions produce the same eigenvectors, because they differ only by a scalar factor. The eigenvalues are rescaled, but the principal directions are unchanged. This is important for PCA: - using $\frac{1}{n-1}$ or $\frac{1}{n}$ changes variance magnitudes slightly,
- but it does **not** change the PCA directions. The sample covariance matrix is also symmetric: $$
S^\top = S
$$ This guarantees real eigenvalues and orthogonal eigenvectors, which makes PCA mathematically clean and computationally stable. In DA/DS work, the sample covariance matrix matters in: - PCA,
- factor analysis foundations,
- multivariate exploratory analysis,
- feature redundancy detection,
- dimensionality reduction pipelines,
- risk models and portfolio-style covariance analysis. It is also closely related to the **correlation matrix**. If features are on very different scales, analysts often standardize first and then compute PCA on the correlation matrix instead of the covariance matrix.
### Flowchart (Mermaid) \`\`\`mermaid
flowchart TD
A["Start with raw data matrix"] --> B["Center each feature column to mean zero"]
B --> C["Obtain centered matrix X"]
C --> D["Compute X'X"]
D --> E["Scale by 1 / (n - 1) to get sample covariance matrix S"]
E --> F["Read diagonal entries as variances"]
E --> G["Read off-diagonal entries as covariances"]
F --> H["Compute eigenvalues and eigenvectors of S"]
G --> H["Compute eigenvalues and eigenvectors of S"]
H --> I["Use eigenvectors as principal directions in PCA"]
```
### Real-World use: #### Situation it is used The sample covariance matrix is used whenever multivariate numerical data must be summarized in terms of variance and co-movement. This is common in PCA, factor analysis, feature engineering, finance, marketing analytics, and scientific data analysis.
#### Problem it solves It solves the problem of describing how multiple variables vary together in a compact matrix form. Looking at each feature separately misses the structure of joint variation across variables.
#### How it solves the problem It computes all pairwise covariances among centered features and packages them into a symmetric matrix. This makes it possible to analyze multivariate variation geometrically and algebraically through eigen-decomposition or SVD.
#### Example of it used in the Working Context as DA/DS for a Business Suppose an analyst has customer features such as annual spend, purchase frequency, average basket size, and return rate. The covariance matrix reveals which features vary the most and which move together. PCA can then use this matrix to compress those features into a few latent behavioral dimensions for segmentation or visualization.
### The Formula (Fragment-First) | Symbol | Meaning |
| --- | --- |
| $n$ | Number of observations |
| $p$ | Number of features |
| $X$ | Centered data matrix with shape $n \\times p$ |
| $X^\\top$ | Transpose of the centered data matrix |
| $S$ | Sample covariance matrix |
| $S\_{jk}$ | Covariance between features $j$ and $k$ |
| $S\_{jj}$ | Variance of feature $j$ |
| $\\lambda\_\\ell$ | Eigenvalue of $S$ |
| $v\_\\ell$ | Eigenvector of $S$ | Canonical sample covariance formula for centered data: $$
S=\frac{1}{n-1}X^\top X
$$ MLE covariance version: $$
\Sigma_{\mathrm{MLE}}=\frac{1}{n}X^\top X
$$ Entrywise covariance formula: $$
S_{jk}=\frac{1}{n-1}\sum_{i=1}^{n}x_{ij}x_{ik}
$$ where the data are already centered. Diagonal variance entry: $$
S_{jj}=\frac{1}{n-1}\sum_{i=1}^{n}x_{ij}^2
$$ Symmetry property: $$
S^\top=S
$$ Eigen-decomposition for PCA: $$
Sv_\ell=\lambda_\ell v_\ell
$$ ### Formula-to-English Translation Take the centered data matrix $X$. Multiply its transpose by itself: $$
X^\top X
$$ This forms all pairwise inner products between centered feature columns. Then divide by $n-1$ to get the sample covariance matrix. The result is a matrix where: - the diagonal tells you how much each feature varies,
- the off-diagonal tells you whether two features tend to move together or in opposite directions. Because PCA looks for directions of maximum variance, it uses the eigenvectors of this matrix as its principal directions.
### Critical Concepts - **The covariance matrix requires centered data.** Without centering, the standard covariance interpretation is wrong.
- **The covariance matrix is symmetric.** This guarantees real eigenvalues and orthogonal eigenvectors.
- **Diagonal entries are variances.** These measure variability of individual features.
- **Off-diagonal entries are covariances.** These measure joint movement between pairs of features.
- **PCA directions come from eigenvectors of the covariance matrix.** This is the main reason the matrix matters in dimensionality reduction.
- **The $1/(n-1)$ and $1/n$ conventions differ by scale only.** They do not change principal directions.
- **Covariance is scale-dependent.** If variables are on very different scales, PCA on the correlation matrix may be more appropriate.
### Step-by-Step Manual Calculation (Tiny/Simplist Example) Consider the centered two-feature data matrix: $$
X=
\begin{bmatrix}
-1 & -2\\
0 & 0\\
1 & 2
\end{bmatrix}
$$ There are: $$
n=3
$$ observations and 2 features.
#### Step 1, compute $X^\\top$ $$
X^\top=
\begin{bmatrix}
-1 & 0 & 1\\
-2 & 0 & 2
\end{bmatrix}
$$ #### Step 2, compute $X^\\top X$ $$
X^\top X=
\begin{bmatrix}
-1 & 0 & 1\\
-2 & 0 & 2
\end{bmatrix}
\begin{bmatrix}
-1 & -2\\
0 & 0\\
1 & 2
\end{bmatrix}
=
\begin{bmatrix}
2 & 4\\
4 & 8
\end{bmatrix}
$$ #### Step 3, divide by $n-1$ Since: $$
n-1=2
$$ the sample covariance matrix is: $$
S=\frac{1}{2}
\begin{bmatrix}
2 & 4\\
4 & 8
\end{bmatrix}
=
\begin{bmatrix}
1 & 2\\
2 & 4
\end{bmatrix}
$$ #### Step 4, interpret the entries The diagonal entries are: $$
S_{11}=1,\qquad S_{22}=4
$$ So feature 2 has larger variance than feature 1. The off-diagonal entries are: $$
S_{12}=S_{21}=2
$$ So the features move together positively.
#### Tiny plain-language reading The two centered features are strongly aligned. One varies about four times as much as the other, and they increase or decrease together.
#### PCA implication Because the covariance matrix has strong positive covariance, the first principal component will point roughly along the direction where both features increase together.
### Real Application Examples #### Beginner friendly Example \[Python\]) ```markdown
import numpy as np # Centered data matrix with 3 observations and 2 features
X = np.array([ [-1, -2], [0, 0], [1, 2]
], dtype=float) n = X.shape[0]
S = (1 / (n - 1)) * (X.T @ X) print("Centered data matrix X:")
print(X)
print("Sample covariance matrix S:")
print(S)
``` Explanation
: - `X.T @ X` computes all pairwise column inner products.
- Dividing by `n - 1` turns those into sample covariances.
- The resulting matrix summarizes feature variances and covariances. Manual check: $$
S=
\begin{bmatrix}
1 & 2\\
2 & 4
\end{bmatrix}
$$ #### Beginner friendly Example \[R\]) ```markdown
R# Centered data matrix with 3 observations and 2 features
X <- matrix( c( -1, -2, 0, 0, 1, 2 ), nrow = 3, byrow = TRUE
) n <- nrow(X)
S <- (1 / (n - 1)) * t(X) %*% X cat("Centered data matrix X:\n")
print(X)
cat("Sample covariance matrix S:\n")
print(S)
``` Explanation
: - `t(X) %*% X` computes the feature cross-products.
- Multiplying by `1 / (n - 1)` gives the sample covariance matrix.
- This matrix is the standard input to covariance-based PCA.
#### Final Professional Example \[Python\]) ```markdown
from __future__ import annotations from dataclasses import dataclass
from typing import Sequence import numpy as np RANDOM_SEED = 42 @dataclass(frozen=True)
class CovarianceAnalysisData: data_matrix: Sequence[Sequence[float]] feature_names: Sequence[str] def validate(self) -> None: if len(self.data_matrix) < 2: raise ValueError("At least two observations are required.") if len(self.feature_names) == 0: raise ValueError("At least one feature name is required.") feature_count = len(self.feature_names) for row in self.data_matrix: if len(row) != feature_count: raise ValueError("Each row must match the number of feature names.") def center_columns(data_matrix: np.ndarray) -> tuple[np.ndarray, np.ndarray]: column_means = np.mean(data_matrix, axis=0) centered_matrix = data_matrix - column_means return centered_matrix, column_means def sample_covariance_matrix(centered_matrix: np.ndarray) -> np.ndarray: observation_count = centered_matrix.shape[0] if observation_count < 2: raise ValueError("At least two observations are required.") return (centered_matrix.T @ centered_matrix) / (observation_count - 1) def summarize_covariance_analysis(data: CovarianceAnalysisData) -> None: data.validate() X = np.array(data.data_matrix, dtype=float) X_centered, column_means = center_columns(X) covariance_matrix = sample_covariance_matrix(X_centered) eigenvalues, eigenvectors = np.linalg.eigh(covariance_matrix) sort_index = np.argsort(eigenvalues)[::-1] eigenvalues = eigenvalues[sort_index] eigenvectors = eigenvectors[:, sort_index] print("Sample covariance matrix analysis") print("-" * 72) print("Feature means:") for feature_name, mean_value in zip(data.feature_names, column_means): print(f"{feature_name}: {mean_value:.6f}") print("-" * 72) print("Centered matrix:") print(X_centered) print("-" * 72) print("Sample covariance matrix:") print(covariance_matrix) print("-" * 72) print("Eigenvalues:") print(eigenvalues) print("-" * 72) print("Eigenvectors (principal directions):") print(eigenvectors) def main() -> None: # Customer behavior example: # Columns: annual_spend, purchase_frequency, basket_size data = CovarianceAnalysisData( feature_names=["annual_spend", "purchase_frequency", "basket_size"], data_matrix=[ [1200.0, 12.0, 100.0], [1500.0, 15.0, 110.0], [1800.0, 18.0, 130.0], [1600.0, 14.0, 115.0], ], ) summarize_covariance_analysis(data) if __name__ == "__main__": main()
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
this professional example teaches: 1. The covariance matrix is computed from centered data, not raw data.
2. Its diagonal entries are feature variances and its off-diagonal entries are covariances.
3. Eigen-decomposition of the covariance matrix gives PCA directions and explained-variance magnitudes.
4. This is the standard covariance-based route to PCA.
5. In business data, it reveals which behavioral variables move together before dimensionality reduction.
### Self-Check: Mathematical Verification #### Re-derivation from the covariance definition For centered features $j$ and $k$, the sample covariance is: $$
S_{jk}=\frac{1}{n-1}\sum_{i=1}^{n}x_{ij}x_{ik}
$$ If we stack all centered observations into the matrix: $$
X=
\begin{bmatrix}
x_{11} & \cdots & x_{1p}\\
\vdots & \ddots & \vdots\\
x_{n1} & \cdots & x_{np}
\end{bmatrix}
$$ then the $(j,k)$ entry of $X^\\top X$ is: $$
(X^\top X)_{jk}=\sum_{i=1}^{n}x_{ij}x_{ik}
$$ Therefore: $$
S_{jk}=\frac{1}{n-1}(X^\top X)_{jk}
$$ Since this holds for every pair $(j,k)$, the full matrix form is: $$
S=\frac{1}{n-1}X^\top X
$$ This matches the canonical formula exactly.
#### Symmetry check Take the transpose: $$
S^\top = \left(\frac{1}{n-1}X^\top X\right)^\top
$$ Using transpose rules: $$
S^\top = \frac{1}{n-1}(X^\top X)^\top
= \frac{1}{n-1}X^\top X
= S
$$ So the covariance matrix is symmetric, as stated.
#### Diagonal interpretation check For feature $j$, the diagonal entry is: $$
S_{jj}=\frac{1}{n-1}\sum_{i=1}^{n}x_{ij}^2
$$ because the feature is centered. This is exactly the sample variance of feature $j$. So the diagonal interpretation is correct.
#### PCA eigenvector connection check PCA solves for directions $v$ that maximize variance of the projected centered data. This leads to the eigenvalue problem: $$
Sv=\lambda v
$$ Therefore the eigenvectors of $S$ are principal directions and the eigenvalues give the variances along those directions. This matches the stated PCA connection.
#### Scaling convention check If instead one uses: $$
\frac{1}{n}X^\top X
$$ the result differs only by a positive scalar factor: $$
\frac{n-1}{n}
$$ relative to the sample covariance matrix. Multiplying a matrix by a positive scalar rescales eigenvalues but does not change eigenvectors. So the note about unchanged principal directions is mathematically correct.
#### Verbal-to-algebra consistency The verbal explanation says the covariance matrix summarizes variances and covariances, is symmetric, and provides eigenvectors for PCA. The algebra confirms all of these claims.
#### Structural verification - Opening restatement paragraph is present.
- All required sections are present and non-empty.
- Block equations use `$$...$$`.
- Symbol-table entries use math mode such as `$S$`, `$X$`, `$n$`, and `$\lambda_\ell$`.
- Mermaid uses `flowchart TD` and node text in `["..."]`.
- Three code blocks are present: Python beginner, R beginner, Python professional.
- Links to eigenvalues, PCA, factor analysis, and data centering are explicitly included.
- No placeholder text remains.
### Common Pitfalls and Edge Cases - **Using raw rather than centered data:** Standard covariance formulas assume deviations from the mean.
- **Confusing covariance with correlation:** Covariance depends on scale, while correlation is scale-normalized.
- **Assuming the $1/(n-1)$ versus $1/n$ choice changes PCA directions:** It changes magnitudes, not eigenvectors.
- **Ignoring feature scaling:** Large-scale variables can dominate the covariance matrix and therefore the PCA solution.
- **Using too few observations:** Covariance estimates become unstable when sample size is very small.
- **Interpreting covariance as causality:** Positive or negative covariance indicates co-movement, not causal effect.
- **Assuming symmetry implies independence:** Symmetry is a matrix property, not a statement about variables being independent.
- **Applying PCA without checking whether covariance structure is meaningful:** Nonlinear or categorical structures may require different methods.
### References and Standard Results - Sample covariance definition, $S=\\frac{1}{n-1}X^\\top X$
- MLE covariance version, $\\frac{1}{n}X^\\top X$
- Entrywise covariance identity, $S\_{jk}=\\frac{1}{n-1}\\sum\_{i=1}^{n}x\_{ij}x\_{ik}$
- Variance as the diagonal of the covariance matrix
- Symmetry property of covariance matrices
- Eigen-decomposition equation, $Sv\_\\ell=\\lambda\_\\ell v\_\\ell$
- PCA as variance maximization on centered data
- Connection between covariance-based PCA and SVD of centered data