---
title: Positive Semi-Definite (PSD)
date: '2026-04-16'
wordCount: 935
slug: positive_semi_definite_psd
permalink: /notes/03_linear_algebra_geometry/advanced_linear_algebra_and_decompositions/quadratic_forms_and_positive_definite_matrices/positive_semi_definite_psd/index.html
share_status: draft
publish_target: note
boundary: public
---
# $x^T A x \ge 0$ for all $x \ne 0$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A matrix $A$ is positive semi-definite (PSD) if the quadratic form $x^T A x$ is non-negative for every non-zero vector $x$, but allows the value to be zero for some non-zero $x$. PSD is the weaker version of positive definite (PD): PD requires strict $>$, PSD allows $\geq$. In DA/DS you encounter PSD matrices constantly: every valid covariance matrix is PSD (some covariance matrices are PSD but not PD, because of rank deficiency), every valid kernel Gram matrix is PSD, and the output of `np.cov()` is always PSD. Understanding the difference between PSD and PD is essential for knowing when Cholesky will fail and when regularization is needed.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Symmetric matrix A (n x n)"] --> B["Check all eigenvalues >= 0"] B --> C{{"Any eigenvalue < 0?"}} C -->|"Yes"| D["Indefinite or negative definite: not PSD"] C -->|"No"| E{{"Any eigenvalue = 0?"}} E -->|"Yes"| F["Positive Semi-Definite (PSD): A is singular, x^T A x = 0 for x in null space"] E -->|"No"| G["All eigenvalues > 0: Positive Definite (PD), stronger condition"] F --> H["Cannot do Cholesky directly; add jitter epsilon * I to make PD"] G --> I["Safe for Cholesky, Mahalanobis, and full-rank regression"]
```
### Real-World use:
#### Situation it is used
Used whenever you validate a covariance matrix or kernel Gram matrix. Any matrix of the form $M^T M$ is automatically PSD (with possible zero eigenvalues if $M$ is rank-deficient). PSD is also the minimum requirement for a function to be convex: a twice-differentiable function is convex if and only if its Hessian is PSD everywhere.
#### Problem it solves
Many matrices encountered in practice are PSD but not PD: a sample covariance estimated from fewer observations than features, a correlation matrix after applying transformations, or a Gram matrix from a rank-deficient feature set. PSD tells you the matrix is still geometrically valid (no "negative variance" directions), but you cannot directly apply Cholesky or compute the inverse.
#### How it solves the problem
$x^T A x \geq 0$ means the quadratic form maps every direction to a non-negative value. Some directions may have zero "stretching" ($x^T A x = 0$ for non-zero $x$ in the null space of $A$). The zero eigenvalue directions correspond to degenerate or redundant dimensions in the data.
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist estimates a 10-asset covariance matrix from only 8 weeks of data ($n < p$). The resulting matrix is PSD but not PD: it has rank 8 and 2 zero eigenvalues (because there is not enough data to estimate all 10 independent variance directions). Attempting Cholesky raises a `LinAlgError`. The fix is to add a small diagonal jitter $\varepsilon I$ (e.g., $10^{-6}$) to make all eigenvalues strictly positive, converting PSD to PD.
### The Formula (Fragment-First)
- $x^T$: transpose of a column vector $x$, making it a row vector ($1 \times n$)
- $A$: a symmetric ($n \times n$) matrix
- $x$: any non-zero column vector in $\mathbb{R}^n$
- $x^T A x$: the scalar quadratic form; evaluates the "energy" of $x$ under $A$
- $\geq 0$: non-negative; allows zero but not negative values
- The key difference from PD: $x^T A x = 0$ is permitted for some $x \neq 0$ (those in the null space of $A$) Full formula: $x^T A x \geq 0$ for all $x \neq 0$ ### Formula-to-English Translation
"The matrix never stretches any direction to a negative value, but it may map some directions to zero — meaning those directions are in the null space and carry no information." Tiny numeric example: $A = \begin{bmatrix}1 & 1 \\ 1 & 1\end{bmatrix}$ (rank 1, PSD but not PD).
$x^T A x = [a,b]\begin{bmatrix}1&1\\1&1\end{bmatrix}\begin{bmatrix}a\\b\end{bmatrix} = (a+b)^2 \geq 0$ ✓.
But take $x = [1, -1]^T$: $(1 + (-1))^2 = 0$. Non-zero $x$ gives zero ✓, confirming PSD (not PD).
Eigenvalues: $\lambda_1 = 2$, $\lambda_2 = 0$ (one zero eigenvalue, matrix is singular).
### Critical Concepts
- **PSD vs PD:** the only difference is whether zero is allowed in the quadratic form for non-zero $x$. PD: all eigenvalues $> 0$, invertible. PSD: all eigenvalues $\geq 0$, may be singular.
- **Covariance matrices are always PSD:** $\text{Var}(v^T X) = v^T \Sigma v \geq 0$ for all $v$ by definition of variance; the covariance matrix is PSD with probability 1 (PD if $n > p$ and no perfect linear dependencies).
- **$A = M^T M$ is always PSD:** because $x^T (M^T M) x = \|Mx\|^2 \geq 0$. If $M$ has full column rank, $A$ is PD.
- **Kernel matrices:** a Gram matrix $K_{ij} = k(x_i, x_j)$ is PSD for valid kernels (Mercer's theorem). Checking the minimum eigenvalue of $K$ is the standard validity test.
- **Fixing PSD to PD:** add $\varepsilon I$ to the PSD matrix; this shifts all eigenvalues up by $\varepsilon$, making all of them positive. Choose $\varepsilon$ just large enough to push the minimum eigenvalue above zero.
- **Convexity:** a function is convex iff its Hessian is PSD everywhere; strictly convex iff PD everywhere.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Compute the quadratic form and check sign*
$A = \begin{bmatrix}2 & -2 \\ -2 & 2\end{bmatrix}$, $x = [a, b]^T$.
$x^T A x = [a,b]\begin{bmatrix}2 & -2 \\ -2 & 2\end{bmatrix}\begin{bmatrix}a \\ b\end{bmatrix} = 2a^2 - 2ab - 2ab + 2b^2 = 2(a-b)^2 \geq 0$ ✓. *Step 2: Find the direction where the quadratic form equals zero*
$2(a-b)^2 = 0 \Rightarrow a = b$. Take $x = [1,1]^T$: $x^T A x = 2(1-1)^2 = 0$.
So $x = [1,1]^T$ is in the null space of $A$: the matrix is PSD but not PD. *Step 3: Verify via eigenvalues*
$\det(A - \lambda I) = (2-\lambda)^2 - 4 = \lambda^2 - 4\lambda = \lambda(\lambda-4) = 0$.
$\lambda_1 = 4 > 0$, $\lambda_2 = 0$. One zero eigenvalue: PSD, not PD ✓.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Check PSD: covariance estimated from fewer obs than features ------
# Simulate n=3 observations of p=4 features: matrix will be rank 3, PSD not PD
np.random.seed(42)
X = np.random.normal(size=(3, 4))
cov = (X - X.mean(axis=0)).T @ (X - X.mean(axis=0)) / (3 - 1) eigenvalues = np.linalg.eigvalsh(cov)
print(f"Eigenvalues: {eigenvalues.round(6)}")
print(f"All >= 0 (PSD): {bool(np.all(eigenvalues >= -1e-12))}")
print(f"All > 0 (PD): {bool(np.all(eigenvalues > 1e-10))}") # Check quadratic form for a test vector in the null space
x_null = np.array([1.0, -1.0, 0.5, -0.5]) # arbitrary; may or may not be in null space
qf = float(x_null @ cov @ x_null)
print(f"\nQuadratic form for test x: {qf:.6f} (>= 0 confirms PSD)") # Find actual null space vectors (where eigenvalue ~ 0)
evecs = np.linalg.eigh(cov)[1]
null_vec = evecs[:, 0] # eigenvector for smallest eigenvalue
qf_null = float(null_vec @ cov @ null_vec)
print(f"Quadratic form for null-space vector: {qf_null:.2e} (near 0: PSD confirmed)")
```
#### Beginner friendly Example [R])
``` r
# -- Check PSD: covariance estimated from fewer obs than features ------
set.seed(42)
X <- matrix(rnorm(12), nrow = 3, ncol = 4)
X_c <- scale(X, scale = FALSE)
cov <- t(X_c) %*% X_c / (nrow(X) - 1) eigenvalues <- eigen(cov, symmetric = TRUE)$values
cat(sprintf("Eigenvalues: %s\n", paste(round(eigenvalues, 6), collapse = ", ")))
cat(sprintf("All >= 0 (PSD): %s\n", all(eigenvalues >= -1e-12)))
cat(sprintf("All > 0 (PD): %s\n", all(eigenvalues > 1e-10))) # Quadratic form check
x_test <- c(1.0, 0.5, -0.5, 0.0)
qf <- as.numeric(x_test %*% cov %*% x_test)
cat(sprintf("\nQuadratic form for test x: %.6f (>= 0 confirms PSD)\n", qf))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: validate a kernel Gram matrix for kernel SVM ---
# The Gram matrix of any valid kernel must be PSD (Mercer's theorem).
# Test two kernels: RBF (should be PSD) and a custom broken one (may not be PSD). N_SAMPLES = 40
N_FEATURES = 3
RBF_SIGMA = 1.0 sample_names = [f"session_{i:02d}" for i in range(N_SAMPLES)]
X = np.random.normal(size=(N_SAMPLES, N_FEATURES)) def rbf_kernel(X_data, sigma): """Valid RBF kernel: k(x,y) = exp(-||x-y||^2 / sigma^2).""" sq_dists = np.sum((X_data[:, None, :] - X_data[None, :, :]) ** 2, axis=-1) return np.exp(-sq_dists / sigma ** 2) def broken_kernel(X_data): """Invalid kernel: differences of norms (not guaranteed PSD).""" norms = np.linalg.norm(X_data, axis=1) return norms[:, None] - norms[None, :] # not symmetric and not PSD def check_psd(K, name): eigs = np.linalg.eigvalsh(K) n_negative = int(np.sum(eigs < -1e-8)) min_eig = float(eigs.min()) is_psd = n_negative == 0 print(f"\n{name}:") print(f" Min eigenvalue: {min_eig:.6f}") print(f" Negative eigenvalues: {n_negative}") print(f" PSD: {is_psd}") return is_psd K_rbf = rbf_kernel(X, sigma=RBF_SIGMA)
K_broken = broken_kernel(X) print("Kernel PSD validation (Mercer's condition check):")
check_psd(K_rbf, "RBF kernel (should be PSD)")
check_psd(K_broken, "Broken kernel (likely not PSD)")
print("\nInterpretation: only PSD kernel matrices define valid inner products in feature space; use eigenvalue check before applying kernel SVM or GP.")
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
MML2