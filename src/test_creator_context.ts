import { AccessSpecifier } from "./cpp_objects";

export interface TestCreatorContext {
    // The current directory i.e. the one that is opened by the user (root of the project)
    rootDir: string;
    // Represents the relative path from the root to the source files for which the test are generated for
   // relativeSrcDir: string;
    //
    testFiles: string[];
    //

    generatedForMethodVisibilities: AccessSpecifier[];
    relativeTestDirName: string;
}