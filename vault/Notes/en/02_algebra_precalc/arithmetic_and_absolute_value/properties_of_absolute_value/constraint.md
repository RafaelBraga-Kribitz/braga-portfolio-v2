---
publish: true
date: '2026-04-16'
tags:
- algebra
---

# Constraint

$$
|a| \ge 0
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The constraint $|a| \ge 0$ is the non-negativity property of absolute value: the absolute value of any real number is always greater than or equal to zero, with equality only when $a = 0$. This sounds obvious, but it is the foundational property that makes absolute value useful as a measure of magnitude, a distance function, and a component of loss functions. In DA/DS: every error metric built on absolute value — MAE (Mean Absolute Error), MAPE, L1 loss, L1 regularization — derives its meaning from this property. If $|a|$ could be negative, "average absolute error" could cancel to zero even when predictions are wrong. Non-negativity guarantees that absolute errors cannot offset each other, forcing the model to account for every individual deviation. It also guarantees that $|a| = 0 \iff a = 0$, so a zero absolute value uniquely identifies a zero input — exact equality in disguise.

## Flowchart

```mermaid
flowchart TD
    A["Any real number: a"] --> B["Compute |a|"]
    B --> C{"|a| = 0?"} C -- "Yes" --> D["a must be exactly 0"] C -- "No" --> E["|a| > 0 (strictly positive)"]
    D --> F["Only way to get zero absolute value"]
    E --> G["|a| = a if a > 0"]
    E --> H["|a| = -a if a < 0 (negate to make positive)"]
    F --> I["DA: loss = 0 implies predictions are perfect (all residuals zero)"]
    E --> J["DA: MAE, MAPE, L1 loss — non-negativity prevents error cancellation"]
    B --> K["Metric space: non-negativity is required axiom for d(x,y) >= 0"]
```

## Real-world use

### Where it is used

Every loss function and error metric built on absolute deviations: MAE = $\frac{1}{n}\sum_i |y_i - \hat{y}_i|$ — each term is $\ge 0$, so the sum and average are $\ge 0$. L1 regularization: $\lambda \sum_j |\theta_j|$ — each term contributes a non-negative penalty. Checking for exact equality: $|a - b| = 0 \iff a = b$, used instead of `a == b` for floats. Metric space definition: the first axiom for any distance function $d(x, y)$ is $d(x, y) \ge 0$, guaranteed by the absolute value structure. Validating computation outputs: asserting that a distance or error metric is non-negative after computation is a sanity check for bugs.

### Problem it solves

Without non-negativity, positive and negative errors would cancel in a sum: a prediction of $+10$ above the true value and a prediction of $-10$ below would give a total error of $0$, falsely suggesting a perfect model. The absolute value removes the sign and forces every deviation to count as a positive contribution, making the sum a true measure of total error magnitude.

### How it solves the problem

The definition of absolute value directly enforces non-negativity: $|a| = a$ if $a \ge 0$, and $|a| = -a$ if $a < 0$. In both cases, the output is non-negative. The $-a$ case is key: negating a negative number produces a positive result, e.g., $|-5| = -(-5) = 5$. The only input that produces zero is $a = 0$ itself, because $|0| = 0$ and for all $a \ne 0$, $|a| > 0$.

### Example in a business

A forecasting model produces daily predictions. The analyst computes residuals $e_i = y_i - \hat{y}_i$. Some residuals are positive (under-forecast) and some are negative (over-forecast). The sum $\sum e_i \approx 0$ could suggest an unbiased model — but this hides the actual error magnitude. Using $\sum |e_i|$ (total absolute error) or $\frac{1}{n}\sum |e_i|$ (MAE) avoids the cancellation. The non-negativity property $|e_i| \ge 0$ for all $i$ guarantees MAE $\ge 0$, with MAE $= 0$ only if every prediction is perfect.

## The formula, piece by piece

Breaking the notation:

- $|a|$: the absolute value of $a$ — the magnitude of $a$, stripped of its sign.
- $\ge$: greater than or equal to.
- $0$: zero — the only value for which $|a| = 0$. **Two-case definition** (which produces non-negativity):

$$
|a| = \begin{cases} a & \text{if } a \ge 0 \\ -a & \text{if } a < 0 \end{cases}
$$

In both cases, the output is $\ge 0$. **Equality condition**: $|a| = 0 \iff a = 0$. This is not just $\ge 0$; the only way to achieve zero is to have $a = 0$. **Strict positivity**: $|a| > 0 \iff a \ne 0$. **Connection to squared form**: $|a| = \sqrt{a^2}$ — the square root of a square is always non-negative, giving an alternative proof of non-negativity.

## The formula in words

"The absolute value of any number is always zero or positive. You can never get a negative absolute value. The only number whose absolute value is zero is zero itself. In Python: `abs(a) >= 0` is always `True`, and `abs(a) == 0` is `True` only when `a == 0`. This property is what makes error metrics like MAE meaningful: every individual error contributes a non-negative amount, so a zero sum means zero individual errors."

## Critical Concepts

1. **No cancellation in absolute sums**: $\sum_i |e_i| = 0 \iff$ every $|e_i| = 0 \iff$ every $e_i = 0$. Non-negativity prevents negative terms from canceling positive ones. This is why MAE is a more reliable measure of actual error than mean error (which can be zero for a biased-but-symmetric model).
2. **Zero absolute value uniquely identifies zero**: $|a| = 0 \iff a = 0$. This is used everywhere in mathematical proofs and in code: `abs(a - b) == 0` means `a == b` exactly (for exact arithmetic); `abs(a - b) < tol` is the float-safe analog.
3. **L1 vs. L2 non-negativity**: both $|a|$ (L1) and $a^2$ (L2/squared error) are non-negative. The key difference is behavior near zero: L1 has a constant gradient ($\pm 1$) regardless of magnitude; L2 has a gradient proportional to the error. MAE (L1-based) is robust to outliers; MSE (L2-based) penalizes large errors more heavily.
4. **Metric axiom**: any valid distance function $d$ requires $d(x, y) \ge 0$. Absolute value distance $d(x, y) = |x - y|$ trivially satisfies this. Custom distance functions must be checked to ensure they never return negative values.
5. **Non-negativity in regularization**: L1 regularization adds $\lambda \sum_j |\theta_j|$ to the loss.

Since each $|\theta_j| \ge 0$, the regularization term is always $\ge 0$, and the total penalized loss is always $\ge$ the unpenalized loss. There is no way for the penalty to accidentally improve the loss.

## Step-by-step calculation (tiny example)

Task: demonstrate that $\sum |e_i| = 0$ implies all $e_i = 0$, and compute MAE for a tiny set of residuals. Residuals: $e = [3, -5, 2, 0, -1]$.

*Step 1: Compute absolute values*
$|3| = 3$, $|-5| = 5$, $|2| = 2$, $|0| = 0$, $|-1| = 1$.

*Step 2: Check non-negativity*
All values $\ge 0$: $3, 5, 2, 0, 1$.

*Step 3: Compare sum vs. absolute sum*
Sum of residuals: $3 + (-5) + 2 + 0 + (-1) = -1$. (Not zero — biased model.)
Sum of absolute residuals: $3 + 5 + 2 + 0 + 1 = 11$.

*Step 4: Compute MAE*
MAE $= \frac{11}{5} = 2.2$.

*Step 5: Confirm non-negativity of MAE*
MAE $= 2.2 \ge 0$. If all residuals were zero: MAE $= 0$.

## Code examples

### Beginner example (Python)

```python
# Non-negativity property of absolute value: |a| >= 0
import math

# Basic verification
test_values = [-100.0, -1.5, -0.001, 0.0, 0.001, 1.5, 100.0]
print("Verifying |a| >= 0:")
print(f"{'a':>10} {'|a|':>10} {'|a|>=0':>8}")
for a in test_values:
    print(f"{a:>10.4f} {abs(a):>10.4f} {str(abs(a) >= 0):>8}")

# |a| = 0 iff a = 0
print("\n|a| = 0 iff a = 0:")
for a in [-3.0, 0.0, 1.5]:
    print(f" |{a}| = {abs(a)} → a is zero: {a == 0}")

# MAE demonstration: absolute value prevents error cancellation
predictions = [10.0, 22.0, 15.0, 8.0, 30.0]
actuals = [7.0, 27.0, 13.0, 8.0, 29.0]
residuals = [a - p for p, a in zip(predictions, actuals)]
abs_errors = [abs(e) for e in residuals]
mean_error = sum(residuals) / len(residuals)
mae = sum(abs_errors) / len(abs_errors)
print(f"\nResiduals: {residuals}")
print(f"Absolute errors:{abs_errors}")
print(f"Mean error (can cancel): {mean_error:.2f}")
print(f"MAE (no cancellation): {mae:.2f}")
print(f"MAE >= 0: {mae >= 0}")
print(f"All |e_i| >= 0: {all(e >= 0 for e in abs_errors)}")
```

### Beginner example (R)

```r
# Non-negativity of absolute value: |a| >= 0
# Basic verification
test_values <- c(-100, -1.5, -0.001, 0, 0.001, 1.5, 100)
cat("Verifying |a| >= 0:\n")
for (a in test_values) {
  cat(sprintf(" a=%8.4f |a|=%8.4f |a|>=0: %s\n", a, abs(a), abs(a) >= 0))
}

# |a| = 0 iff a = 0
cat("\n|a| = 0 iff a = 0:\n")
for (a in c(-3, 0, 1.5)) {
  cat(sprintf(" |%.1f| = %.1f → a is zero: %s\n", a, abs(a), a == 0))
}

# MAE: absolute value prevents cancellation
predictions <- c(10, 22, 15, 8, 30)
actuals <- c(7, 27, 13, 8, 29)
residuals <- actuals - predictions
abs_errors <- abs(residuals)
mean_error <- mean(residuals)
mae <- mean(abs_errors)
cat(sprintf("\nMean error (can cancel): %.2f\n", mean_error))
cat(sprintf("MAE (no cancellation): %.2f\n", mae))
cat(sprintf("MAE >= 0: %s\n", mae >= 0))
cat(sprintf("All |e_i| >= 0: %s\n", all(abs_errors >= 0)))
```

### Professional example (Python)

```python
import pandas as pd
import numpy as np

# Scenario: forecast evaluation comparing mean error vs. MAE
# Demonstrates why |e_i| >= 0 matters: mean error (signed) can mask a biased model
# MAE (non-negative by construction) always reflects true error magnitude
np.random.seed(42)
N_PERIODS = 60

# Simulate actuals and a biased but partially-canceling forecast
actuals = np.random.normal(1000, 80, N_PERIODS)
predictions = actuals + np.random.normal(5, 50, N_PERIODS)  # slight positive bias


def compute_error_metrics(actuals: np.ndarray, predictions: np.ndarray) -> dict:
    """Compute signed and absolute forecast error metrics.

    Args:
        actuals: Array of actual observed values.
        predictions: Array of forecasted values.

    Returns:
        Dictionary with ME, MAE, RMSE, and non-negativity assertions.
    """
    residuals = actuals - predictions
    abs_errors = np.abs(residuals)
    # |e_i| >= 0 for all i
    assert (abs_errors >= 0).all(), "Absolute errors must be non-negative — computation error."
    return {
        "n": len(residuals),
        "mean_error": float(residuals.mean()),         # can cancel — misleading
        "mae": float(abs_errors.mean()),               # cannot cancel — always >= 0
        "rmse": float(np.sqrt((residuals**2).mean())),
        "max_abs_error": float(abs_errors.max()),
        "min_abs_error": float(abs_errors.min()),      # always >= 0
        "mae_is_nonneg": float(abs_errors.mean()) >= 0,
        "all_nonneg": bool((abs_errors >= 0).all()),
    }


metrics = compute_error_metrics(actuals, predictions)
print("Forecast Error Report: Non-Negativity of |e_i|")
print("=" * 72)
for key, value in metrics.items():
    print(f" {key:<20}: {value}")
print(
    f"\nNote: ME = {metrics['mean_error']:.2f} (close to zero, suggests unbiased),"
    f" but MAE = {metrics['mae']:.2f} (actual average error magnitude)."
)
```

### Professional example (R)

```r
# Forecast error: non-negativity of |e_i|
set.seed(42)
N_PERIODS <- 60
actuals <- rnorm(N_PERIODS, 1000, 80)
predictions <- actuals + rnorm(N_PERIODS, 5, 50)
residuals <- actuals - predictions
abs_errors <- abs(residuals)
metrics <- list(
  n = length(residuals),
  mean_error = mean(residuals),
  mae = mean(abs_errors),
  rmse = sqrt(mean(residuals^2)),
  max_abs_error = max(abs_errors),
  min_abs_error = min(abs_errors),
  all_nonneg = all(abs_errors >= 0)
)
cat("Forecast Error Report: Non-Negativity of |e_i|\n")
for (nm in names(metrics))
  cat(sprintf(" %-20s: %s\n", nm, metrics[[nm]]))
cat(sprintf("\nNote: ME = %.2f; MAE = %.2f (average error magnitude).\n", metrics$mean_error, metrics$mae))
```

---

*Source: MRAF*
