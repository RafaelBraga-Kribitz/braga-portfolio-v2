---
code: "02-06"
kind: essay
date: "2026-10-30"
summary: "A reporting period can end before the outcomes inside it have had time to occur. Cohort age, competing outcomes and statistical resolution decide what a result can mean."
lead: "Part 3 of 4 in Quantitative growth. Cohort age, competing outcomes and statistical resolution decide what a result can mean."
tags: [ quantitative-growth, b2b-saas, experimentation, survival-analysis ]
lang: en
slug: the-evidence-clock
seo_title: "The evidence has its own clock"
translationStatus: approved
publish: true
---

# The evidence has its own clock

A reporting period can end before the outcomes inside it have had a chance to occur.

This sounds obvious. It is still easy to compare a new cohort with an older one, count unfinished opportunities as failures, and read the resulting difference as a change in performance. The dataset is available; the evidence is not yet mature.

Before estimating an effect, reconstruct the observation process: who entered, when the clock started, which events remained possible and how long each account was observed. Those definitions determine the statistical object. They also determine whether the result can inform the intended action.

## Compare ages before comparing rates

A period rate often divides the wins recorded this month by the opportunities created this month. The numerator can contain older opportunities; the denominator can contain opportunities whose outcomes are months away. That ratio can serve a narrow operational purpose. It is not the conversion probability of this month’s new opportunities.

A cohort estimate follows the same entrants from a common time origin. At age $a$ the question becomes: what share has converted by that age? Comparing cohorts at a common age separates the time available to convert from the behaviour under study.

Open opportunities are right-censored when observation ends before an outcome. They contribute information for the time they were observed; counting them as lost throws that distinction away.

There is a further complication. A lost deal cannot later win within the same defined journey: win and loss are competing outcomes. If losses are treated as ordinary independent censoring in a win-only survival curve, the estimate can overstate the practical probability of winning. In a discrete-time model, the cumulative incidence of winning is:

$$
F_{\mathrm{win}}(a)
=\sum_{u\le a}
S_{\mathrm{open}}(u^-)\,
h_{\mathrm{win}}(u).
$$

Here $S_{\mathrm{open}}(u^-)$ is the probability of still being open just before interval $u$, having experienced neither exit, and $h_{\mathrm{win}}(u)$ is the probability of winning in that interval given that the opportunity is still open. Losses shrink the pool that can later win.

The same reasoning applies to activation before departure. Departure is a competing event if it prevents activation in the defined journey. The reporting cut-off creates administrative censoring when neither event has happened and the account remains eligible.

A median time to activation among eventual activators describes a selected group; it says nothing about how many entrants activate. A faster median can coexist with more departures. A useful decision view needs both the timing and the probability of reaching the outcome.

## A variable can contain tomorrow’s information

Time enters the definition of features as well as of outcomes.

Suppose a model will trigger help at a fixed assessment age. Its features must describe what was known by that age. An eventual-activation flag can include events that happen later, and using it to evaluate an earlier decision hands the model information the practitioner did not have.

Outcome-derived features leak in the same way. The final deal stage, the eventual discount or a loss reason can describe the outcome better than they predict it at the time of the decision.

Define an as-of date for every prediction. Separate the feature window from the outcome horizon. Keep the history needed to rebuild those windows: a current-state customer table may not be enough, because it rewrites what an account looked like when the decision was taken.

Activation definitions need their own validation discipline. Choosing the event and deadline that best separate renewal on one dataset, then reporting that separation as validation, rewards the search. Choose the definition on development cohorts, fix the assessment age, and test it on later cohorts. That later test evaluates predictive usefulness. An intervention designed to accelerate activation still needs evidence about what it causes, as [Part 2](/en/writing/prediction-is-not-intervention/) explains.

## More rows do not guarantee a readable difference

Once the population and observation windows are right, sampling variation remains. The relevant volume is the number of sufficiently independent eligible units contributing to the estimand. Visitors, people and accounts are not interchangeable denominators.

Consider a hypothetical account-level experiment meant to distinguish conversion of 20% from 24%: a difference of four percentage points, or a 20% relative increase. For equal arms, a common normal-approximation calculation is:

$$
n=
\left\lceil
\frac{
\left[
z_{1-\alpha/2}\sqrt{2\bar p(1-\bar p)}
+z_{1-\beta}
\sqrt{p_0(1-p_0)+p_1(1-p_1)}
\right]^2
}{
(p_1-p_0)^2
}
\right\rceil,
$$

where $\bar p=(p_0+p_1)/2$, $\alpha$ is the two-sided false-positive rate and $1-\beta$ the desired power.

At 5% significance and 80% power, the calculation gives **1,683 accounts per arm**. The normal approximation assumes independent accounts, adequate counts and the specified fixed analysis; it is not an exact finite-sample guarantee.

If 300 eligible accounts arrive every 28 days and are split equally, filling both arms takes:

$$
T_{\mathrm{flow}}
=\frac{2(1{,}683)}{300}\times28
\approx314\text{ days}.
$$

If the analysis also needs every entrant to reach a 73-day assessment horizon, the final read arrives after about $314+73=387$ days. These flow and horizon figures are hypothetical. A suitable time-to-event design can use incomplete follow-up differently; it cannot make outcomes that have not yet happened known.

This calculation changes the decision. A quarterly experiment schedule does not make that effect resolvable within a quarter. The options include a larger intervention, another defensible outcome, more eligible traffic, a different design or a smaller commitment made under explicit uncertainty. None guarantees a convenient answer.

Repeated observations within accounts need further care. A familiar approximation for clusters of similar size is:

$$
D=1+(m-1)\rho.
$$

Here $m$ is the number of observations per cluster and $\rho$ the within-cluster correlation. The design effect $D$ shows why counting correlated users as independent overstates the information. Unequal cluster sizes and more complex designs can need a more detailed calculation.

## A falling average can hide rising segment rates

Not every apparent change comes from immature data or noise. Sometimes the population has changed. Consider a separate hypothetical comparison:

| Segment | Period 1 accounts | Period 1 conversion | Period 2 accounts | Period 2 conversion |
|---|---:|---:|---:|---:|
| A | 900 | 20% | 100 | 22% |
| B | 100 | 5% | 900 | 6% |

Both segment rates rise. The aggregate falls from

$$
\frac{900(0.20)+100(0.05)}{1{,}000}
=18.5\%
$$

to

$$
\frac{100(0.22)+900(0.06)}{1{,}000}
=7.6\%.
$$

The mix moved towards the lower-converting segment. An alarm on the aggregate would be right about the total and incomplete about its cause.

Decomposing mix and within-segment behaviour shows which question to investigate. It does not show that a particular intervention caused the within-segment change; that still needs the comparison discussed in Part 2.

At small volumes, segment estimates can be unstable. Partial pooling can improve estimation when groups are comparable enough: noisy group estimates are pulled harder towards a shared distribution. It expresses an assumption about related groups. It does not justify pooling different mechanisms to obtain a narrower interval.

The observation clock, the population mix and the available information place real limits on what a result can support. A wide interval can be the most accurate description of those limits.

The business still has to choose. The next question is how much it is worth paying to narrow the uncertainty before choosing.

> [!bookmark]
> [Part 4 · How much is a better decision worth?](/en/writing/value-of-a-better-decision/) — a worked example of information value, delay and the choice to act.

Previous: [Part 2 · A prediction is not an intervention effect](/en/writing/prediction-is-not-intervention/).
