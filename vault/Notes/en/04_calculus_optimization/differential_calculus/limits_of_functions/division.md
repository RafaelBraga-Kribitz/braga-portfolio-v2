---
publish: true
date: '2026-04-16'
tags:
- calculus
slug: division-limits-of-functions
---

# Division

$$
\lim_{x \to a} \left[ \frac{f(x)}{g(x)} \right] = \frac{\lim_{x \to a} f(x)}{\lim_{x \to a} g(x)}
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The limit of a quotient equals the quotient of the individual limits, provided the denominator's limit is non-zero and both limits are finite. This is the quotient law of limits. It is the most restricted of the basic limit laws — the condition $\lim g(x) \ne 0$ is essential. When the denominator's limit is zero, the quotient may diverge, approach a finite limit (via cancellation), or be indeterminate ($0/0$ form). In DS/DA: evaluating the learning rate schedules (e.g., $\alpha_t = \alpha_0/(1 + t)$, limit as $t\to\infty$); the derivative limit $f'(x) = \lim_{h\to 0}[f(x+h)-f(x)]/h$ is a $0/0$ indeterminate form resolved by L'Hôpital or algebraic simplification; rate of convergence comparisons ($\lim_{n\to\infty}n^{-1}/n^{-2} = \infty$, $O(n^{-1})$ is slower); precision, recall, F1 score limits as class balance changes.

## Flowchart

```mermaid
flowchart TD
    A["Limit of quotient: lim[f(x)/g(x)] as x -> a"]
    A --> B["Compute lim f(x) = L"]
    A --> C["Compute lim g(x) = M"]
    C --> D{"Is M ≠ 0?"} D -- Yes --> E["Apply quotient law: lim[f/g] = L / M"] D -- No --> F{"Is L also 0?"} F -- Yes --> G["0/0 indeterminate: need L'Hopital or algebraic simplification"] F -- No --> H["L / 0: limit is +/-infinity or does not exist (check signs)"]
    G --> I["Factor and cancel, or apply L'Hopital: (f'/g')"]
    H --> J["One-sided limit may differ: +inf or -inf depending on sign of g(x)"]
```

## Real-world use

### Where it is used

Definition of the derivative: $f'(x) = \lim_{h\to 0}[f(x+h)-f(x)]/h$ is $0/0$ resolved by algebra; rate comparisons: $\lim_{n\to\infty}[\ln n / n] = 0$ (log grows slower than linear); SNR (signal-to-noise ratio) as noise $\to 0$; learning rate decay $\lim_{t\to\infty}\alpha_t = 0$ for schedules like $\alpha_t = \alpha_0/(1+\lambda t)$; probability ratios in likelihood ratio tests: $\lim_{\theta\to\theta_0}[p(x;\theta)/p(x;\theta_0)]$; regularization path: $\lim_{\lambda\to 0}[w^*(\lambda)]$ where $w^*$ is the regularized optimum.

### Problem it solves

When a ratio of two functions has a non-zero denominator at the limit point, the quotient law gives the answer directly. When the denominator is zero, it identifies the form (indeterminate $0/0$ or divergent $c/0$) and signals what further technique is needed. Without this law, every ratio would require computing the combined expression from scratch.

### How it solves the problem

Compute $\lim f = L$ and $\lim g = M$ separately. If $M \ne 0$: result is $L/M$. If $M = 0$ and $L \ne 0$: diverges (determine sign from one-sided limits). If $M = 0$ and $L = 0$: indeterminate, apply L'Hôpital's rule ($\lim f'/g'$) or factor and cancel.

### Example in a business

A DS analyzes the decay of cosine learning rate schedule: $\alpha_t = \alpha_0(1 + \cos(\pi t/T))/2$. At $t = T$: $\lim_{t\to T}\alpha_t = \alpha_0(1 + \cos(\pi))/2 = \alpha_0(1-1)/2 = 0$. No division needed here, but the DS also checks the ratio of current to initial LR: $\alpha_t/\alpha_0 = (1+\cos(\pi t/T))/2$, which is a quotient with non-zero denominator — quotient law applies directly.

## The formula, piece by piece

- $f(x)/g(x)$: quotient of two functions
- $\lim_{x\to a} f(x) = L$: numerator's limit
- $\lim_{x\to a} g(x) = M$: denominator's limit
- $= L/M$: quotient law (requires $M \ne 0$)
- Critical condition: $M \ne 0$. This is the key difference from the addition and product laws.
- $0/0$ form: indeterminate — requires further work (L'Hôpital, factoring, Taylor expansion)
- $c/0$ form ($c \ne 0$): the limit diverges. Whether to $+\infty$ or $-\infty$ depends on the sign of $g(x)$ as $x \to a$.
- $\infty/\infty$ form: indeterminate — requires L'Hôpital or dominant term analysis

## The formula in words

"The limit of a fraction is the fraction of the limits, as long as the denominator does not approach zero. If the denominator does go to zero, you cannot apply this law directly and must use other techniques." Tiny trace: $\lim_{x\to 2}[(x^2-4)/(x+1)]$.
$\lim(x^2-4) = 4-4 = 0$. $\lim(x+1) = 3 \ne 0$.
Quotient law: $0/3 = 0$. (Note: this is not indeterminate because $M=3 \ne 0$.) $\checkmark$

## Critical Concepts

- **The $0/0$ indeterminate form is the derivative:** every derivative $f'(x) = \lim_{h\to 0}[f(x+h)-f(x)]/h$ is a $0/0$ form. The quotient law says you cannot split numerator and denominator limits here. You must either use algebra to cancel the $h$, or use L'Hôpital. This is why differentiation rules exist — each one is a resolved $0/0$ limit.
- **L'Hôpital's rule resolves $0/0$ and $\infty/\infty$:** if $\lim f = 0$ and $\lim g = 0$ (or both $\infty$), then $\lim[f/g] = \lim[f'/g']$, provided the latter limit exists. L'Hôpital can be applied repeatedly. It works because near $a$, $f(x) \approx f'(a)(x-a)$ and $g(x) \approx g'(a)(x-a)$, so $f/g \approx f'(a)/g'(a)$.
- **Rate comparisons:** $\lim_{n\to\infty}[\ln n / n^{\epsilon}] = 0$ for any $\epsilon > 0$ (log grows slower than any power). $\lim_{n\to\infty}[n^k/e^n] = 0$ for any $k$ (exponential dominates polynomial). $\lim_{n\to\infty}[n^k/n^j] = 0$ if $k < j$, $\infty$ if $k > j$, $1$ if $k = j$. These quotient limits define the hierarchy of growth rates used in algorithm complexity analysis and convergence rate comparisons.
- **Precision vs. recall trade-off limit:** $F1 = 2PR/(P+R)$. If $P \to 0$ while $R$ stays constant: $\lim_{P\to 0} 2PR/(P+R) = 0/R = 0$. If $P \to \infty$ and $R$ is fixed: $\lim_{P\to\infty} 2PR/(P+R) = 2R$. These are direct applications of the quotient limit law where the denominator is non-zero.
- **Sign of divergence:** when $\lim g(x) = 0$ and $\lim f(x) = c \ne 0$, the limit of $f/g$ depends on the sign of $g(x)$ near $a$.

If $g(x) > 0$ and $f(a) > 0$: limit is $+\infty$. If $g(x) > 0$ and $f(a) < 0$: limit is $-\infty$. If $g$ changes sign at $a$ (e.g., $g(x) = x$ and $a = 0$): left limit $= -\infty$, right limit $= +\infty$, two-sided limit does not exist.

## Step-by-step calculation (tiny example)

*Evaluate $\lim_{x\to 1}[(x^2 - 1)/(x - 1)]$. (A classic $0/0$ form.)*

*Step 1: Check the form.* $\lim_{x\to 1}(x^2-1) = 0$ and $\lim_{x\to 1}(x-1) = 0$. This is $0/0$. Quotient law does not apply directly.

*Step 2: Algebraic simplification.* $x^2 - 1 = (x-1)(x+1)$. So $(x^2-1)/(x-1) = (x-1)(x+1)/(x-1) = x+1$ for $x \ne 1$.

*Step 3: Apply limit.* $\lim_{x\to 1}(x+1) = 2$. Now the quotient law applies to the simplified form. *Verify:* $x = 1.001$: $(1.001^2-1)/0.001 = 0.002001/0.001 = 2.001 \approx 2$. $\checkmark$

## Code examples

### Beginner example (Python)

```python
import numpy as np

def numerical_limit(fn, a: float, h: float = 1e-7) -> float:
    """Approximate lim_{x->a} fn(x)."""
    return 0.5 * (fn(a + h) + fn(a - h))

def classify_limit_form(lim_f: float, lim_g: float, tol: float = 1e-8) -> str:
    """Classify the form of lim[f/g]."""
    f_zero = abs(lim_f) < tol
    g_zero = abs(lim_g) < tol
    if not g_zero:
        return f"Quotient law: {lim_f:.4f}/{lim_g:.4f} = {lim_f/lim_g:.4f}"
    elif f_zero and g_zero:
        return "0/0 indeterminate: need L'Hopital or algebraic simplification"
    else:
        return f"c/0 form ({lim_f:.4f}/0): diverges to +/-infinity"


examples = [
    {"name": "(x^2-4)/(x+1) at x=2", "f": lambda x: x**2 - 4, "g": lambda x: x + 1, "a": 2.0, "analytic": 0.0},       # 0/3 = 0
    {"name": "(x^2-1)/(x-1) at x=1", "f": lambda x: x**2 - 1, "g": lambda x: x - 1, "a": 1.0, "analytic": 2.0},       # factor: x+1 -> 2
    {"name": "sin(x)/x at x=0", "f": np.sin, "g": lambda x: x, "a": 0.0, "analytic": 1.0},                            # standard limit
    {"name": "ln(1+x)/x at x=0", "f": lambda x: np.log(1 + x), "g": lambda x: x, "a": 0.0, "analytic": 1.0},         # ln(1+x)/x -> 1
]
print("Limit Quotient Law: lim[f/g] = lim[f] / lim[g] (if lim[g] != 0)")
print(f"\n{'Example':>32} {'lim f':>8} {'lim g':>8} {'lim(f/g)':>10} {'Analytic':>10}")
for ex in examples:
    lim_f = numerical_limit(ex["f"], ex["a"])
    lim_g = numerical_limit(ex["g"], ex["a"])
    lim_quot = numerical_limit(lambda x: ex["f"](x) / ex["g"](x), ex["a"])
    print(f"{ex['name']:>32} {lim_f:>8.4f} {lim_g:>8.4f} {lim_quot:>10.4f} {ex['analytic']:>10.4f}")
    print(f" Form: {classify_limit_form(lim_f, lim_g)}")
```

### Beginner example (R)

```r
# Limit quotient law: lim[f(x)/g(x)] = lim[f(x)] / lim[g(x)] (if lim[g] != 0)
numerical_limit <- function(fn, a, h = 1e-7) {
  0.5 * (fn(a + h) + fn(a - h))
}
examples <- list(
  list(name = "(x^2-4)/(x+1), a=2", f = function(x) x^2 - 4, g = function(x) x + 1, a = 2, analytic = 0),
  list(name = "(x^2-1)/(x-1), a=1", f = function(x) x^2 - 1, g = function(x) x - 1, a = 1, analytic = 2),
  list(name = "sin(x)/x, a=0", f = sin, g = function(x) x, a = 0, analytic = 1),
  list(name = "log(1+x)/x, a=0", f = function(x) log(1 + x), g = function(x) x, a = 0, analytic = 1)
)
cat(sprintf("%-32s %-8s %-8s %-10s %-10s\n", "Example", "lim f", "lim g", "lim(f/g)", "Analytic"))
for (ex in examples) {
  lim_f <- numerical_limit(ex$f, ex$a)
  lim_g <- numerical_limit(ex$g, ex$a)
  lim_quot <- numerical_limit(function(x) ex$f(x) / ex$g(x), ex$a)
  cat(sprintf("%-32s %-8.4f %-8.4f %-10.4f %-10.4f\n", ex$name, lim_f, lim_g, lim_quot, ex$analytic))
}
```

### Professional example (Python)

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
np.random.seed(42)

# -- Limit quotient law: learning rate schedule decay and ratio analysis --
# Use case: A DS compares three LR schedules and examines their limit behavior
# using the quotient law. Specifically:
# 1) Step decay: alpha_t = alpha_0 / (1 + lambda * t) -> 0/inf = 0
# 2) Inverse sqrt: alpha_t = alpha_0 / sqrt(1 + t) -> 0/inf = 0
# 3) Polynomial ratio: alpha_t = alpha_0 * (1 + t)^p / (1 + t)^q -> depends on p vs q
# The ratio of two schedules tells us which converges faster: lim[alpha_A/alpha_B].
ALPHA_0 = 0.1
LAMBDA = 0.01
T_MAX = 5000
p_exp = 0.5
q_exp = 0.9
t_vals = np.arange(1, T_MAX + 1)

def schedule_step(t: np.ndarray) -> np.ndarray:
    """alpha_0 / (1 + lambda * t)."""
    return ALPHA_0 / (1.0 + LAMBDA * t)

def schedule_inv_sqrt(t: np.ndarray) -> np.ndarray:
    """alpha_0 / sqrt(1 + t)."""
    return ALPHA_0 / np.sqrt(1.0 + t)

def schedule_poly_ratio(t: np.ndarray) -> np.ndarray:
    """alpha_0 * (1+t)^p / (1+t)^q = alpha_0 * (1+t)^(p-q). Limit depends on p-q."""
    return ALPHA_0 * (1.0 + t) ** (p_exp - q_exp)


alpha_step = schedule_step(t_vals)
alpha_inv_sqrt = schedule_inv_sqrt(t_vals)
alpha_poly = schedule_poly_ratio(t_vals)

# Quotient ratios: which decays faster?
# ratio_step_vs_isqrt = alpha_step / alpha_inv_sqrt = sqrt(1+t) / (1+lambda*t)
# As t->inf: numerator ~ sqrt(t), denominator ~ lambda*t, ratio -> 0 (step decays faster)
ratio_step_vs_isqrt = alpha_step / alpha_inv_sqrt

# ratio_isqrt_vs_poly = alpha_inv_sqrt / alpha_poly
# = alpha_0/sqrt(1+t) / alpha_0*(1+t)^(p-q)
# = (1+t)^(-(1/2)) / (1+t)^(p-q)
# = (1+t)^(-(1/2) - (p-q)) = (1+t)^(q-p-0.5)
# With p=0.5, q=0.9: exponent = 0.9-0.5-0.5 = -0.1 -> 0 (inv_sqrt decays faster)
ratio_isqrt_vs_poly = alpha_inv_sqrt / alpha_poly
print("Limit Quotient Law: Learning Rate Schedule Comparison")
print(f"\nSchedules: step (lambda={LAMBDA}), inverse-sqrt, polynomial (p={p_exp}, q={q_exp})")
print(f"\n{'t':>7} {'step':>10} {'inv-sqrt':>10} {'poly':>10} "
      f"{'ratio S/IS':>12} {'ratio IS/P':>12}")
for t_check in [1, 10, 100, 500, 1000, 5000]:
    idx = t_check - 1
    print(f"{t_check:>7} {alpha_step[idx]:>10.6f} {alpha_inv_sqrt[idx]:>10.6f} "
          f"{alpha_poly[idx]:>10.6f} "
          f"{ratio_step_vs_isqrt[idx]:>12.6f} {ratio_isqrt_vs_poly[idx]:>12.6f}")
print(f"\nQuotient law analysis:")
print(f" lim_{{t->inf}} [step / inv-sqrt]:")
print(f" = lim sqrt(1+t) / (1 + lambda*t)")
print(f" lim f = inf, lim g = inf -> quotient law needs dominant terms")
print(f" ~ sqrt(t) / (lambda*t) = 1/(lambda*sqrt(t)) -> 0 (step decays faster)")
print(f" Confirmed numerically: ratio at t=5000 = {ratio_step_vs_isqrt[-1]:.6f}")
print(f"\n lim_{{t->inf}} [inv-sqrt / poly ratio]:")
print(f" exponent = q-p-0.5 = {q_exp-p_exp-0.5:.2f} -> (1+t)^{q_exp-p_exp-0.5:.2f} -> 0")
print(f" Confirmed numerically: ratio at t=5000 = {ratio_isqrt_vs_poly[-1]:.6f}")
print(f"\n Key: lim of each schedule -> 0, but RATES of decay differ.")
print(f" Quotient law applied to ratios reveals convergence order.")
```

---

*Source: 1300 p. 216*
