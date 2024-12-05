import Parser from 'tree-sitter';
import Cpp from 'tree-sitter-cpp';
import {AccessSpecifier, ClassOrStruct, Member, FunctionMember, Parameter, CppFile } from './cpp_objects';
import { error } from 'console';


interface FunctionDeclarator {
    parameters: Parameter[];
    funcName: string;
}

function parse_pointer_or_reference_declaration(node: Parser.SyntaxNode, declaratorStr: string): [string,string] {
    let pointerDeclarator: string = "";
    let identifier: string = "";

    node.children.forEach(child => {
        switch(child.type) {
            case declaratorStr:
                pointerDeclarator += ` ${declaratorStr}`;
                break;

            case "reference_declarator":
            case "pointer_declarator":
                const [pointerDecl, _identifier] = parse_pointer_or_reference_declaration(child, declaratorStr);
                pointerDeclarator += pointerDecl;
                identifier = _identifier;
                break;

            case "identifier":
                identifier += child.text;
                break;

            case "type_qualifier":
                pointerDeclarator += " const";
                break;
        }
    });

    return [pointerDeclarator, identifier];
}

function parse_qualified_identifier(node: Parser.SyntaxNode): string {
    let qualifiedIdentifier: string = "";

    node.children.forEach(child => {
        switch(child.type) {
            case "qualified_identifier":
                qualifiedIdentifier += parse_qualified_identifier(child);
                break;
            
            // Namespace name, "::", type
            default:
                qualifiedIdentifier += child.text;
                break;
        }
    });

    return qualifiedIdentifier;
}


function parse_template_argument_list(node: Parser.SyntaxNode): string {
    let templateArgListStr: string = "";

    node.children.forEach(child=> {
        switch(child.type) {
            case "type_descriptor":
                templateArgListStr += child.children[0].text;
                break;
            
            default:
                templateArgListStr += child.text;
                break;
        }
    });

    return templateArgListStr;
}

function parse_template_type(node: Parser.SyntaxNode): string {
    let templateType: string = "";

    node.children.forEach(child=> {
        switch(child.type) {
            case "type_identifier":
                templateType += child.text;
                break;
            case "template_argument_list":
                templateType += parse_template_argument_list(child);
                break;
        }
    });

    return templateType;
}

function parse_parameter_declaration(node: Parser.SyntaxNode): Parameter {
    let name: string = "";
    let type: string = "";

    node.children.forEach(child => {
        switch(child.type) {
            case "primitive_type": // Built-in types
            case "type_identifier": // Aliases
                type += `${child.text} `;
                break;
            
            case "type_qualifier":
                type += "const ";
                break;

            case "qualified_identifier":
                type += parse_qualified_identifier(child);
                break;

            case "identifier":
                name = child.text;
                break;

            case "template_type":
                type += parse_template_type(child);
                break;

            case "reference_declarator":
            case "pointer_declarator":
                const declaratorStr: string = (child.type === "reference_declarator") ? "&" : "*";

                const [decl, identifier] = parse_pointer_or_reference_declaration(child, declaratorStr);
                type += decl;
                name = identifier;
                break;
        }
    });

    return {
        type: type.trim(),
        name: name
    };
}

function parse_parameter_list(node: Parser.SyntaxNode): Parameter[] {
    return node.children
        .filter(child => child.type === "parameter_declaration")
        .map(child => parse_parameter_declaration(child));
}

function parse_throws_doc_tags(docString: string): { exception: string; description: string }[] {
    // Normalize line endings to \n
    const normalizedDocString = docString.replace(/\r\n/g, '\n');

    // Remove leading spaces and asterisks from each line
    const cleanedDocString = normalizedDocString.replace(/^[ \t]*\*[ \t]?/gm, '');

    // Regular expression to match @throws tags
    const throwsRegex = /@throws\s+([^\s]+)\s+([\s\S]*?)(?=\n@[a-zA-Z]|$)/g;

    const matches = [];
    let match;

    while ((match = throwsRegex.exec(cleanedDocString)) !== null) {
        matches.push({
            exception: match[1].trim(),
            description: match[2].trim(),
        });
    }

    return matches;
}

function parse_function_definition(node: Parser.SyntaxNode, accessSpecifier: AccessSpecifier, functionComment: string): FunctionMember {

    let isVirtual: boolean = false;
    let isStatic: boolean = false;
    let returnType: string = "";
    let funcName: string = "";
    let parameters: Parameter[] = [];
    
    node.children.forEach(child => {
        switch(child.type) {
            case "virtual":
                isVirtual = true;
                break;
            case "function_declarator":
                const fnc: FunctionDeclarator = parse_function_declaration(child);
                parameters = fnc.parameters;
                funcName = fnc.funcName;
                break;

            case "placeholder_type_specifier":
                returnType += " auto";
                break;

            case "type_identifier": // alias
            case "primitive_type": // void return type
            case "type_identifier": // type return type
                returnType += ` ${child.text}`;
                break;

        }
    });

    const exceptions = parse_throws_doc_tags(functionComment);

    return {
        isVirtual: isVirtual,
        isStatic: isStatic,
        name: funcName,
        type: returnType,
        access: accessSpecifier,
        parameters: parameters,
        throws: exceptions.map(x => x.exception),
        templateParameters: [] // It is set in another step - this is correct
    };
}

function parse_destructor_name(node: Parser.SyntaxNode): string {
    const destructorNode = node.children.find(child => child.type === "identifier");
    return (destructorNode === undefined) ? "" : `~${destructorNode.text}`;
}

function parse_operator(node: Parser.SyntaxNode): string {
    return node.children.map(x => x.text).join('');
}

function parse_function_declaration(node: Parser.SyntaxNode): FunctionDeclarator {
    let name: string = "";
    let parameters: Parameter[] = [];

    node.children.forEach(child => {
        switch(child.type) {
            case "destructor_name":
                name = parse_destructor_name(child);
                break;
            case "identifier": // Constructor
            case "field_identifier": // Function
                name = child.text;
                break;
            case "parameter_list":
                parameters = parse_parameter_list(child);
                break;

            case "operator_name":
                name = parse_operator(child);
                break;
        }
    });

    return {
        parameters: parameters,
        funcName: name
    };
}



function parse_base_classes(node: Parser.SyntaxNode): string[] {
    return node.children
        .filter(child => child.type === "type_identifier")
        .map(child => child.text);
}

function parse_declaration(node: Parser.SyntaxNode, accessSpecifier: AccessSpecifier, declarationComment: string): FunctionMember | ClassOrStruct | null {
    if(node.children.find(child => child.type === "function_declarator")) {
        return parse_function_definition(node, accessSpecifier, declarationComment);
    }

    let structSpecifier = node.children.find(child => child.type === "struct_specifier" || child.type === "class_specifier");
    if(structSpecifier !== undefined) {
        return parse_class(structSpecifier, accessSpecifier);
    }

    // structSpecifier = node.children.find(child => child.type === "class_specifier");
    // if(structSpecifier !== undefined) {
    //     return parse_class(structSpecifier, accessSpecifier);
    // }

    return null;
}

function isFunctionMember(value: any): value is FunctionMember {
    return value && Array.isArray(value.parameters);
}

// Class members - variables, functions, nested classes, access modifiers
function parse_field_declaration_list(node: Parser.SyntaxNode, currAccessSpecifier: AccessSpecifier) : [FunctionMember[], ClassOrStruct[]]{
    const nestedClasses: ClassOrStruct[] = [];
    const functions: FunctionMember[] = [];
    let lastComment: string = "";

    node.children.forEach(child => {
        switch(child.type) {
            case "access_specifier":
                currAccessSpecifier = child.children[0].type as AccessSpecifier;
                break;

            case "template_declaration":
                const templated = parse_templated(child, AccessSpecifier.Public);
                if(isFunctionMember(templated)) {
                    functions.push(templated);
                } else {
                    nestedClasses.push(templated);
                }
                break;
            
            case "comment":
                lastComment = child.text;
                break;

            case "function_definition":
            case "field_declaration":
            case "declaration":
                //console.log(`Processing declaration - ${child}`);
                var func = parse_declaration(child, currAccessSpecifier, lastComment);
                if(func === null) {
                    // empty -> not looking so nice
                } else if(isFunctionMember(func)) {
                    // FunctionMember
                    functions.push(func);
                } else {
                    // ClassOrStruct
                    nestedClasses.push(func);
                }
                break;
        }
    });

    return [functions, nestedClasses];
}

function parse_class(node: Parser.SyntaxNode, defaultAccessSpecifier: AccessSpecifier): ClassOrStruct {
    if(!["class_specifier", "function_definition", "struct_specifier"].includes(node.type)) {
        throw new Error(`Invalid class type - ${node.type}`);
    }

    let baseClasses: string[] = [];
    let className: string = "";
    let functions: FunctionMember[] = [];
    let nestedClasses: ClassOrStruct[] = [];

    node.children.forEach(child => {
        switch(child.type) {
            case "base_class_clause": // Base classes
                baseClasses = parse_base_classes(child);
                break;
            case "type_identifier": // Class name
                className = child.text;
                break;
            case "field_declaration_list": // Fields -> variables, functiosn, nested types
                const [newFunctions, newNestedClasses] = parse_field_declaration_list(child, defaultAccessSpecifier);
                functions = newFunctions;
                nestedClasses = newNestedClasses;
                break;

            
        }
    });

    return {
        className: className,
        functions: functions,
        access: defaultAccessSpecifier,
        parentClasses: baseClasses,
        templateParameters: [], // TODO
        variables: [],
        nestedClasses: nestedClasses
    };
}




function parse_template_parameter_declaration(node: Parser.SyntaxNode): Parameter {
    let param: Parameter = {
        type: "",
        name: ""
    };

    node.children.forEach(child=> {
        switch(child.type) {
            case "primitive_type": // Compile time constant like int / size_t
                param.type = child.text;
                break;

            case "identifier":
                param.name = child.text;
                break;

            
        }
    });

    return param;
}

function parse_template_type_parameter_declaration(node: Parser.SyntaxNode): Parameter {
    let param: Parameter = {
        type: "",
        name: ""
    };

    node.children.forEach(child=> {
        switch(child.type) {
            case "typename":
                param.type = "typename";
                break;
            
            case "type_identifier":
                param.name = child.text;
                break;
        }
    });

    return param;
}

function parse_templated_parameter_list(node: Parser.SyntaxNode): Parameter[] {
    const parameters: Parameter[] = [];

    node.children.forEach(child => {
        switch(child.type) {
            case "type_parameter_declaration":
                parameters.push(parse_template_type_parameter_declaration(child));
                break; 

            case "parameter_declaration":
                parameters.push(parse_template_parameter_declaration(child));
                break;
        }
    });

    return parameters;
}

function parse_templated(node: Parser.SyntaxNode, accessSpecifier: AccessSpecifier): FunctionMember | ClassOrStruct {
    let params: Parameter[] = [];
    let templated: FunctionMember | ClassOrStruct | undefined;
    let lastComment: string = "";

    node.children.forEach(child => {
        switch(child.type) {
            case "template_parameter_list":
                params = parse_templated_parameter_list(child);
                break;

            case "function_definition":
                templated = parse_function_definition(child, accessSpecifier, lastComment);
                break;

            case "commment":
                lastComment = child.text;
                break;

            case "declaration":
                let templatedDeclaration = parse_declaration(child, AccessSpecifier.Public, lastComment);
                if(templatedDeclaration === null) {
                    break;
                } else {
                    templated = templatedDeclaration;
                }
                break;

            case "class_specifier":
                templated = parse_class(child, accessSpecifier);
                break;
            
        }
    });

    if(templated === undefined) {
        throw new Error("Never assigned anything to a templated variable");
    }

    templated.templateParameters = params;
    return templated;
}

export function parse(node: Parser.SyntaxNode): CppFile {
    const globalFunctions: FunctionMember[] = [];
    const classes: ClassOrStruct[] = [];
    let lastComment: string = "";

    node.children.forEach(child => {
        switch(child.type) {
            case "preproc_ifdef":
                const subFile: CppFile = parse(child);
                globalFunctions.push(...subFile.globalFunctions);
                classes.push(...subFile.classes);
                break;
            case "class_specifier":
                classes.push(parse_class(child, AccessSpecifier.Private));
                break;
            case "struct_specifier":
                classes.push(parse_class(child, AccessSpecifier.Public));
                break;
            case "function_definition":
                globalFunctions.push(parse_function_definition(child, AccessSpecifier.Public, lastComment));
                break;

            case "comment":
                lastComment = child.text;
                break;

            case "declaration":
                let funcDeclaration = parse_declaration(child, AccessSpecifier.Public, lastComment);
                if(funcDeclaration !== null && isFunctionMember(funcDeclaration)) {
                    globalFunctions.push(funcDeclaration);
                } 
                break;

            case "template_declaration":
                const templated = parse_templated(child, AccessSpecifier.Public);
                if(isFunctionMember(templated)) {
                    globalFunctions.push(templated);
                } else {
                    classes.push(templated);
                }
                break;
        }
    });

    return {
        classes: classes,
        globalFunctions: globalFunctions,
    };
}

