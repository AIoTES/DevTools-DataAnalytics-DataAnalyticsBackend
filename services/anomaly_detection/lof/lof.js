const utilities = require("../../../utilities");

module.exports = {

	lof: async function(data, options) {
		var path = require('path');
		var points = data.map(d => options.attributes.map(a => d[a]));
		let lofData = await utilities.runPythonScript(path.join(__dirname, 'lof.py'), points, [options.nNeigh]);

		var dataEnhanced = data.map((d, i) => ({
			...d,
			anomalyScore: lofData[i],
			anomalyLabel: lofData[i] < -options.threshold ? "Outlier" : "Normal"
		}));
		return dataEnhanced;
	}

};
