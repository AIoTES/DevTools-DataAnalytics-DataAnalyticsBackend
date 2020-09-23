const utilities = require("../../../utilities");

module.exports = {

	dbscan: async function(data, options) {
        var path = require('path');
        let points = data.map(d => options.attributes.map(a => d[a]));
        //let output = await utilities.runPythonScript( path.join(__dirname,'kmeans.py') , points, [options.nClusters], extraInfo);
        let output = await utilities.runPythonScript( path.join(__dirname,'dbscan.py') , points, [options.eps , options.min_samples, options.metric]);
        var response = data.map((d, i) => ({...d, clusterLabel: output[i]}));
        return response;
	}

};
