---
title: Unit Vector
date: '2026-04-16'
wordCount: 693
slug: unit_vector
permalink: /notes/03_linear_algebra_geometry/vectors_and_dimensionality/vector_space_axioms_and_coordinates/unit_vector/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\hat{v} = \frac{\vec{v}}{|\vec{v}|}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A unit vector $\hat{v}$ is any vector with magnitude exactly 1. It encodes only direction, with no magnitude information. $\hat{v} = \vec{v}/|\vec{v}|$ is the normalization formula: divide every component by the vector's length. The result points in the same direction as $\vec{v}$ but has length 1. The standard basis vectors $\hat{i} = (1,0,0)$, $\hat{j} = (0,1,0)$, $\hat{k} = (0,0,1)$ are unit vectors. In DA/DS: normalizing feature vectors for cosine similarity, producing unit gradient direction for normalized gradient descent, and working with directional embeddings.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Input: vector v = (v1, v2, v3)"] A --> B["Compute magnitude: |v| = sqrt(v1^2+v2^2+v3^2)"] B --> C{{"Is |v| == 0?"}} C -->|"Yes"| D["Zero vector: unit vector undefined (no direction)"] C -->|"No"| E["Divide every component by |v|"] E --> F["v_hat = (v1/|v|, v2/|v|, v3/|v|)"] F --> G["Verify: |v_hat| = 1"] G --> H["Use: direction-only representation"]
```
### Real-World use:
#### Situation it is used
Cosine similarity computation (normalize both vectors to unit length, then dot product equals cosine), ensuring gradient direction is scale-free (normalize gradient before applying learning rate), creating directional unit normals for surfaces, and feature normalization where only relative direction matters (not magnitude).
#### Problem it solves
Many algorithms care about the direction of a vector but not its scale. Cosine similarity requires unit vectors to work correctly. When comparing embeddings of different magnitudes (e.g., one document has 1000 words, another has 50 words), raw dot products are dominated by length, not direction. Normalizing to unit vectors removes length bias.
#### How it solves the problem
Dividing by $|\vec{v}|$ is scalar multiplication by $1/|\vec{v}|$. The resulting vector has magnitude $|(\vec{v}/|\vec{v}|)| = |\vec{v}|/|\vec{v}| = 1$. Direction is preserved because dividing by a positive scalar ($|\vec{v}| > 0$ when $\vec{v} \neq \vec{0}$) scales the vector proportionally without rotating it.
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist builds a semantic search engine using sentence embeddings (BERT outputs). Each query and document is embedded as a 768-dimensional vector. Before computing similarity scores, both are normalized to unit vectors: $\hat{q} = q/\|q\|$, $\hat{d}_i = d_i/\|d_i\|$. Then cosine similarity is simply $\hat{q} \cdot \hat{d}_i$ (dot product of unit vectors equals cosine). This removes the effect of sentence length (longer sentences tend to have larger magnitude embeddings).
### The Formula (Fragment-First)
- $\hat{v}$: pronounced "v-hat"; the unit vector in the direction of $\vec{v}$
- $\vec{v}$: the original vector (any non-zero vector)
- $|\vec{v}|$: the magnitude of $\vec{v}$; the scalar used to divide
- $\frac{\vec{v}}{|\vec{v}|}$: scalar multiplication of $\vec{v}$ by $1/|\vec{v}|$
- Property: $|\hat{v}| = 1$ always; $\hat{v} \cdot \hat{v} = 1$
- Undefined when $|\vec{v}| = 0$ (the zero vector has no direction) ### Formula-to-English Translation
"Divide the vector by its own length. Every component gets divided by the same factor, so the direction stays the same, but the length becomes exactly 1." Tiny example: $\vec{v} = (3, 0, 4)$.
$|\vec{v}| = \sqrt{9+0+16} = \sqrt{25} = 5$.
$\hat{v} = (3/5, 0/5, 4/5) = (0.6, 0, 0.8)$.
Check: $|\hat{v}| = \sqrt{0.36 + 0 + 0.64} = \sqrt{1} = 1$. $\checkmark$ ### Critical Concepts
- **Only the zero vector has no unit vector:** for any $\vec{v} \neq \vec{0}$, $\hat{v}$ is unique and well-defined.
- **Two unit vectors in opposite directions:** $\hat{v}$ and $-\hat{v}$ both have magnitude 1 but point in opposite directions.
- **$\hat{v} \cdot \hat{v} = 1$:** the self-dot-product of any unit vector is 1.
- **Dot product of two unit vectors = cosine:** $\hat{u} \cdot \hat{v} = \cos\theta$ directly, since both magnitudes are 1.
- **In machine learning:** many optimization algorithms (Adam, RMSProp) implicitly work with normalized gradients.
- **In NumPy:** `v / np.linalg.norm(v)`. Watch for the zero vector: add a small epsilon or check explicitly before dividing.
- **Standard basis vectors are unit vectors:** $\vec{i} = (1,0,0)$, $\vec{j} = (0,1,0)$, $\vec{k} = (0,0,1)$ all have magnitude 1.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Compute the magnitude*
$\vec{v} = (1, 2, 2)$.
$|\vec{v}| = \sqrt{1^2 + 2^2 + 2^2} = \sqrt{1+4+4} = \sqrt{9} = 3$. *Step 2: Divide each component by the magnitude*
$\hat{v} = (1/3, 2/3, 2/3) \approx (0.333, 0.667, 0.667)$. *Step 3: Verify the magnitude equals 1*
$|\hat{v}| = \sqrt{(1/3)^2 + (2/3)^2 + (2/3)^2} = \sqrt{1/9 + 4/9 + 4/9} = \sqrt{9/9} = 1$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Unit vector: normalization ---
v = np.array([1.0, 2.0, 2.0]) mag = np.linalg.norm(v)
v_hat = v / mag print(f"v = {v}")
print(f"|v| = {mag:.4f}")
print(f"v_hat = {v_hat.round(6)}")
print(f"|v_hat| = {np.linalg.norm(v_hat):.8f} (should be 1.0)") # Safe normalization (handles zero vector)
def safe_normalize(vec: np.ndarray, eps: float = 1e-10) -> np.ndarray: """Normalize a vector to unit length, or return zeros if near-zero.""" norm = np.linalg.norm(vec) return vec / norm if norm > eps else np.zeros_like(vec) zero_vec = np.array([0.0, 0.0, 0.0])
print(f"\nSafe normalize of zero vector: {safe_normalize(zero_vec)}")
print(f"Safe normalize of v: {safe_normalize(v).round(6)}") # Dot product of two unit vectors = cosine similarity
u = np.array([1.0, 0.0, 0.0])
w = np.array([0.0, 1.0, 0.0])
u_hat = safe_normalize(u)
w_hat = safe_normalize(w)
print(f"\ncos(angle between u, w) = {np.dot(u_hat, w_hat):.4f}") # orthogonal -> 0
```
#### Beginner friendly Example [R])
``` r
# -- Unit vector normalization ---
v <- c(1, 2, 2) mag <- sqrt(sum(v^2))
v_hat <- v / mag cat("v :", v, "\n")
cat(sprintf("|v| : %.4f\n", mag))
cat("v_hat :", round(v_hat, 6), "\n")
cat(sprintf("|v_hat|: %.8f (should be 1.0)\n", sqrt(sum(v_hat^2)))) # Safe normalization function
safe_normalize <- function(vec, eps = 1e-10) { n <- sqrt(sum(vec^2)) if (n > eps) vec / n else rep(0, length(vec))
} cat("Zero vec normalized:", safe_normalize(c(0, 0, 0)), "\n")
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from sklearn.datasets import make_blobs np.random.seed(42) # -- Business scenario: cosine similarity for document/product matching ---
# Simulate product embeddings (BERT-like, 8-dim for simplicity).
# Normalize each to unit vector, then use dot product as cosine similarity. N_PRODUCTS = 50
EMBED_DIM = 8
product_names = [f"product_{i:03d}" for i in range(N_PRODUCTS)] # Raw embeddings (un-normalized)
raw_embeddings = np.random.randn(N_PRODUCTS, EMBED_DIM) # Normalize to unit vectors: shape (N_PRODUCTS, EMBED_DIM)
norms = np.linalg.norm(raw_embeddings, axis=1, keepdims=True) # (N,1)
unit_embeddings = raw_embeddings / np.clip(norms, 1e-10, None) # Verify all unit vectors have norm 1
all_unit = np.allclose(np.linalg.norm(unit_embeddings, axis=1), 1.0)
print(f"All embeddings normalized to unit vectors: {all_unit}") # Query: find top-5 most similar products to product_000
query_vec = unit_embeddings[0]
cosine_scores = unit_embeddings @ query_vec # dot product of unit vecs = cosine sim # Exclude query product itself
cosine_scores[0] = -np.inf
top5_idx = np.argsort(cosine_scores)[::-1][:5] results = pd.DataFrame({ "rank": range(1, 6), "product": [product_names[i] for i in top5_idx], "cosine_sim": cosine_scores[top5_idx].round(4),
})
print(f"\nTop-5 products similar to {product_names[0]}:")
print(results.to_string(index=False))
print("\nNote: cosine sim = dot product because both vectors are unit-normalized.")
```
#### Final Professional Example [R]
``` r
# Unit vectors: normalize then dot product = cosine similarity set.seed(42)
N_PRODUCTS <- 50
EMBED_DIM <- 8
raw_embeddings <- matrix(rnorm(N_PRODUCTS * EMBED_DIM), nrow = N_PRODUCTS)
norms <- sqrt(rowSums(raw_embeddings^2))
norms[norms < 1e-10] <- 1e-10
unit_embeddings <- raw_embeddings / norms
all_unit <- all(abs(sqrt(rowSums(unit_embeddings^2)) - 1) < 1e-10)
query_vec <- unit_embeddings[1, ]
cosine_scores <- unit_embeddings %*% query_vec
cosine_scores[1] <- -Inf
top5_idx <- order(cosine_scores, decreasing = TRUE)[1:5]
cat(sprintf("All unit vectors: %s Top-5 similar: %s\n", all_unit, paste(top5_idx, collapse = ",")))
```
---
1300 pag 126