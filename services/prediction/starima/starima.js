const utilities = require("../../../utilities");

module.exports = {

        starima: async function (data, options) {
                var path = require('path');
                let values = data.map(d => d[options.attribute]);
                let result = await utilities.runPythonScript(path.join(__dirname, 'starima.py'), values, [options.arOrder, options.iOrder, options.maOrder, options.steps]);
                // let dataEnhanced = data.map((d, i) => ({...d, clusterLabel: labels[i]}));
                return result;
        }

};
