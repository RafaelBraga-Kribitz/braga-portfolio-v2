---
title: General Metric properties
date: '2026-04-16'
wordCount: 708
slug: general_metric_properties
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/distance_metrics_and_norms/general_metric_properties/index.html
share_status: draft
publish_target: note
boundary: public
---
# $d(x,y) \ge 0$, $d(x,y) = 0 \iff x=y$, $d(x,y) = d(y,x)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A **metric** (or distance function) $d(x, y)$ is a function that satisfies three properties: non-negativity and identity ($d(x,y) \geq 0$, with $d(x,y)=0$ iff $x=y$), symmetry ($d(x,y) = d(y,x)$), and the triangle inequality ($d(x,z) \leq d(x,y) + d(y,z)$). These three axioms define what it means to be a valid "distance." Any function satisfying all three is a metric, and you can use it to define k-NN, clustering, and any distance-based algorithm. If a proposed "distance" fails any axiom, it is not a valid metric and may produce nonsensical results.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Function d(x,y) proposed as a distance"] A --> B["Check: d(x,y) >= 0 for all x,y?"] B -->|"No"| FAIL["NOT a metric"] B -->|"Yes"| C["Check: d(x,y) = 0 iff x = y?"] C -->|"No"| FAIL C -->|"Yes"| D["Check: d(x,y) = d(y,x) for all x,y?"] D -->|"No"| FAIL D -->|"Yes"| E["Check: d(x,z) <= d(x,y) + d(y,z) for all x,y,z?"] E -->|"No"| FAIL E -->|"Yes"| PASS["VALID METRIC"] PASS --> F["Can use in k-NN, clustering, spatial algorithms"]
```
### Real-World use:
#### Situation it is used
When choosing or defining a distance measure for ML algorithms (k-NN, k-means, DBSCAN, hierarchical clustering), verifying that a custom similarity/distance function is mathematically valid, and when reading papers that define novel similarity measures that claim to be metrics.
#### Problem it solves
Not every function that "looks like" a distance is a valid metric. For example, if symmetry fails ($d(A,B) \neq d(B,A)$), the nearest-neighbor relationship becomes asymmetric and direction-dependent — which breaks many algorithms. The metric axioms guarantee a mathematically consistent notion of distance.
#### How it solves the problem
Each axiom prevents a specific failure mode: non-negativity prevents negative "distances" (meaningless as a length), identity prevents two distinct points from having zero distance (they would be indistinguishable), symmetry ensures "distance from A to B" equals "distance from B to A," and the triangle inequality ensures no shortcut is shorter than the direct path.
#### Example of it used in the Working Context as DA/DS for a Business
A DS implements a custom "business distance" for CRM segmentation: $d_{\text{biz}}(A,B) = $ weighted combination of customer feature differences. They verify all three metric properties before using it in k-NN: (1) can it be negative? (2) does $d_{\text{biz}}(A,A) = 0$? (3) is it symmetric? (4) does the triangle inequality hold? Only after all checks pass do they deploy it.
### The Formula (Fragment-First)
Three separate properties — all must hold simultaneously:
1. $d(x,y) \geq 0$ (non-negativity) and $d(x,y) = 0 \Leftrightarrow x = y$ (identity of indiscernibles)
2. $d(x,y) = d(y,x)$ (symmetry)
3. $d(x,z) \leq d(x,y) + d(y,z)$ (triangle inequality — covered in its own file) ### Formula-to-English Translation
1. "Distance is never negative. If the distance between two points is zero, they must be the same point."
2. "The distance from A to B equals the distance from B to A."
3. "Going directly from x to z is never longer than going via y." Tiny example with Euclidean distance in 1D ($d(x,y) = |x-y|$):
- $d(3, 7) = 4 \geq 0$. $d(5,5) = 0$, and $5=5$. $\checkmark$
- $d(3,7) = 4 = d(7,3)$. $\checkmark$
- $d(3,9) = 6 \leq d(3,7) + d(7,9) = 4 + 2 = 6$. $\checkmark$ ### Critical Concepts
- **All three must hold:** a function failing even one axiom is not a metric.
- **Euclidean, Manhattan, Chebyshev:** all satisfy all three properties and are valid metrics.
- **Cosine similarity is NOT a metric:** $\text{sim}(x,x) = 1 \neq 0$. But cosine *distance* ($1 - \text{cosine similarity}$) does satisfy all metric properties.
- **KL divergence is NOT a metric:** it is asymmetric ($KL(P\|Q) \neq KL(Q\|P)$ in general) and does not satisfy the triangle inequality.
- **Near-zero distances:** in floating point, $d(x,y)$ may not be exactly 0 even for identical points. Use `np.isclose` rather than exact equality.
- **Metric space:** a set equipped with a metric is called a metric space. Many ML convergence proofs require a metric space structure.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Verify non-negativity and identity*
Points $A=(1,2)$, $B=(4,6)$ using $d = \|A-B\|_2$.
$d(A,B) = \sqrt{9+16} = 5 \geq 0$. $\checkmark$ $d(A,A) = 0$ and $A=A$. $\checkmark$ *Step 2: Verify symmetry*
$d(A,B) = 5$. $d(B,A) = \sqrt{(1-4)^2+(2-6)^2} = \sqrt{9+16} = 5$. Equal. $\checkmark$ *Step 3: Verify triangle inequality with a third point*
$C = (1,6)$. $d(A,C) = \sqrt{0+16} = 4$. $d(A,B) + d(B,C) = 5 + \sqrt{9+0} = 5+3 = 8 \geq 4$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from itertools import combinations # -- Verify metric properties for L2 distance ---
def euclidean(a, b): return np.linalg.norm(np.array(a) - np.array(b)) # Test points
points = [(1,2), (4,6), (1,6), (4,2)]
n = len(points) # 1. Non-negativity and identity
print("=== Non-negativity and identity ===")
for p in points: same = euclidean(p, p) print(f"d({p},{p}) = {same:.4f} (should be 0: {np.isclose(same, 0)})")
for a, b in combinations(points, 2): d = euclidean(a, b) print(f"d({a},{b}) = {d:.4f} >= 0: {d >= 0}") # 2. Symmetry
print("\n=== Symmetry ===")
for a, b in combinations(points, 2): print(f"d({a},{b}) = {euclidean(a,b):.4f}, d({b},{a}) = {euclidean(b,a):.4f}", f"| sym: {np.isclose(euclidean(a,b), euclidean(b,a))}") # 3. Triangle inequality
print("\n=== Triangle Inequality ===")
for a, b, c in [(points[0], points[1], points[2])]: lhs = euclidean(a, c) rhs = euclidean(a, b) + euclidean(b, c) print(f"d({a},{c}) = {lhs:.4f} <= d({a},{b})+d({b},{c}) = {rhs:.4f}: {lhs <= rhs + 1e-10}")
```
#### Beginner friendly Example [R])
``` r
# -- Verify metric properties for L2 ---
euclidean <- function(a, b) sqrt(sum((a - b)^2))
points <- list(c(1,2), c(4,6), c(1,6), c(4,2)) # Non-negativity and identity
cat("=== Non-negativity and identity ===\n")
for (p in points) cat(sprintf("d(p,p) = %.4f\n", euclidean(p, p))) # Symmetry
cat("\n=== Symmetry ===\n")
for (i in 1:3) for (j in (i+1):4) { a <- pointsi; b <- pointsj cat(sprintf("d(A,B)=%.4f, d(B,A)=%.4f, sym=%s\n", euclidean(a,b), euclidean(b,a), isTRUE(all.equal(euclidean(a,b), euclidean(b,a)))))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # -- Business scenario: validate a custom business distance ---
# A DS proposes a weighted Euclidean distance for CRM segmentation.
# Weights: [2.0, 1.0, 0.5] for [recency, frequency, monetary]. def weighted_euclidean(a: np.ndarray, b: np.ndarray, weights: np.ndarray) -> float: """Weighted Euclidean distance: sqrt(sum(w_i*(a_i-b_i)^2)).""" return float(np.sqrt(np.sum(weights * (a - b)**2))) np.random.seed(42)
N = 20
weights = np.array([2.0, 1.0, 0.5])
customers = np.random.uniform(0, 100, (N, 3)) # RFM features # Property 1: non-negativity and identity
neg_violations = 0
ident_violations = 0
for i in range(N): for j in range(N): d = weighted_euclidean(customers[i], customers[j], weights) if d < 0: neg_violations += 1 if i == j and not np.isclose(d, 0): ident_violations += 1 # Property 2: symmetry
sym_violations = 0
for i in range(N): for j in range(i+1, N): dij = weighted_euclidean(customers[i], customers[j], weights) dji = weighted_euclidean(customers[j], customers[i], weights) if not np.isclose(dij, dji): sym_violations += 1 # Property 3: triangle inequality
tri_violations = 0
for i in range(min(N, 10)): for j in range(min(N, 10)): for k in range(min(N, 10)): dik = weighted_euclidean(customers[i], customers[k], weights) dij = weighted_euclidean(customers[i], customers[j], weights) djk = weighted_euclidean(customers[j], customers[k], weights) if dik > dij + djk + 1e-10: tri_violations += 1 print("Weighted Euclidean metric validation:")
print(f" Non-negativity/identity violations : {neg_violations + ident_violations}")
print(f" Symmetry violations : {sym_violations}")
print(f" Triangle inequality violations : {tri_violations}")
print(f"\n VALID METRIC: {(neg_violations + ident_violations + sym_violations + tri_violations) == 0}")
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
MML2 pag 63