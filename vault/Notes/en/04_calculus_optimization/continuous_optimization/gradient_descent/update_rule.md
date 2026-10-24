---
title: Update Rule
date: '2026-04-16'
wordCount: 984
slug: update_rule
permalink: /notes/04_calculus_optimization/continuous_optimization/gradient_descent/update_rule/index.html
share_status: draft
publish_target: note
boundary: public
---
# $x_{i+1} = x_i - \gamma_i (\nabla f(x_i))^T$ (where $\gamma_i$ is the learning rate)
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the core iteration of gradient descent: given current parameters $x_i$, subtract the gradient of the loss (scaled by learning rate $\gamma_i$) to obtain the next iterate $x_{i+1}$. The negative gradient points in the direction of steepest descent, so this step moves $x$ downhill on the loss surface. The superscript $T$ converts the gradient from a row vector (Jacobian convention) to a column vector (parameter vector convention) — in practice, for $f: \mathbb{R}^d \to \mathbb{R}$, $\nabla f(x_i) \in \mathbb{R}^d$ and the update subtracts it directly. This single equation is the foundation of all ML training: SGD, mini-batch GD, Adam, and RMSProp are all modifications of this update rule.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Current parameters: x_i"] A --> B["Compute gradient: g_i = nabla f(x_i)"] B --> C["Choose learning rate: gamma_i"] C --> D["Update: x_{i+1} = x_i - gamma_i * g_i"] D --> E["i = i + 1"] E --> F{"Converged? ||g_i|| < tol?"} F -->|"YES"| G["Return x* = x_i"] F -->|"NO"| A C --> H["Fixed: gamma constant"] C --> I["Decaying: gamma_i = gamma_0 / sqrt(i)"] C --> J["Line search: choose gamma to satisfy Armijo condition"]
```
### Real-World use:
#### Situation it is used
Training every gradient-based ML model: linear regression, logistic regression, SVM (subgradient), neural networks. Also: fine-tuning pre-trained language models, optimizing hyperparameters using gradient through validation loss, training embedding models (word2vec, matrix factorization).
#### Problem it solves
Given a differentiable loss $f(x)$, finding $x^*$ that minimizes it. The update rule provides the iterative procedure: compute gradient at current point, step in the negative gradient direction, repeat. Each step is guaranteed to decrease $f$ (for small enough $\gamma_i$) because the gradient is the direction of steepest ascent.
#### How it solves the problem
Taylor expansion: $f(x - \gamma g) \approx f(x) - \gamma \|g\|^2$ (for small $\gamma$), where $g = \nabla f(x)$. Since $\|g\|^2 \ge 0$, each gradient step decreases $f$ by approximately $\gamma \|g\|^2$. The exact decrease depends on curvature, which is why learning rate selection matters. For strongly convex $f$ with $L$-Lipschitz gradient, the optimal fixed step is $\gamma = 1/L$ and convergence is linear: $f(x_i) - f(x^*) \le (1 - m/L)^i [f(x_0) - f(x^*)]$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS trains logistic regression on 100k e-commerce transactions. $f(w) = \sum_i \log(1 + e^{-y_i w^T x_i}) + \lambda \|w\|^2$. Gradient: $\nabla f(w) = -\sum_i y_i x_i \sigma(-y_i w^T x_i) + 2\lambda w$ where $\sigma$ is sigmoid. Update: $w \leftarrow w - \gamma \nabla f(w)$. With $\gamma = 0.01$ and 500 iterations, the model converges to AUC 0.87 on the test set.
### The Formula (Fragment-First)
- $x_{i+1}$: the new parameter vector after one gradient step
- $x_i$: the current parameter vector at iteration $i$
- $\gamma_i$: the learning rate at iteration $i$; scalar that scales the step size; $\gamma_i > 0$
- $\nabla f(x_i)$: the gradient of $f$ evaluated at $x_i$; a vector of partial derivatives; points uphill
- $-\gamma_i \nabla f(x_i)$: the gradient step; negative because we go downhill
- $(\nabla f(x_i))^T$: transpose notation; in ML, gradient is often written as a row vector (Jacobian), transposed to match column vector $x$; in practice, numpy computes $\nabla f$ as a column vector directly
- $i$: iteration index; subscript denotes which iterate (not element-wise indexing)
- Variable learning rate: $\gamma_i$ can change each iteration (learning rate schedules, line search) ### Formula-to-English Translation
"The new parameters equal the old parameters minus the learning rate times the gradient. Move a small step in the direction opposite to the gradient (which points uphill), so we go downhill on the loss surface." Tiny example: $f(x) = x^2$, $x_0 = 5$, $\gamma = 0.3$.
$\nabla f(x_0) = 2 \cdot 5 = 10$.
$x_1 = 5 - 0.3 \cdot 10 = 5 - 3 = 2$.
$\nabla f(x_1) = 2 \cdot 2 = 4$.
$x_2 = 2 - 0.3 \cdot 4 = 2 - 1.2 = 0.8$.
$x_3 = 0.8 - 0.3 \cdot 1.6 = 0.32$. Converging to $x^* = 0$.
### Critical Concepts
- **Too large $\gamma$:** overshooting; can diverge. For $f(x) = x^2$, instability occurs when $\gamma > 1/L = 0.5$ (since $L = 2$ for $\nabla^2 f = 2$). At $\gamma = 0.5$: $x_1 = x_0 - 0.5 \cdot 2x_0 = 0$. At $\gamma = 0.6$: $x_1 = x_0 - 1.2 x_0 = -0.2 x_0$ — still converges but oscillates.
- **Too small $\gamma$:** slow convergence; needs many more iterations.
- **Learning rate schedules:** constant ($\gamma$), step decay ($\gamma / 2$ every $k$ epochs), cosine annealing, warm restarts, linear warmup + cosine decay (common for transformers).
- **Difference from Newton's method:** gradient descent uses $-\nabla f$ only (first order); Newton uses $-(\nabla^2 f)^{-1} \nabla f$ (second order). Newton converges faster (quadratically near optimum) but requires computing and inverting the Hessian (expensive for $d$ large).
- **Mini-batch vs full batch:** full batch uses the exact gradient (one pass over all $n$ samples); mini-batch uses the gradient of a random subset of size $B$; stochastic (SGD) uses $B=1$. Noisy gradients add implicit regularization and help escape local minima in deep learning.
- **Gradient clipping:** in deep learning, gradients can become very large (exploding gradients in RNNs). Clipping: $g \leftarrow g \cdot \min(1, c/\|g\|)$ prevents instability without changing direction.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Run 4 gradient descent steps on $f(w_1, w_2) = w_1^2 + 4w_2^2$ starting at $(3, 2)$ with $\gamma = 0.2$.* $\nabla f = (2w_1, 8w_2)$. | Step | $w_1$ | $w_2$ | $g_1 = 2w_1$ | $g_2 = 8w_2$ | $f(w)$ |
|------|--------|--------|--------------|--------------|--------|
| 0 | 3.000 | 2.000 | 6.000 | 16.000 | 25.000 |
| 1 | 1.800 | -1.200 | 3.600 | -9.600 | 9.000 |
| 2 | 1.080 | 0.720 | 2.160 | 5.760 | 3.240 |
| 3 | 0.648 | -0.432 | 1.296 | -3.456 | 1.166 |
| 4 | 0.389 | 0.259 | 0.778 | 2.074 | 0.420 | Converging to $(0, 0)$. Note: large step for $w_2$ term ($8w_2$) causes oscillation; the $w_1$ term converges faster.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def gradient_descent_step( x: np.ndarray, grad: np.ndarray, learning_rate: float,
) -> np.ndarray: """Single gradient descent update: x_{i+1} = x_i - gamma * grad.""" return x - learning_rate * grad # f(w) = w1^2 + 4*w2^2; gradient = (2w1, 8w2)
def f(w: np.ndarray) -> float: return w[0]**2 + 4 * w[1]**2 def grad_f(w: np.ndarray) -> np.ndarray: return np.array([2 * w[0], 8 * w[1]]) LEARNING_RATE = 0.2
N_STEPS = 10
w = np.array([3.0, 2.0]) print(f"Gradient descent: f(w) = w1^2 + 4*w2^2, gamma={LEARNING_RATE}")
print(f"{'Step':>4} {'w1':>8} {'w2':>8} {'f(w)':>10} {'||grad||':>10}")
for step in range(N_STEPS): g = grad_f(w) print(f"{step:>4} {w[0]:>8.4f} {w[1]:>8.4f} {f(w):>10.4f} {np.linalg.norm(g):>10.4f}") w = gradient_descent_step(w, g, LEARNING_RATE) print(f"\nFinal w* = {w}, f(w*) = {f(w):.2e}")
```
#### Beginner friendly Example [R])
``` r
# Gradient descent update rule: x_{i+1} = x_i - gamma_i * grad_f(x_i)
gd_step <- function(x, grad, learning_rate) x - learning_rate * grad f <- function(w) w[1]^2 + 4*w[2]^2
grad_f <- function(w) c(2*w[1], 8*w[2]) LEARNING_RATE <- 0.2
N_STEPS <- 10
w <- c(3, 2) cat(sprintf("%-4s %-8s %-8s %-10s %-10s\n", "Step", "w1", "w2", "f(w)", "||grad||"))
for (step in 0:(N_STEPS-1)) { g <- grad_f(w) cat(sprintf("%-4d %-8.4f %-8.4f %-10.4f %-10.4f\n", step, w[1], w[2], f(w), sqrt(sum(g^2)))) w <- gd_step(w, g, LEARNING_RATE)
}
cat(sprintf("Final w* = (%.4e, %.4e), f(w*) = %.2e\n", w[1], w[2], f(w)))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score np.random.seed(42) # -- Full gradient descent with learning rate schedule for logistic regression --
N_SAMPLES = 800
X_raw, y_raw = make_classification(n_samples=N_SAMPLES, n_features=8, n_informative=5, random_state=42)
scaler = StandardScaler()
X = scaler.fit_transform(X_raw)
y = y_raw * 2 - 1 # {-1, +1} encoding N = len(y)
D = X.shape[1]
LAMBDA_REG = 0.01 def log_loss_with_reg(w: np.ndarray) -> float: margins = y * (X @ w) return float(np.mean(np.log1p(np.exp(-margins)))) + LAMBDA_REG * np.sum(w**2) def log_loss_gradient(w: np.ndarray) -> np.ndarray: margins = y * (X @ w) sigmoid_neg = 1 / (1 + np.exp(margins)) # sigmoid(-margin) return -1/N * X.T @ (y * sigmoid_neg) + 2 * LAMBDA_REG * w # Learning rate schedules to compare
def constant_lr(step: int, lr0: float = 0.5) -> float: return lr0 def step_decay(step: int, lr0: float = 0.5, decay: float = 0.5, drop_every: int = 50) -> float: return lr0 * (decay ** (step // drop_every)) def sqrt_decay(step: int, lr0: float = 0.5) -> float: return lr0 / np.sqrt(step + 1) schedules = { "constant": constant_lr, "step decay": step_decay, "sqrt decay": sqrt_decay,
} N_ITER = 300
results = {} for name, lr_func in schedules.items(): w = np.zeros(D) losses = [] for step in range(N_ITER): gamma = lr_func(step) g = log_loss_gradient(w) # Core update rule: x_{i+1} = x_i - gamma_i * grad f(x_i) w = w - gamma * g losses.append(log_loss_with_reg(w)) y_score = X @ w auc = roc_auc_score(y_raw, y_score) results[name] = {"w": w, "final_loss": losses[-1], "auc": auc, "losses": losses} print(f"{'Schedule':<15} {'Final Loss':>12} {'AUC':>8}")
for name, res in results.items(): print(f"{name:<15} {res['final_loss']:>12.6f} {res['auc']:>8.4f}") print(f"\nUpdate rule: x_{{i+1}} = x_i - gamma_i * grad_f(x_i)")
print(f"gamma_i is the learning rate — the single most important hyperparameter.")
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
MML1 pag 234