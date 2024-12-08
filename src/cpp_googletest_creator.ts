const Cpp = require('tree-sitter-cpp');
import Parser = require('tree-sitter');
import * as CppInterface from './cpp_objects';
import { IBuildSystem } from './build_system_interface';
import {parse} from './cpp_better_parser';
import { ITestCreator } from './test_creator';
import { TestCreatorContext } from './test_creator_context';
import * as path from 'path';
import * as fs from 'fs';
import { CMakeBuildSystem } from './cmake_build_system';
import { TemplateHandler } from './templates';
import { cppPrimitiveTypes } from './cpp_primitive_types';
import { buildTreeFromPaths, TreeNode } from './file_system_parser';
import { cppOverloadableOperators } from './cpp_operators';


const googleTestTemplateDir = path.join(__dirname, '..', 'templates', 'GoogleTest');
const config = {
    "parametrized_instantiation_combine": path.join(googleTestTemplateDir, "test_parametrized_instantiation_combine.cpp"),
    "parametrized_instantiation_return_type": path.join(googleTestTemplateDir, "test_parametrized_instantiation_return_type.cpp"),
    "parametrized_simple": path.join(googleTestTemplateDir,"test_parametrized_simple.cpp"),
    "parametrized_suite_class": path.join(googleTestTemplateDir,"test_parametrized_suite_class.cpp"),
    "parametrized_suite_class_simple": path.join(googleTestTemplateDir,"test_parametrized_suite_class_simple.cpp"),
    "test_exception": path.join(googleTestTemplateDir,"test_exception.cpp"),
    "test_simple": path.join(googleTestTemplateDir,"test_simple.cpp"),
    "dependency": path.join(googleTestTemplateDir,"dependency.cpp"),
    "main": path.join(googleTestTemplateDir, "test_main.cpp"),
    "test_suite_class": path.join(googleTestTemplateDir, "test_suite_class.cpp"),
};


function params_to_str(params: CppInterface.Parameter[]): string {
    return params.map(param => param.type).join(', ');
}

function toCppClassName(input: string): string {
    // Trim whitespace
    let result = input.trim();
  
    // Convert spaces and special chars to underscores
    // A valid character set after the first character is [a-zA-Z0-9_]
    // So we will keep only these, and convert others to underscores.
    // For now, let's do a simplistic replacement and then we can refine.
    result = result.replace(/[^a-zA-Z0-9_]/g, "_");
  
    // Ensure it doesn't start with a digit. If it does, prepend an underscore.
    if (/^[0-9]/.test(result)) {
      result = "_" + result;
    }
  
    // If the first character is empty after trimming or is invalid (just underscores),
    // force a default name
    if (!result || /^_+$/.test(result)) {
      result = "_ClassName";
    }
  
    // Optionally convert to PascalCase:
    // Split on underscores and capitalize each part
    const parts = result.split("_").filter(Boolean);
    result = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join("");
  
    // If after PascalCase conversion it starts with a digit, fix that again
    if (/^[0-9]/.test(result)) {
      result = "_" + result;
    }
  
    return result;
}

// // Example usage:
// console.log(toCppClassName("   my cool! class??? "));  // "MyCoolClass"
// console.log(toCppClassName("123ClassName"));           // "_123classname" => After PascalCase: "_123classname" -> "_123classname" (starts with _)
// console.log(toCppClassName("std::exc::runtime_exc{\"aa\",bb}"));                    // "_ClassName"
// console.log(toCppClassName("std::exception")); 

export class GoogleTestTestCreator implements ITestCreator {
    ctx: TestCreatorContext;
    buildSystem: IBuildSystem;
    templater: TemplateHandler;

    constructor(_ctx: TestCreatorContext, _buildSystem: IBuildSystem) {
        this.ctx = _ctx;
        this.buildSystem = _buildSystem;
        this.templater = new TemplateHandler;
    }

    generateTests(): void {
        
        
        // const rootToSrc = path.relative(this.ctx.rootDir, this.ctx.relativeSrcDir);
        const parser = new Parser();
        parser.setLanguage(Cpp);


        const dependencies = this.templater.getTemplate(config["dependency"],{}) + "\n#include <limits>\n";
        const subdirs: Set<string> = new Set;

        this.ctx.testFiles.forEach(srcFile => {
            console.log(`Processing file1 ${srcFile}`);
            const cppCode = fs.readFileSync(srcFile, 'utf8');

            // Parse the file content
            const tree = parser.parse(cppCode);

            // Extract details from the root node
            const classDetails = parse(tree.rootNode);

            // Test file path
            const srcToFile = path.relative(this.ctx.relativeSrcDir, path.dirname(srcFile));
            const testRootDir = path.join(this.ctx.rootDir, "tests"); 
            const testDir = path.join(testRootDir, srcToFile);
            if (!fs.existsSync(testDir) || !fs.lstatSync(testDir).isDirectory()) {
                fs.mkdirSync(testDir, {recursive: true});
            }

            const fileName: string = path.basename(srcFile, path.extname(srcFile));
            const testFile = path.join(testDir, `${fileName}Test${path.extname(srcFile)}`);
            
            console.log(`Processing file2 ${srcFile}`);
            classDetails.globalFunctions.forEach(globalFunc => this.generateForGlobalFunc(testDir, srcFile, globalFunc, dependencies));
            classDetails.classes.forEach(_class => {
                const subdir: string = this.generateForClass(testDir, srcFile, _class, classDetails.classes.length > 1, dependencies);
                if(subdir.length > 0) {
                    subdirs.add(path.relative(testRootDir, subdir));
                }
            });

            
            //this.buildSystem.generateSubdirBuilderFile(testDir);
            subdirs.add(path.relative(testRootDir, testDir));
        });

        const fileSystem = buildTreeFromPaths(subdirs);
        this.constructBuildSystem(fileSystem);
        // console.log(JSON.stringify(fileSystem, null, 2));
        // this.buildSystem.generateRootBuilderFile(this.ctx.rootDir, Array.from(subdirs));
    }

    constructBuildSystem(node: TreeNode, path_elements: string[] = [], isTopLevel: boolean = true): void {
        const subdirs: string[] = [];

        const currPath: string = path.join(...path_elements);
        // Each key in the current node is a child directory/file
        for (const key of Object.keys(node)) {
            const newPath = [...path_elements, key];
            // Do something with the current path
            //console.log(newPath.join('/'));

            subdirs.push(key);
        
            // Recurse into the child node
            this.constructBuildSystem(node[key], newPath, false);
        }

        // if(subdirs.length === 0) {
        //     return;
        // }

        if(isTopLevel) {
            this.buildSystem.generateRootBuilderFile(this.ctx.rootDir, subdirs);
        } else {
            //console.log(`Generating cmake subdir for ${this.ctx.rootDir}/tests/${currPath} with keys ${subdirs}`);
            this.buildSystem.generateSubdirBuilderFile(`${this.ctx.rootDir}/tests/${currPath}`, subdirs);
        }
    }


    generateForGlobalFunc(testDir: string, srcFile: string, func: CppInterface.FunctionMember, dependencies: string): void {
        const testSuiteName: string = func.name;
        const fileName: string = path.basename(srcFile, path.extname(srcFile));
        const testFile: string = path.join(testDir, fileName + "_" + func.name + "Test.cpp"); //+ path.extname(srcFile));
        console.log(`\tProcessing func ${func.name}`);

        // Creating file + adding dependency
        fs.appendFileSync(testFile, dependencies);
        const relativeToSource = path.relative(testDir, srcFile);
        fs.appendFileSync(testFile, `#include "${relativeToSource}"\n`);

        if(func.templateParameters.length === 0) {
            this.generateForFunc(testFile, func,  testSuiteName);
        } else {
            
        }
    }

    generateForFunc(testFile: string, func: CppInterface.FunctionMember, testSuiteName: string) {
        const hasReturnType: boolean  = func.type !== "void";
        const isParametrized: boolean = func.parameters.length > 0 || hasReturnType;
        

        let params = func.parameters.slice();
        if(hasReturnType) {
            params.unshift({type: func.type, name: ""});
        }

        params = params.map(param => {
            const referenceInd: Number = param.type.indexOf('&');
            if(referenceInd !== -1) {
                const trimmed: string = param.type.replace(/&/g, "").trim();
                param.type = `std::shared_ptr<${trimmed}>`;
            }
            return param;
        });

        // Function has at least one parameter -> parametrized test
        if(isParametrized) {
            // Adding test suite class
            this.addParametrizedTestSuiteClass(testFile, params, testSuiteName, config["parametrized_suite_class_simple"]);
        }
        
        // Adding one general test case
        this.addGeneralTestCase(testFile, params, func.name, testSuiteName);
        
        // Create additional test cases for all exceptions with 
        // one expect throw and one expect no throw test case
        this.addTestThrow(testFile, testSuiteName, func.throws);

        // Adding some instance values
        if(isParametrized) {
            this.addParamInstantiation(testFile, testSuiteName, params.map(param => this.generateInstantiationParameters(param)));
        }
        
        // Adding test for return types -> would be hard because the test suite class does not contain
        // the return type -> lets put the first argument as the return type if its non-void
        if(hasReturnType) {
            this.addParametrizedTestSuiteClass(testFile, params, testSuiteName, config["parametrized_instantiation_return_type"]);
        }
    }


    addParametrizedTestSuiteClass(testFile: string, parameters: CppInterface.Parameter[], testSuiteName: string, template: string) {
        fs.appendFileSync(testFile, this.templater.getTemplate(template, {
            TemplateParams: params_to_str(parameters),
            TestSuiteName: testSuiteName,
            HasBaseClass: false,
            BaseClass: "",
            GoogleTestBaseClass: "testing::TestWithParam"
        }));
    }

    addGeneralTestCase(testFile: string, params: CppInterface.Parameter[], funcName: string, testSuiteName: string) {
        const testType: string = params.length > 0
            ? config["parametrized_simple"] 
            : config["test_simple"];

        fs.appendFileSync(testFile, this.templater.getTemplate(testType, {
            TestSuiteName: testSuiteName,
            TestName: `${funcName}General`
        }));
    }

    addParamInstantiation(testFile: string, testSuiteName: string, testingParams: string[]) {
        fs.appendFileSync(testFile, this.templater.getTemplate(config["parametrized_instantiation_combine"], {
            TestSuiteName: testSuiteName,
            TestingParameters: testingParams
        }));
    }

    addTestThrow(fileName: string, testSuiteName: string, exceptions: string[]) {
        exceptions.forEach(exception => {
            fs.appendFileSync(fileName, this.templater.getTemplate(config["test_exception"], {
                TestSuiteName: testSuiteName,
                TestNameThrow: `Throw${toCppClassName(exception)}`,
                TestNameNoThrow: `NoThrow${toCppClassName(exception)}`,
                ExceptionType: exception
            }));
        });
    }

    generateInstantiationParameters(param: CppInterface.Parameter): string {
        const typeInfo = cppPrimitiveTypes.get(param.type);
        return typeInfo !== undefined
            ? this.constructInstantiationParamsForPrimitiveType(param.type, typeInfo).join(', ')
            : "";
    }

    constructInstantiationParamsForPrimitiveType(T: string, typeInfo: {signed: boolean}): string[] {
        const params = [
            `std::numeric_limits<${T}>::min()`,
            `std::numeric_limits<${T}>::max()`,
            `(${T})(0)`,
            `(${T})(5)`, 
        ];

        if(typeInfo.signed) {
            params.push(`(${T})(-113)`);
        }

        return params;
    }

    generateForClass(testDir: string, srcFile: string, classElement: CppInterface.ClassOrStruct, multiClassFile: boolean, dependencies: string): string {
        if(classElement.functions.length === 0) {
            return "";
        }
        console.log(`\tProcessing class ${classElement.className}`);
        const className: string = toCppClassName(classElement.className);
        
        testDir = path.join(testDir, className);
        // Creating a separate directory for all the classes (They will contain multiple test files)
        if (!fs.existsSync(testDir) || !fs.lstatSync(testDir).isDirectory()) {
            fs.mkdirSync(testDir, {recursive: true});
        }

        // Adding base testing class
        const testSuiteName: string = className;
        const fileExt = path.extname(srcFile);
        const fileName: string = path.basename(srcFile, fileExt);
        const baseFileName = fileName + "Test" ;
        const baseTestFileName = path.join(testDir, baseFileName+ fileExt);
        fs.writeFileSync(baseTestFileName, dependencies + this.templater.getTemplate(config["test_suite_class"], {
            TestSuiteName: testSuiteName
        }));

        dependencies += `#include "${path.basename(baseTestFileName)}"\n`;
    
        classElement.functions.forEach(func => {
            if(func.name === classElement.className || func.name === `~${classElement.className}` || func.access !== CppInterface.AccessSpecifier.Public) {
                return;
            }

            const funcName: string = Object.entries(cppOverloadableOperators).find(([key]) => func.name.startsWith(key))?.[1] ?? func.name;

            console.log(`\t\tProcessing class func ${funcName}`);
            const testFile = path.join(testDir, `${toCppClassName(testSuiteName + "_" + funcName)}Test.cpp`);
            fs.appendFileSync(testFile, dependencies);

            const relativeToSource = path.relative(testDir, srcFile);
            fs.appendFileSync(testFile, `#include "${relativeToSource}"\n`);

            let parameters: CppInterface.Parameter[] = func.parameters.slice();
            const funcTestSuiteName = className + funcName; 
            const hasReturnType: boolean = func.type !== "void";

            // Add return value as first parameter (possible to test)
            if(hasReturnType) {
                parameters.unshift({ name: "", type: func.type});
            }

            parameters = parameters.map(param => {
                let type: string = param.type.trim();
                if(type.startsWith("const ")) {
                    type = type.substring(6);
                }
                
                // Removing reference -> GoogleTest does not allow reference template parameters
                if(param.type.indexOf('&') !== -1 ) { 
                    type = type.replace(/&/g, "").trim();
                }

                // Mapping any non primitive type / string / pointer to a shared_ptr to make compilation successful
                if(!cppPrimitiveTypes.has(type) && type !== "std::string" && type !== "string" && type.indexOf("*") === -1) {
                    type = `std::shared_ptr<${type}>`;
                }

                param.type = type;
                return param;
            });
            
            // Function without parameters and void return type -> no reason to add parametrized test suite
            if(parameters.length === 0) {

            } else {
                fs.appendFileSync(testFile, this.templater.getTemplate(config["parametrized_suite_class_simple"], {
                    TestSuiteName: funcTestSuiteName,
                    HasBaseClass: true,
                    BaseClass: `${className}Test`,
                    TemplateParams: params_to_str(parameters),
                    GoogleTestBaseClass: "testing::WithParamInterface"
                }));
            }
            
            // Adding one general test case
            this.addGeneralTestCase(testFile, parameters, funcName, funcTestSuiteName);

            this.addTestThrow(testFile, funcTestSuiteName, func.throws);

            if(func.parameters.length > 0) {
                this.addParamInstantiation(testFile, funcTestSuiteName, parameters.map(param => this.generateInstantiationParameters(param)));
            }

            if(hasReturnType) {
                this.addParametrizedTestSuiteClass(testFile, parameters, funcTestSuiteName, config["parametrized_instantiation_return_type"]);
            }

        });

        return testDir;
    }
}

// new GoogleTestTestCreator({
//     rootDir: "./src/test/data",
//     relativeSrcDir: "./src/test/data/src",
//     testFiles: ["./src/test/data/src/templated_operator.h"]//["./src/test/data/src/nested/example.h", "./src/test/data/src/nested/double_nested/Game.h"]
    
// }, new CMakeBuildSystem("templates/GoogleTest")).generateTests();