const utilities = require("../../../utilities");

module.exports = {

        mds: async function(data, options) {
                var path = require('path');
                let coords = await utilities.runPythonScript(path.join(__dirname, 'mds.py'), data, [options.nDim]);
                return coords;
	}

};
