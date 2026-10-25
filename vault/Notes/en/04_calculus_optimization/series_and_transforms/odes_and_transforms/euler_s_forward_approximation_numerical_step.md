---
publish: true
date: '2026-04-16'
tags:
- calculus
---

# Euler's Forward Approximation (Numerical step)

$$
y_{n+1} = y_n + h \cdot f(x_n, y_n)
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
Euler's Forward Method is the simplest numerical algorithm for solving ordinary differential equations (ODEs) of the form $dy/dx = f(x, y)$. When you can't find an analytical solution, you step forward in small increments of size h, using the current derivative to estimate the next state. In DA/DS: simulating dynamical systems (SIR epidemiology models, user churn dynamics, population models), numerical simulation of neural ODEs, and any time-stepped simulation of business metrics that evolve continuously.

## Flowchart

```mermaid
flowchart TD
    A["ODE: dy/dx = f(x, y), initial condition y(x_0) = y_0"] --> B["Choose step size h"]
    B --> C["Set n = 0, current state (x_0, y_0)"]
    C --> D["Evaluate slope: k = f(x_n, y_n)"]
    D --> E["Step forward: y_(n+1) = y_n + h * k"]
    E --> F["Update: x_(n+1) = x_n + h"]
    F --> G{"n+1 < total steps?"} G -- "Yes" --> D G -- "No" --> H["Output trajectory: x_0, x_1, ..., y_0, y_1, ..."]
```

## Real-world use

### Where it is used

Any ODE that lacks a closed-form solution, or where the governing equations are given implicitly (as a function call rather than a formula). Common in: epidemic modeling, predator-prey dynamics, option pricing (Black-Scholes PDE via finite differences), neural ODE implementations, and physics-based simulations.

### Problem it solves

Analytical ODE solutions are only available for simple cases (linear, separable, exact). Real models are nonlinear. Euler's method turns the continuous differential equation into a discrete iterative update you can compute on a computer.

### How it solves the problem

Approximates the solution curve by a piecewise linear path. At each step, use the tangent line at $(x_n, y_n)$ to predict where you'll be after a horizontal step of size h. This is a first-order Taylor approximation: $y(x_n + h) \approx y(x_n) + h \cdot y'(x_n)$. **Error**: Local truncation error is $O(h^2)$ per step; global error over a fixed interval is $O(h)$. Smaller h = more accurate but more steps. Use Runge-Kutta (RK4) for better accuracy at similar cost.

### Example in a business

**Churn dynamics model**: Monthly churn rate changes with engagement: $d\text{Retention}/dt = -c \cdot \text{Retention}$ where c is a churn rate that itself depends on marketing spend. No closed form when c is time-varying. Euler steps: Retention_{n+1} = Retention_n - h · c(t_n) · Retention_n. Used to simulate "what if we increase marketing spend by 10% in month 3?"

## The formula, piece by piece

$y_{n+1} = y_n + h \cdot f(x_n, y_n)$ - **$y_n$** — Current approximation of the solution at $x_n$.
- **$y_{n+1}$** — Next approximation at $x_{n+1} = x_n + h$.
- **$h$** — Step size (small positive number). Controls accuracy vs. speed tradeoff.
- **$f(x_n, y_n)$** — The right-hand side of the ODE: $dy/dx = f(x, y)$. This is the slope at the current point.
- **$h \cdot f(x_n, y_n)$** — The predicted change in y over one step: slope × horizontal distance.
- **Initial condition**: You must know $y(x_0) = y_0$ to start the iteration.

## The formula in words

"The next value equals the current value plus the step size times the current rate of change." Analogy: if you're driving at 60 km/h and want to estimate where you'll be in 0.1 hours, you add 60 × 0.1 = 6 km to your current position. Euler's method does exactly this for any ODE, one small step at a time.

## Critical Concepts

1. **Stability depends on h**: For stiff ODEs, large h causes the numerical solution to diverge even when the true solution is stable. Need h < 2/|λ| where λ is the dominant eigenvalue.
2. **First-order accuracy**: Global error = O(h). Halving h halves the error. Compare to RK4 with O(h⁴) — much faster convergence.
3. **Forward vs. Backward Euler**: Forward (explicit) uses current slope; Backward (implicit) uses next slope and requires solving a nonlinear equation each step. Backward is more stable for stiff problems.
4. **Systems of ODEs**: The formula extends directly: $\mathbf{y}_{n+1} = \mathbf{y}_n + h \cdot \mathbf{f}(x_n, \mathbf{y}_n)$ where y and f are vectors. This covers any n-dimensional dynamical system.
5. **Practical use**: For real problems, always prefer scipy.integrate.solve_ivp (RK45 or RK23).

Euler is useful to understand the concept and for teaching purposes, not production.

## Step-by-step calculation (tiny example)

ODE: $dy/dx = y$, with $y(0) = 1$ (exact solution: $y = e^x$)
Step size: h = 0.5, from x = 0 to x = 1.5

*Step 1: Set up*
x_0 = 0, y_0 = 1, h = 0.5

*Step 2: Step 1 (n=0)*
f(x_0, y_0) = f(0, 1) = 1
y_1 = 1 + 0.5 × 1 = **1.5** (exact: e^{0.5} ≈ 1.6487, error = 0.1487)

*Step 3: Step 2 (n=1)*
f(x_1, y_1) = f(0.5, 1.5) = 1.5
y_2 = 1.5 + 0.5 × 1.5 = **2.25** (exact: e^{1.0} ≈ 2.7183, error = 0.4683)

*Step 4: Step 3 (n=2)*
f(x_2, y_2) = f(1.0, 2.25) = 2.25
y_3 = 2.25 + 0.5 × 2.25 = **3.375** (exact: e^{1.5} ≈ 4.4817, error = 1.107) Errors grow — this is the accumulated global error O(h). With h=0.05, errors would be ~10× smaller.

## Code examples

### Beginner example (Python)

```python
"""
Euler's Forward Method: y_(n+1) = y_n + h * f(x_n, y_n)

Applied to solving dy/dx = y (exact solution: y = e^x).
Demonstrates the accuracy vs. step size tradeoff.
"""
import numpy as np
import math
from typing import Callable


def euler_forward(
    ode_func: Callable[[float, float], float],
    x_start: float,
    x_end: float,
    y_initial: float,
    step_size: float,
) -> tuple[np.ndarray, np.ndarray]:
    """Solve ODE dy/dx = ode_func(x, y) using Euler's forward method.

    Parameters
    ----------
    ode_func : right-hand side f(x, y) of the ODE
    x_start : initial x value
    x_end : final x value
    y_initial : initial condition y(x_start) = y_initial
    step_size : step size h (smaller = more accurate)

    Returns
    -------
    tuple of (x_values, y_values) arrays
    """
    num_steps = int(round((x_end - x_start) / step_size)) + 1
    x_values = np.linspace(x_start, x_end, num_steps)
    y_values = np.empty(num_steps)
    y_values[0] = y_initial
    for step_idx in range(1, num_steps):
        x_current = x_values[step_idx - 1]
        y_current = y_values[step_idx - 1]
        slope = ode_func(x_current, y_current)
        y_values[step_idx] = y_current + step_size * slope
    return x_values, y_values


# ODE: dy/dx = y, exact solution y = e^x
ode_dy_dx = lambda x_val, y_val: y_val
step_sizes = [0.5, 0.1, 0.01]
x_eval = 1.0
exact_value = math.exp(x_eval)
print("Step size | Euler approx at x=1 | Error")
print("-" * 45)
for h in step_sizes:
    x_arr, y_arr = euler_forward(ode_dy_dx, 0.0, x_eval, 1.0, h)
    euler_approx = y_arr[-1]
    error = abs(euler_approx - exact_value)
    print(f" h={h:<6} | {euler_approx:.8f} | {error:.2e}")
print(f"\nExact e^1 = {exact_value:.8f}")
```

### Beginner example (R)

```r
# Euler's Forward Method: y_(n+1) = y_n + h * f(x_n, y_n)
# Applied to logistic growth: dy/dt = r * y * (1 - y/K)
euler_forward <- function(ode_func, t_start, t_end, y_initial, step_size) {
  # Numerically solve dy/dt = ode_func(t, y) using Euler's method
  # Returns data.frame with t and y columns
  t_values <- seq(t_start, t_end, by = step_size)
  y_values <- numeric(length(t_values))
  y_values[1] <- y_initial
  for (i in seq(2, length(t_values))) {
    t_curr <- t_values[i - 1]
    y_curr <- y_values[i - 1]
    y_values[i] <- y_curr + step_size * ode_func(t_curr, y_curr)
  }
  data.frame(t = t_values, y = y_values)
}

# Logistic growth: population saturates at carrying capacity K
GROWTH_RATE <- 0.5
CARRYING_CAPACITY <- 100
logistic_rhs <- function(t, y) GROWTH_RATE * y * (1 - y / CARRYING_CAPACITY)
solution <- euler_forward(logistic_rhs, t_start = 0, t_end = 20, y_initial = 5, step_size = 0.1)
cat(sprintf("t=0 : y = %.2f (initial)\n", solution$y[1]))
cat(sprintf("t=5 : y = %.2f\n", solution$y[solution$t == 5.0]))
cat(sprintf("t=10 : y = %.2f\n", solution$y[abs(solution$t - 10) < 0.01][1]))
cat(sprintf("t=20 : y = %.2f (approaches K=%d)\n", tail(solution$y, 1), CARRYING_CAPACITY))
```

### Professional example (Python)

```python
"""
Euler's Forward Method for SIR epidemic simulation.

Business context: A healthcare analytics team models the spread of a seasonal
illness through a workforce of N employees to estimate peak sick days, optimal
intervention timing, and impact of vaccination campaigns.
"""
import numpy as np
import pandas as pd

POPULATION_SIZE: int = 5_000
INITIAL_INFECTED: int = 10
BETA_TRANSMISSION: float = 0.0003  # transmission rate per contact
GAMMA_RECOVERY: float = 0.05       # recovery rate (1/gamma = avg days infected)
TIME_END_DAYS: float = 200.0
STEP_SIZE_DAYS: float = 0.1


def sir_model(
    state: np.ndarray, beta: float, gamma: float, population: int,
) -> np.ndarray:
    """Right-hand side of SIR ODE system.

    Parameters
    ----------
    state : [S, I, R] current compartment sizes
    beta : transmission rate
    gamma : recovery rate
    population : total population (constant)

    Returns
    -------
    np.ndarray : [dS/dt, dI/dt, dR/dt]
    """
    susceptible, infected, recovered = state
    d_susceptible = -beta * susceptible * infected
    d_infected = beta * susceptible * infected - gamma * infected
    d_recovered = gamma * infected
    return np.array([d_susceptible, d_infected, d_recovered])


def simulate_sir_euler(
    beta: float,
    gamma: float,
    population: int,
    initial_infected: int,
    time_end: float,
    step_size: float,
) -> pd.DataFrame:
    """Simulate SIR model using Euler's forward method."""
    num_steps = int(time_end / step_size) + 1
    time_values = np.linspace(0.0, time_end, num_steps)
    states = np.empty((num_steps, 3))
    initial_susceptible = population - initial_infected
    states[0] = [initial_susceptible, float(initial_infected), 0.0]
    for step_idx in range(1, num_steps):
        current_state = states[step_idx - 1]
        current_time = time_values[step_idx - 1]
        derivative = sir_model(current_state, beta, gamma, population)
        states[step_idx] = current_state + step_size * derivative
    return pd.DataFrame({
        "day": time_values,
        "susceptible": states[:, 0],
        "infected": states[:, 1],
        "recovered": states[:, 2],
    })


results_df = simulate_sir_euler(
    BETA_TRANSMISSION, GAMMA_RECOVERY, POPULATION_SIZE,
    INITIAL_INFECTED, TIME_END_DAYS, STEP_SIZE_DAYS,
)
peak_day = results_df.loc[results_df["infected"].idxmax(), "day"]
peak_infected = results_df["infected"].max()
total_affected = results_df["recovered"].iloc[-1]
print(f"SIR Model Results (N={POPULATION_SIZE:,}, beta={BETA_TRANSMISSION}, gamma={GAMMA_RECOVERY}):")
print(f" Peak infected : {peak_infected:,.0f} employees (day {peak_day:.0f})")
print(f" Total affected : {total_affected:,.0f} employees ({total_affected/POPULATION_SIZE*100:.1f}%)")
print(f" Herd immunity at: S < N(1 - gamma/beta) = {POPULATION_SIZE*(1-GAMMA_RECOVERY/(BETA_TRANSMISSION*POPULATION_SIZE)):,.0f}")
```

---

*Source: MFB p. 161*
