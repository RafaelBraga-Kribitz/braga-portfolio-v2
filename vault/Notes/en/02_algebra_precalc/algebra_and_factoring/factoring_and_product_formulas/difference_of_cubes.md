---
title: Difference of cubes
date: '2026-04-16'
wordCount: 1072
slug: difference_of_cubes
permalink: /notes/02_algebra_precalc/algebra_and_factoring/factoring_and_product_formulas/difference_of_cubes/index.html
share_status: draft
publish_target: note
boundary: public
---
# $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The difference of cubes identity factors $a^3 - b^3$ into the product of a linear factor $(a-b)$ and a quadratic factor $(a^2 + ab + b^2)$. The quadratic factor has no real roots (its discriminant is $b^2 - 4 \cdot 1 \cdot b^2 = -3b^2 < 0$ for $b \ne 0$), so the only real root of $a^3 - b^3 = 0$ is $a = b$. In DA/DS, this identity appears in: simplifying polynomial expressions that arise in loss function algebra, canceling common factors in rational expressions (e.g., when a ratio involves $x^3 - 1$), understanding the structure of gradient computations involving cubic terms, computing limits of the form $\lim_{x \to a} \frac{x^3 - a^3}{x - a} = 3a^2$ (derivative from first principles), and recognizing algebraic structure in third-order polynomial models. The paired identity is the sum of cubes: $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Expression: a³ - b³"] --> B["Factor: (a - b)(a² + ab + b²)"] B --> C["Linear factor: (a - b) — gives root a = b"] B --> D["Quadratic factor: (a² + ab + b²) — no real roots"] D --> E["Discriminant = b² - 4b² = -3b² < 0 (for b ≠ 0)"] C --> F["DA: cancel (x - a) factor in rational expressions"] C --> G["DA: derivative limit — (x³ - a³)/(x - a) → 3a² as x → a"] B --> H["Verify: expand (a-b)(a²+ab+b²) = a³ - b³ ✓"] A --> I["Paired identity: a³ + b³ = (a+b)(a² - ab + b²)"]
```
### Real-World use:
#### Situation it is used
Simplifying rational expressions: $\frac{x^3 - 8}{x - 2} = \frac{(x-2)(x^2+2x+4)}{x-2} = x^2+2x+4$ (valid for $x \ne 2$). Derivative from first principles: $\frac{d}{dx}x^3 = \lim_{h \to 0} \frac{(x+h)^3 - x^3}{h}$ — factoring numerator. Polynomial root finding: if $a^3 = b^3$ for real $a, b$, then $a = b$. Simplifying expressions in gradient derivations involving third-degree terms.
#### Problem it solves
The expression $a^3 - b^3$ does not factor by the difference of squares formula ($a^2 - b^2 = (a-b)(a+b)$) — you need the specific cubic factoring rule. Without it, canceling $(a-b)$ from a ratio $\frac{a^3 - b^3}{a - b}$ requires either long polynomial division or expanding by trial, both slow and error-prone.
#### How it solves the problem
The factoring is verified by direct expansion: $(a-b)(a^2+ab+b^2) = a^3 + a^2 b + ab^2 - a^2 b - ab^2 - b^3 = a^3 - b^3$. All middle terms cancel. The pattern is: linear factor with the same sign as in $a^3 - b^3$ (difference, so $a-b$), and quadratic factor with all positive terms ($a^2 + ab + b^2$, no minus signs in the middle). Contrast with sum of cubes: $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$ — the linear factor matches ($a+b$) and the middle term of the quadratic flips to negative.
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist simplifies a ratio that appears in a gradient computation: $\frac{w^3 - 1}{w - 1}$ (e.g., computing a finite-difference gradient approximation at $w = 1$). Using the identity: $w^3 - 1 = (w-1)(w^2 + w + 1)$, so $\frac{w^3 - 1}{w - 1} = w^2 + w + 1$ for $w \ne 1$. At $w = 1$: $1 + 1 + 1 = 3$ — which is exactly $\frac{d}{dw}w^3\big|_{w=1} = 3w^2\big|_{w=1} = 3$. ✓ ### The Formula (Fragment-First)
Breaking the notation: - $a^3 - b^3$: the difference of two cubes — a degree-3 polynomial in $a$ (with $b$ as a parameter).
- $(a - b)$: the linear factor — zero when $a = b$. This is the only real root.
- $(a^2 + ab + b^2)$: the irreducible quadratic factor — no real roots (discriminant $< 0$ for $b \ne 0$). **Verification**: $(a-b)(a^2+ab+b^2) = a(a^2+ab+b^2) - b(a^2+ab+b^2)$
$= a^3 + a^2 b + ab^2 - a^2 b - ab^2 - b^3 = a^3 - b^3$. ✓ **Paired identity — sum of cubes**: $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$. **Memory trick**: "SOAP": Same, Opposite, Always Positive.
- Same: linear factor has same sign as the original expression ($a^3 - b^3 \Rightarrow (a-b)$; $a^3 + b^3 \Rightarrow (a+b)$).
- Opposite: middle term of quadratic has opposite sign ($-$ for difference, $+$ for sum).
- Always Positive: last term of quadratic is always $+b^2$. **Limit application**: $\lim_{a \to b} \frac{a^3 - b^3}{a - b} = \lim_{a \to b} (a^2 + ab + b^2) = 3b^2$.
### Formula-to-English Translation
"To factor $a^3 - b^3$: write $(a-b)$ times $(a^2 + ab + b^2)$. The linear factor gives the only real root. The quadratic factor has all positive terms and no real roots. Verify by FOIL — all middle terms cancel, leaving just $a^3 - b^3$. Use SOAP to remember the signs: Same (linear factor matches the sign of the difference), Opposite (middle term of quadratic), Always Positive (last term)." ### Critical Concepts
1. **$(a-b)$ is the only real factor**: the quadratic $a^2 + ab + b^2$ has discriminant $b^2 - 4b^2 = -3b^2 < 0$ for $b \ne 0$, so no real roots. The only real solution to $a^3 = b^3$ is $a = b$. (Over complex numbers there are three cube roots.)
2. **SOAP mnemonic**: Same-Opposite-Always Positive applies to both sum and difference of cubes. Difference ($-$): $(a-b)(a^2+ab+b^2)$ — middle term of quadratic is $+ab$. Sum ($+$): $(a+b)(a^2-ab+b^2)$ — middle term of quadratic is $-ab$.
3. **Not to be confused with perfect cube trinomials**: $(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$ — expanding a cube. Difference of cubes $a^3 - b^3$ is factoring a difference, not expanding a sum.
4. **Limit / derivative shortcut**: $\frac{a^3 - b^3}{a - b} = a^2 + ab + b^2 \to 3b^2$ as $a \to b$. This is the derivative of $f(x) = x^3$ at $x = b$ computed from first principles.
5. **Generalizes to $x^n - 1 = (x-1)(x^{n-1} + x^{n-2} + \cdots + 1)$**: the difference of cubes is the $n=3$ special case of the general factoring formula for $x^n - 1$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: simplify $\frac{8x^3 - 27}{2x - 3}$. *Step 1: Recognize the form*
$8x^3 - 27 = (2x)^3 - 3^3$. This is difference of cubes with $a = 2x, b = 3$. *Step 2: Apply the identity*
$(2x)^3 - 3^3 = (2x - 3)((2x)^2 + (2x)(3) + 3^2) = (2x-3)(4x^2 + 6x + 9)$. *Step 3: Cancel the common factor*
$\frac{(2x-3)(4x^2+6x+9)}{2x-3} = 4x^2 + 6x + 9$ (valid for $x \ne \frac{3}{2}$). *Step 4: Verify numerically at $x = 2$*
$(8 \cdot 8 - 27) / (4 - 3) = (64 - 27) / 1 = 37$.
$4(4) + 6(2) + 9 = 16 + 12 + 9 = 37$. ✓ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Difference of cubes: a³ - b³ = (a-b)(a² + ab + b²) # Basic verification
pairs = [(2, 1), (3, 2), (5, 3), (10, 7), (0.5, 0.25)] print(f"{'a':>6} {'b':>6} {'a³-b³':>10} {'(a-b)(a²+ab+b²)':>18} {'match':>6}")
for a, b in pairs: lhs = a**3 - b**3 rhs = (a - b) * (a**2 + a*b + b**2) print(f"{a:>6.2f} {b:>6.2f} {lhs:>10.4f} {rhs:>18.4f} {str(abs(lhs-rhs)<1e-10):>6}") # Simplify rational expression: (x³ - a³) / (x - a)
print("\nSimplification: (x³ - a³) / (x - a) = x² + ax + a²")
a_val = 3.0
for x in [1.0, 2.0, 4.0, 5.0]: if abs(x - a_val) > 1e-10: direct = (x**3 - a_val**3) / (x - a_val) factored = x**2 + a_val * x + a_val**2 print(f" x={x:.1f}: direct={direct:.4f} factored={factored:.4f} match={abs(direct-factored)<1e-10}") # Derivative from first principles: d/dx(x³) at x=2 = 3(2²) = 12
import math
a_limit = 2.0
limit_results = []
for h in [0.1, 0.01, 0.001, 0.0001]: diff_quot = (a_limit + h)**3 - a_limit**3 factored_limit = ((a_limit+h)**2 + (a_limit+h)*a_limit + a_limit**2) # a²+ab+b² limit_results.append((h, diff_quot / h, factored_limit)) print(f"\nDerivative of x³ at x={a_limit} via (x³-a³)/(x-a) → a²+ax+x² = 3a² = {3*a_limit**2}")
for h, dq, fl in limit_results: print(f" h={h:.4f} diff_quot/h={dq:.6f} factored_limit={fl:.6f}")
```
#### Beginner friendly Example [R])
``` r
# Difference of cubes in R # Verification
pairs <- list(c(2,1), c(3,2), c(5,3), c(10,7)) cat(sprintf("%-6s %-6s %-10s %-18s %s\n", "a", "b", "a³-b³", "(a-b)(a²+ab+b²)", "match"))
for (p in pairs) { a <- p[1]; b <- p[2] lhs <- a^3 - b^3 rhs <- (a - b) * (a^2 + a*b + b^2) cat(sprintf("%-6.2f %-6.2f %-10.4f %-18.4f %s\n", a, b, lhs, rhs, abs(lhs - rhs) < 1e-10))
} # Simplify (x³ - 8) / (x - 2)
a_val <- 2.0
cat(sprintf("\nSimplification: (x³ - %.0f³) / (x - %.0f) = x² + %.0fx + %.0f\n", a_val, a_val, a_val, a_val^2))
for (x in c(1, 3, 4, 5)) { direct <- (x^3 - a_val^3) / (x - a_val) factored <- x^2 + a_val*x + a_val^2 cat(sprintf(" x=%d: direct=%.4f factored=%.4f match=%s\n", x, direct, factored, abs(direct - factored) < 1e-10))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import sympy as sp # Scenario: symbolic and numeric polynomial simplification
# Factor and simplify expressions of the form (x^3 - a^3) / (x - a)
# Demonstrate the limit application (derivative from first principles)
# and validate numerically over a grid # Symbolic factoring
x, a = sp.symbols("x a", real=True) expr_diff = x**3 - a**3
factored_sym = sp.factor(expr_diff)
simplified = sp.simplify(expr_diff / (x - a)) print("Symbolic factoring of a³ - b³:")
print(f" Original: {expr_diff}")
print(f" Factored: {factored_sym}")
print(f" Simplified (x³-a³)/(x-a) = {simplified}") # Derivative verification: lim_{x->a} (x³-a³)/(x-a) = 3a²
limit_val = sp.limit((x**3 - a**3) / (x - a), x, a)
print(f"\n Limit as x→a: {limit_val} (= derivative of x³ at a = 3a²)") # Numeric validation grid
a_vals = np.array([1.0, 2.0, 3.0, 5.0, 10.0])
x_grid = a_vals + 0.0001 # near-limit evaluation print("\nNumerical check: (x³ - a³) / (x - a) ≈ 3a²")
print(f"{'a':>6} {'3a²':>8} {'ratio at x≈a':>14} {'error':>10}")
for a_val, x_val in zip(a_vals, x_grid): ratio = (x_val**3 - a_val**3) / (x_val - a_val) exact_drv = 3 * a_val**2 print(f"{a_val:>6.1f} {exact_drv:>8.4f} {ratio:>14.6f} {abs(ratio - exact_drv):>10.2e}")
```
#### Final Professional Example [R]
``` r
# (x³ - a³) / (x - a) → 3a² as x → a a_vals <- c(1, 2, 3, 5, 10)
x_grid <- a_vals + 0.0001
cat("Numerical check: (x³ - a³)/(x - a) ≈ 3a²\n")
for (i in seq_along(a_vals)) { ratio <- (x_grid[i]^3 - a_vals[i]^3) / (x_grid[i] - a_vals[i]) exact <- 3 * a_vals[i]^2 cat(sprintf(" a=%.1f 3a²=%.4f ratio=%.6f error=%.2e\n", a_vals[i], exact, ratio, abs(ratio - exact)))
}
```
---
1300 pag 20