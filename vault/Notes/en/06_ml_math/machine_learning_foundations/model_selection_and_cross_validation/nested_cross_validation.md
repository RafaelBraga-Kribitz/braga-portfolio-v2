---
title: Nested Cross-Validation
date: '2026-04-16'
wordCount: 503
slug: nested_cross_validation
permalink: /notes/06_ml_math/machine_learning_foundations/model_selection_and_cross_validation/nested_cross_validation/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\hat{R}_{\text{nested}} = \dfrac{1}{K_{\text{outer}}} \sum_{k=1}^{K_{\text{outer}}} L\!\left(y_{\text{test}}^{(k)}, \hat{f}_{\hat{\lambda}^{(k)}}^{(k)}\!\left(X_{\text{test}}^{(k)}\right)\right)$ We are working on Nested Cross-Validation, where an outer loop provides an approximately unbiased estimate of generalization performance and an inner loop performs model or hyperparameter selection using only the outer-training data. The canonical estimator is $\hat{R}_{\text{nested}} = \dfrac{1}{K_{\text{outer}}} \sum_{k=1}^{K_{\text{outer}}} L\!\left(y_{\text{test}}^{(k)}, \hat{f}_{\hat{\lambda}^{(k)}}^{(k)}\!\left(X_{\text{test}}^{(k)}\right)\right)$, where each $\hat{\lambda}^{(k)}$ is selected inside the inner cross-validation of the $k$-th outer training split. The domain is model selection and evaluation under finite data, where leakage from test data into tuning must be prevented.
## Deep Breakdown Nested Cross-Validation is a two-level resampling procedure used when we need to do **both**: 1. hyperparameter or model selection,
2. honest performance estimation. The key problem is that ordinary cross-validation is often used for tuning. But if the same folds are also used to report final performance, the estimate becomes optimistic. Why? Because the model configuration was chosen specifically to perform well on those validation folds. That means evaluation has leaked into selection. Nested Cross-Validation fixes this by separating responsibilities: - **inner loop:** choose the model, hyperparameters, threshold, preprocessing settings, or feature-selection settings,
- **outer loop:** evaluate the full selection-and-training pipeline on data that was never used during selection. The idea is procedural rather than a single closed-form algebraic identity: - split the data into $K_{\text{outer}}$ outer folds,
- for each outer fold: - hold one fold out as an outer test set, - use the remaining outer-training data to run an inner cross-validation, - select the best model or hyperparameters only from the inner results, - refit on the full outer-training set using that selected configuration, - evaluate once on the untouched outer test fold,
- average the outer test losses. This gives an estimate of the performance of the **entire model-selection process**, not just one fixed model. Why this matters in DA/DS: - **Unbiased reporting:** prevents inflated validation claims.
- **Tuning discipline:** hyperparameters are chosen without seeing the outer test fold.
- **Fair model comparison:** when comparing multiple model families, each must be selected inside the inner loop.
- **Small-data protection:** with limited data, leakage can create large optimism bias.
- **Auditability:** especially useful for portfolio work, academic work, risk modeling, and stakeholder reporting. A useful mental model: - outer loop answers, “How well would this whole modeling workflow generalize?”
- inner loop answers, “Given this training sample, which settings should I choose?” This is different from a single train/validation/test split because nested CV repeats the process across multiple outer splits, giving a more stable estimate.
### Flowchart (Mermaid) ```mermaid
flowchart TD
A["Start with full labeled dataset"] --> B["Create K_outer outer folds"]
B --> C["Pick one outer fold as test set"]
C --> D["Use remaining outer-training data only"]
D --> E["Run inner cross-validation on outer-training data"]
E --> F["Select best model or hyperparameters"]
F --> G["Refit selected pipeline on full outer-training data"]
G --> H["Evaluate once on untouched outer test fold"]
H --> I["Store outer test metric"]
I --> J["Repeat for all outer folds"]
J --> K["Average outer test metrics for final unbiased estimate"]