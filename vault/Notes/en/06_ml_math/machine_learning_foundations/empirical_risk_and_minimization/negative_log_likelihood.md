---
title: Negative Log-Likelihood
date: '2026-04-16'
wordCount: 1810
slug: negative_log_likelihood
permalink: /notes/06_ml_math/machine_learning_foundations/empirical_risk_and_minimization/negative_log_likelihood/index.html
share_status: draft
publish_target: note
boundary: public
---
# $$\mathrm{NLL}=-\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)$$ We are working on **Negative Log-Likelihood**, NLL, defined by $$\mathrm{NLL}=-\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta),$$ where $p(y_i\mid x_i,\theta)$ is the model-assigned conditional probability or density for observation $i$ under parameters $\theta$. This is a standard training objective for probabilistic models. Minimizing NLL is equivalent to maximizing likelihood, which is why NLL is central to maximum likelihood estimation, generalized linear models, and cross-entropy-based classification.
## Deep Breakdown Negative Log-Likelihood, NLL, is one of the most important objective functions in statistics and machine learning. It is used whenever a model outputs a probability distribution, or conditional density, for the target variable rather than only a point prediction. The core idea is: > A good probabilistic model should assign high probability to the outcomes that actually occurred. Suppose we have data: $$
(x_1,y_1),\dots,(x_n,y_n)
$$ and a probabilistic model with parameters $\theta$. For each observation, the model specifies: $$
p(y_i\mid x_i,\theta)
$$ This quantity measures how plausible the observed target $y_i$ is, given the input $x_i$ and the parameter vector $\theta$. If the model assigns large probability to observed outcomes, that is good.
If it assigns small probability to observed outcomes, that is bad. The likelihood of the full dataset is the product of these per-observation probabilities, under the usual conditional-independence assumption: $$
L(\theta)=\prod_{i=1}^{n}p(y_i\mid x_i,\theta)
$$ Maximizing this likelihood gives the maximum likelihood estimator, MLE. But products of many probabilities can become numerically tiny and difficult to optimize directly. So we take logarithms: $$
\log L(\theta)=\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)
$$ This turns products into sums, which is much easier mathematically and computationally. Then we multiply by $-1$ because most optimization procedures are written as minimization problems, not maximization problems: $$
\mathrm{NLL}=-\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)
$$ So minimizing NLL is exactly the same optimization problem as maximizing likelihood. This is why NLL appears everywhere: - linear regression under Gaussian noise,
- logistic regression,
- Poisson regression,
- multinomial classification,
- Bayesian estimation building blocks,
- neural-network classification losses,
- hidden Markov models,
- mixture models. NLL also connects directly to **cross-entropy**. In classification, when the target is categorical and the model outputs class probabilities, cross-entropy loss is the same as negative log-likelihood under the corresponding categorical or Bernoulli model. For DA/DS practice, NLL matters because it provides a principled training objective for probabilistic models. It does not just say whether the model got the answer right. It also evaluates how much confidence the model assigned to the observed outcome. That means: - confidently correct predictions get rewarded,
- confidently wrong predictions get punished heavily. This makes NLL more informative than accuracy in many settings.
### Flowchart (Mermaid) ```mermaid
flowchart TD
A["Start with data (x_i, y_i) and model parameters theta"] --> B["Model assigns p(y_i | x_i, theta) for each observation"]
B --> C["Multiply probabilities to form likelihood"]
C --> D["Take log to get log-likelihood as a sum"]
D --> E["Multiply by -1 to convert maximization into minimization"]
E --> F["Compute NLL = - sum log p(y_i | x_i, theta)"]
F --> G["Optimize theta by minimizing NLL"]
G --> H["Interpret as maximum likelihood training"]
```
### Real-World use: #### Situation it is used NLL is used when training probabilistic models for regression, classification, counts, event modeling, or any task where the model specifies a likelihood for observed outcomes.
#### Problem it solves It solves the problem of converting probabilistic fit into a tractable optimization objective. Instead of vaguely asking whether the model “fits the data,” it measures how much probability mass the model places on the outcomes that actually occurred.
#### How it solves the problem It takes the log of the likelihood to turn products into sums, then negates the result to produce a minimization objective. This creates a numerically stable and optimization-friendly loss.
#### Example of it used in the Working Context as DA/DS for a Business Suppose a subscription company trains a churn-probability model. For each customer, the model outputs a churn probability. If a customer actually churned, then assigning high churn probability reduces NLL. If the model assigned very low churn probability to a customer who churned, NLL increases sharply. This lets the analyst train a model that is not only directionally correct, but also probabilistically well-calibrated.
## The Formula (Fragment-First) | Symbol | Meaning |
| --- | --- |
| $x\_i$ | Input features for observation $i$ |
| $y\_i$ | Observed target for observation $i$ |
| $\\theta$ | Parameter vector of the probabilistic model |
| $p(y\_i\\mid x\_i,\\theta)$ | Model-assigned conditional probability or density for observation $i$ |
| $L(\\theta)$ | Likelihood of the full dataset |
| $\\log L(\\theta)$ | Log-likelihood |
| $\\mathrm{NLL}$ | Negative log-likelihood |
| $n$ | Number of observations | Likelihood under conditional independence: $$
L(\theta)=\prod_{i=1}^{n}p(y_i\mid x_i,\theta)
$$ Log-likelihood: $$
\log L(\theta)=\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)
$$ Canonical NLL formula: $$
\mathrm{NLL}=-\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)
$$ Average NLL form: $$
\overline{\mathrm{NLL}}=-\frac{1}{n}\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)
$$ MLE equivalence: $$
\hat{\theta}_{\mathrm{MLE}}=\arg\max_{\theta}L(\theta)=\arg\max_{\theta}\log L(\theta)=\arg\min_{\theta}\mathrm{NLL}
$$ Binary-classification Bernoulli special case: $$
\mathrm{NLL}=-\sum_{i=1}^{n}\left[y_i\log(p_i)+(1-y_i)\log(1-p_i)\right]
$$ ### Formula-to-English Translation For each observation, ask the model: > How much probability did you assign to what actually happened? Then take the logarithm of that probability. Since probabilities lie between 0 and 1, their logarithms are non-positive. Summing these log-probabilities gives the log-likelihood. Finally, multiply by negative one. This makes the objective non-negative in typical cases and turns the estimation problem into minimization. A low NLL means the model assigned high probability to observed outcomes. A high NLL means the model assigned low probability to what actually happened.
## Critical Concepts - **NLL is a probabilistic training objective.** It uses full probability assignments, not only hard decisions.
- **Minimizing NLL equals maximizing likelihood.** This is the key MLE connection.
- **Logarithms turn products into sums.** This is why log-likelihood is computationally practical.
- **NLL punishes confident mistakes strongly.** Very small assigned probability leads to large loss.
- **Cross-entropy is a special case of NLL in classification.** Bernoulli and categorical models produce the standard classification losses.
- **NLL depends on the assumed data model.** Gaussian, Bernoulli, Poisson, and multinomial models produce different NLL forms.
- **Average NLL and summed NLL have the same minimizer.** They differ only by scaling.
## Step-by-Step Manual Calculation (Tiny/Simplist Example) Suppose we have a binary classification problem with three observations. The true labels are: $$
y=[1,\ 0,\ 1]
$$ and the model predicts class-1 probabilities: $$
p=[0.9,\ 0.2,\ 0.4]
$$ For Bernoulli likelihood, the per-observation NLL is: $$
-\left[y_i\log(p_i)+(1-y_i)\log(1-p_i)\right]
$$ #### Step 1, compute loss for observation 1 Here: $$
y_1=1,\quad p_1=0.9
$$ So: $$
\mathrm{NLL}_1=-\log(0.9)\approx 0.1054
$$ #### Step 2, compute loss for observation 2 Here: $$
y_2=0,\quad p_2=0.2
$$ So: $$
\mathrm{NLL}_2=-\log(1-0.2)=-\log(0.8)\approx 0.2231
$$ #### Step 3, compute loss for observation 3 Here: $$
y_3=1,\quad p_3=0.4
$$ So: $$
\mathrm{NLL}_3=-\log(0.4)\approx 0.9163
$$ #### Step 4, sum the losses $$
\mathrm{NLL}=0.1054+0.2231+0.9163=1.2448
$$ #### Step 5, compute average NLL if desired $$
\overline{\mathrm{NLL}}=\frac{1.2448}{3}\approx 0.4149
$$ #### Interpretation The third observation contributes the most loss because the model assigned only 0.4 probability to an event that actually occurred.
#### Tiny plain-language reading The model did well on the first two observations, but it was not very confident on the third true positive, so the total negative log-likelihood increased.
### Real Application Examples #### Beginner friendly Example \[Python\]) ```markdown
import math # Binary classification negative log-likelihood
y_true = [1, 0, 1]
p_pred = [0.9, 0.2, 0.4] nll = 0.0 for y_value, p_value in zip(y_true, p_pred): loss = -(y_value * math.log(p_value) + (1 - y_value) * math.log(1 - p_value)) nll += loss average_nll = nll / len(y_true) print("Total NLL:", nll)
print("Average NLL:", average_nll)
``` Explanation
: - For each observation, the Bernoulli log-likelihood is computed.
- The negative sign converts it into a minimization loss.
- The final value summarizes how well the model’s probabilities matched the observed labels.
#### Beginner friendly Example \[R\]) ```markdown
R# Binary classification negative log-likelihood
y_true <- c(1, 0, 1)
p_pred <- c(0.9, 0.2, 0.4) nll <- 0 for (i in seq_along(y_true)) { y_value <- y_true[i] p_value <- p_pred[i] loss <- -(y_value * log(p_value) + (1 - y_value) * log(1 - p_value)) nll <- nll + loss
} average_nll <- nll / length(y_true) cat("Total NLL:", nll, "\n")
cat("Average NLL:", average_nll, "\n")
``` Explanation
: - The code computes the Bernoulli negative log-likelihood one observation at a time.
- This is the same objective used in logistic regression and many binary classifiers.
#### Final Professional Example \[Python\]) ```markdown
from __future__ import annotations import math
from dataclasses import dataclass
from typing import Sequence RANDOM_SEED = 42
EPSILON = 1e-15 @dataclass(frozen=True)
class BinaryProbabilisticModelOutput: true_labels: Sequence[int] predicted_probabilities: Sequence[float] def validate(self) -> None: if len(self.true_labels) == 0: raise ValueError("At least one observation is required.") if len(self.true_labels) != len(self.predicted_probabilities): raise ValueError("true_labels and predicted_probabilities must have the same length.") for label in self.true_labels: if label not in (0, 1): raise ValueError("Each true label must be 0 or 1.") for probability in self.predicted_probabilities: if not 0.0 <= probability <= 1.0: raise ValueError("Each predicted probability must lie in [0, 1].") def clip_probability(probability: float, epsilon: float = EPSILON) -> float: return min(max(probability, epsilon), 1.0 - epsilon) def negative_log_likelihood( true_labels: Sequence[int], predicted_probabilities: Sequence[float],
) -> float: if len(true_labels) == 0: raise ValueError("At least one observation is required.") if len(true_labels) != len(predicted_probabilities): raise ValueError("true_labels and predicted_probabilities must have the same length.") total_nll = 0.0 for label, probability in zip(true_labels, predicted_probabilities): clipped_probability = clip_probability(probability) total_nll += -( label * math.log(clipped_probability) + (1 - label) * math.log(1 - clipped_probability) ) return total_nll def average_negative_log_likelihood( true_labels: Sequence[int], predicted_probabilities: Sequence[float],
) -> float: return negative_log_likelihood(true_labels, predicted_probabilities) / len(true_labels) def summarize_probabilistic_fit(model_output: BinaryProbabilisticModelOutput) -> None: model_output.validate() total_nll = negative_log_likelihood( model_output.true_labels, model_output.predicted_probabilities, ) average_nll = average_negative_log_likelihood( model_output.true_labels, model_output.predicted_probabilities, ) print("Negative log-likelihood summary") print("-" * 72) for index, (label, probability) in enumerate( zip(model_output.true_labels, model_output.predicted_probabilities), start=1, ): clipped_probability = clip_probability(probability) loss = -( label * math.log(clipped_probability) + (1 - label) * math.log(1 - clipped_probability) ) print( f"Obs {index}: y={label}, p={probability:.6f}, " f"per-observation NLL={loss:.6f}" ) print("-" * 72) print(f"Total NLL: {total_nll:.6f}") print(f"Average NLL: {average_nll:.6f}") def main() -> None: # Binary churn-probability example model_output = BinaryProbabilisticModelOutput( true_labels=[1, 0, 1, 0, 1, 1], predicted_probabilities=[0.92, 0.15, 0.81, 0.35, 0.40, 0.73], ) summarize_probabilistic_fit(model_output) if __name__ == "__main__": main()
``` What
this professional example teaches: 1. NLL is computed directly from model-assigned probabilities for observed outcomes.
2. Probability clipping is often used in code to avoid numerical failure from $\\log(0)$.
3. Total NLL and average NLL summarize probabilistic fit across the sample.
4. This is the standard training objective for logistic regression and many other probabilistic classifiers.
## Self-Check: Mathematical Verification #### Re-derivation from the likelihood definition Assume the observations are conditionally independent given parameters $\\theta$. Then the dataset likelihood is: $$
L(\theta)=\prod_{i=1}^{n}p(y_i\mid x_i,\theta)
$$ Taking logarithms gives: $$
\log L(\theta)=\log\left(\prod_{i=1}^{n}p(y_i\mid x_i,\theta)\right)
$$ Using the log-product rule: $$
\log(ab)=\log a+\log b
$$ we obtain: $$
\log L(\theta)=\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)
$$ Multiplying by $-1$ gives: $$
\mathrm{NLL}=-\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)
$$ This matches the canonical formula exactly.
#### MLE equivalence check The maximum likelihood estimator is: $$
\hat{\theta}_{\mathrm{MLE}}=\arg\max_{\theta}L(\theta)
$$ Since logarithm is strictly increasing: $$
\arg\max_{\theta}L(\theta)=\arg\max_{\theta}\log L(\theta)
$$ Since multiplying by $-1$ reverses order: $$
\arg\max_{\theta}\log L(\theta)=\arg\min_{\theta}\left[-\log L(\theta)\right]
$$ Therefore: $$
\hat{\theta}_{\mathrm{MLE}}=\arg\min_{\theta}\mathrm{NLL}
$$ So minimizing NLL is exactly equivalent to maximizing likelihood.
#### Bernoulli special-case check For binary labels $y\_i\\in{0,1}$ with model probability $p\_i=P(Y=1\\mid x\_i,\\theta)$, the Bernoulli likelihood for one observation is: $$
p_i^{y_i}(1-p_i)^{1-y_i}
$$ Taking the logarithm gives: $$
\log p(y_i\mid x_i,\theta)=y_i\log(p_i)+(1-y_i)\log(1-p_i)
$$ Negating and summing over observations gives: $$
\mathrm{NLL}=-\sum_{i=1}^{n}\left[y_i\log(p_i)+(1-y_i)\log(1-p_i)\right]
$$ This is the standard binary cross-entropy loss, so the classification link is correct.
#### Non-negativity intuition check Since probabilities lie in $(0,1\]$, their logarithms are non-positive: $$
\log p \le 0
$$ So $-\\log p \\ge 0$. This is why NLL typically behaves as a non-negative loss, with larger penalties for smaller assigned probabilities.
#### Average-versus-total consistency Average NLL is: $$
\overline{\mathrm{NLL}}=-\frac{1}{n}\sum_{i=1}^{n}\log p(y_i\mid x_i,\theta)
$$ This differs from total NLL only by the positive constant $\\frac{1}{n}$, so both have the same minimizing parameter value.
#### Verbal-to-algebra consistency The verbal explanation says NLL is the negative log of the likelihood, that minimizing it equals maximizing likelihood, and that cross-entropy is its classification special case. The derivations confirm each of these claims.
#### Structural verification - Opening restatement paragraph is present.
- All required sections are present and non-empty.
- Block equations use `$$...$$`.
- Symbol-table entries use math mode such as `$x_i$`, `$y_i$`, `$\theta$`, `$L(\theta)$`, and `$\mathrm{NLL}$`.
- Mermaid uses `flowchart TD` and node text in `["..."]`.
- Three code blocks are present: Python beginner, R beginner, Python professional.
- Links to MLE, cross-entropy, GLMs, and probabilistic training are explicitly included.
- No placeholder text remains.
## Common Pitfalls and Edge Cases - **Confusing probability and density:** For continuous models, $p(y\_i\\mid x\_i,\\theta)$ is often a density, not a discrete probability.
- **Ignoring the conditional-independence assumption:** The simple product likelihood formula uses it.
- **Taking logs of zero:** Numerical implementations usually clip probabilities to avoid $\\log(0)$.
- **Comparing NLL across incompatible models without care:** The interpretation depends on the target distribution and observation scale.
- **Thinking NLL is only for classification:** It is a general likelihood-based objective used across many model families.
- **Using accuracy instead of NLL when probability quality matters:** NLL captures confidence and calibration pressure; accuracy does not.
- **Forgetting that lower NLL is better:** Because the objective is negated, minimization is the correct direction.
- **Ignoring model misspecification:** A low NLL within a candidate family does not guarantee that the probabilistic family itself is appropriate.
## References and Standard Results - Likelihood definition under conditional independence, $L(\\theta)=\\prod\_{i=1}^{n}p(y\_i\\mid x\_i,\\theta)$
- Log-likelihood definition, $\\log L(\\theta)=\\sum\_{i=1}^{n}\\log p(y\_i\\mid x\_i,\\theta)$
- Negative log-likelihood definition, $\\mathrm{NLL}=-\\sum\_{i=1}^{n}\\log p(y\_i\\mid x\_i,\\theta)$
- Equivalence of MLE and NLL minimization
- Bernoulli likelihood and binary cross-entropy equivalence
- Logarithm product rule, $\\log(ab)=\\log a+\\log b$
- Average NLL as a scaled version of total NLL
- Likelihood-based training in generalized linear models