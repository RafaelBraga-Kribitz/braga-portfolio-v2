---
publish: true
date: '2026-04-16'
tags:
- probability-statistics
---

# PDF

$$
f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2\right)
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
This is the probability density function of the Normal (Gaussian) distribution $N(\mu, \sigma^2)$. The most important distribution in statistics: justified by the Central Limit Theorem (sums of i.i.d. variables converge to Normal), it describes measurement errors, natural variation, and is the foundation for z-tests, t-tests, linear regression residuals, and Bayesian Gaussian priors.

## Flowchart

```mermaid
flowchart LR
    A["Normal N(μ, σ²)"] --> B["Bell curve: symmetric around μ"]
    B --> C["PDF: f(x) = exp(-0.5*((x-μ)/σ)²) / (σ√(2π))"]
    C --> D["Peak at x=μ, width controlled by σ"]
    D --> E["CLT: sums of i.i.d. variables → Normal"]
```

## Real-world use

### Where it is used

Modeling measurement noise, natural biological variation, financial returns (approximately), sampling distributions of means (CLT), residuals in linear regression (OLS assumption), and prior distributions in Bayesian models.

### Problem it solves

Provides a tractable, fully characterized distribution for continuous symmetric data with known mean and variance.

### How it solves the problem

The exponential of a negative quadratic term ensures the density peaks at $\mu$ and falls off symmetrically, with the normalization constant $1/(\sigma\sqrt{2\pi})$ ensuring the integral = 1.

### Example in a business

OLS linear regression assumption: residuals $\epsilon \sim N(0, \sigma^2)$. Used to validate the model (Q-Q plot, Shapiro-Wilk test) and derive confidence intervals for predictions.

## The formula, piece by piece

$f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$
- $\mu$: mean (location parameter — where the peak is).
- $\sigma^2$: variance (scale parameter — how wide the bell is).
- $\sigma\sqrt{2\pi}$: normalization constant.
- Exponent: $-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2$ — negative, quadratic in $z$-score.

## The formula in words

"The Normal PDF is a bell curve centered at μ, with spread σ, normalized so the total area equals 1."

## Critical Concepts

- Standard Normal: $\mu=0, \sigma=1$ — denoted $\phi(z)$.
- 68-95-99.7 rule: 68% within $\mu \pm \sigma$, 95% within $\mu \pm 2\sigma$, 99.7% within $\mu \pm 3\sigma$.
- Fully characterized by $\mu$ and $\sigma^2$ — the sufficient statistics.
- Python: `scipy.stats.norm.pdf(x, loc=mu, scale=sigma)`.

## Step-by-step calculation (tiny example)

*Step 1: Standard normal, x=0*
$f(0) = \frac{1}{\sqrt{2\pi}} e^0 = \frac{1}{\sqrt{2\pi}} \approx 0.3989$

*Step 2: Interpret*
The peak density of the standard normal is ~0.399 — NOT a probability, but a density value.

*Step 3: Probability check*
$P(-1 \leq Z \leq 1) = \Phi(1) - \Phi(-1) \approx 0.683$.

## Code examples

### Beginner example (Python)

```python
from scipy.stats import norm
import numpy as np
mu, sigma = 100, 15   # IQ distribution
x = 130
density = norm.pdf(x, loc=mu, scale=sigma)
p_above = 1 - norm.cdf(x, loc=mu, scale=sigma)
print(f"f(130) = {density:.6f} (density, not probability)")
print(f"P(IQ > 130) = {p_above:.4f} ({p_above*100:.2f}%)")
```

### Beginner example (R)

```r
mu <- 100; sigma <- 15
cat(sprintf("f(130) = %.6f\n", dnorm(130, mu, sigma)))
cat(sprintf("P(IQ > 130) = %.4f\n", pnorm(130, mu, sigma, lower.tail=FALSE)))
```

### Professional example (Python)

```python
import numpy as np
from scipy.stats import norm, shapiro
from sklearn.linear_model import LinearRegression

def validate_regression_residuals( y_true: np.ndarray, y_pred: np.ndarray, significance_level: float = 0.05 ) -> dict[str, float | bool]:
    """Check OLS residual normality assumption. Args: y_true: Observed target values. y_pred: Model predictions. significance_level: Alpha for Shapiro-Wilk test. Returns: Dict with normality test and distribution fit stats. """
    residuals = y_true - y_pred
    stat, p_value = shapiro(residuals[:5000] if len(residuals) > 5000 else residuals)
    mu_resid = residuals.mean()
    sigma_resid = residuals.std()
    return { "residual_mean": float(mu_resid), "residual_std": float(sigma_resid), "shapiro_statistic": float(stat), "shapiro_p_value": float(p_value), "normality_not_rejected": p_value > significance_level, }
rng = np.random.default_rng(seed=42)
n = 1_000
X = rng.normal(0, 1, (n, 3))
y = 2*X[:,0] + 3*X[:,1] - X[:,2] + rng.normal(0, 1, n)
model = LinearRegression().fit(X, y)
y_pred = model.predict(X)
result = validate_regression_residuals(y, y_pred)
print("Residual normality check:")
for key, val in result.items():
    print(f" {key}: {val}")
```

---

*Source: domain knowledge*
