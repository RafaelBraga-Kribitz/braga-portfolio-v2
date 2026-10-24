---
title: Inverse Tangent
date: '2026-04-16'
wordCount: 864
slug: inverse_tangent
permalink: /notes/04_calculus_optimization/differential_calculus/table_of_standard_derivatives/inverse_tangent/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{d}{dx}(\arctan(ax)) = \frac{a}{1 + (ax)^2}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The derivative of $\arctan(ax)$ is $a/(1+(ax)^2)$. Unlike $\arcsin$ and $\arccos$, $\arctan$ has no domain restriction — it is defined for all real $x$, and its derivative $a/(1+(ax)^2)$ is also defined everywhere, always positive, and bounded above by $a$ (attained at $x = 0$). The denominator $1+(ax)^2 \ge 1$ ensures the derivative never exceeds $a$ and never blows up. As $|x| \to \infty$, the derivative $\to 0$: $\arctan$ flattens out, mapping all of $\mathbb{R}$ into $(-\pi/2, \pi/2)$. In DA/DS: the shape $a/(1+x^2)$ is the PDF of the Cauchy distribution; $\arctan$ derivatives appear in Mish activation gradient derivations, soft-clamping, gradient computations in angle-based attention, and physics-informed neural networks. The gradient is always well-behaved (no explosion), making $\arctan$ preferable to $\arcsin$/$\arccos$ for unbounded inputs.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["f(x) = arctan(ax)"] A --> B["Implicit differentiation: tan(y) = ax"] B --> C["sec^2(y) * y' = a"] C --> D["y' = a / sec^2(y) = a * cos^2(y)"] D --> E["Use: sec^2(y) = 1 + tan^2(y) = 1 + (ax)^2"] E --> F["d/dx(arctan(ax)) = a / (1 + (ax)^2)"] A --> G["Chain rule: d/dx(arctan(f(x))) = f'(x) / (1 + f(x)^2)"] F --> H["Domain: all real x (no restriction!)"] F --> I["Derivative always positive, max a at x=0, -> 0 as |x|->inf"]
```
### Real-World use:
#### Situation it is used
Mish activation gradient computation ($\text{Mish}(x) = x \cdot \tanh(\text{softplus}(x))$, which involves $\arctan$ terms in its full gradient chain); soft-clamping outputs to a bounded range $(-\pi/2, \pi/2)$ with a known gradient; angle-based attention where the gradient of $\arctan(\text{score})$ is bounded; inverse tangent normalization of unbounded features; computing the integral $\int 1/(1+x^2) dx = \arctan x + C$ used in probabilistic inference.
#### Problem it solves
When $\arctan$ is used as a nonlinear activation or feature transform for unbounded inputs, the gradient must be computed for backpropagation. Unlike $\arcsin$/$\arccos$, $\arctan$ is safe for all inputs, making this the preferred inverse trig derivative in ML.
#### How it solves the problem
Implicit differentiation: let $y = \arctan(ax)$, so $\tan(y) = ax$. Differentiate: $\sec^2(y) \cdot y' = a$, giving $y' = a/\sec^2(y)$. Use the identity $\sec^2(y) = 1 + \tan^2(y) = 1 + (ax)^2$. Therefore $y' = a/(1+(ax)^2)$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS uses $\arctan$-based soft clamping for a regression model output: $\hat{y} = (L/\pi) \cdot \arctan(x/s) + L/2$ maps any real input to $(0, L)$. The gradient needed for training: $d\hat{y}/dx = (L/\pi) \cdot (1/s) / (1 + (x/s)^2) = L/(s\pi(1+(x/s)^2))$. This uses $d/dx(\arctan(ax)) = a/(1+(ax)^2)$ with $a = 1/s$. The gradient is bounded ($\le L/(s\pi)$), preventing gradient explosion even for large inputs.
### The Formula (Fragment-First)
- $\arctan$: inverse tangent function; defined on all $\mathbb{R}$; maps to $(-\pi/2, \pi/2)$
- $ax$: the argument; $a$ is a scaling constant; no domain restriction
- $1 + (ax)^2$: denominator; always $\ge 1$; prevents division by zero; grows as $x^2$ for large $x$
- $a/(1+(ax)^2)$: the derivative; always positive (arctan is strictly increasing); bounded by $a$
- Base case: $d/dx(\arctan x) = 1/(1+x^2)$
- Chain rule: $d/dx(\arctan f(x)) = f'(x)/(1+f(x)^2)$
- Cauchy connection: $1/(1+x^2)$ is proportional to the Cauchy PDF: $\text{Cauchy}(x; 0, 1) = 1/(\pi(1+x^2))$
- Integral: $\int a/(1+(ax)^2) dx = \arctan(ax) + C$ ### Formula-to-English Translation
"The derivative of $\arctan(ax)$ is $a$ divided by one plus the square of the argument. The denominator grows as the input grows, so the derivative shrinks toward zero for large $|x|$ — the function 'flattens out.' Unlike $\arcsin$ and $\arccos$, this derivative is defined everywhere and never explodes." Tiny examples:
$d/dx(\arctan x)|_{x=0} = 1/(1+0) = 1$.
$d/dx(\arctan x)|_{x=1} = 1/(1+1) = 0.5$.
$d/dx(\arctan x)|_{x=10} = 1/(1+100) \approx 0.0099$.
$d/dx(\arctan(2x))|_{x=0} = 2/(1+0) = 2$.
$d/dx(\arctan(2x))|_{x=1} = 2/(1+4) = 0.4$.
### Critical Concepts
- **No domain restriction = ML-friendly:** $\arctan$ is defined and differentiable on all of $\mathbb{R}$. This makes it suitable as an activation function for unbounded inputs, unlike $\arcsin$/$\arccos$. When in doubt about which inverse trig to use in a model, $\arctan$ is the safe default.
- **Bounded gradient = no explosion:** the derivative $a/(1+(ax)^2) \le a$ with equality only at $x=0$. For large $|x|$, the gradient decays as $a/(ax)^2 = 1/(a x^2)$. This bounded gradient prevents exploding gradients, but can cause vanishing gradients for very large inputs (the same saturation problem as sigmoid/tanh). The saturation region is $|x| \gg 1/a$.
- **Cauchy distribution PDF:** $1/(\pi(1+x^2))$ is the Cauchy PDF (location 0, scale 1). The integral $\int_{-\infty}^{\infty} 1/(\pi(1+x^2)) dx = 1$ uses $\arctan$ as the antiderivative. This connection appears in probabilistic inference with Cauchy priors and in robust regression.
- **Relation to $\arcsin$/$\arccos$:** $\arctan(x) = \arcsin(x/\sqrt{1+x^2})$. Differentiating this identity reproduces the $\arctan$ derivative rule as a consistency check.
- **Scale parameter $a$ as precision:** $a/(1+(ax)^2)$ is maximized at $x=0$ with value $a$. Larger $a$ means a sharper, taller peak — the function transitions faster from $-\pi/2$ to $\pi/2$. In soft-clamping, $a$ controls how quickly the function saturates.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Differentiate $f(x) = \arctan(3x)$ and find the derivative at $x = 0.5$.* *Step 1: Apply the formula with $a = 3$.*
$f'(x) = 3/(1+(3x)^2) = 3/(1+9x^2)$. *Step 2: Evaluate at $x = 0.5$.*
$1 + 9(0.5)^2 = 1 + 9(0.25) = 1 + 2.25 = 3.25$.
$f'(0.5) = 3/3.25 \approx 0.9231$. *Step 3: Verify numerically.* $h = 10^{-7}$:
$[\arctan(3(0.5+h)) - \arctan(3(0.5-h))]/(2h) \approx 0.9231$. $\checkmark$ *Sanity check:* at $x=0$: $f'(0) = 3/(1+0) = 3$ (maximum gradient). At $x=10$: $f'(10) = 3/(1+900) \approx 0.003$ (nearly flat).
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def arctan_ax_deriv(a: float, x: float) -> float: """d/dx(arctan(ax)) = a / (1 + (ax)^2). Defined for all real x.""" return a / (1.0 + (a * x)**2) # No domain restriction: works for any x
h = 1e-7
test_cases = [(1.0, 0.0), (1.0, 1.0), (2.0, 0.5), (3.0, 0.5), (1.0, 100.0)]
print(f"{'a':>6} {'x':>8} {'Analytic':>12} {'Numerical':>12} {'Match':>7}")
for a, x in test_cases: analytic = arctan_ax_deriv(a, x) numerical = (np.arctan(a*(x+h)) - np.arctan(a*(x-h))) / (2 * h) match = abs(analytic - numerical) < 1e-5 print(f"{a:>6.2f} {x:>8.2f} {analytic:>12.6f} {numerical:>12.6f} {str(match):>7}") # Show saturation behavior
print("\nGradient decay for large |x| (a=1): shows arctan saturation")
for x in [0, 1, 5, 10, 50, 100]: deriv = arctan_ax_deriv(1.0, float(x)) print(f" x={x:>4}: d/dx(arctan(x)) = {deriv:.6f}")
```
#### Beginner friendly Example [R])
``` r
# d/dx(arctan(ax)) = a / (1 + (ax)^2)
arctan_ax_deriv <- function(a, x) a / (1 + (a * x)^2) # Verify and compare saturation
h <- 1e-7
test_cases <- list(c(1, 0), c(1, 1), c(2, 0.5), c(3, 0.5), c(1, 100)) cat(sprintf("%-6s %-8s %-12s %-12s\n", "a", "x", "Analytic", "Numerical"))
for (tc in test_cases) { a <- tc[1]; x <- tc[2] analytic <- arctan_ax_deriv(a, x) numerical <- (atan(a*(x+h)) - atan(a*(x-h))) / (2*h) cat(sprintf("%-6.2f %-8.2f %-12.6f %-12.6f\n", a, x, analytic, numerical))
} # Cauchy PDF connection: 1/(pi*(1+x^2))
cauchy_pdf <- function(x) 1 / (pi * (1 + x^2))
cat(sprintf("\nCauchy(0,1) PDF = 1/(pi*(1+x^2)), integral from -Inf to Inf:\n"))
integral_val <- integrate(cauchy_pdf, -Inf, Inf)$value
cat(sprintf(" integrate(1/(pi*(1+x^2)), -Inf, Inf) = %.6f (should be 1)\n", integral_val))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_regression
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge np.random.seed(42) # -- arctan soft-clamping: bounded regression output with smooth gradient --
# Use case: a DS predicts a score bounded in (0, 100) using arctan-based output activation.
# The arctan clamping ensures outputs stay in range; gradient is always well-defined. OUTPUT_MIN = 0.0
OUTPUT_MAX = 100.0
OUTPUT_MID = (OUTPUT_MIN + OUTPUT_MAX) / 2 # 50.0
OUTPUT_SCALE = (OUTPUT_MAX - OUTPUT_MIN) / np.pi # maps (-pi/2, pi/2) -> (0, 100)
ARCTAN_SCALE = 1.0 # controls how quickly the function saturates (a in arctan(ax)) def arctan_clamp(z: np.ndarray, scale: float = ARCTAN_SCALE) -> np.ndarray: """Soft clamp to (OUTPUT_MIN, OUTPUT_MAX) via arctan: f(z) = OUTPUT_MID + OUTPUT_SCALE * arctan(scale*z).""" return OUTPUT_MID + OUTPUT_SCALE * np.arctan(scale * z) def arctan_clamp_gradient(z: np.ndarray, scale: float = ARCTAN_SCALE) -> np.ndarray: """Gradient d/dz(arctan clamp) = OUTPUT_SCALE * scale / (1 + (scale*z)^2). Always positive and bounded by OUTPUT_SCALE * scale. """ return OUTPUT_SCALE * scale / (1.0 + (scale * z)**2) X_raw, y_true = make_regression(n_samples=500, n_features=8, noise=10.0, random_state=42)
scaler = StandardScaler()
X = scaler.fit_transform(X_raw)
y_bounded = np.clip(y_true / y_true.std() * 20 + 50, 5, 95) # true scores in (5, 95) # Fit linear model on raw features
model = Ridge(alpha=1.0)
model.fit(X, y_bounded)
z_pred = model.predict(X) # Apply arctan clamping
y_clamped = arctan_clamp(z_pred)
grad = arctan_clamp_gradient(z_pred) print("arctan Soft Clamping: d/dz(arctan_clamp(z)) = C * scale / (1 + (scale*z)^2)")
print(f"\nRaw linear predictions: mean={z_pred.mean():.2f}, range=[{z_pred.min():.2f}, {z_pred.max():.2f}]")
print(f"Clamped predictions: mean={y_clamped.mean():.2f}, range=[{y_clamped.min():.2f}, {y_clamped.max():.2f}]")
print(f"Target range: ({OUTPUT_MIN}, {OUTPUT_MAX})")
print(f"\nGradient stats: mean={grad.mean():.4f}, max={grad.max():.4f}, min={grad.min():.4f}")
print(f"Max gradient (at z=0): OUTPUT_SCALE * scale = {OUTPUT_SCALE * ARCTAN_SCALE:.4f}")
print(f"\nKey: gradient is always positive and bounded — no gradient explosion.")
print(f"Gradient decays for large |z|: at z=+/-10, grad = {arctan_clamp_gradient(np.array([10.0]))[0]:.6f}")
print(f"Compare: at z=0, grad = {arctan_clamp_gradient(np.array([0.0]))[0]:.6f}")
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