const utilities = require("../../../utilities");

module.exports = {

	kmeans: async function(data, options) {
        var path = require('path');
        let points = data.map(d => options.attributes.map(a => d[a]));
        if (typeof options.extraInfo === "undefined" || options.extraInfo != true ){
                options.extraInfo = false;
        };
        //let output = await utilities.runPythonScript( path.join(__dirname,'kmeans.py') , points, [options.nClusters], extraInfo);
        let output = await utilities.runPythonScript( path.join(__dirname,'kmeans.py') , points, [options.nClusters , options.extraInfo]);
        if (options.extraInfo===true){
                let dataEnhanced = data.map((d, i) => ({...d, clusterLabel: output['labels'][i]}));
                var kmeans_out = {records: dataEnhanced, silhouetteScore: output['silhouetteScore'] }
        }else{
                var kmeans_out = data.map((d, i) => ({...d, clusterLabel: output[i]}));
        };

        return kmeans_out;
	}

};
