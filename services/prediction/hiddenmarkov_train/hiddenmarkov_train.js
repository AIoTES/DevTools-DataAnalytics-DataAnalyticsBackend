const utilities = require("../../../utilities");

module.exports = {

	hiddenmarkov_train: async function(data, options) {
        var path = require('path');
        
        let attributes = [options.state].concat(options.observations); // observations data, with their respective state being on the first column
        let data_in = data.map(d => attributes.map(a => d[a]));

        let output = await utilities.runPythonScript2( path.join(__dirname,'hiddenmarkov_train.py') , data_in, options.observations, []);

        return output;
	}
};
