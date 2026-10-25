---
publish: true
date: '2026-04-16'
tags:
- calculus
slug: sum-rule-matrix-calculus-identities-and-automatic-differentiation
---

# Sum Rule

$$
\frac{\partial}{\partial x}(f(x) + g(x)) = \frac{\partial f}{\partial x} + \frac{\partial g}{\partial x}
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The sum rule (also called the linearity of differentiation) states that the derivative of a sum is the sum of the derivatives. This is the simplest and most universally applicable differentiation identity. In matrix calculus it extends to: the gradient of a sum of scalar functions is the sum of their gradients, the Jacobian of a sum of vector functions is the sum of their Jacobians. In DA/DS and ML, the sum rule is omnipresent because nearly every loss function is a sum: MSE is a sum of squared errors, cross-entropy is a sum of log-likelihoods, regularized loss is data loss plus penalty. Gradient descent on any additive loss requires knowing this rule: $\nabla_\mathbf{w}(L_{data} + \lambda R(\mathbf{w})) = \nabla_\mathbf{w} L_{data} + \lambda \nabla_\mathbf{w} R(\mathbf{w})$. The sum rule also enables batch gradient computation: the gradient of the average loss is the average of the per-sample gradients.

## Flowchart

```mermaid
flowchart TD
    A["h(x) = f(x) + g(x)"] --> B["Derivative is linear: dh/dx = df/dx + dg/dx"]
    B --> C["Each term differentiates independently"]
    C --> D{"What is h in practice?"} D -- "h = L_data + lambda * R(w)" --> E["nabla L = nabla L_data + lambda * nabla R"] D -- "h = (1/n) * sum_i loss_i" --> F["nabla L = (1/n) * sum_i nabla loss_i"] D -- "h = loss + sum of layer norms" --> G["Gradient splits across each additive term"]
    E --> H["Standard regularized gradient descent update"]
    F --> H
    G --> H
    H --> I["w <- w - alpha * (nabla L_data + lambda * nabla R)"]
```

## Real-world use

### Where it is used

Regularized loss gradient: $\nabla_\mathbf{w}(L + \lambda\|\mathbf{w}\|^2) = \nabla_\mathbf{w} L + 2\lambda\mathbf{w}$. Batch/mini-batch gradient: $\nabla_\mathbf{w}\frac{1}{n}\sum_i \ell_i(\mathbf{w}) = \frac{1}{n}\sum_i \nabla_\mathbf{w}\ell_i(\mathbf{w})$. Multi-task learning: $L_{total} = L_{task1} + \alpha L_{task2}$, gradient is the sum of task-specific gradients. Neural network residual connections: $\mathbf{y} = \mathbf{x} + F(\mathbf{x})$, Jacobian is $I + J_F$. Any additive combination of loss terms, penalties, or auxiliary objectives.

### Problem it solves

Complex loss functions are built by adding simpler components. Without the sum rule, you would need to differentiate these composite expressions from scratch as a whole, even though the terms are independent. The sum rule lets you split the problem: differentiate each additive term separately, then add the resulting gradients. This is both mathematically cleaner and computationally cheaper.

### How it solves the problem

Differentiation is a linear operator. Formally: $\frac{d}{dx}(af(x) + bg(x)) = a\frac{df}{dx} + b\frac{dg}{dx}$ for constants $a, b$. This follows directly from the limit definition: $\lim_{h\to0}\frac{(f+g)(x+h) - (f+g)(x)}{h} = \lim_{h\to0}\frac{f(x+h)-f(x)}{h} + \lim_{h\to0}\frac{g(x+h)-g(x)}{h} = f'(x) + g'(x)$.

### Example in a business

A recommendation system uses a multi-task loss: $L = L_{CTR} + \alpha L_{CVR} + \beta R(\mathbf{w})$ (click-through rate loss + conversion rate loss + L2 regularization). By the sum rule: $\nabla_\mathbf{w} L = \nabla_\mathbf{w} L_{CTR} + \alpha \nabla_\mathbf{w} L_{CVR} + \beta \nabla_\mathbf{w} R(\mathbf{w})$. Each gradient is computed independently (from its own forward and backward pass) and summed. This allows separate engineering teams to own each loss component while the optimizer works on the combined gradient.

## The formula, piece by piece

$$
\frac{\partial}{\partial x}(f(x) + g(x)) = \frac{\partial f}{\partial x} + \frac{\partial g}{\partial x}
$$

Each symbol:
- $f(x)$: the first additive term (scalar, vector, or matrix function of $x$)
- $g(x)$: the second additive term (scalar, vector, or matrix function of $x$)
- $\frac{\partial f}{\partial x}$: derivative/gradient/Jacobian of $f$
- $\frac{\partial g}{\partial x}$: derivative/gradient/Jacobian of $g$
- Result: the derivative/gradient/Jacobian of the sum, with the same shape as both individual derivatives **Scalar constant factor** (linearity, general form):

$$
\frac{\partial}{\partial x}(af(x) + bg(x)) = a\frac{\partial f}{\partial x} + b\frac{\partial g}{\partial x}
$$

**Gradient of sum over data** (batch gradient):

$$
\nabla_\mathbf{w}\sum_{i=1}^n \ell(\mathbf{w}, \mathbf{x}_i, y_i) = \sum_{i=1}^n \nabla_\mathbf{w}\,\ell(\mathbf{w}, \mathbf{x}_i, y_i)
$$

**Regularized gradient** (L2):

$$
\nabla_\mathbf{w}(L(\mathbf{w}) + \lambda\|\mathbf{w}\|^2) = \nabla_\mathbf{w} L(\mathbf{w}) + 2\lambda\mathbf{w}
$$

**Residual connection Jacobian** (ResNet):

$$
J_{\mathbf{x}}(\mathbf{x} + F(\mathbf{x})) = I + J_F(\mathbf{x})
$$

## The formula in words

"The derivative of a sum is the sum of the derivatives. You can differentiate each additive piece independently and add the results. Differentiation distributes over addition — it is a linear operation. You never need to worry about interaction between additive terms when differentiating; they are completely independent."

## Critical Concepts

- **Linearity of differentiation**: both sum rule and constant-multiple rule hold simultaneously: $\frac{d}{dx}(af+bg) = af' + bg'$. This makes the space of differentiable functions a vector space closed under differentiation.
- **Batch gradient = average of per-sample gradients**: $\nabla_\mathbf{w}\frac{1}{n}\sum_i \ell_i = \frac{1}{n}\sum_i \nabla_\mathbf{w}\ell_i$. This is why mini-batch SGD works: gradient on a mini-batch is an unbiased estimate of the full gradient.
- **Regularization gradient addition**: when adding L2 penalty $\lambda\|\mathbf{w}\|^2$ to any loss, the regularization gradient $2\lambda\mathbf{w}$ is simply added to the data loss gradient. In code this is often implemented as weight decay.
- **ResNet skip connections**: the output of a residual block is $\mathbf{y} = \mathbf{x} + F(\mathbf{x})$. By the sum rule, $\frac{\partial \mathbf{y}}{\partial \mathbf{x}} = I + \frac{\partial F}{\partial \mathbf{x}}$. The identity term $I$ ensures gradients flow directly through the skip connection even when $F$ has near-zero Jacobian — this is why ResNets solve the vanishing gradient problem.
- **No sum rule for non-additive combinations**: the product rule handles $f \cdot g$; the chain rule handles $f(g(x))$. The sum rule only applies to $f + g$.
- **Computational graph perspective**: in an autograd system, a sum node has two children; the backward pass simply routes the incoming gradient to both children unchanged (gradient is $1$ for both branches).

## Step-by-step calculation (tiny example)

Compute $\nabla_\mathbf{w} L$ where $L(\mathbf{w}) = \underbrace{\|X\mathbf{w} - \mathbf{y}\|^2}_{L_{data}} + \underbrace{\lambda\|\mathbf{w}\|^2}_{L_{reg}}$.

*Step 1: Identify the two additive terms*
$L_{data}(\mathbf{w}) = \|X\mathbf{w} - \mathbf{y}\|^2$, $L_{reg}(\mathbf{w}) = \lambda\|\mathbf{w}\|^2$

*Step 2: Gradient of each term (use known identities)*
$\nabla_\mathbf{w} L_{data} = 2X^T(X\mathbf{w} - \mathbf{y})$ (gradient of squared error)
$\nabla_\mathbf{w} L_{reg} = 2\lambda\mathbf{w}$ (gradient of squared norm)

*Step 3: Apply sum rule — add the gradients*

$$
\nabla_\mathbf{w} L = 2X^T(X\mathbf{w} - \mathbf{y}) + 2\lambda\mathbf{w}
$$

*Step 4: Set to zero for ridge regression solution*

$$
X^TX\mathbf{w} + \lambda\mathbf{w} = X^T\mathbf{y} \implies (X^TX + \lambda I)\mathbf{w} = X^T\mathbf{y}
$$

$$
\hat{\mathbf{w}}_{ridge} = (X^TX + \lambda I)^{-1}X^T\mathbf{y} \checkmark
$$

## Code examples

### Beginner example (Python)

```python
import numpy as np

# Sum rule example: h(x) = f(x) + g(x)
# f(x) = x^3, g(x) = sin(x)
# h'(x) = 3x^2 + cos(x) (sum of individual derivatives)

def h_fn(x: np.ndarray) -> np.ndarray:
    return x**3 + np.sin(x)

def h_prime_analytic(x: np.ndarray) -> np.ndarray:
    """Sum rule: d/dx(x^3 + sin(x)) = 3x^2 + cos(x)."""
    return 3.0 * x**2 + np.cos(x)

def numerical_derivative(fn, x: np.ndarray, h: float = 1e-5) -> np.ndarray:
    return (fn(x + h) - fn(x - h)) / (2 * h)
x_test = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])
analytic = h_prime_analytic(x_test)
numerical = numerical_derivative(h_fn, x_test)
print("Sum rule: d/dx(x^3 + sin(x)) = 3x^2 + cos(x)")
print(f"{'x':>5} | {'Analytic':>12} | {'Numerical':>12} | {'Error':>10}")
for xi, a, n in zip(x_test, analytic, numerical):
    print(f"{xi:>5.1f} | {a:>12.8f} | {n:>12.8f} | {abs(a-n):>10.2e}")

# Gradient sum rule on vectors: nabla(f(w) + g(w))
# f(w) = ||Xw - y||^2, g(w) = lambda * ||w||^2
np.random.seed(42)
n_samples, n_features = 50, 4
X = np.random.randn(n_samples, n_features)
y = np.random.randn(n_samples)
w = np.random.randn(n_features)
LAMBDA = 0.5

# Individual gradients
grad_data = 2.0 * X.T @ (X @ w - y)
grad_reg = 2.0 * LAMBDA * w

# Sum rule: total gradient = sum of individual gradients
grad_total = grad_data + grad_reg


# Verify numerically
def ridge_loss(w_in: np.ndarray) -> float:
    return float(np.sum((X @ w_in - y)**2) + LAMBDA * np.dot(w_in, w_in))


grad_numerical = np.zeros(n_features)
h = 1e-5
for i in range(n_features):
    e_i = np.zeros(n_features)
    e_i[i] = h
    grad_numerical[i] = (ridge_loss(w + e_i) - ridge_loss(w - e_i)) / (2 * h)
print(f"\nRidge gradient (sum rule): nabla(||Xw-y||^2 + lambda||w||^2)")
print(f" Analytic: {grad_total.round(4)}")
print(f" Numerical: {grad_numerical.round(4)}")
print(f" Max error: {np.abs(grad_total - grad_numerical).max():.2e}")
```

### Beginner example (R)

```r
# Sum rule: d/dx(f(x) + g(x)) = f'(x) + g'(x)
# Example: h(x) = x^3 + sin(x), h'(x) = 3x^2 + cos(x)
h_fn <- function(x) x^3 + sin(x)
h_prime <- function(x) 3 * x^2 + cos(x)  # sum rule applied
num_deriv <- function(fn, x, h = 1e-5) (fn(x + h) - fn(x - h)) / (2 * h)
x_test <- c(-2, -1, 0, 1, 2)
cat("Sum rule: d/dx(x^3 + sin(x)) = 3x^2 + cos(x)\n")
cat(sprintf(" x=%4.1f: analytic=%.6f, numerical=%.6f\n", x_test, h_prime(x_test), num_deriv(h_fn, x_test)))

# Ridge regression gradient: nabla(||Xw-y||^2 + lambda||w||^2)
set.seed(42)
n_obs <- 50; n_feat <- 4
X <- matrix(rnorm(n_obs * n_feat), nrow = n_obs)
y <- rnorm(n_obs)
w <- rnorm(n_feat)
lambda <- 0.5

# Sum rule: add both gradients
grad_data <- 2 * t(X) %*% (X %*% w - y)
grad_reg <- 2 * lambda * w
grad_total <- grad_data + grad_reg  # sum rule

# Numerical check
ridge_loss <- function(w_in) sum((X %*% w_in - y)^2) + lambda * sum(w_in^2)
h <- 1e-5
num_grad <- sapply(1:n_feat, function(i) {
  e_i <- rep(0, n_feat); e_i[i] <- h
  (ridge_loss(w + e_i) - ridge_loss(w - e_i)) / (2 * h)
})
cat("\nRidge gradient (sum rule):\n")
cat(" Analytic: ", as.vector(round(grad_total, 4)), "\n")
cat(" Numerical:", round(num_grad, 4), "\n")
cat(" Max error:", max(abs(as.vector(grad_total) - num_grad)), "\n")
```

### Professional example (Python)

```python
"""
Sum rule in practice: multi-task learning gradient and residual connection.

Scenario 1: Multi-task e-commerce model
    L_total = L_CTR + alpha * L_CVR + beta * L2_reg
    Gradient is the sum of three independent gradient terms.

Scenario 2: ResNet skip connection
    y = x + F(x) => dy/dx = I + dF/dx (Jacobian sum rule)
    Gradients flow unchanged through identity path (vanishing gradient solution).
"""
import numpy as np
RANDOM_SEED = 42
rng = np.random.default_rng(RANDOM_SEED)

# ---- Scenario 1: Multi-task gradient ----
N_SAMPLES, N_FEATURES = 200, 6
X = rng.standard_normal((N_SAMPLES, N_FEATURES))
# Targets: CTR (binary) and CVR (binary), different ground truths
y_ctr = (rng.random(N_SAMPLES) > 0.7).astype(float)
y_cvr = (rng.random(N_SAMPLES) > 0.8).astype(float)
w = rng.standard_normal(N_FEATURES) * 0.1
ALPHA_CVR = 0.5   # weight for CVR task
BETA_L2 = 0.01   # L2 regularization weight

def sigmoid(z: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def bce_loss_and_grad(w_in: np.ndarray, x_in: np.ndarray, y_in: np.ndarray):
    """Binary cross-entropy loss and gradient."""
    prob = np.clip(sigmoid(x_in @ w_in), 1e-12, 1.0 - 1e-12)
    loss = float(-np.mean(y_in * np.log(prob) + (1 - y_in) * np.log(1 - prob)))
    grad = x_in.T @ (prob - y_in) / len(y_in)
    return loss, grad


loss_ctr, grad_ctr = bce_loss_and_grad(w, X, y_ctr)
loss_cvr, grad_cvr = bce_loss_and_grad(w, X, y_cvr)
loss_l2 = float(np.dot(w, w))
grad_l2 = 2.0 * w

# Sum rule: total gradient = weighted sum of individual gradients
loss_total = loss_ctr + ALPHA_CVR * loss_cvr + BETA_L2 * loss_l2
grad_total = grad_ctr + ALPHA_CVR * grad_cvr + BETA_L2 * grad_l2
print("=== Multi-Task Loss: Sum Rule ===")
print(f" L_total = L_CTR + {ALPHA_CVR}*L_CVR + {BETA_L2}*L2")
print(f" L_CTR={loss_ctr:.4f}, L_CVR={loss_cvr:.4f}, L2={loss_l2:.4f}")
print(f" L_total={loss_total:.4f}")
print(f" grad_total = grad_CTR + {ALPHA_CVR}*grad_CVR + {BETA_L2}*grad_L2")
print(f" ||grad_total|| = {np.linalg.norm(grad_total):.4f}")
print()

# ---- Scenario 2: ResNet skip connection Jacobian ----
# y = x + F(x), F(x) = tanh(Wx) (simple 1-layer residual block)
DIM = 4
W_res = rng.standard_normal((DIM, DIM)) * 0.5
x0 = rng.standard_normal(DIM)


def residual_block(x_in: np.ndarray) -> np.ndarray:
    return x_in + np.tanh(W_res @ x_in)


# Analytic Jacobian via sum rule: J = I + J_F
J_F = (1.0 - np.tanh(W_res @ x0)**2)[:, None] * W_res   # Jacobian of tanh(Wx)
J_analytic = np.eye(DIM) + J_F   # sum rule: J(x + F(x)) = I + J_F

# Numerical Jacobian
h = 1e-5
J_numerical = np.zeros((DIM, DIM))
for j in range(DIM):
    e_j = np.zeros(DIM)
    e_j[j] = h
    J_numerical[:, j] = (residual_block(x0 + e_j) - residual_block(x0 - e_j)) / (2 * h)
print("=== ResNet Skip Connection: Jacobian Sum Rule ===")
print(f" y = x + tanh(Wx), J = I + J_tanh(Wx)")
print(f" Max error (analytic vs numerical): {np.abs(J_analytic - J_numerical).max():.2e}")
print(f" Identity term ensures gradient flows even if J_F ~ 0")
print(f" Min singular value of J: {np.linalg.svd(J_analytic, compute_uv=False).min():.4f}")
```

---

*Source: domain knowledge*
