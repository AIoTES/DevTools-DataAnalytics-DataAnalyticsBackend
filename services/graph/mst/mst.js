module.exports = {

    // data: distance matrix
    // options: {}
    mst: function(data, options) {        
        var distMat = data;
        var N = distMat.length;

        // var nodes = distMat.map((d, i) => ({id: i}));
        var edges = [];
    
        // define accessory arrays
        var traversed = new Array(N);
        var bucketVertex = new Array(N);
        var bucketWeight = new Array(N);
        for (var i = 0; i < N; i++) {
            traversed[i] = false;
            bucketVertex[i] = -1;
            bucketWeight[i] = 0;
        }
    
        // start with first vertex
        traversed[0] = true;
        var currentVertex = 0;
    
        var iter = 0;
        while (true) {
            for (var i = 0; i < N; i++) {
                var w = distMat[currentVertex][i];
    
                if (!traversed[i]) {
                    if (bucketVertex[i] == -1 || bucketWeight[i] > w) {
                        bucketVertex[i] = currentVertex;
                        bucketWeight[i] = w;
                    }
                }
            }
    
            // sequential search for lightest bucket
            var minWeight = 10000000;
            var bestNextVertex = -1;
            for (var i = 0; i < N; i++) {
                if (!traversed[i] && bucketWeight[i] < minWeight) {
                    minWeight = bucketWeight[i];
                    bestNextVertex = i;
                }
            }
    
            if (bestNextVertex == -1) break;
    
            edges.push({
                source: bestNextVertex,
                target: bucketVertex[bestNextVertex],
                value: Math.exp(-minWeight)
            });
    
            // add vertex to tree
            traversed[bestNextVertex] = true;
            currentVertex = bestNextVertex;
    
            iter++;
        }

        // return Promise.resolve({nodes: nodes, edges: edges});
        return Promise.resolve(edges);
    }
};
