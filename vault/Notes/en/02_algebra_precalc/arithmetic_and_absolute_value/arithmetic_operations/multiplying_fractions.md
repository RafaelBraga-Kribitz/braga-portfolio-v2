---
title: Multiplying fractions
date: '2026-04-16'
wordCount: 999
slug: multiplying_fractions
permalink: /notes/02_algebra_precalc/arithmetic_and_absolute_value/arithmetic_operations/multiplying_fractions/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Multiplying fractions is the most direct of the four fraction operations: multiply numerators together, multiply denominators together. $\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}$. No common denominator required. In DA/DS, fraction multiplication appears in: compound probabilities ($P(A \cap B) = P(A) \cdot P(B)$ for independent events), scaling a proportion by a rate (e.g., 20% of 15% of users), chained conversion rates through a funnel, dimensional unit conversions, and computing the fraction of a fraction (e.g., "what fraction of premium users who opened the email also clicked?"). The simplicity of the formula makes it easy to apply in code — it is just ordinary multiplication — but the interpretation requires care: $\frac{a}{b} \cdot \frac{c}{d}$ means "take $\frac{c}{d}$ of the quantity $\frac{a}{b}$", so the result is always smaller than or equal to both operands when both are proper fractions ($0 < \frac{a}{b}, \frac{c}{d} \leq 1$).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Two fractions: a/b and c/d"] --> B["Multiply numerators: a × c"] A --> C["Multiply denominators: b × d"] B --> D["Result: ac/bd"] C --> D D --> E["Simplify: divide by GCD(ac, bd)"] E --> F["Tip: cross-cancel before multiplying — reduce a with d, or c with b"] D --> G["DA: compound probability P(A)·P(B) = (a/b)·(c/d)"] D --> H["DA: funnel rate — fraction of fraction of users"]
```
### Real-World use:
#### Situation it is used
Funnel analysis: $30\%$ of site visitors click an ad ($= \frac{3}{10}$), and $25\%$ of those convert ($= \frac{1}{4}$). The overall conversion rate is $\frac{3}{10} \cdot \frac{1}{4} = \frac{3}{40} = 7.5\%$. Probability: under independence, $P(\text{email opened AND clicked}) = P(\text{opened}) \cdot P(\text{clicked} \mid \text{opened})$. Scaling: if a model predicts a 40% conversion probability and the base rate is 15%, the expected fraction is $\frac{40}{100} \cdot \frac{15}{100} = \frac{6}{1000} = 0.6\%$. Unit conversion: converting $\frac{3}{4}$ of a rate expressed in $\frac{\text{events}}{\text{hour}}$ to a per-minute rate involves multiplying by $\frac{1}{60}$.
#### Problem it solves
Chaining rates or proportions without fraction multiplication leads to either summing (wrong) or confusing the result. The "fraction of a fraction" question — "what is $c/d$ of $a/b$?" — translates directly to multiplication and gives a result in the same unit as the original fractions.
#### How it solves the problem
$\frac{a}{b} \cdot \frac{c}{d} = \frac{a \cdot c}{b \cdot d}$: no common denominator needed. Numerators multiply together, denominators multiply together. The result is a valid fraction that can be simplified by dividing numerator and denominator by $\gcd(ac, bd)$. An optimization: cross-cancel before multiplying — if $\gcd(a, d) > 1$, simplify $a/d$ first; if $\gcd(c, b) > 1$, simplify $c/b$ first. This avoids large intermediate numbers.
#### Example of it used in the Working Context as DA/DS for a Business
Email funnel: a mailing list has $\frac{4}{5}$ deliverability (80% delivered). Of delivered emails, $\frac{1}{4}$ are opened (25% open rate). Of opened emails, $\frac{1}{3}$ have a link clicked (33% CTR). The end-to-end click rate per email sent: $\frac{4}{5} \cdot \frac{1}{4} \cdot \frac{1}{3} = \frac{4}{60} = \frac{1}{15} \approx 6.7\%$. Each stage is a fraction of the previous, and the chain is just repeated multiplication.
### The Formula (Fragment-First)
Breaking the notation: - $a$: numerator of the first fraction — the part being considered.
- $b$: denominator of the first fraction — the reference whole.
- $\cdot$: multiplication symbol (also written $\times$ or with no symbol when using adjacent fraction notation).
- $c$: numerator of the second fraction.
- $d$: denominator of the second fraction.
- $ac$: product of the two numerators.
- $bd$: product of the two denominators.
- $\frac{ac}{bd}$: the result — a fraction of a fraction. **Interpretation**: $\frac{a}{b} \cdot \frac{c}{d}$ asks "what is $\frac{c}{d}$ of $\frac{a}{b}$?" The result is always $\leq \min\!\left(\frac{a}{b}, \frac{c}{d}\right)$ when both fractions are in $[0, 1]$ — multiplying proper fractions always makes the result smaller. **Cross-cancellation** (simplification before multiplying):
$$\frac{a}{b} \cdot \frac{c}{d} = \frac{a/g_1}{b} \cdot \frac{c}{d/g_1} \quad \text{where } g_1 = \gcd(a, d)$$
Apply the same idea across the $b$-$c$ pair with $g_2 = \gcd(b, c)$. Extending to three fractions: $\frac{a}{b} \cdot \frac{c}{d} \cdot \frac{e}{f} = \frac{ace}{bdf}$.
### Formula-to-English Translation
"To multiply $\frac{a}{b}$ by $\frac{c}{d}$: just multiply the tops together to get the new top, and the bottoms together to get the new bottom. No common denominator needed. Simplify the result. In code it is just `(a * c) / (b * d)` in float, or `Fraction(a, b) * Fraction(c, d)` for exact arithmetic. Multiplying fractions always shrinks the result (when both are between 0 and 1) — you are taking a fraction of a fraction." ### Critical Concepts
1. **No common denominator needed**: unlike addition and subtraction, fraction multiplication requires no denominator matching. This makes it faster and simpler. Never convert to a common denominator before multiplying.
2. **Cross-cancellation reduces work**: simplify $\gcd(a, d)$ and $\gcd(c, b)$ before multiplying to avoid large numerators and denominators in intermediate steps. Example: $\frac{4}{9} \cdot \frac{3}{8}$ — cross-cancel 4 with 8 (÷4) and 3 with 9 (÷3) to get $\frac{1}{3} \cdot \frac{1}{2} = \frac{1}{6}$, rather than computing $\frac{12}{72}$ and reducing.
3. **Multiplying by a fraction < 1 shrinks the value**: $\frac{a}{b} \cdot \frac{c}{d} < \frac{a}{b}$ whenever $0 < \frac{c}{d} < 1$. This is the mathematical basis for why each funnel step reduces the number of users.
4. **Compound probability and independence**: $P(A \cap B) = P(A) \cdot P(B)$ holds only for independent events. Fraction multiplication computes the product — whether it represents a valid joint probability depends on your independence assumption, not on the arithmetic.
5. **Fractions of percentages**: in Python, when both values are given as percentages (e.g., `0.30 * 0.25`), you are already computing the fraction multiplication in decimal form. `0.30 * 0.25 = 0.075 = 7.5%`. Always check whether you should multiply or add — "30% AND 25%" (joint/compound) multiplies; "30% OR 25%" (union, mutually exclusive) adds.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: email funnel — deliverability × open rate × CTR. *Step 1: Write each stage as a fraction*
Deliverability = $\frac{4}{5}$, open rate = $\frac{1}{4}$, CTR = $\frac{1}{3}$. *Step 2: Cross-cancel where possible*
$\frac{4}{5} \cdot \frac{1}{4}$: $\gcd(4, 4) = 4$ — cancel: $\frac{1}{5} \cdot \frac{1}{1} = \frac{1}{5}$.
Now multiply result by $\frac{1}{3}$: $\frac{1}{5} \cdot \frac{1}{3} = \frac{1}{15}$. *Step 3: Interpret the result*
$\frac{1}{15} \approx 0.0\overline{6} = 6.\overline{6}\%$ end-to-end click rate. *Step 4: Verify without cancellation*
$\frac{4 \cdot 1 \cdot 1}{5 \cdot 4 \cdot 3} = \frac{4}{60} = \frac{1}{15}$. ✓ ### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Fraction multiplication in Python from fractions import Fraction # Basic: a/b × c/d
a, b = 3, 10 # 30% click-through on ad
c, d = 1, 4 # 25% conversion of those who click numerator = a * c # ac
denominator = b * d # bd print(f"Manual: ({a}×{c}) / ({b}×{d}) = {numerator}/{denominator} = {numerator/denominator:.4f}") # Python Fraction (auto-simplifies)
frac_1 = Fraction(a, b)
frac_2 = Fraction(c, d)
result = frac_1 * frac_2 print(f"Fraction class: {frac_1} × {frac_2} = {result} ({float(result):.4f})")
print(f"Simplified: {float(result):.1%}") # Funnel chain: 3 stages
deliverability = Fraction(4, 5) # 80%
open_rate = Fraction(1, 4) # 25%
ctr = Fraction(1, 3) # 33% end_to_end = deliverability * open_rate * ctr
print(f"\nFunnel chain:")
print(f" deliverability × open rate × CTR")
print(f" {deliverability} × {open_rate} × {ctr} = {end_to_end} = {float(end_to_end):.4f}") # Compound probability (independent events)
import numpy as np np.random.seed(42)
N = 100_000 # Simulate: P(A) = 0.3, P(B) = 0.25, independent
event_a = np.random.rand(N) < 0.30
event_b = np.random.rand(N) < 0.25 both_occur = (event_a & event_b).mean()
theoretical = 0.30 * 0.25 # fraction multiplication print(f"\nCompound probability (independent):")
print(f" P(A) × P(B) = 0.30 × 0.25 = {theoretical:.4f}")
print(f" Simulated P(A ∩ B) = {both_occur:.4f} (close to {theoretical:.4f})")
```
#### Beginner friendly Example [R])
``` r
# Fraction multiplication in R # Basic fraction multiplication
a <- 3; b <- 10 # 30%
c <- 1; d <- 4 # 25% numerator <- a * c
denominator <- b * d cat(sprintf("(%d×%d) / (%d×%d) = %d/%d = %.4f\n", a, c, b, d, numerator, denominator, numerator / denominator)) # Simplify with GCD
gcd <- function(x, y) if (y == 0) x else gcd(y, x %% y) g <- gcd(numerator, denominator)
cat(sprintf("Simplified: %d/%d\n", numerator / g, denominator / g)) # Funnel chain
deliverability <- 4/5
open_rate <- 1/4
ctr <- 1/3 end_to_end <- deliverability * open_rate * ctr
cat(sprintf("\nFunnel chain: %.4f × %.4f × %.4f = %.4f (%.1f%%)\n", deliverability, open_rate, ctr, end_to_end, end_to_end * 100)) # Compound probability simulation
set.seed(42)
N <- 100000
p_a <- 0.30
p_b <- 0.25 event_a <- runif(N) < p_a
event_b <- runif(N) < p_b theoretical <- p_a * p_b
simulated <- mean(event_a & event_b) cat(sprintf("\nP(A) × P(B) = %.4f | Simulated: %.4f\n", theoretical, simulated))
```
#### Final Professional Example [Python])
``` python
import pandas as pd
import numpy as np
from fractions import Fraction
from typing import List # Scenario: multi-stage marketing funnel audit
# Each stage is a conversion fraction; end-to-end rate = product of all fractions
# Also computes exact fractions from count data and flags stages below threshold np.random.seed(42) # Simulate count data for each funnel stage
impressions = 100_000
clicks = 32_000 # 32% CTR
page_visits = 25_000 # 78.1% of clicks visit landing page
add_to_cart = 6_000 # 24% add to cart
checkouts = 2_400 # 40% checkout
purchases = 1_800 # 75% complete purchase funnel_counts = [ ("impressions → clicks", impressions, clicks), ("clicks → page_visits", clicks, page_visits), ("page_visits → add_to_cart", page_visits, add_to_cart), ("add_to_cart → checkouts", add_to_cart, checkouts), ("checkouts → purchases", checkouts, purchases),
] THRESHOLD = Fraction(1, 5) # flag stages below 20% def compute_funnel_product(stages: list[tuple]) -> pd.DataFrame: """ Compute conversion rate for each funnel stage and the end-to-end product. Args: stages: List of (label, input_count, output_count) tuples. Returns: DataFrame with stage label, fraction, float rate, and flag. """ rows = [] cumulative = Fraction(1) for label, n_in, n_out in stages: rate = Fraction(n_out, n_in) cumulative *= rate rows.append({ "stage": label, "fraction": str(rate), "rate": float(rate), "below_20pct": rate < THRESHOLD, "cumulative": float(cumulative), }) return pd.DataFrame(rows) report = compute_funnel_product(funnel_counts) print("Funnel Audit: Stage Conversion Rates (fraction multiplication)")
print("=" * 72)
print(report.to_string(index=False)) # End-to-end rate = product of all stage fractions
rates = [Fraction(n_out, n_in) for _, n_in, n_out in funnel_counts]
end_to_end = Fraction(1)
for r in rates: end_to_end *= r print(f"\nEnd-to-end conversion (impressions → purchases):")
print(f" {' × '.join(str(r) for r in rates)}")
print(f" = {end_to_end} = {float(end_to_end):.4f} ({float(end_to_end):.2%})")
print(f"\nDirect count check: {purchases}/{impressions} = {Fraction(purchases, impressions)} = {purchases/impressions:.4f}")
print(f"Match: {end_to_end == Fraction(purchases, impressions)}")
```
#### Final Professional Example [R]
``` r
# Funnel audit: stage conversion rates and end-to-end product of fractions impressions <- 25000
clicks <- 5000
page_visits <- 4000
add_to_cart <- 6000
checkouts <- 2400
purchases <- 1800 funnel <- data.frame( stage = c("impressions → clicks", "clicks → page_visits", "page_visits → add_to_cart", "add_to_cart → checkouts", "checkouts → purchases"), n_in = c(impressions, clicks, page_visits, add_to_cart, checkouts), n_out = c(clicks, page_visits, add_to_cart, checkouts, purchases)
)
funnel$rate <- funnel$n_out / funnel$n_in
funnel$below_20pct <- funnel$rate < 0.20
funnel$cumulative <- cumprod(funnel$rate)
print("Funnel Audit: Stage Conversion Rates (fraction multiplication)")
print(funnel)
end_to_end <- prod(funnel$rate)
cat(sprintf("\nEnd-to-end: %.4f (%.2f%%)\n", end_to_end, 100 * end_to_end))
cat(sprintf("Direct: %d/%d = %.4f Match: %s\n", purchases, impressions, purchases/impressions, abs(prod(funnel$rate) - purchases/impressions) < 1e-9))
```
---
MRAF