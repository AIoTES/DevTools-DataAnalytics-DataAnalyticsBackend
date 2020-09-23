import sys
import json
import numpy as np
import pandas as pd
from hmmlearn import hmm
import pickle
import codecs

if (len(sys.argv) > 1):
    try :
        # handle arguments
        inputDataFileName = sys.argv[1]
        inputParamFileName = sys.argv[2]
        outputDataFileName = sys.argv[3]
        
        # read input file
        inputDataFile = open(inputDataFileName, "r")
        inputDataStr = inputDataFile.read()
        inputDataFile.close()
        inputData = json.loads(inputDataStr)

        # read model parameters
        inputParamFile = open(inputParamFileName, "r")
        inputParamStr = inputParamFile.read()
        inputParamFile.close()
        parameters = json.loads(inputParamStr)
        observation_labels = list(parameters['observationsOrder']) # order of observations

        # load data to dataframe
        data = np.asarray(inputData) # data
        #data = pd.DataFrame(data=data, columns=observation_labels)

        # read model parameters
        inputParamFile = open(inputParamFileName, "r")
        inputParamStr = inputParamFile.read()
        inputParamFile.close()
        paramData = json.loads(inputParamStr)

        # load model
        model = pickle.loads(pickle.loads(codecs.decode(parameters['model'].encode(), "base64")))

        # prediction using Viterbi algorithm, same as >>>_, prediction = model.decode(X, algorithm="viterbi")
        prediction = model.predict(data)

        result = {"prediction": prediction.tolist() }
        # data_out = []
        # for i in range(data.shape[0]):
        #     row = {}
        #     row["prediction"] = prediction[i]
        #     for j, attribute in enumerate(observation_labels): 
        #         row[attribute] = data[i,j]
        #     data_out.append(row)

        # result = {"data": data_out }

    except Exception as e:
        result = {'error': str(e) , 'args': sys.argv}
    finally:    
        # write output file
        outputDataStr = json.dumps(result)
        outputDataFile = open(outputDataFileName, "w")
        outputDataFile.write(outputDataStr)
        outputDataFile.close()

sys.stdout.flush()