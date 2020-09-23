import sys
import json
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

if (len(sys.argv) > 1):

    # handle arguments
    inputDataFileName = sys.argv[1]
    outputDataFileName = sys.argv[2]
    nClusters = int(sys.argv[3])
    extraInfo = sys.argv[4].lower() == 'true'

    # read input file
    inputDataFile = open(inputDataFileName, "r")
    inputDataStr = inputDataFile.read()
    inputDataFile.close()
    inputData = json.loads(inputDataStr)

    # do computations
    X = np.array(inputData)
    kmeans = KMeans(n_clusters=nClusters, random_state=0).fit(X)
    labels = kmeans.labels_.tolist()
    if extraInfo:
        silhouette_avg = silhouette_score(X, labels)

    # write output file
    out = dict()
    if extraInfo:
        out['labels'] = labels
        out['silhouetteScore'] = silhouette_avg
    else: # old response
        out = labels

    outputDataStr = json.dumps(out)
    outputDataFile = open(outputDataFileName, "w")
    outputDataFile.write(outputDataStr)
    outputDataFile.close()

sys.stdout.flush()
