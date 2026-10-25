---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Absolute value

## Deep Breakdown

What it tells me *(Situation Awareness)*:
Absolute value tells you **how far a number is from zero** on the number line, completely ignoring direction. It strips the sign away. In DA/DS, you reach for this symbol every time you care about magnitude, not direction: measuring forecast errors, computing distances between data points, checking how far a metric drifted from a target, and calculating MAE (Mean Absolute Error). Whenever a negative and a positive error of the same size should be treated identically, absolute value is the tool.

## Flowchart

```mermaid
flowchart TD
    A["Input: x"] --> B{"Is x >= 0?"} B -- "Yes" --> C["Output: x (keep as-is)"] B -- "No" --> D["Output: -x (flip the sign)"]
    C --> E["Result is always >= 0"]
    D --> E
```

## Real-world use

### Where it is used

When you need to measure the size of a discrepancy or distance without caring whether it is above or below a reference point. Sales forecasting, budget variance tracking, model error evaluation, signal deviation detection.

### Problem it solves

A sales model predicts 100 units. The actual is 120. Error = 120 - 100 = +20. Another row: predicted 120, actual 100. Error = 100 - 120 = -20. Both errors have the same severity, but opposite signs. If you average +20 and -20 directly you get 0, which is wrong. You need a way to measure "how wrong" without errors canceling each other out.

### How it solves the problem

Absolute value forces both errors to be positive: |+20| = 20, |-20| = 20. Now averaging gives 20, which correctly reflects the model's average miss magnitude.

### Example in a business

Computing **Mean Absolute Error (MAE)** for a weekly sales forecast model. You take every (predicted - actual) difference, apply absolute value to each, then average them. The result is your average miss in units. Stakeholders understand "we are off by 20 units on average" far better than a technical loss function value.

## The formula, piece by piece

Breaking the notation piece by piece:

- $|$ and $|$ (the two vertical bars): the "absolute value brackets." Whatever is inside gets its sign stripped.
- $x$: any real number. Can be positive, negative, or zero.
- $\geq$: greater than or equal to.

Full piecewise definition:

$$
|x| = \begin{cases} x & \text{if } x \geq 0 \\ -x & \text{if } x < 0 \end{cases}
$$

Two properties worth memorizing:
- $|x| \geq 0$ for all $x$ (result is always non-negative)
- $|x| = |-x|$ (symmetric: distance from -5 to zero equals distance from +5 to zero)

## The formula in words

"If x is zero or positive, return x unchanged. If x is negative, flip its sign by multiplying by -1, which makes it positive. The result is always the distance from x to the origin." Manual check: $x = -7$. Since $-7 < 0$, apply $-x = -(-7) = 7$. Result: $|-7| = 7$.

## Critical Concepts

1. **Distance from zero**: $|x|$ is the distance between $x$ and $0$ on the real number line. Distance is always non-negative.
2. **Symmetry**: $|-x| = |x|$. The value $-5$ and $+5$ are the same distance from $0$.
3. **Triangle inequality**: $|a + b| \leq |a| + |b|$. The distance of a sum is at most the sum of individual distances. This is used in proofs and in understanding why MAE behaves the way it does.
4. **Composition with square root**: $|x| = \sqrt{x^2}$. Alternative definition, useful in formulas and proofs.
5. **Comparison to squaring**: Both $|x|$ and $x^2$ remove sign, but $x^2$ also amplifies large errors.

This is why MAE and MSE behave differently.

## Step-by-step calculation (tiny example)

Input: $x = -7$

*Step 1: Identify the sign of x*  $x = -7$. Is $-7 \geq 0$? No.
So we use the second branch: output is $-x$.

*Step 2: Apply the rule* $-x = -(-7) = 7$.
Multiplying a negative by $-1$ gives a positive.

*Step 3: Verify the result*$|-7| = 7$.

Check: Is $7 \geq 0$?
Yes.

Is $7$ the distance from $-7$ to $0$ on the number line?
Count: $-7, -6, -5, -4, -3, -2, -1, 0$.  That is 7 steps.
Confirmed.

Bonus: $|+7| = 7$
because $7 \geq 0$,
so output is $x$ itself.

Same result: both $-7$ and $+7$ are 7 units from zero.

## Code examples

### Beginner example (Python)

```python
# abs() is Python's built-in absolute value function
x = -7
result = abs(x)
print(result)   # 7 # Works on floats too
print(abs(-3.14))   # 3.14 # Works on a list via list comprehension
errors = [20, -15, -8, 12]
absolute_errors = [abs(e) for e in errors]
print(absolute_errors)   # [20, 15, 8, 12]
```

### Beginner example (R)

```r
# abs() is R's built-in absolute value function
x <- -7
result <- abs(x)
print(result)  # 7 # Works on a vector automatically (vectorized)
errors <- c(20, -15, -8, 12)
absolute_errors <- abs(errors)
print(absolute_errors)  # 20 15 8 12
```

### Professional example (Python)

```python
import numpy as np
import pandas as pd   # Computing Mean Absolute Error (MAE) for a sales forecast
y_true = np.array([120, 90, 75, 200, 55])
y_pred = np.array([100, 95, 80, 185, 60])   # Step 1: compute raw errors (signed)
raw_errors = y_true - y_pred   # [ 20, -5, -5, 15, -5] # Step 2: apply absolute value to remove sign
absolute_errors = np.abs(raw_errors)   # [20, 5, 5, 15, 5] # Step 3: compute MAE
mae = np.mean(absolute_errors)   # 10.0
print(f"Raw errors: {raw_errors}")
print(f"Absolute errors: {absolute_errors}")
print(f"Mean Absolute Error (MAE): {mae:.2f} units")   # In a DataFrame context (more realistic)
df = pd.DataFrame({"actual": y_true, "predicted": y_pred})
df["abs_error"] = np.abs(df["actual"] - df["predicted"])
print(df)
print(f"\nMAE from DataFrame: {df['abs_error'].mean():.2f}")
```

### Professional example (R)

```r
# Computing Mean Absolute Error (MAE) for a sales forecast
y_true <- c(120, 90, 75, 200, 55)
y_pred <- c(100, 95, 80, 185, 60)  # Step 1: compute raw errors (signed)
raw_errors <- y_true - y_pred  # Step 2: apply absolute value to remove sign
absolute_errors <- abs(raw_errors)  # Step 3: compute MAE
mae <- mean(absolute_errors)
cat("Raw errors: ", raw_errors, "\n")
cat("Absolute errors: ", absolute_errors, "\n")
cat(sprintf("Mean Absolute Error (MAE): %.2f units\n", mae))  # In a data.frame context (more realistic)
df <- data.frame(actual = y_true, predicted = y_pred)
df$abs_error <- abs(df$actual - df$predicted)
print(df)
cat(sprintf("\nMAE from data.frame: %.2f\n", mean(df$abs_error)))
```

---

*Source: 1300 p. 22*
