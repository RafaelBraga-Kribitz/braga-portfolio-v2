---
title: Stochastic Gradient Descent (SGD)
date: '2026-04-16'
wordCount: 957
slug: stochastic_gradient_descent_sgd
permalink: /notes/04_calculus_optimization/continuous_optimization/advanced_optimizers_stochastic_and_adaptive/stochastic_gradient_descent_sgd/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\theta_{t+1} = \theta_t - \eta \nabla_\theta L(\theta_t; x^{(i)}, y^{(i)})$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Stochastic Gradient Descent (SGD) updates model parameters $\theta$ using the gradient of the loss computed on a single training sample $(x^{(i)}, y^{(i)})$ rather than the full dataset. The gradient $\nabla_\theta L(\theta_t; x^{(i)}, y^{(i)})$ is a noisy estimate of the true gradient $\nabla_\theta \mathbb{E}[L]$; its expectation over random sample selection equals the true gradient. This noise is not only tolerated but is deliberately beneficial in deep learning: it acts as regularization (implicit noise prevents sharp minima), helps escape saddle points, and makes each update $O(1)$ in computation rather than $O(n)$ for full-batch GD. In DA/DS: SGD (and its mini-batch generalization) is the engine behind training all large-scale neural networks, word embeddings, matrix factorization systems, and online learning systems.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Initialize theta, learning rate eta, batch size B"] A --> B["Shuffle training data"] B --> C["Sample one mini-batch of size B: {(x^(i), y^(i))}"] C --> D["Compute stochastic gradient: g_t = nabla_theta L(theta; mini-batch)"] D --> E["Update: theta_{t+1} = theta_t - eta * g_t"] E --> F["Next mini-batch"] F --> G{"Epoch complete?"} G -->|"YES"| H["Reshuffle; check convergence"] G -->|"NO"| C H --> I{"Converged / max epochs?"} I -->|"YES"| J["Return theta*"] I -->|"NO"| B
```
### Real-World use:
#### Situation it is used
Training neural networks (image classifiers, language models, recommendation systems), online learning (update model with each new user action), large-scale logistic regression on streaming data, word2vec training, matrix factorization for collaborative filtering.
#### Problem it solves
Full-batch gradient descent requires a full pass over all $n$ training samples to compute one gradient — infeasible for $n = 10^7$ or larger. SGD uses just $B$ samples per update ($B=1$ to $B=256$ typically), reducing each update from $O(n)$ to $O(B)$. With $n/B$ updates per epoch, SGD makes progress much faster in wall-clock time.
#### How it solves the problem
$\mathbb{E}_{i}[\nabla_\theta L(\theta; x^{(i)}, y^{(i)})] = \nabla_\theta \mathbb{E}[L] = \nabla_\theta L_{\text{full}}(\theta)$. The stochastic gradient is an unbiased estimator of the true gradient. With decreasing learning rate $\eta_t \propto 1/\sqrt{t}$ (or appropriate schedule), SGD converges to a neighborhood of the optimum. The noise variance decreases with mini-batch size $B$: $\text{Var}[\hat{g}] \propto 1/B$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS trains a two-tower recommendation model on 10M user-item interactions. Full-batch GD would require loading 10M samples to compute one gradient update. With mini-batch SGD ($B=256$), each update uses 256 samples and takes milliseconds on a GPU. After one epoch (39,062 updates), the model has already seen all training data once. After 20 epochs (~780k total updates), the model converges to AUC 0.91.
### The Formula (Fragment-First)
- $\theta_{t+1}$: updated parameter vector after step $t$
- $\theta_t$: current parameter vector
- $\eta$: learning rate (step size); key hyperparameter; constant or decaying
- $\nabla_\theta$: gradient with respect to all parameters $\theta$
- $L(\theta_t; x^{(i)}, y^{(i)})$: loss evaluated on single sample $(x^{(i)}, y^{(i)})$; a scalar
- $\nabla_\theta L(\theta_t; x^{(i)}, y^{(i)})$: gradient of the loss for sample $i$; noisy but unbiased
- $i$ is randomly sampled (with or without replacement) at each step
- Mini-batch SGD: average gradient over $B$ samples: $\frac{1}{B}\sum_{j \in \text{batch}} \nabla_\theta L(\theta; x^{(j)}, y^{(j)})$ ### Formula-to-English Translation
"Take one (or a mini-batch of) training example(s), compute how the loss changes with respect to each parameter, and nudge the parameters a small step in the opposite direction. Repeat for millions of steps, cycling through the training data multiple times." Tiny example: $L(\theta; x^{(i)}) = (\theta x^{(i)} - y^{(i)})^2$, $x^{(i)} = 2$, $y^{(i)} = 3$, $\theta_0 = 0$, $\eta = 0.1$.
$L(\theta; 2) = (2\theta - 3)^2$.
$\nabla_\theta L = 2 \cdot 2 \cdot (2\theta - 3) = 4(2 \cdot 0 - 3) = -12$.
$\theta_1 = 0 - 0.1 \cdot (-12) = 1.2$.
$L(\theta_1; 2) = (2.4 - 3)^2 = 0.36$. Decreased from $9.0$. $\checkmark$ ### Critical Concepts
- **Noise as regularization:** SGD's gradient noise has a covariance proportional to the batch gradient covariance / $B$. This noise penalizes sharp minima (high curvature) more than flat minima, leading to flatter solutions that generalize better ("flat minima" conjecture for deep learning).
- **SGD vs mini-batch SGD:** mini-batch with $B > 1$ reduces gradient variance by $1/B$ and enables GPU parallelism. In practice, $B \in \{32, 64, 128, 256\}$ are standard. Larger batches give less noise but may generalize worse (sharp minima).
- **Learning rate schedules:** constant $\eta$: SGD converges to a neighborhood of the optimum (noise floor); decaying $\eta_t$: converges exactly (but too slow to reach optimum fast). Common: linear warmup + cosine decay, or $\eta_t = \eta_0 / (1 + \gamma t)$.
- **SGD vs Adam:** SGD with fixed $\eta$ is hard to tune; Adam adapts the per-parameter learning rate. For large-scale NLP/vision, AdamW (Adam + weight decay) dominates. For fine-tuning large models, SGD with momentum and carefully tuned $\eta$ sometimes outperforms Adam.
- **Convergence:** for convex $f$ with SGD: $\mathbb{E}[f(\bar\theta_T) - f(\theta^*)] \le O(1/\sqrt{T})$ with $\eta_t \propto 1/\sqrt{t}$, where $\bar\theta_T = \frac{1}{T}\sum_t \theta_t$ (averaged iterate). For non-convex: convergence to $\mathbb{E}[\|\nabla f\|^2] \le O(1/\sqrt{T})$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Two samples: $(x^{(1)}, y^{(1)}) = (1, 2)$, $(x^{(2)}, y^{(2)}) = (3, 4)$. Loss $L(\theta; x, y) = (\theta x - y)^2$. $\theta_0 = 0$, $\eta = 0.1$. Run 3 SGD steps (order: sample 1, sample 2, sample 1).* $\nabla_\theta L(\theta; x, y) = 2x(\theta x - y) = 2x^2\theta - 2xy$. *Step 1 (sample 1):* $\nabla = 2 \cdot 1 \cdot (0 \cdot 1 - 2) = -4$. $\theta_1 = 0 - 0.1(-4) = 0.4$.
*Step 2 (sample 2):* $\nabla = 2 \cdot 3 \cdot (0.4 \cdot 3 - 4) = 6(1.2-4) = -16.8$. $\theta_2 = 0.4 + 1.68 = 2.08$.
*Step 3 (sample 1):* $\nabla = 2 \cdot 1 \cdot (2.08 - 2) = 0.16$. $\theta_3 = 2.08 - 0.016 = 2.064$. True optimum for sample 1: $\theta^* = 2$; for sample 2: $\theta^* = 4/3 \approx 1.33$; overall minimum of $\frac{1}{2}[(\theta-2)^2 + (3\theta-4)^2]$ at $\theta^* = 7/5 = 1.4$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def sgd_step( theta: np.ndarray, grad: np.ndarray, learning_rate: float,
) -> np.ndarray: """Single SGD update step.""" return theta - learning_rate * grad def compute_gradient(theta: np.ndarray, x: np.ndarray, y: float) -> np.ndarray: """Gradient of squared loss L(theta; x, y) = (theta^T x - y)^2.""" residual = float(theta @ x) - y return 2 * residual * x np.random.seed(42)
n, d = 200, 5
X = np.random.randn(n, d)
true_theta = np.array([1.5, -1.0, 0.5, 0.2, -0.8])
y = X @ true_theta + 0.3 * np.random.randn(n) theta = np.zeros(d)
LEARNING_RATE = 0.01
N_EPOCHS = 10
BATCH_SIZE = 16 loss_history = []
for epoch in range(N_EPOCHS): perm = np.random.permutation(n) epoch_loss = 0.0 for start in range(0, n, BATCH_SIZE): batch_idx = perm[start:start + BATCH_SIZE] X_batch = X[batch_idx] y_batch = y[batch_idx] # Mini-batch gradient (average over batch) grad = sum(compute_gradient(theta, X_batch[j], y_batch[j]) for j in range(len(batch_idx))) / len(batch_idx) theta = sgd_step(theta, grad, LEARNING_RATE) epoch_loss += np.mean((X_batch @ theta - y_batch)**2) loss_history.append(epoch_loss / (n // BATCH_SIZE)) print(f"Epoch {epoch+1:>2}: train MSE = {loss_history[-1]:.4f}") print(f"\nEstimated theta: {theta.round(3)}")
print(f"True theta: {true_theta}")
```
#### Beginner friendly Example [R])
``` r
# Stochastic Gradient Descent for linear regression
sgd_linear <- function(X, y, lr = 0.01, n_epochs = 10, batch_size = 16) { n <- nrow(X); d <- ncol(X) theta <- numeric(d) loss_history <- numeric(n_epochs) for (epoch in seq_len(n_epochs)) { perm <- sample(n) total_loss <- 0; n_batches <- 0 for (start in seq(1, n, by = batch_size)) { idx <- perm[start:min(start + batch_size - 1, n)] X_b <- X[idx, , drop = FALSE] y_b <- y[idx] residuals <- X_b %*% theta - y_b grad <- 2 * t(X_b) %*% residuals / length(idx) theta <- theta - lr * grad total_loss <- total_loss + mean(residuals^2) n_batches <- n_batches + 1 } loss_history[epoch] <- total_loss / n_batches cat(sprintf("Epoch %2d: MSE = %.4f\n", epoch, loss_history[epoch])) } list(theta = theta, loss = loss_history)
} set.seed(42)
n <- 200; d <- 5
X <- matrix(rnorm(n * d), n, d)
true_theta <- c(1.5, -1.0, 0.5, 0.2, -0.8)
y <- X %*% true_theta + 0.3 * rnorm(n) result <- sgd_linear(X, y, lr = 0.01, n_epochs = 10)
cat(sprintf("Estimated: %s\n", paste(round(result$theta, 3), collapse = ", ")))
cat(sprintf("True: %s\n", paste(true_theta, collapse = ", ")))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score np.random.seed(42) # -- SGD with learning rate schedule for logistic regression ------------------
N, D = 5000, 20
X_raw, y_raw = make_classification( n_samples=N, n_features=D, n_informative=10, random_state=42
)
scaler = StandardScaler()
X = scaler.fit_transform(X_raw)
y = y_raw * 2 - 1 # {-1, +1} # Hyperparameters
BATCH_SIZE = 64
N_EPOCHS = 30
ETA_0 = 0.1
LAMBDA_REG = 0.001 # Learning rate schedule: polynomial decay eta_t = eta_0 / (1 + gamma*t)
DECAY_GAMMA = 0.01 def sigmoid(z: np.ndarray) -> np.ndarray: return 1.0 / (1.0 + np.exp(-np.clip(z, -50, 50))) def logistic_grad(theta: np.ndarray, X_b: np.ndarray, y_b: np.ndarray) -> np.ndarray: margins = y_b * (X_b @ theta) weights = -y_b * sigmoid(-margins) return X_b.T @ weights / len(y_b) + LAMBDA_REG * theta def auc_score(theta: np.ndarray) -> float: return roc_auc_score(y_raw, X @ theta) theta = np.zeros(D)
n_updates = 0
auc_history = [] for epoch in range(N_EPOCHS): perm = np.random.permutation(N) for start in range(0, N, BATCH_SIZE): batch_idx = perm[start:start + BATCH_SIZE] X_batch = X[batch_idx] y_batch = y[batch_idx] # Decaying learning rate eta_t = ETA_0 / (1 + DECAY_GAMMA * n_updates) # SGD update g = logistic_grad(theta, X_batch, y_batch) theta = theta - eta_t * g n_updates += 1 auc = auc_score(theta) auc_history.append(auc) if (epoch + 1) % 5 == 0: eta_current = ETA_0 / (1 + DECAY_GAMMA * n_updates) print(f"Epoch {epoch+1:>3}: AUC = {auc:.4f}, eta = {eta_current:.5f}") print(f"\nTotal SGD updates: {n_updates}")
print(f"Final AUC: {auc_history[-1]:.4f}")
print(f"Updates per epoch: {N // BATCH_SIZE}")
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