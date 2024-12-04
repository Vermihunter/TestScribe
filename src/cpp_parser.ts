import Parser from 'tree-sitter';
import Cpp from 'tree-sitter-cpp';
import {AccessSpecifier, ClassOrStruct, Member, FunctionMember, Parameter } from './cpp_objects';


function determineAccessSpecifier(node: Parser.SyntaxNode | null): AccessSpecifier {
    if (!node) { return AccessSpecifier.Private;} // Default for classes

    const text = node.text.toLowerCase();
    if (text.includes('public')) { return AccessSpecifier.Public;}
    if (text.includes('protected')) { return AccessSpecifier.Protected;}

    return AccessSpecifier.Private;
}

function collectClassDetails(
    node: Parser.SyntaxNode,
    defaultAccess: AccessSpecifier = AccessSpecifier.Private
): ClassOrStruct | null {
    if (node.type === 'class_specifier' || node.type === 'struct_specifier') {
        const classNameNode = node.childForFieldName('name');
        const className = classNameNode ? classNameNode.text : '<anonymous>';
        const variables: Member[] = [];
        const functions: FunctionMember[] = [];
        const nestedClasses: ClassOrStruct[] = [];

        const bodyNode = node.childForFieldName('body');
        if (bodyNode) {
            let currentAccessSpecifier =
                node.type === 'struct_specifier' ? AccessSpecifier.Public : defaultAccess;

            for (const child of bodyNode.namedChildren) {
                if (child.type === 'access_specifier') {
                    currentAccessSpecifier = determineAccessSpecifier(child);
                } else if (child.type === 'field_declaration') {
                    // Get modifiers like static, virtual, etc.
                    const storageModifiers = child.children.filter(
                        n =>
                            n.type === 'storage_class_specifier' ||
                            n.type === 'type_qualifier' ||
                            n.type === 'virtual_specifier'
                    );
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
                            const parameters: Parameter[] = [];
                            if (parametersNode) {
                                for (const paramNode of parametersNode.namedChildren) {
                                    if (paramNode.type === 'parameter_declaration') {
                                        const paramTypeNode = paramNode.childForFieldName('type');
                                        const paramDeclaratorNode =
                                            paramNode.childForFieldName('declarator');

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
                        } else {
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
                } else if (
                    child.type === 'function_definition' ||
                    child.type === 'function_declaration'
                ) {
                    // Handle standalone function declarations/definitions (if any)
                    // Similar logic as above can be applied here
                } else if (child.type === 'class_specifier' || child.type === 'struct_specifier') {
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
export function collectAllClasses(node: Parser.SyntaxNode): ClassOrStruct[] {
    const classes: ClassOrStruct[] = [];

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