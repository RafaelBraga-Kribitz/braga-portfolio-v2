---
title: Cross-Entropy
date: '2026-04-16'
wordCount: 652
slug: cross_entropy
permalink: /notes/05_probability_stats/multivariable_statistics_and_information/information_theory/cross_entropy/index.html
share_status: draft
publish_target: note
boundary: public
---
# $H(p, q) = - \sum_{x \in \mathcal{X}} p(x) \log q(x)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Cross-entropy $H(p,q)$ measures the average number of bits (or nats) needed to encode outcomes of the true distribution $p$ using a code optimised for distribution $q$. It decomposes as $H(p,q) = H(p) + D_{KL}(p \parallel q)$: the entropy of $p$ (irreducible) plus the KL divergence (the penalty for using the wrong model). In ML, cross-entropy is the standard loss function for classification: the model outputs probabilities $q$, the true labels define $p$ (one-hot), and training minimises $H(p,q)$, which is equivalent to minimising $D_{KL}(p \parallel q)$ since $H(p)$ is fixed.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["True label distribution p (often one-hot)"] --> C["Compute p(x) * log(q(x)) for each class"] B["Model predicted probabilities q (softmax output)"] --> C C --> D["Sum over all classes"] D --> E["Negate: H(p,q) = -sum(p * log(q))"] E --> F["Training: minimise H(p,q) over model parameters"] F --> G["Equivalent to minimising KL(p||q) since H(p) is fixed"]
```
### Real-World use:
#### Situation it is used
Binary classification (logistic regression, neural networks): labels are $\{0,1\}$ and the model outputs $\hat{p}$. The binary cross-entropy loss is $-[y \log \hat{p} + (1-y) \log(1-\hat{p})]$. Multiclass classification: one-hot $p$ and softmax $q$; categorical cross-entropy $= -\sum_k y_k \log \hat{p}_k$.
#### Problem it solves
Training a probabilistic classifier requires a differentiable objective that penalises confident wrong predictions severely and rewards confident correct predictions. Cross-entropy is exactly this: it is large when the model assigns low probability to the true class.
#### How it solves the problem
$-\log q(x_{true})$ is large when $q(x_{true})$ is small (confident wrong prediction). For a correct, confident prediction with $q(x_{true}) \approx 1$, $-\log(1) = 0$. Averaging over the training set and minimising this via gradient descent pushes the model to assign high probability to the correct class.
#### Example of it used in the Working Context as DA/DS for a Business
A logistic regression model predicts customer churn ($y = 1$: churned, $y = 0$: retained). At each training step, the binary cross-entropy loss $= -[y \log \hat{p} + (1-y) \log(1-\hat{p})]$ measures how well the model's probability $\hat{p}$ matches the true label $y$. Minimising this loss trains the model's coefficients.
### The Formula (Fragment-First)
| Symbol | Meaning |
|--------|---------|
| $H(p, q)$ | Cross-entropy between true distribution $p$ and model distribution $q$ |
| $p(x)$ | True probability of outcome $x$ (e.g. one-hot label) |
| $q(x)$ | Model's predicted probability for outcome $x$ |
| $\log q(x)$ | Log-probability assigned by the model |
| $-p(x) \log q(x)$ | Information cost at outcome $x$ using the wrong code | Binary special case: $H(y, \hat{p}) = -[y \log \hat{p} + (1-y) \log(1-\hat{p})]$ Full formula: $H(p, q) = -\sum_{x} p(x) \log q(x)$ Decomposition: $H(p,q) = H(p) + D_{KL}(p \parallel q)$ ### Formula-to-English Translation
"Cross-entropy is the average log-loss: how surprised (on average) the model is when it sees data from the true distribution." Minimising cross-entropy forces the model distribution $q$ to match the true distribution $p$, since the entropy $H(p)$ is fixed.
### Critical Concepts
- **Minimum**: $H(p,q) \ge H(p)$; minimum achieved when $q = p$.
- **Binary cross-entropy**: equivalent to negative log-likelihood of a Bernoulli model.
- **Softmax + cross-entropy**: the standard output layer for multiclass neural networks.
- **Log base**: ML frameworks typically use natural log ($\ln$); results are in nats. Information theory uses $\log_2$ for bits.
- **Numerical stability**: $\log(0)$ is undefined; in practice clip probabilities or use `log_softmax` numerically stable implementations.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
True label: class 1 (one-hot $p = [0, 1, 0]$). Model output: $q = [0.1, 0.7, 0.2]$. *Step 1: Compute each term $-p(x) \log q(x)$*
$-0 \cdot \log(0.1) = 0$
$-1 \cdot \log(0.7) = -\ln(0.7) \approx 0.3567$
$-0 \cdot \log(0.2) = 0$ *Step 2: Sum*
$H(p,q) = 0 + 0.3567 + 0 = 0.3567$ nats *Step 3: Interpret*
If the model had been certain: $q = [0,1,0]$ then $H(p,q) = -\ln(1) = 0$ (perfect). If the model were wrong: $q = [0.1,0.1,0.8]$ then $H(p,q) = -\ln(0.1) \approx 2.30$ nats (high loss).
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # True one-hot labels and model softmax predictions
true_labels = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
predictions = np.array([[0.8, 0.1, 0.1], [0.2, 0.7, 0.1], [0.1, 0.2, 0.7]]) # Cross-entropy per sample (natural log = nats)
epsilon = 1e-9
log_preds = np.log(np.clip(predictions, epsilon, 1.0))
per_sample_ce = -np.sum(true_labels * log_preds, axis=1) print("Per-sample cross-entropy (nats):", per_sample_ce.round(4))
print("Mean cross-entropy loss: ", per_sample_ce.mean().round(4))
```
#### Beginner friendly Example [R])
``` r
# Binary cross-entropy for a single prediction
binary_cross_entropy <- function(y_true, y_pred, epsilon = 1e-9) { y_pred_clipped <- pmax(pmin(y_pred, 1 - epsilon), epsilon) -(y_true * log(y_pred_clipped) + (1 - y_true) * log(1 - y_pred_clipped))
} y_true_vec <- c(1, 0, 1, 1, 0)
y_pred_vec <- c(0.9, 0.2, 0.8, 0.6, 0.4) losses <- mapply(binary_cross_entropy, y_true_vec, y_pred_vec)
cat("Per-sample BCE:", round(losses, 4), "\n")
cat("Mean BCE loss: ", round(mean(losses), 4), "\n")
```
#### Final Professional Example [Python])
``` python
from __future__ import annotations import numpy as np
import pandas as pd EPSILON = 1e-9 # numerical stability floor def categorical_cross_entropy( y_true: np.ndarray, y_pred: np.ndarray,
) -> np.ndarray: # Per-sample categorical cross-entropy loss (nats). # y_true: (n_samples, n_classes) one-hot encoded # y_pred: (n_samples, n_classes) probability predictions log_probs = np.log(np.clip(y_pred, EPSILON, 1.0)) return -np.sum(y_true * log_probs, axis=1) def binary_cross_entropy( y_true: np.ndarray, y_pred: np.ndarray,
) -> np.ndarray: # Per-sample binary cross-entropy loss (nats). y_pred_clipped = np.clip(y_pred, EPSILON, 1.0 - EPSILON) return -(y_true * np.log(y_pred_clipped) + (1 - y_true) * np.log(1 - y_pred_clipped)) def training_loss_summary( y_true: np.ndarray, y_pred: np.ndarray, task: str = "binary",
) -> dict[str, float]: # Compute mean loss, std, and percentile breakdown for a prediction batch. if task == "binary": losses = binary_cross_entropy(y_true, y_pred) else: losses = categorical_cross_entropy(y_true, y_pred) return { "mean_loss": round(float(losses.mean()), 6), "std_loss": round(float(losses.std()), 6), "median_loss": round(float(np.median(losses)), 6), "p90_loss": round(float(np.percentile(losses, 90)), 6), "max_loss": round(float(losses.max()), 6), } if __name__ == "__main__": rng = np.random.default_rng(seed=42) n_samples = 1_000 # Simulate a reasonably calibrated binary classifier y_true_bin = rng.integers(0, 2, n_samples).astype(float) y_pred_bin = np.clip(y_true_bin + rng.normal(0, 0.3, n_samples), 0.05, 0.95) summary = training_loss_summary(y_true_bin, y_pred_bin, task="binary") print("Binary cross-entropy summary (simulated predictions):") for key, val in summary.items(): print(f" {key}: {val}") # Demonstrate: perfect predictions give near-zero loss perfect_pred = np.clip(y_true_bin, 0.999, 0.999) + np.clip(1 - y_true_bin, 0, 0) * 0.001 perfect_summary = training_loss_summary(y_true_bin, perfect_pred, task="binary") print(f"\nPerfect model mean loss: {perfect_summary['mean_loss']}")
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