---
publish: true
date: '2026-10-26'
tags:
- probability-statistics
---

# Binomial Distribution (n trials, k successes)

$$
P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}
$$

, where $k \in \{0, 1, \dots, n\}$ and $\binom{n}{k} = \frac{n!}{k!(n-k)!}$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The Binomial distribution counts how many successes $X$ I get in $n$ independent Bernoulli trials that all share the same success probability $p$. It answers questions like "if 10% of visitors convert, how likely is it that exactly 2 of the next 20 convert?" or "how surprising is it to see 5 or more?". Its mean is $np$ and its variance is $np(1-p)$, so the spread of a count grows with $\sqrt{n}$ while the spread of the *rate* $X/n$ shrinks with $1/\sqrt{n}$, which is the whole reason bigger samples give tighter conversion-rate estimates. The two assumptions that matter in practice are independence (one user's click does not change another's) and a constant $p$ (no mix of very different segments). In DA/DS: conversion and click counts in A/B tests, number of churners in a cohort, defect counts in a batch of size $n$, exact binomial tests and Clopper-Pearson intervals for small samples, the Normal approximation behind the two-proportion z-test, and logistic regression on aggregated data (successes out of trials per row).

## Flowchart

```mermaid
flowchart LR
    A["n independent trials, same p"] --> B["Each trial is Bernoulli(p)"]
    B --> C["X = number of successes"]
    C --> D["Count orderings: n choose k"]
    D --> E["Probability of one ordering: p^k (1-p)^(n-k)"]
    E --> F["PMF = orderings × one-ordering probability"]
    F --> G["E[X] = np, Var[X] = np(1-p)"]
    G --> H["Large n: approx Normal(np, np(1-p))"]
```

## Real-world use

### Where it is used

A/B testing (conversions out of visitors per variant), email marketing (opens out of sends), churn analysis (churners out of a cohort), quality control (defective units out of a batch), LLM evaluation (correct answers out of $n$ benchmark questions), and any "successes out of trials" count.

### Problem it solves

Gives the exact probability of every possible count of successes, so I can tell whether an observed count is ordinary noise or a real signal, and put error bars on rates computed from a finite sample.

### How it solves the problem

Every specific sequence with $k$ successes and $n-k$ failures has probability $p^k(1-p)^{n-k}$ (independence lets me multiply). There are $\binom{n}{k}$ such sequences, and they are mutually exclusive, so I add them up: $\binom{n}{k}p^k(1-p)^{n-k}$. Tail sums of this PMF give p-values; inverting them gives confidence intervals.

### Example in a business

A landing page historically converts at $p = 0.10$. A new campaign sends 20 visitors and 5 convert. Is that unusual? $P(X \ge 5 \mid n=20, p=0.10) = 0.0432$, so under the old rate this would happen only about 4% of the time: a hint that the campaign converts better, worth a bigger test before drawing conclusions. The most likely outcome under the old rate is 2 conversions, with $P(X=2) = 0.2852$.

## The formula, piece by piece

- $X$: the random count of successes in the $n$ trials.
- $n$: number of trials (fixed in advance, e.g. visitors, emails sent).
- $k$: the specific count I am asking about, between $0$ and $n$.
- $p$: success probability of each single trial (the Bernoulli parameter).
- $1-p$: failure probability of each trial.
- $\binom{n}{k}$: number of ways to choose which $k$ of the $n$ trials are the successes.
- $p^k$: probability that the chosen $k$ trials all succeed.
- $(1-p)^{n-k}$: probability that the remaining $n-k$ trials all fail.
- Mean $E[X] = np$, variance $Var[X] = np(1-p)$, both from summing $n$ independent Bernoulli means and variances.

## The formula in words

"The probability of exactly $k$ successes is the number of ways to place them among the $n$ trials, times the probability of any one such arrangement." Tiny example: 5 emails, open rate 20%. $P(\text{exactly 2 opens}) = 10 \times 0.2^2 \times 0.8^3 = 10 \times 0.04 \times 0.512 = 0.2048$.

## Critical Concepts

- **Bernoulli is the atom:** $\text{Binomial}(1, p) = \text{Bernoulli}(p)$, and a Binomial is the sum of $n$ independent Bernoullis.
- **Independence matters:** clustered data (several sessions from the same user, emails to the same household) breaks independence and makes the real variance larger than $np(1-p)$ (overdispersion). Beta-Binomial or cluster-robust methods fix this.
- **Constant p matters:** mixing segments with different conversion rates also inflates variance; stratify first.
- **Normal approximation:** for large $n$ with $np \ge 10$ and $n(1-p) \ge 10$, $X \approx \text{Normal}(np, np(1-p))$. This is the basis of the two-proportion z-test. For small counts use exact binomial tests.
- **Poisson limit:** with large $n$ and small $p$ (rare events), $\text{Binomial}(n, p) \approx \text{Poisson}(\lambda = np)$.
- **MLE:** $\hat{p} = k/n$, with standard error $\sqrt{\hat{p}(1-\hat{p})/n}$.

## Step-by-step calculation (tiny example)

*Step 1: Set up*
$n = 5$ emails, $p = 0.2$ open rate, want $P(X = 2)$.

*Step 2: Count the arrangements*
$\binom{5}{2} = \frac{5!}{2!\,3!} = \frac{120}{2 \times 6} = 10$.

*Step 3: Probability of one arrangement*
$0.2^2 \times 0.8^3 = 0.04 \times 0.512 = 0.02048$.

*Step 4: Multiply*
$P(X=2) = 10 \times 0.02048 = 0.2048$.

*Step 5: Full distribution and check*
$P(X=0..5) = 0.32768, 0.40960, 0.20480, 0.05120, 0.00640, 0.00032$, summing to $1$. Mean $= 5 \times 0.2 = 1$, variance $= 5 \times 0.2 \times 0.8 = 0.8$.

## Code examples

### Beginner example (Python)

```python
from scipy.stats import binom

n, p = 5, 0.2
dist = binom(n, p)
print(f"P(X=2) = {dist.pmf(2):.4f}")   # 0.2048
for k in range(n + 1):
    print(f"P(X={k}) = {dist.pmf(k):.5f}")
print(f"Sum = {dist.pmf(range(n + 1)).sum():.4f}")   # 1.0000
print(f"E[X] = {dist.mean():.2f} | Var[X] = {dist.var():.2f}")   # 1.00 | 0.80
```

### Beginner example (R)

```r
n <- 5; p <- 0.2
cat(sprintf("P(X=2) = %.4f\n", dbinom(2, size = n, prob = p)))   # 0.2048
print(round(dbinom(0:n, size = n, prob = p), 5))
cat(sprintf("P(X >= 5 | n=20, p=0.1) = %.4f\n", 1 - pbinom(4, size = 20, prob = 0.1)))   # 0.0432
```

### Professional example (Python)

```python
import numpy as np
from scipy.stats import binom, binomtest


def campaign_conversion_check(
    conversions: int, visitors: int, baseline_rate: float
) -> dict[str, float]:
    """Exact one-sided binomial test of a campaign against a baseline conversion rate.

    Args:
        conversions: Observed successes.
        visitors: Number of trials.
        baseline_rate: Historical conversion rate p0.

    Returns:
        Dict with observed rate, expected count, exact p-value and a 95% CI.
    """
    test = binomtest(conversions, visitors, baseline_rate, alternative="greater")
    ci = test.proportion_ci(confidence_level=0.95, method="exact")
    return {
        "observed_rate": conversions / visitors,
        "expected_conversions": visitors * baseline_rate,
        "p_value_exact": test.pvalue,
        "ci_low": ci.low,
        "ci_high": ci.high,
    }


result = campaign_conversion_check(conversions=5, visitors=20, baseline_rate=0.10)
for key, val in result.items():
    print(f"{key}: {val:.4f}")
# p_value_exact = P(X >= 5 | n=20, p=0.1) = 0.0432
print(f"Check with survival function: {binom.sf(4, 20, 0.10):.4f}")

# Simulation sanity check: rate of 5+ conversions under the baseline
rng = np.random.default_rng(42)
sims = rng.binomial(n=20, p=0.10, size=200_000)
print(f"Simulated P(X >= 5): {(sims >= 5).mean():.4f}")   # close to 0.0432
```

---

*Source: domain knowledge*
