---
title: Local Minimum
date: '2026-04-16'
wordCount: 1297
slug: local_minimum
permalink: /notes/04_calculus_optimization/differential_calculus/applications_of_derivative_kinematics_and_extrema/local_minimum/index.html
share_status: draft
publish_target: note
boundary: public
---
# $f'(x_0) = 0$ and $f''(x_0) > 0$ (Concave upward).
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A local minimum at $x_0$ is a valley: $f(x_0)$ is less than or equal to all nearby values. The second derivative test identifies it: $f'(x_0) = 0$ (flat tangent, critical point) AND $f''(x_0) > 0$ (concave up — the curve bends upward like a bowl). This is the direct mathematical foundation of loss minimization in ML. Every trained model parameter $w^*$ ideally satisfies: $\nabla L(w^*) = \mathbf{0}$ (zero gradient — critical point) and $H_{w^*} \succ 0$ (positive definite Hessian — local minimum, not a saddle). In DA: local minima of a time series are troughs — lowest points between peaks, used for support level detection in financial analysis, trough identification in seasonality decomposition, and minimum-point feature extraction. Gradient descent is specifically designed to converge to a local minimum of the loss function.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Candidate: x_0 is a critical point (f'(x_0) = 0)"] A --> B["Compute f''(x_0)"] B --> C["f''(x_0) > 0"] C --> D["Concave UP at x_0: curve bends upward like a bowl"] D --> E["x_0 is a LOCAL MINIMUM"] E --> F["f(x_0) <= f(x) for all x near x_0"] B --> G["f''(x_0) < 0: local maximum"] B --> H["f''(x_0) = 0: inconclusive, use first derivative test"] E --> I["In ML: w* minimizes loss L(w) -- goal of gradient descent"] E --> J["Hessian PD at w*: curvature tells convergence speed"] E --> K["In time series: trough detection, support levels"] J --> L["High curvature (large eigenvalues): fast convergence nearby"] J --> M["Low curvature (small eigenvalues): slow convergence, ill-conditioned"]
```
### Real-World use:
#### Situation it is used
Gradient descent convergence target: $\nabla L(w^*) \approx 0$ with $H_{w^*} \succ 0$; MLE is a local (often global) minimum of $-\log\mathcal{L}$; OLS: $\hat{w} = \text{argmin}_w \|y - Xw\|^2$, which has a unique global minimum (convex quadratic); L-BFGS and Newton's method: converge to local minima by using curvature (Hessian) information; learning rate selection: the optimal learning rate for gradient descent near a minimum is $\alpha \approx 2/(\lambda_{\min} + \lambda_{\max})$ where $\lambda$ are Hessian eigenvalues; trough detection in revenue/engagement time series; support level detection in financial time series.
#### Problem it solves
Loss minimization is the core of supervised ML training. The condition $f'(x_0) = 0, f''(x_0) > 0$ provides a computable algebraic test to confirm that a critical point is indeed a local minimum — not a saddle point or local maximum. It also connects to convergence: the magnitude of $f''(x_0)$ (curvature) determines how quickly gradient descent converges to the minimum and what learning rate is appropriate.
#### How it solves the problem
Combine: (1) $f'(x_0) = 0$ — critical point; (2) $f''(x_0) > 0$ — concave up. Geometrically: the function was decreasing to the left of $x_0$ (since $f' < 0$ for $x < x_0$ near $x_0$ when $f'' > 0$) and increasing to the right ($f' > 0$) — a valley shape. In $n$ dimensions: $\nabla L(w^*) = 0$ and all eigenvalues of $H_{w^*}$ positive (positive definite).
#### Example of it used in the Working Context as DA/DS for a Business
A DS trains a Ridge regression model, minimizing $L(w) = \|y - Xw\|^2 + \lambda\|w\|^2$. The gradient: $\nabla L(w) = -2X^T(y - Xw) + 2\lambda w = 0 \Rightarrow \hat{w} = (X^TX + \lambda I)^{-1}X^Ty$. The Hessian: $H = 2(X^TX + \lambda I)$, which is positive definite for $\lambda > 0$. By the second derivative test in $\mathbb{R}^n$: $\hat{w}$ is the unique global minimum. The DS confirms: adding $\lambda > 0$ ensures the Hessian is PD, the loss bowl is well-shaped, and the closed-form solution is unique — L2 regularization eliminates the flat directions (zero eigenvalues of $X^TX$) that would otherwise make the minimum non-unique.
### The Formula (Fragment-First)
- $f'(x_0) = 0$: the derivative is zero — $x_0$ is a stationary point, tangent is horizontal
- $f''(x_0) > 0$: the second derivative is strictly positive — the function is concave up at $x_0$
- Local minimum: $f(x_0) \leq f(x)$ for all $x$ in some open interval containing $x_0$
- "Local": the valley may not be the deepest globally; global minimum requires comparing all local minima and boundary values
- The condition is sufficient: $f''(x_0) > 0$ at a critical point guarantees a local min
- Curvature interpretation: $f''(x_0) = $ curvature of $f$ at $x_0$; larger $|f''|$ means a narrower, steeper valley; smaller $|f''|$ means a shallow, flat valley — hard to navigate with gradient descent
- In $\mathbb{R}^n$: local min when $\nabla f(x_0) = \mathbf{0}$ and Hessian $H(x_0)$ is positive definite (all eigenvalues strictly positive) ### Formula-to-English Translation
"A local minimum is a valley floor: the slope is zero at the bottom, and the ground curves upward on all sides. In machine learning, finding the weights where the loss is a local minimum is the entire goal of training — gradient descent is the algorithm that navigates toward such a point." Tiny trace: $f(x) = x^2 - 4x + 5$. $f'(x) = 2x - 4 = 0 \Rightarrow x = 2$. $f''(x) = 2 > 0$. Local min at $x=2$. $f(2) = 4 - 8 + 5 = 1$. Verify: $f(1) = 2 > 1$, $f(3) = 2 > 1$. $\checkmark$ ### Critical Concepts
- **Gradient descent navigates toward local minima:** the update $w_{t+1} = w_t - \alpha \nabla L(w_t)$ moves in the direction of steepest descent. Near a local minimum, $\nabla L \approx 0$ and the updates shrink. Convergence rate near the minimum depends on the Hessian eigenvalues: gradient descent on a quadratic converges at rate $((\kappa-1)/(\kappa+1))^2$ per step, where $\kappa = \lambda_{\max}/\lambda_{\min}$ is the condition number of the Hessian. High condition number (elongated valley) causes slow convergence.
- **Hessian condition number and learning rate:** for gradient descent to converge near a local minimum, the learning rate must satisfy $\alpha < 2/\lambda_{\max}$ (the largest Hessian eigenvalue). Too large an $\alpha$ causes oscillation or divergence. Too small: slow convergence. The optimal $\alpha = 2/(\lambda_{\min} + \lambda_{\max})$. Adaptive methods (Adam, RMSprop) implicitly estimate per-parameter curvature to automatically set effective learning rates.
- **Convex functions: every local minimum is global.** For strictly convex $f$ ($f'' > 0$ everywhere), any critical point is the unique global minimum. Ridge regression, logistic regression with L2 regularization, and linear SVM duals are all strictly convex — one global minimum, no saddle points. This is why convex models are reliable: gradient descent always converges to the same answer regardless of initialization.
- **Flat minima and generalization:** neural networks trained with SGD tend to converge to "flat" local minima — minima where the Hessian has many small eigenvalues (small curvature, wide valley). Theoretical work (Hochreiter and Schmidhuber 1997, Keskar et al. 2017) suggests flat minima generalize better than sharp minima, because small perturbations to $w^*$ cause small changes in loss. The SAM (Sharpness-Aware Minimization) optimizer explicitly seeks flat minima by penalizing sharpness.
- **OLS as a closed-form local (global) minimum:** ordinary least squares $L(w) = \|y - Xw\|^2$ has $\nabla L = -2X^T(y - Xw) = 0 \Rightarrow X^TXw = X^Ty$. If $X^TX$ is invertible, $\hat{w} = (X^TX)^{-1}X^Ty$. The Hessian $H = 2X^TX$ is PSD; if $X$ has full column rank, $H$ is PD, giving a unique global minimum. This is one of the few cases where the minimum is found in closed form without iterative optimization.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Find and verify all local minima of $f(x) = x^3 - 6x^2 + 9x + 1$.* *Step 1: Find critical points.*
$f'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x-1)(x-3) = 0$.
Critical points: $x = 1$ and $x = 3$. *Step 2: Apply second derivative test.*
$f''(x) = 6x - 12$.
At $x = 1$: $f''(1) = 6 - 12 = -6 < 0$. Local maximum.
At $x = 3$: $f''(3) = 18 - 12 = 6 > 0$. Local minimum. *Step 3: Compute values.*
$f(3) = 27 - 54 + 27 + 1 = 1$. This is the local minimum value.
$f(1) = 1 - 6 + 9 + 1 = 5$. This is the local maximum value. Verify: $f(2) = 8 - 24 + 18 + 1 = 3 > 1 = f(3)$. $f(4) = 64 - 96 + 36 + 1 = 5 > 1 = f(3)$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy.signal import find_peaks def second_derivative_test( f, f_prime, f_double_prime, x_crit_candidates: list[float]
) -> None: """Classify a list of critical point candidates.""" print(f"{'x_crit':>10} {'f(x)':>10} {'f_prime':>10} {'f_pp':>10} {'Type':>15}") for x_crit in x_crit_candidates: fpp = f_double_prime(x_crit) fp = f_prime(x_crit) fx = f(x_crit) if fpp > 1e-8: label = "LOCAL MIN" elif fpp < -1e-8: label = "LOCAL MAX" else: label = "inconclusive" print(f"{x_crit:>10.4f} {fx:>10.4f} {fp:>10.2e} {fpp:>10.4f} {label:>15}") f = lambda x: x**3 - 6*x**2 + 9*x + 1
fp = lambda x: 3*x**2 - 12*x + 9
fpp = lambda x: 6*x - 12 print("Local Minimum: f'(x0) = 0 and f''(x0) > 0")
print("\nf(x) = x^3 - 6x^2 + 9x + 1")
second_derivative_test(f, fp, fpp, [1.0, 3.0]) # Trough detection in a time series (local minima)
print("\n--- Trough detection: local minima in revenue time series ---")
np.random.seed(42)
n_weeks = 52
revenue = ( 80000 + 15000 * np.sin(2 * np.pi * np.arange(n_weeks) / 13) # quarterly cycle + 5000 * np.sin(2 * np.pi * np.arange(n_weeks) / 4) # monthly noise + np.random.randn(n_weeks) * 2000
)
# Find troughs: find_peaks on the negative signal
trough_indices, _ = find_peaks(-revenue, prominence=5000, distance=4)
print(f"{'Week':>8} {'Revenue':>12} {'Type':>25}")
for idx in trough_indices: print(f"{idx+1:>8} {revenue[idx]:>12.0f} {'TROUGH (local minimum)':>25}")
print(f"\nTroughs found: {len(trough_indices)}")
print(f"Min revenue at troughs: {revenue[trough_indices].min():,.0f}")
print(f"Overall mean revenue: {revenue.mean():,.0f}") # Loss landscape: gradient descent converging to local minimum
print("\n--- Gradient descent converging to local minimum ---")
x = 4.0
alpha = 0.05
print(f"{'Step':>6} {'x':>8} {'f(x)':>10} {'f_prime':>10} {'Converged':>10}")
for step in range(30): grad = fp(x) converged = abs(grad) < 1e-4 if step % 5 == 0 or converged: print(f"{step:>6} {x:>8.4f} {f(x):>10.4f} {grad:>10.4f} {str(converged):>10}") x -= alpha * grad if converged: break
print(f"Converged to x = {x:.4f}: {'local min' if fpp(x) > 0 else 'local max'}")
```
#### Beginner friendly Example [R])
``` r
# Local Minimum: f'(x0) = 0, f''(x0) > 0
f <- function(x) x^3 - 6*x^2 + 9*x + 1
fp <- function(x) 3*x^2 - 12*x + 9
fpp <- function(x) 6*x - 12 cat("Local Minimum: f'(x0)=0 and f''(x0)>0\n\n")
for (x_crit in c(1.0, 3.0)) { fpp_val <- fpp(x_crit) type <- if (fpp_val > 1e-8) "LOCAL MIN" else if (fpp_val < -1e-8) "LOCAL MAX" else "inconclusive" cat(sprintf("x = %.1f: f = %.1f, f'' = %.1f -> %s\n", x_crit, f(x_crit), fpp_val, type))
} # Gradient descent to local minimum
cat("\n--- Gradient descent to local min ---\n")
x <- 4.0
alpha <- 0.05
cat(sprintf("%-6s %-8s %-10s %-10s\n", "Step", "x", "f(x)", "|grad|"))
for (step in 0:29) { grad <- fp(x) if (step %% 5 == 0) { cat(sprintf("%-6d %-8.4f %-10.4f %-10.4f\n", step, x, f(x), abs(grad))) } x <- x - alpha * grad if (abs(grad) < 1e-4) break
}
cat(sprintf("Converged: x = %.4f, type = %s\n", x, if (fpp(x) > 0) "LOCAL MIN" else "LOCAL MAX"))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_regression
from sklearn.preprocessing import StandardScaler np.random.seed(42) # -- Local Minimum: Hessian eigenvalue analysis of the loss landscape at w* --
# Use case: A DS trains Ridge regression, finds the closed-form minimum,
# then diagnoses the shape of the loss valley via Hessian eigenvalue analysis.
# The condition number kappa = lambda_max / lambda_min determines:
# (a) How "round" vs "elongated" the loss bowl is
# (b) The optimal learning rate for gradient descent
# (c) How fast gradient descent converges near the minimum
#
# Low kappa: round bowl, fast convergence, well-conditioned.
# High kappa: elongated valley, slow convergence, ill-conditioned (needs preconditioner). N = 200
DIM = 6 X_raw, y = make_regression(n_samples=N, n_features=DIM, noise=1.0, random_state=42)
scaler = StandardScaler()
X = scaler.fit_transform(X_raw)
y = y / y.std() def ridge_loss(w: np.ndarray, X: np.ndarray, y: np.ndarray, lam: float) -> float: """L(w) = (1/N)||y - Xw||^2 + lambda * ||w||^2.""" residuals = y - X @ w return float(np.mean(residuals**2) + lam * np.dot(w, w)) def ridge_gradient(w: np.ndarray, X: np.ndarray, y: np.ndarray, lam: float) -> np.ndarray: """Gradient = -2/N * X^T(y - Xw) + 2*lambda*w.""" residuals = y - X @ w return -2.0 / len(y) * X.T @ residuals + 2 * lam * w def ridge_hessian(X: np.ndarray, lam: float) -> np.ndarray: """H = 2/N * X^T X + 2*lambda*I. Positive definite for lambda > 0.""" return 2.0 / len(X) * X.T @ X + 2 * lam * np.eye(X.shape[1]) print("Local Minimum: Hessian Analysis of Ridge Regression Loss Bowl") for lam in [0.0, 0.01, 0.1, 1.0]: # Closed-form minimum A = X.T @ X / N + lam * np.eye(DIM) b = X.T @ y / N w_opt = np.linalg.solve(A, b) # Hessian at the minimum H = ridge_hessian(X, lam) eigenvalues = np.linalg.eigvalsh(H) lam_min = eigenvalues.min() lam_max = eigenvalues.max() kappa = lam_max / max(lam_min, 1e-12) # Verify: gradient at minimum should be ~0 grad_at_min = ridge_gradient(w_opt, X, y, lam) loss_at_min = ridge_loss(w_opt, X, y, lam) # Optimal learning rate for gradient descent alpha_opt = 2.0 / (lam_min + lam_max) print(f"\nlambda = {lam}") print(f" Loss at minimum: {loss_at_min:.6f}") print(f" |gradient| at min: {np.linalg.norm(grad_at_min):.2e} (f'(x0) ~ 0)") print(f" Hessian eigenvalues: min={lam_min:.4f}, max={lam_max:.4f}") print(f" Condition number kappa = {kappa:.1f}") print(f" Optimal LR = 2/(lam_min+lam_max) = {alpha_opt:.4f}") psd_check = "PD (local min confirmed)" if lam_min > 1e-8 else "PSD only (degenerate)" print(f" Hessian: {psd_check}") if lam > 0: convergence_rate = ((kappa - 1) / (kappa + 1))**2 print(f" GD convergence rate (per step): {convergence_rate:.6f} (lower = faster)")
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
1300 pag 228