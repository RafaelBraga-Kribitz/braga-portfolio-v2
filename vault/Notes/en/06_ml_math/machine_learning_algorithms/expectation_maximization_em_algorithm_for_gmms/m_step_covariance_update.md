---
title: M-Step (Covariance Update)
date: '2026-04-16'
wordCount: 494
slug: m_step_covariance_update
permalink: /notes/06_ml_math/machine_learning_algorithms/expectation_maximization_em_algorithm_for_gmms/m_step_covariance_update/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_{i=1}^{n} r_{ik}(x_i - \mu_k^{\text{new}})(x_i - \mu_k^{\text{new}})^\top$ We are working on the covariance update in the M-step of the EM algorithm for Gaussian Mixture Models. The canonical formula is $$\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_{i=1}^{n} r_{ik}(x_i - \mu_k^{\text{new}})(x_i - \mu_k^{\text{new}})^\top,$$ where $N_k = \sum_{i=1}^{n} r_{ik}$ is the effective component size and $r_{ik}$ are the responsibilities. This update gives the soft, responsibility-weighted covariance matrix for component $k$ under a standard full-covariance GMM.
## Deep Breakdown In a Gaussian Mixture Model, each component $k$ has its own mean vector $\mu_k$, covariance matrix $\Sigma_k$, and mixture weight $\pi_k$. During the EM algorithm, the E-step computes the responsibilities $r_{ik}$, which are soft assignments telling us how much observation $x_i$ belongs to component $k$. Once we have those soft assignments, the M-step updates the parameters of each Gaussian component. The covariance update is the part that determines the **shape, spread, and orientation** of each cluster. The update is: $$
\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_{i=1}^{n} r_{ik}(x_i - \mu_k^{\text{new}})(x_i - \mu_k^{\text{new}})^\top
$$ Inputs: - observations $x_1, \dots, x_n$,
- responsibilities $r_{ik}$,
- updated mean $\mu_k^{\text{new}}$,
- effective component size $N_k$. Output: - updated covariance matrix $\Sigma_k^{\text{new}}$ for component $k$. Why it matters in DA/DS: - it determines cluster shape, not just cluster center,
- it lets one mixture component stretch more in one direction than another,
- it controls elliptical geometry in multivariate data,
- it affects responsibilities in the next E-step,
- it is essential for anomaly scoring, segmentation, and density estimation. In a one-dimensional Gaussian mixture, covariance reduces to variance, which tells us how wide the component is. In multiple dimensions, covariance does more: - diagonal terms measure variance in each feature,
- off-diagonal terms measure how features move together inside the component,
- eigenstructure of $\Sigma_k$ determines the principal axes of the cluster ellipse or ellipsoid. This update is the soft-clustering analogue of a sample covariance matrix. In an ordinary sample covariance, every point counts equally. In the GMM M-step, every point is weighted by its responsibility for component $k$. So points that strongly belong to component $k$ contribute more, and points that weakly belong contribute less. This object links directly to: - **Effective Component Size**, because $N_k$ normalizes the weighted sum,
- **M-Step (Means Update)**, because the covariance is centered around $\mu_k^{\text{new}}$,
- **M-Step (Weights Update)**, because the same responsibilities govern all M-step parameter updates,
- **cluster geometry**, because the covariance matrix defines each Gaussian component’s shape.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with data points x_i"] --> B["E-Step computes responsibilities r_ik"] B --> C["Compute effective component size N_k = Σ_i r_ik"] C --> D["Update component mean μ_k^new"] D --> E["For each point, compute centered vector x_i - μ_k^new"] E --> F["Form outer product (x_i - μ_k^new)(x_i - μ_k^new)^T"] F --> G["Weight each outer product by r_ik"] G --> H["Sum weighted outer products over all i"] H --> I["Divide by N_k"] I --> J["Obtain covariance update Σ_k^new"] J --> K["Use Σ_k^new in next E-Step density evaluation"]