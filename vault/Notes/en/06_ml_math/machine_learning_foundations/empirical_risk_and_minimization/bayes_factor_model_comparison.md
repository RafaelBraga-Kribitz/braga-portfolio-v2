---
title: Bayes Factor (Model Comparison)
date: '2026-04-16'
wordCount: 580
slug: bayes_factor_model_comparison
permalink: /notes/06_ml_math/machine_learning_foundations/empirical_risk_and_minimization/bayes_factor_model_comparison/index.html
share_status: draft
publish_target: note
boundary: public
---
# $B_{12} = \dfrac{p(D \mid M_1)}{p(D \mid M_2)}$ We are working on the Bayes Factor for Bayesian model comparison, with canonical formula $B_{12} = \dfrac{p(D \mid M_1)}{p(D \mid M_2)}$, where $p(D \mid M_j)$ is the marginal likelihood of model $M_j$ for dataset $D$. The domain is Bayesian model comparison under models with well-defined priors and likelihoods. If $B_{12} > 1$, the data favors $M_1$ over $M_2$; if $B_{12} < 1$, the data favors $M_2$. This connects directly to posterior odds and, asymptotically, to BIC-style approximations to log marginal likelihood.
## Deep Breakdown The Bayes Factor is a core tool for comparing two probabilistic models using observed data. Instead of asking only which model fits the sample best at its best parameter value, the Bayes Factor asks which model gives a better **overall explanation** of the data after averaging over that model’s parameter uncertainty. For two models $M_1$ and $M_2$, the Bayes Factor is: $$
B_{12} = \frac{p(D \mid M_1)}{p(D \mid M_2)}
$$ Here: - $D$ is the observed dataset,
- $M_1$ and $M_2$ are competing models,
- $p(D \mid M_j)$ is the **marginal likelihood** of model $M_j$. The marginal likelihood is not just the likelihood evaluated at one parameter estimate. It is: $$
p(D \mid M_j) = \int p(D \mid \theta_j, M_j)\, p(\theta_j \mid M_j)\, d\theta_j
$$ This means: 1. take the likelihood of the data under parameter value $\theta_j$,
2. weight it by the prior probability of that parameter value,
3. integrate over all possible parameter values. This is important because it automatically balances: - **fit to the data**, and
- **model complexity**. A model with many flexible parameters may fit some settings extremely well, but if it spreads probability mass across too many possibilities, its average support for the observed data may be lower. That is one reason the Bayes Factor is often described as an automatic Occam’s razor mechanism. Why it matters in DA/DS: - **Model selection:** compare different predictive or explanatory models.
- **Hypothesis comparison:** compare null vs alternative models.
- **Evidence quantification:** give a direct evidence ratio, not just a p-value.
- **Complexity penalty:** reward models that explain data well without needing too much flexibility.
- **Decision-making:** useful in forecasting, A/B testing, attribution, risk modeling, and scientific inference. The Bayes Factor itself compares only the evidence from the data. To get posterior odds between models, you multiply by prior odds: $$
\frac{p(M_1 \mid D)}{p(M_2 \mid D)}
=
B_{12}
\cdot
\frac{p(M_1)}{p(M_2)}
$$ So: - Bayes Factor = what the **data** contributes,
- prior odds = what you believed **before** seeing the data,
- posterior odds = what you believe **after** combining both. A frequent practical issue is that exact marginal likelihoods can be hard to compute. In large-sample settings, criteria like BIC are used as approximations because: $$
\mathrm{BIC} \approx -2 \log p(D \mid M) + \text{constant}
$$ So differences in BIC can approximate differences in log marginal likelihood.
### Flowchart (Mermaid) ```mermaid
flowchart TD
A["Start with observed dataset D"] --> B["Choose two competing models M_1 and M_2"]
B --> C["Specify likelihood and prior for each model"]
C --> D["Compute marginal likelihood p(D | M_1)"]
C --> E["Compute marginal likelihood p(D | M_2)"]
D --> F["Form Bayes Factor B_12 = p(D | M_1) / p(D | M_2)"]
E --> F["Form Bayes Factor B_12 = p(D | M_1) / p(D | M_2)"]
F --> G["Interpret evidence from data"]
G --> H["Combine with prior odds to get posterior odds"]
H --> I["Use for model selection or hypothesis comparison"]