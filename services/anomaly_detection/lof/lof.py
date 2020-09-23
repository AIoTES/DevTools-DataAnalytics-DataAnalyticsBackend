import sys
import json
from sklearn.neighbors import LocalOutlierFactor
import numpy as np

if (len(sys.argv) > 1):
    # handle arguments
    inputDataFileName = sys.argv[1]
    outputDataFileName = sys.argv[2]
    nNeigh = int(sys.argv[3])

    # read input file
    inputDataFile = open(inputDataFileName, "r")
    inputDataStr = inputDataFile.read()
    inputDataFile.close()
    inputData = json.loads(inputDataStr)

    # do computations
    X = np.array(inputData).astype(float)
    # TODO: adapt noise amplitude according to data
    X += np.random.randn(X.shape[0], X.shape[1]) * 0.1
    clf = LocalOutlierFactor(n_neighbors=nNeigh, contamination="auto")
    clf.fit_predict(X)
    scores = clf.negative_outlier_factor_.tolist()

    # write output file
    outputDataStr = json.dumps(scores)
    outputDataFile = open(outputDataFileName, "w")
    outputDataFile.write(outputDataStr)
    outputDataFile.close()

sys.stdout.flush()
