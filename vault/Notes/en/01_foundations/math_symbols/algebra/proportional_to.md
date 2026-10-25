---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Proportional to

$$
\propto
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
$\propto$ means **proportional to**: when one quantity changes, the other changes at a constant ratio. It is a weaker but more flexible statement than equality. In DA/DS you encounter $\propto$ constantly in Bayesian statistics (posterior is proportional to prior times likelihood), in scaling relationships between features and targets, in Big-O analysis, and whenever you want to describe how one variable responds to another without knowing or needing the scaling constant.

## Flowchart

```mermaid
flowchart TD
    A["y is proportional to x: y prop x"] --> B["There exists a constant k such that y = k*x"]
    B --> C{"Do you need the exact value of k?"} C -- "No (qualitative analysis)" --> D["Use proportionality: doubling x doubles y"] C -- "Yes (exact computation)" --> E["Find k: k = y/x and write y = k*x"]
    D --> F["Bayesian inference: P(theta|data) prop P(data|theta) * P(theta)"]
    E --> G["Feature scaling: revenue = k * ad_spend if relationship is linear"]
```

## Real-world use

### Where it is used

Bayesian posterior derivation (the proportionality constant is the normalizing factor that is hard to compute), describing linear relationships between variables, Big-O complexity (runtime $\propto n^2$ means doubling $n$ quadruples runtime), and dimensional analysis in data normalization.

### Problem it solves

In Bayesian inference: $P(\theta \mid \text{data}) = P(\text{data} \mid \theta) \cdot P(\theta) / P(\text{data})$. The denominator $P(\text{data}) = \int P(\text{data} \mid \theta) P(\theta) d\theta$ is often analytically intractable. Using $\propto$ lets you write $P(\theta \mid \text{data}) \propto P(\text{data} \mid \theta) \cdot P(\theta)$ and ignore the denominator entirely when you only need the shape of the posterior, not its exact value.

### How it solves the problem

$a \propto b$ means $a = k \cdot b$ for some positive constant $k$. By writing $\propto$ instead of $=$, you are saying "I know the shape (the pattern of how $a$ changes with $b$) but I am explicitly ignoring the scaling constant." In Bayes, the normalizing constant is replaced by "we will figure this out by ensuring the distribution integrates to 1."

### Example in a business

In a logistic regression model, the posterior probability given a conjugate prior satisfies $P(\mathbf{w} \mid \mathbf{X}, \mathbf{y}) \propto P(\mathbf{y} \mid \mathbf{X}, \mathbf{w}) \cdot P(\mathbf{w})$. The left side requires computing an integral over all possible weight vectors $\mathbf{w}$ (intractable). The right side is computable. By using $\propto$, you can find the MAP estimate (mode of the posterior) by maximizing the right side directly.

## The formula, piece by piece

Breaking the notation:

- $\propto$: the proportionality symbol. A stretched alpha ($\alpha$) with a flat base. Pronounced "is proportional to."
- $y \propto x$: $y$ is proportional to $x$.
- Equivalent statement: $\exists$ a constant $k > 0$ such that $y = k \cdot x$.
- The constant $k$ is called the **constant of proportionality**.

Variations:
- $y \propto x$: linear proportionality ($k$ is constant).
- $y \propto x^2$: quadratic proportionality ($y = k x^2$).
- $y \propto 1/x$: inverse proportionality ($y = k/x$, $y$ decreases as $x$ increases).

Bayesian formula using $\propto$:

$$
P(\theta \mid \text{data}) \propto P(\text{data} \mid \theta) \cdot P(\theta)
$$

Read: "The posterior is proportional to the likelihood times the prior." The normalizing constant $1/P(\text{data})$ is implicit.

## The formula in words

"$y \propto x$ means: if you double $x$, you double $y$. If you triple $x$, you triple $y$. The ratio $y/x$ is always the same constant $k$, regardless of the specific values of $x$ and $y$." The graph of $y \propto x$ is a straight line through the origin. The slope is $k$.

## Critical Concepts

1. **Proportionality vs. equality**: $y \propto x$ says the shape (ratio) is constant. $y = kx$ says the same thing explicitly with the constant $k$.
2. **Log-space proportionality**: $\ln y = \ln k + \ln x$ when $y = kx$. In log-space, $y \propto x$ becomes a linear relationship between logs, with $\ln k$ as the intercept. This is why log-log plots are used to detect power-law relationships.
3. **Bayes' theorem shorthand**: $\text{posterior} \propto \text{likelihood} \times \text{prior}$ is one of the most important uses of $\propto$ in ML and statistics.
4. **Big-O and proportionality**: $O(n^2)$ means runtime $\propto n^2$ for large $n$ (up to a constant factor). Big-O notation is essentially a formalization of proportionality.
5. **Not the same as correlation**: $\propto$ says an exact scaling relationship.

Correlation says "they tend to move together" but the relationship may not be perfectly linear.

## Step-by-step calculation (tiny example)

Task: if $y \propto x$ and $y = 6$ when $x = 2$, find $y$ when $x = 5$.

*Step 1: Find the constant of proportionality k*
$y = kx$, so $k = y/x = 6/2 = 3$.

*Step 2: Apply the proportionality to the new input*
$y = kx = 3 \times 5 = 15$.

*Step 3: Verify the ratio is constant*
Original: $y/x = 6/2 = 3$. New: $y/x = 15/5 = 3$. Same ratio. Confirmed.

## Code examples

### Beginner example (Python)

```python
# Proportionality: y = k * x
# Given: y = 6 when x = 2. Find k and predict y for other x values.
y_known = 6
x_known = 2
k = y_known / x_known   #
k = 3
x_values = [1, 2, 3, 5, 10]
y_values = [k * x for x in x_values]
print("x y = 3x y/x (constant ratio)")
for x, y in zip(x_values, y_values):
    print(f"{x:<7} {y:<8} {y/x}")   # All y/x ratios are 3: proportionality confirmed
```

### Beginner example (R)

```r
k <- 3  # constant of proportionality (y = 3x)
x_values <- c(1, 2, 3, 5, 10)
y_values <- k * x_values  # vectorized: y proportional to x
ratio <- y_values / x_values  # should all be
k = 3
print(data.frame(x = x_values, y = y_values, ratio = ratio))
```

### Professional example (Python)

```python
import numpy as np
from scipy.stats import norm   # Scenario: Bayesian update with proportionality
# Prior: theta ~ Normal(mu0=0.5, sigma0=0.5)
# Likelihood: y_i ~ Normal(theta, sigma=0.1) for n observations
# Posterior prop Likelihood * Prior (both Normal -> Posterior is also Normal)
np.random.seed(42)
theta_true = 0.7   # Generate 20 observations
n = 20
sigma_obs = 0.1   # known observation noise
y = np.random.normal(theta_true, sigma_obs, size=n)   # Prior parameters
mu_prior = 0.5
sigma_prior = 0.5   # Posterior parameters (Gaussian-Gaussian conjugate update)
# posterior variance: 1/(1/sigma_prior^2 + n/sigma_obs^2)
# posterior mean: weighted average of prior mean and data mean
precision_prior = 1 / sigma_prior**2
precision_likelihood = n / sigma_obs**2
sigma_post = np.sqrt(1 / (precision_prior + precision_likelihood))
mu_post = sigma_post**2 * (precision_prior * mu_prior + precision_likelihood * y.mean())
print("Bayesian update: posterior proportional to likelihood * prior")
print(f"True theta: {theta_true:.4f}")
print(f"Prior mean: {mu_prior:.4f}")
print(f"Sample mean: {y.mean():.4f}")
print(f"Posterior mean: {mu_post:.4f} (MAP estimate)")
print(f"Posterior std: {sigma_post:.4f}")
print("\nThe posterior mean is a weighted average of prior and data.")
print("More data => posterior mean approaches the data mean (likelihood dominates).")
```

### Professional example (R)

```r
# Bayesian update: posterior proportional to likelihood * prior (Gaussian conjugate)
set.seed(42)
theta_true <- 0.7
n <- 20
sigma_obs <- 0.1
y <- rnorm(n, theta_true, sigma_obs)
mu_prior <- 0.5
sigma_prior <- 0.5
precision_prior <- 1 / sigma_prior^2
precision_likelihood <- n / sigma_obs^2
sigma_post <- sqrt(1 / (precision_prior + precision_likelihood))
mu_post <- sigma_post^2 * (precision_prior * mu_prior + precision_likelihood * mean(y))
cat("Bayesian update: posterior proportional to likelihood * prior\n")
cat(sprintf("True theta: %.4f\n", theta_true))
cat(sprintf("Prior mean: %.4f\n", mu_prior))
cat(sprintf("Sample mean: %.4f\n", mean(y)))
cat(sprintf("Posterior mean: %.4f (MAP)\n", mu_post))
cat(sprintf("Posterior std: %.4f\n", sigma_post))
```

---

*Source: MML1 p. 6*
