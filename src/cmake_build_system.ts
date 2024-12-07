import { IBuildSystem } from './build_system_interface';
import { TemplateHandler } from './templates';
import { write, writeFileSync } from 'fs';
import * as path from 'path';

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
        writeFileSync(path.join(root, "tests", "CMakeLists.txt"), this.templateHandler.getTemplate(config_paths["root_cmake"], {
            Subdirectories: subdirs
        }));
    }

    generateSubdirBuilderFile(subdir: string, subdirs: string[]): void {
        writeFileSync(`${subdir}/CMakeLists.txt`, this.templateHandler.getTemplate(config_paths["subdir_cmake"], {
            Subdirectories: subdirs
        }));
    }
}