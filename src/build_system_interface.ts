
export interface IBuildSystem {
    templateDir: string;

    generateRootBuilderFile(root: string, subdirs: string[]): void;
    generateSubdirBuilderFile(subdir: string, subdirs: string[]): void;
}
