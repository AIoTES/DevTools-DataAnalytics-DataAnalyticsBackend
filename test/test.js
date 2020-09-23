/*
Direct use of test from command line: $ npm test

Debugging config through VSCode
{
    VSCode, launch.json
    
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Mocha Tests",
            "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
            "args": [
                "-u",
                "tdd",
                "--timeout",
                "999999",
                "--colors",
                "${workspaceFolder}/test"
            ],
            "internalConsoleOptions": "openOnSessionStart"
        }
    ]
*/

const chai = require('chai');
let chaiHttp = require('chai-http');
let expect = require('chai').expect ;
//let should = chai.should();
let chaiAsPromised = require('chai-as-promised');
let chaiSchema = require('chai-json-schema-ajv');
let server = require('../server');
//var utilities = require('../utilities');
var fs = require("fs");
var path = require('path');


chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(chaiSchema)

process.env.NODE_ENV = 'test';

const removeEmptyArray = (obj) => {
    Object.keys(obj).forEach((k) => {
        if (obj[k].length == 0) {
            delete obj[k];
        };
    });
    return obj;
};

// Read all services
var jsonPath = path.join(__dirname, '..', 'services', 'services.json');
var contents = fs.readFileSync(jsonPath);
var services = JSON.parse(contents);

var service_group = {} ;
var parts ;
var grp_name ;
// could be forEach..testObj.hasOwnProperty("key")) {
for (i = 0; i < services.length; i++) { 
    parts = services[i].path.split(path.sep);
    grp_name = parts[2] ; 
    if (!(service_group.hasOwnProperty(grp_name))){
        service_group[grp_name] = [] ;
    };
    service_group[grp_name].push(services[i])
};



// Group services, into test cases and functionality group
var skip_groups = [];
var skip_services = [];
var stohastic_services = [] ;

skip_groups = ['data_loading']
// skip_groups = ['data_loading', 'dimensionality_reduction', 'data_manipulation']
skip_services = ['loadurl', 'arima', 'starima']
stohastic_services = ['mds', 'autoencoder', 'lof'] // check only the structure of output

////////////// Define tests ///////////////
// It's important to define tests outside of 
let test_cases = {} ; // test cases per group
let stohastic_test_cases = {} ; // test cases per group

Object.keys(service_group).forEach(function(group) {
    let service_name ;
    let service_desc_path; 
    let service_desc_buffer;
    let desc;
    if (skip_groups.includes(group)){
        return ; // skip this group
    };
    
    test_cases[group] = [] ; // deterministic output services
    stohastic_test_cases[group] = [] ; // stohastic output services

    var service_object ;          
    service_group[group].forEach((service) => {     
        service_name = service.name ; 
        if (skip_services.includes(service_name)){ // TODO: fix, this doesnt work
            return true; // skip this group
        }
        else{
            if (stohastic_services.includes(service_name)){
                stohastic_test_cases[group][service_name] = {} ;
            }else{
                test_cases[group][service_name] = {} ;
            };
        };
        service_desc_path = path.resolve(service.path, "desc.json");
        service_desc_buffer = fs.readFileSync(service_desc_path);
        desc = JSON.parse(service_desc_buffer);

        service_object = {
            'name': service_name,
            'input': desc.inputExample,
            'expectedOutput': desc.outputExample,
            'expectedOutputType': desc.outputSchema.type,
            'expectedOutputSchema':  desc.outputSchema
        };

        if (stohastic_services.includes(service_name)){
            stohastic_test_cases[group].push(service_object) ;
        }else{
            test_cases[group].push(service_object) ;
        };
    });        
});

stohastic_test_cases = removeEmptyArray(stohastic_test_cases);
test_cases = removeEmptyArray(test_cases) ;

// Run deterministic output test cases -> response check
describe('Testing Services by functionality group', function() {
Object.keys(test_cases).forEach(function(group) {

    describe(group, function() {
        
        test_cases[group].forEach((service) => {            

            it('Checking response of service \\'+service.name, function(done) {
                this.timeout('10sec');
                chai.request(server)
                    .post('/'+ service.name)
                    .send(service.input)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a(service.expectedOutputType);
                        expect(res.body).to.eql(service.expectedOutput);
                        done(); // TODO fix this part
                    });
            });
        });
    });
});
});
//setTimeout(500) ;

// TODO FIX uncatched error happen during initial call of .end 
// Run stohastic output test cases -> response schema check
// describe('Testing Services with stohastic output by functionality group', function () {
//     Object.keys(stohastic_test_cases).forEach(function (group) {

//         describe(group, function () {

//             stohastic_test_cases[group].forEach((service) => {
//                 it('Checking response of service \\' + service.name, function () {
//                     this.timeout('10sec');
//                     chai.request(server)
//                         .post('/' + service.name)
//                         .send(service.input)
//                         .then(function (res) {
//                         //.end((err, res) => {
//                             expect(res).to.have.status(200);
//                             expect(res.body).to.be.jsonSchema(service.expectedOutputSchema) ;                            
//                          })
//                          .catch(function (err) {
//                             throw err;
//                          });
//                     // catch here !!!!
//                 });
//             });
//         });
//     });
// });