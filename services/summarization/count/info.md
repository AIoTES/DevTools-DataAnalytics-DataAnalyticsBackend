# Counting service

This is a counting service for counting how many times a particular value has appeared in a dataset.

Let $A = \{a_1, a_2, \ldots, a_n\}$ be a set of labels $a_i \in \mathcal{L}$, where each label is taken from a set of possible labels $\mathcal{L} = \{l_1, l_2, \ldots, l_m\}$. Hereby, it is considered that set $A$ can contain duplicate values. The number of occurencies of label $l_i$ in the set $A$ is then:

$$
n_i = \left |\{a_j \in A : a_j = l_i\} \right |,
$$

where $|\cdot|$ denotes the cardinality of the set (the number of its elements).
