---
code: "02-01-006"
kind: essay
date: "2026-10-30"
summary: "An experiment can be valid and still unnecessary. A worked example of the value of information, the cost of waiting and the choice to act."
lead: "Part 4 of 4 in Quantitative growth. A worked example of information value, delay and the choice to act."
tags: [ quantitative-growth, b2b-saas, decision-analysis, experimentation ]
lang: en
slug: value-of-a-better-decision
seo_title: "How much is a better decision worth?"
translationStatus: approved
publish: true
---

# How much is a better decision worth?

A decision has a deadline, its effect is uncertain, and the experiment that could settle it would consume the next quarter.

Asking whether the experiment can produce a statistically significant result addresses only part of the problem. The economic question is whether its possible results improve the decision enough to justify the cost and the wait. An experiment can be valid and unnecessary. It can also be too small to settle a scientific argument and still useful enough to change a limited commercial commitment.

The value comes from the decisions its evidence changes.

## Start with the choice available now

Take a deliberately small hypothetical model. There are two actions: commit to a change, or keep the existing policy. Over a fixed horizon, the change has two possible economic states:

| State | Current probability | Net incremental discounted gross profit if committed |
|---|---:|---:|
| Change works | 40% | +€120,000 |
| Change fails | 60% | −€40,000 |

The payoffs already include the change’s implementation and operating costs. Keeping the existing policy has zero incremental value in this comparison.

Under an expected-value objective, committing now yields:

$$
\mathbb{E}[G]
=0.40(120{,}000)+0.60(-40{,}000)
=24{,}000.
$$

That is the best current expected value, subject to the organisation’s risk and cash constraints. It is not a statement that success is probable: the assumed probability of the positive state is only 40%.

If losing €40,000 is unacceptable, a positive expected value does not authorise the commitment. A smaller pilot, a spending limit or a different action altogether can change the feasible choice set, and the calculation must represent those real options. For now, suppose both actions are feasible and expected value is the agreed criterion. That gives a baseline against which to price information.

## Perfect information sets a ceiling

With perfect information, the change is committed only in the positive state. Expected value becomes:

$$
0.40(120{,}000)+0.60(0)=48{,}000.
$$

The expected value of perfect information (EVPI) is therefore:

$$
\mathrm{EVPI}=48{,}000-24{,}000=24{,}000.
$$

No source of information can improve this decision by more than €24,000 before its costs. An expensive research proposal can fail that ceiling before anyone discusses the estimator.

In general, for state $\theta$, action $a$ and net incremental value $U(a,\theta)$:

$$
\mathrm{EVPI}
=\mathbb{E}_{\theta}
\left[\max_a U(a,\theta)\right]
-\max_a\mathbb{E}_{\theta}[U(a,\theta)].
$$

The order of expectation and maximisation changes. Perfect information lets the action depend on the state; without it, the choice rests on the current distribution. The same difference explains why information has no decision value when every possible revelation leaves the same action optimal. It may satisfy curiosity. It cannot improve this choice.

## A noisy result can still improve the decision

Now consider a cheaper study that returns a positive or a negative signal. Assume it gives a positive signal in 80% of positive states and a negative signal in 80% of negative states. These are hypothetical likelihoods, not a claim about the power of an unspecified A/B test; a real experiment needs its own sampling model and outcome distribution.

The probability of a positive signal is:

$$
P(+)=0.40(0.80)+0.60(0.20)=0.44.
$$

After a positive signal, Bayes’ rule gives:

$$
P(\mathrm{works}\mid+)
=\frac{0.40(0.80)}{0.44}
\approx72.7\%.
$$

Committing after that signal has an expected value of about €76,364. After a negative signal, the probability that the change works falls to about 14.3%, and committing has an expected value of about −€17,143.

The policy is therefore to commit after a positive signal and keep the existing policy after a negative one. Its expected value, before the signal is bought, is:

$$
\mathbb{E}[U\mid\mathrm{signal\ policy}]
=0.44(76{,}364)+0.56(0)
\approx33{,}600.
$$

Against the €24,000 available from the current decision:

$$
\mathrm{EVSI}=33{,}600-24{,}000=9{,}600.
$$

EVSI is the expected value of sample information. It averages over the possible evidence and the action that would follow each result. It is not the value of getting the result one hopes for. The general expression makes that structure explicit:

$$
\mathrm{EVSI}
=
\mathbb{E}_{Z}
\left[
\max_a\mathbb{E}_{\theta\mid Z}[U(a,\theta)]
\right]
-
\max_a\mathbb{E}_{\theta}[U(a,\theta)].
$$

The study result is $Z$. Its predictive distribution comes from the current beliefs and the study’s likelihood; the posterior determines the action that follows. An over-optimistic prior or likelihood can make a study look valuable when it is not, so a sensitivity analysis belongs beside the headline EVSI.

## Waiting belongs inside the calculation

Suppose the study costs €3,000 directly, and waiting adds €2,500 of opportunity cost beyond any delay already in the payoffs. Its expected net information value is:

$$
9{,}600-3{,}000-2{,}500=4{,}100.
$$

Under the stated assumptions, the study improves the decision by more than it costs.

The qualification about delay matters. If delayed cash flows or lost benefit are already part of $U(a,\theta)$, subtracting them again counts the wait twice. A detailed model can value the delayed policy directly instead of applying a separate charge for delay.

A larger study may provide more information and take longer. EVSI generally approaches a ceiling while expenditure and delay keep rising, so the best sample size for a decision can be smaller than the size that would make every uncertainty comfortable.

The same reasoning changes prioritisation. Research that informs several pending decisions can be valuable across the portfolio. Several experiments that depend on the same uncertain mechanism may expose the business to more correlated risk than their separate cards suggest. Neither effect shows up in a score assembled from arbitrary labels for impact, confidence and ease.

## The model must survive its own decisions

An operating system built on this reasoning leaves a record before the outcome arrives: the alternatives, the distribution of expected value, the important assumptions, the owner and the date of the later read. That record has two analytical uses.

First, it preserves the counterfactual under evaluation. A return to normal after a repair is not automatically its effect: seasonality, regression to the mean or another intervention can explain the same path. Holdbacks and other credible comparisons help tell them apart.

Second, it preserves the probability forecast before hindsight rewrites the story. A collection of forecasts can be assessed for calibration. For binary outcomes, the Brier score is:

$$
\mathrm{BS}
=\frac{1}{n}\sum_{i=1}^{n}(p_i-y_i)^2.
$$

Here $p_i$ is the probability recorded before the outcome and $y_i$ the realised outcome; lower is better. Reading the score still needs a suitable baseline and attention to which cases were forecast.

Forecast accuracy and causal effect are separate evaluations. A well-calibrated prediction does not show that a treatment caused a gain, and a useful treatment can produce a disappointing individual outcome. The record lets the next decision learn from both without confusing them.

Before committing, write down a switching value: the effect, cost or timing assumption at which the preferred action changes. If one plausible variation reverses the choice, that assumption deserves the next unit of analytical effort. If no feasible study result changes the decision, more precision has no value for this choice.

## The full book

![[b2b-saas-funnel-book-cover.jpg|300]]

*B2B SaaS Funnel Book: One Loop* develops these arguments across the whole customer system, with worked company cases, mathematical methods, measurement designs and companion Python and SQL. The four essays adapt its reasoning; their worked examples are hypothetical.

The downloads are the manuscript edition of 30 October 2026: 24 chapters, a glossary and five appendices, including the source-verification notes. The company cases in the book are invented teaching examples, and the final index follows the author’s review.

> [!download] Download the book
> - [[b2b-saas-funnel-book.pdf|PDF]] — 15 MB
> - [[b2b-saas-funnel-book.epub|EPUB]] — 6 MB

> [!bookmark]
> [Part 1 · When a better funnel produces a worse business](/en/writing/growth-without-value/) — the series from the start: the objective function comes before the dashboard.

Previous: [Part 3 · The evidence has its own clock](/en/writing/the-evidence-clock/).
