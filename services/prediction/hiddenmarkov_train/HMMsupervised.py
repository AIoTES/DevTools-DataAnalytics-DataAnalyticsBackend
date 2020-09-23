import pandas as pd
import numpy as np
from sklearn import mixture
import hmmlearn

""" Code inspired by CEA implementation, https://doi.org/10.1109/WoWMoM.2018.8449765"""


"""
The Hidden Markov Model (HMM) is a generative probabilistic model, in which a sequence of observable E variables is generated 
by a sequence of internal hidden states X. The hidden states are not observed directly. 
The transitions between hidden states are assumed to have the form of a (first-order) Markov chain. 

They can be specified by the start probability vector stp and a transition probability matrix A. 
The emission probability of an observable can be any distribution with parameters θ conditioned on the current hidden state. 
Emission probability matrix is called B.


The HMM is completely determined by stp, A and θ. Ω

---
HMM parameters

Observation at time t      
    e_t in E

hidden states at time t 
    x_t in X

init hidden state probability matrix
    stp = {st_i : 1 <= i <= n}

hidden state transition probability matrix 
    A = {a_ij : 1 <= i, j <= n} , with a_ij is the probability of moving from state i to state j and
    a_ij = P(x_{t+1}=x_j | x_t=x_i )

emission probability matrix
    B = { b_i(e_t) : 1 <= i <= n}, b_i is the probability of an observation e_t being generated from a state i st_i. 
    b_i = P(e_t | x_t = x_i)


Emission probability is given in the form of Probability Distribution Function (PDF). 
Several models exist to approximate PDF, Gaussian Mixture Model (GMM) is well used to express multidimensional complex feature spaces.

GMM is a linear combination of normal Gaussian Model (GM)
number of components num_comp refers to the number of GMs used in mixture model

---
HMM Problems

Training problem refers to to estimate the model parameters (A, B, stp) given observations (E).
Can be solved by an iterative Expectation-Maximization (EM) algorithm, known as the Baum-Welch algorithm.
This problem refers to "unsupervised learning". If we know the states we can compute the A, B given observations (E) and states.

Predict or decode refers to estimate the optimal sequence of hidden states, given the model parameters (A,B) and observed data (E).
Can be solved using Viterbi (offline) or Maximum a posterior-MAP (online)

Given the model parameters and observed data (A,B, E), calculate the likelihood of the data prob().
Can be solved using Forward-Backward algorithm
"""

def render_cov_positive_definite(covar):
    abs_diag = np.absolute(np.diagonal(covar))
    step = np.amin(abs_diag[np.nonzero(abs_diag)])/10
    count = 1
    cov = covar.copy()
    while np.any(np.linalg.eigvalsh(cov) <= 0):
        cov = covar + np.identity(covar.shape[0])*step*count
        count +=1            
    return cov


def estimate_hmm_params(train_data, comp_num=1):
    """
    Estimate Hidden Markov Model parameters based on training data.

    train_data:     DataFrame
    Dataframe with samples in each row. Columns contain one for hidden_state and the others are the observations
    """
    # Initial probability of hidden states
    startprob = train_data.pivot_table(index='hidden_state',aggfunc='size')/(len(train_data)) # 

    # Transition probability
    s_i = train_data.hidden_state[:len(train_data)-1] # state i == current state
    s_j = train_data.hidden_state[1:]                 # state j == next state
    s_j.index = s_i.index

    state_flow = pd.concat([s_i, s_j], axis=1)
    state_flow.columns=['state_i', 'state_j']
    
    g_state_flow=[]
    for key, group in state_flow.groupby('state_i'):
        flow_prob=((group.pivot_table(index='state_j', aggfunc='size'))/len(group))#.values
        g_state_flow.append(flow_prob)

    transmat = pd.DataFrame(g_state_flow).fillna(0)

    # Probability distribution of observations for each state
    gmms=[]
    seed = 2 # seed used by the random number generator
    for _key, group in train_data.groupby('hidden_state'): 
        # each loop corresponds to calculating probability distribution of emisions Guassian Mixture model parameters
        # => P(e_t | x_t=x_i)
        group=group.reset_index(drop=True)
        group.columns=range(len(group.columns))

        GMM_n=mixture.GaussianMixture(covariance_type="full",n_components=comp_num, reg_covar=1e-05, random_state=seed) # use reg_covar to ensure positive-definite covariance
        gmms.append(GMM_n.fit(group.drop(0, axis=1)))

    return startprob, transmat, gmms
    # return startprob, transmat, g_mean, g_cov, gmms

"""
Gaussian Mixture Model

Used to approximate a probability distribution, as a weighted average of multiple Gaussians, all summing to total prob=1
Each Gaussian distribution is called (mixture) component
Each mixture component represents a unique cluster, specified by
{max probability, mean, covariance}

"""

def select_best_model(train_data, test_data, max_comp_num, num_exp=10):
    """
    Selects model with number of components that maximize accuracy
    TODO
    """    
    
    for comp_num in range(1,max_comp_num+1):
        accur = []
        [startprob, transmat, gmms] = estimate_model_params(train_data, comp_num)
        for _ in range(num_exp):            
            # accur = predict...
            pass      
    
    return 0



"""
Hidden Markov Model (HMM) using Gaussian Mixture Model (GMM) for emision probability
Important parameters:

startprob_  : initial probability of states
transmat_   : transition matrix

GMM parameters:
weights_    : mixture components weights
means_      : Gaussian mixture component mean
covars_     : Gaussian mixture component covariance
"""

