---
title: Hessian Matrix
date: '2026-04-16'
wordCount: 1061
slug: hessian_matrix
permalink: /notes/04_calculus_optimization/multivariable_calculus_and_matrix_calculus/differential_operators_gradients_jacobians_hessians/hessian_matrix/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\nabla^2 f = \begin{bmatrix} \frac{\partial^2 f}{\partial x_1^2} & \dots & \frac{\partial^2 f}{\partial x_1 \partial x_d} \\ \vdots & \ddots & \vdots \\ \frac{\partial^2 f}{\partial x_d \partial x_1} & \dots & \frac{\partial^2 f}{\partial x_d^2} \end{bmatrix} \in \mathbb{R}^{d \times d}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The Hessian matrix $\nabla^2 f$ (also written $H_f$) is the matrix of all second-order partial derivatives of a scalar function $f: \mathbb{R}^d \to \mathbb{R}$. The $(i,j)$ entry is $\frac{\partial^2 f}{\partial x_i \partial x_j}$: how the partial derivative in direction $x_j$ changes as we move in direction $x_i$. The gradient captures first-order information (slope); the Hessian captures second-order information (curvature). In DA/DS and ML, the Hessian is central to: the second-derivative test for classifying critical points (is it a minimum, maximum, or saddle?), Newton's method (second-order optimization that converges much faster than gradient descent by accounting for curvature), Laplace approximation in Bayesian inference (the posterior is approximated as a Gaussian centered at the MAP with covariance $H^{-1}$), and understanding the condition number of the loss landscape (which determines how fast gradient descent converges and how sensitive the model is to small perturbations).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Scalar function f: R^d -> R"] --> B["Compute gradient: grad_f = [df/dx1, ..., df/xd]"] B --> C["Differentiate each partial again w.r.t. each variable"] C --> D["Assemble d x d matrix: H[i,j] = d^2f / (dxi dxj)"] D --> E["Hessian is symmetric (Schwarz): H[i,j] = H[j,i]"] D --> F{"Eigenvalue analysis at a critical point (grad=0)"} F -- "All eigenvalues > 0 (PD)" --> G["Local minimum"] F -- "All eigenvalues < 0 (ND)" --> H["Local maximum"] F -- "Mixed signs (indefinite)" --> I["Saddle point"] F -- "Any zero eigenvalue" --> J["Degenerate: test inconclusive"]
```
### Real-World use:
#### Situation it is used
Second-derivative test for critical points. Newton's method (second-order optimization): $\mathbf{x}^{(t+1)} = \mathbf{x}^{(t)} - H^{-1}\nabla f$ — uses curvature to take optimal steps. Laplace approximation: approximate posterior as $\mathcal{N}(\hat{\theta}, (-H)^{-1})$ at the MAP estimate $\hat{\theta}$. Fisher information matrix (the expected Hessian of the log-likelihood, related to natural gradient methods). Condition number $\kappa(H) = \lambda_{\max}/\lambda_{\min}$ as a measure of how difficult gradient descent will be. Second-order Taylor expansion: $f(\mathbf{x} + \mathbf{h}) \approx f(\mathbf{x}) + \nabla f \cdot \mathbf{h} + \frac{1}{2}\mathbf{h}^T H \mathbf{h}$.
#### Problem it solves
The gradient tells you the slope but not the shape of the function around a point. Knowing whether you are at a minimum, maximum, or saddle requires the second derivative (curvature). For $d > 1$, this curvature varies by direction, and the Hessian matrix captures all $d^2$ pairwise curvature interactions.
#### How it solves the problem
By differentiating the gradient: $H_{ij} = \frac{\partial}{\partial x_i}\left(\frac{\partial f}{\partial x_j}\right)$. The Hessian is always symmetric (by Schwarz's theorem: mixed partials commute for smooth $f$), so it has $d$ real eigenvalues. The sign pattern of the eigenvalues determines the type of critical point and the shape of the quadratic approximation of $f$ near that point.
#### Example of it used in the Working Context as DA/DS for a Business
At the optimal weights $\hat{w}$ of a logistic regression model (the MLE), the Hessian of the log-likelihood is $H = -X^T W X$ where $W = \text{diag}(p_i(1-p_i))$. This is negative semi-definite (log-likelihood concave = loss convex). The inverse Fisher information $(-H)^{-1} = (X^T W X)^{-1}$ is the covariance matrix of the MLE: it gives the uncertainty in each coefficient. Practitioners compute standard errors for each coefficient as $\text{se}(\hat{w}_j) = \sqrt{[(X^T W X)^{-1}]_{jj}}$.
### The Formula (Fragment-First)
$$\nabla^2 f = H_f = \begin{bmatrix} \frac{\partial^2 f}{\partial x_1^2} & \cdots & \frac{\partial^2 f}{\partial x_1 \partial x_d} \\ \vdots & \ddots & \vdots \\ \frac{\partial^2 f}{\partial x_d \partial x_1} & \cdots & \frac{\partial^2 f}{\partial x_d^2} \end{bmatrix} \in \mathbb{R}^{d \times d}$$ Each symbol:
- $\nabla^2 f$ or $H_f$: the Hessian matrix — a $d \times d$ symmetric matrix
- $(i,j)$ entry: $H_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}$ — second-order mixed partial
- Diagonal entries: $H_{ii} = \frac{\partial^2 f}{\partial x_i^2}$ — the second derivative in the $x_i$-direction (curvature along axis $i$)
- Off-diagonal entries: $H_{ij}$ for $i \neq j$ — interaction curvature between variables $i$ and $j$
- Symmetry: $H_{ij} = H_{ji}$ (by Schwarz's theorem), so the Hessian has $d(d+1)/2$ unique entries **Second-order Taylor expansion**:
$$f(\mathbf{x} + \mathbf{h}) \approx f(\mathbf{x}) + \nabla f(\mathbf{x})^T \mathbf{h} + \frac{1}{2}\mathbf{h}^T H(\mathbf{x})\,\mathbf{h}$$ **Newton's method step**:
$$\mathbf{x}^{(t+1)} = \mathbf{x}^{(t)} - H(\mathbf{x}^{(t)})^{-1}\nabla f(\mathbf{x}^{(t)})$$ ### Formula-to-English Translation
"The gradient tells you the slope of $f$ at a point. The Hessian tells you how the slope is changing — the curvature. Each diagonal entry $H_{ii}$ says how much the slope in the $x_i$-direction steepens or flattens as you move in that direction. Each off-diagonal entry $H_{ij}$ says how much the slope in the $x_j$-direction changes as you move in the $x_i$-direction (the interaction). Positive eigenvalues = bowl shape (minimum); negative = dome shape (maximum); mixed = saddle." ### Critical Concepts
- **Positive definite (PD)**: all eigenvalues $> 0$. $\mathbf{h}^T H \mathbf{h} > 0$ for all $\mathbf{h} \neq 0$. The function is locally convex. A critical point with a PD Hessian is a local minimum.
- **Negative definite (ND)**: all eigenvalues $< 0$. Critical point is a local maximum.
- **Indefinite**: mixed eigenvalue signs. Critical point is a saddle point.
- **Condition number**: $\kappa(H) = \lambda_{\max}/\lambda_{\min}$. Large $\kappa$ means the loss landscape is elongated (like an ellipse): gradient descent zigzags slowly; Newton's method handles this well.
- **Computational cost**: the Hessian has $d^2$ entries. For a neural network with millions of parameters, storing and inverting the full Hessian is infeasible. Approximations: diagonal Hessian, Gauss-Newton, Kronecker factorizations (KFAC), L-BFGS.
- **Fisher Information**: for a statistical model $p(x|\theta)$, the Fisher information matrix $I(\theta) = -E[\nabla^2 \log p]$ is the expected negative Hessian of the log-likelihood. The Cramér-Rao bound says no unbiased estimator has covariance smaller than $I(\theta)^{-1}$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Let $f(x_1, x_2) = x_1^2 + 4x_1 x_2 + 3x_2^2$. Compute the Hessian and classify the origin. *Step 1: Compute all first-order partials*
$\frac{\partial f}{\partial x_1} = 2x_1 + 4x_2$, $\frac{\partial f}{\partial x_2} = 4x_1 + 6x_2$ *Step 2: Compute all second-order partials*
$\frac{\partial^2 f}{\partial x_1^2} = 2$, $\frac{\partial^2 f}{\partial x_2^2} = 6$, $\frac{\partial^2 f}{\partial x_1 \partial x_2} = 4$ *Step 3: Assemble the Hessian (constant for this quadratic $f$)*
$$H = \begin{bmatrix} 2 & 4 \\ 4 & 6 \end{bmatrix}$$ *Step 4: Compute eigenvalues*
$\det(H - \lambda I) = (2-\lambda)(6-\lambda) - 16 = \lambda^2 - 8\lambda - 4 = 0$
$\lambda = \frac{8 \pm \sqrt{64+16}}{2} = 4 \pm 2\sqrt{5} \approx 4 \pm 4.47$
$\lambda_1 \approx 8.47$, $\lambda_2 \approx -0.47$ *Step 5: Classify*
Mixed signs: the Hessian is **indefinite**. The origin (where $\nabla f = 0$) is a **saddle point**. Despite $H_{11} = 2 > 0$ (concave up in $x_1$-direction), the off-diagonal coupling creates a direction of negative curvature.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def f(x: np.ndarray) -> float: """f(x1, x2) = x1^2 + 4*x1*x2 + 3*x2^2.""" return float(x[0]**2 + 4.0 * x[0] * x[1] + 3.0 * x[1]**2) def analytic_hessian() -> np.ndarray: """Hessian of f (constant for this quadratic).""" return np.array([[2.0, 4.0], [4.0, 6.0]]) def numerical_hessian(fn, x: np.ndarray, h: float = 1e-4) -> np.ndarray: """Numerical Hessian via centered finite differences.""" n = len(x) hess = np.zeros((n, n)) for i in range(n): for j in range(n): e_i = np.zeros(n); e_i[i] = h e_j = np.zeros(n); e_j[j] = h hess[i, j] = (fn(x + e_i + e_j) - fn(x + e_i - e_j) - fn(x - e_i + e_j) + fn(x - e_i - e_j)) / (4 * h**2) return hess x0 = np.array([1.0, 2.0])
h_analytic = analytic_hessian()
h_numerical = numerical_hessian(f, x0) print("Analytic Hessian:")
print(h_analytic)
print("\nNumerical Hessian:")
print(h_numerical)
print(f"\nSymmetric: {np.allclose(h_analytic, h_analytic.T)}") eigenvalues = np.linalg.eigvalsh(h_analytic)
print(f"\nEigenvalues: {eigenvalues}")
if (eigenvalues > 0).all(): print("Classification: POSITIVE DEFINITE -> local minimum")
elif (eigenvalues < 0).all(): print("Classification: NEGATIVE DEFINITE -> local maximum")
else: print("Classification: INDEFINITE -> saddle point") condition_number = abs(eigenvalues.max()) / abs(eigenvalues.min())
print(f"Condition number: {condition_number:.2f}")
```
#### Beginner friendly Example [R])
``` r
f <- function(x) x[1]^2 + 4 * x[1] * x[2] + 3 * x[2]^2 # Analytic Hessian
H_analytic <- matrix(c(2, 4, 4, 6), nrow = 2, byrow = TRUE)
cat("Analytic Hessian:\n"); print(H_analytic) # Eigenvalues and classification
ev <- eigen(H_analytic)$values
cat("Eigenvalues:", ev, "\n")
if (all(ev > 0)) { cat("Classification: Positive Definite -> local minimum\n")
} else if (all(ev < 0)) { cat("Classification: Negative Definite -> local maximum\n")
} else { cat("Classification: Indefinite -> saddle point\n")
} cat("Condition number:", max(abs(ev)) / min(abs(ev)), "\n")
```
#### Final Professional Example [Python])
``` python
"""
Hessian of logistic regression log-likelihood: Fisher information and MLE covariance. At the MLE w_hat, the log-likelihood is maximized.
The Hessian H = -X^T W X (where W = diag(p_i * (1-p_i))) is negative definite.
The inverse Fisher information (X^T W X)^{-1} gives the MLE covariance: Cov(w_hat) ≈ (X^T W X)^{-1} Standard errors for each coefficient: se(w_j) = sqrt(Cov[j,j]).
This is used for confidence intervals and p-values in logistic regression.
"""
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler RANDOM_SEED = 42 x_raw, y_data = make_classification(n_samples=1000, n_features=5, n_informative=4, random_state=RANDOM_SEED)
x_train, _, y_train, _ = train_test_split(x_raw, y_data, test_size=0.3, random_state=RANDOM_SEED)
scaler = StandardScaler()
x_train_s = scaler.fit_transform(x_train) # Fit logistic regression to get MLE weights
lr = LogisticRegression(C=1e6, solver="lbfgs", max_iter=1000, random_state=RANDOM_SEED)
lr.fit(x_train_s, y_train)
w_hat = lr.coef_[0] # MLE weights def sigmoid(z: np.ndarray) -> np.ndarray: return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500))) # Hessian of log-likelihood: H = -X^T W X
prob = sigmoid(x_train_s @ w_hat)
W_diag = prob * (1.0 - prob) # weight for each sample # H = -X^T W X (negative definite at MLE)
hessian_loglik = -x_train_s.T @ (W_diag[:, None] * x_train_s) # Fisher information: I(w) = X^T W X = -H
fisher_info = -hessian_loglik # MLE covariance: Cov(w_hat) ≈ (X^T W X)^{-1}
mle_cov = np.linalg.inv(fisher_info)
standard_errors = np.sqrt(np.diag(mle_cov)) # Eigenvalues of Hessian (all should be negative at MLE)
eigenvalues = np.linalg.eigvalsh(hessian_loglik) print("=== Logistic Regression MLE: Hessian Analysis ===")
print(f" Hessian eigenvalues: {eigenvalues}")
print(f" All negative (log-likelihood concave at MLE): {(eigenvalues < 0).all()}")
print()
print(f" Condition number of Fisher info: {np.linalg.cond(fisher_info):.2f}")
print()
print(" MLE coefficient standard errors (via Hessian):")
print(f" {'j':>3} | {'w_hat[j]':>12} | {'se(w_j)':>12} | {'95% CI':>24}")
for j in range(len(w_hat)): lo = w_hat[j] - 1.96 * standard_errors[j] hi = w_hat[j] + 1.96 * standard_errors[j] print(f" {j:>3} | {w_hat[j]:>12.4f} | {standard_errors[j]:>12.4f} | [{lo:.4f}, {hi:.4f}]")
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
MML2 pag 156