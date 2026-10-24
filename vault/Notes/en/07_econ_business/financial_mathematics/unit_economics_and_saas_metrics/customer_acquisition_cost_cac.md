---
title: Customer Acquisition Cost (CAC)
date: '2026-04-16'
wordCount: 506
slug: customer_acquisition_cost_cac
permalink: /notes/07_econ_business/financial_mathematics/unit_economics_and_saas_metrics/customer_acquisition_cost_cac/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\mathrm{CAC} = \dfrac{\text{Total Acquisition Spend}}{\text{Number of New Customers Acquired}}$ We are working on Customer Acquisition Cost (CAC), with canonical formula $\mathrm{CAC} = \dfrac{\text{Total Acquisition Spend}}{\text{Number of New Customers Acquired}}$, where acquisition spend includes the relevant marketing and sales costs for a defined period and the denominator is the count of newly acquired customers in that same period and attribution scope. The domain is unit economics and SaaS or growth analytics, where CAC measures the average cost to acquire one new customer and is used alongside metrics such as LTV and the LTV/CAC ratio.
## Deep Breakdown Customer Acquisition Cost, usually abbreviated as CAC, is one of the central metrics in SaaS, subscriptions, marketplaces, and growth-focused businesses. It answers a basic but critical question: **How much does it cost, on average, to acquire one new customer?** The basic formula is: $$
\mathrm{CAC} = \frac{\text{Total Acquisition Spend}}{\text{Number of New Customers Acquired}}
$$ This looks simple, but in practice CAC only becomes meaningful when the definitions are precise. There are three major pieces that must match: 1. **Time window**
2. **Cost scope**
3. **Customer attribution logic** For example, if you measure spend in January but count customers who convert in March, the ratio becomes distorted. If you include paid media cost but exclude the sales team that closed the deal, CAC becomes incomplete. If you count trial signups instead of actual paying customers, you are measuring a different metric. So CAC is mathematically simple, but operationally sensitive. Why CAC matters: - it shows whether acquisition is economically efficient,
- it helps compare channels and campaigns,
- it is required for unit economics and payback calculations,
- it is a core ingredient in LTV/CAC analysis,
- it influences hiring, budget allocation, and growth strategy. A useful conceptual breakdown: - **numerator:** all relevant acquisition investment,
- **denominator:** all relevant new customers gained from that investment. If acquisition gets more expensive or conversion worsens, CAC rises. If conversion improves or acquisition costs drop, CAC falls. Typical cost components that may enter CAC: - paid media spend,
- agency fees,
- marketing tools used for acquisition,
- salaries and commissions of acquisition-focused staff,
- SDR or sales team cost,
- onboarding sales support, if included by company definition. Typical denominator options: - new paying customers,
- new subscribed accounts,
- new activated customers,
- new B2B logos. Those are not interchangeable. CAC is only valid if the numerator and denominator reflect the same acquisition stage. For DA/DS work, CAC often appears in: - executive dashboards,
- cohort reporting,
- channel analysis,
- MMM or attribution systems,
- predictive budget planning,
- unit economics models.
### Flowchart (Mermaid) ```mermaid
flowchart TD
A["Start with defined reporting period"] --> B["Collect acquisition-related marketing and sales costs"]
B --> C["Define what counts as a new customer"]
C --> D["Count number of new customers acquired in same scope"]
D --> E["Compute CAC = Total Acquisition Spend / New Customers"]
E --> F["Interpret efficiency by channel, segment, or period"]
F --> G["Compare with LTV, payback period, and LTV/CAC ratio"]