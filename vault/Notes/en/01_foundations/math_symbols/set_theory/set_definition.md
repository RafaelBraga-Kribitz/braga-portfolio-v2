---
title: Set definition
date: '2026-04-16'
wordCount: 870
slug: set_definition
permalink: /notes/01_foundations/math_symbols/set_theory/set_definition/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\{ \}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The **set notation** $\{ \}$ (curly braces) is the fundamental syntax for defining a set in mathematics. A set is an unordered collection of distinct elements. The braces delimit the collection: $\{1, 2, 3\}$ is the set containing exactly the elements 1, 2, and 3. Two key properties distinguish a set from other collections: (1) **no order** — $\{1, 2, 3\} = \{3, 1, 2\}$, and (2) **no duplicates** — $\{1, 1, 2\} = \{1, 2\}$. In DA/DS, you work with sets every time you deduplicate a column, extract unique values, or write `set()` in Python. Understanding set semantics prevents errors like double-counting, missed duplicates, and incorrect group counts. SQL's `DISTINCT` keyword enforces set semantics on query results.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Define a collection of elements"] --> B["Write elements inside { }"] B --> C["Set properties: unordered + no duplicates"] C --> D["Unordered: {1,2,3} = {3,1,2}"] C --> E["No duplicates: {1,1,2} = {1,2}"] B --> F["Roster (explicit): {1, 2, 3, 4, 5}"] B --> G["Set-builder: {x | x > 0 and x ≤ 5}"] F --> H["DA: set(df['col']) extracts unique values"] G --> I["DA: df[df['col'] > 0] is a set-builder filter"]
```
### Real-World use:
#### Situation it is used
Extracting unique values from a column: `set(df['country'])` or `df['country'].unique()`. Building lookup tables from categorical columns. Deduplication logic. Defining valid domains for validation. Set-builder notation maps directly to SQL `WHERE` clauses and pandas boolean filters. Every time you write `df[condition]`, you are defining the set $\{row : condition(row) = \text{True}\}$.
#### Problem it solves
Without explicit set semantics, collections silently accumulate duplicates. A list of customer IDs might contain the same ID twice; a set cannot. Using `set()` in Python enforces uniqueness at the data structure level, making deduplication automatic. Understanding that sets are unordered also prevents bugs where you assume a `set()` iteration returns elements in the order you inserted them.
#### How it solves the problem
A set is defined by two guarantees: uniqueness and membership. When you convert a pandas column to a set with `set(df['col'])`, Python automatically removes duplicates. When you check `x in my_set`, Python uses a hash table for $O(1)$ lookup. The mathematical definition of a set is the basis for all these operations: formal deduplication, exact membership checks, and efficient lookups.
#### Example of it used in the Working Context as DA/DS for a Business
Customer deduplication: a CRM export has 50,000 rows but the email column has repeated values from multiple touchpoints. `unique_customers = set(df['email'])` gives you the exact number of distinct customers — the cardinality of the set. Without set semantics, `len(df)` would overcount.
### The Formula (Fragment-First)
Breaking the notation: - $\{ \}$: curly braces — the standard mathematical symbol for a set. Also written in Python as `set()` (note: `{}` in Python creates an empty dict, not a set).
- Elements inside: separated by commas. E.g., $\{1, 2, 3\}$.
- **Roster form (extension)**: list every element explicitly: $A = \{1, 2, 3, 4, 5\}$.
- **Set-builder form (comprehension)**: $A = \{x \mid P(x)\}$ — "the set of all $x$ such that property $P(x)$ is true." The $\mid$ or $:$ reads "such that." E.g., $\{x \mid x \in \mathbb{Z}, 1 \leq x \leq 5\} = \{1, 2, 3, 4, 5\}$. Key properties:
- **Unordered**: $\{1, 2, 3\} = \{3, 2, 1\}$.
- **No duplicates**: $\{1, 1, 2\} = \{1, 2\}$.
- **Membership**: $2 \in \{1, 2, 3\}$ is True; $5 \in \{1, 2, 3\}$ is False.
- **Cardinality**: $|\{1, 2, 3\}| = 3$ (number of distinct elements).
### Formula-to-English Translation
"$\{ \}$ is the delimiter that says: 'everything inside here is a set — an unordered collection of unique things.' If you write the same element twice inside the braces, it still counts as one. If you reorder the elements, it is the same set. The braces are to sets what square brackets `[]` are to ordered lists in Python — but with the uniqueness and unordered guarantees baked in." ### Critical Concepts
1. **`{}` in Python is a dict, not a set**: `type({})` returns `dict`. To create an empty set in Python: `set()`. To create a set with elements: `{1, 2, 3}` (non-empty literal works). This is the single most common Python set gotcha.
2. **Set-builder in pandas**: `df[df['revenue'] > 1000]` is the pandas translation of $\{row \mid row.\text{revenue} > 1000\}$. Python list comprehensions `[x for x in data if x > 0]` directly mirror set-builder notation (but return a list, not a set).
3. **SQL `DISTINCT`**: `SELECT DISTINCT country FROM customers` applies set semantics to the result — duplicates removed, order not guaranteed. This is the SQL equivalent of $\{\text{country} : \text{country} \in \text{customers}\}$.
4. **Frozenset for hashable sets**: Python `frozenset` is an immutable set — it can be used as a dictionary key or stored inside another set. Useful when sets themselves need to be set elements (e.g., a set of feature subsets for feature selection).
5. **Set comprehension in Python**: `{x**2 for x in range(5)}` creates `{0, 1, 4, 9, 16}` — directly mirrors set-builder notation $\{x^2 : x \in \{0, 1, 2, 3, 4\}\}$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: find the unique set of countries from a transaction log. *Step 1: Start with raw data (list with duplicates)*
Raw: $[\text{"AT"}, \text{"DE"}, \text{"AT"}, \text{"US"}, \text{"DE"}, \text{"AT"}]$. *Step 2: Apply set semantics (remove duplicates, unordered)*
Unique elements: $\{\text{"AT"}, \text{"DE"}, \text{"US"}\}$. *Step 3: Compute cardinality and verify*
$|\{\text{"AT"}, \text{"DE"}, \text{"US"}\}| = 3$.
The original list had 6 elements; the set has 3 — 3 duplicates were collapsed. *Step 4: Set-builder equivalent*
$\{\text{country} \mid \text{country} \in \text{transactions}\} = \{\text{"AT"}, \text{"DE"}, \text{"US"}\}$ — "the set of all country values that appear in the transactions table." ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Set definition and notation in Python # Roster form: explicit elements
A = {1, 2, 3, 4, 5}
print(f"A = {A}")
print(f"|A| = {len(A)}")
print(f"Type: {type(A)}") # Sets remove duplicates automatically
raw_list = [1, 2, 2, 3, 3, 3, 4]
deduplicated = set(raw_list)
print(f"\nRaw list: {raw_list} (len = {len(raw_list)})")
print(f"As set: {deduplicated} (len = {len(deduplicated)})") # Unordered: equality ignores insertion order
print(f"\n{{1,2,3}} == {{3,1,2}}: {{1,2,3} == {3,1,2}}") # True # CRITICAL: {} is a dict, not a set!
empty_dict = {}
empty_set = set()
print(f"\ntype({{}}) = {type(empty_dict)} ← DICT, not set!")
print(f"type(set()) = {type(empty_set)} ← correct empty set") # Set comprehension (mirror of set-builder notation)
squares = {x**2 for x in range(6)}
print(f"\nSet comprehension {{x² : x ∈ {{0..5}}}} = {squares}") # Pandas: set semantics on a DataFrame column
import pandas as pd df = pd.DataFrame({ "country": ["AT", "DE", "AT", "US", "DE", "AT", "GB"], "revenue": [100, 200, 150, 300, 80, 90, 400],
}) unique_countries = set(df["country"])
print(f"\nColumn values (with duplicates): {df['country'].tolist()}")
print(f"Unique set: {unique_countries}")
print(f"Cardinality |set|: {len(unique_countries)}")
print(f"pandas .unique(): {df['country'].unique()}")
print(f"SQL DISTINCT equivalent — same result: {set(df['country'].unique())}")
```
#### Beginner friendly Example [R])
``` r
# Set definition in R (using unique() and set functions) # Roster form (vector in R; sets use unique())
raw_vec <- c(1, 2, 2, 3, 3, 3, 4)
unique_set <- unique(raw_vec) cat("Raw vector:", raw_vec, "\n")
cat("Unique (set):", unique_set, "\n")
cat("Cardinality:", length(unique_set), "\n") # Unordered equality: setequal()
A <- c(1, 2, 3)
B <- c(3, 1, 2)
cat(sprintf("\nsetequal({1,2,3}, {3,1,2}): %s\n", setequal(A, B))) # TRUE # Set-builder equivalent: filter + unique
transactions <- data.frame( country = c("AT", "DE", "AT", "US", "DE", "AT", "GB"), revenue = c(100, 200, 150, 300, 80, 90, 400), stringsAsFactors = FALSE
) # Set of all countries appearing in transactions
country_set <- unique(transactions$country)
cat("\nAll distinct countries:", country_set, "\n")
cat("Cardinality:", length(country_set), "\n") # Set-builder: countries with revenue > 200
high_rev_countries <- unique(transactions$country[transactions$revenue > 200])
cat("Countries with revenue > 200:", high_rev_countries, "\n")
```
#### Final Professional Example [Python])
``` python
import pandas as pd
import numpy as np
from typing import Any # Scenario: multi-column deduplication and uniqueness audit using set semantics np.random.seed(42)
N = 500 # Simulate transaction log with intentional duplicates
raw_df = pd.DataFrame({ "transaction_id": np.random.randint(1, 200, N), # IDs repeat (duplicates) "customer_email": np.random.choice( ["a@x.com", "b@x.com", "c@x.com", "d@x.com", "e@x.com"], N ), "country": np.random.choice(["AT", "DE", "US", "GB", "CH"], N), "channel": np.random.choice(["organic", "paid", "email"], N), "revenue": np.random.uniform(10, 1000, N).round(2),
}) def set_audit(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame: """ Report cardinality (unique set size) for specified columns. Args: df: Input DataFrame. columns: List of column names to audit. Returns: DataFrame with column name, total values, unique values, and duplicate count. """ rows = [] for col in columns: total = len(df[col]) unique = len(set(df[col])) # set semantics: dedup + unordered dupes = total - unique rows.append({ "column": col, "total_values": total, "unique_values": unique, "duplicates": dupes, "duplicate_pct": round(dupes / total * 100, 1), }) return pd.DataFrame(rows) audit = set_audit(raw_df, ["transaction_id", "customer_email", "country", "channel"]) print("Set Cardinality Audit (uniqueness via set semantics)")
print("=" * 60)
print(audit.to_string(index=False)) # Set-builder: customers who purchased in both AT and DE
at_customers = set(raw_df[raw_df["country"] == "AT"]["customer_email"])
de_customers = set(raw_df[raw_df["country"] == "DE"]["customer_email"]) cross_market = at_customers & de_customers # set intersection print(f"\nSet-builder results:")
print(f" AT customers: {len(at_customers)}")
print(f" DE customers: {len(de_customers)}")
print(f" Cross-market (AT ∩ DE): {cross_market}")
print(f" Unique to AT only: {len(at_customers - de_customers)}")
print(f" Unique to DE only: {len(de_customers - at_customers)}")
```
#### Final Professional Example [R]
``` r
# Set-builder style: customers in AT, DE, and cross-market (set intersection) set.seed(42)
raw_df <- data.frame( customer_email = paste0("u", sample(1:200, 100, replace = TRUE), "@x.com"), country = sample(c("AT", "DE", "CH"), 100, replace = TRUE)
)
at_customers <- unique(raw_df$customer_email[raw_df$country == "AT"])
de_customers <- unique(raw_df$customer_email[raw_df$country == "DE"])
cross_market <- intersect(at_customers, de_customers) cat("Set-builder results:\n")
cat(" AT customers: ", length(at_customers), "\n")
cat(" DE customers: ", length(de_customers), "\n")
cat(" Cross-market (AT ∩ DE):", length(cross_market), "\n")
cat(" Unique to AT only: ", length(setdiff(at_customers, de_customers)), "\n")
cat(" Unique to DE only: ", length(setdiff(de_customers, at_customers)), "\n")
```
---
AIO pag 30 of 286