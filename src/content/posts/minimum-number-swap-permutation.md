---
title: "Minimum Number of swap for a permutation"
date: 2026-04-28
---


# Description 

Given an array of permutation $P$ with size of $N$, find the number of operations that one should execute so that the array 
is in sorted. 
In an operation, one could choose two indices $i$ and $j$ such that $1 \leq i,j \leq N$ and swap the value of $P_i$ and $P_j$. 

For example, for $N=5$ and $P=[1,2,5,3,4]$, the number of operations that should be done is $2$. We could do the operation on pair of indices $(3,4)$ and $(4,5)$.


# Solving the Problem

## Intuition 
One can observe that there may exists some kind of *circuit* like pattern in $P$. I use the term *circuit* loosely here.
A circuit $C$ is defined as a set of number (that represents indices in the $P$) such that the graph that it could create—which will be later explained—resembles a cycle loop. 
It's obvious that a graph $G$ would be defined by its $(V,E)$. It's obvious that the $V$ is defined by set of indices in the circuit $C$ itself. The set $E$ could be created by iteratively augmenting edge of $(u,P_u)$ for $u \in C$. 

The graph is a directed cyclic type because for each node $n$, where $n \in V$, we know that there is only $1$ other node pointing towards node $n$—due to there exists only 1 other node $m$ that should replace $n$ such that the node $m$  would be in its correct position—and only 1 other node $o$ such that
the correct position of node $n$ is occupied by node $o$. 


## Solution

We could solve each circuit independently—because each node in circuit $C$ does not need to "interfere"/swap with the other circuit.  

For  each circuit $C$, the number of swap needed is $|C|$. For each $C$, we can arbitarily choose a node $n$ and do swap it to its correct position. The iteration continues until there only exists 2 nodes in $C$ that is still not in the right place. 
Because there exists only 2 remaining node, it's obvious that we could just swap—just do $1$ operation—and both node are swapped in a right place. 


Therefore, the number of minimum swap is $\sum_{c \in C}{|c|-1}$ where $C$ is the set of circuit that exists in $P$. However, this equation could be further simplified. 
We could do the *distribution* rules and change the answer into $\sum_{c \in C} |c| + \sum_{c \in C} -1$. The first part of the summation 
is equals to $N$ as the sum of size of all circuits are equal to the number of element in the $P$ and the secnd part is equal to the number of circuit, i.e. $|C|$. 

Because of that, the simplified solution are $N$ - $|C|$. 




