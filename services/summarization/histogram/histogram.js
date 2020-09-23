var d3 = require('d3');

module.exports = {
	
	// data: array of objects
	// options: {
	//		attribute: attribute of data element to use as value
	//		domain: the range of possible values that attribute can take
	//		bins: the number of bins in the output histogram
	// }
	histogram: function (data, options) {
		var histGen = d3.histogram()
			.value(d => d[options.attribute])
			.domain(options.domain)
			.thresholds(options.bins);
		var hist = histGen(data);
		var histData = hist.map(d => ({label: "[" + d.x0 + ", " + d.x1 + ")", value: d.length}));
		return Promise.resolve(histData);
	}

};
