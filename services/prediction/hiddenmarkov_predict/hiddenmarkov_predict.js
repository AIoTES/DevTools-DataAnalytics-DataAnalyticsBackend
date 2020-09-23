const utilities = require("../../../utilities");

module.exports = {

	hiddenmarkov_predict: async function(data, options) {
        var path = require('path');
        
        let attributes = options.observations ; // observations data, with their respective state being on the first column
        let observationsOrder = options.model.observationsOrder
        var output ;
        // make sure observations match with the ones model was trained
        let msg = ""
        let flag = false // selected observations are not contained in observations model was
        for (i = 0; i < attributes.length; i++) { // check if selected observations exist in model observation order
                if (! attributes[i] in observationsOrder){
                        flag = true
                        break
                }
        }
        if (flag){
                msg = "Selected observations are missing attributes in comparison with the observations model was fitted." ;
                output = {"error": msg} ;
        }
        else if (flag==false && attributes.length != observationsOrder.length){
                msg = "Selected observations have more attributes than the observations model was fitted." ;
                output = {"error": msg} ;        }
        else{
        // if everyting is ok, run the service
                let data_in = data.map(d => observationsOrder.map(a => d[a]));
                let data_out = await utilities.runPythonScript2( path.join(__dirname,'hiddenmarkov_predict.py'), data_in, options.model, []);
                output = [] ;

                // return either predictions only or predictions with inputed data (default)
                if (options.predictionOnly === undefined || options.predictionOnly == false ){
                        for (i = 0; i < data_out.prediction.length; i++) { // check if selected observations exist in model observation order
                                output[i] = Object.assign( {"prediction": data_out.prediction[i]}, data[i]) ;
                        }   
                }
                else{
                        output = data_out.prediction  
                }   
        }
        return output;
	}
};
