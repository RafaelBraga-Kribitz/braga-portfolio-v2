---
title: Kitchen sink
slug: system
lang: en
summary: Every authoring construct the content pipeline understands, once each, with the Warehouse humanoid TCO case as the example. Not indexed.
lead: Every construct the content pipeline understands, once each and in the order of the authoring guide, under its name and its Markdown syntax. The example content is the Warehouse humanoid TCO case.
draft: false
translationStatus: approved
---

## Headings and text

### Subsection · `###`

The page’s title is its only `h1` and comes from the frontmatter, so the body starts at `##`. The stylesheet draws each section’s number from the order of the `##` headings; `###` opens a subsection and is never numbered.

### Typography · `“ ” ‘ ’ – − …`

Punctuation is typed, never converted. Quotes are “double” and ‘single’. The English dash is a spaced en dash – as here – and a range takes an unspaced one: a speed-transfer factor of 0.50–0.90. A negative takes the real minus: against people alone, the lean hybrid’s cost changes by −30%. An ellipsis is one character (…). A non-breaking space holds a date together: the case was published on 21 May 2026 and updated on 16 Sep 2026.

### Links · `[text](/en/…/)`

A link inside the site is root-relative: the case in full is [Warehouse humanoid TCO](/en/work/warehouse-humanoid-tco/). A link outside the site is a full URL: [the repository](https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco).

### Earned figure · `==…==`

The lean hybrid, one person with three autonomous mobile robots (AMRs), has a five-year present cost of ==€453,000==, 30% less than people alone.

### Ordered list · `1.`

Four steps, each reproducible from the repository:

1. Extract capability and timing assumptions from the episodes.
2. Simulate seven staffing scenarios with discrete events, utilisation capped at 0.85.
3. Propagate uncertainty through 10,000 draws per scenario.
4. Run a Sobol sensitivity analysis and a capital-price breakeven search.

### Bulleted list · `-`

The limitations of the model:

- Household tasks are an imperfect proxy for warehouse operations.
- Public capital-cost assumptions are not binding supplier quotes.
- Collective-agreement labour rates may understate real local costs.

## Callouts

Obsidian syntax: a blockquote whose first line is `[!type] Title`. The title is optional; the type’s name stands in for it.

### Quotation · `>`

A blockquote without a marker stays a quotation. The authoring guide, on the order of a document:

> Every project and essay follows one direction: question → data → method → result → limitations → decision.

### Wide · `[!note|wide]`

> [!note|wide] Data
> Capability assumptions use 2,359 episodes from five public UnifoLM datasets, pinned by hash. Household demonstrations stand in for warehouse work, with a speed-transfer factor between 0.50 and 0.90.

### Open fold · `[!faq]+`

> [!faq]+ What is the unit of comparison?
> Five-year present cost at an 8% discount rate.

### Nesting · `> > [!aside]`

> [!note] Uncertainty
> Uncertainty is propagated through 10,000 Monte Carlo draws per scenario.
>
> > [!aside]
> > The lean hybrid wins 99.8% of them.

### Note · `[!note]`

> [!note] Scenarios
> Four of the seven scenarios are shown on this page; the case lists all seven.

### Aside · `[!aside]`

> [!aside]
> These are not measurements from a deployed warehouse fleet. The proxy is the first limitation in the bulleted list above.

### Warning · `[!warning]`

> [!warning] Before deciding
> The ranking holds only under the stated assumptions.

### Tool · `[!tool]`

> [!tool] 03-02 · A/B sample size · interactive
> The bench needs JavaScript. Without it the default scenario stands: at a 4% baseline, a 10% relative lift and 80% power, the test needs **39,473** visitors per arm – 40 days at 2,000 visitors a day. A vocabulary demonstration; the tool itself is [04-02 A/B sample size](/en/tools/ab-sample-size/).

### Summary · `[!summary]`

> [!summary] Summary
> One person with three autonomous mobile robots has the lowest five-year present cost, €453,000, and wins 99.8% of the evaluated draws. Humanoids are deferred until demand, labour supply or shift patterns change.

### Definition · `[!definition]`

> [!definition] Present cost
> Future cash flows discounted to today at the stated rate, so that costs falling in different years can be added. Here 8% a year over five years.

### Quote · `[!quote]`

> [!quote] Result · 10,000 draws per scenario
> The lean hybrid wins 99.8% of the evaluated draws.

### Spec · `[!spec]`

> [!spec] Model inputs
> - Episodes — 2,359 · five public datasets
> - Scenarios — 7 · 15 replicas each
> - Throughput — 120 orders per hour · utilisation at most 0.85
> - Uncertainty — 10,000 Monte Carlo draws per scenario
> - Discount rate — 8% a year over five years

### Metrics · `[!metrics]`

> [!metrics] Key figures
> - ==€453,000== — Lowest five-year present cost
> - €0.374 — Cost per order
> - 99.8% — Draws won by the lean hybrid

### Question · `[!faq]-`

> [!faq]- What would reverse the decision?
> Higher demand, labour scarcity or multiple shifts. Each moves the breakeven capital price; the model is re-run when one of them changes.

### Bookmark · `[!bookmark]`

> [!bookmark] Next
> [01-04 Energy procurement risk analyser](/en/work/energy-procurement-risk-analyzer/) — From electricity-price records to a cost-risk decision. In build.

## Actions

The primary action of a section carries that section’s one accent (UX pass, 22 Oct 2026; gate G-15), so it sits in a section of its own here, apart from the earned figure of the metrics callout above.

### Call to action · `[!cta]`

> [!cta]
> [Open the repository](https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco)

## Evidence figures

The evidence figure of the site’s pattern 05: a kicker, the finding as its heading, ink bars on a mid baseline and a caption with the source. It is written as a `[!bars]` callout and spans the wide column.

### Bars · `[!bars]`

> [!bars] Fig. 1 · Five-year present cost by scenario
> The lean hybrid costs 30% less than people alone and less than a fifth of the best humanoid case.
> - Lean hybrid — 453
> - Human-only — 647
> - Best humanoid — 2533
> - Pure humanoid — 2878
>
> accent: Lean hybrid
> caption: Present value at 8%, in thousands of euros; scale 0 to €2,878,000. n = 4 of 7 scenarios; the lean hybrid is one person with three AMRs.
> source: supplied project inventory, 16 Sep 2026.

### Centred bars · `centre: yes`

> [!bars] Fig. 2 · Against human-only operation
> The lean hybrid costs 30% less than people alone.
> - Human-only — 0
> - Lean hybrid — −30
>
> scale: −50–50 · unit: % · centre: yes
> caption: Change in five-year present cost against human-only operation, the zero line; scale −50% to +50%. Two of the seven scenarios.
> source: supplied project inventory, 16 Sep 2026.

## Tables

### Table · `|--:|`

| Scenario | Five-year present cost | Relative to winner |
|:--|--:|--:|
| One person + three AMRs | €453,000 | 1.00× |
| Human-only operation | €647,000 | 1.43× |
| Best humanoid case | €2,533,000 | 5.59× |
| Pure humanoid operation | €2,878,000 | 6.35× |

## Mathematics

### Inline formula · `$…$`

Each year’s cost is discounted to year 0 at the rate $r = 0.08$, so that costs falling in different years can be added.

### Display formula · `$$…$$`

Present cost is the sum of the discounted yearly costs; $t$ counts the years from 0:

$$
\text{present cost} = \sum_{t} \frac{c_t}{(1 + r)^{t}}
$$

## Code

### Code block · `` ```python ``

The same sum in Python:

```python
def present_cost(cash_flows, rate=0.08):
    """Sum of yearly costs discounted to year 0 (listing for the specimen)."""
    return sum(c / (1 + rate) ** t for t, c in enumerate(cash_flows))
```

### Inline code · `` `…` ``

Inline code keeps the light wash: `present_cost(cash_flows, rate=0.08)`.

## Footnotes

### Footnote · `[^1]`

Under these assumptions, deploy the lean hybrid and defer humanoids.[^1]

[^1]: Austrian collective-agreement wage rates were used for the labour cost; local rates can run higher.
