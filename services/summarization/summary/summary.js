var d3 = require("d3");

module.exports = {

    summary: function(data, options) {
        if (options.attribute) {
            var values = data.map(d => d[options.attribute]);
            let output = [vectorSummary(values)];
            return Promise.resolve(output);
        }
        else {
            if (options.dim == 1) {
                // summary per row
                let output = data.map(d => {
                    values = options.attributes.map(attr => d[attr]);
                    return vectorSummary(values);
                });
                if (options.mutate) {
                    let mutated = data.map((d, i) => {
                        let obj = {...d, ...output[i]};
                        return obj;
                    });
                    return Promise.resolve(mutated);
                }
                else {
                    return Promise.resolve(output);
                }
            }
            else {
                // summary per attribute
                let output = options.attributes.map(attr => {
                    values = data.map(d => d[attr]);
                    return vectorSummary(values);
                });
                return Promise.resolve(output);
            }
        }

        function vectorSummary(v) {
            let res = {
                count: values.length,
                min: d3.min(values),
                max: d3.max(values),
                mean: d3.mean(values),
                median: d3.median(values),
                perc25: d3.quantile(values, 0.25),
                perc75: d3.quantile(values, 0.75),
                stdev: d3.deviation(values),
                skewness: moment(values, 3),
                kyrtosis: moment(values, 4)
            };
            
            // add coefficient of variation, which quantifies the diversity in the vector
            res.coeffVar = res.mean == 0 ? 0 : res.stdev / res.mean;
            res.normCoeffVar = res.coeffVar / Math.sqrt(res.count);
            res.invNormCoeffVar = 1 - res.normCoeffVar;

            return res;
        }
    }

	// summary: function(data, options) {
	// 	var values = data.map(d => d[options.attribute]);

    //     let output = [{
    //         count: values.length,
    //         min: d3.min(values),
    //         max: d3.max(values),
    //         mean: d3.mean(values),
    //         median: d3.median(values),
    //         perc25: d3.quantile(values, 0.25),
    //         perc75: d3.quantile(values, 0.75),
    //         stdev: d3.deviation(values),
    //         skewness: moment(values, 3),
    //         kyrtosis: moment(values, 4)
    //     }];

	// 	return Promise.resolve(output);
	// }

};

// Computes a standardized moment of a set of values.
function moment(values, degree) {
    let mu = d3.mean(values);
    let sigma = d3.deviation(values);
    let powered = values.map(d => Math.pow((d - mu) / sigma, degree));
    return d3.mean(powered);
}
