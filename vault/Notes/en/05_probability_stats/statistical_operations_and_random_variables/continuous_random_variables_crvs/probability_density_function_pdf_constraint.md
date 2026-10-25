---
publish: true
date: '2026-04-16'
tags:
- probability-statistics
---

# Probability Density Function (PDF) Constraint

$$
\int_{-\infty}^\infty f(x) dx = 1
$$

and $f(x) \ge 0$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
These are the two axioms that any valid PDF must satisfy: non-negativity and normalization. A PDF is NOT a probability (it can exceed 1 in value), but it integrates to 1 over the full support. Used as a validity check for custom distributions, kernel density estimates, and any continuous likelihood function.

## Flowchart

```mermaid
flowchart LR
    A["Propose a function f(x) as PDF"] --> B["Check 1: f(x) >= 0 for all x"]
    B --> C["Check 2: ∫f(x)dx = 1 over full support"] C -- Both
    pass --> D["Valid PDF"] C -- Either
    fails --> E["Invalid: not a probability density"]
```

## Real-world use

### Where it is used

Validating KDE (kernel density estimation) outputs, custom likelihood functions in Bayesian models, and any time a continuous density function is constructed from data.

### Problem it solves

Establishes necessary conditions for any continuous function to be a valid probability density — a prerequisite for all CRV-based probability calculations.

### How it solves the problem

Non-negativity ensures probabilities are never negative. Normalization ensures the total probability over all outcomes is 100%.

### Example in a business

KDE for session duration distribution: after fitting `scipy.stats.gaussian_kde`, verify normalization numerically with `scipy.integrate.quad`. Used to validate the density before using it for probability interval estimates.

## The formula, piece by piece

$\int_{-\infty}^{\infty} f(x) \, dx = 1$ AND $f(x) \geq 0 \, \forall x$
- $f(x)$: the probability density function.
- The integral equals 1: total probability is 100%.
- $f(x) \geq 0$: densities are non-negative (but CAN exceed 1).

## The formula in words

"A valid PDF must be non-negative everywhere and integrate to 1 over its full domain."

## Critical Concepts

- PDF value $f(x)$ is NOT a probability; $f(x) \, dx$ is an infinitesimal probability.
- $P(a \leq X \leq b) = \int_a^b f(x) dx$ (not $f(a)$ or $f(b)$).
- Normal PDF peaks at $\approx 0.399$ at $x = \mu$: exceeds 1 if $\sigma < 0.399$.
- Python: `from scipy.integrate import quad; quad(pdf, -np.inf, np.inf)`.

## Step-by-step calculation (tiny example)

*Step 1: Proposed PDF on [0,1]: $f(x) = 2x$*

*Step 2: Check non-negativity*
$2x \geq 0$ for all $x \in [0,1]$. Passes.

*Step 3: Check normalization*
$\int_0^1 2x \, dx = [x^2]_0^1 = 1 - 0 = 1$. Passes.

*Step 4: Conclusion*
$f(x) = 2x$ on $[0,1]$ is a valid PDF.

## Code examples

### Beginner example (Python)

```python
from scipy.integrate import quad
from scipy.stats import norm   # Verify standard normal PDF integrates to 1
pdf = lambda x: norm.pdf(x)
result, error = quad(pdf, -20, 20)   # approximate -inf to +inf
print(f"Integral of standard normal PDF: {result:.8f}")   # ~1.0
print(f"Numerical error: {error:.2e}")   # Verify non-negativity
import numpy as np
x_grid = np.linspace(-5, 5, 1000)
print(f"All non-negative: {(norm.pdf(x_grid) >= 0).all()}")
```

### Beginner example (R)

```r
# Verify standard normal integrates to 1
result <- integrate(dnorm, lower=-Inf, upper=Inf)
cat(sprintf("Integral: %.8f (error: %.2e)\n", result$value, result$abs.error))
```

### Professional example (Python)

```python
import numpy as np
from scipy.integrate import quad
from scipy.stats import gaussian_kde

def validate_pdf(
    pdf_func: callable,
    support_lower: float = -np.inf,
    support_upper: float = np.inf,
    tolerance: float = 1e-4,
) -> dict[str, bool | float]:
    """
    Validate that a function satisfies PDF axioms.

    Args:
        pdf_func: Candidate PDF function f(x).
        support_lower: Lower bound of support.
        support_upper: Upper bound of support.
        tolerance: Tolerance for normalization check.

    Returns:
        Dict with normalization integral, non-negativity check, and validity.
    """
    # quad needs a scalar; gaussian_kde returns a length-1 array for a scalar x
    integral, int_error = quad(
        lambda x: np.asarray(pdf_func(x)).item(), support_lower, support_upper, limit=200
    )
    # Sample 1000 points to check non-negativity
    check_points = np.linspace(
        max(support_lower, -100), min(support_upper, 100), 1000
    )
    all_nonneg = bool(np.all(pdf_func(check_points) >= -1e-10))
    normalized = abs(integral - 1.0) < tolerance
    return {
        "integral": integral,
        "integral_error": int_error,
        "all_nonneg": all_nonneg,
        "normalized": normalized,
        "valid_pdf": all_nonneg and normalized,
    }


# Test KDE density
rng = np.random.default_rng(seed=42)
sample_data = rng.lognormal(3, 1, 500)
kde = gaussian_kde(sample_data)
result = validate_pdf(kde, support_lower=0, support_upper=np.inf)
print("KDE PDF validation:")
for key, val in result.items():
    print(f" {key}: {val}")
```

---

*Source: AIO p. 85*
