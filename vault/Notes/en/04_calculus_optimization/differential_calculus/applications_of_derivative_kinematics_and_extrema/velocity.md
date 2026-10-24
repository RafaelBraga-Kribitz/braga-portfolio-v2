---
title: Velocity
date: '2026-04-16'
wordCount: 950
slug: velocity
permalink: /notes/04_calculus_optimization/differential_calculus/applications_of_derivative_kinematics_and_extrema/velocity/index.html
share_status: draft
publish_target: note
boundary: public
---
# $v = \frac{ds}{dt}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Velocity is the derivative of position with respect to time: the instantaneous rate of change of displacement. This is the core kinematic equation connecting position $s(t)$ to velocity $v(t)$ via differentiation. In DS/DA: the language of "velocity" translates directly to rate-of-change analysis of any time series: user growth velocity $v = dMAU/dt$; metric velocity (how fast a KPI is improving); gradient descent update is "velocity" of the weight trajectory — indeed, momentum-based optimizers (SGD with momentum, Adam) use a "velocity" variable that accumulates gradients over time; change-point detection asks when velocity (slope) changes sign; anomaly detection looks for sudden jumps in metric velocity.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["s(t): position as a function of time"] A --> B["Velocity: v(t) = ds/dt = lim_{h->0}[s(t+h)-s(t)]/h"] B --> C["v > 0: moving in positive direction"] B --> D["v < 0: moving in negative direction"] B --> E["v = 0: instantaneously at rest (potential extremum of s)"] B --> F["Average velocity: delta_s / delta_t over interval"] F --> G["Instantaneous velocity: limit as delta_t -> 0"] G --> H["In DA/DS: metric velocity = d(KPI)/dt"] H --> I["Week-over-week change: discrete approximation of ds/dt"] E --> J["v=0 marks turning points: maxima or minima of position"]
```
### Real-World use:
#### Situation it is used
SGD with momentum: $v_t = \beta v_{t-1} + (1-\beta)\nabla L$ — the velocity variable accumulates gradient history; Adam: first moment $m_t$ is an exponentially weighted velocity; revenue growth velocity $d\text{rev}/dt$ for forecasting; user engagement velocity for growth analysis; stock price velocity (rate of return); sensor data velocity for anomaly detection; gradient of the loss as a function of training step is the "velocity" of learning.
#### Problem it solves
Average velocity $\Delta s/\Delta t$ over a time interval tells you the mean speed but not what is happening at a specific moment. Instantaneous velocity via the derivative captures the exact rate of change at time $t$, allowing precise analysis of motion or time-series dynamics at any point.
#### How it solves the problem
Take the derivative of $s(t)$: $v(t) = s'(t) = \lim_{h\to 0}[s(t+h)-s(t)]/h$. This gives the instantaneous velocity at each moment. Sign of $v$: positive = increasing, negative = decreasing. Magnitude: speed of change.
#### Example of it used in the Working Context as DA/DS for a Business
A DS monitors a product's Daily Active Users (DAU) over 90 days. The velocity $v(t) = dDAU/dt$ is computed via finite differences. When $v(t) > 0$: growth. When $v(t) < 0$: decline. The DS identifies the day $t^*$ where $v(t^*)$ changed sign as the inflection point — a key event (feature launch or outage). A smoothed velocity is computed via exponential moving average, which is precisely the momentum update in gradient descent.
### The Formula (Fragment-First)
- $s$: position (displacement) as a function of time — in DA/DS: any time-indexed metric
- $t$: time (the independent variable)
- $ds$: infinitesimal change in position
- $dt$: infinitesimal change in time
- $v = ds/dt$: the ratio of infinitesimal changes — instantaneous rate of change
- Units: position units per time unit (meters/second, or for KPIs: users/day, dollars/month, etc.)
- Finite difference approximation: $v(t) \approx [s(t+h) - s(t)]/h$ (forward) or $[s(t+h)-s(t-h)]/(2h)$ (central, more accurate)
- Signed: $v > 0$ means $s$ is increasing; $v < 0$ means $s$ is decreasing; $v = 0$ means $s$ has a local extremum or inflection point ### Formula-to-English Translation
"Velocity is the instantaneous rate at which position changes with time. Differentiate position to get velocity: for every small increment in time, velocity tells you how far the position moves per unit time at that instant." Tiny trace: $s(t) = t^2$. $v(t) = 2t$. At $t=3$: $v = 6$ (position increasing at rate 6 units per time unit). At $t=0$: $v=0$ (momentarily at rest). $\checkmark$ ### Critical Concepts
- **Velocity vs. speed:** velocity is a signed quantity (direction matters); speed is $|v|$. A decelerating object has positive speed but the sign of $v$ may change. In ML: gradient $\nabla L$ is the "velocity" of the loss — its sign determines which direction parameters should move.
- **Momentum in gradient descent:** $v_t = \beta v_{t-1} - \alpha\nabla L(w_t)$; $w_{t+1} = w_t + v_t$. The velocity $v_t$ accumulates past gradients (weighted by $\beta$), which smooths noisy gradients and accelerates learning in consistent directions — exactly analogous to physical momentum. The "velocity" metaphor is exact: $w$ is position, $v$ is velocity, $-\alpha\nabla L$ is force.
- **Zero velocity and extrema:** $v(t^*) = 0$ is a necessary condition for $s(t)$ to have a local maximum or minimum at $t^*$. In DS: the day a growth metric peaks is where its velocity crosses zero (from positive to negative). Identifying when a KPI's velocity hits zero is equivalent to finding critical points (covered in Critical Points.md).
- **Discrete velocity in time series:** the finite difference $\Delta s / \Delta t = [s(t+1) - s(t)]/1$ (for unit time steps) is the first difference of the series. First differencing removes linear trends and converts a non-stationary time series to a stationary one (for ARIMA models). This is the discrete-time analog of velocity.
- **Velocity and gradient descent convergence:** the "velocity" of the loss $L(w_t)$ is $dL/dt = \nabla L \cdot dw/dt = \nabla L \cdot v_t$. For gradient descent: $v_t = -\alpha\nabla L$, so $dL/dt = -\alpha\|\nabla L\|^2 \le 0$ — the loss always decreases. This is the continuous-time interpretation of why gradient descent converges (the loss velocity is non-positive).
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Given $s(t) = 3t^3 - 12t + 1$, find the velocity at $t=2$ and determine when the object is at rest.* *Step 1: Differentiate.*
$v(t) = ds/dt = 9t^2 - 12$. *Step 2: Velocity at $t=2$.*
$v(2) = 9(4) - 12 = 36 - 12 = 24$. Moving in positive direction at speed 24. *Step 3: When is $v = 0$?*
$9t^2 - 12 = 0 \Rightarrow t^2 = 4/3 \Rightarrow t = 2/\sqrt{3} \approx 1.155$.
At $t \approx 1.155$: position $s$ has a local extremum (minimum here since $v$ goes from negative to positive).
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
import numpy as np def compute_velocity(s_fn, t: float, h: float = 1e-7) -> float: """Instantaneous velocity via central finite difference: ds/dt ≈ [s(t+h)-s(t-h)]/(2h).""" return (s_fn(t + h) - s_fn(t - h)) / (2 * h) # Position function examples
examples = [ {"name": "s = 3t^3 - 12t + 1", "s_fn": lambda t: 3*t**3 - 12*t + 1, "analytic": lambda t: 9*t**2 - 12}, {"name": "s = sin(2t) + t", "s_fn": lambda t: np.sin(2*t) + t, "analytic": lambda t: 2*np.cos(2*t) + 1}, {"name": "s = exp(-0.5t)*cos(t)", "s_fn": lambda t: np.exp(-0.5*t)*np.cos(t), "analytic": lambda t: np.exp(-0.5*t)*(-0.5*np.cos(t) - np.sin(t))},
] print("Velocity: v(t) = ds/dt")
print(f"\n{'Function':>28} {'t':>5} {'Analytic v':>12} {'Numerical v':>12} {'Match':>7}")
for ex in examples: for t_val in [0.5, 1.5, 3.0]: v_analytic = ex["analytic"](t_val) v_numerical = compute_velocity(ex["s_fn"], t_val) match = abs(v_analytic - v_numerical) < 1e-5 print(f"{ex['name']:>28} {t_val:>5.2f} {v_analytic:>12.6f} {v_numerical:>12.6f} {str(match):>7}") # Discrete velocity for a time series
print(f"\n--- Discrete velocity: first difference of a DAU time series ---")
np.random.seed(42)
n_days = 20
dau = 10000 + np.cumsum(np.random.randn(n_days) * 100 + 50) # growing + noise
velocity = np.diff(dau) # first difference = discrete velocity
print(f"{'Day':>5} {'DAU':>9} {'Velocity (dDAU/dt)':>20} {'Direction':>12}")
for i in range(min(10, n_days - 1)): direction = "growing" if velocity[i] > 0 else "declining" print(f"{i+1:>5} {dau[i]:>9.1f} {velocity[i]:>20.2f} {direction:>12}")
```
#### Beginner friendly Example [R])
``` r
# Velocity: v(t) = ds/dt
compute_velocity <- function(s_fn, t, h = 1e-7) { (s_fn(t + h) - s_fn(t - h)) / (2 * h)
} examples <- list( list(name = "s = 3t^3-12t+1", s_fn = function(t) 3*t^3 - 12*t + 1, analytic = function(t) 9*t^2 - 12), list(name = "s = sin(2t)+t", s_fn = function(t) sin(2*t) + t, analytic = function(t) 2*cos(2*t) + 1)
) cat("Velocity: v(t) = ds/dt\n\n")
cat(sprintf("%-28s %-5s %-12s %-12s\n", "Function", "t", "Analytic v", "Numerical v"))
for (ex in examples) { for (t_val in c(0.5, 1.5, 3.0)) { v_an <- ex$analytic(t_val) v_nu <- compute_velocity(ex$s_fn, t_val) cat(sprintf("%-28s %-5.2f %-12.6f %-12.6f\n", ex$name, t_val, v_an, v_nu)) }
} # Discrete velocity (first difference)
cat("\n--- Discrete velocity: diff() as ds/dt ---\n")
set.seed(42)
dau <- 10000 + cumsum(rnorm(15, mean=50, sd=100))
vel <- diff(dau)
cat(sprintf("%-5s %-9s %-20s\n", "Day", "DAU", "Velocity"))
for (i in 1:min(8, length(vel))) { cat(sprintf("%-5d %-9.1f %-20.2f\n", i, dau[i], vel[i]))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_regression np.random.seed(42) # -- Velocity: gradient descent with momentum -- the literal velocity interpretation --
# Use case: A DS implements SGD with momentum and tracks the weight "velocity"
# over training. In this framework:
# w(t) = position (model weights at training step t)
# v(t) = dw/dt = velocity (accumulated gradient signal)
# a(t) = dv/dt = acceleration (change in velocity = gradient update)
#
# Momentum update: v_{t+1} = beta * v_t - alpha * gradient
# w_{t+1} = w_t + v_t
# This is physically: position = integral of velocity, velocity = integral of force. N = 150
DIM = 5
ALPHA = 0.01 # learning rate
BETA = 0.9 # momentum coefficient
N_STEPS = 300 def mse_and_grad(w: np.ndarray, X: np.ndarray, y: np.ndarray) -> tuple: """MSE loss and gradient.""" r = y - X @ w loss = float(np.mean(r**2)) grad = -2.0 / len(y) * X.T @ r return loss, grad X_raw, y = make_regression(n_samples=N, n_features=DIM, noise=0.5, random_state=42)
scaler = StandardScaler()
X = scaler.fit_transform(X_raw)
y = y / y.std() # SGD with momentum: tracks position w, velocity v, and speed |v|
w_momentum = np.zeros(DIM)
v = np.zeros(DIM)
w_vanilla = np.zeros(DIM) losses_mom = []
losses_van = []
speeds = [] # |v(t)|: speed of weight trajectory for step in range(N_STEPS): # Momentum update loss_m, grad_m = mse_and_grad(w_momentum, X, y) v = BETA * v - ALPHA * grad_m # velocity update: momentum decays + gradient drives w_momentum = w_momentum + v # position update: integrate velocity losses_mom.append(loss_m) speeds.append(float(np.linalg.norm(v))) # Vanilla SGD (no momentum) loss_v, grad_v = mse_and_grad(w_vanilla, X, y) w_vanilla = w_vanilla - ALPHA * grad_v losses_van.append(loss_v) print("Velocity = ds/dt: SGD with Momentum as Physical Kinematics")
print(f"\nN={N}, DIM={DIM}, alpha={ALPHA}, beta={BETA}, steps={N_STEPS}")
print(f"\nPhysical interpretation:")
print(f" w(t) = position (weights)")
print(f" v(t) = dw/dt = velocity (accumulated gradient)")
print(f" v_{{t+1}} = beta*v_t - alpha*grad (friction + force)")
print(f"\n{'Step':>6} {'Loss (mom)':>12} {'Loss (SGD)':>12} {'Speed |v(t)|':>14}")
for step in [0, 10, 30, 50, 100, 200, 299]: print(f"{step+1:>6} {losses_mom[step]:>12.5f} {losses_van[step]:>12.5f} {speeds[step]:>14.6f}") print(f"\nFinal comparison:")
print(f" Momentum final loss: {losses_mom[-1]:.5f}")
print(f" Vanilla SGD final loss: {losses_van[-1]:.5f}")
print(f"\nVelocity (speed) trajectory: starts high (large gradient), decays as loss converges.")
print(f"Max speed: {max(speeds):.6f} at step {speeds.index(max(speeds))+1}")
print(f"Final speed |v|: {speeds[-1]:.8f} (approaching 0 means convergence)")
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
1300 pag 225