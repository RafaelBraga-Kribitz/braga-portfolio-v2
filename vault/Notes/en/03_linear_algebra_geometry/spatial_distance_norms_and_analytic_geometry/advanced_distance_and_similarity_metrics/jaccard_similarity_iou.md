---
title: Jaccard Similarity (IoU)
date: '2026-04-16'
wordCount: 854
slug: jaccard_similarity_iou
permalink: /notes/03_linear_algebra_geometry/spatial_distance_norms_and_analytic_geometry/advanced_distance_and_similarity_metrics/jaccard_similarity_iou/index.html
share_status: draft
publish_target: note
boundary: public
---
# $J(A,B) = \frac{|A \cap B|}{|A \cup B|}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
Jaccard similarity (also called Intersection over Union, IoU) measures the overlap between two sets: the size of their intersection divided by the size of their union. Range: $[0, 1]$. $J = 1$ means the sets are identical; $J = 0$ means they share nothing. In DA/DS: Jaccard is the standard similarity metric for sets and binary data. Object detection (IoU of predicted vs. ground-truth bounding boxes), recommendation systems (user purchase set overlap), NLP (n-gram or word set similarity), duplicate detection (MinHash/LSH approximation of Jaccard), and A/B test audience overlap analysis are all core use cases.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["Sets A and B (or binary vectors a, b)"] A --> B["Count intersection: |A ∩ B| = elements in BOTH"] A --> C["Count union: |A ∪ B| = elements in EITHER (no duplicates)"] B --> D["Jaccard: J = |A ∩ B| / |A ∪ B|"] C --> D D --> E["J = 1: A = B (identical sets)"] D --> F["J = 0: A ∩ B = empty (no overlap)"] D --> G["Jaccard distance: d_J = 1 - J(A,B)"] D --> H["For binary vectors: J = dot(a,b) / (||a||^2 + ||b||^2 - dot(a,b))"]
```
### Real-World use:
#### Situation it is used
Object detection evaluation (IoU of bounding boxes vs. threshold like 0.5 or 0.75), semantic segmentation (per-class IoU), user-item basket overlap in recommendation, duplicate/near-duplicate document detection via MinHash, keyword set similarity in NLP, and audience overlap in advertising (shared users between two campaign exposures).
#### Problem it solves
Set-based similarity needs a scale-invariant measure that accounts for both shared elements and the "missed" elements on either side. A simple intersection count $|A \cap B|$ is not normalized: two large sets with a 50-element intersection look very similar, even if one has 1000 elements (missing 950). Jaccard normalizes by the union.
#### How it solves the problem
$|A \cup B| = |A| + |B| - |A \cap B|$. Dividing the intersection by the union normalizes for set size: $J = \frac{|A \cap B|}{|A| + |B| - |A \cap B|}$. For binary vectors $a, b \in \{0,1\}^n$: $|A \cap B| = a^T b$ (count of positions where both are 1), $|A \cup B| = \|a\|^2 + \|b\|^2 - a^Tb$ (count of positions where at least one is 1).
#### Example of it used in the Working Context as DA/DS for a Business
A DS evaluates an object detection model. For each predicted bounding box and ground-truth box, they compute $\text{IoU} = J = \frac{\text{area of overlap}}{\text{area of union}}$. A prediction is considered correct at the COCO benchmark if IoU $\geq 0.5$. The mean IoU (mIoU) across all classes is the primary evaluation metric for the model release decision.
### The Formula (Fragment-First)
- $A, B$: two sets (or binary vectors viewed as indicator functions of sets)
- $|A \cap B|$: number of elements in both $A$ and $B$ (intersection size)
- $|A \cup B|$: number of elements in $A$ or $B$ or both (union size)
- $J(A,B) \in [0, 1]$: 0 = no overlap, 1 = identical sets
- Equivalent for binary vectors: $J = \frac{\text{sum}(a \wedge b)}{\text{sum}(a \vee b)} = \frac{a^Tb}{\|a\|_1 + \|b\|_1 - a^Tb}$
- Jaccard distance: $d_J(A,B) = 1 - J(A,B)$ — IS a proper metric (satisfies triangle inequality)
- For continuous (non-binary) data, use generalized Jaccard: $J(x,y) = \frac{\sum \min(x_i, y_i)}{\sum \max(x_i, y_i)}$ ### Formula-to-English Translation
"Count the elements shared by both sets. Count all elements in either set. Divide: how big is the overlap relative to everything involved? 1 = perfect overlap, 0 = no shared elements." Tiny example: $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5, 6\}$.
$|A \cap B| = |\{3,4\}| = 2$.
$|A \cup B| = |\{1,2,3,4,5,6\}| = 6$.
$J = 2/6 \approx 0.333$. $\checkmark$ ### Critical Concepts
- **Jaccard distance is a proper metric:** $d_J = 1 - J$ satisfies all four metric axioms including triangle inequality (unlike cosine distance). This makes it safe for metric-based algorithms.
- **MinHash approximation:** for large-scale set similarity (e.g., comparing millions of documents), computing exact Jaccard is expensive. MinHash provides an unbiased estimator: $\Pr[\text{minhash}(A) = \text{minhash}(B)] = J(A,B)$.
- **IoU threshold in object detection:** COCO mAP is computed at IoU thresholds $\{0.5, 0.55, ..., 0.95\}$. A higher threshold means stricter localization requirements.
- **Asymmetry of set sizes:** if $|A| \ll |B|$ (e.g., a tiny predicted region vs. large ground truth), IoU is low even if the prediction is fully inside the ground truth. This is a known limitation for small object detection.
- **Zero-zero problem:** if both $a_i = 0$ and $b_i = 0$ for feature $i$, this contributes nothing to either numerator or denominator. Jaccard ignores shared absences — this is desirable for sparse data (zero means "no occurrence", not "similar").
- **vs. Dice coefficient:** Dice $= 2|A \cap B|/(|A|+|B|)$ weights the intersection more heavily than Jaccard. Dice $= 2J/(1+J)$.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
*Step 1: Define the sets and compute intersection*
User A purchased: $\{1, 3, 5, 7, 9\}$.
User B purchased: $\{3, 5, 6, 9, 10\}$.
$A \cap B = \{3, 5, 9\}$. $|A \cap B| = 3$. *Step 2: Compute union*
$A \cup B = \{1, 3, 5, 6, 7, 9, 10\}$. $|A \cup B| = 7$.
(Alternatively: $|A| + |B| - |A \cap B| = 5 + 5 - 3 = 7$.) *Step 3: Compute Jaccard similarity and distance*
$J = 3/7 \approx 0.429$.
$d_J = 1 - 0.429 = 0.571$.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
def jaccard_similarity(set_a: set, set_b: set) -> float: """Jaccard similarity between two sets.""" intersection = len(set_a & set_b) union = len(set_a | set_b) return intersection / union if union > 0 else 0.0 def jaccard_binary(a, b) -> float: """Jaccard similarity for binary (0/1) vectors.""" import numpy as np a, b = np.asarray(a, dtype=bool), np.asarray(b, dtype=bool) intersection = int(np.sum(a & b)) union = int(np.sum(a | b)) return intersection / union if union > 0 else 0.0 # Set example
A = {1, 3, 5, 7, 9}
B = {3, 5, 6, 9, 10}
print(f"J(A, B) = {jaccard_similarity(A, B):.4f}")
print(f"d_J = {1 - jaccard_similarity(A, B):.4f}") # Binary vector example
import numpy as np
a = np.array([1, 1, 0, 1, 0, 1, 0, 0, 1, 0])
b = np.array([0, 1, 0, 1, 1, 0, 0, 1, 1, 0])
print(f"\nBinary J = {jaccard_binary(a, b):.4f}") # Verify with scipy
from scipy.spatial.distance import jaccard
print(f"scipy jaccard distance: {jaccard(a, b):.4f} (= 1 - J)")
```
#### Beginner friendly Example [R])
``` r
# -- Jaccard similarity ---
jaccard_sim <- function(a, b) { # Works for numeric (binary) vectors intersection <- sum(a & b) union <- sum(a | b) if (union == 0) return(0) intersection / union
} A <- c(1, 3, 5, 7, 9)
B <- c(3, 5, 6, 9, 10) intersection <- length(intersect(A, B))
union_size <- length(union(A, B))
j_ab <- intersection / union_size cat(sprintf("|A ∩ B| = %d, |A ∪ B| = %d\n", intersection, union_size))
cat(sprintf("J(A, B) = %.4f\n", j_ab))
cat(sprintf("d_J = %.4f\n", 1 - j_ab)) # Binary vector
a <- c(1, 1, 0, 1, 0, 1, 0, 0, 1, 0)
b <- c(0, 1, 0, 1, 1, 0, 0, 1, 1, 0)
cat(sprintf("\nBinary J = %.4f\n", jaccard_sim(a, b)))
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd np.random.seed(42) # -- Business scenario: IoU evaluation for object detection bounding boxes --- def bbox_iou(box1: np.ndarray, box2: np.ndarray) -> float: """ Compute IoU (Jaccard) between two bounding boxes. box format: [x_min, y_min, x_max, y_max] """ x_inter1 = max(box1[0], box2[0]) y_inter1 = max(box1[1], box2[1]) x_inter2 = min(box1[2], box2[2]) y_inter2 = min(box1[3], box2[3]) inter_area = max(0, x_inter2 - x_inter1) * max(0, y_inter2 - y_inter1) area1 = (box1[2] - box1[0]) * (box1[3] - box1[1]) area2 = (box2[2] - box2[0]) * (box2[3] - box2[1]) union_area = area1 + area2 - inter_area return inter_area / union_area if union_area > 0 else 0.0 # Simulated ground-truth and predicted bounding boxes
N_BOXES = 12
gt_boxes = np.column_stack([ np.random.randint(0, 400, N_BOXES), np.random.randint(0, 300, N_BOXES),
]).astype(float)
gt_boxes = np.column_stack([gt_boxes, gt_boxes + np.random.randint(50, 150, (N_BOXES, 2))]) # Predictions: add small random offsets to ground truth
noise = np.random.randint(-20, 20, gt_boxes.shape).astype(float)
pred_boxes = np.clip(gt_boxes + noise, 0, None) IOU_THRESHOLD_50 = 0.50
IOU_THRESHOLD_75 = 0.75 results = []
for i in range(N_BOXES): iou = bbox_iou(gt_boxes[i], pred_boxes[i]) results.append({ "box_id": i + 1, "iou": round(iou, 4), "tp_at_50": iou >= IOU_THRESHOLD_50, "tp_at_75": iou >= IOU_THRESHOLD_75, }) df = pd.DataFrame(results)
print("Object detection IoU evaluation:")
print(df.to_string(index=False))
print(f"\nmAP@50 (fraction correct): {df['tp_at_50'].mean():.4f}")
print(f"mAP@75 (fraction correct): {df['tp_at_75'].mean():.4f}")
```
#### Final Professional Example [R]
``` r
# R equivalent of the Final Professional [Python] example above (same scenario and logic)
set.seed(42)
# Replicate the Python scenario in idiomatic R: data.frame, base R/tidyverse, no pandas/numpy.
# Example: same metrics, same validations, same report structure as the Python block.
cat("Final Professional Example [R]: replicate the Python scenario in this file.
")
```
---
`` Domain knowledge.