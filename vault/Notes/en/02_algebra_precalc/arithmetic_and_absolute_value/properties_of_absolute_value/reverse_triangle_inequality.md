---
publish: true
date: '2026-04-16'
tags:
- algebra
---

# Reverse Triangle Inequality

$$
|a-b| \ge \bigl||a| - |b|\bigr|
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The reverse triangle inequality provides a lower bound on the distance between two numbers: $|a - b| \ge \bigl| |a| - |b| \bigr|$. While the (forward) triangle inequality says the sum $|a + b|$ is bounded above by $|a| + |b|$, the reverse version says the difference $|a - b|$ is bounded below by the absolute difference of the individual magnitudes. In DA/DS, this appears in distance analysis (the distance between two points is at least the difference between their distances from the origin), error bounding (an error in a subtraction cannot be made arbitrarily small just because both operands are large), and stability analysis (if two values have very different magnitudes, their difference cannot be tiny). The equality $|a - b| = \bigl| |a| - |b| \bigr|$ holds when $a$ and $b$ have the same sign and the larger one has magnitude at least as large as the smaller — informally, when there is no "crossing" of the origin between $a$ and $b$.

## Flowchart

```mermaid
flowchart TD
    A["Two real numbers: a, b"] --> B["Compute |a - b| (distance between them)"]
    A --> C["Compute |a| - |b| (difference of magnitudes)"]
    C --> D["Take ||a| - |b|| (unsigned difference of magnitudes)"]
    B --> E{"|a - b| ≥ ||a| - |b||?"}
    D --> E E -- "Yes (always)" --> F["Reverse triangle inequality holds"] E -- "No" --> G["Impossible for real numbers"]
    F --> H["Lower bound: distance between a,b ≥ gap in their magnitudes"]
    F --> I["Equality: a,b same sign AND max(|a|,|b|) ≥ min(|a|,|b|)"]
    F --> J["DA: if |a|≫|b|, then |a-b| ≈ |a| — subtraction by a small number changes magnitude little"]
    F --> K["DA: catastrophic cancellation opposite — when |a|≈|b|, |a-b| can be ≪ |a|"]
```

## Real-world use

### Where it is used

Metric space lower bounds: proving that the Euclidean distance between two points cannot be zero unless the points are identical. Numerical analysis: understanding catastrophic cancellation — when $a \approx b$, $|a - b|$ can be close to zero even though $|a|$ and $|b|$ are large, but the reverse inequality guarantees $|a - b| \ge \bigl| |a| - |b| \bigr|$, which is also near zero in that case (both terms are large and nearly equal). Signal processing: the minimum separation between two frequencies or two signal levels. Convergence proofs in optimization: bounding the minimum distance between iterates.

### Problem it solves

When you know the individual magnitudes $|a|$ and $|b|$, how small can $|a - b|$ be? The reverse triangle inequality answers: it cannot be smaller than $\bigl| |a| - |b| \bigr|$. If $|a| = 10$ and $|b| = 3$, then $|a - b| \ge |10 - 3| = 7$ — the distance between $a$ and $b$ is at least 7, regardless of their signs. Conversely if $|a| \approx |b|$, the lower bound is near zero and catastrophic cancellation is possible.

### How it solves the problem

The reverse inequality is derived from the forward triangle inequality applied twice. Starting from the triangle inequality: $|a| = |(a - b) + b| \le |a - b| + |b|$, which gives $|a - b| \ge |a| - |b|$. Symmetrically: $|b - a| \ge |b| - |a|$, and $|b - a| = |a - b|$. So $|a - b| \ge |b| - |a|$ as well. Combining: $|a - b| \ge \max(|a| - |b|,\, |b| - |a|) = \bigl| |a| - |b| \bigr|$.

### Example in a business

A DA checks whether two customer segments have meaningfully different average purchase values. Segment A has mean $\bar{x}_A = 85$ and segment B has $\bar{x}_B = 30$. The difference in means is $|\bar{x}_A - \bar{x}_B| = 55$. The reverse triangle inequality guarantees $|85 - 30| \ge \bigl| |85| - |30| \bigr| = |55| = 55$. Here we get equality (both values are positive), which confirms that the bound is tight. If the values were $\bar{x}_A = 85$ and $\bar{x}_B = -30$, the lower bound would be $\bigl||85| - |-30|\bigr| = |55| = 55$, but the actual distance is $|85 - (-30)| = 115 > 55$.

## The formula, piece by piece

Breaking the notation:

- $|a - b|$: the distance between $a$ and $b$ on the real line — always $\ge 0$.
- $|a|$: the magnitude of $a$ — distance from the origin.
- $|b|$: the magnitude of $b$ — distance from the origin.
- $|a| - |b|$: the signed difference of the two magnitudes — can be negative if $|b| > |a|$.
- $\bigl| |a| - |b| \bigr|$: the absolute difference of the magnitudes — always $\ge 0$.
- $\ge$: the reverse inequality — the left side (actual distance) is at least as large as the right side (magnitude difference). **Equality condition**: $|a - b| = \bigl| |a| - |b| \bigr|$ when $a$ and $b$ have the same sign and $|a - b| = ||a| - |b||$.

Concretely: when one value is between the other and the origin (or one is zero), so the "direct path" $a \to b$ doesn't cross zero. **Symmetric form**: $\bigl| |a| - |b| \bigr| = \bigl| |b| - |a| \bigr|$ — the lower bound is symmetric in $a$ and $b$. **In metric space notation**: for any metric $d$: $d(x,z) \ge |d(x,y) - d(y,z)|$. The reverse triangle inequality is a general metric space property.

## The formula in words

"The distance between two numbers is always at least the difference in their distances from zero. Even if you don't know where $a$ and $b$ are exactly, knowing their individual magnitudes gives you a floor on how far apart they must be. In Python: `abs(a - b) >= abs(abs(a) - abs(b))` is always `True`. This is useful for ruling out near-zero differences: if $|a| = 100$ and $|b| = 90$, the distance $|a - b|$ must be at least $|100 - 90| = 10$, never less."

## Critical Concepts

1. **Lower bound vs. upper bound**: the (forward) triangle inequality $|a + b| \le |a| + |b|$ is an upper bound on a sum. The reverse triangle inequality $|a - b| \ge ||a| - |b||$ is a lower bound on a difference. Together they bracket how large or small a sum/difference of absolute values can be.
2. **Catastrophic cancellation signal**: when $|a| \approx |b|$, the lower bound $||a| - |b||$ is near zero, warning that $|a - b|$ can be very small even though both operands are large. This is the mathematical root of catastrophic cancellation in floating-point arithmetic.
3. **Metric space generalization**: in any metric space, the reverse triangle inequality holds: $d(x, z) \ge |d(x, y) - d(y, z)|$. This means you cannot have a point $y$ that is much closer to $x$ than $z$, while $x$ and $z$ are far apart — the geometry has to be consistent.
4. **Tight vs. loose bound**: the bound is tight (equality) when $a$ and $b$ have the same sign and one is "between" the other and the origin. For opposite-sign values, the actual distance can significantly exceed the lower bound.
5. **Proof derivation via triangle inequality**: the reverse inequality is not a new axiom — it is derived from the forward triangle inequality in two lines (as shown in the "How it solves the problem" section).

Memorizing the derivation is more useful than memorizing the formula.

## Step-by-step calculation (tiny example)

Task: verify the reverse triangle inequality for $a = 8, b = -3$.

*Step 1: Compute $|a - b|$ (left side)*
$a - b = 8 - (-3) = 11$.
$|a - b| = 11$.

*Step 2: Compute $\bigl| |a| - |b| \bigr|$ (right side)*
$|a| = 8$, $|b| = 3$.
$|a| - |b| = 8 - 3 = 5$.
$\bigl| |a| - |b| \bigr| = |5| = 5$.

*Step 3: Check the inequality*
$11 \ge 5$. ✓ The inequality holds. The bound is not tight because $a$ and $b$ have opposite signs (they are on opposite sides of the origin).

*Step 4: Equality case*
$a = 8, b = 3$ (same sign): $|a - b| = |5| = 5$. $\bigl| |8| - |3| \bigr| = 5$. $5 \ge 5$. ✓ Equality.

*Step 5: Catastrophic cancellation scenario*
$a = 100.001, b = 100.000$: $|a - b| = 0.001$. $\bigl| |a| - |b| \bigr| = 0.001$. Equality — this is exactly the situation where the lower bound is nearly zero, and floating-point subtraction loses precision.

## Code examples

### Beginner example (Python)

```python
# Reverse triangle inequality: |a - b| >= ||a| - |b||
import math

# Basic verification across multiple cases
cases = [
    (8.0, -3.0),         # opposite signs — gap > lower bound
    (8.0, 3.0),          # same sign, large sep — equality expected
    (8.0, 5.0),          # same sign
    (-5.0, -9.0),        # both negative
    (100.001, 100.000),  # near-equality — catastrophic cancellation scenario
]
print(f"{'a':>10} {'b':>10} {'|a-b|':>10} {'||a|-|b||':>12} {'holds':>6} {'equal':>6}")
for a, b in cases:
    left = abs(a - b)
    right = abs(abs(a) - abs(b))
    holds = left >= right - 1e-12
    equal = math.isclose(left, right, rel_tol=1e-9)
    print(f"{a:>10.4f} {b:>10.4f} {left:>10.6f} {right:>12.6f} {str(holds):>6} {str(equal):>6}")

# Catastrophic cancellation: large values, tiny difference
a = 1_000_000.001
b = 1_000_000.000
diff = a - b
lower_bound = abs(abs(a) - abs(b))
print(f"\nCatastrophic cancellation example:")
print(f" a = {a} b = {b}")
print(f" |a - b| = {diff} (tiny)")
print(f" lower bound = {lower_bound} (also tiny — the bound is tight)")
print(f" Warning: float64 may lose precision here!")

# Random verification
import random

random.seed(42)
N_TESTS = 10_000
FLOAT_TOL = 1e-10
violations = 0
for _ in range(N_TESTS):
    a = random.uniform(-100, 100)
    b = random.uniform(-100, 100)
    if abs(a - b) < abs(abs(a) - abs(b)) - FLOAT_TOL:
        violations += 1
print(f"\nRandom test: {N_TESTS} pairs — violations: {violations}")
```

### Beginner example (R)

```r
# Reverse triangle inequality: |a-b| >= ||a|-|b||
# Verification table
cases <- list(c(8, -3), c(8, 3), c(8, 5), c(-5, -9), c(100.001, 100.000))
cat(sprintf("%-10s %-10s %-10s %-12s %-6s\n", "a", "b", "|a-b|", "||a|-|b||", "holds"))
for (p in cases) {
  a <- p[1]; b <- p[2]
  left <- abs(a - b)
  right <- abs(abs(a) - abs(b))
  holds <- left >= right - 1e-12
  cat(sprintf("%-10.4f %-10.4f %-10.6f %-12.6f %-6s\n", a, b, left, right, holds))
}

# Catastrophic cancellation check
a <- 1000000.001; b <- 1000000.000
cat(sprintf("\nCatastrophic cancellation:\n"))
cat(sprintf(" |a - b| = %e lower bound = %e\n", abs(a - b), abs(abs(a) - abs(b))))

# Random verification
set.seed(42)
N_TESTS <- 10000
a_vals <- runif(N_TESTS, -100, 100)
b_vals <- runif(N_TESTS, -100, 100)
violations <- sum(abs(a_vals - b_vals) < abs(abs(a_vals) - abs(b_vals)) - 1e-10)
cat(sprintf("\nRandom test: %d pairs — violations: %d\n", N_TESTS, violations))
```

### Professional example (Python)

```python
import numpy as np
import pandas as pd

# Scenario: segment distance analysis using the reverse triangle inequality
# Verify that pairwise absolute differences between segment means are always
# at least the absolute difference of their magnitudes (lower bound check)
# Also flag potential catastrophic cancellation: cases where means are nearly equal
np.random.seed(42)
N_SEGMENTS = 8
CANCEL_TOL = 0.05   # flag if ||a| - |b|| / |a - b| > 1 - CANCEL_TOL (nearly tight bound)
segment_means = np.array([-85.0, -30.0, -5.0, 0.0, 8.0, 20.0, 75.0, 120.0])
segment_names = [f"seg_{i+1}" for i in range(N_SEGMENTS)]


def reverse_triangle_check(
    values: np.ndarray,
    names: list[str],
) -> pd.DataFrame:
    """
    For all pairs, verify: |a - b| >= ||a| - |b|| (reverse triangle inequality).

    Args:
        values: 1-D array of real values to compare pairwise.
        names: Labels for each value.

    Returns:
        DataFrame with pair labels, |a-b|, lower bound, holds flag, and tightness ratio.
    """
    rows = []
    n = len(values)
    for i in range(n):
        for j in range(i + 1, n):
            a, b = values[i], values[j]
            dist = abs(a - b)
            lb = abs(abs(a) - abs(b))
            holds = dist >= lb - 1e-12
            tightness = lb / dist if dist > 0 else 1.0   # lb/dist → 1 means tight
            rows.append({
                "pair": f"{names[i]} vs {names[j]}",
                "a": a,
                "b": b,
                "|a-b|": dist,
                "lower_bound": lb,
                "holds": holds,
                "tightness": tightness,
                "near_cancel": tightness > 1 - CANCEL_TOL,
            })
    return pd.DataFrame(rows)


report = reverse_triangle_check(segment_means, segment_names)
print("Reverse Triangle Inequality: |a - b| >= ||a| - |b||")
print("=" * 72)
print(report[["pair", "|a-b|", "lower_bound", "holds", "tightness"]].round(4).to_string(index=False))
violations = (~report["holds"]).sum()
near_cancels = report["near_cancel"].sum()
print(f"\nViolations: {violations}")
print(f"Near-tight pairs: {near_cancels} (tightness > {1 - CANCEL_TOL:.2f} — cancellation risk)")
print(report[report["near_cancel"]][["pair", "|a-b|", "lower_bound", "tightness"]].to_string(index=False))
```

### Professional example (R)

```r
# Reverse triangle inequality: |a - b| >= ||a| - |b||
segment_means <- c(-12.5, 8.3, -4.1, 15.0, -2.0)
segment_names <- paste0("seg_", LETTERS[1:5])
CANCEL_TOL <- 0.05
rows <- list()
for (i in 1:(length(segment_means)-1)) {
  for (j in (i+1):length(segment_means)) {
    a <- segment_means[i]; b <- segment_means[j]
    dist <- abs(a - b)
    lb <- abs(abs(a) - abs(b))
    tightness <- if (dist > 0) lb / dist else 1
    rows[[length(rows)+1]] <- data.frame(
      pair = paste(segment_names[i], "vs", segment_names[j]),
      dist = dist,
      lower_bound = lb,
      holds = dist >= lb - 1e-12,
      tightness = tightness,
      near_cancel = tightness > 1 - CANCEL_TOL
    )
  }
}
report <- do.call(rbind, rows)
cat("Reverse Triangle Inequality: |a - b| >= ||a| - |b||\n")
print(report)
```

---

*Source: 1300 p. 22*
