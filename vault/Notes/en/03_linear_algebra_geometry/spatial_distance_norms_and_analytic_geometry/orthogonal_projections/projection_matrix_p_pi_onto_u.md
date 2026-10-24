---
title: Projection matrix $P pi$ onto $U$
date: '2026-04-16'
wordCount: 760
slug: projection_matrix_p_pi_onto_u
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/orthogonal_projections/projection_matrix_p_pi_onto_u/index.html
share_status: draft
publish_target: note
boundary: public
---
# $P_\pi = B(B^T B)^{-1} B^T$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
$P_\pi = B(B^TB)^{-1}B^T$ is the orthogonal projection matrix onto the subspace $U = \text{col}(B)$. Applying it to any vector $x$ gives $P_\pi x = \pi_U(x)$, the closest point in $U$ to $x$. Two critical properties define it: (1) idempotent: $P_\pi^2 = P_\pi$ (projecting twice = projecting once), and (2) symmetric: $P_\pi^T = P_\pi$. In OLS, $P_\pi = X(X^TX)^{-1}X^T$ is the hat matrix (maps $y$ to fitted values $\hat{y}$). Its complement $I - P_\pi$ projects onto the orthogonal complement of $U$ and maps $y$ to the residuals $\hat{e} = y - \hat{y}$.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Basis matrix B (n x k, full column rank)"] A --> B["Gram matrix: B^T B (k x k)"] B --> C["Invert: (B^T B)^{-1}"] C --> D["Projection matrix: P_pi = B (B^T B)^{-1} B^T"] D --> E["Properties: P_pi^2 = P_pi (idempotent), P_pi^T = P_pi (symmetric)"] D --> F["Apply: P_pi * x = projection of x onto col(B)"] D --> G["Complement: I - P_pi = projection onto orthogonal complement"] G --> H["(I - P_pi) * x = residual (orthogonal to U)"]
```
### Real-World use:
#### Situation it is used
OLS regression: the hat matrix $H = X(X^TX)^{-1}X^T$ is the projection matrix onto $\text{col}(X)$; leverage values are the diagonal entries $H_{ii}$, which measure how much each observation influences its own fitted value. Computing residual degrees of freedom: $\text{tr}(I - P_\pi) = n - k$. Checking projection idempotency as a numerical sanity check on computed matrices.
#### Problem it solves
Encapsulating the projection operation as a matrix enables: applying the projection to multiple vectors at once ($P_\pi X_{\text{new}}$), analyzing the structure of the projection (its eigenvalues are 0 or 1), computing leverage scores, and deriving theoretical properties of OLS estimators (variance of $\hat{y}$, degrees of freedom).
#### How it solves the problem
$P_\pi$ is derived by solving $\min_\lambda \|B\lambda - x\|^2$. Normal equations give $\hat{\lambda} = (B^TB)^{-1}B^Tx$, so $\pi_U(x) = B\hat{\lambda} = B(B^TB)^{-1}B^Tx = P_\pi x$. Since this holds for all $x$, we can factor out: $P_\pi = B(B^TB)^{-1}B^T$. Proof of idempotency: $P_\pi^2 = B(B^TB)^{-1}B^T B(B^TB)^{-1}B^T = B(B^TB)^{-1}(B^TB)(B^TB)^{-1}B^T = B(B^TB)^{-1}B^T = P_\pi$.
#### Example of it used in the Working Context as DA/DS for a Business
In OLS: $H = X(X^TX)^{-1}X^T$. Diagonal entry $H_{ii}$ is the leverage of observation $i$: how much the fitted value $\hat{y}_i$ depends on the observed $y_i$. A leverage $H_{ii} > 2k/n$ (where $k$ is the number of predictors) flags potentially influential observations. A DS uses this to identify outliers that are disproportionately driving the regression fit.
### The Formula (Fragment-First)
- $B$: $n \times k$ basis matrix (e.g., design matrix $X$ in OLS)
- $B^TB$: $k \times k$ Gram matrix; must be invertible (full column rank required)
- $(B^TB)^{-1}$: inverse of the Gram matrix
- $B^T$: appears on the right; maps $\mathbb{R}^n \to \mathbb{R}^k$
- $B(B^TB)^{-1}B^T$: full $n \times n$ projection matrix; rank $k$
- Key properties: $P_\pi^2 = P_\pi$ (idempotent), $P_\pi^T = P_\pi$ (symmetric), eigenvalues are 0 or 1
- $\text{tr}(P_\pi) = k$ (trace = rank = dimension of subspace)
- $I - P_\pi$: complementary projection onto $U^\perp$ ### Formula-to-English Translation
"The projection matrix $P_\pi$ is a linear operator that, when applied to any vector $x$, returns the closest point in the subspace $U$ to $x$. It is the 'shadow operator' onto $U$. Once you compute it, you can project any vector with a single matrix multiplication." Tiny example: $B = (1, 1)^T$, $x = (3, 1)^T$.
$P_\pi = \frac{1}{2}\begin{pmatrix}1\\1\end{pmatrix}(1,1) = \frac{1}{2}\begin{pmatrix}1&1\\1&1\end{pmatrix}$.
$P_\pi x = \frac{1}{2}\begin{pmatrix}4\\4\end{pmatrix} = (2,2)^T$.
$(I - P_\pi)x = (3,1)^T - (2,2)^T = (1,-1)^T$. $B^T(1,-1)^T = 1-1 = 0$. $\checkmark$ ### Critical Concepts
- **Eigenvalues:** $P_\pi$ has eigenvalues 1 (for vectors in $U$) and 0 (for vectors in $U^\perp$). $P_\pi v = v$ for $v \in U$; $P_\pi w = 0$ for $w \in U^\perp$.
- **Trace = dimension:** $\text{tr}(P_\pi) = k = \dim(U)$.
- **Orthonormal shortcut:** if $B^TB = I$ (orthonormal columns), $P_\pi = BB^T$.
- **OLS hat matrix:** $H = X(X^TX)^{-1}X^T$, $\hat{y} = Hy$, $e = (I-H)y$. Leverage $= H_{ii}$.
- **Idempotent + symmetric:** any matrix satisfying $P^2 = P$ and $P^T = P$ IS an orthogonal projection matrix (onto its column space).
- **Degrees of freedom:** residual d.f. $= \text{tr}(I - P_\pi) = n - k$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Build the projection matrix*
$B = \begin{pmatrix}1\\1\\0\end{pmatrix}$. $B^TB = 2$. $(B^TB)^{-1} = 0.5$.
$P_\pi = \frac{1}{2}\begin{pmatrix}1\\1\\0\end{pmatrix}(1,1,0) = \frac{1}{2}\begin{pmatrix}1&1&0\\1&1&0\\0&0&0\end{pmatrix}$. *Step 2: Verify idempotency*
$P_\pi^2 = P_\pi^2$: compute $P_\pi \cdot P_\pi$. Each entry: first row of $P_\pi$ times each column. Row 1: $(0.5, 0.5, 0)$. Col 1: $(0.5, 0.5, 0)^T$. Dot product: $0.25+0.25 = 0.5$. Matches $P_\pi[1,1] = 0.5$. $\checkmark$ *Step 3: Verify projection and residual*
$x = (3, 1, 2)^T$. $P_\pi x = \frac{1}{2}(3+1, 3+1, 0) = (2, 2, 0)^T$.
$(I - P_\pi)x = (1, -1, 2)^T$. $B^T(I-P_\pi)x = 1-1+0 = 0$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Projection matrix P_pi = B(B^T B)^{-1} B^T ---
B = np.array([[1.0], [1.0], [0.0]]) # single basis vector P_pi = B @ np.linalg.inv(B.T @ B) @ B.T print(f"B:\n{B}")
print(f"\nProjection matrix P_pi:\n{P_pi.round(4)}")
print(f"Idempotent (P^2 = P): {np.allclose(P_pi @ P_pi, P_pi)}")
print(f"Symmetric (P^T = P): {np.allclose(P_pi, P_pi.T)}")
print(f"Trace (= dim of U): {np.trace(P_pi):.4f}")
print(f"Eigenvalues: {np.round(np.linalg.eigvalsh(P_pi), 4)}") x = np.array([3.0, 1.0, 2.0])
proj = P_pi @ x
resid = x - proj
print(f"\nx = {x}")
print(f"P_pi @ x = {proj.round(4)}")
print(f"residual = {resid.round(4)}")
print(f"B^T resid = {(B.T @ resid).round(10)}")
```
#### Beginner friendly Example [R])
``` r
# -- Projection matrix ---
B <- matrix(c(1, 1, 0), ncol=1)
P_pi <- B %*% solve(t(B) %*% B) %*% t(B) cat("Projection matrix P_pi:\n"); print(round(P_pi, 4))
cat(sprintf("Idempotent: %s\n", isTRUE(all.equal(P_pi %*% P_pi, P_pi))))
cat(sprintf("Trace: %.4f\n", sum(diag(P_pi)))) x <- c(3, 1, 2)
proj <- P_pi %*% x
resid <- x - proj
cat(sprintf("B^T resid: %.10f\n", t(B) %*% resid))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: OLS hat matrix and leverage analysis ---
# Identify high-leverage observations in a regression. N = 50
k = 3 # intercept + 2 predictors X = np.column_stack([ np.ones(N), np.random.uniform(0, 10, N), np.random.uniform(0, 5, N),
]) # Add an outlier with extreme predictor values
X[0] = [1.0, 20.0, 15.0] # far from the mean # OLS hat matrix (projection matrix)
H = X @ np.linalg.solve(X.T @ X, X.T) # X(X^TX)^{-1}X^T
leverages = np.diag(H) # Rule of thumb: leverage > 2k/n is high
threshold = 2 * k / N results = pd.DataFrame({ "obs": range(N), "leverage": leverages.round(4), "high_lev": leverages > threshold,
}) print(f"Projection matrix properties:")
print(f" Idempotent (H^2=H): {np.allclose(H @ H, H)}")
print(f" Symmetric (H^T=H): {np.allclose(H, H.T)}")
print(f" Trace = k = {k}: {np.trace(H):.4f}")
print(f"\nHigh-leverage threshold: {threshold:.4f}")
print(f"High-leverage observations: {results[results['high_lev']]['obs'].tolist()}")
print(f"\nTop 5 by leverage:")
print(results.nlargest(5, 'leverage').to_string(index=False))
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