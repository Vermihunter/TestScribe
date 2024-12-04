const Cpp = require('tree-sitter-cpp');
const Parser = require('tree-sitter');
import {collectAllClasses} from './cpp_parser';
import {getTemplate} from './templates';


const fs = require('fs');
const path = require('path');
const CMAKE_FILE_NAME = "CMakeLists.txt";

function generateIfNotExists(rootPath: string, fileName: string, templateName: string, config: Record<string, any>) {
    const fullPath = path.resolve(rootPath, fileName); 
    if (fs.existsSync(fullPath)) {
        console.warn(`${fileName} already exists`);
        return;
    }

    fs.writeFileSync(fullPath, getTemplate(templateName, config));
}

export function generateTestCMake(cppFiles: string[], testFilePath: string) {
    generateIfNotExists(testFilePath, CMAKE_FILE_NAME, CMAKE_FILE_NAME, {TestFiles: cppFiles.join('\n\t')});
}

export function generateTestMain(testFilePath: string) {
    generateIfNotExists(testFilePath, "main.cpp", "test_main.cpp", {});
}



// Returns a list of generated filenames
export function generateTestsForFile(fileName: string, srcRoot: string, testFilePath: string): string[] {
    
    // Initialize parser and set the language
    const parser = new Parser();
    parser.setLanguage(Cpp);

    const code = fs.readFileSync(fileName, 'utf-8');

    const relativePath = path.relative(srcRoot, path.dirname(fileName));
    console.log(`Relative path in test generator: ${relativePath}`);

    // Parse the C++ coderootTestDir
    const tree = parser.parse(code);
    const rootNode = tree.rootNode;

    // Create class/function objects from the parsed code
    const classData = collectAllClasses(rootNode);

    // Create dir if not exists
    testFilePath = path.resolve(testFilePath, relativePath);
    if (!fs.existsSync(testFilePath) || !fs.lstatSync(testFilePath).isDirectory()) {
        fs.mkdirSync(testFilePath, {recursive: true});
    }

    // Add the dependencies only once for each file
    const testDependency = getTemplate("dependency.txt", {});
    const classDependency = `#include "${path.relative(testFilePath, fileName)}"`;
    const generatedTestFiles: string[] = [];
    classData.forEach((value) => {
        const data = testDependency + classDependency + "\n" + value.functions.map(func => {
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
        const fullTestFilePath = path.resolve(testFilePath, testFileName);
        generatedTestFiles.push(fullTestFilePath);
        fs.writeFileSync(fullTestFilePath, data, 'utf8');
    });

    return generatedTestFiles;
     
}