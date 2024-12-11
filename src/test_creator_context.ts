import { AccessSpecifier } from "./cpp_objects";

export interface TestCreatorContext {
    // The current directory i.e. the one that is opened by the user (root of the project)
    rootDir: string;
    testFiles: string[];

    // An array of visibility modifiers that define which class functions are tests generated for
    generatedForMethodVisibilities: AccessSpecifier[];
    relativeTestDirName: string;
}