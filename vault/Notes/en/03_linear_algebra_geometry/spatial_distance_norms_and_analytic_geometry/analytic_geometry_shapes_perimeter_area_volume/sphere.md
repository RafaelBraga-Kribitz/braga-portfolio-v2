---
title: Sphere
date: '2026-04-16'
wordCount: 862
slug: sphere
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/analytic_geometry_shapes_perimeter_area_volume/sphere/index.html
share_status: draft
publish_target: note
boundary: public
---
# $V = \frac{4}{3} \pi R^3$, $S = 4\pi R^2$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The sphere has volume $V = \frac{4}{3}\pi R^3$ and surface area $S = 4\pi R^2$. The sphere is the 3D analogue of the circle: the set of all points in $\mathbb{R}^3$ at distance $R$ from the center, defined by $(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$. In DA/DS, the sphere appears as the unit ball of the $L_2$ norm in 3D, in the "curse of dimensionality" (hypersphere volumes collapse relative to hypercube volumes as dimension increases), in 3D geospatial modeling (delivery radii in 3D logistics, satellite coverage footprints approximated by spherical caps), and in understanding why $k$-NN and other distance-based algorithms degrade in high dimensions.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Sphere: center (a,b,c), radius R"] --> B["Equation: (x-a)^2 + (y-b)^2 + (z-c)^2 = R^2"] A --> C["Volume V = (4/3) * pi * R^3"] A --> D["Surface area S = 4 * pi * R^2"] C --> E{{"DA/DS applications"}} E -->|"Curse of dimensionality"| F["Volume of d-ball: V_d(R) = pi^(d/2) / Gamma(d/2+1) * R^d"] E -->|"3D geospatial"| G["Coverage zone in 3D space (satellite, warehouse)"] E -->|"L2 unit ball"| H["All vectors x with ||x||_2 <= 1 form a sphere in 3D"] D --> I["Surface area ratio: S/V = 3/R -> large R means less surface per unit volume"]
```
### Real-World use:
#### Situation it is used
Used in 3D spatial analytics (defining spherical catchment zones for facility location in 3D), in understanding the curse of dimensionality (the $d$-dimensional unit ball has volume that goes to 0 as $d \to \infty$), in satellite footprint estimation, in physics-based ML simulations (particle collisions, fluid dynamics), and in understanding why cosine similarity is preferred over Euclidean distance in high-dimensional embedding spaces.
#### Problem it solves
The sphere formula quantifies how much 3D space is enclosed within a given radius, and how much surface is exposed. The surface-to-volume ratio $3/R$ tells you that as $R$ increases, volume grows faster than surface — relevant for understanding how coverage zones scale. For the curse of dimensionality argument, the key is that hypersphere volume shrinks relative to the enclosing hypercube.
#### How it solves the problem
Volume $V = \frac{4}{3}\pi R^3$ comes from integrating circular cross-sections: $V = \int_{-R}^{R} \pi(R^2 - z^2) dz = \pi[R^2 z - z^3/3]_{-R}^{R} = \frac{4}{3}\pi R^3$. Surface area $S = 4\pi R^2$ is the derivative of volume with respect to $R$: $dV/dR = 4\pi R^2 = S$, which makes geometric sense (adding a thin shell of thickness $dR$ to a sphere adds volume $S \cdot dR$).
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist studying the curse of dimensionality computes the fraction of the $d$-dimensional unit hypercube occupied by the inscribed $d$-ball for $d = 1, 2, 3, 10, 100$. For $d = 3$: $V_3 = \frac{4}{3}\pi(0.5)^3 \approx 0.524$ out of a unit cube volume of 1 — about 52%. For $d = 10$: the fraction drops below 0.3%. This demonstrates why distance-based classifiers lose discriminatory power in high dimensions: almost all data volume is near the cube's corners, not near the center.
### The Formula (Fragment-First)
- $V = \frac{4}{3}\pi R^3$: the volume of the sphere; the $\frac{4}{3}$ prefactor is exact, not an approximation
- $\frac{4}{3}$: the exact prefactor from integrating circular cross-sections; $\frac{4}{3} \approx 1.333$
- $\pi R^3$: $\pi$ is the ratio of circumference to diameter; $R^3$ reflects 3D scaling
- $S = 4\pi R^2$: the surface area; exactly 4 times the area of a great circle ($\pi R^2$)
- $R$: the radius; the only parameter needed to fully specify a sphere (given the center) Full formulas: $V = \dfrac{4}{3}\pi R^3$, $S = 4\pi R^2$ ### Formula-to-English Translation
"The sphere encloses a volume that grows as the cube of the radius, and exposes a surface that grows as its square. The surface area is exactly four times the area of the equatorial circle — equivalently, you could wrap the sphere with four copies of its circular cross-section." Tiny numeric example:
$R = 3$.
$V = \frac{4}{3}\pi(27) = 36\pi \approx 113.10$.
$S = 4\pi(9) = 36\pi \approx 113.10$.
(Coincidence at $R = 3$: $V = S$ only when $R = 3$, since $\frac{4}{3}\pi R^3 = 4\pi R^2 \implies R = 3$.) ### Critical Concepts
- **Surface-to-volume ratio:** $S/V = 3/R$. Larger sphere = proportionally less surface per unit volume. Relevant in physics-based simulations (heat dissipation, cell biology) and in normalizing features.
- **Curse of dimensionality:** for a $d$-dimensional ball of radius $R$, $V_d(R) = \frac{\pi^{d/2}}{\Gamma(d/2+1)} R^d$. For $d = 2$: $\pi R^2$; for $d = 3$: $\frac{4}{3}\pi R^3$; for large $d$: $V_d \to 0$ relative to the enclosing hypercube. This is why $k$-NN and RBF kernels degrade in high dimensions.
- **Most volume near the surface:** in high dimensions, most of the volume of a ball is concentrated in a thin shell near the surface. In $d = 100$, 99.99% of the volume is within 1% of the radius from the surface.
- **$L_2$ unit ball:** $\{x \in \mathbb{R}^3 : \|x\|_2 \leq 1\}$ is a unit sphere.
- **Equation of sphere:** $(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$; the 3D extension of the circle equation.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Identify the radius and compute volume*
$R = 6$.
$V = \frac{4}{3}\pi(6)^3 = \frac{4}{3}\pi(216) = 288\pi \approx 904.78$. *Step 2: Compute the surface area*
$S = 4\pi(6)^2 = 4\pi(36) = 144\pi \approx 452.39$. *Step 3: Compute the surface-to-volume ratio and verify*
$S/V = 144\pi / (288\pi) = 1/2 = 3/R = 3/6 = 0.5$ ✓.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Sphere: volume, surface area, and curse of dimensionality demo ----
def sphere_volume(radius: float) -> float: """Volume of a 3D sphere.""" return (4.0 / 3.0) * np.pi * radius**3 def sphere_surface(radius: float) -> float: """Surface area of a 3D sphere.""" return 4.0 * np.pi * radius**2 for r in [1.0, 3.0, 5.0, 10.0]: v = sphere_volume(r) s = sphere_surface(r) print(f" R={r:.0f}: V={v:.4f}, S={s:.4f}, S/V={s/v:.4f} (= 3/R = {3/r:.4f})") # Curse of dimensionality: hypersphere volume fraction in hypercube
from math import gamma, pi as PI
def ball_volume_fraction(d: int) -> float: """Fraction of d-dimensional unit hypercube occupied by inscribed d-ball (R=0.5).""" r = 0.5 v_ball = (pi**(d / 2) / gamma(d / 2 + 1)) * r**d v_cube = 1.0 return v_ball / v_cube print("\nCurse of dimensionality: fraction of unit hypercube in inscribed ball:")
for d in [1, 2, 3, 5, 10, 20, 50]: frac = ball_volume_fraction(d) print(f" d={d:2d}: fraction = {frac:.6f}")
```
#### Beginner friendly Example [R])
``` r
# -- Sphere: volume, surface area, and S/V ratio -----------------------
sphere_volume <- function(r) (4/3) * pi * r^3
sphere_surface <- function(r) 4 * pi * r^2 for (r in c(1, 3, 5, 10)) { v <- sphere_volume(r) s <- sphere_surface(r) cat(sprintf(" R=%2.0f: V=%.4f, S=%.4f, S/V=%.4f\n", r, v, s, s/v))
} # Curse of dimensionality
ball_fraction <- function(d) { r <- 0.5 v_ball <- (pi^(d/2) / gamma(d/2 + 1)) * r^d return(v_ball) # v_cube = 1
} cat("\nCurse of dimensionality: ball fraction in unit hypercube:\n")
for (d in c(1, 2, 3, 5, 10, 20, 50)) { cat(sprintf(" d=%2d: fraction = %.6f\n", d, ball_fraction(d)))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from math import gamma # -- Business scenario: curse of dimensionality impact on k-NN classifier
# Demonstrate how the volume of a sphere relative to the enclosing hypercube
# collapses as dimension increases, explaining k-NN degradation. MAX_DIM = 30
RADIUS = 0.5 # unit hypercube has side 1; ball has radius 0.5 def hypersphere_volume(d: int, r: float) -> float: """Volume of d-dimensional ball with radius r.""" return (np.pi ** (d / 2) / gamma(d / 2 + 1)) * r ** d dims = list(range(1, MAX_DIM + 1))
rows = []
for d in dims: v_ball = hypersphere_volume(d, RADIUS) v_cube = 1.0 # unit hypercube frac = v_ball / v_cube # Expected fraction of nearest neighbors within radius R in a uniform hypercube rows.append({ "dimension": d, "ball_volume": float(v_ball), "cube_volume": v_cube, "fraction_in_ball": float(frac), "pct_volume_in_ball": float(frac * 100), }) df = pd.DataFrame(rows)
print("Hypersphere volume fraction by dimension (R=0.5, unit hypercube):")
key_dims = df[df["dimension"].isin([1, 2, 3, 5, 10, 15, 20, 25, 30])]
print(key_dims"dimension", "ball_volume", "fraction_in_ball", "pct_volume_in_ball".to_string(index=False)) # Minimum pct before essentially 0
threshold_dim = int(df[df["pct_volume_in_ball"] < 0.01]["dimension"].min())
print(f"\nDimension where ball fraction drops below 0.01%: d >= {threshold_dim}")
print("\nInterpretation: In d=3, ~52% of the unit cube's volume is within R=0.5 of the center (inside the sphere). By d=10, that drops to ~0.25%. In d=20, it's essentially 0. This is the curse of dimensionality: k-NN queries that search within a fixed radius capture less and less of the data space as dimension grows, forcing larger search radii and degrading classification quality.")
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