---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Exponential

$$
\int e^{ax+b}\,dx = \frac{1}{a}e^{ax+b} + C
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The exponential function $e^x$ is its own derivative and its own antiderivative (up to a constant). When the exponent is an affine expression $ax+b$, the antiderivative gains a factor of $1/a$ from the chain rule compensation, just like the affine power rule. In DA/DS, this formula is everywhere: computing the moment generating function $M_X(t) = E[e^{tX}]$ of distributions, integrating the Gaussian kernel in density estimation, computing expected discounted values in finance (discount factor $e^{-rt}$), evaluating the normalizing constant of the exponential distribution, and computing the CDF of any distribution with exponential decay.

## Flowchart

```mermaid
flowchart TD
    A["Integral: int e^(ax+b) dx"] --> B["Identify a (coefficient of x) and b (constant)"]
    B --> C["a = 0? Then integrand is constant e^b"] C -- "Yes" --> D["Result: e^b * x + C"] C -- "No" --> E["Apply formula: (1/a) * e^(ax+b) + C"]
    E --> F["Verify: d/dx [(1/a)*e^(ax+b)] = e^(ax+b)"]
```

## Real-world use

### Where it is used

Whenever an integrand contains a natural exponential with a linear argument: normalizing constants of exponential distributions, Gaussian integrals after completing the square, discount factors in revenue forecasting, survival function integrals $\int_0^\infty e^{-\lambda t}\,dt = 1/\lambda$, and moment generating functions $E[e^{tX}]$ for exponential families.

### Problem it solves

The exponential function is the only function that is its own derivative. This makes it very easy to integrate: the antiderivative of $e^{ax+b}$ differs only by the $1/a$ factor. Without this formula, you would need u-substitution every single time, slowing down work on any problem involving exponential decay or growth.

### How it solves the problem

Let $u = ax + b$, $du = a\,dx$, so $dx = du/a$:

$$
\int e^{ax+b}\,dx = \int e^u \cdot \frac{du}{a} = \frac{1}{a}e^u + C = \frac{1}{a}e^{ax+b} + C
$$

Verification: $\frac{d}{dx}\!\left[\frac{1}{a}e^{ax+b}\right] = \frac{1}{a}\cdot e^{ax+b}\cdot a = e^{ax+b}$

### Example in a business

Customer churn follows an exponential distribution with rate $\lambda = 0.05$ per month. The expected number of customers still active after $t$ months is $N_0\,e^{-\lambda t}$. Total customer-months of service from time 0 to $T$: $\int_0^T N_0\,e^{-\lambda t}\,dt = \frac{N_0}{\lambda}(1 - e^{-\lambda T})$. This feeds directly into total revenue and LTV calculations for any subscription business.

## The formula, piece by piece

$$
\int e^{ax+b}\,dx = \frac{1}{a}e^{ax+b} + C
$$

Each symbol:
- $e$: Euler's number, the base of the natural logarithm, $\approx 2.71828$
- $ax+b$: the linear exponent; $a$ scales the growth/decay rate, $b$ is an offset
- $a$: the coefficient of $x$ in the exponent; appears in the denominator as chain rule compensation
- $\frac{1}{a}$: the compensating factor (if $a > 0$, growth is faster so the integral is smaller; if $0 < a < 1$, growth is slower so the integral is larger)
- $C$: constant of integration Special cases:
- $a=1, b=0$: $\int e^x\,dx = e^x + C$ (the classic)
- $a=-1, b=0$: $\int e^{-x}\,dx = -e^{-x} + C$
- $a=-\lambda, b=0$: $\int e^{-\lambda x}\,dx = -\frac{1}{\lambda}e^{-\lambda x} + C$

## The formula in words

"The antiderivative of $e$ to the power $(ax+b)$ is the same function, divided by the coefficient $a$ that multiplies $x$ in the exponent. The division by $a$ is the compensation for the extra $a$ that would appear when you differentiate the result back via the chain rule."

## Critical Concepts

- **Self-similar**: $e^x$ integrates to itself. The only modification for $ax+b$ is the $1/a$ factor.
- **Sign matters**: $\int e^{-\lambda x}\,dx = -\frac{1}{\lambda}e^{-\lambda x} + C$. The negative sign is in the $1/a = 1/(-\lambda)$.
- **Improper integrals**: $\int_0^\infty e^{-\lambda x}\,dx = \frac{1}{\lambda}$ (finite for $\lambda > 0$). This is the normalizing constant of the exponential distribution.
- **Gaussian connection**: $\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}$ (Gaussian integral) — this is NOT directly this formula because the exponent is $x^2$, not linear.
- **Moment generating function**: $E[e^{tX}]$ for $X \sim \text{Exp}(\lambda)$ uses $\int_0^\infty e^{tx}\lambda e^{-\lambda x}\,dx = \int_0^\infty \lambda e^{(t-\lambda)x}\,dx = \frac{\lambda}{\lambda - t}$ for $t < \lambda$.

## Step-by-step calculation (tiny example)

Compute $\int e^{-3x+1}\,dx$ and $\int_0^2 e^{-3x+1}\,dx$.

*Step 1: Identify a and b*
$a = -3$, $b = 1$.

*Step 2: Apply the formula*
$\frac{1}{a} = \frac{1}{-3} = -\frac{1}{3}$. Result: $-\frac{1}{3}e^{-3x+1} + C$.

*Step 3: Verify by differentiating*
$\frac{d}{dx}\!\left[-\frac{1}{3}e^{-3x+1}\right] = -\frac{1}{3}\cdot e^{-3x+1}\cdot(-3) = e^{-3x+1}$

*Step 4: Evaluate the definite integral*
$\int_0^2 e^{-3x+1}\,dx = \left[-\frac{1}{3}e^{-3x+1}\right]_0^2$
$= -\frac{1}{3}e^{-5} - \left(-\frac{1}{3}e^{1}\right) = \frac{1}{3}(e - e^{-5}) \approx \frac{1}{3}(2.718 - 0.00674) \approx 0.904$

## Code examples

### Beginner example (Python)

```python
import numpy as np
from scipy import integrate

def exp_antiderivative(x: float, a: float, b: float) -> float:
    """F(x) = (1/a) * exp(ax + b). Undefined for a=0."""
    if abs(a) < 1e-12:
        raise ValueError("a = 0: integrand is constant e^b, not affine exponential.")
    return (1.0 / a) * np.exp(a * x + b)

def exp_definite(lo: float, hi: float, a: float, b: float) -> float:
    """int_lo^hi e^(ax+b) dx = F(hi) - F(lo)."""
    return exp_antiderivative(hi, a, b) - exp_antiderivative(lo, a, b)   # Test cases
cases = [ (0.0, 1.0, 1.0, 0.0),   # int e^x from 0 to 1 = e - 1
    (0.0, 2.0, -3.0, 1.0),   # int e^(-3x+1) from 0 to 2
    (0.0, np.inf, -2.0, 0.0),   # int e^(-2x) from 0 to inf = 1/2
]
for lo, hi, a, b in cases:
    analytic = exp_definite(lo, hi, a, b)
numerical, _ = integrate.quad(lambda x, aa=a, bb=b: np.exp(aa*x+bb), lo, hi)
print(f"int_({lo},{hi}) e^({a}x+{b}): " f"analytic={analytic:.6f}, numerical={numerical:.6f}, " f"match={abs(analytic-numerical)<1e-6}")   # Exponential distribution normalizing constant: int_0^inf lambda*e^(-lambda*x)
dx = 1
LAMBDA = 0.5
norm_const, _ = integrate.quad(lambda t: LAMBDA * np.exp(-LAMBDA * t), 0, np.inf)
print(f"\nExp({LAMBDA}) normalizing: int_0^inf lambda*e^(-lambda*t) dt = {norm_const:.6f} (should be 1.0)")
```

### Beginner example (R)

```r
exp_antiderivative <- function(x, a, b) { if (abs(a) < 1e-12) stop("a = 0: not a valid affine exponential.") (1 / a) * exp(a * x + b)
}
exp_definite <- function(lo, hi, a, b) { exp_antiderivative(hi, a, b) - exp_antiderivative(lo, a, b)
}  # Test cases
cases <- list(c(0, 1, 1, 0), c(0, 2, -3, 1))
for (tc in cases) { lo <- tc[1]; hi <- tc[2]; a <- tc[3]; b <- tc[4]
  analytic <- exp_definite(lo, hi, a, b)
  numerical <- integrate(function(x) exp(a*x+b), lower=lo, upper=hi)$value
  cat(sprintf("int_(%g,%g) exp(%gx+%g): analytic=%.6f, num=%.6f, match=%s\n", lo, hi, a, b, analytic, numerical, isTRUE(all.equal(analytic, numerical, tol=1e-7))))
}  # Normalizing constant of Exp(lambda=0.5)
lambda_val <- 0.5
norm <- integrate(function(t) lambda_val * exp(-lambda_val * t), 0, Inf)$value
cat(sprintf("\nExp(0.5) normalizing constant: %.6f (should be 1.0)\n", norm))
```

### Professional example (Python)

```python
"""
Exponential integral
for subscription revenue forecasting
with churn. Model:
    customers active at time t follow exponential decay. N(t) = N_0 * exp(-lambda * t) [exponential distribution of churn] Total revenue from time 0 to T: R(T) = r * int_0^T N_0 * exp(-lambda * t)
dt = r * N_0 * (1/lambda) * (1 - exp(-lambda * T)) This uses the formula: int e^(at+b)
dt = (1/a)*e^(at+b) + C
with a = -lambda, b = 0. We also compute the LTV (limit as T -> infinity):
    LTV = r * N_0 / lambda
"""
import numpy as np
from scipy import integrate

def total_revenue(initial_customers: float, revenue_per_customer_month: float, monthly_churn_rate: float, months: float) -> float:
    """Closed-form: R(T) = r * N0 * (1/lambda) * (1 - exp(-lambda*T))."""
    lam = monthly_churn_rate
    return (revenue_per_customer_month * initial_customers * (1.0 / lam) * (1.0 - np.exp(-lam * months)))

def total_revenue_numerical(initial_customers: float, revenue_per_customer_month: float, monthly_churn_rate: float, months: float) -> float:
    """Numerical verification via scipy.quad."""
    lam = monthly_churn_rate
    result, _ = integrate.quad( lambda t: revenue_per_customer_month * initial_customers * np.exp(-lam * t), 0, months )
    return result   # Scenario parameters
N_0 = 10_000.0   # initial customer base
REVENUE_PER_MONTH = 25.0   # EUR per customer per month
CHURN_RATE = 0.04   # 4% monthly churn rate
MONTHS_12 = 12.0
MONTHS_24 = 24.0
print(f"=== Subscription Revenue Forecast ===")
print(f"Initial customers: {N_0:,.0f}")
print(f"Revenue/customer/month: EUR {REVENUE_PER_MONTH:.2f}")
print(f"Monthly churn: {CHURN_RATE:.1%}")
print()
for months in [MONTHS_12, MONTHS_24]:
    analytic = total_revenue(N_0, REVENUE_PER_MONTH, CHURN_RATE, months)
numerical = total_revenue_numerical(N_0, REVENUE_PER_MONTH, CHURN_RATE, months)
match = abs(analytic - numerical) < 0.01
print(f"{months:.0f}-month revenue: EUR {analytic:>12,.2f} (numerical={numerical:,.2f}, match={match})")   # LTV: limit as T -> infinity
ltv = REVENUE_PER_MONTH * N_0 / CHURN_RATE
print(f"\nTotal LTV (T->inf): EUR {ltv:>12,.2f}")
print(f"[Formula: r * N0 * int_0^inf e^(-lambda*t) dt = r * N0 / lambda]")   # Sensitivity: effect of churn rate on LTV
print(f"\n=== LTV Sensitivity to Churn Rate ===")
for churn in [0.02, 0.04, 0.06, 0.08, 0.10]:
    ltv_s = REVENUE_PER_MONTH * N_0 / churn
print(f" Churn={churn:.0%}: LTV = EUR {ltv_s:>10,.0f}")
```

---

*Source: 1300 p. 250*
