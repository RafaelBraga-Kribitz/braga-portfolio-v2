---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Commutative of Multiplication

$$
a \cdot b = b \cdot a
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The **commutative property of multiplication** says that the order of factors does not affect the product. In DA/DS, this property enables: symmetric dot products ($\mathbf{x}^T \mathbf{w} = \mathbf{w}^T \mathbf{x}$ for vectors), symmetric covariance matrices ($\Sigma = \Sigma^T$ because each entry $\sigma_{ij} = \sigma_{ji}$), reversible scaling (multiplying a feature by a scalar is order-independent), and SQL expressions where `col_a * col_b` equals `col_b * col_a` in any `SELECT`.

## Flowchart

```mermaid
flowchart TD
    A["Two values: a and b"] --> B["Option 1: a × b"]
    A --> C["Option 2: b × a"]
    B --> D{["Same product?"]}
    C --> D D -- "Yes: multiplication is commutative" --> E["a·b = b·a confirmed"]
    E --> F["CAUTION: matrix multiplication is NOT commutative"]
    F --> G["AB ≠ BA in general for matrices"]
```

## Real-world use

### Where it is used

Dot products for similarity scores ($\mathbf{q} \cdot \mathbf{k} = \mathbf{k} \cdot \mathbf{q}$ in attention mechanisms), feature-weight products in linear models ($w_1 x_1 = x_1 w_1$), cross products in pivot table cells, scalar multiplication of vectors (commutative with the scalar), and symmetric confusion matrix computations.

### Problem it solves

The covariance between two variables $X$ and $Y$ is symmetric: $\text{Cov}(X, Y) = \text{Cov}(Y, X)$. This is because $\text{Cov}(X, Y) = \frac{1}{n}\sum (x_i - \bar{x})(y_i - \bar{y})$ and each product $(x_i - \bar{x})(y_i - \bar{y}) = (y_i - \bar{y})(x_i - \bar{x})$ by commutativity. This symmetry is what makes the covariance matrix ($\Sigma$) symmetric, which in turn enables eigendecomposition with real eigenvalues.

### How it solves the problem

$a \cdot b = b \cdot a$ means every element $\sigma_{ij}$ of a covariance matrix equals $\sigma_{ji}$: the matrix is its own transpose. Symmetric matrices have real eigenvalues and orthogonal eigenvectors — properties critical for PCA and spectral methods. If multiplication were not commutative, PCA would not work as simply as it does.

### Example in a business

Computing the weighted average customer satisfaction score: $\text{CSAT} = \sum_i w_i \cdot s_i$ where $w_i$ is the segment weight and $s_i$ is the score. Each term $w_i \cdot s_i = s_i \cdot w_i$ — the analyst can write the weights first or the scores first; the result is the same. In SQL: `SUM(weight * score) = SUM(score * weight)`.

## The formula, piece by piece

Breaking the notation:

- $a$: first factor.
- $\cdot$: multiplication (also written as $\times$, $ab$, or `a * b` in code).
- $b$: second factor.
- $a \cdot b = b \cdot a$: reversing the order of factors leaves the product unchanged. Formal statement: $\forall a, b \in \mathbb{R},\ a \cdot b = b \cdot a$. Critical non-examples (commutativity does NOT hold):
- Matrix multiplication: $AB \neq BA$ in general.
- Cross product of vectors: $\mathbf{u} \times \mathbf{v} = -(\mathbf{v} \times \mathbf{u})$ (anti-commutative).
- Function composition: $f \circ g \neq g \circ f$ in general.
- Integer division: $7 // 2 \neq 2 // 7$ in Python.

Extends to:
- Scalar-vector: $c \mathbf{v} = \mathbf{v} c$ (scalar multiplication is commutative).
- Dot product: $\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u}$.

## The formula in words

"For plain numbers, it doesn't matter which factor you write first. Six times four is twenty-four; four times six is also twenty-four. But the moment you switch to matrices, this breaks down completely. Matrix order always matters — never assume $AB = BA$ for matrices."

## Critical Concepts

1. **The matrix trap**: the most common error in linear algebra for ML. $\mathbf{X}^T \mathbf{X}$ and $\mathbf{X} \mathbf{X}^T$ are both valid but produce matrices of completely different shapes and meanings. Commutativity of scalar multiplication does NOT carry over to matrices.
2. **Symmetric covariance**: $\Sigma_{ij} = \text{Cov}(X_i, X_j) = \text{Cov}(X_j, X_i) = \Sigma_{ji}$. This relies on commutativity of real multiplication. The result is $\Sigma = \Sigma^T$ (symmetric), enabling eigendecomposition: $\Sigma = Q \Lambda Q^T$.
3. **Dot product in attention**: in transformer self-attention, $\text{score}(q, k) = q \cdot k = k \cdot q$ for vectors. This symmetry is exploited in some efficient attention implementations.
4. **Floating-point**: just as with addition, floating-point multiplication is not exactly commutative in all edge cases due to NaN propagation rules, but for normal finite values $a \cdot b = b \cdot a$ holds exactly.

## Step-by-step calculation (tiny example)

Task: verify commutativity for scalars, then show covariance symmetry on a tiny dataset.

*Step 1: Scalar check*
$6 \cdot 4 = 24$ and $4 \cdot 6 = 24$. Confirmed.

*Step 2: Covariance with tiny data*
$X = \{1, 3, 5\}$, $Y = \{2, 6, 4\}$. $\bar{X} = 3$, $\bar{Y} = 4$.
Deviations: $(x_i - \bar{X}) = \{-2, 0, 2\}$, $(y_i - \bar{Y}) = \{-2, 2, 0\}$.

*Step 3: Two product orderings*
$\text{Cov}(X,Y) = \frac{1}{3}[(-2)(-2) + (0)(2) + (2)(0)] = \frac{1}{3}[4 + 0 + 0] = \frac{4}{3}$.
$\text{Cov}(Y,X) = \frac{1}{3}[(-2)(-2) + (2)(0) + (0)(2)] = \frac{1}{3}[4 + 0 + 0] = \frac{4}{3}$.
Both equal $\frac{4}{3}$, confirming $\text{Cov}(X,Y) = \text{Cov}(Y,X)$.

## Code examples

### Beginner example (Python)

```python
# Commutative property of multiplication: a *
b = b * a
pairs = [(6, 4), (-3, 7), (0.5, 8), (100, 0), (-2, -5)]
print("Verifying a * b == b * a:")
for a, b in pairs:
    print(f" {a} × {b} = {a*b} | {b} × {a} = {b*a} | Equal: {a*b == b*a}")   # Weighted average: w * score == score * w (element-wise)
weights = [0.3, 0.2, 0.5]
scores = [85, 90, 78]
weighted_sum_1 = sum(w * s for w, s in zip(weights, scores))
weighted_sum_2 = sum(s * w for s, w in zip(scores, weights))
print(f"\nWeighted average (w×s): {weighted_sum_1:.2f}")
print(f"Weighted average (s×w): {weighted_sum_2:.2f}")
print(f"Equal: {abs(weighted_sum_1 - weighted_sum_2) < 1e-10}")   # IMPORTANT: matrix multiplication is NOT commutative
import numpy as np
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(f"\nA @ B =\n{A @ B}")
print(f"B @ A =\n{B @ A}")
print(f"A@B == B@A: {np.allclose(A @ B, B @ A)} ← FALSE for matrices!")
```

### Beginner example (R)

```r
# Commutative property of multiplication: a *
b = b * a
pairs <- list(c(6, 4), c(-3, 7), c(0.5, 8), c(100, 0), c(-2, -5))
cat("Verifying a * b == b * a:\n")
for (p in pairs) { a <- p[1]; b <- p[2]
  cat(sprintf(" %.1f × %.1f = %.1f | %.1f × %.1f = %.1f | Equal: %s\n", a, b, a*b, b, a, b*a, (a*b == b*a)))
}  # Weighted average
weights <- c(0.3, 0.2, 0.5)
scores <- c(85, 90, 78)
cat(sprintf("\nWeighted avg (w×s): %.2f\n", sum(weights * scores)))
cat(sprintf("Weighted avg (s×w): %.2f\n", sum(scores * weights)))  # Matrix multiplication NOT commutative
A <- matrix(c(1,3,2,4), nrow=2)
B <- matrix(c(5,7,6,8), nrow=2)
cat("\nA %*% B:\n")
print(A %*% B)
cat("B %*% A:\n")
print(B %*% A)
cat("Equal:", all(A %*% B == B %*% A), "← FALSE for matrices!\n")
```

### Professional example (Python)

```python
import numpy as np
import pandas as pd   # Scenario: verify covariance matrix symmetry (product commutativity in action)
# and contrast with matrix multiplication non-commutativity
np.random.seed(42)
n = 500   # Generate correlated features
features = pd.DataFrame({ "age": np.random.normal(35, 8, n), "spend": np.random.normal(250, 80, n), "tenure": np.random.normal(4, 2, n), "nps": np.random.normal(7, 2, n),
})
cov_matrix = features.cov()
print("Covariance Matrix (relies on commutativity of scalar multiplication)")
print("=" * 60)
print(cov_matrix.round(4))
print()
print(f"Is symmetric (Σ = Σᵀ): {np.allclose(cov_matrix, cov_matrix.T)}")
print(f"Max off-diagonal asymmetry: {np.max(np.abs(cov_matrix.values - cov_matrix.T.values)):.2e}")
print()   # PCA: eigenvalues are real because Σ is symmetric (because multiplication commutes)
eigenvalues, eigenvectors = np.linalg.eigh(cov_matrix.values)
eigenvalues = eigenvalues[::-1]
explained_var = eigenvalues / eigenvalues.sum()
print("PCA Explained Variance (possible because Σ is symmetric):")
for i, (ev, pct) in enumerate(zip(eigenvalues, explained_var)):
    print(f" PC{i+1}: eigenvalue={ev:.2f}, explained={pct:.1%}")
print()   # Show: X^T X and X X^T are NOT equal (matrix non-commutativity)
X = features.values
XtX = X.T @ X   # shape (4, 4) — feature covariance (up to scaling)
XXt = X @ X.T   # shape (500, 500) — sample similarity matrix
print(f"X^T X shape: {XtX.shape} (feature-feature matrix)")
print(f"X X^T shape: {XXt.shape} (sample-sample matrix)")
print("These are COMPLETELY different objects — matrix order matters!")
```

### Professional example (R)

```r
# X^T X vs X X^T: matrix multiplication is not commutative
set.seed(42)
X <- matrix(rnorm(500 * 4), 500, 4)
XtX <- t(X) %*% X
XXt <- X %*% t(X)
cat("X^T X shape:", dim(XtX), "(feature-feature)\n")
cat("X X^T shape:", dim(XXt), "(sample-sample)\n")
cat("These are COMPLETELY different objects — matrix order matters!\n")
```

---

*Source: 1300 p. 16*
