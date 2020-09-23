import sys
import json
from sklearn import manifold
import numpy as np

if (len(sys.argv) > 1):
    # handle arguments
    inputDataFileName = sys.argv[1]
    outputDataFileName = sys.argv[2]
    nDim = int(sys.argv[3])

    # read input file
    inputDataFile = open(inputDataFileName, "r")
    inputDataStr = inputDataFile.read()
    inputDataFile.close()
    inputData = json.loads(inputDataStr)

    # do computations
    D = np.array(inputData)
    mds = manifold.MDS(n_components=nDim, eps=1e-9, dissimilarity="precomputed")
	# MDS output points coordinates
    pos = mds.fit(D).embedding_
    coords = pos.tolist()

    # write output file
    outputDataStr = json.dumps(coords)
    outputDataFile = open(outputDataFileName, "w")
    outputDataFile.write(outputDataStr)
    outputDataFile.close()

sys.stdout.flush()
