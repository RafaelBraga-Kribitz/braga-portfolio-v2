---
title: Binomial Theorem
date: '2026-04-16'
wordCount: 1074
slug: binomial_theorem
permalink: /notes/02_algebra_precalc/algebra_and_factoring/binomial_theorem_and_expansions/binomial_theorem/index.html
share_status: draft
publish_target: note
boundary: public
---
# $(a + x)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} x^k$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The binomial theorem gives the exact expanded form of a power of a two-term sum. $(a + x)^n$ produces $n+1$ terms, each of the form $\binom{n}{k} a^{n-k} x^k$ for $k = 0, 1, \ldots, n$. The coefficient $\binom{n}{k}$ ("n choose k") counts the number of ways to pick exactly $k$ factors of $x$ from the $n$ factors in the product $(a+x)(a+x)\cdots(a+x)$. In DA/DS, the binomial theorem appears in: the binomial probability distribution $P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$ (directly this formula with $a = 1-p$ and $x = p$), Taylor/linear approximations $(1 + r)^n \approx 1 + nr$ for small $r$ (the first-order term of the expansion), compound growth and variance propagation, and polynomial feature expansion in machine learning (expanding $(x_1 + x_2)^2$ to get cross-features $x_1^2, 2x_1 x_2, x_2^2$). The theorem is also the theoretical foundation of Pascal's triangle.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Binomial: (a + x)^n"] --> B["Sum over k = 0, 1, ..., n"] B --> C["Term k: C(n,k) × a^(n-k) × x^k"] C --> D["C(n,k) = n! / (k! × (n-k)!) (binomial coefficient)"] C --> E["a^(n-k): decreasing power of a as k increases"] C --> F["x^k: increasing power of x as k increases"] D --> G["Pascal's triangle row n gives all coefficients"] C --> H["DA: binomial distribution P(X=k) = C(n,k) p^k (1-p)^(n-k)"] C --> I["DA: approximation (1+r)^n ≈ 1+nr for small r"] C --> J["DA: polynomial feature expansion (x+y)^2 = x² + 2xy + y²"]
```
### Real-World use:
#### Situation it is used
Binomial distribution: the probability that exactly $k$ successes occur in $n$ independent Bernoulli trials with success probability $p$ is $P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$ — this is exactly the binomial theorem applied to $(p + (1-p))^n = 1$. Compound growth approximation: $(1 + r)^n \approx 1 + nr$ for small $r$ (e.g., annual growth rate compounded $n$ times). Polynomial feature generation: for two features $x_1, x_2$, the degree-2 expansion $(x_1 + x_2)^2 = x_1^2 + 2x_1 x_2 + x_2^2$ generates the polynomial basis used in kernel SVMs and polynomial regression. Variance of a sum of random variables (when terms are independent).
#### Problem it solves
Expanding $(a + x)^n$ by hand via repeated multiplication becomes infeasible for large $n$. The binomial theorem gives the exact result directly, without iterative multiplication. Each term is computed independently using the formula $\binom{n}{k} a^{n-k} x^k$, so you can extract any single term (e.g., the $x^3$ term in $(2 + x)^5$) without computing all others.
#### How it solves the problem
Consider the product $(a+x)^n = (a+x)(a+x)\cdots(a+x)$ ($n$ factors). Each term in the expansion is produced by choosing one of $\{a, x\}$ from each of the $n$ factors. To get a term with exactly $k$ factors of $x$ (and $n-k$ factors of $a$), you must choose $x$ from $k$ specific factors — the number of ways to do this is $\binom{n}{k}$. The resulting term is $\binom{n}{k} a^{n-k} x^k$. Summing over all possible values of $k$ (from 0 to $n$) gives the full expansion.
#### Example of it used in the Working Context as DA/DS for a Business
A conversion rate analyst wants the probability that exactly 3 out of 10 randomly selected users convert, given a 20% conversion rate. Using the binomial theorem with $a = 0.8$ (non-conversion), $x = 0.2$ (conversion), $n = 10$, $k = 3$: $P(X = 3) = \binom{10}{3} (0.8)^7 (0.2)^3 = 120 \times 0.2097 \times 0.008 = 0.2013 \approx 20.1\%$. The binomial theorem is the backbone of this calculation.
### The Formula (Fragment-First)
Breaking the notation: - $(a + x)^n$: a binomial ("two-term") expression raised to the power $n$ — the quantity being expanded.
- $\sum_{k=0}^{n}$: sum over all integer values of $k$ from 0 to $n$ inclusive — $n+1$ terms total.
- $\binom{n}{k}$: the binomial coefficient "n choose k" — $\frac{n!}{k!(n-k)!}$ — the number of ways to select $k$ items from $n$ without order.
- $a^{n-k}$: $a$ raised to the power $n-k$ — decreases as $k$ increases (first term: $a^n$, last term: $a^0 = 1$).
- $x^k$: $x$ raised to the power $k$ — increases as $k$ increases (first term: $x^0 = 1$, last term: $x^n$). **First and last terms**:
- $k = 0$: $\binom{n}{0} a^n x^0 = a^n$.
- $k = n$: $\binom{n}{n} a^0 x^n = x^n$. **Middle term** (when $n$ is even, $k = n/2$): $\binom{n}{n/2} a^{n/2} x^{n/2}$ — has the largest binomial coefficient. **Special case $a = 1$**: $(1 + x)^n = \sum_{k=0}^{n} \binom{n}{k} x^k$ — the standard form used for probability generating functions and small-$x$ approximations. **Linear approximation**: for small $|x/a|$: $(a + x)^n \approx a^n + n a^{n-1} x$ (first two terms only).
### Formula-to-English Translation
"$(a + x)^n$ expands into $n+1$ terms. Each term is: how many ways to pick $k$ copies of $x$ from $n$ factors ($= \binom{n}{k}$), times $a$ to the remaining power ($= a^{n-k}$), times $x$ to the chosen power ($= x^k$). The powers of $a$ decrease and the powers of $x$ increase as you go from $k=0$ to $k=n$. In Python: `from sympy import expand, symbols; expand((a+x)**n)` or use `scipy.special.comb(n, k)` to compute individual coefficients." ### Critical Concepts
1. **Binomial coefficients are symmetric**: $\binom{n}{k} = \binom{n}{n-k}$. The coefficient of $a^{n-k} x^k$ equals the coefficient of $a^k x^{n-k}$. This corresponds to the symmetry of Pascal's triangle.
2. **Sum of coefficients = $2^n$**: setting $a = x = 1$: $(1+1)^n = 2^n = \sum_{k=0}^n \binom{n}{k}$. Total number of subsets of an $n$-element set.
3. **Binomial distribution connection**: $P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$ is the $k$-th term of $(1-p+p)^n = 1^n = 1$ — the binomial theorem guarantees all probabilities sum to 1.
4. **First-order approximation**: $(1+x)^n \approx 1 + nx$ for $|x| \ll 1$. In finance: $(1 + r)^n \approx 1 + nr$ for small interest rate $r$. In ML: gradient approximations for small perturbations.
5. **Polynomial features**: the degree-2 expansion of $(x_1 + x_2)^2 = x_1^2 + 2x_1 x_2 + x_2^2$ generates the polynomial kernel basis. More generally, the `PolynomialFeatures` transformer in scikit-learn applies the binomial (and multinomial) theorem to generate interaction terms.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: expand $(2 + x)^3$. *Step 1: Identify $a$, $x$, $n$*
$a = 2$, $x = x$, $n = 3$. There will be 4 terms ($k = 0, 1, 2, 3$). *Step 2: Compute each binomial coefficient*
$\binom{3}{0} = 1$, $\binom{3}{1} = 3$, $\binom{3}{2} = 3$, $\binom{3}{3} = 1$. *Step 3: Write each term*
$k=0$: $1 \cdot 2^3 \cdot x^0 = 8$.
$k=1$: $3 \cdot 2^2 \cdot x^1 = 12x$.
$k=2$: $3 \cdot 2^1 \cdot x^2 = 6x^2$.
$k=3$: $1 \cdot 2^0 \cdot x^3 = x^3$. *Step 4: Assemble*
$(2 + x)^3 = 8 + 12x + 6x^2 + x^3$. *Step 5: Verify by substitution*
$x = 1$: $(2+1)^3 = 27$. Formula: $8 + 12 + 6 + 1 = 27$. ✓ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Binomial theorem expansion from math import comb, factorial def binomial_term(n: int, k: int, a: float, x: float) -> float: """Compute the k-th term of the binomial expansion of (a + x)^n.""" return comb(n, k) * (a ** (n - k)) * (x ** k) def binomial_expansion(n: int, a: float, x: float) -> list[float]: """ Expand (a + x)^n and return all n+1 terms. Args: n: Power (non-negative integer). a: First term of the binomial. x: Second term of the binomial. Returns: List of n+1 term values. """ return [binomial_term(n, k, a, x) for k in range(n + 1)] # Expand (2 + x)^3 symbolically (x=1 for numeric check)
n_val = 3
a_val = 2.0 terms = binomial_expansion(n_val, a_val, 1.0) print(f"Expansion of ({a_val} + x)^{n_val}:")
for k, term in enumerate(terms): coeff = comb(n_val, k) * (a_val ** (n_val - k)) print(f" k={k}: C({n_val},{k}) × {a_val}^{n_val - k} × x^{k} = {coeff:.0f}x^{k} (at x=1: {term:.1f})")
print(f" Sum at x=1: {sum(terms):.1f} vs ({a_val}+1)^{n_val} = {(a_val + 1) ** n_val:.1f}") # Binomial distribution: P(X=k) for n=10, p=0.2
n_trials = 10
p = 0.2 print(f"\nBinomial distribution: n={n_trials}, p={p}")
print(f"{'k':>4} {'P(X=k)':>10} {'term check':>12}")
for k in range(n_trials + 1): prob = binomial_term(n_trials, k, 1 - p, p) print(f"{k:>4} {prob:>10.6f}") total = sum(binomial_term(n_trials, k, 1 - p, p) for k in range(n_trials + 1))
print(f"Sum = {total:.8f} (should be exactly 1.0)") # Linear approximation (1 + r)^n ≈ 1 + nr for small r
r = 0.02 # 2% growth rate
n = 5
exact = (1 + r) ** n
approx = 1 + n * r print(f"\nLinear approximation: (1 + {r})^{n}")
print(f" Exact: {exact:.6f}")
print(f" Approx: {approx:.6f}")
print(f" Error: {abs(exact - approx):.8f}")
```
#### Beginner friendly Example [R])
``` r
# Binomial theorem in R # Expand (a + x)^n term by term
binomial_term <- function(n, k, a, x) choose(n, k) * a^(n - k) * x^k binomial_expansion <- function(n, a, x) { sapply(0:n, function(k) binomial_term(n, k, a, x))
} # Expand (2 + x)^3 at x=1
n_val <- 3; a_val <- 2.0
terms <- binomial_expansion(n_val, a_val, 1.0) cat(sprintf("Expansion of (%.0f + x)^%d at x=1:\n", a_val, n_val))
for (k in 0:n_val) { coeff <- choose(n_val, k) * a_val^(n_val - k) cat(sprintf(" k=%d: coeff=%.0f term=%.1f\n", k, coeff, terms[k + 1]))
}
cat(sprintf(" Sum=%.1f vs (%.0f+1)^%d=%.1f\n", sum(terms), a_val, n_val, (a_val + 1)^n_val)) # Binomial distribution
n_trials <- 10; p <- 0.2 cat(sprintf("\nBinomial: n=%d, p=%.2f\n", n_trials, p))
probs <- sapply(0:n_trials, function(k) binomial_term(n_trials, k, 1 - p, p))
cat(sprintf("Sum of all P(X=k) = %.8f\n", sum(probs))) # Linear approximation
r <- 0.02; n <- 5
cat(sprintf("\n(1+%.2f)^%d: exact=%.6f approx=%.6f\n", r, n, (1+r)^n, 1 + n*r))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
from math import comb
from scipy.stats import binom as scipy_binom # Scenario: A/B test power analysis using the binomial distribution
# For a given baseline conversion rate and minimum detectable effect,
# compute the full binomial probability distribution for both variants
# and compare the theoretical PMF to the binomial theorem expansion BASELINE_RATE = 0.10 # control conversion rate (p_control)
MDE = 0.03 # minimum detectable effect (absolute)
VARIANT_RATE = BASELINE_RATE + MDE # 13% variant rate
N_TRIALS = 200 # sample size per variant def binomial_pmf_exact(n: int, p: float) -> pd.DataFrame: """ Compute the exact binomial PMF for X ~ Bin(n, p) using the binomial theorem. P(X = k) = C(n, k) * p^k * (1-p)^(n-k) Args: n: Number of trials. p: Success probability per trial. Returns: DataFrame with columns: k, coefficient, p_k, 1-p_nk, pmf, cdf. """ q = 1 - p rows = [] cumulative = 0.0 for k in range(n + 1): coeff = comb(n, k) pmf_k = coeff * (p ** k) * (q ** (n - k)) cumulative += pmf_k rows.append({ "k": k, "C(n,k)": coeff, "p^k": p ** k, "(1-p)^(n-k)": q ** (n - k), "pmf": pmf_k, "cdf": cumulative, }) return pd.DataFrame(rows) control_pmf = binomial_pmf_exact(N_TRIALS, BASELINE_RATE)
variant_pmf = binomial_pmf_exact(N_TRIALS, VARIANT_RATE) # Summary statistics
control_mean = (control_pmf["k"] * control_pmf["pmf"]).sum()
variant_mean = (variant_pmf["k"] * variant_pmf["pmf"]).sum() # Probability of observing k >= threshold under each variant
k_threshold = int(np.ceil(N_TRIALS * (BASELINE_RATE + MDE / 2))) p_exceed_control = 1 - control_pmf.loc[control_pmf["k"] < k_threshold, "pmf"].sum()
p_exceed_variant = 1 - variant_pmf.loc[variant_pmf["k"] < k_threshold, "pmf"].sum() print(f"Binomial PMF via Binomial Theorem: P(X=k) = C(n,k)·p^k·(1-p)^(n-k)")
print(f"n = {N_TRIALS} | control p = {BASELINE_RATE} | variant p = {VARIANT_RATE}")
print("=" * 72)
print(f"{'Metric':<30} {'Control':>12} {'Variant':>12}")
print(f"{'Expected conversions E[X]':<30} {control_mean:>12.2f} {variant_mean:>12.2f}")
print(f"{'P(X >= ' + str(k_threshold) + ')':<30} {p_exceed_control:>12.4f} {p_exceed_variant:>12.4f}")
print(f"{'PMF sums to 1 (verify)':<30} {control_pmf['pmf'].sum():>12.8f} {variant_pmf['pmf'].sum():>12.8f}")
print(f"\nNote: PMF sum = 1 is guaranteed by the binomial theorem: Σ C(n,k)·p^k·(1-p)^(n-k) = (p + 1-p)^n = 1^n = 1")
```
#### Final Professional Example [R]
``` r
# A/B test power: binomial PMF for control vs variant using binomial theorem BASELINE_RATE <- 0.10
MDE <- 0.03
VARIANT_RATE <- BASELINE_RATE + MDE
N_TRIALS <- 200 binomial_pmf_exact <- function(n, p) { k <- 0:n pmf <- choose(n, k) * p^k * (1 - p)^(n - k) data.frame(k = k, pmf = pmf, cdf = cumsum(pmf))
} control_pmf <- binomial_pmf_exact(N_TRIALS, BASELINE_RATE)
variant_pmf <- binomial_pmf_exact(N_TRIALS, VARIANT_RATE)
control_mean <- N_TRIALS * BASELINE_RATE
variant_mean <- N_TRIALS * VARIANT_RATE
k_threshold <- 25
p_exceed_control <- 1 - sum(control_pmf$pmf[control_pmf$k < k_threshold])
p_exceed_variant <- 1 - sum(variant_pmf$pmf[variant_pmf$k < k_threshold]) cat(sprintf("n = %d | control p = %.2f | variant p = %.2f\n", N_TRIALS, BASELINE_RATE, VARIANT_RATE))
cat(sprintf("E[X] control: %.2f variant: %.2f\n", control_mean, variant_mean))
cat(sprintf("P(X >= %d) control: %.4f variant: %.4f\n", k_threshold, p_exceed_control, p_exceed_variant))
cat(sprintf("PMF sum control: %.8f variant: %.8f\n", sum(control_pmf$pmf), sum(variant_pmf$pmf)))
```
---
AIO pag 43