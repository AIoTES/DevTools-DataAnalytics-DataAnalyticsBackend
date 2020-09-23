import torch
from torch import nn, optim
from collections import OrderedDict 
import json


class AutoEncoder(nn.Module):
    """ 
    Implementation of Symmetrical AutoEncoder
    
    Inputs:
    latent_size     Size of latent layer
    hidden_dims[i]  Size of i-th hidden layer, hidden_dims[0] == input == output size
    learning_rate   Learning rate
    """
    
    def create_encoder_decoder(self, latent_size, hidden_dims):
        # activations functions to be used in hidden layers of encoder, decoder and output
        enc_activation = nn.ReLU
        dec_activation = nn.ReLU
        out_activation = nn.Sigmoid
        
        # ordered dictionaries storing model information
        enc_dic = OrderedDict() # encoder odered dic
        dec_dic = OrderedDict() # decoder ordered dic
        
        layer_dims = hidden_dims.copy()
        layer_dims.append(latent_size)
        
        layer_label = [ 'layer'+str(i) for i in range(len(layer_dims))]
        act_label =  [ 'act'+str(i) for i in range(len(layer_dims))]
                
        # encoder model construction
        for i in range(1, len(layer_dims)):
            enc_dic[layer_label[i]] = nn.Linear(layer_dims[i-1], layer_dims[i])
            if i<len(layer_dims)-1: # last layer not doesn't have activation
                enc_dic[act_label[i]] = enc_activation()      
        encoder = nn.Sequential(enc_dic)
        
        # decoder model construction        
        layer_dims.reverse()        
        for i in range(1, len(layer_dims)):
            dec_dic[layer_label[i]] = nn.Linear(layer_dims[i-1], layer_dims[i])
            if i<len(layer_dims)-1: # output layer has different activation function
                dec_dic[act_label[i]] = dec_activation()
            else:
                dec_dic['output_act'] = out_activation()
                
        decoder = nn.Sequential(dec_dic)
        return encoder, decoder
    
    
    def __init__(self, latent_size = 20, hidden_dims=[784,128], learning_rate=1e-3):
        super(AutoEncoder, self).__init__()
        
        self.encoder, self.decoder =  self.create_encoder_decoder(latent_size, hidden_dims)            
        self.optimizer = optim.Adam(self.parameters(), lr=learning_rate)

    # @classmethod
    # def from_OrderedDict(cls, state_dic: collections.OrderedDict) -> AutoEncoder:
        
        
    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        #return encoded, decoded
        return decoded
    
    def compute_loss(self, x_hat, x):
        loss_fn = nn.L1Loss() 
        loss = loss_fn(x_hat, x)
        return loss
          
    
    def step(self,x): 
        self.optimizer.zero_grad()
        x_hat = self.forward(x)
        loss = self.compute_loss(x_hat, x)
        loss.backward()
        self.optimizer.step()
        return loss


def orderedDic2json(state_dic):
    json_dic = OrderedDict()
    # covert tensors to lists
    for key in state_dic.keys():
        json_dic[key] = state_dic[key].tolist()
    param_order = list(state_dic.keys())
    
    return param_order, json_dic

def json2orderedDic(param_order, json_dic):
    state_dic = OrderedDict()
    for param in param_order:
        state_dic[param] = torch.tensor(json_dic[param])
    return state_dic



# def setattr_nested(base, path, value):
#     """Accept a dotted path to a nested attribute to set."""
#     path, _, target = path.rpartition('.')
#     for attrname in path.split('.'):
#         base = getattr(base, attrname)
#     setattr(base, target, value)

# for att, param in state_dic.items():
#    setattr_nested(model2, att+'.data', param)