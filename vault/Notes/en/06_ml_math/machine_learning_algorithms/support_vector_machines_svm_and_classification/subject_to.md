---
title: Subject to
date: '2026-04-16'
wordCount: 610
slug: subject_to
permalink: /notes/06_ml_math/machine_learning_algorithms/support_vector_machines_svm_and_classification/subject_to/index.html
share_status: draft
publish_target: note
boundary: public
---
# $y_i(w^\top x_i + b) \ge 1 - \xi_i,\; \xi_i \ge 0 \quad \text{or} \quad y_i(w^\top x_i + b) \ge 1$ We are working on the constraint set in Support Vector Machines, which defines the geometric margin conditions for either hard-margin or soft-margin classification. The canonical constraints are $$y_i(w^\top x_i + b) \ge 1$$ for hard-margin SVM, and $$y_i(w^\top x_i + b) \ge 1 - \xi_i,\quad \xi_i \ge 0$$ for soft-margin SVM, where $y_i \in \{-1,+1\}$, $w$ is the separating hyperplane normal vector, $b$ is the intercept, and $\xi_i$ are slack variables that allow margin violations.
## Deep Breakdown In an SVM, the phrase **subject to** is not a minor detail. It is the geometric heart of the optimization problem. The objective may say “maximize margin” or “minimize complexity plus violations,” but the constraints define what it means for a classifier to be acceptable. For a linear classifier, the decision rule is: $$
f(x) = w^\top x + b
$$ and the predicted class is: $$
\hat{y} = \operatorname{sign}(w^\top x + b)
$$ The SVM constraints require that training points lie on the correct side of the separating hyperplane, and not just barely, but with a margin.
### Hard-margin case If the data is perfectly linearly separable, the constraint is: $$
y_i(w^\top x_i + b) \ge 1
$$ This means: - if $y_i = +1$, then we require: $$ w^\top x_i + b \ge 1 $$
- if $y_i = -1$, then we require: $$ w^\top x_i + b \le -1 $$ So the points are forced outside the two margin boundaries: $$
w^\top x + b = 1
\quad \text{and} \quad
w^\top x + b = -1
$$ ### Soft-margin case If the data is not perfectly separable, we introduce slack variables $\xi_i$ and use: $$
y_i(w^\top x_i + b) \ge 1 - \xi_i
$$ with $$
\xi_i \ge 0
$$ Now some points can violate the ideal margin. The slack variable tells us how badly. This constraint set matters in DA/DS because it explains: - which points become support vectors,
- which points lie safely outside the margin,
- which points lie inside the margin,
- which points are misclassified,
- why the hinge loss has the form it does. Inputs: - labeled data $(x_i, y_i)$,
- hyperplane parameters $w$ and $b$,
- optionally slack variables $\xi_i$. Outputs: - a feasible set of classifiers that respect the margin logic. Why it matters in practice: - it defines the geometry of classification,
- it controls robustness to noise and overlap,
- it determines which points actively constrain the model,
- it provides the bridge between geometric margin and optimization. This object links directly to: - **Soft Margin Optimization (Primal)**, because these are its constraints,
- **Hard Margin SVM**, because the hard-margin case is the zero-slack version,
- **Hinge Loss**, because the minimum feasible slack is the hinge-loss value,
- **Primal and dual forms**, because these constraints generate the KKT structure and support-vector behavior.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with labeled point (x_i, y_i)"] --> B["Compute score w^T x_i + b"] B --> C["Multiply by label: y_i(w^T x_i + b)"] C --> D["Check hard-margin condition y_i(w^T x_i + b) ≥ 1"] D --> E["If non-separable, allow slack ξ_i"] E --> F["Check soft-margin condition y_i(w^T x_i + b) ≥ 1 - ξ_i"] F --> G["Enforce ξ_i ≥ 0"] G --> H["Classify point status"] H --> I["Outside margin: ξ_i = 0 and margin > 1"] H --> J["On margin: ξ_i = 0 and margin = 1"] H --> K["Inside margin or misclassified: ξ_i > 0"] I --> L["Support vectors and violations shape the solution"] J --> L K --> L