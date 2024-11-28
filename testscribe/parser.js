"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tree_sitter_1 = __importDefault(require("tree-sitter"));
const tree_sitter_cpp_1 = __importDefault(require("tree-sitter-cpp"));
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, "test/data", 'structs_with_methods.cpp');
const cppCode = fs.readFileSync(filePath, 'utf8');
// Initialize parser and set the language
const parser = new tree_sitter_1.default();
parser.setLanguage(tree_sitter_cpp_1.default);
// Parse the C++ code
const tree = parser.parse(cppCode);
// Define the AccessSpecifier enum
var AccessSpecifier;
(function (AccessSpecifier) {
    AccessSpecifier["Public"] = "public";
    AccessSpecifier["Protected"] = "protected";
    AccessSpecifier["Private"] = "private";
})(AccessSpecifier || (AccessSpecifier = {}));
function determineAccessSpecifier(node) {
    if (!node) {
        return AccessSpecifier.Private;
    } // Default for classes
    const text = node.text.toLowerCase();
    if (text.includes('public')) {
        return AccessSpecifier.Public;
    }
    if (text.includes('protected')) {
        return AccessSpecifier.Protected;
    }
    return AccessSpecifier.Private;
}
// function collectClassDetails(
//     node: Parser.SyntaxNode,
//     result: ClassOrStruct[] = []
// ): ClassOrStruct[] {
//     if (node.type === 'class_specifier' || node.type === 'struct_specifier') {
//         const classNameNode = node.childForFieldName('name');
//         const className = classNameNode ? classNameNode.text : '<anonymous>';  
//         const variables: Member[] = [];
//         const functions: FunctionMember[] = [];
//         const bodyNode = node.childForFieldName('body');
//         if (bodyNode) {
//             let currentAccessSpecifier = node.type === 'struct_specifier' ? AccessSpecifier.Public : AccessSpecifier.Private;
//             for (const child of bodyNode.namedChildren) {
//                 if (child.type === 'access_specifier') {
//                     currentAccessSpecifier = determineAccessSpecifier(child);
//                 } else if (child.type === 'field_declaration') {
//                     // Get modifiers like static, virtual, etc.
//                     const storageModifiers = child.children.filter(
//                         n => n.type === 'storage_class_specifier' || n.type === 'type_qualifier'
//                     );
//                     const isStatic = storageModifiers.some(n => n.text === 'static');
//                     const isVirtual = storageModifiers.some(n => n.text === 'virtual');
//                     const typeNode = child.childForFieldName('type');
//                     const declaratorNode = child.childForFieldName('declarator');
//                     if (declaratorNode) {
//                         // Check if it's a function or variable based on the declarator type
//                         if (declaratorNode.type === 'function_declarator') {
//                             // It's a function
//                             const nameNode = declaratorNode.childForFieldName('declarator');
//                             const parametersNode = declaratorNode.childForFieldName('parameters');
//                             const name = nameNode ? nameNode.text : '<unknown>';
//                             const type = typeNode ? typeNode.text : '<unknown>';
//                             // Parse parameters
//                             const parameters: Parameter[] = [];
//                             if (parametersNode) {
//                                 for (const paramNode of parametersNode.namedChildren) {
//                                     if (paramNode.type === 'parameter_declaration') {
//                                         const paramTypeNode = paramNode.childForFieldName('type');
//                                         const paramDeclaratorNode = paramNode.childForFieldName('declarator');
//                                         const paramType = paramTypeNode ? paramTypeNode.text : '<unknown>';
//                                         const paramName = paramDeclaratorNode ? paramDeclaratorNode.text : '<unknown>';
//                                         parameters.push({
//                                             name: paramName,
//                                             type: paramType,
//                                         });
//                                     }
//                                 }
//                             }
//                             functions.push({
//                                 name,
//                                 type,
//                                 isStatic,
//                                 isVirtual,
//                                 access: currentAccessSpecifier,
//                                 parameters,
//                             });
//                         } else {
//                             // It's a variable
//                             const name = declaratorNode.text;
//                             const type = typeNode ? typeNode.text : '<unknown>';
//                             variables.push({
//                                 name,
//                                 type,
//                                 isStatic,
//                                 isVirtual,
//                                 access: currentAccessSpecifier,
//                             });
//                         }
//                     }
//                 }
//             }
//         }
//         result.push({ className, variables, functions });
//     }
//     // Recursively search in children
//     for (const child of node.children) {
//         collectClassDetails(child, result);
//     }
//     return result;
// }
function collectClassDetails(node, defaultAccess = AccessSpecifier.Private) {
    if (node.type === 'class_specifier' || node.type === 'struct_specifier') {
        const classNameNode = node.childForFieldName('name');
        const className = classNameNode ? classNameNode.text : '<anonymous>';
        const variables = [];
        const functions = [];
        const nestedClasses = [];
        const bodyNode = node.childForFieldName('body');
        if (bodyNode) {
            let currentAccessSpecifier = node.type === 'struct_specifier' ? AccessSpecifier.Public : defaultAccess;
            for (const child of bodyNode.namedChildren) {
                if (child.type === 'access_specifier') {
                    currentAccessSpecifier = determineAccessSpecifier(child);
                }
                else if (child.type === 'field_declaration') {
                    // Get modifiers like static, virtual, etc.
                    const storageModifiers = child.children.filter(n => n.type === 'storage_class_specifier' ||
                        n.type === 'type_qualifier' ||
                        n.type === 'virtual_specifier');
                    const isStatic = storageModifiers.some(n => n.text === 'static');
                    const isVirtual = storageModifiers.some(n => n.text === 'virtual');
                    const typeNode = child.childForFieldName('type');
                    const declaratorNode = child.childForFieldName('declarator');
                    if (declaratorNode) {
                        // Check if it's a function or variable based on the declarator type
                        if (declaratorNode.type === 'function_declarator') {
                            // It's a function
                            const nameNode = declaratorNode.childForFieldName('declarator');
                            const parametersNode = declaratorNode.childForFieldName('parameters');
                            const name = nameNode ? nameNode.text : '<unknown>';
                            const type = typeNode ? typeNode.text : '<unknown>';
                            // Parse parameters
                            const parameters = [];
                            if (parametersNode) {
                                for (const paramNode of parametersNode.namedChildren) {
                                    if (paramNode.type === 'parameter_declaration') {
                                        const paramTypeNode = paramNode.childForFieldName('type');
                                        const paramDeclaratorNode = paramNode.childForFieldName('declarator');
                                        const paramType = paramTypeNode
                                            ? paramTypeNode.text
                                            : '<unknown>';
                                        const paramName = paramDeclaratorNode
                                            ? paramDeclaratorNode.text
                                            : '<unknown>';
                                        parameters.push({
                                            name: paramName,
                                            type: paramType,
                                        });
                                    }
                                }
                            }
                            functions.push({
                                name,
                                type,
                                isStatic,
                                isVirtual,
                                access: currentAccessSpecifier,
                                parameters,
                            });
                        }
                        else {
                            // It's a variable
                            const name = declaratorNode.text;
                            const type = typeNode ? typeNode.text : '<unknown>';
                            variables.push({
                                name,
                                type,
                                isStatic,
                                isVirtual,
                                access: currentAccessSpecifier,
                            });
                        }
                    }
                }
                else if (child.type === 'function_definition' ||
                    child.type === 'function_declaration') {
                    // Handle standalone function declarations/definitions (if any)
                    // Similar logic as above can be applied here
                }
                else if (child.type === 'class_specifier' || child.type === 'struct_specifier') {
                    // Handle nested classes/structs
                    const nestedClass = collectClassDetails(child, currentAccessSpecifier);
                    if (nestedClass) {
                        nestedClasses.push(nestedClass);
                    }
                }
            }
        }
        return {
            className,
            variables,
            functions,
            access: defaultAccess,
            nestedClasses,
        };
    }
    return null;
}
// Function to collect all top-level classes in the file
function collectAllClasses(node) {
    const classes = [];
    if (node.type === 'translation_unit') {
        for (const child of node.namedChildren) {
            const classDetails = collectClassDetails(child);
            if (classDetails) {
                classes.push(classDetails);
            }
        }
    }
    return classes;
}
const rootNode = tree.rootNode;
const classDetails = collectAllClasses(rootNode);
//const classVariables = collectClassDetails(tree.rootNode);
// Output the results
console.log('Classes and their variables:');
console.log(JSON.stringify(classDetails, null, 2));
console.log("###########################");
console.log("###########################");
// ######################### FUNCTIONS
// Traverse to find all function definitions
const functionNodes = rootNode.descendantsOfType('function_definition');
for (const func of functionNodes) {
    // Extract function name
    const declarator = func.childForFieldName('declarator');
    const functionName = declarator?.childForFieldName('declarator')?.text;
    // Extract return type
    const returnType = declarator?.previousSibling?.text;
    // Extract parameters
    const parameterList = declarator?.childForFieldName('parameters');
    const parameters = parameterList?.namedChildren.map(param => param.text).join(', ') || 'void';
    // Extract body
    const body = func.childForFieldName('body')?.text;
    const lines = body?.split('\n')?.map(x => x.trim()).filter(line => line);
    // Print details
    console.log(`Function Name: ${functionName}`);
    console.log(`Return Type: ${returnType}`);
    console.log(`Parameters: ${parameters}`);
    console.log(`Body: ${lines}`);
    console.log(lines);
    console.log('-----------------------');
}
//# sourceMappingURL=parser.js.map