---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Commutative of Addition

$$
a + b = b + a
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The **commutative property of addition** says that the order of addends does not matter: swapping two numbers being added produces the same sum. In DA/DS, commutativity of addition underlies: sorting-independent aggregations (`SUM` in SQL returns the same value regardless of row order), symmetric metrics (covariance is symmetric because its numerator is a sum of products, and products of real numbers commute), and the equivalence of forward and reverse traversal in cumulative sums.

## Flowchart

```mermaid
flowchart TD
    A["Two values: a and b"] --> B["Option 1: compute a + b"]
    A --> C["Option 2: compute b + a"]
    B --> D{["Same result?"]}
    C --> D D -- "Yes: order irrelevant" --> E["a + b = b + a confirmed"]
    E --> F["Applies to all real numbers, vectors, matrices"]
```

## Real-world use

### Where it is used

SQL `SUM` aggregation (row order does not affect the total), symmetric distance metrics ($d(A, B) = d(B, A)$ for Euclidean distance, which relies on commutativity inside the square root), feature importance sums (aggregating SHAP values), and verifying JOIN symmetry (A INNER JOIN B counts same as B INNER JOIN A on the same key).

### Problem it solves

In distributed SQL engines, rows arrive from different partitions in arbitrary order. Commutativity of addition guarantees the `SUM` aggregate is the same regardless of the row processing order. Without commutativity, you would need a deterministic row order, which is expensive to enforce at scale.

### How it solves the problem

$a + b = b + a$ means no operation in a summation depends on which operand is "first." A query engine can process rows $r_1, r_2, \ldots, r_n$ in any order and the running total is always the same. This is why `GROUP BY` + `SUM` results are deterministic even when the underlying table has no `ORDER BY`.

### Example in a business

A customer's total spend is the sum of 12 monthly spend values. Whether you add January + February + ... + December or December + November + ... + January, the annual total is the same. In SQL: `SELECT customer_id, SUM(monthly_spend) FROM sales GROUP BY customer_id` — the monthly rows can arrive in any order and the result is always correct.

## The formula, piece by piece

Breaking the notation:

- $a$: first addend.
- $b$: second addend.
- $a + b$: adding $a$ then $b$.
- $= b + a$: reversing the order gives the same sum. Formal statement: $\forall a, b \in \mathbb{R},\ a + b = b + a$.

Key distinctions:
- **Addition is commutative**: $a + b = b + a$ always.
- **Subtraction is NOT commutative**: $a - b \neq b - a$ in general. $5 - 3 = 2$ but $3 - 5 = -2$.
- **Matrix multiplication is NOT commutative**: $AB \neq BA$ in general. Do not confuse with matrix addition, which IS commutative: $A + B = B + A$.

Extensions:
- Vector addition: $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$.
- Matrix addition: $A + B = B + A$.
- Dot product is commutative: $\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u}$.

## The formula in words

"When adding two numbers, it doesn't matter which one you write first. Five plus three is the same as three plus five. The order of terms in a sum is irrelevant. This sounds trivial, but it's why you can reorder rows, partitions, and chunks of data in distributed systems without affecting totals."

## Critical Concepts

1. **Order independence in aggregation**: commutativity (and associativity together) is what makes `SUM`, `COUNT`, `AVG` safe for parallel/distributed execution. These are called "commutative monoids" in distributed systems theory.
2. **Symmetric covariance**: $\text{Cov}(X, Y) = \text{Cov}(Y, X)$ because the covariance formula involves a sum of products, and multiplication of reals is also commutative. The entire covariance matrix is symmetric: $\Sigma = \Sigma^T$.
3. **Non-commutativity of subtraction — a trap**: many data bugs arise from computing $A - B$ when $B - A$ was intended (e.g., computing the wrong sign of a week-over-week change). Always check the direction of your difference.
4. **Set union commutativity**: $A \cup B = B \cup A$ (same as addition commutativity for indicator functions).

In pandas: `pd.concat([df_a, df_b])` and `pd.concat([df_b, df_a])` contain the same rows — though in different order.

## Step-by-step calculation (tiny example)

Task: verify commutativity for integers, then demonstrate a revenue sum is order-independent.

*Step 1: Integer check*
$3 + 7 = 10$ and $7 + 3 = 10$. Confirmed.

*Step 2: Negative number check*
$(-5) + 12 = 7$ and $12 + (-5) = 7$. Order does not affect sign handling.

*Step 3: Multivalue sum — two orderings*
Values $\{1, 4, 9\}$: left-to-right $(1+4)+9 = 14$. Right-to-left $(9+4)+1 = 14$. Same result.

## Code examples

### Beginner example (Python)

```python
# Commutative property: a +
b = b + a
pairs = [(3, 7), (-5, 12), (0.5, -0.5), (100, -200)]
print("Verifying a + b == b + a:")
for a, b in pairs:
    print(f" {a} + {b} = {a+b} | {b} + {a} = {b+a} | Equal: {a+b == b+a}")   # Order-independent aggregation
monthly_revenue = [4_200, 3_800, 5_100, 4_700, 6_200, 5_800, 4_900, 5_300, 6_100, 5_700, 4_400, 7_200]
import random
shuffled = monthly_revenue.copy()
random.seed(42)
random.shuffle(shuffled)
print(f"\nOriginal order sum: {sum(monthly_revenue):,}")
print(f"Shuffled order sum: {sum(shuffled):,}")
print(f"Same result: {sum(monthly_revenue) == sum(shuffled)}")
```

### Beginner example (R)

```r
# Commutative property: a +
b = b + a
pairs <- list(c(3, 7), c(-5, 12), c(0.5, -0.5), c(100, -200))
cat("Verifying a + b == b + a:\n")
for (p in pairs) { a <- p[1]; b <- p[2]
  cat(sprintf(" %.1f + %.1f = %.1f | %.1f + %.1f = %.1f | Equal: %s\n", a, b, a+b, b, a, b+a, (a+b == b+a)))
}  # Order-independent aggregation
monthly_revenue <- c(4200, 3800, 5100, 4700, 6200, 5800, 4900, 5300, 6100, 5700, 4400, 7200)
set.seed(42)
shuffled <- sample(monthly_revenue)
cat(sprintf("\nOriginal order sum: %d\n", sum(monthly_revenue)))
cat(sprintf("Shuffled order sum: %d\n", sum(shuffled)))
cat("Same result:", sum(monthly_revenue) == sum(shuffled), "\n")
```

### Professional example (Python)

```python
import pandas as pd
import numpy as np   # Scenario: verify that distributed aggregation (partition-based) gives
# the same result as sequential, demonstrating commutativity + associativity
np.random.seed(42)
n = 10_000
df = pd.DataFrame({ "customer_id": np.arange(1, n + 1), "spend": np.random.exponential(scale=250, size=n).round(2), "region": np.random.choice(["EU", "US", "APAC", "LATAM"], size=n) })   # Sequential total
total_sequential = df["spend"].sum()   # "Distributed": sum per region (worker), then sum worker totals
region_totals = df.groupby("region")["spend"].sum()
total_distributed = region_totals.sum()   # commutative: order of regions irrelevant # Further: reverse region order
total_reversed = region_totals.iloc[::-1].sum()
print("Commutativity in Distributed Aggregation")
print("=" * 44)
print(f" Sequential total: {total_sequential:>12,.2f}")
print(f" Distributed total: {total_distributed:>12,.2f}")
print(f" Reversed order total: {total_reversed:>12,.2f}")
print(f" All equal: {abs(total_sequential - total_distributed) < 1e-6 and abs(total_sequential - total_reversed) < 1e-6}")
print()
print(" Regional breakdown:")
for region, s in region_totals.sort_values(ascending=False).items():
    pct = s / total_sequential * 100
print(f" {region:<6}: {s:>10,.2f} ({pct:.1f}%)")   # Also verify: covariance symmetry (relies on commutativity of sum and multiply)
x = df["spend"].values
y = np.random.normal(0, 1, n)   # dummy second variable
cov_xy = np.cov(x, y)[0, 1]
cov_yx = np.cov(x, y)[1, 0]
print(f"\n Cov(X,Y) = {cov_xy:.4f}")
print(f" Cov(Y,X) = {cov_yx:.4f}")
print(f" Symmetric (Cov(X,Y) == Cov(Y,X)): {abs(cov_xy - cov_yx) < 1e-10}")
```

### Professional example (R)

```r
# Covariance symmetry: Cov(X,Y) = Cov(Y,X) (commutativity of sum)
set.seed(42)
n <- 200
df <- data.frame(spend = runif(n, 100, 1000))
df$y <- rnorm(n)
cov_xy <- cov(df$spend, df$y)
cov_yx <- cov(df$y, df$spend)
cat(" Cov(X,Y) =", cov_xy, "\n")
cat(" Cov(Y,X) =", cov_yx, "\n")
cat(" Symmetric:", abs(cov_xy - cov_yx) < 1e-10, "\n")
```

---

*Source: 1300 p. 15*
