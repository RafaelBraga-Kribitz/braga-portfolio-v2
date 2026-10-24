---
title: Multiplication of roots
date: '2026-04-16'
wordCount: 601
slug: multiplication_of_roots
permalink: /notes/02_algebra_precalc/powers_roots_and_inequalities/roots_and_radicals/multiplication_of_roots/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\sqrt[n]{ab} = \sqrt[n]{a} \sqrt[n]{b}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The $n$-th root of a product equals the product of the individual $n$-th roots. This is the radical version of the power-of-a-product rule. It lets you split a root over a product, which is useful when one factor is a perfect power (making it easy to simplify), and it is the foundation for computing geometric means and for splitting product expressions inside norms.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Start: n-th root of (a*b)"] --> B["Rewrite using fractional exponents: (ab)^(1/n)"] B --> C["Apply power of a product rule: a^(1/n) * b^(1/n)"] C --> D["Convert back to radical notation"] D --> E["Result: n-th root(a) * n-th root(b)"]
```
### Real-World use:
#### Situation it is used
Simplifying radical expressions containing perfect squares/cubes, computing geometric means as products of individual roots, factoring expressions inside standard deviations and Euclidean distances, and working with log-transformed product expressions.
#### Problem it solves
When one factor inside a root is a perfect power, pulling it out simplifies computation: $\sqrt{4x} = \sqrt{4}\sqrt{x} = 2\sqrt{x}$. Without this rule, you must compute the full product before rooting, which may be harder or impossible symbolically.
#### How it solves the problem
Via fractional exponents: $\sqrt[n]{ab} = (ab)^{1/n} = a^{1/n} \cdot b^{1/n} = \sqrt[n]{a} \cdot \sqrt[n]{b}$. The power-of-a-product rule does the work; radical notation is just a different way to write the same thing.
#### Example of it used in the Working Context as DA/DS for a Business
Euclidean distance between two points: $d = \sqrt{(\Delta x)^2 + (\Delta y)^2}$. When a scaling factor $c$ is applied to both coordinates: $d_{\text{scaled}} = \sqrt{(c\Delta x)^2 + (c\Delta y)^2} = \sqrt{c^2((\Delta x)^2 + (\Delta y)^2)} = \sqrt{c^2} \cdot \sqrt{(\Delta x)^2 + (\Delta y)^2} = c \cdot d$. The multiplication-of-roots rule lets you pull the scaling factor out cleanly.
### The Formula (Fragment-First)
- $n$: the root index (2 = square root, 3 = cube root, etc.)
- $a$: first factor under the root (non-negative for even $n$)
- $b$: second factor under the root (non-negative for even $n$)
- $\sqrt[n]{ab}$: the $n$-th root of the product $ab$
- $\sqrt[n]{a} \cdot \sqrt[n]{b}$: the product of the individual $n$-th roots
- Generalizes: $\sqrt[n]{abc} = \sqrt[n]{a} \cdot \sqrt[n]{b} \cdot \sqrt[n]{c}$ Full rule: $\sqrt[n]{ab} = \sqrt[n]{a} \cdot \sqrt[n]{b}$ for $a, b \geq 0$ when $n$ is even ### Formula-to-English Translation
"The root of a product equals the product of the roots — same root index, split across each factor." $\sqrt{4 \cdot 9} = \sqrt{4} \cdot \sqrt{9} = 2 \cdot 3 = 6$ Verify: $\sqrt{36} = 6$. Confirmed.
### Critical Concepts
- **Root index must match.** $\sqrt[2]{a} \cdot \sqrt[3]{b} \neq \sqrt[2]{ab}$ — different root indices cannot be combined.
- **Does not distribute over addition.** $\sqrt{a + b} \neq \sqrt{a} + \sqrt{b}$. This is a frequent error.
- **Works in both directions:** split a root over a product ($\sqrt{ab} = \sqrt{a}\sqrt{b}$) or combine separate roots into one ($\sqrt{a}\sqrt{b} = \sqrt{ab}$). The combining direction is useful for simplifying products of roots.
- **Domain restriction for even $n$:** $a \geq 0$ and $b \geq 0$ required. For odd $n$, any real values work.
- **Used to simplify radicals:** $\sqrt{12} = \sqrt{4 \cdot 3} = \sqrt{4} \cdot \sqrt{3} = 2\sqrt{3}$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Identify a perfect-power factor in the product*
Expression: $\sqrt{50}$. Factor as $50 = 25 \cdot 2$, where $25$ is a perfect square. *Step 2: Split the root using the multiplication rule*
$\sqrt{50} = \sqrt{25 \cdot 2} = \sqrt{25} \cdot \sqrt{2}$. *Step 3: Simplify the perfect-square root*
$\sqrt{25} = 5$, so $\sqrt{50} = 5\sqrt{2} \approx 5 \times 1.4142 = 7.071$.
Verify: $\sqrt{50} \approx 7.071$. Confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import math # Multiplication of roots: n-th root of (a*b) = n-th root(a) * n-th root(b) # Example 1: simplify sqrt(50) = sqrt(25 * 2)
a = 25
b = 2
n = 2 root_product = (a * b) ** (1/n) # sqrt(a * b)
product_roots = (a ** (1/n)) * (b ** (1/n)) # sqrt(a) * sqrt(b) print(f"sqrt({a * b}) = sqrt({a}) * sqrt({b})")
print(f" Root of product: {root_product:.10f}")
print(f" Product of roots: {product_roots:.10f}")
print(f" Simplified: {int(a**0.5)} * sqrt({b}) = {int(a**0.5)} * {b**0.5:.4f} = {int(a**0.5) * b**0.5:.4f}")
print(f" Match: {abs(root_product - product_roots) < 1e-12}") # Common mistake demo
x, y = 9.0, 16.0
print(f"\nCommon mistake: sqrt({x} + {y}) vs sqrt({x}) + sqrt({y})")
print(f" sqrt({x + y}) = {math.sqrt(x + y):.4f}")
print(f" sqrt({x}) + sqrt({y}) = {math.sqrt(x) + math.sqrt(y):.4f} <-- NOT equal!")
```
#### Beginner friendly Example [R])
``` r
# Multiplication of roots: n-th root of (a*b) = n-th root(a) * n-th root(b) a <- 25
b <- 2
n <- 2 root_product <- (a * b)^(1/n)
product_roots <- (a^(1/n)) * (b^(1/n)) cat(sprintf("sqrt(%d) = sqrt(%d) * sqrt(%d)\n", a*b, a, b))
cat(sprintf(" Root of product: %.10f\n", root_product))
cat(sprintf(" Product of roots: %.10f\n", product_roots))
cat(sprintf(" Simplified: %d * sqrt(%d) = %.4f\n", as.integer(sqrt(a)), b, as.integer(sqrt(a)) * sqrt(b)))
cat(sprintf(" Match: %s\n", isTRUE(all.equal(root_product, product_roots))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: Euclidean distance scaling
# When features are scaled by c, distance scales by c as well
# d_scaled = sqrt((c*dx)^2 + (c*dy)^2) = sqrt(c^2 * (dx^2 + dy^2))
# = sqrt(c^2) * sqrt(dx^2 + dy^2) [multiplication of roots rule]
# = c * d_original np.random.seed(42) num_points = 5
c_values = [0.5, 1.0, 2.0, 5.0] # Random 2D point offsets
dx = np.random.randn(num_points)
dy = np.random.randn(num_points)
d_original = np.sqrt(dx**2 + dy**2) results = []
for c in c_values: d_scaled_direct = np.sqrt((c * dx)**2 + (c * dy)**2) d_scaled_rule = c * d_original match = np.allclose(d_scaled_direct, d_scaled_rule) results.append({ "scale_c": c, "mean_d_original": d_original.mean(), "mean_d_scaled_direct": d_scaled_direct.mean(), "mean_d_scaled_rule": d_scaled_rule.mean(), "match": match, }) df = pd.DataFrame(results)
print("Euclidean Distance Scaling: sqrt(c^2 * sum) = c * sqrt(sum)")
print("(Multiplication of roots: sqrt(c^2 * D^2) = sqrt(c^2) * sqrt(D^2) = c * D)")
print()
print(df.to_string(index=False))
print(f"\nAll match: {df['match'].all()}")
```
#### Final Professional Example [R]
``` r
# Euclidean distance scaling: sqrt(c^2 * sum) = c * sqrt(sum) set.seed(42)
num_points <- 5
c_values <- c(0.5, 1, 2, 5)
dx <- rnorm(num_points)
dy <- rnorm(num_points)
d_original <- sqrt(dx^2 + dy^2)
results <- lapply(c_values, function(c) { d_scaled_direct <- sqrt((c*dx)^2 + (c*dy)^2) d_scaled_rule <- c * d_original data.frame(scale_c = c, mean_d_original = mean(d_original), mean_d_scaled_direct = mean(d_scaled_direct), mean_d_scaled_rule = mean(d_scaled_rule), match = all(abs(d_scaled_direct - d_scaled_rule) < 1e-10))
})
df <- do.call(rbind, results)
cat("Euclidean Distance Scaling: sqrt(c^2*D^2) = c*D\n")
print(df)
```
---
1300 pag 19