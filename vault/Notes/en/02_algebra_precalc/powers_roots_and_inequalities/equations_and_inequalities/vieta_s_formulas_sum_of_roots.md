---
title: Vieta's Formulas (Sum of roots)
date: '2026-04-16'
wordCount: 625
slug: vieta_s_formulas_sum_of_roots
permalink: /notes/02_algebra_precalc/powers_roots_and_inequalities/equations_and_inequalities/vieta_s_formulas_sum_of_roots/index.html
share_status: draft
publish_target: note
boundary: public
---
# $x_1 + x_2 = -\frac{b}{a}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Vieta's sum formula says: if $x_1$ and $x_2$ are the roots of $ax^2 + bx + c = 0$, then their sum equals $-b/a$. Named after François Viète (latinized: Vieta), a 16th-century French mathematician. This formula lets you find the sum of the roots from the coefficients alone — without solving the quadratic. It is also the theoretical basis for checking your computed roots: if your two roots don't add up to $-b/a$, you made an error.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Quadratic: ax^2 + bx + c = 0\nRoots: x1, x2"] --> B["Factor form: a*(x - x1)*(x - x2) = 0"] B --> C["Expand: a*(x^2 - (x1+x2)*x + x1*x2) = 0"] C --> D["Match coefficients with ax^2 + bx + c"] D --> E["Coefficient of x: -a*(x1+x2) = b"] E --> F["Solve: x1 + x2 = -b/a"]
```
### Real-World use:
#### Situation it is used
Verifying computed roots of quadratic models, reconstructing unknown coefficients from known roots, building quadratics from constraints (e.g., "I know the two break-even prices; what is the revenue model?"), and in polynomial interpolation where you know certain root properties.
#### Problem it solves
Sometimes you only need the sum of the roots (e.g., "what is the average break-even price?"), not the individual roots. Vieta's formula gives this directly without solving the full quadratic.
#### How it solves the problem
From the factored form: $a(x - x_1)(x - x_2) = a(x^2 - (x_1 + x_2)x + x_1 x_2) = ax^2 + bx + c$. Matching the coefficient of $x$: $-a(x_1 + x_2) = b$, so $x_1 + x_2 = -b/a$.
#### Example of it used in the Working Context as DA/DS for a Business
Break-even prices for a product are $p_1$ and $p_2$ (unknown). The revenue model is $-2p^2 + 80p - 600 = 0$ ($a = -2$, $b = 80$, $c = -600$). Sum of break-even prices: $p_1 + p_2 = -\frac{80}{-2} = 40$. Average break-even price = $40/2 = 20$. No quadratic formula needed.
### The Formula (Fragment-First)
- $x_1, x_2$: the two roots of the quadratic $ax^2 + bx + c = 0$
- $x_1 + x_2$: their sum
- $-\frac{b}{a}$: negative of the ratio of linear to leading coefficient
- Works for complex roots too: even when roots are complex, their sum is still $-b/a$
- Named after: François Viète (Vieta), 1540–1603 Full formula: $x_1 + x_2 = -\frac{b}{a}$ for any quadratic $ax^2 + bx + c = 0$ with $a \neq 0$ ### Formula-to-English Translation
"The sum of the two roots of a quadratic equals negative $b$ over $a$." $x^2 - 5x + 6 = 0$: sum of roots $= -\frac{-5}{1} = 5$. Roots are $2$ and $3$: $2 + 3 = 5$. Confirmed.
### Critical Concepts
- **Works regardless of discriminant.** Even if roots are complex, their sum is $-b/a$ (a real number).
- **Average root:** the axis of symmetry is $-\frac{b}{2a} = \frac{x_1 + x_2}{2}$ — the average of the two roots.
- **Use for verification:** after solving with the quadratic formula, confirm $x_1 + x_2 = -b/a$ as a sanity check.
- **Pair with product formula:** Vieta's product gives $x_1 \cdot x_2 = c/a$. Together, sum and product fully characterize the roots.
- **Reconstruction:** given $x_1 + x_2 = S$ and $x_1 x_2 = P$, the quadratic is $x^2 - Sx + P = 0$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Identify a and b from the quadratic*
Equation: $3x^2 - 12x + 9 = 0$. $a = 3$, $b = -12$. *Step 2: Compute the sum of roots*
$x_1 + x_2 = -\frac{b}{a} = -\frac{-12}{3} = 4$. *Step 3: Verify by solving and adding the roots*
Divide by 3: $x^2 - 4x + 3 = 0$. Factor: $(x-1)(x-3) = 0$. Roots: $x_1 = 1$, $x_2 = 3$. Sum $= 1 + 3 = 4$. Confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
def vieta_sum(a: float, b: float) -> float: """ Compute the sum of roots of ax^2 + bx + c = 0 using Vieta's formula. Args: a: leading coefficient b: linear coefficient Returns: Sum of roots: -b/a """ return -b / a import math def quadratic_roots(a: float, b: float, c: float) -> tuple | None: """Return real roots of ax^2 + bx + c = 0.""" delta = b**2 - 4 * a * c if delta < 0: return None return ( (-b + math.sqrt(delta)) / (2 * a), (-b - math.sqrt(delta)) / (2 * a), ) # Test: 3x^2 - 12x + 9 = 0
a, b, c = 3, -12, 9
predicted_sum = vieta_sum(a, b)
roots = quadratic_roots(a, b, c)
actual_sum = sum(roots) print(f"Equation: {a}x^2 + {b}x + {c} = 0")
print(f"Vieta's sum (predicted): x1 + x2 = -({b})/({a}) = {predicted_sum}")
print(f"Actual roots: {roots}")
print(f"Actual sum: {actual_sum}")
print(f"Match: {abs(predicted_sum - actual_sum) < 1e-10}")
```
#### Beginner friendly Example [R])
``` r
vieta_sum <- function(a, b) -b / a quadratic_roots <- function(a, b, c) { delta <- b^2 - 4 * a * c if (delta < 0) return(NULL) c( (-b + sqrt(delta)) / (2 * a), (-b - sqrt(delta)) / (2 * a) )
} a <- 3; b <- -12; c <- 9
predicted_sum <- vieta_sum(a, b)
roots <- quadratic_roots(a, b, c)
actual_sum <- sum(roots) cat(sprintf("Equation: %dx^2 + %dx + %d = 0\n", a, b, c))
cat(sprintf("Vieta's sum: x1 + x2 = -(%d)/(%d) = %.4f\n", b, a, predicted_sum))
cat(sprintf("Actual roots: %.4f, %.4f\n", roots[1], roots[2]))
cat(sprintf("Actual sum: %.4f\n", actual_sum))
cat(sprintf("Match: %s\n", isTRUE(all.equal(predicted_sum, actual_sum))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: verifying break-even computations across a product portfolio
# Use Vieta's sum to sanity-check computed roots np.random.seed(42) portfolio = pd.DataFrame({ "product": ["A", "B", "C", "D"], "a": [-1.0, -2.0, -0.5, -3.0], "b": [50.0, 80.0, 30.0, 120.0], "c": [-400.0, -600.0, -100.0, -900.0],
}) def compute_roots_and_verify(a: float, b: float, c: float) -> dict: delta = b**2 - 4 * a * c if delta < 0: return {"root1": None, "root2": None, "actual_sum": None, "vieta_sum": -b/a, "check_ok": None} r1 = (-b + np.sqrt(delta)) / (2 * a) r2 = (-b - np.sqrt(delta)) / (2 * a) vieta = -b / a return { "root1": round(r1, 4), "root2": round(r2, 4), "actual_sum": round(r1 + r2, 10), "vieta_sum": round(vieta, 10), "check_ok": np.isclose(r1 + r2, vieta), } results = pd.DataFrame([ {"product": row["product"], **compute_roots_and_verify(row["a"], row["b"], row["c"])} for _, row in portfolio.iterrows()
]) print("Break-Even Root Verification using Vieta's Sum Formula")
print("Vieta's check: x1 + x2 should equal -b/a")
print()
print(results.to_string(index=False))
print(f"\nAll Vieta's checks passed: {results['check_ok'].all()}")
```
#### Final Professional Example [R]
``` r
# Break-even root verification: x1 + x2 = -b/a set.seed(42)
portfolio <- data.frame(product = c("A", "B", "C", "D"), a = c(-1, -2, -0.5, -3), b = c(50, 80, 30, 120), c = c(-400, -600, -100, -900))
compute_roots <- function(a, b, c) { delta <- b^2 - 4*a*c if (delta < 0) return(list(root1 = NA, root2 = NA, actual_sum = NA, vieta_sum = -b/a, check_ok = NA)) r1 <- (-b + sqrt(delta)) / (2*a); r2 <- (-b - sqrt(delta)) / (2*a) list(root1 = r1, root2 = r2, actual_sum = r1 + r2, vieta_sum = -b/a, check_ok = isTRUE(all.equal(r1 + r2, -b/a)))
}
results <- do.call(rbind, lapply(1:nrow(portfolio), function(i) { r <- with(portfolio[i, ], compute_roots(a, b, c)) data.frame(product = portfolio$product[i], root1 = r$root1, root2 = r$root2, actual_sum = r$actual_sum, vieta_sum = r$vieta_sum, check_ok = r$check_ok)
}))
cat("Break-Even Root Verification: Vieta sum = -b/a\n")
print(results)
cat(sprintf("\nAll checks passed: %s\n", all(results$check_ok, na.rm = TRUE)))
```
---
1300 pag 21