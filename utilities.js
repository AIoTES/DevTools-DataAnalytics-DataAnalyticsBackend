var tmp = require("tmp");
var fs = require("fs");
const path = require("path");

module.exports = {
    // TODO: util: install R, pythod dependencies during setup
    // TODO: remove promise versions of file system read/writes, using node.js v10 fs/promises.

    // Writes contents to a file and returns a Promise.
    writeFilePromise: function(filename, contentsStr) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filename, contentsStr, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    },

    // Reads a file and returns the contents in a Promise.
    readFilePromise: function(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, (err, contents) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                else {
                    resolve(contents.toString());
                }
            });
        });
    },

    // ------------------------------------------------------------------------------------

    // Calls a process and returns stdout as a Promise.
    callProcessPromise: function(name, parameters) {
        // console.log("Process name", name);
        // console.log("Process parameters", parameters);
        const spawn = require("child_process").spawn;
        return new Promise((resolve, reject) => {
            const proc = spawn(name, parameters);
            let dataStr = "";
            proc.stdout.on('data', contents => {
                dataStr += contents.toString();
            });
            proc.stdout.on('end', () => {
                // console.log("PYTHON SCRIPT SAID:");
                // console.log(dataStr);        // Uncomment to show python output on the console.
                resolve(dataStr)
            });
        });
    },

    // Runs a python script using temporary files to pass input and output.
    // The script is expected to be called in the following format:
    // python scriptname.py input_data_file output_data_file [parameter1 parameter2 ...]
    runPythonScript: async function(scriptPath, inputData, parameters) {
        let tmpDir = path.resolve(".") + path.sep + "tmp";
        let tmpFileInputData = tmp.fileSync({postfix: ".tmp.json", dir: tmpDir});
        let tmpFileOutputData = tmp.fileSync({postfix: ".tmp.json", dir: tmpDir});
    
        let output = "";
        try {
            await this.writeFilePromise(tmpFileInputData.name, JSON.stringify(inputData));
            await this.callProcessPromise('python3', [scriptPath, tmpFileInputData.name, tmpFileOutputData.name, ...parameters]);
            let writtenOutput = await this.readFilePromise(tmpFileOutputData.name);

            // console.log("INPUT DATA");
            // console.log(inputData);
            // console.log("inputData file");
            // console.log(tmpFileInputData.name);
            // console.log("outputData file");
            // console.log(tmpFileOutputData.name);

            output = JSON.parse(writtenOutput);
        } catch(e) {
            console.log(e);	
        }

        // // delete temporary files (-- Actually deletes them when server is closed.)
        // fs.unlinkSync(tmpFileInputData.name);
        // fs.unlinkSync(tmpFileOutputData.name);

        return output;
    },


    // Runs a python script using temporary files to pass input and output.
    // The difference with runPythonScript is that this function can use two files for input
    // one to be used for data and another for parameters (usefull for passing model parameters)
    // The script is expected to be called in the following format:
    // python scriptname.py input_data_file input_param_file output_data_file [parameter1 parameter2 ...]
    runPythonScript2: async function(scriptPath, inputData, modelParam, parameters) {
        let tmpDir = path.resolve(".") + path.sep + "tmp";
        let tmpFileInputData = tmp.fileSync({postfix: ".tmp.json", dir: tmpDir});
        let tmpFileInputParam = tmp.fileSync({postfix: ".tmp.json", dir: tmpDir});
        let tmpFileOutputData = tmp.fileSync({postfix: ".tmp.json", dir: tmpDir});
    
        let output = "";
        try {
            await this.writeFilePromise(tmpFileInputData.name, JSON.stringify(inputData));
            await this.writeFilePromise(tmpFileInputParam.name, JSON.stringify(modelParam));            
            await this.callProcessPromise('python', [scriptPath, tmpFileInputData.name, tmpFileInputParam.name, tmpFileOutputData.name, ...parameters]);
            let writtenOutput = await this.readFilePromise(tmpFileOutputData.name);

            // console.log("INPUT DATA");
            // console.log(inputData);
            // console.log("inputData file");
            // console.log(tmpFileInputData.name);
            // console.log("outputData file");
            // console.log(tmpFileOutputData.name);

            output = JSON.parse(writtenOutput);
        } catch(e) {
            console.log(e);	
        }

        // // delete temporary files (-- Actually deletes them when server is closed.)
        // fs.unlinkSync(tmpFileInputData.name);
        // fs.unlinkSync(tmpFileOutputData.name);

        return output;
    },

    // Runs an R script using temporary files to pass input and output.
    // The script is expected to be called in the following format:
    // python scriptname.R input_data_file output_data_file [parameter1 parameter2 ...]
    // it's equivalent of calling in terminal the following command:
    // $ Rscript --vanilla scriptPath --args tmpFileInputData.name tmpFileOutputData.name parameter1 parameter2 ..
    runRScript: async function(scriptPath, inputData, parameters) {
        //require('dotenv').config(); // for R script
        
        let tmpDir = path.resolve(".") + path.sep + "tmp";
        let tmpFileInputData = tmp.fileSync({postfix: ".tmp.json", dir: tmpDir});
        let tmpFileOutputData = tmp.fileSync({postfix: ".tmp.json", dir: tmpDir});
    
        let output = "";
        try {
            await this.writeFilePromise(tmpFileInputData.name, JSON.stringify(inputData));
            await this.callProcessPromise('Rscript', ["--vanilla", scriptPath, "--args", tmpFileInputData.name, tmpFileOutputData.name, ...parameters]); // pass to commandline arguments from --args and after
            let writtenOutput = await this.readFilePromise(tmpFileOutputData.name);

            // console.log("INPUT DATA");
            // console.log(inputData);
            // console.log("inputData file");
            // console.log(tmpFileInputData.name);
            // console.log("outputData file");
            // console.log(tmpFileOutputData.name);

            output = JSON.parse(writtenOutput);
        } catch(e) {
            console.log(e);	
        }
        return output;
    },

    // Calls a python script with data.
    callScript: function(data, scriptPath) {
        const PythonShell = require('python-shell');
        return new Promise((resolve, reject) => {
            let pyshell = new PythonShell.PythonShell(scriptPath, {mode:'json'})
            let dataStr = "";
            pyshell.send(JSON.stringify(data));
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                dataStr = message
            });
            pyshell.end(() => {
                resolve(dataStr)
            });
        });
    }

    
}
