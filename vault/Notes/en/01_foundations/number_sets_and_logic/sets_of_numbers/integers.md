---
title: Integers
date: '2026-04-16'
wordCount: 750
slug: integers
permalink: /notes/01_foundations/number_sets_and_logic/sets_of_numbers/integers/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The **integers** $\mathbb{Z}$ extend the whole numbers to include all negative whole numbers: $\{\ldots, -3, -2, -1, 0, 1, 2, 3, \ldots\}$. The symbol $\mathbb{Z}$ comes from the German *Zahlen* (numbers). Adding negatives closes the set under subtraction — any integer minus any integer is still an integer. In DA/DS, integers are the workhorse type for: differences (change in revenue, delta between periods), temperature, profit/loss, error counts, signed offsets, floor/ceiling operations, and any signed discrete quantity.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["ℕ₀ = {0, 1, 2, ...}"] --> B["Add negatives: extend to ℤ"] B --> C["Integers ℤ = {..., -2, -1, 0, 1, 2, ...}"] C --> D["Closed under +, −, ×"] D --> E["NOT closed under ÷: 7 ÷ 2 = 3.5 (not ℤ)"] C --> F["DA/DS: profit/loss, deltas, signed IDs, offsets"] F --> G["Pandas int64 / SQL INTEGER covers ℤ"] C --> H["Division closes only in ℚ"]
```
### Real-World use:
#### Situation it is used
Period-over-period change: revenue delta can be negative (decline). Temperature data: below-zero is valid. Profit/loss accounting: loss is a negative integer or decimal. SQL `DATEDIFF` returns an integer (can be negative if end < start). Lag features in time-series: `df['lag_1'] = df['value'].shift(1)` — differences are integers (if the original data is integer-valued). Array offsets and strides.
#### Problem it solves
Without negatives, you cannot represent decrease, deficit, or backward movement. Using unsigned integers (natural numbers) when the quantity can be negative silently wraps around (integer overflow) or raises an error. The integer type formalizes signed discrete quantities with predictable arithmetic.
#### How it solves the problem
$\mathbb{Z}$ is closed under $+$, $-$, and $\times$ — the three arithmetic operations you need for most data transformations. In Python, `int` is $\mathbb{Z}$-typed (arbitrary precision). In pandas, `int64` covers the practical range $[-2^{63}, 2^{63}-1]$. In SQL, `INTEGER` or `BIGINT` types store $\mathbb{Z}$ values.
#### Example of it used in the Working Context as DA/DS for a Business
Revenue change: `SELECT product_id, revenue_this_month - revenue_last_month AS revenue_delta FROM monthly_revenue`. The result is an integer (assuming integer-valued revenues) that can be positive (growth), zero (flat), or negative (decline). All three outcomes are valid integers.
### The Formula (Fragment-First)
Breaking the notation: - $\mathbb{Z}$: blackboard-bold Z, from German *Zahlen*. The set extends infinitely in both directions.
- $\{\ldots, -2, -1, 0, 1, 2, \ldots\}$: ellipses on both sides indicate the set extends without bound in the negative and positive directions.
- Containment: $\mathbb{N} \subset \mathbb{N}_0 \subset \mathbb{Z}$ Key properties of $\mathbb{Z}$:
- **Closed under addition**: $a + b \in \mathbb{Z}$
- **Closed under subtraction**: $a - b \in \mathbb{Z}$ — the key extension over $\mathbb{N}_0$
- **Closed under multiplication**: $a \times b \in \mathbb{Z}$
- **NOT closed under division**: $7 \div 2 = 3.5 \notin \mathbb{Z}$ (need $\mathbb{Q}$)
- **Integer division** (floor division): $7 \mathbin{//} 2 = 3 \in \mathbb{Z}$ — stays in $\mathbb{Z}$ but loses precision Useful subsets:
- $\mathbb{Z}^+ = \{1, 2, 3, \ldots\} = \mathbb{N}$
- $\mathbb{Z}^- = \{-1, -2, -3, \ldots\}$
- $\mathbb{Z}^* = \mathbb{Z} \setminus \{0\}$ (non-zero integers) ### Formula-to-English Translation
"$\mathbb{Z}$ is all whole numbers: positive, negative, and zero. No fractions. Fully closed under addition, subtraction, and multiplication. The moment you need a result that can go negative — change, delta, profit minus loss — you need $\mathbb{Z}$, not $\mathbb{N}$." ### Critical Concepts
1. **Integer overflow**: pandas `int8` holds $[-128, 127]$. Storing a revenue delta of $-200$ in `int8` causes overflow. Always check the range before choosing a dtype. `int64` is the safe default for most business integers.
2. **Integer division vs. true division**: Python 2 used integer division by default (`5 / 2 = 2`). Python 3 uses true division (`5 / 2 = 2.5`). Use `//` for floor division, `/` for true division. In SQL, integer-divided-by-integer returns an integer in some dialects (Postgres returns integer; BigQuery returns float).
3. **Negative modulo**: in Python, `-7 % 3 = 2` (result has the sign of the divisor). In C/Java, `-7 % 3 = -1` (result has the sign of the dividend). Be careful when using modulo with negative integers across languages.
4. **DATEDIFF pitfall**: `DATEDIFF('2024-01-01', '2024-03-01')` in MySQL returns a negative integer (-59). Always check argument order; the sign carries meaning.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: compute a period-over-period revenue delta for three products. *Step 1: Raw data*
| Product | Month 1 Revenue ($) | Month 2 Revenue ($) |
|---------|---------------------|---------------------|
| A | 1000 | 1200 |
| B | 800 | 600 |
| C | 500 | 500 | *Step 2: Compute delta (integer subtraction)*
- A: $1200 - 1000 = +200$ (growth)
- B: $600 - 800 = -200$ (decline)
- C: $500 - 500 = 0$ (flat) *Step 3: Interpret*
All results are in $\mathbb{Z}$. Positive = growth, negative = decline, zero = flat. The sign carries business meaning. If you used `uint` (no negatives), B's result would overflow or error.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Integers ℤ = {..., -2, -1, 0, 1, 2, ...} import pandas as pd
import numpy as np np.random.seed(42) # Closure demonstration
a, b = 7, -3
print(f"Closed under addition: {a} + {b} = {a + b} (ℤ: {isinstance(a + b, int)})")
print(f"Closed under subtraction: {a} - {b} = {a - b} (ℤ: {isinstance(a - b, int)})")
print(f"Closed under multiplication: {a} × {b} = {a * b} (ℤ: {isinstance(a * b, int)})")
print(f"NOT closed under division: {a} / {b} = {a / b:.4f} (ℤ: False — use // for floor div)")
print(f"Floor division stays in ℤ: {a} // {b} = {a // b}") # Period-over-period delta: always in ℤ
df = pd.DataFrame({ "product": ["A", "B", "C", "D", "E"], "revenue_m1": np.random.randint(100, 2000, 5), "revenue_m2": np.random.randint(100, 2000, 5),
}) df["delta"] = df["revenue_m2"] - df["revenue_m1"] # integer subtraction → ℤ
df["direction"] = df["delta"].apply( lambda x: "growth" if x > 0 else ("flat" if x == 0 else "decline")
) print("\nPeriod-over-Period Revenue Delta:")
print(df.to_string(index=False))
print(f"\ndelta dtype: {df['delta'].dtype} ← int64 stores all of ℤ within range")
print(f"Positive deltas (growth): {(df['delta'] > 0).sum()}")
print(f"Negative deltas (decline): {(df['delta'] < 0).sum()}")
print(f"Zero deltas (flat): {(df['delta'] == 0).sum()}")
```
#### Beginner friendly Example [R])
``` r
# Integers ℤ in R # Base R integer type covers ℤ (within machine limits)
a <- 7L
b <- -3L cat(sprintf("Closed under +: %d + %d = %d\n", a, b, a + b))
cat(sprintf("Closed under -: %d - %d = %d\n", a, b, a - b))
cat(sprintf("Closed under ×: %d × %d = %d\n", a, b, a * b))
cat(sprintf("NOT closed /: %d / %d = %.4f (use %% %% for modulo)\n", a, b, a / b)) # Period-over-period delta
set.seed(42)
df <- data.frame( product = c("A", "B", "C", "D", "E"), revenue_m1 = sample(100L:2000L, 5L), revenue_m2 = sample(100L:2000L, 5L)
) df$delta <- df$revenue_m2 - df$revenue_m1
df$direction <- ifelse(df$delta > 0L, "growth", ifelse(df$delta == 0L, "flat", "decline")) cat("\nPeriod-over-Period Revenue Delta:\n")
print(df) cat(sprintf("\nGrowth: %d | Flat: %d | Decline: %d\n", sum(df$delta > 0L), sum(df$delta == 0L), sum(df$delta < 0L)))
```
#### Final Professional Example [Python])
``` python
import pandas as pd
import numpy as np # Scenario: signed integer metrics in a time-series KPI report
# Key insight: change metrics live in ℤ — they must allow negatives np.random.seed(42)
N_DAYS = 90 dates = pd.date_range("2024-01-01", periods=N_DAYS, freq="D")
df = pd.DataFrame({ "date": dates, "sessions": np.random.randint(100, 5000, N_DAYS), "revenue": np.random.randint(500, 20_000, N_DAYS), "errors": np.random.randint(0, 100, N_DAYS),
}) def compute_deltas(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame: """ Compute day-over-day integer deltas for specified columns. Args: df: DataFrame sorted by date ascending. columns: Numeric columns to diff. Returns: DataFrame with new delta columns (dtype int64, ℤ). """ result = df.copy() for col in columns: delta_col = f"{col}_delta" result[delta_col] = result[col].diff().fillna(0).astype("int64") return result df = compute_deltas(df, columns=["sessions", "revenue", "errors"]) # Verify integer dtype (ℤ semantics) and allow negatives
for col in ["sessions_delta", "revenue_delta", "errors_delta"]: assert df[col].dtype == "int64", f"{col} must be int64" print("Daily KPI Report with Integer Deltas (ℤ)")
print("=" * 50)
print(f" Shape: {df.shape}")
print(f" Delta dtypes: {df'sessions_delta','revenue_delta','errors_delta'.dtypes.to_dict()}") # Summary: range and sign distribution
for col in ["sessions_delta", "revenue_delta", "errors_delta"]: pos = (df[col] > 0).sum() neg = (df[col] < 0).sum() zero = (df[col] == 0).sum() print(f"\n {col}:") print(f" Range: [{df[col].min()}, {df[col].max()}] ← spans ℤ (negative to positive)") print(f" Up / Flat / Down: {pos} / {zero} / {neg}") print("\nSample (last 5 days):")
print(df.tail(5)"date", "sessions", "sessions_delta", "revenue", "revenue_delta" .to_string(index=False))
```
#### Final Professional Example [R]
``` r
# Integer deltas: sessions_delta, revenue_delta in ℤ (can be negative) set.seed(42)
dates <- seq(as.Date("2024-01-01"), by = "day", length.out = 30)
sessions <- cumsum(sample(-5:10, 30, replace = TRUE))
revenue <- cumsum(sample(-20:50, 30, replace = TRUE))
df <- data.frame(date = dates, sessions = sessions, revenue = revenue)
df$sessions_delta <- c(NA, diff(df$sessions))
df$revenue_delta <- c(NA, diff(df$revenue))
cat(" sessions_delta / revenue_delta span ℤ (negative to positive)\n")
cat("Sample (last 5 days):\n")
print(tail(df[, c("date", "sessions", "sessions_delta", "revenue", "revenue_delta")], 5))
```
---
1300 pag 15