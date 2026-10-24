---
title: Power of a product
date: '2026-04-16'
wordCount: 574
slug: power_of_a_product
permalink: /notes/02_algebra_precalc/powers_roots_and_inequalities/powers_and_exponents/power_of_a_product/index.html
share_status: draft
publish_target: note
boundary: public
---
# $(ab)^m = a^m b^m$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
When a product of two (or more) factors is raised to a power, you can distribute the exponent across each factor. $(ab)^m = a^m b^m$. This is how exponentiation distributes over multiplication — the same way multiplication distributes over addition. It comes up when working with compound rates (e.g., total rate = rate_A × rate_B, then raise both to a power), scaling transformations in feature engineering, and simplifying expressions in log-space.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Start: (ab)^m"] --> B["Expand: ab * ab * ... (m times)"] B --> C["Rearrange: (a*a*...*a) * (b*b*...*b)"] C --> D["Count a's: m copies -> a^m"] C --> E["Count b's: m copies -> b^m"] D --> F["Result: a^m * b^m"] E --> F
```
### Real-World use:
#### Situation it is used
Decomposing compound probability expressions, distributing scale factors in transformations, and simplifying expressions where a product is repeatedly squared or cubed (e.g., in Mahalanobis distance or covariance matrix scaling).
#### Problem it solves
Without this rule, computing $(ab)^m$ for large $m$ requires expanding the full product. The rule lets you compute $a^m$ and $b^m$ independently and multiply — useful when $a$ and $b$ are each simpler to evaluate alone.
#### How it solves the problem
By rearranging multiplication (which is associative and commutative): $(ab)^m = \underbrace{ab \cdot ab \cdots ab}_{m} = \underbrace{a \cdots a}_{m} \cdot \underbrace{b \cdots b}_{m} = a^m b^m$.
#### Example of it used in the Working Context as DA/DS for a Business
An e-commerce revenue model: daily revenue = price × volume. If both price and volume grow by factor $r$ per month, after $t$ months total revenue scales as $(r \cdot r)^t = r^{2t}$. Using the power-of-a-product rule: $(price\_growth \times volume\_growth)^t = price\_growth^t \times volume\_growth^t$ — you can audit each factor's contribution separately before combining.
### The Formula (Fragment-First)
- $a$: first factor in the product
- $b$: second factor in the product
- $m$: the exponent applied to the entire product
- $(ab)^m$: the product $ab$ raised to power $m$
- $a^m b^m$: each factor raised to power $m$ individually
- Generalizes: $(abc)^m = a^m b^m c^m$ for any number of factors Full rule: $(ab)^m = a^m b^m$ for any real $a$, $b$, and $m$ ### Formula-to-English Translation
"If you raise a product to a power, you can raise each factor to that power separately and then multiply." $(2 \cdot 3)^4 = 2^4 \cdot 3^4 = 16 \cdot 81 = 1296$ Verify directly: $6^4 = 1296$. Same result.
### Critical Concepts
- **Only distributes over multiplication, not addition.** $(a + b)^m \neq a^m + b^m$. This is one of the most common algebra errors. The binomial theorem handles $(a+b)^m$.
- **Works for any number of factors:** $(abcd)^m = a^m b^m c^m d^m$.
- **Works for negative and fractional exponents:** $(ab)^{-1} = a^{-1} b^{-1} = \frac{1}{a} \cdot \frac{1}{b} = \frac{1}{ab}$.
- **Inverse direction:** $a^m b^m = (ab)^m$ — you can collapse separate powers into one combined base when exponents match.
- **Useful for standardization:** scaling a vector $\mathbf{x}$ by scalar $c$ — $\lVert c\mathbf{x} \rVert^2 = c^2 \lVert \mathbf{x} \rVert^2$ comes from this rule.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Identify the product and the exponent*
Expression: $(2 \cdot 3)^4$. Product = $2 \cdot 3$, exponent = $4$. *Step 2: Distribute the exponent to each factor*
$(2 \cdot 3)^4 = 2^4 \cdot 3^4$. *Step 3: Evaluate and verify*
$2^4 = 16$, $3^4 = 81$, product $= 16 \times 81 = 1296$.
Direct check: $6^4 = 1296$. Confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Power of a product: (a*b)^m = a^m * b^m a = 2
b = 3
m = 4 result_product_first = (a * b) ** m # compute product, then power
result_distribute = (a**m) * (b**m) # distribute exponent first print(f"a={a}, b={b}, m={m}")
print(f"(a*b)^m = ({a}*{b})^{m} = {result_product_first}")
print(f"a^m * b^m = {a}^{m} * {b}^{m} = {a**m} * {b**m} = {result_distribute}")
print(f"Match: {result_product_first == result_distribute}") # Common mistake demo: (a+b)^m != a^m + b^m
print(f"\nCommon mistake: (a+b)^m vs a^m + b^m")
print(f" ({a}+{b})^{m} = {(a+b)**m}")
print(f" {a}^{m} + {b}^{m} = {a**m + b**m} <-- WRONG, not the same!")
```
#### Beginner friendly Example [R])
``` r
# Power of a product: (a*b)^m = a^m * b^m a <- 2
b <- 3
m <- 4 result_product_first <- (a * b)^m
result_distribute <- (a^m) * (b^m) cat(sprintf("a=%d, b=%d, m=%d\n", a, b, m))
cat(sprintf("(a*b)^m = (%d*%d)^%d = %d\n", a, b, m, result_product_first))
cat(sprintf("a^m * b^m = %d^%d * %d^%d = %d\n", a, m, b, m, result_distribute))
cat(sprintf("Match: %s\n", result_product_first == result_distribute)) cat(sprintf("\nCommon mistake: (%d+%d)^%d = %d vs %d^%d + %d^%d = %d (not equal!)\n", a, b, m, (a+b)^m, a, m, b, m, a^m + b^m))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: L2 norm scaling — how norm changes when features are scaled
# || c * x ||^2 = c^2 * || x ||^2 (power of a product rule) np.random.seed(42) FEATURE_DIM = 5
num_samples = 100 X = np.random.randn(num_samples, FEATURE_DIM) # raw feature matrix
scales = [0.5, 1.0, 2.0, 5.0, 10.0] results = []
for c in scales: X_scaled = c * X norm_sq_direct = np.sum((X_scaled)**2, axis=1).mean() # ||c*x||^2 norm_sq_rule = (c**2) * np.sum(X**2, axis=1).mean() # c^2 * ||x||^2 results.append({ "scale_c": c, "norm_sq_direct": norm_sq_direct, "norm_sq_rule": norm_sq_rule, "match": np.isclose(norm_sq_direct, norm_sq_rule), }) df = pd.DataFrame(results)
print("L2 Norm Scaling: ||c * x||^2 = c^2 * ||x||^2")
print("(Power of a product rule: (c * x_i)^2 = c^2 * x_i^2)")
print()
print(df.to_string(index=False))
print(f"\nAll match: {df['match'].all()}")
```
#### Final Professional Example [R]
``` r
# L2 norm scaling: ||c*x||^2 = c^2 * ||x||^2 set.seed(42)
FEATURE_DIM <- 5
num_samples <- 100
X <- matrix(rnorm(num_samples * FEATURE_DIM), nrow = num_samples)
scales <- c(0.5, 1, 2, 5, 10)
results <- lapply(scales, function(c) { X_scaled <- c * X norm_sq_direct <- mean(rowSums(X_scaled^2)) norm_sq_rule <- c^2 * mean(rowSums(X^2)) data.frame(scale_c = c, norm_sq_direct = norm_sq_direct, norm_sq_rule = norm_sq_rule, match = abs(norm_sq_direct - norm_sq_rule) < 1e-10)
})
df <- do.call(rbind, results)
cat("L2 Norm Scaling: ||c*x||^2 = c^2 * ||x||^2\n")
print(df)
cat(sprintf("\nAll match: %s\n", all(df$match)))
```
---
MRAF