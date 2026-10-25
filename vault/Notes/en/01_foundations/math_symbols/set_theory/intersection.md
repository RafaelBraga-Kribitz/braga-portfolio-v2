---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Intersection

$$
A \cap B
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
$A \cap B$ is the **intersection** of sets $A$ and $B$: the set of elements that belong to both $A$ and $B$ simultaneously. It is the "find the overlap" operation. In DA/DS, intersection appears when you need to find users/records/features that appear in two datasets at the same time: identifying common customers between two product lines, finding the set of features present in both training and serving data, computing the overlap in campaign audiences, and SQL INNER JOIN logic. If the intersection is empty ($A \cap B = \emptyset$), the sets are disjoint.

## Flowchart

```mermaid
flowchart TD
    A["Sets A and B"] --> B["Iterate over elements of A"]
    B --> C{["Is element also in B?"]} C -- "Yes: element is in both" --> D["Include in A ∩ B"] C -- "No: element is only in A" --> E["Exclude from A ∩ B"]
    D --> F["Repeat for all elements of A"]
    E --> F
    F --> G["A ∩ B contains only shared elements"]
```

## Real-world use

### Where it is used

Finding common customers between two datasets ("users who purchased product A AND product B"), SQL `INNER JOIN` logic (matching rows by key — the intersection of key values), feature consistency checks (features present in both train and test sets), audience overlap analysis in marketing, and verifying referential integrity (IDs in a fact table that have matching records in a dimension table).

### Problem it solves

When you join two tables in SQL using INNER JOIN, the result is exactly $A \cap B$ on the join key: only rows whose key value exists in both tables survive. Knowing what intersection means helps you diagnose data loss when an INNER JOIN produces fewer rows than expected: it means some key values exist in one table but not the other.

### How it solves the problem

$A \cap B = \{x : x \in A \land x \in B\}$. An element survives the intersection only if it passes both membership tests simultaneously. In code, this is a Python set `&` operation or pandas `.isin()` filter combined with a boolean AND.

### Example in a business

Cross-sell analysis: set $A$ = customers who bought "laptop" last quarter, set $B$ = customers who bought "monitor" last quarter. $A \cap B$ = customers who bought both. $|A \cap B| / |A|$ = the cross-sell rate (fraction of laptop buyers who also bought a monitor). If $A \cap B = \emptyset$, zero cross-sell occurred.

## The formula, piece by piece

Breaking the notation:

- $A$: the first set.
- $\cap$: the intersection symbol. An inverted "cup" or "tent" shape. Unicode: U+2229. Pronounced "intersection" or "and."
- $B$: the second set.
- $A \cap B$: the set containing only elements that appear in both $A$ and $B$. Formal definition: $A \cap B = \{x : x \in A \land x \in B\}$.

Properties:
- Commutative: $A \cap B = B \cap A$.
- Associative: $(A \cap B) \cap C = A \cap (B \cap C)$.
- Identity: $A \cap U = A$ (intersection with universal set leaves $A$ unchanged).
- Annihilator: $A \cap \emptyset = \emptyset$ (intersection with empty set is always empty).
- Idempotent: $A \cap A = A$.
- Distributive: $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$.

## The formula in words

"$A \cap B$ is the set of elements that are in $A$ AND in $B$ at the same time. Think of it as an INNER JOIN: only records with a match on both sides survive. If an element is only in $A$ but not in $B$, or only in $B$ but not in $A$, it is excluded."

## Critical Concepts

1. **Disjoint sets**: if $A \cap B = \emptyset$, the sets share no elements. They are disjoint. This means an INNER JOIN on these key sets would return zero rows.
2. **Intersection vs. INNER JOIN**: for pandas, `df_a.merge(df_b, on='key', how='inner')` returns only rows whose `key` value appears in both DataFrames: exactly $\{key : key \in A.keys \land key \in B.keys\}$.
3. **Data loss detection**: if `df_a.merge(df_b, how='inner')` returns far fewer rows than expected, compute `len(set_a & set_b)` on the key column to measure how many keys actually overlap.
4. **Jaccard similarity**: $J(A, B) = |A \cap B| / |A \cup B|$ measures how similar two sets are, used in recommendation systems, document similarity, and deduplication.
5. **Intersection for feature consistency**: before deploying a model, verify that the training feature set and the serving feature set intersect completely: `assert train_features == serving_features`.

If not, the deployed model will fail on unseen feature names.

## Step-by-step calculation (tiny example)

Task: find $A \cap B$ for $A = \{1, 2, 3, 4\}$ and $B = \{3, 4, 5, 6\}$. Then compute Jaccard similarity.

*Step 1: Find elements in both sets*
Check each element of $A$: $1 \notin B$, $2 \notin B$, $3 \in B$, $4 \in B$.
$A \cap B = \{3, 4\}$.

*Step 2: Use inclusion-exclusion to find |A ∪ B|*
$|A \cup B| = |A| + |B| - |A \cap B| = 4 + 4 - 2 = 6$.

*Step 3: Compute Jaccard similarity*
$J(A, B) = |A \cap B| / |A \cup B| = 2 / 6 \approx 0.333$. The sets share about 33% of their combined elements.

## Code examples

### Beginner example (Python)

```python
# Intersection in Python: A & B or
A.intersection(B)
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}
intersection = A & B
print(f"A = {A}")
print(f"B = {B}")
print(f"A ∩ B = {intersection}")   # {3, 4} # Jaccard similarity
jaccard = len(A & B) / len(A | B)
print(f"Jaccard similarity: {len(A & B)} / {len(A | B)} = {jaccard:.4f}")   # Practical: find common user IDs in two systems
users_crm = {"alice", "bob", "carol", "dave"}
users_product = {"carol", "dave", "eve", "frank"}
common_users = users_crm & users_product
print(f"\nCommon users (in both systems): {common_users}")
print(f"CRM-only users: {users_crm - users_product}")
print(f"Product-only users: {users_product - users_crm}")
```

### Beginner example (R)

```r
# Intersection in R: intersect(A, B)
A <- c(1, 2, 3, 4)
B <- c(3, 4, 5, 6)
inter <- intersect(A, B)
cat("A ∩ B =", inter, "\n")  # 3 4
union_ab <- union(A, B)
jaccard <- length(inter) / length(union_ab)
cat(sprintf("Jaccard similarity: %d / %d = %.4f\n", length(inter), length(union_ab), jaccard))  # Common users
users_crm <- c("alice", "bob", "carol", "dave")
users_product <- c("carol", "dave", "eve", "frank")
common <- intersect(users_crm, users_product)
cat("Common users:", common, "\n")
cat("CRM only:", setdiff(users_crm, users_product), "\n")
cat("Product only:", setdiff(users_product, users_crm), "\n")
```

### Professional example (Python)

```python
import pandas as pd
import numpy as np   # Scenario: cross-sell analysis using set intersection
# + feature consistency check before model deployment
np.random.seed(42)
ALL_CUSTOMERS = list(range(1, 5_001))   # Customers who bought laptops
laptop_buyers = set(np.random.choice(ALL_CUSTOMERS, size=1_200, replace=False))   # Customers who bought monitors
monitor_buyers = set(np.random.choice(ALL_CUSTOMERS, size=900, replace=False))   # Cross-sell analysis
both_bought = laptop_buyers & monitor_buyers
laptop_only = laptop_buyers - monitor_buyers
monitor_only = monitor_buyers - laptop_buyers
cross_sell_rate = len(both_bought) / len(laptop_buyers)
jaccard_sim = len(both_bought) / len(laptop_buyers | monitor_buyers)
print("Cross-Sell Analysis: Laptop Buyers ∩ Monitor Buyers")
print("=" * 52)
print(f" Laptop buyers: {len(laptop_buyers):>5,}")
print(f" Monitor buyers: {len(monitor_buyers):>5,}")
print(f" Bought both: {len(both_bought):>5,} (A ∩ B)")
print(f" Laptop only: {len(laptop_only):>5,}")
print(f" Monitor only: {len(monitor_only):>5,}")
print(f" Cross-sell rate: {cross_sell_rate:.1%} (|A∩B| / |A|)")
print(f" Jaccard similarity: {jaccard_sim:.4f}")
print()   # Feature consistency check
train_features = {"age", "income", "tenure", "city", "product_cat"}
serving_features = {"age", "income", "tenure", "city"}   # missing one feature
common_features = train_features & serving_features
missing_in_serving = train_features - serving_features
extra_in_serving = serving_features - train_features
print("Feature Consistency Check (Train ∩ Serving)")
print(f" Train features: {sorted(train_features)}")
print(f" Serving features: {sorted(serving_features)}")
print(f" Common: {sorted(common_features)}")
print(f" Missing in serving (will cause runtime error): {sorted(missing_in_serving)}")
print(f" Extra in serving (unused by model): {sorted(extra_in_serving)}")
if missing_in_serving:
    print(f"\n WARNING: model expects {len(missing_in_serving)} feature(s) not available at serving time!")
```

### Professional example (R)

```r
# Feature consistency: train ∩ serving
train_features <- c("age", "income", "score", "region")
serving_features <- c("age", "income", "score")
common_features <- intersect(train_features, serving_features)
missing_in_serving <- setdiff(train_features, serving_features)
extra_in_serving <- setdiff(serving_features, train_features)
cat("Feature Consistency (Train ∩ Serving)\n")
cat(" Train: ", paste(sort(train_features), collapse = ", "), "\n")
cat(" Serving:", paste(sort(serving_features), collapse = ", "), "\n")
cat(" Common: ", paste(sort(common_features), collapse = ", "), "\n")
cat(" Missing in serving:", paste(sort(missing_in_serving), collapse = ", "), "\n")
if (length(missing_in_serving) > 0)
cat(" WARNING: model expects these at serving time!\n")
```

---

*Source: 1300 p. 13*
