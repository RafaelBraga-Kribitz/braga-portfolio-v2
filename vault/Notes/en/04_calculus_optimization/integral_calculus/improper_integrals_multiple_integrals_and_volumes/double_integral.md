---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Double Integral

$$
\iint_D f(x,y)\,dx\,dy
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
A double integral extends the idea of a single integral from a line (1D) to a planar region (2D). Instead of summing thin rectangles of area $f(x)\,dx$ along a line, you sum thin rectangular prisms of volume $f(x,y)\,dx\,dy$ over a 2D domain $D$. If $f(x,y) \geq 0$, the result is the volume under the surface $z = f(x,y)$ above the region $D$. If $f$ is a joint probability density function (joint PDF), the integral over any region gives the probability that the random vector $(X, Y)$ falls in that region. In DA/DS, double integrals appear in: joint distribution analysis (bivariate normal), computing expected values of functions of two random variables, marginalizing out one variable (marginalization = integrating out = one inner integral of the double integral), and in 2D kernel density estimation. They also underlie the derivation of the multivariate normal normalizing constant.

## Flowchart

```mermaid
flowchart TD
    A["Double integral: iint_D f(x,y) dx dy"] --> B["Identify the region D and order of integration"]
    B --> C{"Rectangular region D = [a,b] x [c,d]?"} C -- "Yes (Fubini applies directly)" --> D["Inner integral: fix x, integrate over y from c to d"] C -- "No (non-rectangular D)" --> E["Express y limits as functions of x: y from g1(x) to g2(x)"]
    D --> F["Outer integral: integrate result over x from a to b"]
    E --> F
    F --> G["Result: scalar volume or probability"]
    G --> H{"f is a joint PDF?"} H -- "Yes" --> I["Outer integral = marginal distribution of X"] H -- "No" --> J["Result is volume under surface z = f(x,y) over D"]
```

## Real-world use

### Where it is used

Probability theory: computing probabilities from joint PDFs, marginal distributions, expectations of functions of two random variables. Bayesian inference: joint posterior over two parameters. Signal processing: 2D convolution (image filtering), 2D Fourier transforms. Spatial statistics: kernel density estimation over a 2D domain, computing expected values under bivariate distributions.

### Problem it solves

Single integrals cannot capture two-dimensional accumulation. When two variables interact (joint distributions, surface areas, expected value of $g(X, Y)$), you need to accumulate over both simultaneously. The double integral provides the exact theoretical answer by iterating single integrals.

### How it solves the problem

By **Fubini's theorem**: for a continuous function on a rectangle $D = [a,b] \times [c,d]$:

$$
\iint_D f(x,y)\,dx\,dy = \int_a^b \left[\int_c^d f(x,y)\,dy\right]dx = \int_c^d \left[\int_a^b f(x,y)\,dx\right]dy
$$

You integrate with respect to one variable (treating the other as a constant) to get a function of the remaining variable, then integrate that. For non-rectangular regions, the inner limits become functions of the outer variable.

### Example in a business

A marketing analytics team models joint click probability with a bivariate normal over (age, income). The probability that a user has age in $[25, 40]$ and income in $[40K, 80K]$ is a double integral of the bivariate normal PDF over that rectangle. Marginalizing to get the age-only distribution requires integrating out income: $f_{\text{age}}(x) = \int_{-\infty}^{\infty} f(x,y)\,dy$, which is the inner integral of the double integral evaluated at each $x$.

## The formula, piece by piece

$$
\iint_D f(x,y)\,dx\,dy
$$

Each symbol:
- $\iint$: double integral sign — sum over a 2D region
- $D$: the domain of integration, a region in the $xy$-plane
- $f(x,y)$: the integrand — height/density/weight at point $(x,y)$
- $dx\,dy$: the infinitesimal area element ($\Delta x \cdot \Delta y$ in Riemann sum terms) **Iterated form (rectangular region)**:

$$
\iint_D f(x,y)\,dx\,dy = \int_a^b \int_c^d f(x,y)\,dy\,dx
$$

**Non-rectangular region** (y-limits depend on x):

$$
\iint_D f(x,y)\,dx\,dy = \int_a^b \int_{g_1(x)}^{g_2(x)} f(x,y)\,dy\,dx
$$

**Change to polar coordinates** (circular domains):

$$
\iint_D f(x,y)\,dx\,dy = \iint f(r\cos\theta, r\sin\theta)\,r\,dr\,d\theta
$$

(The extra $r$ is the Jacobian of the polar change of variables.)

## The formula in words

"Chop the region $D$ into tiny rectangular cells of area $\Delta x \cdot \Delta y$. At each cell $(x_i, y_j)$, the function value $f(x_i, y_j)$ is the height of a tiny rectangular prism. Sum all those tiny volumes: $\sum_{i,j} f(x_i, y_j)\,\Delta x\,\Delta y$. As $\Delta x, \Delta y \to 0$, this sum converges to the double integral." In practice (Fubini): "Fix $x$, integrate over all $y$-values in $D$ — this gives a 1D function $g(x)$. Then integrate $g(x)$ over all $x$."

## Critical Concepts

- **Fubini's theorem**: order of integration is swappable for continuous $f$ on a closed bounded region. The result is identical regardless of which variable is inner.
- **Marginalization**: for a joint PDF $f_{X,Y}(x,y)$, the marginal is $f_X(x) = \int_{-\infty}^{\infty} f_{X,Y}(x,y)\,dy$ — the inner integral of a double integral.
- **Joint probability**: $P(X \in A, Y \in B) = \int_A \int_B f_{X,Y}(x,y)\,dy\,dx$.
- **Expected value**: $E[g(X,Y)] = \iint g(x,y)\,f_{X,Y}(x,y)\,dx\,dy$.
- **Jacobian for change of variables**: when switching from $(x,y)$ to $(u,v)$, the area element transforms: $dx\,dy = |J|\,du\,dv$ where $J$ is the determinant of the Jacobian matrix.
- **Bivariate normal**: $\iint_{\mathbb{R}^2} \mathcal{N}(x,y;\mu,\Sigma)\,dx\,dy = 1$ is a double improper integral equal to 1, derivable via polar coordinates.
- **Numerical**: `scipy.integrate.dblquad` computes double integrals numerically; for high-dimensional extensions, Monte Carlo integration is used.

## Step-by-step calculation (tiny example)

Compute $\iint_D (x + y)\,dx\,dy$ where $D = [0,1] \times [0,2]$.

*Step 1: Set up the iterated integral (integrate $y$ first)*

$$
\int_0^1 \left[\int_0^2 (x + y)\,dy\right]dx
$$

*Step 2: Inner integral — integrate with respect to $y$ (treat $x$ as constant)*

$$
\int_0^2 (x + y)\,dy = \left[xy + \frac{y^2}{2}\right]_0^2 = (2x + 2) - 0 = 2x + 2
$$

*Step 3: Outer integral — integrate result with respect to $x$*

$$
\int_0^1 (2x + 2)\,dx = \left[x^2 + 2x\right]_0^1 = (1 + 2) - 0 = 3
$$

Result: $\iint_D (x+y)\,dx\,dy = 3$. *Verification: swap order (integrate $x$ first)*
$\int_0^2 \left[\int_0^1 (x + y)\,dx\right]dy = \int_0^2 [\frac{x^2}{2} + xy]_0^1\,dy = \int_0^2 (\frac{1}{2} + y)\,dy = [\frac{y}{2} + \frac{y^2}{2}]_0^2 = 1 + 2 = 3$ ✓

## Code examples

### Beginner example (Python)

```python
import numpy as np
from scipy import integrate

def f(x: float, y: float) -> float:
    """Integrand: f(x, y) = x + y over [0,1] x [0,2]."""
    return x + y   #
scipy.integrate.dblquad(f, x_lower, x_upper, y_lower_fn, y_upper_fn)
# Note: dblquad integrates y first (inner), then x (outer)
result, error = integrate.dblquad( f, 0, 1,   # x limits
    (outer) lambda x: 0,   # y lower limit
    (inner, can depend on x) lambda x: 2,   # y upper limit
    (inner, can depend on x) )
print(f"Double integral (x+y) over [0,1]x[0,2]: {result:.6f}")   # 3.0
print(f"Error estimate: {error:.2e}")   # Verify with 2D Riemann sum (brute force approximation)
N = 1_000
x_vals = np.linspace(0, 1, N)
y_vals = np.linspace(0, 2, N)
dx = 1.0 / (N - 1)
dy = 2.0 / (N - 1)
xx, yy = np.meshgrid(x_vals, y_vals)
riemann_sum = float(np.sum(f(xx, yy)) * dx * dy)
print(f"Riemann sum (N={N}x{N}): {riemann_sum:.6f}")
```

### Beginner example (R)

```r
library(cubature)  # or use manual iterated integrate()
f <- function(x, y) x + y  # Method 1: iterated integrate() calls
inner_integral <- function(x) { integrate(function(y) f(x, y), lower = 0, upper = 2)$value
}
result <- integrate(Vectorize(inner_integral), lower = 0, upper = 1)$value
cat("Double integral (x+y) over [0,1]x[0,2]:", result, "\n")  # 3 # Method 2: 2D Riemann sum verification
n <- 500L
x_vals <- seq(0, 1, length.out = n)
y_vals <- seq(0, 2, length.out = n)
dx <- 1 / (n - 1)
dy <- 2 / (n - 1)
grid <- outer(x_vals, y_vals, FUN = f)  # n x n matrix of f values
riemann_sum <- sum(grid) * dx * dy
cat("Riemann sum (N=500x500): ", riemann_sum, "\n")
```

### Professional example (Python)

```python
"""
Double integral
for bivariate normal marginalisation and joint probability. Joint probability:
    P(0 < X < 1, 0 < Y < 1) for a bivariate normal.
Marginal: f_X(x) = int_{-inf}^{inf} f_{X,Y}(x,y) dy (inner integral). Business context: model joint distribution of (click_propensity, purchase_propensity)
for a digital advertising segment. Compute the probability that both are > 0.5
(high-value users) and the marginal click distribution.
"""
import numpy as np
from scipy import integrate, stats   # Bivariate normal parameters
MU = np.array([0.6, 0.5])   # mean: (click_prop, purchase_prop)
SIGMA = np.array([[0.04, 0.02],   # covariance matrix
    [0.02, 0.09]])
rv = stats.multivariate_normal(mean=MU, cov=SIGMA)   # Joint PDF

def joint_pdf(x: float, y: float) -> float:
    return float(rv.pdf([x, y]))   # P(X > 0.5, Y > 0.5): double integral from 0.5 to inf on both
p_high_value, error = integrate.dblquad( joint_pdf, 0.5, np.inf,   # x limits lambda x:
    0.5,   # y lower lambda x: np.inf, # y upper
)
print(f"P(click_prop > 0.5 AND purchase_prop > 0.5): {p_high_value:.4f}")
print(f"Integration error: {error:.2e}")   # Marginal of X (click_propensity) via inner integral over Y

def marginal_x(x: float) -> float:
    """f_X(x) = int_{-inf}^{inf} f_{X,Y}(x,y) dy"""
    result, _ = integrate.quad(lambda y: joint_pdf(x, y), -np.inf, np.inf)
    return result   # Compare to analytic marginal: Normal(mu_x, sigma_x^2)
x_test_points = np.array([0.4, 0.5, 0.6, 0.7, 0.8])
analytic_marginal = stats.norm(loc=MU[0], scale=np.sqrt(SIGMA[0, 0]))
print("\nMarginal PDF of click_propensity:")
print(f" {'x':>6} | {'Numerical':>12} | {'Analytic':>12} | {'Match':>8}")
for x_val in x_test_points:
    num = marginal_x(x_val)
ana = float(analytic_marginal.pdf(x_val))
match = abs(num - ana) < 1e-5
print(f" {x_val:>6.2f} | {num:>12.6f} | {ana:>12.6f} | {str(match):>8}")   # Verify total
probability = 1
total_prob, _ = integrate.dblquad( joint_pdf, -np.inf, np.inf, lambda x: -np.inf, lambda x: np.inf,
)
print(f"\nTotal probability (double integral over R^2): {total_prob:.6f} (expected: 1.0)")
```

---

*Source: 1300 p. 265*
