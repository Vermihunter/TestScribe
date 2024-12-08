import { IBuildSystem } from './build_system_interface';
import { TemplateHandler } from './templates';
import * as path from 'path';
import * as fs from 'fs';

const cmakeTemplateDir = path.join(__dirname, '..', 'templates', 'CMake');
const config_paths = {
    "root_cmake": path.join(cmakeTemplateDir ,"CMakeLists.txt"),
    "subdir_cmake": path.join(cmakeTemplateDir, "CMakeLists_local.txt")
};

export class CMakeBuildSystem  implements IBuildSystem {
    templateDir: string;
    templateHandler: TemplateHandler;
    
    constructor(_templateDir: string) {
        this.templateDir = _templateDir;
        this.templateHandler = new TemplateHandler;
    }

    generateRootBuilderFile(root: string, subdirs: string[]): void {
        const rootCMakeFileName: string = path.join(root, "tests", "CMakeLists.txt");
        if(fs.existsSync(rootCMakeFileName)) {
            this.addSubdirsToCMakeFile(rootCMakeFileName, subdirs, 23);
        } else {
            fs.writeFileSync(rootCMakeFileName, this.templateHandler.getTemplate(config_paths["root_cmake"], {
                Subdirectories: subdirs
            }));
        }
    }

    generateSubdirBuilderFile(subdir: string, subdirs: string[]): void {
        const subdirCMakeFileName: string = path.join(subdir, "CMakeLists.txt");
        if(fs.existsSync(subdirCMakeFileName)) {
            this.addSubdirsToCMakeFile(subdirCMakeFileName, subdirs, 5);
        } else {
            fs.writeFileSync(`${subdir}/CMakeLists.txt`, this.templateHandler.getTemplate(config_paths["subdir_cmake"], {
                Subdirectories: subdirs
            }));
        }
    }

    addSubdirsToCMakeFile(rootCMakeFileName: string, subdirs: string[], lineNumber: number){
        //const lineNumber: number = 23;
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