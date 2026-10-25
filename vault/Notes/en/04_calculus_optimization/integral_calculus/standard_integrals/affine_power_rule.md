---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Affine Power Rule

$$
\int (ax+b)^n\,dx = \frac{(ax+b)^{n+1}}{a(n+1)} + C
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The affine power rule is the power rule extended to a linear argument: instead of integrating $x^n$, we integrate a shifted and scaled version $(ax+b)^n$. The key change is the extra factor of $\frac{1}{a}$ in the denominator, which compensates for the chain rule: differentiating $(ax+b)^{n+1}$ brings out a factor of $a$ from the inside. In DA/DS, this rule appears whenever you integrate polynomial models built on shifted inputs: kernel density estimation with shifted bandwidth, computing areas under polynomial regression segments centered at non-zero points, integrating polynomial basis functions in spline models, and evaluating reliability functions of the form $(1 - \lambda t)^n$.

## Flowchart

```mermaid
flowchart TD
    A["Integral: int (ax+b)^n dx"] --> B{"n = -1?"} B -- "Yes" --> C["Use reciprocal log rule: (1/a)*ln|ax+b| + C"] B -- "No" --> D["Identify a, b, n"]
    D --> E["Increment exponent: n becomes n+1"]
    E --> F["Divide by new exponent AND by inner derivative a"]
    F --> G["Result: (ax+b)^(n+1) / (a*(n+1)) + C"]
    G --> H["Verify: d/dx [...] = (ax+b)^n"]
```

## Real-world use

### Where it is used

Whenever the integrand is a power of a linear expression $ax+b$: polynomial regression with shifted features, evaluating spline basis integrals, computing areas under shifted parabolic segments, normalizing shifted polynomial density approximations, reliability theory (time-to-failure integrals).

### Problem it solves

The plain power rule $\int u^n\,du = u^{n+1}/(n+1)$ assumes the argument is exactly $x$ (or a simple $u$-substitution variable). When the argument is $ax+b$, the substitution $u = ax+b$, $du = a\,dx$, so $dx = du/a$, introduces the compensating factor $1/a$. The affine power rule packages this substitution into a single formula.

### How it solves the problem

Let $u = ax+b$, so $du = a\,dx$, meaning $dx = \frac{1}{a}du$.

Then:

$$
\int (ax+b)^n\,dx = \int u^n\cdot\frac{du}{a} = \frac{1}{a}\cdot\frac{u^{n+1}}{n+1} + C = \frac{(ax+b)^{n+1}}{a(n+1)} + C
$$

The factor $1/a$ comes from the chain rule compensation. Verification: $\frac{d}{dx}\!\left[\frac{(ax+b)^{n+1}}{a(n+1)}\right] = \frac{(n+1)(ax+b)^n \cdot a}{a(n+1)} = (ax+b)^n$

### Example in a business

A polynomial regression model predicts revenue using a centered feature: $\hat{y} = (2x - 5)^3$ where $x$ is a normalized price index. To compute total predicted revenue over $x \in [2, 4]$, we integrate: $\int_2^4 (2x-5)^3\,dx = \left[\frac{(2x-5)^4}{2 \cdot 4}\right]_2^4 = \frac{3^4}{8} - \frac{(-1)^4}{8} = \frac{81-1}{8} = 10$.

## The formula, piece by piece

$$
\int (ax+b)^n\,dx = \frac{(ax+b)^{n+1}}{a(n+1)} + C
$$

Each symbol:
- $(ax+b)$: the affine (linear) inner function; $a$ is the slope, $b$ is the intercept
- $a$: the coefficient of $x$ inside the brackets; appears in the denominator as the chain rule compensation
- $n$: the outer exponent, any real number except $-1$
- $(ax+b)^{n+1}$: the inner function raised to the incremented exponent
- $a(n+1)$: two-part denominator: $a$ from the chain rule, $n+1$ from the power rule
- $C$: constant of integration When $b = 0$: reduces to $\int (ax)^n\,dx = \frac{(ax)^{n+1}}{a(n+1)} + C = \frac{a^n x^{n+1}}{n+1} + C$.
When $a = 1$: reduces to the plain shift $\int (x+b)^n\,dx = \frac{(x+b)^{n+1}}{n+1} + C$.

## The formula in words

"To integrate a linear expression raised to the power $n$: raise the exponent by one and divide by the new exponent (exactly as in the basic power rule), but additionally divide by the coefficient $a$ of $x$ inside the brackets. The $1/a$ factor compensates for the chain rule that would appear when differentiating the result."

## Critical Concepts

- **Chain rule compensation**: the $1/a$ denominator factor is the exact correction for the $a$ that differentiation of $(ax+b)$ would produce.
- **Derivation = u-substitution**: this formula is shorthand for $u = ax+b$, $du = a\,dx$.
- **Case $n = -1$**: yields $\int \frac{1}{ax+b}\,dx = \frac{1}{a}\ln|ax+b| + C$ (Reciprocal Logarithmic rule).
- **Verify always**: differentiate the result to confirm the chain rule was handled correctly.
- **Definite integral**: $\int_{\alpha}^{\beta} (ax+b)^n\,dx = \left[\frac{(ax+b)^{n+1}}{a(n+1)}\right]_\alpha^\beta$.

## Step-by-step calculation (tiny example)

Compute $\int (3x+2)^4\,dx$.

*Step 1: Identify a, b, n*
$a = 3$, $b = 2$, $n = 4$. Not $-1$, so formula applies.

*Step 2: Apply the formula*
$n + 1 = 5$. Result: $\frac{(3x+2)^5}{3 \cdot 5} + C = \frac{(3x+2)^5}{15} + C$.

*Step 3: Verify by differentiating*
$\frac{d}{dx}\!\left[\frac{(3x+2)^5}{15}\right] = \frac{5(3x+2)^4 \cdot 3}{15} = \frac{15(3x+2)^4}{15} = (3x+2)^4$

*Step 4: Evaluate a definite example*
$\int_0^1 (3x+2)^4\,dx = \left[\frac{(3x+2)^5}{15}\right]_0^1 = \frac{5^5}{15} - \frac{2^5}{15} = \frac{3125 - 32}{15} = \frac{3093}{15} = 206.2$

## Code examples

### Beginner example (Python)

```python
import numpy as np
from scipy import integrate

def affine_power_antiderivative(x: float, a: float, b: float, n: float) -> float:
    """F(x) = (ax+b)^(n+1) / (a*(n+1)). Undefined for n=-1 or a=0."""
    if abs(n + 1) < 1e-12:
        raise ValueError("n = -1: use (1/a)*ln|ax+b| instead.")
    if abs(a) < 1e-12:
        raise ValueError("a = 0: reduces to constant, not affine.")
    return (a * x + b) ** (n + 1) / (a * (n + 1))

def affine_power_definite(lo: float, hi: float, a: float, b: float, n: float) -> float:
    """int_lo^hi (ax+b)^n dx = F(hi) - F(lo)."""
    return (affine_power_antiderivative(hi, a, b, n) - affine_power_antiderivative(lo, a, b, n))


# Test cases
cases = [
    (0, 1, 3.0, 2.0, 4.0),    # int (3x+2)^4 from 0 to 1
    (0, 2, 2.0, 0.0, 3.0),    # int (2x)^3 from 0 to 2
    (1, 3, 1.0, -1.0, 2.0),   # int (x-1)^2 from 1 to 3
]
for lo, hi, a, b, n in cases:
    analytic = affine_power_definite(lo, hi, a, b, n)
    numerical, _ = integrate.quad(lambda x, aa=a, bb=b, nn=n: (aa*x+bb)**nn, lo, hi)
    print(f"int_({lo},{hi}) ({a}x+{b})^{n}: "
          f"analytic={analytic:.6f}, numerical={numerical:.6f}, "
          f"match={abs(analytic-numerical)<1e-8}")
```

### Beginner example (R)

```r
affine_power_antiderivative <- function(x, a, b, n) {
  if (abs(n + 1) < 1e-12) stop("n = -1: use (1/a)*ln|ax+b| rule.")
  if (abs(a) < 1e-12) stop("a = 0: not affine.")
  (a * x + b)^(n + 1) / (a * (n + 1))
}
affine_power_definite <- function(lo, hi, a, b, n) {
  affine_power_antiderivative(hi, a, b, n) - affine_power_antiderivative(lo, a, b, n)
}

# Test cases
cases <- list(c(0, 1, 3, 2, 4), c(0, 2, 2, 0, 3), c(1, 3, 1, -1, 2))
for (tc in cases) {
  lo <- tc[1]; hi <- tc[2]; a <- tc[3]; b <- tc[4]; n <- tc[5]
  analytic <- affine_power_definite(lo, hi, a, b, n)
  numerical <- integrate(function(x) (a*x+b)^n, lower=lo, upper=hi)$value
  cat(sprintf("int_(%g,%g) (%gx+%g)^%g: analytic=%.6f, num=%.6f, match=%s\n", lo, hi, a, b, n, analytic, numerical, isTRUE(all.equal(analytic, numerical, tol=1e-7))))
}
```

### Professional example (Python)

```python
"""
Affine power rule for integrating polynomial spline basis functions.

Natural cubic splines use piecewise polynomials over knot-defined intervals.
Each piece is a cubic polynomial in (x - knot_i), an affine power of degree 3.
Computing the integral of a spline (e.g., for expected value under a spline PDF)
uses the affine power rule repeatedly on each segment.

Here we fit a monotone cubic spline to a conversion rate curve and
compute the area under it over a price range.
"""
import numpy as np
from scipy import integrate
from scipy.interpolate import PchipInterpolator

# Simulated conversion rate vs. price (monotone decreasing)
price_knots = np.array([10.0, 20.0, 30.0, 40.0, 50.0, 60.0])
conv_rate = np.array([0.82, 0.71, 0.58, 0.43, 0.29, 0.17])

# Piecewise cubic hermite spline (C1-continuous, monotone)
spline = PchipInterpolator(price_knots, conv_rate)

# Goal: expected conversion rate over price range [15, 55] = (1/width) * integral
lo_price = 15.0
hi_price = 55.0
width = hi_price - lo_price

# Numerical integral of spline (affine cubics on each segment)
area, error = integrate.quad(spline, lo_price, hi_price)
expected_conversion = area / width
print(f"Price range: [{lo_price}, {hi_price}]")
print(f"Integral of spline: {area:.6f}")
print(f"Expected conversion rate: {expected_conversion:.4f}")
print(f"Integration error estimate: {error:.2e}")

# Show per-segment analytic contributions (affine power rule)
segments = list(zip(price_knots[:-1], price_knots[1:]))
print("\nPer-segment integral (spline evaluated numerically on each):")
total_check = 0.0
for seg_lo, seg_hi in segments:
    seg_area, _ = integrate.quad(spline, seg_lo, seg_hi)
    total_check += seg_area
    print(f" [{seg_lo:.0f}, {seg_hi:.0f}]: area = {seg_area:.6f}")

# The segments cover the full knot range [10, 60]
full_area, _ = integrate.quad(spline, price_knots[0], price_knots[-1])
print(f" Sum of segments: {total_check:.6f} (matches full integral: "
      f"{abs(total_check - full_area) < 1e-8})")
```

---

*Source: MFB p. 206*
