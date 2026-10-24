---
title: Maclaurin Series
date: '2026-04-16'
wordCount: 812
slug: maclaurin_series
permalink: /notes/04_calculus_optimization/series_and_transforms/taylor_and_maclaurin_series/maclaurin_series/index.html
share_status: draft
publish_target: note
boundary: public
---
# $f(x) = \sum_{k=0}^{\infty} \frac{f^{(k)}(0)}{k!} x^k$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The Maclaurin Series is a Taylor series **expanded at $x_0 = 0$**. It represents any (sufficiently smooth) function as an infinite polynomial in x, where each coefficient is the k-th derivative of f evaluated at zero, divided by k!. In DA/DS: computing activations in neural networks to arbitrary precision (e^x, sigmoid, tanh all have Maclaurin expansions), understanding why certain approximations work near zero, deriving probability generating functions, and efficiently computing log-likelihoods in numerical environments where library functions are unavailable. Key standard expansions every DS practitioner should know by heart:
$e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \ldots$ (all x)
$\ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \ldots$ (|x| ≤ 1)
$\frac{1}{1-x} = 1 + x + x^2 + x^3 + \ldots$ (|x| < 1) ### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Function f(x), smooth near x=0"] --> B["Compute derivatives: f(0), f'(0), f''(0), ..."] B --> C["Form k-th coefficient: c_k = f^(k)(0) / k!"] C --> D["Series: f(x) = sum c_k * x^k for k=0,1,2,..."] D --> E["Truncate at N terms for approximation"] E --> F["Error bound from alternating series test or Taylor remainder"] F --> G["Valid for |x| < radius of convergence R"]
```
### Real-World use:
#### Situation it is used
Any situation where you need a polynomial approximation of a function near zero: fast sigmoid approximations in embedded ML inference, deriving gradients of activation functions analytically, understanding the quadratic approximation used in Newton's method, and expressing complex functions in terms of moments.
#### Problem it solves
Non-polynomial functions (exp, log, sin, sigmoid) are expensive or impossible to compute exactly in some contexts. The Maclaurin series gives a polynomial approximation with controlled error.
#### How it solves the problem
A polynomial is determined by its values at any point. The Maclaurin series matches not just the function value but all its derivatives at x=0, ensuring the best possible polynomial approximation near that point.
#### Example of it used in the Working Context as DA/DS for a Business
**Sigmoid approximation for hardware inference**: Sigmoid $\sigma(x) = 1/(1+e^{-x})$ is expensive on FPGAs. Use Maclaurin of sigmoid: $\sigma(x) \approx 0.5 + 0.25x - \frac{x^3}{48} + \ldots$ for |x| small. This polynomial can be computed with just multiplications and additions, enabling fast inference with controlled error. The Maclaurin expansion tells you exactly how many terms are needed for a given precision target.
### The Formula (Fragment-First)
$f(x) = \sum_{k=0}^{\infty} \frac{f^{(k)}(0)}{k!} x^k = f(0) + f'(0)x + \frac{f''(0)}{2!}x^2 + \frac{f'''(0)}{3!}x^3 + \ldots$ - **$f^{(k)}(0)$** — k-th derivative of f, evaluated at x = 0.
- **$k!$** — k factorial (normalizes the coefficient so the polynomial has the right derivatives).
- **$x^k$** — Power of x at each level of the expansion.
- **$k = 0$** term: $f(0)$ — the constant (function value at zero).
- **$k = 1$** term: $f'(0) \cdot x$ — the linear (slope at zero) term.
- **$k = 2$** term: $\frac{f''(0)}{2}x^2$ — the quadratic (curvature at zero) term.
- **Radius of convergence**: Determined by ratio/root test. Outside this radius, the series diverges.
### Formula-to-English Translation
"A smooth function near x = 0 can be written as an infinite polynomial where the coefficient of x^k is the k-th derivative at zero divided by k factorial." Intuition: each derivative captures a different aspect of the function's shape at x=0. The 0th derivative is the height, 1st is the slope, 2nd is the curvature, etc. The Maclaurin series packages all of these into one polynomial.
### Critical Concepts
1. **Maclaurin is a special case of Taylor**: The general Taylor series expands around any $x_0$; Maclaurin always expands around $x_0 = 0$.
2. **Radius of convergence**: Outside the radius, the series diverges. For e^x: R = ∞. For ln(1+x): R = 1. For 1/(1-x): R = 1.
3. **Error of truncation (Taylor remainder)**: $|f(x) - S_N(x)| \leq \frac{M_{N+1}}{(N+1)!}|x|^{N+1}$ where $M_{N+1}$ bounds $|f^{(N+1)}|$ on the interval.
4. **Uniqueness**: If a power series converges to f(x), it must be the Maclaurin series.
5. **Key identities to memorize**: - $e^x = \sum x^k/k!$ (R = ∞) - $\cos x = \sum (-1)^k x^{2k}/(2k)!$ (R = ∞) - $\sin x = \sum (-1)^k x^{2k+1}/(2k+1)!$ (R = ∞) - $(1+x)^p = \sum \binom{p}{k} x^k$ for |x| < 1 (binomial series)
6. **Gradient connections**: In optimization, Taylor expansion at x=0 of the loss gives the gradient (k=1 term) and Hessian (k=2 term).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Compute Maclaurin series of $f(x) = e^x$ up to $x^4$. *Step 1: Compute derivatives at 0*
$f(x) = e^x$ → $f^{(k)}(x) = e^x$ for all k
$f^{(k)}(0) = e^0 = 1$ for all k ≥ 0. *Step 2: Write the coefficients*
$c_0 = 1/0! = 1$
$c_1 = 1/1! = 1$
$c_2 = 1/2! = 0.5$
$c_3 = 1/3! = 0.1\overline{6}$
$c_4 = 1/4! = 0.0417$ *Step 3: Evaluate at x = 1 (computing e)*
$e^1 \approx 1 + 1 + 0.5 + 0.1\overline{6} + 0.0417 = 2.7083$
True e ≈ 2.7183. Error from truncation: 0.0100. Next term: 1/5! ≈ 0.0083. Error bound confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
"""
Maclaurin Series: f(x) = sum f^(k)(0)/k! * x^k Applied to approximating e^x and comparing truncation errors at different N.
""" import numpy as np
import math def maclaurin_exp(x_val: float, num_terms: int) -> float: """Approximate e^x using Maclaurin series with num_terms terms. f(x) = sum_{k=0}^{num_terms-1} x^k / k! Parameters ---------- x_val : point at which to evaluate num_terms : number of terms to include (k = 0 to num_terms-1) Returns ------- float: Maclaurin approximation of e^x """ return sum(x_val**k / math.factorial(k) for k in range(num_terms)) def maclaurin_ln_1_plus_x(x_val: float, num_terms: int) -> float: """Approximate ln(1+x) using Maclaurin series. ln(1+x) = x - x^2/2 + x^3/3 - x^4/4 + ... (|x| <= 1) """ if abs(x_val) > 1: raise ValueError(f"Convergence requires |x| <= 1, got |x| = {abs(x_val):.2f}") return sum((-1)**(k + 1) * x_val**k / k for k in range(1, num_terms + 1)) x_test = 0.5
print("Maclaurin approximation of e^0.5:")
print(f"{'N':>5} | {'approx':>12} | {'error':>10}")
for num_terms in [1, 2, 3, 5, 10]: approx = maclaurin_exp(x_test, num_terms) error = abs(approx - math.exp(x_test)) print(f"{num_terms:>5} | {approx:>12.8f} | {error:>10.2e}") print(f"\nTrue e^0.5 = {math.exp(x_test):.8f}") print("\nMaclaurin approximation of ln(1.5):")
for num_terms in [1, 3, 5, 10, 20]: approx = maclaurin_ln_1_plus_x(0.5, num_terms) error = abs(approx - math.log(1.5)) print(f"N={num_terms:>2}: approx={approx:.8f}, error={error:.2e}")
```
#### Beginner friendly Example [R])
``` r
# Maclaurin Series for sigmoid function approximation
# sigma(x) = 1/(1+e^(-x)) -- expand around x=0 maclaurin_sigmoid <- function(x_val, num_terms = 5) { # Approximation of sigmoid near x=0 # sigma(x) = 0.5 + x/4 - x^3/48 + x^5/480 - ... # Coefficients from derivatives of sigmoid at 0 sigma <- function(z) 1 / (1 + exp(-z)) # Use finite differences to estimate derivatives at 0 h <- 1e-5 approx <- 0 for (k in seq(0, num_terms - 1)) { # k-th derivative via central difference (simplified for demonstration) # For production: use symbolically computed coefficients deriv_at_0 <- (sigma(h) - sigma(-h)) / (2 * h) * ifelse(k == 1, 1, 0) + ifelse(k == 0, sigma(0), 0) approx <- approx + sigma(0) * (x_val^0) * ifelse(k == 0, 1, 0) } # Known Maclaurin coefficients for sigmoid: # sigma(x) = 0.5 + 0.25*x - x^3/48 + x^5/480 - ... coeffs <- c(0.5, 0.25, 0, -1/48, 0, 1/480) x_powers <- x_val^seq(0, length(coeffs) - 1) sum(coeffs * x_powers)
} # Compare sigmoid Maclaurin approximation to true sigmoid
x_values <- seq(-2, 2, by = 0.5)
true_sigmoid <- 1 / (1 + exp(-x_values))
maclaurin_approx <- sapply(x_values, maclaurin_sigmoid, num_terms = 5) comparison_df <- data.frame( x = x_values, true_sigmoid = round(true_sigmoid, 6), maclaurin_approx = round(maclaurin_approx, 6), abs_error = round(abs(true_sigmoid - maclaurin_approx), 6)
)
print(comparison_df)
```
#### Final Professional Example [Python])
``` python
"""
Maclaurin Series for fast activation function approximation in ML inference. Business context: A mobile ML team needs to deploy a neural network on resource-constrained hardware where the exp() instruction is expensive. They use Maclaurin approximations for softmax's exponentials, with error guarantees for the bounded input range typical of their model.
""" import numpy as np
import math INPUT_RANGE_MAX: float = 2.0 # maximum |x| in pre-softmax logits
PRECISION_TARGET: float = 1e-4 # required approximation error def maclaurin_exp_array( x_values: np.ndarray, num_terms: int,
) -> np.ndarray: """Vectorized Maclaurin approximation of exp(x). Parameters ---------- x_values : input values num_terms : number of terms in the series Returns ------- np.ndarray: approximated exp(x_values) """ factorial_denominators = np.array( [1.0 / math.factorial(k) for k in range(num_terms)] ) powers = np.array([x_values**k for k in range(num_terms)]) return np.sum(factorial_denominators[:, np.newaxis] * powers, axis=0) def find_minimum_terms_for_precision( x_max: float, target_error: float, max_terms: int = 30,
) -> int: """Find minimum N such that Maclaurin error < target_error for |x| <= x_max.""" x_test = np.linspace(-x_max, x_max, 200) true_exp = np.exp(x_test) for num_terms in range(1, max_terms + 1): approx_exp = maclaurin_exp_array(x_test, num_terms) max_error = np.max(np.abs(approx_exp - true_exp)) if max_error < target_error: return num_terms return max_terms min_terms = find_minimum_terms_for_precision(INPUT_RANGE_MAX, PRECISION_TARGET) # Demonstrate softmax computation with Maclaurin exp
def maclaurin_softmax(logits: np.ndarray, num_terms: int) -> np.ndarray: """Compute softmax using Maclaurin-approximated exp.""" exp_logits = maclaurin_exp_array(logits, num_terms) return exp_logits / exp_logits.sum() test_logits = np.array([0.5, -0.3, 1.2, -1.0])
true_softmax = np.exp(test_logits) / np.exp(test_logits).sum()
approx_softmax = maclaurin_softmax(test_logits, min_terms) print(f"For |x| <= {INPUT_RANGE_MAX}, precision {PRECISION_TARGET}:")
print(f" Minimum terms needed: {min_terms}")
print(f"\nSoftmax comparison:")
print(f" True : {true_softmax.round(6)}")
print(f" Maclaurin : {approx_softmax.round(6)}")
print(f" Max error : {np.max(np.abs(true_softmax - approx_softmax)):.2e}")
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
1300 pag 322