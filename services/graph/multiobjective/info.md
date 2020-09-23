# Multi-objective graph service

The multi-objective graph service transforms an input dataset into a graph that encodes the similarities among the dataset rows. The nodes of the final graph correspond to the rows of the input dataset. The edges of the final graph connect nodes that are similar to each other, with respect to the combination of custom features specified by the user.

The input data are in the form of an array of records:

```json
[
    {"x": 20.33, "y": 70.96, "z": 1.2},
    {"x": 26.51, "y": 46.48, "z": 2.5},
    {"x": 22.54, "y": 68.96, "z": 4.6},
    {"x": 29.93, "y": 43.48, "z": 6.7},
    {"x": 13.05, "y": 76.32, "z": 7.9},
    {"x": 25.23, "y": 68.91, "z": 3.8},
    {"x": 23.15, "y": 60.84, "z": 2.7},
    {"x": 34.78, "y": 62.37, "z": 8.3},
    {"x": 35.41, "y": 58.89, "z": 1.2},
    {"x": 38.51, "y": 56.14, "z": 0.1},
    {"x": 97.18, "y": 79.07, "z": 2.4},
    {"x": 68.05, "y": 68.71, "z": 2.0},
    {"x": 76.95, "y": 84.01, "z": 3.0},
    {"x": 77.89, "y": 94.23, "z": 1.4},
    {"x": 95.12, "y": 81.54, "z": 2.5},
    {"x": 60.34, "y": 75.14, "z": 4.5},
    {"x": 97.88, "y": 92.36, "z": 7.7},
    {"x": 75.69, "y": 82.10, "z": 6.7},
    {"x": 90.30, "y": 75.00, "z": 8.2},
    {"x": 85.81, "y": 86.13, "z": 8.1}
]
```
