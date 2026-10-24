---
title: Circular Torus
date: '2026-04-16'
wordCount: 931
slug: circular_torus
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/analytic_geometry_shapes_perimeter_area_volume/circular_torus/index.html
share_status: draft
publish_target: note
boundary: public
---
# $V = 2\pi^2 R r^2$, $S = 4\pi^2 R r$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A circular torus is the 3D surface of revolution obtained by rotating a circle of radius $r$ (tube radius) around an axis that lies at distance $R$ (major radius) from the circle's center. Think of a donut or an inner tube. The volume $V = 2\pi^2 R r^2$ gives the space enclosed; the surface area $S = 4\pi^2 R r$ gives the outer skin area. In DA/DS and ML: torus topology appears in periodic data (time-of-day + day-of-week combinations form a torus), in topological data analysis (TDA), in geometry-aware neural networks on manifolds, and in robotics/computer graphics where torus-shaped objects must be modeled analytically. The Pappus theorem underlying these formulas also shows up in centroid calculations.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Circular Torus: major radius R, tube radius r"] A --> B["Volume: V = 2 * pi^2 * R * r^2"] A --> C["Surface area: S = 4 * pi^2 * R * r"] B --> D["Pappus theorem: V = (2*pi*R) * (pi*r^2)"] C --> E["Pappus theorem: S = (2*pi*R) * (2*pi*r)"] D --> F["Circumference of path * area of cross-section circle"] E --> G["Circumference of path * perimeter of cross-section circle"] A --> H["Constraint: R > r (non-self-intersecting torus)"]
```
### Real-World use:
#### Situation it is used
Torus geometry is used in 3D object modeling (CAD, game engines), topological data analysis (identifying toroidal holes in data point clouds using persistent homology), robotics joint space (two rotational joints create a toroidal configuration space), and periodic feature engineering (wrapping hour-of-day and day-of-week into a 2D torus embedding for time-series models).
#### Problem it solves
When a physical or data object has a donut shape, you need to compute its volume (how much material it contains) and surface area (how much it costs to paint or cover). The Pappus theorem gives a clean formula: instead of a complex integral, you just multiply the path length of the centroid by the area (or perimeter) of the cross-section.
#### How it solves the problem
By the Pappus centroid theorem: when a plane figure is rotated about an external axis, the volume swept equals $(\text{centroid path length}) \times (\text{area of figure})$. For a disk of radius $r$ with centroid at distance $R$ from the axis: path length $= 2\pi R$, area $= \pi r^2$, giving $V = 2\pi R \cdot \pi r^2 = 2\pi^2 R r^2$. Similarly, surface area $= 2\pi R \cdot 2\pi r = 4\pi^2 R r$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS builds a time-series demand forecasting model. To represent "time of day" and "day of week" without creating sharp discontinuities at midnight/end-of-week, they embed each timestamp as a point on a torus: $(\cos(2\pi h/24), \sin(2\pi h/24), \cos(2\pi d/7), \sin(2\pi d/7))$. This 4D torus embedding makes temporal distance metrics continuous across day and week boundaries.
### The Formula (Fragment-First)
- $R$: major radius — distance from the center of the torus to the center of the tube cross-section
- $r$: minor radius (tube radius) — radius of the circular cross-section
- $R > r$: condition for a non-self-intersecting (ring) torus; $R = r$ gives a horn torus, $R < r$ gives a spindle torus
- $2\pi^2 R r^2$: volume — product of $\pi^2$ (from the two $\pi$'s from Pappus), $R$, and $r^2$
- $4\pi^2 R r$: surface area — product of $4\pi^2$ and $R r$
- Via Pappus: $V = (\text{circumference of centroid path}) \times (\text{disk area}) = (2\pi R)(\pi r^2)$
- Via Pappus: $S = (\text{circumference of centroid path}) \times (\text{circumference of tube}) = (2\pi R)(2\pi r)$ ### Formula-to-English Translation
"The torus is a circle of radius $r$ swept around a larger circle of radius $R$. Volume = the area swept by the cross-section disk over the full circular path. Surface area = the perimeter swept by the circle boundary over the full circular path. Both reduce to two factors: the path length $2\pi R$ and the cross-section's area or circumference." Tiny example: $R = 5$, $r = 2$.
$V = 2\pi^2(5)(4) = 40\pi^2 \approx 394.78$.
$S = 4\pi^2(5)(2) = 40\pi^2 \approx 394.78$. (Coincidence: $V = S$ when $r = R/\text{something}$ — happens to be equal here numerically.)
Note: $V$ has units of $\text{length}^3$, $S$ has units of $\text{length}^2$ — they are equal here only numerically, not physically. $\checkmark$ ### Critical Concepts
- **Pappus theorem:** the deeper principle. Applies to any shape rotated about an external axis: volume = centroid path length × cross-section area.
- **Three types of tori:** ring torus ($R > r$, donut), horn torus ($R = r$, pinches at inner point), spindle torus ($R < r$, self-intersects).
- **Torus topology vs. geometry:** a flat torus (used in topology) is not the same as the surface of revolution — the flat torus has zero Gaussian curvature everywhere, while the geometric torus has mixed positive and negative curvature.
- **Aspect ratio:** $R/r$ is the aspect ratio. High $R/r$ = thin ring; $R/r \to 1$ = fat donut approaching horn torus.
- **Units:** $V$ is in cubic units (length$^3$), $S$ is in square units (length$^2$).
- **DA/DS torus embedding:** encode periodic features on a torus to make distances continuous across period boundaries: $\theta \mapsto (\cos\theta, \sin\theta)$ in 2D, then combine two angles to get a 4D torus embedding.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Identify the radii*
A donut has major radius $R = 6$ cm, tube radius $r = 2$ cm. *Step 2: Compute volume*
$V = 2\pi^2 \times 6 \times 2^2 = 2\pi^2 \times 6 \times 4 = 48\pi^2 \approx 473.74 \text{ cm}^3$. *Step 3: Compute surface area*
$S = 4\pi^2 \times 6 \times 2 = 48\pi^2 \approx 473.74 \text{ cm}^2$.
(Numerically equal here. Verify: Pappus: $V = 2\pi R \cdot \pi r^2 = 12\pi \cdot 4\pi = 48\pi^2$. $\checkmark$) ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def torus_volume(R: float, r: float) -> float: """Volume of circular torus: V = 2 * pi^2 * R * r^2.""" if R <= r: raise ValueError(f"R={R} must be > r={r} for a ring torus.") return 2.0 * np.pi**2 * R * r**2 def torus_surface_area(R: float, r: float) -> float: """Surface area of circular torus: S = 4 * pi^2 * R * r.""" if R <= r: raise ValueError(f"R={R} must be > r={r} for a ring torus.") return 4.0 * np.pi**2 * R * r examples = [(5, 2), (6, 2), (10, 1), (3, 1)]
print(f"{'R':>5} {'r':>5} {'Volume':>12} {'Surface Area':>14}")
for R, r in examples: V = torus_volume(R, r) S = torus_surface_area(R, r) print(f"{R:>5} {r:>5} {V:>12.4f} {S:>14.4f}") # Verify via Pappus
R_test, r_test = 5.0, 2.0
V_pappus = (2 * np.pi * R_test) * (np.pi * r_test**2)
S_pappus = (2 * np.pi * R_test) * (2 * np.pi * r_test)
print(f"\nPappus V={V_pappus:.4f} == formula V={torus_volume(R_test, r_test):.4f}: " f"{np.isclose(V_pappus, torus_volume(R_test, r_test))}")
```
#### Beginner friendly Example [R])
``` r
# -- Circular Torus ---
torus_volume <- function(R, r) 2 * pi^2 * R * r^2
torus_surface_area <- function(R, r) 4 * pi^2 * R * r cases <- list(c(5, 2), c(6, 2), c(10, 1), c(3, 1))
cat(sprintf("%-5s %-5s %-12s %-14s\n", "R", "r", "Volume", "Surface Area"))
for (case in cases) { R <- case[1]; r <- case[2] cat(sprintf("%-5g %-5g %-12.4f %-14.4f\n", R, r, torus_volume(R, r), torus_surface_area(R, r)))
} # Pappus verification
R <- 5; r <- 2
cat(sprintf("\nPappus V = %.4f, formula V = %.4f\n", (2*pi*R) * (pi*r^2), torus_volume(R, r)))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: torus feature embedding for periodic time-series features ---
# Encode hour-of-day and day-of-week as a torus embedding.
# Compute angular distance between timestamps using the embedded coordinates. def torus_embed(hour: float, day: float) -> np.ndarray: """ Embed (hour, day) as a point on a 4D torus. hour in [0, 24), day in [0, 7). Returns 4D unit-torus coordinates. """ theta_h = 2 * np.pi * hour / 24.0 theta_d = 2 * np.pi * day / 7.0 return np.array([np.cos(theta_h), np.sin(theta_h), np.cos(theta_d), np.sin(theta_d)]) # Simulate 10 events with hour and day-of-week
events = pd.DataFrame({ "event_id": range(10), "hour": np.random.uniform(0, 24, 10).round(1), "day_of_week": np.random.randint(0, 7, 10),
}) # Embed each event
embeddings = np.vstack([torus_embed(h, d) for h, d in zip(events["hour"], events["day_of_week"])]) # Compute pairwise Euclidean distances in torus embedding space
n = len(events)
dist_matrix = np.zeros((n, n))
for i in range(n): for j in range(n): dist_matrix[i, j] = np.linalg.norm(embeddings[i] - embeddings[j]) # Find the most temporally similar pair of events
np.fill_diagonal(dist_matrix, np.inf)
i_min, j_min = np.unravel_index(dist_matrix.argmin(), dist_matrix.shape) print("Torus embedding of periodic time features:")
print(events.to_string(index=False))
print(f"\nMost similar pair in torus space: event {i_min} and event {j_min}")
print(f" Torus distance: {dist_matrix[i_min, j_min]:.4f}")
print(f" Event {i_min}: hour={events.iloc[i_min]['hour']}, day={events.iloc[i_min]['day_of_week']}")
print(f" Event {j_min}: hour={events.iloc[j_min]['hour']}, day={events.iloc[j_min]['day_of_week']}")
print(f"\nNote: distances are continuous across hour=23->0 and day=6->0 boundaries.") # Show torus geometry formulas
R, r = 5.0, 2.0
print(f"\nTorus geometry (R={R}, r={r}):")
print(f" V = 2pi^2 * R * r^2 = {2*np.pi**2*R*r**2:.4f}")
print(f" S = 4pi^2 * R * r = {4*np.pi**2*R*r:.4f}")
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