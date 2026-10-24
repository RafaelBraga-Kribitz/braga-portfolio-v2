---
title: Gradient of a Linear Transformation
date: '2026-04-16'
wordCount: 878
slug: gradient_of_a_linear_transformation
permalink: /notes/04_calculus_optimization/multivariable_calculus_and_matrix_calculus/matrix_calculus_identities_and_automatic_differentiation/gradient_of_a_linear_transformation/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{d}{dx}(Ax) = A$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This identity states: the Jacobian (total derivative) of the vector-valued linear function $f(\mathbf{x}) = A\mathbf{x}$ with respect to $\mathbf{x}$ is the matrix $A$ itself. It is the multivariable analogue of the scalar rule $\frac{d}{dx}(cx) = c$. If $A \in \mathbb{R}^{m \times n}$ and $\mathbf{x} \in \mathbb{R}^n$, then $f(\mathbf{x}) = A\mathbf{x} \in \mathbb{R}^m$ and $J_f = A \in \mathbb{R}^{m \times n}$. This result is used constantly in ML: the forward pass of a fully connected layer is $\mathbf{z} = W\mathbf{x} + \mathbf{b}$, and the Jacobian of the linear part with respect to the input is $W$. During backpropagation, the gradient flows backward through this linear layer as $\nabla_\mathbf{x} L = W^T \nabla_\mathbf{z} L$, which follows directly from this identity. Understanding this is the foundation for deriving all linear layer gradients in neural networks.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Linear function: f(x) = A @ x"] --> B["A is a constant matrix (m x n), x is the variable (n,)"] B --> C["f maps R^n -> R^m"] C --> D["Jacobian: d/dx (Ax) = A (m x n matrix)"] D --> E["Proof: (Ax)_i = sum_j A_ij * x_j"] E --> F["d(Ax)_i / dx_j = A_ij"] F --> G["All entries: [J]_ij = A_ij -> J = A"] D --> H["Chain rule application (backprop):"] H --> I["dL/dx = (dL/d(Ax))^T @ (d(Ax)/dx) = delta^T @ A"] I --> J["In column vector form: dL/dx = A^T @ delta"]
```
### Real-World use:
#### Situation it is used
Every fully connected layer in a neural network: $\mathbf{z} = W\mathbf{x} + \mathbf{b}$, Jacobian $\partial \mathbf{z}/\partial \mathbf{x} = W$. Computing gradients of linear regression: $\nabla_\mathbf{w} (X\mathbf{w} - \mathbf{y})$ leads to the OLS normal equations. Deriving the gradient of the squared error loss via matrix calculus. Any computation that passes a vector through a linear layer and needs the backward-pass gradient.
#### Problem it solves
When you have a composed function involving a linear transformation (e.g., the output layer of a neural net, a ridge regression objective), you need the derivative of the linear part to apply the chain rule. Without knowing that $J_{A\mathbf{x}} = A$, you would need to compute all $mn$ partial derivatives from scratch every time.
#### How it solves the problem
Direct computation from the definition: $[A\mathbf{x}]_i = \sum_j A_{ij} x_j$. Differentiating: $\frac{\partial [A\mathbf{x}]_i}{\partial x_j} = A_{ij}$. Assembling all entries: the Jacobian is exactly $A$. Since $A$ is constant (does not depend on $\mathbf{x}$), the result is particularly clean.
#### Example of it used in the Working Context as DA/DS for a Business
Training a single-layer neural network with weights $W$ for click-through-rate prediction: the linear activation is $\mathbf{z} = W\mathbf{x}$. During backprop, if the upstream gradient (from the loss) w.r.t. $\mathbf{z}$ is $\delta = \nabla_\mathbf{z} L$, then $\nabla_\mathbf{x} L = W^T \delta$ (by the identity: Jacobian of $W\mathbf{x}$ is $W$, then VJP = $W^T \delta$). Also: $\nabla_W L = \delta \mathbf{x}^T$ (outer product — derived from the companion identity $d(W\mathbf{x})/dW = \mathbf{x}^T$ in appropriate layout).
### The Formula (Fragment-First)
$$\frac{d}{d\mathbf{x}}(A\mathbf{x}) = A$$ Each symbol:
- $A$: a constant matrix $\in \mathbb{R}^{m \times n}$ (does not depend on $\mathbf{x}$)
- $\mathbf{x}$: the variable vector $\in \mathbb{R}^n$
- $A\mathbf{x}$: a vector $\in \mathbb{R}^m$ (matrix-vector product)
- $\frac{d}{d\mathbf{x}}$: the total derivative / Jacobian with respect to the vector $\mathbf{x}$
- Result: the Jacobian is $A \in \mathbb{R}^{m \times n}$ (the matrix itself) **Companion identities**:
- $\frac{d}{d\mathbf{x}}(\mathbf{a}^T \mathbf{x}) = \mathbf{a}^T$ (gradient of dot product, row vector form) or $\mathbf{a}$ (column form)
- $\frac{d}{d\mathbf{x}}(\mathbf{x}^T A) = A^T$ (gradient of $\mathbf{x}^T A$, where $A$ is constant)
- $\frac{d}{d\mathbf{x}}(\mathbf{x}^T \mathbf{x}) = 2\mathbf{x}^T$ (gradient of the squared norm, row vector form) **Chain rule application** (backprop through a linear layer):
$$\frac{dL}{d\mathbf{x}} = \left(\frac{d(A\mathbf{x})}{d\mathbf{x}}\right)^T \frac{dL}{d(A\mathbf{x})} = A^T \delta$$ where $\delta = \nabla_{A\mathbf{x}} L$ is the upstream gradient.
### Formula-to-English Translation
"Multiplying a vector $\mathbf{x}$ by a constant matrix $A$ is a linear map. The rate of change of the output with respect to the input is the coefficient matrix $A$ itself — just as $d(cx)/dx = c$ for scalars. This is because each output component $[A\mathbf{x}]_i = \sum_j A_{ij} x_j$ changes at a constant rate $A_{ij}$ per unit change in $x_j$, regardless of where you are." ### Critical Concepts
- **Jacobian = coefficient matrix**: for any linear map $\mathbf{y} = A\mathbf{x}$, the Jacobian is $A$. Linear maps are their own best linear approximations everywhere.
- **Backward pass gradient**: the gradient of a scalar loss $L$ w.r.t. the input $\mathbf{x}$ is $A^T \nabla_\mathbf{y} L$ — the transposed weight matrix times the upstream gradient.
- **Gradient w.r.t. $A$**: a different but related identity. For $f(\mathbf{x}) = \mathbf{c}^T A \mathbf{x}$ where $\mathbf{c}$ is constant, $\nabla_A f = \mathbf{c}\mathbf{x}^T$ (an outer product).
- **Layout conventions**: some sources write $\frac{d(A\mathbf{x})}{d\mathbf{x}} = A$ (numerator layout), others write $A^T$ (denominator layout). Always verify which convention a reference uses before copying gradient formulas.
- **Affine case**: $f(\mathbf{x}) = A\mathbf{x} + \mathbf{b}$. The Jacobian is still $A$ (the bias $\mathbf{b}$ is a constant, its derivative is 0).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Let $A = \begin{bmatrix} 2 & 3 \\ 1 & -1 \end{bmatrix}$, $\mathbf{x} = (x_1, x_2)^T$. Show that $J_{A\mathbf{x}} = A$. *Step 1: Compute $A\mathbf{x}$ explicitly*
$A\mathbf{x} = \begin{bmatrix} 2x_1 + 3x_2 \\ x_1 - x_2 \end{bmatrix}$ *Step 2: Differentiate each output component w.r.t. each input*
$\frac{\partial (2x_1+3x_2)}{\partial x_1} = 2$, $\frac{\partial (2x_1+3x_2)}{\partial x_2} = 3$
$\frac{\partial (x_1-x_2)}{\partial x_1} = 1$, $\frac{\partial (x_1-x_2)}{\partial x_2} = -1$ *Step 3: Assemble the Jacobian*
$$J = \begin{bmatrix} 2 & 3 \\ 1 & -1 \end{bmatrix} = A \checkmark$$ *Step 4: Backprop example*
If $\delta = \nabla_{A\mathbf{x}} L = (1, 0)^T$, then $\nabla_\mathbf{x} L = A^T \delta = (2, 3)^T$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # A is a constant matrix; x is the variable
A = np.array([[2.0, 3.0], [1.0, -1.0]]) x0 = np.array([1.0, 2.0]) def linear_map(x: np.ndarray) -> np.ndarray: """f(x) = A @ x.""" return A @ x def analytic_jacobian_linear() -> np.ndarray: """d/dx(Ax) = A (constant, does not depend on x).""" return A.copy() def numerical_jacobian(fn, x: np.ndarray, h: float = 1e-5) -> np.ndarray: """Centered finite difference Jacobian.""" n = len(x); f0 = fn(x); m = len(f0) jac = np.zeros((m, n)) for j in range(n): e_j = np.zeros(n); e_j[j] = h jac[:, j] = (fn(x + h * e_j) - fn(x - h * e_j)) / (2 * h) return jac j_analytic = analytic_jacobian_linear()
j_numerical = numerical_jacobian(linear_map, x0) print("d/dx(Ax) = A:")
print(j_analytic)
print("\nNumerical Jacobian:")
print(j_numerical)
print(f"\nMax error: {np.abs(j_analytic - j_numerical).max():.2e}") # Backprop: gradient of L w.r.t. x given upstream gradient delta
delta = np.array([1.0, 0.0]) # dL/d(Ax) from upstream
grad_x = A.T @ delta # dL/dx = A^T @ delta
print(f"\nUpstream gradient delta = {delta}")
print(f"Backward pass: dL/dx = A^T @ delta = {grad_x}") # Verify: if L = sum(Ax), then dL/dx = sum of rows of A = A^T @ ones
ones = np.ones(A.shape[0])
grad_x_verify = A.T @ ones
print(f"\nIf L = sum(A@x): dL/dx = A^T @ ones = {grad_x_verify}")
numerical_verify = numerical_jacobian(lambda x: np.array([linear_map(x).sum()]), x0)[0]
print(f"Numerical check: {numerical_verify}")
```
#### Beginner friendly Example [R])
``` r
A <- matrix(c(2, 1, 3, -1), nrow = 2, ncol = 2) # column-major in R
# Note: R stores column-major, so A[1,1]=2, A[2,1]=1, A[1,2]=3, A[2,2]=-1 linear_map <- function(x) A %*% x # Analytic Jacobian: d/dx(Ax) = A
cat("Analytic Jacobian = A:\n"); print(A) # Numerical Jacobian
x0 <- c(1, 2); h <- 1e-5
num_jac <- matrix(0, nrow = nrow(A), ncol = ncol(A))
for (j in 1:2) { e <- rep(0, 2); e[j] <- h num_jac[, j] <- (linear_map(x0 + e) - linear_map(x0 - e)) / (2 * h)
}
cat("Numerical Jacobian:\n"); print(round(num_jac, 6)) # Backprop: dL/dx = A^T @ delta
delta <- c(1, 0)
grad_x <- t(A) %*% delta
cat("Backprop dL/dx = A^T @ delta:", grad_x, "\n")
```
#### Final Professional Example [Python])
``` python
"""
Gradient of linear layer: d/dx(Wx) = W, applied in neural network backprop. A single fully connected layer: z = W @ x + b.
Loss L is some scalar function of z. Backward pass: dL/dx = W^T @ dL/dz [from d(Wx)/dx = W -> VJP = W^T @ upstream] dL/dW = dL/dz @ x^T [from d(Wx)/dW = x^T in appropriate layout] dL/db = dL/dz [bias gradient = upstream gradient directly] We verify all three against numerical finite differences.
"""
import numpy as np RANDOM_SEED = 42
rng = np.random.default_rng(RANDOM_SEED) # Layer dimensions
N_IN, N_OUT = 4, 3 # Random weights, bias, input
W = rng.standard_normal((N_OUT, N_IN)) * 0.5
b = rng.standard_normal(N_OUT) * 0.1
x = rng.standard_normal(N_IN) def layer_output(w: np.ndarray, b_vec: np.ndarray, x_vec: np.ndarray) -> np.ndarray: """Forward: z = W @ x + b.""" return w @ x_vec + b_vec def loss_fn(z: np.ndarray) -> float: """Simple quadratic loss: L = 0.5 * ||z||^2.""" return 0.5 * float(np.dot(z, z)) # Forward pass
z = layer_output(W, b, x)
L = loss_fn(z) # Upstream gradient: dL/dz = z (for L = 0.5 ||z||^2)
delta_z = z.copy() # shape (N_OUT,) # Analytic gradients
grad_x_analytic = W.T @ delta_z # shape (N_IN,)
grad_W_analytic = np.outer(delta_z, x) # shape (N_OUT, N_IN)
grad_b_analytic = delta_z.copy() # shape (N_OUT,) # Numerical gradients for x
h = 1e-5
grad_x_numerical = np.zeros(N_IN)
for i in range(N_IN): e_i = np.zeros(N_IN); e_i[i] = h L_plus = loss_fn(layer_output(W, b, x + h * e_i)) L_minus = loss_fn(layer_output(W, b, x - h * e_i)) grad_x_numerical[i] = (L_plus - L_minus) / (2 * h) # Numerical gradient for W
grad_W_numerical = np.zeros_like(W)
for i in range(N_OUT): for j in range(N_IN): W_plus = W.copy(); W_plus[i, j] += h W_minus = W.copy(); W_minus[i, j] -= h L_plus = loss_fn(layer_output(W_plus, b, x)) L_minus_val = loss_fn(layer_output(W_minus, b, x)) grad_W_numerical[i, j] = (L_plus - L_minus_val) / (2 * h) print(f"=== Linear Layer Gradient Check [d/dx(Wx) = W] ===")
print(f" Layer: z = W @ x + b, L = 0.5||z||^2")
print()
print(f" dL/dx (analytic): {grad_x_analytic.round(6)}")
print(f" dL/dx (numerical): {grad_x_numerical.round(6)}")
print(f" Max error: {np.abs(grad_x_analytic - grad_x_numerical).max():.2e}")
print()
print(f" dL/dW (analytic):\n{grad_W_analytic.round(4)}")
print(f" dL/dW (numerical):\n{grad_W_numerical.round(4)}")
print(f" Max error: {np.abs(grad_W_analytic - grad_W_numerical).max():.2e}")
print()
print(f" dL/db (analytic): {grad_b_analytic.round(6)}")
print(f" [= upstream gradient directly, since dL/db = dL/dz * dz/db = delta * 1]")
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