---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Factorial

$$
n! = 1 \cdot 2 \cdot 3 \dots n
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
$n!$ (read "n factorial") is the product of all positive integers from 1 up to $n$. It counts the number of ways to arrange $n$ distinct items in a sequence. Factorials appear constantly in combinatorics (which underpins probability and statistics), in the formulas for combinations and permutations, in Taylor series expansions of $e^x$, $\sin$, and $\cos$, and in the denominator of many probability mass functions (Poisson, Binomial). If you have seen $\binom{n}{k}$ (n-choose-k), its denominator is $k!(n-k)!$.

## Flowchart

```mermaid
flowchart TD
    A["Input: n (non-negative integer)"] --> B{"n == 0 or n == 1?"} B -- "Yes (base case)" --> C["Return 1"] B -- "No" --> D["Multiply: n * (n-1) * (n-2) * ... * 2 * 1"]
    D --> E["Result: n!"]
    C --> F["Key: 0! = 1 by convention (not a coincidence)"]
    E --> G["Result grows extremely fast: 10! = 3628800, 20! approx 2.4e18"]
```

## Real-world use

### Where it is used

Counting arrangements and selections in probability, computing combination and permutation formulas, appearing in Taylor series (used in deriving logistic regression and probability distributions), and in the denominator of Poisson PMF ($P(X=k) = e^{-\lambda} \lambda^k / k!$).

### Problem it solves

How many ways can you arrange 5 different products on a shelf? The answer is $5! = 120$. How many ways can a recommendation engine rank 10 items? $10! = 3{,}628{,}800$. Factorial gives you the exact count of ordered arrangements, which is the foundation of probability calculations involving sequences.

### How it solves the problem

Each position in a sequence reduces your remaining choices by one. For $n$ items: first position has $n$ options, second has $n-1$, ..., last has 1. Multiplying these choices gives $n \times (n-1) \times \cdots \times 1 = n!$.

### Example in a business

Computing the probability of a specific sequence of events in a Poisson process. The Poisson PMF is $P(X=k) = e^{-\lambda} \lambda^k / k!$. The $k!$ in the denominator prevents overcounting all the orderings of $k$ identical events. Without it, you would be treating "3 events in order ABC" as different from "3 events in order BAC" when in reality they are the same count.

## The formula, piece by piece

Breaking the notation:

- $n$: any non-negative integer.
- $!$: the factorial operator. Postfix notation (written after the number).
- $\cdot$: multiplication.
- $\dots$: "continuing the pattern." Full recursive definition:

$$
n! = \begin{cases} 1 & \text{if } n = 0 \text{ or } n = 1 \\ n \times (n-1)! & \text{if } n \geq 2 \end{cases}
$$

Expanded (product notation): $n! = \prod_{k=1}^{n} k = 1 \times 2 \times 3 \times \cdots \times n$ Key values to memorize:
- $0! = 1$ (by convention and by the empty product rule)
- $1! = 1$
- $2! = 2$
- $3! = 6$
- $4! = 24$
- $5! = 120$
- $10! = 3{,}628{,}800$
- $20! \approx 2.43 \times 10^{18}$ (grows explosively)

## The formula in words

"$n!$ means: start at $n$, multiply by every integer below it down to 1. It counts how many distinct orderings of $n$ unique objects exist." The recursive view: "$n!$ equals $n$ times the factorial of $(n-1)$." This is because: if you have $n$ items, fix the first one ($n$ choices) and then arrange the remaining $n-1$ in $(n-1)!$ ways. Why is $0! = 1$? There is exactly one way to arrange zero objects: do nothing. The "empty arrangement" is a valid, unique arrangement. Also: it makes the combination formula $\binom{n}{0} = 1$ work cleanly.

## Critical Concepts

1. **Explosive growth**: factorials grow faster than any polynomial or exponential. $13! > 6$ billion. Be careful of overflow when computing them directly for large $n$.
2. **$0! = 1$**: not zero. This is a definition that ensures consistency in combination formulas and the empty product convention.
3. **Stirling's approximation**: $n! \approx \sqrt{2\pi n} (n/e)^n$. Used to estimate factorials of large numbers without computing them exactly.
4. **Log factorial**: for large $n$, computing $\ln(n!)$ using the log-sum-of-logs is numerically safer than computing $n!$ directly (avoids overflow). Many statistical distributions work in log-space for this reason.
5. **Combinations use factorial**: $\binom{n}{k} = \frac{n!}{k!(n-k)!}$.

The binomial coefficient counts how many ways to choose $k$ items from $n$ without regard to order.

## Step-by-step calculation (tiny example)

Input: compute $5!$.

*Step 1: Write out the product*
$5! = 5 \times 4 \times 3 \times 2 \times 1$

*Step 2: Multiply left to right*
$5 \times 4 = 20$
$20 \times 3 = 60$
$60 \times 2 = 120$
$120 \times 1 = 120$

*Step 3: Verify the interpretation*
There are exactly $120$ ways to arrange 5 distinct items (say, books on a shelf) in a row. List them mentally: with 5 choices for the first position, 4 for the second, etc.: $5 \times 4 \times 3 \times 2 \times 1 = 120$.

## Code examples

### Beginner example (Python)

```python
import math   # Python's
math.factorial()
print(math.factorial(0))   # 1 (0! = 1)
print(math.factorial(1))   # 1
print(math.factorial(5))   # 120
print(math.factorial(10))   # 3628800 # Manual implementation to understand the recursion

def factorial(n: int) -> int:
    """n! = n * (n-1) * ... * 1, with 0! = 1."""
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)
print(factorial(5))   # 120 # Log factorial (numerically safe for large n)
log_factorial_10 = sum(math.log(k) for k in range(1, 11))
print(f"ln(10!) = {log_factorial_10:.4f}")
print(f"ln(10!) = {math.log(math.factorial(10)):.4f}")   # Same
```

### Beginner example (R)

```r
# R's factorial() function
factorial(0)  # 1
factorial(1)  # 1
factorial(5)  # 120
factorial(10)  # 3628800 # Manual recursive version
my_factorial <- function(n) { if (n == 0 || n == 1)
  return(1) n * my_factorial(n - 1)
}
my_factorial(5)  # 120 # Log factorial (safer for large n)
lfactorial(10)  # log factorial: log(10!) in R
```

### Professional example (Python)

```python
import math
import numpy as np   # Scenario: computing Poisson PMF from scratch to understand where factorial is used
# P(X = k) = e^(-lambda) * lambda^k / k! def poisson_pmf(k: int, lam: float) -> float: """ Poisson probability mass function. P(X=k) = e^(-lambda) * lambda^k / k! Uses log-space arithmetic to avoid overflow for large k. """ log_prob = -lam + k * math.log(lam) - math.lgamma(k + 1)
# math.lgamma(k+1) = ln(k!) via the Gamma function: Gamma(k+1) = k! return math.exp(log_prob)
# Lambda = 3 (average 3 events per interval)
lam = 3.0
print(f"Poisson PMF with lambda={lam}:")
for k in range(0, 10):
    prob = poisson_pmf(k, lam)
bar = "#" * int(prob * 100)
print(f" P(X={k:2d}) = {prob:.4f} {bar}")   # Verify: probabilities sum to ~1
total = sum(poisson_pmf(k, lam) for k in range(0, 50))
print(f"\nSum of first 50 terms: {total:.6f}")   # Should be ~1.0
```

### Professional example (R)

```r
# Scenario: Poisson PMF from scratch; P(X=k) = e^(-lambda) * lambda^k / k! # Uses log-space: lgamma(k+1) = ln(k!)
poisson_pmf <- function(k, lam) { log_prob <- -lam + k * log(lam) - lgamma(k + 1) exp(log_prob)
}
lam <- 3.0
cat("Poisson PMF with lambda=", lam, ":\n", sep = "")
for (k in 0:9) { prob <- poisson_pmf(k, lam)
  bar <- strrep("#", as.integer(prob * 100))
  cat(sprintf(" P(X=%2d) = %.4f %s\n", k, prob, bar))
}
total <- sum(sapply(0:49, function(k) poisson_pmf(k, lam)))
cat(sprintf("\nSum of first 50 terms: %.6f\n", total))
```

---

*Source: 1300 p. 326*
