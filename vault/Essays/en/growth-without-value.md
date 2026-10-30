---
code: "02-04"
kind: essay
date: "2026-10-30"
summary: "A funnel that doubles its leads and halves their cost can still cut expected contribution by two thirds. The objective function comes before the dashboard."
lead: "Part 1 of 4 in Quantitative growth. The objective function comes before the dashboard."
tags: [ quantitative-growth, b2b-saas, measurement, customer-value ]
lang: en
slug: growth-without-value
seo_title: "When a better funnel produces a worse business"
translationStatus: approved
publish: true
---

# When a better funnel produces a worse business

A team doubles its leads and cuts its cost per lead by almost half. The dashboard improves. The expected contribution of the acquisition policy falls by two thirds.

There is no contradiction. The dashboard measures one part of a process; the business earns the result of the whole process.

Consider a hypothetical comparison over the same acquisition period. Customer value means expected discounted gross profit after delivery costs, before the acquisition expenditure shown separately:

| Quantity | Existing policy | Proposed policy |
|---|---:|---:|
| Leads | 1,000 | 2,000 |
| Eventual customer conversion | 10% | 4% |
| Expected customer value | €5,000 | €4,000 |
| Acquisition expenditure | €200,000 | €220,000 |
| Cost per lead | €200 | €110 |
| Expected new customers | 100 | 80 |
| Expected contribution after acquisition expenditure | €300,000 | €100,000 |

The second policy attracts a different population. Fewer leads become customers, and those customers have a lower expected retained value. Cheap leads are an intermediate result; their price says little without the rest of the path.

For this simplified comparison, expected contribution is:

$$
\Pi = LpV-C.
$$

Here $L$ is the number of leads, $p$ their eventual customer conversion, $V$ the conditional value of a customer and $C$ the acquisition expenditure. The arithmetic gives:

$$
\Pi_{\mathrm{existing}}
=1{,}000(0.10)(5{,}000)-200{,}000
=300{,}000,
$$

$$
\Pi_{\mathrm{proposed}}
=2{,}000(0.04)(4{,}000)-220{,}000
=100{,}000.
$$

These are assumed policy outcomes, not an effect identified from a dashboard. Establishing what a policy causes requires a comparison design. Before that question comes an equally important one: what quantity would make the comparison useful?

## Define the quantity that matters

An analyst can estimate the wrong target accurately. A conversion model can be well calibrated and still support a poor allocation. An experiment can identify an increase in sign-ups and leave the effect on contribution unresolved. The problem begins when the measured outcome becomes the objective by default.

For a recurring-revenue business, a useful economic target is the additional expected discounted gross profit caused by an action, less its incremental expenditure. Cash, capacity and acceptable downside then constrain the choice. This target forces an account of what happens after the first conversion.

One customer-value model is:

$$
V(x)=
\sum_{t=1}^{H}
\frac{S_t(x)\,g_t(x)}{(1+d)^t}.
$$

The customer has characteristics $x$. The horizon is $H$; the discount rate per period is $d$. Survival $S_t(x)$ is the probability that the customer is still active in period $t$. The quantity $g_t(x)$ is expected gross profit in that period, conditional on being active; it can include the expected revenue and delivery cost of expansion or contraction.

The formula is compact because its assumptions carry much of the work. Periods must match the discount rate. Survival must match the customer population. Costs already inside $g_t$ must not be subtracted again. If a policy changes usage, service cost or retention, its customer value has to change with them. A five-year horizon is a modelling choice, and so is the discount rate; neither becomes a property of the business because a spreadsheet contains it.

The opening example holds another distinction. Its $V$ is conditional on becoming a customer; its $p$ is the chance of getting there. Multiplying them is reasonable only if both refer to the same policy and population. Applying the historical average value to a newly acquired mix silently assumes away the very change that needs evaluating.

## Multiplication is not a behavioural model

A funnel identity writes customers as an initial volume multiplied by conditional stage rates:

$$
\mathbb{E}[N_{\mathrm{customers}}]
=L\prod_{j=1}^{J}p_j.
$$

This is useful accounting for a defined path. It does not guarantee that changing $L$ leaves every $p_j$ unchanged. An easier form can increase submissions and reduce qualification. A broader audience can increase reach and reduce intent. A new package can change conversion and the cost of serving the customers it brings. These are changes in the joint system, not independent improvements to isolated cells.

Even the simple product $pV$ needs care when it is estimated from heterogeneous populations. If both quantities vary by customer group, the group-level value is closer to $\mathbb{E}[p(X)V(X)]$ than to the product of two unrelated averages; the two coincide only under additional conditions. This is why cohort and segment definitions matter economically: they decide which probability belongs beside which value.

Suppose one segment converts quickly but leaves early, and another converts slowly and stays profitable for years. An analysis that rewards short-term conversion can steer acquisition systematically towards the first. The optimisation behaves as specified. The specification is poor.

## The average does not price the next unit

A channel can be profitable on average and unattractive at the margin.

Let $f(s)$ be the expected number of additional customers caused by spend $s$, against a defined alternative. In a simplified case with constant customer value $V$, no capacity limit and no other changing costs:

$$
\Pi(s)=Vf(s)-s,
\qquad
\frac{d\Pi}{ds}=Vf'(s)-1.
$$

The next euro creates value while its marginal discounted gross profit exceeds one euro. Average return, $Vf(s)/s$, does not establish that condition.

In practice $V$ can depend on spend too, because the audience mix changes. The derivative then has another term:

$$
\frac{d\Pi}{ds}
=V(s)f'(s)+f(s)V'(s)-1.
$$

The second term prices a change in customer quality. Ignoring it can make a response curve look more scalable than the customer population behind it.

Capacity breaks the calculation in another place. A seller can make only so many useful contacts; implementation takes time; a customer who waits may convert later or leave. The apparent acquisition return assumes that the organisation can deliver the customer path that $V$ represents. Those constraints belong in the model from the start, not after the campaign has been judged a success.

## Retention changes the acquisition decision

Annual recurring revenue (ARR) evolves through several streams:

$$
\mathrm{ARR}_{t+1}
=\mathrm{ARR}_{t}
+\mathrm{new}
+\mathrm{expansion}
-\mathrm{contraction}
-\mathrm{churn}.
$$

Returning customers, where they exist, need a separate and consistent treatment. ARR is a run-rate measure, not cash received or profit earned.

The identity connects acquisition to the customer book; the survival model connects the book to value. An early acquisition gain can therefore be undone by a later retention loss, even while the first conversion stays higher. This changes what an analyst asks to observe. A sign-up experiment needs a stable eligible population and a dated downstream read. A channel comparison needs customer outcomes at a common age. A pricing decision needs costs and retained contribution, not only the revenue realised among those who accepted.

The analytical task is to keep those connections while simplifying enough to decide. An exhaustive model is not required; a useful one makes its omissions visible. Start with the quantities most likely to reverse the recommendation (downstream conversion, survival, service cost, marginal response or the capacity constraint) and carry their uncertainty through the decision.

The opening policy wins on lead volume and cost per lead and loses on the stated economic target. Once the target is explicit, that disagreement is informative: it shows which part of the customer process the dashboard leaves out.

The next step is harder. Even with the right objective, it remains to establish which part of the observed value an action actually creates.

> [!bookmark]
> [Part 2 · A prediction is not an intervention effect](/en/writing/prediction-is-not-intervention/) — why the best prospects are not always the best use of a sales conversation.
