---
title: Partial Derivative Definition
date: '2026-04-16'
wordCount: 961
slug: partial_derivative_definition
permalink: /notes/04_calculus_optimization/multivariable_calculus_and_matrix_calculus/partial_differentiation_and_total_differentials/partial_derivative_definition/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{\partial f(a,b)}{\partial x} = \lim_{h \to 0} \frac{f(a+h, b) - f(a,b)}{h}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A partial derivative measures how a multivariate function changes when you vary exactly one input while holding all others fixed. The notation $\frac{\partial f}{\partial x}$ uses the "curly d" ($\partial$) to signal that other variables exist and are being held constant. This is the fundamental building block of multivariate calculus: without it, you cannot define gradients, Jacobians, Hessians, or backpropagation. In DA/DS, every ML loss function depends on many parameters ($w_1, w_2, \ldots, w_n$). The partial derivative $\frac{\partial L}{\partial w_i}$ tells you how the loss responds to a small change in the $i$-th weight while all others stay fixed. This is literally what gradient descent computes at every step: a vector of partial derivatives (the gradient). Understanding the partial derivative as a limit (the definition) reveals why automatic differentiation (AD) works, and why numerical gradient checking (finite differences) is an approximation to this limit.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Function f(x, y, ...) of multiple variables"] --> B["Choose ONE variable to differentiate: x"] B --> C["Treat all OTHER variables as constants"] C --> D["Apply single-variable derivative rules to f, treating constants as numbers"] D --> E["Result: partial/partial_x f(x, y, ...)"] E --> F{"What does the result represent?"} F -- "Scalar" --> G["Rate of change of f in the x-direction at a specific point"] F -- "Function of remaining vars" --> H["A new multivariate function giving slope at every point"] E --> I["Numerical check: finite difference (f(x+h,y)-f(x,y))/h as h->0"]
```
### Real-World use:
#### Situation it is used
Any time a function depends on multiple inputs and you need the rate of change with respect to one: gradient computation in machine learning (every parameter update requires partial derivatives of the loss), sensitivity analysis in business models (how does revenue change with a 1% increase in conversion rate, holding traffic constant?), feature importance via partial effects in regression, and computing the Jacobian and Hessian matrices for optimization and uncertainty quantification.
#### Problem it solves
For a function of one variable, the ordinary derivative captures the slope completely. For a multivariate function, "the slope" is ambiguous because there are infinitely many directions to move. The partial derivative pins down the slope in one coordinate direction at a time, making the problem tractable.
#### How it solves the problem
By reducing a multivariate problem to a univariate one: freeze all variables except $x$, and apply the familiar single-variable limit definition. The result $\frac{\partial f}{\partial x}$ is the slope of the "slice" of the function obtained by cutting through it parallel to the $x$-axis.
#### Example of it used in the Working Context as DA/DS for a Business
A marketing analyst models conversion rate as $C(p, q) = 1 - e^{-\alpha p} \cdot e^{-\beta q}$ where $p$ = ad spend and $q$ = landing page quality score. The partial derivative $\frac{\partial C}{\partial p} = \alpha e^{-\alpha p} e^{-\beta q}$ tells how much conversion improves per unit of additional ad spend, holding quality fixed. Setting this equal to cost marginal (the budget allocation optimality condition) yields the optimal spend split.
### The Formula (Fragment-First)
$$\frac{\partial f(a,b)}{\partial x} = \lim_{h \to 0} \frac{f(a+h, b) - f(a,b)}{h}$$ Each symbol:
- $\partial$: the "curly d" (partial derivative symbol) — signals multiple variables; pronounced "partial"
- $f(a,b)$: the function evaluated at the point $(a, b)$
- $\frac{\partial f}{\partial x}$: the partial derivative of $f$ with respect to $x$ — slope in the $x$-direction
- $\lim_{h \to 0}$: take the limit as the step size vanishes (same as ordinary derivative definition)
- $f(a+h, b)$: function evaluated after nudging only $x$ by $h$; $b$ stays frozen
- $f(a,b)$: original function value at the base point
- $h$: the nudge size, approaching 0 **In practice**: treat all other variables as constants and apply standard differentiation rules (power, product, chain) to the chosen variable.
### Formula-to-English Translation
"At the point $(a,b)$, nudge only $x$ by a tiny amount $h$ while keeping $y = b$ exactly fixed. Measure how much $f$ changes: $f(a+h, b) - f(a, b)$. Divide by $h$ to get the average rate of change over the nudge. Let $h \to 0$ so the nudge becomes infinitesimal. The limit is the instantaneous rate of change of $f$ in the $x$-direction at $(a, b)$." ### Critical Concepts
- **Hold others constant**: the key operation. If $f(x,y) = x^2 y$, then $\frac{\partial f}{\partial x} = 2xy$ (treating $y$ as a constant) and $\frac{\partial f}{\partial y} = x^2$ (treating $x$ as a constant).
- **Not the full derivative**: partial derivatives ignore interactions between variables when you move in multiple directions simultaneously. The full picture requires the gradient vector (all partials together) or the total differential.
- **Mixed partials (Schwarz's theorem)**: for smooth functions, $\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$. Order doesn't matter.
- **Numerical approximation**: $\frac{f(a+h,b) - f(a,b)}{h}$ is the forward difference; $\frac{f(a+h,b) - f(a-h,b)}{2h}$ is the centered difference (more accurate, $O(h^2)$ vs. $O(h)$ error).
- **Gradient checking**: comparing analytic $\frac{\partial L}{\partial w_i}$ to the numerical finite difference is the standard sanity check for backpropagation implementations.
- **AD vs. numerical**: automatic differentiation (AD) computes exact partial derivatives (to machine precision) by applying the chain rule symbolically; finite differences are approximate but require no mathematical derivation.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Let $f(x, y) = 3x^2 y + \ln(y)$. Compute $\frac{\partial f}{\partial x}$ and $\frac{\partial f}{\partial y}$ at $(x, y) = (2, 1)$. *Step 1: Partial w.r.t. $x$ (treat $y$ as a constant)*
$\frac{\partial}{\partial x}(3x^2 y + \ln y) = 3 \cdot 2x \cdot y + 0 = 6xy$
At $(2, 1)$: $\frac{\partial f}{\partial x}\big|_{(2,1)} = 6 \cdot 2 \cdot 1 = 12$ *Step 2: Partial w.r.t. $y$ (treat $x$ as a constant)*
$\frac{\partial}{\partial y}(3x^2 y + \ln y) = 3x^2 \cdot 1 + \frac{1}{y} = 3x^2 + \frac{1}{y}$
At $(2, 1)$: $\frac{\partial f}{\partial y}\big|_{(2,1)} = 3 \cdot 4 + 1 = 13$ *Step 3: Interpret*
At $(2, 1)$: if $x$ increases by 1 (holding $y=1$ fixed), $f$ increases by $\approx 12$. If $y$ increases by 1 (holding $x=2$ fixed), $f$ increases by $\approx 13$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def f(x: float, y: float) -> float: """Multivariate function: f(x, y) = 3*x^2*y + ln(y).""" return 3.0 * x**2 * y + np.log(y) def partial_x_analytic(x: float, y: float) -> float: """df/dx = 6xy (hold y constant, differentiate power rule).""" return 6.0 * x * y def partial_y_analytic(x: float, y: float) -> float: """df/dy = 3x^2 + 1/y (hold x constant, differentiate ln).""" return 3.0 * x**2 + 1.0 / y # Numerical partial derivative via centered finite difference
def numerical_partial(fn, x0: float, y0: float, var: str, h: float = 1e-5) -> float: """Centered difference approximation of partial derivative.""" if var == "x": return (fn(x0 + h, y0) - fn(x0 - h, y0)) / (2 * h) return (fn(x0, y0 + h) - fn(x0, y0 - h)) / (2 * h) # Evaluate at (2, 1)
x0, y0 = 2.0, 1.0 df_dx_analytic = partial_x_analytic(x0, y0)
df_dy_analytic = partial_y_analytic(x0, y0)
df_dx_numerical = numerical_partial(f, x0, y0, var="x")
df_dy_numerical = numerical_partial(f, x0, y0, var="y") print(f"At ({x0}, {y0}):")
print(f" df/dx analytic: {df_dx_analytic:.8f}")
print(f" df/dx numerical: {df_dx_numerical:.8f} (error: {abs(df_dx_analytic - df_dx_numerical):.2e})")
print(f" df/dy analytic: {df_dy_analytic:.8f}")
print(f" df/dy numerical: {df_dy_numerical:.8f} (error: {abs(df_dy_analytic - df_dy_numerical):.2e})")
```
#### Beginner friendly Example [R])
``` r
f <- function(x, y) 3 * x^2 * y + log(y) # Analytic partial derivatives
partial_x <- function(x, y) 6 * x * y # df/dx
partial_y <- function(x, y) 3 * x^2 + 1/y # df/dy # Numerical (centered finite difference)
h <- 1e-5
x0 <- 2; y0 <- 1 num_dx <- (f(x0 + h, y0) - f(x0 - h, y0)) / (2 * h)
num_dy <- (f(x0, y0 + h) - f(x0, y0 - h)) / (2 * h) cat(sprintf("At (%.0f, %.0f):\n", x0, y0))
cat(sprintf(" df/dx analytic: %.8f\n", partial_x(x0, y0)))
cat(sprintf(" df/dx numerical: %.8f (error: %.2e)\n", num_dx, abs(partial_x(x0, y0) - num_dx)))
cat(sprintf(" df/dy analytic: %.8f\n", partial_y(x0, y0)))
cat(sprintf(" df/dy numerical: %.8f (error: %.2e)\n", num_dy, abs(partial_y(x0, y0) - num_dy)))
```
#### Final Professional Example [Python])
``` python
"""
Partial derivatives of a multi-parameter logistic regression loss. Loss: L(w) = -(1/N) * sum_i [y_i * log(sigma(w^T x_i)) + (1-y_i) * log(1-sigma(w^T x_i))] Partial derivative: dL/dw_j = -(1/N) * sum_i [y_i - sigma(w^T x_i)] * x_ij We compute: (1) analytic gradient, (2) numerical gradient per parameter,
and verify they match (gradient check).
"""
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler RANDOM_SEED = 42
rng = np.random.default_rng(RANDOM_SEED) def sigmoid(z: np.ndarray) -> np.ndarray: return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500))) def log_loss(w: np.ndarray, x: np.ndarray, y: np.ndarray) -> float: """Binary cross-entropy loss.""" prob = sigmoid(x @ w) prob = np.clip(prob, 1e-12, 1.0 - 1e-12) return float(-np.mean(y * np.log(prob) + (1 - y) * np.log(1 - prob))) def analytic_gradient(w: np.ndarray, x: np.ndarray, y: np.ndarray) -> np.ndarray: """dL/dw_j = (1/N) * sum_i (sigma(w^T x_i) - y_i) * x_ij.""" residual = sigmoid(x @ w) - y return x.T @ residual / len(y) def numerical_gradient(w: np.ndarray, x: np.ndarray, y: np.ndarray, h: float = 1e-5) -> np.ndarray: """Centered finite difference: dL/dw_j ≈ (L(w + h*e_j) - L(w - h*e_j)) / (2h).""" grad_num = np.zeros_like(w) for j in range(len(w)): e_j = np.zeros_like(w) e_j[j] = 1.0 grad_num[j] = (log_loss(w + h * e_j, x, y) - log_loss(w - h * e_j, x, y)) / (2 * h) return grad_num # Dataset
x_data, y_data = make_classification(n_samples=500, n_features=5, n_informative=3, random_state=RANDOM_SEED)
x_train, x_test, y_train, y_test = train_test_split(x_data, y_data, test_size=0.3, random_state=RANDOM_SEED)
scaler = StandardScaler()
x_train_s = scaler.fit_transform(x_train) # Random weight vector for gradient check
w0 = rng.standard_normal(x_train_s.shape[1]) * 0.1 grad_analytic = analytic_gradient(w0, x_train_s, y_train)
grad_numerical = numerical_gradient(w0, x_train_s, y_train) rel_error = np.abs(grad_analytic - grad_numerical) / ( np.abs(grad_analytic) + np.abs(grad_numerical) + 1e-12
) print("Gradient check (partial derivatives of cross-entropy loss):")
print(f" {'j':>3} | {'Analytic dL/dw_j':>18} | {'Numerical dL/dw_j':>18} | {'Rel Error':>12}")
for j in range(len(w0)): print(f" {j:>3} | {grad_analytic[j]:>18.8f} | {grad_numerical[j]:>18.8f} | {rel_error[j]:>12.2e}")
print(f"\nMax relative error: {rel_error.max():.2e} (should be < 1e-4 for correct implementation)")
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
1300 pag 230