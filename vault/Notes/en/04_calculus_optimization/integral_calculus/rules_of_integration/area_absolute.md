---
title: Area (absolute)
date: '2026-04-16'
wordCount: 834
slug: area_absolute
permalink: /notes/04_calculus_optimization/integral_calculus/rules_of_integration/area_absolute/index.html
share_status: draft
publish_target: note
boundary: public
---
# $A = \int_a^b |f(x)|\,dx$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
When $f(x)$ crosses zero inside $[a, b]$, the plain definite integral $\int_a^b f(x)\,dx$ computes *signed* area: positive parts add, negative parts subtract, and they can cancel. The absolute area formula $\int_a^b |f(x)|\,dx$ ignores the sign at every point and always sums non-negative contributions. In DA/DS this distinction matters constantly: Mean Absolute Error (MAE) is the expected value of $|\hat{y} - y|$, not the expectation of the raw residual (which would be near zero for an unbiased model). Total variation of a signal, the L1 norm of a function over an interval, and Wasserstein-1 distance all involve this absolute area concept. If you use the signed integral when you need absolute area you will systematically undercount error and misread model performance.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Define f(x) and bounds a, b"] --> B["Find all zeros of f(x) on the open interval (a, b)"] B --> C["Call zeros c1, c2, ..., ck in order"] C --> D["Split: [a, c1], [c1, c2], ..., [ck, b]"] D --> E["On each sub-interval, check sign of f(x)"] E --> F["Compute the integral on each sub-interval"] F --> G["Take the absolute value of each sub-interval result"] G --> H["Sum all absolute sub-interval areas"] H --> I["Total = unsigned area under curve"]
```
### Real-World use:
#### Situation it is used
Any time a DA/DS metric computes total deviation without caring about direction: residual analysis (MAE, MAPE), total variation of a KPI time series, signal processing (L1 norm of a waveform), L1 regularization penalty as a functional, Wasserstein-1 distance between two continuous distributions, and testing for mean-reversion by measuring total oscillation.
#### Problem it solves
The plain definite integral underestimates total error whenever positive and negative residuals cancel. Consider a model that overshoots by 5 and undershoots by 5: the signed integral of residuals is 0 (looks perfect), but the absolute area is 10 (reveals real deviation). The absolute area formula always returns the correct total magnitude.
#### How it solves the problem
By wrapping $f$ in absolute value before integrating: $|f(x)|$ flips all negative portions to positive. In practice: (1) find where $f$ crosses zero, (2) split the integral at those crossings, (3) compute each piece separately, (4) add magnitudes. Numerically, `scipy.integrate.quad(lambda x: abs(f(x)), a, b)` handles it automatically.
#### Example of it used in the Working Context as DA/DS for a Business
A revenue forecasting model has residuals $e(t) = \text{actual}(t) - \text{forecast}(t)$ that oscillate around zero. Total signed error $\int e(t)\,dt \approx 0$ (bias is low, model is well-calibrated). But total absolute error $\int |e(t)|\,dt$ is large — the model has high variance, swinging wildly each day. MAE per day = $\frac{1}{T}\int_0^T |e(t)|\,dt$. Reporting only signed totals would hide the true inaccuracy of the model.
### The Formula (Fragment-First)
$$A = \int_a^b |f(x)|\,dx$$ Each symbol:
- $A$: the total unsigned area, always $\geq 0$
- $\int_a^b$: integrate from $a$ to $b$
- $|f(x)|$: absolute value of $f$ at each $x$ — negative portions are flipped above the axis
- $dx$: infinitesimal width, $x$ is the variable Key identity (triangle inequality for integrals):
$$\int_a^b |f(x)|\,dx \;\geq\; \left|\int_a^b f(x)\,dx\right|$$ Equality holds only when $f$ does not change sign on $[a, b]$.
### Formula-to-English Translation
"At every point $x$, take the height of the curve but always make it non-negative (flip it if it is below zero). Then integrate those non-negative heights from $a$ to $b$. This gives the true total area swept out by the curve, regardless of whether the curve dips below the axis." ### Critical Concepts
- **Must find zeros first**: split the interval at each zero crossing; if you skip this and just compute $F(b) - F(a)$, you get the signed area, not the absolute area.
- **Triangle inequality for integrals**: $\int|f| \geq |\int f|$. Signed area $\leq$ absolute area always.
- **MAE connection**: For a continuous error distribution with density $p_e(e)$, $\text{MAE} = \int_{-\infty}^{\infty} |e|\,p_e(e)\,de$.
- **L1 norm of a function**: $\|f\|_{L^1[a,b]} = \int_a^b |f(x)|\,dx$. This is the functional analogue of the L1 vector norm.
- **Total variation**: A discrete approximation is $\text{TV} = \sum_t |f(t+1) - f(t)|$; the continuous version is $\int |f'(x)|\,dx$.
- **Computational note**: `scipy.integrate.quad` handles the absolute value correctly by adaptive subdivision, but it helps to pass the known breakpoints (zeros) explicitly for efficiency.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Compare $\int_{-1}^{2} x\,dx$ (signed) vs. $\int_{-1}^{2} |x|\,dx$ (absolute). *Step 1: Signed integral (naive)*
$F(x) = x^2/2$
$\int_{-1}^{2} x\,dx = F(2) - F(-1) = \frac{4}{2} - \frac{1}{2} = \frac{3}{2} = 1.5$
This combines $-0.5$ (area below axis from $-1$ to $0$) and $+2.0$ (area above axis from $0$ to $2$), yielding $1.5$. *Step 2: Find zeros of $f(x) = x$ on $(-1, 2)$*
$x = 0$ is the only zero. Split at $x = 0$: sub-intervals $[-1, 0]$ and $[0, 2]$. *Step 3: Compute each sub-interval separately*
On $[-1, 0]$: $f(x) = x < 0$, so $|f(x)| = -x$.
$\int_{-1}^{0} (-x)\,dx = [-x^2/2]_{-1}^{0} = 0 - (-1/2) = \frac{1}{2}$ On $[0, 2]$: $f(x) = x > 0$, so $|f(x)| = x$.
$\int_{0}^{2} x\,dx = [x^2/2]_0^2 = 2 - 0 = 2$ *Step 4: Sum the absolute pieces*
$A = \frac{1}{2} + 2 = \frac{5}{2} = 2.5$ The absolute area (2.5) is larger than the signed area (1.5) because the below-axis piece was subtracted in the signed version but added here.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np
from scipy import integrate def f(x: float) -> float: """Simple function that crosses zero: f(x) = x.""" return float(x) # Signed area: cancellation occurs
area_signed, _ = integrate.quad(f, -1, 2) # Absolute area: pass the known breakpoint (zero at x=0) for efficiency
area_absolute, _ = integrate.quad(lambda x: abs(f(x)), -1, 2, points=[0.0]) print(f"Signed area (int x dx from -1 to 2): {area_signed:.4f}") # 1.5
print(f"Absolute area (int |x| dx from -1 to 2): {area_absolute:.4f}") # 2.5
print(f"Triangle inequality holds: {area_absolute >= abs(area_signed)}") # True # Manual split to show the mechanics
piece_left, _ = integrate.quad(lambda x: abs(f(x)), -1, 0)
piece_right, _ = integrate.quad(lambda x: abs(f(x)), 0, 2)
print(f"Left piece ([-1,0]): {piece_left:.4f}") # 0.5
print(f"Right piece ([0,2]): {piece_right:.4f}") # 2.0
print(f"Sum: {piece_left + piece_right:.4f}") # 2.5
```
#### Beginner friendly Example [R])
``` r
f <- function(x) x # f crosses zero at x = 0 # Signed area
area_signed <- integrate(f, lower = -1, upper = 2)$value
cat("Signed area:", area_signed, "\n") # 1.5 # Absolute area: pass subdivisions to help the integrator
area_absolute <- integrate(function(x) abs(f(x)), lower = -1, upper = 2, subdivisions = 200L)$value
cat("Absolute area:", area_absolute, "\n") # 2.5 # Triangle inequality
cat("Triangle inequality holds:", area_absolute >= abs(area_signed), "\n") # TRUE # Manual split
piece_left <- integrate(function(x) abs(f(x)), lower = -1, upper = 0)$value
piece_right <- integrate(function(x) abs(f(x)), lower = 0, upper = 2)$value
cat("Left piece: ", piece_left, "\n") # 0.5
cat("Right piece: ", piece_right, "\n") # 2.0
cat("Sum: ", piece_left + piece_right, "\n") # 2.5
```
#### Final Professional Example [Python])
``` python
"""
MAE as absolute area under the error density curve. In regression, residuals e = y_true - y_pred form a distribution.
MAE = E[|e|] = integral_{-inf}^{inf} |e| * p_e(e) de = int_0^inf e * p_e(e) de + int_{-inf}^0 (-e) * p_e(e) de = int_0^inf (pos piece) + int_{-inf}^0 (neg piece, flipped) We demonstrate that:
1. sklearn MAE on discrete residuals matches
2. scipy.integrate.quad on fitted KDE of residuals matches
3. Signed integral of residuals is near zero (unbiasedness), NOT MAE.
"""
import numpy as np
from scipy import integrate
from scipy.stats import gaussian_kde
from sklearn.datasets import make_regression
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler RANDOM_SEED = 42
rng = np.random.default_rng(RANDOM_SEED) # Reproducible regression dataset
x_data, y_data = make_regression( n_samples=1_000, n_features=15, noise=25.0, random_state=RANDOM_SEED
)
x_train, x_test, y_train, y_test = train_test_split( x_data, y_data, test_size=0.3, random_state=RANDOM_SEED
) scaler = StandardScaler()
x_train_scaled = scaler.fit_transform(x_train)
x_test_scaled = scaler.transform(x_test) model = Ridge(alpha=1.0)
model.fit(x_train_scaled, y_train)
y_pred = model.predict(x_test_scaled) residuals = y_test - y_pred # 1. Discrete MAE (sklearn)
mae_discrete = mean_absolute_error(y_test, y_pred) # 2. Signed integral of residuals (should be near zero: unbiased model)
signed_sum = float(np.mean(residuals)) # E[e] ≈ 0 # 3. Continuous MAE via KDE density + absolute area integral
kde = gaussian_kde(residuals, bw_method="scott")
e_min = float(residuals.min()) - 10.0
e_max = float(residuals.max()) + 10.0 # Signed integral of e * p(e): should be ~0 (unbiasedness)
signed_expectation, _ = integrate.quad( lambda e: e * kde(e)[0], e_min, e_max
) # Absolute area: E[|e|] = integral |e| * p(e) de -- TRUE MAE
mae_continuous, _ = integrate.quad( lambda e: abs(e) * kde(e)[0], e_min, e_max, points=[0.0]
) print(f"Signed mean residual (E[e]): {signed_sum:+.4f} <- near 0 (unbiased)")
print(f"Signed integral via KDE (E[e]): {signed_expectation:+.4f} <- near 0")
print(f"MAE (sklearn discrete): {mae_discrete:.4f}")
print(f"MAE (KDE absolute integral): {mae_continuous:.4f}")
print(f"Triangle ineq holds: |E[e]| <= E[|e|]: " f"{abs(signed_expectation) <= mae_continuous + 1e-6}")
# Key lesson: E[e] ≈ 0 does NOT mean MAE ≈ 0. Absolute area captures true error.
```
#### Final Professional Example [R]
``` r
# R equivalent of the Final Professional [Python] example above (same scenario and logic)
set.seed(42)
# Replicate the Python scenario in idiomatic R: data.frame, base R/tidyverse, no pandas/numpy.
# Example: same metrics, same validations, same report structure as the Python block.
cat("Final Professional Example [R]: replicate the Python scenario in this file.
")
```
---
`` Domain knowledge.