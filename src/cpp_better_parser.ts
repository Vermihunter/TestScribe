import Parser from 'tree-sitter';
import Cpp from 'tree-sitter-cpp';
import {AccessSpecifier, ClassOrStruct, Member, FunctionMember, Parameter, CppFile } from './cpp_objects';
import { error } from 'console';
import { access } from 'fs';
import { types } from 'util';


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

            case "sized_type_specifier":
                type += " " + parse_sized_type_specifier(child);
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

function parse_function_return_type_pointer_or_reference_declaration(node: Parser.SyntaxNode, declaratorStr: string): [string, FunctionDeclarator] {
    let pointerDeclarator: string = "";
    let functionDeclarator: FunctionDeclarator = {
        parameters: [],
        funcName: ""
    };

    node.children.forEach(child => {
        switch(child.type) {
            case declaratorStr:
                pointerDeclarator += ` ${declaratorStr}`;
                break;

            case "reference_declarator":
            case "pointer_declarator":
                const [pointerDecl, funcDeclarator] = parse_function_return_type_pointer_or_reference_declaration(child, declaratorStr);
                pointerDeclarator += pointerDecl;
                functionDeclarator = funcDeclarator;
                break;

            case "function_declarator":
                functionDeclarator = parse_function_declaration(child);
                break;

            case "type_qualifier":
                pointerDeclarator += " const";
                break;

        }
    });

    return [pointerDeclarator, functionDeclarator];
}


function parse_compound_literal_expression(node: Parser.SyntaxNode): string {
    let param: string = "";

    node.children.forEach(child=> {
        switch(child.type) {
            case "type_identifier":
                param = child.text;
                break;

            case "qualified_identifier":
                param = parse_qualified_identifier(node);
                break;
        }
    });

    return param;
}



function parse_new_expression(node: Parser.SyntaxNode): string {
    return node.children.find(child => child.type ==="type_identifier")?.text ?? "";
}

function parse_throw_statement(node: Parser.SyntaxNode) : string {
    for(const child of node.children) {
        switch(child.type) {
            // throw 3; throw 99.99;
            case "number_literal": 
                return Number.isInteger(child.text) ? "int" : "double";

            // throw false; 
            case "false":
            case "true":
                return "bool";

            // throw "Error message";
            case "string_literal":
                return "std::string";
            
            // throw 'a';
            case "char_literal":
                return "char";

            // throw nullptr;
            case "null":
                return "nullptr";

            case "new_expression":
                return parse_new_expression(child);

            case "compound_literal_expression":
                return parse_compound_literal_expression(child);
        }
    }

    return "";
}

function parse_catch_clause(node: Parser.SyntaxNode): Parameter[] {
    const parametersList = node.children.find(child => child.type === "parameter_list");
    return (parametersList !== undefined) ? parse_parameter_list(parametersList) : [];
}

function parse_try_statement(node: Parser.SyntaxNode): string[] {
    const exceptions: string[] = [];

    node.children.forEach(child => {
        switch(child.type) {
            case "catch_clause":
                const parameters: Parameter[] = parse_catch_clause(child);
                parameters
                    .map(parameter => parameter.type)
                    .forEach(param => exceptions.push(param));
                break;
        }
    });

    return exceptions;
}

function collect_exceptions_from_compound_statement(node: Parser.SyntaxNode): string[] {
    let exceptions: string[] = [];

    node.children.forEach(child => {
        switch(child.type) {
            case "throw_statement":
                exceptions.push(parse_throw_statement(child));
                break;

            case "try_statement":
                exceptions = exceptions.concat(exceptions, parse_try_statement(child));
                break;

        }
    });
    return exceptions;
}

function parse_sized_type_specifier(node: Parser.SyntaxNode): string {
    return node.children.map(child => child.text).join(' ');
    
    let typeSpecifier: string = "";

    node.children.forEach(child => {
        typeSpecifier += child.text;
    });

    return typeSpecifier;
}

function parse_function_definition(node: Parser.SyntaxNode, accessSpecifier: AccessSpecifier, functionComment: string): FunctionMember {

    let isVirtual: boolean = false;
    let isStatic: boolean = false;
    let returnType: string = "";
    let funcName: string = "";
    let parameters: Parameter[] = [];
    let exceptions: Set<string> = new Set;
    
    // TODO: Missing const, pointer, reference return type -> recursive call must be done somehow
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

            case "sized_type_specifier":
                returnType += " " + parse_sized_type_specifier(child);
                break;

            case "compound_statement":
                const compoundExceptions: string[] = collect_exceptions_from_compound_statement(child);
                compoundExceptions.forEach(exception => exceptions.add(exception));
                break;

            case "type_qualifier":
                returnType += " const";
                break;

            case "qualified_identifier":
                returnType += " " + parse_qualified_identifier(child);
                break;

            case "placeholder_type_specifier":
                returnType += " auto";
                break;

            // Pointer / refference return types
            case "reference_declarator":
            case "pointer_declarator":
                const declaratorStr: string = (child.type === "reference_declarator") ? "&" : "*";
                const [returnTypeDeclarator, funcDeclarator] = parse_function_return_type_pointer_or_reference_declaration(child, declaratorStr);
                returnType += returnTypeDeclarator;
                parameters = funcDeclarator.parameters;
                funcName = funcDeclarator.funcName;
                break;

            case "type_identifier": // alias
            case "primitive_type": // void return type
            case "type_identifier": // type return type
                returnType += ` ${child.text}`;
                break;

        }
    });

    const docExceptions = parse_throws_doc_tags(functionComment);
    docExceptions.forEach(docException => exceptions.add(docException.exception));

    return {
        isVirtual: isVirtual,
        isStatic: isStatic,
        name: funcName,
        type: returnType.trim(),
        access: accessSpecifier,
        parameters: parameters,
        throws: Array.from(exceptions),
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
                if(templated === undefined) {
                    break;
                }

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
                functions.push(parse_function_definition(child, currAccessSpecifier, lastComment));
                break;
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

/**
 * 
 * @param node 
 * @param defaultAccessSpecifier 
 * @returns null if the class is just a declaration e.g. "class Game;"
 */
function parse_class(node: Parser.SyntaxNode, defaultAccessSpecifier: AccessSpecifier): ClassOrStruct | null {
    if(!["class_specifier", "function_definition", "struct_specifier"].includes(node.type)) {
        throw new Error(`Invalid class type - ${node.type}`);
    }

    let baseClasses: string[] = [];
    let className: string = "";
    let functions: FunctionMember[] = [];
    let nestedClasses: ClassOrStruct[] = [];
    let isDeclarationOnly = true;

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
                isDeclarationOnly = false;
                break;
            
            case "qualified_identifier":
                className = parse_qualified_identifier(child);
                break;
            // here add if class name is templated for example std::vector<bool> - std::hash<BoardIndex> -> "template_type"
        }
    });

    if(isDeclarationOnly) {
        return null;
    }

    return {
        className: className,
        functions: functions,
        access: defaultAccessSpecifier,
        parentClasses: baseClasses,
        templateParameters: [], // This is fine, template parameters are added later
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

            case "identifier": // 55
                param.name = child.text;
                break;

            case "sized_type_specifier":
                param.type = parse_sized_type_specifier(child);
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
                param.type = "typename"; // typename
                break;
            
            case "type_identifier": // T
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

function parse_templated(node: Parser.SyntaxNode, accessSpecifier: AccessSpecifier): FunctionMember | ClassOrStruct | undefined {
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

            case "struct_specifier":
            case "class_specifier":
                const templatedClass = parse_class(child, accessSpecifier);
                if(templatedClass !== null) {
                    templated = templatedClass; 
                }
                break;
            
        }
    });

    if(templated === undefined) {
        return undefined;
        //throw new Error(`Never assigned anything to a templated variable -> ${node}`);

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
            case "struct_specifier":
                const access: AccessSpecifier = (child.type === "class_specifier") ? AccessSpecifier.Private : AccessSpecifier.Public;
                const newClass = parse_class(child, access);
                if(newClass !== null) {
                    classes.push(newClass);
                }
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
                if(templated === undefined) {
                    break;
                }
                
                if(isFunctionMember(templated)) {
                    globalFunctions.push(templated);
                } else {
                    classes.push(templated);
                }
                break;
        }
    });

    return { classes: classes, globalFunctions: globalFunctions};
}

