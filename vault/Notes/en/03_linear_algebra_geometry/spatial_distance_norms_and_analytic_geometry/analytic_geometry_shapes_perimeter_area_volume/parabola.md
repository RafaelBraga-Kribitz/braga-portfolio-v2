---
title: Parabola
date: '2026-04-16'
wordCount: 835
slug: parabola
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/analytic_geometry_shapes_perimeter_area_volume/parabola/index.html
share_status: draft
publish_target: note
boundary: public
---
# $y^2 = 2px$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A parabola is a conic section that is the set of all points equidistant from a fixed point (focus) and a fixed line (directrix). The standard form $y^2 = 2px$ opens right (for $p>0$) with vertex at the origin, focus at $(\frac{p}{2}, 0)$, and directrix $x = -\frac{p}{2}$. The more common form in DA/DS is $y = ax^2 + bx + c$ (vertical parabola), which is the shape of every quadratic function. In DA/DS: parabolas are the loss surface of univariate OLS ($L(\beta) = \|y - X\beta\|^2$ is a paraboloid), the shape of squared-error optimization, quadratic feature interactions in regression, and quadratic decision boundaries. Every second-order Taylor expansion locally looks like a paraboloid.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Parabola: y^2 = 2px (horizontal opening)"] A --> B["Vertex: origin (0, 0)"] A --> C["Focus: (p/2, 0)"] A --> D["Directrix: x = -p/2"] A --> E["Any point P on parabola: |PF| = |P to directrix|"] A --> F["Vertical form: y = ax^2 + bx + c"] F --> G["DA/DS: quadratic loss surface, Taylor approx, OLS"] F --> H["Vertex (min/max): x* = -b/(2a), y* = c - b^2/(4a)"]
```
### Real-World use:
#### Situation it is used
The squared error loss $L(\beta) = (y - \hat{y})^2$ is a parabola in $\hat{y}$ (and a paraboloid in $\beta$), the bias-variance trade-off curve has a parabolic shape as a function of model complexity, quadratic regression ($y = \beta_0 + \beta_1 x + \beta_2 x^2$) models curvilinear effects, and the optimal hyperparameter value in many simple grid searches lies at the bottom of a parabolic validation error curve.
#### Problem it solves
When a relationship has a single turning point (minimum or maximum) and is well-approximated by a quadratic, the parabola provides the exact analytic shape. Finding the vertex of the parabola gives the optimal value directly: $x^* = -b/(2a)$, without iterative optimization.
#### How it solves the problem
For $y = ax^2 + bx + c$: completing the square gives $y = a(x + \frac{b}{2a})^2 + (c - \frac{b^2}{4a})$. The vertex is at $x^* = -b/(2a)$, minimum value $y^* = c - b^2/(4a)$ (when $a > 0$). This is exactly what gradient descent converges to in one step (closed form) for a quadratic loss.
#### Example of it used in the Working Context as DA/DS for a Business
A DS fits a simple polynomial regression: $\text{conversion rate} = a \cdot \text{price}^2 + b \cdot \text{price} + c$. The optimal price is at the vertex: $\text{price}^* = -b/(2a)$. This gives the price that maximizes conversion rate analytically, without requiring a grid search over price values.
### The Formula (Fragment-First)
- $y^2 = 2px$: horizontal parabola; opens right ($p>0$) or left ($p<0$)
- $p$: focal parameter — half the distance from focus to directrix
- Focus: $\left(\frac{p}{2}, 0\right)$; Directrix: $x = -\frac{p}{2}$
- Eccentricity: $e = 1$ (defining property of a parabola among conics)
- Equivalent horizontal form: $x^2 = 2py$ (vertical parabola opening up/down)
- Common DA/DS form: $y = ax^2 + bx + c$ (vertex at $x^* = -b/(2a)$, $y^* = c - b^2/(4a)$)
- Paraboloid (3D): $z = ax^2 + by^2$ — the shape of quadratic loss functions in 2D parameter space ### Formula-to-English Translation
"Every point on the parabola $y^2 = 2px$ is exactly equidistant from the focus $(\frac{p}{2},0)$ and the vertical line $x = -\frac{p}{2}$. In the common form $y = ax^2 + bx + c$: the curve is a U-shape (opening up if $a>0$), with a single minimum (or maximum) at $x = -b/(2a)$." Tiny example: $p=2$, so $y^2 = 4x$. Focus at $(1,0)$.
Check point $(1, 2)$: $4 = 4(1) = 4$. $\checkmark$
Distance to focus: $\sqrt{(1-1)^2+(2-0)^2} = 2$.
Distance to directrix $x=-1$: $|1-(-1)| = 2$. Equal. $\checkmark$ ### Critical Concepts
- **Universal quadratic:** every quadratic function is a parabola. Its vertex is the unique optimal point.
- **Second-order Taylor expansion:** near any smooth optimum, a function locally looks like a paraboloid. Newton's method finds the vertex in one step.
- **OLS loss is a paraboloid:** $L(\beta) = \|y - X\beta\|^2$ is a convex paraboloid in $\beta$. The minimum is the OLS solution $\hat{\beta} = (X^TX)^{-1}X^Ty$.
- **Bias-variance trade-off curve:** validation error vs. model complexity often has a parabolic shape (U-shaped), with the optimal complexity at the vertex.
- **Discriminant:** for $y = ax^2 + bx + c$, the discriminant $\Delta = b^2 - 4ac$ determines the number of real roots (where the parabola crosses the $x$-axis).
- **Reflector property:** parabolas focus parallel rays to the focus — used in satellite dishes, reflecting telescopes, and headlights.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Find vertex and optimal point for quadratic*
Revenue model: $R = -2x^2 + 40x + 100$ where $x$ is ad spend (in thousands).
$a = -2$, $b = 40$, $c = 100$. *Step 2: Find optimal ad spend (vertex)*
$x^* = -b/(2a) = -40/(2\cdot(-2)) = 10$. Optimal spend = $10k.
$R^* = -2(100) + 40(10) + 100 = -200 + 400 + 100 = 300$. *Step 3: Verify it is a maximum (not minimum)*
$a = -2 < 0$: parabola opens downward, so vertex is a maximum. $\checkmark$
At $x=0$: $R=100$. At $x=10$: $R=300$. At $x=20$: $R=-2(400)+800+100=100$. Symmetric around $x^*=10$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def parabola_vertex(a: float, b: float, c: float) -> tuple[float, float]: """Compute vertex (x*, y*) of parabola y = ax^2 + bx + c.""" x_star = -b / (2 * a) y_star = c - b**2 / (4 * a) return x_star, y_star # Ad spend optimization: Revenue = -2x^2 + 40x + 100
a, b, c = -2.0, 40.0, 100.0
x_star, r_max = parabola_vertex(a, b, c) print(f"Revenue model: R = {a}x^2 + {b}x + {c}")
print(f"Optimal ad spend: x* = {x_star:.2f} (Revenue = {r_max:.2f})")
print(f"Opens {'downward (maximum)' if a < 0 else 'upward (minimum)'}") # Sample values
x_vals = np.arange(0, 21, 2)
print(f"\nAd spend (x) vs Revenue:")
for x_val in x_vals: r_val = a * x_val**2 + b * x_val + c marker = " <-- optimal" if x_val == x_star else "" print(f" x={x_val:>3}: R = {r_val:.1f}{marker}") # Standard form y^2 = 2px
p = 2.0
print(f"\nHorizontal parabola y^2 = {2*p}x:")
for y_val in [0, 1, 2, 3, 4]: x_val = y_val**2 / (2 * p) check = y_val**2 - 2*p*x_val print(f" y={y_val}: x={x_val:.2f}, check = {check:.6f}")
```
#### Beginner friendly Example [R])
``` r
# -- Parabola: vertex and quadratic optimization ---
a <- -2; b <- 40; c <- 100 x_star <- -b / (2 * a)
y_star <- c - b^2 / (4 * a) cat(sprintf("Parabola: y = %gx^2 + %gx + %g\n", a, b, c))
cat(sprintf("Vertex (x*, y*) = (%.2f, %.2f)\n", x_star, y_star))
cat(sprintf("Opens %s\n", ifelse(a < 0, "downward (maximum)", "upward (minimum)"))) # Sample
x_vals <- seq(0, 20, by=2)
y_vals <- a * x_vals^2 + b * x_vals + c
cat("\nx | Revenue\n")
for (i in seq_along(x_vals)) { cat(sprintf("%2d | %.1f%s\n", x_vals[i], y_vals[i], ifelse(x_vals[i] == x_star, " <-- optimal", "")))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline np.random.seed(42) # -- Business scenario: quadratic regression to find optimal price ---
# Simulate conversion rate data with a true quadratic relationship. TRUE_A = -0.002
TRUE_B = 0.4
TRUE_C = 10.0
NOISE_STD = 1.5 prices = np.random.uniform(10, 200, 80)
conv_rate = TRUE_A * prices**2 + TRUE_B * prices + TRUE_C + np.random.normal(0, NOISE_STD, 80) # Fit quadratic regression via sklearn pipeline
poly_pipe = Pipeline([ ("poly", PolynomialFeatures(degree=2, include_bias=False)), ("linear", LinearRegression()),
])
poly_pipe.fit(prices.reshape(-1, 1), conv_rate) coefs = poly_pipe.named_steps["linear"].coef_ # [b1, b2] for x, x^2 terms
intercept = poly_pipe.named_steps["linear"].intercept_
a_hat, b_hat, c_hat = coefs[1], coefs[0], intercept # quadratic, linear, constant # Optimal price from vertex formula
x_optimal = -b_hat / (2 * a_hat)
y_optimal = c_hat - b_hat**2 / (4 * a_hat) print("Quadratic regression: conversion_rate = a*price^2 + b*price + c")
print(f" True : a={TRUE_A:.4f}, b={TRUE_B:.4f}, c={TRUE_C:.4f}")
print(f" Fitted: a={a_hat:.4f}, b={b_hat:.4f}, c={c_hat:.4f}")
print(f"\nOptimal price (vertex of parabola):")
print(f" x* = -b/(2a) = {x_optimal:.2f} (true = {-TRUE_B/(2*TRUE_A):.2f})")
print(f" y* = predicted max conversion rate = {y_optimal:.2f}") # Sample predicted curve around optimal
test_prices = np.arange(80, 131, 10).reshape(-1, 1)
pred = poly_pipe.predict(test_prices)
results = pd.DataFrame({ "price": test_prices.flatten(), "pred_conv_rate": pred.round(2),
})
print(f"\nPredicted conversion rates around optimal:")
print(results.to_string(index=False))
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
1300 pag 166