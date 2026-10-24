---
title: Euler number
date: '2026-04-16'
wordCount: 808
slug: euler_number
permalink: /notes/01_foundations/math_symbols/algebra/euler_number/index.html
share_status: draft
publish_target: note
boundary: public
---
# $e = \lim_{x \to \infty} (1 + 1/x)^x \approx 2.71828\dots$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
$e \approx 2.71828$ is **Euler's number**, the base of the natural logarithm. It is arguably the most important constant in data science after $\pi$. You encounter it in the exponential function $e^x$, in the sigmoid/softmax activation functions, in the Poisson and Gaussian distributions, in the natural logarithm $\ln(x) = \log_e(x)$, and in any model or formula involving continuous growth, decay, or probability. If you do ML without knowing $e$, you are driving blind.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Euler's number e approx 2.71828"] --> B["Base of the natural exponential: e^x"] A --> C["Base of the natural logarithm: ln(x)"] B --> D["Appears in: sigmoid, softmax, Gaussian, Poisson"] C --> E["Appears in: log-likelihood, cross-entropy loss, entropy"] D --> F["ML activations and probability outputs"] E --> G["ML loss functions and information theory"] F --> H["e is the foundation connecting growth, decay, and probability"] G --> H
```
### Real-World use:
#### Situation it is used
Anywhere continuous growth or decay appears: compound interest, population growth, radioactive decay, probability distributions (normal, Poisson, exponential), activation functions in neural networks (sigmoid, softmax), and loss functions (cross-entropy, log-loss).
#### Problem it solves
Many natural processes grow or decay at a rate proportional to their current size. The mathematical description of this behavior, $\frac{dy}{dt} = y$, has the solution $y = e^t$. The constant $e$ is the only base for which the exponential function is its own derivative. This "self-referential" derivative property makes $e$ the natural choice for describing change in continuous time and for simplifying calculus.
#### How it solves the problem
Because $\frac{d}{dx} e^x = e^x$, the exponential function with base $e$ has the cleanest possible calculus. Derivatives and integrals of $e^x$ do not generate messy scaling factors. This is why probability densities, loss function gradients, and statistical proofs all simplify when expressed in terms of $e$.
#### Example of it used in the Working Context as DA/DS for a Business
The logistic (sigmoid) function used in binary classification: $\sigma(z) = \frac{1}{1 + e^{-z}}$. This converts a raw score $z$ into a probability between 0 and 1. Without $e$, this transformation does not exist in the clean form that makes gradient descent tractable.
### The Formula (Fragment-First)
Breaking the definition: - $e$: a mathematical constant, named after Leonhard Euler (1707-1783), though Euler did not discover it (Jacob Bernoulli found it while studying compound interest).
- $\lim$: limit. The value approached as a parameter grows without bound.
- $x \to \infty$: $x$ increases indefinitely.
- $(1 + 1/x)^x$: the compound interest formula with $x$ compounding periods.
- The full definition: $e = \lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x \approx 2.71828182845...$ Alternative series definition (equivalent): $e = \sum_{n=0}^{\infty} \frac{1}{n!} = 1 + 1 + \frac{1}{2} + \frac{1}{6} + \frac{1}{24} + \cdots$ Key property: $\frac{d}{dx} e^x = e^x$. The exponential function is its own derivative. This is the defining characteristic of $e$. Logarithm connection: $\ln(e) = 1$, $e^{\ln(x)} = x$, $\ln(e^x) = x$.
### Formula-to-English Translation
"$e$ is the limit of $(1 + 1/x)^x$ as $x$ grows to infinity. Think of it this way: if you start with $\$1$ and earn $100\%$ annual interest, but you compound it $x$ times per year (more and more frequently), the amount after 1 year approaches $e \approx \$2.72$ as compounding becomes continuous." The series expansion says: $e = 1 + 1 + \frac{1}{2!} + \frac{1}{3!} + \frac{1}{4!} + \cdots$. Each term adds a smaller piece. The sum converges to $e$.
### Critical Concepts
1. **e is irrational and transcendental**: like $\pi$, its decimal expansion never terminates or repeats, and it is not the root of any polynomial with integer coefficients.
2. **The natural exponential**: $e^x$ is the unique function that equals its own derivative. This is why it appears in every differential equation describing natural growth/decay.
3. **Natural logarithm**: $\ln(x) = \log_e(x)$. In code: `math.log(x)` in Python (no base = natural log), `log(x)` in R (also natural log by default). Do not confuse with `log10(x)`.
4. **Sigmoid function**: $\sigma(z) = 1/(1+e^{-z})$. Used in logistic regression and neural network output layers for binary classification. Maps any real number to $(0, 1)$.
5. **Softmax**: generalization of sigmoid for multi-class: $\text{softmax}(z_i) = e^{z_i} / \sum_j e^{z_j}$. Converts a vector of scores into a probability distribution.
6. **Cross-entropy loss**: $L = -\sum_i y_i \ln(\hat{y}_i)$. The $\ln$ (natural log, base $e$) appears because information theory is built on $e$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: compute $e \approx$ using the first 5 terms of the series $e = \sum_{n=0}^{\infty} \frac{1}{n!}$. *Step 1: List the first 5 terms*
- $n=0$: $1/0! = 1/1 = 1$
- $n=1$: $1/1! = 1/1 = 1$
- $n=2$: $1/2! = 1/2 = 0.5$
- $n=3$: $1/3! = 1/6 \approx 0.16667$
- $n=4$: $1/4! = 1/24 \approx 0.04167$ *Step 2: Sum the terms*
$1 + 1 + 0.5 + 0.16667 + 0.04167 = 2.70833$ *Step 3: Compare to the true value*
True $e \approx 2.71828$. Our 5-term estimate gives $2.70833$. Error $\approx 0.01$. Adding more terms gets closer. The series converges rapidly.
### Real Application Examples
#### Beginner friendly Example [Python]
``` python
import math # Access Euler's number
print(math.e) # 2.718281828459045 # Exponential function: e^x
print(math.exp(1)) # 2.718281828459045 (e^1 = e)
print(math.exp(0)) # 1.0 (e^0 = 1 always)
print(math.exp(2)) # 7.389056098930592 (e^2) # Natural log: ln(x) = log base e of x
print(math.log(math.e)) # 1.0 (ln(e) = 1 by definition)
print(math.log(1)) # 0.0 (ln(1) = 0) # Sigmoid function (common in ML)
def sigmoid(z): return 1 / (1 + math.exp(-z)) print(sigmoid(0)) # 0.5 (symmetric: z=0 gives 50% probability)
print(sigmoid(2)) # ~0.88
print(sigmoid(-2)) # ~0.12
```
#### Beginner friendly Example [R]
``` r
# Euler's number in R
print(exp(1)) # 2.718282 (e^1 = e)
print(exp(0)) # 1 (e^0 = 1)
print(exp(2)) # 7.389056 (e^2) # Natural log
print(log(exp(1))) # 1 (ln(e) = 1)
print(log(1)) # 0 (ln(1) = 0) # Sigmoid
sigmoid <- function(z) 1 / (1 + exp(-z))
cat("sigmoid(0):", sigmoid(0), "\n") # 0.5
cat("sigmoid(2):", sigmoid(2), "\n") # ~0.88
```
#### Final Professional Example [Python]
``` python
import numpy as np
import pandas as pd # Scenario: binary classification with logistic regression
# Demonstrate how e underlies the sigmoid -> probability -> cross-entropy loss pipeline np.random.seed(42) # Simulated raw model scores (logits) for 6 observations
logits = np.array([-3.0, -1.5, -0.5, 0.5, 1.5, 3.0])
labels = np.array([0, 0, 0, 1, 1, 1]) # true binary labels # Step 1: sigmoid converts logits to probabilities using e
probabilities = 1 / (1 + np.exp(-logits)) # Step 2: cross-entropy loss uses natural log (ln = log base e)
# L_i = -[y_i * ln(p_i) + (1 - y_i) * ln(1 - p_i)]
epsilon = 1e-12 # clip to avoid ln(0)
p_clipped = np.clip(probabilities, epsilon, 1 - epsilon)
cross_entropy_per_obs = -(labels * np.log(p_clipped) + (1 - labels) * np.log(1 - p_clipped)) # Mean cross-entropy loss
log_loss = np.mean(cross_entropy_per_obs) df = pd.DataFrame({ "logit": logits, "probability": np.round(probabilities, 4), "label": labels, "ce_loss": np.round(cross_entropy_per_obs, 4),
}) print(df.to_string(index=False))
print(f"\nMean Cross-Entropy Loss (log-loss): {log_loss:.4f}")
# e appears in both the sigmoid (e^-z) and the log-loss (ln(p))
```
#### Final Professional Example [R]
``` r
# Scenario: binary classification with logistic regression
# e underlies sigmoid -> probability -> cross-entropy loss pipeline set.seed(42)
logits <- c(-3, -1.5, -0.5, 0.5, 1.5, 3)
labels <- c(0, 0, 0, 1, 1, 1) # Step 1: sigmoid converts logits to probabilities using e
probabilities <- 1 / (1 + exp(-logits)) # Step 2: cross-entropy loss uses natural log (ln = log base e)
epsilon <- 1e-12
p_clipped <- pmax(pmin(probabilities, 1 - epsilon), epsilon)
cross_entropy_per_obs <- -(labels * log(p_clipped) + (1 - labels) * log(1 - p_clipped))
log_loss <- mean(cross_entropy_per_obs) df <- data.frame( logit = logits, probability = round(probabilities, 4), label = labels, ce_loss = round(cross_entropy_per_obs, 4)
)
print(df)
cat(sprintf("\nMean Cross-Entropy Loss (log-loss): %.4f\n", log_loss))
```
---
1300 pag 217