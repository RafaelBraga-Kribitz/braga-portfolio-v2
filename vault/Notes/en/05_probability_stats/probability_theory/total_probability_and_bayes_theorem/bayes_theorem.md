---
title: Bayes' Theorem
date: '2026-04-16'
wordCount: 488
slug: bayes_theorem
permalink: /notes/05_probability_stats/probability_theory/total_probability_and_bayes_theorem/bayes_theorem/index.html
share_status: draft
publish_target: note
boundary: public
---
# $P(B \mid A) = \frac{P(A \mid B)P(B)}{P(A)} = \frac{P(A \mid B)P(B)}{P(A \mid B)P(B) + P(A \mid B^c)P(B^c)}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Bayes' Theorem allows you to invert a conditional probability: given $P(A \mid B)$ (likelihood), $P(B)$ (prior), and $P(A)$ (evidence), it yields the posterior $P(B \mid A)$. This is the mathematical engine of Bayesian inference, Naive Bayes classifiers, probabilistic spam filters, and any sequential belief updating.
### Flowchart (Mermaid)
``` mermaid
flowchart LR A["Prior: P(B) = belief before seeing A"] --> D["Bayes: posterior = likelihood * prior / evidence"] B["Likelihood: P(A|B) = how well B explains A"] --> D C["Evidence: P(A) = normalizing constant"] --> D D --> E["Posterior: P(B|A) = updated belief"]
```
### Real-World use:
#### Situation it is used
Naive Bayes spam detection. Bayesian A/B testing (updating posterior from data). Medical test interpretation ($P(\text{disease} \mid \text{positive test})$). Bayesian linear regression parameter estimation.
#### Problem it solves
You observe $A$ (data, test result, evidence) and want to know how probable hypothesis $B$ is. You have the inverse: how likely $A$ is given $B$ is true.
#### How it solves the problem
Inverts the conditional using the chain rule: $P(A \mid B) P(B) = P(A \cap B) = P(B \mid A) P(A)$. Solve for $P(B \mid A)$.
#### Example of it used in the Working Context as DA/DS for a Business
A medical test for a rare condition (prevalence 1%): sensitivity $P(+\mid D) = 0.95$, specificity $1 - P(+\mid D^c) = 0.95$. $P(D \mid +) = 0.95 \times 0.01 / (0.95 \times 0.01 + 0.05 \times 0.99) \approx 0.16$. Only 16% posterior even with a positive test — base rate dominates.
### The Formula (Fragment-First)
$P(B \mid A) = \frac{P(A \mid B) \cdot P(B)}{P(A)}$
- **Posterior** $P(B \mid A)$: updated belief about $B$ after observing $A$.
- **Likelihood** $P(A \mid B)$: how probable is the evidence under hypothesis $B$?
- **Prior** $P(B)$: belief about $B$ before seeing the evidence.
- **Evidence** $P(A)$: total probability of observing $A$ (normalizing constant). Expanded denominator: $P(A) = P(A \mid B)P(B) + P(A \mid B^c)P(B^c)$ — the Law of Total Probability.
### Formula-to-English Translation
"Posterior is proportional to likelihood times prior, normalized by the evidence." Shortened: "Posterior ∝ Likelihood × Prior." ### Critical Concepts
- Base rate fallacy: ignoring $P(B)$ leads to wildly wrong posteriors.
- $P(B \mid A) \neq P(A \mid B)$ — this asymmetry is critical.
- Conjugate priors: choosing priors such that the posterior has the same distribution family (e.g., Beta-Binomial).
- MAP estimate: maximizes the posterior; reduces to MLE when prior is uniform.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Spam filter example*
P(spam) = 0.20 (prior), P("free" | spam) = 0.50 (likelihood), P("free") = 0.10 + 0.50×0.20 = 0.20... let's compute: *Step 2: P("free") via total probability*
$P("free") = P("free" \mid \text{spam}) P(\text{spam}) + P("free" \mid \text{ham}) P(\text{ham})$
$= 0.50 \times 0.20 + 0.05 \times 0.80 = 0.10 + 0.04 = 0.14$ *Step 3: Apply Bayes*
$P(\text{spam} \mid "free") = \frac{0.50 \times 0.20}{0.14} = \frac{0.10}{0.14} \approx 0.714$ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
def bayes_theorem(likelihood: float, prior: float, evidence: float) -> float: """Compute P(B|A) = P(A|B) * P(B) / P(A).""" return (likelihood * prior) / evidence # Spam filter: P(spam | contains "free")
p_spam = 0.20
p_free_given_spam = 0.50
p_free_given_ham = 0.05
p_ham = 1 - p_spam p_free = p_free_given_spam * p_spam + p_free_given_ham * p_ham
posterior = bayes_theorem(p_free_given_spam, p_spam, p_free)
print(f"P(spam | 'free') = {posterior:.4f}") # ~0.714
```
#### Beginner friendly Example [R])
``` r
p_spam <- 0.20; p_free_spam <- 0.50; p_free_ham <- 0.05
p_free <- p_free_spam * p_spam + p_free_ham * (1 - p_spam)
posterior <- (p_free_spam * p_spam) / p_free
cat(sprintf("P(spam | 'free') = %.4f\n", posterior))
```
#### Final Professional Example [Python])
``` python
import numpy as np def bayesian_update( prior: float, likelihood_h1: float, likelihood_h0: float,
) -> dict[str, float]: """Bayesian belief update for binary hypothesis. Computes posterior P(H1|data) via Bayes' theorem. Args: prior: P(H1), prior probability of hypothesis H1. likelihood_h1: P(data|H1), likelihood under H1. likelihood_h0: P(data|H0), likelihood under H0. Returns: Dict with evidence, posterior, and Bayes factor. """ p_h0 = 1 - prior evidence = likelihood_h1 * prior + likelihood_h0 * p_h0 posterior = (likelihood_h1 * prior) / evidence bayes_factor = likelihood_h1 / likelihood_h0 return { "prior": prior, "evidence": evidence, "posterior": posterior, "bayes_factor": bayes_factor, "posterior_odds": posterior / (1 - posterior), } # Sequential Bayesian updating: A/B test
N_TRIALS = 10
TRUE_RATE = 0.12
prior_h1 = 0.50
rng = np.random.default_rng(seed=42)
observations = rng.binomial(1, TRUE_RATE, N_TRIALS) current_prior = prior_h1
print("Sequential Bayesian update (H1: rate=0.12, H0: rate=0.06):")
for step_idx, obs in enumerate(observations): result = bayesian_update( prior=current_prior, likelihood_h1=0.12 if obs == 1 else 0.88, likelihood_h0=0.06 if obs == 1 else 0.94, ) current_prior = result["posterior"] print(f" Trial {step_idx+1}: obs={obs} | posterior={result['posterior']:.4f} | BF={result['bayes_factor']:.2f}")
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
AIO pag 84