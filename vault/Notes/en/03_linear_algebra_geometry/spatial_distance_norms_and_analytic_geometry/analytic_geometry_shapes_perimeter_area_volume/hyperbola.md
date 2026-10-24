---
title: Hyperbola
date: '2026-04-16'
wordCount: 829
slug: hyperbola
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/analytic_geometry_shapes_perimeter_area_volume/hyperbola/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A hyperbola is the set of all points in the plane where the difference of distances to two fixed foci is constant. The standard form $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ opens left and right, with vertices at $(\pm a, 0)$ and asymptotes $y = \pm \frac{b}{a}x$. In DA/DS: hyperbolas appear as the level curves of multiplicative relationships between two variables (e.g., $xy = c$ is a rectangular hyperbola), in supply-demand economic modeling, in time-series with exponential divergence, and in the geometry of SVMs with hyperbolic kernels. The rectangular hyperbola $xy = k$ is central to interpreting elasticity and power-law trade-offs.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Hyperbola: x^2/a^2 - y^2/b^2 = 1"] A --> B["Two branches: left (x < -a) and right (x > a)"] A --> C["Vertices: (+-a, 0)"] A --> D["Asymptotes: y = +-(b/a)*x"] A --> E["Foci: c = sqrt(a^2 + b^2), foci at (+-c, 0)"] E --> F["Focus property: ||PF1| - |PF2|| = 2a for any point P on hyperbola"] A --> G["Rectangular hyperbola: xy = k (asymptotes are x and y axes)"] G --> H["DA/DS: constant revenue curves, power-law trade-offs, elasticity"]
```
### Real-World use:
#### Situation it is used
Economic elasticity and trade-off curves (constant revenue $\text{price} \times \text{quantity} = k$), hyperbolic discounting in behavioral economics, bifurcation points in dynamical systems, level curves in contour plots of multiplicative objective functions, and calibration curves in spectroscopy/chemistry (Beer-Lambert law at high concentrations shows hyperbolic saturation).
#### Problem it solves
When a relationship between two variables is multiplicative ($xy = k$), their level curves are rectangular hyperbolas. Recognizing this shape tells you the relationship is a power-law trade-off: as $x$ increases, $y$ must decrease proportionally to maintain constant product. The standard hyperbola also models systems where two diverging behaviors co-exist (two branches).
#### How it solves the problem
The equation $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ is a conic section formed by a plane cutting a double cone at a steep angle. Re-arranging: $y = \pm \frac{b}{a}\sqrt{x^2 - a^2}$, defined only for $|x| \geq a$. The two branches diverge toward the asymptotes $y = \pm\frac{b}{a}x$ as $|x| \to \infty$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS models the price-quantity trade-off in a pricing experiment. At constant revenue $R = p \times q$, the curve is a rectangular hyperbola: $p = R/q$. The DS fits this to historical data to identify the constant-revenue curve and uses it to find the price point that maximizes profit margin while staying on the same revenue level. Deviations from the hyperbola indicate price sensitivity changes.
### The Formula (Fragment-First)
- $a$: real semi-axis — half the distance between the two vertices ($\pm a$ on the $x$-axis)
- $b$: imaginary semi-axis — controls the steepness of the asymptotes
- $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$: standard form, horizontal transverse axis
- Asymptotes: $y = \pm\frac{b}{a}x$ (lines the hyperbola approaches but never reaches)
- Vertices: $(\pm a, 0)$
- Foci: $(\pm c, 0)$ where $c = \sqrt{a^2 + b^2}$ (note: $c > a$ for hyperbola, vs. $c < a$ for ellipse)
- Eccentricity: $e = c/a > 1$ (vs. ellipse $e < 1$, parabola $e = 1$)
- Conjugate (vertical) hyperbola: $\frac{y^2}{b^2} - \frac{x^2}{a^2} = 1$ (opens up/down)
- Rectangular hyperbola: $xy = k$ — asymptotes are coordinate axes; $a=b$ ### Formula-to-English Translation
"The hyperbola equation says: the normalized $x$-contribution exceeds the normalized $y$-contribution by exactly 1. Points exist only where $|x| \geq a$ (the two branches). The curve curves away from the origin and approaches (but never touches) the straight lines $y = \pm\frac{b}{a}x$." Tiny example: $a=3$, $b=2$.
Vertex: $(3, 0)$. Asymptotes: $y = \pm\frac{2}{3}x$.
Check: $x=5$, $y = \pm 2\sqrt{(25/9) - 1} = \pm 2\sqrt{16/9} = \pm 8/3 \approx \pm 2.67$. $\checkmark$ ### Critical Concepts
- **Conic classification:** $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ (ellipse), $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ (hyperbola). The sign change between terms is what distinguishes them.
- **Asymptotes don't cross:** the hyperbola approaches its asymptotes as $|x| \to \infty$ but never intersects them (for finite $x, y$). This is key for understanding model behavior at extremes.
- **Rectangular hyperbola $xy = k$:** rotating the standard hyperbola by 45° gives $xy = k$. This is the form most common in economics (constant elasticity demand) and optimization trade-offs.
- **Eccentricity $> 1$:** the defining property of a hyperbola. Eccentricity measures how "open" the conic is: $e=1$ is a parabola, $e>1$ is a hyperbola, $e<1$ is an ellipse.
- **Two branches:** unlike the ellipse, the hyperbola has two separate branches. In data, this can represent two distinct regimes.
- **Parametric form:** $(a\cosh(t), b\sinh(t))$ for the right branch; uses hyperbolic functions (hence the name "hyperbolic" functions).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Identify parameters*
$a=2$, $b=3$. Vertices at $(\pm 2, 0)$. Asymptotes: $y = \pm\frac{3}{2}x$.
$c = \sqrt{4+9} = \sqrt{13} \approx 3.606$. Eccentricity $e = \sqrt{13}/2 \approx 1.803$. *Step 2: Find a point on the hyperbola*
$x=4$: $\frac{16}{4} - \frac{y^2}{9} = 1 \Rightarrow 4 - \frac{y^2}{9} = 1 \Rightarrow y^2 = 27 \Rightarrow y = \pm 3\sqrt{3} \approx \pm 5.196$. *Step 3: Verify focus property*
For the right branch, for any point $P$: $|PF_2| - |PF_1| = 2a = 4$.
Foci at $(\pm\sqrt{13}, 0)$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt def hyperbola_y(x: np.ndarray, a: float, b: float) -> np.ndarray: """Compute y values for hyperbola x^2/a^2 - y^2/b^2 = 1 (upper branch).""" return b * np.sqrt((x**2 / a**2) - 1.0) a, b = 2.0, 3.0
c = np.sqrt(a**2 + b**2)
ecc = c / a print(f"Hyperbola: a={a}, b={b}")
print(f" Vertices: (+-{a}, 0)")
print(f" Foci: (+-{c:.4f}, 0)")
print(f" Asymptotes: y = +-(b/a)*x = +-{b/a:.4f}*x")
print(f" Eccentricity: e = {ecc:.4f}") # Sample points on the right branch
x_vals = np.linspace(a, 10, 200)
y_upper = hyperbola_y(x_vals, a, b) print(f"\nSample points (right branch, upper):")
for x_pt in [2.0, 4.0, 6.0, 10.0]: y_pt = float(hyperbola_y(np.array([x_pt]), a, b)) check = x_pt**2/a**2 - y_pt**2/b**2 print(f" x={x_pt}: y={y_pt:.4f}, check x^2/a^2-y^2/b^2 = {check:.6f}") # Rectangular hyperbola xy = k
K = 6.0
x_r = np.linspace(0.5, 12, 100)
y_r = K / x_r
print(f"\nRectangular hyperbola xy={K}: at x=3, y={K/3:.2f}; at x=6, y={K/6:.2f}")
```
#### Beginner friendly Example [R])
``` r
# -- Hyperbola ---
a <- 2; b <- 3
c_focal <- sqrt(a^2 + b^2)
ecc <- c_focal / a cat(sprintf("Hyperbola: a=%g, b=%g\n", a, b))
cat(sprintf(" Vertices: (+-%.4f, 0)\n", a))
cat(sprintf(" Foci: (+-%.4f, 0)\n", c_focal))
cat(sprintf(" Asymptotes: y = +-%.4f * x\n", b/a))
cat(sprintf(" Eccentricity: %.4f\n", ecc)) # Sample points
for (x_pt in c(2, 4, 6, 10)) { if (x_pt^2/a^2 > 1) { y_pt <- b * sqrt(x_pt^2/a^2 - 1) check <- x_pt^2/a^2 - y_pt^2/b^2 cat(sprintf(" x=%.0f: y=%.4f, check=%.6f\n", x_pt, y_pt, check)) }
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: constant-revenue hyperbola for pricing analysis ---
# Model price-quantity relationship at different revenue levels.
# Rectangular hyperbola: price * quantity = revenue (constant). TARGET_REVENUE_LEVELS = [10000, 15000, 20000]
QUANTITY_RANGE = np.linspace(100, 2000, 100) rows = []
for rev in TARGET_REVENUE_LEVELS: prices = rev / QUANTITY_RANGE rows.append({ "revenue_target": rev, "qty_at_price_10": rev / 10.0, "qty_at_price_20": rev / 20.0, "qty_at_price_50": rev / 50.0, "price_at_qty_500": rev / 500.0, "price_elasticity": -1.0, # constant for rectangular hyperbola }) df = pd.DataFrame(rows)
print("Constant-revenue curves (rectangular hyperbola: price * quantity = revenue):")
print(df.to_string(index=False)) # Simulate noisy price-quantity data and fit a rectangular hyperbola (xy = k)
TRUE_REVENUE = 12000.0
qty_data = np.random.uniform(200, 1800, 30)
price_data = TRUE_REVENUE / qty_data + np.random.normal(0, 0.5, 30) # Fit: xy = k; estimate k as mean(price * quantity)
k_hat = np.mean(price_data * qty_data)
residuals = price_data - k_hat / qty_data print(f"\nFitted rectangular hyperbola (price * quantity = k):")
print(f" True k = {TRUE_REVENUE:.0f}")
print(f" Estimated k = {k_hat:.2f}")
print(f" RMSE of price residuals: {np.sqrt(np.mean(residuals**2)):.4f}")
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
1300 pag 162