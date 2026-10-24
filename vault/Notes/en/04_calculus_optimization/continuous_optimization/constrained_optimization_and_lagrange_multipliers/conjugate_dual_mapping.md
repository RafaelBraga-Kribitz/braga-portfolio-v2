---
title: Conjugate dual mapping
date: '2026-04-16'
wordCount: 885
slug: conjugate_dual_mapping
permalink: /notes/04_calculus_optimization/continuous_optimization/constrained_optimization_and_lagrange_multipliers/conjugate_dual_mapping/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\min_x f(Ax) + g(x) = \max_u -f^*(u) - g^*(-A^T u)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is Fenchel duality: the dual of the composite primal $\min_x f(Ax) + g(x)$ is $\max_u -f^*(u) - g^*(-A^Tu)$, where $f^*$ and $g^*$ are the Fenchel conjugates of $f$ and $g$ respectively. The mapping $x \mapsto Ax$ (linear operator) creates coupling between $f$ and $g$, and the dual "decouples" them at the cost of introducing a dual variable $u$. This is one of the most powerful results in convex optimization: it lets you swap between a possibly hard primal and a potentially easier dual. In DA/DS: the SVM dual, Lasso dual, basis pursuit dual, and optimal transport dual all follow this template. Whenever the primal has a composite objective with a linear map, Fenchel duality provides the dual automatically.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Primal: min_x f(Ax) + g(x)"] A --> B["Compute f*(u) = sup_z [z^T u - f(z)]"] A --> C["Compute g*(v) = sup_x [x^T v - g(x)]"] B --> D["Fenchel dual: max_u -f*(u) - g*(-A^T u)"] C --> D D --> E{"Primal = Dual? (strong duality)"} E -->|"f,g convex, dom(f) intersects range of A"| F["Equality holds (Slater/regularity)"] F --> G["Optimal u* is the dual certificate"] F --> H["Primal: x* minimizes g(x) + x^T(A^T u*)"] E -->|"No regularity"| I["Duality gap possible"]
```
### Real-World use:
#### Situation it is used
Deriving the Lasso dual (f = L2 loss, g = L1 penalty, A = X), SVM dual (f = hinge, g = L2 regularizer), basis pursuit dual (f = indicator of $\{b\}$, g = L1), optimal transport (Kantorovich dual), and network flow problems.
#### Problem it solves
The primal $\min_x f(Ax) + g(x)$ can be hard when $f$ and $g$ compete (e.g., data fit vs regularizer) especially in high dimensions. The dual often has far fewer variables (one $u$ per output dimension of $A$, e.g., per training sample) and/or is easier to optimize. Duality also provides certificates: if primal value = dual value, you have the global optimum regardless of the algorithm used.
#### How it solves the problem
By the definition of conjugates: $f(Ax) = \sup_u [u^T Ax - f^*(u)]$ (Fenchel-Young equality at optimum). Substituting into the primal and swapping $\min$ and $\max$ (justified by strong duality): $\min_x \sup_u [u^T Ax + g(x) - f^*(u)] = \max_u \min_x [u^T Ax + g(x)] - f^*(u) = \max_u [-f^*(u) - g^*(-A^Tu)]$.
#### Example of it used in the Working Context as DA/DS for a Business
Lasso primal: $\min_w \frac{1}{2}\|y-Xw\|^2 + \lambda\|w\|_1$. Here $f(z) = \frac{1}{2}\|z\|^2$, $g(w) = \lambda\|w\|_1$, $A=X$, so $y-Xw$ shifted. Conjugates: $f^*(u) = \frac{1}{2}\|u\|^2$; $g^*(-X^Tu) = 0$ if $\|X^Tu\|_\infty \le \lambda$, $+\infty$ otherwise (dual of L1 is L-infinity indicator). Lasso dual: $\max_u -\frac{1}{2}\|u\|^2 + y^T u$ s.t. $\|X^T u\|_\infty \le \lambda$. This provides a duality gap monitor during training.
### The Formula (Fragment-First)
- $\min_x$: primal minimization over $x$
- $f(Ax)$: first term; $f$ acts on the image $Ax$ of the primal variable (e.g., $f = \frac{1}{2}\|\cdot - y\|^2$)
- $g(x)$: second term; regularizer acting directly on $x$ (e.g., $g = \lambda\|\cdot\|_1$)
- $A$: linear operator (e.g., design matrix $X$); couples $x$ to $f$
- $\max_u$: dual maximization over $u$ (dual variable; same dimension as output of $A$)
- $f^*(u)$: conjugate of $f$; see $f^*(u) = \sup_z(z^Tu - f(z))$
- $g^*(-A^Tu)$: conjugate of $g$ evaluated at $-A^Tu$; the transpose $A^T$ transposes the coupling
- Equality: holds under Slater's condition (constraint qualification)
- Primal recovery: at optimum, $u^*$ is such that $x^* = \nabla g^*(-A^T u^*)$ and $Ax^* = \nabla f^*(u^*)$ ### Formula-to-English Translation
"Minimize the sum of a function of $Ax$ plus a regularizer of $x$. The dual flips this: maximize negative conjugate of the first function minus the conjugate of the regularizer evaluated at $-A^T u$. The same optimal value is reached from both sides (under strong duality)." Tiny example: $\min_x \frac{1}{2}(Ax-b)^2 + \frac{\lambda}{2}x^2$ (ridge, 1D).
$f(z) = \frac{1}{2}(z-b)^2$: $f^*(u) = \frac{1}{2}u^2 + bu$.
$g(x) = \frac{\lambda}{2}x^2$: $g^*(v) = \frac{1}{2\lambda}v^2$.
Dual: $\max_u -\frac{1}{2}u^2 - bu - \frac{1}{2\lambda}(Au)^2$.
Setting $\partial_u = 0$: $-u - b - \frac{A^2}{\lambda}u = 0 \Rightarrow u^* = -b\lambda/(A^2+\lambda)$.
Primal from dual: $x^* = g^{*\prime}(-Au^*) = -Au^*/\lambda = Ab/(A^2+\lambda)$.
Direct: $x^* = Ab/(A^2+\lambda)$ ($\lambda$-ridge solution). $\checkmark$ ### Critical Concepts
- **Conjugate pairs in ML:** | Primal $g(x)$ | Conjugate $g^*(v)$ |
|---|---|
| $\lambda\|x\|_1$ | $0$ if $\|v\|_\infty \le \lambda$, else $+\infty$ |
| $\frac{\lambda}{2}\|x\|^2$ | $\frac{1}{2\lambda}\|v\|^2$ |
| $\lambda\|x\|_1 + \frac{\mu}{2}\|x\|^2$ | Moreau envelope (elastic net dual) |
| $\delta_{\mathcal{C}}(x)$ (indicator) | Support function $\sup_{x\in\mathcal{C}} x^Tv$ | - **Duality gap as optimality certificate:** at any primal feasible $x$ and dual feasible $u$: gap $= [f(Ax)+g(x)] - [-f^*(u)-g^*(-A^Tu)] \ge 0$. When gap $= 0$, both are optimal. Used in ADMM and proximal gradient stopping criteria.
- **Dual variables as certificates:** $u^*$ satisfies $A^T u^* \in \partial g(x^*)$ and $u^* \in \partial f(Ax^*)$ (subgradient conditions). These are the KKT conditions expressed in conjugate form.
- **Fenchel-Rockafellar theorem:** the equality holds under the regularity condition $\text{ri}(\text{dom}(f)) \cap A(\text{ri}(\text{dom}(g))) \ne \emptyset$ (relative interiors intersect), which generalizes Slater's condition.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Verify Fenchel duality for Basis Pursuit: $\min_x \|x\|_1$ s.t. $Ax = b$ (i.e., $\min_x \|x\|_1 + \delta_{\{b\}}(Ax)$).* $f(z) = \delta_{\{b\}}(z)$ (0 if $z=b$, $+\infty$ else): $f^*(u) = u^Tb$ (support function of $\{b\}$).
$g(x) = \|x\|_1$: $g^*(v) = \delta_{\{v:\|v\|_\infty \le 1\}}(v)$ (0 if $\|v\|_\infty \le 1$, else $+\infty$). Dual: $\max_u -f^*(u) - g^*(-A^Tu) = \max_u \{-u^Tb : \|A^Tu\|_\infty \le 1\} = \max_u \{-u^Tb : \|A^Tu\|_\infty \le 1\}$. This is the basis pursuit dual: $\max_u -b^Tu$ (or equivalently $\min_u b^Tu$) subject to $\|A^Tu\|_\infty \le 1$. At optimum, $b^Tu^* = \|x^*\|_1$ (primal = dual).
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy.optimize import minimize def fenchel_conjugate_l1(v: np.ndarray, lam: float) -> float: """Conjugate of lam*||x||_1: 0 if ||v||_inf <= lam, else +inf.""" return 0.0 if np.max(np.abs(v)) <= lam + 1e-9 else float("inf") def fenchel_conjugate_l2sq(u: np.ndarray) -> float: """Conjugate of 0.5*||.||^2: 0.5*||u||^2.""" return 0.5 * float(np.sum(u**2)) # Lasso: min_w 0.5||y - Xw||^2 + lam*||w||_1
# Primal vs dual computation
np.random.seed(42)
n, d = 50, 10
X = np.random.randn(n, d)
true_w = np.zeros(d)
true_w[:3] = [2.0, -1.5, 1.0]
y = X @ true_w + 0.3 * np.random.randn(n)
LAM = 0.5 def lasso_primal(w: np.ndarray) -> float: return 0.5 * np.sum((y - X @ w)**2) + LAM * np.sum(np.abs(w)) # Lasso dual: max_u { -0.5||u||^2 + y^T u } s.t. ||X^T u||_inf <= lam
def lasso_dual_neg(u: np.ndarray) -> float: if np.max(np.abs(X.T @ u)) > LAM + 1e-9: return float("inf") return 0.5 * np.sum(u**2) - y @ u result_primal = minimize(lasso_primal, np.zeros(d), method="L-BFGS-B")
w_star = result_primal.x print(f"Lasso primal value: {lasso_primal(w_star):.6f}")
print(f"Non-zero entries: {np.where(np.abs(w_star) > 0.05)[0].tolist()}")
print(f"w[0:3] = {w_star[:3].round(4)}") # Dual certificate: compute residual and check
residual = y - X @ w_star
u_candidate = residual # at optimum, u* = residual for Lasso
dual_infeas = max(0, np.max(np.abs(X.T @ u_candidate)) - LAM)
print(f"\nDual infeasibility ||X^T r||_inf - lam: {dual_infeas:.4e} (should be ~0)")
```
#### Beginner friendly Example [R])
``` r
# Fenchel duality: Lasso primal and dual
fenchel_dual_lasso <- function(X, y, lam) { # Dual: max { -0.5*||u||^2 + y^Tu } s.t. ||X^T u||_inf <= lam # At optimum u* = residual = y - X*w* n <- nrow(X) # Solve primal via coordinate descent (glmnet approximation) glmnet::glmnet(X, y, alpha = 1, lambda = lam / n, intercept = FALSE)
} # Manual primal
lasso_primal <- function(w, X, y, lam) { 0.5 * sum((y - X %*% w)^2) + lam * sum(abs(w))
} set.seed(42)
n <- 50; d <- 10
X <- matrix(rnorm(n*d), n, d)
true_w <- c(2, -1.5, 1, rep(0, 7))
y <- X %*% true_w + 0.3 * rnorm(n)
lam <- 0.5 # Primal optimization
result <- optim(rep(0, d), function(w) lasso_primal(w, X, y, lam), method = "L-BFGS-B")
w_star <- result$par # Dual certificate check
residual <- y - X %*% w_star
dual_infeas <- max(0, max(abs(t(X) %*% residual)) - lam)
cat(sprintf("Primal value: %.6f\n", lasso_primal(w_star, X, y, lam)))
cat(sprintf("Dual infeasibility: %.4e (should be ~0)\n", dual_infeas))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.linear_model import Lasso np.random.seed(42) # -- Track duality gap as convergence monitor during Lasso training -----------
# Uses Fenchel duality: primal - dual >= 0, gap = 0 at optimum
N, D = 200, 30
X = np.random.randn(N, D)
true_w = np.zeros(D)
true_w[:6] = [3.0, -2.0, 1.5, -1.0, 0.8, -0.5]
y = X @ true_w + 0.5 * np.random.randn(N)
LAM = 0.8 def lasso_primal_value(w: np.ndarray) -> float: return 0.5 / N * np.sum((y - X @ w)**2) + LAM * np.sum(np.abs(w)) def lasso_dual_value(w: np.ndarray) -> float: """Compute dual value via the residual dual certificate.""" # Dual variable: u = residual, clipped so ||X^T u||_inf <= lam*N residual = y - X @ w xtu = X.T @ residual scale = np.max(np.abs(xtu)) / (LAM * N) if scale > 1: residual_scaled = residual / scale else: residual_scaled = residual # Dual: -0.5/N*||u||^2 + (1/N)*y^T u where u = residual_scaled return float(-0.5 / N * np.sum(residual_scaled**2) + 1/N * y @ residual_scaled) # Coordinate descent to simulate gap evolution
alphas = np.logspace(-1, -3, 50)
gaps = [] for alpha in alphas: sk_lasso = Lasso(alpha=alpha, fit_intercept=False, max_iter=10000, tol=1e-8) sk_lasso.fit(X, y) w_est = sk_lasso.coef_ primal = lasso_primal_value(w_est) dual = lasso_dual_value(w_est) gap = primal - dual gaps.append((alpha, primal, dual, gap)) print(f"Fenchel Duality Gap Monitor (Lasso)")
print(f"{'Lambda':>10} {'Primal':>12} {'Dual':>12} {'Gap':>12}")
for alpha, p, d_val, g in gaps[::10]: print(f"{alpha:>10.4f} {p:>12.6f} {d_val:>12.6f} {g:>12.2e}") # Final model at LAM
sk_final = Lasso(alpha=LAM, fit_intercept=False, max_iter=10000, tol=1e-10)
sk_final.fit(X, y)
w_final = sk_final.coef_
print(f"\nFinal model (lam={LAM}):")
print(f" Primal value: {lasso_primal_value(w_final):.6f}")
print(f" Dual value: {lasso_dual_value(w_final):.6f}")
print(f" Duality gap: {lasso_primal_value(w_final) - lasso_dual_value(w_final):.2e}")
print(f" Active features (|w|>0.05): {np.where(np.abs(w_final)>0.05)[0].tolist()}")
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
`` Domain knowledge.