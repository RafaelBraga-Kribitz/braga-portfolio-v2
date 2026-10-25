---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Summation

$$
\sum_{i=1}^n x_i = x_1 + x_2 + \dots + x_n
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
$\sum_{i=1}^{n} x_i$ is the **summation notation** (capital sigma notation): a compact way to write "add all these terms together." It is one of the most frequently used symbols in statistics, ML, and data analysis. Every average, every loss function, every error metric you will ever compute involves $\sum$. It is the mathematical skeleton behind `sum()`, `np.sum()`, `mean()`, `np.dot()`, and almost every aggregation operation in data work.

## Flowchart

```mermaid
flowchart TD
    A["Summation: sum from i=1 to n of x_i"] --> B["Initialize accumulator = 0 (additive identity)"]
    B --> C["Set i = 1"]
    C --> D["Add x_i to accumulator"]
    D --> E{"i == n?"} E -- "No" --> F["i = i + 1"]
    F --> D E -- "Yes" --> G["Return accumulator = x_1 + x_2 + ... + x_n"]
```

## Real-world use

### Where it is used

Every metric in statistics and ML: mean ($\bar{x} = \frac{1}{n}\sum x_i$), variance ($\sigma^2 = \frac{1}{n}\sum(x_i - \bar{x})^2$), MSE ($\frac{1}{n}\sum(y_i - \hat{y}_i)^2$), MAE ($\frac{1}{n}\sum|y_i - \hat{y}_i|$), cross-entropy loss ($-\sum y_i \ln \hat{y}_i$), and dot products ($\mathbf{u} \cdot \mathbf{v} = \sum_i u_i v_i$).

### Problem it solves

When you have $n$ numbers and want to add them all, writing $x_1 + x_2 + x_3 + \cdots + x_n$ for $n = 10{,}000$ is impractical. $\sum_{i=1}^{n} x_i$ encodes the entire addition in one compact expression that works for any $n$.

### How it solves the problem

The sigma notation specifies the start index, end index, and the formula to evaluate at each step. It maps directly to a `for` loop in code: initialize an accumulator to 0, add each term, return the final total.

### Example in a business

The mean absolute error (MAE) is: $\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|$. In a report for a 10,000-row test set, this notation tells a reader: "sum the absolute errors for all 10,000 observations, then divide by 10,000." The $\sum$ compresses 10,000 explicit additions into one symbol.

## The formula, piece by piece

Breaking the notation:

- $\sum$: uppercase Greek letter Sigma. Stands for "Sum" (S in Greek). The "adding" counterpart of $\prod$ (product).
- $i = 1$: the index $i$ starts at 1 (lower limit, written below $\sum$). The index variable is a dummy: you could use $j$, $k$, or any letter.
- $n$: the index $i$ runs up to and including $n$ (upper limit, written above $\sum$).
- $x_i$: the expression evaluated at each value of $i$ (the "summand"). Full expansion: $\sum_{i=1}^{n} x_i = x_1 + x_2 + x_3 + \cdots + x_n$ Special cases:
- $\sum_{i=1}^{0}$ (empty sum) $= 0$ by convention (additive identity).
- $\sum_{i=1}^{n} c = c \cdot n$ (a constant summed $n$ times equals $n \times c$).
- $\sum_{i=1}^{n} (ax_i + by_i) = a\sum_{i=1}^{n} x_i + b\sum_{i=1}^{n} y_i$ (linearity of summation).

## The formula in words

"$\sum_{i=1}^{n} x_i$ means: let $i$ take values 1, 2, 3, ..., up to $n$. For each value of $i$, compute $x_i$. Then add all those computed values together." Spoken: "sum of $x_i$ for $i$ from 1 to $n$", or "sum over all $i$ of $x_i$." The formula inside can be anything: $\sum_{i=1}^{n} i = 1 + 2 + \cdots + n = \frac{n(n+1)}{2}$ (Gauss's formula). $\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}$.

## Critical Concepts

1. **Index is a dummy variable**: $\sum_{i=1}^{n} x_i = \sum_{j=1}^{n} x_j = \sum_{k=1}^{n} x_k$. The letter used does not matter; only the range and formula matter.
2. **Linearity**: $\sum(a x_i + b) = a \sum x_i + nb$. You can pull constants out. This is constantly used to simplify formulas.
3. **Double summation**: $\sum_{i=1}^{m} \sum_{j=1}^{n} a_{ij}$ iterates over all pairs $(i, j)$. This is what happens in matrix operations.
4. **Mean formula**: $\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$. Every use of mean in statistics is this formula.
5. **Vectorized code**: `np.sum(x)` or `sum(x)` in Python, `sum(x)` in R, implement $\sum$ directly.

For large arrays, vectorized operations are orders of magnitude faster than Python loops.

## Step-by-step calculation (tiny example)

Input: $\{x_i\} = \{3, 7, 2, 8, 5\}$. Compute $\sum_{i=1}^{5} x_i$ and $\bar{x}$.

*Step 1: List the terms and add them sequentially*
$x_1 = 3$: running total = 3
$x_2 = 7$: running total = 3 + 7 = 10
$x_3 = 2$: running total = 10 + 2 = 12
$x_4 = 8$: running total = 12 + 8 = 20
$x_5 = 5$: running total = 20 + 5 = 25

*Step 2: Record the sum*
$\sum_{i=1}^{5} x_i = 25$

*Step 3: Compute the mean*
$\bar{x} = \frac{\sum x_i}{n} = \frac{25}{5} = 5$

## Code examples

### Beginner example (Python)

```python
# Summation using Python
x = [3, 7, 2, 8, 5]

# Method 1: built-in sum()
total = sum(x)
print(f"Sum: {total}")   # 25

# Method 2: explicit loop (shows the sigma logic)
total_loop = 0   # initialize accumulator to 0 (additive identity)
for xi in x:
    total_loop += xi
print(f"Sum (loop): {total_loop}")   # 25

# Mean
n = len(x)
mean = sum(x) / n
print(f"Mean: {mean}")   # 5.0

# Variance: sum((x_i - mean)^2) / n
variance = sum((xi - mean)**2 for xi in x) / n
print(f"Variance: {variance}")   # 5.2
```

### Beginner example (R)

```r
x <- c(3, 7, 2, 8, 5)  # sum() is base R
total <- sum(x)
print(total)  # 25

# Mean
mean_val <- sum(x) / length(x)
print(mean_val)  # 5 (same as mean(x))

# Variance using summation
n <- length(x)
variance <- sum((x - mean_val)^2) / n  # vectorized: R subtracts mean from all elements
print(variance)  # 5.2 (population variance)
```

### Professional example (Python)

```python
import numpy as np

# Scenario: compute multiple regression metrics from scratch using summation notation
# Demonstrates how every metric is a specific use of sum
y_true = np.array([120.0, 90.0, 75.0, 200.0, 55.0, 140.0, 95.0, 180.0])
y_pred = np.array([110.0, 95.0, 70.0, 190.0, 60.0, 135.0, 100.0, 185.0])
n = len(y_true)

# Mean: (1/n) * sum(y_i)
mean_true = (1/n) * np.sum(y_true)

# MAE: (1/n) * sum(|y_i - y_hat_i|)
mae = (1/n) * np.sum(np.abs(y_true - y_pred))

# MSE: (1/n) * sum((y_i - y_hat_i)^2)
mse = (1/n) * np.sum((y_true - y_pred)**2)

# RMSE: sqrt(MSE)
rmse = np.sqrt(mse)

# R-squared: 1 - sum((y_i - y_hat_i)^2) / sum((y_i - mean_true)^2)
ss_residual = np.sum((y_true - y_pred)**2)
ss_total = np.sum((y_true - mean_true)**2)
r_squared = 1 - (ss_residual / ss_total)
print(f"MAE: {mae:.4f}")
print(f"MSE: {mse:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"R-squared: {r_squared:.4f}")
print("\nEvery metric above is a specific form of summation (sigma notation).")
```

### Professional example (R)

```r
# Regression metrics from scratch using summation (sigma)
y_true <- c(120, 90, 75, 200, 55, 140, 95, 180)
y_pred <- c(110, 95, 70, 190, 60, 135, 100, 185)
n <- length(y_true)
mean_true <- (1/n) * sum(y_true)
mae <- (1/n) * sum(abs(y_true - y_pred))
mse <- (1/n) * sum((y_true - y_pred)^2)
rmse <- sqrt(mse)
ss_residual <- sum((y_true - y_pred)^2)
ss_total <- sum((y_true - mean_true)^2)
r_squared <- 1 - (ss_residual / ss_total)
cat(sprintf("MAE: %.4f\n", mae))
cat(sprintf("MSE: %.4f\n", mse))
cat(sprintf("RMSE: %.4f\n", rmse))
cat(sprintf("R-squared: %.4f\n", r_squared))
cat("\nEvery metric above is a specific form of summation (sigma notation).\n")
```

---

*Source: AIO p. 44 of 286*
