import sys
import json
from statsmodels.tsa.arima_model import ARIMA
import numpy as np

if (len(sys.argv) > 1):
    # handle arguments
    inputDataFileName = sys.argv[1]
    outputDataFileName = sys.argv[2]
    arOrder = int(sys.argv[3])
    iOrder = int(sys.argv[4])
    maOrder = int(sys.argv[5])
    steps = int(sys.argv[6])

    # read input file
    inputDataFile = open(inputDataFileName, "r")
    inputDataStr = inputDataFile.read()
    inputDataFile.close()
    inputData = json.loads(inputDataStr)

    # do computations
    x = np.array(inputData)
    model = ARIMA(x, order = (arOrder, iOrder, maOrder))
    model_fit = model.fit(disp = False)
    #epestrepse tis parametrous toy train modelou
    #auta xrisimopoipountai meta kata to test 
    pred = model_fit.forecast(steps)

    # kmeans = KMeans(n_clusters=nClusters, random_state=0).fit(X)
    # labels = kmeans.labels_.tolist()

    result = {
        "forecast": pred[0].tolist(),
        "stderr": pred[1].tolist(),
        "conf_int": pred[2].tolist()
    }

    # write output file
    outputDataStr = json.dumps(result)
    outputDataFile = open(outputDataFileName, "w")
    outputDataFile.write(outputDataStr)
    outputDataFile.close()

sys.stdout.flush()
