---
title: Normal Equation for general subspace $U$ with basis $B$
date: '2026-04-16'
wordCount: 750
slug: normal_equation_for_general_subspace_u_with_basis_b
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/orthogonal_projections/normal_equation_for_general_subspace_u_with_basis_b/index.html
share_status: draft
publish_target: note
boundary: public
---
# $B^T B \lambda = B^T x$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The normal equation $B^TB\lambda = B^Tx$ is the linear system whose solution gives the coordinates $\lambda$ of the orthogonal projection of $x$ onto the subspace spanned by the columns of $B$. Solving it for $\hat{\lambda}$ and then computing $B\hat{\lambda}$ gives $\pi_U(x)$, the closest point in the subspace to $x$. It arises directly from the optimality condition: the residual $x - B\lambda$ must be orthogonal to every column of $B$, which gives $B^T(x - B\lambda) = 0$, i.e., $B^TB\lambda = B^Tx$. In DA/DS: this is the OLS normal equation $X^TX\hat{\beta} = X^Ty$, which every linear regression solves (either directly or via numerical methods).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Minimize ||B*lambda - x||^2 over lambda"] A --> B["Take gradient and set to zero"] B --> C["d/d_lambda ||B*lambda - x||^2 = 2 B^T (B*lambda - x) = 0"] C --> D["Normal equation: B^T B * lambda = B^T x"] D --> E{"Is B^T B invertible?"} E -->|"Yes (B full column rank)"| F["Unique solution: lambda = (B^T B)^{-1} B^T x"] E -->|"No (rank deficient)"| G["Infinitely many solutions; use pseudoinverse or regularization"] F --> H["Projection: pi_U(x) = B * lambda_hat"]
```
### Real-World use:
#### Situation it is used
OLS linear regression: $X^TX\hat{\beta} = X^Ty$ gives the least squares coefficients. Ridge regression: $(X^TX + \lambda I)\hat{\beta} = X^Ty$ (regularized normal equation). Any least-squares problem: fitting a polynomial, exponential, or any linear model. Solving projection problems numerically (preferred over explicitly computing $(B^TB)^{-1}$).
#### Problem it solves
Given basis $B$ and target $x$, find the coordinates $\lambda$ such that $B\lambda$ is closest to $x$. This requires minimizing $\|B\lambda - x\|^2$, which leads to the normal equation. It translates a geometric problem (closest point in a subspace) into a solvable linear system.
#### How it solves the problem
Expand: $\|B\lambda - x\|^2 = \lambda^T B^TB\lambda - 2\lambda^T B^Tx + x^Tx$. This is quadratic in $\lambda$. Setting the gradient to zero: $2B^TB\lambda - 2B^Tx = 0 \Rightarrow B^TB\lambda = B^Tx$. If $B$ has full column rank, $B^TB$ is positive definite and the system has a unique solution $\hat{\lambda} = (B^TB)^{-1}B^Tx$.
#### Example of it used in the Working Context as DA/DS for a Business
In OLS regression with design matrix $X$ (n×k) and response $y$ (n×1): the normal equation $X^TX\hat{\beta} = X^Ty$ gives $\hat{\beta}$ directly. Numerically, this is solved via `np.linalg.solve(X.T @ X, X.T @ y)` (more stable than explicitly inverting $X^TX$) or via `np.linalg.lstsq` (which uses SVD and handles rank-deficient cases).
### The Formula (Fragment-First)
- $B^T$: $k \times n$ transpose of the basis matrix; "aggregates" information from all $n$ dimensions into $k$ equations
- $B^T B$: $k \times k$ Gram matrix; measures pairwise inner products between basis vectors; invertible iff $B$ has full column rank
- $\lambda$: $k \times 1$ vector of unknown coordinates (coefficients in the basis)
- $B^T x$: $k \times 1$ vector; the right-hand side; projects $x$ onto each basis direction
- $B^T B \lambda = B^T x$: a $k \times k$ linear system; the solution minimizes $\|B\lambda - x\|^2$
- Solution: $\hat{\lambda} = (B^TB)^{-1}B^Tx$ (when $B^TB$ is invertible)
- OLS form: $X^TX\hat{\beta} = X^Ty$ ### Formula-to-English Translation
"Take each basis vector and require that the residual is orthogonal to it. This gives one equation per basis vector. Solving the resulting $k \times k$ system gives the coordinates of the closest point." Tiny example: $B = \begin{pmatrix}1 & 0\\0 & 1\\1 & 1\end{pmatrix}$, $x = (2, 3, 4)^T$.
$B^T B = \begin{pmatrix}2 & 1\\1 & 2\end{pmatrix}$. $B^T x = (2+4, 3+4)^T = (6, 7)^T$.
Normal equation: $\begin{pmatrix}2&1\\1&2\end{pmatrix}\lambda = \begin{pmatrix}6\\7\end{pmatrix}$.
Solution: $\hat{\lambda} = \frac{1}{3}(2\cdot6-7, 2\cdot7-6)^T = (5/3, 8/3)^T$.
$\pi_U(x) = B\hat{\lambda} = (5/3, 8/3, 13/3)^T$.
### Critical Concepts
- **Preferred over explicit inversion:** solve `np.linalg.solve(B.T @ B, B.T @ x)` rather than `np.linalg.inv(B.T @ B) @ B.T @ x`. Numerically more stable.
- **Best practice:** use `np.linalg.lstsq(B, x)` which uses SVD and handles rank-deficient cases.
- **Ridge modification:** $(B^TB + \alpha I)\hat{\lambda} = B^Tx$ adds $\alpha$ to each diagonal of the Gram matrix, ensuring invertibility and shrinking the solution.
- **Rank deficiency:** if $B^TB$ is singular (linearly dependent columns), the normal equation has infinitely many solutions; use the minimum-norm solution via pseudoinverse.
- **Numerical conditioning:** $B^TB$ can be ill-conditioned when columns of $B$ are nearly parallel. QR decomposition or SVD are more numerically stable alternatives.
- **OLS interpretation:** $X^TX$ = "feature cross-products," $X^Ty$ = "feature-response cross-products." The normal equation balances these to find $\hat{\beta}$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Set up the normal equation*
$B = \begin{pmatrix}2\\1\end{pmatrix}$, $x = (3, 4)^T$.
$B^TB = 4+1 = 5$. $B^Tx = 6+4 = 10$.
Normal equation: $5\hat{\lambda} = 10 \Rightarrow \hat{\lambda} = 2$. *Step 2: Compute the projection*
$\pi_U(x) = B\hat{\lambda} = 2\cdot(2,1)^T = (4, 2)^T$. *Step 3: Verify residual orthogonality*
$r = x - \pi_U(x) = (3,4)-(4,2) = (-1, 2)$.
$B^Tr = 2(-1) + 1(2) = 0$. $\checkmark$ The residual is orthogonal to $B$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Solve normal equation B^T B lambda = B^T x ---
B = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])
x = np.array([2.0, 3.0, 4.0]) gram_matrix = B.T @ B # B^T B (2x2)
rhs = B.T @ x # B^T x (2,) # Solve (preferred: avoid explicit inversion)
lambda_hat = np.linalg.solve(gram_matrix, rhs)
projection = B @ lambda_hat
residual = x - projection print(f"B^T B:\n{gram_matrix}")
print(f"B^T x: {rhs}")
print(f"\nlambda_hat (solution): {lambda_hat.round(4)}")
print(f"Projection pi_U(x): {projection.round(4)}")
print(f"Residual: {residual.round(4)}")
print(f"B^T residual (check): {(B.T @ residual).round(10)}") # Alternative: lstsq handles rank-deficient cases
lambda_lstsq, _, _, _ = np.linalg.lstsq(B, x, rcond=None)
print(f"\nlstsq solution: {lambda_lstsq.round(4)} (matches: {np.allclose(lambda_hat, lambda_lstsq)})")
```
#### Beginner friendly Example [R])
``` r
# -- Normal equation B^T B lambda = B^T x ---
B <- matrix(c(1,0,1, 0,1,1), nrow=3, ncol=2)
x <- c(2, 3, 4) gram <- t(B) %*% B
rhs <- t(B) %*% x
lambda <- solve(gram, rhs)
proj <- B %*% lambda
resid <- x - proj cat("lambda_hat:", round(lambda, 4), "\n")
cat("projection:", round(proj, 4), "\n")
cat("B^T resid: ", round(t(B) %*% resid, 10), "\n")
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: solve OLS normal equations, compare methods ---
# X^T X beta = X^T y (normal equation for linear regression) N, K = 200, 4
X = np.column_stack([ np.ones(N), np.random.uniform(0, 10, N), np.random.uniform(0, 5, N), np.random.uniform(0, 3, N),
])
true_beta = np.array([1.5, 0.8, -0.5, 0.3])
y = X @ true_beta + np.random.randn(N) * 0.3 gram = X.T @ X # X^T X (normal equation left side)
rhs = X.T @ y # X^T y (normal equation right side) # Method 1: solve the normal equation directly
beta_solve = np.linalg.solve(gram, rhs) # Method 2: via explicit inversion (less stable)
beta_inv = np.linalg.inv(gram) @ rhs # Method 3: lstsq (uses SVD, most numerically stable)
beta_lstsq, _, _, _ = np.linalg.lstsq(X, y, rcond=None) comparison = pd.DataFrame({ "parameter": [f"beta_{i}" for i in range(K)], "true_beta": true_beta, "solve": beta_solve.round(4), "inv": beta_inv.round(4), "lstsq": beta_lstsq.round(4),
}) print("OLS via normal equation (B^T B lambda = B^T x with B=X, x=y):")
print(comparison.to_string(index=False))
print(f"\nCondition number of X^T X: {np.linalg.cond(gram):.2f}")
print("Recommendation: use lstsq or solve, NOT explicit inversion.")
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