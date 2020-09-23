module.exports = {
    
    // TODO: Handle edge values.
    mergegraphs: function(data, options) {        
        let mergedEdges = [];

        data.forEach(edgeSet => {
            edgeSet.forEach(edge => {
                var edgeIdx = mergedEdges.findIndex(elem => {
                    return (elem.source == edge.source && elem.target == edge.target) || (elem.target == edge.source && elem.source == edge.target);
                })
                if (edgeIdx < 0) {
                    mergedEdges.push(edge);
                }
            });
        });

        return Promise.resolve(mergedEdges);
    }
};
