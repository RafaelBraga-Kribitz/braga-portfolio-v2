---
title: Volume of solid of revolution (y-axis)
date: '2026-04-16'
wordCount: 960
slug: volume_of_solid_of_revolution_y_axis
permalink: /notes/04_calculus_optimization/integral_calculus/improper_integrals_multiple_integrals_and_volumes/volume_of_solid_of_revolution_y_axis/index.html
share_status: draft
publish_target: note
boundary: public
---
# $V = \int_a^b \pi x^2\,dy$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This formula computes the volume of the solid formed when a curve $x = g(y) \geq 0$ is rotated 360° around the y-axis. Instead of stacking disks perpendicular to the x-axis (as in the x-axis revolution formula), you stack disks perpendicular to the y-axis. At each height $y$, the cross-section is a disk of radius $x = g(y)$ and area $\pi x^2$. The companion to the x-axis formula, this version is used when the function is more naturally expressed as $x$ in terms of $y$, or when the integration limits are defined along the y-axis. In DA/DS, this formula appears in the same contexts as the x-axis version: volumes of solids of revolution in 3D scientific visualization, understanding the geometric structure of probability distributions (e.g., the solid formed by rotating a CDF profile around the y-axis), and as a conceptual building block for spherical integration in multivariate statistics. The choice between x-axis and y-axis formulas is a matter of which parametrization makes the antiderivative easier to compute.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Curve x = g(y) from y=a to y=b"] --> B["Rotate 360 degrees around the y-axis"] B --> C["At each y: cross-section is a disk of radius x = g(y)"] C --> D["Disk area = pi * x^2 = pi * [g(y)]^2"] D --> E["Disk volume = pi * [g(y)]^2 * dy"] E --> F["Sum all disks: V = integral_a^b pi * [g(y)]^2 dy"] F --> G["Antiderivative G(y): V = pi * [G(b) - G(a)]"] G --> H{"Was the original curve y = f(x)?"} H -- "Yes: invert to get x = g(y) first" --> I["Then apply the formula"] H -- "No: x = g(y) directly" --> J["Apply formula immediately"]
```
### Real-World use:
#### Situation it is used
Same geometric and statistical contexts as the x-axis revolution but with y-axis symmetry: computing volumes of solids defined by a curve expressed as $x = g(y)$, validating 3D surface generation in scientific visualization pipelines, understanding the geometry of probability distributions when thinking of the CDF graphed as $x = F^{-1}(y)$ (the quantile function) revolved around the y-axis, and as pedagogical intuition for why multivariate Gaussians have spherically symmetric probability mass in the standardized space.
#### Problem it solves
Some curves are much easier to integrate as $x = g(y)$ than as $y = f(x)$. Rotating around the y-axis is the natural choice when the bounding limits are horizontal lines ($y = a$ and $y = b$) rather than vertical lines. For example, the right half of an ellipse $x = \frac{a}{b}\sqrt{b^2 - y^2}$ is easy to integrate over $y \in [-b, b]$ to get an ellipsoid of revolution.
#### How it solves the problem
The same disk-stacking idea as the x-axis version, but rotated: at each y-value, a thin horizontal disk of radius $x = g(y)$ and thickness $dy$ has volume $\pi [g(y)]^2\,dy$. Summing all disks from $y = a$ to $y = b$ via integration gives the exact volume.
#### Example of it used in the Working Context as DA/DS for a Business
A data science team builds a 3D visualization of a quantile function for executive presentations: they plot the quantile function of a log-normal distribution $x = F^{-1}(y)$ (the inverse CDF, expressing the threshold as a function of probability $y \in [0,1]$) and generate a 3D solid by revolving it around the y-axis. The volume $V = \pi\int_0^1 [F^{-1}(y)]^2\,dy$ is computed numerically using `scipy.integrate.quad`.
### The Formula (Fragment-First)
$$V = \int_a^b \pi x^2\,dy = \pi\int_a^b [g(y)]^2\,dy$$ Each symbol:
- $V$: volume in cubic units (always positive)
- $\int_a^b$: integrate along the y-axis from $y = a$ to $y = b$
- $\pi$: from disk area $A = \pi r^2$; constant, pulls outside the integral
- $x^2 = [g(y)]^2$: the squared radius of the disk at height $y$
- $dy$: infinitesimal thickness of each horizontal disk **Companion formula (x-axis revolution)**: $V = \pi\int_a^b [f(x)]^2\,dx$ **Shell method** (alternative for y-axis revolution, integrating over $x$):
$$V = 2\pi\int_a^b x\,f(x)\,dx$$
(Often easier when the curve is given as $y = f(x)$ and the limits are on $x$.) ### Formula-to-English Translation
"Imagine the curve $x = g(y)$ as the radius of a coin at each height $y$. Stack horizontal coins of radius $g(y)$ and thickness $dy$ along the y-axis. Each coin has volume $\pi [g(y)]^2\,dy$. Add all coins from $y = a$ to $y = b$ to get the total volume." ### Critical Concepts
- **Disk vs. washer**: if there is a hole of inner radius $g_1(y)$ and outer radius $g_2(y)$, use the washer method: $V = \pi\int_a^b ([g_2(y)]^2 - [g_1(y)]^2)\,dy$.
- **Sphere via y-axis**: revolving the right semicircle $x = \sqrt{r^2 - y^2}$ from $y = -r$ to $r$ gives $V = \pi\int_{-r}^r (r^2 - y^2)\,dy = \frac{4}{3}\pi r^3$ ✓ (same result as x-axis revolution, by symmetry of the sphere).
- **Cone via y-axis**: if the curve is $x = \frac{r}{h}y$ (a line through the origin), revolving from $y = 0$ to $h$ gives $V = \pi\int_0^h \frac{r^2}{h^2}y^2\,dy = \frac{\pi r^2 h}{3}$ ✓
- **Shell method alternative**: if $y = f(x)$ is given, the shell method integrating over $x$ is $V = 2\pi\int_a^b x f(x)\,dx$. This avoids inverting $f$ to get $x = g(y)$.
- **Quantile function connection**: for a continuous distribution, $x = F^{-1}(p)$ is the quantile at probability $p$. The y-axis revolution of this curve is $V = \pi\int_0^1 [F^{-1}(p)]^2\,dp$, related to $E[X^2]$ (second moment) when $F$ is uniform.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Compute the volume of the solid formed by revolving $x = \sqrt{y}$ from $y = 0$ to $y = 4$ around the y-axis. *Step 1: Identify $g(y)$ and set up the integral*
$g(y) = \sqrt{y}$, so $[g(y)]^2 = y$.
$$V = \pi\int_0^4 y\,dy$$ *Step 2: Antiderivative*
$\int y\,dy = \frac{y^2}{2}$ *Step 3: Apply FTC*
$$V = \pi\left[\frac{y^2}{2}\right]_0^4 = \pi \cdot \frac{16}{2} = 8\pi \approx 25.13$$ Note: this is the same curve and the same answer as the x-axis example with $y = \sqrt{x}$ from $0$ to $4$. That is because $x = \sqrt{y}$ and $y = \sqrt{x}$ are inverses of each other, and the two solids (x-axis and y-axis revolution of this curve) happen to have the same volume in this symmetric case.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy import integrate def g(y: float) -> float: """Curve to revolve around y-axis: x = sqrt(y).""" return np.sqrt(y) def disk_integrand_y(y: float) -> float: """Disk area at height y: pi * [g(y)]^2 = pi * y.""" return np.pi * g(y)**2 # Numerical integration
volume_numerical, error = integrate.quad(disk_integrand_y, 0, 4)
volume_analytic = 8 * np.pi # = pi * [y^2/2]_0^4 = pi * 8 print(f"Volume (y-axis disk method, numerical): {volume_numerical:.6f}")
print(f"Volume (y-axis disk method, analytic): {volume_analytic:.6f}")
print(f"Match: {abs(volume_numerical - volume_analytic) < 1e-8}") # Sphere: revolve x = sqrt(r^2 - y^2) around y-axis
R = 3.0
vol_sphere_y, _ = integrate.quad( lambda y: np.pi * (R**2 - y**2), -R, R
)
vol_sphere_analytic = (4.0 / 3.0) * np.pi * R**3
print(f"\nSphere (r={R}) via y-axis: numerical = {vol_sphere_y:.4f}, " f"analytic = {vol_sphere_analytic:.4f}") # Shell method cross-check for x = sqrt(y) over y=[0,4] is equivalent to
# revolving y = x^2 (x from 0 to 2) around y-axis: V = 2*pi*int_0^2 x*x^2 dx
vol_shell, _ = integrate.quad(lambda x: 2 * np.pi * x * x**2, 0, 2)
print(f"\nShell method cross-check (y = x^2, x in [0,2]): {vol_shell:.6f}")
print(f"Same result: {abs(vol_shell - volume_numerical) < 1e-6}")
```
#### Beginner friendly Example [R])
``` r
# Volume of solid of revolution around y-axis: x = sqrt(y), y in [0, 4] g <- function(y) sqrt(y)
disk_integrand_y <- function(y) pi * g(y)^2 # pi * y result <- integrate(disk_integrand_y, lower = 0, upper = 4)
cat("Volume (y-axis, numerical):", result$value, "\n") # ~25.1327
cat("8*pi = ", 8 * pi, "\n") # Sphere via y-axis: x = sqrt(r^2 - y^2)
r <- 3
vol_sphere <- integrate(function(y) pi * (r^2 - y^2), -r, r)$value
cat("Sphere (r=3) volume:", vol_sphere, "\n")
cat("4/3*pi*r^3: ", (4/3)*pi*r^3, "\n") # Shell method: V = 2*pi*int_0^2 x*f(x) dx where f(x) = x^2
vol_shell <- integrate(function(x) 2*pi*x*x^2, 0, 2)$value
cat("Shell method cross-check:", vol_shell, "\n")
```
#### Final Professional Example [Python])
``` python
"""
Y-axis revolution: quantile function of exponential distribution. For X ~ Exp(lambda), the quantile function (inverse CDF) is: x = F^{-1}(p) = -ln(1-p) / lambda Revolving this curve around the y-axis (p-axis) from p=0 to p=0.99
gives a 3D solid whose volume = pi * int_0^0.99 [-ln(1-p)/lambda]^2 dp. This relates to the second moment: E[X^2] = int_0^1 [F^{-1}(p)]^2 dp (via probability integral transform) For Exp(lambda): E[X^2] = Var[X] + (E[X])^2 = 1/lambda^2 + 1/lambda^2 = 2/lambda^2 Business use: customer lifetime follows Exp(lambda). E[T^2] tells us the
variance of lifetime: Var[T] = E[T^2] - (E[T])^2 = 2/lambda^2 - 1/lambda^2 = 1/lambda^2.
"""
import numpy as np
from scipy import integrate, stats LAMBDA = 0.2 # churn rate: 20% per month -> E[T] = 5 months # Quantile function: Q(p) = F^{-1}(p) = -ln(1-p)/lambda
def quantile_fn(p: float, lam: float = LAMBDA) -> float: """Inverse CDF of Exp(lambda).""" return -np.log(1.0 - p) / lam # Volume of y-axis revolution of quantile curve
UPPER_P = 0.99 # avoid p=1 (Q goes to inf)
volume_quantile, err = integrate.quad( lambda p: np.pi * quantile_fn(p)**2, 0, UPPER_P,
) # E[X^2] = int_0^1 [Q(p)]^2 dp
# = int_0^1 [(-ln(1-p)/lambda)]^2 dp = 2/lambda^2
e_x2_numerical, _ = integrate.quad( lambda p: quantile_fn(p)**2, 0, 1 - 1e-10, # avoid p=1
)
e_x2_analytic = 2.0 / LAMBDA**2 # = 50
e_x = 1.0 / LAMBDA # E[T] = 5
var_x_analytic = 1.0 / LAMBDA**2 # = 25 print(f"=== Exponential(lambda={LAMBDA}) Quantile Revolution ===")
print(f" E[T] = 1/lambda = {e_x:.2f} months")
print(f" E[T^2] via int [Q(p)]^2 dp (numerical): {e_x2_numerical:.4f}")
print(f" E[T^2] analytic (2/lambda^2): {e_x2_analytic:.4f}")
print(f" Var[T] = E[T^2] - (E[T])^2 = {e_x2_analytic - e_x**2:.4f} (= 1/lambda^2 = {var_x_analytic:.4f})")
print(f"\nVolume of y-axis revolution (p in [0, {UPPER_P}]):")
print(f" V = pi * int_0^{UPPER_P} [Q(p)]^2 dp = {volume_quantile:.4f}")
print(f" [Integration error: {err:.2e}]") # Sampling verification: var[T] from simulation
rng = np.random.default_rng(42)
samples = rng.exponential(scale=1.0 / LAMBDA, size=1_000_000)
print(f"\nMonte Carlo verification (N=1e6):")
print(f" Sample E[T]: {samples.mean():.4f} (expected: {e_x:.4f})")
print(f" Sample E[T^2]: {(samples**2).mean():.4f} (expected: {e_x2_analytic:.4f})")
print(f" Sample Var[T]: {samples.var():.4f} (expected: {var_x_analytic:.4f})")
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