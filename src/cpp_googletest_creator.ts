const Cpp = require('tree-sitter-cpp');
import Parser = require('tree-sitter');
import * as CppInterface from './cpp_objects';
import { IBuildSystem } from './build_system_interface';
import {parse} from './cpp_better_parser';
import { ITestCreator } from './test_creator';
import { TestCreatorContext } from './test_creator_context';
import * as path from 'path';
import * as fs from 'fs';
import { TemplateHandler } from './templates';
import { cppPrimitiveTypes } from './cpp_primitive_types';
import { buildTreeFromPaths, TreeNode } from './file_system_parser';
import { cppOverloadableOperators } from './cpp_operators';


const googleTestTemplateDir = path.join(__dirname, '..', 'templates', 'GoogleTest');
const config = {
    "parametrized_instantiation_combine": path.join(googleTestTemplateDir, "test_parametrized_instantiation_combine.cpp"),
    "parametrized_instantiation_return_type": path.join(googleTestTemplateDir, "test_parametrized_instantiation_return_type.cpp"),
    "parametrized_simple": path.join(googleTestTemplateDir,"test_parametrized_simple.cpp"),
    "parametrized_suite_class_simple": path.join(googleTestTemplateDir,"test_parametrized_suite_class_simple.cpp"),
    "test_exception": path.join(googleTestTemplateDir,"test_exception.cpp"),
    "test_simple": path.join(googleTestTemplateDir,"test_simple.cpp"),
    "dependency": path.join(googleTestTemplateDir,"dependency.cpp"),
    "main": path.join(googleTestTemplateDir, "test_main.cpp"),
    "test_suite_class": path.join(googleTestTemplateDir, "test_suite_class.cpp"),
    "parametrized_class_func": path.join(googleTestTemplateDir, "test_parametrized_suite_class_for_func.cpp"),
    "test_typed_instantiate": path.join(googleTestTemplateDir, "test_typed_instantiate.cpp"),
    "test_typed_suite_class": path.join(googleTestTemplateDir, "test_typed_suite_class.cpp"),
    "test_typed": path.join(googleTestTemplateDir, "test_typed.cpp")
 
    
};

/**
 * Converts parameters to string separated by commas
 * @param params Parameters to join
 * @returns A comma separated representation of all parameters
 */
function params_to_str(params: CppInterface.Parameter[]): string {
    return params.map(param => param.type).join(', ');
}

/**
 * Converts an input string into a string that could be used as a C++ identifier
 * @param input Input string
 * @returns C++ identifier-friendly representation
 */
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

/**
 * Possibly alters the definition of a type so it was appliable as template paremeters inside the
 * type parametrized test suite's value parametrization.
 * 
 * Processes all template parameters on the lowest level (i.e. in case of std::shared_ptr<Foo<T,K>> processes T and K)
 * and adds the correct declaration before these template parameters if they are passed in the templates
 * array. For each type it adds a "typename T::" prefix and for each compile-time constant (e.g. int)
 * adds "T::"
 * 
 * This makes any type parametrized test suite compile.
 * 
 * @param s A C++ type already without the modifiers (const,...) and pointer/reference declaration
 * @param templates All the templates that may have effect on the type
 * @returns The modified string and the total processed length (this is used only in the recursive calls)
 */
function addTemplatedConstructs(s: string, templates: CppInterface.Parameter[]): [string, number] {

    let currParam: string = "";
    const allParams: string[] = [];

    function pushParam() {
        const trimmedParam: string = currParam.trim();
        if(trimmedParam.length > 0) {
            allParams.push(trimmedParam);
        }
        currParam = "";
    }

    function mapParams(): string {
        pushParam();
        return allParams.map(p => {
            const template = templates.find(t => t.name === p);
            if(!template) {
                return p;
            }

            return template.type === "typename"
                ? `typename T::${p}`
                : `T::${p}`;

        }).join(", ");
    }

    for(let i = 0; i < s.length; i += 1) {
        switch(s[i]) {
            case "<":
                const [nextLevelString, charsChecked] = addTemplatedConstructs(s.slice(i + 1), templates);
                currParam += "<" + nextLevelString + ">";
                i += charsChecked + 1;
                pushParam();
                break;

            case ">":
                return [mapParams(), i];

            case ",":
            case ' ':
            case '\t':
            case '\n':
            case '\r':
            case '\f':
                pushParam();
                break;

            default:
                currParam = currParam + s[i];
        }
    }

    return [mapParams(), s.length];
}

/**
 * Adds the correseponting prefix for templates
 * @param param Parameter to use
 * @returns Template-parameter friendly representation that actually compiles
 */
function toTemplateType(param: CppInterface.Parameter): string {
    return param.type === "typename" 
        ? `typename T::${param.name}` // Typename
        : `T::${param.name}`; // Constant 
}


export class GoogleTestTestCreator implements ITestCreator {
    ctx: TestCreatorContext;
    buildSystem: IBuildSystem;

    constructor(_ctx: TestCreatorContext, _buildSystem: IBuildSystem) {
        this.ctx = _ctx;
        this.buildSystem = _buildSystem;
    }

    generateTests(): void {
        const parser = new Parser();
        parser.setLanguage(Cpp);


        const dependencies = TemplateHandler.getTemplate(config["dependency"],{}) + "\n#include <limits>\n";
        const subdirs: Set<string> = new Set;
        
        this.ctx.testFiles.forEach(srcFile => {
            const cppCode = fs.readFileSync(srcFile, 'utf8');

            // Parse the file content
            const tree = parser.parse(cppCode);

            // Extract details from the root node
            const classDetails = parse(tree.rootNode);

            // Test file path            
            const testRootDir = path.join(this.ctx.rootDir, this.ctx.relativeTestDirName); 
            const srcToFile = path.relative(this.ctx.rootDir, path.dirname(srcFile)).split(path.sep).slice(1);

            const testDir = path.join(testRootDir, srcToFile.join(path.sep));
            if (!fs.existsSync(testDir) || !fs.lstatSync(testDir).isDirectory()) {
                fs.mkdirSync(testDir, {recursive: true});
            }

            classDetails.globalFunctions.forEach(globalFunc => this.generateForGlobalFunc(testDir, srcFile, globalFunc, dependencies));
            classDetails.classes.forEach(_class => {
                const subdir: string = this.generateForClass(testDir, srcFile, _class, classDetails.classes.length > 1, dependencies);
                if(subdir.length > 0) {
                    subdirs.add(path.relative(testRootDir, subdir));
                }
            });

            subdirs.add(path.relative(testRootDir, testDir));
        });

        const fileSystem = buildTreeFromPaths(subdirs);
        this.constructBuildSystem(fileSystem);
    }

    /**
     * Goes through all the generated files by layers and adds the necessary build system constructs
     * On the first (top) level, a different type of build file is generated
     * @param node The current root node of the logical file-system
     * @param path_elements Path to the current root
     * @param isTopLevel Whether we are on the topmost layer or not
     */
    constructBuildSystem(node: TreeNode, path_elements: string[] = [], isTopLevel: boolean = true): void {
        const subdirs: string[] = [];

        const currPath: string = path.join(...path_elements);
        // Each key in the current node is a child directory/file
        for (const key of Object.keys(node)) {
            const newPath = [...path_elements, key];
            subdirs.push(key);
        
            // Recurse into the child node
            this.constructBuildSystem(node[key], newPath, false);
        }

        if(isTopLevel) {
            this.buildSystem.generateRootBuilderFile(this.ctx.rootDir, subdirs);
        } else {
            this.buildSystem.generateSubdirBuilderFile(`${this.ctx.rootDir}/tests/${currPath}`, subdirs);
        }
    }

    /**
     * Removes specifiers, pointers and references from a type and returns the concrete type
     * @param cppType A C++ variable declaration type like const std::shared_ptr<int> * const
     * @returns The modifier-free version of the same variable like std::shared_ptr<int>
     */
    getRealType(cppType: string): string {
        // Remove const/volatile/other qualifiers
        cppType = cppType.replace(/\b(const|volatile|mutable|restrict)\b/g, '');
    
        // Remove pointer (*) and reference (&) modifiers
        cppType = cppType.replace(/[*&]+/g, '');
    
        // Remove extra whitespace
        cppType = cppType.trim().replace(/\s+/g, ' ');
    
        return cppType;
    }

    /**
     * Generates tests for a global function inside a C++ file
     * @param testDir The directory where the tests are inserted
     * @param srcFile The source file that the tests are generated for - used for including it and to construct the test file name from its name
     * @param func The function that the tests are generated for
     * @param dependencies The GoogleTest and other dependencies that are added to each test file
     */
    generateForGlobalFunc(testDir: string, srcFile: string, func: CppInterface.FunctionMember, dependencies: string): void {
        const testSuiteName: string = func.name;
        const fileName: string = path.basename(srcFile, path.extname(srcFile));
        const testFile: string = path.join(testDir, fileName + "_" + func.name + "Test.cpp");

        // Creating file + adding dependency
        fs.appendFileSync(testFile, dependencies);
        const relativeToSource = path.relative(testDir, srcFile);
        fs.appendFileSync(testFile, `#include "${relativeToSource}"\n`);

        if(func.templateParameters.length === 0) {
            // Non-templated function generation
            this.generateForFunc(testFile, func,  testSuiteName);
        } else {
            // Templated function generation
            const params = func.parameters.slice();
            if(func.type !== "void") {
                params.unshift({type: func.type, name: ""});
            }

            /**
             * This has to be done first because on the next line we modify the template parameters 
             * First, the params are normalized (wrapped in shared_ptr if needed) and then template constructs are
             * added (T:: prefix for compile-time constants and typename T:: prefix for types) so the code was compilable.
             */ 
            const funcTemplateParams = this.normalizeParameters(params).map(p => addTemplatedConstructs(p.type, func.templateParameters)[0]).join(", ");
            /**
             * To not hide the types inside TypeDefinitions, we add a _ prefix to the types: T -> _T
             * Notice that first we have to map the possible instances of a type definition to its type as well
             * for example template<typename T, T K> (suppose T=int) - the first move is to map it to template<typename T, _T k>
             * and then apply the same method on T
             */ 
            const modifiedParams: CppInterface.Parameter[] = func.templateParameters
                .map(t => {
                    const newParam = {...t};
                    if(func.templateParameters.some(tp => tp.name === t.type)) {
                        newParam.type = `_${newParam.type}`;
                    }
                    
                    return newParam;
                })
                .map(t => ({...t, name: `_${t.name}`}));

            // Generate templated function constructs
            this.generateTemplatedFunc(testFile, func, {
                ClassTemplateParams: this.getTemplateRepresentation(modifiedParams),
                TestSuiteName: testSuiteName,
                TestName: `${func.name}General`,
                FuncTemplateParams: funcTemplateParams,
                BaseClasses: ["testing::Test"]
            });
        }
    }

    /**
     * A set of tests that are appended for each templated function
     * @param testFile Path to the test file where the tests for the given functions are generated
     * @param func The function that the tests are generated for
     * @param data Data records that will be passed to the templates
     */
    generateTemplatedFunc(testFile: string, func: CppInterface.FunctionMember, data: Record<string, any>) {
        fs.appendFileSync(testFile, TemplateHandler.getTemplate(config["test_typed_suite_class"], data));
        fs.appendFileSync(testFile, TemplateHandler.getTemplate(config["test_typed"], data));
        const exceptionTestSuites: string[] = this.addTestThrow(testFile, data.TestSuiteName, func.throws, "TYPED_TEST_P");
        data.TestSuites = [...exceptionTestSuites, data.TestName];
        fs.appendFileSync(testFile, TemplateHandler.getTemplate(config["test_typed_instantiate"], data));
    }

    /**
     * Non-templated global function generation 
     * @param testFile Path to the test file where the tests for the given functions are generated
     * @param func The function that the tests are generated for
     * @param testSuiteName Name of the test suite which the test will be long to
     */
    generateForFunc(testFile: string, func: CppInterface.FunctionMember, testSuiteName: string) {
        const hasReturnType: boolean  = func.type !== "void";
        const isParametrized: boolean = func.parameters.length > 0 || hasReturnType;
        

        let params = func.parameters.slice();
        if(hasReturnType) {
            params.unshift({type: func.type, name: ""});
        }

        params = this.normalizeParameters(params);

        // Function has at least one parameter -> parametrized test
        if(isParametrized) {
            // Adding test suite class
            this.addParametrizedTestSuiteClass(testFile, params, testSuiteName, config["parametrized_suite_class_simple"], func.templateParameters);
        }

        this.createBaseTesting(testFile, params, func.name, testSuiteName, func, "TEST");
    }


    /**
     * Adds a parametrized test suite for non-templated classes that have at least one parameter (and/or non-void return type)
     * @param testFile Path to the test file where the tests for the given functions are generated
     * @param parameters Parameters of a function including return type if non-void
     * @param testSuiteName Name of the test suite which the test will be long to
     * @param template The template that will be used to generate the tests
     * @param templateParams Template parameters of a function
     */
    addParametrizedTestSuiteClass(testFile: string, parameters: CppInterface.Parameter[], testSuiteName: string, template: string, templateParams: CppInterface.Parameter[]) {
        fs.appendFileSync(testFile, TemplateHandler.getTemplate(template, {
            FuncTemplateParams: params_to_str(parameters),
            TestSuiteName: testSuiteName,
            HasBaseClass: false,
            BaseClass: "",
            HasTemplates: templateParams.length !== 0,
            ClassTemplateParams: this.getTemplateRepresentation(templateParams),
            GoogleTestBaseClass: "testing::TestWithParam"
        }));
    }

    /**
     * Adds a general test case (that is the minimum what is generated for each function)
     * @param testFile Path to the test file where the tests for the given functions are generated
     * @param params Parameters of a function including return type if non-void
     * @param funcName Name of the function
     * @param testSuiteName Name of the test suite which the test will be long to
     */
    addGeneralTestCase(testFile: string, params: CppInterface.Parameter[], funcName: string, testSuiteName: string) {
        const testType: string = params.length > 0
            ? config["parametrized_simple"] 
            : config["test_simple"];

        fs.appendFileSync(testFile, TemplateHandler.getTemplate(testType, {
            TestSuiteName: testSuiteName,
            TestName: `${funcName}General`
        }));
    }

    /**
     * Adds the instantiation part of the value-parametrized tests
     * @param testFile Path to the test file where the tests for the given functions are generated
     * @param testSuiteName Name of the test suite which the test will be long to
     * @param testingParams The instantiation values for each argument
     */
    addParamInstantiation(testFile: string, testSuiteName: string, testingParams: string[]) {
        fs.appendFileSync(testFile, TemplateHandler.getTemplate(config["parametrized_instantiation_combine"], {
            TestSuiteName: testSuiteName,
            TestingParameters: testingParams
        }));
    }

    /**
     * For every exception that is thrown inside the function (or marked in doxygen documentation), an
     * expect throw and an except no throw test case is generated
     * @param fileName Path to the test file where the tests for the given functions are generated
     * @param testSuiteName Name of the test suite which the test will be long to
     * @param exceptions Array of exceptions that the function may throw
     * @param testType Type of GoogleTest test that should be generated for the specific function
     * @returns All the test suite names generated for exceptions (including throw/no throw)
     */
    addTestThrow(fileName: string, testSuiteName: string, exceptions: string[], testType: string): string[] {
        const testSuites: string[] = [];
        exceptions.forEach(exception => {
            const exceptionClassName = toCppClassName(exception);
            const testNameThrow = `Throw${exceptionClassName}`;
            const testNameNoThrow = `NoThrow${exceptionClassName}`;
            fs.appendFileSync(fileName, TemplateHandler.getTemplate(config["test_exception"], {
                TestSuiteName: testSuiteName,
                TestNameThrow: testNameThrow,
                TestNameNoThrow: testNameNoThrow,
                ExceptionType: exception,
                TestType: testType
            }));

            testSuites.push(testNameThrow, testNameNoThrow);
        });
        return testSuites;
    }

    /**
     * Generates instantiation parameters for C++ primitive types
     * Tries to go for corner cases 
     * @param param A C++ parameter that the values should be generated for
     * @returns A comma separated string representing the values to be added
     */
    generateInstantiationParameters(param: CppInterface.Parameter): string {
        const typeInfo = cppPrimitiveTypes.get(param.type);
        return typeInfo !== undefined
            ? this.constructInstantiationParamsForPrimitiveType(param.type, typeInfo).join(', ')
            : "";
    }

    /**
     * Generates instantiation values for primitive types
     * Uses std::numeric_limits to make easier to include corner case (min/max) values of a type
     * Tries to add a minimalistic but comprehensive set of examples
     * @param T The type to generate the values for
     * @param typeInfo Information about the type - whether signed or not
     * @returns A list of values for the type
     */
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

    /**
     * Joins the template types and names into a string, each template variable separated by commas
     * @param templates The template variables that are joined
     * @returns The string representation of template variables joined by comma
     */
    getTemplateRepresentation(templates: CppInterface.Parameter[]): string {
        return templates.map(t => `${t.type} ${t.name}`).join(', ');
    }


    /**
     * Generates unit tests for a class and all its methods (... that are specified by the user)
     * Features:
     * - May happen that a file contains multiple classes/structs -> for each class a new directory is created with the name of the class
     * - For each class there is a class with the same name and "Test" suffix that serves as a base class for other value/type
     *   parametrized tests. This base class defined the SetUp() and TearDown() functions that are most likely similar to all the functions
     * - For each function (that is tested), a new file is generated containing a type/value parametrzied test according to the fact
     *   whether the function is templated or not.
     * @param testDir 
     * @param srcFile 
     * @param classElement 
     * @param multiClassFile 
     * @param dependencies 
     * @returns 
     */
    generateForClass(testDir: string, srcFile: string, classElement: CppInterface.ClassOrStruct, multiClassFile: boolean, dependencies: string): string {
        if(classElement.functions.length === 0) {
            return "";
        }

        const className: string = toCppClassName(classElement.className);
        testDir = path.join(testDir, className);

        // Creating a separate directory for all the classes (They will contain multiple test files)
        if (!fs.existsSync(testDir) || !fs.lstatSync(testDir).isDirectory()) {
            fs.mkdirSync(testDir, {recursive: true});
        }

        // Adding base testing class
        const testSuiteName: string = className;
        const baseFileName = className + "Test";
        const fileExt = path.extname(srcFile);
        const baseTestFileName = path.join(testDir, baseFileName + fileExt);
        const joinedClassTemplates: string = this.getTemplateRepresentation(classElement.templateParameters);

        const classHasTemplates: boolean = joinedClassTemplates.length !== 0;
        
        // Create base test class -> if class is parametrized - type parametrized - otherwise value parametrized class
        fs.writeFileSync(baseTestFileName, dependencies + TemplateHandler.getTemplate(config["test_suite_class"], {
            TestSuiteName: testSuiteName,
            HasTemplates: classHasTemplates,
            ClassTemplateParams: joinedClassTemplates,
        }));

        dependencies += `#include "${path.basename(baseTestFileName)}"\n`;
    
        classElement.functions.forEach(func => {
            if(func.name === classElement.className || func.name === `~${classElement.className}` || !this.ctx.generatedForMethodVisibilities.includes(func.access)) {
                return;
            }

            // Maybe filter operator names to their C++ identifier-friendly variant: operator+ -> operatorPlus
            const funcName: string = Object.entries(cppOverloadableOperators).find(([key]) => func.name.startsWith(key))?.[1] ?? func.name;
            const testFile = path.join(testDir, `${toCppClassName(testSuiteName + "_" + funcName)}Test.cpp`);
            
            const relativeToSource = path.relative(testDir, srcFile);
            fs.appendFileSync(testFile, dependencies + `#include "${relativeToSource}"\n`);

            let parameters: CppInterface.Parameter[] = func.parameters.slice();
            const funcTestSuiteName = className + funcName; 
            const hasReturnType: boolean = func.type !== "void";

            // Add return value as first parameter (possible to test)
            if(hasReturnType) {
                // Replace auto with std::string (auto cannot be a template parameter)
                parameters.unshift({name: "retType", type: func.type.replace("auto", "std::string /* auto */")});
            }

            let allTemplates: CppInterface.Parameter[] = classElement.templateParameters.concat(func.templateParameters)
            const funcTemplateParams = this.normalizeParameters(parameters).map(p => addTemplatedConstructs(p.type, allTemplates)[0]).join(", ");

            allTemplates = allTemplates
                .map(t => {
                    const newParam = {...t};
                    if(func.templateParameters.some(tp => tp.name === t.type)) {
                        newParam.type = `_${newParam.type}`;
                    }
                    
                    return newParam;
                })
                .map(t => ({...t, name: `_${t.name}`})); // t.name = `_${t.name}`; return t;


            if(allTemplates.length > 0) {
                let baseClass: string = `${testSuiteName}Test`;
                if(classElement.templateParameters.length > 0) {
                    baseClass += `<${classElement.templateParameters.map(t => toTemplateType(t)).join(', ')}>`;
                }

                allTemplates.forEach(p => console.log(p));
                this.generateTemplatedFunc(testFile, func, {
                    ClassTemplateParams: this.getTemplateRepresentation(allTemplates),
                    TestSuiteName: `${testSuiteName}${funcName}`,
                    TestName: `${funcName}General`,
                    FuncTemplateParams: funcTemplateParams,
                    BaseClasses: [baseClass]
                });
                
            
                return;
            }
            
            parameters = this.normalizeParameters(parameters);            
            fs.appendFileSync(testFile, TemplateHandler.getTemplate(config["parametrized_class_func"], {
                TestSuiteName: funcTestSuiteName,
                HasBaseClass: true,
                BaseClass: `${className}Test`,
                FuncTemplateParams: params_to_str(parameters),
                GoogleTestBaseClass: "testing::WithParamInterface",
                HasTemplates: classHasTemplates || func.templateParameters.length !== 0,
                ClassTemplateParams: allTemplates.map(t => `${t.type} ${t.name}`).join(', '),
                ClassTemplateParamNames: classElement.templateParameters.map(t => t.name).join(', ')
            }));
        

            this.createBaseTesting(testFile, parameters, funcName, funcTestSuiteName, func, "TEST_P");
        });

        return testDir;
    }

    /**
     * Transforms parameters that may not be move-constructible to a parameter that surely is.
     * It is done by removing the const modifier and the reference declaration. If the result
     * of this operation is not a primitive type or a string instance, it is wrapped in a 
     * std::shared_ptr<> instance.
     * 
     * @param params Paramters to process
     * @returns Transformed parameters
     */
    normalizeParameters(params: CppInterface.Parameter[]): CppInterface.Parameter[] {
        return params.map(param => {
            let type: string = param.type.trim();
            if(type.startsWith("const ")) {
                type = type.substring(6);
            }
            
            // Removing reference -> GoogleTest does not allow reference template parameters
            if(param.type.indexOf('&') !== -1 ) { 
                type = type.replace(/&/g, "").trim();
            }

            // Mapping any non primitive type / string / pointer to a shared_ptr to make compilation successful
            if(!cppPrimitiveTypes.has(type) && type !== "std::string" && type !== "std::string /* auto */" && type !== "string" && type.indexOf("*") === -1) {
                type = `std::shared_ptr<${type}>`;
            }

            param.type = type;
            return param;
        });
    }

    /**
     * Declares the basic constructs that are generated for each test
     * 
     * @param testFile The name of the output test file
     * @param parameters All the parameters of a function (including return type if non-void on position 0)
     * @param funcName Pre-processed name of the function that the tests are generated for
     * @param funcTestSuiteName Suite name for the test cases that belong together
     * @param func The function object that the tests are generated for
     * @param testhThrowType The type of GoogleTest test cases that will be used for the given function (TEST/TEST_P/TYPED_TEST_P)
     */
    createBaseTesting(testFile: string, parameters: CppInterface.Parameter[], funcName: string, funcTestSuiteName: string, func: CppInterface.FunctionMember, testThrowType: string) {
        this.addGeneralTestCase(testFile, parameters, funcName, funcTestSuiteName);

        this.addTestThrow(testFile, funcTestSuiteName, func.throws, testThrowType);

        if(func.parameters.length > 0) {
            this.addParamInstantiation(testFile, funcTestSuiteName, parameters.map(param => this.generateInstantiationParameters(param)));
        }

        if(func.type !== "void") {
            this.addParametrizedTestSuiteClass(testFile, parameters, funcTestSuiteName, config["parametrized_instantiation_return_type"], func.templateParameters);
        }
    }
}