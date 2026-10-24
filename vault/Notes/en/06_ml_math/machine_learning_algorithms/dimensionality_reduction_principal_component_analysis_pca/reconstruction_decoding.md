---
title: Reconstruction (Decoding)
date: '2026-04-16'
wordCount: 410
slug: reconstruction_decoding
permalink: /notes/06_ml_math/machine_learning_algorithms/dimensionality_reduction_principal_component_analysis_pca/reconstruction_decoding/index.html
share_status: draft
publish_target: note
boundary: public
---
# $X_{\text{recon}} = Z V_k^\top = X V_k V_k^\top$ We are working on PCA Reconstruction, also called PCA decoding, with canonical formula $X_{\text{recon}} = Z V_k^\top = X V_k V_k^\top$, where $X$ is the centered data matrix, $V_k$ contains the first $k$ principal directions as orthonormal columns, and $Z = X V_k$ is the low-dimensional score matrix. The domain is standard PCA under centered numeric data, with orthonormal loading vectors, and the result is an approximation of centered $X$ in a rank-$k$ subspace.
## Deep Breakdown PCA reconstruction is the step that maps low-dimensional PCA scores back into the original feature space. In the encoding step, we compress the centered data matrix $X \in \mathbb{R}^{n \times p}$ into scores $Z \in \mathbb{R}^{n \times k}$ using the first $k$ principal components. In the decoding step, we expand those scores back into a $p$-dimensional approximation: $$
X_{\text{recon}} = Z V_k^\top
$$ Because $Z = X V_k$, reconstruction can also be written as: $$
X_{\text{recon}} = X V_k V_k^\top
$$ This is not usually equal to the original centered matrix $X$, unless $k = p$ or the data already lies exactly in the $k$-dimensional principal subspace. Instead, it is the orthogonal projection of each observation onto the subspace spanned by the first $k$ principal directions. Why this matters in DA/DS: - **Compression:** store $n \times k$ scores instead of $n \times p$ original centered values when $k \ll p$.
- **Denoising:** small-variance directions are often noise-dominated, so discarding them can smooth the signal.
- **Interpretability:** reconstruction lets us inspect what information is retained after dimension reduction.
- **Error analysis:** comparing $X$ and $X_{\text{recon}}$ gives the residual matrix, which quantifies information loss. Input:
- Centered data matrix $X$
- PCA loading matrix $V_k$ Intermediate object:
- Score matrix $Z = X V_k$ Output:
- Reconstructed approximation $X_{\text{recon}}$ A useful way to think about it: encoding moves points into a compressed coordinate system, decoding maps those compressed coordinates back into the original axes, but only within the retained PCA subspace.
### Flowchart (Mermaid) ```mermaid
flowchart TD
A["Start with centered data matrix X"] --> B["Select first k principal directions V_k"]
B --> C["Encode data into scores Z = X V_k"]
C --> D["Decode scores back to original feature space: X_recon = Z V_k^T"]
D --> E["Equivalent form: X_recon = X V_k V_k^T"]
E --> F["Compare X and X_recon"]
F --> G["Interpret retained structure, compression quality, and denoising effect"]
F --> H["Compute residual error: X - X_recon"]