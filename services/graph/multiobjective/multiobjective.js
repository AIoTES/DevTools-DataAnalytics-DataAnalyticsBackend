module.exports = {

    multiobjective: function (data, options) {

        let msts = options.features.map(f => {
            let points = data.map(d => f.attributes.map(a => d[a]));
            let D = distMat(points, f.distFun);
            let mst = getMst(D);
            return mst;
        });

        let res = {
            nodes: data,
            individual: msts,
            merged: mergeGraphs(msts)
        }

        return Promise.resolve(res);
    }
};

function distMat(points, distFun) {
    if (!distFun) {
        distFun = "l2";
    }
    var D = new Array(points.length).fill(0).map(d => new Array(points.length).fill(0));
    for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
            var d = distanceFunctions[distFun](points[i], points[j]);
            D[i][j] = d;
            D[j][i] = d;
        }
    }
    return D;
}

// distance function definitions
var distanceFunctions = {
    "euclidean": distL2,
    "l2": distL2,
    "l1": distL1
}

// distance metrics

function distL2(p1, p2) {
    let sum = 0;
    for (var i=0; i<p1.length; i++) {
        sum += (p1[i] - p2[i]) * (p1[i] - p2[i]);
    }
    return Math.sqrt(sum);
}

function distL1(p1, p2) {
    let sum = 0;
    for (var i=0; i<p1.length; i++) {
        sum += Math.abs(p1[i] - p2[i]);
    }
    return sum;
}



function getMst(distMat) {
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

    return edges;
}

function mergeGraphs(edgeSets) {
    let mergedEdges = [];
    edgeSets.forEach(edgeSet => {
        edgeSet.forEach(edge => {
            var edgeIdx = mergedEdges.findIndex(elem => {
                return (elem.source == edge.source && elem.target == edge.target) || (elem.target == edge.source && elem.source == edge.target);
            })
            if (edgeIdx < 0) {
                mergedEdges.push(edge);
            }
        });
    });
    return mergedEdges;
}
