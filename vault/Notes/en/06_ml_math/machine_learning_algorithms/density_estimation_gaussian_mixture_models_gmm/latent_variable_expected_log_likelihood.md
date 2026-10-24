---
title: Latent Variable Expected Log-Likelihood
date: '2026-04-16'
wordCount: 549
slug: latent_variable_expected_log_likelihood
permalink: /notes/06_ml_math/machine_learning_algorithms/density_estimation_gaussian_mixture_models_gmm/latent_variable_expected_log_likelihood/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\mathbb{E}_q[\log p(X, Z \mid \theta)] = \sum_{i=1}^{n}\sum_{k=1}^{K} r_{ik} \left[ \log \pi_k + \log \mathcal{N}(x_i \mid \mu_k, \Sigma_k) \right]$ We are working on the latent variable expected log-likelihood in the EM algorithm for Gaussian Mixture Models, where the canonical formula is $$\mathbb{E}_q[\log p(X, Z \mid \theta)] = \sum_{i=1}^{n}\sum_{k=1}^{K} r_{ik} \left[ \log \pi_k + \log \mathcal{N}(x_i \mid \mu_k, \Sigma_k) \right],$$ with $r_{ik}$ playing the role of the variational distribution over latent component assignments. This is the expected complete-data log-likelihood term inside the EM lower bound, under the assumptions of a finite GMM, categorical latent assignments, and responsibilities satisfying $r_{ik} \ge 0$ and $\sum_{k=1}^{K} r_{ik} = 1$.
## Deep Breakdown In a Gaussian Mixture Model, every observed data point $x_i$ is assumed to come from one of $K$ Gaussian components. The problem is that we do not observe which component generated each point. That missing information is represented by a latent variable, often written as $z_i$. If the latent assignments were known, GMM estimation would be much easier, because the complete-data log-likelihood would separate cleanly across components. But since $Z$ is hidden, EM works by alternating between: - estimating a distribution over latent assignments, and
- optimizing parameters using that distribution. The key quantity that makes this work is the expected complete-data log-likelihood: $$
\mathbb{E}_q[\log p(X, Z \mid \theta)]
$$ For GMMs, if the auxiliary distribution $q(Z)$ factorizes through responsibilities $r_{ik}$, then this expectation becomes: $$
\mathbb{E}_q[\log p(X, Z \mid \theta)] = \sum_{i=1}^{n}\sum_{k=1}^{K} r_{ik} \left[ \log \pi_k + \log \mathcal{N}(x_i \mid \mu_k, \Sigma_k) \right]
$$ Inputs: - observed data $X = \{x_1, \dots, x_n\}$,
- latent assignment distribution $q(Z)$, represented by responsibilities $r_{ik}$,
- model parameters $\theta = \{\pi_k, \mu_k, \Sigma_k\}_{k=1}^{K}$. Output: - a scalar objective value, the expectation of the complete-data log-likelihood under the current soft assignments. Why it matters in DA/DS: - it is the core quantity optimized in the M-step,
- it explains EM as coordinate ascent on a lower bound,
- it turns hard unknown component labels into soft probabilistic weights,
- it makes the update formulas for weights, means, and covariances natural,
- it gives a variational interpretation of EM. This quantity is not the full ELBO by itself. The full EM lower bound also includes an entropy term from $q(Z)$. But this expected log-likelihood term is the part that depends directly on the GMM parameters in a way that leads to the M-step updates. This object links directly to: - **GMM log-likelihood objective**, because it is part of a lower bound on the observed-data log-likelihood,
- **responsibilities**, because they define the expectation under $q$,
- **EM algorithm**, because EM alternates between optimizing $q$ and $\theta$,
- **variational view**, because EM can be seen as coordinate ascent on a bound.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with observed data X and latent assignments Z"] --> B["Write joint model p(X, Z | θ)"] B --> C["Introduce auxiliary distribution q(Z)"] C --> D["Represent q(Z) using responsibilities r_ik"] D --> E["Take expectation of log p(X, Z | θ) under q"] E --> F["Obtain Σ_i Σ_k r_ik [log π_k + log N(x_i | μ_k, Σ_k)]"] F --> G["E-Step updates r_ik"] G --> H["M-Step maximizes this quantity with respect to θ"] H --> I["Recover weight, mean, and covariance updates"] I --> J["Interpret EM as coordinate ascent on a lower bound"]