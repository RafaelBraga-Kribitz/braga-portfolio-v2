---
code: "02-01-007"
kind: essay
date: "2026-10-30"
summary: "A review of the John Little Festschrift, fifteen chapters on making marketing models that managers use, and an opinionated 2027 update to its chapter on strategic marketing metrics."
lead: "A review of From Little’s Law to Marketing Science (MIT Press, 2015), with a 2027 update to Chapter 3, “Strategic marketing metrics to guide pathways to growth”."
tags: [ book-review, marketing-science, measurement, customer-value, decision-analysis ]
lang: en
slug: from-littles-law-to-marketing-science-review
seo_title: "From Little’s Law to Marketing Science: a review and a 2027 update"
translationStatus: approved
publish: true
---

# From Little’s Law to Marketing Science, reviewed: what Chapter 3 still gets right, and what 2027 changes

*From Little’s Law to Marketing Science: Essays in Honor of John D. C. Little*, edited by John R. Hauser and Glen L. Urban, was published by MIT Press in 2015. It is a Festschrift, and Festschrifts are usually read in fragments by specialists. This one deserves more readers than that, particularly analysts who came to data science from marketing, as I did. It has fifteen chapters in three parts: managerial models, decision information models, and a return to Little’s Law itself. This review covers all of them, then spends most of its length on the chapter I think matters most for 2027: Chapter 3, by John H. Roberts, Rajendra Srivastava and Pamela D. Morrison.

## Why the book is worth reading

Little’s profile (Chapter 1, by the editors) is the best argument for the book. It is the story of a physicist who chose operations research because, in his words, he was “searching for a field with a lot of unsolved hydrogen atoms”, and then found them in marketing. Two passages earn the book its place on an analyst’s shelf.

The first is the opening sentence of Little’s 1970 paper on decision calculus: “The big problem with management science models is that managers practically never use them.” His answer was not a better estimator but a design brief: models should be “simple, robust, easy to control, adaptive, complete on important issues, and easy to communicate with”, and the model builder “should try to design his models to be given away”. Half a century later, that is still the most useful standard I know for an analytics deliverable.

The second is his 1966 adaptive-control idea, described in the profile: hold a few markets above and a few below the presumed optimal advertising rate, measure the response, reset the rate, and choose the number of test markets to maximise total profit *including the cost of the experiment*. Geo experiments, holdouts and the value of information are all already there. Little was pricing experimentation in 1966.

The thirteen research chapters that follow carry his two habits: rigorous models, and the insistence that someone must be able to use them.

### Part I: managerial models

- **Chapter 2**, Danaher, Lee and Kerbache on optimal internet media selection (first published in *Marketing Science*, 2010), is a model of applied operations research: a multivariate negative binomial model of page views across websites, a budget function built for the way online impressions are actually sold, and an optimiser that finds in 0.04 seconds the schedule that complete enumeration needed sixty-eight hours to find.
- **Chapter 3**, the subject of the rest of this review, asks which metrics a chief executive needs to manage growth.
- **Chapter 4**, Drèze and Bonfrer, shows that maximising customer lifetime value (CLV) is not the same as maximising customer equity (CE), the value of all current and future customers. A firm that optimises CE spends less on acquisition, keeps customers longer and earns more. Anyone who still sets acquisition budgets as a fraction of average CLV should read it.
- **Chapter 5**, Makoto Abe, recovers purchase rate, lifetime and spending from recency, frequency and monetary value (RFM) with a hierarchical Bayesian model, and finds that recency alone does not identify good customers, although many companies use it that way.
- **Chapter 6**, Masahiko Yamanaka, is the one chapter by a practitioner: how his firm built a neutral service on daily point-of-sale data for Japanese manufacturers, wholesalers and retailers, including a model of the joint effect of television advertising and in-store promotion. It reads more as a company account than as research, and it is valuable for exactly that reason: it shows what Little’s scanner-data revolution became in operation.
- **Chapter 7**, Montoya, Netzer and Jedidi, models physicians’ prescribing as movement between hidden states and plans detailing and sampling with a partially observable dynamic program. Detailing works as an acquisition tool, sampling as a retention tool, and the dynamic policy is more profitable than the current one while spending 20% less.
- **Chapter 8**, Urban, Liberali, MacDonald, Bordley and Hauser, tests “morphing” banners, which change to match a visitor’s inferred cognitive style, on 116,168 CNET consumers and 451,524 banner impressions. Click-through rates rose by 83–97% over context matching alone; a separate automotive experiment showed gains in brand consideration and purchase intention. The allocation rule is an expected Gittins index: a bandit that learns while it earns.

### Part II: decision information models

- **Chapter 9**, Hauser, Toubia, Evgeniou, Befurt and Dzyabura, models how consumers screen products into a consideration set with “disjunctions of conjunctions”: simple rules of the form “feature A and feature B, or feature C”. It opens with a fact every brand manager should know: in 2008 roughly half of US consumers would not even consider a Buick, whatever its dependability ratings. The chapter is also honest about its limits: a machine-learned additive model came within one to two percentage points of the best hit rate.
- **Chapter 10**, Valentini, Montaguti and Neslin, shows that customers’ channel choice is a moving target. Shortly after acquisition, a segment of “learners” (22% of a book club’s new customers) responds to marketing; later, habit and preference take over. In the authors’ policy simulation, moving learners early to the cheapest channel, the internet, raised the company’s profits by about 24%.
- **Chapter 11**, Moe and Trusov, separates the part of online product ratings that reflects the product from the part produced by earlier ratings, and finds that these social dynamics move sales through the average rating, although briefly. The authors themselves call for experiments to establish causality.
- **Chapter 12**, Mayzlin and Shin, explains why so much advertising says nothing about the product (37.5% of US television advertising, by one count). In their model, a firm whose product will survive scrutiny can rationally make no specific claim at all and leave consumers to search: a vague advertisement becomes an invitation to search, and a credible signal of quality. It is the most elegant theory chapter in the book.
- **Chapter 13**, Salisbury and Feinberg, shows that a well-known behavioural result, more variety chosen when choices are made in advance, can arise from a mis-specified error term rather than from preferences. If the variance of the noise differs between conditions, a model that assumes it is constant will invent effects.

### Part III: Little’s Law, today

- **Chapter 14**, Ceprini and Little, applies the generalised form of Little’s Law to the management of an investment portfolio. It is a working prototype, run on one customer profile and a short history of prices, and it is the weakest chapter as evidence; it is also touching to see Little, at eighty-six, return to the law that bears his name.
- **Chapter 15** is the editors’ short closing tribute.

> [!bars] Fig. 1 · Online reach on a fixed budget
> Optimising the schedule, then capping frequency over four weeks, lifts reach from 15.5% to 31.4%.
> - Largest site — 15.5
> - Top five — 19.5
> - Optimal 1 wk — 21.8
> - Optimal 4 wk — 31.4
>
> scale: 0–50 · unit: % · accent: Optimal 4 wk
> caption: Reach of a $50,000 display campaign across ten South Korean websites: the whole budget on the largest site; a week on each of the top five; the optimised one-week schedule; the optimised four-week schedule with a frequency cap of five. Scale 0–50%.
> source: Danaher, Lee and Kerbache, Chapter 2, table 2.2a and section 2.5.1 (KoreanClick panel, March 2003).

The figure makes Chapter 2’s managerial point better than any summary. The intuitive schedule, a week on each of the five most popular sites, reaches 19.5% of the audience where the optimised one costs no more and reaches 21.8%; and the largest gain, from capping frequency over four weeks, costs nothing extra at all.

The weaknesses are the ones a Festschrift inherits. Most chapters are reprints or close relatives of journal papers, so the data are old (Chapter 2’s panel is from 2003, before mobile and programmatic buying), and the book has no unifying thread beyond Little himself: the reader has to draw the connections. Chapter 3 proposes metrics without testing any of them, and Chapter 14 is a prototype. None of that diminishes the ideas. It does mean the reader has to do the updating, which is what the rest of this review attempts for Chapter 3, using the other chapters as evidence wherever they can serve.

## What Chapter 3 actually argues

Chapter 3 is easy to misremember as the familiar chain from marketing actions to customer perceptions, behaviour and financial results. It is not that chapter. Its subject is more uncomfortable: why marketing metrics have so little to say to a chief executive.

The diagnosis is precise. Most metrics research optimises existing products in mature markets, where response is stable and data are plentiful. Chief executives think about **net growth**: where the next earnings will come from and how risky they are. The authors cite a McKinsey survey in which close to three in four CEOs agreed that marketers “are always asking for more money, but can rarely explain how much incremental business this money will generate”. Their remedy is to measure where change actually comes from.

**Accountability has four parts.** Figure 3.1 splits it into inputs, outputs (immediate returns and the market-based assets created), the efficiency of conversion, and the external environment. The authors note that three popular metrics books list 165 metrics between them, of which seven describe the environment.

**In mature markets, decompose and compare.** Profit is unit sales times margin, less fixed and marketing costs, and unit sales are industry size times market share:

$$
\pi = S\,(p-v)-F-C,\qquad S = I\,M.
$$

Growth can only come from the category, from share or from margin. Brand equity is the sum of a product’s profits across customers; customer equity, the sum of a customer’s profits across products. And the useful comparison is not return on marketing investment (ROMI) against spending nothing, but return on *incremental* marketing investment (ROIMI) against plans with 20% more and 20% less.

**Outside maturity, the scorecard must be unbalanced.** Markets in growth or decline need different metrics, different business models and different hurdle rates. The chapter proposes profit persistence,

$$
P_t=\frac{\pi_t}{\pi_{t-1}},
$$

above one in growth, near one in maturity and below one in decline; a Bass diffusion model whose market size $m$ and speed parameters $p$ and $q$ depend on marketing spend; and a decline curve whose residual level and rate of loss do too. The chief executive’s questions become three: how big will this get, how fast, and how does that answer change with the resources committed?

**Beyond the core, size times share times fit.** New products and new markets are sized as an opportunity multiplied by the share the firm can win, which depends on how well its market-based assets (brands, customers, channels) transfer. Here the chapter introduces “customer platforms”, the demand-side counterpart of product platforms.

**Across the portfolio, balance is endogenous.** The share of future earnings from new products is not a target to copy from 3M; its right level follows from the returns and risks on each side. The authors also name two biases that starve growth: accounting conservatism, which prefers verifiable low-variance income, and managers’ comfort with the familiar.

## What has aged well

**ROIMI over ROMI.** Asking what the last 20% of spend returns, rather than what all of it returns against nothing, is the marginal reasoning that most marketing dashboards still lack. It is the same argument as the [first essay of my Quantitative growth series](/en/writing/growth-without-value/): the average does not price the next unit.

**The unbalanced scorecard.** Holding a growth business and a harvested one to the same return-on-investment yardstick still starves the first and over-funds the second. That sentence could appear unchanged in a 2027 planning memo.

**Volatility and persistence as value.** The chapter asks for metrics that reward lower volatility and, in passing, for the “percentage of profits from recurring business”. A decade later, recurring revenue and its retention are what investors read first in a software company. The authors saw the metric before the business model made it famous.

**Endogenous targets.** Refusing to set the new-product share of earnings by imitation is still a rare discipline.

## What 2027 changes

The framework holds. What has changed is how its quantities can be measured, and which of its assumptions have become the risky ones.

### Response functions are causal estimands, not regressions

Every metric in the chapter rests on a response function: $p(C)$, $q(C)$ and $m(C)$ in growth, the residual level and decay rate in decline, the ±20% plans in maturity. The chapter is optimistic about calibrating them (“we know quite a lot”) and mostly points to econometric work on historical data.

In 2027 that is the weak point. Historical spend is set by managers who respond to the market, so a regression of sales on spend mixes the effect of marketing with the reasons it was spent. The 2027 version of the chapter would say: estimate ROIMI as a causal quantity, with geo experiments and holdouts where they are affordable, and use Bayesian marketing-mix models with priors calibrated to those experiments where they are not. Open-source tools for both (Meta’s Robyn, Google’s Meridian, PyMC-Marketing) have made this ordinary practice. Little’s 1966 adaptive control, which priced its own test markets, turns out to be the template.

The book itself shows how far that template had travelled by 2015. Chapter 8’s morphing banners learn the response of each segment while serving it, with a Gittins-index policy that, as its authors argue, beats setting aside a fixed sample for a test. Chapter 7 estimates the long-term effect of detailing and sampling on each physician and finds that the profit-maximising dynamic policy spends 20% less than the firm did. A 2027 Chapter 3 would treat its ±20% plans the same way: not as two scenarios for a planning meeting, but as arms of a continuing experiment. And Chapter 13 adds a warning for whoever fits the models: when the noise differs between conditions, a model that assumes it is constant can manufacture effects. Uncertainty is part of the model, not its residue.

### Put uncertainty in the cash flows, not in the discount rate

The chapter recommends higher discount rates for markets in growth and decline, because they are less certain. I would drop that advice. A risk premium for uncertainty that is largely specific to the product, and diversifiable across a portfolio, punishes exactly the opportunities the chapter wants to protect; the authors themselves note that new activities may lower the portfolio’s diversifiable risk. The better 2027 practice is to carry the uncertainty explicitly: scenarios, distributions of outcomes, real options, and the expected value of the information that would narrow them. The chapter’s own call for real-options thinking points there; the [fourth essay of my series](/en/writing/value-of-a-better-decision/) works one such calculation through.

### The life cycle now runs through cohorts

The chapter’s product-market life cycle is a curve of category sales. In subscription and platform businesses, much of the same dynamics runs through customer cohorts: acquisition, activation, expansion and churn inside each cohort, all at once across the portfolio. Figure 3.2’s matrix of products by customers becomes a cohort by product matrix, and Chapter 4’s lesson applies directly: optimise the value of the whole customer stream, not the lifetime value of the average customer. Profit persistence, a ratio of two noisy period profits, is better read through cohort retention and survival curves, which separate “fewer customers” from “less per customer”. Chapter 10 adds why the cohort view matters for marketing too: customers respond to channel marketing soon after they are acquired and much less once habits form, so the same spend has a different return by cohort age.

### The environment is now partly algorithmic

The authors were right that the environment is the neglected side of accountability; seven metrics in 165 is a striking count. By 2027 the environment includes intermediaries that rank, recommend and increasingly answer on the customer’s behalf: search, marketplaces, social feeds and AI assistants. Privacy regulation and platform policy have also reduced what can be observed about individual users. Two chapters of the same book already describe this environment. Chapter 11 shows that product ratings partly reflect earlier ratings, not the product, and that this moves sales; Chapter 12 shows that a firm can rationally leave the persuading to the consumer’s own search. In 2027 more of that search ends in an answer written by an AI assistant than in a list of links. In my view the external-environment column of Figure 3.1 now needs two rows it did not have: how visible the firm is where these intermediaries form preferences, and how much of the measurement still rests on observed rather than modelled data.

### Every metric needs an evidence status

The chapter separates backward-looking from forward-looking metrics. A 2027 scorecard needs one more distinction: how each number was obtained. A response curve from a randomised geo test, one from a calibrated model and one from a manager’s judgement can sit side by side in the same plan, and they deserve different weights. Little’s decision calculus already mixed hard data with managers’ judgement on purpose; the update is to label which is which. I used the same register (verified, calibrated, simulated, illustrative) in my [reconstruction of the 2018 Paraguay campaign](/en/writing/paraguay-2018-campaign-to-decision-analytics/).

## Where the funnels fit

Growth teams will recognise pieces of the chapter in the frameworks they use daily, so the levels are worth separating. Dave McClure’s AARRR funnel (acquisition, activation, retention, referral, revenue) asks where customers leak out of one product. Google’s Zero Moment of Truth asks how preferences form before a purchase. Both work inside a single cell of the chapter’s matrix: one product in one market, usually in growth. Chapter 3 works one level up, at the portfolio of product-markets, and asks which cells deserve the next unit of money at all. The frameworks do not compete; they are different zoom levels on the same economic question.

That is also why the chapter matters to a data scientist. Most training teaches how to estimate a quantity. This chapter is about which quantities a firm should estimate, at which stage, against which alternative. A modest model of the right metric is worth more than an excellent model of the wrong one.

## The compressed update

| Chapter 3 (2015) | Update for 2027 |
|---|---|
| ROIMI against ±20% plans | Keep it; estimate it causally, with experiments and calibrated mix models |
| Higher discount rates for growth and decline | Model the uncertainty in the cash flows; price information and options |
| Product-market life cycle of category sales | Add cohort-level dynamics; optimise customer equity, not average CLV |
| Profit persistence, $P_t=\pi_t/\pi_{t-1}$ | Read through cohort retention and survival, by component |
| External environment, a neglected column | Add algorithmic intermediaries and the share of observed data |
| Backward- versus forward-looking metrics | Add the evidence status of every number |
| Unbalanced scorecard, endogenous targets | Unchanged |

The last row is the verdict. The chapter’s question, how marketing can answer the chief executive’s question about growth, has not aged at all. Its tools for answering it have, and most of the update is in how the response functions are measured, not in what the chapter asks of them.

## Reference

Hauser, J. R., and Urban, G. L., eds. (2015). *From Little’s Law to Marketing Science: Essays in Honor of John D. C. Little*. Cambridge, MA: MIT Press. ISBN 978-0-262-02991-9.

| Ch. | Authors | Title |
|--:|---|---|
| 1 | Hauser, Urban | John D. C. Little: a profile |
| 2 | Danaher, Lee, Kerbache | Optimal internet media selection |
| 3 | Roberts, Srivastava, Morrison | Strategic marketing metrics to guide pathways to growth |
| 4 | Drèze, Bonfrer | Moving from customer lifetime value to customer equity |
| 5 | Abe | Deriving customer lifetime value from RFM measures |
| 6 | Yamanaka | Building and using a micromarketing platform |
| 7 | Montoya, Netzer, Jedidi | Dynamic allocation of pharmaceutical detailing and sampling for long-term profitability |
| 8 | Urban, Liberali, MacDonald, Bordley, Hauser | Morphing banner advertising |
| 9 | Hauser, Toubia, Evgeniou, Befurt, Dzyabura | Disjunctions of conjunctions, cognitive simplicity and consideration sets |
| 10 | Valentini, Montaguti, Neslin | Decision process evolution in customer channel choice |
| 11 | Moe, Trusov | The value of social dynamics in online product ratings forums |
| 12 | Mayzlin, Shin | Uninformative advertising as an invitation to search |
| 13 | Salisbury, Feinberg | Alleviating the constant stochastic variance assumption in decision research |
| 14 | Ceprini, Little | Generalized Little’s Law and an asset picking system to model an investment portfolio |
| 15 | Hauser, Urban | Closing statement |
