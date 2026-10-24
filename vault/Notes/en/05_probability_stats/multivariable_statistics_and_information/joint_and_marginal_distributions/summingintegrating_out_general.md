---
title: SummingIntegrating Out (General)
date: '2026-04-16'
wordCount: 598
slug: summingintegrating_out_general
permalink: /notes/05_probability_stats/multivariable_statistics_and_information/joint_and_marginal_distributions/summingintegrating_out_general/index.html
share_status: draft
publish_target: note
boundary: public
---
# $p(X) = \sum_y p(X,y)$ or $p(X) = \int p(X,y) \, dy$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
"Marginalisation" (summing or integrating out a variable) is one of the most fundamental operations in probability and Bayesian inference. It converts a joint distribution over multiple variables into a distribution over a subset of them by summing or integrating over the unwanted variables. In Bayesian ML this is how you compute the model evidence (marginal likelihood), the prior predictive, and the posterior predictive distribution.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Start: joint distribution p(X, Y)"] --> B{"Is Y discrete or continuous?"} B -->|"Discrete"| C["Sum over all values of Y: p(X) = sum_y p(X,y)"] B -->|"Continuous"| D["Integrate over all values of Y: p(X) = integral p(X,y) dy"] C --> E["Result: marginal distribution p(X)"] D --> E E --> F["p(X) is a valid probability distribution (sums/integrates to 1)"]
```
### Real-World use:
#### Situation it is used
Bayesian inference: computing $p(\theta | \text{data}) = p(\text{data}|\theta) p(\theta) / p(\text{data})$ where $p(\text{data}) = \int p(\text{data}|\theta) p(\theta) d\theta$ requires marginalising out $\theta$. Also used in mixture models: $p(x) = \sum_k \pi_k p(x | z=k)$.
#### Problem it solves
You have a joint distribution involving variables you care about and variables that are nuisance or latent. Marginalisation removes the unwanted variables, giving you a distribution only over the ones you need.
#### How it solves the problem
For discrete Y: summing $p(X,y)$ over all $y$ values collapses the Y dimension. For continuous Y: integrating $p(X,y)$ over $(-\infty, \infty)$ does the same. The result is always a valid probability distribution.
#### Example of it used in the Working Context as DA/DS for a Business
In a Gaussian Mixture Model (GMM) for customer segmentation, the observed distribution of customer spending $p(x)$ is the marginalisation over the latent cluster assignment $z$: $p(x) = \sum_{k=1}^K \pi_k \mathcal{N}(x | \mu_k, \sigma_k^2)$. The EM algorithm iterates between the joint and the marginal.
### The Formula (Fragment-First)
| Symbol | Meaning |
|--------|---------|
| $p(X)$ | Marginal distribution of X |
| $p(X,y)$ | Joint distribution of X and Y |
| $\sum_y$ | Sum over all values of Y (discrete case) |
| $\int \cdot \, dy$ | Integral over all values of Y (continuous case) | Discrete: $p(X) = \sum_y p(X,y)$ Continuous: $p(X) = \int_{-\infty}^\infty p(X,y) \, dy$ Both are equivalent: "sum/integrate out the variable you do not want." ### Formula-to-English Translation
"To get the marginal probability of X, add up (or integrate) the joint probability over all possible values of Y." Every possible value that Y could take is accounted for — you are asking: what is the probability of X, no matter what Y is?
### Critical Concepts
- **Latent variables**: marginalisation is how you handle latent (unobserved) variables in a model.
- **Normalisation preserved**: if $p(X,Y)$ is a valid joint, $p(X) = \sum_y p(X,y)$ is always a valid marginal.
- **Product rule connection**: $p(X,Y) = p(X|Y) p(Y)$, so $p(X) = \sum_y p(X|Y=y) p(Y=y)$ — this is the Law of Total Probability.
- **Tractability**: marginalisation is often analytically intractable and requires Monte Carlo, variational inference, or numerical integration.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Joint distribution of weather (X: sunny=0, rainy=1) and umbrella carried (Y: no=0, yes=1): | | Y=0 | Y=1 |
|---|---|---|
| X=0 (sunny) | 0.35 | 0.15 |
| X=1 (rainy) | 0.10 | 0.40 | *Step 1: Marginalise out Y to get p(X)*
$p(X=0) = 0.35 + 0.15 = 0.50$ (50% sunny)
$p(X=1) = 0.10 + 0.40 = 0.50$ (50% rainy) *Step 2: Marginalise out X to get p(Y)*
$p(Y=0) = 0.35 + 0.10 = 0.45$ (45% no umbrella)
$p(Y=1) = 0.15 + 0.40 = 0.55$ (55% umbrella) *Step 3: Verify*
$p(X=0) + p(X=1) = 1.0$ ✓, $p(Y=0) + p(Y=1) = 1.0$ ✓ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # Joint distribution: weather x umbrella
# Rows: weather (sunny=0, rainy=1), Cols: umbrella (no=0, yes=1)
joint = np.array([ [0.35, 0.15], [0.10, 0.40],
]) # Marginalise out Y (umbrella) to get p(weather)
marginal_weather = joint.sum(axis=1)
# Marginalise out X (weather) to get p(umbrella)
marginal_umbrella = joint.sum(axis=0) print("p(weather):", dict(zip(["sunny", "rainy"], marginal_weather.round(2))))
print("p(umbrella):", dict(zip(["no", "yes"], marginal_umbrella.round(2))))
```
#### Beginner friendly Example [R])
``` r
# Gaussian Mixture: marginalise over latent cluster z
# p(x) = sum_k pi_k * N(x | mu_k, sigma_k)
gmm_density <- function(x_val, pi_vec, mu_vec, sigma_vec) { sum(pi_vec * dnorm(x_val, mean = mu_vec, sd = sigma_vec))
} pi_vec <- c(0.3, 0.7)
mu_vec <- c(-2.0, 3.0)
sigma_vec <- c(1.0, 1.5) x_grid <- seq(-6, 8, length.out = 200)
density_values <- sapply(x_grid, gmm_density, pi_vec = pi_vec, mu_vec = mu_vec, sigma_vec = sigma_vec)
cat("Integral of GMM density (should be ~1):", sum(density_values) * (x_grid[2] - x_grid[1]), "\n")
```
#### Final Professional Example [Python])
``` python
from __future__ import annotations import numpy as np
from scipy.stats import norm class GaussianMixtureMarginal: # Marginalise over latent mixture components: p(x) = sum_k pi_k * N(x | mu_k, sigma_k). def __init__( self, pi: np.ndarray, mu: np.ndarray, sigma: np.ndarray, ) -> None: assert np.isclose(pi.sum(), 1.0), "Mixture weights must sum to 1." self._pi = pi self._mu = mu self._sigma = sigma def pdf(self, x: np.ndarray) -> np.ndarray: # Marginal PDF: sum over latent components. densities = np.array([ pi_k * norm.pdf(x, loc=mu_k, scale=sigma_k) for pi_k, mu_k, sigma_k in zip(self._pi, self._mu, self._sigma) ]) return densities.sum(axis=0) def log_likelihood(self, data: np.ndarray) -> float: return float(np.sum(np.log(self.pdf(data) + 1e-300))) if __name__ == "__main__": rng = np.random.default_rng(seed=42) gmm = GaussianMixtureMarginal( pi = np.array([0.4, 0.6]), mu = np.array([-2.0, 3.0]), sigma = np.array([1.0, 1.5]), ) x_grid = np.linspace(-7, 8, 1_000) area = np.trapz(gmm.pdf(x_grid), x_grid) print(f"Marginal GMM density integrates to: {area:.6f} (should be ~1)") # Simulate data and compute log-likelihood data_sample = rng.normal(loc=3.0, scale=1.5, size=200) ll = gmm.log_likelihood(data_sample) print(f"Log-likelihood on 200 samples from component 2: {ll:.2f}")
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