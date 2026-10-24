---
title: General Form
date: '2026-04-16'
wordCount: 460
slug: general_form
permalink: /notes/06_ml_math/machine_learning_foundations/the_exponential_family/general_form/index.html
share_status: draft
publish_target: note
boundary: public
---
# $p(x \mid \eta) = h(x)\exp\{\eta^\top T(x) - A(\eta)\}$ We are working on the general form of the exponential family, where the canonical density or mass function is $$p(x \mid \eta) = h(x)\exp\{\eta^\top T(x) - A(\eta)\}.$$ Here $\eta$ is the natural parameter, $T(x)$ is the sufficient statistic, $h(x)$ is the base measure, and $A(\eta)$ is the log-partition function. This unified form covers many common distributions and is foundational for sufficient statistics, conjugate priors, generalized linear models, and canonical link functions.
## Deep Breakdown The exponential family is one of the most important structural classes in statistics and machine learning. Many commonly used distributions can be written in one shared algebraic form: $$
p(x \mid \eta) = h(x)\exp\{\eta^\top T(x) - A(\eta)\}
$$ This is powerful because it means many apparently different models, Bernoulli, Binomial, Poisson, Gaussian, Exponential, Gamma in some parameterizations, all share the same core architecture. The exponential-family form separates a distribution into four parts: 1. **Base measure**: $$ h(x) $$ This depends only on the observation $x$, not on the parameter. 2. **Natural parameter**: $$ \eta $$ This is the parameterization that makes the exponential-family structure explicit. 3. **Sufficient statistic**: $$ T(x) $$ This is the data summary through which the parameter interacts with the observation. 4. **Log-partition function**: $$ A(\eta) $$ This ensures the distribution normalizes properly. Inputs: - observation $x$,
- natural parameter $\eta$. Outputs: - the density or probability mass at $x$. Why it matters in DA/DS: - it provides a common language for many models,
- it explains sufficient statistics cleanly,
- it makes conjugate prior analysis tractable,
- it underlies generalized linear models, GLMs,
- it simplifies gradient and moment calculations,
- it connects optimization, inference, and probabilistic modeling. A major reason the exponential family matters is that it turns many probability models into a standard computational object. Once a model is recognized as exponential-family, we often get immediately: - sufficient statistics,
- moment formulas from derivatives of $A(\eta)$,
- convenient likelihood expressions,
- efficient estimation structure,
- canonical link functions in GLMs. This object links directly to: - **Fisher–Neyman factorization**, because exponential-family models expose sufficient statistics explicitly,
- **conjugate priors**, because exponential-family likelihoods admit elegant prior-posterior updates,
- **GLMs**, because their response distributions typically come from exponential families,
- **canonical links**, because the natural parameter $\eta$ defines the canonical link.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with a distribution p(x | parameter)"] --> B["Rewrite it into exponential-family form"] B --> C["Identify base measure h(x)"] C --> D["Identify sufficient statistic T(x)"] D --> E["Identify natural parameter η"] E --> F["Identify log-partition function A(η)"] F --> G["Verify normalization"] G --> H["Use T(x) for data reduction"] H --> I["Use A(η) for moments and likelihood analysis"] I --> J["Connect to GLMs, conjugate priors, and efficient inference"]