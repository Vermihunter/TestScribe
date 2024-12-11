// // import {collectAllClasses} from '../cpp_parser';
// // import {getTemplate} from '../templates';
// // const Cpp = require('tree-sitter-cpp');
// // const Parser = require('tree-sitter');


// // const fs = require('fs');
// // const path = require('path');

// // const filePath = path.resolve(__dirname, "data" ,'structs_with_methods.cpp');
// // const cppCode = fs.readFileSync(filePath, 'utf8');



// import * as fs from 'fs';
// import * as path from 'path';
// import Parser = require('tree-sitter');
// import Cpp = require('tree-sitter-cpp');

// // Define the AccessSpecifier enum
// enum AccessSpecifier {
//     Public = 'public',
//     Protected = 'protected',
//     Private = 'private',
// }

// // Define interfaces for parameters, members, and classes
// interface TemplateParameter {
//     name: string;
//     type?: string; // Type can be optional for non-type template parameters
// }

// interface Parameter {
//     name: string;
//     type: string;
// }

// interface Member {
//     name: string;
//     type: string;
//     isStatic: boolean;
//     isVirtual: boolean;
//     access: AccessSpecifier;
//     templateParameters?: TemplateParameter[]; // For template variables (less common)
// }

// interface FunctionMember extends Member {
//     parameters: Parameter[];
// }

// interface ClassOrStruct {
//     className: string;
//     variables: Member[];
//     functions: FunctionMember[];
//     access: AccessSpecifier;
//     nestedClasses: ClassOrStruct[];
//     templateParameters?: TemplateParameter[];
// }

// // Initialize Tree-sitter and set the language
// const parser = new Parser();
// parser.setLanguage(Cpp);

// // Read the C++ file
// //const filePath = path.resolve(__dirname, 'example.cpp');
// const filePath = path.resolve(__dirname, 'tool_card.h');
// const cppCode = fs.readFileSync(filePath, 'utf8');

// // Parse the file content
// const tree = parser.parse(cppCode);

// // Function to determine access specifier
// function determineAccessSpecifier(node: Parser.SyntaxNode | null): AccessSpecifier {
//     if (!node) return AccessSpecifier.Private; // Default for classes
//     const text = node.text.toLowerCase();
//     if (text.includes('public')) return AccessSpecifier.Public;
//     if (text.includes('protected')) return AccessSpecifier.Protected;
//     return AccessSpecifier.Private;
// }

// // Function to collect all classes in the syntax tree
// // function collectClasses(node: Parser.SyntaxNode, currentAccess = AccessSpecifier.Private) {
// //     const classes: ClassOrStruct[] = [];

// //     function traverse(node: Parser.SyntaxNode, accessSpecifier: AccessSpecifier) {
// //         if (node.type === 'class_specifier' || node.type === 'struct_specifier') {
// //             const classNameNode = node.childForFieldName('name');
// //             const className = classNameNode ? classNameNode.text : '<anonymous>';
// //             const variables: Member[] = [];
// //             const functions: FunctionMember[] = [];
// //             const nestedClasses: ClassOrStruct[] = [];
// //             let templateParameters;

// //             // Check for preceding template declaration
// //             const templateNode = findTemplateDeclaration(node);
// //             if (templateNode) {
// //                 templateParameters = extractTemplateParameters(templateNode);
// //             }

// //             const bodyNode = node.childForFieldName('body');
// //             const classAccess = node.type === 'struct_specifier' ? AccessSpecifier.Public : AccessSpecifier.Private;

// //             if (bodyNode) {
// //                 let currentAccessSpecifier = classAccess;

// //                 for (const child of bodyNode.namedChildren) {
// //                     // Update access specifier if necessary
// //                     if (child.type === 'access_specifier') {
// //                         const specifier: string = child.text.toLowerCase();
// //                         currentAccessSpecifier = specifier === 'public' ? AccessSpecifier.Public : AccessSpecifier.Private;
// //                     }
// //                     // Process members
// //                     processMember(child, currentAccessSpecifier, variables, functions, nestedClasses);
// //                 }
// //             }

// //             // Create the class object
// //             const classObj: ClassOrStruct = {
// //                 className,
// //                 variables,
// //                 functions,
// //                 access: accessSpecifier,
// //                 nestedClasses,
// //             };

// //             if (templateParameters) {
// //                 classObj.templateParameters = templateParameters;
// //             }

// //             classes.push(classObj);
// //         } else {
// //             // Traverse children
// //             for (const child of node.namedChildren) {
// //                 traverse(child, accessSpecifier);
// //             }
// //         }
// //     }

// //     function processMember(
// //         node: Parser.SyntaxNode,
// //         accessSpecifier: AccessSpecifier,
// //         variables: Member[],
// //         functions: FunctionMember[],
// //         nestedClasses: ClassOrStruct[]
// //     ) {
// //         if (node.type === 'field_declaration') {
// //             const storageModifiers = node.children.filter(
// //                 n =>
// //                     n.type === 'storage_class_specifier' ||
// //                     n.type === 'type_qualifier' ||
// //                     n.type === 'virtual_specifier'
// //             );
// //             const isStatic = storageModifiers.some(n => n.text === 'static');
// //             const isVirtual = storageModifiers.some(n => n.text === 'virtual');

// //             const typeNode = node.childForFieldName('type');
// //             const declaratorNode = node.childForFieldName('declarator');
// //             let templateParameters;

// //             // Check for template declaration for member functions
// //             const templateNode = findTemplateDeclaration(node);
// //             if (templateNode) {
// //                 templateParameters = extractTemplateParameters(templateNode);
// //             }

// //             if (declaratorNode) {
// //                 if (declaratorNode.type.includes('function_declarator')) {
// //                     // It's a function
// //                     const nameNode = declaratorNode.childForFieldName('declarator');
// //                     const parametersNode = declaratorNode.childForFieldName('parameters');

// //                     const name = nameNode ? nameNode.text : '<unknown>';
// //                     const type = typeNode ? typeNode.text : '<unknown>';

// //                     // Parse parameters
// //                     const parameters = [];
// //                     if (parametersNode) {
// //                         for (const paramNode of parametersNode.namedChildren) {
// //                             if (paramNode.type === 'parameter_declaration') {
// //                                 const paramTypeNode = paramNode.childForFieldName('type');
// //                                 const paramDeclaratorNode = paramNode.childForFieldName('declarator');

// //                                 const paramType = paramTypeNode ? paramTypeNode.text : '<unknown>';
// //                                 const paramName = paramDeclaratorNode ? paramDeclaratorNode.text : '<unknown>';

// //                                 parameters.push({
// //                                     name: paramName,
// //                                     type: paramType,
// //                                 });
// //                             }
// //                         }
// //                     }

// //                     const functionMember: FunctionMember = {
// //                         name,
// //                         type,
// //                         isStatic,
// //                         isVirtual,
// //                         access: accessSpecifier,
// //                         parameters,
// //                     };

// //                     if (templateParameters) {
// //                         functionMember.templateParameters = templateParameters;
// //                     }

// //                     functions.push(functionMember);
// //                 } else {
// //                     // It's a variable
// //                     const name = declaratorNode.text;
// //                     const type = typeNode ? typeNode.text : '<unknown>';

// //                     const member: Member = {
// //                         name,
// //                         type,
// //                         isStatic,
// //                         isVirtual,
// //                         access: accessSpecifier,
// //                     };

// //                     if (templateParameters) {
// //                         member.templateParameters = templateParameters;
// //                     }

// //                     variables.push(member);
// //                 }
// //             }
// //         } else if (node.type === 'class_specifier' || node.type === 'struct_specifier') {
// //             // Nested class
// //             const nested = collectClasses(node, accessSpecifier);
// //             nestedClasses.push(...nested);
// //         } else {
// //             // Recursively process child nodes
// //             for (const child of node.namedChildren) {
// //                 processMember(child, accessSpecifier, variables, functions, nestedClasses);
// //             }
// //         }
// //     }

// //     // Helper function to find the template declaration associated with a node
// //     function findTemplateDeclaration(node: Parser.SyntaxNode) {
// //         let sibling = node.previousSibling;
// //         while (sibling) {
// //             if (sibling.type === 'template_declaration') {
// //                 return sibling;
// //             } else if (sibling.type !== 'comment' && sibling.type !== 'preproc_call') {
// //                 break;
// //             }
// //             sibling = sibling.previousSibling;
// //         }
// //         return null;
// //     }

// //     // Function to extract template parameters from a template declaration
// //     function extractTemplateParameters(templateNode: Parser.SyntaxNode) {
// //         const parameters: TemplateParameter[] = [];
// //         const templateParameterListNode = templateNode.childForFieldName('parameters');
// //         if (templateParameterListNode) {
// //             for (const paramNode of templateParameterListNode.namedChildren) {
// //                 if (paramNode.type === 'type_parameter_declaration') {
// //                     const typeNameNode = paramNode.childForFieldName('name');
// //                     const typeKeyNode = paramNode.childForFieldName('key');
// //                     const typeKey = typeKeyNode ? typeKeyNode.text : 'typename';
// //                     const name = typeNameNode ? typeNameNode.text : '<anonymous>';
// //                     parameters.push({ name, type: typeKey });
// //                 } else if (paramNode.type === 'parameter_declaration') {
// //                     // Non-type template parameter
// //                     const typeNode = paramNode.childForFieldName('type');
// //                     const declaratorNode = paramNode.childForFieldName('declarator');
// //                     const type = typeNode ? typeNode.text : '<unknown>';
// //                     const name = declaratorNode ? declaratorNode.text : '<anonymous>';
// //                     parameters.push({ name, type });
// //                 }
// //             }
// //         }
// //         return parameters;
// //     }

// //     traverse(node, currentAccess);
// //     return classes;
// // }

// // function collectClasses(
// //     node: Parser.SyntaxNode,
// //     currentAccess: AccessSpecifier = AccessSpecifier.Private,
// //     templateParameters: TemplateParameter[] = []
// //   ): ClassOrStruct[] {
// //     const classes: ClassOrStruct[] = [];
  
// //     if (node.type === 'template_declaration') {
// //       const newTemplateParameters = extractTemplateParameters(node);
// //       const declarationNode = node.childForFieldName('declaration');
// //       if (declarationNode) {
// //         const childClasses = collectClasses(declarationNode, currentAccess, newTemplateParameters);
// //         classes.push(...childClasses);
// //       }
// //     } else if (node.type === 'class_specifier' || node.type === 'struct_specifier') {
// //       const classDetails = collectClassDetails(node, currentAccess, templateParameters);
// //       if (classDetails) {
// //         classes.push(classDetails);
// //       }
// //     } else {
// //       // Traverse children
// //       for (const child of node.namedChildren) {
// //         const childClasses = collectClasses(child, currentAccess, templateParameters);
// //         classes.push(...childClasses);
// //       }
// //     }
  
// //     return classes;
// //   }
  
// //   function collectClassDetails(
// //     node: Parser.SyntaxNode,
// //     currentAccess: AccessSpecifier,
// //     templateParameters: TemplateParameter[]
// //   ): ClassOrStruct | null {
// //     const classNameNode = node.childForFieldName('name');
// //     const className = classNameNode ? classNameNode.text : '<anonymous>';
// //     const variables: Member[] = [];
// //     const functions: FunctionMember[] = [];
// //     const nestedClasses: ClassOrStruct[] = [];
  
// //     const bodyNode = node.childForFieldName('body');
// //     const classAccess =
// //       node.type === 'struct_specifier' ? AccessSpecifier.Public : AccessSpecifier.Private;
  
// //     if (bodyNode) {
// //       let currentAccessSpecifier = classAccess;
  
// //       for (const child of bodyNode.namedChildren) {
// //         if (child.type === 'access_specifier') {
// //           currentAccessSpecifier = determineAccessSpecifier(child);
// //         } else {
// //           processMember(child, currentAccessSpecifier, variables, functions, nestedClasses);
// //         }
// //       }
// //     }
  
// //     const classObj: ClassOrStruct = {
// //       className,
// //       variables,
// //       functions,
// //       access: currentAccess,
// //       nestedClasses,
// //     };
  
// //     if (templateParameters.length > 0) {
// //       classObj.templateParameters = templateParameters;
// //     }
  
// //     return classObj;
// //   }
  
// //   function processMember(
// //     node: Parser.SyntaxNode,
// //     accessSpecifier: AccessSpecifier,
// //     variables: Member[],
// //     functions: FunctionMember[],
// //     nestedClasses: ClassOrStruct[]
// //   ): void {
// //     if (node.type === 'template_declaration') {
// //       const newTemplateParameters = extractTemplateParameters(node);
// //       const declarationNode = node.childForFieldName('declaration');
// //       if (declarationNode) {
// //         if (
// //           declarationNode.type === 'function_definition' ||
// //           declarationNode.type === 'function_declaration'
// //         ) {
// //           const functionMember = processFunction(
// //             declarationNode,
// //             accessSpecifier,
// //             newTemplateParameters
// //           );
// //           if (functionMember) {
// //             functions.push(functionMember);
// //           }
// //         } else if (
// //           declarationNode.type === 'class_specifier' ||
// //           declarationNode.type === 'struct_specifier'
// //         ) {
// //           const nestedClass = collectClassDetails(
// //             declarationNode,
// //             accessSpecifier,
// //             newTemplateParameters
// //           );
// //           if (nestedClass) {
// //             nestedClasses.push(nestedClass);
// //           }
// //         }
// //       }
// //     } else if (
// //       node.type === 'function_definition' ||
// //       node.type === 'function_declaration'
// //     ) {
// //       const functionMember = processFunction(node, accessSpecifier, []);
// //       if (functionMember) {
// //         functions.push(functionMember);
// //       }
// //     } else if (node.type === 'field_declaration') {
// //       const variableMember = processField(node, accessSpecifier);
// //       if (variableMember) {
// //         variables.push(variableMember);
// //       }
// //     } else if (
// //       node.type === 'class_specifier' ||
// //       node.type === 'struct_specifier'
// //     ) {
// //       const nestedClass = collectClassDetails(node, accessSpecifier, []);
// //       if (nestedClass) {
// //         nestedClasses.push(nestedClass);
// //       }
// //     } else {
// //       // Recursively process child nodes
// //       for (const child of node.namedChildren) {
// //         processMember(child, accessSpecifier, variables, functions, nestedClasses);
// //       }
// //     }
// //   }
  
// //   function processFunction(
// //     node: Parser.SyntaxNode,
// //     accessSpecifier: AccessSpecifier,
// //     templateParameters: TemplateParameter[]
// //   ): FunctionMember | null {
// //     const storageModifiers = node.children.filter(
// //       (n) =>
// //         n.type === 'storage_class_specifier' ||
// //         n.type === 'type_qualifier' ||
// //         n.type === 'virtual_specifier'
// //     );
// //     const isStatic = storageModifiers.some((n) => n.text === 'static');
// //     const isVirtual = storageModifiers.some((n) => n.text === 'virtual');
  
// //     const typeNode = node.childForFieldName('type');
// //     const declaratorNode = node.childForFieldName('declarator');
  
// //     if (declaratorNode && declaratorNode.type.includes('function_declarator')) {
// //       const nameNode = declaratorNode.childForFieldName('declarator');
// //       const parametersNode = declaratorNode.childForFieldName('parameters');
  
// //       const name = nameNode ? nameNode.text : '<anonymous>';
// //       const type = typeNode ? typeNode.text : '<unknown>';
  
// //       const parameters: Parameter[] = [];
// //       if (parametersNode) {
// //         for (const paramNode of parametersNode.namedChildren) {
// //           if (paramNode.type === 'parameter_declaration') {
// //             const paramTypeNode = paramNode.childForFieldName('type');
// //             const paramDeclaratorNode = paramNode.childForFieldName('declarator');
  
// //             const paramType = paramTypeNode ? paramTypeNode.text : '<unknown>';
// //             const paramName = paramDeclaratorNode ? paramDeclaratorNode.text : '<anonymous>';
  
// //             parameters.push({
// //               name: paramName,
// //               type: paramType,
// //             });
// //           }
// //         }
// //       }
  
// //       const functionMember: FunctionMember = {
// //         name,
// //         type,
// //         isStatic,
// //         isVirtual,
// //         access: accessSpecifier,
// //         parameters,
// //       };
  
// //       if (templateParameters.length > 0) {
// //         functionMember.templateParameters = templateParameters;
// //       }
  
// //       return functionMember;
// //     }
// //     return null;
// //   }
  
// //   function processField(
// //     node: Parser.SyntaxNode,
// //     accessSpecifier: AccessSpecifier
// //   ): Member | null {
// //     const storageModifiers = node.children.filter(
// //       (n) =>
// //         n.type === 'storage_class_specifier' ||
// //         n.type === 'type_qualifier' ||
// //         n.type === 'virtual_specifier'
// //     );
// //     const isStatic = storageModifiers.some((n) => n.text === 'static');
// //     const isVirtual = storageModifiers.some((n) => n.text === 'virtual');
  
// //     const typeNode = node.childForFieldName('type');
// //     const declaratorNode = node.childForFieldName('declarator');
  
// //     if (declaratorNode) {
// //       const name = extractVariableName(declaratorNode);
// //       const type = typeNode ? typeNode.text : '<unknown>';
  
// //       const member: Member = {
// //         name,
// //         type,
// //         isStatic,
// //         isVirtual,
// //         access: accessSpecifier,
// //       };
  
// //       return member;
// //     }
// //     return null;
// //   }
  
// //   function extractVariableName(node: Parser.SyntaxNode): string {
// //     if (node.type === 'identifier') {
// //       return node.text;
// //     } else if (
// //       node.type === 'array_declarator' ||
// //       node.type === 'pointer_declarator' ||
// //       node.type === 'reference_declarator'
// //     ) {
// //       const declaratorChild = node.childForFieldName('declarator');
// //       if (declaratorChild) {
// //         return extractVariableName(declaratorChild);
// //       } else {
// //         return '<anonymous>';
// //       }
// //     } else {
// //       return '<anonymous>';
// //     }
// //   }
  
// //   function extractTemplateParameters(templateNode: Parser.SyntaxNode): TemplateParameter[] {
// //     const parameters: TemplateParameter[] = [];
// //     const templateParameterListNode = templateNode.childForFieldName('parameters');
// //     if (templateParameterListNode) {
// //       for (const paramNode of templateParameterListNode.namedChildren) {
// //         if (paramNode.type === 'type_parameter_declaration') {
// //           const typeNameNode = paramNode.childForFieldName('name');
// //           const typeKeyNode = paramNode.childForFieldName('key');
// //           const typeKey = typeKeyNode ? typeKeyNode.text : 'typename';
// //           const name = typeNameNode ? typeNameNode.text : '<anonymous>';
// //           parameters.push({ name, type: typeKey });
// //         } else if (paramNode.type === 'parameter_declaration') {
// //           // Non-type template parameter
// //           const typeNode = paramNode.childForFieldName('type');
// //           const declaratorNode = paramNode.childForFieldName('declarator');
// //           const type = typeNode ? typeNode.text : '<unknown>';
// //           const name = declaratorNode ? declaratorNode.text : '<anonymous>';
// //           parameters.push({ name, type });
// //         }
// //       }
// //     }
// //     return parameters;
// //   }
  
// function printNode(node: Parser.SyntaxNode, indent: string = '') {
//   const nodeType = node.type;
//   const startPosition = node.startPosition;
//   const endPosition = node.endPosition;
//   const isNamed = node.isNamed;

//   const nodeInfo = `${indent}${nodeType} [${startPosition.row}:${startPosition.column}-${endPosition.row}:${endPosition.column}]${isNamed ? ' (named)' : ''}`;
  
//   // Print node text if it's a leaf node
//   if (node.childCount === 0) {
//     const nodeText = node.text.trim();
//     console.log(`${nodeInfo} text: "${nodeText}"`);
//   } else {
//     console.log(`${nodeInfo} -> child count: ${node.childCount}`);
//     // Recursively print child nodes with increased indentation
//     for (const child of node.children) {
//       printNode(child, indent + '\t');
//     }
//   }
// }

// //tree.rootNode.children.forEach(child => printNode(child));
// //printNode(tree.rootNode);

// // Extract details from the root node
// // const classDetails = collectClasses(tree.rootNode);

// // // Output the results
// // console.log('Classes and their details (including nested classes and templates):');
// //console.log(JSON.stringify(classDetails, null, 2));
