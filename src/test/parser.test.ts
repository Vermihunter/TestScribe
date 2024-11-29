import {collectAllClasses} from '../cpp_parser';
import {getTemplate} from '../templates';
const Cpp = require('tree-sitter-cpp');
const Parser = require('tree-sitter');


// collectClassDetails(null)

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, "data" ,'structs_with_methods.cpp');
const cppCode = fs.readFileSync(filePath, 'utf8');

// Initialize parser and set the language
const parser = new Parser();
parser.setLanguage(Cpp);

// Parse the C++ code
const tree = parser.parse(cppCode);
const rootNode = tree.rootNode;

const classData = collectAllClasses(rootNode);

console.log('Classes and their variables:');
console.log(JSON.stringify(classData, null, 2));


const testFilePath = path.resolve(__dirname, "..", "..", "test");
classData.forEach((value, ind, arr) => {
    console.log(path.resolve(testFilePath,value.className) + ".cpp");
    

    const data = value.functions.map(func => {
        const params = func.parameters.map(x => { 
            const name_parts = x.name.split(' ');
            if(name_parts.length > 1) {
                console.log("Name parts: " + x.type + " " + name_parts[0]);
                return x.type + " " + name_parts[0];
            }

            return x.type;
            
        }).join(',');

        console.log("Params: " + params);

        return getTemplate('test_parametrized.cpp', { TestSuiteName: `${value.className}_${func.name}`, TemplateParams: params });
        
    }).join('\n');

    fs.writeFileSync(path.resolve(testFilePath,value.className) + "Test.cpp", data, 'utf8');
});