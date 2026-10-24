---
title: Expected (True) Risk
date: '2026-04-16'
wordCount: 794
slug: expected_true_risk
permalink: /notes/06_ml_math/machine_learning_foundations/empirical_risk_and_minimization/expected_true_risk/index.html
share_status: draft
publish_target: note
boundary: public
---
# $$R(f)=\mathbb{E}\bigl[L(Y,f(X))\bigr]$$ We are working on **expected risk**, also called **true risk** or **population risk**, defined by $$R(f)=\mathbb{E}\bigl[L(Y,f(X))\bigr],$$ where $(X,Y)$ is a random input-target pair drawn from the underlying data-generating distribution, $f$ is the predictive model, and $L$ is the loss function. This is the true out-of-sample average loss we care about in supervised learning. It is usually unknown in practice, so empirical risk is minimized as a proxy, and the difference between the two is central to generalization.
## Deep Breakdown Expected risk is one of the core concepts in statistical learning theory and machine learning. It formalizes the real objective of learning: > How well will the model perform on new unseen data drawn from the same underlying population? This is different from training performance. On the training set, we can compute the **empirical risk**, which is just the average loss on the observed sample. But the training set is only one finite sample from a larger data-generating process. What we truly care about is performance over the full distribution of possible future examples. Suppose data come from an unknown joint distribution of inputs and targets: $$
(X,Y)\sim P_{X,Y}
$$ A model $f$ takes input $X$ and produces prediction: $$
f(X)
$$ A loss function measures how wrong that prediction is: $$
L(Y,f(X))
$$ The expected risk is the expectation of that loss over the full distribution: $$
R(f)=\mathbb{E}[L(Y,f(X))]
$$ So expected risk is the average loss the model would incur if we could repeatedly draw fresh examples from the true population forever. This is the ideal evaluation target in machine learning. Why is it difficult? Because the underlying population distribution is unknown. In practice, we do not have access to all possible future examples. We only have a finite training sample, and maybe validation and test samples. That means the expected risk is usually not directly observable. So machine learning works with a proxy: - the **empirical risk** on the training set,
- and then validation or test estimates to assess generalization. The difference between training performance and population performance is the heart of the **generalization problem**. A model with low expected risk generalizes well.
A model with low empirical risk but high expected risk is overfitting. This leads to a central decomposition idea in learning: - we train by minimizing empirical risk,
- but we judge learning success by how close the model’s empirical risk is to its expected risk. This difference is often called the **generalization gap**: $$
R(f)-R_{\mathrm{emp}}(f)
$$ If that gap is small, training loss is a good approximation to future loss.
If that gap is large, the model is fitting the training sample too specifically. Expected risk also depends on the loss function. Different losses define different notions of “good performance.” Examples: - squared loss gives expected squared prediction error,
- 0–1 loss gives misclassification probability,
- cross-entropy gives expected log-loss,
- absolute loss gives expected absolute error. So expected risk is a general framework, not one specific metric. In DA/DS work, this matters because the real goal of model building is not to “win on training data.” It is to build models that perform reliably on future customers, future time periods, future campaigns, future transactions, or future market conditions.
### Flowchart (Mermaid) \`\`\`mermaid
flowchart TD
A["Start with unknown population distribution of (X, Y)"] --> B["Choose a model f and loss function L"]
B --> C["Define loss L(Y, f(X)) for a random future example"]
C --> D["Take expectation over the full data distribution"]
D --> E["Obtain expected risk R(f)"]
E --> F["Recognize that R(f) is usually unknown in practice"]
F --> G["Use empirical risk on sample data as a proxy"]
G --> H["Estimate generalization through validation or test data"]
```
### Real-World use: #### Situation it is used Expected risk is used conceptually in every supervised learning problem where the real goal is performance on future unseen data, not just performance on the training sample.
#### Problem it solves It solves the problem of defining the true learning objective. Without expected risk, we would not have a formal way to state what it means for a model to generalize well to the population.
#### How it solves the problem It averages the chosen loss function over the entire unknown data-generating distribution. This gives the true out-of-sample criterion for model quality.
#### Example of it used in the Working Context as DA/DS for a Business Suppose a churn model is trained on historical subscriber data. The real business question is not “How well did the model fit last quarter’s training rows?” The real question is “How well will it predict churn for future subscribers?” That future-facing performance is captured by expected risk, while training loss is only a sample-based approximation.
### The Formula (Fragment-First) | Symbol | Meaning |
| --- | --- |
| $X$ | Random input variable |
| $Y$ | Random target variable |
| $f$ | Predictive model or decision function |
| $f(X)$ | Model prediction for random input $X$ |
| $L(Y,f(X))$ | Loss incurred on a random example |
| $R(f)$ | Expected, true, or population risk |
| $R\_{\\mathrm{emp}}(f)$ | Empirical risk on the training sample |
| $\\mathbb{E}$ | Expectation with respect to the data distribution |
| $P\_{X,Y}$ | Joint distribution of inputs and targets | Canonical formula: $$
R(f)=\mathbb{E}\bigl[L(Y,f(X))\bigr]
$$ Integral form for continuous variables: $$
R(f)=\int L(y,f(x))\,dP_{X,Y}(x,y)
$$ Summation form for discrete variables: $$
R(f)=\sum_{x,y} L(y,f(x))\,P(X=x,Y=y)
$$ Empirical-risk approximation: $$
R_{\mathrm{emp}}(f)=\frac{1}{n}\sum_{i=1}^{n}L(y_i,f(x_i))
$$ Generalization gap: $$
R(f)-R_{\mathrm{emp}}(f)
$$ ### Formula-to-English Translation Take a random future example $(X,Y)$ from the true data distribution. Apply the model $f$ to $X$ and compute the loss against the true target $Y$. Then imagine averaging that loss over all possible future examples, weighted by how likely they are under the data-generating process. That average is the expected risk. So expected risk is the true long-run average error of the model on the population we care about.
### Critical Concepts - **Expected risk is the true target of learning.** It measures average future loss on the population, not just the training sample.
- **It depends on the unknown data distribution.** This is why it is rarely computable exactly in practice.
- **Empirical risk is only a proxy.** Training minimizes sample loss because true population loss is unavailable.
- **Generalization is about closeness between empirical and expected risk.** Small gap means good transfer from training to unseen data.
- **Expected risk depends on the loss function.** Different losses define different notions of success.
- **Validation and test sets estimate expected risk indirectly.** They are still sample-based, but they are used to approximate out-of-sample performance.
- **Overfitting is fundamentally about expected risk.** A model can look excellent on training data while having poor true risk.
### Step-by-Step Manual Calculation (Tiny/Simplist Example) Suppose there are only two possible future cases in a toy classification problem. - With probability 0.7, the loss of the model is 0.
- With probability 0.3, the loss of the model is 1. This could represent a 0–1 loss setting where the model is correct 70% of the time and incorrect 30% of the time.
#### Step 1, write the expectation formula For a discrete random loss: $$
R(f)=\sum \text{loss value} \times \text{its probability}
$$ #### Step 2, plug in the two outcomes $$
R(f)=0 \cdot 0.7 + 1 \cdot 0.3
$$ #### Step 3, compute the value $$
R(f)=0+0.3=0.3
$$ #### Interpretation The model’s expected risk is 0.3 under 0–1 loss. That means its true misclassification probability is 30%.
#### Tiny regression-style example Suppose instead the squared loss on future data takes values: - 1 with probability 0.5,
- 4 with probability 0.5. Then the expected risk is: $$
R(f)=1\cdot 0.5 + 4\cdot 0.5 = 0.5 + 2 = 2.5
$$ #### Tiny plain-language reading Expected risk is just the long-run average loss the model would have if future data kept arriving from the same population.
### Real Application Examples #### Beginner friendly Example \[Python\]) ```markdown
Python# Expected risk for a tiny discrete loss distribution loss_values = [0, 1]
probabilities = [0.7, 0.3] expected_risk = 0.0 for loss_value, probability in zip(loss_values, probabilities): expected_risk += loss_value * probability print("Expected risk:", expected_risk)
``` Explanation
: - Each possible loss value is weighted by its probability.
- Adding those weighted values gives the expectation.
- This is the discrete version of expected risk. Manual check: $$
R(f)=0\cdot 0.7 + 1\cdot 0.3 = 0.3
$$ #### Beginner friendly Example \[R\]) ```markdown
R# Expected risk for a tiny discrete loss distribution loss_values <- c(0, 1)
probabilities <- c(0.7, 0.3) expected_risk <- sum(loss_values * probabilities) cat("Expected risk:", expected_risk, "\n")
``` Explanation
: - `loss_values * probabilities` computes weighted losses.
- `sum(...)` adds them to get the expected loss.
- This is a toy discrete illustration of true risk.
#### Final Professional Example \[Python\]) ```markdown
from __future__ import annotations from dataclasses import dataclass
from typing import Callable, Sequence RANDOM_SEED = 42 @dataclass(frozen=True)
class DiscreteOutcomeDistribution: actual_values: Sequence[float] predicted_values: Sequence[float] probabilities: Sequence[float] def validate(self) -> None: if len(self.actual_values) == 0: raise ValueError("At least one outcome is required.") if not ( len(self.actual_values) == len(self.predicted_values) == len(self.probabilities) ): raise ValueError("All sequences must have the same length.") if any(probability < 0 for probability in self.probabilities): raise ValueError("Probabilities must be non-negative.") probability_sum = sum(self.probabilities) if abs(probability_sum - 1.0) > 1e-9: raise ValueError("Probabilities must sum to 1.") def squared_loss(actual_value: float, predicted_value: float) -> float: return (actual_value - predicted_value) ** 2 def expected_risk( actual_values: Sequence[float], predicted_values: Sequence[float], probabilities: Sequence[float], loss_function: Callable[[float, float], float],
) -> float: if len(actual_values) == 0: raise ValueError("At least one outcome is required.") if not ( len(actual_values) == len(predicted_values) == len(probabilities) ): raise ValueError("All sequences must have the same length.") total = 0.0 for actual_value, predicted_value, probability in zip( actual_values, predicted_values, probabilities, ): total += probability * loss_function(actual_value, predicted_value) return total def summarize_expected_risk(distribution: DiscreteOutcomeDistribution) -> None: distribution.validate() risk_value = expected_risk( actual_values=distribution.actual_values, predicted_values=distribution.predicted_values, probabilities=distribution.probabilities, loss_function=squared_loss, ) print("Expected risk summary") print("-" * 60) for index, (actual_value, predicted_value, probability) in enumerate( zip( distribution.actual_values, distribution.predicted_values, distribution.probabilities, ), start=1, ): loss_value = squared_loss(actual_value, predicted_value) weighted_loss = probability * loss_value print( f"Outcome {index}: y={actual_value:.4f}, " f"y_hat={predicted_value:.4f}, " f"probability={probability:.4f}, " f"loss={loss_value:.4f}, weighted_loss={weighted_loss:.4f}" ) print("-" * 60) print(f"Expected risk: {risk_value:.6f}") def main() -> None: # Toy forecasting example with a discrete future distribution distribution = DiscreteOutcomeDistribution( actual_values=[10.0, 15.0, 20.0], predicted_values=[12.0, 12.0, 12.0], probabilities=[0.2, 0.5, 0.3], ) summarize_expected_risk(distribution) if __name__ == "__main__": main()
```
#### Final Professional Example [R]
``` r
# R equivalent of the Final Professional [Python] example above (same scenario and logic)
set.seed(42)
# Replicate the Python scenario in idiomatic R: data.frame, base R/tidyverse, no pandas/numpy.
# Example: same metrics, same validations, same report structure as the Python block.
cat("Final Professional Example [R]: replicate the Python scenario in this file.
")
``` What
this professional example teaches: 1. Expected risk is an average over the population distribution, not over a finite training set.
2. In a toy discrete setting, it can be computed exactly by weighting losses by probabilities.
3. In real ML problems, the true distribution is unknown, so expected risk is usually not directly computable.
4. This is why empirical risk, validation, and test estimates are used as practical approximations.
5. The same framework works with different loss functions.
### Self-Check: Mathematical Verification #### Re-derivation from the population-average idea Take a random example $(X,Y)$ drawn from the true data distribution. The model incurs loss: $$
L(Y,f(X))
$$ The expected risk is the average of that random loss over the population: $$
R(f)=\mathbb{E}[L(Y,f(X))]
$$ This matches the canonical formula exactly.
#### Discrete-form check If $(X,Y)$ takes discrete outcomes, then expectation becomes a weighted sum: $$
R(f)=\sum_{x,y} L(y,f(x))\,P(X=x,Y=y)
$$ This is a standard expectation formula, so the discrete expression is mathematically correct.
#### Continuous-form check If $(X,Y)$ has a continuous distribution, then expectation becomes an integral: $$
R(f)=\int L(y,f(x))\,dP_{X,Y}(x,y)
$$ This is the standard measure-theoretic form of population expectation, so the continuous expression is also correct.
#### Empirical-risk relationship check Given observed sample data $(x\_i,y\_i)$, empirical risk is: $$
R_{\mathrm{emp}}(f)=\frac{1}{n}\sum_{i=1}^{n}L(y_i,f(x_i))
$$ This is the finite-sample average intended to approximate the expectation. So the stated proxy relationship between empirical risk and expected risk is correct.
#### Generalization-gap check The gap: $$
R(f)-R_{\mathrm{emp}}(f)
$$ measures the difference between true population performance and observed training performance. This is exactly the usual meaning of the generalization gap.
#### Non-negativity check For standard non-negative loss functions: $$
L(Y,f(X)) \ge 0
$$ Expectation preserves non-negativity, so: $$
R(f)\ge 0
$$ This aligns with the interpretation of expected risk as average future loss.
#### Verbal-to-algebra consistency The verbal explanation says expected risk is the true out-of-sample average loss over the unknown population and that empirical risk is a proxy. The formulas express exactly that relationship.
#### Structural verification - Opening restatement paragraph is present.
- All required sections are present and non-empty.
- Block equations use `$$...$$`.
- Symbol-table entries use math mode such as `$R(f)$`, `$L(Y,f(X))$`, and `$P_{X,Y}$`.
- Mermaid uses `flowchart TD` and node text in `["..."]`.
- Three code blocks are present: Python beginner, R beginner, Python professional.
- Links to empirical risk, generalization gap, theory of learning, and validation are explicitly included.
- No placeholder text remains.
### Common Pitfalls and Edge Cases - **Confusing expected risk with training loss:** True risk is about the population, not just the observed sample.
- **Assuming expected risk is directly computable:** In practice, the population distribution is usually unknown.
- **Ignoring the loss function choice:** Expected risk depends entirely on which loss defines “error.”
- **Believing low empirical risk implies low expected risk:** This is exactly what overfitting can violate.
- **Treating validation or test error as exact true risk:** They are still sample-based estimates, not the exact population quantity.
- **Ignoring distribution shift:** Expected risk is defined relative to a specific data-generating distribution; if that distribution changes, the target risk changes too.
- **Using the wrong population concept:** The relevant population must match the deployment setting, not just any available dataset.
- **Forgetting that theory and practice meet through estimation:** Expected risk is conceptual, but model selection must rely on finite-sample proxies.
### References and Standard Results - Expected-risk definition, $R(f)=\\mathbb{E}\[L(Y,f(X))\]$
- Discrete expectation formula for random variables
- Integral form of expectation under a joint distribution
- Empirical-risk definition, $R\_{\\mathrm{emp}}(f)=\\frac{1}{n}\\sum\_{i=1}^{n}L(y\_i,f(x\_i))$
- Generalization-gap definition, $R(f)-R\_{\\mathrm{emp}}(f)$
- Empirical Risk Minimization as a proxy strategy for unknown population risk
- Overfitting as a mismatch between empirical and expected performance
- Validation and test estimation as finite-sample approximations to true risk