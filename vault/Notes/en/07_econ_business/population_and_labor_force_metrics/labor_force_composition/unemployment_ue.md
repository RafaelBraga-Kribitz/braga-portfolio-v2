---
title: Unemployment (UE)
date: '2026-04-16'
wordCount: 522
slug: unemployment_ue
permalink: /notes/07_econ_business/population_and_labor_force_metrics/labor_force_composition/unemployment_ue/index.html
share_status: draft
publish_target: note
boundary: public
---
# $LF_t = E_t + U_t$ We are working on unemployment, denoted $U_t$, the count of persons without work who are actively seeking employment and available to work in period $t$, under ILO/OECD-style labor force definitions. The core accounting identity is $LF_t = E_t + U_t$, where $LF_t$ is the labor force and $E_t$ is employment. The setting is labor force composition, where unemployment is a count variable, not yet a rate, and links directly to Labor Force, Working-Age Population, and the Unemployment Rate.
## Deep Breakdown Unemployment, in the labor statistics sense, is not simply “people without a job.” It is a narrower and more precise category. A person is counted as unemployed only if they are: - without work,
- actively seeking work,
- available to start work, within the reference framework used by the statistical agency. That distinction matters because many people may be outside employment but still not counted as unemployed. For example: - students not looking for work,
- retirees,
- discouraged workers who stopped searching,
- caregivers not seeking jobs,
- people temporarily unavailable to start work. Those people are generally outside the labor force, not unemployed. So unemployment is best understood as one component of the labor force. The key labor force identity is: $$
LF_t = E_t + U_t
$$ where: - $LF_t$ is the labor force in period $t$,
- $E_t$ is employed persons in period $t$,
- $U_t$ is unemployed persons in period $t$. Rearranging gives: $$
U_t = LF_t - E_t
$$ This is often useful in data work when labor force and employment counts are known. Unemployment is a **count variable**. It answers: > How many people in the labor market do not currently have a job, while still seeking and being available for work? This is different from the unemployment rate, which normalizes unemployment by the labor force: $$
\text{Unemployment Rate}_t = \left(\frac{U_t}{LF_t}\right)\times 100
$$ It is also different from measures based on the working-age population. The working-age population is broader than the labor force, because it includes people both inside and outside labor market participation. This concept matters in labor economics and business operations because unemployment counts feed into: - labor force accounting,
- unemployment rates,
- regional labor reports,
- recession monitoring,
- workforce planning,
- macroeconomic dashboards. In DA/DS contexts, the raw unemployment count is often used together with: - labor force count,
- employment count,
- participation rate,
- employment rate,
- unemployment rate. The count itself is essential for decomposition and auditing. Rates can hide whether a change comes from a shrinking denominator, demographic shifts, or changing labor force participation. The raw count helps keep the accounting grounded.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with working-age population"] --> B["Identify people with jobs as employed $E_t$"] A --> C["Identify people without jobs"] C --> D["Check active job search status"] D --> E["Check availability to start work"] E --> F["Classify qualifying persons as unemployed $U_t$"] B --> G["Combine employed and unemployed"] F --> G G --> H["Compute labor force $LF_t = E_t + U_t$"] H --> I["Use unemployment count in rates, dashboards, and labor analysis"]