---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Proper subset

$$
A \subset B
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
$A \subset B$ means "$A$ is a **proper subset** of $B$" — every element in $A$ is in $B$, AND $A$ is strictly smaller than $B$ (i.e., $A \neq B$, so $B$ has at least one element not in $A$). The distinction from $A \subseteq B$ is the strict inequality: a set is a subset of itself, but it is not a proper subset of itself. In DA/DS, the proper subset relationship captures hierarchy, strict containment, and partition membership. Examples: the set of VIP customers is a proper subset of all customers; the training set is a proper subset of the full dataset (assuming a test split was done); a feature subset used in a simpler model is a proper subset of the full feature space. The proper subset check is also how you verify strict coverage — not just "all elements match" but also "B has more."

## Flowchart

```mermaid
flowchart TD
    A["A ⊆ B: every element of A is in B"] --> B{"Is A equal to B?"} B -- "No: B has elements A doesn't" --> C["A ⊂ B (proper subset — strict)"] B -- "Yes: A and B are identical" --> D["A ⊆ B only — NOT a proper subset"]
    C --> E["DA: VIP customers ⊂ all customers"]
    C --> F["ML: selected_features ⊂ all_features"]
    C --> G["|A| < |B| always when A ⊂ B"]
    D --> H["A = B: use ⊆, not ⊂"]
```

## Real-world use

### Where it is used

Strict hierarchy checks: "is this user cohort strictly smaller than the full user base?" Feature selection output: the selected feature subset should be a proper subset of all candidate features (if it's equal, no feature was dropped). Audit trail: a sample $S$ used for testing must be a proper subset of the full population $P$ — if $S = P$, the test is not a sample, it's the whole thing. Nested category hierarchies: "Electronics" products are a proper subset of all products.

### Problem it solves

The proper subset constraint catches situations where you expect strict reduction but got equality instead — a sign that something went wrong. For example, a feature selector that returns the full feature set did not actually select anything. A "sample" that equals the full dataset is not a sample. The $\subset$ check adds the equality-rejection condition that $\subseteq$ does not.

### How it solves the problem

$A \subset B \iff A \subseteq B \land A \neq B$. In Python: `set_A < set_B` (the strict less-than operator on sets). This fails if $A = B$ even when $A \subseteq B$ is true. The violation cases are: (1) $A$ has elements not in $B$ (not a subset at all), or (2) $A = B$ (subset but not proper subset).

### Example in a business

Feature selection audit: model v1 uses features $A = \{\text{age, income, tenure}\}$. The full feature space is $B = \{\text{age, income, tenure, city, product\_cat}\}$. $A \subset B$ is True — $A$ is a proper subset of $B$, which is expected (the model uses a reduced feature set). If a "new simplified model" returns $A = B$ (all features), the simplification failed.

## The formula, piece by piece

Breaking the notation:

- $A$: the smaller candidate set.
- $\subset$: the proper subset symbol. Note: in some older textbooks, $\subset$ means what modern notation calls $\subseteq$ (i.e., subset-or-equal). Modern convention: $\subset$ is strict (proper). Always check which convention a source uses.
- $B$: the strictly larger containing set. Formal definition: $A \subset B \iff (A \subseteq B) \land (A \neq B)$. Equivalently: $A \subset B \iff (\forall x \in A, x \in B) \land (\exists y \in B, y \notin A)$.

Related notation:
- $A \subset B$: proper subset (A is strictly contained in B).
- $A \subseteq B$: subset or equal (A could equal B).
- $A \not\subset B$: not a proper subset — either some element of A is missing from B, or A = B.
- $B \supset A$: $B$ is a proper superset of $A$ (equivalent to $A \subset B$, just written from B's perspective).
- $|A| < |B|$: when $A \subset B$ (for finite sets), the size of $A$ is strictly less than the size of $B$.

## The formula in words

"$A \subset B$ means: 'everything in $A$ is in $B$, but $B$ has something $A$ doesn't.' It is the strict version of containment — $A$ is genuinely smaller. In Python this is `set_A < set_B`. If the result is False when you expected True, either $A$ has elements outside $B$, or $A$ and $B$ are exactly the same set."

## Critical Concepts

1. **`<` vs `<=` on Python sets**: `set_A < set_B` tests $\subset$ (proper); `set_A <= set_B` tests $\subseteq$ (subset or equal). A set is never `<` itself: `{1,2} < {1,2}` is `False`. But `{1,2} <= {1,2}` is `True`.
2. **Notation ambiguity**: in older literature (pre-1960s), $\subset$ meant what we now call $\subseteq$. In modern DA/DS and CS contexts, $\subset$ almost always means proper subset. When reading papers, verify which convention the author uses.
3. **Cardinality implication**: if $A \subset B$ (finite sets), then $|A| < |B|$. The reverse is not guaranteed: $|A| < |B|$ does not imply $A \subset B$ (A might have elements outside B).
4. **Power set**: the power set $\mathcal{P}(A)$ is the set of ALL subsets of $A$ (including $\emptyset$ and $A$ itself). It has $2^{|A|}$ elements. Every element of $\mathcal{P}(A)$ except $A$ itself is a proper subset of $A$.
5. **Proper subset for segmentation validation**: when you split a population into segments, each segment should be a proper subset of the full population AND segments should be pairwise disjoint. `segment ⊂ population` AND `segment_A ∩ segment_B = ∅`.

## Step-by-step calculation (tiny example)

Task: verify that a selected feature set is a proper subset of all available features.

*Step 1: Define the sets*
All features: $B = \{\text{"age"}, \text{"income"}, \text{"tenure"}, \text{"city"}, \text{"product\_cat"}\}$, $|B| = 5$.
Selected features: $A = \{\text{"age"}, \text{"income"}, \text{"tenure"}\}$, $|A| = 3$.

*Step 2: Check A ⊆ B*
- "age" $\in B$? Yes.
- "income" $\in B$? Yes.
- "tenure" $\in B$? Yes.
$A \subseteq B$ is True.

*Step 3: Check A ≠ B*
$A = \{age, income, tenure\}$, $B = \{age, income, tenure, city, product_cat\}$. $A \neq B$ because $B$ has "city" and "product\_cat" not in $A$.

*Step 4: Conclusion*
$A \subset B$ is True. The selected feature set is a proper subset of all features. Feature selection removed 2 features. $|A| = 3 < |B| = 5$. Dropped features: $B \setminus A = \{\text{"city"}, \text{"product\_cat"}\}$.

## Code examples

### Beginner example (Python)

```python
# A ⊂ B: proper subset check in Python
A = {1, 2, 3}
B = {1, 2, 3, 4, 5}
C = {1, 2, 3}   # equal to A
print(f"A = {A}")
print(f"B = {B}")
print(f"C = {C} (same as A)")   # Subset checks
print(f"\nA ⊆ B (issubset): {A <= B}")   # True
print(f"A ⊂ B (proper): {A < B}")   # True — A is strictly smaller
print(f"A ⊆ C (issubset): {A <= C}")   # True — A equals C
print(f"A ⊂ C (proper): {A < C}")   # False — A = C, not strictly smaller
print(f"B ⊂ A (proper): {B < A}")   # False — B is larger # Superset (opposite direction)
print(f"\nB ⊃ A (proper superset): {B > A}")   # True
print(f"B ⊇ A (superset): {B >= A}")   # True # Feature selection: proper subset check
all_features = {"age", "income", "tenure", "city", "product_cat"}
selected_features = {"age", "income", "tenure"}
is_proper = selected_features < all_features
dropped = all_features - selected_features
print(f"\nAll features: {sorted(all_features)}")
print(f"Selected features: {sorted(selected_features)}")
print(f"Proper subset: {is_proper}")
print(f"Dropped features: {sorted(dropped)}")   # Check: what if "feature selector" returns all features?
no_selection = all_features.copy()
print(f"\nNo-op selector ⊂ all_features: {no_selection < all_features}")   # False!
print("→ Selector returned the full feature set — no reduction occurred!")
```

### Beginner example (R)

```r
# Proper subset in R
A <- c(1, 2, 3)
B <- c(1, 2, 3, 4, 5)
C <- c(1, 2, 3)  # equal to A

# In R, proper subset = (A ⊆ B) AND (length differs or not setequal)
is_subset_proper <- function(set_a, set_b) {
  all(set_a %in% set_b) && !setequal(set_a, set_b)
}
cat(sprintf("A ⊂ B: %s\n", is_subset_proper(A, B)))  # TRUE
cat(sprintf("A ⊂ C: %s\n", is_subset_proper(A, C)))  # FALSE (equal)
cat(sprintf("B ⊂ A: %s\n", is_subset_proper(B, A)))  # FALSE (B > A)

# Feature selection check
all_features <- c("age", "income", "tenure", "city", "product_cat")
selected_features <- c("age", "income", "tenure")
proper_subset_flag <- is_subset_proper(selected_features, all_features)
dropped <- setdiff(all_features, selected_features)
cat(sprintf("\nProper subset check: %s\n", proper_subset_flag))
cat("Dropped features:", dropped, "\n")

# No-op selector
no_selection <- all_features
cat(sprintf("\nNo-op selector ⊂ all_features: %s\n", is_subset_proper(no_selection, all_features)))  # FALSE
```

### Professional example (Python)

```python
import pandas as pd
import numpy as np

# Scenario: validate proper subset relationships across a modeling pipeline
# 1) Each customer segment ⊂ full customer base (strict containment)
# 2) Selected features ⊂ all features (feature selector actually reduced features)
# 3) Sample ⊂ population (sampling actually produced a subset)
np.random.seed(42)
N = 1000
population_ids = set(range(1, N + 1))

# Customer segments (should each be a proper subset of population)
premium_ids = set(np.random.choice(list(population_ids), 200, replace=False))
standard_ids = set(np.random.choice(list(population_ids), 500, replace=False))
trial_ids = set(np.random.choice(list(population_ids), 150, replace=False))

# Features
all_features = {"age", "income", "tenure", "city", "channel", "product_cat", "recency", "frequency", "monetary"}
selected_features = {"age", "income", "tenure", "recency", "frequency", "monetary"}
bad_selector = all_features.copy()   # no-op selector

# Sample
sample_ids = set(np.random.choice(list(population_ids), 300, replace=False))


def check_proper_subset(set_a: set, set_b: set, label: str) -> dict:
    """
    Check if set_a ⊂ set_b (proper subset).

    Args:
        set_a: Candidate set.
        set_b: Reference set.
        label: Description of the check.

    Returns:
        Dict with check result and diagnostic info.
    """
    is_sub = set_a <= set_b
    is_proper = set_a < set_b
    violations = set_a - set_b    # elements in A not in B
    extra_in_b = set_b - set_a    # elements in B but not A (expected if proper)
    return {
        "check": label,
        "A⊆B": is_sub,
        "A⊂B": is_proper,
        "|A|": len(set_a),
        "|B|": len(set_b),
        "A\\B (violations)": len(violations),
        "B\\A (extra in B)": len(extra_in_b),
        "status": "PASS" if is_proper else ("EQUAL" if is_sub else "FAIL"),
    }


checks = [
    check_proper_subset(premium_ids, population_ids, "premium ⊂ population"),
    check_proper_subset(standard_ids, population_ids, "standard ⊂ population"),
    check_proper_subset(trial_ids, population_ids, "trial ⊂ population"),
    check_proper_subset(selected_features, all_features, "selected_features ⊂ all_features"),
    check_proper_subset(bad_selector, all_features, "bad_selector ⊂ all_features"),
    check_proper_subset(sample_ids, population_ids, "sample ⊂ population"),
]
report = pd.DataFrame(checks)
print("Proper Subset Validation Report (A ⊂ B)")
print("=" * 70)
print(report.to_string(index=False))
pass_count = (report["status"] == "PASS").sum()
print(f"\n{pass_count}/{len(report)} checks are proper subsets.")
```

### Professional example (R)

```r
# Proper subset validation: A ⊂ B iff A ⊆ B and A ≠ B
check_proper_subset <- function(A, B, label) {
  is_subset <- all(A %in% B)
  is_proper <- is_subset && (length(setdiff(B, A)) > 0)
  data.frame(check = label, is_subset = is_subset, is_proper = is_proper,
             status = if (is_proper) "PASS" else "FAIL")
}
population_ids <- 1:1000
premium_ids <- sample(population_ids, 200)
standard_ids <- sample(setdiff(population_ids, premium_ids), 500)
all_features <- c("a", "b", "c", "d")
selected_features <- c("a", "b")
bad_selector <- c("a", "x")
checks <- rbind( check_proper_subset(premium_ids, population_ids, "premium ⊂ population"), check_proper_subset(selected_features, all_features, "selected ⊂ all_features"), check_proper_subset(bad_selector, all_features, "bad_selector ⊂ all (expect FAIL)")
)
cat("Proper Subset Validation (A ⊂ B)\n")
print(checks)
cat("\n", sum(checks$status == "PASS"), "/", nrow(checks), " checks are proper subsets.\n", sep = "")
```

---

*Source: 1300 p. 13*
