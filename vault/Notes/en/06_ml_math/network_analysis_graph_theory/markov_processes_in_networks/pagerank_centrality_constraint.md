---
title: PageRank (Centrality) Constraint
date: '2026-04-16'
wordCount: 517
slug: pagerank_centrality_constraint
permalink: /notes/06_ml_math/network_analysis_graph_theory/markov_processes_in_networks/pagerank_centrality_constraint/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\pi = \alpha P^\top \pi + (1-\alpha)v$ We are working on the PageRank centrality constraint, where the stationary ranking vector $\pi$ satisfies $$\pi = \alpha P^\top \pi + (1-\alpha)v.$$ Here $P$ is the transition matrix of the link graph, $\alpha \in (0,1)$ is the damping factor, and $v$ is the teleportation vector. This defines the stationary distribution of the random-surfer process and makes PageRank a centrality measure based on a modified Markov chain rather than raw degree alone.
## Deep Breakdown PageRank is one of the most important centrality measures in network analysis because it does not just count how many links point to a node. It asks a more useful question: > If a random surfer keeps moving through the network, with occasional teleportation, how often does the surfer spend time at each node in the long run? That long-run probability distribution is the PageRank vector $\pi$. The canonical equation is: $$
\pi = \alpha P^\top \pi + (1-\alpha)v
$$ This says the ranking vector is a weighted combination of two behaviors: 1. **Link-following behavior**: $$ \alpha P^\top \pi $$ With probability $\alpha$, the surfer follows the network links. 2. **Teleportation behavior**: $$ (1-\alpha)v $$ With probability $1-\alpha$, the surfer jumps to a node according to distribution $v$. This matters because raw random walks can fail on real directed networks: - they can get trapped in sinks,
- they can be reducible,
- they may not have a unique useful stationary distribution. Teleportation fixes that by making the process ergodic under standard conditions, so PageRank exists and is unique. Inputs: - a directed or undirected graph,
- a transition matrix $P$,
- damping factor $\alpha$,
- teleportation vector $v$. Output: - a probability vector $\pi$ assigning centrality scores to nodes. Why it matters in DA/DS: - it ranks nodes by network importance,
- it accounts for quality of incoming links, not just quantity,
- it stabilizes ranking in sparse or messy networks,
- it is interpretable as stationary flow,
- it generalizes naturally to personalized ranking. In business and applied network settings, PageRank is useful for: - ranking web pages,
- ranking products in click or recommendation graphs,
- identifying influential users or accounts,
- ranking entities in citation, transaction, or navigation networks,
- prioritizing nodes that are structurally important in flow-based systems. This object links directly to: - **Markov chains**, because PageRank is a stationary distribution,
- **stationary distributions**, because $\pi$ is the fixed point of a stochastic process,
- **eigenvector centrality**, because PageRank is a damped eigenvector-style ranking,
- **personalization**, because $v$ controls where teleportation mass goes.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start with network and adjacency structure"] --> B["Build transition matrix P"] B --> C["Choose damping factor α"] C --> D["Choose teleportation vector v"] D --> E["Define PageRank equation π = αP^Tπ + (1-α)v"] E --> F["Interpret as random surfer"] F --> G["With probability α follow links"] F --> H["With probability 1-α teleport using v"] G --> I["Obtain modified Markov chain"] H --> I I --> J["Solve for stationary distribution π"] J --> K["Use π as node centrality or ranking score"]