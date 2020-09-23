module.exports = {

	// data: array of objects
	// options: {
	//		attributes: attributes of data element to use as vector elements
	// }
	distmat: function(data, options) {
        if (!(options.distFun in distanceFunctions)) {
            return Promise.resolve({
                error: "Distance metric '" + options.distFun + "' is not supported."
            });
        }

        var points = data.map(d => options.attributes.map(a => d[a]));

        var D = new Array(points.length).fill(0).map(d => new Array(points.length).fill(0));
        for (var i=0; i<points.length; i++) {
            for (var j=i+1; j<points.length; j++) {
                var d = distanceFunctions[options.distFun](points[i], points[j]);
                D[i][j] = d;
                D[j][i] = d;
            }
        }

        return Promise.resolve(D);
	}
};

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
