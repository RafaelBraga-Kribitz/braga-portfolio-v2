---
title: Expected Hitting Time (Random Walks)
date: '2026-04-16'
wordCount: 549
slug: expected_hitting_time_random_walks
permalink: /notes/06_ml_math/network_analysis_graph_theory/markov_processes_in_networks/expected_hitting_time_random_walks/index.html
share_status: draft
publish_target: note
boundary: public
---
# $H_{ij} = \mathbb{E}_i[T_j]$ We are working on the expected hitting time in a random walk on a graph, where $$H_{ij} = \mathbb{E}_i[T_j]$$ is the expected number of steps needed for a walk starting at node $i$ to reach node $j$ for the first time. It is defined for a Markov chain on the graph and is obtained by solving a linear system induced by the transition matrix. This quantity links random-walk dynamics to network structure, commute time, and resistance-based interpretations.
## Deep Breakdown Expected hitting time is one of the central quantities in random walks on graphs and Markov processes in networks. At an intuitive level, it answers: > If I start at node $i$ and move randomly according to the graph transition probabilities, how long do I expect to wait before I visit node $j$ for the first time? This is written as: $$
H_{ij} = \mathbb{E}_i[T_j]
$$ where: - $T_j$ is the first time the walk reaches node $j$,
- $\mathbb{E}_i[\cdot]$ means expectation given that the walk starts at node $i$. This is a **first-passage** or **first-arrival** quantity. It is not the expected number of visits, and it is not the probability of ever reaching $j$ in one step. It is specifically about the expected waiting time until the first arrival. For a Markov chain on a graph with transition matrix $P$, the hitting time satisfies a recursive relation: - if you are already at the target node $j$, the hitting time is zero,
- otherwise, you take one step, then continue from the next node. That gives the system: $$
H_{jj} = 0
$$ and for $i \ne j$: $$
H_{ij} = 1 + \sum_{k} P_{ik} H_{kj}
$$ This is the main linear equation for expected hitting time. Inputs: - a graph or Markov chain,
- a transition matrix $P$,
- a starting node $i$,
- a target node $j$. Outputs: - the expected number of steps to hit $j$ for the first time. Why it matters in DA/DS: - it measures how navigable a network is from one node to another,
- it is sensitive to graph bottlenecks and connectivity patterns,
- it supports ranking of nodes by accessibility,
- it connects to commute time and resistance distance,
- it is useful in recommendation, influence propagation, network routing, and random-walk embeddings. In graph terms, a node $j$ with low average incoming hitting time is easy to reach from the rest of the network. A node with large hitting times may be isolated, peripheral, or shielded by bottlenecks. This object links directly to: - **transition matrix**, because the recursion uses $P$,
- **Markov chains**, because the random walk is a Markov process,
- **commute time**, because commute time is built from two hitting times,
- **resistance distance**, because in undirected graphs commute times are tied to electrical-network quantities.
### Flowchart (Mermaid) ```mermaid
flowchart TD A["Start at node i"] --> B["Target node is j"] B --> C["If i = j, hitting time is 0"] C --> D["If i ≠ j, take one random-walk step"] D --> E["Move to neighbor k with probability P_ik"] E --> F["Accumulate 1 step plus expected remaining time H_kj"] F --> G["Average over all possible next nodes"] G --> H["Solve linear system for H_ij"] H --> I["Interpret accessibility, navigation, or influence reachability"]