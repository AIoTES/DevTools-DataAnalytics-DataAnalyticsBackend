import sys
import json
import numpy as np
from scipy.stats import norm
from statsmodels.tsa.arima_process import arma2ma
from statsmodels.tsa.arima_model import cumsum_n, _arma_predict_out_of_sample
from statsmodels.tsa.tsatools import unintegrate, unintegrate_levels
from statsmodels.tsa.arima_model import ARIMA

# CURRENT VERSION IS FOR ARMA, AR model prediction

def prepare_timeseries(p, q, x, k):
    # prepare timeseries for calculations, append zeros etc    
    xnew = np.pad(x, pad_width=(0, k), mode='constant') # original timeseries with zeros appended in the end. 
    xhat = np.zeros(xnew.shape) # ARMA model estimated timeseries
    error = np.zeros(xnew.shape) # error between real timeseries and ARMA model output
    return xnew, xhat, error
    
def _forecast_error(steps, sigma2, arparams, maparams, k_diff=0):
    # altered and integrated from statsmodels.tsa.arima_model
	ma_rep = arma2ma(np.r_[1, -arparams], np.r_[1, maparams], lags=steps)
	fcerr = np.sqrt(np.cumsum(cumsum_n(ma_rep, k_diff)**2)*sigma2)
	return fcerr

def _forecast_conf_int(forecast, fcerr, alpha):
    # integrated from statsmodels.tsa.arima_model
	const = norm.ppf(1 - alpha/2.)
	conf_int = np.c_[forecast - const*fcerr, forecast + const*fcerr]
	return conf_int

if (len(sys.argv) > 1):
    # handle arguments
    try:
        inputDataFileName = sys.argv[1]
        outputDataFileName = sys.argv[2]

        # arparams = int(sys.argv[3])
        # maparams = int(sys.argv[4])
        steps = int(sys.argv[3])
        sigma2 = float(sys.argv[4])
        alpha = float(sys.argv[5])

        inputDataFile = open(inputDataFileName, "r")
        inputDataStr = inputDataFile.read()
        inputDataFile.close()
        inputData = json.loads(inputDataStr)
        x = np.array(inputData["data"])
        
        arparams =  np.array(inputData["arparams"])
        maparams =  np.array(inputData["maparams"])
        # trend_param =  np.array(model['trendparam'])
        # k_diff =  model['k_diff']

        p = arparams.shape[0] # order of AR model
        q = maparams.shape[0] # order of MA model
        k = int(steps) # k steps ahead

        xnew, xhat, error = prepare_timeseries(p, q, x, k)

        # do computations
        # compute recursively the AR and MA terms, needed for forecasting
        for i in range (p, len(x)):
            if i>p: # asssume error zero => AR process for init. TODO: check back-forecasting [Box, Jenkins, and Reinsel (2008)] as a better method
                error[i]= x[i] - xhat[i] # prediction errors, will be used next loop

            endog = x[i-p+1:i+1]    # from x[i-p] up to x[i-1]
            if q: # ARMA
                err = error[i-q+1:i+1]
                xhat[i+1] = np.dot(arparams, endog) + np.dot(maparams, err) # arparams is configured such that last ar param correspond to x[1]
            else: # AR
                xhat[i+1] = np.dot(arparams, endog)
        error[i]= x[i] - xhat[i]

        # step ahead forecasting
        for i in range (len(x), len(x)+k):
            # no error estimation since we don't have real value to estimate, instead it's kept to zeros    
            xnew[i] = xhat[i] # timeseries is appended with forecasted values, chained forecast
            endog = xnew[i-p+1:i+1] 
            if q: 
                err = error[i-q+1:i+1]
                xhat[i] = np.dot(arparams, endog) + np.dot(maparams, err)
            else:
                xhat[i] = np.dot(arparams, endog)        

        forecast = xhat[-k:]
        fcasterr = _forecast_error(k, sigma2, arparams, maparams)
        conf_int = _forecast_conf_int(forecast, fcasterr, alpha)

        # TODO ARIMA
        # if model['k_diff']: # ARIMA => unintegrate
        #     d = model['k_diff']
        #     data_endog = np.array(model['data_endog'])
        #     endog = data_endog[-d:]
        #     forecast = unintegrate(forecast, unintegrate_levels(endog, d))[d:]

        # model = ARIMA(x, order = (p, 0, q))
        # model_fit = model.fit(disp = False)
        # xhat = model_fit.forecast(k)[0]
        result = {
            "forecast": list(xhat[-k:]),
            "stderr": fcasterr.tolist(),
            "conf_int": conf_int.tolist()
        }
    except Exception as e:
        result = {"error": str(e)}
    finally:
        # write output file
        outputDataStr = json.dumps(result)
        outputDataFile = open(outputDataFileName, "w")
        outputDataFile.write(outputDataStr)
        outputDataFile.close()

sys.stdout.flush()
