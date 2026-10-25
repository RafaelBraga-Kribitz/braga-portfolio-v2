---
publish: true
date: '2026-04-16'
tags:
- algebra
---

# AdditionSubtraction rule

$$
\lim_{x \to a} [f(x) \pm g(x)] = \lim_{x \to a} f(x) \pm \lim_{x \to a} g(x)
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
If both $\lim_{x \to a} f(x)$ and $\lim_{x \to a} g(x)$ exist (are finite), then the limit of their sum or difference equals the sum or difference of their individual limits. This is one of the basic limit laws that make limits "well-behaved." It tells you that limits are linear: you can analyze the behavior of a combined function piece by piece, and then add/subtract the results. In DA/DS, this appears when analyzing the asymptotic behavior of algorithms composed of multiple terms — for example, the dominant term of $O(n^2 + n)$ as $n \to \infty$ is determined by separating the components.

## Flowchart

```mermaid
flowchart TD
    A["Want: lim(x->a) of f(x) +/- g(x)"] --> B["Check: does lim f(x) exist as x->a?"]
    B --> C["Check: does lim g(x) exist as x->a?"]
    C --> D{{"Both limits exist (finite)?"} D -->|"Yes"| E["Apply rule: lim[f+/-g] = lim f +/- lim g"] D -->|"No (at least one DNE or infinite)"| F["Rule does NOT apply directly -- use other techniques"] E --> G["Evaluate lim f(x) and lim g(x) separately"] G --> H["Combine: add or subtract the results"]
```

## Real-world use

### Where it is used

Asymptotic complexity analysis (breaking $O(n^2 + n \log n)$ into components), analyzing convergence of combined terms in iterative algorithms, evaluating limits in gradient expressions, and understanding the long-run behavior of metrics that combine two separate sub-processes.

### Problem it solves

Without this rule, evaluating $\lim_{x \to a} [f(x) + g(x)]$ would require analyzing the combined function from scratch. The rule lets you split the problem: evaluate each limit independently (often easier), then add. It also enables you to check whether each component converges before claiming the combined function converges.

### How it solves the problem

The formal proof uses the $\epsilon$-$\delta$ definition: given $\epsilon > 0$, if $|f(x) - L| < \epsilon/2$ and $|g(x) - M| < \epsilon/2$ for $x$ near $a$, then $|[f(x) + g(x)] - [L + M]| \leq |f(x) - L| + |g(x) - M| < \epsilon$. The triangle inequality seals it.

### Example in a business

Algorithm A has cost $T(n) = 3n^2 + 5n$. As $n \to \infty$, analyze behavior by separating: $\lim_{n \to \infty} 3n^2 = \infty$ and $\lim_{n \to \infty} 5n = \infty$. Both diverge, so the combined limit diverges as well. To compare growth rates, divide by $n^2$: $\lim_{n \to \infty} (3 + 5/n) = 3 + 0 = 3$ (using the addition rule on $3$ and $5/n$). The $5/n$ term vanishes; the leading term dominates. Complexity is $\Theta(n^2)$.

## The formula, piece by piece

- $\lim_{x \to a}$: the limit as $x$ approaches $a$ (can be finite, $+\infty$, or $-\infty$)
- $f(x)$: first function
- $g(x)$: second function
- $L = \lim_{x \to a} f(x)$: the limit of $f$ (must exist and be finite)
- $M = \lim_{x \to a} g(x)$: the limit of $g$ (must exist and be finite) Full rule: $\lim_{x \to a} [f(x) \pm g(x)] = \lim_{x \to a} f(x) \pm \lim_{x \to a} g(x) = L \pm M$ Required condition: both $L$ and $M$ must exist (be finite real numbers).

If either is $\pm\infty$, some cases work (e.g., $\infty + 2 = \infty$) but $\infty - \infty$ is indeterminate.

## The formula in words

"The limit of a sum (or difference) equals the sum (or difference) of the individual limits, as long as both individual limits exist." $\lim_{x \to 2} (x^2 + 3x) = \lim_{x \to 2} x^2 + \lim_{x \to 2} 3x = 4 + 6 = 10$.

## Critical Concepts

- **Both limits must exist.** The rule fails if either limit is undefined. $\lim_{x \to 0} [\sin(1/x) + \sin(1/x)]$ cannot be split because $\lim_{x \to 0} \sin(1/x)$ does not exist.
- **$\infty - \infty$ is indeterminate.** If both limits are infinite and you subtract, the result is not determined — this is one of the seven indeterminate forms, requiring L'Hôpital or algebraic manipulation.
- **Extends to any finite number of terms:** $\lim [f + g + h] = \lim f + \lim g + \lim h$, applied twice.
- **This is linearity:** $\lim [cf + dg] = c \lim f + d \lim g$ for constants $c, d$.
- **Basis for polynomial limits:** $\lim_{x \to a} (a_n x^n + \cdots + a_0) = a_n a^n + \cdots + a_0$ — split each term, use constant extraction.

## Step-by-step calculation (tiny example)

*Step 1: Identify the two component functions and the limiting point*
Evaluate $\lim_{x \to 3} (x^2 - 2x)$. Components: $f(x) = x^2$, $g(x) = 2x$, limit point $a = 3$.

*Step 2: Compute each limit separately*
$\lim_{x \to 3} x^2 = 3^2 = 9$. $\lim_{x \to 3} 2x = 2(3) = 6$.

*Step 3: Combine via the addition/subtraction rule*
$\lim_{x \to 3} (x^2 - 2x) = 9 - 6 = 3$. Verify: $f(3) = 9 - 6 = 3$ (the function is continuous, so the limit equals the function value here). Confirmed.

## Code examples

### Beginner example (Python)

```python
import numpy as np   # Limit addition rule:
lim[f(x) + g(x)] = lim
f(x) + lim
g(x)
# Verify numerically by approaching
a = 3

def f(x: np.ndarray) -> np.ndarray:
    return x ** 2

def g(x: np.ndarray) -> np.ndarray:
    return 2 * x
TARGET_A = 3.0
epsilons = [0.1, 0.01, 0.001, 0.0001]
print("Numerical verification: lim(x->3) [x^2 - 2x] = lim x^2 - lim 2x = 9 - 6 = 3")
print()
print(f"{'epsilon':>12} | {'f(a+eps)':>12} | {'g(a+eps)':>12} | {'f-g at a+eps':>14} | {'combined':>12}")
print("-" * 70)
for eps in epsilons:
    x_val = TARGET_A + eps
combined = f(x_val) - g(x_val)
print(f"{eps:>12.4f} | {f(x_val):>12.6f} | {g(x_val):>12.6f} | {combined:>14.8f} | {f(x_val)-g(x_val):>12.8f}")   # Expected limits
lim_f = TARGET_A ** 2
lim_g = 2 * TARGET_A
print(f"\nlim f = {lim_f}, lim g = {lim_g}, lim f - lim g = {lim_f - lim_g}")
print("As epsilon shrinks to 0, f(a+eps) - g(a+eps) -> 3 from above. Rule confirmed.")
```

### Beginner example (R)

```r
# Limit addition rule:
lim[f(x) + g(x)] = lim f(x) + lim g(x)
f <- function(x) x^2
g <- function(x) 2 * x
TARGET_A <- 3
epsilons <- c(0.1, 0.01, 0.001, 0.0001)
cat(sprintf("Approaching x = %g from above: f(x) - g(x) -> f(a) - g(a)\n\n", TARGET_A))
cat(sprintf("%12s | %12s | %12s | %14s\n", "epsilon", "f(a+eps)", "g(a+eps)", "f-g at a+eps"))
cat(strrep("-", 55), "\n")
for (eps in epsilons) { x_val <- TARGET_A + eps
  cat(sprintf("%12.4f | %12.6f | %12.6f | %14.8f\n", eps, f(x_val), g(x_val), f(x_val) - g(x_val)))
}
cat(sprintf("\nlim f = %.1f, lim g = %.1f, lim(f-g) = %.1f\n", f(TARGET_A), g(TARGET_A), f(TARGET_A)-g(TARGET_A)))
```

### Professional example (Python)

```python
import numpy as np
import pandas as pd   # Scenario: asymptotic complexity analysis for two competing algorithm implementations
# T1(n) = 2n^2 + n (naive implementation)
# T2(n) = 3n + 100 (linear implementation)
# Analyze component behavior as n -> inf by splitting limits
n_values = np.array([10, 50, 100, 500, 1000, 5000, 10000])
results = []
for n in n_values:
    # T1 components: 2n^2 and n
    t1_quadratic = 2 * n**2
t1_linear = n
t1_total = t1_quadratic + t1_linear   # T2 components: 3n and 100
t2_linear = 3 * n
t2_constant = 100
t2_total = t2_linear + t2_constant   # Ratio T1/T2: does T2 scale better?
ratio = t1_total / t2_total
results.append({ "n": n, "T1_total": t1_total, "T2_total": t2_total, "ratio_T1_T2": round(ratio, 2),   # lim(T1/n^2) as n->inf: split numerator, divide by n^2 #
    (2n^2 + n)/n^2 = 2 + 1/n -> 2 + 0 = 2 by addition rule "T1_per_n2": round(t1_total / n**2, 6), })
df = pd.DataFrame(results)
print("Asymptotic Analysis: Limit Addition Rule on Algorithm Complexity")
print("T1(n) = 2n^2 + n | T2(n) = 3n + 100")
print("lim T1(n)/n^2 = lim(2 + 1/n) = lim 2 + lim 1/n = 2 + 0 = 2 (addition rule)")
print()
print(df.to_string(index=False))
print("\nT1_per_n2 -> 2.0 as n grows: confirms T1 is Theta(n^2), leading coefficient = 2.")
print("T2 is Theta(n), so T1 dominates: ratio T1/T2 grows without bound.")
```

### Professional example (R)

```r
# lim T1(n)/n^2 = lim(2 + 1/n) = 2 (addition rule)
n <- c(10, 100, 1000, 10000)
T1 <- 2*n^2 + n
T2 <- 3*n + 100
T1_per_n2 <- T1 / n^2
results <- data.frame(n = n, T1 = T1, T2 = T2, T1_per_n2 = T1_per_n2)
cat("Limit addition: T1(n)/n^2 -> 2\n")
print(results)
cat("T1 is Theta(n^2), T2 is Theta(n).\n")
```

---

*Source: AIO p. 44*
