import { IBuildSystem } from './build_system_interface';
import { TemplateHandler } from './templates';
import { TestCreatorContext } from './test_creator_context';
import * as path from 'path';
import * as fs from 'fs';

const cmakeTemplateDir = path.join(__dirname, '..', 'templates', 'CMake');
const CMAKE_FILE_NAME = "CMakeLists.txt";
const config_paths = {
    "root_cmake": path.join(cmakeTemplateDir ,"CMakeLists.txt"),
    "subdir_cmake": path.join(cmakeTemplateDir, "CMakeLists_local.txt")
};

export class CMakeBuildSystem  implements IBuildSystem {
    templateDir: string;
    testCtx: TestCreatorContext;
    
    constructor(_templateDir: string, _testCtx: TestCreatorContext) {
        this.templateDir = _templateDir;
        this.testCtx = _testCtx;
    }

    generateRootBuilderFile(root: string, subdirs: string[]): void {
        this.generateBuilderFile(path.join(root, this.testCtx.relativeTestDirName, CMAKE_FILE_NAME), config_paths["root_cmake"], subdirs, 23);
    }

    generateSubdirBuilderFile(subdir: string, subdirs: string[]): void {
        this.generateBuilderFile(path.join(subdir, CMAKE_FILE_NAME), config_paths["subdir_cmake"], subdirs, 5);
    }

    generateBuilderFile(cmakeFilePath:string, template: string, subdirs: string[], lineNumber: number) {
        if(fs.existsSync(cmakeFilePath)) {
            this.addSubdirsToCMakeFile(cmakeFilePath, subdirs, lineNumber);
        } else {
            fs.writeFileSync(cmakeFilePath, TemplateHandler.getTemplate(template, {
                Subdirectories: subdirs
            }));
        }
    }

    addSubdirsToCMakeFile(rootCMakeFileName: string, subdirs: string[], lineNumber: number){
        try {
            // Read the file content and split it into lines
            const fileContent = fs.readFileSync(rootCMakeFileName, 'utf-8');
            const lines = fileContent.split('\n');
    
            // Check if the line number is valid
            if (lineNumber < 1 || lineNumber > lines.length) {
                throw new Error('Line number out of range.');
            }
    
            // Update the specific line (lineNumber is 1-based)
            //lines[lineNumber - 1] = newContent;
            subdirs.forEach((subdir, ind) => {
                lines.splice(lineNumber + ind, 0, `add_subdirectory(${subdir})`);
            });
    
            // Write the updated content back to the file
            fs.writeFileSync(rootCMakeFileName, lines.join('\n'), 'utf-8');
    
            console.log(`Updated line ${lineNumber} in the file successfully.`);
        } catch (error) {
            //console.error(`Error writing to file: ${error.message}`);
        }
    }
}