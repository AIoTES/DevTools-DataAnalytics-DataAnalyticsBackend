module.exports = {

	mutate: function(data, options) {
        let outputData = data.map((d, i) => {
            let obj = {...d};

            for (key in options) {
                let val = options[key];
                if (typeof val == "string" && val.startsWith("$")) {
                    let funName = val.substr(1);
                    if (funName in mutationFunctions) {
                        obj[key] = mutationFunctions[val.substr(1)](d, i);
                    }
                    else {
                        obj[key] = val;
                    }
                }
                else {
                    obj[key] = val;
                }
            }

            return obj;
        });
        
		return Promise.resolve(outputData);
    }

};

var mutationFunctions = {
    rowidx: (d, i) => i
}
