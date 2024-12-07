import { TestCreatorContext } from "./test_creator_context";
import { IBuildSystem } from "./build_system_interface";

export interface ITestCreator {
    ctx: TestCreatorContext;
    buildSystem: IBuildSystem;

    generateTests(): void;
}