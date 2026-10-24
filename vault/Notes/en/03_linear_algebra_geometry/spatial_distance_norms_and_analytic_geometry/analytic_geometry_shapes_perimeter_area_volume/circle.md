---
title: Circle
date: '2026-04-16'
wordCount: 949
slug: circle
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/analytic_geometry_shapes_perimeter_area_volume/circle/index.html
share_status: draft
publish_target: note
boundary: public
---
# $(x-a)^2 + (y-b)^2 = R^2$, $A = \pi r^2$, $C = 2\pi r$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Three formulas define the circle in analytic geometry: the **equation** $(x-a)^2 + (y-b)^2 = R^2$ defines the set of all points at distance $R$ from center $(a, b)$; the **area** $A = \pi R^2$ gives the amount of 2D space enclosed; and the **circumference** $C = 2\pi R$ gives the boundary length. In DA/DS, circles appear as the geometric interpretation of the $L_2$ norm unit ball (the set of all 2D vectors with $\|x\|_2 = 1$ is the unit circle), as decision boundaries for simple radial classifiers (RBF kernels, KNN in 2D), in geographic analytics (radius of influence, service area radii), and in visualization (pie charts, polar coordinate plots, confidence region boundaries for 2D Gaussian distributions).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Circle: center (a, b), radius R"] --> B["Equation: all points x,y at distance R from center"] B --> C["(x-a)^2 + (y-b)^2 = R^2"] A --> D["Area (2D space enclosed): A = pi * R^2"] A --> E["Circumference (boundary length): C = 2 * pi * R"] C --> F{{"What can I ask?"}} F -->|"Is point (x,y) inside?"| G["(x-a)^2 + (y-b)^2 < R^2 -> inside"] F -->|"Is point (x,y) outside?"| H["(x-a)^2 + (y-b)^2 > R^2 -> outside"] F -->|"On boundary?"| I["(x-a)^2 + (y-b)^2 == R^2 -> on circle"] D --> J["DA/DS: confidence region area for 2D Gaussian (R = sigma)"] E --> K["DA/DS: geographic radius of service area"]
```
### Real-World use:
#### Situation it is used
Used in geospatial analytics (define a circular catchment area of radius $R$ around a store or facility), in visualizing 2D confidence regions for bivariate normal distributions (the 1-sigma ellipse reduces to a circle when the two features are uncorrelated and have equal variance), in RBF (radial basis function) kernel methods where the kernel value depends on $\|x - c\|_2^2$, and in anomaly detection where a circular boundary separates normal from anomalous data in 2D feature space.
#### Problem it solves
The circle equation gives an analytic definition of "within distance $R$ from a point," which is the spatial equivalent of the $L_2$ distance check $\|p - c\|_2 \leq R$. Instead of computing distances for every candidate point, you substitute into the equation and check the inequality. The area formula quantifies the coverage zone; the circumference quantifies the boundary length for routing or perimeter calculations.
#### How it solves the problem
$(x-a)^2 + (y-b)^2 = R^2$ is derived from the Pythagorean theorem: the horizontal distance from center is $(x-a)$, the vertical distance is $(y-b)$, and their combined Euclidean distance must equal $R$. The area $\pi R^2$ comes from integrating concentric rings $\int_0^R 2\pi r \, dr = \pi R^2$; the circumference $2\pi R$ is the arc length of the full rotation.
#### Example of it used in the Working Context as DA/DS for a Business
A retail analyst defines a 5-km circular trade area around each of 50 store locations. For each store at coordinates $(a_i, b_i)$, a customer at $(x, y)$ is in the trade area if $(x-a_i)^2 + (y-b_i)^2 \leq 5^2$. The analyst uses this to count customers per store, compute overlap between trade areas, and estimate total addressable market based on the circular coverage area $A = \pi(5)^2 \approx 78.5\ \text{km}^2$ per store.
### The Formula (Fragment-First)
- $(x-a)^2$: the squared horizontal displacement from the center's $x$-coordinate $a$
- $(y-b)^2$: the squared vertical displacement from the center's $y$-coordinate $b$
- $R^2$: the squared radius; using $R^2$ avoids a square root and keeps the equation algebraic
- $(a, b)$: the center of the circle; when $a = b = 0$, the circle is centered at the origin
- $A = \pi R^2$: area enclosed by the circle; grows quadratically with $R$
- $C = 2\pi R$: circumference (perimeter); grows linearly with $R$ Full formulas: $(x-a)^2 + (y-b)^2 = R^2$, $A = \pi R^2$, $C = 2\pi R$ ### Formula-to-English Translation
"A circle is the set of all points exactly $R$ units away from the center $(a, b)$. Any point satisfying the equation lies on the boundary; points with a smaller sum are inside; points with a larger sum are outside. The area inside grows as the square of the radius; the boundary length grows linearly." Tiny numeric example:
Center $(2, 3)$, radius $R = 5$.
Point $(6, 6)$: $(6-2)^2 + (6-3)^2 = 16 + 9 = 25 = 5^2$ — on the circle.
Point $(3, 4)$: $(3-2)^2 + (4-3)^2 = 1 + 1 = 2 < 25$ — inside.
$A = \pi(25) \approx 78.54$, $C = 10\pi \approx 31.42$.
### Critical Concepts
- **Center-radius form vs general form:** $(x-a)^2 + (y-b)^2 = R^2$ is the standard form. Expanding gives $x^2 + y^2 - 2ax - 2by + (a^2 + b^2 - R^2) = 0$, the general conic form. To go back, complete the square.
- **$L_2$ ball connection:** the unit circle is $\{x \in \mathbb{R}^2 : \|x\|_2 = 1\}$. Every norm defines a "unit ball"; only the $L_2$ norm gives a circle in 2D.
- **Inscribed vs circumscribed:** in spatial analytics, "within radius $R$" is $\leq R^2$, "outside" is $> R^2$.
- **Coordinate system:** all distances are in the same units as the coordinate axes. If $x, y$ are in kilometres, $R$ must be in kilometres.
- **3D analogue:** the sphere $(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$ with $V = \frac{4}{3}\pi R^3$.
- **Degenerate cases:** $R = 0$ gives a single point; $R < 0$ is undefined (no real solutions).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Identify center and radius, write the equation*
Circle with center $(1, -2)$, radius $R = 4$.
Equation: $(x-1)^2 + (y+2)^2 = 16$. *Step 2: Check whether specific points are inside, on, or outside*
Point $(1, 2)$: $(1-1)^2 + (2+2)^2 = 0 + 16 = 16$ — on the circle.
Point $(0, 0)$: $(0-1)^2 + (0+2)^2 = 1 + 4 = 5 < 16$ — inside.
Point $(5, 0)$: $(5-1)^2 + (0+2)^2 = 16 + 4 = 20 > 16$ — outside. *Step 3: Compute area and circumference*
$A = \pi(4)^2 = 16\pi \approx 50.27$.
$C = 2\pi(4) = 8\pi \approx 25.13$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
import matplotlib.pyplot as plt # -- Circle: equation, inside/outside check, area, circumference -------
CENTER_X, CENTER_Y, RADIUS = 2.0, 3.0, 5.0 def classify_point(px: float, py: float, cx: float, cy: float, r: float) -> str: """Classify a 2D point relative to a circle.""" dist_sq = (px - cx) ** 2 + (py - cy) ** 2 r_sq = r ** 2 if np.isclose(dist_sq, r_sq): return "on circle" elif dist_sq < r_sq: return "inside" else: return "outside" test_points = [(6.0, 6.0), (3.0, 4.0), (8.0, 8.0), (2.0, 3.0)]
for pt in test_points: status = classify_point(pt[0], pt[1], CENTER_X, CENTER_Y, RADIUS) dist_sq = (pt[0] - CENTER_X)**2 + (pt[1] - CENTER_Y)**2 print(f" Point {pt}: (x-a)^2 + (y-b)^2 = {dist_sq:.1f}, R^2 = {RADIUS**2:.1f} -> {status}") area = np.pi * RADIUS ** 2
circ = 2 * np.pi * RADIUS
print(f"\nArea (pi*R^2) = {area:.4f}")
print(f"Circumference (2*pi*R) = {circ:.4f}")
```
#### Beginner friendly Example [R])
``` r
# -- Circle: equation, inside/outside check, area, circumference -------
CENTER_X <- 2.0; CENTER_Y <- 3.0; RADIUS <- 5.0 classify_point <- function(px, py, cx, cy, r) { dist_sq <- (px - cx)^2 + (py - cy)^2 r_sq <- r^2 if (isTRUE(all.equal(dist_sq, r_sq))) "on circle" else if (dist_sq < r_sq) "inside" else "outside"
} test_points <- list(c(6, 6), c(3, 4), c(8, 8), c(2, 3))
for (pt in test_points) { dist_sq <- (pt[1] - CENTER_X)^2 + (pt[2] - CENTER_Y)^2 status <- classify_point(pt[1], pt[2], CENTER_X, CENTER_Y, RADIUS) cat(sprintf(" Point (%.0f, %.0f): dist^2 = %.1f, R^2 = %.1f -> %s\n", pt[1], pt[2], dist_sq, RADIUS^2, status))
} area <- pi * RADIUS^2
circ <- 2 * pi * RADIUS
cat(sprintf("\nArea (pi*R^2) = %.4f\n", area))
cat(sprintf("Circumference (2*pi*R) = %.4f\n", circ))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: retail trade area overlap analysis
# 5 store locations, each with a 5-km circular trade area.
# Count customers falling in each store's area; flag overlapping catchments. N_STORES = 5
N_CUSTOMERS = 2000
TRADE_RADIUS = 5.0 # km # Store locations (lat/lon approximated as km offsets from city center)
store_coords = np.array([ [ 0.0, 0.0], # downtown [ 4.0, 3.0], # north-east [-4.0, 2.0], # north-west [ 3.0, -4.0], # south-east [-2.0, -5.0], # south
]) # Simulate customer locations (clustered around city center)
customer_coords = np.random.normal(0, 4.0, size=(N_CUSTOMERS, 2)) # For each store, count customers within trade area
results = []
for store_idx, (cx, cy) in enumerate(store_coords): dist_sq = (customer_coords[:, 0] - cx)**2 + (customer_coords[:, 1] - cy)**2 in_area = dist_sq <= TRADE_RADIUS**2 n_in_area = int(np.sum(in_area)) coverage_a = np.pi * TRADE_RADIUS**2 results.append({ "store_id": store_idx + 1, "center_x_km": cx, "center_y_km": cy, "customers_in_area": n_in_area, "coverage_area_km2": round(coverage_a, 2), "customer_density": round(n_in_area / coverage_a, 4), }) df = pd.DataFrame(results)
print(f"Trade radius: {TRADE_RADIUS} km | Coverage area per store: {np.pi*TRADE_RADIUS**2:.2f} km^2")
print(f"\nStore trade area summary:")
print(df.to_string(index=False)) # Check pairwise overlap: two circles overlap if distance between centers < 2R
print(f"\nPairwise overlap check (circles overlap if center distance < 2*R = {2*TRADE_RADIUS:.1f} km):")
for i in range(N_STORES): for j in range(i + 1, N_STORES): d = float(np.linalg.norm(store_coords[i] - store_coords[j])) overlap = d < 2 * TRADE_RADIUS print(f" Store {i+1} <-> Store {j+1}: center dist = {d:.2f} km -> {'OVERLAP' if overlap else 'no overlap'}")
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
1300 pag 157