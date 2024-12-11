// An interface representing C++ constructs that are used during test generation

// Define the AccessSpecifier enum
export enum AccessSpecifier {
    Public = 'public',
    Protected = 'protected',
    Private = 'private',
}

export interface Parameter {
    name: string;
    type: string;
}

// Define the structure of a variable and class result
export interface Member {
    name: string;
    type: string;
    isStatic: boolean;
    isVirtual: boolean;
    access: AccessSpecifier; 
}

export interface FunctionMember extends Member {
    parameters: Parameter[];
    throws: string[];
    templateParameters: Parameter[];
}


export interface ClassOrStruct {
    className: string;
    variables: Member[];
    functions: FunctionMember[];
    access: AccessSpecifier;
    parentClasses: string[];
    templateParameters: Parameter[];
    nestedClasses: ClassOrStruct[];
}

export interface CppFile {
    classes: ClassOrStruct[];
    globalFunctions: FunctionMember[];
}

