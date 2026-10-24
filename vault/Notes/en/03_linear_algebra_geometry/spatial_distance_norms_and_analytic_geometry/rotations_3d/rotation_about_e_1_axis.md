---
title: Rotation about $e 1$-axis
date: '2026-04-16'
wordCount: 668
slug: rotation_about_e_1_axis
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/rotations_3d/rotation_about_e_1_axis/index.html
share_status: draft
publish_target: note
boundary: public
---
# $R_1(\theta) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta \\ 0 & \sin\theta & \cos\theta \end{bmatrix}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
$R_1(\theta)$ is the 3D rotation matrix that rotates vectors by angle $\theta$ around the $x$-axis ($e_1$-axis). The $x$-coordinate is unchanged (first row/column is $[1,0,0]$); the $y$-$z$ plane rotates by $\theta$. This is called a "roll" rotation in aerospace and robotics. In DA/DS and ML: rotation matrices are used in 3D data augmentation for point clouds and LiDAR data, in coordinate frame transformations, in geometric deep learning, and in understanding how rigid transformations affect feature spaces. All rotation matrices are **orthogonal**: $R^T R = I$ and $\det(R) = 1$.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Input vector: (x, y, z)^T, angle theta"] A --> B["Apply R1(theta)"] B --> C["x-component: unchanged (x stays x)"] B --> D["y-component: y*cos(theta) - z*sin(theta)"] B --> E["z-component: y*sin(theta) + z*cos(theta)"] C --> F["Output: (x, y*cos - z*sin, y*sin + z*cos)^T"] D --> F E --> F F --> G["Rotation in the yz-plane by angle theta"] F --> H["Length preserved: ||R1 v|| = ||v||"]
```
### Real-World use:
#### Situation it is used
3D point cloud data augmentation (rotate LiDAR/depth camera points around the x-axis to simulate different sensor orientations), coordinate transformations in robotics/aerospace (roll angle), composing full 3D rotations via $R = R_3(\psi) R_2(\phi) R_1(\theta)$ (Euler angles: yaw-pitch-roll), and testing rotation-equivariant neural networks on 3D data.
#### Problem it solves
Rotating a 3D vector or a set of 3D points around the $x$-axis by a specific angle. Without a rotation matrix, you would need trigonometric formulas for each component individually. The matrix formulation applies the rotation to all points simultaneously via matrix multiplication.
#### How it solves the problem
By trigonometry: the $y$ and $z$ coordinates after rotating the yz-plane by $\theta$ follow the 2D rotation formula: $y' = y\cos\theta - z\sin\theta$, $z' = y\sin\theta + z\cos\theta$. The $x$-coordinate is the rotation axis and is unchanged. Packing these into a $3\times3$ matrix gives $R_1(\theta)$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS augments a 3D object detection training dataset by rotating each point cloud around the $x$-axis (roll) by a random angle $\theta \in [-15°, 15°]$: `X_rotated = X @ R1(theta).T`. This simulates sensor tilt and prevents the model from overfitting to a single orientation.
### The Formula (Fragment-First)
- $R_1(\theta)$: $3\times3$ rotation matrix around the $e_1 = (1,0,0)$ axis (x-axis)
- Row 1 = $(1,0,0)$: x-coordinate is unchanged
- Row 2 = $(0, \cos\theta, -\sin\theta)$: new y is old $y\cos\theta - z\sin\theta$
- Row 3 = $(0, \sin\theta, \cos\theta)$: new z is old $y\sin\theta + z\cos\theta$
- $\theta > 0$: counterclockwise rotation in the yz-plane when viewed from the positive x-axis
- $R_1(0) = I_3$ (no rotation)
- $R_1(-\theta) = R_1(\theta)^T = R_1(\theta)^{-1}$ (inverse is transpose)
- $\det(R_1(\theta)) = 1$ (proper rotation, no reflection) ### Formula-to-English Translation
"Lock the x-axis in place. In the yz-plane, apply a standard 2D rotation: y and z trade contributions according to sine and cosine. The x-axis is the pivot; the yz-plane spins." Tiny example: $\theta = 90°$, $v = (0, 1, 0)$ (pointing up the y-axis).
$R_1(90°)v = (0, \cos90° \cdot 1 - \sin90° \cdot 0, \sin90° \cdot 1 + \cos90° \cdot 0) = (0, 0, 1)$.
After rotating 90° around x, the y-axis maps to the z-axis. $\checkmark$ ### Critical Concepts
- **Orthogonal matrix:** $R_1^T R_1 = I$. Transpose = inverse. Preserves lengths and angles.
- **Determinant = 1:** distinguishes rotation from reflection/scaling.
- **Composition:** $R_1(\alpha) R_1(\beta) = R_1(\alpha+\beta)$. Successive rotations around the same axis add up.
- **Non-commutativity (different axes):** $R_1 R_2 \neq R_2 R_1$ in general. Order of rotations matters.
- **Euler angles:** any 3D rotation can be decomposed as $R = R_3(\psi)R_2(\phi)R_1(\theta)$.
- **Application order:** to rotate data matrix $X$ (shape: n×3, rows=points), use `X @ R.T` or equivalently `(R @ X.T).T`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Set up the rotation*
$\theta = 45°$. $\cos45° = \sin45° = \frac{1}{\sqrt{2}} \approx 0.707$.
$R_1(45°) = \begin{pmatrix}1&0&0\\0&0.707&-0.707\\0&0.707&0.707\end{pmatrix}$. *Step 2: Apply to a vector*
$v = (2, 1, 0)^T$.
$R_1(45°)v = (2, 0.707-0, 0.707+0) = (2, 0.707, 0.707)$. *Step 3: Verify length preservation*
$\|v\| = \sqrt{4+1+0} = \sqrt{5}$. $\|R_1 v\| = \sqrt{4+0.5+0.5} = \sqrt{5}$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Rotation matrix R1(theta) around the x-axis ---
def rotation_x(theta_deg: float) -> np.ndarray: """Return 3x3 rotation matrix for rotation around x-axis by theta_deg degrees.""" theta = np.radians(theta_deg) cos_t = np.cos(theta) sin_t = np.sin(theta) return np.array([ [1.0, 0.0, 0.0], [0.0, cos_t, -sin_t], [0.0, sin_t, cos_t], ]) # Apply rotation
v = np.array([2.0, 1.0, 0.0])
for angle in [0, 45, 90, 180]: R1 = rotation_x(angle) v_rot = R1 @ v print(f"theta={angle:3d}°: {v} -> {v_rot.round(4)}" f" ||v'||={np.linalg.norm(v_rot):.4f}") # Verify orthogonality
R1_45 = rotation_x(45)
print(f"\nR1^T R1 = I: {np.allclose(R1_45.T @ R1_45, np.eye(3))}")
print(f"det(R1) = 1: {np.isclose(np.linalg.det(R1_45), 1.0)}")
```
#### Beginner friendly Example [R])
``` r
# -- Rotation around x-axis ---
rotation_x <- function(theta_deg) { t <- theta_deg * pi / 180 matrix(c(1, 0, 0, 0, cos(t), sin(t), 0, -sin(t), cos(t)), nrow=3, ncol=3, byrow=TRUE)
} v <- c(2, 1, 0)
for (angle in c(0, 45, 90, 180)) { R1 <- rotation_x(angle) v_rot <- R1 %*% v cat(sprintf("theta=%d: (%.4f, %.4f, %.4f) ||v'||=%.4f\n", angle, v_rot[1], v_rot[2], v_rot[3], sqrt(sum(v_rot^2))))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: 3D point cloud data augmentation with roll rotation ---
# Augment a 3D object detection dataset by applying random roll angles. def rotation_x(theta_deg: float) -> np.ndarray: """3x3 rotation matrix around x-axis.""" theta = np.radians(theta_deg) c, s = np.cos(theta), np.sin(theta) return np.array([[1, 0, 0], [0, c, -s], [0, s, c]]) N_POINTS = 500
N_AUG = 6
ANGLE_RANGE = 15.0 # degrees # Simulated 3D point cloud (object of interest)
point_cloud = np.random.randn(N_POINTS, 3) * np.array([1.0, 0.5, 2.0]) augmentations = []
for i in range(N_AUG): angle = np.random.uniform(-ANGLE_RANGE, ANGLE_RANGE) R1 = rotation_x(angle) pts_rot = point_cloud @ R1.T # rotate all points: (N,3) @ (3,3)^T # Verify properties mean_dist_preserved = np.allclose( np.linalg.norm(point_cloud, axis=1), np.linalg.norm(pts_rot, axis=1), atol=1e-10 ) augmentations.append({ "augmentation_id": i + 1, "roll_angle_deg": round(angle, 2), "mean_y_before": round(point_cloud[:, 1].mean(), 4), "mean_y_after": round(pts_rot[:, 1].mean(), 4), "distances_preserved": mean_dist_preserved, }) df = pd.DataFrame(augmentations)
print("3D Roll Augmentation (rotation around x-axis):")
print(df.to_string(index=False))
print("\nR1 preserves all pairwise distances (isometric transformation).")
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
MML1