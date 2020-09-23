var rp = require('request-promise');
var csv = require('csv-string');

module.exports = {

	loadurl: function(data, options) {
        
        return rp(options.url)
            .then(res => {
                if (options.format == "csv") {
                    var data = csv.parse(res, options.delimiter);

                    if (options.header) {
                        var headers = data[0];
                        var dataParsed = data
                            .filter((d, i) => i > 0)
                            .map(row => {
                                var obj = {};
                                row.forEach((value, i) => {
                                    if (!isNaN(value))
                                        obj[headers[i]] = parseFloat(value);
                                    else
                                        obj[headers[i]] = value;
                                })
                                return obj;
                            });
                        return dataParsed;
                    }
                    else {
                        var dataParsed = data.map(row => row.map(value => {
                            if (!isNaN(value))
                                return parseFloat(value);
                            else
                                return value;
                        }));
                        return dataParsed;
                    }
                }
                else if (options.format == "json") {
                    return JSON.parse(res);
                }
                else {
                    return {
                        error: `Data format '${options.format}' not supported.`
                    };
                }
            });
	}

};
