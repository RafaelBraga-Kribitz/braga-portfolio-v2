---
title: Inequality rule flip (negative)
date: '2026-04-16'
wordCount: 1170
slug: inequality_rule_flip_negative
permalink: /notes/02_algebra_precalc/powers_roots_and_inequalities/equations_and_inequalities/inequality_rule_flip_negative/index.html
share_status: draft
publish_target: note
boundary: public
---
# If $a > b$ and $m < 0$, then $am < bm$ and $\frac{a}{m} < \frac{b}{m}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
When you multiply or divide both sides of an inequality by a negative number, the direction of the inequality reverses. Formally: if $a > b$ and $m < 0$, then $am < bm$ and $a/m < b/m$. This is one of the most commonly violated rules in algebraic manipulation, and it is especially easy to overlook in DA/DS when dealing with gradient directions, sign-based loss transformations, and convex/concave function comparisons. Key appearances: (1) optimizing a loss function — minimizing $f(\theta)$ is equivalent to maximizing $-f(\theta)$; when you write $\argmin_\theta f = \argmax_\theta (-f)$, the flip is implicit; (2) inequality constraints in linear programs — multiplying a constraint by $-1$ to convert $\ge$ to $\le$ (standard form) flips the sign and the direction; (3) confidence interval reversal — if you standardize by dividing by a negative quantity, the bounds reverse; (4) gradient sign analysis — if a gradient is negative, increasing a parameter decreases the loss; this sign flip is the inequality flip applied to the direction of change; (5) correlation sign — if $\text{Cov}(X, Y) < 0$, then $-\text{Cov}(X, Y) > 0$, and any inequality involving the covariance flips when negated.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Inequality flip: a > b, m < 0 → am < bm"] --> B["Proof: a > b → a-b > 0. Multiply by m < 0: m(a-b) < 0 → ma < mb"] B --> C["Rule: multiply/divide by negative → direction reverses"] A --> D["Equivalent: a/m < b/m when m < 0 (division is multiplication by 1/m < 0)"] A --> E["DA: min f = max (-f) — negating objective reverses all inequalities"] A --> F["DA: LP standard form — multiply >= constraint by -1 to get <= , flip"] A --> G["DA: gradient descent — if grad < 0, moving in positive direction decreases loss"] A --> H["TRAP: rule applies ONLY when m < 0; if m > 0 the inequality is preserved"] A --> I["TRAP: never apply flip to m = 0 — division by zero is undefined"]
```
### Real-World use:
#### Situation it is used
Linear programming standard form: optimization problems are often written with $\ge$ constraints. Converting to $\le$ (standard form) requires multiplying by $-1$: $\mathbf{a}^T \mathbf{x} \ge b$ becomes $-\mathbf{a}^T \mathbf{x} \le -b$. The inequality flips because the multiplier is $-1 < 0$. Gradient descent direction: if $\partial L / \partial \theta_j < 0$, then increasing $\theta_j$ (positive step) decreases $L$. This is the flip in action: $L < 0 \Rightarrow -L > 0$, meaning the negated gradient points in the direction of steepest ascent.
#### Problem it solves
Many derivations involve multiplying both sides of an inequality by a negative quantity (a coefficient, a negative correlation, a negated weight). Without the flip rule, sign errors propagate silently, producing incorrect optimization directions, wrong confidence interval bounds, or inverted inequality constraints.
#### How it solves the problem
Proof: suppose $a > b$, so $a - b > 0$. Multiply both sides by $m < 0$: $m(a - b) < 0$ (product of positive and negative is negative). Expanding: $ma - mb < 0$, so $ma < mb$. For division: $a/m = a \cdot (1/m)$ and $1/m < 0$ when $m < 0$, so division is just multiplication by $1/m < 0$, and the same flip applies.
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist is solving a portfolio allocation problem. The constraint is that expected return $\mu^T w \ge R_\text{min}$. To feed this into a standard linear solver that expects $\le$ constraints, they multiply both sides by $-1$: $-\mu^T w \le -R_\text{min}$. The inequality flips from $\ge$ to $\le$ because the multiplier is $-1 < 0$. This is one of the most routine transformations in constrained optimization.
### The Formula (Fragment-First)
Breaking the notation: - $a > b$: the starting inequality — $a$ is strictly greater than $b$.
- $m < 0$: the negative multiplier (or divisor).
- $am < bm$: the result — after multiplying by the negative $m$, the inequality direction reverses: previously larger $am$ is now smaller.
- $a/m < b/m$: same result for division — dividing by $m < 0$ also reverses the direction. **Why it reverses** (intuitive): multiplying by a negative flips the number line. If $a$ is to the right of $b$ on the number line, then $ma$ is to the left of $mb$ after reflecting about $0$. **Comparison of cases**: | Condition | Operation | Inequality direction |
|---|---|---|
| $m > 0$ | multiply or divide | preserved: $a > b \Rightarrow am > bm$ |
| $m < 0$ | multiply or divide | reversed: $a > b \Rightarrow am < bm$ |
| $m = 0$ | multiply | all become zero (trivial) |
| $m = 0$ | divide | undefined | **Non-strict version**: if $a \ge b$ and $m < 0$, then $am \le bm$ (weak inequality with equality possible). **TRAP: only for multiplication/division, not addition/subtraction**. Adding or subtracting any real number (positive, negative, or zero) from both sides of an inequality never changes the direction: $a > b \Rightarrow a + c > b + c$ for any $c \in \mathbb{R}$.
### Formula-to-English Translation
"Multiplying or dividing both sides of an inequality by a negative number reverses the direction. $a > b$ and $m < 0$ gives $am < bm$. Always check the sign of the multiplier before deciding whether the inequality direction stays or flips. In optimization: negating an objective converts minimization to maximization (and vice versa). In LP: multiply $\ge$ constraint by $-1$ to get $\le$ (standard form), flipping direction. In gradient analysis: a negative gradient means the function decreases in the positive direction." ### Critical Concepts
1. **Sign of multiplier determines direction**: positive multiplier preserves inequality; negative multiplier reverses it. This is the complete rule. No exceptions (except $m = 0$, where division is undefined and multiplication gives $0 = 0$).
2. **Minimization–maximization duality**: $\argmin_\theta f(\theta) = \argmax_\theta (-f(\theta))$. This implicit inequality flip is used constantly: the cross-entropy loss is minimized by maximizing the log-likelihood (which is $-$cross-entropy). The negative multiplier here is $-1$.
3. **LP standard form conversions**: $\mathbf{a}^T\mathbf{x} \ge b$ becomes $-\mathbf{a}^T\mathbf{x} \le -b$. Both the coefficient vector and the right-hand side change sign. The direction flips from $\ge$ to $\le$.
4. **Gradient descent sign logic**: if $\frac{\partial L}{\partial \theta} > 0$, the parameter $\theta$ should decrease (negative update). If $\frac{\partial L}{\partial \theta} < 0$, it should increase (positive update). The update $\theta \leftarrow \theta - \eta \frac{\partial L}{\partial \theta}$ automatically handles this via the flip rule.
5. **TRAP: chain of flips**: applying the flip rule twice (multiplying by two negatives, i.e., a positive) returns to the original direction. Track each sign change explicitly to avoid accumulated errors in multi-step derivations.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: convert $-3x > 12$ to a form with $x$ isolated. *Step 1: Identify the current state*
$-3x > 12$. The coefficient of $x$ is $-3 < 0$. *Step 2: Divide both sides by $-3$*
Dividing by $-3 < 0$ flips the inequality direction.
$\frac{-3x}{-3} < \frac{12}{-3}$. *Step 3: Simplify*
$x < -4$. *Step 4: Verify with a specific value*
Take $x = -5 < -4$. Check original: $-3(-5) = 15 > 12$. ✓
Take $x = -3 > -4$. Check original: $-3(-3) = 9 \not> 12$. ✗ (correctly excluded). ✓ *Step 5: Contrast with positive coefficient*
If the problem were $3x > 12$: dividing by $3 > 0$ gives $x > 4$ (direction preserved). The difference is purely the sign of the divisor.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Inequality flip when multiplying/dividing by a negative number
import numpy as np def multiply_inequality(a: float, b: float, m: float) -> dict: """ Multiply both sides of a > b by m and check if direction is preserved. Args: a: Left-hand side value (a > b assumed). b: Right-hand side value. m: Multiplier. Returns: Dictionary with original and transformed inequality info. """ assert a > b, "Requires a > b" am, bm = a * m, b * m return { "original": f"{a} > {b}", "multiplier": m, "transformed": f"{am:.4f} {'>' if am > bm else '<' if am < bm else '='} {bm:.4f}", "flipped": m < 0, "am_gt_bm": am > bm, } # Demonstrate the rule
print("Inequality flip: a > b and m < 0 → am < bm")
a, b = 5.0, 2.0
cases = [3.0, 1.0, -1.0, -3.0, 0.5, -0.5]
for m in cases: result = multiply_inequality(a, b, m) print(f" m={m:5.1f}: {result['original']} → {result['transformed']} " f"(flipped: {result['flipped']})") # Solving -3x > 12
print("\nSolving -3x > 12:")
print(" Divide by -3 (negative) → flip direction: x < 12/(-3) = -4")
x_vals = [-6.0, -5.0, -4.0, -3.0, -2.0]
for x in x_vals: lhs = -3 * x in_sol = x < -4 lhs_ok = lhs > 12 print(f" x={x:5.1f}: -3x={lhs:7.1f} satisfies original (-3x>12): {lhs_ok} " f"satisfies solution (x<-4): {in_sol} consistent: {lhs_ok == in_sol}") # Minimization to maximization (the most common flip in ML)
print("\nMin f = Max(-f):")
def f(x: np.ndarray) -> np.ndarray: """Quadratic: f(x) = (x-3)^2 + 1.""" return (x - 3) ** 2 + 1 x_grid = np.linspace(0, 6, 100)
f_vals = f(x_grid)
neg_f = -f_vals min_f_idx = np.argmin(f_vals)
max_neg_f_idx = np.argmax(neg_f) print(f" argmin f(x): x = {x_grid[min_f_idx]:.4f} (f = {f_vals[min_f_idx]:.4f})")
print(f" argmax (-f(x)): x = {x_grid[max_neg_f_idx]:.4f} (-f = {neg_f[max_neg_f_idx]:.4f})")
print(f" Same location: {abs(x_grid[min_f_idx] - x_grid[max_neg_f_idx]) < 0.1}")
```
#### Beginner friendly Example [R])
``` r
# Inequality flip in R: multiply/divide by negative → reverse direction # Demonstrate
cat("Inequality flip: a > b, m < 0 → am < bm\n")
a_val <- 5; b_val <- 2
multipliers <- c(3, 1, -1, -3, 0.5, -0.5)
for (m in multipliers) { am <- a_val * m; bm <- b_val * m direction <- ifelse(am > bm, ">", ifelse(am < bm, "<", "=")) cat(sprintf(" m=%5.1f: %d > %d → %.2f %s %.2f (flipped: %s)\n", m, a_val, b_val, am, direction, bm, m < 0))
} # Solve -3x > 12
cat("\nSolve -3x > 12: x < -4 (flip on dividing by -3)\n")
for (x in c(-6, -5, -4, -3, -2)) { lhs <- -3 * x in_sol <- x < -4 cat(sprintf(" x=%2d: -3x=%4d > 12: %s x<-4: %s consistent: %s\n", x, lhs, lhs > 12, in_sol, (lhs > 12) == in_sol))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: LP standard form conversion and gradient descent direction analysis
# Demonstrates inequality flip rule in two common DA/DS contexts np.random.seed(42) # Part 1: LP constraint conversion (>= to <=)
print("LP Standard Form: a^T x >= b → (-a)^T x <= -b (flip when multiplying by -1)")
print("=" * 68) constraints_ge = [ {"name": "min return", "coeffs": [0.06, 0.04, 0.08], "rhs": 0.05}, {"name": "max risk", "coeffs": [-0.02, -0.03, -0.01], "rhs": -0.025}, {"name": "budget", "coeffs": [1.0, 1.0, 1.0], "rhs": 1.0},
] rows = []
for c in constraints_ge: coeffs_neg = [-v for v in c["coeffs"]] rhs_neg = -c["rhs"] rows.append({ "constraint": c["name"], "original_form": f"[{', '.join(f'{v:.2f}' for v in c['coeffs'])}]·x >= {c['rhs']:.3f}", "standard_form": f"[{', '.join(f'{v:.2f}' for v in coeffs_neg)}]·x <= {rhs_neg:.3f}", "flip_applied": True, }) lp_df = pd.DataFrame(rows)
print(lp_df.to_string(index=False)) # Part 2: gradient descent sign analysis
print("\n\nGradient descent: update = theta - eta * grad")
print("grad < 0 → theta increases (positive step), grad > 0 → theta decreases (negative step)")
print("-" * 68) def quadratic_gradient(theta: float, mu: float = 3.0) -> float: """Gradient of f(theta) = (theta - mu)^2: f'(theta) = 2*(theta - mu).""" return 2 * (theta - mu) LEARNING_RATE = 0.1
MU = 3.0
theta_vals = np.array([0.5, 1.5, 2.5, 3.0, 3.5, 4.5, 5.5]) rows_gd = []
for theta in theta_vals: grad = quadratic_gradient(theta, MU) update = -LEARNING_RATE * grad # flip: negative gradient → positive update theta_new = theta + update rows_gd.append({ "theta": round(theta, 2), "gradient": round(grad, 4), "update": round(update, 4), "theta_new": round(theta_new, 4), "grad_sign": "negative (move right)" if grad < 0 else "positive (move left)" if grad > 0 else "zero (at min)", }) gd_df = pd.DataFrame(rows_gd)
print(gd_df.to_string(index=False))
print(f"\nConclusion: update = -eta * grad implements the flip rule.")
print(f" When grad < 0: update > 0 → theta increases (moves toward minimum at {MU})")
print(f" When grad > 0: update < 0 → theta decreases (moves toward minimum at {MU})")
```
#### Final Professional Example [R]
``` r
# Gradient descent: update = -eta * grad (flip when multiplying by negative) MU <- 3.0
eta <- 0.1
thetas <- c(0, 1, 2, 4, 5)
rows <- lapply(thetas, function(theta) { grad <- 2 * (theta - MU) update <- -eta * grad data.frame(theta = theta, grad = grad, update = update, direction = if (grad < 0) "increase" else "decrease")
})
gd_df <- do.call(rbind, rows)
cat("Gradient descent: update = -eta * grad\n")
print(gd_df)
cat("When grad < 0: update > 0 → theta increases toward minimum.\n")
```
---
1300 pag 22