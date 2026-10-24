---
title: Addition
date: '2026-04-16'
wordCount: 710
slug: addition
permalink: /notes/03_linear_algebra_geometry/vectors_and_dimensionality/vector_operations/addition/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\vec{u} \pm \vec{v} = (u_1 \pm v_1)\vec{i} + (u_2 \pm v_2)\vec{j} + (u_3 \pm v_3)\vec{k}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Vector addition and subtraction is the most fundamental operation in linear algebra. Given two vectors $\vec{u} = (u_1, u_2, u_3)$ and $\vec{v} = (v_1, v_2, v_3)$, their sum/difference is computed component-wise: $\vec{u} \pm \vec{v} = (u_1 \pm v_1, u_2 \pm v_2, u_3 \pm v_3)$. Geometrically, addition follows the parallelogram law (place tail of $\vec{v}$ at tip of $\vec{u}$); subtraction gives the displacement from $\vec{v}$ to $\vec{u}$. In DA/DS: feature vectors get combined (residuals = actual - predicted), gradient updates step from a weight vector, embedding differences encode semantic distances.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Input: vectors u = (u1, u2, u3), v = (v1, v2, v3)"] A --> B["Choose operation: + or -"] B -->|"Addition"| C["Compute (u1+v1, u2+v2, u3+v3)"] B -->|"Subtraction"| D["Compute (u1-v1, u2-v2, u3-v3)"] C --> E["Result vector has same dimension as inputs"] D --> E E --> F["Geometric interpretation: parallelogram (add) or displacement (sub)"]
```
### Real-World use:
#### Situation it is used
Any time two numeric arrays of the same shape are combined linearly: adding gradient to weights in gradient descent, computing residuals (predicted minus actual), combining feature vectors for ensemble models, translating embeddings, and aggregating signal vectors in signal processing.
#### Problem it solves
Allows you to move through vector spaces: from current position $\vec{w}$ to updated position $\vec{w} - \alpha \nabla L$, or from ground truth $\vec{y}$ to residual $\vec{e} = \vec{y} - \hat{\vec{y}}$. Without vector addition, there is no notion of updating, correcting, or combining directional quantities.
#### How it solves the problem
The component-wise rule $(\vec{u} \pm \vec{v})_i = u_i \pm v_i$ works because the standard basis vectors $\vec{i}, \vec{j}, \vec{k}$ are orthogonal: each axis is independent, so operations on one coordinate do not affect another. The formula preserves dimensionality and satisfies all vector space axioms (commutativity: $\vec{u}+\vec{v}=\vec{v}+\vec{u}$; associativity; identity element $\vec{0}$; additive inverse $-\vec{v}$).
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist trains a logistic regression with gradient descent. After each epoch, the weight vector is updated: $\vec{w}_{t+1} = \vec{w}_t - \alpha \nabla_{\vec{w}} L$. This is simply vector subtraction: current weights minus a scaled gradient vector. Each of the $p$ feature weights is updated independently and simultaneously via component-wise subtraction.
### The Formula (Fragment-First)
- $\vec{u} \pm \vec{v}$: vector sum or difference; result is a vector of the same dimension
- $(u_1 \pm v_1)$: first component: add/subtract the first entries
- $\vec{i}$, $\vec{j}$, $\vec{k}$: standard basis unit vectors along $x$-, $y$-, $z$-axes respectively
- The expression $(u_1 \pm v_1)\vec{i} + (u_2 \pm v_2)\vec{j} + (u_3 \pm v_3)\vec{k}$ writes the result as a linear combination of basis vectors, which is the same as writing the coordinate tuple $(u_1 \pm v_1, u_2 \pm v_2, u_3 \pm v_3)$ ### Formula-to-English Translation
"To add (or subtract) two vectors, add (or subtract) their corresponding components one by one. The $x$-coordinates combine, the $y$-coordinates combine, the $z$-coordinates combine. The result is a new vector with the combined values." Tiny example: $\vec{u} = (3, 1, -2)$, $\vec{v} = (1, 4, 5)$.
Sum: $\vec{u} + \vec{v} = (3+1, 1+4, -2+5) = (4, 5, 3)$.
Difference: $\vec{u} - \vec{v} = (3-1, 1-4, -2-5) = (2, -3, -7)$.
### Critical Concepts
- **Same dimension required:** you can only add vectors of identical dimension. Adding a 3D vector to a 2D vector is undefined.
- **Component-wise, not element multiplication:** $\vec{u} + \vec{v}$ adds entries; it is NOT the dot product (which produces a scalar).
- **Zero vector:** $\vec{u} + \vec{0} = \vec{u}$; the zero vector is the additive identity.
- **Additive inverse:** $\vec{u} + (-\vec{u}) = \vec{0}$; subtracting $\vec{u}$ is equivalent to adding $-\vec{u}$.
- **NumPy broadcasting:** in Python, `u + v` on numpy arrays does component-wise addition automatically, matching this formula exactly.
- **Geometric intuition:** addition = follow $\vec{u}$ then follow $\vec{v}$ from the same origin (parallelogram rule); subtraction = displacement vector pointing from tip of $\vec{v}$ to tip of $\vec{u}$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Write out both vectors component by component*
$\vec{u} = (2, -1, 4)$, $\vec{v} = (3, 5, -2)$. *Step 2: Add corresponding components*
First: $2 + 3 = 5$. Second: $-1 + 5 = 4$. Third: $4 + (-2) = 2$. *Step 3: Write the result vector*
$\vec{u} + \vec{v} = (5, 4, 2)$.
Verification: check each component independently. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Vector addition and subtraction: component-wise ---
u = np.array([2.0, -1.0, 4.0])
v = np.array([3.0, 5.0, -2.0]) sum_vec = u + v # component-wise addition
diff_vec = u - v # component-wise subtraction print(f"u = {u}")
print(f"v = {v}")
print(f"u + v = {sum_vec}") # [5. 4. 2.]
print(f"u - v = {diff_vec}") # [-1. -6. 6.] # Verify manually
assert np.allclose(sum_vec[0], u[0] + v[0])
assert np.allclose(diff_vec[2], u[2] - v[2])
print("Manual component check passed.")
```
#### Beginner friendly Example [R])
``` r
# -- Vector addition and subtraction: component-wise ---
u <- c(2, -1, 4)
v <- c(3, 5, -2) sum_vec <- u + v
diff_vec <- u - v cat("u :", u, "\n")
cat("v :", v, "\n")
cat("u + v :", sum_vec, "\n") # 5 4 2
cat("u - v :", diff_vec, "\n") # -1 -6 6 # Confirm component-wise
stopifnot(sum_vec[1] == u[1] + v[1])
stopifnot(diff_vec[3] == u[3] - v[3])
cat("Component checks passed.\n")
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: residual vectors and gradient update step --
# A/B test: 5 KPI metrics measured for two groups.
# Compute difference vector (effect size) and a simulated gradient step. N_METRICS = 5
METRIC_NAMES = ["conversion_rate", "avg_order_value", "session_duration", "bounce_rate", "revenue_per_user"] # Simulated KPI vectors for control and treatment groups
control = np.array([0.032, 48.5, 3.2, 0.61, 1.54])
treatment = np.array([0.038, 51.2, 3.8, 0.55, 1.82]) # Effect vector: difference between treatment and control
effect = treatment - control # Gradient descent simulation: update weight vector for a model
initial_weights = np.random.uniform(-0.1, 0.1, N_METRICS)
learning_rate = 0.01
gradient = np.random.normal(0, 0.05, N_METRICS) # simulated gradient updated_weights = initial_weights - learning_rate * gradient results = pd.DataFrame({ "metric": METRIC_NAMES, "control": control.round(4), "treatment": treatment.round(4), "effect (diff)": effect.round(4), "init_weight": initial_weights.round(4), "updated_weight": updated_weights.round(4),
})
print(results.to_string(index=False))
print(f"\nEffect norm (total lift magnitude): {np.linalg.norm(effect):.4f}")
print(f"Max positive lift metric: {METRIC_NAMES[np.argmax(effect)]}")
print(f"Max negative lift metric: {METRIC_NAMES[np.argmin(effect)]}")
```
#### Final Professional Example [R]
``` r
# A/B test: effect vector = treatment - control; gradient step set.seed(42)
METRIC_NAMES <- c("conversion_rate", "avg_order_value", "session_duration", "bounce_rate", "revenue_per_user")
control <- c(0.032, 48.5, 3.2, 0.61, 1.54)
treatment <- c(0.038, 51.2, 3.8, 0.55, 1.82)
effect <- treatment - control
initial_weights <- runif(5, -0.1, 0.1)
gradient <- rnorm(5, 0, 0.05)
updated_weights <- initial_weights - 0.01 * gradient
results <- data.frame(metric = METRIC_NAMES, control = control, treatment = treatment, effect = effect)
print(results)
cat(sprintf("\nEffect norm: %.4f Max positive: %s Max negative: %s\n", sqrt(sum(effect^2)), METRIC_NAMES[which.max(effect)], METRIC_NAMES[which.min(effect)]))
```
---
1300 pag 128