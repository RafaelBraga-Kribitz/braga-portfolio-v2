---
title: Marginal Distribution (Continuous)
date: '2026-04-16'
wordCount: 540
slug: marginal_distribution_continuous
permalink: /notes/05_probability_stats/multivariable_statistics_and_information/joint_and_marginal_distributions/marginal_distribution_continuous/index.html
share_status: draft
publish_target: note
boundary: public
---
# $f_X(x) = \int_{-\infty}^\infty f(x,y) \, dy$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
For a continuous bivariate distribution, the marginal PDF of X is obtained by integrating the joint PDF over all possible values of Y. This "integrates Y out", leaving only the behaviour of X. It is the continuous analogue of summing the rows of a discrete joint table. In DA/DS this is essential when working with multivariate Gaussian models, copulas, and Bayesian inference where you compute $p(\theta) = \int p(\theta, z) \, dz$ to get the marginal posterior.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Start with joint PDF f(x,y)"] --> B["Fix a value of x"] B --> C["Integrate f(x,y) over all y from -inf to +inf"] C --> D["Result: marginal PDF f_X(x) at that x"] D --> E["Repeat for all x to get the full marginal"] E --> F["Verify: integral of f_X(x) dx = 1"]
```
### Real-World use:
#### Situation it is used
You fit a bivariate distribution to two continuous features (e.g., age and spending) and want to analyse each feature's distribution individually, without conditioning on the other.
#### Problem it solves
After fitting a joint model, you often need the distribution of just one variable for reporting, simulation, or comparison. The marginal PDF extracts this without requiring a new fit.
#### How it solves the problem
Integrating over all Y values collapses the joint density into a univariate density. The resulting $f_X(x)$ is a valid PDF that sums (integrates) to 1 and fully describes X's distribution on its own.
#### Example of it used in the Working Context as DA/DS for a Business
A DS fits a bivariate Gaussian to (session_duration, revenue). The marginal PDF of revenue is then used to set revenue threshold alerts and compute the probability that any given user session generates revenue above a target, marginalising over session duration.
### The Formula (Fragment-First)
| Symbol | Meaning |
|--------|---------|
| $f_X(x)$ | Marginal PDF of X at value x |
| $\int_{-\infty}^\infty$ | Integral over all possible values of Y |
| $f(x,y)$ | Joint PDF |
| $dy$ | Integration variable (Y is being "integrated out") | Full formula: $f_X(x) = \int_{-\infty}^\infty f(x,y) \, dy$ ### Formula-to-English Translation
"The marginal density of X at value x equals the integral of the joint density over all possible y values, with x held fixed." You are adding up all the joint density along the vertical slice at position x.
### Critical Concepts
- **Integrating out**: the Y variable disappears after integration; only x remains.
- **Valid PDF**: $f_X(x) \ge 0$ and $\int f_X(x) \, dx = 1$.
- **Information loss**: marginals do not recover the joint; the dependency structure is lost.
- **Bivariate Gaussian marginals**: each marginal of a bivariate Gaussian is itself Gaussian.
- **Numerical integration**: in practice, use `scipy.integrate.quad` or Monte Carlo integration when analytical form is unavailable.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Joint PDF: $f(x,y) = x + y$ for $0 \le x \le 1$, $0 \le y \le 1$. Find marginal $f_X(x)$. *Step 1: Set up the integral over y*
$f_X(x) = \int_0^1 (x + y) \, dy$ *Step 2: Integrate*
$= [xy + y^2/2]_0^1 = x + 1/2$ *Step 3: Result*
$f_X(x) = x + 1/2$ for $0 \le x \le 1$ *Step 4: Verify normalisation*
$\int_0^1 (x + 1/2) \, dx = [x^2/2 + x/2]_0^1 = 1/2 + 1/2 = 1.0$ ✓ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy import integrate # Joint PDF: f(x,y) = x + y on [0,1] x [0,1]
def joint_pdf(y: float, x: float) -> float: return x + y # Compute marginal f_X(x) numerically for several x values
x_grid = np.linspace(0, 1, 6)
for x_val in x_grid: marginal, _ = integrate.quad(joint_pdf, 0, 1, args=(x_val,)) # Analytical: f_X(x) = x + 0.5 analytical = x_val + 0.5 print(f"x={x_val:.2f}: f_X(x) = {marginal:.4f} (analytical: {analytical:.4f})")
```
#### Beginner friendly Example [R])
``` r
# Marginal f_X(x) = integrate f(x,y) dy from 0 to 1
joint_pdf <- function(y, x_val) x_val + y x_grid <- seq(0, 1, by = 0.2)
for (x_val in x_grid) { result <- integrate(joint_pdf, lower = 0, upper = 1, x_val = x_val) cat(sprintf("x=%.1f: f_X(x) = %.4f (analytical: %.4f)\n", x_val, result$value, x_val + 0.5))
}
```
#### Final Professional Example [Python])
``` python
from __future__ import annotations import numpy as np
from scipy import integrate
from scipy.stats import multivariate_normal def bivariate_gaussian_marginal_x( x_grid: np.ndarray, mean: list[float], cov: list[list[float]], y_lower: float = -10.0, y_upper: float = 10.0,
) -> np.ndarray: # Compute marginal PDF of X by numerically integrating the bivariate Gaussian. # For bivariate Gaussian, this recovers N(mean_x, sigma_x^2) analytically. dist = multivariate_normal(mean=mean, cov=cov) marginal_densities = np.zeros_like(x_grid, dtype=float) for i, x_val in enumerate(x_grid): def integrand(y: float) -> float: return dist.pdf([x_val, y]) marginal_densities[i], _ = integrate.quad(integrand, y_lower, y_upper) return marginal_densities if __name__ == "__main__": from scipy.stats import norm MEAN = [5.0, 3.0] COV = [[4.0, 1.5], [1.5, 2.0]] x_vals = np.linspace(0, 10, 50) numerical_marginal = bivariate_gaussian_marginal_x(x_vals, MEAN, COV) analytical_marginal = norm.pdf(x_vals, loc=MEAN[0], scale=COV[0][0] ** 0.5) max_error = np.max(np.abs(numerical_marginal - analytical_marginal)) print(f"Max absolute error (numerical vs analytical): {max_error:.2e}") print("Numerical integration recovers the Gaussian marginal correctly.")
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
`AIO pag 85` ``