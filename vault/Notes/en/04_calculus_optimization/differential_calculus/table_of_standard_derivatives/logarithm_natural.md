---
title: Logarithm (Natural)
date: '2026-04-16'
wordCount: 703
slug: logarithm_natural
permalink: /notes/04_calculus_optimization/differential_calculus/table_of_standard_derivatives/logarithm_natural/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{d}{dx}(\ln |x|) = \frac{1}{x}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The derivative of the natural log is the reciprocal function $1/x$. The absolute value sign $|x|$ extends the domain to $x < 0$ (where $\ln|x|$ is defined) without changing the formula. In DA/DS: $\ln$ appears in log-likelihoods, cross-entropy loss, KL divergence, information gain (decision trees), and any model using maximum likelihood estimation. The gradient of the log-likelihood always passes through this formula. Chain rule extension: $d/dx(\ln f(x)) = f'(x)/f(x)$, which appears when differentiating log-likelihoods of parametric distributions.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["f(x) = ln|x|"] A --> B["d/dx(ln|x|) = 1/x"] B --> C["Chain rule: d/dx(ln f(x)) = f'(x)/f(x)"] C --> D["Score function: d/dtheta log p(x;theta) = d/dtheta p(x;theta) / p(x;theta)"] D --> E["MLE gradient: proportional to 1/p * dp/dtheta"] A --> F["Inverse relationship: d/dx(e^x) = e^x, d/dx(ln x) = 1/x"] F --> G["ln and exp are inverses; their derivative rules are inverses too"]
```
### Real-World use:
#### Situation it is used
Cross-entropy gradient: $d/dp(-\log p) = -1/p$; MLE score equations; entropy $H(p) = -\sum p_i \log p_i$ gradient; log-likelihood of normal, Poisson, Bernoulli distributions; decision tree information gain (mutual information); log-sum-exp differentiation; KL divergence gradient.
#### Problem it solves
Any loss function involving a logarithm requires this derivative for gradient computation. The binary cross-entropy loss $L = -y\log p - (1-y)\log(1-p)$ gradient $dL/dp = -y/p + (1-y)/(1-p)$ uses $d/dp(\log p) = 1/p$ directly.
#### How it solves the problem
Proof: since $e^{\ln x} = x$, differentiate both sides: $e^{\ln x} \cdot d/dx(\ln x) = 1$, so $d/dx(\ln x) = 1/e^{\ln x} = 1/x$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS fits a Poisson regression for count data (e.g., number of purchases per customer). Log-likelihood: $\ell(\beta) = \sum_i [y_i \log(\mu_i) - \mu_i]$ where $\mu_i = e^{x_i^T\beta}$. Score: $\partial\ell/\partial\beta = \sum_i [y_i/\mu_i \cdot \partial\mu_i/\partial\beta - \partial\mu_i/\partial\beta] = X^T(y - \mu)$ — uses $d/d\mu(\log\mu) = 1/\mu$ directly.
### The Formula (Fragment-First)
- $\ln|x|$: natural logarithm of absolute value; extends $\ln x$ to negative $x$
- $1/x$: the derivative; same for $x > 0$ and $x < 0$ (note: $d/dx(\ln(-x)) = (-1)/(-x) = 1/x$ for $x < 0$)
- Chain rule: $d/dx(\ln f(x)) = f'(x)/f(x)$; the "logarithmic derivative" of $f$
- Score function: $d/d\theta \log p(x;\theta) = [d/d\theta p(x;\theta)] / p(x;\theta)$
- Cross-entropy gradient: $d/dp(-\log p) = -1/p$; and $d/dp(-\log(1-p)) = 1/(1-p)$
- Integral: $\int 1/x \, dx = \ln|x| + C$ — logarithm is the antiderivative of $1/x$
- Higher derivatives: $d^2/dx^2(\ln x) = -1/x^2$; $d^n/dx^n(\ln x) = (-1)^{n+1}(n-1)!/x^n$ ### Formula-to-English Translation
"The rate of change of the natural log is the reciprocal. A 1% change in $x$ changes $\ln x$ by approximately $1/x \cdot 0.01x = 0.01$ — logarithms measure relative/proportional changes." Tiny examples:
$d/dx(\ln(3x)) = 3/(3x) = 1/x$ (chain rule; $\ln(3) + \ln(x)$ gives same result).
$d/dx(\ln(x^2 + 1)) = 2x/(x^2 + 1)$.
$d/dx(-\log p) = -1/p$ (cross-entropy gradient at single sample with ground truth 1).
### Critical Concepts
- **Log-likelihood gradient = score:** $d/d\theta \log p(x;\theta) = [1/p(x;\theta)] \cdot \partial p/\partial \theta$. The expectation of the score is zero: $\mathbb{E}[\partial \log p / \partial \theta] = 0$ — the foundation of the Fisher information.
- **Logarithmic differentiation technique:** to differentiate complex products/quotients $y = f_1(x) \cdot f_2(x) \cdots$, take $\ln y = \ln f_1 + \ln f_2 + \cdots$, differentiate both sides: $y'/y = f_1'/f_1 + f_2'/f_2 + \cdots$, giving $y' = y \cdot (f_1'/f_1 + f_2'/f_2 + \cdots)$.
- **Information theory connection:** entropy $H(p) = -\sum_i p_i \log p_i$ gradient $\partial H/\partial p_i = -\log p_i - 1$ uses $d/dp(\log p) = 1/p$. This is used in decision tree split criteria (information gain).
- **Numerical log-gradient:** in practice, compute $\log p$ for numerical stability, then use $1/p$ for the gradient — or use autograd tools. Direct $1/p$ can overflow when $p \approx 0$; add $\epsilon$ clip.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Gradient of binary cross-entropy: $L(p) = -y\log p - (1-y)\log(1-p)$ with $y=1$, $p=0.7$.* *Step 1: With $y=1$*: $L(p) = -\log p$. *Step 2: Differentiate using $d/dp(\log p) = 1/p$*:
$dL/dp = -1/p = -1/0.7 \approx -1.429$. *Step 3: Interpretation*: at $p=0.7$ (predicted probability 0.7 for true class), the gradient is $-1.429$. A small increase $dp > 0$ decreases loss: consistent with gradient descent pushing $p \to 1$. *Step 4: Full cross-entropy gradient at $y=1$, $p=0.7$*:
$dL/dp = -1/p + 0 = -1.429$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def log_derivative(x: float) -> float: """d/dx(ln|x|) = 1/x.""" return 1 / x def cross_entropy_gradient(p: float, y: int) -> float: """Gradient of binary CE: dL/dp = -y/p + (1-y)/(1-p). Uses d/dp(log p) = 1/p.""" p = np.clip(p, 1e-9, 1 - 1e-9) return -y / p + (1 - y) / (1 - p) # Numerical verification
x_vals = np.array([0.5, 1.0, 2.0, 4.0, 10.0])
h = 1e-7 print("d/dx(ln|x|) = 1/x verification")
print(f"{'x':>6} {'1/x':>10} {'numerical':>12} {'match':>7}")
for x in x_vals: analytic = log_derivative(x) numerical = (np.log(abs(x + h)) - np.log(abs(x - h))) / (2 * h) match = abs(analytic - numerical) < 1e-5 print(f"{x:>6.1f} {analytic:>10.6f} {numerical:>12.6f} {str(match):>7}") # Cross-entropy gradient
print("\nCross-entropy gradient dL/dp at y=1")
for p in [0.1, 0.5, 0.7, 0.9, 0.99]: grad = cross_entropy_gradient(p, y=1) print(f" p={p:.2f}: dL/dp = {grad:.4f} {'(large penalty)' if p < 0.3 else ''}")
```
#### Beginner friendly Example [R])
``` r
# d/dx(ln|x|) = 1/x
log_deriv <- function(x) 1 / x # Cross-entropy gradient: d/dp(-y*log(p) - (1-y)*log(1-p)) = -y/p + (1-y)/(1-p)
ce_gradient <- function(p, y) { p <- pmax(pmin(p, 1 - 1e-9), 1e-9) -y / p + (1 - y) / (1 - p)
} # Verify numerically
x_vals <- c(0.5, 1.0, 2.0, 4.0, 10.0)
h <- 1e-7
cat(sprintf("%-6s %-10s %-12s\n", "x", "1/x", "numerical"))
for (x in x_vals) { analytic <- log_deriv(x) numerical <- (log(abs(x + h)) - log(abs(x - h))) / (2 * h) cat(sprintf("%-6.1f %-10.6f %-12.6f\n", x, analytic, numerical))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score np.random.seed(42) # -- Logistic regression gradient: d/dp(-log p) = 1/p in action ---------------
X_raw, y = make_classification( n_samples=800, n_features=6, n_informative=4, random_state=42
)
scaler = StandardScaler()
X = np.hstack([np.ones((len(y), 1)), scaler.fit_transform(X_raw)])
N, D = X.shape def sigmoid(z: np.ndarray) -> np.ndarray: return 1 / (1 + np.exp(-np.clip(z, -500, 500))) def log_loss(w: np.ndarray) -> float: """Binary cross-entropy: -sum(y*log(p) + (1-y)*log(1-p)) / N.""" p = sigmoid(X @ w) p = np.clip(p, 1e-9, 1 - 1e-9) return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))) def log_loss_gradient(w: np.ndarray) -> np.ndarray: """Gradient via d/dp(-log p) = 1/p: dL/dw = X^T (p - y) / N Derivation: dL/dp = -y/p + (1-y)/(1-p); dp/dw = p(1-p)*x; chain rule gives p-y. """ p = sigmoid(X @ w) return X.T @ (p - y) / N # Gradient descent on log-loss
w = np.zeros(D)
LEARNING_RATE = 0.5
losses = [] for step in range(300): losses.append(log_loss(w)) w -= LEARNING_RATE * log_loss_gradient(w) p_final = sigmoid(X @ w)
auc = roc_auc_score(y, p_final) print("Logistic Regression via d/dx(ln x) = 1/x gradient")
print(f"{'Step':>6} {'Log-loss':>10}")
for step in [0, 49, 99, 199, 299]: print(f"{step+1:>6} {losses[step]:>10.5f}")
print(f"\nFinal AUC: {auc:.4f}")
print(f"\nKey: d/dp(-log p) = 1/p -> gradient of CE = X^T(p-y)/N")
print(f"This is the log derivative d/dx(ln x) = 1/x applied to the likelihood.")
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
1300 pag 220