---
title: Subset
date: '2026-04-16'
wordCount: 945
slug: subset
permalink: /notes/01_foundations/math_symbols/set_theory/subset/index.html
share_status: draft
publish_target: note
boundary: public
---
# $A \subseteq B$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
$A \subseteq B$ means "$A$ is a **subset** of $B$" — every element in $A$ is also in $B$. It does not require $A$ to be smaller than $B$; $A$ could equal $B$ and the statement is still true. This is the "is contained in" or "is part of" relationship between two sets. The $\subseteq$ symbol means "subset or equal." In DA/DS, subset relationships appear whenever you check coverage, containment, or hierarchy: "are all features used at training time also available at serving time?", "does the test set's category universe fit within the training set's?", "are all foreign key values in the fact table present in the dimension table?". The subset check is a foundational data quality assertion.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Sets A and B"] --> B{"Is every element of A also in B?"} B -- "Yes (all elements match)" --> C["A ⊆ B (A is a subset of B)"] B -- "No (some element of A is not in B)" --> D["A ⊄ B (not a subset)"] C --> E["Special case: A = B → A ⊆ B is still True"] C --> F["DA: train_categories ⊆ serving_categories?"] D --> G["DA: foreign key violation — some fact IDs not in dimension table"] C --> H["∅ ⊆ B for any B (empty set is subset of everything)"]
```
### Real-World use:
#### Situation it is used
Referential integrity: check that all `customer_id` values in the `orders` fact table exist in the `customers` dimension table — i.e., `orders.customer_ids ⊆ customers.customer_ids`. ML deployment: verify that the set of categorical levels seen during serving is a subset of those seen during training. SQL `NOT IN` or `LEFT JOIN ... WHERE IS NULL` detects violations. Python `set_A.issubset(set_B)` or `set_A <= set_B`. pandas: `df_a['key'].isin(df_b['key']).all()`.
#### Problem it solves
When data moves through a pipeline, values can appear that were never seen before — new categories, new IDs, new levels. If the serving feature set is not a subset of the training feature set, a deployed model will fail or silently produce wrong predictions. If a fact table references IDs that don't exist in a dimension, JOIN results become incorrect. The subset check catches these violations before they cause downstream damage.
#### How it solves the problem
$A \subseteq B \iff \forall x \in A, x \in B$. In code: `all(x in set_B for x in set_A)`, or equivalently `set_A <= set_B` in Python, or `set_A.issubset(set_B)`. The check is $O(|A|)$ when $B$ is a hash set. If it fails, the violating elements are $A \setminus B$ (elements in $A$ but not in $B$) — exactly the set you need to investigate.
#### Example of it used in the Working Context as DA/DS for a Business
Category consistency before model retraining: training data has product categories $B = \{\text{"Electronics"}, \text{"Apparel"}, \text{"Home"}, \text{"Sports"}\}$. New batch data has categories $A = \{\text{"Electronics"}, \text{"Apparel"}, \text{"Home"}, \text{"Sports"}, \text{"Automotive"}\}$. $A \not\subseteq B$ because "Automotive" $\notin B$. Alert: the new category must either be added to the model's vocabulary or rows with "Automotive" must be handled before retraining.
### The Formula (Fragment-First)
Breaking the notation: - $A$: the candidate set being tested.
- $\subseteq$: the subset-or-equal symbol. Pronounced "is a subset of" or "is contained in." The "equal" bar at the bottom means equality is allowed.
- $B$: the containing set. Formal definition: $A \subseteq B \iff \forall x \,(x \in A \implies x \in B)$. Related notation:
- $A \subseteq B$: $A$ is a subset of $B$ (possibly equal).
- $A \not\subseteq B$: $A$ is NOT a subset of $B$ — at least one element of $A$ is not in $B$.
- $A \subset B$: $A$ is a **proper subset** of $B$ — every element of $A$ is in $B$, AND $A \neq B$ (i.e., $B$ has at least one element not in $A$).
- $A = B \iff A \subseteq B \land B \subseteq A$: two sets are equal if and only if each is a subset of the other. Key properties:
- $\emptyset \subseteq A$ for any set $A$ (empty set is a subset of everything — vacuously true).
- $A \subseteq A$ (every set is a subset of itself — reflexive).
- $A \subseteq B$ and $B \subseteq C$ implies $A \subseteq C$ (transitive).
- $A \subseteq U$ for any set $A$ in a given context ($U$ is the universal set).
### Formula-to-English Translation
"$A \subseteq B$ means: 'every single element in $A$ is also somewhere in $B$.' You check this by going through $A$ element by element and asking: 'is this one in $B$?' If any element of $A$ fails that test, $A \not\subseteq B$. In pandas: `set_a.issubset(set_b)`. In SQL: `NOT EXISTS (SELECT 1 FROM a WHERE key NOT IN (SELECT key FROM b))`." ### Critical Concepts
1. **Subset vs. proper subset**: $A \subseteq B$ allows $A = B$. $A \subset B$ requires $A \neq B$ (strict containment). In Python, `set_A <= set_B` tests $\subseteq$; `set_A < set_B` tests $\subset$.
2. **Set equality via mutual subset**: to prove $A = B$, the standard approach is show $A \subseteq B$ AND $B \subseteq A$. This is how you prove two query results are identical: check each is a subset of the other.
3. **Violations = $A \setminus B$**: the elements that violate the subset condition are exactly $A \setminus B$ (A minus B). Compute these to debug the failure: `set_A - set_B` in Python.
4. **Referential integrity in SQL**: `SELECT a.key FROM fact_table a LEFT JOIN dim_table b ON a.key = b.key WHERE b.key IS NULL` returns `a.keys ∉ b.keys` — the subset violation set.
5. **Training / serving schema check**: before deployment, assert `set(serving_features) <= set(training_features)`. Missing features at serving time cause `KeyError` or silent NaN injection. Extra features at serving time are simply unused.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: check if the test set's category labels are a subset of the training set's. *Step 1: Define the sets*
Training categories: $B = \{\text{"cat"}, \text{"dog"}, \text{"bird"}\}$.
Test categories: $A = \{\text{"cat"}, \text{"dog"}, \text{"snake"}\}$. *Step 2: Check each element of A*
- "cat" $\in B$? Yes.
- "dog" $\in B$? Yes.
- "snake" $\in B$? No — $\text{"snake"} \notin B$. *Step 3: Conclusion*
$A \not\subseteq B$ because "snake" is in $A$ but not in $B$. *Step 4: Find violations*
$A \setminus B = \{\text{"snake"}\}$ — the unseen label. The model was never trained on "snake" and will fail or produce a garbage prediction for those rows.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# A ⊆ B: subset check in Python A = {1, 2, 3}
B = {1, 2, 3, 4, 5}
C = {1, 2, 6} print(f"A = {A}")
print(f"B = {B}")
print(f"C = {C}") # Subset checks
print(f"\nA ⊆ B: {A.issubset(B)}") # True — all of A is in B
print(f"A ⊆ B: {A <= B}") # same thing, operator form
print(f"B ⊆ A: {B <= A}") # False — B has 4 and 5 not in A
print(f"C ⊆ B: {C <= B}") # False — C has 6 not in B
print(f"A = B: {A == B}") # False # Proper subset (strict)
print(f"\nA ⊂ B (proper): {A < B}") # True — A ⊆ B AND A ≠ B
print(f"A ⊂ A (proper): {A < A}") # False — equal sets are NOT proper subsets # Violations: what's in A but not in B?
violations_C = C - B # C \ B
print(f"\nC ⊄ B because: {violations_C} (elements in C but not in B)") # Pandas: check if test categories ⊆ training categories
import pandas as pd
import numpy as np np.random.seed(42)
train_labels = {"cat", "dog", "bird", "fish"}
test_labels = {"cat", "dog", "snake", "bird"} is_subset = test_labels <= train_labels
unseen = test_labels - train_labels print(f"\nTest labels ⊆ Train labels: {is_subset}")
print(f"Unseen test labels: {unseen if unseen else '∅ (none)'}") # isin() approach on a column
df_test = pd.DataFrame({"label": ["cat", "dog", "snake", "cat", "bird"]})
coverage = df_test["label"].isin(train_labels) print(f"\nTest rows with unseen labels: {(~coverage).sum()}")
print(df_test[~coverage])
```
#### Beginner friendly Example [R])
``` r
# A ⊆ B: subset check in R A <- c(1, 2, 3)
B <- c(1, 2, 3, 4, 5)
C <- c(1, 2, 6) cat("A:", A, "\n")
cat("B:", B, "\n") # all(A %in% B) tests A ⊆ B
cat(sprintf("\nA ⊆ B: %s\n", all(A %in% B))) # TRUE
cat(sprintf("B ⊆ A: %s\n", all(B %in% A))) # FALSE (4 and 5 not in A)
cat(sprintf("C ⊆ B: %s\n", all(C %in% B))) # FALSE (6 not in B) # Violations: elements in C but not in B
violations <- setdiff(C, B)
cat(sprintf("C \\ B (violations): %s\n", ifelse(length(violations) == 0, "∅", paste(violations, collapse=", ")))) # ML scenario: check test labels ⊆ training labels
train_labels <- c("cat", "dog", "bird", "fish")
test_labels <- c("cat", "dog", "snake", "bird") is_subset <- all(test_labels %in% train_labels)
unseen <- setdiff(test_labels, train_labels) cat(sprintf("\nTest labels ⊆ Train labels: %s\n", is_subset))
cat(sprintf("Unseen labels: %s\n", ifelse(length(unseen) == 0, "∅", paste(unseen, collapse=", "))))
```
#### Final Professional Example [Python])
``` python
import pandas as pd
import numpy as np # Scenario: full pipeline data quality gate using subset checks
# Check referential integrity and category containment before model scoring np.random.seed(42) # Dimension tables (the "B" sets — the reference universe)
dim_customers = pd.DataFrame({ "customer_id": range(1, 1001), "country": np.random.choice(["AT", "DE", "US", "GB"], 1000),
}) dim_products = pd.DataFrame({ "product_id": range(1, 201), "category": np.random.choice(["Electronics", "Apparel", "Home", "Sports"], 200),
}) # Fact table (the "A" set — being validated)
orders = pd.DataFrame({ "order_id": range(1, 501), "customer_id": np.random.randint(990, 1015, 500), # some IDs exceed dim range "product_id": np.random.randint(195, 210, 500), # some IDs exceed dim range "revenue": np.random.uniform(10, 500, 500).round(2),
}) # Training feature set (the "B" set for model)
training_categories = set(dim_products["category"]) # New batch scoring data
scoring_df = pd.DataFrame({ "product_id": np.random.randint(1, 210, 100), "category": np.random.choice( ["Electronics", "Apparel", "Home", "Sports", "Automotive"], 100 ),
}) def check_subset( set_a: set, set_b: set, label_a: str, label_b: str,
) -> dict: """ Check if set_a ⊆ set_b and report violations. Args: set_a: Candidate set (the one being checked). set_b: Reference set (the containing set). label_a: Human-readable name for set_a. label_b: Human-readable name for set_b. Returns: Dict with is_subset flag, violation count, and violation sample. """ violations = set_a - set_b return { "check": f"{label_a} ⊆ {label_b}", "is_subset": len(violations) == 0, "a_size": len(set_a), "b_size": len(set_b), "violations": len(violations), "sample": str(sorted(violations)[:5]) if violations else "∅", } checks = [ check_subset( set(orders["customer_id"]), set(dim_customers["customer_id"]), "orders.customer_id", "dim_customers.customer_id", ), check_subset( set(orders["product_id"]), set(dim_products["product_id"]), "orders.product_id", "dim_products.product_id", ), check_subset( set(scoring_df["category"]), training_categories, "scoring.category", "training.category", ),
] report = pd.DataFrame(checks) print("Subset Integrity Checks (A ⊆ B)")
print("=" * 70)
print(report.to_string(index=False)) passing = report["is_subset"].sum()
print(f"\n{passing}/{len(report)} checks passed.")
if passing < len(report): print("ACTION REQUIRED: fix violations before proceeding with scoring.")
```
#### Final Professional Example [R]
``` r
# Subset integrity: scoring categories ⊆ training categories training_categories <- c("A", "B", "C")
scoring_categories <- c("A", "B", "C", "D") # D is new -> violation is_subset <- all(scoring_categories %in% training_categories)
checks <- data.frame( set_a = "scoring.category", set_b = "training.category", is_subset = is_subset
)
cat("Subset Integrity (A ⊆ B)\n")
print(checks)
if (!is_subset) cat("ACTION REQUIRED: fix violations before scoring.\n")
```
---
AIO pag 30 of 286