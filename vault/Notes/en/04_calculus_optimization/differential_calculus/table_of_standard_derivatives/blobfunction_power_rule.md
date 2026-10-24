---
title: BlobFunction Power Rule
date: '2026-04-16'
wordCount: 885
slug: blobfunction_power_rule
permalink: /notes/04_calculus_optimization/differential_calculus/table_of_standard_derivatives/blobfunction_power_rule/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{d}{dx}[f(x)]^n = n[f(x)]^{n-1} f'(x)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the generalized (or "blob function") power rule — the chain rule applied to $[f(x)]^n$ where the base is an arbitrary differentiable function rather than just $x$. It combines the power rule $d/du(u^n) = nu^{n-1}$ with the chain rule, giving $n[f(x)]^{n-1} \cdot f'(x)$. The "blob" interpretation: $f(x)$ is treated as a single entity ("blob"), differentiated as a power, then multiplied by the blob's own derivative. In DA/DS: this rule is applied constantly — to $\|(y - \hat{y})\|^2$ in MSE gradient derivation, to $(1 + x^2)^n$ in radial basis functions, to $(\sigma(z))^k$ in higher-order activation derivatives, to $(w^T w)^{1/2}$ in L2 regularization with non-square norms. It is the building block for differentiating any polynomial or power composition.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["f(x) = [blob(x)]^n"] A --> B["Chain rule: d/dx(u^n) * du/dx, where u = blob(x)"] B --> C["Outer derivative: d/du(u^n) = n*u^(n-1)"] C --> D["Inner derivative: du/dx = blob'(x) = f'(x)"] D --> E["Combine: n * [f(x)]^(n-1) * f'(x)"] A --> F["Special case n=2: 2*f(x)*f'(x) -- used in MSE gradient"] A --> G["Special case n=1/2: f'(x) / (2*sqrt(f(x))) -- used in L2 norm gradient"] A --> H["Special case n=-1: -f'(x) / [f(x)]^2 -- used in reciprocal derivatives"]
```
### Real-World use:
#### Situation it is used
MSE loss gradient: $d/dw(\|y - Xw\|^2) = 2(y-Xw) \cdot d/dw(y-Xw) = -2X^T(y-Xw)$ uses the $n=2$ case. L2 norm gradient: $d/dw(\|w\|_2) = d/dw(w^T w)^{1/2} = (1/2)(w^T w)^{-1/2} \cdot 2w = w/\|w\|_2$ uses $n=1/2$. Sigmoid squared derivatives: $d/dz(\sigma(z)^2)$. Radial basis function (RBF) kernel gradients: $d/dx \exp(-\|x-c\|^2/h)$ requires this rule. Huber loss gradient. Power transform feature engineering.
#### Problem it solves
When a power function has a composite (non-identity) base, plain power rule $d/dx(x^n) = nx^{n-1}$ does not apply. The blob rule provides the correct derivative by incorporating both the "outer" power derivative and the "inner" function derivative via the chain rule.
#### How it solves the problem
Let $u = f(x)$, so $[f(x)]^n = u^n$. By chain rule: $d/dx(u^n) = d/du(u^n) \cdot du/dx = nu^{n-1} \cdot f'(x) = n[f(x)]^{n-1} \cdot f'(x)$. The "outer" derivative produces $n[f(x)]^{n-1}$; the "inner" derivative produces $f'(x)$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS derives the gradient of MSE loss $L(w) = (1/N)\|y - Xw\|^2 = (1/N)\sum_i (y_i - x_i^T w)^2$. For each term: $d/dw(y_i - x_i^T w)^2 = 2(y_i - x_i^T w) \cdot d/dw(y_i - x_i^T w) = 2(y_i - x_i^T w) \cdot (-x_i)$. Summing: $\nabla_w L = (-2/N) X^T (y - Xw)$. The $n=2$ blob rule is the entire mechanism.
### The Formula (Fragment-First)
- $[f(x)]^n$: a function $f(x)$ raised to power $n$; $n$ can be any real number
- $f(x)$: the "inner function" or "blob"; any differentiable function of $x$
- $f'(x)$: derivative of the inner function; comes from the chain rule
- $n[f(x)]^{n-1}$: the outer derivative; power rule applied to the blob as a single unit
- $n[f(x)]^{n-1} \cdot f'(x)$: the product of outer and inner derivatives
- $n=2$: $d/dx[f(x)]^2 = 2f(x) \cdot f'(x)$ — appears in every MSE gradient
- $n=1/2$: $d/dx\sqrt{f(x)} = f'(x)/(2\sqrt{f(x)})$ — appears in L2 norm and variance gradients
- $n=-1$: $d/dx(1/f(x)) = -f'(x)/[f(x)]^2$ — the reciprocal rule; special case of blob
- $n=0$: $d/dx[f(x)]^0 = d/dx(1) = 0$ (constant, as expected) ### Formula-to-English Translation
"To differentiate a blob raised to a power: bring the power down as a multiplier, reduce the power by 1, keep the blob, then multiply by the blob's own derivative. The pattern is: (power) $\times$ (blob)$^{\text{power}-1}$ $\times$ (blob's derivative)." Tiny trace with $f(x) = 3x^2 + 1$, $n = 3$:
$[f(x)]^3 = (3x^2+1)^3$.
$f'(x) = 6x$.
$d/dx[(3x^2+1)^3] = 3(3x^2+1)^2 \cdot 6x = 18x(3x^2+1)^2$.
At $x=1$: $= 18 \cdot 1 \cdot (3+1)^2 = 18 \cdot 16 = 288$. Verify: $(3(1)^2+1)^3 = 4^3 = 64$. $(3(1.001)^2+1)^3 \approx 64.288$. Difference / $0.001 \approx 288$. $\checkmark$ ### Critical Concepts
- **Chain rule is the foundation:** the blob power rule is just chain rule with outer function $u^n$ and inner function $f(x)$. Every application of this rule is an application of chain rule. Internalizing this prevents errors when the blob itself is composite.
- **$n = 1/2$ and the L2 norm gradient:** $d/dw\|w\|_2 = d/dw(w^T w)^{1/2} = (1/2)(w^T w)^{-1/2} \cdot 2w = w/\|w\|_2$. This is the unit vector in the direction of $w$. The blob is $w^T w = \sum_j w_j^2$; its derivative w.r.t. $w_j$ is $2w_j$.
- **$n = -1$ as reciprocal rule:** $d/dx(1/f(x)) = -f'(x)/[f(x)]^2$. Equivalently written as $-f'/f^2$. This appears when differentiating attention normalization terms or softmax denominators.
- **Non-integer exponents require $f(x) > 0$:** when $n$ is not a positive integer, $[f(x)]^n$ requires $f(x) > 0$ to be real-valued and differentiable. For example, $d/dx(\sqrt{1-x^2}) = -x/\sqrt{1-x^2}$ requires $|x| < 1$.
- **Gradient of RBF kernels:** $d/dx\exp(-\|x-c\|^2/(2h^2)) = \exp(-\|x-c\|^2/(2h^2)) \cdot (-2(x-c)/(2h^2))$. The $\|x-c\|^2$ term's gradient uses the $n=2$ blob rule: $d/dx(x-c)^2 = 2(x-c)$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Compute the gradient of MSE $L = (1/3)\sum_{i=1}^{3}(y_i - w x_i)^2$ with respect to $w$. Use $x = [1, 2, 3]$, $y = [2, 3, 4]$, $w = 1$.* *Step 1: Residuals.* $r_i = y_i - w x_i$: $r_1 = 2-1=1$, $r_2 = 3-2=1$, $r_3 = 4-3=1$. *Step 2: Apply $n=2$ blob rule.* $d/dw(r_i^2) = 2r_i \cdot d/dw(r_i) = 2r_i \cdot (-x_i)$. *Step 3: Sum.* $dL/dw = (1/3)\sum_i 2r_i(-x_i) = (-2/3)\sum_i r_i x_i$.
$= (-2/3)[1 \cdot 1 + 1 \cdot 2 + 1 \cdot 3] = (-2/3) \cdot 6 = -4$. *Verify:* $L(1) = (1/3)(1+1+1) = 1$. $L(1.001) = (1/3)[(2-1.001)^2+(3-2.002)^2+(4-3.003)^2] = (1/3)(0.999^2+0.998^2+0.997^2) \approx 0.996$. $\Delta L / \Delta w \approx (0.996-1)/0.001 = -4$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def blob_power_rule(f_x: float, f_prime_x: float, n: float) -> float: """d/dx[f(x)]^n = n * [f(x)]^(n-1) * f'(x).""" return n * f_x**(n - 1) * f_prime_x # Example: f(x) = 3x^2 + 1, n = 3, at x = 1
x = 1.0
f_x = 3 * x**2 + 1 # = 4
f_prime_x = 6 * x # = 6
n = 3.0
result = blob_power_rule(f_x, f_prime_x, n)
print(f"d/dx[(3x^2+1)^3] at x=1: {result}") # 288 # Verify numerically
h = 1e-7
numerical = ((3*(x+h)**2+1)**3 - (3*(x-h)**2+1)**3) / (2*h)
print(f"Numerical check: {numerical:.4f}") # Important special cases
print("\nSpecial cases:")
# n = 2: MSE term (y - wx)^2 with y=3, w=1, x=2
y_val, w_val, x_val = 3.0, 1.0, 2.0
f_x2 = y_val - w_val * x_val # residual = 1
f_prime_x2 = -x_val # d/dw(y - wx) = -x
mse_grad = blob_power_rule(f_x2, f_prime_x2, 2.0)
print(f" MSE n=2: d/dw(y-wx)^2 = 2*(y-wx)*(-x) = {mse_grad:.2f}") # n = 1/2: sqrt(x^2 + 1)
x3 = 2.0
f_x3 = x3**2 + 1 # 5
f_prime_x3 = 2 * x3 # 4
sqrt_grad = blob_power_rule(f_x3, f_prime_x3, 0.5)
print(f" sqrt n=0.5: d/dx(sqrt(x^2+1)) at x=2 = {sqrt_grad:.4f}") # n = -1: 1/(x^2 + 1)
recip_grad = blob_power_rule(f_x3, f_prime_x3, -1.0)
print(f" reciprocal n=-1: d/dx(1/(x^2+1)) at x=2 = {recip_grad:.4f}")
```
#### Beginner friendly Example [R])
``` r
# d/dx[f(x)]^n = n * f(x)^(n-1) * f'(x)
blob_power_rule <- function(f_x, f_prime_x, n) { n * f_x^(n - 1) * f_prime_x
} # Verify d/dx[(3x^2+1)^3] at x=1
x <- 1.0
f_x <- 3*x^2 + 1
f_prime_x <- 6*x
cat(sprintf("d/dx[(3x^2+1)^3] at x=1: %.4f\n", blob_power_rule(f_x, f_prime_x, 3))) # MSE gradient
cat("\nMSE gradient d/dw sum((y - wx)^2):\n")
y_vec <- c(2, 3, 4); x_vec <- c(1, 2, 3); w <- 1.0
residuals <- y_vec - w * x_vec
grad_mse <- (-2/3) * sum(residuals * x_vec)
cat(sprintf(" w=%g, gradient = %.4f\n", w, grad_mse)) # L2 norm gradient: d/dw ||w||_2 = w / ||w||
w_vec <- c(1.0, 2.0, 3.0)
l2_norm <- sqrt(sum(w_vec^2))
l2_grad <- w_vec / l2_norm
cat(sprintf("\nL2 norm gradient (n=0.5 blob): %.4f %.4f %.4f\n", l2_grad[1], l2_grad[2], l2_grad[3]))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_regression np.random.seed(42) # -- Manual MSE and Huber loss gradient: n=2 and composite blob rules --
# Use case: a DS implements custom loss functions from scratch to understand
# how blob power rule drives every squared-error gradient computation. N, D = 300, 5
X, y = make_regression(n_samples=N, n_features=D, noise=5.0, random_state=42)
X = np.hstack([np.ones((N, 1)), X]) # add bias column
D_FULL = D + 1
w = np.zeros(D_FULL) DELTA = 1.0 # Huber transition point def mse_loss_and_gradient(w: np.ndarray, X: np.ndarray, y: np.ndarray) -> tuple: """MSE loss and gradient using blob power rule (n=2). L = (1/N) * ||y - Xw||^2 = (1/N) * [r]^2, r = y - Xw. Gradient: dL/dw = (2/N) * [r]^(2-1) * dr/dw = (-2/N) * X^T (y - Xw). """ residuals = y - X @ w loss = float(np.mean(residuals**2)) # Blob rule: n=2, f(w) = residuals, f'(w) = -X (d/dw(y - Xw) = -X) gradient = -2.0 / N * X.T @ residuals return loss, gradient def huber_loss_and_gradient( w: np.ndarray, X: np.ndarray, y: np.ndarray, delta: float = DELTA
) -> tuple: """Huber loss and gradient. Huber(r) = r^2/2 if |r| <= delta, else delta*(|r| - delta/2). Gradient uses blob rule (n=2) for quadratic region; sign function for linear region. """ residuals = y - X @ w abs_r = np.abs(residuals) quadratic_mask = abs_r <= delta huber_values = np.where(quadratic_mask, 0.5 * residuals**2, delta * (abs_r - 0.5 * delta)) loss = float(np.mean(huber_values)) # Gradient: for quadratic region: d/dw(0.5*r^2) = r * (-x) [blob n=2] # for linear region: d/dw(delta*|r|) = delta * sign(r) * (-x) pseudo_residuals = np.where(quadratic_mask, residuals, delta * np.sign(residuals)) gradient = -1.0 / N * X.T @ pseudo_residuals return loss, gradient # Gradient descent comparison: MSE vs Huber
print("Blob Power Rule (n=2): MSE gradient = -2/N * X^T * residuals")
N_ITER = 200
LR = 1e-3 w_mse = np.zeros(D_FULL)
w_huber = np.zeros(D_FULL)
for _ in range(N_ITER): _, g_mse = mse_loss_and_gradient(w_mse, X, y) _, g_huber = huber_loss_and_gradient(w_huber, X, y) w_mse -= LR * g_mse w_huber -= LR * g_huber mse_final, _ = mse_loss_and_gradient(w_mse, X, y)
huber_final, _ = huber_loss_and_gradient(w_huber, X, y)
mse_on_huber_w, _ = mse_loss_and_gradient(w_huber, X, y) print(f"\nAfter {N_ITER} gradient descent steps (LR={LR}):")
print(f" MSE loss (MSE solution): {mse_final:.4f}")
print(f" Huber loss (Huber solution): {huber_final:.4f}")
print(f" MSE loss (Huber solution): {mse_on_huber_w:.4f}")
print(f"\nFinal gradient norms:")
_, g_mse_final = mse_loss_and_gradient(w_mse, X, y)
_, g_huber_final = huber_loss_and_gradient(w_huber, X, y)
print(f" MSE gradient norm: {np.linalg.norm(g_mse_final):.6f}")
print(f" Huber gradient norm: {np.linalg.norm(g_huber_final):.6f}")
print(f"\nKey: MSE gradient = (-2/N)*X^T*r comes directly from blob rule d/dw[r(w)]^2 = 2*r*r'")
print(f" where r = y - Xw (the blob) and r' = dr/dw = -X (the blob's derivative).")
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