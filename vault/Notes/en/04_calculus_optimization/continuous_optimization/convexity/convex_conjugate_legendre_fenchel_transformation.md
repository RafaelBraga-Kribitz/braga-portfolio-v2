---
title: Convex Conjugate (Legendre-Fenchel transformation)
date: '2026-04-16'
wordCount: 976
slug: convex_conjugate_legendre_fenchel_transformation
permalink: /notes/04_calculus_optimization/continuous_optimization/convexity/convex_conjugate_legendre_fenchel_transformation/index.html
share_status: draft
publish_target: note
boundary: public
---
# $f^*(u) = \sup_x \left( x^T u - f(x) \right)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The Fenchel conjugate (also called the Legendre-Fenchel transform or convex conjugate) of a function $f$ is a new function $f^*$ that encodes the "slopes" of $f$: $f^*(u)$ asks "how much can I make $x^T u - f(x)$ large by choosing $x$ optimally?" For a convex $f$, this is a supremum over all $x$. The transform $f \mapsto f^*$ is fundamental in convex duality theory — it connects primal and dual optimization problems. In DA/DS: the conjugate appears in the derivation of SVM dual, Lasso duality, variational inference, and entropic regularization (Sinkhorn algorithms). Understanding it lets you interpret dual variables as prices/multipliers and derive efficient dual algorithms.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Given: function f(x) over domain"] A --> B["Fix a direction u (the dual variable)"] B --> C["Form h(x) = x^T u - f(x) for each x"] C --> D["Take supremum over x: f*(u) = sup_x h(x)"] D --> E["Repeat for each u to get the function f*"] E --> F["f* is always convex (even if f is not)"] F --> G["Double conjugate: f** = convex hull of f"] G --> H["If f convex and closed: f** = f (involution)"] D --> I["Fenchel-Young inequality: f(x) + f*(u) >= x^T u"] I --> J["Equality iff u is subgradient of f at x"]
```
### Real-World use:
#### Situation it is used
Deriving dual optimization problems (SVM, Lasso, logistic regression dual), computing the convex hull of non-convex functions, variational representations of KL divergence and other f-divergences, and Sinkhorn optimal transport.
#### Problem it solves
Primal optimization problems (minimize $f(x)$ over $x$) are sometimes hard to solve directly but have tractable duals. The Fenchel conjugate provides the bridge: the dual of $\min_x f(Ax) + g(x)$ uses $f^*$ and $g^*$. When both $f$ and $g$ are convex and their conjugates have closed-form expressions (as they do for many standard functions), the dual can be solved efficiently. The Fenchel-Young inequality $f(x) + f^*(u) \ge x^T u$ provides a variational lower bound used throughout ML theory.
#### How it solves the problem
$f^*(u) = \sup_x (x^T u - f(x))$ flips the optimization problem: instead of minimizing $f$, it maximizes the "gap" between the linear term $x^T u$ and $f(x)$. The result is always convex in $u$ (supremum of linear functions is convex). The Fenchel-Young inequality follows directly: $x^T u \le f(x) + f^*(u)$ for all $x, u$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS derives the SVM dual. The SVM primal: $\min_{w,b} \frac{1}{2}\|w\|^2 + C\sum \xi_i$ subject to $y_i(w^T x_i + b) \ge 1 - \xi_i$. Via Lagrangian duality (using conjugates), the dual becomes $\max_\alpha \sum \alpha_i - \frac{1}{2}\sum_{i,j}\alpha_i\alpha_j y_i y_j x_i^T x_j$ subject to $0 \le \alpha_i \le C$. The dual $\alpha_i$ are support vector weights. The conjugate of $\frac{1}{2}\|w\|^2$ is $\frac{1}{2}\|u\|^2$ (self-conjugate for the squared norm), which drives the kernel extension.
### The Formula (Fragment-First)
- $f^*$: the conjugate function; a new function of the dual variable $u$
- $u$: the dual variable; in optimization, $u$ is a "direction" or "slope" in the input space
- $x^T u$: linear function of $x$ with slope $u$; grows unboundedly if $f(x)$ doesn't grow fast enough
- $f(x)$: the original primal function being conjugated
- $x^T u - f(x)$: the "gap" between the linear term and $f$; maximized over $x$
- $\sup_x$: supremum over all $x$ in the domain of $f$; could be infinity if $f$ grows too slowly
- Fenchel-Young inequality: $f(x) + f^*(u) \ge x^T u$ for all $x, u$; equality iff $u \in \partial f(x)$
- Double conjugate: $f^{**}(x) = (f^*)^*(x)$; equals the convex hull of $f$ if $f$ is closed proper convex, $f^{**} = f$ ### Formula-to-English Translation
"For each direction $u$, find the maximum vertical gap between the line $x^T u$ and $f(x)$ over all $x$. That maximum gap is $f^*(u)$. It tells you the tightest lower bound on $f(x)$ when all you know is the slope $u$." Tiny example: $f(x) = x^2$ (1D). $f^*(u) = \sup_x (xu - x^2)$.
Maximizing over $x$: $\frac{d}{dx}(xu - x^2) = u - 2x = 0 \Rightarrow x^* = u/2$.
$f^*(u) = (u/2) \cdot u - (u/2)^2 = u^2/2 - u^2/4 = u^2/4$.
So $f(x) = x^2 \Rightarrow f^*(u) = u^2/4$.
Check Fenchel-Young: $x^2 + u^2/4 \ge xu$? Equals $(x - u/2)^2 \ge 0$. $\checkmark$ ### Critical Concepts
- **$f^*$ is always convex:** it's a pointwise supremum of linear (hence convex) functions of $u$. Even if $f$ is non-convex, $f^*$ is convex.
- **Self-conjugate functions:** $f(x) = \frac{1}{2}\|x\|^2 \Rightarrow f^*(u) = \frac{1}{2}\|u\|^2$. The squared $L_2$ norm is self-conjugate. This is why ridge regression and SVM dual have the same form.
- **Conjugate of $L_1$ norm:** $f(x) = \|x\|_1 \Rightarrow f^*(u) = \mathbb{I}[\|u\|_\infty \le 1]$ (0 if $\|u\|_\infty \le 1$, $+\infty$ otherwise). This connects Lasso ($L_1$ penalty) to its dual involving an $L_\infty$ ball constraint.
- **Conjugate of entropy:** $f(x) = x\log x$ (for $x > 0$, 0 at $x=0$) $\Rightarrow f^*(u) = e^{u-1}$. Appears in entropic regularization and Sinkhorn optimal transport.
- **Conjugate of exponential:** $f(x) = e^x \Rightarrow f^*(u) = u\log u - u$ for $u > 0$. Connects to log-sum-exp and softmax.
- **Fenchel duality:** $\min_x f(x) + g(x) = -\min_u f^*(-u) + g^*(u)$ (under regularity conditions). This is the foundation of dual decomposition algorithms.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Compute $f^*(u)$ for $f(x) = e^x$.* *Step 1: Set up the supremum*
$f^*(u) = \sup_{x \in \mathbb{R}} (xu - e^x)$. *Step 2: Find the critical point*
$\frac{d}{dx}(xu - e^x) = u - e^x = 0 \Rightarrow x^* = \log u$ (requires $u > 0$). *Step 3: Check second-order condition*
$\frac{d^2}{dx^2}(xu - e^x) = -e^x < 0$. This is a maximum. $\checkmark$ *Step 4: Evaluate at $x^*$*
$f^*(u) = (\log u) \cdot u - e^{\log u} = u\log u - u$ for $u > 0$. *Step 5: Boundary cases*
For $u \le 0$: $xu - e^x \to +\infty$ as $x \to -\infty$, so $f^*(u) = +\infty$ for $u < 0$.
For $u = 0$: $\sup_x (0 - e^x) = -\inf_x e^x = 0 - 0 = 0$, so $f^*(0) = 0$. *Result:* $f^*(u) = u\log u - u$ for $u \ge 0$, $+\infty$ for $u < 0$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy.optimize import minimize_scalar def fenchel_conjugate_numerical( func, u_val: float, x_bounds: tuple = (-10, 10),
) -> float: """Numerically compute f*(u) = sup_x [xu - f(x)].""" result = minimize_scalar( lambda x: -(x * u_val - func(x)), bounds=x_bounds, method="bounded", ) return -result.fun # f(x) = x^2: conjugate should be u^2/4
def f_squared(x: float) -> float: return x**2 def f_exp(x: float) -> float: return np.exp(x) u_grid = np.linspace(-3, 3, 13) print("f(x) = x^2: f*(u) vs analytical u^2/4")
for u in u_grid: numerical = fenchel_conjugate_numerical(f_squared, u) analytical = u**2 / 4 print(f" u={u:5.1f}: numerical={numerical:7.4f}, analytical={analytical:7.4f}") print("\nf(x) = e^x (u > 0): f*(u) vs analytical u*log(u) - u")
for u in [0.5, 1.0, 2.0, 3.0]: numerical = fenchel_conjugate_numerical(f_exp, u, x_bounds=(-20, 20)) analytical = u * np.log(u) - u print(f" u={u}: numerical={numerical:.4f}, analytical={analytical:.4f}")
```
#### Beginner friendly Example [R])
``` r
# Fenchel conjugate: f*(u) = sup_x [xu - f(x)]
fenchel_conjugate <- function(f, u_val, lower = -10, upper = 10) { result <- optimize(function(x) -(x * u_val - f(x)), lower = lower, upper = upper) -result$objective
} f_squared <- function(x) x^2
f_entropy <- function(x) if (x > 0) x * log(x) else if (x == 0) 0 else Inf u_vals <- seq(-2, 2, by = 0.5) cat("f(x)=x^2: f*(u) vs u^2/4\n")
for (u in u_vals) { num <- fenchel_conjugate(f_squared, u) anal <- u^2 / 4 cat(sprintf(" u=%4.1f: numerical=%.4f, analytical=%.4f\n", u, num, anal))
} # Fenchel-Young inequality check
cat("\nFenchel-Young: f(x) + f*(u) >= xu\n")
pairs <- list(c(1, 2), c(-1, 0.5), c(3, 1))
for (p in pairs) { x <- p[1]; u <- p[2] f_val <- f_squared(x) fstar <- fenchel_conjugate(f_squared, u) cat(sprintf(" x=%g, u=%g: f(x)=%g, f*(u)=%.4f, sum=%.4f >= xu=%g? %s\n", x, u, f_val, fstar, f_val+fstar, x*u, f_val+fstar >= x*u - 1e-8))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
from scipy.optimize import minimize np.random.seed(42) # -- SVM dual via Fenchel duality: demonstrate the connection -------------------
# The SVM primal uses f(w) = 0.5*||w||^2, whose conjugate is f*(u) = 0.5*||u||^2
# This self-conjugacy is WHY the SVM dual has the same quadratic form. # Generate linearly separable 2D data
N_POS = 30
N_NEG = 30
X_pos = np.random.randn(N_POS, 2) + np.array([2, 2])
X_neg = np.random.randn(N_NEG, 2) + np.array([-2, -2])
X = np.vstack([X_pos, X_neg])
y = np.hstack([np.ones(N_POS), -np.ones(N_NEG)]) C_PARAM = 1.0 # SVM dual: max sum(alpha) - 0.5 * alpha @ K @ alpha
# s.t. 0 <= alpha <= C, sum(alpha * y) = 0
# K_ij = y_i y_j x_i^T x_j (linear kernel with label encoding)
K = (y[:, None] * X) @ (y[:, None] * X).T def svm_dual_negative(alpha: np.ndarray) -> float: """Negative SVM dual objective (for minimization).""" return 0.5 * alpha @ K @ alpha - alpha.sum() def svm_dual_gradient(alpha: np.ndarray) -> np.ndarray: return K @ alpha - np.ones(len(alpha)) n_samples = len(y)
alpha_init = np.zeros(n_samples)
bounds = [(0, C_PARAM)] * n_samples
constraints = {"type": "eq", "fun": lambda a: a @ y, "jac": lambda a: y} result = minimize( svm_dual_negative, alpha_init, jac=svm_dual_gradient, method="SLSQP", bounds=bounds, constraints=constraints, options={"ftol": 1e-9, "maxiter": 500},
) alpha_opt = result.x
dual_value = -result.fun # Recover primal from dual: w = sum(alpha_i * y_i * x_i)
w_dual = (alpha_opt * y) @ X
support_mask = alpha_opt > 1e-4
b_dual = np.mean(y[support_mask] - X[support_mask] @ w_dual) print("SVM via Fenchel-dual optimization")
print(f"Support vectors: {support_mask.sum()} / {n_samples}")
print(f"Dual objective value: {dual_value:.6f}")
print(f"||w|| (margin = 2/||w||): {np.linalg.norm(w_dual):.4f}")
print(f"Margin: {2/np.linalg.norm(w_dual):.4f}") # Verify primal objective matches dual (strong duality for convex QP)
xi = np.maximum(0, 1 - y * (X @ w_dual + b_dual))
primal_value = 0.5 * np.linalg.norm(w_dual)**2 + C_PARAM * xi.sum()
print(f"\nPrimal objective: {primal_value:.6f}")
print(f"Dual objective: {dual_value:.6f}")
print(f"Duality gap: {abs(primal_value - dual_value):.2e} (should be ~0)")
print("\nNote: self-conjugacy of 0.5*||w||^2 <-> 0.5*||u||^2 is why")
print("the SVM dual has the same quadratic form as the primal.")
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