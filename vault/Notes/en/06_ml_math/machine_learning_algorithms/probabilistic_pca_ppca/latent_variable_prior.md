---
title: Latent Variable Prior
date: '2026-04-16'
wordCount: 520
slug: latent_variable_prior
permalink: /notes/06_ml_math/machine_learning_algorithms/probabilistic_pca_ppca/latent_variable_prior/index.html
share_status: draft
publish_target: note
boundary: public
---
# $p(z) = \mathcal{N}(z \mid 0, I)$ We are working on the latent variable prior in Probabilistic PCA, where the hidden low-dimensional vector $z$ is assigned a standard multivariate Gaussian distribution. The canonical formula is $$p(z) = \mathcal{N}(z \mid 0, I),$$ under the assumptions that the latent space is isotropic, centered at zero, and has identity covariance. This prior is the probabilistic starting point for PPCA and supports closed-form inference and likelihood-based dimensionality reduction.
## Deep Breakdown In Probabilistic PCA, the observed data vector $x$ is assumed to come from an unobserved latent vector $z$ through a linear Gaussian generative process. Before we observe any data point, we need to specify what kinds of latent vectors are plausible. That is the role of the latent variable prior. The PPCA latent prior is: $$
p(z) = \mathcal{N}(z \mid 0, I)
$$ This means the latent vector: - has mean zero,
- has unit variance in every latent dimension,
- has no covariance across latent dimensions. Inputs: - latent dimension $k$. Output: - a probability distribution over the latent variable $z \in \mathbb{R}^k$. Why it matters: - it defines the geometry of the latent space,
- it regularizes the hidden factors,
- it makes the model identifiable up to rotations typical in latent factor models,
- it keeps the model mathematically tractable,
- it allows the marginal distribution of the observed variable to have the PPCA form. This prior says that before seeing any particular observation, the latent coordinates are centered around the origin and spread equally in all latent directions. There is no preferred latent axis, no prior correlation, and no prior shift away from zero. In PPCA, this prior combines with the observation model $$
x \mid z \sim \mathcal{N}(Wz + \mu, \sigma^2 I)
$$ to create a full latent variable model. Once the prior and conditional likelihood are defined, we can derive: - the marginal distribution of $x$,
- the posterior distribution $p(z \mid x)$,
- the likelihood-based estimation procedure for $W$, $\mu$, and $\sigma^2$. In DA/DS terms, the latent prior provides a disciplined probabilistic definition of the embedding space. Instead of saying “the data has some hidden coordinates,” PPCA says exactly how those hidden coordinates are distributed before the data is observed. This object links directly to: - **Generative Model**, because the prior is one half of the PPCA generative specification,
- **Posterior over $z$**, because inference updates this prior after observing $x$,
- **standard PCA**, because the isotropic latent prior helps recover a PCA-like subspace,
- **probabilistic factor models**, because many such models begin by assigning structured priors to latent factors.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Choose latent dimension k"] --> B["Define latent vector z in R^k"] B --> C["Assign prior p(z) = N(0, I)"] C --> D["Interpret zero mean and unit variance"] D --> E["Interpret no prior covariance across latent dimensions"] E --> F["Combine with observation model x | z ~ N(Wz + μ, σ²I)"] F --> G["Obtain full PPCA generative model"] G --> H["Derive marginal distribution of x"] H --> I["Infer posterior p(z | x)"] I --> J["Use latent embeddings for probabilistic dimensionality reduction"]