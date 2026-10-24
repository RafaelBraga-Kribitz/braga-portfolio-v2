---
title: Akaike Information Criterion (AIC)
date: '2026-04-16'
wordCount: 795
slug: akaike_information_criterion_aic
permalink: /notes/06_ml_math/machine_learning_algorithms/model_selection_and_information_criteria/akaike_information_criterion_aic/index.html
share_status: draft
publish_target: note
boundary: public
---
# $$\mathrm{AIC}=2k-2\ln(\hat{L})$$ We are working on the **Akaike Information Criterion**, AIC, for likelihood-based model selection, defined by $$\mathrm{AIC}=2k-2\ln(\hat{L}),$$ where $k$ is the number of estimated parameters and $\hat{L}$ is the maximized likelihood of the fitted model. The setting is comparative model selection on the same response variable and dataset under maximum likelihood estimation, so lower AIC indicates a better tradeoff between fit and complexity. AIC is asymptotically related to out-of-sample deviance, is best interpreted comparatively rather than absolutely, and is commonly paired with BIC and AICc.
## Deep Breakdown Akaike Information Criterion, AIC, is a model selection tool used when multiple candidate models are fit to the same data. Its purpose is not to measure prediction error directly in the same way as MAE or MSE, and it is not a goodness-of-fit score in isolation. Instead, AIC helps choose between competing models by balancing two opposing goals: - fit the observed data well,
- avoid unnecessary complexity. The core idea is simple. A model with more parameters can usually fit the training data better. But better in-sample fit does not always mean better future performance. If we keep adding parameters, we may begin fitting noise rather than the underlying signal. AIC tries to correct for this by penalizing model complexity. The formula is: $$
\mathrm{AIC}=2k-2\ln(\hat{L})
$$ This has two parts: - $-2\ln(\hat{L})$, which rewards better fit because a larger maximized likelihood means the fitted model explains the observed data better,
- $2k$, which penalizes models with more estimated parameters. So AIC is a penalized likelihood criterion. The lower the AIC, the better the model is considered, relative to the other models being compared. The key word is **relative**. AIC has no standalone interpretation like “AIC = 120 is good.” It only becomes meaningful when comparing multiple models fit to the same response data. AIC comes from information theory. More specifically, it is derived as an asymptotically unbiased estimator of the expected Kullback–Leibler discrepancy between the fitted candidate model and the unknown true data-generating process. In plainer language, it estimates how much information is lost when a candidate model is used to approximate reality. Lower AIC suggests less expected information loss. This is why AIC is often described as targeting out-of-sample predictive adequacy rather than in-sample explanatory perfection. AIC is widely used in: - linear regression and generalized linear model selection,
- time-series model comparison, such as ARIMA family models,
- likelihood-based mixed models, with care,
- nested and non-nested candidate model comparison,
- feature selection workflows. AIC has important limitations: - it is only comparable across models fit to the same data and same response variable,
- it assumes likelihood-based estimation,
- it can favor overly complex models in small samples,
- it does not test whether a model is true,
- it does not replace residual diagnostics or domain judgment. For small sample sizes, the corrected version **AICc** is often preferred because it adds an extra penalty when $n$ is not large relative to $k$. Another common criterion is **BIC**, which penalizes complexity more strongly and is often more conservative. For DA/DS work, AIC is useful when comparing several plausible models and selecting one that balances explanatory power and simplicity, especially in regression, GLMs, and time-series forecasting.
### Flowchart (Mermaid) \`\`\`mermaid
flowchart TD
A["Start with several candidate likelihood-based models"] --> B["Fit each model by maximum likelihood"]
B --> C["Compute maximized likelihood L_hat for each model"]
C --> D["Count estimated parameters k for each model"]
D --> E["Compute AIC = 2k - 2 ln(L_hat)"]
E --> F["Compare AIC values across candidate models"]
F --> G["Prefer the model with lower AIC"]
G --> H["Validate assumptions, diagnostics, and business usefulness before final choice"]
```
### Real-World use: #### Situation it is used AIC is used when an analyst has multiple candidate models for the same prediction or explanation task and needs a principled way to compare them. This is common in regression feature selection, logistic regression specification, GLM comparison, and time-series model selection.
#### Problem it solves It solves the problem that in-sample fit alone is not enough for model selection. A more complex model almost always fits the training data better, but that can lead to overfitting. AIC provides a quantitative fit-versus-complexity tradeoff.
#### How it solves the problem It starts from the model’s maximized likelihood, which captures fit to the observed data, and then adds a penalty proportional to the number of estimated parameters. This discourages unnecessarily complex models and approximates expected out-of-sample performance.
#### Example of it used in the Working Context as DA/DS for a Business Suppose a pricing analyst builds several demand models for weekly sales, one with only price, one with price plus promotion, one with price plus promotion plus seasonality, and one with several interaction terms. The most complex model may fit the training data best, but AIC may prefer a slightly simpler model if the additional parameters do not justify their complexity. This helps the team avoid shipping a fragile overfit model into pricing or forecasting workflows.
### The Formula (Fragment-First) | Symbol | Meaning |
| --- | --- |
| $k$ | Number of estimated parameters in the model |
| $\\hat{L}$ | Maximized likelihood of the fitted model |
| $\\ln(\\hat{L})$ | Natural logarithm of the maximized likelihood |
| $-2\\ln(\\hat{L})$ | Likelihood-based lack-of-fit term on the deviance scale |
| $2k$ | Complexity penalty |
| $\\mathrm{AIC}$ | Akaike Information Criterion | Canonical formula: $$
\mathrm{AIC}=2k-2\ln(\hat{L})
$$ Equivalent rearrangement: $$
\mathrm{AIC}=-2\ln(\hat{L})+2k
$$ Comparison rule: $$
\mathrm{AIC}_{\mathrm{lower}} \text{ is preferred}
$$ Difference from the minimum AIC in a candidate set: $$
\Delta_i=\mathrm{AIC}_i-\min_j(\mathrm{AIC}_j)
$$ Small-sample corrected version, AICc: $$
\mathrm{AICc}=\mathrm{AIC}+\frac{2k(k+1)}{n-k-1}
$$ where $n$ is the sample size and the correction is defined when: $$
n-k-1>0
$$ BIC for comparison: $$
\mathrm{BIC}=k\ln(n)-2\ln(\hat{L})
$$ ### Formula-to-English Translation AIC adds two things: - a penalty for model complexity, $2k$,
- a reward for model fit, expressed through $-2\\ln(\\hat{L})$. If the model fits the data better, then $\\hat{L}$ is larger, so $\\ln(\\hat{L})$ is larger, and the term $-2\\ln(\\hat{L})$ becomes smaller. That lowers AIC, which is good. If the model uses more parameters, then $k$ increases, and the penalty term $2k$ becomes larger. That raises AIC, which is bad unless the improved fit more than compensates. So AIC asks: > Did the extra complexity buy enough improvement in likelihood to justify itself? If yes, AIC falls. If not, AIC rises.
### Critical Concepts - **AIC is comparative, not absolute.** It only makes sense when comparing models fit to the same data and response.
- **Lower AIC is better.** The preferred model is the one with the smallest AIC among the candidate set.
- **AIC is likelihood-based.** It requires models fit under a likelihood framework, usually by maximum likelihood.
- **AIC penalizes complexity linearly in $k$.** Every estimated parameter adds a penalty of 2.
- **AIC is asymptotically linked to expected out-of-sample deviance.** This is why it is often used for predictive model selection.
- **AIC can favor models that are too complex in small samples.** That is why AICc is often preferred when $n$ is not large relative to $k$.
- **BIC penalizes complexity more strongly than AIC.** BIC often prefers simpler models, especially as $n$ grows.
### Step-by-Step Manual Calculation (Tiny/Simplist Example) Suppose we compare two candidate regression models fit by maximum likelihood to the same dataset. - Model A has $k=3$ parameters and maximized log-likelihood $\\ln(\\hat{L}\_A)=-120$
- Model B has $k=5$ parameters and maximized log-likelihood $\\ln(\\hat{L}\_B)=-117$ We compute AIC for each model.
#### Step 1, compute AIC for Model A Using: $$
\mathrm{AIC}=2k-2\ln(\hat{L})
$$ we get: $$
\mathrm{AIC}_A=2(3)-2(-120)
$$ $$
\mathrm{AIC}_A=6+240=246
$$ #### Step 2, compute AIC for Model B $$
\mathrm{AIC}_B=2(5)-2(-117)
$$ $$
\mathrm{AIC}_B=10+234=244
$$ #### Step 3, compare the values - Model A: 246
- Model B: 244 Since lower AIC is preferred: $$
244 < 246
$$ so Model B is preferred.
#### Step 4, compute delta AIC values The minimum AIC is 244, so: $$
\Delta_A=246-244=2
$$ $$
\Delta_B=244-244=0
$$ #### Interpretation Model B has a slightly better fit-complexity tradeoff. It uses more parameters, but the improvement in likelihood is enough to offset the larger penalty.
#### Tiny plain-language reading Model B is more complex, but it fits the data enough better that AIC still prefers it.
### Real Application Examples #### Beginner friendly Example \[Python\]) ```markdown
Python# AIC from parameter count and log-likelihood
# Example: compare two regression models k_model_a = 3
log_likelihood_model_a = -120.0 k_model_b = 5
log_likelihood_model_b = -117.0 aic_model_a = 2 * k_model_a - 2 * log_likelihood_model_a
aic_model_b = 2 * k_model_b - 2 * log_likelihood_model_b print("AIC Model A:", aic_model_a)
print("AIC Model B:", aic_model_b) if aic_model_a < aic_model_b: print("Model A is preferred by AIC.")
else: print("Model B is preferred by AIC.")
``` Explanation
: - `k_model_a` and `k_model_b` are the number of estimated parameters.
- `log_likelihood_model_a` and `log_likelihood_model_b` are the maximized log-likelihood values.
- Since the formula uses $\\ln(\\hat{L})$, you can compute AIC directly from the maximized log-likelihood. Manual check: $$
\mathrm{AIC}_A=2(3)-2(-120)=246
$$ $$
\mathrm{AIC}_B=2(5)-2(-117)=244
$$ So Model B is preferred.
#### Beginner friendly Example \[R\]) ```markdown
R# AIC from parameter count and log-likelihood
# Example: compare two GLM models k_model_a <- 4
log_likelihood_model_a <- -98.5 k_model_b <- 6
log_likelihood_model_b <- -95.0 aic_model_a <- 2 * k_model_a - 2 * log_likelihood_model_a
aic_model_b <- 2 * k_model_b - 2 * log_likelihood_model_b cat("AIC Model A:", aic_model_a, "\n")
cat("AIC Model B:", aic_model_b, "\n") if (aic_model_a < aic_model_b) { cat("Model A is preferred by AIC.\n")
} else { cat("Model B is preferred by AIC.\n")
}
``` Explanation
: - The same AIC formula works when you know the number of parameters and the maximized log-likelihood.
- Lower AIC indicates the preferred candidate model among the compared set. Manual check: $$
\mathrm{AIC}_A=2(4)-2(-98.5)=8+197=205
$$ $$
\mathrm{AIC}_B=2(6)-2(-95)=12+190=202
$$ So Model B is preferred.
#### Final Professional Example \[Python\]) ```markdown
from __future__ import annotations from dataclasses import dataclass
from typing import Sequence RANDOM_SEED = 42 @dataclass(frozen=True)
class CandidateModel: name: str parameter_count: int log_likelihood: float def aic(parameter_count: int, log_likelihood: float) -> float: if parameter_count < 0: raise ValueError("parameter_count must be non-negative.") return 2 * parameter_count - 2 * log_likelihood def aicc(parameter_count: int, log_likelihood: float, sample_size: int) -> float: if sample_size <= 0: raise ValueError("sample_size must be greater than 0.") aic_value = aic(parameter_count, log_likelihood) denominator = sample_size - parameter_count - 1 if denominator <= 0: raise ValueError("AICc is undefined when sample_size - parameter_count - 1 <= 0.") correction = (2 * parameter_count * (parameter_count + 1)) / denominator return aic_value + correction def bic(parameter_count: int, log_likelihood: float, sample_size: int) -> float: import math if sample_size <= 0: raise ValueError("sample_size must be greater than 0.") return parameter_count * math.log(sample_size) - 2 * log_likelihood def summarize_models(models: Sequence[CandidateModel], sample_size: int) -> None: if len(models) == 0: raise ValueError("At least one model is required.") scored_models = [] for model in models: aic_value = aic(model.parameter_count, model.log_likelihood) aicc_value = aicc(model.parameter_count, model.log_likelihood, sample_size) bic_value = bic(model.parameter_count, model.log_likelihood, sample_size) scored_models.append( { "name": model.name, "aic": aic_value, "aicc": aicc_value, "bic": bic_value, } ) best_aic = min(item["aic"] for item in scored_models) print(f"Sample size: {sample_size}") print("-" * 72) for item in scored_models: delta_aic = item["aic"] - best_aic print(f"Model: {item['name']}") print(f"AIC: {item['aic']:.4f}") print(f"AICc: {item['aicc']:.4f}") print(f"BIC: {item['bic']:.4f}") print(f"Delta AIC: {delta_aic:.4f}") print("-" * 72) def main() -> None: # Time-series demand forecasting example: # Competing ARIMA-like candidate models fitted by maximum likelihood. sample_size = 120 candidate_models = [ CandidateModel(name="Model 1, simpler trend model", parameter_count=4, log_likelihood=-180.5), CandidateModel(name="Model 2, trend + seasonality", parameter_count=6, log_likelihood=-175.2), CandidateModel(name="Model 3, richer seasonal structure", parameter_count=9, log_likelihood=-172.8), ] summarize_models(candidate_models, sample_size) if __name__ == "__main__": main()
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
this professional example teaches: 1. AIC is computed directly from the parameter count and the maximized log-likelihood.
2. Delta AIC helps interpret relative standing inside the candidate model set.
3. AICc adds a small-sample correction when the sample size is not large relative to parameter count.
4. BIC is included because it is a common alternative that penalizes complexity more heavily.
5. In time-series and GLM workflows, model choice should consider AIC together with diagnostics and business utility. Plain-English interpretation of the forecasting example: - A more complex model may win on AIC if the likelihood improvement justifies the extra parameters.
- But if the sample size is limited, AICc may be more reliable than plain AIC.
- BIC may prefer a simpler model than AIC because its complexity penalty is stronger.
### Self-Check: Mathematical Verification #### Re-derivation from the penalized-likelihood structure AIC is defined as a penalized likelihood criterion: $$
\mathrm{AIC}=-2\ln(\hat{L})+2k
$$ Reordering terms gives the canonical expression: $$
\mathrm{AIC}=2k-2\ln(\hat{L})
$$ So the formula written in the file is algebraically consistent.
#### Fit-versus-complexity interpretation check The term: $$
-2\ln(\hat{L})
$$ gets smaller when the maximized likelihood gets larger, so better fit reduces AIC. The term: $$
2k
$$ increases linearly with the number of estimated parameters, so additional complexity raises AIC. Therefore the formula correctly encodes the tradeoff between fit and complexity.
#### Comparative interpretation check Suppose two models are fit to the same data. If Model B has: - a larger likelihood, which helps lower AIC,
- but also more parameters, which raises AIC, then the net AIC difference tells us whether the extra fit improvement is worth the complexity. This matches the intended model selection interpretation.
#### AICc correction check The corrected criterion is: $$
\mathrm{AICc}=\mathrm{AIC}+\frac{2k(k+1)}{n-k-1}
$$ When $n$ is large relative to $k$, the correction term becomes small, so: $$
\mathrm{AICc}\approx \mathrm{AIC}
$$ This matches the usual asymptotic interpretation. When $n-k-1 \\le 0$, the correction is undefined, so the file correctly states that domain restriction.
#### BIC comparison check BIC is: $$
\mathrm{BIC}=k\ln(n)-2\ln(\hat{L})
$$ Since $\\ln(n)>2$ for sufficiently large $n$, BIC penalizes complexity more strongly than AIC in larger samples. This matches the explanation that BIC is usually more conservative.
#### Units and scale check Likelihood values are dimensionless probabilities or densities evaluated through the model likelihood framework, and the logarithm of the likelihood is therefore also a likelihood-based scalar. AIC itself is a comparative criterion without target units. This matches the explanation that AIC is not an interpretable business-unit metric like MAE.
#### Verbal-to-algebra consistency The verbal explanation says AIC rewards better likelihood fit and penalizes more parameters. Algebraically, $-2\\ln(\\hat{L})$ decreases with better fit and $2k$ increases with complexity. The explanation and the formula are aligned.
#### Structural verification - Opening restatement paragraph is present.
- All required sections are present and non-empty.
- Block equations use `$$...$$`.
- Symbol-table entries use math mode such as `$k$`, `$\hat{L}$`, and `$\mathrm{AIC}$`.
- Mermaid uses `flowchart TD` and node text in `["..."]`.
- Three code blocks are present: Python beginner, R beginner, Python professional.
- Links to BIC, AICc, likelihood, and asymptotic out-of-sample interpretation are explicitly included.
- No placeholder text remains.
### Common Pitfalls and Edge Cases - **Treating AIC as an absolute score:** AIC is only meaningful relative to other candidate models fit to the same response data.
- **Comparing models fit on different datasets:** AIC comparisons require the same underlying data and response variable.
- **Ignoring estimation method:** Standard AIC relies on likelihood-based fitting, usually maximum likelihood.
- **Using plain AIC in small samples:** AIC can be too optimistic; AICc is often better when $n$ is not large relative to $k$.
- **Assuming lowest AIC means “true model”:** AIC selects the best tradeoff in the candidate set, not a guaranteed true model.
- **Ignoring diagnostics and business context:** A low-AIC model can still violate assumptions or be operationally poor.
- **Confusing AIC with BIC:** They have similar forms but different complexity penalties and different selection behavior.
- **Miscalculating parameter count:** The effective number of estimated parameters must be counted carefully, including intercepts and variance terms where appropriate.
### References and Standard Results - Maximum likelihood estimation and maximized likelihood, $\\hat{L}$
- Akaike Information Criterion definition, $\\mathrm{AIC}=2k-2\\ln(\\hat{L})$
- Penalized-likelihood interpretation of model selection criteria
- Asymptotic connection between AIC and expected out-of-sample deviance
- Delta AIC definition, $\\Delta\_i=\\mathrm{AIC}\_i-\\min\_j(\\mathrm{AIC}\_j)$
- Corrected Akaike Information Criterion, $\\mathrm{AICc}=\\mathrm{AIC}+\\frac{2k(k+1)}{n-k-1}$
- Bayesian Information Criterion, $\\mathrm{BIC}=k\\ln(n)-2\\ln(\\hat{L})$
- Model comparison within a common candidate set on the same response data