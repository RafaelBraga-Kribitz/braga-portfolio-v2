---
title: Irrational numbers
date: '2026-04-16'
wordCount: 812
slug: irrational_numbers
permalink: /notes/01_foundations/number_sets_and_logic/sets_of_numbers/irrational_numbers/index.html
share_status: draft
publish_target: note
boundary: public
---
# Non-repeating and non-terminating decimals.
## Deep Breakdown
What it tells me *(Situation Awareness)*:
**Irrational numbers** are real numbers that cannot be expressed as a ratio $\frac{a}{b}$ with $a, b \in \mathbb{Z}$ and $b \neq 0$. Their decimal expansions never terminate and never repeat — they go on forever without a pattern. Famous examples: $\pi \approx 3.14159\ldots$, $e \approx 2.71828\ldots$, $\sqrt{2} \approx 1.41421\ldots$, $\phi = \frac{1 + \sqrt{5}}{2} \approx 1.61803\ldots$ (golden ratio). In DA/DS, irrational numbers appear as mathematical constants in formulas (logarithms, exponential functions, normal distribution, entropy), but you always work with floating-point approximations in code — no software stores the full irrational value.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["ℚ = all fractions a/b"] --> B["Is every real number rational?"] B -- "No" --> C["Some reals cannot be written as a/b"] C --> D["Irrational: non-terminating, non-repeating decimal"] D --> E["π = 3.14159265..."] D --> F["e = 2.71828182..."] D --> G["√2 = 1.41421356..."] D --> H["ℚ ∩ Irrationals = ∅ (disjoint)"] H --> I["ℚ ∪ Irrationals = ℝ"] I --> J["Code: all stored as float64 approximations"]
```
### Real-World use:
#### Situation it is used
Mathematical constants in formulas: `np.pi` in circular and angular calculations, `np.e` in exponential growth models ($e^{rt}$), natural logarithm in entropy ($-p \ln p$), normal distribution PDF (uses both $\pi$ and $e$), sigmoid and softmax functions (use $e$), learning rate decay schedules.
#### Problem it solves
Many natural mathematical relationships — the circumference of a circle, compound interest, the bell curve — involve irrational constants. Knowing that these are irrational helps you understand why you can never compute them exactly in finite time, and why using `np.pi` (a high-precision float approximation) is correct rather than `3.14`.
#### How it solves the problem
Software provides high-precision rational approximations of irrational constants: `np.pi = 3.141592653589793` (correct to ~15 decimal places). For scientific computing, this precision is sufficient. For exact symbolic computation, tools like `sympy` keep irrationals symbolic without evaluating them to floats.
#### Example of it used in the Working Context as DA/DS for a Business
Log-loss (cross-entropy): $L = -\frac{1}{N}\sum_{i=1}^N y_i \ln(\hat{y}_i)$. The natural log $\ln$ (base $e$) is applied to model predictions. The result involves $e$, an irrational constant. Python computes `np.log(p)` using a float approximation of $e$, with sufficient precision for ML metrics.
### The Formula (Fragment-First)
Breaking the notation: - "Non-repeating": the decimal expansion has no block of digits that repeats infinitely (unlike $\frac{1}{3} = 0.\overline{3}$).
- "Non-terminating": the decimal expansion never ends (unlike $\frac{1}{4} = 0.25$).
- **Both properties together define irrationality** — if a decimal either terminates or repeats, it is rational. If it neither terminates nor repeats, it is irrational. Key irrational constants in DS/ML:
| Constant | Approximate value | Where it appears |
|----------|-------------------|------------------|
| $\pi$ | $3.14159265\ldots$ | Circular stats, Fourier, normal distribution |
| $e$ | $2.71828182\ldots$ | Exponential growth, log-loss, sigmoid, softmax |
| $\sqrt{2}$ | $1.41421356\ldots$ | Gaussian normalization ($\sigma\sqrt{2}$) |
| $\phi$ | $1.61803398\ldots$ | Golden ratio, Fibonacci, visual design |
| $\ln 2$ | $0.69314718\ldots$ | Entropy (bits), half-life, doubling time | Proof sketch that $\sqrt{2}$ is irrational (proof by contradiction, via contrapositive):
Assume $\sqrt{2} = \frac{a}{b}$ in lowest terms. Then $a^2 = 2b^2$ — so $a^2$ is even, forcing $a = 2k$. Substituting: $b^2 = 2k^2$, so $b$ is also even. But $a$ and $b$ both even contradicts "lowest terms." Contradiction — $\sqrt{2} \notin \mathbb{Q}$.
### Formula-to-English Translation
"Irrational numbers are the real numbers that fall in the gaps between all fractions. Their decimal expansions go on forever without settling into a repeating pattern. You can never write them down exactly — you always approximate. The universe uses them constantly; your computer pretends it can store them (it approximates)." ### Critical Concepts
1. **Float approximation is not the irrational**: `np.pi` is a float — a rational number close to $\pi$. The true $\pi$ cannot be stored. This is fine for data science (15 digits is enough for any practical calculation), but understand the distinction.
2. **Transcendental vs. algebraic irrationals**: $\sqrt{2}$ is irrational but algebraic (root of $x^2 - 2 = 0$). $\pi$ and $e$ are transcendental — they are not roots of any polynomial with rational coefficients. Matters in cryptography and theoretical CS, rarely in day-to-day DS.
3. **sympy for exact irrationals**: Python's `sympy` library keeps $\pi$, $e$, $\sqrt{2}$ as exact symbols. Useful for symbolic differentiation, integration, and formula simplification without float errors.
4. **Density paradox**: irrationals are "more numerous" than rationals — uncountably infinite vs. countably infinite. The real number line consists almost entirely of irrational numbers, despite rationals being densely packed.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: compute the standard normal PDF at $x = 0$ and identify where irrationals appear. *Step 1: The formula*
$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$. For standard normal ($\mu = 0$, $\sigma = 1$, $x = 0$): $f(0) = \frac{1}{\sqrt{2\pi}}$. *Step 2: Identify irrationals*
$\pi \approx 3.14159\ldots$ (irrational, transcendental). $\sqrt{2\pi} = \sqrt{2 \times \pi}$ — still irrational. $e^0 = 1$ (rational — the irrational $e$ raised to 0 is 1). *Step 3: Compute approximation*
$f(0) = \frac{1}{\sqrt{2 \times 3.14159\ldots}} = \frac{1}{\sqrt{6.28318\ldots}} = \frac{1}{2.50663\ldots} \approx 0.39894$ *Step 4: Python check*
`from scipy.stats import norm; norm.pdf(0)` returns `0.3989422804014327` — a float approximation of the irrational result.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Irrational numbers: non-repeating, non-terminating decimals import numpy as np
from fractions import Fraction
from scipy.stats import norm # Key irrational constants available in Python
print("Irrational constants (float approximations):")
print(f" π (np.pi): {np.pi}")
print(f" e (np.e): {np.e}")
print(f" √2 (np.sqrt2): {np.sqrt(2)}")
print(f" ln2: {np.log(2)}") # Show that float is a rational approximation of irrational
pi_approx = Fraction(np.pi).limit_denominator(1_000_000)
print(f"\nBest rational approx of π (denom ≤ 1,000,000): {pi_approx} = {float(pi_approx):.10f}")
print(f"Actual np.pi: {np.pi:.10f}")
print(f"Error: {abs(float(pi_approx) - np.pi):.2e}") # Irrationals in the normal distribution PDF
x_values = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])
print("\nStandard Normal PDF (uses π and e internally):")
for x in x_values: pdf_val = norm.pdf(x) print(f" f({x:+.1f}) = {pdf_val:.8f} ← irrational (float approx)") # Entropy formula: uses natural log (base e)
probs = np.array([0.5, 0.3, 0.2])
entropy = -np.sum(probs * np.log(probs)) # natural log: base e
entropy_bits = -np.sum(probs * np.log2(probs)) # log base 2
print(f"\nEntropy of [0.5, 0.3, 0.2]:")
print(f" Nats (ln): {entropy:.6f} ← involves e (irrational)")
print(f" Bits (log2): {entropy_bits:.6f} ← involves log(2) (irrational)")
```
#### Beginner friendly Example [R])
``` r
# Irrational numbers in R # R provides float approximations via built-in constants
cat("π: ", pi, "\n")
cat("e: ", exp(1), "\n")
cat("√2: ", sqrt(2), "\n")
cat("ln2: ", log(2), "\n") cat(sprintf("\nFloat precision of π: %.15f\n", pi))
cat(sprintf("True π: 3.14159265358979323846...\n")) # Normal PDF: uses π and e
x_vals <- c(-2, -1, 0, 1, 2)
cat("\nStandard Normal PDF:\n")
for (x in x_vals) { cat(sprintf(" f(%+.0f) = %.8f\n", x, dnorm(x)))
} # Entropy: uses log (base e by default in R)
probs <- c(0.5, 0.3, 0.2)
entropy_nats <- -sum(probs * log(probs))
entropy_bits <- -sum(probs * log2(probs))
cat(sprintf("\nEntropy (nats): %.6f (involves e)\n", entropy_nats))
cat(sprintf("Entropy (bits): %.6f (involves log2 = irrational)\n", entropy_bits))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from scipy.stats import norm
import sympy as sp # Scenario: demonstrate where irrationals appear in ML metrics
# and symbolic vs. numeric computation np.random.seed(42)
N = 1000 # Simulate binary classifier predictions
true_labels = np.random.randint(0, 2, N)
pred_probs = np.clip(np.random.beta(2, 5, N), 1e-9, 1 - 1e-9) # 1. Log-loss: uses ln (base e, irrational)
log_loss = -np.mean( true_labels * np.log(pred_probs) + (1 - true_labels) * np.log(1 - pred_probs)
) # 2. Normal PDF normalization constant (uses π)
x_range = np.linspace(-4, 4, 9)
pdf_vals = norm.pdf(x_range) # 3. Symbolic computation — keep irrationals exact (no float rounding)
x_sym = sp.Symbol("x")
normal_sym = (1 / sp.sqrt(2 * sp.pi)) * sp.exp(-x_sym**2 / 2) print("Irrational Constants in ML Metrics")
print("=" * 42)
print(f"\n1. Log-loss (uses ln = log_e, e irrational):")
print(f" Loss = {log_loss:.6f}") print(f"\n2. Normal PDF normalization constant:")
print(f" 1/√(2π) = {1 / np.sqrt(2 * np.pi):.8f} ← float approx of irrational")
print(f" PDF values: {dict(zip(x_range.astype(int), pdf_vals.round(6)))}") print(f"\n3. Exact symbolic normal PDF (sympy):")
print(f" f(x) = {normal_sym}")
print(f" f(0) symbolic = {normal_sym.subs(x_sym, 0)}")
print(f" f(0) numeric = {float(normal_sym.subs(x_sym, 0)):.8f}") print(f"\n4. Float precision limits:")
print(f" np.pi = {np.pi}")
print(f" np.e = {np.e}")
print(f" np.sqrt(2) = {np.sqrt(2)}")
print(f" These are high-precision rational approximations of irrational numbers.")
```
#### Final Professional Example [R]
``` r
# Float precision: pi, e, sqrt(2) are rational approximations of irrationals cat(" pi =", pi, "\n")
cat(" e =", exp(1), "\n")
cat(" sqrt(2) =", sqrt(2), "\n")
cat(" These are high-precision rational approximations of irrational numbers.\n")
```
---
1300 pag 15