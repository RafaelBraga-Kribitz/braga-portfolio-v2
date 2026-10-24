---
title: Tensor dot product
date: '2026-04-16'
wordCount: 1189
slug: tensor_dot_product
permalink: /notes/03_linear_algebra_geometry/advanced_linear_algebra_and_decompositions/tensor_algebra/tensor_dot_product/index.html
share_status: draft
publish_target: note
boundary: public
---
# $C_{i_1 \dots i_m j_1 \dots j_n} = \sum_k A_{i_1 \dots i_m k} B_{k j_1 \dots j_n}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This formula is the tensor contraction (generalized dot product) along a shared index $k$. You have tensor $A$ with indices $i_1 \dots i_m k$ and tensor $B$ with indices $k j_1 \dots j_n$; summing over $k$ collapses that shared axis and produces output tensor $C$ with indices $i_1 \dots i_m j_1 \dots j_n$. When $m = n = 1$ this reduces to the ordinary matrix product $C_{ij} = \sum_k A_{ik} B_{kj}$. When $m = 0$ and $n = 0$ it reduces to the scalar dot product. In DA/DS the tensor dot product appears in multi-linear regression (contracting a coefficient tensor against input feature tensors), in convolutional neural networks (weight tensors contracted against input activation tensors), and in factor models where a 3D data cube (samples × features × time) is contracted with a factor loading tensor to produce compressed representations.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Input: tensor A with shape (..., k_dim) and tensor B with shape (k_dim, ...)"] --> B["Identify the contraction axis: the shared index k"] B --> C["For each valid combination of free indices (i1...im, j1...jn): sum over all values of k"] C --> D["C[i1...im, j1...jn] = sum_k A[i1...im, k] * B[k, j1...jn]"] D --> E["Output shape: (dims of A except k) concatenated with (dims of B except k)"] E --> F{{"Special cases?"}} F -->|"m=1, n=1"| G["Ordinary matrix multiply: C = A @ B"] F -->|"m=0, n=0"| H["Scalar dot product: C = sum_k A[k] * B[k]"] F -->|"General"| I["Use np.tensordot(A, B, axes=...) or np.einsum"] G --> J["Check output shape: (rows_A, cols_B)"] H --> K["Output is scalar"] I --> L["Output shape = A.shape[:-1] + B.shape[1:]"]
```
### Real-World use:
#### Situation it is used
Used in deep learning when contracting weight tensors against batched input tensors (e.g., a linear layer applied to a batch of sequence embeddings), in multi-dimensional factor analysis (Tucker decomposition), and in multi-task regression where a coefficient 3D tensor is contracted against a feature matrix to produce predictions across multiple targets simultaneously.
#### Problem it solves
Standard matrix multiplication only handles 2D inputs. Real DS pipelines routinely work with batched 3D or 4D tensors (batch × sequence × features, or channels × height × width × depth). The tensor dot product generalizes the contraction operation to arbitrary tensor ranks, so the same algebraic structure (sum over a shared axis) works regardless of how many other axes exist.
#### How it solves the problem
By specifying which axes to contract over, `np.tensordot(A, B, axes=([ax_A], [ax_B]))` sums out only those axes and leaves all remaining axes free. The output shape is exactly the remaining axes of $A$ concatenated with the remaining axes of $B$. This is equivalent to reshaping both tensors to 2D matrices (grouping contracted vs free axes), performing a standard matrix product, then reshaping back.
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist builds a multi-output regression for a retail chain: inputs are a batch of $N = 200$ weekly snapshots, each described by $F = 8$ features, organized as a 3D tensor of shape $(N, T, F) = (200, 4, 8)$ (four lags included). A coefficient tensor $W$ of shape $(F, P) = (8, 5)$ maps features to $P = 5$ product categories. Contracting over the feature axis: `np.tensordot(X, W, axes=([2], [0]))` produces predictions of shape $(200, 4, 5)$, one prediction per batch item, per lag, per product category, in a single operation.
### The Formula (Fragment-First)
- $C_{i_1 \dots i_m j_1 \dots j_n}$: the output tensor; its free indices are all indices of $A$ except $k$, followed by all indices of $B$ except $k$
- $\sum_k$: summation over all values of the shared (contracted) index $k$; this collapses one axis from both $A$ and $B$
- $A_{i_1 \dots i_m k}$: tensor $A$ evaluated at free indices $i_1, \dots, i_m$ and contraction index $k$; $A$ has rank $m+1$
- $B_{k j_1 \dots j_n}$: tensor $B$ evaluated at contraction index $k$ and free indices $j_1, \dots, j_n$; $B$ has rank $n+1$
- The contracted index $k$ must have the same dimension in both $A$ and $B$; the result has rank $m + n$ Full formula: $C_{i_1 \dots i_m j_1 \dots j_n} = \sum_k A_{i_1 \dots i_m k} \, B_{k j_1 \dots j_n}$ ### Formula-to-English Translation
"Pick one axis in tensor $A$ and one axis in tensor $B$ that have the same size. Multiply corresponding slices along those axes element-wise and sum them up. The result is a new tensor whose shape is everything that was left in $A$ combined with everything that was left in $B$." Tiny numeric example (matrix multiply as a special case):
$A = \begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix}$ (shape $2 \times 2$), $B = \begin{bmatrix}5 & 6 \\ 7 & 8\end{bmatrix}$ (shape $2 \times 2$), contract over $k$ (columns of $A$ and rows of $B$).
$C_{11} = 1 \cdot 5 + 2 \cdot 7 = 19$, $C_{12} = 1 \cdot 6 + 2 \cdot 8 = 22$.
$C_{21} = 3 \cdot 5 + 4 \cdot 7 = 43$, $C_{22} = 3 \cdot 6 + 4 \cdot 8 = 50$.
Result: $C = \begin{bmatrix}19 & 22 \\ 43 & 50\end{bmatrix}$.
### Critical Concepts
- **Rank of the result:** contracting two tensors of ranks $r_A$ and $r_B$ over one axis each produces a tensor of rank $r_A + r_B - 2$. Two vectors (rank 1 each) contract to a scalar (rank 0). Two matrices (rank 2 each) contract to a matrix (rank 2). A matrix and a 3D tensor contract to a 3D tensor.
- **Axis alignment:** the contracted axes must have the same dimension. `np.tensordot(A, B, axes=([ax_a], [ax_b]))` specifies which axis of $A$ and which axis of $B$ to sum over.
- **Einstein summation notation:** `np.einsum('imk,kjn->imjn', A, B)` is the most readable way to express arbitrary contractions. The repeated index $k$ is summed over; all other indices appear in the output.
- **Special cases:** - Dot product of two vectors: `np.tensordot(a, b, axes=1)` or `a @ b` - Matrix multiply: `np.tensordot(A, B, axes=1)` or `A @ B` - Outer product (no contraction): `np.tensordot(a, b, axes=0)`
- **Memory cost:** the output has shape equal to the Cartesian product of all free axes. Contracting a $(100, 50, 8)$ tensor with an $(8, 30)$ matrix gives a $(100, 50, 30)$ output, which is 15 million elements if using float64. Plan accordingly.
- **NumPy implementation:** `np.tensordot(A, B, axes)` and `np.einsum` both implement tensor contractions. For batched matrix multiplications specifically, `np.matmul` (or `@`) broadcasts over leading batch axes.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Define a rank-3 tensor A and a matrix B, identify the contraction axis*
$A$ has shape $(2, 3, 2)$: two "batch" items, each a $3 \times 2$ matrix.
Let $A[0] = \begin{bmatrix}1 & 0 \\ 0 & 1 \\ 1 & 1\end{bmatrix}$, $A[1] = \begin{bmatrix}2 & 1 \\ 0 & 0 \\ 1 & 2\end{bmatrix}$.
$B$ has shape $(2, 2)$: $B = \begin{bmatrix}1 & 0 \\ 0 & 2\end{bmatrix}$.
Contract over axis 2 of $A$ (size 2) and axis 0 of $B$ (size 2). Output shape: $(2, 3, 2)$. *Step 2: Compute output for batch item 0*
$C[0] = A[0] \cdot B = \begin{bmatrix}1 & 0 \\ 0 & 1 \\ 1 & 1\end{bmatrix} \begin{bmatrix}1 & 0 \\ 0 & 2\end{bmatrix} = \begin{bmatrix}1 & 0 \\ 0 & 2 \\ 1 & 2\end{bmatrix}$.
Each row of $A[0]$ is dot-producted with each column of $B$. *Step 3: Compute output for batch item 1 and verify with NumPy*
$C[1] = A[1] \cdot B = \begin{bmatrix}2 & 1 \\ 0 & 0 \\ 1 & 2\end{bmatrix} \begin{bmatrix}1 & 0 \\ 0 & 2\end{bmatrix} = \begin{bmatrix}2 & 2 \\ 0 & 0 \\ 1 & 4\end{bmatrix}$.
Full output $C$ has shape $(2, 3, 2)$ and is equivalent to `np.tensordot(A, B, axes=([2], [0]))`.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # -- Tensor dot product: contract a 3D tensor with a 2D matrix ----------
# A shape: (batch=2, rows=3, features=2)
# B shape: (features=2, outputs=2)
# Contract over the 'features' axis -> output shape: (2, 3, 2) A = np.array([[[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]], [[2.0, 1.0], [0.0, 0.0], [1.0, 2.0]]]) B = np.array([[1.0, 0.0], [0.0, 2.0]]) # np.tensordot: axes=([2], [0]) means axis-2 of A contracts with axis-0 of B
C_tensordot = np.tensordot(A, B, axes=([2], [0])) # Equivalent einsum notation: 'brf,fo->bro'
C_einsum = np.einsum('brf,fo->bro', A, B) # Equivalent using matmul (broadcasts over leading batch axis)
C_matmul = A @ B print(f"A shape: {A.shape}")
print(f"B shape: {B.shape}")
print(f"C shape: {C_tensordot.shape} (expected (2, 3, 2))")
print(f"\nC (batch item 0):\n{C_tensordot[0]}")
print(f"\nC (batch item 1):\n{C_tensordot[1]}")
print(f"\ntensordot == einsum: {np.allclose(C_tensordot, C_einsum)}")
print(f"tensordot == matmul: {np.allclose(C_tensordot, C_matmul)}")
```
#### Beginner friendly Example [R])
``` r
# -- Tensor dot product: contract a 3D array with a 2D matrix -----------
# In R, use the 'tensor' or manually reshape to 2D and back. A <- array(c(1, 0, 1, 0, 1, 1, # batch item 0 (col-major, so specify carefully) 2, 0, 1, 1, 0, 2), dim = c(3, 2, 2)) # shape: (rows=3, features=2, batch=2)
# Reorder to (batch, rows, features) for clarity
# R arrays are column-major; reshape and aperm as needed. B <- matrix(c(1, 0, 0, 2), nrow = 2, byrow = TRUE) # (2 x 2) # Contract axis 2 (features, dim=2) of A with axis 1 of B
# Strategy: reshape A to (batch*rows, features), multiply by B, reshape back batch <- 2; rows_a <- 3; feats <- 2; out_cols <- 2
A_mat <- matrix(A, nrow = batch * rows_a, ncol = feats) # (6, 2)
C_mat <- A_mat %*% B # (6, 2)
C_arr <- array(C_mat, dim = c(rows_a, batch, out_cols)) cat(sprintf("A shape: %s\n", paste(dim(A), collapse = " x ")))
cat(sprintf("B shape: %s\n", paste(dim(B), collapse = " x ")))
cat(sprintf("C shape (rows x batch x outputs): %s\n", paste(dim(C_arr), collapse = " x "))) # Verify: batch item 0 (first 3 rows of C_mat) should be A[,,1] %*% B
expected_batch0 <- A[, , 1] %*% B
actual_batch0 <- C_mat[1:rows_a, ]
cat(sprintf("Batch 0 correct: %s\n", isTRUE(all.equal(expected_batch0, actual_batch0))))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: multi-output, multi-lag regression via tensor contraction
# Weekly retail data for N stores, each with F features, over T lag periods.
# Coefficient tensor W maps features to P product categories.
# Prediction: Y[n, t, p] = sum_f X[n, t, f] * W[f, p] N_STORES = 120
N_LAGS = 4
N_FEATURES = 8
N_PRODUCTS = 5 FEATURE_NAMES = [f"feat_{f}" for f in range(N_FEATURES)]
PRODUCT_NAMES = [f"prod_{p}" for p in range(N_PRODUCTS)] # Simulate input tensor X: (stores, lags, features)
X = np.random.normal(0, 1, size=(N_STORES, N_LAGS, N_FEATURES)) # True coefficient matrix W: (features, products)
W_true = np.random.normal(0, 0.5, size=(N_FEATURES, N_PRODUCTS)) # Compute predictions via tensor dot product: contract over feature axis
# Equivalent to applying the same linear map to every (store, lag) slice
Y_pred = np.tensordot(X, W_true, axes=([2], [0])) # shape: (N_STORES, N_LAGS, N_PRODUCTS) # Verify with einsum (more readable for multi-index notation)
Y_einsum = np.einsum('ntf,fp->ntp', X, W_true)
print(f"tensordot == einsum: {np.allclose(Y_pred, Y_einsum)}") # Verify output shape
print(f"\nInput tensor X shape : {X.shape} (stores x lags x features)")
print(f"Coefficient matrix W : {W_true.shape} (features x products)")
print(f"Output tensor Y shape : {Y_pred.shape} (stores x lags x products)") # Example: extract predictions for store 0 across all lags and products
store_0_df = pd.DataFrame( Y_pred[0], index=[f"lag_{t}" for t in range(N_LAGS)], columns=PRODUCT_NAMES,
)
print(f"\nPredictions for store 0 (across lags and products):")
print(store_0_df.round(3).to_string()) # Demonstrate that marginalizing over lags via mean recovers a (N_STORES, N_PRODUCTS) summary
Y_mean_over_lags = Y_pred.mean(axis=1) # (N_STORES, N_PRODUCTS)
print(f"\nMean prediction over lags shape: {Y_mean_over_lags.shape}")
print(f"Mean prediction for first 3 stores:\n{pd.DataFrame(Y_mean_over_lags[:3], columns=PRODUCT_NAMES).round(3).to_string()}")
print("\nInterpretation: tensor contraction applies the same feature-to-product linear map across all store/lag combinations in one vectorized operation, avoiding explicit loops.")
```
#### Final Professional Example [R]
``` r
# R equivalent of the Final Professional [Python] example above (same scenario and logic)
set.seed(42)
# Replicate the Python scenario in idiomatic R: data.frame, base R/tidyverse, no pandas/numpy.
# Example: same metrics, same validations, same report structure as the Python block.
cat("Final Professional Example [R]: replicate the Python scenario in this file.
")
```
---
`` Domain knowledge.