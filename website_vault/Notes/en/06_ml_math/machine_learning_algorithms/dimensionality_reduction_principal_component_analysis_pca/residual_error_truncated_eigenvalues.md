---
publish: true
date: '2026-04-16'
tags:
- machine-learning
---

# Residual Error (Truncated Eigenvalues)

$$
\displaystyle \sum_{j=k+1}^{d} \lambda_j
$$

We are working on PCA residual error under the standard covariance-eigendecomposition setup, where the eigenvalues satisfy $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_d \ge 0$, and we keep only the first $k$ principal components. The canonical residual variance is

$$
\sum_{j=k+1}^{d} \lambda_j,
$$

which measures the variance not captured by the retained $k$-dimensional representation.

## Deep Breakdown

Residual error in PCA, using truncated eigenvalues, is the amount of variance left unexplained after reducing a $d$-dimensional dataset to its first $k$ principal components. The inputs are the ordered PCA eigenvalues $\lambda_1, \lambda_2, \dots, \lambda_d$, and the chosen number of retained components $k$.

The output is a single non-negative scalar:

$$
\text{Residual Variance} = \sum_{j=k+1}^{d} \lambda_j
$$

This quantity matters because PCA is fundamentally a compression method. When we compress data from $d$ dimensions down to $k$ dimensions, we deliberately discard some directions of variation. The sum of the discarded eigenvalues tells us exactly how much total variance was lost. In DA/DS work, this is central when deciding how many components to keep. Too few components, and the compressed representation may miss important structure. Too many, and the reduction may not simplify the model enough. Residual error provides a direct tradeoff measure between compression and fidelity. This object is tightly linked to three core PCA ideas:

1. **Reconstruction**: lower residual variance usually means better reconstruction from the retained components.
2. **Low-rank approximation**: PCA gives the best rank-$k$ approximation in squared-error sense.
3. **Explained variance ratio**: if the retained variance is $\sum_{j=1}^{k}\lambda_j$, then the lost fraction is residual variance divided by total variance.

So, conceptually:

- total variance = what exists in the original centered data,
- retained variance = what the first $k$ PCs keep,
- residual variance = what the truncation throws away. ---

## Flowchart

```mermaid
flowchart TD
    A["Centered data matrix X"] --> B["Compute covariance matrix or SVD"]
    B --> C["Obtain ordered eigenvalues λ1 ≥ λ2 ≥ ... ≥ λd"]
    C --> D["Choose number of retained components k"]
    D --> E["Keep first k eigenvalues"]
    E --> F["Discard eigenvalues λ(k+1) to λd"]
    F --> G["Sum discarded eigenvalues"]
    G --> H["Residual variance = Σ from j=k+1 to d of λj"]
    H --> I["Interpret as information lost"]
    I --> J["Use for choosing k, compression, reconstruction quality"]
```
