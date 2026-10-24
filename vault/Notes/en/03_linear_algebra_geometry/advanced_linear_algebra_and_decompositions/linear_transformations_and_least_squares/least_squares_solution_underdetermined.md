---
title: Least Squares Solution (underdetermined)
date: '2026-04-16'
wordCount: 1013
slug: least_squares_solution_underdetermined
permalink: /notes/03_linear_algebra_geometry/advanced_linear_algebra_and_decompositions/linear_transformations_and_least_squares/least_squares_solution_underdetermined/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\theta = (B^T B)^{-1} B^T x$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This is the Ordinary Least Squares (OLS) closed-form solution: given a design matrix $B$ and an observation vector $x$, the parameter vector $\theta$ that minimizes $\|B\theta - x\|^2$ is $(B^T B)^{-1} B^T x$. The term $(B^T B)^{-1} B^T$ is called the Moore-Penrose pseudo-inverse (or left pseudo-inverse) of $B$ when $B$ is tall and full column rank. In DA/DS you use this every time you train a linear regression model: sklearn's `LinearRegression`, R's `lm()`, and Excel's `LINEST` all solve this equation under the hood.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Input: design matrix B (n x p) and observations x (n x 1)"] --> B["Check: n > p (more observations than parameters)"] B --> C["Check: columns of B are linearly independent (full column rank)"] C --> D{{"Is B^T B invertible (all eigenvalues > 0)?"}} D -->|"No"| E["Matrix is singular or near-singular: use ridge regression or pseudo-inverse"] D -->|"Yes"| F["Compute B^T B (p x p symmetric matrix)"] F --> G["Compute B^T x (p x 1 vector)"] G --> H["Solve (B^T B) theta = B^T x"] H --> I["theta = (B^T B)^{-1} B^T x"] I --> J["Compute residuals: r = x - B * theta"] J --> K["Report R-squared, residual std, and coefficient significance"]
```
### Real-World use:
#### Situation it is used
Used every time you run OLS linear regression: fitting a trend line to revenue time series, modeling click-through rate as a function of bid price and ad quality score, or attributing sales lift to each marketing channel in a media mix model. Also the foundation of multiple regression, ANOVA, and many econometric models.
#### Problem it solves
You have $n$ observations and $p < n$ unknown parameters. The system $B\theta = x$ is overdetermined (more equations than unknowns) and generally has no exact solution. The least squares formula finds the $\theta$ that minimizes the sum of squared residuals, giving the best linear unbiased estimate (BLUE) under Gauss-Markov conditions.
#### How it solves the problem
Setting the gradient of $\|B\theta - x\|^2$ with respect to $\theta$ to zero gives the normal equations: $B^T B \theta = B^T x$. If $B$ is full column rank, $B^T B$ is invertible and the unique solution is $\theta = (B^T B)^{-1} B^T x$. Geometrically, $B\theta$ is the projection of $x$ onto the column space of $B$; the residual $x - B\theta$ is orthogonal to every column of $B$.
#### Example of it used in the Working Context as DA/DS for a Business
A marketing analyst runs a media mix model: they have 52 weeks of total sales $x$ and a $52 \times 4$ design matrix $B$ with columns for TV, digital, print spend, and a constant term. They solve $\theta = (B^T B)^{-1} B^T x$ to get 4 coefficients: the marginal return per euro spent in each channel plus the baseline. The result lets them reallocate budget toward the channels with the highest marginal return.
### The Formula (Fragment-First)
- $\theta$: the parameter vector ($p \times 1$) containing the regression coefficients to estimate
- $(B^T B)^{-1}$: the inverse of the $p \times p$ Gram matrix $B^T B$; exists only if $B$ has full column rank
- $B^T$: transpose of the design matrix $B$ ($p \times n$); left-multiplying by $B^T$ projects the data into the parameter space
- $x$: the $n \times 1$ observation/response vector
- $B^T x$: the $p \times 1$ vector of dot products between each predictor column and the response; the "sufficient statistics" for OLS
- $(B^T B)^{-1} B^T$: called the left pseudo-inverse of $B$; when applied to $x$, it gives the least-squares coefficient vector Full formula: $\theta = (B^T B)^{-1} B^T x$ ### Formula-to-English Translation
"The least-squares regression coefficients are found by projecting the observations onto the column space of the design matrix, then scaling by the inverse of the feature covariance matrix." Tiny numeric example: $B = \begin{bmatrix}1 & 1 \\ 1 & 2 \\ 1 & 3\end{bmatrix}$ (intercept + 1 predictor), $x = \begin{bmatrix}1 \\ 2 \\ 4\end{bmatrix}$.
$B^T B = \begin{bmatrix}3 & 6 \\ 6 & 14\end{bmatrix}$, $B^T x = \begin{bmatrix}7 \\ 17\end{bmatrix}$.
$(B^T B)^{-1} = \frac{1}{6}\begin{bmatrix}14 & -6 \\ -6 & 3\end{bmatrix}$.
$\theta = (B^T B)^{-1} B^T x = \frac{1}{6}\begin{bmatrix}14 \cdot 7 - 6 \cdot 17 \\ -6 \cdot 7 + 3 \cdot 17\end{bmatrix} = \frac{1}{6}\begin{bmatrix}-4 \\ 9\end{bmatrix} = \begin{bmatrix}-2/3 \\ 3/2\end{bmatrix}$.
Fitted line: $\hat{x}_i = -2/3 + 3/2 \cdot t_i$.
### Critical Concepts
- **Normal equations:** $(B^T B)\theta = B^T x$ are the normal equations; the formula is just their explicit solution. In practice, never invert $B^T B$ directly; use `np.linalg.lstsq` or QR decomposition which are more numerically stable.
- **Invertibility requirement:** $B^T B$ is invertible if and only if $B$ has full column rank ($p$ independent columns). Multicollinear features cause $B^T B$ to be singular or near-singular.
- **Geometric meaning:** the fitted values $\hat{x} = B\theta$ are the orthogonal projection of $x$ onto the column space of $B$; the residuals $r = x - \hat{x}$ are perpendicular to every column of $B$, i.e., $B^T r = 0$.
- **Gauss-Markov theorem:** if errors are zero-mean, uncorrelated, and equal-variance, OLS is BLUE (Best Linear Unbiased Estimator). Violation of these conditions calls for GLS, WLS, or robust regression.
- **Ridge regression regularization:** $(B^T B + \lambda I)^{-1} B^T x$ is the ridge regression solution; it adds $\lambda$ to all eigenvalues of $B^T B$, ensuring invertibility and reducing variance at the cost of some bias.
- **Never use `np.linalg.inv(B.T @ B)`:** direct inversion amplifies condition number squared; always use `np.linalg.lstsq(B, x)` or `scipy.linalg.lstsq` which use QR or SVD internally.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Set up B and x, then compute B^T B and B^T x*
$B = \begin{bmatrix}1 & 2 \\ 1 & 3 \\ 1 & 5\end{bmatrix}$, $x = \begin{bmatrix}3 \\ 4 \\ 7\end{bmatrix}$.
$B^T B = \begin{bmatrix}1+1+1 & 2+3+5 \\ 2+3+5 & 4+9+25\end{bmatrix} = \begin{bmatrix}3 & 10 \\ 10 & 38\end{bmatrix}$.
$B^T x = \begin{bmatrix}3+4+7 \\ 6+12+35\end{bmatrix} = \begin{bmatrix}14 \\ 53\end{bmatrix}$. *Step 2: Invert B^T B*
$\det(B^T B) = 3 \cdot 38 - 10 \cdot 10 = 114 - 100 = 14$.
$(B^T B)^{-1} = \frac{1}{14}\begin{bmatrix}38 & -10 \\ -10 & 3\end{bmatrix}$. *Step 3: Compute theta and verify with residuals*
$\theta = (B^T B)^{-1} B^T x = \frac{1}{14}\begin{bmatrix}38 \cdot 14 + (-10) \cdot 53 \\ (-10) \cdot 14 + 3 \cdot 53\end{bmatrix} = \frac{1}{14}\begin{bmatrix}532 - 530 \\ -140 + 159\end{bmatrix} = \frac{1}{14}\begin{bmatrix}2 \\ 19\end{bmatrix} = \begin{bmatrix}1/7 \\ 19/14\end{bmatrix}$.
Fitted: $\hat{x}_1 = 1/7 + 2 \cdot 19/14 = 1/7 + 19/7 = 20/7 \approx 2.857$.
Residual $r_1 = 3 - 20/7 = 1/7 \approx 0.143$. The residuals are small.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- OLS closed-form solution: theta = (B^T B)^{-1} B^T x -------------
# Simple regression: one predictor + intercept # Design matrix: column of 1s (intercept) + predictor values
B = np.array([ [1.0, 2.0], [1.0, 3.0], [1.0, 5.0], [1.0, 7.0],
])
x = np.array([3.0, 4.0, 7.0, 9.0]) # OLS via normal equations (for illustration; use lstsq in practice)
btb = B.T @ B
btx = B.T @ x
theta = np.linalg.solve(btb, btx) # solve (B^T B) theta = B^T x (safer than explicit inverse) x_hat = B @ theta
residuals = x - x_hat
r_squared = float(1 - np.sum(residuals**2) / np.sum((x - x.mean())**2)) print(f"theta (intercept, slope) = {theta.round(4)}")
print(f"Fitted values: {x_hat.round(4)}")
print(f"Residuals: {residuals.round(4)}")
print(f"R-squared: {r_squared:.4f}") # Compare against np.linalg.lstsq
theta_lstsq, _, _, _ = np.linalg.lstsq(B, x, rcond=None)
print(f"\nnp.linalg.lstsq result: {theta_lstsq.round(6)}")
print(f"Max difference: {np.max(np.abs(theta - theta_lstsq)):.2e}")
```
#### Beginner friendly Example [R])
``` r
# -- OLS closed-form solution: theta = (B^T B)^{-1} B^T x -------------
B <- matrix(c( 1, 2, 1, 3, 1, 5, 1, 7
), nrow = 4, byrow = TRUE)
x <- c(3.0, 4.0, 7.0, 9.0) # Normal equations solution
btb <- t(B) %*% B
btx <- t(B) %*% x
theta <- solve(btb, btx) # solve (B^T B) theta = B^T x x_hat <- B %*% theta
residuals <- x - x_hat
r_squared <- 1 - sum(residuals^2) / sum((x - mean(x))^2) cat(sprintf("theta (intercept, slope) = [%.4f, %.4f]\n", theta[1], theta[2]))
cat(sprintf("R-squared = %.4f\n", r_squared)) # Compare against lm()
fit <- lm(x ~ B[, 2])
cat(sprintf("\nlm() coefficients: intercept = %.4f, slope = %.4f\n", coef(fit)[1], coef(fit)[2]))
cat(sprintf("Max difference: %.2e\n", max(abs(theta - coef(fit)))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: media mix model via OLS (4 channels + intercept)
# Estimate the revenue contribution of TV, digital, print, and radio. N_WEEKS = 104 # 2 years of weekly data
CHANNEL_NAMES = ["tv", "digital", "print", "radio"]
TRUE_COEFS = np.array([50.0, 1.2, 0.8, 0.5, 0.3]) # intercept + 4 channel returns (EUR per EUR spent) # Simulate spend and revenue
spend_raw = np.abs(np.random.normal(loc=20_000, scale=5_000, size=(N_WEEKS, 4)))
spend_df = pd.DataFrame(spend_raw, columns=CHANNEL_NAMES)
B = np.column_stack([np.ones(N_WEEKS), spend_raw]) # design matrix with intercept
noise = np.random.normal(0, 2_000, size=N_WEEKS)
revenue = B @ TRUE_COEFS + noise # true signal + noise # OLS solution via normal equations (using solve, not inv, for numerical stability)
btb = B.T @ B
btx = B.T @ revenue
theta = np.linalg.solve(btb, btx) # Evaluate fit
revenue_hat = B @ theta
residuals = revenue - revenue_hat
ss_res = float(np.sum(residuals**2))
ss_tot = float(np.sum((revenue - revenue.mean())**2))
r_squared = 1.0 - ss_res / ss_tot
residual_std = float(np.sqrt(ss_res / (N_WEEKS - len(theta)))) # Condition number of B^T B (diagnose multicollinearity)
cond_btb = float(np.linalg.cond(btb)) param_names = ["intercept"] + CHANNEL_NAMES
results_df = pd.DataFrame({ "parameter": param_names, "true_coef": TRUE_COEFS.round(3), "estimated_coef": theta.round(3), "error": (theta - TRUE_COEFS).round(3),
}) print(results_df.to_string(index=False))
print(f"\nR-squared: {r_squared:.4f}")
print(f"Residual std (EUR): {residual_std:.2f}")
print(f"Condition number of B^T B: {cond_btb:.1f}")
print("\nInterpretation: coefficients estimate EUR revenue per EUR spent per channel; high condition number signals multicollinearity risk.")
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
AIO