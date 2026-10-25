---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Improper Limit

$$
\int_a^\infty f(x)\,dx = \lim_{b \to \infty} \int_a^b f(x)\,dx
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
An improper integral has at least one infinite limit (or an integrand that blows up). Since integration normally requires a finite closed interval, we cannot directly evaluate $\int_a^\infty f(x)\,dx$. The fix is to replace the infinite limit with a finite placeholder $b$, integrate over $[a, b]$ normally, and then take the limit $b \to \infty$. If that limit exists and is finite, the improper integral **converges** to that value; otherwise it **diverges**. This is not a technicality — it is the foundational definition for a huge class of results in probability and statistics: the total probability under any continuous probability density function (PDF) must equal 1, which requires $\int_{-\infty}^{\infty} f(x)\,dx = 1$. Every moment calculation $E[X] = \int_{-\infty}^{\infty} x f(x)\,dx$, every normalizing constant in Bayesian inference, and every Laplace/Fourier transform involves an improper integral. If this limit diverges, the distribution or moment does not exist.

## Flowchart

```mermaid
flowchart TD
    A["Integral with infinite limit: int_a^inf f(x) dx"] --> B["Replace inf with finite b: int_a^b f(x) dx"]
    B --> C["Find antiderivative F(x)"]
    C --> D["Evaluate: F(b) - F(a)"]
    D --> E["Take limit as b -> inf"]
    E --> F{"Does the limit exist and is finite?"} F -- "Yes" --> G["Converges to L = lim F(b) - F(a)"] F -- "No (blows up or oscillates)" --> H["Diverges: integral does not exist"]
    G --> I["Use L as the value of the improper integral"]
```

## Real-world use

### Where it is used

Probability: verifying that a PDF integrates to 1 over its full support. Statistics: computing moments ($E[X]$, $E[X^2]$, variance) of continuous distributions with unbounded support (exponential, normal, gamma, Pareto). Bayesian inference: evaluating normalizing constants. Signal processing: Laplace and Fourier transforms. Survival analysis: computing expected lifetime $E[T] = \int_0^\infty S(t)\,dt$ (the IBP identity). Economics: computing present value of perpetual cash flows.

### Problem it solves

Real-world measurements often have no natural upper bound (time, money, distance). The probability that an exponentially distributed random variable exceeds some threshold requires integrating to infinity. Without the improper integral definition, we could not give meaning to "the area under an infinite curve" or confirm that probabilities sum to 1 for unbounded distributions.

### How it solves the problem

By converting an infinite problem into a parameterized finite problem and taking a limit. $\int_a^\infty f(x)\,dx := \lim_{b \to \infty} \int_a^b f(x)\,dx = \lim_{b \to \infty} [F(b) - F(a)]$. The key question becomes: does $F(b)$ approach a finite value as $b \to \infty$? Functions that decay fast enough (like $e^{-x}$) converge; functions that decay too slowly (like $1/x$ on $[1, \infty)$) diverge.

### Example in a business

A SaaS company models customer churn-free lifetime as $T \sim \text{Exp}(\lambda = 0.1)$ (10% monthly churn). To confirm the model is valid, we check $\int_0^\infty \lambda e^{-\lambda t}\,dt = 1$. Analytically: $\lim_{b \to \infty} [-e^{-\lambda t}]_0^b = \lim_{b \to \infty} (1 - e^{-\lambda b}) = 1$. Confirmed: the PDF integrates to 1. The expected lifetime $E[T] = \int_0^\infty t\lambda e^{-\lambda t}\,dt = 1/\lambda = 10$ months is also an improper integral, foundational to the LTV formula $\text{LTV} = \text{ARPU} / \text{churn rate}$.

## The formula, piece by piece

$$
\int_a^\infty f(x)\,dx = \lim_{b \to \infty} \int_a^b f(x)\,dx
$$

Each symbol:
- $\int_a^\infty$: integrate from finite $a$ to positive infinity — an unbounded upper limit
- $f(x)$: the integrand (must be integrable on every finite subinterval $[a, b]$)
- $\lim_{b \to \infty}$: replace $\infty$ with $b$, compute the definite integral, then let $b$ grow without bound
- $\int_a^b f(x)\,dx$: the ordinary definite integral on the finite interval $[a, b]$, evaluated via FTC as $F(b) - F(a)$ Converges: if $\lim_{b \to \infty} F(b)$ is finite.
Diverges: if $\lim_{b \to \infty} F(b) = \pm\infty$ or does not exist.

## The formula in words

"I cannot integrate all the way to infinity directly. So I integrate up to some large finite number $b$, get an answer in terms of $b$, and ask: what does that answer approach as $b$ gets arbitrarily large? If it approaches a finite number, that number is the value of the improper integral."

## Critical Concepts

- **Convergence vs. divergence**: $\int_1^\infty x^{-p}\,dx$ converges for $p > 1$ (gives $1/(p-1)$) and diverges for $p \leq 1$ (the harmonic series analogue). The cutoff $p = 1$ is the boundary case.
- **Doubly infinite**: $\int_{-\infty}^{\infty} f(x)\,dx = \lim_{a \to -\infty} \int_a^c f(x)\,dx + \lim_{b \to \infty} \int_c^b f(x)\,dx$ — split at any convenient $c$; both limits must converge independently (Cauchy principal value is different).
- **Comparison test**: if $0 \leq f(x) \leq g(x)$ and $\int_a^\infty g$ converges, then $\int_a^\infty f$ also converges. Used to bound heavy-tailed integrals.
- **PDFs must integrate to 1**: every continuous probability distribution is defined by an improper integral equaling 1. If you propose a density function for an unbounded domain, you must verify convergence.
- **Laplace transform**: $\mathcal{L}\{f\}(s) = \int_0^\infty e^{-st} f(t)\,dt$ — an improper integral parameterized by $s$.
- **L'Hôpital inside limits**: evaluating $\lim_{b \to \infty} F(b)$ often requires L'Hôpital or squeeze theorem (e.g., $b\,e^{-b} \to 0$).

## Step-by-step calculation (tiny example)

Compute $\int_1^\infty \frac{1}{x^2}\,dx$.

*Step 1: Replace $\infty$ with $b$*
$\int_1^\infty \frac{1}{x^2}\,dx = \lim_{b \to \infty} \int_1^b x^{-2}\,dx$

*Step 2: Antiderivative using power rule ($n = -2$, so $n+1 = -1$)*
$F(x) = \frac{x^{-1}}{-1} = -\frac{1}{x}$

*Step 3: Apply FTC on $[1, b]$*
$\int_1^b x^{-2}\,dx = F(b) - F(1) = -\frac{1}{b} - \left(-\frac{1}{1}\right) = 1 - \frac{1}{b}$

*Step 4: Take the limit*
$\lim_{b \to \infty} \left(1 - \frac{1}{b}\right) = 1 - 0 = 1$ Result: $\int_1^\infty \frac{1}{x^2}\,dx = 1$. The integral converges to 1. Contrast: $\int_1^\infty \frac{1}{x}\,dx = \lim_{b \to \infty} [\ln b - \ln 1] = \lim_{b \to \infty} \ln b = \infty$ — diverges.

## Code examples

### Beginner example (Python)

```python
import numpy as np
from scipy import integrate

def f_convergent(x: float) -> float:
    """1/x^2: convergent on [1, inf). Integral = 1."""
    return 1.0 / x**2

def f_divergent(x: float) -> float:
    """1/x: divergent on [1, inf)."""
    return 1.0 / x   # Convergent improper integral: scipy.quad handles this with
limit=inf
area_convergent, error = integrate.quad(f_convergent, 1, np.inf)
print(f"int_1^inf 1/x^2 dx = {area_convergent:.6f} (expected: 1.0)")
print(f"Error estimate: {error:.2e}")   # Verify by limit approach (finite approximations)
b_values = [10, 100, 1_000, 10_000, 100_000]
print("\nFinite-b approximation: 1 - 1/b")
for b in b_values:
    approx = 1.0 - 1.0 / b
print(f" b = {b:>8d}: integral = {approx:.8f}")   # Exponential PDF: verify int_0^inf lambda*exp(-lambda*x)
dx = 1
LAMBDA = 0.1
area_pdf, _ = integrate.quad(lambda x: LAMBDA * np.exp(-LAMBDA * x), 0, np.inf)
print(f"\nExp(lambda=0.1) PDF integrates to: {area_pdf:.8f} (expected: 1.0)")
```

### Beginner example (R)

```r
# Convergent: int_1^inf 1/x^2
dx = 1
f_convergent <- function(x) 1 / x^2
result <- integrate(f_convergent, lower = 1, upper = Inf)
cat("int_1^inf 1/x^2 dx:", result$value, "\n")  # 1 # Finite-b approximation: approaches 1 as b -> inf
cat("\nFinite-b approximation (1 - 1/b):\n")
for (b in c(10, 100, 1000, 10000)) { cat(" b =", b, ": integral =", 1 - 1/b, "\n")
}  # Exponential PDF: integrate to infinity
lambda <- 0.1
area_pdf <- integrate(function(x) lambda * exp(-lambda * x), 0, Inf)$value
cat("\nExp(lambda=0.1) PDF total area:", area_pdf, "\n")  # 1
```

### Professional example (Python)

```python
"""
Improper integrals in Bayesian posterior normalization. In Bayesian inference: posterior ∝ likelihood * prior normalizing constant
Z = int_{-inf}^{inf}
likelihood(theta) * prior(theta)
d(theta) For a Gaussian likelihood with Gaussian prior (conjugate model),
Z has a closed form. We verify numerically using scipy.integrate.quad
on an improper integral over all of R. Business context: estimate the true conversion rate mu from n trials.
Prior: mu ~ Normal(mu_0, sigma_0) [truncated to (0,1) for simplicity here we work on the unconstrained space and use a proper Gaussian likelihood].
Likelihood: proportional to
Normal(x_bar | mu, sigma_likelihood).
"""
import numpy as np
from scipy import integrate, stats
from sklearn.datasets import make_classification
RANDOM_SEED = 42
rng = np.random.default_rng(RANDOM_SEED)   # Observed data: 200 A/B test users, conversion rate ~0.30
n_obs = 200
true_rate = 0.30
conversions = rng.binomial(n=1, p=true_rate, size=n_obs)
x_bar = float(conversions.mean())   # Gaussian prior: mu_0 = 0.25,
sigma_0 = 0.10
mu_prior = 0.25
sigma_prior = 0.10   # Gaussian likelihood std (known, simplified):
sigma_L = 1/sqrt(n)
sigma_likelihood = 1.0 / np.sqrt(n_obs)   # Unnormalized posterior: p(mu | data) ∝ likelihood * prior

def unnorm_posterior(mu: float) -> float:
    """Unnormalized: Normal likelihood * Normal prior."""
    log_likelihood = stats.norm.logpdf(x_bar, loc=mu, scale=sigma_likelihood)
    log_prior = stats.norm.logpdf(mu, loc=mu_prior, scale=sigma_prior)
    return float(np.exp(log_likelihood + log_prior))   # Normalizing constant Z = int_{-inf}^{inf} unnorm_posterior(mu) d(mu)
# This is an improper integral: both limits infinite
normalizing_constant, error = integrate.quad(unnorm_posterior, -np.inf, np.inf)
print(f"Normalizing constant Z: {normalizing_constant:.6f}")
print(f"Integration error: {error:.2e}")   # Posterior mean (should match conjugate Gaussian update)

def posterior_mean_integrand(mu: float) -> float:
    return mu * unnorm_posterior(mu) / normalizing_constant
posterior_mean, _ = integrate.quad(posterior_mean_integrand, -np.inf, np.inf)   # Closed-form conjugate Gaussian posterior mean
precision_prior = 1.0 / sigma_prior**2
precision_likelihood = n_obs   # since
sigma_L = 1/sqrt(n)
precision_posterior = precision_prior + precision_likelihood
mu_posterior_analytic = ( (mu_prior * precision_prior + x_bar * precision_likelihood) / precision_posterior )
print(f"\nObserved mean (x_bar): {x_bar:.4f}")
print(f"Posterior mean (improper int): {posterior_mean:.4f}")
print(f"Posterior mean (analytic): {mu_posterior_analytic:.4f}")
print(f"Match: {abs(posterior_mean - mu_posterior_analytic) < 1e-4}")
print(f"\n[Key: normalizing constant Z required taking improper integral over all mu in R]")
```

---

*Source: 1300 p. 261*
