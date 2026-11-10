---
code: "02-01-004"
kind: essay
date: "2026-10-30"
summary: "The account most likely to buy may be the one that least needs a call. Targeting needs the effect of an action, not a forecast of the outcome."
lead: "Part 2 of 4 in Quantitative growth. Why the best prospects are not always the best use of a sales conversation."
tags: [ quantitative-growth, b2b-saas, causal-inference, experimentation ]
lang: en
slug: prediction-is-not-intervention
seo_title: "A prediction is not an intervention effect"
translationStatus: approved
publish: true
---

# A prediction is not an intervention effect

The account with the highest probability of buying may be the account that least needs a call.

That possibility matters whenever a model allocates scarce attention. A purchase forecast describes an outcome under existing conditions. A contact decision asks what changes when the conditions change.

The distinction holds for retention, advertising and onboarding alike. High churn risk does not establish that an offer will retain a customer. Credited revenue does not establish that an advertisement caused it. Early activation does not establish that accelerating an event will improve renewal. The useful analytical question is specific: which outcome, under which action, compared with which alternative?

## Name the estimand before fitting the model

Let $A=1$ mean that an eligible account receives a defined contact policy and $A=0$ that it receives the alternative policy. Let $Y(1)$ and $Y(0)$ be its outcomes under each. For a fixed observation horizon, $Y$ might indicate a purchase.

The conditional average treatment effect is:

$$
\tau(x)
=\mathbb{E}[Y(1)-Y(0)\mid X=x].
$$

The words *conditional average* matter. Both outcomes are never observed for the same account under the same circumstances. What can be estimated are differences for populations defined by pre-treatment characteristics; a model does not reveal an individual’s unobservable pair of outcomes.

If customer value is about the same under both actions and contact changes neither its timing nor its quality, a simplified contact gain is:

$$
G(x)=\tau(x)V(x)-c(x).
$$

Here $c(x)$ is the incremental cost of contact. If contact also changes the package, service cost, survival or time to purchase, the more general comparison applies:

$$
G(x)=
\mathbb{E}[\mathrm{DGP}(1)-\mathrm{DGP}(0)\mid X=x]
-c(x).
$$

DGP is discounted gross profit before the contact cost being subtracted; a cost already inside that outcome must not be charged twice. This is the quantity a targeting policy needs. Purchase probability can help estimate it, but cannot stand in for it.

Consider two hypothetical account groups, each with a customer value of €5,000 and an incremental contact cost of €100:

| Account group | Purchase with contact | Purchase without contact | Additional purchase probability | Expected contact gain |
|---|---:|---:|---:|---:|
| Likely buyers | 70% | 68% | 2 percentage points | €0 |
| More responsive group | 25% | 10% | 15 percentage points | €650 |

Under these assumptions, the group with the higher purchase probability gains nothing from contact:

$$
(0.70-0.68)(5{,}000)-100=0.
$$

The more responsive group yields:

$$
(0.25-0.10)(5{,}000)-100=650.
$$

These probabilities are assumed group-level effects, for illustration. Obtaining credible estimates of them is the identification problem, and the arithmetic does not solve it.

## The observed difference may be selection

A historical dataset often records a policy that already selected the promising accounts. Sellers chose whom to call. An account’s urgency influenced both whether it was contacted and whether it bought. Contacted and uncontacted groups therefore differed before the intervention, and the observational comparison

$$
\mathbb{E}[Y\mid A=1]-\mathbb{E}[Y\mid A=0]
$$

need not equal the average causal effect.

Random assignment among eligible accounts can identify the effect of assigning the specified policy, provided the experiment is run and observed properly. If some assigned contacts never happen, the effect of assignment and the effect of receiving contact become different estimands; dropping the non-compliant accounts does not recover the second.

The unit matters as well. Several people can take part in one buying decision, and randomising them separately lets treatment cross between arms. An account-level policy often needs account-level assignment and an analysis that respects that dependence.

An observational design can help when randomisation is unavailable. Its credibility rests on assumptions such as adequate control of measured confounding and overlap between the treatment groups; neither a large sample nor a flexible model establishes them. Start with the decision population and the treatment definition. A cleaner model of a different population still answers a different question.

## Exploration and causal comparison do different work

Once a score controls contact, future training data reflect that score’s choices. If outcomes are observed only for contacted accounts, low-ranked accounts become a blind spot.

A random contacted sample below the threshold reveals their outcomes under contact. That is useful exploration, and when it is combined with groups sampled more often, its selection probabilities matter. The sample alone does not identify the effect of contact: it supplies observations under one action only. Estimating the difference also needs a comparison under the alternative action, ideally by random assignment where that is feasible.

Billing and identity reconciliation can sometimes reveal purchases among uncontacted accounts. That improves outcome coverage. It does not make their historical lack of contact random.

A sound learning design asks two separate questions: where is the current policy hiding outcomes, and what comparison identifies the action’s effect? The data collected for one can support the other, but they are not interchangeable.

## Attribution has the same problem in another form

Suppose a hypothetical channel costs €50,000 and is credited with 20 customers worth €5,000 each. Its credited value per euro is:

$$
R_{\mathrm{credited}}
=\frac{20(5{,}000)}{50{,}000}
=2.
$$

Now suppose a credible experiment shows that only 30% of the credited value is incremental. The incremental return is $0.30\times2=0.60$: the channel produces €30,000 of additional discounted gross profit for €50,000 of expenditure, a net loss of €20,000. The break-even incremental share is:

$$
q_{\text{break-even}}
=\frac{1}{R_{\mathrm{credited}}}
=50\%.
$$

Multiplying a credited return by an incremental share is a simplified reconciliation. The share must describe incremental *value*, or the credited customers must have comparable values; a share measured in conversion counts can mislead when the customers the channel causes are worth something different.

Attribution remains useful as a consistent reporting convention. A holdout or another credible causal comparison supplies evidence about what changes when the spend changes. They are two different jobs for one measurement system.

## The constraint decides how effects become a policy

Even credible treatment-effect estimates do not allocate a sales team by themselves.

Let $x_i$ indicate whether account $i$ is contacted, with $x_i\in\{0,1\}$. Let $G_i$ be its expected incremental net gain, $h_i$ the time it requires and $H$ the time available. A simplified allocation is:

$$
\max_{x}\sum_i x_iG_i
\quad\text{subject to}\quad
\sum_i x_ih_i\le H.
$$

If every contact takes the same time and contacts do not interact, ranking the positive gains implements the allocation. With unequal durations and indivisible appointments, gain per hour is a useful indicator but not, in general, an exact solution to the selection problem.

Uncertainty matters too. A high estimated gain based on sparse observations can displace a well-understood alternative. Exploration can have future information value, but that value needs an explicit place in the decision rather than an unlimited claim on capacity.

The same structure applies to a retention offer. The target is the additional retained value after the offer’s cost, not the customers most likely to leave. Measure outcomes beyond the end of the offer, so that a deferred departure is not mistaken for a prevented one.

A purchase model can be excellent at forecasting revenue. A treatment model can be useful for deciding where an intervention pays. The measurement system has to say which claim each model can support, and the allocation has to translate that claim into the scarce resource it consumes.

That translation depends on evidence arriving in time. In a recurring-revenue business it often does not arrive on the dashboard’s timetable.

> [!bookmark]
> [Part 3 · The evidence has its own clock](/en/writing/the-evidence-clock/) — cohort age, competing outcomes and statistical resolution decide what a result can mean.

Previous: [Part 1 · When a better funnel produces a worse business](/en/writing/growth-without-value/).
