module.exports = {

    kpartite: function(data, options) {
        
        var nodes = [];
        var curId = 0;

        // create record nodes
        data.forEach((record, i) => {
            nodes.push({
                id: curId,
                type: "rowId",
                value: i,
                degree: 0
            });
            curId++;
        });

        // create attribute nodes
        var nodesObj = {};
        data.forEach(record => {
            // for (key in record) {
            for (key of options["attributes"]) {
                if (key in nodesObj) {
                    if (!nodesObj[key].includes(record[key])) {
                        nodesObj[key].push(record[key]);
                    }
                }
                else {
                    nodesObj[key] = [record[key]];
                }
            }
        });
        for (type in nodesObj) {
            var typeNodes = nodesObj[type];
            typeNodes.forEach(d => {
                nodes.push({
                    id: curId,
                    type: type,
                    value: d,
                    degree: 0
                });
                curId++;
            });
        }

        // // assign ids to nodes
        // for (let i = 0; i < nodes.length; i++) {
        //     let id = genID(nodes[i]);
        //     nodes[i]["_id"] = id;
        // }       

        function genID(obj) {
            return Object.keys(obj).sort().map(key => obj[key]).join("");
        }

        // create edges
        var edges = [];
        data.forEach((record, i) => {
            var recNode = nodes[i];
            // for (key in record) {
            for (key of options["attributes"]) {
                var attrNode = nodes.find(d => d.type == key && d.value == record[key]);
                edges.push({
                    source: recNode["id"],
                    target: attrNode["id"]
                });
                recNode.degree++;
                attrNode.degree++;
            }
        });
        
        let res = {
            nodes: nodes,
            edges: edges
        }

        // return Promise.resolve({nodes: nodes, edges: edges});
        return Promise.resolve(res);
    }
};
