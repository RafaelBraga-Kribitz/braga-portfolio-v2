---
title: Log-Likelihood Objective
date: '2026-04-16'
wordCount: 553
slug: log_likelihood_objective
permalink: /notes/06_ml_math/machine_learning_algorithms/density_estimation_gaussian_mixture_models_gmm/log_likelihood_objective/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\ell(\theta) = \sum_{i=1}^{n} \log \left( \sum_{k=1}^{K} \pi_k \,\mathcal{N}(x_i \mid \mu_k, \Sigma_k) \right)$ We are working on the log-likelihood objective for Gaussian Mixture Models, where the canonical formula is $$\ell(\theta) = \sum_{i=1}^{n} \log \left( \sum_{k=1}^{K} \pi_k \,\mathcal{N}(x_i \mid \mu_k, \Sigma_k) \right),$$ with parameters $\theta = \{\pi_k, \mu_k, \Sigma_k\}_{k=1}^{K}$. This objective measures how well a GMM explains the observed data under the assumptions of valid mixture weights, Gaussian component densities, and i.i.d. observations.
## Deep Breakdown The log-likelihood objective is the central training criterion for a Gaussian Mixture Model, GMM. A GMM assumes that each observation $x_i$ was generated from one of $K$ Gaussian components, but we do not know which component generated which point. Instead of assigning a point to only one Gaussian, the model treats the observed density as a weighted sum of Gaussian densities. For one data point $x_i$, the model density is: $$
p(x_i \mid \theta) = \sum_{k=1}^{K} \pi_k \,\mathcal{N}(x_i \mid \mu_k, \Sigma_k)
$$ where: - $\pi_k$ is the mixture weight of component $k$,
- $\mu_k$ is the mean of component $k$,
- $\Sigma_k$ is the covariance of component $k$. Because the observations are assumed independent and identically distributed, the full likelihood for the dataset is the product of these mixture densities across all observations. Taking the logarithm gives the log-likelihood: $$
\ell(\theta) = \sum_{i=1}^{n} \log \left( \sum_{k=1}^{K} \pi_k \,\mathcal{N}(x_i \mid \mu_k, \Sigma_k) \right)
$$ Inputs: - dataset $x_1, \dots, x_n$,
- number of components $K$,
- mixture weights $\pi_k$,
- means $\mu_k$,
- covariances $\Sigma_k$. Output: - a scalar score, the log-likelihood, telling us how well the current GMM parameters explain the data. Why it matters in DA/DS: - it is the objective maximized during GMM training,
- it provides a direct measure of model fit,
- it is used to monitor EM convergence,
- it helps compare candidate models, often alongside AIC or BIC,
- it reveals when a model is fitting the data better or collapsing into degenerate solutions. This objective is tricky because of the inner sum over components inside the logarithm. If the component identity were known, the optimization would be much simpler. But because the generating component is latent, direct maximization is harder. That is exactly why the EM algorithm exists. EM works by optimizing a surrogate lower bound that guarantees the observed-data log-likelihood does not decrease at each iteration. So conceptually: - the log-likelihood is the true target,
- EM is the practical optimization procedure,
- responsibilities arise because the latent component labels are unknown. This object links directly to: - **EM Algorithm**, because EM is designed to maximize this objective,
- **responsibilities**, because they appear in the latent-variable reformulation,
- **convergence**, because EM is typically monitored by changes in log-likelihood,
- **degenerate solutions**, because unconstrained GMM likelihood can blow up in pathological cases.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with dataset x_1 to x_n"] --> B["Specify GMM parameters θ = {π_k, μ_k, Σ_k}"] B --> C["For each point x_i, compute mixture density Σ_k π_k N(x_i | μ_k, Σ_k)"] C --> D["Take log of each point density"] D --> E["Sum across all observations"] E --> F["Obtain log-likelihood ℓ(θ)"] F --> G["Use EM to increase ℓ(θ) iteratively"] G --> H["Monitor convergence across iterations"] H --> I["Check for overfitting or degenerate covariance collapse"] I --> J["Use final objective for fit assessment and model comparison"]