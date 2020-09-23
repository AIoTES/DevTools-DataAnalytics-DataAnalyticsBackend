import sys
import json
from sklearn.cluster import DBSCAN
from sklearn import metrics
import numpy as np

if (len(sys.argv) > 1):
    try :
        # handle arguments
        inputDataFileName = sys.argv[1]
        outputDataFileName = sys.argv[2]
        eps = float(sys.argv[3])
        min_samples = int(sys.argv[4])
        metric =  str(sys.argv[5])
        
        # read input file
        inputDataFile = open(inputDataFileName, "r")
        inputDataStr = inputDataFile.read()
        inputDataFile.close()
        inputData = json.loads(inputDataStr)

        # do computations
        X = np.array(inputData)
        dbscan = DBSCAN(eps=eps, min_samples=min_samples, metric=metric).fit(X)
        labels = dbscan.labels_.tolist()
    except Exception as e:
        result = {'error': str(e) , 'args': sys.argv}
    finally:    
        # write output file
        outputDataStr = json.dumps(labels)
        outputDataFile = open(outputDataFileName, "w")
        outputDataFile.write(outputDataStr)
        outputDataFile.close()

sys.stdout.flush()
