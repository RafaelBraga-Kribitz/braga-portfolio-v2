---
title: Compound Interest (Annual)
date: '2026-04-16'
wordCount: 392
slug: compound_interest_annual
permalink: /notes/07_econ_business/financial_mathematics/interest_and_growth/compound_interest_annual/index.html
share_status: draft
publish_target: note
boundary: public
---
# $A = P(1 + r)^t$ We are working on annual compound interest, given by $A = P(1 + r)^t$, where $P$ is the initial principal, $r$ is the annual interest rate per year, and $t$ is time in years. The setting is discrete annual compounding with a constant rate, a fixed initial amount, and no additional deposits or withdrawals during the investment horizon.
## Deep Breakdown Annual compound interest describes how money grows when interest is added to the balance once per year, and future interest is then earned on both the original principal and the previously accumulated interest. This is one of the foundational equations in financial mathematics because it captures **growth on growth**. Unlike simple interest, where interest is earned only on the original principal, compound interest reinvests prior gains automatically. The canonical formula is: $$
A = P(1 + r)^t
$$ where: - $P$ is the starting amount,
- $r$ is the annual rate written in decimal form,
- $t$ is the number of years,
- $A$ is the amount after $t$ years. The logic is iterative: - after 1 year, the amount becomes $P(1+r)$,
- after 2 years, it becomes $P(1+r)(1+r) = P(1+r)^2$,
- after $t$ years, it becomes $P(1+r)^t$. This formula matters in DA/DS because many business quantities evolve multiplicatively rather than additively: - account balances,
- customer lifetime value growth assumptions,
- inflation-adjusted scenarios,
- retained earnings,
- population growth approximations,
- discounting and Net Present Value inversions. It also provides a bridge to broader topics: - discrete compounding with more than one compounding period per year,
- continuous compounding,
- present value and discount factors,
- growth modeling in finance and business forecasting. Under annual compounding, the growth factor per year is: $$
1 + r
$$ If $r > 0$, the balance grows over time.
If $r = 0$, the balance stays unchanged.
If $-1 < r < 0$, the balance decays over time. This is a discrete-time exponential growth model.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with principal $P$"] --> B["Set annual rate $r$"] B --> C["Set time horizon $t$ in years"] C --> D["Compute annual growth factor $(1+r)$"] D --> E["Apply growth factor repeatedly for $t$ years"] E --> F["Calculate future value $A = P(1+r)^t$"] F --> G["Interpret total accumulated amount"] G --> H["Use for savings, loans, forecasting, or valuation"]