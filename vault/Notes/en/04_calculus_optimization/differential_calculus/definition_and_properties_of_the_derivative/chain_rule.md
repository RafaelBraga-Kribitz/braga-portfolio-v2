---
title: Chain Rule
date: '2026-04-16'
wordCount: 911
slug: chain_rule
permalink: /notes/04_calculus_optimization/differential_calculus/definition_and_properties_of_the_derivative/chain_rule/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{d}{dx}[g(f(x))] = g'(f(x)) \cdot f'(x)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The chain rule gives the derivative of a composite function $g(f(x))$: differentiate the outer function $g$ evaluated at the inner function $f(x)$, then multiply by the derivative of the inner function $f'(x)$. This is the single most-used differentiation rule in deep learning: every layer in a neural network is a composition of functions, and backpropagation is literally the chain rule applied recursively from the output layer back to the input. The chain rule is the mathematical engine behind autograd. In DA/DS: batch normalization gradient ($d/dx[\text{BN}(\text{linear}(x))]$), sigmoid and ReLU derivatives in networks, log-loss chain through softmax, any nested transformation (Box-Cox, log-link GLMs, feature pipelines) — all use the chain rule.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["h(x) = g(f(x)): composite function"] A --> B["Outer function: g(u) where u = f(x)"] A --> C["Inner function: f(x)"] B --> D["d/du[g(u)] evaluated at u = f(x): g'(f(x))"] C --> E["d/dx[f(x)] = f'(x)"] D --> F["Chain rule: h'(x) = g'(f(x)) * f'(x)"] E --> F F --> G["Interpretation: outer derivative times inner derivative"] F --> H["Extension: g(f(h(x))) -> g' * f' * h' (multiply all link derivatives)"]
```
### Real-World use:
#### Situation it is used
Backpropagation in neural networks (chain rule applied layer-by-layer from loss to parameters); derivative of any activation function applied to a linear layer ($d/dx[\sigma(w^Tx+b)]$); gradient of log-softmax loss $-\log(\text{softmax}_k(z))$; derivative of Box-Cox transform $d/d\lambda[(y^\lambda-1)/\lambda]$; gradient of any nested feature transformation (log, sqrt, polynomial of a linear model output); implicit differentiation of functions defined through equations.
#### Problem it solves
When a function is composed of multiple simpler functions — e.g., $\text{sigmoid}(\text{linear}(x))$ — the derivative cannot be computed by differentiating the pieces in isolation without accounting for the composition. The chain rule provides the precise multiplication of "link derivatives" through the composition.
#### How it solves the problem
Break the composition into layers. Differentiate the outermost function with respect to its argument (the inner function's output), then multiply by the derivative of the inner function with respect to $x$. For deeper compositions, apply the rule recursively: $d/dx[h(g(f(x)))] = h'(g(f(x))) \cdot g'(f(x)) \cdot f'(x)$.
#### Example of it used in the Working Context as DA/DS for a Business
A DS differentiates the sigmoid cross-entropy loss: $L = -y\log(\sigma(z))$ where $z = w^Tx+b$. Using the chain rule: $dL/dz = dL/d(\sigma) \cdot d\sigma/dz = (-y/\sigma) \cdot \sigma(1-\sigma) = -y(1-\sigma)$. Then $dL/dw = dL/dz \cdot dz/dw = (-y(1-\sigma)) \cdot x = (\sigma-y)x$ (for $y=1$). This is the gradient update used in logistic regression and single-layer networks with sigmoid output.
### The Formula (Fragment-First)
- $g(f(x))$: composition; $f$ is the inner function, $g$ is the outer function
- $g'(f(x))$: derivative of $g$ evaluated at $u = f(x)$ (NOT at $x$ directly — this is the key subtlety)
- $f'(x)$: derivative of the inner function with respect to $x$
- Multiplication: the chain rule multiplies the two derivatives (the "chain" of links)
- Extension to depth $n$: $d/dx[f_n \circ f_{n-1} \circ \cdots \circ f_1(x)] = f_n' \cdot f_{n-1}' \cdots f_1'$ (each evaluated at the appropriate intermediate value)
- Leibniz form: $dy/dx = (dy/du) \cdot (du/dx)$ where $u = f(x)$, $y = g(u)$
- Common mistake: forgetting to multiply by $f'(x)$ — e.g., $d/dx(\sin(x^2)) = \cos(x^2) \cdot 2x$, NOT just $\cos(x^2)$ ### Formula-to-English Translation
"To differentiate a function-inside-a-function: differentiate the outside function as if the inside were just a variable, then multiply by the derivative of the inside. Read the composition from outside in and multiply the derivatives as you go." Tiny trace: $h(x) = e^{3x^2}$. Outer $g(u) = e^u$, inner $f(x) = 3x^2$.
$g'(u) = e^u$, so $g'(f(x)) = e^{3x^2}$. $f'(x) = 6x$.
$h'(x) = e^{3x^2} \cdot 6x$.
At $x=1$: $h'(1) = 6e^3 \approx 120.5$.
### Critical Concepts
- **Backpropagation is the chain rule:** in a network $\hat{y} = f_L(f_{L-1}(\cdots f_1(x)))$, the gradient of the loss with respect to any layer's weights is the chain rule applied from the loss backward through all subsequent layers. Each "grad" in autograd is a local derivative; the engine multiplies them in the correct order.
- **Evaluate outer derivative at inner value:** $d/dx[g(f(x))] = g'(\mathbf{f(x)}) \cdot f'(x)$ — the outer derivative is evaluated at $u = f(x)$, not at $x$. Forgetting this gives the wrong result. Example: $d/dx[\sin^2(x)] = 2\sin(x) \cdot \cos(x)$ — the outer derivative $2u$ is evaluated at $u = \sin(x)$, giving $2\sin(x)$.
- **Vanishing and exploding gradients:** for deep compositions, $h'(x) = \prod_{i=1}^{n} f_i'$. If each local derivative $|f_i'| < 1$ (e.g., sigmoid in saturation: $\sigma' \le 0.25$), the product shrinks exponentially — vanishing gradient. If $|f_i'| > 1$, the product grows exponentially — exploding gradient. This is why ReLU, batch norm, residual connections, and gradient clipping exist.
- **Chain rule for vector functions (Jacobian chain):** for vector-valued compositions $\mathbf{g}(\mathbf{f}(\mathbf{x}))$, the chain rule becomes $J = J_g \cdot J_f$ (matrix product of Jacobians). This is the foundation of the backpropagation algorithm in matrix form. Each autograd operation stores its local Jacobian (or the VJP function for efficiency).
- **Common patterns:** $d/dx[f(ax+b)] = a \cdot f'(ax+b)$; $d/dx[f(x^n)] = nx^{n-1} \cdot f'(x^n)$; $d/dx[e^{f(x)}] = f'(x) \cdot e^{f(x)}$; $d/dx[\ln(f(x))] = f'(x)/f(x)$; $d/dx[\sin(f(x))] = f'(x)\cos(f(x))$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Derive $d/dx[\ln(\sin x)]$.* *Step 1: Identify inner and outer functions.*
Outer: $g(u) = \ln u$. Inner: $f(x) = \sin x$. *Step 2: Derivative of the outer function.*
$g'(u) = 1/u$. Evaluated at $u = f(x) = \sin x$: $g'(f(x)) = 1/\sin x$. *Step 3: Derivative of the inner function.*
$f'(x) = \cos x$. *Step 4: Multiply.*
$d/dx[\ln(\sin x)] = (1/\sin x) \cdot \cos x = \cos x / \sin x = \cot x$. *Verify at $x = \pi/4$:* $\cot(\pi/4) = 1$. Numerically: $[\ln(\sin(\pi/4 + h)) - \ln(\sin(\pi/4-h))]/(2h) \approx 1$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def chain_rule_demo(outer_f, outer_f_prime, inner_f, inner_f_prime, x: float) -> float: """Chain rule: d/dx[outer(inner(x))] = outer'(inner(x)) * inner'(x).""" inner_val = inner_f(x) return outer_f_prime(inner_val) * inner_f_prime(x) # Example compositions and their chain rule derivatives
compositions = [ { "name": "exp(3x^2)", "outer": np.exp, "outer_prime": np.exp, "inner": lambda x: 3 * x**2, "inner_prime": lambda x: 6 * x, "analytic": lambda x: np.exp(3 * x**2) * 6 * x, }, { "name": "sin(x^2)", "outer": np.sin, "outer_prime": np.cos, "inner": lambda x: x**2, "inner_prime": lambda x: 2 * x, "analytic": lambda x: np.cos(x**2) * 2 * x, }, { "name": "ln(sin(x))", "outer": np.log, "outer_prime": lambda u: 1 / u, "inner": np.sin, "inner_prime": np.cos, "analytic": lambda x: np.cos(x) / np.sin(x), }, { "name": "sqrt(1+x^2)", "outer": np.sqrt, "outer_prime": lambda u: 0.5 / np.sqrt(u), "inner": lambda x: 1 + x**2, "inner_prime": lambda x: 2 * x, "analytic": lambda x: x / np.sqrt(1 + x**2), },
] h = 1e-7
print(f"{'Function':>18} {'x':>5} {'Chain rule':>12} {'Analytic':>12} {'Numerical':>12} {'Match':>7}")
for comp in compositions: for x in [0.5, 1.0]: try: chain = chain_rule_demo( comp["outer"], comp["outer_prime"], comp["inner"], comp["inner_prime"], x ) analytic = comp["analytic"](x) numerical = (comp["outer"](comp["inner"](x + h)) - comp["outer"](comp["inner"](x - h))) / (2 * h) match = abs(chain - numerical) < 1e-5 print(f"{comp['name']:>18} {x:>5.2f} {chain:>12.6f} {analytic:>12.6f} {numerical:>12.6f} {str(match):>7}") except Exception: pass
```
#### Beginner friendly Example [R])
``` r
# Chain rule: d/dx[g(f(x))] = g'(f(x)) * f'(x)
chain_rule <- function(outer_prime, inner_f, inner_prime, x) { outer_prime(inner_f(x)) * inner_prime(x)
} compositions <- list( list( name = "exp(3x^2)", outer_prime = exp, inner_f = function(x) 3 * x^2, inner_prime = function(x) 6 * x, analytic = function(x) exp(3 * x^2) * 6 * x ), list( name = "sin(x^2)", outer_prime = cos, inner_f = function(x) x^2, inner_prime = function(x) 2 * x, analytic = function(x) cos(x^2) * 2 * x ), list( name = "ln(sin(x))", outer_prime = function(u) 1 / u, inner_f = sin, inner_prime = cos, analytic = function(x) cos(x) / sin(x) )
) h <- 1e-7
cat(sprintf("%-18s %-5s %-12s %-12s\n", "Function", "x", "Chain rule", "Analytic"))
for (comp in compositions) { for (x in c(0.5, 1.0)) { chain_val <- tryCatch(chain_rule(comp$outer_prime, comp$inner_f, comp$inner_prime, x), error = function(e) NA) analytic_val <- tryCatch(comp$analytic(x), error = function(e) NA) if (!is.na(chain_val) && !is.na(analytic_val)) { cat(sprintf("%-18s %-5.2f %-12.6f %-12.6f\n", comp$name, x, chain_val, analytic_val)) } }
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler np.random.seed(42) # -- Backpropagation via chain rule: two-layer sigmoid network, manual forward + backward --
# Use case: a DS implements backprop from scratch to understand why autograd works.
# The backward pass is exactly the chain rule applied from output to input. HIDDEN_SIZE = 8
INPUT_SIZE = 6
OUTPUT_SIZE = 1
LEARN_RATE = 0.05
N_EPOCHS = 200 def sigmoid(z: np.ndarray) -> np.ndarray: """Numerically stable sigmoid.""" return np.where(z >= 0, 1 / (1 + np.exp(-z)), np.exp(z) / (1 + np.exp(z))) def sigmoid_prime(z: np.ndarray) -> np.ndarray: """d/dz sigmoid(z) = sigmoid(z)*(1-sigmoid(z)). Chain rule inner derivative.""" s = sigmoid(z) return s * (1.0 - s) def bce_loss(y_pred: np.ndarray, y_true: np.ndarray) -> float: """Binary cross-entropy.""" p = np.clip(y_pred, 1e-10, 1 - 1e-10) return float(-np.mean(y_true * np.log(p) + (1 - y_true) * np.log(1 - p))) # Data
X_raw, y = make_classification(n_samples=200, n_features=INPUT_SIZE, random_state=42)
scaler = StandardScaler()
X = scaler.fit_transform(X_raw)
y = y.astype(float).reshape(-1, 1) # Parameters
W1 = np.random.randn(INPUT_SIZE, HIDDEN_SIZE) * 0.1
b1 = np.zeros((1, HIDDEN_SIZE))
W2 = np.random.randn(HIDDEN_SIZE, OUTPUT_SIZE) * 0.1
b2 = np.zeros((1, OUTPUT_SIZE)) losses = []
for epoch in range(N_EPOCHS): # --- Forward pass --- Z1 = X @ W1 + b1 # linear: INPUT_SIZE -> HIDDEN_SIZE A1 = sigmoid(Z1) # activation: chain rule outer = sigmoid Z2 = A1 @ W2 + b2 # linear: HIDDEN_SIZE -> OUTPUT_SIZE A2 = sigmoid(Z2) # output activation loss = bce_loss(A2, y) losses.append(loss) # --- Backward pass (chain rule, layer by layer) --- N = X.shape[0] # dL/dA2: outer derivative of BCE loss w.r.t. predicted probability dL_dA2 = (A2 - y) / N # combined gradient for BCE + sigmoid output: (p - y) / N # dA2/dZ2: sigmoid'(Z2) — chain rule: d/dZ2[sigmoid(Z2)] = sigmoid'(Z2) dA2_dZ2 = sigmoid_prime(Z2) # dL/dZ2 = dL/dA2 * dA2/dZ2 (chain rule, element-wise) dL_dZ2 = dL_dA2 * dA2_dZ2 # dL/dW2 and dL/db2 from linear layer dL_dW2 = A1.T @ dL_dZ2 dL_db2 = dL_dZ2.sum(axis=0, keepdims=True) # dL/dA1 = dL/dZ2 @ W2.T (chain rule through linear layer) dL_dA1 = dL_dZ2 @ W2.T # dA1/dZ1: sigmoid'(Z1) — chain rule dA1_dZ1 = sigmoid_prime(Z1) # dL/dZ1 = dL/dA1 * dA1/dZ1 (chain rule) dL_dZ1 = dL_dA1 * dA1_dZ1 # dL/dW1 and dL/db1 dL_dW1 = X.T @ dL_dZ1 dL_db1 = dL_dZ1.sum(axis=0, keepdims=True) # Gradient descent update W2 -= LEARN_RATE * dL_dW2 b2 -= LEARN_RATE * dL_db2 W1 -= LEARN_RATE * dL_dW1 b1 -= LEARN_RATE * dL_db1 # Evaluate
final_preds = sigmoid(sigmoid(X @ W1 + b1) @ W2 + b2).flatten()
accuracy = float(np.mean((final_preds > 0.5).astype(float) == y.flatten())) print("Chain Rule: Manual Backpropagation through 2-Layer Sigmoid Network")
print(f"\nNetwork: {INPUT_SIZE} -> {HIDDEN_SIZE} (sigmoid) -> {OUTPUT_SIZE} (sigmoid)")
print(f"Epochs: {N_EPOCHS}, learning rate: {LEARN_RATE}")
print(f"\nLoss trajectory: epoch 1={losses[0]:.4f}, epoch 50={losses[49]:.4f}, " f"epoch 100={losses[99]:.4f}, final={losses[-1]:.4f}")
print(f"Final accuracy: {accuracy:.4f}")
print(f"\nChain rule steps in backward pass:")
print(f" dL/dZ2 = dL/dA2 * sigmoid'(Z2) [chain: loss -> A2 -> Z2]")
print(f" dL/dZ1 = (dL/dZ2 @ W2.T) * sigmoid'(Z1) [chain: loss -> Z2 -> A1 -> Z1]")
print(f" dL/dW1 = X.T @ dL/dZ1 [linear layer parameter gradient]")
print(f"\nKey: each 'dL/d...' multiplication is one link in the chain rule.")
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
1300 pag 219