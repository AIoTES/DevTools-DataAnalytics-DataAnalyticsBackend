# Data analysis server

This project is a data analysis server, offering data analysis tasks as web services. The server also allows the composition of basic analysis tasks into larger data analysis (non-sequential) workflows, which can be used as the underlying structure of a data analysis front-end (dashboard).

## Installation

The data analysis server runs on Node.js server and uses Python functions, so Node.js and Python needs to be installed.

To install the required Python libraries, run the following:

```bash
pip install scikit-learn
```

To install the data analysis server, download this repository in a local directory and run the following commands from within this directory:

```bash
npm install
mkdir tmp
```

To run the server, run the following command from within the same directory:

```bash
node server.js
```

## Usage

After you start the server, it is available at the following URL:

```
http://localhost:8081/<service_name>
```

Here, `<service_name>` is the name of the service to use, e.g. `kmeans` or `mds`. The available services can be found in `services/services.json`. The `"name"` attribute in this list is the name that can be used as the `<service_name>` in the URL.

### Getting information about a service

You can get information and examples about a service, but GETting its URL. For example, the following call:

```
GET http://localhost:8081/kmeans
```

returns the following response:

```json
{
    "inputSchema": {
        "title": "K-means input",
        "description": "The input to the k-means service.",
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "description": "The data to analyze, as an array of JSON objects.",
                "items": {
                    "type": "object",
                    "description": "An input data record.",
                    "properties": {}
                }
            },
            "options": {
                "type": "object",
                "description": "Service options.",
                "properties": {
                    "attributes": {
                        "type": "array",
                        "description": "The names of the attributes of the input data records to use as point coordinates.",
                        "items": {
                            "type": "string",
                            "description": "The name of an attribute."
                        }
                    },
                    "nClusters": {
                        "type": "integer",
                        "description": "The number of clusters to use."
                    }
                },
                "required": [
                    "attributes",
                    "nClusters"
                ]
            }
        },
        "required": [
            "data",
            "options"
        ]
    },
    "inputExample": {
        "data": [
            {"x": 20.3338847898911,"y": 70.9608018911035},
            {"x": 26.5165713494385,"y": 46.4862383887838},
            {"x": 22.5405564503676,"y": 68.9679382342013},
            {"x": 29.9393973268233,"y": 43.4853462432036},
            {"x": 13.05480068866,"y": 76.3221641119346},
            {"x": 25.2384254905452,"y": 68.9133633755761},
            {"x": 23.1553508372478,"y": 60.8484183471996},
            {"x": 34.7867591608082,"y": 62.374536303667},
            {"x": 35.4109048886794,"y": 58.8987189980316},
            {"x": 38.5175405140372,"y": 56.1424244109387},
            {"x": 97.1865108432285,"y": 79.0764314181978},
            {"x": 68.0550425292563,"y": 68.7145731834059},
            {"x": 76.9587226195596,"y": 84.0134969582564},
            {"x": 77.8924457763679,"y": 94.2337408933988},
            {"x": 95.1270061424319,"y": 81.5486319091794},
            {"x": 60.3422905089889,"y": 75.1475592989026},
            {"x": 97.8872293428121,"y": 102.366600071028},
            {"x": 75.6921793935179,"y": 82.1061642879839},
            {"x": 90.3069726352579,"y": 75.0050125673137},
            {"x": 85.812705720906,"y": 86.1304198438951}
        ],
        "options": {
            "attributes": [
                "x",
                "y"
            ],
            "nClusters": 2
        }
    },
    "outputSchema": {
        "title": "K-means output",
        "description": "The output of the k-means service.",
        "type": "array",
        "items": {
            "type": "object",
            "description": "A record of the input data, enhanced with a cluster label.",
            "properties": {
                "clusterLabel": {
                    "type": "number",
                    "description": "The cluster label for the specific record."
                }
            },
            "required": [
                "clusterLabel"
            ]
        }
    },
    "outputExample": [
        {"x": 20.3338847898911,"y": 70.9608018911035,"clusterLabel": 1},
        {"x": 26.5165713494385,"y": 46.4862383887838,"clusterLabel": 1},
        {"x": 22.5405564503676,"y": 68.9679382342013,"clusterLabel": 1},
        {"x": 29.9393973268233,"y": 43.4853462432036,"clusterLabel": 1},
        {"x": 13.05480068866,"y": 76.3221641119346,"clusterLabel": 1},
        {"x": 25.2384254905452,"y": 68.9133633755761,"clusterLabel": 1},
        {"x": 23.1553508372478,"y": 60.8484183471996,"clusterLabel": 1},
        {"x": 34.7867591608082,"y": 62.374536303667,"clusterLabel": 1},
        {"x": 35.4109048886794,"y": 58.8987189980316,"clusterLabel": 1},
        {"x": 38.5175405140372,"y": 56.1424244109387,"clusterLabel": 1},
        {"x": 97.1865108432285,"y": 79.0764314181978,"clusterLabel": 0},
        {"x": 68.0550425292563,"y": 68.7145731834059,"clusterLabel": 0},
        {"x": 76.9587226195596,"y": 84.0134969582564,"clusterLabel": 0},
        {"x": 77.8924457763679,"y": 94.2337408933988,"clusterLabel": 0},
        {"x": 95.1270061424319,"y": 81.5486319091794,"clusterLabel": 0},
        {"x": 60.3422905089889,"y": 75.1475592989026,"clusterLabel": 0},
        {"x": 97.8872293428121,"y": 102.366600071028,"clusterLabel": 0},
        {"x": 75.6921793935179,"y": 82.1061642879839,"clusterLabel": 0},
        {"x": 90.3069726352579,"y": 75.0050125673137,"clusterLabel": 0},
        {"x": 85.812705720906,"y": 86.1304198438951,"clusterLabel": 0}
    ]
}
```

The GET response contains the JSON schema of the service, i.e. the specification of the service's input and output, including the options that need to be specified for each service. The response also contains examples of input and expected output, which can be used to test the services. The input examples can be used in the body of the POST request, as described below.

### Calling a service

To call a service, you need to POST to the service's URL. The HTTP call details are the following:

```
URL: http://localhost:8081/<service_name>
Method: POST
Headers: Content-Type: application/json
Body: <input JSON; make a GET call at each service to see examples>
```

For example, to call the `kmeans` service, make the following call:

```
POST http://localhost:8081/kmeans
```

with header `Content-Type: application/json`, and with the following body:

```json
{
    "data": [
        {"x": 20.3338847898911,"y": 70.9608018911035},
        {"x": 26.5165713494385,"y": 46.4862383887838},
        {"x": 22.5405564503676,"y": 68.9679382342013},
        {"x": 29.9393973268233,"y": 43.4853462432036},
        {"x": 13.05480068866,"y": 76.3221641119346},
        {"x": 25.2384254905452,"y": 68.9133633755761},
        {"x": 23.1553508372478,"y": 60.8484183471996},
        {"x": 34.7867591608082,"y": 62.374536303667},
        {"x": 35.4109048886794,"y": 58.8987189980316},
        {"x": 38.5175405140372,"y": 56.1424244109387},
        {"x": 97.1865108432285,"y": 79.0764314181978},
        {"x": 68.0550425292563,"y": 68.7145731834059},
        {"x": 76.9587226195596,"y": 84.0134969582564},
        {"x": 77.8924457763679,"y": 94.2337408933988},
        {"x": 95.1270061424319,"y": 81.5486319091794},
        {"x": 60.3422905089889,"y": 75.1475592989026},
        {"x": 97.8872293428121,"y": 102.366600071028},
        {"x": 75.6921793935179,"y": 82.1061642879839},
        {"x": 90.3069726352579,"y": 75.0050125673137},
        {"x": 85.812705720906,"y": 86.1304198438951}
    ],
    "options": {
        "attributes": [
            "x",
            "y"
        ],
        "nClusters": 2
    }
}
```

This returns the following response:

```json
[
    {"x": 20.3338847898911,"y": 70.9608018911035,"clusterLabel": 1},
    {"x": 26.5165713494385,"y": 46.4862383887838,"clusterLabel": 1},
    {"x": 22.5405564503676,"y": 68.9679382342013,"clusterLabel": 1},
    {"x": 29.9393973268233,"y": 43.4853462432036,"clusterLabel": 1},
    {"x": 13.05480068866,"y": 76.3221641119346,"clusterLabel": 1},
    {"x": 25.2384254905452,"y": 68.9133633755761,"clusterLabel": 1},
    {"x": 23.1553508372478,"y": 60.8484183471996,"clusterLabel": 1},
    {"x": 34.7867591608082,"y": 62.374536303667,"clusterLabel": 1},
    {"x": 35.4109048886794,"y": 58.8987189980316,"clusterLabel": 1},
    {"x": 38.5175405140372,"y": 56.1424244109387,"clusterLabel": 1},
    {"x": 97.1865108432285,"y": 79.0764314181978,"clusterLabel": 0},
    {"x": 68.0550425292563,"y": 68.7145731834059,"clusterLabel": 0},
    {"x": 76.9587226195596,"y": 84.0134969582564,"clusterLabel": 0},
    {"x": 77.8924457763679,"y": 94.2337408933988,"clusterLabel": 0},
    {"x": 95.1270061424319,"y": 81.5486319091794,"clusterLabel": 0},
    {"x": 60.3422905089889,"y": 75.1475592989026,"clusterLabel": 0},
    {"x": 97.8872293428121,"y": 102.366600071028,"clusterLabel": 0},
    {"x": 75.6921793935179,"y": 82.1061642879839,"clusterLabel": 0},
    {"x": 90.3069726352579,"y": 75.0050125673137,"clusterLabel": 0},
    {"x": 85.812705720906,"y": 86.1304198438951,"clusterLabel": 0}
]
```

## Create a new service

To add a new service to the API, go to one of the categories in the `services` directory (or add a new category directory, if needed), and create a new directory named after your new service.

The service directory has the following structure:

```
<service_name>/
    desc.json
    info.md
    <service_name>.js
```

* `desc.json`: It contains the input/output JSON schema for the service. This is used to validate the user input each time the service is called, so make sure that it describes all required properties.
* `info.md`: It contains theoretical information about the service, written in Markdown format.
* `<service_name>.js`: It contains the functionality of the service.

Within `<service_name>.js`, the functionality is written as a Node.js module with a main function having the same name as the service. E.g. for the service `myService`:

```js
// myService.js

module.exports = {
    myService: function(data, options) {
        // Use data and options to produce the service's output.
        let output = f(data, options);
        // Return result as promise.
        return Promise.resolve(output);
    }
};
```

The main function takes two arguments:

* `data`: The data to analyze, often as a JSON array of JSON objects.
* `options`: A JSON object with any options or other information needed by the service's method to operate.

The main function must return a `Promise`, in order to be able to handle asynchronous file loading, script running, external URL or APIs, etc.

See `services/data_manipulation/filter` for an example simple service. See other services for further examples.

To register the new service in the data analysis API server, you need to add an entry in the `services/services.json` file:

```json
{
    "name": "<service_name>",
    "path": "./services/<category_name>/<service_name>"
}
```

### Calling Python scripts

If a service needs to call a Python script, it can use the `runPythonScript` function, available in `utilities.js`:

```js
let outputPromise = utilities.runPythonScript('<path_to_python_script>', data, options);
```

This function accepts three arguments:

* `'<path_to_python_script>'`: The path to the Python script to run. You can put the python script in the service directory, next to `<service_name>.js`, e.g. as `<service_name>.py`. In this manner, you can use the `__dirname` variable to locate the file. See `services/clustering/kmeans` for an example.
* `data`: The data to analyze.
* `options`: An array of values to use as options.

Internally, `runPythonScript` uses these arguments to construct the shell command to run:

```bash
python <path_to_python_script> <input_file_name> <output_file_name> <options[0]> <options[1]> ...
```

The `<input_file_name>` and `<output_file_name>` arguments are the names of temporary files which are automatically created to pass data to and from the Python script. These temporary files are stored temporarily in the `tmp` directory.

See `services/clustering/kmeans` for an example of a service calling a Python script.
