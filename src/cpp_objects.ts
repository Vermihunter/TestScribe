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
    access: AccessSpecifier; // public, private, or protected
}

export interface FunctionMember extends Member {
    parameters: Parameter[];
}


export interface ClassOrStruct {
    className: string;
    variables: Member[];
    functions: FunctionMember[];
    access: AccessSpecifier;
    nestedClasses: ClassOrStruct[];
}

