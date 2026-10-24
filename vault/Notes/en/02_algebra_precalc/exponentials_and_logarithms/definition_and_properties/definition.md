---
title: Definition
date: '2026-04-16'
wordCount: 1097
slug: definition
permalink: /notes/02_algebra_precalc/exponentials_and_logarithms/definition_and_properties/definition/index.html
share_status: draft
publish_target: note
boundary: public
---
# $y = \log_a x \iff a^y = x$ (where $x > 0, a > 0, a \neq 1$)
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The logarithm definition is the biconditional equivalence: $y = \log_a x$ if and only if $a^y = x$. In plain language: the logarithm answers the question "to what power must I raise base $a$ to get $x$?" The output $y$ is always an exponent. This definition is foundational to every log identity. Domain constraints: $x > 0$ (argument must be positive), $a > 0$ and $a \ne 1$ (base must be positive and not 1); the output $y$ is any real number. Special values follow directly: $\log_a 1 = 0$ (since $a^0 = 1$), $\log_a a = 1$ (since $a^1 = a$), $\log_a(a^k) = k$ for any real $k$. In DA/DS, this definition is the starting point for: log-likelihood ($\ln \prod p_i = \sum \ln p_i$ via the definition linking products to sums); cross-entropy loss ($-\sum y_i \ln \hat{p}_i$); entropy ($H = -\sum p_i \log_2 p_i$); logistic regression log-odds ($\ln \frac{p}{1-p}$); data visualization on log-scale to compress right-skewed distributions; and the Box-Cox transform. The natural logarithm $\ln = \log_e$ (base $e \approx 2.71828$) is the default in ML/statistics because $e$ arises naturally in exponential families, the Gaussian distribution, and continuous growth. Base-2 logarithms dominate information theory (bits). Base-10 is used in acoustics and pH.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Question: to what power must a be raised to get x?"] --> B["Definition: y = log_a(x) iff a^y = x"] B --> C["Domain: x > 0, a > 0, a ≠ 1; Range: y ∈ ℝ"] B --> D["Special values: log_a(1) = 0, log_a(a) = 1, log_a(a^k) = k"] B --> E["Natural log: ln = log_e, e ≈ 2.71828 — default in ML/stats"] B --> F["Base-2: bits — Shannon entropy, information gain"] B --> G["Base-10: log10 — pH scale, decibels, common logs"] E --> H["DA: log-likelihood — ln(L) converts product to sum"] E --> I["DA: cross-entropy loss — -sum(y * ln(p_hat))"] E --> J["DA: log-odds — ln(p/(1-p)) in logistic regression"] B --> K["TRAP: log_a(x+y) ≠ log_a(x) + log_a(y) — sum inside log does NOT split"]
```
### Real-World use:
#### Situation it is used
Log-likelihood maximization: if $X_1, \ldots, X_n \sim \text{Poisson}(\lambda)$, the likelihood is $L(\lambda) = \prod_{i=1}^n \frac{e^{-\lambda}\lambda^{x_i}}{x_i!}$. Direct maximization of this product is numerically unstable for large $n$. Taking $\ln L(\lambda) = \sum_i (-\lambda + x_i \ln \lambda - \ln x_i!)$ converts it to a sum — stable and differentiable. The definition $\ln(\lambda) = y \iff e^y = \lambda$ is what makes this rewriting exact.
#### Problem it solves
Products of probabilities underflow to zero in floating-point for even moderate $n$ (e.g., 500 Bernoulli trials with $p = 0.5$ gives $2^{-500} \approx 3 \times 10^{-151}$, below `float64` minimum). The log definition maps this product to a sum of log-probabilities, which is computationally stable.
#### How it solves the problem
By definition: $\ln(p_1 \cdot p_2 \cdots p_n) = \sum_i \ln p_i$ (the product rule for logs, which follows from the definition). Each $\ln p_i \in (-\infty, 0]$ for $p_i \in (0, 1]$, so the sum stays in floating-point range. Maximizing the log-likelihood gives the same parameter estimates as maximizing the likelihood, because $\ln$ is a monotone increasing function.
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist fits a log-normal pricing model: prices are log-normally distributed, so $\ln(\text{price}) \sim \mathcal{N}(\mu, \sigma^2)$. They apply the definition directly: $\ln(\text{price}) = y$ means price $= e^y$. After fitting $\mu$ and $\sigma^2$ on the log scale (using standard linear regression), they recover price predictions via $\hat{\text{price}} = e^{\hat{y}}$. The definition is the explicit mapping used at every step.
### The Formula (Fragment-First)
Breaking the notation: - $y$: the logarithm — the answer; it is always an exponent.
- $\log_a$: "log base $a$" — the function that asks: "what power of $a$ gives this argument?"
- $x$: the argument — must be strictly positive ($x > 0$).
- $a$: the base — must be positive and $\ne 1$ ($a = 1$ gives $1^y = 1$ for all $y$, making the inverse undefined).
- $\iff$: "if and only if" — the two forms are completely equivalent; each implies the other.
- $a^y = x$: the exponential form. This is what the logarithm means. **Equivalence table** (two forms of the same fact): | Logarithmic form | Exponential form | Plain English |
|---|---|---|
| $\log_2 8 = 3$ | $2^3 = 8$ | 2 to the 3rd = 8 |
| $\log_{10} 1000 = 3$ | $10^3 = 1000$ | 10 to the 3rd = 1000 |
| $\ln e = 1$ | $e^1 = e$ | e to the 1st = e |
| $\log_a 1 = 0$ | $a^0 = 1$ | anything to the 0th = 1 |
| $\ln(1/e) = -1$ | $e^{-1} = 1/e$ | negative exponent = reciprocal | **TRAP: log of a sum ≠ sum of logs.** $\log_a(x + y) \ne \log_a x + \log_a y$. This confusion appears constantly. The product rule $\log_a(xy) = \log_a x + \log_a y$ holds (different identity), but the sum rule does not.
### Formula-to-English Translation
"$y = \log_a x$ means: '$y$ is the exponent you put on $a$ to get $x$.' Equivalently: $a^y = x$. The logarithm is the inverse of exponentiation with the same base. To evaluate $\log_a x$: ask 'what power of $a$ equals $x$?' In code: `math.log(x, a)` returns $y$ such that `a**y == x`. In ML: `np.log` gives $\ln = \log_e$. Domain: argument must be positive. Range: all reals." ### Critical Concepts
1. **The logarithm is an exponent**: this is not a metaphor. The output of $\log_a x$ is literally the exponent $y$ such that $a^y = x$. Every property of logarithms follows from this.
2. **Domain constraint $x > 0$**: you cannot take a log of zero or a negative number. In ML, log-probabilities are always negative (since $0 < p \le 1$, $\ln p \le 0$). Log of zero is $-\infty$, which triggers numerical issues.
3. **$\ln$ is default in ML/stats**: unless specified, "log" in mathematical texts means $\ln$ (natural log). Python's `math.log(x)` and `np.log(x)` both compute $\ln x$.
4. **Inverse of exponential**: $\log_a$ and $a^{(\cdot)}$ are inverse functions. Their graphs are reflections across $y = x$. The cancellation identities $a^{\log_a x} = x$ and $\log_a(a^x) = x$ express this directly.
5. **TRAP: log is not linear**: $\log_a(x + y) \ne \log_a x + \log_a y$. Only the product decomposes: $\log_a(xy) = \log_a x + \log_a y$. A common error in probability computations.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: evaluate $\log_2 32$ and $\log_{10} 0.001$. *Step 1: Rewrite the question using the definition*
$\log_2 32 = y \iff 2^y = 32$. *Step 2: Solve for $y$ using known powers*
$2^1 = 2$, $2^2 = 4$, $2^3 = 8$, $2^4 = 16$, $2^5 = 32$. So $y = 5$. *Step 3: Verify*
$2^5 = 32$. ✓ Therefore $\log_2 32 = 5$. *Step 4: Second example — $\log_{10} 0.001$*
$\log_{10} 0.001 = y \iff 10^y = 0.001 = 10^{-3}$. So $y = -3$. *Step 5: Verify*
$10^{-3} = 1/1000 = 0.001$. ✓ Therefore $\log_{10} 0.001 = -3$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Logarithm definition: y = log_a(x) iff a^y = x
import math
import numpy as np # Verify the definition: log_a(x) = y means a^y = x
print("Definition verification: a^(log_a(x)) == x")
test_cases = [ (2.0, 8.0), # log_2(8) = 3 (10.0, 1000.0), # log_10(1000) = 3 (10.0, 0.001), # log_10(0.001) = -3 (math.e, math.e), # ln(e) = 1 (math.e, 1.0), # ln(1) = 0 (3.0, 81.0), # log_3(81) = 4
] print(f"{'a':>6} {'x':>10} {'log_a(x)':>10} {'a^y':>10} {'verified':>8}")
for a, x in test_cases: y = math.log(x, a) a_to_y = a ** y verified = abs(a_to_y - x) < 1e-9 print(f"{a:>6.3f} {x:>10.4f} {y:>10.6f} {a_to_y:>10.6f} {str(verified):>8}") # Special values
print("\nSpecial values:")
for a in [2.0, math.e, 10.0]: print(f" log_{a:.4f}(1) = {math.log(1, a):.4f} (a^0 = 1)") print(f" log_{a:.4f}(a) = {math.log(a, a):.4f} (a^1 = a)") # Natural log vs log-2 vs log-10
print("\nThree common bases for x = 100:")
x = 100.0
print(f" ln(100) = {math.log(x):.6f} (base e)")
print(f" log2(100) = {math.log2(x):.6f} (base 2)")
print(f" log10(100) = {math.log10(x):.6f} (base 10)") # TRAP: log(x + y) != log(x) + log(y)
x_val, y_val = 3.0, 5.0
print(f"\nTRAP: ln({x_val}+{y_val}) = {math.log(x_val + y_val):.6f}")
print(f" ln({x_val})+ln({y_val}) = {math.log(x_val) + math.log(y_val):.6f}")
print(f" These are NOT equal — log of sum ≠ sum of logs")
```
#### Beginner friendly Example [R])
``` r
# Logarithm definition in R: y = log_a(x) iff a^y = x # Verify the definition
test_cases <- list( c(a = 2, x = 8), c(a = 10, x = 1000), c(a = exp(1), x = exp(1)), c(a = exp(1), x = 1), c(a = 3, x = 81)
) cat(sprintf("%-6s %-10s %-10s %-10s %s\n", "a", "x", "log_a(x)", "a^y", "verified"))
for (tc in test_cases) { a <- tc["a"]; x <- tc["x"] y <- log(x, base = a) a_y <- a^y cat(sprintf("%-6.3f %-10.4f %-10.6f %-10.6f %s\n", a, x, y, a_y, abs(a_y - x) < 1e-9))
} # Natural log, log2, log10
cat("\nFor x = 100:\n")
cat(sprintf(" log(100) = %.6f (base e)\n", log(100)))
cat(sprintf(" log2(100) = %.6f (base 2)\n", log2(100)))
cat(sprintf(" log10(100) = %.6f (base 10)\n", log10(100))) # TRAP: log(x + y) ≠ log(x) + log(y)
cat(sprintf("\nTRAP: ln(3+5) = %.6f\n", log(8)))
cat(sprintf(" ln(3)+ln(5) = %.6f — NOT equal\n", log(3) + log(5)))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
import math # Scenario: demonstrate the log definition as the backbone of log-likelihood
# and log-scale data transformation in a marketing campaign analysis np.random.seed(42) N_SAMPLES = 1000 def log_likelihood_poisson(data: np.ndarray, lam: float) -> float: """ Compute Poisson log-likelihood: ln L(lambda) = sum_i [x_i * ln(lambda) - lambda - ln(x_i!)] Applies the definition log_a(x) = y iff a^y = x: ln(lambda^x_i) = x_i * ln(lambda) — the log brings the exponent down. Args: data: Array of non-negative integer observations. lam: Poisson rate parameter (lambda > 0). Returns: Log-likelihood value (always <= 0 for a proper probability model). """ if lam <= 0: raise ValueError("lambda must be positive") return float(np.sum(data * np.log(lam) - lam - np.array([math.lgamma(x + 1) for x in data]))) def evaluate_log_scale_transform(values: np.ndarray) -> pd.DataFrame: """ Compare raw vs log-transformed values to illustrate log domain properties. Args: values: Array of positive values to transform. Returns: DataFrame comparing raw and log-transformed values. """ log_vals = np.log(values) return pd.DataFrame({ "raw": values.round(2), "ln_x": log_vals.round(4), "exp_back": np.exp(log_vals).round(2), # recovers original via definition "round_trip": np.abs(np.exp(log_vals) - values) < 1e-9, }) # Generate Poisson data with true lambda = 5 (e.g., customer clicks per session)
TRUE_LAMBDA = 5.0
click_data = np.random.poisson(TRUE_LAMBDA, N_SAMPLES) # Evaluate log-likelihood over a grid of lambda values
lambda_grid = np.linspace(2.0, 10.0, 200)
log_likelihoods = np.array([log_likelihood_poisson(click_data, lam) for lam in lambda_grid])
best_lambda = lambda_grid[np.argmax(log_likelihoods)] # Log-scale transformation demo on revenue values
revenue_sample = np.random.lognormal(mean=4.0, sigma=1.2, size=8)
transform_df = evaluate_log_scale_transform(revenue_sample) print("Poisson log-likelihood: ln L(lambda) uses ln by definition log_e(x) = y iff e^y = x")
print("=" * 72)
print(f" True lambda: {TRUE_LAMBDA:.2f}")
print(f" MLE estimate (grid): {best_lambda:.4f}")
print(f" Sample mean (MLE exact): {click_data.mean():.4f}")
print(f" Max log-likelihood: {np.max(log_likelihoods):.4f}")
print()
print("Log-scale transform: y = ln(revenue) i.e. e^y = revenue")
print("-" * 56)
print(transform_df.to_string(index=False))
print(f"\nAll round-trips exact (e^(ln x) = x): {transform_df['round_trip'].all()}")
print(f"\nDomain enforcement: ln(x) requires x > 0")
print(f" Revenue min: {revenue_sample.min():.4f} (all positive, safe for ln)")
```
#### Final Professional Example [R]
``` r
# y = ln(revenue), e^y = revenue (definition of ln) set.seed(42)
revenue_sample <- runif(20, 100, 10000)
log_revenue <- log(revenue_sample)
round_trip <- exp(log_revenue)
transform_df <- data.frame(revenue = revenue_sample, log_revenue = log_revenue, round_trip = round_trip, match = abs(round_trip - revenue_sample) < 1e-10)
cat("Log-scale: y = ln(revenue), e^y = revenue\n")
print(head(transform_df, 5))
cat(sprintf("\nAll round-trips exact: %s\n", all(transform_df$match)))
```
---
1300 pag 20