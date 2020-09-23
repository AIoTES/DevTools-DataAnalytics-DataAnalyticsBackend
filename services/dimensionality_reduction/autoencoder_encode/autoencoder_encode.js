const utilities = require("../../../utilities");

module.exports = {

        autoencoder_encode: async function (data, options) {
                var path = require('path');
                // make sure attributes/features match with the ones model was trained
                let msg = ""
                let result
                let flag = false // selected observations are not contained in observations model was
                for (i = 0; i < options.attributes.length; i++) { // check if selected observations exist in model observation order
                        if (! options.attributes[i] in options.model.attributes){
                                flag = true
                                break
                        }
                }
                if (flag){
                        msg = "Selected observations are missing attributes in comparison with the observations model was fitted." ;
                        result = {"error": msg} ;
                }else if (flag==false && options.attributes.length != options.model.attributes.length){
                        msg = "Selected observations have more attributes than the observations model was fitted." ;
                        result = {"error": msg} ;        
                }else{
                // if everyting is ok, run the service
                        let input_data = data.map(d => options.model.attributes.map(a => d[a])); // attribute order == the one model was trained
                        result = await utilities.runPythonScript2(path.join(__dirname, 'autoencoder_encode.py'), input_data, options.model.modelParameters, [options.model.lattentLayerDim, options.model.hiddenLayersDim, options.model.modelParametersOrder]);
                }
                return result;
        }
};