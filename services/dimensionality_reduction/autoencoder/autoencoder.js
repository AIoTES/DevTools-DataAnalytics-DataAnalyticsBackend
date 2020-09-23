const utilities = require("../../../utilities");

module.exports = {

        autoencoder: async function (data, options) {
                var path = require('path');
                let input_data = data.map(d => options.attributes.map(a => d[a]));
                let result = await utilities.runPythonScript(path.join(__dirname, 'autoencoder.py'), input_data, [options.lattentLayerDim, options.hiddenLayersDim]);
                result.attributes = options.attributes
                return result;
        }

};
