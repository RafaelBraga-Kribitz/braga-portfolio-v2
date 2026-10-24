---
title: Discriminant
date: '2026-04-16'
wordCount: 716
slug: discriminant
permalink: /notes/02_algebra_precalc/powers_roots_and_inequalities/equations_and_inequalities/discriminant/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\Delta = b^2 - 4ac$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The discriminant $\Delta = b^2 - 4ac$ is the part under the square root in the quadratic formula. Before solving for the actual roots, the discriminant tells you how many real solutions exist and what type they are — without any additional computation. In data work, it is useful when you need to quickly classify whether a quadratic model has viable (real) solutions, such as whether a break-even point exists at all.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Given: ax^2 + bx + c = 0"] --> B["Compute: D = b^2 - 4ac"] B --> C{"Value of D"} C -->|"D > 0"| D["Two distinct real roots\nParabola crosses x-axis twice"] C -->|"D = 0"| E["One repeated real root\nParabola touches x-axis exactly once (vertex)"] C -->|"D < 0"| F["No real roots\nParabola does not cross x-axis\n(complex roots only)"]
```
### Real-World use:
#### Situation it is used
Determining feasibility before solving: does a price-demand model have a break-even point? Does a trajectory model hit the ground? Does a signal model have real-valued resonance frequencies? The discriminant answers these questions without computing the full formula.
#### Problem it solves
Computing the full quadratic formula is wasted effort if the roots are complex (i.e., no real solution exists). The discriminant is a fast pre-check: compute it first, classify the situation, then decide whether to proceed.
#### How it solves the problem
The discriminant is the expression inside the square root: $\sqrt{b^2 - 4ac}$. If this is negative, the square root is imaginary, meaning no real $x$ satisfies the equation. If zero, the $\pm$ gives the same result: one repeated root. If positive, two distinct roots exist.
#### Example of it used in the Working Context as DA/DS for a Business
Revenue model: $R(p) = -p^2 + 50p$, fixed cost $C = 700$. Break-even equation: $-p^2 + 50p - 700 = 0$ (multiply by $-1$: $p^2 - 50p + 700 = 0$). Discriminant: $50^2 - 4(1)(700) = 2500 - 2800 = -300 < 0$. No real break-even price exists — revenue never reaches $700$. The discriminant alone flags this: no need to apply the full formula.
### The Formula (Fragment-First)
- $\Delta$ (delta): the Greek letter for "discriminant" — it "discriminates" between solution types
- $b^2$: the square of the linear coefficient
- $4ac$: four times the product of the leading coefficient and the constant
- $b^2 - 4ac$: their difference determines the geometry of the parabola relative to the $x$-axis Discriminant decision table:
| $\Delta$ | Roots | Parabola behaviour |
|-----------|-----------------|--------------------------------------|
| $> 0$ | Two distinct real | Crosses $x$-axis at two points |
| $= 0$ | One repeated real | Tangent to $x$-axis at vertex |
| $< 0$ | No real roots | Entirely above or below $x$-axis | ### Formula-to-English Translation
"Compute $b$ squared minus four times $a$ times $c$. The sign of this number tells you how many real solutions the quadratic has." $\Delta > 0$: "The parabola crosses the $x$-axis — two real solutions."
$\Delta = 0$: "The parabola just touches the $x$-axis — one solution (a double root)."
$\Delta < 0$: "The parabola misses the $x$-axis entirely — no real solutions." ### Critical Concepts
- **Discriminant is not a root.** It is a diagnostic value, not the solution itself.
- **$\Delta = 0$ means a perfect square trinomial:** $ax^2 + bx + c = a(x - r)^2$ for some $r = -b/(2a)$.
- **Large $|\Delta|$ means roots are far apart.** Small $\Delta > 0$ means roots are close together (near-tangent case, numerically sensitive).
- **Sign of $a$ and sign of $\Delta$ together determine the parabola's shape:** - $a > 0$, $\Delta < 0$: parabola opens up, always positive — no crossing. - $a < 0$, $\Delta < 0$: parabola opens down, always negative — no crossing.
- **In statistics:** $\Delta$ relates to conditions for positive-definiteness in certain quadratic forms.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Read off a, b, c from the equation*
Equation: $3x^2 - 7x + 2 = 0$. $a = 3$, $b = -7$, $c = 2$. *Step 2: Compute $b^2$ and $4ac$ separately*
$b^2 = (-7)^2 = 49$. $4ac = 4 \times 3 \times 2 = 24$. *Step 3: Subtract and classify*
$\Delta = 49 - 24 = 25 > 0$. Two distinct real roots exist.
Full roots: $x = \frac{7 \pm \sqrt{25}}{6} = \frac{7 \pm 5}{6}$, giving $x_1 = 2$, $x_2 = \frac{1}{3}$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
def classify_discriminant(a: float, b: float, c: float) -> dict: """ Compute and classify the discriminant of ax^2 + bx + c = 0. Args: a: coefficient of x^2 b: coefficient of x c: constant term Returns: Dictionary with discriminant value and classification """ delta = b**2 - 4 * a * c if delta > 0: classification = "Two distinct real roots" elif delta == 0: classification = "One repeated real root" else: classification = "No real roots (complex only)" return {"delta": delta, "classification": classification} # Test cases
test_cases = [ (1, -5, 6), # 2 real roots (1, -2, 1), # 1 repeated root (1, 0, 1), # no real roots (3, -7, 2), # 2 real roots
] for (a, b, c) in test_cases: result = classify_discriminant(a, b, c) print(f"{a}x^2 + {b}x + {c} = 0: Δ = {result['delta']:>5} -> {result['classification']}")
```
#### Beginner friendly Example [R])
``` r
classify_discriminant <- function(a, b, c) { #' Classify the discriminant of ax^2 + bx + c = 0. #' @return List with delta and classification delta <- b^2 - 4 * a * c classification <- if (delta > 0) { "Two distinct real roots" } else if (delta == 0) { "One repeated real root" } else { "No real roots (complex only)" } list(delta = delta, classification = classification)
} test_cases <- list( c(1, -5, 6), c(1, -2, 1), c(1, 0, 1), c(3, -7, 2)
) for (tc in test_cases) { result <- classify_discriminant(tc[1], tc[2], tc[3]) cat(sprintf("%dx^2 + %dx + %d: D = %5g -> %s\n", tc[1], tc[2], tc[3], result$delta, result$classification))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: feasibility screening for quadratic pricing models
# Before computing full roots, use discriminant to flag infeasible cases np.random.seed(42) pricing_models = pd.DataFrame({ "product": ["A", "B", "C", "D", "E"], "a": [ 2.0, 1.0, -1.5, 3.0, 0.5], # coefficient of p^2 "b": [-80.0, -40.0, 60.0, -30.0, -20.0], # coefficient of p "c": [600.0, 900.0, -500.0, 400.0, 250.0], # constant (fixed cost)
}) pricing_models["discriminant"] = ( pricing_models["b"]**2 - 4 * pricing_models["a"] * pricing_models["c"]
) def classify_delta(delta: float) -> str: if delta > 0: return "Feasible (2 break-even prices)" elif delta == 0: return "Marginal (1 break-even price)" else: return "Infeasible (no break-even exists)" pricing_models["feasibility"] = pricing_models["discriminant"].apply(classify_delta) print("Break-Even Feasibility Screen using Discriminant")
print("Model: a*p^2 + b*p + c = 0 (find break-even price p)")
print()
print(pricing_models"product", "a", "b", "c", "discriminant", "feasibility".to_string(index=False))
print("\nProducts with negative discriminant cannot break even at any price — flag for review.")
```
#### Final Professional Example [R]
``` r
# Break-even feasibility: discriminant b² - 4ac set.seed(42)
pricing_models <- data.frame( product = c("A", "B", "C", "D", "E"), a = c(2, 1, -1.5, 3, 0.5), b = c(-80, -40, 60, -30, -20), c = c(600, 900, -500, 400, 250)
)
pricing_models$discriminant <- with(pricing_models, b^2 - 4*a*c)
classify_delta <- function(delta) { if (delta > 0) "Feasible (2 break-even prices)" else if (delta == 0) "Marginal (1 break-even price)" else "Infeasible (no break-even exists)"
}
pricing_models$feasibility <- sapply(pricing_models$discriminant, classify_delta)
cat("Break-Even Feasibility Screen using Discriminant\n")
print(pricing_models[c("product", "a", "b", "c", "discriminant", "feasibility")])
```
---
1300 pag 21