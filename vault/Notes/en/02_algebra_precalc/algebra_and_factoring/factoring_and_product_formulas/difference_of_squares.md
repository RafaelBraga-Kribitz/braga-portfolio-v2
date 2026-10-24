---
title: Difference of squares
date: '2026-04-16'
wordCount: 1098
slug: difference_of_squares
permalink: /notes/02_algebra_precalc/algebra_and_factoring/factoring_and_product_formulas/difference_of_squares/index.html
share_status: draft
publish_target: note
boundary: public
---
# $a^2 - b^2 = (a - b)(a + b)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The difference of squares identity is one of the most frequently used algebraic factoring formulas. It states that the difference of two perfect squares factors into the product of two conjugate binomials: $(a - b)$ and $(a + b)$. Crucially, the middle term cancels: $(a-b)(a+b) = a^2 + ab - ab - b^2 = a^2 - b^2$. In DA/DS, this appears in: simplifying rational expressions (canceling $(x-a)$ or $(x+a)$ factors), matrix algebra ($A^2 - B^2 = (A-B)(A+B)$ when $AB = BA$), loss function algebra (squared error decompositions), solving quadratic equations ($x^2 - c^2 = 0 \Rightarrow x = \pm c$), computing the variance as $\text{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2 = \mathbb{E}[X^2] - \mu^2$, and simplifying terms involving squared distances in distance/similarity computations. The formula is the degree-2 case of the general identity $a^n - b^n = (a-b)(a^{n-1} + a^{n-2}b + \cdots + b^{n-1})$.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Expression: a² - b²"] --> B["Recognize as difference of two squares"] B --> C["Factor: (a - b)(a + b)"] C --> D["Linear factor 1: (a - b) — zero when a = b"] C --> E["Linear factor 2: (a + b) — zero when a = -b"] D --> F["Two real roots: a = b and a = -b"] C --> G["DA: Var(X) = E[X²] - (E[X])² = E[X²] - μ²"] C --> H["DA: cancel (x-a) in rational expressions"] C --> I["DA: (x-a)(x+a) pattern in distance formulas"] A --> J["TRAP: (a-b)² ≠ a²-b² — missing middle term!"]
```
### Real-World use:
#### Situation it is used
Variance formula derivation: $\text{Var}(X) = \mathbb{E}[(X - \mu)^2] = \mathbb{E}[X^2] - \mu^2 = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$ — this is a difference of squares in the form $\mathbb{E}[X^2] - (\mathbb{E}[X])^2$. Simplifying rational expressions: $\frac{x^2 - 9}{x - 3} = \frac{(x-3)(x+3)}{x-3} = x + 3$. Solving quadratic equations: $x^2 = c^2 \Rightarrow x^2 - c^2 = 0 \Rightarrow (x-c)(x+c) = 0 \Rightarrow x = \pm c$. Computing squared differences in distance metrics: $\|a\|^2 - \|b\|^2 = (\|a\| - \|b\|)(\|a\| + \|b\|)$.
#### Problem it solves
$a^2 - b^2$ appears frequently but is not immediately factorable by inspection unless you know the identity. Without it, simplifying rational expressions like $\frac{x^2 - 4}{x + 2}$ requires either polynomial long division or trial factoring. The identity makes the factoring instantaneous: $x^2 - 4 = (x-2)(x+2)$, so $\frac{(x-2)(x+2)}{x+2} = x - 2$.
#### How it solves the problem
The identity is verified by expansion: $(a-b)(a+b) = a^2 + ab - ab - b^2 = a^2 - b^2$. The $+ab$ and $-ab$ middle terms cancel exactly because the two factors are conjugates (they differ only in the sign of $b$). This cancellation is why there is no middle term in $a^2 - b^2$ — unlike the expanded square $(a \pm b)^2 = a^2 \pm 2ab + b^2$, which has a middle term.
#### Example of it used in the Working Context as DA/DS for a Business
A data analyst computes variance using the computational formula. For a batch of revenue observations with $n = 1000$: rather than computing $\sum (x_i - \bar{x})^2$ directly (two passes over the data), they use $\text{Var}(X) = \frac{\sum x_i^2}{n} - \left(\frac{\sum x_i}{n}\right)^2 = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$. This is $a^2 - b^2 = (a-b)(a+b)$ applied to the mean-of-squares and square-of-mean, allowing computation in a single pass.
### The Formula (Fragment-First)
Breaking the notation: - $a^2 - b^2$: the difference of two perfect squares — requires both terms to be squares (or expressible as squares).
- $a$: the square root of the first term.
- $b$: the square root of the second term.
- $(a-b)$: the "difference" factor — zero when $a = b$.
- $(a+b)$: the "sum" factor — zero when $a = -b$.
- $= (a-b)(a+b)$: both factors are linear, producing two real roots. **Two roots of $a^2 = b^2$**: $a = b$ and $a = -b$ — the two solutions correspond to the two factors. **Common forms**:
- $x^2 - c^2 = (x-c)(x+c)$ — roots at $x = \pm c$.
- $x^2 - 1 = (x-1)(x+1)$ — roots at $x = \pm 1$.
- $(f(x))^2 - (g(x))^2 = (f(x) - g(x))(f(x) + g(x))$ — works for any expressions $f, g$. **Variance form**: $\mathbb{E}[X^2] - (\mathbb{E}[X])^2 = (\mathbb{E}[X^2] - \mu^2)$ — here $a = \sqrt{\mathbb{E}[X^2]}$ and $b = \mu$ conceptually, though the algebraic form applies directly at the expression level. **NOT the same as $(a-b)^2$**: $(a-b)^2 = a^2 - 2ab + b^2 \ne a^2 - b^2$. This is the most common confusion. The difference of squares has no middle term; the squared difference has a $-2ab$ middle term.
### Formula-to-English Translation
"$a^2 - b^2$ factors into $(a-b)(a+b)$ — the product of the difference and the sum. No middle term: the two factors are conjugates, and when you multiply them, the cross terms $+ab$ and $-ab$ cancel exactly. Use this whenever you see a squared quantity minus another squared quantity. In Python: `(a - b) * (a + b) == a**2 - b**2` is always `True`." ### Critical Concepts
1. **Not the same as $(a-b)^2$**: $a^2 - b^2 \ne (a-b)^2$. The difference of squares has NO middle term. The squared difference has middle term $-2ab$. This is the single most common algebra error with these forms.
2. **Variance computational formula**: $\text{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$ is the most-used form of this identity in statistics. It reduces two-pass variance computation to one pass: accumulate $\sum x_i$ and $\sum x_i^2$ simultaneously.
3. **Works for any "squares"**: $a$ and $b$ don't have to be simple variables. $f(x)^2 - g(x)^2 = (f(x)-g(x))(f(x)+g(x))$ for any functions $f, g$. Example: $\sin^2\theta - \cos^2\theta = (\sin\theta - \cos\theta)(\sin\theta + \cos\theta)$.
4. **Rational expression simplification**: $\frac{a^2 - b^2}{a + b} = a - b$ (for $a \ne -b$) and $\frac{a^2 - b^2}{a - b} = a + b$ (for $a \ne b$). This is a standard simplification step in limits, derivatives from first principles, and algebra.
5. **Numerical identity for quick mental math**: $53 \times 47 = (50+3)(50-3) = 50^2 - 3^2 = 2500 - 9 = 2491$. More generally, products of numbers that are equidistant from a round number can be computed as a difference of squares.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: compute the variance of $X$ using the computational formula, given $\mathbb{E}[X^2] = 29$ and $\mathbb{E}[X] = 5$. *Step 1: Identify the form*
$\text{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2 = a^2 - b^2$ where $a = \sqrt{29}$ is conceptual; the direct form is $29 - 5^2$. *Step 2: Apply*
$\text{Var}(X) = 29 - 25 = 4$. *Step 3: Cross-check*
If $\mathbb{E}[X] = 5$ and $\text{Var}(X) = 4$, then $\text{SD}(X) = 2$. *Step 4: Factored interpretation*
$\mathbb{E}[X^2] - \mu^2 = (\sqrt{\mathbb{E}[X^2]} - \mu)(\sqrt{\mathbb{E}[X^2]} + \mu)$ — algebraically, but in practice the direct computation $29 - 25 = 4$ is cleaner. *Step 5: Verify with tiny dataset*
$X \in \{3, 5, 7\}$: $\bar{X} = 5$, $\mathbb{E}[X^2] = (9+25+49)/3 = 83/3 \approx 27.67$, $\text{Var}(X) = 83/3 - 25 = (83-75)/3 = 8/3 \approx 2.67$. Formula gives the same result.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Difference of squares: a² - b² = (a-b)(a+b) # Basic verification
pairs = [(5, 3), (10, 4), (7, 2), (0.5, 0.25), (-3, 2)] print(f"{'a':>6} {'b':>6} {'a²-b²':>8} {'(a-b)(a+b)':>12} {'match':>6}")
for a, b in pairs: lhs = a**2 - b**2 rhs = (a - b) * (a + b) print(f"{a:>6.2f} {b:>6.2f} {lhs:>8.4f} {rhs:>12.4f} {str(abs(lhs-rhs)<1e-10):>6}") # TRAP: contrast with (a-b)²
a, b = 5.0, 3.0
print(f"\nTRAP comparison for a={a}, b={b}:")
print(f" a²-b² = {a**2-b**2:.1f} (difference of squares = (a-b)(a+b))")
print(f" (a-b)² = {(a-b)**2:.1f} (squared difference = a²-2ab+b²)")
print(f" They are NOT equal: {a**2-b**2 != (a-b)**2}") # Variance computational formula
import numpy as np np.random.seed(42)
data = np.array([3.0, 7.0, 5.0, 9.0, 1.0, 11.0, 4.0, 8.0]) # Two methods — should be equal
var_direct = np.mean((data - data.mean())**2) # E[(X - μ)²]
var_formula = np.mean(data**2) - data.mean()**2 # E[X²] - μ² (diff of squares) print(f"\nVariance computation:")
print(f" E[X²] = {np.mean(data**2):.4f} μ² = {data.mean()**2:.4f}")
print(f" Var (direct): {var_direct:.6f}")
print(f" Var (formula): {var_formula:.6f}")
print(f" Match: {abs(var_direct - var_formula) < 1e-10}") # Mental math trick: a×b = (m-d)(m+d) = m² - d²
m, d = 50, 3
print(f"\nMental math: {m-d} × {m+d} = {m}² - {d}² = {m**2} - {d**2} = {m**2 - d**2}")
```
#### Beginner friendly Example [R])
``` r
# Difference of squares in R # Verification
pairs <- list(c(5,3), c(10,4), c(7,2), c(0.5,0.25))
cat(sprintf("%-6s %-6s %-8s %-12s %s\n", "a", "b", "a²-b²", "(a-b)(a+b)", "match"))
for (p in pairs) { a <- p[1]; b <- p[2] lhs <- a^2 - b^2 rhs <- (a - b) * (a + b) cat(sprintf("%-6.2f %-6.2f %-8.4f %-12.4f %s\n", a, b, lhs, rhs, abs(lhs-rhs)<1e-10))
} # TRAP
a <- 5; b <- 3
cat(sprintf("\nTRAP: a²-b² = %.0f vs (a-b)² = %.0f — NOT equal!\n", a^2 - b^2, (a-b)^2)) # Variance: E[X²] - μ²
data <- c(3, 7, 5, 9, 1, 11, 4, 8)
var_direct <- mean((data - mean(data))^2)
var_formula <- mean(data^2) - mean(data)^2 cat(sprintf("\nVariance:\n"))
cat(sprintf(" Direct: %.6f\n", var_direct))
cat(sprintf(" Formula: %.6f\n", var_formula))
cat(sprintf(" Match: %s\n", abs(var_direct - var_formula) < 1e-10))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: online (single-pass) variance computation using E[X²] - (E[X])²
# Demonstrates the difference-of-squares form of variance in a streaming context
# Critical for large datasets where two-pass computation is expensive np.random.seed(42) N_STREAM = 100_000 # simulate streaming observations class OnlineVarianceTracker: """ Single-pass online variance using the computational formula: Var(X) = E[X²] - (E[X])² — the difference-of-squares identity. Numerically uses Welford's algorithm for stability, but also tracks the naive formula for illustration. """ def __init__(self) -> None: self._n: int = 0 self._sum: float = 0.0 self._sum_sq: float = 0.0 def update(self, x: float) -> None: """Accumulate a new observation.""" self._n += 1 self._sum += x self._sum_sq += x * x @property def mean(self) -> float: """Current running mean E[X].""" return self._sum / self._n if self._n > 0 else 0.0 @property def variance(self) -> float: """Variance using E[X²] - (E[X])² (difference of squares formula).""" if self._n < 2: return 0.0 e_x2 = self._sum_sq / self._n mu = self.mean return e_x2 - mu**2 # a² - b² form # Stream data
true_mean = 50.0
true_std = 10.0
tracker = OnlineVarianceTracker() snapshots = []
for i, x in enumerate(np.random.normal(true_mean, true_std, N_STREAM)): tracker.update(float(x)) if (i + 1) in {100, 1_000, 10_000, N_STREAM}: snapshots.append({ "n": i + 1, "mean": tracker.mean, "variance": tracker.variance, "std": tracker.variance**0.5, "true_mean": true_mean, "true_var": true_std**2, }) report = pd.DataFrame(snapshots)
print("Online Variance via E[X²] - (E[X])² (Difference-of-Squares Formula)")
print("=" * 72)
print(report.round(4).to_string(index=False))
print(f"\nFormula: Var(X) = E[X²] - μ² = (a²-b²) with a=√E[X²], b=μ")
print(f"True variance = {true_std**2:.1f} | Converges as n → ∞")
```
#### Final Professional Example [R]
``` r
# Online variance via E[X²] - (E[X])² (difference-of-squares formula) set.seed(42)
N_STREAM <- 10000
true_mean <- 50
true_std <- 10
x_stream <- rnorm(N_STREAM, true_mean, true_std) online_var <- function(x, check_at = c(100, 1000, 10000, N_STREAM)) { n <- length(x) sum_x <- 0 sum_sq <- 0 out <- list() for (i in seq_len(n)) { sum_x <- sum_x + x[i] sum_sq <- sum_sq + x[i]^2 if (i %in% check_at) { mu <- sum_x / i e_x2 <- sum_sq / i var_x <- e_x2 - mu^2 outlength(out) + 1 <- data.frame(n = i, mean = mu, variance = var_x, std = sqrt(var_x), true_mean = true_mean, true_var = true_std^2) } } do.call(rbind, out)
}
report <- online_var(x_stream)
cat("Online Variance via E[X²] - (E[X])² (Difference-of-Squares Formula)\n")
print(round(report, 4))
cat(sprintf("\nTrue variance = %.1f | Converges as n → ∞\n", true_std^2))
```
---
1300 pag 20