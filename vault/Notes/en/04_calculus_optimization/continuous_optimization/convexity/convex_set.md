---
title: Convex Set
date: '2026-04-16'
wordCount: 1002
slug: convex_set
permalink: /notes/04_calculus_optimization/continuous_optimization/convexity/convex_set/index.html
share_status: draft
publish_target: note
boundary: public
---
# $tx + (1-t)y \in \mathcal{C} \quad \forall\, x,y \in \mathcal{C},\; t \in [0,1]$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A set $\mathcal{C}$ is convex if for any two points $x$ and $y$ inside $\mathcal{C}$, the entire line segment between them also lies inside $\mathcal{C}$. The formula $tx + (1-t)y$ parameterizes points on that segment as $t$ slides from 0 (point $y$) to 1 (point $x$). In DA/DS: the feasible region of a constrained optimization problem (e.g., the set of valid parameter values satisfying linear constraints) must be convex for standard convex optimization theory to apply. Feature spaces defined by Euclidean balls ($\|x\| \le r$), probability simplices ($\sum p_i = 1, p_i \ge 0$), and positive semi-definite cones are all convex sets that appear regularly in ML theory and algorithms.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Pick any two points x, y in C"] A --> B["Form the segment: z(t) = tx + (1-t)y for t in [0,1]"] B --> C{"Is z(t) in C for ALL t in [0,1]?"} C -->|"YES for all x, y in C"| D["C is a CONVEX SET"] C -->|"NO for some pair"| E["C is NOT convex"] D --> F["Supports convex optimization theory"] D --> G["Projection onto C has unique solution"] D --> H["Intersection of convex sets is convex"]
```
### Real-World use:
#### Situation it is used
Defining feasible regions in constrained optimization (budget constraints, probability constraints), proving that gradient descent stays within a parameter space (e.g., probability simplex for softmax outputs), projecting estimates back into valid regions (projection onto the $L_2$ ball for ridge-constrained regression), and justifying that intersecting multiple constraints still yields a solvable problem.
#### Problem it solves
Many optimization problems have constraints: model parameters must be non-negative, probabilities must sum to 1, covariance matrices must be positive semi-definite. Convexity of the feasible set guarantees that (1) projected gradient descent produces valid iterates, (2) the feasible region has no "holes" or disconnections, and (3) combining multiple convex constraints (by intersection) preserves convexity.
#### How it solves the problem
The definition checks that any convex combination $tx + (1-t)y$ of two feasible points is still feasible. Convex sets are closed under mixing, which makes projection and constraint enforcement tractable. The simplex, the $L_p$ ball, and the PSD cone are all canonical convex sets used extensively in ML.
#### Example of it used in the Working Context as DA/DS for a Business
A DS builds a portfolio optimizer subject to constraints: weights $w_i \ge 0$ (no short-selling) and $\sum_i w_i = 1$ (fully invested). The feasible set is the probability simplex $\Delta^n = \{w \in \mathbb{R}^n : w_i \ge 0, \sum w_i = 1\}$. This is a convex set (intersection of half-spaces and a hyperplane). Any convex combination of two valid portfolios is also a valid portfolio. The optimizer can use projected gradient descent with a guaranteed-valid projection at each step.
### The Formula (Fragment-First)
- $\mathcal{C}$: the set being tested (e.g., $L_2$ ball, probability simplex, positive orthant)
- $x, y$: any two points in $\mathcal{C}$ (arbitrary feasible points)
- $t \in [0, 1]$: mixing coefficient
- $tx + (1-t)y$: convex combination; parameterizes the line segment from $y$ (at $t=0$) to $x$ (at $t=1$)
- $\in \mathcal{C}$: the blend must remain inside the set — the "no holes" condition
- $\forall x, y \in \mathcal{C}, \forall t \in [0,1]$: must hold for every pair of points and every $t$
- Special cases: $t=0$ gives $y$; $t=1$ gives $x$; $t=0.5$ gives the midpoint $\frac{x+y}{2}$ ### Formula-to-English Translation
"A set is convex if, whenever you pick any two points inside it, the entire straight-line path between them also lies inside it. There are no 'dents' or 'holes.'" Tiny example: Is the $L_2$ ball $\{x \in \mathbb{R}^2 : \|x\|_2 \le 1\}$ convex?
Take $x = (1, 0)$ and $y = (0, 1)$, both with $\|.\| = 1 \le 1$.
Blend: $z = 0.5 x + 0.5 y = (0.5, 0.5)$.
$\|z\|_2 = \sqrt{0.25 + 0.25} = 1/\sqrt{2} \approx 0.707 \le 1$. $\checkmark$
By triangle inequality: $\|tx + (1-t)y\|_2 \le t\|x\|_2 + (1-t)\|y\|_2 \le t + (1-t) = 1$ for all $t$. $\checkmark$ Non-convex example: annulus $\{x : 1 \le \|x\|_2 \le 2\}$. Take $(1,0)$ and $(-1,0)$; midpoint is $(0,0)$; $\|(0,0)\|_2 = 0 < 1$, not in the annulus. Not convex.
### Critical Concepts
- **Convex hull:** the smallest convex set containing a given set of points; $\text{conv}(S) = \{tx + (1-t)y : x,y \in S, t \in [0,1]\}$ for two points, extended to arbitrary combinations for many points.
- **Important convex sets in ML:** - Probability simplex: $\Delta^n = \{p : p_i \ge 0, \sum p_i = 1\}$ (softmax outputs, mixture weights) - $L_p$ balls: $\{x : \|x\|_p \le r\}$ for $p \ge 1$ (constraint sets for regularization) - Positive semi-definite cone: $\{A : A \succeq 0\}$ (covariance matrices, kernel matrices) - Non-negative orthant: $\{x : x_i \ge 0\}$ (NMF, portfolio weights)
- **Intersection preserves convexity:** if $\mathcal{C}_1$ and $\mathcal{C}_2$ are convex, so is $\mathcal{C}_1 \cap \mathcal{C}_2$. This means adding multiple convex constraints keeps the feasible set convex.
- **Union does NOT preserve convexity:** the union of two convex sets is generally not convex.
- **Projection theorem:** for a non-empty closed convex set $\mathcal{C}$ and any point $z$, there is a unique closest point $\text{proj}_\mathcal{C}(z) = \arg\min_{x \in \mathcal{C}} \|x - z\|_2$. This is used in projected gradient descent.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Test: Is the probability simplex $\Delta^2 = \{(w_1, w_2) : w_1 \ge 0, w_2 \ge 0, w_1 + w_2 = 1\}$ convex?* *Step 1: Take two valid points*
$x = (0.3, 0.7)$: $0.3 + 0.7 = 1$, both $\ge 0$. $\checkmark$
$y = (0.8, 0.2)$: $0.8 + 0.2 = 1$, both $\ge 0$. $\checkmark$ *Step 2: Form the blend at $t = 0.4$*
$z = 0.4 \cdot (0.3, 0.7) + 0.6 \cdot (0.8, 0.2)$
$= (0.12, 0.28) + (0.48, 0.12) = (0.60, 0.40)$. *Step 3: Verify $z$ is valid*
$0.60 + 0.40 = 1.00$. $\checkmark$
$0.60 \ge 0$ and $0.40 \ge 0$. $\checkmark$ *Step 4: Prove it holds in general*
For any $x, y \in \Delta^2$ and $t \in [0,1]$:
- Sum: $t(w_1^x + w_2^x) + (1-t)(w_1^y + w_2^y) = t \cdot 1 + (1-t) \cdot 1 = 1$. $\checkmark$
- Non-negativity: $tw_1^x + (1-t)w_1^y \ge 0$ since both terms are $\ge 0$. $\checkmark$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def is_in_simplex(w: np.ndarray, tol: float = 1e-8) -> bool: """Check if w is in the probability simplex.""" return bool(np.all(w >= -tol) and abs(w.sum() - 1.0) < tol) def test_simplex_convexity( x: np.ndarray, y: np.ndarray, n_points: int = 20
) -> bool: """Test convexity of simplex by checking blended points.""" for t in np.linspace(0, 1, n_points): blend = t * x + (1 - t) * y if not is_in_simplex(blend): return False return True # Two valid probability distributions over 4 categories
x_weights = np.array([0.1, 0.3, 0.5, 0.1])
y_weights = np.array([0.4, 0.2, 0.1, 0.3]) print(f"x in simplex: {is_in_simplex(x_weights)}")
print(f"y in simplex: {is_in_simplex(y_weights)}")
print(f"Simplex is convex (path stays inside): {test_simplex_convexity(x_weights, y_weights)}") # Demonstrate projection onto simplex (Euclidean projection)
def project_simplex(v: np.ndarray) -> np.ndarray: """Project onto probability simplex using sorting algorithm.""" n = len(v) u = np.sort(v)[::-1] cssv = np.cumsum(u) rho = np.nonzero(u * np.arange(1, n + 1) > (cssv - 1))[0][-1] theta = (cssv[rho] - 1) / (rho + 1.0) return np.maximum(v - theta, 0) outside_point = np.array([0.6, 0.6, 0.3, -0.2])
projected = project_simplex(outside_point)
print(f"\nOutside point: {outside_point}")
print(f"Projected onto simplex: {projected.round(4)}")
print(f"Sum of projected: {projected.sum():.4f}")
```
#### Beginner friendly Example [R])
``` r
# Convex set: probability simplex
is_in_simplex <- function(w, tol = 1e-8) { all(w >= -tol) && abs(sum(w) - 1.0) < tol
} test_simplex_convexity <- function(x, y, n_points = 20) { t_vals <- seq(0, 1, length.out = n_points) all(sapply(t_vals, function(t) is_in_simplex(t * x + (1 - t) * y)))
} # Two valid distributions over 3 classes
x_w <- c(0.2, 0.5, 0.3)
y_w <- c(0.7, 0.1, 0.2) cat(sprintf("x in simplex: %s\n", is_in_simplex(x_w)))
cat(sprintf("y in simplex: %s\n", is_in_simplex(y_w)))
cat(sprintf("Path stays inside simplex: %s\n", test_simplex_convexity(x_w, y_w))) # Check L2 ball convexity
is_in_l2_ball <- function(x, radius = 1.0) sqrt(sum(x^2)) <= radius + 1e-9
test_l2_ball <- function(x, y, r = 1.0, n = 30) { all(sapply(seq(0, 1, length.out = n), function(t) is_in_l2_ball(t*x+(1-t)*y, r)))
} x_ball <- c(0.6, 0.8) # norm = 1.0
y_ball <- c(-0.8, -0.6) # norm = 1.0
cat(sprintf("L2 ball path stays inside: %s\n", test_l2_ball(x_ball, y_ball)))
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.linear_model import LogisticRegression np.random.seed(42) # -- Projected gradient descent on probability simplex for portfolio weights ---
# Business case: multi-asset portfolio optimization with no-short-selling constraint
# Minimize negative Sharpe ratio subject to w in simplex N_ASSETS = 5
N_PERIODS = 252 # trading days # Simulated daily returns (N_ASSETS assets)
true_means = np.array([0.001, 0.0015, 0.0008, 0.0012, 0.0009])
true_cov = np.diag([0.01, 0.015, 0.008, 0.012, 0.009]) ** 2
returns = np.random.multivariate_normal(true_means, true_cov, N_PERIODS) mean_ret = returns.mean(axis=0)
cov_ret = np.cov(returns.T) def portfolio_sharpe(weights: np.ndarray) -> float: """Annualized Sharpe ratio (risk-free rate = 0 for simplicity).""" port_return = mean_ret @ weights * 252 port_vol = np.sqrt(weights @ cov_ret @ weights * 252) return port_return / (port_vol + 1e-12) def project_simplex(v: np.ndarray) -> np.ndarray: """Euclidean projection onto probability simplex.""" n = len(v) u = np.sort(v)[::-1] cssv = np.cumsum(u) rho = np.nonzero(u * np.arange(1, n + 1) > (cssv - 1))[0][-1] theta = (cssv[rho] - 1) / (rho + 1.0) return np.maximum(v - theta, 0) # Projected gradient ascent (maximize Sharpe)
LEARNING_RATE = 0.5
N_ITERATIONS = 500
EPSILON_GRAD = 1e-5 weights = project_simplex(np.ones(N_ASSETS)) # start at equal weight
sharpe_history = [] for iteration in range(N_ITERATIONS): # Numerical gradient of Sharpe w.r.t. weights grad = np.zeros(N_ASSETS) for asset_idx in range(N_ASSETS): delta = np.zeros(N_ASSETS) delta[asset_idx] = EPSILON_GRAD grad[asset_idx] = (portfolio_sharpe(weights + delta) - portfolio_sharpe(weights - delta)) / (2 * EPSILON_GRAD) # Gradient step + project back onto simplex (convex feasible set) weights_new = project_simplex(weights + LEARNING_RATE * grad) weights = weights_new sharpe_history.append(portfolio_sharpe(weights)) print("Portfolio Optimization via Projected Gradient Ascent")
print(f"Assets: {N_ASSETS}, Trading days: {N_PERIODS}")
print(f"\nFinal portfolio weights (sum to 1, all >= 0):")
for i, w in enumerate(weights): print(f" Asset {i+1}: {w:.4f}")
print(f"\nFinal Sharpe ratio: {portfolio_sharpe(weights):.4f}")
print(f"Equal-weight Sharpe: " f"{portfolio_sharpe(np.ones(N_ASSETS)/N_ASSETS):.4f}")
print(f"\nAll weights >= 0: {np.all(weights >= -1e-8)}")
print(f"Weights sum to 1: {abs(weights.sum() - 1.0) < 1e-6}")
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
MML2 pag 193