import sys
import json
import numpy as np
import ast
from torch.autograd import Variable
import torch.utils.data as data_utils
import torch
from AutoEncoderImp import AutoEncoder, orderedDic2json
from collections import OrderedDict

if (len(sys.argv) > 1):
    # handle arguments
    print(sys.argv)
    inputDataFileName = sys.argv[1]
    outputDataFileName = sys.argv[2]
    latent_size = int(sys.argv[3])
    hidden_dims = ast.literal_eval(sys.argv[4])
    
    # read input file
    inputDataFile = open(inputDataFileName, "r")
    inputDataStr = inputDataFile.read()
    inputDataFile.close()
    inputData = json.loads(inputDataStr)

    data = torch.tensor(inputData) # data in tensor, num_samples x dimension of input

    # training phase parameters
    num_of_epochs = 10
    batch_size = 64
    num_workers = 6
    #device = 'cpu'
    use_cuda = torch.cuda.is_available()
    if use_cuda :
        device = torch.device("cuda:0")
        torch.backends.cudnn.benchmark = True
    else:
        device = "cpu"

    N = data.shape[0] # num_samples
    D_in = data.shape[1] # dimension of input

    train = data_utils.TensorDataset(data) # 
    train_loader = data_utils.DataLoader(train, batch_size=batch_size, shuffle=True)

    # train phase
    layers = [D_in]
    layers.extend(hidden_dims)
    model = AutoEncoder(latent_size, layers).to(device) # init model 
    for epoch in range(num_of_epochs):# Loop over epochs
        for local_batch in train_loader:     # Training
            x = local_batch[0]
            loss = model.step(x)
        print('epoch {}/{} Loss: {}'.format(epoch+1, num_of_epochs, loss.item()))
 
	# save model
    state_dic = model.state_dict()
    param_order, json_dic = orderedDic2json(state_dic)

    # json response
    result = OrderedDict([('inputLayerDim', D_in), ('lattentLayerDim', latent_size),
                          ('hiddenLayersDim', hidden_dims), ('modelParametersOrder', param_order), ('modelParameters', json_dic)])

    # write output file
    outputDataStr = json.dumps(result, sort_keys=True) # order is not retained for some reason => modelParametersOrder
    outputDataFile = open(outputDataFileName, "w")
    outputDataFile.write(outputDataStr)
    outputDataFile.close()
           
    
sys.stdout.flush()
