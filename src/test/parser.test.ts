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



// GENERAL
const classData = collectAllClasses(rootNode);

//console.log('Classes and their variables:');
//console.log(JSON.stringify(classData, null, 2));

const testFilePath = path.resolve(__dirname, "..", "..", "tests");
const cppFiles: string[] = [];

let testsConstructed = false;
if (!fs.existsSync(testFilePath) || !fs.lstatSync(testFilePath).isDirectory()) {
    fs.mkdirSync(testFilePath);
    fs.writeFileSync(path.resolve(testFilePath, "main.cpp"), getTemplate("test_main.cpp", {}));
    testsConstructed = true;
}

const dependency = getTemplate("dependency.txt", {});
classData.forEach((value, ind, arr) => {
    const data = dependency + "\n" + value.functions.map(func => {
        const params = func.parameters.map(x => { 
            const name_parts = x.name.split(' ');
            // Adding pointer/reference to the type if present
            return name_parts.length > 1 
                ? `${x.type} ${name_parts[0]}`
                : x.type;
            
        }).join(',');

        return getTemplate('test_parametrized.cpp', { TestSuiteName: `${value.className}_${func.name}`, TemplateParams: params });
    }).join('\n');
    
    const testFileName = value.className + "Test.cpp";
    cppFiles.push(testFileName);
    fs.writeFileSync(path.resolve(testFilePath, testFileName), data, 'utf8');
});


// Create main and CMakeLists.txt
if (testsConstructed) {
    fs.writeFileSync(path.resolve(testFilePath, "CMakeLists.txt"), getTemplate("CMakeLists.txt", {TestFiles: cppFiles.join('\n\t')}));
} 
