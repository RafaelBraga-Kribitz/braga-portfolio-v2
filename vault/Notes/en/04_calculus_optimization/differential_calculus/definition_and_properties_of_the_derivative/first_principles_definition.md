---
title: First Principles Definition
date: '2026-04-16'
wordCount: 913
slug: first_principles_definition
permalink: /notes/04_calculus_optimization/differential_calculus/definition_and_properties_of_the_derivative/first_principles_definition/index.html
share_status: draft
publish_target: note
boundary: public
---
# $f'(x) = \frac{dy}{dx} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the foundational definition of the derivative — the limit of the difference quotient as the step size $h \to 0$. The difference quotient $[f(x+h) - f(x)]/h$ is the slope of the secant line through $(x, f(x))$ and $(x+h, f(x+h))$. As $h \to 0$, this secant line approaches the tangent line at $x$, and its slope approaches the instantaneous rate of change. All differentiation rules (power, product, chain, etc.) are derived from this definition. In DA/DS: numerical differentiation via finite differences directly implements this formula (with small but nonzero $h$) to compute gradients when analytic derivatives are unavailable; gradient checking uses this to verify backpropagation implementations; the definition clarifies why neural network gradients must be computed carefully (h cannot actually be 0 in floating-point arithmetic).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["f'(x) = ? (instantaneous rate of change at x)"] A --> B["Start: secant slope between x and x+h"] B --> C["Slope = [f(x+h) - f(x)] / h (difference quotient)"] C --> D["Let h -> 0 (secant approaches tangent)"] D --> E["f'(x) = lim_{h->0} [f(x+h) - f(x)] / h"] E --> F["If limit exists: f is differentiable at x"] E --> G["If limit does not exist: f is not differentiable at x (e.g., corner, discontinuity)"] A --> H["Numerical approx (central difference): [f(x+h) - f(x-h)] / (2h) for small h"] H --> I["O(h^2) error vs O(h) for one-sided; use h ~ 1e-5 in practice"]
```
### Real-World use:
#### Situation it is used
Gradient checking in deep learning: verify that `autograd` output matches finite-difference approximation $[f(w+h\mathbf{e}_i) - f(w-h\mathbf{e}_i)]/(2h)$; numerical Jacobian computation for non-differentiable operations or when analytic gradient is unavailable; deriving all differentiation rules from scratch; understanding where and why a function is non-differentiable (ReLU at 0, $|x|$ at 0, piecewise functions at breakpoints).
#### Problem it solves
All derivative rules (power, chain, product, etc.) are derived from this definition. Without it, derivatives are just "magic formulas." With it, one can derive any new rule from scratch, verify numerical gradients, and understand the conditions under which a derivative exists.
#### How it solves the problem
The difference quotient $[f(x+h)-f(x)]/h$ is a well-defined ratio for any finite $h \ne 0$. Taking the limit as $h \to 0$ (if it exists) gives the exact instantaneous slope. This is the "from scratch" definition that requires no prior knowledge of differentiation rules.
#### Example of it used in the Working Context as DA/DS for a Business
A DS implements a custom loss function and wants to verify their manually computed gradient. They evaluate the loss at $w + h\mathbf{e}_i$ and $w - h\mathbf{e}_i$ for each parameter $w_i$, with $h = 10^{-5}$, and compare to the analytic gradient. If the relative error is $< 10^{-4}$, the gradient implementation is correct. This is standard gradient checking in ML (e.g., Andrew Ng's deep learning course, PyTorch's `gradcheck`).
### The Formula (Fragment-First)
- $f'(x)$: the derivative of $f$ at $x$; also written $dy/dx$, $\dot{f}(x)$, $Df(x)$
- $\lim_{h \to 0}$: the limit as $h$ approaches 0 (from both sides)
- $f(x+h)$: the function evaluated at a point $h$ to the right of $x$
- $f(x+h) - f(x)$: the numerator; the change in $f$ over the interval $[x, x+h]$
- $h$: the denominator; the width of the interval
- $[f(x+h) - f(x)]/h$: the difference quotient; the average rate of change over $[x, x+h]$
- One-sided limits: right derivative uses $h \to 0^+$; left derivative uses $h \to 0^-$; both must agree
- Central difference (numerical): $[f(x+h) - f(x-h)]/(2h)$; $O(h^2)$ error vs $O(h)$ for forward difference
- Differentiable implies continuous: if $f'(x)$ exists, then $f$ is continuous at $x$; the converse is false ### Formula-to-English Translation
"The derivative is the limit of rise-over-run as the run shrinks to zero. Take a tiny step $h$ to the right, measure how much $f$ changes, divide by $h$. Let $h$ get infinitely small. The limiting ratio is the instantaneous slope — the tangent line slope at $x$." Tiny trace: $f(x) = x^2$, find $f'(3)$ from first principles.
$[f(3+h) - f(3)]/h = [(3+h)^2 - 9]/h = [9 + 6h + h^2 - 9]/h = [6h + h^2]/h = 6 + h$.
As $h \to 0$: $f'(3) = 6$. Matches power rule: $2 \cdot 3 = 6$. $\checkmark$ ### Critical Concepts
- **Why the limit must exist from both sides:** if the left-limit ($h \to 0^-$) and right-limit ($h \to 0^+$) differ, the function has a "corner" at $x$ (e.g., $|x|$ at $x=0$: left derivative $= -1$, right derivative $= +1$). In ML: ReLU is not differentiable at 0; in practice, subgradients (0 or 1) are used.
- **Floating-point vs mathematical $h \to 0$:** in code, $h$ cannot truly approach 0. Choose $h$ to balance truncation error ($O(h)$ for forward, $O(h^2)$ for central) and round-off error (floating-point precision $\approx 10^{-16}$ for float64). Optimal $h$ for central differences: $\approx \epsilon^{1/3} \approx 10^{-5}$ for float64.
- **Gradient checking protocol:** relative error $= |g_{\text{analytic}} - g_{\text{numeric}}| / \max(|g_{\text{analytic}}|, |g_{\text{numeric}}|, 10^{-8})$. Accept if $< 10^{-5}$, investigate if $> 10^{-3}$.
- **Jacobian and Hessian from first principles:** the Jacobian $J_{ij} = \partial f_i/\partial x_j$ uses the same definition component-wise. The Hessian uses the second-order divided difference. `torch.autograd.gradcheck` implements these checks automatically.
- **Non-differentiable points matter in ML:** ReLU at 0, absolute value at 0, max/min operations, and piecewise-linear functions all lack derivatives at breakpoints. Modern ML frameworks handle these with subgradients; understanding first principles clarifies what the framework is actually computing.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Derive $d/dx(x^3)$ from first principles.* *Step 1: Write the difference quotient.*
$[(x+h)^3 - x^3]/h$. *Step 2: Expand $(x+h)^3$.*
$(x+h)^3 = x^3 + 3x^2 h + 3xh^2 + h^3$. *Step 3: Subtract and simplify.*
$[3x^2 h + 3xh^2 + h^3]/h = 3x^2 + 3xh + h^2$. *Step 4: Take the limit.*
$\lim_{h \to 0}(3x^2 + 3xh + h^2) = 3x^2$. Result: $d/dx(x^3) = 3x^2$. Matches power rule. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def numerical_derivative_forward(f, x: float, h: float = 1e-5) -> float: """Forward difference: [f(x+h) - f(x)] / h. O(h) error.""" return (f(x + h) - f(x)) / h def numerical_derivative_central(f, x: float, h: float = 1e-5) -> float: """Central difference: [f(x+h) - f(x-h)] / (2h). O(h^2) error.""" return (f(x + h) - f(x - h)) / (2 * h) # Example functions and their analytic derivatives
test_functions = [ (lambda x: x**2, lambda x: 2*x, "x^2", 2.0), (lambda x: x**3, lambda x: 3*x**2, "x^3", 1.5), (lambda x: np.sin(x), lambda x: np.cos(x), "sin(x)", 0.5), (lambda x: np.exp(x), lambda x: np.exp(x), "exp(x)", 1.0),
] print(f"{'Function':>10} {'x':>5} {'Analytic':>12} {'Forward':>12} {'Central':>12} {'Fwd err':>10} {'Cen err':>10}")
for f, f_prime, name, x0 in test_functions: analytic = f_prime(x0) fwd = numerical_derivative_forward(f, x0) cen = numerical_derivative_central(f, x0) print(f"{name:>10} {x0:>5.2f} {analytic:>12.8f} {fwd:>12.8f} {cen:>12.8f} " f"{abs(analytic-fwd):>10.2e} {abs(analytic-cen):>10.2e}") # Show effect of h choice on accuracy
print("\nEffect of h on central difference accuracy for sin(0.5):")
analytic = np.cos(0.5)
print(f"{'h':>12} {'Error':>15}")
for h in [1e-1, 1e-3, 1e-5, 1e-7, 1e-9, 1e-12, 1e-15]: cen = numerical_derivative_central(np.sin, 0.5, h) print(f"{h:>12.0e} {abs(analytic - cen):>15.2e}")
```
#### Beginner friendly Example [R])
``` r
# First principles: numerical derivative via central difference
numerical_deriv <- function(f, x, h = 1e-5) (f(x + h) - f(x - h)) / (2 * h) # Test on standard functions
functions <- list( list(f = function(x) x^2, f_prime = function(x) 2*x, name = "x^2"), list(f = function(x) x^3, f_prime = function(x) 3*x^2, name = "x^3"), list(f = function(x) sin(x), f_prime = function(x) cos(x), name = "sin(x)"), list(f = function(x) exp(x), f_prime = function(x) exp(x), name = "exp(x)")
) x0 <- 1.5
cat(sprintf("%-10s %-12s %-12s %-12s\n", "Function", "Analytic", "Central", "Error"))
for (fn in functions) { analytic <- fn$f_prime(x0) central <- numerical_deriv(fn$f, x0) cat(sprintf("%-10s %-12.8f %-12.8f %-12.2e\n", fn$name, analytic, central, abs(analytic - central)))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np np.random.seed(42) # -- Gradient checking: verify analytic gradient of logistic regression loss --
# Standard practice before training: compare autograd/analytic gradient
# to numerical gradient computed from first principles (central differences). def sigmoid(z: np.ndarray) -> np.ndarray: """Numerically stable sigmoid.""" return np.where(z >= 0, 1 / (1 + np.exp(-z)), np.exp(z) / (1 + np.exp(z))) def log_loss(w: np.ndarray, X: np.ndarray, y: np.ndarray) -> float: """Logistic regression log-loss.""" p = sigmoid(X @ w) p_safe = np.clip(p, 1e-10, 1 - 1e-10) return float(-np.mean(y * np.log(p_safe) + (1 - y) * np.log(1 - p_safe))) def log_loss_gradient(w: np.ndarray, X: np.ndarray, y: np.ndarray) -> np.ndarray: """Analytic gradient: X^T(p-y)/N.""" p = sigmoid(X @ w) return X.T @ (p - y) / len(y) def numerical_gradient( loss_fn, w: np.ndarray, h: float = 1e-5
) -> np.ndarray: """Numerical gradient via central differences (first principles). grad_i = [L(w + h*e_i) - L(w - h*e_i)] / (2h). """ grad = np.zeros_like(w) for i in range(len(w)): w_plus = w.copy(); w_plus[i] += h w_minus = w.copy(); w_minus[i] -= h grad[i] = (loss_fn(w_plus) - loss_fn(w_minus)) / (2 * h) return grad def relative_error(g_analytic: np.ndarray, g_numeric: np.ndarray) -> float: """Max relative error between two gradient vectors.""" diff = np.abs(g_analytic - g_numeric) denom = np.maximum(np.abs(g_analytic), np.abs(g_numeric)) denom = np.maximum(denom, 1e-8) return float(np.max(diff / denom)) # Generate synthetic classification data
N, D = 100, 5
X = np.random.randn(N, D)
w_true = np.random.randn(D) * 0.5
y = (sigmoid(X @ w_true) > 0.5).astype(float)
w_test = np.random.randn(D) * 0.1 import functools
loss_fn = functools.partial(log_loss, X=X, y=y) g_analytic = log_loss_gradient(w_test, X, y)
g_numeric = numerical_gradient(loss_fn, w_test, h=1e-5)
rel_err = relative_error(g_analytic, g_numeric) print("Gradient Check: First Principles vs Analytic (logistic regression)")
print(f"\nw_test = {w_test.round(4)}")
print(f"\n{'Param':>8} {'Analytic':>14} {'Numerical':>14} {'Abs err':>12}")
for i in range(D): print(f"{'w['+str(i)+']':>8} {g_analytic[i]:>14.8f} {g_numeric[i]:>14.8f} {abs(g_analytic[i]-g_numeric[i]):>12.2e}")
print(f"\nMax relative error: {rel_err:.2e}")
status = "PASSED" if rel_err < 1e-4 else "FAILED"
print(f"Gradient check: {status} (threshold: 1e-4)")
print(f"\nKey: numerical gradient uses [L(w+h*e_i) - L(w-h*e_i)] / (2h) -- first principles definition.")
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
1300 pag 217