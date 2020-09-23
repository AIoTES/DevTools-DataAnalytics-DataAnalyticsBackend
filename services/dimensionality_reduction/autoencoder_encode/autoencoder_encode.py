import sys
import json
import numpy as np
import ast
from torch.autograd import Variable
import torch.utils.data as data_utils
import torch
from AutoEncoderImp import AutoEncoder, json2orderedDic
from collections import OrderedDict

if (len(sys.argv) > 1):
    try :

        # handle arguments
        inputDataFileName = sys.argv[1]
        inputParamFileName = sys.argv[2]
        outputDataFileName = sys.argv[3]
        latent_size = int(sys.argv[4])
        hidden_dims = [int(x) for x in sys.argv[5].split(',') if x] #ast.literal_eval(sys.argv[5])
        param_order = [str(x) for x in sys.argv[6].split(',') if x]
        
        # read input file
        inputDataFile = open(inputDataFileName, "r")
        inputDataStr = inputDataFile.read()
        inputDataFile.close()
        inputData = json.loads(inputDataStr)

        data = torch.tensor(inputData) # data in tensor, num_samples x dimension of input

        # read model parameters
        inputParamFile = open(inputParamFileName, "r")
        inputParamStr = inputParamFile.read()
        inputParamFile.close()
        paramData = json.loads(inputParamStr)
        
        
        N = data.shape[0] # num_samples
        dataDin = data.shape[1] # dimension of data sample
        modelDin = len(paramData[param_order[0]][0]) # size of input layer [0]
        
        if dataDin!=modelDin:
            result = {'error': 'Mismatch in model input layer size and data dimensions. Expected data of size {} but got {}'.format(modelDin, dataDin)}
        else:            

            # test phase parameters
            use_cuda = torch.cuda.is_available()
            if use_cuda :
                device = torch.device("cuda:0")
                torch.backends.cudnn.benchmark = True
            else:
                device = "cpu"

            # test phase
            state_dic = json2orderedDic(param_order, paramData) # load model state dic       
            layers = [modelDin]
            layers.extend(hidden_dims)
            model = AutoEncoder(latent_size, layers).to(device)
            model.load_state_dict(state_dic) # load model
            model.eval() # set model to evaluate mode
            
            outputData = model.encoder(data) # use encoder to get the latent space representation of input data            
            result = outputData.tolist()    

    except Exception as e:
        result = {'error': str(e) , 'args': sys.argv}
    finally:    
        # write output file
        outputDataStr = json.dumps(result, sort_keys=True) # order is not retained for some reason => modelParametersOrder
        outputDataFile = open(outputDataFileName, "w")
        outputDataFile.write(outputDataStr)
        outputDataFile.close()
           
    
sys.stdout.flush()
