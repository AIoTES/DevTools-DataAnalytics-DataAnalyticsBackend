var d3 = require("d3");

module.exports = {

	count: function(data, options) {
		var values = data.map(d => d[options.attribute]);
		var groups = d3.nest().key(d => d).entries(values);
		var countData = groups.map(d => {
			let obj = {};
			obj[options.attribute] = d.key;
			obj["count"] = d.values.length;
			return obj;
		});

		if (options.sort && options.sort == "ascending")
			countData = countData.sort((a, b) => d3.ascending(a.count, b.count));
		else if (options.sort && options.sort == "descending")
			countData = countData.sort((a, b) => d3.descending(a.count, b.count));
		else
			countData = countData.sort((a, b) => d3.ascending(a[options.attribute], b[options.attribute]));

		return Promise.resolve(countData);
	}

};
