var d3 = require("d3");

module.exports = {

	group_summarize: function(data, options) {

		var summaryFunctions = {
			"count": v => v.length,
			"sum": v => d3.sum(v, v => v[options.valueAttr]),
			"mean": v => d3.mean(v, v => v[options.valueAttr]),
			"countValue": v => v.filter(d => d[options.valueAttr] == options.countValue).length
		};

		if (!options.summaryFunction in summaryFunctions) {
			return Promise.resolve({
				"error": `Summarization function '${options.summaryFunction}' not supported.`
			});
		}

		if (options.groupAttr2) {
			var groups = d3.nest()
				.key(d => d[options.groupAttr])
				.key(d => d[options.groupAttr2])
				.rollup(summaryFunctions[options.summaryFunction])
				.entries(data);

			if (typeof(data[0][options.groupAttr]) == "number") {
				groups.forEach(g => {
					g.key = +g.key;
				})
			}

			groups.sort((a, b) => d3.ascending(a.key, b.key));
			
			let output = [];

			if (options.reshape) {
				groups.forEach(g => {
					if (typeof(data[0][options.groupAttr2]) == "number") {
						g.values.forEach(v => {
							v.key = +v.key;
						});
					}
					g.values.sort((a, b) => d3.ascending(a.key, b.key));
					let obj = {};
					obj[options.groupAttr] = g.key;
					g.values.forEach(v => {
						obj[v.key] = v.value;
					});
					output.push(obj);
				});
			}
			else {
				groups.forEach(g => {
					if (typeof(data[0][options.groupAttr2]) == "number") {
						g.values.forEach(v => {
							v.key = +v.key;
						});
					}
					g.values.sort((a, b) => d3.ascending(a.key, b.key));
					g.values.forEach(v => {
						let obj = {};
						obj[options.groupAttr] = g.key;
						obj[options.groupAttr2] = v.key;
						obj.value = v.value;
						output.push(obj);
					});
				});
			}

			return Promise.resolve(output);
		}
		else {
			var groups = d3.nest()
				.key(d => d[options.groupAttr])
				.rollup(summaryFunctions[options.summaryFunction])
				.entries(data);
			
			groups.forEach(g => {
				g[options.groupAttr] = g.key;
				g.key = undefined;
			});

			if (options.sort && options.sort == "ascending")
				groups = groups.sort((a, b) => d3.ascending(a.value, b.value));
			else if (options.sort && options.sort == "descending")
				groups = groups.sort((a, b) => d3.descending(a.count, b.count));
			else
				groups = groups.sort((a, b) => d3.ascending(a[options.attribute], b[options.attribute]));

			return Promise.resolve(groups);
		}
	}

};
