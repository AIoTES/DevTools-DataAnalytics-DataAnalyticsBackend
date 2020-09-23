import sys
import json
import numpy as np
import pandas as pd
from HMMsupervised import estimate_hmm_params
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
        observation_labels = json.loads(inputParamStr)
        observation_labels = list(observation_labels)

        # load data to dataframe
        data = np.asarray(inputData) # data
        df_columns = ['hidden_state'] + observation_labels
        data = pd.DataFrame(data=data, columns=df_columns)

        X = data.drop('hidden_state', axis=1)
        X = X.to_numpy()

        # options
        gmm_comp_num = 3 # Gussian Mixture Model component number. GMM models cond. probability of emission given state
        random_seed = 2
        
        # compute Hidden Markov Model
        startprob, transmat, gmms = estimate_hmm_params(data, comp_num=gmm_comp_num) # estimate HMM parameters ("train phase")
        
        num_states = transmat.shape[0] # number of states
        n_mix = gmms[0].n_components # number of GMM mixture components

        model = hmm.GMMHMM(n_components=num_states, covariance_type="full", random_state=random_seed, n_mix = n_mix) # construct HMM model
        model._init(X)
        for z in range(len(gmms)):
            model.covars_[z,:,:,:] = gmms[z].covariances_ # (n_components, n_mix, n_features, n_features)  if "full"
            model.means_[z,:,:] = gmms[z].means_ # (n_components, n_mix, n_features)
            model.weights_[z,:] = gmms[z].weights_        

        # save results
        bytes_model=pickle.dumps(model)
        serial_model = codecs.encode(pickle.dumps(bytes_model), "base64").decode() # serialize model

        result = {"model": serial_model, "observationsOrder": observation_labels}

    except Exception as e:
        result = {'error': str(e) , 'args': sys.argv, 'other': df_columns}
    finally:    
        # write output file
        outputDataStr = json.dumps(result, sort_keys=True) # order is not retained for some reason => modelParametersOrder
        outputDataFile = open(outputDataFileName, "w")
        outputDataFile.write(outputDataStr)
        outputDataFile.close()

sys.stdout.flush()
