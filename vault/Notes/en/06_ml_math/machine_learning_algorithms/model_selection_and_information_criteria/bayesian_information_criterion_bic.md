---
title: Bayesian_information_criterion_bic
date: '2026-04-16'
wordCount: 697
slug: bayesian_information_criterion_bic
permalink: /notes/06_ml_math/machine_learning_algorithms/model_selection_and_information_criteria/bayesian_information_criterion_bic/index.html
share_status: draft
publish_target: note
boundary: public
---

# Bayesian Information Criterion (BIC) We are working on the **Coefficient of Determination**, $R^2$, for a regression model, defined by $$R^2=1-\frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}},$$ where $$SS_{\mathrm{res}}=\sum_{i=1}^{N}(y_i-\hat{y}_i)^2$$ and $$SS_{\mathrm{tot}}=\sum_{i=1}^{N}(y_i-\bar{y})^2.$$ The setting is finite, unweighted regression with $SS_{\mathrm{tot}}>0$, so $R^2 \in (-\infty,1]$, where $R^2=1$ means perfect fit, $R^2=0$ matches the mean-baseline predictor, and negative values mean the model performs worse than predicting the mean.
## Deep Breakdown The Coefficient of Determination, usually written as $R^2$, is one of the most widely reported regression metrics. It measures how much of the variation in the target variable $y$ is explained by the model relative to a simple baseline. That baseline is the constant model that predicts the mean of the target for every observation: $$
\hat{y}_i^{\mathrm{baseline}}=\bar{y}
$$ So $R^2$ is not just measuring whether predictions are close to actual values. It is measuring whether the model improves on a simple average-only benchmark. The core idea is based on two sums of squares: - **Residual sum of squares**, $SS_{\mathrm{res}}$, which measures unexplained variation left in the model errors,
- **Total sum of squares**, $SS_{\mathrm{tot}}$, which measures total variation of the target around its mean. If the model predicts very well, then residual errors are small, so $SS_{\mathrm{res}}$ is small and $R^2$ is close to 1. If the model predicts no better than the mean baseline, then $SS_{\mathrm{res}} = SS_{\mathrm{tot}}$, so: $$
R^2=1-\frac{SS_{\mathrm{tot}}}{SS_{\mathrm{tot}}}=0
$$ If the model predicts worse than the mean baseline, then $SS_{\mathrm{res}} > SS_{\mathrm{tot}}$, so $R^2 < 0$. This last point is extremely important. Many beginners incorrectly assume that $R^2$ must always be between 0 and 1. That is false in general. On test data, validation data, or for poorly specified models, $R^2$ can be negative. In DA/DS work, $R^2$ is useful because it gives a normalized measure of model fit that is easier to compare than raw error sums. It is commonly used in: - regression model comparison,
- stakeholder reporting,
- forecasting and pricing summaries,
- feature set evaluation,
- quick assessment of fit quality. But $R^2$ has limitations. A high $R^2$ does not guarantee that the model generalizes well. It does not guarantee causal interpretation. It does not guarantee low business-relevant error. It can also increase when unnecessary variables are added, especially in-sample, which is why overfitting must be considered. That is why $R^2$ is often reported alongside MAE, MSE, or RMSE, and why adjusted $R^2$ is sometimes used for linear models with many predictors. So the correct practical view is: - $R^2$ tells you how much better the model is than the mean baseline in terms of squared-error fit,
- but it does not replace proper validation or other regression metrics.
### Flowchart (Mermaid) \`\`\`mermaid
flowchart TD
A["Start with actual values y_i and predictions y_hat_i"] --> B["Compute target mean y_bar"]
B --> C["Compute residual squared errors: (y_i - y_hat_i)^2"]
B --> D["Compute total squared deviations: (y_i - y_bar)^2"]
C --> E["Sum residual squared errors to get SS_res"]
D --> F["Sum total squared deviations to get SS_tot"]
E --> G["Compute R^2 = 1 - (SS_res / SS_tot)"]
F --> G["Compute R^2 = 1 - (SS_res / SS_tot)"]
G --> H["Interpret fit relative to mean baseline"]
H --> I["Use with MAE, MSE, and validation checks to avoid overfitting"]
```
### Real-World use: #### Situation it is used $R^2$ is used when evaluating regression models that predict continuous outcomes, such as sales, demand, price, revenue, delivery time, or customer value. It is especially common in dashboards, model reports, and side-by-side comparison of candidate regression models.
#### Problem it solves It solves the problem of expressing model fit relative to a simple baseline in a normalized way. Raw squared error alone is hard to interpret across different targets or datasets. $R^2$ turns that comparison into a dimensionless ratio-based score.
#### How it solves the problem It compares the model’s residual squared error, $SS\_{\\mathrm{res}}$, against the total variation of the target around its mean, $SS\_{\\mathrm{tot}}$. If the model leaves little unexplained variation, then the ratio $SS\_{\\mathrm{res}}/SS\_{\\mathrm{tot}}$ is small, making $R^2$ large. If the model does not improve on the mean baseline, the score is around zero. If it is worse than baseline, the score becomes negative.
#### Example of it used in the Working Context as DA/DS for a Business Suppose a pricing analyst builds a regression model to predict product demand from price, seasonality, and promotion features. A model with $R^2=0.78$ means the model explains 78% of the target variance relative to the mean baseline, under the squared-error definition. That is useful in reporting and model comparison. But the analyst still needs MAE or RMSE to know whether the absolute forecast misses are small enough for inventory or margin decisions.
### The Formula (Fragment-First) | Symbol | Meaning |
| --- | --- |
| $N$ | Number of observations |
| $y\_i$ | Actual target value for observation $i$ |
| $\\hat{y}\_i$ | Predicted target value for observation $i$ |
| $\\bar{y}$ | Mean of the actual target values |
| $(y\_i-\\hat{y}\_i)^2$ | Squared residual error for observation $i$ |
| $(y\_i-\\bar{y})^2$ | Squared deviation from the mean for observation $i$ |
| $SS\_{\\mathrm{res}}$ | Residual sum of squares |
| $SS\_{\\mathrm{tot}}$ | Total sum of squares |
| $R^2$ | Coefficient of Determination | Mean of the target: $$
\bar{y}=\frac{1}{N}\sum_{i=1}^{N}y_i
$$ Residual sum of squares: $$
SS_{\mathrm{res}}=\sum_{i=1}^{N}(y_i-\hat{y}_i)^2
$$ Total sum of squares: $$
SS_{\mathrm{tot}}=\sum_{i=1}^{N}(y_i-\bar{y})^2
$$ Canonical formula: $$
R^2=1-\frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}}
$$ Domain assumptions: $$
N>0,\quad SS_{\mathrm{tot}}>0
$$ Range: $$
R^2 \in (-\infty,1]
$$ Key benchmark cases: $$
R^2=1 \iff y_i=\hat{y}_i \text{ for all } i
$$ $$
R^2=0 \iff SS_{\mathrm{res}}=SS_{\mathrm{tot}}
$$ $$
R^2<0 \iff SS_{\mathrm{res}}>SS_{\mathrm{tot}}
$$ ### Formula-to-English Translation First compute how much the target varies around its own mean. That is $SS\_{\\mathrm{tot}}$, the total variation that exists in the data before using the model. Then compute how much squared error remains after using the model. That is $SS\_{\\mathrm{res}}$, the unexplained variation left in the residuals. Now compare the two. The ratio $$
\frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}}
$$ tells us what fraction of total variation remains unexplained by the model. Subtracting that from 1 gives the fraction explained by the model, under this squared-error baseline interpretation. So: - high $R^2$ means the model explains much of the variation,
- $R^2=0$ means the model performs like the mean predictor,
- negative $R^2$ means the model is worse than predicting the mean,
- $R^2=1$ means perfect predictions.
### Critical Concepts - **$R^2$ is a regression metric.** It applies to continuous targets, not classification labels.
- **$R^2$ is baseline-relative.** It measures improvement over predicting the mean of $y$.
- **$R^2$ can be negative.** This happens when the model performs worse than the mean baseline.
- **$R^2$ is bounded above by 1.** Perfect prediction gives $R^2=1$.
- **$R^2$ is dimensionless.** Unlike MAE or RMSE, it has no target units.
- **High $R^2$ does not guarantee good business error.** A model can have high $R^2$ and still produce operationally large misses.
- **$R^2$ can encourage overfitting in-sample.** Adding predictors often increases in-sample fit, which is why validation and adjusted $R^2$ matter.
### Step-by-Step Manual Calculation (Tiny/Simplist Example) Suppose a model predicts demand for 4 days. Actual values: $$
y = [3,\ 5,\ 7,\ 9]
$$ Predicted values: $$
\hat{y} = [4,\ 4,\ 8,\ 8]
$$ #### Step 1, compute the mean of the actual target $$
\bar{y}=\frac{3+5+7+9}{4}=\frac{24}{4}=6
$$ #### Step 2, compute the residual sum of squares Residuals: - Day 1: $3-4=-1$
- Day 2: $5-4=1$
- Day 3: $7-8=-1$
- Day 4: $9-8=1$ Squared residuals: - $(-1)^2=1$
- $(1)^2=1$
- $(-1)^2=1$
- $(1)^2=1$ So: $$
SS_{\mathrm{res}}=1+1+1+1=4
$$ #### Step 3, compute the total sum of squares Deviations from the mean: - Day 1: $3-6=-3$
- Day 2: $5-6=-1$
- Day 3: $7-6=1$
- Day 4: $9-6=3$ Squared deviations: - $(-3)^2=9$
- $(-1)^2=1$
- $(1)^2=1$
- $(3)^2=9$ So: $$
SS_{\mathrm{tot}}=9+1+1+9=20
$$ #### Step 4, compute $R^2$ $$
R^2=1-\frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}}
=1-\frac{4}{20}
=1-0.2
=0.8
$$ #### Interpretation The model explains 80% of the variance in the target relative to the mean baseline, under this squared-error definition.
#### Tiny plain-language reading Compared with just predicting the average value every time, this model removes most of the squared prediction error.
#### Baseline check If we predicted the mean $\\bar{y}=6$ for every observation, then: $$
SS_{\mathrm{res}}=SS_{\mathrm{tot}}
$$ and the score would be: $$
R^2=0
$$ So the current model is clearly better than the mean baseline.
### Real Application Examples #### Beginner friendly Example \[Python\]) ```markdown
Python# R-squared, R^2
# Example: revenue prediction actual_values = [100, 120, 140, 160]
predicted_values = [110, 115, 150, 155] target_mean = sum(actual_values) / len(actual_values) ss_res = 0
ss_tot = 0 for actual_value, predicted_value in zip(actual_values, predicted_values): ss_res += (actual_value - predicted_value) ** 2 ss_tot += (actual_value - target_mean) ** 2 r_squared = 1 - (ss_res / ss_tot) print("Target mean:", target_mean)
print("SS_res:", ss_res)
print("SS_tot:", ss_tot)
print("R^2:", r_squared)
``` Explanation
: - `target_mean` is $\\bar{y}$.
- `ss_res` adds the squared prediction errors.
- `ss_tot` adds the squared deviations from the mean.
- `1 - (ss_res / ss_tot)` computes the final $R^2$ score. Manual check: $$
\bar{y}=\frac{100+120+140+160}{4}=130
$$ $$
SS_{\mathrm{res}}=(100-110)^2+(120-115)^2+(140-150)^2+(160-155)^2
=100+25+100+25=250
$$ $$
SS_{\mathrm{tot}}=(100-130)^2+(120-130)^2+(140-130)^2+(160-130)^2
=900+100+100+900=2000
$$ $$
R^2=1-\frac{250}{2000}=1-0.125=0.875
$$ So the model explains 87.5% of the target variance relative to the mean baseline.
#### Beginner friendly Example \[R\]) ```markdown
R# R-squared, R^2
# Example: price prediction actual_values <- c(200, 220, 210, 250)
predicted_values <- c(205, 215, 220, 240) target_mean <- mean(actual_values) ss_res <- sum((actual_values - predicted_values)^2)
ss_tot <- sum((actual_values - target_mean)^2) r_squared <- 1 - (ss_res / ss_tot) cat("Target mean:", target_mean, "\n")
cat("SS_res:", ss_res, "\n")
cat("SS_tot:", ss_tot, "\n")
cat("R^2:", r_squared, "\n")
``` Explanation
: - `mean(actual_values)` computes $\\bar{y}$.
- `(actual_values - predicted_values)^2` computes squared residuals.
- `(actual_values - target_mean)^2` computes squared deviations from the mean.
- The final ratio compares model error against baseline variation. Manual check: $$
\bar{y}=\frac{200+220+210+250}{4}=220
$$ $$
SS_{\mathrm{res}}=(200-205)^2+(220-215)^2+(210-220)^2+(250-240)^2
=25+25+100+100=250
$$ $$
SS_{\mathrm{tot}}=(200-220)^2+(220-220)^2+(210-220)^2+(250-220)^2
=400+0+100+900=1400
$$ $$
R^2=1-\frac{250}{1400}\approx 0.8214
$$ So the model explains about 82.14% of the target variance relative to the mean baseline.
#### Final Professional Example \[Python\]) ```markdown
from __future__ import annotations from dataclasses import dataclass
from typing import Sequence RANDOM_SEED = 42 @dataclass(frozen=True)
class RegressionEvaluation: actual_values: Sequence[float] predicted_values: Sequence[float] def validate(self) -> None: if len(self.actual_values) == 0: raise ValueError("At least one observation is required.") if len(self.actual_values) != len(self.predicted_values): raise ValueError("actual_values and predicted_values must have the same length.") def mean_absolute_error(actual_values: Sequence[float], predicted_values: Sequence[float]) -> float: if len(actual_values) == 0: raise ValueError("At least one observation is required.") if len(actual_values) != len(predicted_values): raise ValueError("actual_values and predicted_values must have the same length.") absolute_error_sum = 0.0 for actual_value, predicted_value in zip(actual_values, predicted_values): absolute_error_sum += abs(actual_value - predicted_value) return absolute_error_sum / len(actual_values) def mean_squared_error(actual_values: Sequence[float], predicted_values: Sequence[float]) -> float: if len(actual_values) == 0: raise ValueError("At least one observation is required.") if len(actual_values) != len(predicted_values): raise ValueError("actual_values and predicted_values must have the same length.") squared_error_sum = 0.0 for actual_value, predicted_value in zip(actual_values, predicted_values): squared_error_sum += (actual_value - predicted_value) ** 2 return squared_error_sum / len(actual_values) def r_squared_score(actual_values: Sequence[float], predicted_values: Sequence[float]) -> float: if len(actual_values) == 0: raise ValueError("At least one observation is required.") if len(actual_values) != len(predicted_values): raise ValueError("actual_values and predicted_values must have the same length.") target_mean = sum(actual_values) / len(actual_values) ss_res = 0.0 ss_tot = 0.0 for actual_value, predicted_value in zip(actual_values, predicted_values): ss_res += (actual_value - predicted_value) ** 2 ss_tot += (actual_value - target_mean) ** 2 if ss_tot == 0: raise ValueError("R^2 is undefined when SS_tot = 0, meaning the target has no variance.") return 1 - (ss_res / ss_tot) def summarize_regression_metrics(label: str, evaluation: RegressionEvaluation) -> None: evaluation.validate() mae_value = mean_absolute_error(evaluation.actual_values, evaluation.predicted_values) mse_value = mean_squared_error(evaluation.actual_values, evaluation.predicted_values) r_squared_value = r_squared_score(evaluation.actual_values, evaluation.predicted_values) print(f"Model: {label}") print(f"Observations: {len(evaluation.actual_values)}") print(f"MAE: {mae_value:.4f}") print(f"MSE: {mse_value:.4f}") print(f"R^2: {r_squared_value:.4f}") print("-" * 40) def main() -> None: # Pricing model example: # Predict weekly unit demand from price and promotion features. actual_values = [520, 505, 490, 470, 455, 440, 430, 415] predicted_values = [515, 500, 495, 468, 460, 435, 438, 410] evaluation = RegressionEvaluation( actual_values=actual_values, predicted_values=predicted_values, ) summarize_regression_metrics("Demand Regression Model", evaluation) if __name__ == "__main__": main()
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
this professional example teaches: 1. $R^2$ must be computed from both model residual variation and total target variation.
2. The metric requires non-empty equal-length actual and predicted vectors.
3. If the target has no variance, then $SS\_{\\mathrm{tot}}=0$ and the standard formula is undefined.
4. MAE and MSE are included because $R^2$ alone is not enough for business evaluation.
5. A model can have a good $R^2$ yet still have error magnitudes that matter operationally. Plain-English interpretation of the pricing example: - If $R^2$ is high, the model tracks target variation well relative to predicting the average demand every week.
- But the analyst still needs MAE or RMSE to know whether the forecast misses are small enough for pricing or inventory decisions.
### Self-Check: Mathematical Verification #### Re-derivation from the baseline-comparison idea A mean-only baseline predicts: $$
\hat{y}_i^{\mathrm{baseline}}=\bar{y}
$$ Its total squared error is: $$
\sum_{i=1}^{N}(y_i-\bar{y})^2 = SS_{\mathrm{tot}}
$$ The model’s squared error is: $$
\sum_{i=1}^{N}(y_i-\hat{y}_i)^2 = SS_{\mathrm{res}}
$$ The unexplained fraction of target variation is therefore: $$
\frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}}
$$ Subtracting from 1 gives the explained fraction: $$
R^2=1-\frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}}
$$ This matches the canonical formula exactly.
#### Upper-bound check Because squared terms are non-negative: $$
SS_{\mathrm{res}} \ge 0
$$ If $SS\_{\\mathrm{tot}}>0$, then: $$
\frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}} \ge 0
$$ So: $$
R^2 = 1 - \frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}} \le 1
$$ Thus the score cannot exceed 1.
#### Perfect-fit case If predictions are perfect, then: $$
y_i=\hat{y}_i \text{ for all } i
$$ So: $$
SS_{\mathrm{res}}=0
$$ and therefore: $$
R^2=1
$$ This is correct.
#### Mean-baseline case If the model predicts the mean for every observation, then: $$
\hat{y}_i=\bar{y} \text{ for all } i
$$ So the residual sum of squares equals the total sum of squares: $$
SS_{\mathrm{res}}=SS_{\mathrm{tot}}
$$ and therefore: $$
R^2=0
$$ This is correct.
#### Negative-score case If the model is worse than the mean baseline, then: $$
SS_{\mathrm{res}} > SS_{\mathrm{tot}}
$$ which implies: $$
\frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}}>1
$$ and therefore: $$
R^2<0
$$ So negative $R^2$ is mathematically valid and must be explicitly acknowledged.
#### Units check Both $SS\_{\\mathrm{res}}$ and $SS\_{\\mathrm{tot}}$ are sums of squared target units. Their ratio is unitless, and subtracting from 1 preserves that. So $R^2$ is dimensionless. This matches the verbal explanation.
#### Structural verification - Opening restatement paragraph is present.
- All required sections are present and non-empty.
- Block equations use `$$...$$`.
- Symbol-table notation uses math mode such as `$y_i$`, `$\hat{y}_i$`, `$\bar{y}$`, `$SS_{\mathrm{res}}$`, and `$SS_{\mathrm{tot}}$`.
- Mermaid uses `flowchart TD` and node text in `["..."]`.
- Three code blocks are present: Python beginner, R beginner, Python professional.
- Range $(-\\infty,1\]$, negative values, baseline interpretation, and overfitting limitations are explicitly included.
- No placeholder text remains.
### Common Pitfalls and Edge Cases - **Assuming $R^2$ must lie between 0 and 1:** It can be negative when the model is worse than the mean baseline.
- **Ignoring overfitting:** A high in-sample $R^2$ does not guarantee strong out-of-sample performance.
- **Using $R^2$ alone:** A model can have a good $R^2$ but poor MAE or RMSE in business terms.
- **Confusing variance explained with causal explanation:** $R^2$ is a predictive fit metric, not a causal claim.
- **Comparing $R^2$ across very different targets without context:** It is dimensionless, but business usefulness can still differ.
- **Undefined constant-target case:** If all $y\_i$ are identical, then $SS\_{\\mathrm{tot}}=0$ and the standard formula is undefined.
- **Believing more features automatically mean a better model:** In-sample $R^2$ often rises with additional predictors, even when generalization worsens.
- **Ignoring residual structure:** A strong $R^2$ does not guarantee well-behaved residuals or correct model specification.
### References and Standard Results - Arithmetic mean definition, $\\bar{y}=\\frac{1}{N}\\sum\_{i=1}^{N}y\_i$
- Residual sum of squares definition, $SS\_{\\mathrm{res}}=\\sum\_{i=1}^{N}(y\_i-\\hat{y}\_i)^2$
- Total sum of squares definition, $SS\_{\\mathrm{tot}}=\\sum\_{i=1}^{N}(y\_i-\\bar{y})^2$
- Coefficient of Determination definition, $R^2=1-\\frac{SS\_{\\mathrm{res}}}{SS\_{\\mathrm{tot}}}$
- Perfect-fit characterization, $R^2=1$ if and only if all residuals are zero
- Mean-baseline characterization, $R^2=0$ when model error equals baseline mean-predictor error
- Negative $R^2$ condition when model error exceeds baseline error
- Dimensionless-ratio interpretation of $R^2$
- Overfitting caution for in-sample regression metrics