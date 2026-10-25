---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Distributive Law

$$
a(b + c) = ab + ac
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The **distributive law** (also called the distributive property of multiplication over addition) says that multiplying a sum by a factor is equivalent to multiplying each addend separately and then summing. This is one of the most used algebraic identities in practice. In DA/DS, it is the foundation of: expanding polynomial features, distributing a scalar across a feature vector, the matrix-vector product (each output row is a dot product = distribution of matrix rows), gradient computation via chain rule, and SQL expression rewriting.

## Flowchart

```mermaid
flowchart TD
    A["Expression: a × (b + c)"] --> B["Option 1: add first, then multiply"]
    A --> C["Option 2: distribute multiplication"]
    B --> D["Compute b+c, then multiply by a"]
    C --> E["Compute a×b and a×c separately"]
    D --> F{["Same result?"]}
    E --> F F -- "Yes: distributive law confirmed" --> G["a(b+c) = ab + ac"]
    G --> H["Extends to: a(b+c+d+...) = ab + ac + ad + ..."]
```

## Real-world use

### Where it is used

Expanding polynomial features ($x(x+1) = x^2 + x$), matrix-vector multiplication (each output element is a distributed dot product), batch normalization (scale and shift: $\gamma(x + \epsilon) = \gamma x + \gamma \epsilon$), SQL query rewriting (`price * (quantity + discount)` = `price*quantity + price*discount`), and factor model decompositions in finance.

### Problem it solves

When you compute $\hat{y} = \mathbf{w}^T \mathbf{x} = w_1 x_1 + w_2 x_2 + \cdots + w_p x_p$, you are distributing the dot product across all features. The linear model's prediction is literally the distributive law applied $p$ times: multiplying a vector of weights $\mathbf{w}$ distributes across the feature vector $\mathbf{x}$.

### How it solves the problem

$a(b + c) = ab + ac$ generalizes to $\mathbf{w}^T \mathbf{x} = \sum_i w_i x_i$: the "scalar $a$" becomes each weight $w_i$ and "$(b + c)$" is summed over features. Each weight distributes multiplicatively to its corresponding feature. This also shows why feature scaling is multiplicative: if you multiply feature $x_j$ by a constant $k$, the contribution to $\hat{y}$ becomes $w_j (k x_j) = (k w_j) x_j$.

### Example in a business

Revenue calculation: `revenue = price × (units_sold + bonus_units)`. By distribution: `revenue = price × units_sold + price × bonus_units`. Both formulas give the same result. In SQL: `SELECT price * (units + bonus) AS revenue` and `SELECT price * units + price * bonus AS revenue` are equivalent. Distributivity lets you choose whichever form is more readable or computationally efficient.

## The formula, piece by piece

Breaking the notation:

- $a$: the factor being distributed.
- $(b + c)$: the sum of two addends.
- $a(b + c)$: $a$ multiplied by the entire sum.
- $= ab + ac$: equivalently, $a$ multiplied by each addend separately, then the products summed.

Full bidirectional forms:
- Left distribution: $a(b + c) = ab + ac$.
- Right distribution: $(b + c)a = ba + ca$.
- Distribution over subtraction: $a(b - c) = ab - ac$.
- Reverse (factoring): $ab + ac = a(b + c)$.
- Multiple terms: $a(b + c + d + \ldots) = ab + ac + ad + \ldots$.

Matrix generalization: $A(B + C) = AB + AC$ and $(A + B)C = AC + BC$.

## The formula in words

"If you're multiplying something by a sum, you can instead multiply by each piece of the sum separately, then add up the results. It's like distributing mail to each house on a street: instead of delivering all mail to one intersection and asking people to collect it, you deliver each piece directly to its house. Both approaches deliver the same total mail."

## Critical Concepts

1. **Dot product is distributive**: $\mathbf{w} \cdot (\mathbf{x} + \mathbf{z}) = \mathbf{w} \cdot \mathbf{x} + \mathbf{w} \cdot \mathbf{z}$. This means linear transformations distribute over vector addition — the foundation of linear algebra and linear models.
2. **Feature scaling impact**: if feature $j$ is scaled by constant $k$: $w_j (k x_j) = (w_j k) x_j$. The coefficient absorbs the scaling. Distributivity is why you must rescale coefficients after rescaling features.
3. **Factoring is the reverse**: `ab + ac = a(b + c)`. This is factoring out the common factor. In data: if all terms share a common multiplier (e.g., tax rate), factor it out for efficiency: `SELECT tax_rate * (price + shipping + handling)` is faster than `SELECT tax_rate * price + tax_rate * shipping + tax_rate * handling` when tax_rate is a constant.
4. **Gradient via chain rule**: $\frac{\partial}{\partial \mathbf{w}}[\mathbf{w}^T \mathbf{x}] = \mathbf{x}$.

This result follows from distributing the derivative across the dot product sum.

## Step-by-step calculation (tiny example)

Task: verify distributive law, then compute a weighted score two ways.

*Step 1: Direct verification*
$3 \times (4 + 5)$: compute inside parentheses first: $3 \times 9 = 27$.
Distributed: $3 \times 4 + 3 \times 5 = 12 + 15 = 27$. Equal.

*Step 2: Revenue formula — two methods*
$\text{price} = 10$, $\text{units} = 7$, $\text{bonus} = 3$.
Method 1: $10 \times (7 + 3) = 10 \times 10 = 100$.
Method 2: $10 \times 7 + 10 \times 3 = 70 + 30 = 100$. Same result.

*Step 3: Factoring direction*
$6x + 6y = 6(x + y)$. Factor out 6. Useful when $x$ and $y$ share the same cost multiplier.

## Code examples

### Beginner example (Python)

```python
# Distributive law: a(b + c) = ab + ac
test_cases = [(3, 4, 5), (2, -3, 7), (0.5, 10, 6), (-1, 8, -2)]
print("Verifying a(b+c) == ab+ac:")
for a, b, c in test_cases:
    lhs = a * (b + c)
rhs = a * b + a * c
print(f" {a}({b}+{c}) = {a}×{b+c} = {lhs} | {a}×{b}+{a}×{c} = {a*b}+{a*c} = {rhs} | Equal: {lhs==rhs}")   # Dot product distributivity: w · (x + z) = w·x + w·z
import numpy as np
w = np.array([1.0, 2.0, 3.0])
x = np.array([4.0, 5.0, 6.0])
z = np.array([1.0, 1.0, 1.0])
lhs_dot = w @ (x + z)
rhs_dot = w @ x + w @ z
print(f"\nDot product distributivity:")
print(f" w·(x+z) = {lhs_dot}")
print(f" w·x + w·z = {rhs_dot}")
print(f" Equal: {abs(lhs_dot - rhs_dot) < 1e-10}")   # Revenue: price × (units + bonus) = price×units + price×bonus
prices = [10.0, 25.0, 5.0]
units = [7, 3, 15]
bonuses = [3, 2, 0]
for p, u, b in zip(prices, units, bonuses):
    method1 = p * (u + b)
method2 = p * u + p * b
print(f" {p}×({u}+{b})={method1:.1f} | {p}×{u}+{p}×{b}={method2:.1f} Equal:{method1==method2}")
```

### Beginner example (R)

```r
# Distributive law: a(b+c) = ab+ac
test_cases <- list(c(3, 4, 5), c(2, -3, 7), c(0.5, 10, 6), c(-1, 8, -2))
cat("Verifying a(b+c) == ab+ac:\n")
for (t in test_cases) { a <- t[1]; b <- t[2]; c <- t[3]
  lhs <- a * (b + c)
  rhs <- a * b + a * c
  cat(sprintf(" %.1f(%.1f+%.1f)=%.1f | %.1f×%.1f+%.1f×%.1f=%.1f Equal:%s\n", a, b, c, lhs, a, b, a, c, rhs, lhs==rhs))
}  # Dot product distributivity
w <- c(1, 2, 3)
x <- c(4, 5, 6)
z <- c(1, 1, 1)
cat(sprintf("\nw·(x+z) = %.1f\n", sum(w * (x + z))))
cat(sprintf("w·x + w·z = %.1f\n", sum(w * x) + sum(w * z)))
```

### Professional example (Python)

```python
import numpy as np
import pandas as pd   # Scenario: linear model prediction using distributive law
# and feature scaling coefficient adjustment
np.random.seed(42)
n = 300   # Features: age, spend, recency (days since last purchase)
X = pd.DataFrame({ "age": np.random.normal(38, 10, n), "spend": np.random.normal(300, 100, n), "recency": np.random.uniform(1, 365, n) })   # True weights (simulate "learned" coefficients)
weights = np.array([0.5, 0.02, -0.003])
intercept = 10.0   # Prediction via dot product = distributive law applied n_features times
#
y_hat = w_0 + w_1*age + w_2*spend + w_3*recency
# = intercept + w · x_i for each row i
y_hat_via_dot = X.values @ weights + intercept
y_hat_explicit = (weights[0] * X["age"] + weights[1] * X["spend"] + weights[2] * X["recency"] + intercept).values
print("Linear Model: Dot Product via Distributive Law")
print("=" * 48)
print(f" Predictions match: {np.allclose(y_hat_via_dot, y_hat_explicit)}")
print(f" Max diff: {np.max(np.abs(y_hat_via_dot - y_hat_explicit)):.2e}")
print(f" Sample predictions (first 5): {y_hat_via_dot[:5].round(3)}")
print()   # Feature scaling: if we scale 'spend' by 1/100 (to make it $hundreds)
# the coefficient must be multiplied by 100 to maintain the same predictions
scale_factor = 100.0
X_scaled = X.copy()
X_scaled["spend"] = X_scaled["spend"] / scale_factor   # spend in $hundreds
weights_adjusted = weights.copy()
weights_adjusted[1] = weights[1] * scale_factor   # a(bx) = (ab)x by distributivity
y_hat_scaled = X_scaled.values @ weights_adjusted + intercept
print("Feature Scaling (distributive law: w(kx) = (wk)x)")
print(f" Original spend weight: {weights[1]}")
print(f" Scaled spend weight: {weights_adjusted[1]} (×{scale_factor})")
print(f" Predictions unchanged: {np.allclose(y_hat_via_dot, y_hat_scaled)}")
print(f" Max diff after scaling: {np.max(np.abs(y_hat_via_dot - y_hat_scaled)):.2e}")
```

### Professional example (R)

```r
# Feature scaling: w(kx) = (wk)x (distributive law)
set.seed(42)
X <- data.frame(intercept = 1, spend = runif(100, 10, 500))
weights <- c(20, 0.05)
y_hat_via_dot <- as.numeric(as.matrix(X) %*% weights)
scale_factor <- 0.01
X_scaled <- X
X_scaled$spend <- X_scaled$spend * scale_factor
weights_adjusted <- weights
weights_adjusted[2] <- weights[2] * scale_factor
y_hat_scaled <- as.numeric(as.matrix(X_scaled) %*% weights_adjusted)
cat(" Predictions unchanged:", all.equal(y_hat_via_dot, y_hat_scaled), "\n")
```

---

*Source: 1300 p. 16*
