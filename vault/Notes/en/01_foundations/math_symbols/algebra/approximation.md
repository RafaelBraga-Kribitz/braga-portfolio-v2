---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Approximation

$$
\approx
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The $\approx$ symbol means **approximately equal to**. It signals that two values are close but not exactly the same. In DA/DS you use this constantly: rounding results for stakeholder reports, describing irrational constants like $\pi$ or $e$, expressing model outputs with controlled precision, and acknowledging that floating-point arithmetic on computers always introduces tiny rounding errors. Whenever you say "the accuracy is about 92%" you are implicitly using $\approx$.

## Flowchart

```mermaid
flowchart TD
    A["Exact value (e.g., sqrt(2) = 1.41421356...)"] --> B["Choose precision level for context"]
    B --> C{"Is the value rational and finite?"} C -- "Yes" --> D["Use = (exact equality)"] C -- "No / too many digits" --> E["Round to needed decimal places"]
    E --> F["Write: a approx= rounded result"]
    F --> G["Signal to reader: not exact, but close enough for purpose"]
```

## Real-world use

### Where it is used

Reporting model metrics in dashboards and exec summaries, describing mathematical constants, communicating results to non-technical stakeholders, documentation where full precision would be misleading or unreadable.

### Problem it solves

The square root of 2 is $1.41421356237...$, an infinite non-repeating decimal. Writing the full value is impossible. Writing $\sqrt{2} = 1.41$ would be wrong because it implies exactness. The $\approx$ symbol bridges the gap: you state a usable value while being mathematically honest that you rounded.

### How it solves the problem

$\approx$ explicitly tells the reader "this has been rounded or truncated, the error is small relative to the context." It is a communication convention, not a mathematical operation. It sets appropriate expectations for precision.

### Example in a business

An executive dashboard shows raw model accuracy as $0.923847$. You write: "Model accuracy $\approx 92.4\%$." You are honest that this is rounded, but the level of precision is appropriate for the business decision being made.

## The formula, piece by piece

Breaking the notation piece by piece:

- $\approx$: the "approximately equal" sign. Two wavy lines stacked (like two tildes). From the Latin *approximus*, "very near."
- Compare the family of related symbols:

- $=$ exact equality - $\approx$ approximately equal (close, rounded) - $\equiv$ identical by definition - $\cong$ congruent (same shape and size, geometry) - $\sim$ asymptotically equivalent, or "distributed as" (probability) - $\propto$ proportional to Formally: $a \approx b$ means $|a - b| < \varepsilon$ for some acceptable tolerance $\varepsilon$ agreed upon in context.

The $\varepsilon$ (epsilon) is never written explicitly; it is implied by the application.

## The formula in words

"$a \approx b$ means: the absolute difference between $a$ and $b$ is small enough to be ignored for our current purpose. We are rounding or truncating, and the result is practically useful even if not mathematically exact." Manual example: $\pi \approx 3.14159$. The exact value of $\pi$ has infinitely many non-repeating decimals. $3.14159$ is close enough for nearly all engineering and data work.

## Critical Concepts

1. **Context-dependent tolerance**: what counts as "close enough" depends on the application. In financial reconciliation, a $0.01$ difference matters. In model performance for an MVP review, it probably does not.
2. **Not transitive without checking**: if $a \approx b$ and $b \approx c$, you cannot automatically conclude $a \approx c$. Each approximation has an error. Errors accumulate.
3. **Floating-point arithmetic**: computers represent real numbers in binary with finite bits. Every floating-point operation introduces a tiny error. $0.1 + 0.2 \neq 0.3$ exactly in most languages. This is why you use tolerance checks, not exact equality, when comparing floats.
4. **Significant figures**: the number of meaningful digits you keep. More significant figures = less approximation = more precision. A result reported as $92\%$ has 2 significant figures; $92.4\%$ has 3.
5. **False precision**: reporting $92.3847\%$ accuracy from a 50-sample test set is false precision.

The sample is too small to support that many decimal places. The $\approx$ mindset helps you calibrate how many digits are actually meaningful given your data size.

## Step-by-step calculation (tiny example)

Input: express $\sqrt{2}$ to 2 decimal places.

*Step 1: Compute the exact value*
$\sqrt{2} = 1.41421356...$. This is irrational: the decimal never ends and never repeats.

*Step 2: Identify the rounding digit*
We want 2 decimal places. The value is $1.41421...$. Look at the third decimal place: it is $4$. Since $4 < 5$, we round down (leave the second decimal as $1$).

*Step 3: Write the approximation with the correct symbol*
$\sqrt{2} \approx 1.41$. Read: "The square root of 2 is approximately 1.41." The symbol $\approx$ is what makes this mathematically honest instead of mathematically wrong.

## Code examples

### Beginner example (Python)

```python
import math   # Exact value of sqrt(2): Python shows many decimal places
exact = math.sqrt(2)
print(exact)   # 1.4142135623730951 # Approximation to 2 decimal places
approx = round(exact, 2)
print(approx)   # 1.41 # Floating-point approximation trap
print(0.1 + 0.2)   # 0.30000000000000004 (NOT exactly 0.3)
print(0.1 + 0.2 == 0.3)   # False - exact comparison fails for floats
print(abs((0.1 + 0.2) - 0.3) < 1e-10)   # True - use tolerance-based comparison
```

### Beginner example (R)

```r
# Exact value of sqrt(2)
exact <- sqrt(2)
print(exact)  # 1.414214 (R shows fewer digits by default) # Approximation to 2 decimal places
approx_val <- round(exact, digits = 2)
print(approx_val)  # 1.41 # Floating-point behavior in R
print(0.1 + 0.2)  # 0.3 (R hides the tiny error in display)
print(0.1 + 0.2 == 0.3)  # FALSE (exact comparison still fails)
print(all.equal(0.1 + 0.2, 0.3))  # TRUE (all.equal uses a tolerance internally)
```

### Professional example (Python)

```python
import numpy as np   # Scenario: reporting model metrics with controlled precision for different audiences
raw_metrics = { "accuracy": 0.923847162, "precision": 0.887341209, "recall": 0.901234567, "f1_score": 0.894230451,
}   # Technical report: 4 decimal places for ML engineers
technical_report = {k: round(v, 4) for k, v in raw_metrics.items()}   # Executive report: 1 decimal place as percentage
executive_report = {k: round(v * 100, 1) for k, v in raw_metrics.items()}
print("Technical report (4 decimal places):")
for metric, value in technical_report.items():
    print(f" {metric} ≈ {value}")
print("\nExecutive report (1 decimal place, as %):")
for metric, value in executive_report.items():
    print(f" {metric} ≈ {value}%")   # Takeaway: approximation is a communication decision, not just a math one.
# The raw number has more precision than is meaningful for most audiences.
```

### Professional example (R)

```r
# Scenario: reporting model metrics with controlled precision for different audiences
raw_metrics <- list( accuracy = 0.923847162, precision = 0.887341209, recall = 0.901234567, f1_score = 0.894230451
)  # Technical report: 4 decimal places for ML engineers
technical_report <- lapply(raw_metrics, function(v) round(v, 4))  # Executive report: 1 decimal place as percentage
executive_report <- lapply(raw_metrics, function(v) round(v * 100, 1))
cat("Technical report (4 decimal places):\n")
for (nm in names(technical_report)) { cat(sprintf(" %s ≈ %s\n", nm, technical_reportnm))
}
cat("\nExecutive report (1 decimal place, as %):\n")
for (nm in names(executive_report)) { cat(sprintf(" %s ≈ %s%%\n", nm, executive_reportnm))
}
# Takeaway: approximation is a communication decision, not just a math one.
```

---

*Source: AIO p. 30 of 286*
