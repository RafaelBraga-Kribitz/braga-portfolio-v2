---
title: Adam Optimizer (parameter update)
date: '2026-04-16'
wordCount: 1065
slug: adam_optimizer_parameter_update
permalink: /notes/04_calculus_optimization/continuous_optimization/advanced_optimizers_stochastic_and_adaptive/adam_optimizer_parameter_update/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon}\hat{m}_t$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the full Adam parameter update rule — the equation that actually moves the model weights at each training step. It combines the bias-corrected first moment $\hat{m}_t$ (smoothed gradient direction) and bias-corrected second moment $\hat{v}_t$ (gradient scale) to compute a per-parameter adaptive step. The fraction $\eta / (\sqrt{\hat{v}_t} + \epsilon)$ is the effective per-parameter learning rate: large for parameters with small historical gradients (rare features) and small for parameters with large historical gradients (frequently updated weights). $\epsilon \approx 10^{-8}$ prevents division by zero. In DA/DS: this single equation is what `torch.optim.Adam.step()` executes internally; understanding it explains why Adam outperforms SGD on sparse/heterogeneous problems and why learning rate tuning with Adam is less sensitive than with plain SGD.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Compute gradient: g_t = nabla L(theta_t)"] A --> B["First moment: m_t = beta1*m_{t-1} + (1-beta1)*g_t"] A --> C["Second moment: v_t = beta2*v_{t-1} + (1-beta2)*g_t^2"] B --> D["Bias correct: m_hat_t = m_t / (1 - beta1^t)"] C --> E["Bias correct: v_hat_t = v_t / (1 - beta2^t)"] D --> F["Adaptive LR: eta_t = eta / (sqrt(v_hat_t) + eps)"] E --> F F --> G["Parameter update: theta_{t+1} = theta_t - eta_t * m_hat_t"] G --> H["t = t + 1, repeat until convergence"] F --> I["Large v_hat_t: small step (noisy/large gradient parameter)"] F --> J["Small v_hat_t: large step (sparse/small gradient parameter)"]
```
### Real-World use:
#### Situation it is used
Default optimizer for training transformers (BERT, GPT, T5), CNNs, RNNs, embedding models, recommendation systems. `torch.optim.Adam`, `tf.keras.optimizers.Adam`, `optax.adam` all implement this exact update. Also used in: AdamW (Adam + weight decay), LAMB (Adam + layer-wise normalization for large-batch training), Nadam (Adam + Nesterov momentum).
#### Problem it solves
Plain SGD uses a single global learning rate for all parameters, which is suboptimal when gradients vary widely in scale across layers and parameters (sparse embeddings vs dense final layers). A single $\eta$ too large causes instability in high-gradient parameters; too small causes slow convergence in low-gradient parameters. Adam's per-parameter effective learning rate $\eta / (\sqrt{\hat{v}_t} + \epsilon)$ automatically calibrates the step to each parameter's gradient history.
#### How it solves the problem
The update $\theta_{t+1} = \theta_t - [\eta / (\sqrt{\hat{v}_t} + \epsilon)] \hat{m}_t$ is element-wise. For each parameter $\theta_j$: the effective LR is $\eta_j = \eta / (\sqrt{\hat{v}_{t,j}} + \epsilon)$. If parameter $j$ has consistently large gradients (large $\hat{v}_{t,j}$), $\eta_j$ is small. If parameter $j$ has small/infrequent gradients (small $\hat{v}_{t,j}$), $\eta_j$ is large. Combined with the smoothed gradient direction $\hat{m}_t$ from the first moment, this gives both noise reduction and per-parameter scaling.
#### Example of it used in the Working Context as DA/DS for a Business
A DS fine-tunes BERT for sentiment analysis on customer reviews. The embedding layer (vocab size 30k) has sparse gradients: most token embeddings receive zero gradient per batch. Adam ensures rare-token embeddings still train effectively via large effective LR. The classifier head (small dense layer) receives large dense gradients: Adam reduces its effective LR to prevent overshooting. Hyperparameter defaults: $\eta = 2 \times 10^{-5}$, $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$ (standard for transformer fine-tuning).
### The Formula (Fragment-First)
- $\theta_{t+1}$: updated parameter vector after step $t$
- $\theta_t$: current parameter vector
- $\eta$: global base learning rate; scalar; typically $10^{-3}$ (default) or $10^{-5}$ to $10^{-4}$ for fine-tuning
- $\hat{v}_t$: bias-corrected second moment; $\hat{v}_t = v_t / (1-\beta_2^t)$; approximates $\mathbb{E}[g_t^2]$
- $\sqrt{\hat{v}_t}$: element-wise square root; converts variance to standard-deviation scale
- $\epsilon$: numerical stability constant; typically $10^{-8}$; prevents division by zero when $\hat{v}_t \approx 0$
- $\hat{m}_t$: bias-corrected first moment; $\hat{m}_t = m_t/(1-\beta_1^t)$; approximates $\mathbb{E}[g_t]$
- $\frac{\eta}{\sqrt{\hat{v}_t}+\epsilon}$: effective per-parameter learning rate; adapts to gradient scale history
- $\frac{\eta}{\sqrt{\hat{v}_t}+\epsilon}\hat{m}_t$: the actual parameter update delta; both direction (from $\hat{m}_t$) and magnitude (from adaptive LR)
- Approximate magnitude: when gradient is approximately constant $c$, effective LR $\approx \eta/|c|$; updates scale to $\sim \eta \cdot \text{sign}(g)$ regardless of $|c|$ ### Formula-to-English Translation
"Move the parameter by a step whose direction is the smoothed gradient $\hat{m}_t$ and whose magnitude is scaled by the inverse of the typical gradient size $\sqrt{\hat{v}_t}$. Large gradients get small steps; small gradients get large steps. This keeps all parameter updates roughly the same order of magnitude regardless of per-parameter gradient scale." Tiny trace: 1 scalar parameter, $\theta_0 = 1.0$, $g_1 = 0.5$. $\eta = 0.001$, $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$.
$m_1 = 0.9 \cdot 0 + 0.1 \cdot 0.5 = 0.05$. $\hat{m}_1 = 0.05 / 0.1 = 0.5$.
$v_1 = 0.999 \cdot 0 + 0.001 \cdot 0.25 = 0.00025$. $\hat{v}_1 = 0.00025 / 0.001 = 0.25$.
$\theta_2 = 1.0 - \frac{0.001}{\sqrt{0.25} + 10^{-8}} \cdot 0.5 = 1.0 - \frac{0.001}{0.5} \cdot 0.5 = 1.0 - 0.001 = 0.999$.
### Critical Concepts
- **Approximate sign update:** When $\hat{m}_t$ and $\hat{v}_t$ have stabilized, the update $\approx \eta \cdot \hat{m}_t / \sqrt{\hat{v}_t} \approx \eta \cdot \text{sign}(g_t)$ for roughly stationary gradients. Adam is sometimes described as an approximate sign-gradient method with adaptive noise suppression.
- **AdamW vs Adam:** Adam's weight decay is implemented by adding $\lambda \theta_t$ to the gradient before the update, which entangles weight decay with the adaptive LR normalization. AdamW decouples it: $\theta_{t+1} = \theta_t(1-\eta\lambda) - [\eta/(\sqrt{\hat{v}_t}+\epsilon)]\hat{m}_t$. AdamW is the standard for transformer training (Loshchilov & Hutter, 2019).
- **Learning rate sensitivity:** Adam is less sensitive to learning rate than SGD, but still requires tuning $\eta$. Too large: unstable training, NaN losses. Too small: extremely slow convergence. The $\eta$ in Adam sets the maximum effective update magnitude.
- **$\epsilon$ placement:** two conventions exist: $\eta/(\sqrt{\hat{v}_t}+\epsilon)$ (original Adam paper) vs $\eta/\sqrt{\hat{v}_t+\epsilon}$ (epsilon inside sqrt). The original is more common in practice; the inner version is slightly more numerically stable at near-zero $\hat{v}_t$.
- **Convergence in non-convex settings:** Adam does not guarantee convergence in general non-convex settings (AMSGrad was proposed as a fix). In practice, Adam converges reliably for deep learning despite the lack of theoretical guarantees.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Run 3 Adam steps on scalar $\theta$. $\eta = 0.01$, $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$. Gradients: $g = [0.5, -0.3, 0.8]$.* | $t$ | $g_t$ | $m_t$ | $\hat{m}_t$ | $v_t$ | $\hat{v}_t$ | eff LR | $\Delta\theta$ | $\theta_t$ |
|-----|--------|--------|------------|--------|------------|--------|----------------|------------|
| 0 | — | 0 | — | 0 | — | — | — | 1.000 |
| 1 | 0.500 | 0.050 | 0.500 | 0.000250 | 0.2500 | 0.0200 | -0.01000 | 0.990 |
| 2 | -0.300 | 0.015 | 0.079 | 0.000340 | 0.1701 | 0.0243 | -0.00192 | 0.988 |
| 3 | 0.800 | 0.0935 | 0.345 | 0.001000 | 0.3337 | 0.0173 | -0.00597 | 0.982 | At $t=1$: eff LR $= 0.01 / (\sqrt{0.25} + 10^{-8}) = 0.01 / 0.5 = 0.02$. $\Delta\theta = -0.02 \cdot 0.5 = -0.01$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def adam_update( theta: float, gradient: float, m_prev: float, v_prev: float, t: int, eta: float = 0.001, beta1: float = 0.9, beta2: float = 0.999, epsilon: float = 1e-8,
) -> tuple: """Single Adam parameter update step. Returns (theta_new, m_new, v_new).""" m_new = beta1 * m_prev + (1 - beta1) * gradient v_new = beta2 * v_prev + (1 - beta2) * gradient**2 m_hat = m_new / (1 - beta1**t) v_hat = v_new / (1 - beta2**t) effective_lr = eta / (np.sqrt(v_hat) + epsilon) theta_new = theta - effective_lr * m_hat return theta_new, m_new, v_new, m_hat, v_hat, effective_lr # Trace Adam on f(theta) = theta^2, starting at theta = 2.0
theta, m, v = 2.0, 0.0, 0.0
ETA = 0.1 print(f"{'t':>3} {'theta':>8} {'g_t':>8} {'m_hat':>8} {'v_hat':>8} {'eff_LR':>8}")
for step in range(1, 16): g = 2 * theta # gradient of theta^2 theta, m, v, m_hat, v_hat, eff_lr = adam_update( theta, g, m, v, step, eta=ETA ) if step in [1, 2, 3, 5, 10, 15]: print(f"{step:>3} {theta:>8.5f} {g:>8.5f} {m_hat:>8.5f} {v_hat:>8.5f} {eff_lr:>8.5f}") print(f"\nFinal theta = {theta:.6f} (converging to 0)")
```
#### Beginner friendly Example [R])
``` r
# Adam parameter update: theta_{t+1} = theta_t - eta / (sqrt(v_hat_t) + eps) * m_hat_t
adam_update <- function(theta, grad, m_prev, v_prev, t, eta = 0.001, beta1 = 0.9, beta2 = 0.999, eps = 1e-8) { m_new <- beta1 * m_prev + (1 - beta1) * grad v_new <- beta2 * v_prev + (1 - beta2) * grad^2 m_hat <- m_new / (1 - beta1^t) v_hat <- v_new / (1 - beta2^t) eff_lr <- eta / (sqrt(v_hat) + eps) theta_new <- theta - eff_lr * m_hat list(theta = theta_new, m = m_new, v = v_new, m_hat = m_hat, v_hat = v_hat, eff_lr = eff_lr)
} # Minimize f(theta) = theta^2 from theta_0 = 2
theta <- 2.0
m <- 0.0
v <- 0.0
ETA <- 0.1 cat(sprintf("%-3s %-10s %-10s %-10s\n", "t", "theta", "eff_LR", "g_t"))
for (step in 1:15) { g <- 2 * theta res <- adam_update(theta, g, m, v, step, eta = ETA) theta <- res$theta m <- res$m v <- res$v if (step %in% c(1, 2, 3, 5, 10, 15)) { cat(sprintf("%-3d %-10.5f %-10.5f %-10.5f\n", step, theta, res$eff_lr, g)) }
}
cat(sprintf("\nFinal theta = %.6f (converging to 0)\n", theta))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score np.random.seed(42) # -- Compare Adam vs SGD vs SGD+momentum on logistic regression ----------------
X_raw, y_raw = make_classification( n_samples=2000, n_features=20, n_informative=10, n_redundant=5, random_state=42
)
scaler = StandardScaler()
X = scaler.fit_transform(X_raw)
y = y_raw * 2 - 1 # {-1, +1}
N, D = X.shape
BATCH_SIZE = 64
N_EPOCHS = 30
LAM = 1e-4 # L2 regularization def sigmoid(z: np.ndarray) -> np.ndarray: return 1 / (1 + np.exp(-np.clip(z, -500, 500))) def logistic_gradient(w: np.ndarray, x_batch: np.ndarray, y_batch: np.ndarray) -> np.ndarray: logits = y_batch * (x_batch @ w) weights = sigmoid(-logits) return -x_batch.T @ (y_batch * weights) / len(y_batch) + 2 * LAM * w def run_optimizer(optimizer_name: str, eta: float = 0.01) -> list: w = np.zeros(D) m = np.zeros(D) v = np.zeros(D) vel = np.zeros(D) t = 0 auc_history = [] for epoch in range(N_EPOCHS): perm = np.random.permutation(N) for start in range(0, N, BATCH_SIZE): idx = perm[start:start + BATCH_SIZE] g = logistic_gradient(w, X[idx], y[idx]) t += 1 if optimizer_name == "adam": m = 0.9 * m + 0.1 * g v = 0.999 * v + 0.001 * g**2 m_hat = m / (1 - 0.9**t) v_hat = v / (1 - 0.999**t) # Full Adam update: theta_{t+1} = theta_t - eta/(sqrt(v_hat)+eps)*m_hat w = w - eta / (np.sqrt(v_hat) + 1e-8) * m_hat elif optimizer_name == "sgd_momentum": vel = 0.9 * vel - eta * g w = w + vel else: # plain sgd w = w - eta * g y_score = sigmoid(X @ w) auc_history.append(roc_auc_score(y_raw, y_score)) return auc_history auc_adam = run_optimizer("adam", eta=0.01)
auc_momentum = run_optimizer("sgd_momentum", eta=0.01)
auc_sgd = run_optimizer("sgd", eta=0.01) print("Adam vs SGD+Momentum vs SGD — Logistic Regression (AUC)")
print(f"{'Epoch':>6} {'Adam':>8} {'Momentum':>10} {'SGD':>8}")
for ep in [4, 9, 14, 19, 29]: print(f"{ep+1:>6} {auc_adam[ep]:>8.4f} {auc_momentum[ep]:>10.4f} {auc_sgd[ep]:>8.4f}") print(f"\nFinal AUC:")
print(f" Adam: {auc_adam[-1]:.4f}")
print(f" SGD+Momentum: {auc_momentum[-1]:.4f}")
print(f" SGD: {auc_sgd[-1]:.4f}")
print(f"\nAdam update: theta_{{t+1}} = theta_t - eta/(sqrt(v_hat_t)+eps) * m_hat_t")
print(f" eta = 0.01, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8")
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