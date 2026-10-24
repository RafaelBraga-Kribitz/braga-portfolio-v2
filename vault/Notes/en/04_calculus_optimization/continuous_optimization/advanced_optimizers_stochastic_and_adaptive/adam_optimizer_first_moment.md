---
title: Adam Optimizer (first moment)
date: '2026-04-16'
wordCount: 968
slug: adam_optimizer_first_moment
permalink: /notes/04_calculus_optimization/continuous_optimization/advanced_optimizers_stochastic_and_adaptive/adam_optimizer_first_moment/index.html
share_status: draft
publish_target: note
boundary: public
---
# $m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the first moment update in Adam (Adaptive Moment Estimation). $m_t$ is an exponentially weighted moving average (EWMA) of gradients: it accumulates gradient history, with recent gradients weighted more heavily (controlled by $\beta_1 \in (0,1)$, typically $0.9$). Intuitively, $m_t$ is a smoothed, "momentum-carrying" gradient estimate. At step $t$, $(1-\beta_1)\sum_{k=1}^t \beta_1^{t-k} g_k$ — older gradients decay exponentially. In DA/DS: $m_t$ is the numerator term in the Adam update (first moment = mean of gradients), analogous to classical momentum but normalized. Together with the second moment $v_t$ (variance), it provides Adam's adaptive learning rate for each parameter.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Initialize: m_0 = 0, beta_1 (e.g., 0.9)"] A --> B["At step t: compute gradient g_t = nabla L(theta_t)"] B --> C["Update first moment: m_t = beta_1 * m_{t-1} + (1-beta_1) * g_t"] C --> D["Bias correction: m_hat_t = m_t / (1 - beta_1^t)"] D --> E["m_hat_t approximates the true mean of gradients"] E --> F["Use m_hat_t in Adam update: theta_{t+1} = theta_t - eta * m_hat_t / (sqrt(v_hat_t) + eps)"] C --> G["When beta_1 close to 1: m_t changes slowly (heavy averaging)"] C --> H["When beta_1 close to 0: m_t tracks g_t closely (weak averaging)"]
```
### Real-World use:
#### Situation it is used
Adam optimizer in all modern deep learning frameworks (PyTorch `torch.optim.Adam`, TensorFlow `tf.keras.optimizers.Adam`), fine-tuning transformers (BERT, GPT), training CNNs on image data, embedding learning, NLP language models. The first moment $m_t$ is also used independently as the "momentum" component in momentum SGD and Nesterov momentum.
#### Problem it solves
Raw gradients $g_t$ are noisy (single-batch estimates), oscillate across steps, and can vary wildly in magnitude across parameters. Using the raw gradient directly (pure SGD) requires careful learning rate tuning and often oscillates. The EWMA $m_t$ smooths out the noise, providing a more stable direction for the parameter update while preserving directional information accumulated over recent history.
#### How it solves the problem
The EWMA formula $m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t$ is a recursive filter: at each step, it blends 90% of the old momentum with 10% of the new gradient (at $\beta_1 = 0.9$). This gives $m_t = (1-\beta_1)\sum_{k=0}^{t-1} \beta_1^k g_{t-k}$, an exponentially decaying sum over past gradients. The bias correction $\hat{m}_t = m_t / (1-\beta_1^t)$ corrects for the initialization at zero (at $t=1$: $m_1 = (1-\beta_1)g_1$, which is smaller than $g_1$; dividing by $(1-\beta_1)$ recovers $g_1$).
#### Example of it used in the Working Context as DA/DS for a Business
A DS trains a transformer for text classification. At step $t = 500$: $m_{500}$ has accumulated a smoothed direction from the past 500 gradient updates. With $\beta_1 = 0.9$, the effective window is roughly $1/(1-\beta_1) = 10$ steps. At initialization ($t$ small), bias correction is critical: without it, $m_1 = 0.1 g_1 \ll g_1$, making the first update too small.
### The Formula (Fragment-First)
- $m_t$: first moment estimate at step $t$; a vector of same dimension as $\theta$ (and $g_t$)
- $\beta_1$: exponential decay rate for the first moment; typical value $0.9$; $\beta_1 \in (0, 1)$
- $m_{t-1}$: previous first moment estimate; initialized at $m_0 = \mathbf{0}$
- $g_t$: gradient at step $t$; $g_t = \nabla_\theta L(\theta_{t-1})$
- $(1-\beta_1)$: weight of the current gradient; equals $0.1$ when $\beta_1 = 0.9$
- EWMA expansion: $m_t = (1-\beta_1)[g_t + \beta_1 g_{t-1} + \beta_1^2 g_{t-2} + \ldots]$
- Bias correction: $\hat{m}_t = m_t / (1 - \beta_1^t)$; corrects for zero initialization
- Effective window: $\approx 1/(1-\beta_1)$ steps; at $\beta_1 = 0.9$: ~10 steps; at $\beta_1 = 0.99$: ~100 steps ### Formula-to-English Translation
"Keep a running average of past gradients. At each step, blend 90% of your current average with 10% of the new gradient. This gives a smoothed gradient direction that remembers history while staying responsive to recent changes." Tiny trace: $g_1 = 2$, $g_2 = -1$, $g_3 = 3$. $\beta_1 = 0.9$.
$m_0 = 0$.
$m_1 = 0.9 \cdot 0 + 0.1 \cdot 2 = 0.2$.
$m_2 = 0.9 \cdot 0.2 + 0.1 \cdot (-1) = 0.18 - 0.1 = 0.08$.
$m_3 = 0.9 \cdot 0.08 + 0.1 \cdot 3 = 0.072 + 0.3 = 0.372$. Bias corrected:
$\hat{m}_1 = 0.2 / (1 - 0.9) = 2.0 = g_1$ (correct).
$\hat{m}_2 = 0.08 / (1 - 0.81) = 0.08 / 0.19 \approx 0.421$.
$\hat{m}_3 = 0.372 / (1 - 0.729) = 0.372 / 0.271 \approx 1.37$.
### Critical Concepts
- **EWMA vs simple moving average:** EWMA never forgets (exponential decay, not a window), updates in $O(1)$ per step (no storage of history), and weights recent gradients more. Simple MA requires storing a window and gives equal weight to all samples in it.
- **Bias correction necessity:** at $t=1$: without correction, $m_1 = (1-\beta_1)g_1 = 0.1 g_1$ for $\beta_1 = 0.9$. This makes the first 10 updates effectively 10x smaller than they should be, causing very slow initial progress. The correction $\hat{m}_t = m_t / (1-\beta_1^t)$ fixes this by scaling up the early estimates.
- **$\beta_1$ sensitivity:** higher $\beta_1$ (e.g., $0.99$) gives smoother but slower-to-respond estimates; lower $\beta_1$ (e.g., $0.5$) reacts quickly but with more noise. The default $0.9$ is a reliable empirical choice.
- **Per-parameter computation:** $m_t$ is computed element-wise for each parameter independently. A model with $10^9$ parameters has $10^9$ EWMA values tracked simultaneously.
- **Adam vs SGD+momentum:** classical momentum: $v_t = \beta v_{t-1} + g_t$ (without the $(1-\beta)$ scaling and without bias correction). Adam's $m_t$ includes the $(1-\beta_1)$ factor to ensure $\mathbb{E}[m_t] \approx \mathbb{E}[g_t]$ (unbiased after correction).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Compute $m_t$ and $\hat{m}_t$ for 5 gradient steps. $\beta_1 = 0.9$, gradients: $g = [0.5, -0.3, 0.8, 0.2, -0.6]$.* | $t$ | $g_t$ | $m_t = 0.9 m_{t-1} + 0.1 g_t$ | $1-\beta_1^t$ | $\hat{m}_t = m_t / (1-\beta_1^t)$ |
|-----|--------|-------------------------------|----------------|-------------------------------------|
| 1 | 0.500 | 0.050 | 0.100 | 0.500 |
| 2 | -0.300 | 0.045 - 0.030 = 0.015 | 0.190 | 0.079 |
| 3 | 0.800 | 0.0135 + 0.080 = 0.0935 | 0.271 | 0.345 |
| 4 | 0.200 | 0.08415 + 0.020 = 0.1042 | 0.344 | 0.303 |
| 5 | -0.600 | 0.09375 - 0.060 = 0.0338 | 0.410 | 0.082 | ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def ewma_first_moment( gradients: list, beta1: float = 0.9,
) -> tuple: """Compute EWMA first moment m_t and bias-corrected m_hat_t.""" m = 0.0 moments, moments_corrected = [], [] for t, g in enumerate(gradients, start=1): m = beta1 * m + (1 - beta1) * g m_hat = m / (1 - beta1**t) moments.append(m) moments_corrected.append(m_hat) return moments, moments_corrected # Example: 10 gradient steps with oscillating gradients
gradients = [0.5, -0.3, 0.8, 0.2, -0.6, 1.0, -0.4, 0.7, 0.1, -0.2] m_raw, m_corrected = ewma_first_moment(gradients, beta1=0.9) print(f"{'t':>3} {'g_t':>8} {'m_t (raw)':>12} {'m_hat_t (corrected)':>20}")
for t, (g, m, mh) in enumerate(zip(gradients, m_raw, m_corrected), start=1): print(f"{t:>3} {g:>8.3f} {m:>12.5f} {mh:>20.5f}") print(f"\nBias correction effect at t=1: m_1={m_raw[0]:.4f}, m_hat_1={m_corrected[0]:.4f}")
print(f"(m_hat_1 should equal g_1 = {gradients[0]})")
```
#### Beginner friendly Example [R])
``` r
# Adam first moment: EWMA of gradients with bias correction
ewma_first_moment <- function(gradients, beta1 = 0.9) { m <- 0 m_list <- numeric(length(gradients)) mhat_list <- numeric(length(gradients)) for (t in seq_along(gradients)) { m <- beta1 * m + (1 - beta1) * gradientst m_hat <- m / (1 - beta1^t) m_list[t] <- m mhat_list[t] <- m_hat } list(m = m_list, m_hat = mhat_list)
} grads <- c(0.5, -0.3, 0.8, 0.2, -0.6, 1.0, -0.4, 0.7, 0.1, -0.2)
result <- ewma_first_moment(grads, beta1 = 0.9) cat(sprintf("%-3s %-8s %-12s %-20s\n", "t", "g_t", "m_t (raw)", "m_hat_t (corrected)"))
for (t in seq_along(grads)) { cat(sprintf("%-3d %-8.3f %-12.5f %-20.5f\n", t, grads[t], result$m[t], result$m_hat[t]))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np np.random.seed(42) # -- Full Adam optimizer implementation using first and second moments --------
# Focus: illustrate m_t's role vs raw gradient noise class AdamOptimizer: """Adam optimizer: theta_update = -eta * m_hat / (sqrt(v_hat) + eps).""" def __init__( self, learning_rate: float = 0.001, beta1: float = 0.9, beta2: float = 0.999, epsilon: float = 1e-8, ) -> None: self.learning_rate = learning_rate self.beta1 = beta1 self.beta2 = beta2 self.epsilon = epsilon self.m: np.ndarray | None = None self.v: np.ndarray | None = None self.t = 0 def step(self, theta: np.ndarray, gradient: np.ndarray) -> np.ndarray: if self.m is None: self.m = np.zeros_like(theta) self.v = np.zeros_like(theta) self.t += 1 # First moment (mean of gradients): EWMA self.m = self.beta1 * self.m + (1 - self.beta1) * gradient # Second moment (uncentered variance): EWMA of squared gradients self.v = self.beta2 * self.v + (1 - self.beta2) * gradient**2 # Bias corrections m_hat = self.m / (1 - self.beta1**self.t) v_hat = self.v / (1 - self.beta2**self.t) # Parameter update return theta - self.learning_rate * m_hat / (np.sqrt(v_hat) + self.epsilon) # Compare Adam vs SGD on noisy quadratic with added per-parameter noise
D = 10
TRUE_OPTIMUM = np.ones(D) * 3.0 # known optimum def noisy_gradient(theta: np.ndarray, noise_std: float = 0.5) -> np.ndarray: """Gradient of f(theta) = ||theta - 3||^2 with Gaussian noise.""" true_grad = 2 * (theta - TRUE_OPTIMUM) noise = np.random.randn(D) * noise_std return true_grad + noise N_STEPS = 500
LEARNING_RATE = 0.01 theta_adam = np.zeros(D)
theta_sgd = np.zeros(D)
adam = AdamOptimizer(learning_rate=LEARNING_RATE) adam_errors = []
sgd_errors = [] for step in range(N_STEPS): g = noisy_gradient(theta_adam) theta_adam = adam.step(theta_adam, g) g_sgd = noisy_gradient(theta_sgd) theta_sgd -= LEARNING_RATE * g_sgd adam_errors.append(float(np.linalg.norm(theta_adam - TRUE_OPTIMUM))) sgd_errors.append(float(np.linalg.norm(theta_sgd - TRUE_OPTIMUM))) print(f"Optimization results (D={D}, true optimum = all 3's)")
print(f"{'Step':>6} {'Adam error':>12} {'SGD error':>12}")
for step in [49, 99, 199, 499]: print(f"{step+1:>6} {adam_errors[step]:>12.5f} {sgd_errors[step]:>12.5f}") print(f"\nAdam first moment (m_hat) at final step:")
m_hat_final = adam.m / (1 - adam.beta1**adam.t)
print(f" m_hat (should be ~0 at optimum): {m_hat_final.round(4)}")
print(f" ||theta - optimum|| Adam: {adam_errors[-1]:.5f}")
print(f" ||theta - optimum|| SGD: {sgd_errors[-1]:.5f}")
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