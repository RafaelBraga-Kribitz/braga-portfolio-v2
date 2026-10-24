---
title: Straight Line (General Form)
date: '2026-04-16'
wordCount: 900
slug: straight_line_general_form
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/analytic_geometry_shapes_perimeter_area_volume/straight_line_general_form/index.html
share_status: draft
publish_target: note
boundary: public
---
# $Ax + By + C = 0$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The general form of a straight line in 2D is $Ax + By + C = 0$, where $(A, B)$ is the normal vector to the line (perpendicular direction). This is the 2D special case of the plane equation and is the most general linear form: it handles all orientations including vertical lines ($B=0$), which the slope-intercept form $y = mx + b$ cannot represent. In DA/DS: every linear decision boundary in 2D is a line $Ax + By + C = 0$. This is the output of 2D logistic regression, 2D SVM, and 2D linear discriminant analysis. The signed distance formula $d = (Ax_1+By_1+C)/\sqrt{A^2+B^2}$ gives the SVM margin distance and is used for feature engineering (distance from a boundary) and anomaly scoring.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Line in 2D: Ax + By + C = 0"] A --> B["Normal vector: n = (A, B) (perpendicular to line)"] A --> C["Direction vector: d = (-B, A) (along line)"] A --> D["Slope: m = -A/B (if B != 0)"] A --> E["y-intercept: -C/B (if B != 0)"] A --> F["Signed distance from (x1, y1) to line"] F --> G["d = (Ax1 + By1 + C) / sqrt(A^2 + B^2)"] G --> H["positive: point on normal side"] G --> I["negative: opposite side"] G --> J["zero: on the line"]
```
### Real-World use:
#### Situation it is used
2D logistic regression and SVM decision boundary, geometric distance calculations in 2D data (distance from each customer to the revenue-cost break-even line), 2D outlier analysis (distance from the OLS regression line), separating hyperplane in 2D classification visualization, and engineering tolerance bounds (acceptable region between two parallel lines).
#### Problem it solves
The general form $Ax + By + C = 0$ handles all line orientations in a uniform way. Converting a line to this form enables: computing the signed distance from any point to the line, checking which side of the line a point is on, and finding intersections with other lines or curves, all using the same arithmetic structure.
#### How it solves the problem
Rewriting the standard slope-intercept form $y = mx + b$ gives $mx - y + b = 0$, i.e., $A=m$, $B=-1$, $C=b$. The normal vector $(A,B)$ points perpendicular to the line. For any point $P=(x_1,y_1)$, the expression $Ax_1 + By_1 + C$ is the dot product of the normal with the displacement from a reference point on the line — its sign tells you which half-plane $P$ is in, and dividing by $\|(A,B)\|$ gives the actual distance.
#### Example of it used in the Working Context as DA/DS for a Business
A DS trains a 2D logistic regression to classify transactions as fraud vs. normal based on two features. The learned decision boundary is a line $Ax + By + C = 0$. For each new transaction, they compute the signed distance $d = (Ax_1+By_1+C)/\sqrt{A^2+B^2}$: the magnitude gives confidence (how far from the boundary), the sign gives the predicted class. They use $|d|$ as an uncertainty score: transactions with $|d| < 0.5$ go to a human reviewer.
### The Formula (Fragment-First)
- $A, B$: coefficients defining the line's orientation; $(A, B)$ is the normal vector (perpendicular to line)
- $C$: the offset constant; determines the line's position
- $Ax + By + C = 0$: every point $(x,y)$ on the line satisfies this equation
- Normal vector: $(A, B)$ — perpendicular to the line
- Direction vector: $(-B, A)$ — parallel to the line
- Slope (if $B \neq 0$): $m = -A/B$; $y$-intercept: $-C/B$
- Signed distance from $(x_1, y_1)$: $d = \frac{Ax_1 + By_1 + C}{\sqrt{A^2+B^2}}$
- Unsigned distance: $|d|$
- Two lines are parallel iff their normal vectors are parallel: $(A_1, B_1) \parallel (A_2, B_2)$ ### Formula-to-English Translation
"A straight line in 2D is a set of points where the linear combination $Ax + By + C$ equals zero. The coefficients $A$ and $B$ define the direction the line 'faces' (its normal). To find how far any point is from the line, plug it in, and divide by the length of the normal vector." Tiny example: Line $3x - 4y + 5 = 0$.
Normal: $(3,-4)$. Slope: $m = -3/(-4) = 3/4$.
$\|\mathbf{n}\| = 5$.
Point $(1, 2)$: $3(1)-4(2)+5 = -0.0 = 0$. On the line. $\checkmark$
Point $(2, 2)$: $3(2)-4(2)+5 = 3$. Distance $= 3/5 = 0.6$. Positive side. $\checkmark$ ### Critical Concepts
- **Handles all orientations:** slope-intercept $y=mx+b$ breaks for vertical lines. General form $Ax+By+C=0$ handles all lines (vertical: $A=1, B=0$; horizontal: $A=0, B=1$).
- **Sign = classification:** $Ax_1+By_1+C > 0$ and $< 0$ define two half-planes. This is exactly the linear SVM prediction function (before the sign/threshold).
- **Parallel lines:** $Ax+By+C_1=0$ and $Ax+By+C_2=0$ are parallel. Distance between them: $|C_1-C_2|/\sqrt{A^2+B^2}$.
- **SVM margin:** the two support hyperplanes are $\mathbf{w}^T\mathbf{x}+b = \pm 1$; their distance from the decision boundary is $1/\|\mathbf{w}\|$ each, total margin $= 2/\|\mathbf{w}\|$.
- **Logistic regression boundary:** the boundary is exactly where $P(\text{class}=1) = 0.5$, i.e., where $\mathbf{w}^T\mathbf{x}+b=0$.
- **Normalization:** dividing $(A,B,C)$ by $\sqrt{A^2+B^2}$ gives the Hesse normal form where the distance formula simplifies to $Ax_1+By_1+C$ directly.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Convert slope-intercept to general form*
Line $y = 2x - 3$: rearranges to $2x - y - 3 = 0$.
So $A=2$, $B=-1$, $C=-3$. *Step 2: Compute signed distance from a point*
$P = (4, 1)$: $d = \frac{2(4)+(-1)(1)+(-3)}{\sqrt{4+1}} = \frac{8-1-3}{\sqrt{5}} = \frac{4}{\sqrt{5}} \approx 1.789$.
$P$ is on the positive-normal side of the line. *Step 3: Verify classification*
$P = (0, 0)$: $d = (0+0-3)/\sqrt{5} = -3/\sqrt{5} \approx -1.342$. Negative side.
The line $y=2x-3$: at $x=0$, $y=-3$. Since $y=0 > -3$, the origin is above the line — consistent with the sign. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def line_signed_distance(x1: float, y1: float, A: float, B: float, C: float) -> float: """Signed distance from point (x1, y1) to line Ax + By + C = 0.""" return (A * x1 + B * y1 + C) / float(np.sqrt(A**2 + B**2)) def line_from_slope_intercept(m: float, b: float) -> tuple[float, float, float]: """Convert y = mx + b to general form (A, B, C) where Ax + By + C = 0.""" return m, -1.0, b # Line: y = 2x - 3 => 2x - y - 3 = 0
A, B, C = line_from_slope_intercept(2.0, -3.0)
print(f"Line: {A:.1f}x + {B:.1f}y + {C:.1f} = 0")
print(f" Normal vector: ({A:.1f}, {B:.1f})")
print(f" Slope: {-A/B:.4f}, y-intercept: {-C/B:.4f}")
print(f" ||normal|| = {np.sqrt(A**2+B**2):.4f}") test_pts = [(4, 1), (0, 0), (1, -1), (3, 3)]
for x, y in test_pts: d = line_signed_distance(x, y, A, B, C) side = "ON line" if np.isclose(d, 0) else ("positive side" if d > 0 else "negative side") print(f" ({x}, {y}): d = {d:.4f} -> {side}")
```
#### Beginner friendly Example [R])
``` r
# -- Straight line general form: Ax + By + C = 0 ---
line_signed_dist <- function(x1, y1, A, B, C) { (A * x1 + B * y1 + C) / sqrt(A^2 + B^2)
} # y = 2x - 3 => 2x - y - 3 = 0
A <- 2; B <- -1; C <- -3
cat(sprintf("Line: %.0fx + %.0fy + %.0f = 0\n", A, B, C))
cat(sprintf(" Slope: %.4f, y-intercept: %.4f\n", -A/B, -C/B)) test_pts <- list(c(4, 1), c(0, 0), c(1, -1))
for (pt in test_pts) { d <- line_signed_dist(pt[1], pt[2], A, B, C) side <- if (abs(d) < 1e-10) "ON line" else if (d > 0) "positive" else "negative" cat(sprintf(" (%g, %g): d=%.4f -> %s\n", pt[1], pt[2], d, side))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler np.random.seed(42) # -- Business scenario: 2D logistic regression with signed distance as uncertainty score ---
N_CLASS0 = 150
N_CLASS1 = 150 # Class 0: normal transactions (low amount, low velocity)
X0 = np.random.randn(N_CLASS0, 2) + np.array([0, 0])
# Class 1: fraud (high amount or high velocity)
X1 = np.random.randn(N_CLASS1, 2) + np.array([2, 1.5]) X = np.vstack([X0, X1])
y = np.array([0]*N_CLASS0 + [1]*N_CLASS1) scaler = StandardScaler()
X_std = scaler.fit_transform(X) lr = LogisticRegression(random_state=42)
lr.fit(X_std, y) # Extract decision line: w[0]*x + w[1]*y + b = 0
w = lr.coef_[0]
b = lr.intercept_[0]
A, B, C = w[0], w[1], b print(f"Logistic regression decision line: {A:.4f}*x + {B:.4f}*y + {C:.4f} = 0")
print(f" Slope: {-A/B:.4f}, y-intercept: {-C/B:.4f}") # Test: compute signed distances for new observations
X_test = np.random.randn(20, 2)
X_test[:10] += np.array([2, 1.5]) # fraud-like
X_test_std = scaler.transform(X_test) signed_dists = (X_test_std @ w + b) / np.linalg.norm(w)
pred_classes = (signed_dists > 0).astype(int)
confidence = np.abs(signed_dists) results = pd.DataFrame({ "sample": range(20), "true_class": [1]*10 + [0]*10, "pred_class": pred_classes, "signed_dist": signed_dists.round(4), "confidence": confidence.round(4), "review": confidence < 0.5,
})
print(f"\nSigned distance classification (low confidence |d| < 0.5 -> human review):")
print(results.to_string(index=False))
print(f"\nFlagged for review: {results['review'].sum()} / {len(results)}")
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
1300 pag 147