---
publish: true
date: '2026-04-16'
tags:
- calculus
slug: power-rule-standard-integrals
---

# Power Rule

$$
\int x^n\,dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The power rule for integration is the most used antiderivative formula. It says: to integrate $x$ raised to any constant power $n$ (except $-1$), raise the exponent by 1 and divide by the new exponent. The restriction $n \neq -1$ is critical: $\int x^{-1}\,dx = \ln|x| + C$ (handled by the Reciprocal Logarithmic rule). This formula appears constantly in statistics: computing moments $E[X^k] = \int x^k f(x)\,dx$ for uniform and polynomial distributions, normalizing polynomial density functions, evaluating the integrals that define the beta distribution normalizing constant, and computing areas for polynomial cost/revenue curves. The power rule also works for fractional exponents: $\int x^{1/2}\,dx = \frac{2}{3}x^{3/2} + C$.

## Flowchart

```mermaid
flowchart TD
    A["Integral: int x^n dx"] --> B{"n = -1?"} B -- "Yes" --> C["Use reciprocal rule: ln|x| + C"] B -- "No" --> D["Increment exponent: n becomes n+1"]
    D --> E["Divide coefficient by new exponent: 1/(n+1)"]
    E --> F["Result: x^(n+1) / (n+1) + C"]
    F --> G["Verify: d/dx [x^(n+1)/(n+1)] = x^n"]
```

## Real-world use

### Where it is used

Whenever an integrand is a monomial $x^n$ or a sum of monomials (polynomial). In statistics: computing moments of the uniform distribution, beta function integrals, normalizing constants of polynomial density models. In ML: integrating polynomial approximations, computing closed-form integrals in Bayesian conjugate models, and evaluating area formulas in regularization.

### Problem it solves

Given a polynomial rate or density function, the power rule provides the exact closed-form total accumulation, avoiding numerical integration. Any integral involving $x^n$ (with $n \neq -1$) has a clean analytic answer.

### How it solves the problem

Reverse the power rule for differentiation: $\frac{d}{dx}[x^{n+1}] = (n+1)x^n$, so $\frac{d}{dx}\!\left[\frac{x^{n+1}}{n+1}\right] = x^n$. Therefore $\frac{x^{n+1}}{n+1}$ is the antiderivative. Division by $n+1$ exactly compensates the multiplicative factor that differentiation introduced. When $n = -1$, this would divide by zero, hence the logarithmic exception.

### Example in a business

The Beta distribution with $\alpha=2, \beta=3$ has PDF $f(x) = x^{\alpha-1}(1-x)^{\beta-1}/B(\alpha,\beta)$ on $[0,1]$. Computing $E[X] = \int_0^1 x\,f(x)\,dx$ involves integrating $x^\alpha(1-x)^{\beta-1}$; expanding via the binomial theorem gives a sum of monomials, each integrated by the power rule. This produces the closed-form $E[X] = \alpha/(\alpha+\beta)$, foundational for Bayesian A/B test posterior mean estimation.

## The formula, piece by piece

$$
\int x^n\,dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)
$$

Each symbol:
- $\int$: integration operator
- $x^n$: the integrand, a power function with variable $x$ and constant exponent $n$
- $n$: the exponent, any real number except $-1$
- $x^{n+1}$: the base raised to the exponent incremented by one
- $n+1$: the new exponent, also appears in the denominator as a divisor
- $C$: constant of integration (the family of all antiderivatives differs only by $C$) Special cases worth memorizing:
- $n=0$: $\int 1\,dx = x + C$
- $n=1$: $\int x\,dx = x^2/2 + C$
- $n=2$: $\int x^2\,dx = x^3/3 + C$
- $n=-2$: $\int x^{-2}\,dx = -1/x + C$
- $n=1/2$: $\int \sqrt{x}\,dx = \frac{2}{3}x^{3/2} + C$

## The formula in words

"To integrate $x$ to the power $n$: increase the exponent by one (from $n$ to $n+1$), then divide the whole thing by that new exponent. Add the constant $C$ for the full family of antiderivatives. This is the exact reverse of the differentiation power rule, which decreases the exponent by one and multiplies by the original exponent."

## Critical Concepts

- **Why $n \neq -1$**: if $n = -1$, then $n+1 = 0$ and we divide by zero. The antiderivative of $1/x$ is $\ln|x| + C$, a separate formula.
- **Linearity**: integrate a polynomial term by term: $\int(ax^m + bx^n)\,dx = a\cdot\frac{x^{m+1}}{m+1} + b\cdot\frac{x^{n+1}}{n+1} + C$.
- **Verify by differentiating**: $\frac{d}{dx}\!\left[\frac{x^{n+1}}{n+1}+C\right] = \frac{(n+1)x^n}{n+1} = x^n$
- **Works for all real $n \neq -1$**: integers, fractions, and negative values.
- **Definite version**: $\int_a^b x^n\,dx = \frac{b^{n+1}}{n+1} - \frac{a^{n+1}}{n+1}$.

## Step-by-step calculation (tiny example)

Compute $\int x^3\,dx$ (indefinite) and $\int_0^2 x^3\,dx$ (definite).

*Step 1: Identify n*
$n = 3$. Since $n \neq -1$, the power rule applies.

*Step 2: Apply the formula for the indefinite integral*
$n + 1 = 4$. Antiderivative: $F(x) = \frac{x^4}{4} + C$.

*Step 3: Verify by differentiating*
$\frac{d}{dx}\!\left[\frac{x^4}{4} + C\right] = \frac{4x^3}{4} = x^3$

*Step 4: Evaluate the definite integral using FTC*
$\int_0^2 x^3\,dx = F(2) - F(0) = \frac{16}{4} - \frac{0}{4} = 4$

*Step 5: Interpret*
The area under $f(x) = x^3$ from $x=0$ to $x=2$ is exactly 4 square units.

## Code examples

### Beginner example (Python)

```python
import numpy as np
from scipy import integrate

def power_antiderivative(x: float, n: float) -> float:
    """F(x) = x^(n+1) / (n+1). Raises ValueError for n == -1."""
    if abs(n + 1) < 1e-12:
        raise ValueError("n = -1 is undefined for power rule. Use ln|x|.")
    return x ** (n + 1) / (n + 1)

def power_rule_definite(a: float, b: float, n: float) -> float:
    """Definite integral int_a^b x^n dx via FTC: F(b) - F(a)."""
    return power_antiderivative(b, n) - power_antiderivative(a, n)   # Test several values of n (including fractional and negative)
test_cases = [ (0.0, 2.0, 3.0),   # int x^3 dx from 0 to 2 = 4
    (1.0, 4.0, 0.5),   # int sqrt(x) dx from 1 to 4
    (1.0, 3.0, -2.0),   # int x^-2 dx from 1 to 3
    (0.0, 1.0, 0.0),   # int 1 dx from 0 to 1 = 1
]
for a, b, n in test_cases:
    analytic = power_rule_definite(a, b, n)
numerical, _ = integrate.quad(lambda x, nn=n: x**nn, a, b)
print(f"n={n:5.1f}, [{a},{b}]: analytic={analytic:.6f}, " f"numerical={numerical:.6f}, match={abs(analytic - numerical) < 1e-8}")   # Polynomial: int_0^3 (2x^3 - 5x + 1) dx
# = 2*(81/4) - 5*(9/2) + 3 = 40.5 - 22.5 + 3 = 21.0
poly_analytic = (2 * power_rule_definite(0, 3, 3) - 5 * power_rule_definite(0, 3, 1) + power_rule_definite(0, 3, 0))
poly_numerical, _ = integrate.quad(lambda x: 2 * x**3 - 5 * x + 1, 0, 3)
print(f"\nPolynomial int_0^3 (2x^3-5x+1) dx: " f"analytic={poly_analytic:.4f}, numerical={poly_numerical:.4f}")
```

### Beginner example (R)

```r
power_antiderivative <- function(x, n) { if (abs(n + 1) < 1e-12) stop("n = -1 is undefined. Use ln|x| rule.") x^(n + 1) / (n + 1)
}
power_rule_definite <- function(a, b, n) { power_antiderivative(b, n) - power_antiderivative(a, n)
}  # Test cases
test_cases <- list(c(0, 2, 3), c(1, 4, 0.5), c(1, 3, -2), c(0, 1, 0))
for (tc in test_cases) { a <- tc[1]; b <- tc[2]; n <- tc[3]
  analytic <- power_rule_definite(a, b, n)
  numerical <- integrate(function(x) x^n, lower = a, upper = b)$value
  cat(sprintf("n=%5.1f, [%g,%g]: analytic=%.6f, numerical=%.6f, match=%s\n", n, a, b, analytic, numerical, isTRUE(all.equal(analytic, numerical, tol = 1e-7))))
}  # Polynomial: int_0^3 (2x^3 - 5x + 1)
dx = 21.0
poly_analytic <- (2 * power_rule_definite(0, 3, 3) - 5 * power_rule_definite(0, 3, 1) + power_rule_definite(0, 3, 0))
poly_numerical <- integrate(function(x) 2 * x^3 - 5 * x + 1, 0, 3)$value
cat(sprintf("\nPolynomial: analytic=%.4f, numerical=%.4f\n", poly_analytic, poly_numerical))
```

### Professional example (Python)

```python
"""
Power rule for computing Beta distribution moments in Bayesian A/B testing. E[X] for Beta(alpha, beta) = alpha / (alpha + beta).
Derived by applying power rule to the polynomial expansion of
(1-x)^(beta-1) and integrating term by term.
"""
import numpy as np
from scipy import integrate, stats

def beta_posterior_mean(prior_alpha: float, prior_beta: float, conversions: int, non_conversions: int) -> float:
    """E[theta] = alpha / (alpha + beta). Closed-form via power rule."""
    alpha = prior_alpha + conversions
    beta_param = prior_beta + non_conversions
    return alpha / (alpha + beta_param)

def beta_posterior_mean_numerical(prior_alpha: float, prior_beta: float, conversions: int, non_conversions: int) -> float:
    """Numerical check: int_0^1 x * f(x; alpha, beta) dx."""
    alpha = prior_alpha + conversions
    beta_param = prior_beta + non_conversions
    dist = stats.beta(alpha, beta_param)
    mean_num, _ = integrate.quad(lambda x: x * dist.pdf(x), 0.0, 1.0)
    return mean_num   # A/B experiment with non-informative Beta(1,1) prior
PRIOR_ALPHA = 1.0
PRIOR_BETA = 1.0
variants = { "Control A": (420, 80), "Variant B": (450, 50),
}
print(f"{'Variant':<12} {'Analytic E[X]':>14} {'Numerical E[X]':>15} {'Match':>6}")
print("-" * 52)
for name, (conv, non_conv) in variants.items():
    analytic = beta_posterior_mean(PRIOR_ALPHA, PRIOR_BETA, conv, non_conv)
numerical = beta_posterior_mean_numerical(PRIOR_ALPHA, PRIOR_BETA, conv, non_conv)
match = abs(analytic - numerical) < 1e-8
print(f"{name:<12} {analytic:>14.6f} {numerical:>15.6f} {str(match):>6}")
for name, (conv, non_conv) in variants.items():
    alpha = PRIOR_ALPHA + conv
beta_p = PRIOR_BETA + non_conv
dist = stats.beta(alpha, beta_p)
ci_lo, ci_hi = float(dist.ppf(0.025)), float(dist.ppf(0.975))
mean_val = alpha / (alpha + beta_p)
print(f"\n{name}: mean={mean_val:.4f}, 95% CI=[{ci_lo:.4f}, {ci_hi:.4f}]")
print("\n[Power rule derivation: E[X] = int_0^1 x*sum_k C(k)*x^k dx")
print(" Each x^(alpha+k) integrated by power rule -> closed-form alpha/(alpha+beta)]")
```

---

*Source: 1300 p. 235*
