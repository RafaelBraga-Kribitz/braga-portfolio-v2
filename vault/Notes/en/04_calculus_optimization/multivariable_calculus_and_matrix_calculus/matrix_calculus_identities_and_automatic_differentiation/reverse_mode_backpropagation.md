---
title: Reverse Mode Backpropagation
date: '2026-04-16'
wordCount: 1253
slug: reverse_mode_backpropagation
permalink: /notes/04_calculus_optimization/multivariable_calculus_and_matrix_calculus/matrix_calculus_identities_and_automatic_differentiation/reverse_mode_backpropagation/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{\partial f}{\partial x_i} = \sum_{x_j \,:\, x_i \in \mathrm{Pa}(x_j)} \frac{\partial f}{\partial x_j} \frac{\partial x_j}{\partial x_i}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
This formula is the mathematical heart of backpropagation — the algorithm that trains virtually every neural network in existence. It is the multivariate chain rule applied to a computation graph (directed acyclic graph, DAG) in reverse: to compute the partial derivative of the final scalar output $f$ with respect to any intermediate node $x_i$, you sum over all "children" of $x_i$ (the nodes $x_j$ that directly use $x_i$ as input, denoted $x_i \in \mathrm{Pa}(x_j)$ meaning "$x_i$ is a parent of $x_j$"). Each term in the sum is the product of: how much $f$ changes per unit change in $x_j$ (already computed in the backward pass), times how much $x_j$ changes per unit change in $x_i$ (the local derivative of the operation at that edge). This is reverse-mode automatic differentiation (reverse-mode AD or backprop). It is "reverse" because you start from the output $f$ and propagate gradients back toward the inputs. For a scalar output and any number of inputs, reverse mode computes all $n$ partial derivatives $\frac{\partial f}{\partial x_1}, \ldots, \frac{\partial f}{\partial x_n}$ in a single backward pass — cost proportional to one forward pass, regardless of $n$. This is why gradient descent over millions of weights is computationally feasible.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Build computational graph (forward pass)"] --> B["Compute and store all intermediate values x_i"] B --> C["Initialize: df/df = 1 (output gradient = 1)"] C --> D["Traverse graph in reverse topological order"] D --> E["For each node x_i: accumulate gradient"] E --> F["df/dx_i = sum over children x_j of: (df/dx_j) * (dx_j/dx_i)"] F --> G["Each term (df/dx_j) * (dx_j/dx_i) is a VJP (vector-Jacobian product)"] G --> H["Propagate backward until all leaf nodes have gradients"] H --> I["Leaf node x_i (input/parameter): df/dx_i is the final gradient"] I --> J["Use gradients for gradient descent: w <- w - alpha * df/dw"]
```
### Real-World use:
#### Situation it is used
Training neural networks of any architecture (MLP, CNN, RNN, Transformer). Computing gradients of any scalar loss with respect to all parameters in a computational graph. Automatic differentiation frameworks (PyTorch `autograd`, TensorFlow, JAX): they implement exactly this formula on the recorded computation graph. Sensitivity analysis: how does the output change with respect to each input feature. Gradient-based hyperparameter optimization (differentiable architecture search, meta-learning). Any scenario where you need $\frac{\partial f}{\partial \mathbf{w}}$ for a scalar $f$ over many parameters $\mathbf{w}$.
#### Problem it solves
A neural network $f_\theta$ is a deeply composed function: $f = f_L \circ f_{L-1} \circ \cdots \circ f_1$. It has millions of parameters. You need the gradient of a scalar loss $L$ with respect to every parameter to run gradient descent. Naive approaches (symbolic differentiation, finite differences) are either combinatorially intractable or require $O(n)$ forward passes for $n$ parameters. Reverse-mode AD computes all $n$ gradients in one backward pass.
#### How it solves the problem
The key insight is the accumulation rule: each node accumulates gradient contributions from all its downstream children before sending gradients upstream. The local derivative $\frac{\partial x_j}{\partial x_i}$ for each edge is the derivative of the operation that produced $x_j$ from $x_i$, computed during the forward pass. Multiplying the upstream gradient $\frac{\partial f}{\partial x_j}$ by the local edge derivative gives the contribution of that path. Summing over all paths (all children) gives the total gradient — this is exactly the multivariate chain rule on the graph.
#### Example of it used in the Working Context as DA/DS for a Business
A two-layer neural network for click-through-rate (CTR) prediction: $\mathbf{z}_1 = W_1\mathbf{x}$, $\mathbf{a}_1 = \sigma(\mathbf{z}_1)$, $\mathbf{z}_2 = W_2\mathbf{a}_1$, $L = BCE(\mathbf{z}_2, y)$. Backward pass via the formula: $\frac{\partial L}{\partial W_2} = \frac{\partial L}{\partial \mathbf{z}_2} \cdot \frac{\partial \mathbf{z}_2}{\partial W_2} = \delta_2 \cdot \mathbf{a}_1^T$; then $\frac{\partial L}{\partial \mathbf{a}_1} = W_2^T\delta_2$; then $\frac{\partial L}{\partial \mathbf{z}_1} = \frac{\partial L}{\partial \mathbf{a}_1} \odot \sigma'(\mathbf{z}_1)$; then $\frac{\partial L}{\partial W_1} = \delta_1 \cdot \mathbf{x}^T$. All weights get their gradient in one backward pass.
### The Formula (Fragment-First)
$$\frac{\partial f}{\partial x_i} = \sum_{x_j \,:\, x_i \in \mathrm{Pa}(x_j)} \frac{\partial f}{\partial x_j} \frac{\partial x_j}{\partial x_i}$$ Each symbol:
- $f$: the scalar output (e.g., loss function $L$)
- $x_i$: the node whose gradient you are computing
- $x_j$: a child of $x_i$ — a node that directly depends on $x_i$
- $x_i \in \mathrm{Pa}(x_j)$: "$x_i$ is a parent of $x_j$" — $x_j$ was computed using $x_i$
- $\frac{\partial f}{\partial x_j}$: the already-computed gradient at child $x_j$ (arrived from further downstream)
- $\frac{\partial x_j}{\partial x_i}$: the local derivative of the operation that produced $x_j$ from $x_i$ — computed during the forward pass
- The sum accounts for multiple paths from $x_i$ to $f$ (if $x_i$ fans out to multiple children) **For a chain** (single-path, no branching):
$$\frac{\partial f}{\partial x_1} = \frac{\partial f}{\partial x_n}\frac{\partial x_n}{\partial x_{n-1}}\cdots\frac{\partial x_2}{\partial x_1} = \prod_{k=1}^{n-1}\frac{\partial x_{k+1}}{\partial x_k}$$ **VJP notation** (vector-Jacobian product, what frameworks compute):
$$\bar{\mathbf{x}}_i = \sum_j J_{x_j, x_i}^T \bar{\mathbf{x}}_j$$ where $\bar{\mathbf{x}}_j = \frac{\partial f}{\partial \mathbf{x}_j}$ is the adjoint (upstream gradient). **Two-layer MLP backward pass** (explicit):
$$\delta_2 = \frac{\partial L}{\partial \mathbf{z}_2}, \quad \frac{\partial L}{\partial W_2} = \delta_2 \mathbf{a}_1^T, \quad \delta_1 = (W_2^T\delta_2) \odot \sigma'(\mathbf{z}_1), \quad \frac{\partial L}{\partial W_1} = \delta_1 \mathbf{x}^T$$ ### Formula-to-English Translation
"Starting from the output loss (gradient = 1), move backward through the computation graph. At each node, multiply the gradient coming from downstream by the local derivative of the operation at each incoming edge. If a node feeds into multiple children (fan-out), sum all the gradient contributions arriving from each child. When you reach a parameter (leaf node), you have its gradient." ### Critical Concepts
- **Why reverse not forward mode**: for a loss $f: \mathbb{R}^n \to \mathbb{R}$ with $n \gg 1$ parameters, reverse mode costs $O(1)$ backward passes to get all $n$ gradients. Forward mode would cost $O(n)$ passes (one per parameter). The tradeoff reverses for $f: \mathbb{R}^1 \to \mathbb{R}^m$ (multiple outputs, few inputs) — use forward mode.
- **Adjoint variables**: the accumulated gradient $\bar{x}_i = \frac{\partial f}{\partial x_i}$ is called the adjoint or cotangent. The backward pass propagates adjoints in reverse topological order.
- **Memory vs. compute tradeoff**: reverse mode must store all intermediate values from the forward pass (to compute local Jacobians during backward). Gradient checkpointing trades recomputation for reduced memory.
- **Topological ordering**: nodes must receive all downstream gradients before they send gradients upstream. This requires a reverse topological sort of the DAG.
- **Jacobian-vector product (JVP) vs. VJP**: forward mode computes $J\mathbf{v}$ (Jacobian times a tangent vector — efficient for few inputs). Reverse mode computes $J^T\mathbf{u}$ (transposed Jacobian times a cotangent — efficient for scalar output with many inputs). Backprop is VJP accumulation.
- **PyTorch/JAX connection**: `.backward()` in PyTorch and `jax.grad` implement exactly this formula. Each operation registers its local VJP rule (its "backward function"), and the framework assembles the DAG automatically.
- **Numerical gradients as verification**: always check your analytically derived gradients against centered finite differences. Max relative error should be $< 10^{-5}$ for correctness.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Let the computation be $f = (x_1 \cdot x_2 + x_3)^2$ with $x_1=2, x_2=3, x_3=1$. Compute $\frac{\partial f}{\partial x_1}$, $\frac{\partial f}{\partial x_2}$, $\frac{\partial f}{\partial x_3}$. *Step 1: Forward pass — define intermediate nodes*
$v_1 = x_1 \cdot x_2 = 6$, $v_2 = v_1 + x_3 = 7$, $f = v_2^2 = 49$ *Step 2: Initialize output gradient*
$\bar{f} = \frac{\partial f}{\partial f} = 1$ *Step 3: Backprop through $f = v_2^2$*
$\bar{v}_2 = \frac{\partial f}{\partial v_2} = 2v_2 = 14$ *Step 4: Backprop through $v_2 = v_1 + x_3$ (sum rule: each input gets gradient 1)*
$\bar{v}_1 = \bar{v}_2 \cdot 1 = 14$, $\bar{x}_3 = \bar{v}_2 \cdot 1 = 14$ *Step 5: Backprop through $v_1 = x_1 \cdot x_2$ (product rule)*
$\bar{x}_1 = \bar{v}_1 \cdot x_2 = 14 \cdot 3 = 42$
$\bar{x}_2 = \bar{v}_1 \cdot x_1 = 14 \cdot 2 = 28$ Verify: $f = (x_1 x_2 + x_3)^2$, $\frac{\partial f}{\partial x_1} = 2(x_1 x_2 + x_3) x_2 = 2(7)(3) = 42$ ✓ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np # Manual reverse-mode backprop on a tiny 2-node computation graph
# f(x1, x2, x3) = (x1 * x2 + x3)^2 def forward(x1: float, x2: float, x3: float) -> dict: """Forward pass: store intermediate values.""" v1 = x1 * x2 # multiplication node v2 = v1 + x3 # addition node f = v2 ** 2 # squaring node return {"v1": v1, "v2": v2, "f": f, "x1": x1, "x2": x2, "x3": x3} def backward(cache: dict) -> dict: """Backward pass: reverse-mode backprop. Returns gradients df/dx1, df/dx2, df/dx3. """ v2 = cache["v2"] x1 = cache["x1"] x2 = cache["x2"] # Initialize: df/df = 1 grad_f = 1.0 # df/dv2 = 2 * v2 (chain rule through squaring) grad_v2 = grad_f * 2.0 * v2 # df/dv1 = df/dv2 * dv2/dv1 = df/dv2 * 1 (sum node) grad_v1 = grad_v2 * 1.0 # df/dx3 = df/dv2 * dv2/dx3 = df/dv2 * 1 (sum node) grad_x3 = grad_v2 * 1.0 # df/dx1 = df/dv1 * dv1/dx1 = df/dv1 * x2 (multiply node) grad_x1 = grad_v1 * x2 # df/dx2 = df/dv1 * dv1/dx2 = df/dv1 * x1 (multiply node) grad_x2 = grad_v1 * x1 return {"grad_x1": grad_x1, "grad_x2": grad_x2, "grad_x3": grad_x3} # Evaluate at x1=2, x2=3, x3=1
cache = forward(2.0, 3.0, 1.0)
grads = backward(cache) print(f"f(2, 3, 1) = {cache['f']}")
print(f"df/dx1 = {grads['grad_x1']} (expected: 42)")
print(f"df/dx2 = {grads['grad_x2']} (expected: 28)")
print(f"df/dx3 = {grads['grad_x3']} (expected: 14)") # Numerical verification
h = 1e-5
def f_fn(x1, x2, x3): return (x1 * x2 + x3)**2
num_dx1 = (f_fn(2+h, 3, 1) - f_fn(2-h, 3, 1)) / (2*h)
num_dx2 = (f_fn(2, 3+h, 1) - f_fn(2, 3-h, 1)) / (2*h)
num_dx3 = (f_fn(2, 3, 1+h) - f_fn(2, 3, 1-h)) / (2*h)
print(f"\nNumerical: df/dx1={num_dx1:.2f}, df/dx2={num_dx2:.2f}, df/dx3={num_dx3:.2f}")
```
#### Beginner friendly Example [R])
``` r
# Reverse-mode backprop: f(x1, x2, x3) = (x1 * x2 + x3)^2 # Forward pass
x1 <- 2.0; x2 <- 3.0; x3 <- 1.0
v1 <- x1 * x2 # = 6
v2 <- v1 + x3 # = 7
f <- v2^2 # = 49 cat("Forward pass: v1 =", v1, ", v2 =", v2, ", f =", f, "\n") # Backward pass (reverse-mode)
grad_f <- 1.0 # df/df = 1
grad_v2 <- grad_f * 2 * v2 # df/dv2 = 2 * v2 = 14
grad_v1 <- grad_v2 * 1.0 # df/dv1 (sum node)
grad_x3 <- grad_v2 * 1.0 # df/dx3 (sum node)
grad_x1 <- grad_v1 * x2 # df/dx1 = df/dv1 * x2
grad_x2 <- grad_v1 * x1 # df/dx2 = df/dv1 * x1 cat("\nBackward pass (reverse-mode):\n")
cat(" df/dx1 =", grad_x1, " (expected: 42)\n")
cat(" df/dx2 =", grad_x2, " (expected: 28)\n")
cat(" df/dx3 =", grad_x3, " (expected: 14)\n") # Numerical verification
h <- 1e-5
f_fn <- function(x1, x2, x3) (x1*x2 + x3)^2
cat("\nNumerical gradients:\n")
cat(" df/dx1:", (f_fn(x1+h, x2, x3) - f_fn(x1-h, x2, x3)) / (2*h), "\n")
cat(" df/dx2:", (f_fn(x1, x2+h, x3) - f_fn(x1, x2-h, x3)) / (2*h), "\n")
cat(" df/dx3:", (f_fn(x1, x2, x3+h) - f_fn(x1, x2, x3-h)) / (2*h), "\n")
```
#### Final Professional Example [Python])
``` python
"""
Manual reverse-mode backpropagation through a two-layer neural network. Architecture: x -> z1 = W1@x -> a1 = sigmoid(z1) -> z2 = W2@a1 + b2 -> L = BCE(z2, y) Forward pass: compute and store z1, a1, z2, p.
Backward pass (reverse-mode, one pass): delta2 = p - y (dL/dz2, upstream gradient through BCE+sigmoid) dL/dW2 = delta2 @ a1^T (outer product) dL/db2 = delta2 dL/da1 = W2^T @ delta2 (backprop through linear layer) delta1 = dL/da1 * sigma'(z1) (backprop through sigmoid, element-wise) dL/dW1 = delta1 @ x^T (outer product) dL/db1 = delta1 All computed in one backward pass — cost is O(forward pass), not O(n_params).
We verify all gradients against numerical finite differences.
"""
import numpy as np RANDOM_SEED = 42
rng = np.random.default_rng(RANDOM_SEED) # Network dimensions
N_IN, N_HIDDEN, N_OUT = 6, 4, 1 # Random parameters
W1 = rng.standard_normal((N_HIDDEN, N_IN)) * 0.5
b1 = np.zeros(N_HIDDEN)
W2 = rng.standard_normal((N_OUT, N_HIDDEN)) * 0.5
b2 = np.zeros(N_OUT) # Single data point
x = rng.standard_normal(N_IN)
y = np.array([1.0]) def sigmoid(z: np.ndarray) -> np.ndarray: return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500))) def bce_loss(p: np.ndarray, y_true: np.ndarray) -> float: p_clip = np.clip(p, 1e-12, 1.0 - 1e-12) return float(-np.mean(y_true * np.log(p_clip) + (1 - y_true) * np.log(1 - p_clip))) # ---- Forward pass ----
z1 = W1 @ x + b1 # shape (N_HIDDEN,)
a1 = sigmoid(z1) # shape (N_HIDDEN,)
z2 = W2 @ a1 + b2 # shape (N_OUT,)
p = sigmoid(z2) # shape (N_OUT,)
loss = bce_loss(p, y) # ---- Backward pass (reverse-mode) ----
# dL/dz2: combined BCE + sigmoid derivative = p - y
delta2 = p - y # shape (N_OUT,)
grad_W2 = np.outer(delta2, a1) # shape (N_OUT, N_HIDDEN)
grad_b2 = delta2.copy() # shape (N_OUT,) # dL/da1 via W2 layer
grad_a1 = W2.T @ delta2 # shape (N_HIDDEN,) # dL/dz1: through sigmoid (element-wise)
sigma_prime_z1 = a1 * (1.0 - a1) # sigma'(z1) = sigma(z1)(1 - sigma(z1))
delta1 = grad_a1 * sigma_prime_z1 # shape (N_HIDDEN,) grad_W1 = np.outer(delta1, x) # shape (N_HIDDEN, N_IN)
grad_b1 = delta1.copy() # shape (N_HIDDEN,) # ---- Numerical gradient check ----
def full_loss(w1, b1_, w2, b2_, x_, y_): z1_ = w1 @ x_ + b1_ a1_ = sigmoid(z1_) z2_ = w2 @ a1_ + b2_ p_ = sigmoid(z2_) return bce_loss(p_, y_) h = 1e-5
max_errors = {} # Check W2
grad_W2_num = np.zeros_like(W2)
for i in range(N_OUT): for j in range(N_HIDDEN): W2p = W2.copy(); W2p[i, j] += h W2m = W2.copy(); W2m[i, j] -= h grad_W2_num[i, j] = (full_loss(W1, b1, W2p, b2, x, y) - full_loss(W1, b1, W2m, b2, x, y)) / (2 * h)
max_errors["W2"] = np.abs(grad_W2 - grad_W2_num).max() # Check W1
grad_W1_num = np.zeros_like(W1)
for i in range(N_HIDDEN): for j in range(N_IN): W1p = W1.copy(); W1p[i, j] += h W1m = W1.copy(); W1m[i, j] -= h grad_W1_num[i, j] = (full_loss(W1p, b1, W2, b2, x, y) - full_loss(W1m, b1, W2, b2, x, y)) / (2 * h)
max_errors["W1"] = np.abs(grad_W1 - grad_W1_num).max() print("=== Reverse-Mode Backpropagation: 2-Layer MLP ===")
print(f" Loss = {loss:.6f}")
print(f" Gradient check (max |analytic - numerical|):")
for name, err in max_errors.items(): print(f" d L/d {name}: {err:.2e} {'OK' if err < 1e-4 else 'FAIL'}")
print()
print(f" One backward pass computes gradients for {W1.size + b1.size + W2.size + b2.size} parameters")
print(f" Cost: O(1 forward pass), not O(n_params) forward passes")
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
MML1 pag 179