---
title: Economic Order Quantity (EOQ)
date: '2026-04-16'
wordCount: 514
slug: economic_order_quantity_eoq
permalink: /notes/07_econ_business/population_and_labor_force_metrics/operational_math/economic_order_quantity_eoq/index.html
share_status: draft
publish_target: note
boundary: public
---
# $Q^* = \sqrt{\dfrac{2DS}{H}}$ We are working on Economic Order Quantity (EOQ), with canonical formula $Q^* = \sqrt{\dfrac{2DS}{H}}$, where $D$ is demand per period, $S$ is ordering cost per order, and $H$ is holding cost per unit per period. The domain is deterministic inventory management with constant demand, instantaneous replenishment, no stockouts, and stable unit economics. EOQ gives the order quantity that minimizes the sum of ordering cost and holding cost.
## Deep Breakdown Economic Order Quantity, usually abbreviated as EOQ, is one of the foundational formulas in inventory and operations management. It answers a practical business question: **How much should we order each time so that total inventory-related cost is minimized?** The core tradeoff is between two opposing forces: - ordering too frequently increases **ordering cost**,
- ordering too much at once increases **holding cost**. If a company places many small orders, it spends a lot on purchase order processing, supplier handling, shipping setup, receiving, and administrative overhead. If it places very large orders, it reduces how often it orders, but then it holds more inventory on average, which raises storage, capital, spoilage, insurance, and obsolescence costs. EOQ finds the quantity that balances those two costs optimally. The canonical result is: $$
Q^* = \sqrt{\frac{2DS}{H}}
$$ where: - $D$ is demand over the period,
- $S$ is fixed cost per order,
- $H$ is holding cost per unit per period. This is not a revenue-maximizing formula. It is a **cost-minimizing formula** for inventory replenishment under a specific simplified model. The classic EOQ framework assumes: - demand is known and constant,
- lead time is known,
- replenishment is instantaneous,
- stockouts are not allowed,
- unit purchase price is constant,
- ordering cost is fixed per order,
- holding cost is linear in inventory. Under these assumptions, the total relevant inventory cost consists of: 1. **Ordering cost**, which falls when order size increases.
2. **Holding cost**, which rises when order size increases. That creates a U-shaped total cost curve, and EOQ identifies the quantity at the bottom of that curve. Why this matters in DA/DS: - **Operations dashboards:** EOQ can be used as a benchmark for inventory policy.
- **Supply chain analytics:** helps translate demand forecasts into replenishment decisions.
- **Scenario analysis:** useful for sensitivity checks on demand, storage costs, and procurement costs.
- **Inventory simulation:** often appears as a baseline policy in more advanced models.
- **Unit economics:** links order process design to cost structure. A useful mental model: - small $Q$ means frequent ordering, low inventory, high admin cost,
- large $Q$ means infrequent ordering, high inventory, high holding cost,
- EOQ finds the middle point where the two forces are balanced.
### Flowchart (Mermaid) ```mermaid
flowchart TD
A["Start with annual or period demand D"] --> B["Measure fixed ordering cost S"]
B --> C["Measure holding cost per unit H"]
C --> D["Compute EOQ: Q* = sqrt(2DS / H)"]
D --> E["Interpret as cost-minimizing order size"]
E --> F["Estimate number of orders: D / Q*"]
F --> G["Estimate average inventory: Q* / 2"]
G --> H["Use in inventory planning and operations dashboards"]