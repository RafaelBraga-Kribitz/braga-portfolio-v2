---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Fallacy ($f$ or $c$)

False for all truth values of its components.

## Deep Breakdown

What it tells me *(Situation Awareness)*:
A **fallacy** in formal logic (also called a **contradiction** or **absurdity**, denoted $f$, $c$, or $\bot$) is a compound logical statement that is false for every possible assignment of truth values to its component variables. It is the logical opposite of a tautology. In DA/DS, contradictions appear as: impossible filter conditions (queries that return no rows), unreachable code branches, logic bugs in validation rules, and in proof by contradiction (assuming the negation of a theorem leads to a contradiction, proving the theorem true).

## Flowchart

```mermaid
flowchart TD
    A["Compound logical statement"] --> B["Build truth table"]
    B --> C["Evaluate for ALL variable assignments"]
    C --> D{["All rows = False?"]} D -- "Yes" --> E["CONTRADICTION (Fallacy): always false"] D -- "No" --> F["Not a contradiction"]
    E --> G["Example: p ∧ ¬p (never both true)"]
    G --> H["In code: if x > 5 and x < 3: ... (impossible)"]
```

## Real-world use

### Where it is used

Detecting impossible conditions in SQL queries (`WHERE age < 0 AND age >= 0` returns zero rows — a contradiction), identifying logic bugs in data pipelines (a filter that can never match any record), proof by contradiction (assume the negation of a claim is true, derive a contradiction, therefore the claim is true), and static analysis tools that flag unreachable code paths.

### Problem it solves

A contradictory filter in a SQL WHERE clause silently returns zero rows, causing downstream confusion: "Why is my dashboard empty?" The analyst may spend hours debugging when the root cause is a logic contradiction in the filter. Recognizing the pattern $p \land \lnot p$ immediately flags the filter as always-False.

### How it solves the problem

$p \land \lnot p = \text{False}$ for any value of $p$. If a WHERE clause contains equivalent logic — filtering for a column to simultaneously satisfy two mutually exclusive conditions — the query returns no rows. Database query planners often detect these and short-circuit the query.

### Example in a business

Data quality check: `SELECT * FROM transactions WHERE amount > 1000 AND amount < 0`. This is a contradiction (no amount can simultaneously be above 1000 and below 0). Zero rows returned. The analyst's intent was probably `WHERE amount > 1000 OR amount < 0` (anomaly detection). The OR/AND confusion creates a logical fallacy in the filter.

## The formula, piece by piece

Breaking the notation:

- $f$, $c$, or $\bot$ (bottom): the notation for a contradiction in formal logic. Always evaluates to False.
- "False for all truth values": no matter how you assign True/False to the variables, the compound statement evaluates to False.

Classic contradictions:
- $p \land \lnot p$ (Law of Non-Contradiction): "A thing cannot be both true and false simultaneously."
- $\lnot(p \lor \lnot p)$ (negation of excluded middle — also a contradiction).
- $p \Rightarrow \lnot p \land p$ (implication leading to contradiction — base of proof by contradiction).

Truth table for $p \land \lnot p$ (the simplest contradiction):
| $p$ | $\lnot p$ | $p \land \lnot p$ |
|-----|-----------|-------------------|
| T | F | **F** |
| F | T | **F** |

All rows are False → contradiction.

Relationship to tautology:
- If $S$ is a tautology, then $\lnot S$ is a contradiction.
- If $S$ is a contradiction, then $\lnot S$ is a tautology.

## The formula in words

"A contradiction is a statement that is always false — it's structurally impossible. 'It is raining and it is not raining at the same moment in the same place' is a contradiction. In data queries, this is a filter that can never match any record: it returns zero rows by logical necessity, not by data availability."

## Critical Concepts

1. **Proof by contradiction (reductio ad absurdum)**: assume $\lnot P$ is true, derive a contradiction ($Q \land \lnot Q$), conclude $P$ must be true. This is one of the most powerful proof techniques in mathematics.
2. **Impossible SQL filters**: `WHERE col BETWEEN 5 AND 3` (no value is between 5 and 3), `WHERE status = 'active' AND status = 'inactive'` — both are contradictions returning empty result sets.
3. **Unreachable code**: `if x > 10 and x < 5:` in Python is a contradiction and will never execute. Linters like pylint or mypy with type narrowing may detect this.
4. **NaN again**: in pandas, `df[df['col'] > 5 & (df['col'] < 3)]` is a contradiction for normal values.

But with NaN, comparisons return False, not raising an error — NaN is excluded from both sides, giving an empty result.

## Step-by-step calculation (tiny example)

Task: prove that $(p \Rightarrow q) \land (p \land \lnot q)$ is a contradiction.

*Step 1: Build truth table*

| $p$ | $q$ | $p \Rightarrow q$ | $\lnot q$ | $p \land \lnot q$ | $(p \Rightarrow q) \land (p \land \lnot q)$ |
|-----|-----|-------------------|-----------|--------------------|----------------------------------------------|
| T | T | T | F | F | **F** |
| T | F | F | T | T | **F** |
| F | T | T | F | F | **F** |
| F | F | T | T | F | **F** |

*Step 2: Conclude*
All four rows are False. This is a contradiction. Interpretation: you cannot simultaneously have "$p$ implies $q$" AND "$p$ is true but $q$ is false" — these are mutually exclusive.

## Code examples

### Beginner example (Python)

```python
# Contradiction (Fallacy): False for ALL truth values of its components
from itertools import product

def is_contradiction(func, n_vars: int) -> bool:
    return not any(func(*combo) for combo in product([True, False], repeat=n_vars))

def is_tautology(func, n_vars: int) -> bool:
    return all(func(*combo) for combo in product([True, False], repeat=n_vars))
tests = { "p AND NOT p": (lambda p: p and not p, 1), "p OR NOT p": (lambda p: p or not p, 1), "p AND q": (lambda p, q: p and q, 2), "(p→q) AND (p AND NOT q)": (lambda p, q: (not p or q) and (p and not q), 2),
}
print("Classifying logical expressions:")
print(f" {'Expression':>36} {'Tautology':>10} {'Contradiction':>14}")
for name, (func, n) in tests.items():
    t = is_tautology(func, n)
c = is_contradiction(func, n)
label = "TAUTOLOGY" if t else ("CONTRADICTION" if c else "contingency")
print(f" {name:>36} {str(t):>10} {str(c):>14} → {label}")   # Practical: detect impossible filter conditions
import pandas as pd
import numpy as np
np.random.seed(42)
df = pd.DataFrame({ "age": np.random.randint(18, 65, 100), "status": np.random.choice(["active", "inactive"], 100),
})   # Contradiction filter: no value can be simultaneously > 50 and < 18
contradiction_mask = (df["age"] > 50) & (df["age"] < 18)
normal_mask = (df["age"] > 50) | (df["age"] < 25)   # valid contingency
print(f"\nContradiction filter (age > 50 AND age < 18): {contradiction_mask.sum()} rows")
print(f"Normal filter (age > 50 OR age < 25): {normal_mask.sum()} rows")
print(f"\nLogical bug in SQL: status='active' AND status='inactive'")
contradiction_status = (df["status"] == "active") & (df["status"] == "inactive")
print(f" Rows returned: {contradiction_status.sum()} ← always zero (contradiction)")
```

### Beginner example (R)

```r
# Contradiction in R
is_contradiction <- function(func, n_vars) { combos <- expand.grid(rep(list(c(TRUE, FALSE)), n_vars))
  results <- apply(combos, 1, function(row) do.call(func, as.list(row)))
  return(!any(results))
}
cat("p AND NOT p: contradiction?", is_contradiction(function(p) p & !p, 1), "\n")
cat("p OR NOT p: contradiction?", is_contradiction(function(p) p | !p, 1), "\n")
cat("p AND q: contradiction?", is_contradiction(function(p, q) p & q, 2), "\n")  # Impossible data filter
df <- data.frame(age = c(10, 25, 55, 70), status = c("a","b","a","b"))
impossible <- df[df$age > 50 & df$age < 18, ]
cat(sprintf("\nImpossible filter (age>50 AND age<18): %d rows\n", nrow(impossible)))
```

### Professional example (Python)

```python
from itertools import product
import pandas as pd
import numpy as np   # Scenario: proof by contradiction + detecting contradiction bugs in data pipelines # 1. Proof by contradiction: show √2 is irrational (conceptual illustration)
print("Proof by Contradiction: √2 is irrational")
print("=" * 44)
print(" Assume √2 = a/b (rational, reduced form).")
print(" Then 2 = a²/b² → a² = 2b² → a² is even → a is even.")
print(" Write a = 2k → a² = 4k² → 2b² = 4k² → b² = 2k² → b is even.")
print(" But 'a and b are both even' contradicts 'a/b is reduced'.")
print(" Contradiction! Therefore √2 is NOT rational. ∎")
print()   # 2. Detect contradiction conditions in pandas filters
np.random.seed(42)
n = 500
df = pd.DataFrame({ "revenue": np.random.uniform(-1000, 10_000, n), "category": np.random.choice(["A", "B", "C"], n), "is_active": np.random.choice([True, False], n),
})   # Simulate some common logic bugs → contradictions
filter_conditions = { "revenue > 5000 AND revenue < 0": (df["revenue"] > 5000) & (df["revenue"] < 0), "category = A AND category = B": (df["category"] == "A") & (df["category"] == "B"), "is_active = True AND is_active = False": df["is_active"] & ~df["is_active"], "revenue > 0 OR revenue <= 0": (df["revenue"] > 0) | (df["revenue"] <= 0),   # tautology
    "revenue BETWEEN 1000 AND 5000": (df["revenue"] >= 1000) & (df["revenue"] <= 5000),   # valid
}
print("Data Pipeline Logic Audit:")
print(f" {'Filter condition':>42} {'Rows':>6} {'Type'}")
print(" " + "-" * 60)
for name, mask in filter_conditions.items():
    count = mask.sum()
    if count == 0:
        label = "CONTRADICTION (bug!)"
    elif count == n:
        label = "TAUTOLOGY (no-op)"
    else:
        label = f"valid ({count/n:.0%} rows)[["
    print(f"]] {name:>42} {count:>6} {label}")
print()
print(" → Contradiction conditions are silent data bugs:")
print(" They return zero rows, not errors.")
print(" Always audit complex AND/OR filter chains.")
```

### Professional example (R)

```r
# Classify filter as contradiction / tautology / contingency
n <- 100
conditions <- list( contradiction = rep(FALSE, n), tautology = rep(TRUE, n), contingency = sample(c(TRUE, FALSE), n, replace = TRUE)
)
for (name in names(conditions)) { count <- sum(conditionsname)
  label <- if (count == 0) "CONTRADICTION"
  else
  if (count == n) "TAUTOLOGY"
  else paste0("valid (", count/n*100, "%)")
  cat(sprintf(" %20s %d %s\n", name, count, label))
}
cat(" Contradictions → zero rows; always audit complex AND/OR chains.\n")
```

---

*Source: domain knowledge*
