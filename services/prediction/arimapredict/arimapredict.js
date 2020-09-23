const utilities = require("../../../utilities");

module.exports = {

        arimapredict: async function (data, options) {
                var path = require('path');
                //let steps = data.map(d => data.attributes.map(a => d[a]));
                let steps = options.steps;
                let dat = data.map(d => d[options.attribute]);
                let model_params = options.modelParameters
                let values = { "data": dat, "arparams": model_params.arparams, "maparams": model_params.maparams }
                let result = await utilities.runPythonScript(path.join(__dirname, 'arimapredict.py'), values, [steps, model_params.sigma2, model_params.alpha]);
                // let dataEnhanced = data.map((d, i) => ({...d, clusterLabel: labels[i]}));
                return result;
        }

};
