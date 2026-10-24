---
title: Parameter Posterior
date: '2026-04-16'
wordCount: 458
slug: parameter_posterior
permalink: /notes/06_ml_math/machine_learning_algorithms/bayesian_linear_regression_blr/parameter_posterior/index.html
share_status: draft
publish_target: note
boundary: public
---
# $p(w \mid D) = \mathcal{N}(w \mid m_{\text{post}}, S_{\text{post}})$ We are working on the full parameter posterior in Bayesian Linear Regression, where the weight vector $w$ is updated from a Gaussian prior using a Gaussian likelihood. The canonical result is $$p(w \mid D) = \mathcal{N}(w \mid m_{\text{post}}, S_{\text{post}}),$$ where $$S_{\text{post}}^{-1} = S_0^{-1} + \frac{1}{\sigma^2}X^\top X$$ and $$m_{\text{post}} = S_{\text{post}}\left(S_0^{-1}m_0 + \frac{1}{\sigma^2}X^\top y\right).$$ This posterior summarizes uncertainty-aware regression under the assumptions of a Gaussian prior, Gaussian observation noise, and known noise variance $\sigma^2 > 0$.
## Deep Breakdown The parameter posterior is the central object in Bayesian Linear Regression. Instead of producing one single “best” coefficient vector, Bayesian Linear Regression produces a full probability distribution over the coefficients after observing the data. That distribution is: $$
p(w \mid D) = \mathcal{N}(w \mid m_{\text{post}}, S_{\text{post}})
$$ where $D = \{X, y\}$ denotes the observed dataset. Inputs: - prior mean $m_0$,
- prior covariance $S_0$,
- design matrix $X$,
- response vector $y$,
- noise variance $\sigma^2$. Outputs: - posterior mean $m_{\text{post}}$,
- posterior covariance $S_{\text{post}}$,
- full posterior density over the coefficient vector $w$. Why it matters in DA/DS: - it gives more than a point estimate, it gives **uncertainty**,
- it supports coefficient credible intervals,
- it propagates uncertainty into predictions,
- it handles small-data settings more honestly,
- it allows prior knowledge to regularize unstable regressions. In ordinary least squares, the output is typically one estimated vector $\hat{w}$. In Bayesian Linear Regression, the output is a cloud of plausible vectors centered around $m_{\text{post}}$, with spread governed by $S_{\text{post}}$. This is extremely useful when: - the sample size is small,
- predictors are correlated,
- noise is high,
- prior beliefs are important,
- overconfidence would be dangerous. The posterior combines: 1. **prior information**, encoded in $\mathcal{N}(m_0, S_0)$,
2. **data evidence**, encoded in the Gaussian likelihood. The result stays Gaussian because Gaussian prior and Gaussian likelihood are conjugate. This object connects directly to: - **Posterior Mean**, which is the center of the posterior,
- **Posterior Covariance**, which measures its spread,
- **Predictive Distribution**, which uses the posterior over $w$ to produce uncertainty-aware predictions,
- **Marginal Likelihood**, which integrates over this parameter space.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with prior: w ~ N(m0, S0)"] --> B["Observe data D = {X, y}"] B --> C["Assume Gaussian likelihood: y | X, w ~ N(Xw, σ²I)"] C --> D["Combine prior and likelihood"] D --> E["Collect quadratic and linear terms in w"] E --> F["Identify Gaussian posterior form"] F --> G["Compute posterior precision S_post^(-1) = S0^(-1) + (1/σ²)XᵀX"] G --> H["Invert to get posterior covariance S_post"] H --> I["Compute posterior mean m_post"] I --> J["Obtain full posterior p(w | D) = N(m_post, S_post)"] J --> K["Use for credible intervals and predictive uncertainty"]