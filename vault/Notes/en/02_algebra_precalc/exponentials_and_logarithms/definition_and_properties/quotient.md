---
title: Quotient
date: '2026-04-16'
wordCount: 1132
slug: quotient
permalink: /notes/02_algebra_precalc/exponentials_and_logarithms/definition_and_properties/quotient/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\log_a\!\left(\frac{x}{y}\right) = \log_a x - \log_a y$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The quotient rule for logarithms converts division into subtraction: $\log_a(x/y) = \log_a x - \log_a y$. It is a direct corollary of the product rule and the power rule combined: $\log_a(x/y) = \log_a(x \cdot y^{-1}) = \log_a x + \log_a(y^{-1}) = \log_a x - \log_a y$. In DA/DS, the quotient rule appears in: (1) log-likelihood ratios $\ln[L(\theta_1)/L(\theta_2)] = \ln L(\theta_1) - \ln L(\theta_2)$, which are the basis of hypothesis testing (likelihood ratio test) and model comparison (Bayes factors); (2) KL divergence $D_{KL}(P \| Q) = \sum_i p_i \ln(p_i/q_i) = \sum_i p_i (\ln p_i - \ln q_i)$; (3) log-odds and logit: $\text{logit}(p) = \ln[p/(1-p)] = \ln p - \ln(1-p)$; (4) information gain in decision trees: $\text{IG} = H(\text{parent}) - H(\text{children}) = -\sum p_i \ln p_i + \sum p_{cj} \ln p_{cj}$, where each entropy term uses the quotient rule when expanding; (5) the odds ratio in epidemiology and logistic regression: $\ln\text{OR} = \ln(a/b) - \ln(c/d)$; (6) Rényi information divergence and f-divergences generally. The rule is also used in reverse to combine two separate log terms $\ln x - \ln y$ into a single $\ln(x/y)$ term, which simplifies gradient derivations and posterior computations.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Quotient rule: log_a(x/y) = log_a(x) - log_a(y)"] --> B["Derivation: x/y = x * y^(-1); apply product rule + power rule"] B --> C["log_a(x/y) = log_a(x) + log_a(y^(-1)) = log_a(x) - log_a(y)"] A --> D["Division becomes subtraction under log"] A --> E["Log-likelihood ratio: ln(L1/L2) = ln(L1) - ln(L2) — hypothesis testing"] A --> F["KL divergence: sum p_i * ln(p_i/q_i) = sum p_i*(ln p_i - ln q_i)"] A --> G["Logit: ln(p/(1-p)) = ln(p) - ln(1-p) — log-odds in logistic regression"] A --> H["Converse: ln(x) - ln(y) → ln(x/y) — combine log terms into single ratio"] A --> I["TRAP: requires x > 0 AND y > 0 — both arguments must be positive"]
```
### Real-World use:
#### Situation it is used
KL divergence in model evaluation: $D_{KL}(P \| Q) = \sum_{i} p_i \ln(p_i/q_i)$. Using the quotient rule: $= \sum_i p_i (\ln p_i - \ln q_i) = \mathbb{E}_P[\ln P] - \mathbb{E}_P[\ln Q]$. This decomposition separates the self-information of $P$ (negative entropy) from the cross-entropy $\mathbb{E}_P[\ln Q]$, clarifying the relationship $D_{KL}(P\|Q) = H(P, Q) - H(P)$. Logit function: $\text{logit}(p) = \ln(p/(1-p)) = \ln p - \ln(1-p)$, applied the quotient rule. The logit is the link function in logistic regression, mapping probabilities to log-odds.
#### Problem it solves
Likelihood ratios $L_1 / L_2$ can be astronomically large or small numbers. Computing them directly in floating-point risks overflow or underflow. Subtracting log-likelihoods $\ln L_1 - \ln L_2$ is numerically safe and produces the same comparison result (since $\ln$ is monotone increasing: $L_1 > L_2 \iff \ln L_1 > \ln L_2$).
#### How it solves the problem
From the product rule: $\log_a(x \cdot y^{-1}) = \log_a x + \log_a(y^{-1})$. From the power rule with $n = -1$: $\log_a(y^{-1}) = -\log_a y$. Therefore $\log_a(x/y) = \log_a x - \log_a y$. The key is recognizing $x/y = x \cdot y^{-1}$ and then applying two identities in sequence.
#### Example of it used in the Working Context as DA/DS for a Business
A data scientist performs a likelihood ratio test to decide between two competing models for customer churn. Model A has log-likelihood $\ln L_A = -342.7$; model B has $\ln L_B = -358.3$. The log-likelihood ratio is $\ln(L_A/L_B) = \ln L_A - \ln L_B = -342.7 - (-358.3) = 15.6$. The test statistic $2 \times 15.6 = 31.2$ exceeds the $\chi^2$ critical value, so model A is significantly better. Direct computation of $L_A/L_B = e^{15.6} \approx 5.9 \times 10^6$ would have been fine here but is infeasible for larger datasets.
### The Formula (Fragment-First)
Breaking the notation: - $\log_a$: logarithm base $a$ — applied to the quotient $x/y$.
- $x$: numerator — must be positive ($x > 0$).
- $y$: denominator — must be positive ($y > 0$). Note $y \ne 0$ is required for the quotient to exist.
- $\log_a x - \log_a y$: the result — subtraction of the logs, corresponding to division of the arguments. **Derivation chain** (showing the two-step origin):
$$\log_a\!\left(\frac{x}{y}\right) = \log_a(x \cdot y^{-1}) \xrightarrow{\text{product}} \log_a x + \log_a(y^{-1}) \xrightarrow{\text{power}} \log_a x - \log_a y$$ **Important applications**:
- Log-odds: $\ln\frac{p}{1-p} = \ln p - \ln(1-p)$.
- KL divergence term: $\ln\frac{p_i}{q_i} = \ln p_i - \ln q_i$.
- Likelihood ratio test: $\ln\frac{L_1}{L_2} = \ln L_1 - \ln L_2$.
- F-divergence: $\ln\frac{p(x)}{q(x)} = \ln p(x) - \ln q(x)$. **Reverse direction**: $\ln x - \ln y = \ln(x/y)$. Used to collapse a difference of logs into a single log-ratio, which is often more interpretable. **TRAP: both $x$ and $y$ must be positive**. Probabilities $p_i, q_i \in (0, 1]$ satisfy this, but $p_i = 0$ makes $\ln p_i = -\infty$. In KL divergence, the convention is $0 \ln(0/q) = 0$ (limit as $p \to 0^+$).
### Formula-to-English Translation
"$\log_a(x/y) = \log_a x - \log_a y$: the log of a quotient equals the difference of the logs. Division becomes subtraction. Use this to: convert likelihood ratios to log-likelihood differences (numerically stable model comparison); expand KL divergence $\ln(p/q)$ into $\ln p - \ln q$ for gradient computation; write logit as $\ln p - \ln(1-p)$. Reverse: subtract logs by combining into $\ln(x/y)$. TRAP: both arguments must be positive." ### Critical Concepts
1. **Derived from product and power rules**: the quotient rule is not independent — it follows from $\log_a(x/y) = \log_a x + \log_a(y^{-1}) = \log_a x - \log_a y$. Memorizing the derivation is more useful than memorizing the rule itself.
2. **Numerically stable model comparison**: always compare models via $\ln L_1 - \ln L_2$ rather than $L_1/L_2$ directly. The log-scale difference is numerically safe for any sample size; the raw ratio overflows or underflows for large $n$.
3. **Logit is a quotient rule application**: $\ln(p/(1-p))$ is the log of the odds ratio. Logistic regression models this as a linear function of features. The logit is the canonical link function for Bernoulli GLMs.
4. **KL divergence structure**: $D_{KL}(P\|Q) = \sum_i p_i(\ln p_i - \ln q_i) = -H(P) + H(P,Q)$, where $H(P)$ is entropy and $H(P,Q)$ is cross-entropy. This decomposition is immediate from the quotient rule.
5. **TRAP: $\ln(x - y) \ne \ln x - \ln y$**: subtraction inside the log is not the same as subtraction of logs. The quotient rule applies to $\ln(x/y)$ (a ratio), not $\ln(x - y)$ (a difference). These are completely different operations.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: compute the log-likelihood ratio for two Bernoulli models: $p_1 = 0.6$ vs $p_2 = 0.4$, given observations $[1, 1, 0, 1, 0]$. *Step 1: Compute each log-likelihood*
$\ln L_1 = 3\ln(0.6) + 2\ln(0.4) = 3(-0.5108) + 2(-0.9163) = -1.5325 - 1.8326 = -3.3651$.
$\ln L_2 = 3\ln(0.4) + 2\ln(0.6) = 3(-0.9163) + 2(-0.5108) = -2.7489 - 1.0217 = -3.7706$. *Step 2: Apply quotient rule for the log-likelihood ratio*
$\ln(L_1/L_2) = \ln L_1 - \ln L_2 = -3.3651 - (-3.7706) = 0.4055$. *Step 3: Interpret*
$L_1/L_2 = e^{0.4055} \approx 1.50$. Model 1 is about 1.5 times more likely than model 2. *Step 4: Verify directly*
$L_1 = 0.6^3 \times 0.4^2 = 0.216 \times 0.16 = 0.03456$.
$L_2 = 0.4^3 \times 0.6^2 = 0.064 \times 0.36 = 0.02304$.
$L_1/L_2 = 0.03456/0.02304 \approx 1.50$. ✓ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Quotient rule for logs: log_a(x/y) = log_a(x) - log_a(y)
import math
import numpy as np # Verify the quotient rule
print("Quotient rule: ln(x/y) = ln(x) - ln(y)")
pairs = [(6.0, 2.0), (100.0, 10.0), (0.8, 0.2), (5.0, 7.0), (math.e, 2.0)]
print(f"{'x':>8} {'y':>8} {'ln(x/y)':>10} {'ln(x)-ln(y)':>14} {'match':>6}")
for x, y in pairs: direct = math.log(x / y) rule_form = math.log(x) - math.log(y) print(f"{x:>8.4f} {y:>8.4f} {direct:>10.6f} {rule_form:>14.6f} {str(abs(direct - rule_form) < 1e-10):>6}") # Log-likelihood ratio test: two Bernoulli models
print("\nLog-likelihood ratio test: ln(L1/L2) = ln(L1) - ln(L2)")
obs = np.array([1, 1, 0, 1, 0, 1, 1, 0, 0, 1])
p1, p2 = 0.6, 0.35
n1, n0 = obs.sum(), (1 - obs).sum() ll1 = n1 * math.log(p1) + n0 * math.log(1 - p1)
ll2 = n1 * math.log(p2) + n0 * math.log(1 - p2)
log_lr = ll1 - ll2 # quotient rule: ln(L1/L2) = ln(L1) - ln(L2)
lr = math.exp(log_lr) # L1/L2 print(f" Observations: {n1} ones, {n0} zeros")
print(f" ln(L1) [p={p1}]: {ll1:.4f}")
print(f" ln(L2) [p={p2}]: {ll2:.4f}")
print(f" ln(L1/L2) = ln(L1) - ln(L2) = {log_lr:.4f}")
print(f" L1/L2 = e^{log_lr:.4f} = {lr:.4f}") # Logit: ln(p/(1-p)) = ln(p) - ln(1-p)
print("\nLogit: ln(p/(1-p)) = ln(p) - ln(1-p)")
probs = [0.1, 0.3, 0.5, 0.7, 0.9]
print(f"{'p':>6} {'ln(p/(1-p))':>14} {'ln(p)-ln(1-p)':>16} {'match':>6}")
for p in probs: direct = math.log(p / (1 - p)) rule_form = math.log(p) - math.log(1 - p) print(f"{p:>6.2f} {direct:>14.6f} {rule_form:>16.6f} {str(abs(direct - rule_form) < 1e-10):>6}") # KL divergence using quotient rule: sum p * (ln(p) - ln(q))
print("\nKL divergence: sum_i p_i * ln(p_i/q_i) = sum_i p_i * (ln(p_i) - ln(q_i))")
p_dist = np.array([0.4, 0.3, 0.2, 0.1])
q_dist = np.array([0.25, 0.25, 0.25, 0.25])
kl_direct = np.sum(p_dist * np.log(p_dist / q_dist))
kl_rule = np.sum(p_dist * (np.log(p_dist) - np.log(q_dist)))
print(f" KL(P||Q) direct: {kl_direct:.6f}")
print(f" KL(P||Q) rule: {kl_rule:.6f}")
print(f" Match: {abs(kl_direct - kl_rule) < 1e-10}")
```
#### Beginner friendly Example [R])
``` r
# Quotient rule in R: log_a(x/y) = log_a(x) - log_a(y) # Verify
cat("Quotient rule: ln(x/y) = ln(x) - ln(y)\n")
pairs <- list(c(6,2), c(100,10), c(0.8,0.2), c(5,7))
cat(sprintf("%-8s %-8s %-10s %-14s %s\n", "x", "y", "ln(x/y)", "ln(x)-ln(y)", "match"))
for (p in pairs) { x <- p[1]; y <- p[2] direct <- log(x / y) rule_form <- log(x) - log(y) cat(sprintf("%-8.4f %-8.4f %-10.6f %-14.6f %s\n", x, y, direct, rule_form, abs(direct - rule_form) < 1e-10))
} # Logit function
cat("\nLogit: ln(p/(1-p)) = ln(p) - ln(1-p)\n")
probs <- c(0.1, 0.3, 0.5, 0.7, 0.9)
for (p in probs) { direct <- log(p / (1 - p)) rule_form <- log(p) - log(1 - p) cat(sprintf(" p=%.1f direct=%.6f rule=%.6f match=%s\n", p, direct, rule_form, abs(direct - rule_form) < 1e-10))
} # KL divergence
p_dist <- c(0.4, 0.3, 0.2, 0.1)
q_dist <- c(0.25, 0.25, 0.25, 0.25)
kl <- sum(p_dist * (log(p_dist) - log(q_dist)))
cat(sprintf("\nKL(P||Q) using quotient rule: %.6f\n", kl))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd
import math
from scipy import stats # Scenario: likelihood ratio test comparing two logistic regression models
# Uses: ln(L1/L2) = ln(L1) - ln(L2) for numerically stable model comparison np.random.seed(42) N_SAMPLES = 600
N_FEATURES = 4 # Generate binary classification data
true_coefficients = np.array([0.5, -1.2, 0.8, -0.3])
feature_matrix = np.random.normal(0, 1, (N_SAMPLES, N_FEATURES))
log_odds = feature_matrix @ true_coefficients
true_probs = 1 / (1 + np.exp(-log_odds))
labels = np.random.binomial(1, true_probs) def sigmoid(x: np.ndarray) -> np.ndarray: """Sigmoid function: 1 / (1 + exp(-x)).""" return 1 / (1 + np.exp(-np.clip(x, -500, 500))) def log_likelihood_logistic( features: np.ndarray, labels: np.ndarray, coefficients: np.ndarray,
) -> float: """ Compute logistic regression log-likelihood. ln L(beta) = sum_i [y_i * ln(p_i) + (1-y_i) * ln(1-p_i)] = sum_i [y_i * ln(p_i/(1-p_i)) + ln(1-p_i)] -- quotient rule on p_i/(1-p_i) Args: features: Feature matrix (n_samples x n_features). labels: Binary labels (0 or 1). coefficients: Logistic regression coefficients. Returns: Log-likelihood value. """ probs = sigmoid(features @ coefficients) probs_clip = np.clip(probs, 1e-15, 1 - 1e-15) # avoid log(0) return float(np.sum( labels * np.log(probs_clip) + (1 - labels) * np.log(1 - probs_clip) )) # Three models to compare
null_coefs = np.zeros(N_FEATURES) # intercept-only (null model)
partial_coefs = np.array([0.5, -1.2, 0.0, 0.0]) # only first 2 features
full_coefs = true_coefficients.copy() # all 4 features (oracle) models = { "null (intercept only)": null_coefs, "partial (2 features)": partial_coefs, "full (4 features)": full_coefs,
} # Compute log-likelihoods and likelihood ratios
log_likelihoods = {name: log_likelihood_logistic(feature_matrix, labels, coefs) for name, coefs in models.items()} # Likelihood ratio test: compare each model to the null
null_ll = log_likelihoods["null (intercept only)"]
rows = []
for model_name, ll in log_likelihoods.items(): log_lr = ll - null_ll # quotient rule: ln(L/L0) = ln(L) - ln(L0) lr = math.exp(min(log_lr, 700)) # L/L0 — may be very large chi2_stat = 2 * log_lr df = N_FEATURES p_value = 1 - stats.chi2.cdf(chi2_stat, df) if chi2_stat > 0 else 1.0 rows.append({ "model": model_name, "log_likelihood": round(ll, 2), "log_LR_vs_null": round(log_lr, 4), # = ln(L) - ln(L_null) "chi2_stat": round(chi2_stat, 4), "p_value": round(p_value, 4), }) results_df = pd.DataFrame(rows) print("Likelihood ratio test: ln(L1/L2) = ln(L1) - ln(L2) (quotient rule)")
print("=" * 72)
print(results_df.to_string(index=False))
print(f"\nKL divergence (true vs null predictions):")
p_true_probs = sigmoid(feature_matrix @ full_coefs)
p_null_probs = sigmoid(feature_matrix @ null_coefs)
p_clip = np.clip(p_true_probs, 1e-15, 1 - 1e-15)
q_clip = np.clip(p_null_probs, 1e-15, 1 - 1e-15)
kl_div = np.mean(p_clip * (np.log(p_clip) - np.log(q_clip)) + (1-p_clip) * (np.log(1-p_clip) - np.log(1-q_clip)))
print(f" KL(full || null): {kl_div:.6f} (quotient rule: ln(p/q) = ln(p) - ln(q))")
```
#### Final Professional Example [R]
``` r
# KL divergence using quotient rule: ln(p) - ln(q) = ln(p/q) set.seed(42)
n <- 200
X <- cbind(1, matrix(rnorm(n * 3), ncol = 3))
full_coefs <- c(0.5, 0.3, -0.2, 0.1)
null_coefs <- c(0.5, 0, 0, 0)
sigmoid <- function(z) 1 / (1 + exp(-z))
p_true <- sigmoid(X %*% full_coefs)
p_null <- sigmoid(X %*% null_coefs)
p_clip <- pmax(pmin(p_true, 1 - 1e-15), 1e-15)
q_clip <- pmax(pmin(p_null, 1 - 1e-15), 1e-15)
kl_div <- mean(p_clip * (log(p_clip) - log(q_clip)) + (1 - p_clip) * (log(1 - p_clip) - log(1 - q_clip)))
cat(sprintf("KL(full || null): %.6f (quotient rule: ln(p) - ln(q))\n", kl_div))
```
---
1300 pag 20