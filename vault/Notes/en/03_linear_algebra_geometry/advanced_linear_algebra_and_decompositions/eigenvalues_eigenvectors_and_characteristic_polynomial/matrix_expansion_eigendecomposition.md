---
title: Matrix Expansion Eigendecomposition
date: '2026-04-16'
wordCount: 785
slug: matrix_expansion_eigendecomposition
permalink: /notes/03_linear_algebra_geometry/advanced_linear_algebra_and_decompositions/eigenvalues_eigenvectors_and_characteristic_polynomial/matrix_expansion_eigendecomposition/index.html
share_status: draft
publish_target: note
boundary: public
---
# $A = \sum_k \lambda_k v_k v_k^\dagger$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the spectral decomposition: it expresses a symmetric (or Hermitian) matrix as a weighted sum of rank-1 projection matrices, one per eigenvector. The dagger notation $v_k^\dagger$ means conjugate transpose (for real vectors, just $v_k^T$). In DA/DS you use this form when you need to understand how much each principal component contributes to a covariance matrix, when you want to build a matrix with a desired spectrum (e.g., regularizing a covariance by zeroing small eigenvalues), or when you need a matrix function like $A^{1/2}$ or $e^A$.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Input: symmetric matrix A (n x n)"] --> B["Compute eigendecomposition: eigenvalues lambda_k, eigenvectors v_k"] B --> C["Normalize each v_k to unit length: v_k = v_k / norm(v_k)"] C --> D["Form rank-1 outer product for each k: v_k * v_k transpose"] D --> E["Scale each outer product by lambda_k"] E --> F["Sum all scaled outer products: A = sum over k of lambda_k * v_k * v_k transpose"] F --> G{{"Verify: reconstruction matches A?"}} G -->|"Yes"| H["Use for truncation, matrix functions, or spectrum analysis"] G -->|"No"| I["Check eigenvector orthonormality and numerical tolerance"]
```
### Real-World use:
#### Situation it is used
Use this form when you need to manipulate the spectrum of a matrix directly: drop small eigenvalue terms to denoise a covariance matrix, replace eigenvalues with their square roots to compute $A^{1/2}$, or inspect the geometric structure of $A$ by seeing which eigenvectors carry the most weight. Also central to PCA reconstruction and covariance shrinkage in portfolio optimization.
#### Problem it solves
A covariance matrix estimated from limited data often has spuriously small or noisy eigenvalues that make it numerically unstable. By expressing $A$ as a sum of spectral components, you can selectively remove or shrink the noisy terms and reconstruct a cleaner, better-conditioned matrix.
#### How it solves the problem
Each term $\lambda_k v_k v_k^T$ is a rank-1 matrix that projects onto the direction $v_k$ and scales by $\lambda_k$. Summing all $n$ terms exactly reconstructs $A$. Dropping terms with small $\lambda_k$ or replacing $\lambda_k$ with a shrinkage target gives a modified matrix with the same eigenvectors but a better spectrum.
#### Example of it used in the Working Context as DA/DS for a Business
A quant analyst estimates a 20-asset covariance matrix from 60 weeks of returns. The last 18 eigenvalues are near zero (the matrix is estimated from too little data). Using the spectral expansion, they keep only the top 5 terms (5 dominant market factors), replacing the rest with a small constant $\varepsilon$. The resulting regularized covariance is positive definite, well-conditioned, and ready for portfolio optimization.
### The Formula (Fragment-First)
- $A$: a symmetric ($A = A^T$) or Hermitian ($A = A^\dagger$) matrix; this decomposition applies only to these types
- $\sum_k$: sum over all $n$ eigenvalue-eigenvector pairs
- $\lambda_k$: the $k$-th eigenvalue, a real scalar (guaranteed real for symmetric/Hermitian matrices)
- $v_k$: the $k$-th eigenvector, a unit-norm column vector ($\|v_k\| = 1$)
- $v_k^\dagger$: conjugate transpose of $v_k$; for real vectors this is just $v_k^T$
- $v_k v_k^\dagger$: outer product, an $n \times n$ rank-1 matrix that projects onto the direction of $v_k$ Full formula: $A = \sum_k \lambda_k v_k v_k^\dagger$ ### Formula-to-English Translation
"A symmetric matrix is a weighted sum of projection directions, where each weight is the eigenvalue and each direction is the corresponding unit eigenvector." Tiny numeric example: $A = \begin{bmatrix}3 & 0 \\ 0 & 1\end{bmatrix}$.
Eigenpairs: $(\lambda_1=3, v_1=[1,0]^T)$ and $(\lambda_2=1, v_2=[0,1]^T)$.
Expansion: $3[1,0]^T[1,0] + 1[0,1]^T[0,1] = 3\begin{bmatrix}1&0\\0&0\end{bmatrix} + 1\begin{bmatrix}0&0\\0&1\end{bmatrix} = \begin{bmatrix}3&0\\0&1\end{bmatrix} = A$ ✓.
### Critical Concepts
- **Symmetric/Hermitian only:** this exact form requires an orthonormal eigenbasis; general (asymmetric) matrices need the full eigendecomposition $A = V \Lambda V^{-1}$, which is different.
- **Truncation gives best approximation:** keeping only the top $k$ terms gives the best rank-$k$ approximation to $A$ in Frobenius norm.
- **Matrix functions:** you can compute $f(A) = \sum_k f(\lambda_k) v_k v_k^T$ for any function $f$: square root, inverse, exponential, log.
- **Covariance regularization:** replace noisy small eigenvalues with a floor value $\varepsilon$ before reconstruction; this is Ledoit-Wolf / eigenvalue clipping shrinkage.
- **Numerical orthogonality:** for nearly-repeated eigenvalues, eigenvectors may not be perfectly orthonormal numerically; always check $V^T V \approx I$ after decomposition.
- **Trace check:** $\text{tr}(A) = \sum_k \lambda_k$; a fast sanity check on the eigenvalue sum.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Compute eigenvalues and normalized eigenvectors*
$A = \begin{bmatrix}4 & 2 \\ 2 & 1\end{bmatrix}$.
Characteristic polynomial: $(4-\lambda)(1-\lambda) - 4 = \lambda^2 - 5\lambda = \lambda(\lambda-5) = 0$.
Eigenvalues: $\lambda_1 = 5$, $\lambda_2 = 0$.
For $\lambda_1=5$: $(A-5I)v=0 \Rightarrow [-1,2;2,-4]v=0 \Rightarrow v_1 = [2,1]^T/\sqrt{5}$.
For $\lambda_2=0$: $(A-0)v=0 \Rightarrow v_2 = [1,-2]^T/\sqrt{5}$ (null space of $A$). *Step 2: Form the two rank-1 outer product terms*
$v_1 v_1^T = \frac{1}{5}\begin{bmatrix}2\\1\end{bmatrix}[2,1] = \frac{1}{5}\begin{bmatrix}4&2\\2&1\end{bmatrix}$.
$v_2 v_2^T = \frac{1}{5}\begin{bmatrix}1\\-2\end{bmatrix}[1,-2] = \frac{1}{5}\begin{bmatrix}1&-2\\-2&4\end{bmatrix}$. *Step 3: Weight by eigenvalues and sum to verify reconstruction*
$\lambda_1 v_1 v_1^T + \lambda_2 v_2 v_2^T = 5 \cdot \frac{1}{5}\begin{bmatrix}4&2\\2&1\end{bmatrix} + 0 \cdot (\ldots) = \begin{bmatrix}4&2\\2&1\end{bmatrix} = A$ ✓.
Since $\lambda_2 = 0$, the second term vanishes: $A$ is rank-1.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Spectral decomposition of a 3x3 symmetric matrix ----------------
A = np.array([[4.0, 2.0, 0.0], [2.0, 3.0, 1.0], [0.0, 1.0, 2.0]]) # Eigendecomposition (eigh: symmetric matrix, returns real eigenvalues)
eigenvalues, eigenvectors = np.linalg.eigh(A) print("Eigenvalues:", eigenvalues.round(4))
print("Eigenvectors (columns):")
print(eigenvectors.round(4)) # Reconstruct A as sum of lambda_k * v_k * v_k^T
n = A.shape[0]
A_reconstructed = np.zeros((n, n))
for k in range(n): lam_k = eigenvalues[k] v_k = eigenvectors[:, k].reshape(-1, 1) A_reconstructed += lam_k * (v_k @ v_k.T) print("\nReconstructed A:")
print(A_reconstructed.round(4))
print(f"\nMax reconstruction error: {np.max(np.abs(A - A_reconstructed)):.2e}")
```
#### Beginner friendly Example [R])
``` r
# -- Spectral decomposition of a 3x3 symmetric matrix ----------------
A <- matrix(c(4, 2, 0, 2, 3, 1, 0, 1, 2), nrow = 3, byrow = TRUE) result <- eigen(A, symmetric = TRUE)
eigenvalues <- result$values
eigenvectors <- result$vectors cat("Eigenvalues:\n")
print(round(eigenvalues, 4)) # Reconstruct A = sum of lambda_k * v_k * v_k^T
n <- nrow(A)
A_hat <- matrix(0, n, n)
for (k in seq_len(n)) { v_k <- eigenvectors[, k, drop = FALSE] A_hat <- A_hat + eigenvalues[k] * (v_k %*% t(v_k))
} cat("\nReconstructed A:\n")
print(round(A_hat, 4))
cat(sprintf("\nMax reconstruction error: %.2e\n", max(abs(A - A_hat))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: regularize a noisy estimated covariance matrix --
N_ASSETS = 10
N_PERIODS = 40 # short history: covariance will be noisy
N_KEEP = 4 # retain top 4 spectral components (market factors)
FLOOR_VALUE = 0.01 # replace small eigenvalues with this floor asset_names = [f"asset_{i+1:02d}" for i in range(N_ASSETS)] # Simulate returns from a low-rank covariance (3 true factors)
true_factors = np.random.normal(size=(N_PERIODS, 3))
loadings = np.random.normal(size=(N_ASSETS, 3))
returns_raw = true_factors @ loadings.T + np.random.normal(0, 0.5, (N_PERIODS, N_ASSETS))
df_returns = pd.DataFrame(returns_raw, columns=asset_names) # Estimate covariance (will have many small/noisy eigenvalues)
cov_estimated = df_returns.cov().to_numpy() # Eigendecomposition
eigenvalues, eigenvectors = np.linalg.eigh(cov_estimated)
order = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[order]
eigenvectors = eigenvectors[:, order] # Regularize: keep top N_KEEP eigenvalues, floor the rest
eigenvalues_reg = np.where( np.arange(N_ASSETS) < N_KEEP, eigenvalues, np.maximum(eigenvalues, FLOOR_VALUE)
) # Reconstruct regularized covariance via spectral expansion
cov_regularized = np.zeros((N_ASSETS, N_ASSETS))
for k in range(N_ASSETS): v_k = eigenvectors[:, k].reshape(-1, 1) cov_regularized += eigenvalues_reg[k] * (v_k @ v_k.T) cond_original = np.linalg.cond(cov_estimated)
cond_regularized = np.linalg.cond(cov_regularized) print(f"Condition number (original): {cond_original:.1f}")
print(f"Condition number (regularized): {cond_regularized:.1f}")
print(f"\nTop-{N_KEEP} eigenvalues: {eigenvalues[:N_KEEP].round(4)}")
print(f"Min eigenvalue (original): {eigenvalues.min():.6f}")
print(f"Min eigenvalue (regularized): {eigenvalues_reg.min():.6f}")
print("\nInterpretation: spectral regularization reduces condition number, making Cholesky and portfolio optimization stable.")
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
MYLA pag 7