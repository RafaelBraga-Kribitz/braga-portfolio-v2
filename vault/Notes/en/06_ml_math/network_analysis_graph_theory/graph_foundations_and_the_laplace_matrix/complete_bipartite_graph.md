---
title: Complete Bipartite Graph
date: '2026-04-16'
wordCount: 481
slug: complete_bipartite_graph
permalink: /notes/06_ml_math/network_analysis_graph_theory/graph_foundations_and_the_laplace_matrix/complete_bipartite_graph/index.html
share_status: draft
publish_target: note
boundary: public
---
# $K_{m,n}$ We are working on the complete bipartite graph $K_{m,n}$, where the vertex set is split into two disjoint parts of sizes $m$ and $n$, every vertex in the first part is connected to every vertex in the second part, and no edges exist within the same part. The canonical edge count is $$|E| = mn,$$ under the assumptions of a simple undirected bipartite graph with partition sets $V_1$ and $V_2$.
## Deep Breakdown A complete bipartite graph is one of the most important canonical objects in graph theory. It combines two ideas: 1. the graph is **bipartite**, meaning the vertices are split into two disjoint sets,
2. the graph is **complete across the split**, meaning every possible cross-part edge is present. If the two parts are: $$
V_1 \quad \text{with } |V_1| = m
$$ and $$
V_2 \quad \text{with } |V_2| = n,
$$ then the complete bipartite graph is written: $$
K_{m,n}
$$ and has an edge between every vertex in $V_1$ and every vertex in $V_2$. That means: - no two vertices inside $V_1$ are adjacent,
- no two vertices inside $V_2$ are adjacent,
- every vertex in $V_1$ connects to all vertices in $V_2$. The most immediate consequence is the edge count: $$
|E| = mn
$$ because each of the $m$ vertices in $V_1$ connects to each of the $n$ vertices in $V_2$. Why this matters in DA/DS: - it is a clean extreme case of two-mode or bipartite connectivity,
- it helps reason about user-item, buyer-product, author-paper, or account-device network structures,
- it gives exact degree, adjacency, and Laplacian formulas,
- it is a useful benchmark for graph density and projection behavior,
- it appears in spectral graph theory and extremal graph arguments. In practice, complete bipartite graphs often represent a **limit case** rather than a realistic final network. For example, in a recommender system, a real user-item graph is sparse. But $K_{m,n}$ is the theoretical maximum where every user interacts with every item. That makes it valuable for reasoning about bounds, stress tests, and formulas. This object links directly to: - **degree distribution**, because every vertex in the same part has identical degree,
- **adjacency matrix**, because it has a clean block structure,
- **Laplacian matrix**, because it produces a very structured block Laplacian,
- **bipartite graph theory**, because it is the canonical complete example.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with two disjoint vertex sets V_1 and V_2"] --> B["Assign sizes |V_1| = m and |V_2| = n"] B --> C["Forbid edges within the same part"] C --> D["Add every possible edge from V_1 to V_2"] D --> E["Obtain complete bipartite graph K_{m,n}"] E --> F["Count edges: |E| = mn"] F --> G["Compute degrees: deg(v)=n in V_1, deg(v)=m in V_2"] G --> H["Build adjacency and Laplacian block matrices"] H --> I["Use as bipartite benchmark or limit case in network analysis"]