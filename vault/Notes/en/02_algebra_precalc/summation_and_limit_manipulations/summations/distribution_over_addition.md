---
title: Distribution over addition
date: '2026-04-16'
wordCount: 724
slug: distribution_over_addition
permalink: /notes/02_algebra_precalc/summation_and_limit_manipulations/summations/distribution_over_addition/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\sum_{n=s}^t [f(n) \pm g(n)] = \sum_{n=s}^t f(n) \pm \sum_{n=s}^t g(n)$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
A sum of sums-or-differences can be split into separate summations over each component. This is the linearity of the summation operator: $\sum$ distributes over $+$ and $-$ exactly as multiplication distributes over addition. In DA/DS, this means: total profit $= \sum (\text{revenue}_n - \text{cost}_n) = \sum \text{revenue}_n - \sum \text{cost}_n$. You can aggregate sub-metrics independently and combine, rather than computing the difference row-by-row first. This rule also underlies every gradient derivation in ML where you split the loss into separable components.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Sum of combined terms: sum[f(n) +/- g(n)] from s to t"] --> B["Expand: (f(s)+/-g(s)) + (f(s+1)+/-g(s+1)) + ... + (f(t)+/-g(t))"] B --> C["Regroup by associativity and commutativity of addition"] C --> D["(f(s) + f(s+1) + ... + f(t)) +/- (g(s) + g(s+1) + ... + g(t))"] D --> E["Result: sum f(n) +/- sum g(n)"] E --> F["Each series can now be aggregated independently"]
```
### Real-World use:
#### Situation it is used
Decomposing combined metric columns (profit = revenue - cost, each summed separately), aggregating multi-component KPIs independently and then combining, splitting a total prediction error into bias and variance components, and deriving gradients of composite loss functions where $L = L_1 + L_2$.
#### Problem it solves
In ETL and analytics, data often arrives pre-combined (a single column "net_profit" per row). This rule tells you it is safe to split aggregation: sum revenue, sum cost, subtract. The result is identical to summing net_profit directly. It also simplifies code: compute two independent group-bys and subtract, rather than creating an intermediate combined column.
#### How it solves the problem
From associativity and commutativity of addition: $(f(s) + g(s)) + (f(s+1) + g(s+1)) + \cdots$ can be reordered to $(f(s) + f(s+1) + \cdots) + (g(s) + g(s+1) + \cdots)$ — each $f$ term grouped together, each $g$ term grouped together. This gives $\sum f(n) + \sum g(n)$.
#### Example of it used in the Working Context as DA/DS for a Business
Five campaigns. Each row has revenue and cost. Total profit: $\sum_{n=1}^{5} (\text{rev}_n - \text{cost}_n)$. Via the rule: $= \sum \text{rev}_n - \sum \text{cost}_n = 97{,}500 - 68{,}200 = 29{,}300$. Same as summing the profit column directly. Useful when revenue and cost are in separate tables: aggregate each table independently, then subtract.
### The Formula (Fragment-First)
- $f(n)$: first term at index $n$ (e.g., revenue at period $n$)
- $g(n)$: second term at index $n$ (e.g., cost at period $n$)
- $f(n) \pm g(n)$: combined term per row (e.g., profit per period)
- $\sum_{n=s}^{t} f(n)$: total of the first series
- $\sum_{n=s}^{t} g(n)$: total of the second series Full rule: $\sum_{n=s}^{t} [f(n) \pm g(n)] = \sum_{n=s}^{t} f(n) \pm \sum_{n=s}^{t} g(n)$ This is one of the two linearity properties of $\sum$. The other is constant extraction ($\sum C f(n) = C \sum f(n)$). Together they define the summation operator as linear.
### Formula-to-English Translation
"The sum of sums (or differences) equals the sum of each part separately, then combined with the same operation." $\sum_{n=1}^{3}(n^2 + n) = \sum_{n=1}^{3} n^2 + \sum_{n=1}^{3} n = (1+4+9) + (1+2+3) = 14 + 6 = 20$. Direct: $2 + 6 + 12 = 20$. Confirmed.
### Critical Concepts
- **Does NOT apply to products:** $\sum f(n) \cdot g(n) \neq \left(\sum f(n)\right) \cdot \left(\sum g(n)\right)$. The distribution rule only works for $+$ and $-$, not $\times$.
- **Enables independent aggregation:** each component can be summed in a separate pipeline or query. The results can be combined at the end.
- **Works for any number of components:** $\sum [f + g + h] = \sum f + \sum g + \sum h$. Apply the rule twice.
- **Subtraction is addition of the negative:** $\sum [f - g] = \sum [f + (-g)] = \sum f + \sum(-g) = \sum f - \sum g$.
- **Fundamental to gradient computation:** for a loss $L(n) = L_1(n) + L_2(n)$, the gradient $\nabla \sum L(n) = \nabla \sum L_1(n) + \nabla \sum L_2(n)$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Write the combined sum and identify each component*
Expression: $\sum_{n=1}^{4} (3n - n^2)$. Components: $f(n) = 3n$, $g(n) = n^2$. *Step 2: Apply the distribution rule to split into two sums*
$= \sum_{n=1}^{4} 3n - \sum_{n=1}^{4} n^2 = 3\sum_{n=1}^{4} n - \sum_{n=1}^{4} n^2 = 3(10) - (30) = 30 - 30 = 0$. *Step 3: Verify by direct computation*
$(3-1) + (6-4) + (9-9) + (12-16) = 2 + 2 + 0 + (-4) = 0$. Confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Distribution of sum over addition/subtraction
# sum[f(n) +/- g(n)] = sum f(n) +/- sum g(n) revenues = [18000.0, 22500.0, 15000.0, 27000.0, 16500.0]
costs = [12000.0, 15000.0, 10000.0, 20000.0, 11200.0]
n = len(revenues) # Method 1: compute profit per row, then sum
profits_per_row = [r - c for r, c in zip(revenues, costs)]
total_profit_m1 = sum(profits_per_row) # Method 2: sum revenue, sum cost, then subtract (distribution rule)
total_revenue = sum(revenues)
total_cost = sum(costs)
total_profit_m2 = total_revenue - total_cost print(f"Revenues: {revenues}")
print(f"Costs: {costs}")
print(f"Profits per row: {profits_per_row}")
print()
print(f"Method 1 (sum profits directly): {total_profit_m1:,.2f}")
print(f"Method 2 (sum R, sum C, subtract): {total_revenue:,.2f} - {total_cost:,.2f} = {total_profit_m2:,.2f}")
print(f"Equal: {abs(total_profit_m1 - total_profit_m2) < 1e-9}") # Verify: sum(f + g) = sum(f) + sum(g)
f_vals = [1.0, 4.0, 9.0, 16.0]
g_vals = [2.0, 3.0, 5.0, 7.0]
lhs = sum(f + g for f, g in zip(f_vals, g_vals))
rhs = sum(f_vals) + sum(g_vals)
print(f"\nsum(f+g) = {lhs}, sum(f)+sum(g) = {rhs}, equal = {lhs == rhs}")
```
#### Beginner friendly Example [R])
``` r
# Distribution of sum over addition/subtraction revenues <- c(18000, 22500, 15000, 27000, 16500)
costs <- c(12000, 15000, 10000, 20000, 11200) # Method 1: compute profit per row, then sum
total_profit_m1 <- sum(revenues - costs) # Method 2: sum revenue, sum cost, subtract (distribution rule)
total_profit_m2 <- sum(revenues) - sum(costs) cat(sprintf("Method 1 (sum of profits): %.2f\n", total_profit_m1))
cat(sprintf("Method 2 (sum R - sum C): %.2f\n", total_profit_m2))
cat(sprintf("Equal: %s\n", isTRUE(all.equal(total_profit_m1, total_profit_m2))))
```
#### Final Professional Example [Python])
``` python
import pandas as pd
import numpy as np # Scenario: compute monthly P&L from separate revenue and cost tables
# Revenue aggregated from one source, costs from another
# Distribution rule guarantees: total_profit = total_revenue - total_cost np.random.seed(42) revenue_table = pd.DataFrame({ "month": range(1, 13), "channel": ["SEO","PPC","Email","SEO","PPC","Email", "SEO","PPC","Email","SEO","PPC","Email"], "revenue": np.round(np.random.uniform(30000, 80000, 12), 2),
}) cost_table = pd.DataFrame({ "month": range(1, 13), "channel": ["SEO","PPC","Email","SEO","PPC","Email", "SEO","PPC","Email","SEO","PPC","Email"], "cost": np.round(np.random.uniform(15000, 45000, 12), 2),
}) # Method 1: join, compute monthly profit per row, then sum
merged = revenue_table.merge(cost_table, on=["month", "channel"])
merged["profit"] = merged["revenue"] - merged["cost"]
total_profit_method1 = merged["profit"].sum() # Method 2: sum revenues independently, sum costs independently, subtract
# (valid by distribution of sum over subtraction)
total_revenue = revenue_table["revenue"].sum()
total_cost = cost_table["cost"].sum()
total_profit_method2 = total_revenue - total_cost print("P&L Aggregation: Distribution of Sum over Subtraction")
print("sum(revenue - cost) = sum(revenue) - sum(cost)")
print()
print(f"Total revenue (sum R table): {total_revenue:>12,.2f}")
print(f"Total cost (sum C table): {total_cost:>12,.2f}")
print(f"Total profit (Method 1): {total_profit_method1:>12,.2f}")
print(f"Total profit (Method 2): {total_profit_method2:>12,.2f}")
print(f"\nMethods agree: {np.isclose(total_profit_method1, total_profit_method2)}")
print("\nConclusion: safe to aggregate revenue and cost in separate queries/pipelines.")
```
#### Final Professional Example [R]
``` r
# sum(revenue - cost) = sum(revenue) - sum(cost) set.seed(42)
revenue <- runif(20, 1000, 5000)
cost <- runif(20, 200, 2000)
total_revenue <- sum(revenue)
total_cost <- sum(cost)
total_profit_m1 <- sum(revenue - cost)
total_profit_m2 <- total_revenue - total_cost
cat(sprintf("Total revenue: %.2f Total cost: %.2f\n", total_revenue, total_cost))
cat(sprintf("Profit (Method 1): %.2f (Method 2): %.2f Agree: %s\n", total_profit_m1, total_profit_m2, isTRUE(all.equal(total_profit_m1, total_profit_m2))))
```
---
AIO pag 44