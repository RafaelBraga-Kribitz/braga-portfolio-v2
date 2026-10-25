---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Integration by Parts

$$
\int u\,\frac{dv}{dx}\,dx = uv - \int v\,\frac{du}{dx}\,dx
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
Integration by parts (IBP) converts one integral into another, hopefully simpler, one. It is the integration analogue of the product rule for derivatives. When the integrand is a product of two functions and you cannot find an antiderivative directly, IBP is the tool: pick one factor to differentiate ($u$) and the other to integrate ($dv$). The method is useful in DS/DA for: deriving expected values $E[X^k]$ for continuous distributions (the moments), proving that $\Gamma(n+1) = n!$ (the factorial integral identity), showing entropy formulas hold ($H[X] = -\int f\log f\,dx$), deriving the survival function identity $E[X] = \int_0^\infty P(X > t)\,dt$ used in customer lifetime value (LTV) models, and establishing the log-derivative trick behind the REINFORCE policy gradient algorithm.

## Flowchart

```mermaid
flowchart TD
    A["Integral of a product: int f(x) g(x) dx"] --> B["Apply LIATE rule: choose u"]
    B --> C["Set dv = remaining factor dx"]
    C --> D["Differentiate: compute du = (du/dx) dx"]
    D --> E["Integrate: compute v = integral of dv"]
    E --> F["Apply IBP: uv - int v du"]
    F --> G{"Is the new integral simpler?"} G -- "Yes" --> H["Solve the new integral"] G -- "No, but similar form" --> I["Apply IBP again or use circular trick"] G -- "No, still complex" --> J["Try substitution or tabular method"]
    H --> K["Combine: uv - result + C"]
    I --> L["Solve algebraically if circular: 2*I = ... -> I = ..."]
```

## Real-world use

### Where it is used

When an integrand is a product of two qualitatively different functions (polynomial times exponential, polynomial times logarithm, exponential times trigonometric) and no direct antiderivative rule applies. In probability and statistics: computing moments, deriving entropy expressions, proving identities involving expectations. In machine learning theory: deriving gradient estimators and variance decompositions.

### Problem it solves

Direct integration fails on products. The product rule for derivatives tells us $(uv)' = u'v + uv'$. Rearranging and integrating both sides transforms the hard integral into a boundary term plus a different integral. The goal is to choose $u$ and $dv$ so the new integral $\int v\,du$ is easier than the original.

### How it solves the problem

Derivation from the product rule:
$(uv)' = u'v + uv'$
$\Rightarrow uv' = (uv)' - u'v$
$\Rightarrow \int uv'\,dx = uv - \int u'v\,dx$ Substituting $v' = dv/dx$:

$$
\int u\,\frac{dv}{dx}\,dx = uv - \int v\,\frac{du}{dx}\,dx
$$

**LIATE rule** for choosing $u$ (pick the type appearing earliest in the list):
**L**ogarithms, **I**nverse trig, **A**lgebraic (polynomials), **T**rigonometric, **E**xponential.
This ordering reflects what differentiates most cleanly: $\ln x \to 1/x$ (polynomial), polynomial $\to$ lower degree, trig/exp $\to$ themselves.

### Example in a business

Customer churn analysis: a customer's active lifetime $T$ follows an exponential distribution with rate $\lambda$ (mean lifetime $= 1/\lambda$). Expected lifetime $E[T] = \int_0^\infty t\lambda e^{-\lambda t}\,dt$. IBP with $u = t$, $dv = \lambda e^{-\lambda t}\,dt$ gives $E[T] = 1/\lambda$. This closed-form result is foundational for computing Expected Customer Lifetime Value (eLTV) = (Average Revenue per Period) / (Churn Rate). Without IBP, you would need numerical integration for every parameter value in a sensitivity analysis.

## The formula, piece by piece

$$
\int u\,\frac{dv}{dx}\,dx = uv - \int v\,\frac{du}{dx}\,dx
$$

Compact notation: $\int u\,dv = uv - \int v\,du$ Each symbol:
- $u$: the factor you choose to **differentiate** — should simplify when you take $du/dx$
- $dv/dx$: the factor you choose to **integrate** — should be integrable to get $v$
- $uv$: the boundary term — a product evaluated (no integral sign)
- $-\int v\,du/dx\,dx$: the new integral — hopefully simpler than the original
- $du/dx$: derivative of $u$ with respect to $x$
- $v$: antiderivative of $dv/dx$ (the $+C$ drops out and is absorbed into the final $+C$) For a definite integral:

$$
\int_a^b u\,\frac{dv}{dx}\,dx = \Big[uv\Big]_a^b - \int_a^b v\,\frac{du}{dx}\,dx
$$

## The formula in words

"The integral of $u$ times $v'$ equals the product $u$ times $v$ (evaluated at the bounds if definite), minus the integral of $v$ times $u'$. You have transferred the derivative from $v$ onto $u$: you pay the cost of the boundary term $uv$, and what you get back is a new integral with the roles swapped."

## Critical Concepts

- **Derived from product rule**: IBP is not a standalone trick; it is the product rule run backwards.
- **LIATE**: Logarithms integrate poorly but differentiate cleanly. Exponentials and trig differentiate/integrate to themselves. Polynomials reduce degree. So: choose $u$ = the function that simplifies when differentiated.
- **Repeated IBP**: For $\int x^n e^x\,dx$ ($n$ an integer), apply IBP $n$ times until the polynomial is gone. The **tabular (DI) method** speeds this up: write $u$ and its derivatives in one column, $dv$ and its integrals in another, then alternate signs and multiply diagonally.
- **Circular IBP**: $\int e^x\sin x\,dx$ requires two applications of IBP and returns an expression containing the original integral. Solve algebraically: move it to one side and divide.
- **Boundary term at infinity**: For improper integrals like $\int_0^\infty t\lambda e^{-\lambda t}\,dt$, the boundary term $[uv]_0^\infty$ must be evaluated carefully using L'Hôpital's Rule (the $te^{-\lambda t} \to 0$ as $t \to \infty$ part).
- **Entropy by parts**: $H(X) = -\int f(x)\ln f(x)\,dx$ often requires IBP to evaluate for specific distributions.

## Step-by-step calculation (tiny example)

Compute $\int x\,e^x\,dx$.

*Step 1: Choose u and dv using LIATE*
- $x$ is Algebraic, $e^x$ is Exponential. Algebraic comes before Exponential in LIATE.
- Set $u = x$ and $dv = e^x\,dx$.

*Step 2: Differentiate u and integrate dv*
- $\frac{du}{dx} = 1$, so $du = dx$
- $v = \int e^x\,dx = e^x$ (no $+C$ needed here)

*Step 3: Apply the formula*

$$
\int x\,e^x\,dx = x\,e^x - \int e^x \cdot 1\,dx = x\,e^x - \int e^x\,dx
$$

*Step 4: Solve the remaining integral*
$\int e^x\,dx = e^x$

*Step 5: Combine and add C*

$$
\int x\,e^x\,dx = x\,e^x - e^x + C = e^x(x - 1) + C
$$

*Step 6: Verify by differentiating (reversibility check)*

$$
\frac{d}{dx}\left[e^x(x-1) + C\right] = e^x(x-1) + e^x \cdot 1 = e^x x - e^x + e^x = x\,e^x \checkmark
$$

## Code examples

### Beginner example (Python)

```python
"""
Demonstrate IBP numerically: int_0^2 x * exp(x) dx. Analytic result via
IBP: u = x, dv = e^x dx -> du = dx, v = e^x int x*e^x
dx = x*e^x - int e^x
dx = x*e^x - e^x + C = e^x(x-1) + C Definite: [e^x(x-1)]_0^2 = e^2(1) - e^0(-1) = e^2 + 1
"""
import numpy as np
from scipy import integrate

def integrand(x: float) -> float:
    """Product of polynomial and exponential: x * e^x."""
    return x * np.exp(x)   # Numerical
area_numerical, error_est = integrate.quad(integrand, 0, 2)   # Analytic via IBP: antiderivative F(x) = e^x(x - 1)

def antiderivative(x: float) -> float:
    return np.exp(x) * (x - 1)
area_analytic = antiderivative(2) - antiderivative(0)
# = e^2 * (2-1) - e^0 * (0-1) = e^2 + 1
print(f"Numerical (scipy.quad): {area_numerical:.8f}")
print(f"Analytic (IBP, e^2 + 1): {area_analytic:.8f}")
print(f"Match: {abs(area_numerical - area_analytic) < 1e-8}")
print(f"e^2 + 1 = {np.exp(2) + 1:.8f}")   # Verify IBP formula at a point: d/dx[e^x(x-1)] should equal x*e^x
x_check = 1.5
h = 1e-7
deriv_numerical = (antiderivative(x_check + h) - antiderivative(x_check - h)) / (2 * h)
deriv_exact = x_check * np.exp(x_check)
print(f"\nDerivative check at x=1.5:")
print(f" d/dx[F(x)] numerical: {deriv_numerical:.8f}")
print(f" x*e^x exact: {deriv_exact:.8f}")
print(f" Match: {abs(deriv_numerical - deriv_exact) < 1e-5}")
```

### Beginner example (R)

```r
# IBP: int_0^2 x * exp(x) dx
# Analytic: [e^x(x-1)]_0^2 = e^2*(2-1) - e^0*(0-1) = e^2 + 1
integrand <- function(x) x * exp(x)  # Numerical
result_numerical <- integrate(integrand, lower = 0, upper = 2)$value  # Analytic antiderivative F(x) = e^x * (x - 1)
antiderivative <- function(x) exp(x) * (x - 1)
result_analytic <- antiderivative(2) - antiderivative(0)  # e^2 + 1
cat("Numerical (integrate):", result_numerical, "\n")  # ~8.389056
cat("Analytic (IBP): ", result_analytic, "\n")  # ~8.389056
cat("e^2 + 1 = ", exp(2) + 1, "\n")  # ~8.389056
cat("Match:", isTRUE(all.equal(result_numerical, result_analytic, tol = 1e-7)), "\n")  # Derivative check: d/dx [e^x(x-1)] should be x*e^x
x_check <- 1.5
h <- 1e-7
deriv_num <- (antiderivative(x_check + h) - antiderivative(x_check - h)) / (2 * h)
deriv_exact <- x_check * exp(x_check)
cat("\nDerivative check at x=1.5:\n")
cat(" Numerical d/dx[F]: ", deriv_num, "\n")  # 6.72...
cat(" x*exp(x) exact: ", deriv_exact, "\n")  # 6.72...
cat(" Match:", isTRUE(all.equal(deriv_num, deriv_exact, tol = 1e-5)), "\n")
```

### Professional example (Python)

```python
"""
IBP in survival
analysis: E[T] = int_0^inf
S(t) dt. Where
S(t) = P(T > t) is the survival function. This identity is derived via
IBP: E[T] = int_0^inf t * f(t) dt
u = t, dv = f(t) dt
du = dt, v = -S(t) [since S'(t) = -f(t)] IBP: [t*(-S(t))]_0^inf + int_0^inf S(t) dt = 0 + int_0^inf S(t) dt [boundary term vanishes: t*S(t) -> 0 as t->inf] For Exp(lambda): S(t) = e^{-lambda*t} E[T] = int_0^inf e^{-lambda*t} dt = 1/lambda. Business use: Expected Customer Lifetime = 1 / monthly_churn_rate. We verify the IBP identity numerically for two distributions. """ import numpy as np from scipy import integrate, stats from sklearn.linear_model import LinearRegression def expected_lifetime_direct(pdf_fn: object, t_max: float = 200.0) -> float: """E[T] via direct definition: int t * f(t) dt.""" result, _ = integrate.quad(lambda t: t * pdf_fn(t), 0, t_max) return result def expected_lifetime_survival(survival_fn: object, t_max: float = 200.0) -> float: """E[T] via IBP identity: int S(t) dt [S = survival function].""" result, _ = integrate.quad(survival_fn, 0, t_max) return result   # --- Exponential distribution: Exp(lambda=0.1) -> E[T] = 10 months ---
 LAMBDA_EXP = 0.1 exp_dist = stats.expon(scale=1.0 / LAMBDA_EXP) e_t_direct_exp = expected_lifetime_direct(exp_dist.pdf) e_t_survival_exp = expected_lifetime_survival(exp_dist.sf)   # sf = survival function
 e_t_analytic_exp = 1.0 / LAMBDA_EXP   # = 10 print("=== Exponential(lambda=0.1) ===")
 print(f" E[T] direct (int t*f(t) dt): {e_t_direct_exp:.4f}") print(f" E[T] IBP (int S(t) dt): {e_t_survival_exp:.4f}") print(f" E[T] analytic (1/lambda): {e_t_analytic_exp:.4f}") print(f" IBP identity holds: {abs(e_t_direct_exp - e_t_survival_exp) < 0.01}")   # --- Weibull distribution: shape=2, scale=5 -> E[T] = 5*Gamma(1.5) = 5*sqrt(pi)/2 ---
 SHAPE_W = 2.0 SCALE_W = 5.0 weibull_dist = stats.weibull_min(c=SHAPE_W, scale=SCALE_W) e_t_analytic_weibull = SCALE_W * float(np.math.gamma(1 + 1.0 / SHAPE_W)) e_t_direct_w = expected_lifetime_direct(weibull_dist.pdf, t_max=50.0) e_t_survival_w = expected_lifetime_survival(weibull_dist.sf, t_max=50.0) print("\n=== Weibull(shape=2, scale=5) ===") print(f" E[T] direct (int t*f(t) dt): {e_t_direct_w:.4f}") print(f" E[T] IBP (int S(t) dt): {e_t_survival_w:.4f}") print(f" E[T] analytic (scale*Gamma(1+1/shape)): {e_t_analytic_weibull:.4f}") print(f" IBP identity holds: {abs(e_t_direct_w - e_t_survival_w) < 0.01}")   # --- Business implication ---
 monthly_churn_rate = LAMBDA_EXP   # 10% churn per month
 avg_revenue_per_month = 50.0   # euros
 expected_ltv = avg_revenue_per_month / monthly_churn_rate print(f"\n=== Business Calculation ===") print(f" Monthly churn rate: {monthly_churn_rate:.0%}") print(f" Avg revenue/month: EUR {avg_revenue_per_month:.2f}") print(f" Expected LTV = rev/churn: EUR {expected_ltv:.2f}") print(f" [Derived via IBP: E[T] = int_0^inf S(t) dt = 1/lambda]")
```

---

*Source: 1300 p. 257*
