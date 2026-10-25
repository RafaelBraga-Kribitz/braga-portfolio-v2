---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Cardinality

$$
|A|
$$

or $\#A$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
$|A|$ (or $\#A$) is the **cardinality** of a set $A$: the number of distinct elements it contains. For a finite set, cardinality is simply the count. For $A = \{1, 2, 3\}$, $|A| = 3$. In DA/DS, cardinality is one of the most operationally important concepts: it tells you how many unique values a column contains, which determines the memory cost of categorical encoding, the number of cross-join rows, and whether a feature should be one-hot encoded or embedded. Every time you call `.nunique()` in pandas or `COUNT(DISTINCT ...)` in SQL, you are computing cardinality.

## Flowchart

```mermaid
flowchart TD
    A["Given a set A or a column"] --> B["List all elements (remove duplicates)"]
    B --> C["Count the distinct elements"]
    C --> D{["How large is |A|?"]} D -- "Small (< ~20 values)" --> E["Low cardinality: one-hot encode or factorize"] D -- "Large (hundreds to millions)" --> F["High cardinality: embed, hash, or aggregate"] D -- "= n_rows (all unique)" --> G["Identifier column: user_id, order_id, etc."] D -- "= 1 (constant)" --> H["Zero-variance feature: drop it"]
```

## Real-world use

### Where it is used

Exploratory data analysis (profiling each feature's number of unique values), choosing encoding strategy (one-hot for low-cardinality, embeddings for high-cardinality), checking primary key uniqueness ($|A| = n_{\text{rows}}$), estimating join complexity ($|A| \times |B|$ rows in a Cartesian product), and diagnosing data quality issues (a column with cardinality 1 is a constant and useless for modeling).

### Problem it solves

When you receive a new dataset, you need to know: is the "city" column 3 values or 50,000 values? This directly determines how to encode it. One-hot encoding a column with $|A| = 50{,}000$ would create 50,000 new binary columns, which is computationally and statistically disastrous. Cardinality-aware profiling prevents this mistake.

### How it solves the problem

By computing $|A|$ for each column first, you can categorize features automatically: $|A| = 1$ is a constant (drop), $|A| \leq 20$ is low-cardinality (one-hot safe), $|A| \leq 1000$ is medium-cardinality (consider target encoding or ordinal encoding), $|A| > 1000$ is high-cardinality (embeddings or hashing). The threshold depends on the problem, but checking $|A|$ first is non-negotiable.

### Example in a business

Profiling a customer transaction table before model building. You compute $|A|$ for every categorical column: `city` has $|A| = 412$, `product_category` has $|A| = 8$, `payment_method` has $|A| = 4$. Decision: one-hot encode `product_category` and `payment_method`; use target encoding for `city`. This cardinality-first approach prevents combinatorial explosions.

## The formula, piece by piece

Breaking the notation:

- $|A|$: vertical bars around a set symbol. Same bars as absolute value, but the argument is a set, not a number. Context distinguishes them.
- $\#A$: alternative notation, common in combinatorics. Same meaning.
- For finite sets: $|A|$ = number of distinct elements.
- For infinite sets: cardinality becomes a more subtle concept ($\aleph_0$, $\aleph_1$, etc.), but in DA/DS all cardinalities are finite.

Key relationships:
- $|A \cup B| = |A| + |B| - |A \cap B|$ (inclusion-exclusion principle).
- $|A \times B| = |A| \cdot |B|$ (Cartesian product size).
- $|\mathcal{P}(A)| = 2^{|A|}$ (power set: number of all subsets of $A$).

## The formula in words

"$|A|$ is the count of distinct elements in the set $A$. If $A = \{\text{red}, \text{green}, \text{blue}\}$, then $|A| = 3$. If $A = \{1, 1, 2, 3\}$, we first remove duplicates to get $\{1, 2, 3\}$, so $|A| = 3$ (sets do not repeat elements)."

## Critical Concepts

1. **Sets have no duplicates by definition**: $A = \{1, 1, 2\}$ is the same set as $A = \{1, 2\}$, so $|A| = 2$. Cardinality counts distinct elements.
2. **High-cardinality vs. low-cardinality features**: this is a practical ML concept derived from set cardinality. Feature encoding strategy depends on it.
3. **Inclusion-exclusion**: $|A \cup B| = |A| + |B| - |A \cap B|$. You subtract the intersection because those elements would be counted twice. This is used in funnel analysis (how many users completed step A OR step B).
4. **Cardinality of the power set**: the set of all subsets of $A$ has $2^{|A|}$ elements. This is why combinatorial search spaces explode: a set of 30 features has $2^{30} \approx 10^9$ possible subsets.
5. **Cardinality and memory**: in pandas, a column with $|A| = k$ unique values can be stored as a `Categorical` dtype using $O(k + n)$ memory instead of $O(n \cdot \text{string_length})$.

## Step-by-step calculation (tiny example)

Task: compute $|A \cup B|$ for $A = \{1, 2, 3, 4\}$ and $B = \{3, 4, 5, 6\}$ using inclusion-exclusion.

*Step 1: Compute |A|, |B|, and |A ∩ B|*
$|A| = 4$. $|B| = 4$. $A \cap B = \{3, 4\}$, so $|A \cap B| = 2$.

*Step 2: Apply inclusion-exclusion*
$|A \cup B| = |A| + |B| - |A \cap B| = 4 + 4 - 2 = 6$.

*Step 3: Verify by listing the union*
$A \cup B = \{1, 2, 3, 4, 5, 6\}$. Count: 6 elements. Confirmed.

## Code examples

### Beginner example (Python)

```python
# Cardinality: len() for sets, .nunique() for pandas columns
# Basic set cardinality
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}
print(f"|A| = {len(A)}")   # 4
print(f"|B| = {len(B)}")   # 4
print(f"|A ∩ B| = {len(A & B)}")   # 2
print(f"|A ∪ B| = {len(A | B)}")   # 6 (inclusion-exclusion: 4+4-2=6)
print(f"|A ∪ B| by inclusion-exclusion: {len(A) + len(B) - len(A & B)}")   # 6 # Sets remove duplicates automatically
C = {1, 1, 2, 2, 3}
print(f"\nC = {C}, |C| = {len(C)}")   # C = {1, 2, 3}, |C| = 3 # Pandas: .nunique() computes cardinality of a column
import pandas as pd
df = pd.DataFrame({"city": ["Vienna", "Graz", "Vienna", "Linz", "Graz", "Vienna"]})
print(f"\nCardinality of 'city' column: {df['city'].nunique()}")   # 3
```

### Beginner example (R)

```r
# Cardinality in R: length(unique(x)) or length(set)
A <- c(1, 2, 3, 4)
B <- c(3, 4, 5, 6)
cat("|A| =", length(unique(A)), "\n")  # 4
cat("|B| =", length(unique(B)), "\n")  # 4
cat("|A ∩ B| =", length(intersect(A, B)), "\n")  # 2
cat("|A ∪ B| =", length(union(A, B)), "\n")  # 6 # Inclusion-exclusion manually
cat("|A| + |B| - |A ∩ B| =", length(A) + length(B) - length(intersect(A, B)), "\n")  # 6 # Duplicate removal
C <- c(1, 1, 2, 2, 3)
cat("C unique count:", length(unique(C)), "\n")  # 3 # Data frame column cardinality
df <- data.frame(city = c("Vienna", "Graz", "Vienna", "Linz", "Graz", "Vienna"))
cat("Cardinality of 'city':", length(unique(df$city)), "\n")  # 3
```

### Professional example (Python)

```python
import pandas as pd
import numpy as np

# Scenario: cardinality-aware feature profiling before model encoding
np.random.seed(42)
N_ROWS = 5_000
df = pd.DataFrame({
    "user_id": range(N_ROWS),   # high card (identifier)
    "country": np.random.choice(["AT", "DE", "CH", "US"], N_ROWS),   # low card
    "city": np.random.choice([f"city_{i}" for i in range(200)], N_ROWS),   # medium card
    "product_category": np.random.choice(["electronics", "books", "clothing", "sports", "home"], N_ROWS),   # low card
    "session_source": np.random.choice(["organic", "paid", "email", "referral", "direct"], N_ROWS),   # low card
    "campaign_id": np.random.choice(range(3000), N_ROWS),   # high card
    "age_bucket": np.random.choice(["18-24", "25-34", "35-44", "45-54", "55+"], N_ROWS),   # low card
    "constant_col": ["active"] * N_ROWS,   # zero variance
})

# Cardinality profiling
cardinality_report = pd.DataFrame({
    "column": df.columns,
    "cardinality": [df[col].nunique() for col in df.columns],
    "n_rows": len(df),
})
cardinality_report["uniqueness_ratio"] = (
    cardinality_report["cardinality"] / cardinality_report["n_rows"]
)

def recommend_encoding(card: int, n: int) -> str:
    """Recommend encoding strategy based on cardinality."""
    ratio = card / n
    if card == 1:
        return "DROP (constant)"
    if ratio == 1.0:
        return "IDENTIFIER (drop or use as index)"
    if card <= 10:
        return "ONE-HOT"
    if card <= 200:
        return "TARGET ENCODE or ORDINAL"
    return "HASH or EMBED"


cardinality_report["encoding_recommendation"] = cardinality_report.apply(
    lambda row: recommend_encoding(row["cardinality"], row["n_rows"]), axis=1
)
print("Cardinality-Aware Feature Profiling")
print("=" * 65)
print(cardinality_report.to_string(index=False))
```

### Professional example (R)

```r
# Cardinality-aware feature profiling and encoding recommendation
set.seed(42)
df <- data.frame(
  user_id = sample(1:500, 1000, replace = TRUE),
  region = sample(c("N","S","E","W"), 1000, replace = TRUE),
  tier = sample(1:50, 1000, replace = TRUE)
)
n_rows <- nrow(df)
cardinality_report <- data.frame(
  column = names(df),
  cardinality = sapply(df, function(col) length(unique(col))),
  n_rows = n_rows
)
recommend_encoding <- function(card, n_rows) {
  if (card == n_rows)
    return("IDENTIFIER (drop or use as index)")
  if (card <= 10)
    return("ONE-HOT")
  if (card <= 200)
    return("TARGET ENCODE or ORDINAL")
  return("HASH or EMBED")
}
cardinality_report$encoding_recommendation <- mapply(
  recommend_encoding, cardinality_report$cardinality, cardinality_report$n_rows
)
cat("Cardinality-Aware Feature Profiling\n")
print(cardinality_report)
```

---

*Source: AIO p. 30 of 286*
