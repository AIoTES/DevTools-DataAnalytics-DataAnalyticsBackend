import sys
import json
from statsmodels.tsa.arima_model import ARIMA
import numpy as np

if (len(sys.argv) > 1):
    # handle arguments
    try:
        inputDataFileName = sys.argv[1]
        outputDataFileName = sys.argv[2]
        arOrder = int(sys.argv[3])
        iOrder = int(sys.argv[4])
        maOrder = int(sys.argv[5])
        #steps = int(sys.argv[6])

        # read input file
        inputDataFile = open(inputDataFileName, "r")
        inputDataStr = inputDataFile.read()
        inputDataFile.close()
        inputData = json.loads(inputDataStr)

        # default parameters
        alpha = .05

        # do computations
        x = np.array(inputData)
        model = ARIMA(x, order = (arOrder, iOrder, maOrder))
        model_fit = model.fit(disp = False)

        if isinstance(model, ARIMA):
            k_diff =  model_fit.k_diff
        else:
            k_diff = 0
        
        # compute evaluation metrics https://otexts.com/fpp2/accuracy.html
        res = model_fit.resid # residual errors
        rmse = 0 
        rmse = np.sqrt(np.mean(np.square(res)))
        mae = np.mean(np.abs(res))

        # pass nodel parameters to json
        model_params = {'arparams': model_fit.arparams.tolist(), 'maparams': model_fit.maparams.tolist(), 'k_diff': k_diff, 'sigma2': model_fit.sigma2, 'method': model_fit.model.method, 'alpha': alpha}
        fit_metrics = {'RootMeanSquareError': rmse, 'MeanAbsoluteError': mae,}
        result = {'fitMetrics' : fit_metrics, 'modelParameters': model_params}
    except Exception as e:
        result = {"error": str(e)}
    # write output file
    outputDataStr = json.dumps(result)
    outputDataFile = open(outputDataFileName, "w")
    outputDataFile.write(outputDataStr)
    outputDataFile.close()

sys.stdout.flush()
