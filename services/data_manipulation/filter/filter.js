module.exports = {
    
    filter: function(data, options) {
        let outputData = data;

        if (options.range) {
            options.range.forEach(f => {
                if (f.min)
                    outputData = outputData.filter(d => d[f.attribute] >= f.min);
                if (f.max)
                    outputData = outputData.filter(d => d[f.attribute] <= f.max);
            })
        }
        
        return Promise.resolve(outputData);
    }

};
