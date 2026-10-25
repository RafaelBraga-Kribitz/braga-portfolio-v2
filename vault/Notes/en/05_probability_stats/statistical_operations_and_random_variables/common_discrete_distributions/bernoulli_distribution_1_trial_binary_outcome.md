---
publish: true
date: '2026-04-16'
tags:
- probability-statistics
---

# Bernoulli Distribution (1 trial, binary outcome)

$$
P(X=x) = p^x (1-p)^{1-x}
$$

for $x \in \{0, 1\}$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The Bernoulli distribution models a single binary trial: success (1) with probability $p$, failure (0) with probability $1-p$. It is the building block of the Binomial distribution (sum of $n$ Bernoullis) and the foundation for logistic regression (models $P(Y=1 \mid X)$), binary classification, and conversion rate modeling.

## Flowchart

```mermaid
flowchart LR
    A["One trial: success or failure"] --> B["P(X=1) = p | P(X=0) = 1-p"]
    B --> C["PMF: p^x * (1-p)^(1-x) for x∈{0,1}"]
    C --> D["E[X] = p | Var[X] = p(1-p)"]
    D --> E["n independent Bernoullis → Binomial(n,p)"]
```

## Real-world use

### Where it is used

Binary classification target (click/no-click, churn/retain, fraud/legit). Logistic regression models $P(Y=1 \mid X)$ as the Bernoulli parameter. A/B test outcome for each user. Conversion rate is $\hat{p} = $ sample mean of Bernoulli observations.

### Problem it solves

Models the simplest possible random experiment with two outcomes — the atom from which all binary/count models are built.

### How it solves the problem

Assigns probability $p$ to outcome 1 and $1-p$ to outcome 0. The elegant PMF form $p^x(1-p)^{1-x}$ captures both cases in one expression.

### Example in a business

Click-through rate: each impression is a Bernoulli trial. $P(\text{click}_i = 1) = p$. The sum of $n$ impressions follows $\text{Binomial}(n, p)$, from which confidence intervals for CTR are derived.

## The formula, piece by piece

$P(X=x) = p^x (1-p)^{1-x}$ for $x \in \{0, 1\}$
- $p$: probability of success (the parameter).
- $x=1$: success. $x=0$: failure.
- When $x=1$: $P(X=1) = p^1(1-p)^0 = p$.
- When $x=0$: $P(X=0) = p^0(1-p)^1 = 1-p$.

## The formula in words

"The Bernoulli PMF gives probability $p$ for success and $1-p$ for failure in a single binary trial."

## Critical Concepts

- $E[X] = p$ (MLE of $p$ is sample mean).
- $Var[X] = p(1-p)$ — maximized at $p=0.5$.
- Log-loss: $-[y\log p + (1-y)\log(1-p)]$ is the negative log-likelihood of Bernoulli.
- Bernoulli vs Binomial: Bernoulli is $n=1$ Binomial.

## Step-by-step calculation (tiny example)

*Step 1: CTR = 5%, evaluate PMF*
$p = 0.05$.

*Step 2: P(click=1)*
$P(X=1) = 0.05^1 \times 0.95^0 = 0.05$

*Step 3: P(no-click=0)*
$P(X=0) = 0.05^0 \times 0.95^1 = 0.95$

*Step 4: Verify*
$0.05 + 0.95 = 1.00$. Valid.

## Code examples

### Beginner example (Python)

```python
from scipy.stats import bernoulli
p_ctr = 0.05
dist = bernoulli(p_ctr)
print(f"P(click) = {dist.pmf(1):.4f}")   # 0.05
print(f"P(no-click) = {dist.pmf(0):.4f}")   # 0.95
print(f"E[X] = {dist.mean():.4f}")   # 0.05
print(f"Var[X] = {dist.var():.6f}")   # 0.0475
```

### Beginner example (R)

```r
p_ctr <- 0.05
cat(sprintf("P(click) = %.4f\n", dbinom(1, size=1, prob=p_ctr)))  # 0.05
cat(sprintf("P(no-click) = %.4f\n", dbinom(0, size=1, prob=p_ctr)))  # 0.95
cat(sprintf("E[X] = %.4f | Var[X] = %.6f\n", p_ctr, p_ctr*(1-p_ctr)))
```

### Professional example (Python)

```python
import numpy as np
from scipy.stats import bernoulli, norm

def conversion_rate_mle_and_ci(
    observations: np.ndarray,
    confidence_level: float = 0.95,
) -> dict[str, float]:
    """Estimate Bernoulli p via MLE with asymptotic confidence interval.

    MLE: p_hat = sample mean.
    CI uses Normal approximation (Wilson better for small n).

    Args:
        observations: Binary array (0/1 outcomes).
        confidence_level: Desired CI coverage.

    Returns:
        Dict with MLE, standard error, and confidence interval.
    """
    n = len(observations)
    p_hat = observations.mean()
    se = np.sqrt(p_hat * (1 - p_hat) / n)
    z_alpha = norm.ppf(1 - (1 - confidence_level) / 2)
    return {
        "n": n,
        "p_hat": float(p_hat),
        "se": float(se),
        "ci_lower": float(max(0, p_hat - z_alpha * se)),
        "ci_upper": float(min(1, p_hat + z_alpha * se)),
        "margin_of_error": float(z_alpha * se),
    }


rng = np.random.default_rng(seed=42)
clicks = bernoulli.rvs(p=0.047, size=10_000, random_state=rng)
result = conversion_rate_mle_and_ci(clicks)
print("CTR Estimation (Bernoulli MLE):")
for key, val in result.items():
    print(f" {key}: {round(val, 6) if isinstance(val, float) else val}")
```

---

*Source: AIO p. 85*
