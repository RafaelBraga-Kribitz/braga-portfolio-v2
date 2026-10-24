---
title: Division rule
date: '2026-04-16'
wordCount: 773
slug: division_rule
permalink: /notes/02_algebra_precalc/summation_and_limit_manipulations/limits/division_rule/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\lim_{x \to a} \left[ \frac{f(x)}{g(x)} \right] = \frac{\lim_{x \to a} f(x)}{\lim_{x \to a} g(x)}$ (provided $\lim_{x \to a} g(x) \neq 0$)
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The limit of a quotient equals the quotient of the limits, **provided the denominator limit is not zero**. This is the division analog of the addition and multiplication limit rules. The condition on the denominator is critical: if $\lim g(x) = 0$, the result may be $\pm\infty$, undefined, or an indeterminate form ($0/0$) requiring L'Hôpital's rule or algebraic techniques. In DA/DS, this rule underpins the convergence analysis of rates: click-through rate $= \text{clicks} / \text{impressions}$, cost-per-conversion, and loss-per-sample all converge as $n \to \infty$ when numerator and denominator converge independently to finite limits with a non-zero denominator.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Want: lim(x->a) of f(x)/g(x)"] --> B["Compute lim f(x) = L"] B --> C["Compute lim g(x) = M"] C --> D{{"M != 0?"}} D -->|"Yes: M != 0"| E["Apply rule: lim(f/g) = L / M"] D -->|"M = 0, L != 0"| F["Limit is +/- infinity (or does not exist)"] D -->|"M = 0, L = 0"| G["Indeterminate form 0/0: use L'Hopital or factor/simplify"] E --> H["Result: L / M"] G --> I["Simplify algebraically or apply L'Hopital's rule"]
```
### Real-World use:
#### Situation it is used
Convergence of normalized metrics (mean loss = total loss / $n$ as $n \to \infty$), asymptotic analysis of efficiency ratios between two algorithms, computing steady-state rates in Markov chains (stationary distribution is a ratio of counts), and verifying that a ratio of independently converging sequences converges to the ratio of their limits.
#### Problem it solves
When evaluating $\lim_{n \to \infty} \frac{5n^2 + 3n}{2n^2 - n}$, you could expand or divide top and bottom by $n^2$: $\frac{5 + 3/n}{2 - 1/n}$. Then use the division rule: $\lim(5 + 3/n) / \lim(2 - 1/n) = 5/2$. This converts a complex limit into two simple ones.
#### How it solves the problem
From the product rule and the limit of $1/g(x)$: if $\lim g(x) = M \neq 0$, then $\lim_{x \to a} 1/g(x) = 1/M$ (this follows from the continuity of $1/x$ at $M \neq 0$). Then $\lim f/g = \lim f \cdot \lim(1/g) = L \cdot (1/M) = L/M$.
#### Example of it used in the Working Context as DA/DS for a Business
Algorithm efficiency ratio: $T_1(n) = 5n^2 + 100$ operations, $T_2(n) = 2n^2 + 50$ operations. As $n \to \infty$: $\lim_{n \to \infty} T_1/T_2 = \lim_{n \to \infty} \frac{5 + 100/n^2}{2 + 50/n^2}$. Both $100/n^2 \to 0$ and $50/n^2 \to 0$ (denominator is not zero). Division rule: $(5 + 0)/(2 + 0) = 5/2$. Algorithm 1 is asymptotically 2.5 times slower than Algorithm 2.
### The Formula (Fragment-First)
- $\lim_{x \to a}$: limit as $x$ approaches $a$
- $f(x)$: numerator function with limit $L = \lim_{x \to a} f(x)$
- $g(x)$: denominator function with limit $M = \lim_{x \to a} g(x)$
- Key condition: $M \neq 0$ Full rule: $\lim_{x \to a} \dfrac{f(x)}{g(x)} = \dfrac{\lim_{x \to a} f(x)}{\lim_{x \to a} g(x)} = \dfrac{L}{M}$, provided $M \neq 0$. When $M = 0$:
- $L \neq 0$: limit is $\pm\infty$ or does not exist (check one-sided limits)
- $L = 0$: indeterminate form $0/0$ — requires L'Hôpital's rule or factoring ### Formula-to-English Translation
"The limit of a ratio equals the ratio of the limits — as long as the denominator limit is not zero." $\lim_{x \to 4} \dfrac{x^2 - 2x}{x + 1} = \dfrac{\lim(x^2 - 2x)}{\lim(x + 1)} = \dfrac{16 - 8}{5} = \dfrac{8}{5} = 1.6$.
### Critical Concepts
- **The condition $M \neq 0$ is non-negotiable.** This is the single most important check before applying the rule. Missing it is a classic error.
- **$0/0$ is the most common indeterminate form in calculus.** It appears in limits of derivative definitions, convergence rates, and L'Hôpital applications. It requires separate analysis.
- **Rational function limits at finite points:** for polynomials, if the denominator is non-zero at $a$, just substitute. $\lim_{x \to a} P(x)/Q(x) = P(a)/Q(a)$ when $Q(a) \neq 0$.
- **Asymptotic ratios (as $x \to \infty$):** divide numerator and denominator by the dominant term ($x^n$), then apply the division rule to the simplified ratio.
- **Combined with other rules:** the division rule is rarely used alone. It is combined with addition, constant extraction, and algebraic manipulation to simplify complex limits.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Check the denominator limit is non-zero*
Evaluate $\lim_{x \to \infty} \dfrac{3x^2 + 2x}{x^2 - 5}$. Divide numerator and denominator by $x^2$ (the dominant term): $\dfrac{3 + 2/x}{1 - 5/x^2}$. *Step 2: Compute each limit separately*
Numerator: $\lim_{x \to \infty} (3 + 2/x) = 3 + 0 = 3$. Denominator: $\lim_{x \to \infty} (1 - 5/x^2) = 1 - 0 = 1$. Denominator limit $= 1 \neq 0$, so the division rule applies. *Step 3: Apply the division rule*
$\lim_{x \to \infty} \dfrac{3x^2 + 2x}{x^2 - 5} = \dfrac{3}{1} = 3$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # Division rule: lim[f(x)/g(x)] = lim f(x) / lim g(x), provided lim g(x) != 0
# Verify: lim(x->inf) (3x^2 + 2x) / (x^2 - 5) = 3/1 = 3 def f(x: float) -> float: return 3 * x**2 + 2 * x def g(x: float) -> float: return x**2 - 5 x_values = [10, 100, 1000, 10000, 100000] print("lim(x->inf) (3x^2 + 2x) / (x^2 - 5)")
print("After dividing by x^2: lim (3 + 2/x) / (1 - 5/x^2) = 3/1 = 3")
print()
print(f"{'x':>10} | {'f(x)':>15} | {'g(x)':>15} | {'ratio f/g':>12} | {'-> 3?':>8}")
print("-" * 65)
for x in x_values: ratio = f(x) / g(x) print(f"{x:>10} | {f(x):>15,.0f} | {g(x):>15,.0f} | {ratio:>12.8f} | {abs(ratio - 3) < 0.01}") # Demonstration: when denominator limit = 0, the rule fails
print("\nFailed case: lim(x->0) x / sin(x)")
print("Both numerator and denominator -> 0 (indeterminate 0/0)")
print("Need L'Hopital: the limit is actually 1, not 0/0")
x_small_values = [0.1, 0.01, 0.001, 0.0001]
for x in x_small_values: print(f" x = {x}: x/sin(x) = {x / np.sin(x):.8f}")
```
#### Beginner friendly Example [R])
``` r
# Division rule: lim[f/g] = lim f / lim g, provided lim g != 0 f <- function(x) 3 * x^2 + 2 * x
g <- function(x) x^2 - 5 x_values <- c(10, 100, 1000, 10000, 100000) cat("lim(x->inf) (3x^2 + 2x)/(x^2 - 5) -> 3\n\n")
cat(sprintf("%10s | %12s\n", "x", "f(x)/g(x)"))
cat(strrep("-", 25), "\n") for (x in x_values) { cat(sprintf("%10.0f | %12.8f\n", x, f(x) / g(x)))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: computing algorithm efficiency ratio as input size n grows
# T1(n) = 5n^2 + 100 (quadratic algorithm)
# T2(n) = 2n^2 + 50 (also quadratic but smaller constant)
# Efficiency ratio T1/T2 -> 5/2 = 2.5 as n -> infinity (division rule)
# Also analyze: loss-per-sample = total_loss / N -> mean_loss as N -> inf n_sizes = np.array([10, 50, 100, 500, 1000, 5000, 10000]) # Algorithm efficiency ratio
t1 = 5 * n_sizes**2 + 100
t2 = 2 * n_sizes**2 + 50
efficiency_ratio = t1 / t2 # Loss per sample: lim(N->inf) (constant_total + N*per_sample) / N
FIXED_OVERHEAD = 1000.0 # constant startup cost
PER_SAMPLE_LOSS = 0.35 # constant per-sample contribution
total_loss = FIXED_OVERHEAD + PER_SAMPLE_LOSS * n_sizes
loss_per_sample = total_loss / n_sizes # -> 0.35 as N -> inf (division rule) results = pd.DataFrame({ "n": n_sizes, "T1": t1, "T2": t2, "T1_T2_ratio": np.round(efficiency_ratio, 6), "total_loss": np.round(total_loss, 2), "loss_per_sample": np.round(loss_per_sample, 6),
}) print("Limit Division Rule: Asymptotic Ratio Analysis")
print("lim T1/T2 = lim(5 + 100/n^2) / (2 + 50/n^2) = 5/2 = 2.5")
print("lim loss/N = lim(1000/N + 0.35) = 0 + 0.35 = 0.35")
print()
print(results.to_string(index=False))
print(f"\nT1/T2 -> 2.5: last value = {efficiency_ratio[-1]:.6f}")
print(f"loss/N -> 0.35: last value = {loss_per_sample[-1]:.6f}")
print("\nConclusion: division rule confirms the asymptotic ratio for both metrics.")
```
#### Final Professional Example [R]
``` r
# lim T1/T2 and lim loss/N (division rule) n <- 10^(1:6)
T1 <- 5 + 100/n^2
T2 <- 2 + 50/n^2
efficiency_ratio <- T1 / T2
loss_per_sample <- 1000/n + 0.35
results <- data.frame(n = n, T1 = T1, T2 = T2, T1_over_T2 = efficiency_ratio, loss_per_N = loss_per_sample)
cat("Limit division: T1/T2 -> 5/2, loss/N -> 0.35\n")
print(tail(results, 3))
cat(sprintf("T1/T2 last: %.6f loss/N last: %.6f\n", tail(efficiency_ratio, 1), tail(loss_per_sample, 1)))
```
---
AIO pag 44