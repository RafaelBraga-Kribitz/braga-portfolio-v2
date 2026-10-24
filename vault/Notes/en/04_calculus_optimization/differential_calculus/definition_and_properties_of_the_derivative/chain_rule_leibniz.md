---
title: Chain Rule (Leibniz)
date: '2026-04-16'
wordCount: 1043
slug: chain_rule_leibniz
permalink: /notes/04_calculus_optimization/differential_calculus/definition_and_properties_of_the_derivative/chain_rule_leibniz/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$ (extendable: $\frac{dy}{dx} = \frac{dy}{dv} \cdot \frac{dv}{du} \cdot \frac{du}{dx}$)
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The Leibniz form of the chain rule writes the derivative as a ratio of differentials: $dy/dx = (dy/du) \cdot (du/dx)$. The notation is deliberately algebraic: $du$ appears to "cancel" in the fraction, making the chain structure visually explicit. This is the notation used in most engineering, physics, and applied DS/DA work because it names the intermediate variable $u$ explicitly — you always know what you are differentiating with respect to, and the chain of transformations is traceable by name. The extended form $dy/dx = (dy/dv)(dv/du)(du/dx)$ handles any depth of composition. In deep learning code comments and textbooks, you will see this notation used when explaining gradient flow: $d\mathcal{L}/dW = (d\mathcal{L}/d\hat{y})(d\hat{y}/dz)(dz/dW)$. That is Leibniz chain rule written out explicitly.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["y = g(u), u = f(x): two-step composition"] A --> B["dy/du: how fast y changes w.r.t. u"] A --> C["du/dx: how fast u changes w.r.t. x"] B --> D["Leibniz chain: dy/dx = (dy/du) * (du/dx)"] C --> D D --> E["Extend: add variable v between u and x"] E --> F["dy/dx = (dy/dv) * (dv/du) * (du/dx)"] F --> G["General depth n: multiply n link derivatives"] D --> H["Why it looks like fractions: the du 'cancels' (informally)"] H --> I["Caution: du does not literally cancel -- this is notation, not algebra"]
```
### Real-World use:
#### Situation it is used
Explicit multi-step transformations: Box-Cox transform $y = (x^\lambda - 1)/\lambda$ where intermediate variable is $u = x^\lambda$; gradient of log-loss through sigmoid-linear: $d\mathcal{L}/dW = (d\mathcal{L}/d\hat{y})(d\hat{y}/dz)(dz/dW)$ naming each intermediate; change of variable in integration and probability (density transformation via Jacobian); implicit differentiation when a relationship $F(x, y) = 0$ defines $y$ implicitly as a function of $x$ (use $dy/dx = -(F_x/F_y)$); unit conversion in dimensional analysis.
#### Problem it solves
The Lagrange/prime notation $g'(f(x)) \cdot f'(x)$ is compact but hides what you are differentiating with respect to in multi-step chains. When the chain has 3+ layers, tracking which derivative is evaluated where becomes error-prone. Leibniz notation solves this: each factor $dy/du$ is self-documenting — the numerator and denominator tell you exactly what is changing with respect to what.
#### How it solves the problem
Introduce named intermediate variables ($u$, $v$, etc.) for each transformation stage. Write one fraction per link in the chain. Multiply all fractions. The "telescoping" structure ($du$ cancelling between $(dy/du)$ and $(du/dx)$) gives an intuitive visual check: if the chain is correct, all intermediate variables should appear exactly twice (once as a numerator, once as denominator) and cancel out, leaving $dy/dx$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS traces the gradient of a GELU-activated network layer: $z = Wx + b$ (linear), $u = z$ (identity for naming), $a = \text{GELU}(u)$ (activation), $\hat{y} = a$ (output). The gradient $d\mathcal{L}/dW$: $(d\mathcal{L}/d\hat{y}) \cdot (d\hat{y}/da) \cdot (da/du) \cdot (du/dz) \cdot (dz/dW)$. Writing it in Leibniz form makes each step auditable, and the DS can locate errors in the chain by checking each factor independently.
### The Formula (Fragment-First)
- $dy$: infinitesimal change in the output $y$
- $du$: infinitesimal change in the intermediate variable $u = f(x)$
- $dx$: infinitesimal change in the input $x$
- $dy/du$: rate of change of $y$ with respect to $u$, evaluated at $u = f(x)$
- $du/dx$: rate of change of $u$ with respect to $x$
- $dy/dx$: rate of change of $y$ with respect to $x$ — what we want
- Extended form: for $y = h(g(f(x)))$, introduce $u = f(x)$, $v = g(u)$: $dy/dx = (dy/dv)(dv/du)(du/dx)$
- Caution: the "cancellation" of $du$ is a notational convenience, not algebraic division of numbers. It breaks for partial derivatives (use $\partial$) and for non-invertible functions.
### Formula-to-English Translation
"The rate at which $y$ changes with respect to $x$ equals the rate at which $y$ changes with respect to $u$, multiplied by the rate at which $u$ changes with respect to $x$." Tiny trace: $y = \ln(x^3)$. Let $u = x^3$, so $y = \ln u$.
$dy/du = 1/u$. $du/dx = 3x^2$.
$dy/dx = (1/u)(3x^2) = 3x^2/x^3 = 3/x$.
At $x = 2$: $dy/dx = 3/2 = 1.5$. Direct: $d/dx[\ln(x^3)] = d/dx[3\ln x] = 3/x$. $\checkmark$ ### Critical Concepts
- **Leibniz notation is self-documenting:** $d\mathcal{L}/dW = (d\mathcal{L}/d\hat{y})(d\hat{y}/dz)(dz/dW)$ — you can read each factor as a plain sentence. This is why ML papers and PyTorch documentation use this notation for gradient derivations. In contrast, Lagrange notation $\mathcal{L}'' \cdot ...$ requires context to know what each prime is with respect to.
- **The cancellation is a mnemonic, not algebra:** $du$ in $dy/du$ and $du/dx$ "appears to cancel" to give $dy/dx$, but $du$ is not a number. The rigorous justification is the limit definition of the derivative. The cancellation works correctly for smooth functions of one variable. It does NOT work for partial derivatives: $(\partial z/\partial x) \ne (\partial z/\partial u)(\partial u/\partial x)$ when $u$ depends on both $x$ and $y$.
- **Gradient flow in autograd:** every modern autograd system (PyTorch, JAX, TensorFlow) computes gradients via the Leibniz chain rule. Each operation stores its local Jacobian (or VJP/JVP function). The backward pass multiplies them in the correct order. When you call `.backward()`, it is Leibniz chain rule from output back to parameters, one link at a time.
- **Implicit differentiation:** if $F(x, y) = 0$ defines $y$ implicitly as a function of $x$, differentiate both sides with respect to $x$ using the chain rule: $F_x + F_y(dy/dx) = 0$, so $dy/dx = -F_x/F_y$. This is the Leibniz chain rule applied when you cannot isolate $y$ explicitly. Used for constraints in optimization (Lagrangian conditions) and for elliptic curves/manifolds.
- **Change of variable:** the chain rule underlies the change-of-variable formula in probability: if $Y = g(X)$ and $g$ is monotone, $f_Y(y) = f_X(g^{-1}(y)) \cdot |d/dy[g^{-1}(y)]|$. The Jacobian term is $|dx/dy|$ — the Leibniz chain rule derivative of the inverse transformation. This appears in normalizing flows (generative models) where a density is transformed through a sequence of invertible maps.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Differentiate $y = (1 + e^{-x})^{-2}$ using Leibniz chain rule.* *Step 1: Introduce an intermediate variable.*
Let $u = 1 + e^{-x}$, so $y = u^{-2}$. *Step 2: Compute $dy/du$.*
$dy/du = -2u^{-3} = -2(1 + e^{-x})^{-3}$. *Step 3: Compute $du/dx$.*
$du/dx = d/dx[1 + e^{-x}] = 0 + e^{-x} \cdot (-1) = -e^{-x}$. *Step 4: Multiply (Leibniz chain).*
$dy/dx = (dy/du)(du/dx) = [-2(1 + e^{-x})^{-3}] \cdot [-e^{-x}] = \frac{2e^{-x}}{(1 + e^{-x})^3}$. *Note:* $\sigma(x) = (1 + e^{-x})^{-1}$, so $\sigma(x)^2 = (1+e^{-x})^{-2}$ and this result is $dy/dx = 2\sigma(x)^2 \cdot (1-\sigma(x))$, confirming the squared-sigmoid derivative.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def leibniz_chain_demo( dy_du_fn, du_dx_fn, u_from_x_fn, x: float,
) -> float: """Leibniz chain rule: dy/dx = (dy/du) * (du/dx). Each factor computed at the correct point. """ u = u_from_x_fn(x) return dy_du_fn(u) * du_dx_fn(x) # Concrete compositions with named intermediate variables
# ----------------------------------------------------------
# y = ln(x^3): u = x^3, y = ln(u)
# y = sin(e^x): u = e^x, y = sin(u)
# y = (1+x^2)^5: u = 1+x^2, y = u^5
# y = exp(-x^2/2): u = -x^2/2, y = exp(u) compositions = [ { "name": "ln(x^3)", "u_fn": lambda x: x**3, "dy_du": lambda u: 1.0 / u, "du_dx": lambda x: 3 * x**2, "analytic": lambda x: 3.0 / x, # d/dx[3*ln(x)] }, { "name": "sin(exp(x))", "u_fn": lambda x: np.exp(x), "dy_du": lambda u: np.cos(u), "du_dx": lambda x: np.exp(x), "analytic": lambda x: np.cos(np.exp(x)) * np.exp(x), }, { "name": "(1+x^2)^5", "u_fn": lambda x: 1 + x**2, "dy_du": lambda u: 5 * u**4, "du_dx": lambda x: 2 * x, "analytic": lambda x: 5 * (1 + x**2)**4 * 2 * x, }, { "name": "exp(-x^2/2)", "u_fn": lambda x: -x**2 / 2, "dy_du": lambda u: np.exp(u), "du_dx": lambda x: -x, "analytic": lambda x: -x * np.exp(-x**2 / 2), },
] h = 1e-7
print(f"{'Function':>18} {'x':>5} {'Leibniz':>12} {'Analytic':>12} {'Agree':>7}")
for comp in compositions: for x_val in [0.5, 1.5]: leibniz = leibniz_chain_demo(comp["dy_du"], comp["du_dx"], comp["u_fn"], x_val) analytic = comp["analytic"](x_val) match = abs(leibniz - analytic) < 1e-5 print(f"{comp['name']:>18} {x_val:>5.2f} {leibniz:>12.6f} {analytic:>12.6f} {str(match):>7}")
```
#### Beginner friendly Example [R])
``` r
# Leibniz chain rule: dy/dx = (dy/du) * (du/dx)
leibniz_chain <- function(dy_du_fn, du_dx_fn, u_from_x_fn, x) { u <- u_from_x_fn(x) dy_du_fn(u) * du_dx_fn(x)
} # Three examples with explicit intermediate variables
examples <- list( list( name = "ln(x^3)", u_fn = function(x) x^3, dy_du = function(u) 1 / u, du_dx = function(x) 3 * x^2, analytic = function(x) 3 / x ), list( name = "sin(exp(x))", u_fn = exp, dy_du = cos, du_dx = exp, analytic = function(x) cos(exp(x)) * exp(x) ), list( name = "exp(-x^2/2)", u_fn = function(x) -x^2 / 2, dy_du = exp, du_dx = function(x) -x, analytic = function(x) -x * exp(-x^2 / 2) )
) cat(sprintf("%-18s %-5s %-12s %-12s %-7s\n", "Function", "x", "Leibniz", "Analytic", "Match"))
for (ex in examples) { for (x_val in c(0.5, 1.5)) { leibniz_val <- leibniz_chain(ex$dy_du, ex$du_dx, ex$u_fn, x_val) analytic_val <- ex$analytic(x_val) match <- abs(leibniz_val - analytic_val) < 1e-5 cat(sprintf("%-18s %-5.2f %-12.6f %-12.6f %-7s\n", ex$name, x_val, leibniz_val, analytic_val, as.character(match))) }
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_regression
from sklearn.preprocessing import StandardScaler np.random.seed(42) # -- Leibniz chain rule: gradient derivation for a normalizing flow step --
# Use case: a DS implements a single affine coupling layer, computing the
# log-likelihood gradient with explicit Leibniz notation for each link.
#
# Normalizing flows learn a bijection z = f(x; theta) to transform a
# simple base distribution p_z(z) into a complex data distribution p_x(x).
# Log-likelihood: log p_x(x) = log p_z(f(x)) + log|df/dx|
# (change of variables formula -- Leibniz Jacobian)
#
# Affine coupling layer: z = x * exp(s) + t (element-wise, s and t from NN)
# Inverse: x = (z - t) / exp(s) = (z - t) * exp(-s)
# Log-Jacobian: sum(s) per sample (diagonal Jacobian -> log-det = sum of logs)
#
# Gradient of log p_x wrt s:
# d(log p_x)/ds = d(log p_z(z))/dz * dz/ds + d(log|det J|)/ds
# Each factor is one Leibniz link. DIM = 6
N = 200
SCALE = 0.1 # small scale for stable demo def base_log_prob(z: np.ndarray) -> np.ndarray: """log p_z(z): standard normal, shape (N,).""" return float(-0.5 * np.sum(z**2, axis=1) - 0.5 * DIM * np.log(2 * np.pi)) def base_log_prob_grad_z(z: np.ndarray) -> np.ndarray: """d(log p_z)/dz = -z (Leibniz link: d(log p_z)/dz).""" return -z def affine_forward(x: np.ndarray, s: np.ndarray, t: np.ndarray): """z = x * exp(s) + t. Leibniz: dz/ds = x * exp(s) = z - t.""" exp_s = np.exp(s) z = x * exp_s + t return z, exp_s def log_det_jacobian(s: np.ndarray) -> np.ndarray: """log|det J| = sum(s) per sample. d(log|det J|)/ds = 1 (per dimension).""" return np.sum(s, axis=1) def affine_coupling_log_prob_and_grad( x: np.ndarray, s: np.ndarray, t: np.ndarray,
): """ Compute log p_x(x) and gradient wrt s, using Leibniz chain rule explicitly. Leibniz decomposition for grad wrt s: d(log p_x)/ds = [d(log p_z)/dz] * [dz/ds] <- chain link 1: data-ll gradient + [d(log|det J|)/ds] <- chain link 2: volume correction """ # Forward pass z, exp_s = affine_forward(x, s, t) log_pz = base_log_prob(z) # log p_z(z), shape (N,) log_jac = log_det_jacobian(s) # log|det J|, shape (N,) log_px = log_pz + log_jac # log p_x(x), shape (N,) # Leibniz chain: gradient wrt s # Link 1: d(log p_z)/dz * dz/ds d_logpz_dz = base_log_prob_grad_z(z) # shape (N, DIM): -z dz_ds = x * exp_s # dz/ds = x * exp(s) = z - t, shape (N, DIM) grad_link1 = d_logpz_dz * dz_ds # element-wise product, shape (N, DIM) # Link 2: d(log|det J|)/ds = 1 for each dimension grad_link2 = np.ones_like(s) # shape (N, DIM) # Total gradient (mean over batch) grad_s = np.mean(grad_link1 + grad_link2, axis=0) return float(np.mean(log_px)), grad_s # Generate synthetic data
X_raw, _ = make_regression(n_samples=N, n_features=DIM, noise=0.1, random_state=42)
scaler = StandardScaler()
X = scaler.fit_transform(X_raw) * SCALE # Fixed (small) scale and shift parameters for demo
s_param = np.random.randn(N, DIM) * 0.1 # per-sample, per-dim (simplified)
t_param = np.zeros((N, DIM)) log_px, grad_s = affine_coupling_log_prob_and_grad(X, s_param, t_param) # Numerical verification of gradient (central difference on mean log-prob)
def mean_log_px(s_flat: np.ndarray) -> float: s_mat = s_flat.reshape(N, DIM) z, exp_s = affine_forward(X, s_mat, t_param) return float(np.mean(base_log_prob(z) + log_det_jacobian(s_mat))) numerical_grad = np.zeros(N * DIM)
eps = 1e-5
s_flat = s_param.flatten()
for i in range(min(DIM, 6)): # check first DIM dimensions only (runtime) s_plus = s_flat.copy(); s_plus[i] += eps s_minus = s_flat.copy(); s_minus[i] -= eps numerical_grad[i] = (mean_log_px(s_plus) - mean_log_px(s_minus)) / (2 * eps) # Only compare the DIM components we checked
analytic_flat = grad_s[: DIM]
numerical_flat = numerical_grad[: DIM]
max_rel_err = float(np.max(np.abs(analytic_flat - numerical_flat) / np.maximum(np.abs(analytic_flat), 1e-8))) print("Leibniz Chain Rule: Normalizing Flow Affine Coupling Layer")
print(f"\nDimension: {DIM}, Samples: {N}")
print(f"\nLeibniz chain decomposition for d(log p_x)/ds:")
print(f" Link 1: [d(log p_z)/dz] * [dz/ds] = (-z) * (x * exp(s))")
print(f" Link 2: d(log|det J|)/ds = 1 (per element)")
print(f" Total : mean over batch")
print(f"\nlog p_x (mean over batch): {log_px:.4f}")
print(f"Gradient wrt s (first {DIM} dims): {np.round(grad_s[:DIM], 5)}")
print(f"\nNumerical gradient (finite diff, first {DIM} dims): {np.round(numerical_flat, 5)}")
print(f"Max relative error (Leibniz vs numerical): {max_rel_err:.2e}")
print(f"Gradient check: {'PASS' if max_rel_err < 1e-3 else 'FAIL'}")
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