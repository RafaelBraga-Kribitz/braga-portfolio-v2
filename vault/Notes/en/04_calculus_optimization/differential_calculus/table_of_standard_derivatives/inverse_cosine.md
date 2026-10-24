---
title: Inverse Cosine
date: '2026-04-16'
wordCount: 811
slug: inverse_cosine
permalink: /notes/04_calculus_optimization/differential_calculus/table_of_standard_derivatives/inverse_cosine/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{d}{dx}(\arccos(ax)) = \frac{-a}{\sqrt{1 - (ax)^2}}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The derivative of $\arccos(ax)$ is $-a/\sqrt{1-(ax)^2}$ — identical in magnitude to the $\arcsin$ derivative, but negative. This negative sign reflects that $\arccos$ is a strictly decreasing function: as $x$ increases, $\arccos(ax)$ decreases. The key identity $\arcsin(x) + \arccos(x) = \pi/2$ (for $x \in [-1, 1]$) immediately implies the derivatives are negatives of each other, since $d/dx(\pi/2) = 0$. In DA/DS: $\arccos$ appears in computing angular distances between unit vectors (cosine similarity to angle conversion: $\theta = \arccos(\mathbf{u} \cdot \mathbf{v})$), in computing gradients through similarity metrics, and in geodesic distance formulas used in geospatial and graph ML.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["f(x) = arccos(ax)"] A --> B["Method 1: implicit differentiation"] B --> C["cos(y) = ax, differentiate: -sin(y)*y' = a"] C --> D["y' = -a / sin(y) = -a / sqrt(1 - cos^2(y)) = -a / sqrt(1 - (ax)^2)"] A --> E["Method 2: use identity arcsin + arccos = pi/2"] E --> F["d/dx(arccos(ax)) = -d/dx(arcsin(ax)) = -a / sqrt(1 - (ax)^2)"] D --> G["Domain: |ax| < 1, derivative is negative (arccos is decreasing)"] A --> H["Chain rule: d/dx(arccos(f(x))) = -f'(x) / sqrt(1 - f(x)^2)"]
```
### Real-World use:
#### Situation it is used
Computing the gradient of angular distance $\theta = \arccos(\text{cosine\_similarity})$ when using angular loss functions in metric learning and contrastive learning; differentiating geodesic distance formulas for spherical coordinates in geospatial ML; computing gradients through $\arccos$-based activation functions; deriving the gradient of the angular margin in ArcFace loss for face recognition.
#### Problem it solves
When optimizing over angular quantities (e.g., minimizing the angle between embedding vectors), the gradient must flow through $\arccos$. Without this derivative, backpropagation through angular loss functions cannot be computed.
#### How it solves the problem
Implicit differentiation: let $y = \arccos(ax)$, so $\cos(y) = ax$. Differentiate: $-\sin(y) \cdot y' = a$, giving $y' = -a/\sin(y)$. Since $y \in [0, \pi]$, $\sin(y) \ge 0$, and $\sin(y) = \sqrt{1 - \cos^2(y)} = \sqrt{1-(ax)^2}$. Therefore $y' = -a/\sqrt{1-(ax)^2}$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS trains a recommendation model with ArcFace-style angular margin loss. The logit for class $k$ is $\cos(\theta_{w_k, x}) = w_k \cdot x / (\|w_k\|\|x\|)$, and the angular distance $\theta = \arccos(\cos)$ is needed. The gradient $d\theta/d(\cos\theta) = -1/\sqrt{1-\cos^2\theta} = -1/\sin\theta$ uses exactly $d/du(\arccos u) = -1/\sqrt{1-u^2}$ (with $a=1$). This gradient flows back through the embedding layer.
### The Formula (Fragment-First)
- $\arccos$: inverse cosine function; maps $[-1, 1] \to [0, \pi]$; decreasing function
- $ax$: the argument; domain requires $|ax| \le 1$, i.e., $|x| \le 1/a$
- $-a$: numerator; the negative sign because $\arccos$ is decreasing
- $\sqrt{1-(ax)^2}$: denominator; identical to the $\arcsin$ case
- Base case: $d/dx(\arccos x) = -1/\sqrt{1-x^2}$
- Identity: $\arcsin x + \arccos x = \pi/2 \Rightarrow d/dx(\arccos x) = -d/dx(\arcsin x)$
- General chain rule: $d/dx(\arccos f(x)) = -f'(x)/\sqrt{1-f(x)^2}$
- Cosine similarity gradient: $d/d(\text{sim})(\arccos(\text{sim})) = -1/\sqrt{1-\text{sim}^2}$ ### Formula-to-English Translation
"The derivative of $\arccos(ax)$ is the negative of the $\arcsin(ax)$ derivative. It is $a$ in the numerator (chain rule factor), $\sqrt{1 - \text{argument}^2}$ in the denominator, and a minus sign because $\arccos$ decreases as $x$ increases. The magnitude is identical to $\arcsin$, only the direction flips." Tiny examples:
$d/dx(\arccos x)|_{x=0} = -1/\sqrt{1-0} = -1$.
$d/dx(\arccos x)|_{x=0.5} = -1/\sqrt{1-0.25} = -1/\sqrt{0.75} \approx -1.155$.
$d/dx(\arccos(2x))|_{x=0} = -2/\sqrt{1-0} = -2$.
$d/du(\arccos u)|_{u=0.8} = -1/\sqrt{1-0.64} = -1/\sqrt{0.36} = -1/0.6 \approx -1.667$.
### Critical Concepts
- **Negative derivative = decreasing function:** $\arccos$ goes from $\pi$ at $x=-1$ to $0$ at $x=1$. Its derivative is always negative (except undefined at the endpoints). This is the opposite of $\arcsin$, which increases from $-\pi/2$ to $\pi/2$.
- **Complementary identity:** $\arcsin(x) + \arccos(x) = \pi/2$ for all $x \in [-1, 1]$. Differentiating both sides: $d/dx(\arcsin x) + d/dx(\arccos x) = 0$, so $d/dx(\arccos x) = -d/dx(\arcsin x) = -1/\sqrt{1-x^2}$. This is the quickest proof of the formula.
- **Angular gradient in embeddings:** when $\theta = \arccos(\mathbf{u} \cdot \mathbf{v})$ and $\mathbf{u}, \mathbf{v}$ are unit vectors, the gradient of $\theta$ with respect to the cosine similarity is $-1/\sin\theta$. This blows up when $\theta \approx 0$ or $\theta \approx \pi$ (nearly identical or opposite vectors). Clip or add $\epsilon$ in practice.
- **Same domain restriction as arcsin:** $|ax| < 1$ required. Inputs outside $[-1, 1]$ to $\arccos$ are undefined. When computing $\arccos(\text{cosine\_similarity})$, numerical errors can push the similarity slightly outside $[-1, 1]$; always clip first: `sim = np.clip(sim, -1, 1)`.
- **Gradient clipping at boundary:** just like $\arcsin$, the derivative $\to -\infty$ as $|ax| \to 1$. In ArcFace and similar angular losses, this is handled by clipping the cosine similarity away from $\pm 1$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Compute the gradient of angular distance $\theta = \arccos(\text{sim})$ at $\text{sim} = 0.6$.* *Step 1: Identify.* $\theta = \arccos(u)$ with $u = \text{sim} = 0.6$, $a = 1$. *Step 2: Apply formula.* $d\theta/du = -1/\sqrt{1-u^2}$. *Step 3: Evaluate.* $1 - 0.6^2 = 1 - 0.36 = 0.64$. $\sqrt{0.64} = 0.8$.
$d\theta/du = -1/0.8 = -1.25$. *Interpretation:* at cosine similarity $= 0.6$, a unit increase in similarity decreases the angle by $1.25$ radians (about $71.6°$). *Verify:* $\arccos(0.6 + 10^{-7}) - \arccos(0.6 - 10^{-7})$ divided by $2 \times 10^{-7} \approx -1.25$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def arccos_ax_deriv(a: float, x: float) -> float: """d/dx(arccos(ax)) = -a / sqrt(1 - (ax)^2). Requires |ax| < 1.""" arg = a * x if abs(arg) >= 1.0: raise ValueError(f"|ax| = {abs(arg):.4f} >= 1: outside arccos domain.") return -a / np.sqrt(1.0 - arg**2) # Verify numerically
h = 1e-7
test_cases = [(1.0, 0.5), (2.0, 0.3), (0.5, 0.8), (3.0, 0.1)]
print(f"{'a':>6} {'x':>6} {'Analytic':>12} {'Numerical':>12} {'Match':>7}")
for a, x in test_cases: analytic = arccos_ax_deriv(a, x) numerical = (np.arccos(a*(x+h)) - np.arccos(a*(x-h))) / (2 * h) match = abs(analytic - numerical) < 1e-5 print(f"{a:>6.2f} {x:>6.3f} {analytic:>12.6f} {numerical:>12.6f} {str(match):>7}") # Angular distance gradient for cosine similarity
print("\nAngular distance gradient d(arccos(sim))/d(sim):")
for sim in [0.0, 0.3, 0.6, 0.8, 0.9, 0.99]: grad = arccos_ax_deriv(1.0, sim) angle_deg = np.degrees(np.arccos(sim)) print(f" sim={sim:.2f} (theta={angle_deg:.1f} deg): gradient = {grad:.4f}")
```
#### Beginner friendly Example [R])
``` r
# d/dx(arccos(ax)) = -a / sqrt(1 - (ax)^2)
arccos_ax_deriv <- function(a, x) { arg <- a * x if (abs(arg) >= 1) stop(sprintf("|ax| = %.4f >= 1: outside domain", abs(arg))) -a / sqrt(1 - arg^2)
} # Verify with complement identity: d/dx(arccos) = -d/dx(arcsin)
arcsin_ax_deriv <- function(a, x) a / sqrt(1 - (a*x)^2) cat("Complement check: arccos_deriv + arcsin_deriv should = 0\n")
for (x in c(0.0, 0.3, 0.6, 0.8)) { sum_derivs <- arccos_ax_deriv(1, x) + arcsin_ax_deriv(1, x) cat(sprintf(" x=%.1f: arccos'+ arcsin' = %.8f\n", x, sum_derivs))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity np.random.seed(42) # -- Angular loss gradient: d/d(embedding) of arccos(cosine_similarity) --
# Use case: metric learning where angular distance between embeddings is minimized.
# Gradient flows back through arccos to update embedding parameters. EMBED_DIM = 64
N_SAMPLES = 100 def unit_normalize(x: np.ndarray) -> np.ndarray: """L2-normalize each row to lie on unit sphere.""" norms = np.linalg.norm(x, axis=1, keepdims=True) return x / (norms + 1e-10) def arccos_gradient_wrt_sim(cos_sim: np.ndarray, epsilon: float = 1e-6) -> np.ndarray: """d/d(cos_sim)(arccos(cos_sim)) = -1 / sqrt(1 - cos_sim^2). Clip cos_sim away from +-1 to avoid infinite gradient. """ cos_sim_clipped = np.clip(cos_sim, -1 + epsilon, 1 - epsilon) return -1.0 / np.sqrt(1.0 - cos_sim_clipped**2) def angular_loss_and_gradient( embeds_a: np.ndarray, embeds_b: np.ndarray
) -> tuple: """Angular distance loss = mean arccos(cos_sim(a, b)). Gradient w.r.t. cos_sim: -1/sqrt(1 - sim^2). """ sim = np.sum(embeds_a * embeds_b, axis=1) # dot product of unit vectors = cosine sim sim_clipped = np.clip(sim, -1 + 1e-6, 1 - 1e-6) angles = np.arccos(sim_clipped) loss = np.mean(angles) grad_wrt_sim = arccos_gradient_wrt_sim(sim) return float(loss), grad_wrt_sim, angles # Simulate two batches of embeddings
embeds_a = unit_normalize(np.random.randn(N_SAMPLES, EMBED_DIM))
embeds_b = unit_normalize(np.random.randn(N_SAMPLES, EMBED_DIM)) loss, grad_sim, angles = angular_loss_and_gradient(embeds_a, embeds_b)
cos_sims = np.sum(embeds_a * embeds_b, axis=1) print("Angular Distance Loss: gradient via d/d(sim)(arccos(sim)) = -1/sqrt(1 - sim^2)")
print(f"\nBatch size: {N_SAMPLES}, embed dim: {EMBED_DIM}")
print(f"Cosine similarity stats: mean={cos_sims.mean():.4f}, std={cos_sims.std():.4f}")
print(f" Range: [{cos_sims.min():.4f}, {cos_sims.max():.4f}]")
print(f"Angular distance (degrees): mean={np.degrees(angles).mean():.2f}, " f"range=[{np.degrees(angles.min()):.2f}, {np.degrees(angles.max()):.2f}]")
print(f"\nAngular loss: {loss:.6f} rad = {np.degrees(loss):.2f} deg")
print(f"\nGradient d(loss)/d(sim) stats:")
print(f" mean={grad_sim.mean():.4f}, range=[{grad_sim.min():.4f}, {grad_sim.max():.4f}]")
print(f"\nKey: most negative gradient at sim close to +/-1 (large angle change per similarity change)")
max_grad_idx = np.argmax(np.abs(grad_sim))
print(f" Most extreme gradient: sim={cos_sims[max_grad_idx]:.4f}, " f"grad={grad_sim[max_grad_idx]:.4f} (theta={np.degrees(angles[max_grad_idx]):.2f} deg)")
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